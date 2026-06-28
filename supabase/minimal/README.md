# Supabase — Minimal Stack

Core services: `db`, `supavisor`, `kong`, `studio`, `auth`, `rest`, `meta`.

Excluded: Realtime, Storage, imgproxy, Edge Functions (~2GB RAM saved).

## Requirements

- RAM: 2GB+ (4GB recommended)
- Disk: 10GB+

## Setup

```bash
cp .env.example .env
# Edit .env — change all secrets
docker compose up -d
```

## Services

| Service | Internal Port | Notes |
|---|---|---|
| Studio | 8002 (host) → 3000 | Dashboard |
| Kong | 8002/8444 (host) → 8000/8443 | API gateway |
| Auth | — | GoTrue |
| REST | — | PostgREST |
| postgres-meta | — | DB schema API |
| Postgres | 5433 (host) → 5432 | Database |
| Supavisor | 5433/6543 (host) | Connection pooler |

## Generating Keys

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
