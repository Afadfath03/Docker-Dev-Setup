# Docker-Dev-Setup

Modular Docker services for development server / VPS.

## Prerequisites

- **Docker** ≥ 24.0
- **Docker Compose** ≥ 2.20 (or Docker built-in plugin)
- **Git** (for clone & deploy)

## Services

| Service | Port | Function |
|---|---|---|
| [9router](./9router) | `20128` | AI routing gateway & token saver |
| [blocky_dns](./blocky_dns) | `53`, `4000` | DNS ad/tracker blocker |
| [database](./database) | `3306`, `5432`, `8978` | MySQL, PostgreSQL, CloudBeaver |
| [it-tools](./it-tools) | `8082` | IT utilities (web) |
| [model-context-protocol-server](./model-context-protocol-server) | `6280` | Grounded Docs MCP Server — documentation index for AI |
| [monitoring](./monitoring) | `9090`, `3001`, `9100`, `8081` | Prometheus + Grafana + cAdvisor |
| [nginx-proxy-manager](./nginx-proxy-manager) | `80`, `81`, `443` | Reverse proxy with web UI |
| [portainer](./portainer) | `9443`, `8000` | Container management UI |
| [searxng](./searxng) | `8443` | Private meta-search engine |
| [sftpgo](./sftpgo) | `2022`, `8083` | SFTP server + Web UI |
| [supabase](./supabase) | `8002`, `8444`, `5433`, `6543` | BaaS — full or minimal stack |

## Access

| Service | URL | Port | Login |
|---|---|---|---|
| Nginx Proxy Manager | `http://<ip>:81` | `81` | Admin UI, default `admin@example.com` / `changeme` |
| Portainer | `https://<ip>:9443` | `9443` | Container management |
| 9Router | `http://<ip>:20128` | `20128` | Dashboard, login with `INITIAL_PASSWORD` |
| Grafana | `http://<ip>:3001` | `3001` | Login via `GF_SECURITY_ADMIN_USER` in `.env` |
| Prometheus | `http://<ip>:9090` | `9090` | Metrics (no auth) |
| MySQL | `<ip>:3306` | `3306` | user `root`, password `admin123` |
| PostgreSQL | `localhost:5432` | `5432` | user `postgres`, password `admin123` |
| CloudBeaver | `http://<ip>:8978` | `8978` | DB admin UI |
| SearXNG | `http://<ip>:8443` | `8443` | Private search |
| Blocky | `http://<ip>:4000` | `4000` | DNS API / metrics |
| IT-Tools | `http://<ip>:8082` | `8082` | Utility tools |
| Docs MCP Server | `http://<ip>:6280` | `6280` | Documentation index & MCP endpoint |
| cAdvisor | `http://<ip>:8081` | `8081` | Container metrics |
| SFTPGo | `sftp://<ip>:2022`, `http://<ip>:8083` | `2022`, `8083` | SFTP server; Web Admin UI via `http://<ip>:8083/web/admin` or NPM |
| Supabase Studio | `http://<ip>:8002` | `8002` | Dashboard (login via `DASHBOARD_USERNAME`/`DASHBOARD_PASSWORD`) |
| Supabase (Kong) | `http://<ip>:8002` | `8002` | API gateway — REST, Auth, Storage, GraphQL |
| Supabase Postgres | `<ip>:5433` | `5433` | Postgres via Supavisor (session mode) |
| Supabase Postgres (tx) | `<ip>:6543` | `6543` | Postgres via Supavisor (transaction mode) |

## Architecture

```
┌─────────────┐  ┌──────────────┐
│   Internet  │──▶ Nginx Proxy  │──▶ 9router, Portainer,
│   (80/443)  │  │  Manager     │    Grafana, SearXNG, etc
└─────────────┘  └──────┬───────┘
                        │ (internal)
                 ┌──────┴───────┐
                 │   Docker     │
                 │  Bridge/LAN  │
                 └──────────────┘
```

All services are routed through NPM as a reverse proxy. Monitoring stack uses the `monitoring` network. Databases are host-only (PostgreSQL localhost-only).

## Quick Start

Each service is independent — run from its directory:

```bash
cd <service-dir>
cp .env.example .env   # if present
docker compose up -d
```

### Update Service

```bash
cd <service-dir>
docker compose pull && docker compose up -d
```

## Security

- **Firewall**: use `ufw` or `iptables`, only open ports 80, 443, and 22 (SSH)
- **Reverse Proxy**: use NPM to terminate HTTPS via Let's Encrypt, access services via domain, not IP:port
- **Database**: PostgreSQL binds `127.0.0.1` only; change MySQL default password `admin123` for production
- **Blocky**: port 53 must be open in the firewall for DNS to work
- **Secrets**: never commit `.env` — already in `.gitignore`

## Deploy

Push to `main` → GitHub Actions auto-deploys to VPS via SSH.
