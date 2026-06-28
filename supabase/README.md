# Supabase

Two variants available:

- **[full](./full)** — Complete stack: DB, Auth, REST, Realtime, Storage + imgproxy,
  Edge Functions, Studio, Kong API gateway, Supavisor pooler
- **[minimal](./minimal)** — Core only: DB, Auth, REST, Studio, Kong, Supavisor,
  postgres-meta (no Realtime, Storage, Functions)

## Ports

| Port | Service |
|---|---|
| `8002` | Kong HTTP (Studio / API) |
| `8444` | Kong HTTPS |
| `5433` | Postgres (via Supavisor, session mode) |
| `6543` | Supavisor (transaction mode) |

> These differ from Supabase defaults to avoid conflicts with existing services.

## Quick Start

```bash
cd supabase/<variant>
cp .env.example .env
# Edit .env — change all secrets
docker compose up -d
```

## Access

Studio: `http://<host>:8002`  
Login: `DASHBOARD_USERNAME` / `DASHBOARD_PASSWORD` from `.env`
