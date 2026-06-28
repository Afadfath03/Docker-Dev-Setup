# Supabase — Full Stack

All services: `db`, `supavisor`, `kong`, `studio`, `auth`, `rest`, `realtime`,
`storage`, `imgproxy`, `meta`, `functions`.

## Requirements

- RAM: 4GB+ (8GB recommended)
- Disk: 20GB+

## Setup

```bash
cp .env.example .env
# Edit .env — change all secrets (POSTGRES_PASSWORD, JWT_SECRET, etc.)
docker compose up -d
```

## Services

| Service | Internal Port | Notes |
|---|---|---|
| Studio | 8002 (host) → 3000 | Dashboard |
| Kong | 8002/8444 (host) → 8000/8443 | API gateway |
| Auth | — | GoTrue |
| REST | — | PostgREST |
| Realtime | — | WebSocket engine |
| Storage | — | File API |
| imgproxy | — | Image processing |
| postgres-meta | — | DB schema API |
| Edge Functions | — | Deno runtime |
| Postgres | 5433 (host) → 5432 | Database |
| Supavisor | 5433/6543 (host) | Connection pooler |

## Generating Keys

For production, generate secure keys from the official Supabase repo:

```bash
git clone --depth 1 https://github.com/supabase/supabase /tmp/supabase
cd /tmp/supabase/docker
sh utils/generate-keys.sh
sh utils/add-new-auth-keys.sh
# Copy generated values to .env
```

## Updating

```bash
docker compose pull && docker compose up -d
```
