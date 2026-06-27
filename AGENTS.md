# AGENTS.md — Docker-Dev-Setup

> **Update this file whenever you change project conventions, add/remove
> services, or modify shared structures (networks, security, naming).**

## Overview

Modular Docker services for a VPS development server. Each service is
self-contained in its own directory with an independent `docker-compose.yml`.

## Directory Structure

```
<service>/
├── docker-compose.yml       # required
├── .env                     # secrets, gitignored
├── .env.example             # env template (safe to commit)
├── README.md                # documentation
├── config/                  # config files if needed
└── data/                    # runtime data (gitignored)
```

## Conventions

### Naming

| Item | Convention | Example |
|---|---|---|
| Container | `kebab-case` | `nginx-proxy-manager`, `postgres-db` |
| Volume | `snake_case` | `portainer-data`, `prometheus_data` |
| Network | `snake_case` | `npm_network`, `monitoring` |
| Service | `kebab-case` | `it-tools`, `node_exporter` |

### Networking

- **`npm_network`** — shared external network for all services behind Nginx
  Proxy Manager. Created manually: `docker network create npm_network`.
  Defined as `external: true` in every compose file that uses it.
- Services that don't need reverse proxy (e.g., databases) stay on their own
  default compose network or `localhost` only.

### Security Patterns

```yaml
security_opt:
  - no-new-privileges:true
cap_drop:
  - ALL
cap_add:
  - NET_BIND_SERVICE     # minimum required caps
```

- `.env` files are gitignored (root `.gitignore` covers all subdirectories)
- PostgreSQL binds to `127.0.0.1` only
- Resource limits via `deploy.resources.limits.memory`

### Logging

```yaml
logging:
  driver: json-file
  options:
    max-size: 10m
    max-file: 3
```

### Healthcheck

For TCP services:
```yaml
healthcheck:
  test: ["CMD-SHELL", "nc -z localhost <port> || exit 1"]
  interval: 30s
  timeout: 10s
  retries: 3
```

For HTTP services:
```yaml
healthcheck:
  test: wget --no-verbose --tries=1 --spider http://127.0.0.1:<port>/<path> || exit 1
  interval: 30s
  timeout: 10s
  retries: 3
```

## Adding a New Service

1. Create `nama-service/` directory
2. Add `docker-compose.yml` following the conventions above
3. Add `.env.example` if secrets are needed
4. Add `README.md` with usage instructions
5. If the service needs reverse proxy → add `networks: - npm_network`
   and top-level `networks.npm_network.external: true`
6. Update root `README.md` services/access table

## Deploy

Push to `main` → GitHub Actions auto-deploys to VPS via SSH.

## Port Reference

| Port | Service | Component |
|---|---|---|
| 53 | blocky_dns | DNS (UDP/TCP) |
| 80, 443 | nginx-proxy-manager | HTTP/HTTPS proxy |
| 81 | nginx-proxy-manager | Admin UI |
| 3306 | MySQL | Database |
| 5432 | PostgreSQL | Database (localhost) |
| 2022 | sftpgo | SFTP |
| 4000 | Blocky | HTTP API |
| 8080 | sftpgo | Web Admin UI (internal) |
| 8000 | Portainer | Tunnel |
| 8081 | cAdvisor | Container metrics |
| 8082 | IT-Tools | Web UI |
| 8443 | SearXNG | Search engine |
| 8978 | CloudBeaver | DB admin UI |
| 9090 | Prometheus | Metrics |
| 9443 | Portainer | HTTPS UI |
| 3001 | Grafana | Dashboard |
| 20128 | 9Router | AI routing |
