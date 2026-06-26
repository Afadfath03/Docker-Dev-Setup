# Docker-Dev-Setup

Kumpulan service Docker modular untuk development server / VPS.

## Prerequisites

- **Docker** ≥ 24.0
- **Docker Compose** ≥ 2.20 (atau plugin bawaan Docker)
- **Git** (untuk clone & deploy)

## Services

| Service | Port | Fungsi |
|---|---|---|
| [9router](./9router) | `20128` | AI routing gateway & token saver |
| [blocky_dns](./blocky_dns) | `53`, `4000` | DNS ad/tracker blocker |
| [database](./database) | `3306`, `5432`, `8978` | MySQL, PostgreSQL, CloudBeaver |
| [it-tools](./it-tools) | `8082` | Koleksi utility IT (web) |
| [monitoring](./monitoring) | `9090`, `3001`, `9100`, `8081` | Prometheus + Grafana + cAdvisor |
| [nginx-proxy-manager](./nginx-proxy-manager) | `80`, `81`, `443` | Reverse proxy dgn web UI |
| [portainer](./portainer) | `9443`, `8000` | Container management UI |
| [searxng](./searxng) | `8443` | Private meta-search engine |

## Cara Akses

| Service | URL | Port | Akses |
|---|---|---|---|
| Nginx Proxy Manager | `http://<ip>:81` | `81` | Admin UI, login default `admin@example.com` / `changeme` |
| Portainer | `https://<ip>:9443` | `9443` | Container management |
| 9Router | `http://<ip>:20128` | `20128` | Dashboard, login pakai `INITIAL_PASSWORD` |
| Grafana | `http://<ip>:3001` | `3001` | Login `afadfath` |
| Prometheus | `http://<ip>:9090` | `9090` | Metrics (no auth) |
| MySQL | `<ip>:3306` | `3306` | user `root`, password `admin123` |
| PostgreSQL | `localhost:5432` | `5432` | user `postgres`, password `admin123` |
| CloudBeaver | `http://<ip>:8978` | `8978` | DB admin UI |
| SearXNG | `http://<ip>:8443` | `8443` | Private search |
| Blocky | `http://<ip>:4000` | `4000` | DNS API / metrics |
| IT-Tools | `http://<ip>:8082` | `8082` | Utility tools |
| cAdvisor | `http://<ip>:8081` | `8081` | Container metrics |

## Arsitektur

```
┌─────────────┐  ┌──────────────┐
│   Internet  │──▶ Nginx Proxy  │──▶ 9router, Portainer,
│   (80/443)  │  │  Manager     │    Grafana, SearXNG, dll
└─────────────┘  └──────┬───────┘
                        │ (internal)
                 ┌──────┴───────┐
                 │   Docker     │
                 │  Bridge/LAN  │
                 └──────────────┘
```

Semua service di-route melalui NPM sebagai reverse proxy. Monitoring stack terhubung via network `monitoring`. Database hanya bisa diakses dari host (PostgreSQL localhost-only).

## Quick Start

Setiap service independen — jalankan dari direktori masing-masing:

```bash
cd <service-dir>
cp .env.example .env   # jika ada
docker compose up -d
```

### Update Service

```bash
cd <service-dir>
docker compose pull && docker compose up -d
```

## Security

- **Firewall**: gunakan `ufw` atau `iptables`, buka hanya port 80, 443, dan 22 (SSH)
- **Reverse Proxy**: gunakan NPM untuk terminate HTTPS via Let's Encrypt, akses service cukup lewat domain, bukan IP:port
- **Database**: PostgreSQL binding `127.0.0.1` saja; MySQL ganti password default `admin123` jika untuk production
- **Blocky**: port 53 harus buka di firewall agar DNS berfungsi
- **Secret**: jangan commit `.env` — sudah ada di `.gitignore`

## Deploy

Push ke `main` -> GitHub Actions deploy otomatis ke VPS via SSH.
