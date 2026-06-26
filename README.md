# Docker-Dev-Setup

Kumpulan service Docker modular untuk development server / VPS.

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

## Quick Start

Setiap service independen — jalankan dari direktori masing-masing:

```bash
cd <service-dir>
cp .env.example .env   # jika ada
docker compose up -d
```

## Deploy

Push ke `main` -> GitHub Actions deploy otomatis ke VPS via SSH.
