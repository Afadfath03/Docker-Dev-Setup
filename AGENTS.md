# AGENTS.md — Docker-Dev-Setup

Update this file when you change conventions, add/remove services, or modify
shared structures (networks, naming).

## Structure

Modular Docker services for a VPS dev server. Each service is a root-level
directory with its own `docker-compose.yml`. Run independently:

```
cd <service> && [ -f .env.example ] && cp -n .env.example .env && docker compose up -d
```

## Key facts an agent would likely miss

- **`database/` has no db compose files.** It contains SQL scripts in
  `SQL/mysql/` and `SQL/postgresql/`, and a CloudBeaver UI compose in
  `management/`. MySQL and PostgreSQL run natively on the host (or in separate
  repos). Don't look for their compose files here.
- **Supabase has two variants:** `supabase/full/` and `supabase/minimal/`.
  Pick the right one. Both share the same `.env.example` pattern.
- **`npm_network`** is external; created once (`docker network create npm_network`).
  Every compose that needs it declares `networks.npm_network.external: true`.
- **`monitoring` network** is a dedicated bridge for the stack. Only Grafana
  also attaches to `npm_network` (for reverse proxy access).
- **9Router mounts host home dirs:** `${HOME}:/home/user` — usage/log data
  lives on the host, not in named volumes. Back up `~/.9router` and
  `~/.9router-usage`.
- **CI deploy** (`.github/workflows/deploy.yml`) is just `git pull` via SSH.
  No compose commands, no rebuild. Run those manually.
- **Some services skip common patterns:** `it-tools`, `portainer`, and
  `blocky_dns` have no `security_opt`/`cap_drop`. Logging `max-size` varies
  (nginx-proxy-manager uses `50m`). Each service is self-contained; the
  templates below are conventions, not rules.

## Conventions (use as default; deviate when the service demands it)

| Item | Convention | Example |
|---|---|---|
| Container name | `kebab-case` | `nginx-proxy-manager`, `supabase-db` |
| Volume name | `snake_case` | `portainer-data`, `grafana_data` |
| Network name | `snake_case` | `npm_network`, `monitoring` |
| Service name | `kebab-case` | `it-tools`, `node_exporter` |

Security (when applicable):
```yaml
security_opt: [no-new-privileges:true]
cap_drop: [ALL]
cap_add: [NET_BIND_SERVICE]   # minimum; add others per image requirements
```

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
      memory: 256M   # per-service; 9router=512M, nginx-proxy-manager=1G
```

Healthcheck:
- TCP: `["CMD-SHELL", "nc -z localhost <port> || exit 1"]`
- HTTP: `["CMD", "wget", "--no-verbose", "--tries=1", "--spider", "http://127.0.0.1:<port>/<path>"]`

## Adding a new service

1. Create `service-name/` with `docker-compose.yml`
2. Add `.env.example` if secrets are needed
3. If behind NPM → add `networks: [npm_network]` and the top-level external
   network stanza
4. Update root `README.md` services table

## Port reference (external-facing)

| Port | Service | Component |
|---|---|---|
| 53 | blocky_dns | DNS (UDP/TCP) |
| 80, 443 | nginx-proxy-manager | HTTP/HTTPS proxy |
| 81 | nginx-proxy-manager | Admin UI |
| 2022 | sftpgo | SFTP |
| 3001 | Grafana | Dashboard |
| 3306 | MySQL | Database (host-native) |
| 4000 | Blocky | HTTP API |
| 5432 | PostgreSQL | Database (host-native, localhost) |
| 5433 | supabase | Postgres (via Supavisor) |
| 6280 | arabold Docs MCP Server | Documentation index & MCP SSE |
| 6543 | supabase | Postgres transaction mode |
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

## Deploy

Push to `main` → GitHub Actions SSH-es into VPS and `git pull`s. No
automatic compose operations.
