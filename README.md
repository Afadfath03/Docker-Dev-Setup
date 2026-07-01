# Docker-Dev-Setup

Modular Docker services for development server / VPS.

## Prerequisites

- **Docker** ≥ 24.0
- **Docker Compose** ≥ 2.20 (or Docker built-in plugin)
- **Git** (for clone & deploy)

## Services

| Service | Port | Function |
|---|---|---|
| [9router](./ai-automation/9router) | `20128` | AI routing gateway & token saver |
| [blocky_dns](./networking/blocky_dns) | `53`, `4000` | DNS ad/tracker blocker |
| [database](./database) | `3306`, `5432`, `8086`, `8087`, `8978` | MySQL, PostgreSQL, Adminer, phpMyAdmin, CloudBeaver |
| [dozzle](./monitoring/dozzle) | `8888` | Real-time Docker log viewer |
| [excalidash](./misc/excalidash) | `6767` | Whiteboard dengan kolaborasi & penyimpanan |
| [homepage](./misc/homepage) | `3000` | Dashboard landing page untuk semua service |
| [it-tools](./misc/it-tools) | `8082` | IT utilities (web) |
| [model-context-protocol-server](./ai-automation/model-context-protocol-server) | `6280` | Grounded Docs MCP Server — documentation index for AI |
| [monitoring](./monitoring) | `9090`, `3001`, `9100`, `8081` | Prometheus + Grafana + cAdvisor |
| [n8n](./ai-automation/n8n) | `5678` | Workflow automation (no-code) |
| [nginx-proxy-manager](./networking/nginx-proxy-manager) | `80`, `81`, `443` | Reverse proxy with web UI |
| [portainer](./management/portainer) | `9443`, `8000` | Container management UI |
| [searxng](./misc/searxng) | `8443` | Private meta-search engine |
| [sftpgo](./management/sftpgo) | `2022`, `8083` | SFTP server + Web UI |
| [stirling-pdf](./misc/stirling-pdf) | `8085` | PDF manipulation tools (merge, split, OCR, dll) |
| [supabase](./database/supabase) | `8002`, `8444`, `5433`, `6543` | BaaS — full or minimal stack |
| [vaultwarden](./security/vaultwarden) | `8084` | Password manager (Bitwarden-compatible) |

## Access

| Service | URL | Port | Login |
|---|---|---|---|
| Nginx Proxy Manager | `http://<ip>:81` | `81` | Admin UI, default `admin@example.com` / `changeme` |
| Portainer | `https://<ip>:9443` | `9443` | Container management |
| 9Router | `http://<ip>:20128` | `20128` | Dashboard, login with `INITIAL_PASSWORD` |
| Grafana | `http://<ip>:3001` | `3001` | Login via `GF_SECURITY_ADMIN_USER` in `.env` |
| Prometheus | `http://<ip>:9090` | `9090` | Metrics (no auth) |
| ExcaliDash | `http://<ip>:6767` | `6767` | Dashboard, register via `/api/auth/register` |
| MySQL | `<ip>:3306` | `3306` | user `root`, password `admin123` |
| PostgreSQL | `localhost:5432` | `5432` | user `postgres`, password `admin123` |
| Adminer | `http://<ip>:8086` | `8086` | DB admin UI (multi-engine) |
| phpMyAdmin | `http://<ip>:8087` | `8087` | MySQL admin UI |
| CloudBeaver | `http://<ip>:8978` | `8978` | DB admin UI |
| SearXNG | `http://<ip>:8443` | `8443` | Private search |
| Blocky | `http://<ip>:4000` | `4000` | DNS API / metrics |
| Dozzle | `http://<ip>:8888` | `8888` | Docker log viewer (no auth) |
| Homepage | `http://<ip>:3000` | `3000` | Dashboard landing page (configure via `config/`) |
| IT-Tools | `http://<ip>:8082` | `8082` | Utility tools |
| n8n | `http://<ip>:5678` | `5678` | Workflow automation; login after setup |
| Stirling PDF | `http://<ip>:8085` | `8085` | PDF tools (no auth) |
| Docs MCP Server | `http://<ip>:6280` | `6280` | Documentation index & MCP endpoint |
| cAdvisor | `http://<ip>:8081` | `8081` | Container metrics |
| Vaultwarden | `http://<ip>:8084` | `8084` | Password manager; register/login via web |
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
