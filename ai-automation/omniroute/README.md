# OmniRoute — Docker Setup

OmniRoute is an open-source AI routing gateway and token saver — a fork of [9Router](https://github.com/decolua/9router) with 250+ providers, 18 routing strategies, RTK + Caveman compression (15–95% savings), circuit breakers, semantic cache, and MCP/A2A support.

**⚠️ Coexists with 9router.** Both services share the same default internal port (20128), but this setup maps OmniRoute to port **20130** to avoid conflict.

---

## Table of Contents

- [Prerequisites](#prerequisites)
- [Installation](#installation)
- [Configuration](#configuration)
- [Dashboard Access](#dashboard-access)
- [Data Persistence](#data-persistence)
- [Reverse Proxy (NPM)](#reverse-proxy-npm)
- [Update](#update)
- [Teardown](#teardown)
- [Troubleshooting](#troubleshooting)

---

## Prerequisites

- **Docker** and **Docker Compose** installed (Compose v2 minimum)
- Port `20130` not in use
- (Recommended) Nginx Proxy Manager running for HTTPS

---

## Installation

```bash
# 1. Go to omniroute directory
cd docker-dev-setup/ai-automation/omniroute

# 2. Setup environment variables
cp .env.example .env
nano .env   # fill in JWT_SECRET, API_KEY_SECRET, INITIAL_PASSWORD, OMNIROUTE_WS_BRIDGE_SECRET

# 3. (Optional) Generate strong secrets
echo "JWT_SECRET=$(openssl rand -base64 48)"
echo "API_KEY_SECRET=$(openssl rand -hex 32)"
echo "INITIAL_PASSWORD=$(openssl rand -base64 16)"
echo "OMNIROUTE_WS_BRIDGE_SECRET=$(openssl rand -base64 32)"

# 4. Start container(s)
docker compose up -d
```

### `.env` Setup

Copy `.env.example` to `.env`, then fill in required values:

| Variable | Required | Consequence if empty/placeholder | Description |
|----------|----------|----------------------------------|-------------|
| `JWT_SECRET` | ✅ | Session tidak valid, login gagal | Secret untuk JWT session cookie. Generate: `openssl rand -base64 48` |
| `API_KEY_SECRET` | ✅ | API key tidak bisa dienkripsi | AES key untuk encrypt API key di SQLite. Generate: `openssl rand -hex 32` |
| `INITIAL_PASSWORD` | ✅ | Default `CHANGEME` sangat insecure | Password admin awal. Ganti via Dashboard → Settings → Security |
| `OMNIROUTE_WS_BRIDGE_SECRET` | ✅ (production) | Semua WS bridge request ditolak | Shared secret untuk Codex Responses WebSocket bridge. Generate: `openssl rand -base64 32` |

Other variables have default values and are optional (see [Configuration](#configuration)).

---

## Configuration

### Environment Variables

| Variable | Default | Required | Description |
|----------|---------|----------|-------------|
| `PORT` | `20130` | ✅ | Service port (20128 dipakai 9router) |
| `NODE_ENV` | `production` | | Set `development` untuk verbose logging |
| `REDIS_URL` | `redis://redis:6379` | | Redis connection string. Biarkan default untuk Redis sidecar |
| `REQUIRE_API_KEY` | `false` | | Require API key pada `/v1/*` endpoints. Set `true` jika publik |
| `AUTH_COOKIE_SECURE` | `true` | | Set `true` jika di belakang HTTPS. Default `true` untuk NPM |
| `BASE_URL` | `http://omniroute:20130` | | Internal server-to-server URL |
| `NEXT_PUBLIC_BASE_URL` | `https://omniroute.example.com` | ✅ | Public URL untuk OAuth callbacks & dashboard links. **Ganti dengan domain NPM kamu** |
| `OMNIROUTE_MEMORY_MB` | `512` | | Heap memory limit untuk Node.js (dalam MB) |
| `ENABLE_REQUEST_LOGS` | `false` | | Enable request/response logging |

---

## Dashboard Access

| Access | URL |
|--------|-----|
| Local | http://localhost:20130 |
| Network | http://<server-ip>:20130 |
| Via NPM | https://omniroute.domain.com |

**First login:**
- Default password: `CHANGEME` (atau `INITIAL_PASSWORD` yang kamu set)
- No username — enter password directly
- **Change password** immediately after login via Dashboard → Settings → Security

---

## Data Persistence

Data disimpan di Docker named volume:

| Volume | Mount | Function |
|--------|-------|----------|
| `omniroute_data` | `/app/data` | SQLite database, config, logs, backups |
| `omniroute_redis_data` | `/data` | Redis persistence (rate limiter cache) |

To inspect or backup data:

```bash
# Backup
docker run --rm -v omniroute_data:/data -v $(pwd):/backup alpine tar czf /backup/omniroute-backup-$(date +%Y%m%d).tar.gz -C /data .

# Restore
docker run --rm -v omniroute_data:/data -v $(pwd):/backup alpine tar xzf /backup/omniroute-backup-YYYYMMDD.tar.gz -C /data
```

---

## Reverse Proxy (NPM)

Via Nginx Proxy Manager:

| Field | Value |
|-------|-------|
| Domain | `omniroute.domain.com` |
| Forward Hostname | `omniroute` |
| Forward Port | `20130` |
| SSL | Let's Encrypt |
| Websockets Support | ✅ Enabled |

Don't forget to set `NEXT_PUBLIC_BASE_URL` di `.env` dengan domain yang sama.

---

## Update

```bash
docker compose pull
docker compose up -d
```

Container will restart without losing data (persisted in volumes).

---

## Teardown

```bash
# Stop and remove containers (data stays in volumes)
docker compose down

# Stop + remove containers + delete volumes (data lost!)
docker compose down -v

# Remove image
docker rmi diegosouzapw/omniroute:latest
```

---

## Troubleshooting

| Issue | Solution |
|-------|----------|
| Port conflict | Pastikan port `20130` tidak dipakai service lain (9router pakai `20128`) |
| Dashboard unreachable | Check `docker compose logs omniroute -f` |
| Redis connection error | Pastikan Redis container running: `docker compose ps redis` |
| Healthcheck fails | Check `docker compose logs omniroute` — mungkin butuh waktu lebih lama di first start |
| Forgot password | Hapus volume data (`docker compose down -v`) lalu start ulang — **data hilang!** |
| Want 9router features instead | Gunakan `ai-automation/9router/` di port `20128` |
