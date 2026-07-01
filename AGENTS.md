# AGENTS.md — Docker-Dev-Setup

Update this file when you change conventions, add/remove services, or modify shared structures (networks, naming).

## Structure

Modular Docker services for a VPS dev server. Each service is a root-level directory (or nested) with its own `docker-compose.yml`. Run independently:

```
cd <service-dir>
[ -f .env.example ] && cp -n .env.example .env
docker compose up -d
```

Services with `.env.example`: `9router`, `monitoring`, `searxng`, `supabase/*/`, `model-context-protocol-server/arabold_Docs-MCP-Server/`.

**Nested compose dirs** (not root-level):
- `database/SQL/mysql/`, `database/SQL/postgresql/`, `database/management/` (CloudBeaver)
- `supabase/full/`, `supabase/minimal/`
- `model-context-protocol-server/arabold_Docs-MCP-Server/`

## Key facts an agent would likely miss

- **`database/` structure:** `SQL/mysql/` and `SQL/postgresql/` DO have compose files (MySQL binds `0.0.0.0:3306`, Postgres binds `127.0.0.1:5432` only). `management/` has CloudBeaver. These are Docker containers, not host-native.
- **Supabase has two variants:** `supabase/full/` (DB + Auth + REST + Realtime + Storage + Edge Functions + Studio + Kong + Supavisor) and `supabase/minimal/` (same minus Realtime, Storage, Edge Functions). Pick the right one. Both need `.env` from `.env.example`.
- **`npm_network`** is external; created once (`docker network create npm_network`). Every compose that needs it declares `networks.npm_network.external: true`.
- **`monitoring` network** is a dedicated bridge. Only Grafana also attaches to `npm_network` (for reverse proxy access).
- **9Router mounts host home dirs:** `${HOME}:/home/user` — usage/log data lives on the host, not in named volumes. Back up `~/.9router` and `~/.9router-usage`.
- **CI deploy** (`.github/workflows/deploy.yml`) is just `git pull` via SSH on the VPS. No compose commands, no rebuild. Run those manually.
- **Compose v2** — no compose file uses the legacy `version:` header (not needed).
- **Portainer mounts `/var/run/docker.sock`** (needs Docker API access to manage containers).
- **blocky_dns** is the only service needing `cap_add: [NET_ADMIN]` (raw socket for DNS on port 53).
- **SearXNG** has two containers (`redis` + `searxng`) in one compose — the only multi-service compose outside monitoring/supabase.
- **ExcaliDash** has two containers (`backend` + `frontend`) in one compose. Uses a dedicated bridge network (`excalidash-network`) for backend↔frontend communication. Frontend also joins `npm_network` for reverse proxy access. Backend uses SQLite via named volume `excalidash_data`.
- **Healthcheck gaps:** portainer, database/management (cloudbeaver) have NO healthcheck.
- **Logging `max-size`:** nginx-proxy-manager is the only exception at `50m`; all others use `10m`.

## Conventions (use as default; deviate when the service demands it)

| Item | Convention | Example |
|---|---|---|
| Container name | `kebab-case` | `nginx-proxy-manager`, `supabase-db` |
| Volume name | `snake_case` | `portainer_data`, `grafana_data` |
| Network name | `snake_case` | `npm_network`, `monitoring` |
| Service name | `kebab-case` | `it-tools`, `node-exporter` |

Security (when applicable):
```yaml
security_opt: [no-new-privileges:true]
cap_drop: [ALL]
cap_add: [NET_BIND_SERVICE]   # minimum; add others per image requirements
```

`cap_add` varies per service. Common additions beyond `NET_BIND_SERVICE`: `CHOWN`, `FOWNER`, `DAC_OVERRIDE`, `SETUID`, `SETGID` (nginx-proxy-manager, sftpgo).

Logging (default):
```yaml
logging:
  driver: json-file
  options:
    max-size: 10m
    max-file: 3
```

Resource limits:
```yaml
deploy:
  resources:
    limits:
      memory: 256M   # per-service; 9router=512M, nginx-proxy-manager=1G, supabase-db=1G
```

Healthcheck:
- TCP: `["CMD-SHELL", "nc -z localhost <port> || exit 1"]`
- HTTP: `["CMD", "wget", "--no-verbose", "--tries=1", "--spider", "http://127.0.0.1:<port>/<path>"]`
- DB: `pg_isready` / `mysqladmin ping` for database services

## Adding a new service

1. Create `service-name/` with `docker-compose.yml`
2. Add `.env.example` if secrets are needed — see `9router/.env.example` for a well-commented example
3. If behind NPM → add `networks: [npm_network]` and the top-level external network stanza
4. Follow the convention templates above for security, logging, resource limits, healthcheck
5. Update root `README.md` services table

## Port reference (external-facing)

| Port | Service | Component |
|---|---|---|
| 53 | blocky_dns | DNS (UDP/TCP) |
| 80, 443 | nginx-proxy-manager | HTTP/HTTPS proxy |
| 81 | nginx-proxy-manager | Admin UI |
| 2022 | sftpgo | SFTP |
| 3001 | Grafana | Dashboard |
| 3306 | MySQL | Database (Docker, port exposed) |
| 4000 | Blocky | HTTP API |
| 5432 | PostgreSQL | Database (Docker, localhost-only) |
| 5433 | supabase | Postgres (via Supavisor, session mode) |
| 6280 | arabold_Docs-MCP-Server | Documentation index & MCP SSE |
| 6543 | supabase | Postgres (via Supavisor, transaction mode) |
| 6767 | excalidash | Whiteboard UI |
| 8000 | Portainer | Tunnel |
| 8002 | supabase | Kong HTTP (Studio/API) |
| 8081 | cAdvisor | Container metrics |
| 8082 | IT-Tools | Web UI |
| 8083 | sftpgo | Web Admin UI |
| 8443 | SearXNG | Search engine |
| 8444 | supabase | Kong HTTPS |
| 8978 | CloudBeaver | DB admin UI |
| 9090 | Prometheus | Metrics |
| 9100 | node_exporter | Host metrics |
| 9443 | Portainer | HTTPS UI |
| 20128 | 9Router | AI routing |

## Per-service READMEs

All service directories contain a `README.md` with setup steps, access URLs, and defaults. Check them before editing a service's compose file.

## Deploy

Push to `main` → GitHub Actions SSH-es into VPS and `git pull`s. No automatic compose operations. Run `docker compose pull && docker compose up -d` manually on the VPS to update a running service.
