# 9Router — Docker Setup

9Router is an open-source AI routing gateway and token saver. Acts as a local proxy between AI coding CLI tools and 40+ AI providers, with smart 3-tier fallback, format translation, and built-in token compression.

---

## Table of Contents

- [Prerequisites](#prerequisites)
- [Installation](#installation)
- [Configuration](#configuration)
- [Dashboard Access](#dashboard-access)
- [Data Persistence](#data-persistence)
- [Reverse Proxy (HTTPS)](#reverse-proxy-https)
- [Backup & Restore](#backup--restore)
- [Update](#update)
- [Teardown](#teardown)
- [Security Tips](#security-tips)
- [Troubleshooting](#troubleshooting)

---

## Prerequisites

- **Docker** and **Docker Compose** installed (Docker Compose v2 minimum)
- Port `20128` not in use

---

## Installation

```bash
# 1. Clone this repository
git clone <repo-url> 9router
cd 9router

# 2. Setup environment variables
cp .env.example .env
nano .env   # fill in JWT_SECRET, INITIAL_PASSWORD, API_KEY_SECRET

# 3. (Optional) Generate a strong JWT_SECRET
openssl rand -hex 64

# 4. Start container
docker compose up -d
```

### `.env` Setup

Copy `.env.example` to `.env`, then fill in required values:

| Variable | Required | Consequence if empty/placeholder | Description |
|----------|----------|----------------------------------|-------------|
| `JWT_SECRET` | ✅ | Empty → auto-generate on restart (session expires). Placeholder → secret guessable, session hijackable. | Secret for JWT auth cookie. Generate with `openssl rand -hex 64`. |
| `INITIAL_PASSWORD` | ✅ | Empty → app may fail to start. Placeholder → anyone can login. | First login password. Change after login. |
| `API_KEY_SECRET` | ✅ | Empty → empty HMAC key, API key invalid. Placeholder → API key can be forged. | HMAC secret for API key. Don't use default. |

Other variables have default values and are optional.

---

## Configuration

### Environment Variables

| Variable | Default | Required | Consequence if empty/placeholder | Description |
|----------|---------|----------|----------------------------------|-------------|
| `JWT_SECRET` | — | ✅ | Empty → auto-generate on restart (session expires). Placeholder → session hijackable. | Secret for JWT auth cookie. Generate with `openssl rand -hex 64`. |
| `INITIAL_PASSWORD` | `123456` | ✅ | Empty → app may fail to start. Placeholder → anyone can login. | First login password. Change after login. |
| `DATA_DIR` | `/app/data` | ✅ | Empty → data not persisted, lost on restart. | Data storage location in container. |
| `PORT` | `20128` | | Empty → default port 20128. | Service port. |
| `HOSTNAME` | `0.0.0.0` | | Empty → bind to all interfaces. | Container bind address. |
| `NODE_ENV` | `development` | ✅ | Empty → development mode (verbose logging). | Set to `production` for deployment. |
| `API_KEY_SECRET` | `endpoint-proxy-api-key-secret` | ✅ | Empty → empty HMAC key, API key invalid. Placeholder → API key can be forged. | HMAC secret for API key. Change from default. |
| `MACHINE_ID_SALT` | `endpoint-proxy-salt` | | Salt for machine ID hashing. |
| `REQUIRE_API_KEY` | `false` | | Require Bearer API key on `/v1/*` endpoints. Set `true` if public. |
| `AUTH_COOKIE_SECURE` | `false` | | Set `true` behind HTTPS reverse proxy. |
| `BASE_URL` | `http://localhost:20128` | | Internal base URL for cloud sync. |
| `NEXT_PUBLIC_BASE_URL` | `http://localhost:3000` | | Public base URL (compatibility). |
| `ENABLE_REQUEST_LOGS` | `false` | | Enable request/response logging. |

### Generate JWT_SECRET

```bash
openssl rand -hex 64
```

Result will be like: `a7f3c1e2b8d94f065a1c3e7b2d8f4a0c6e9b1d3f5a7c9e2b4d6f8a0c1e3d5b7f`

---

## Dashboard Access

| Access | URL |
|--------|-----|
| Local | http://localhost:20128 |
| Network | http://<server-ip>:20128 |

**First login:**
- Default password: `123456` (or your `INITIAL_PASSWORD`)
- No username — enter password directly
- **Change password** immediately after login via dashboard

---

## Data Persistence

Some internal 9Router modules store data directly in the container home directory (`~/.9router`), not in `DATA_DIR`. This requires **two volumes**:

| Host Volume | Container Mount | Function |
|-------------|----------------|----------|
| `${HOME}/.9router` | `/app/data` | Config, main database, `db.json` |
| `${HOME}/.9router-usage` | `/app/data-home` | Token usage data, logs, request details |

Without the second volume, usage data and logs will be lost on container restart. Both directories can be inspected from the host.

---

## Reverse Proxy (HTTPS)

### Nginx

```nginx
server {
    listen 443 ssl;
    server_name 9router.your-domain.com;

    ssl_certificate /etc/letsencrypt/live/domain/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/domain/privkey.pem;

    location / {
        proxy_pass http://127.0.0.1:20128;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_cache_bypass $http_upgrade;

        proxy_buffering off;
        proxy_read_timeout 86400s;
    }
}
```

Don't forget to set `AUTH_COOKIE_SECURE=true` in `.env`.

### Caddy

```caddy
9router.your-domain.com {
    reverse_proxy localhost:20128 {
        flush_interval -1
    }
}
```

Caddy automatically handles SSL certificates.

---

## Backup & Restore

### Backup

```bash
# Backup all 9router data
tar -czf 9router-backup-$(date +%Y%m%d).tar.gz \
  ~/.9router \
  ~/.9router-usage
```

### Restore

```bash
# Stop container
docker compose down

# Restore from backup
tar -xzf 9router-backup-YYYYMMDD.tar.gz -C ~/

# Start again
docker compose up -d
```

---

## Update

```bash
docker compose pull
docker compose up -d
```

Container will restart with the latest image without losing data (stored in volumes).

---

## Teardown

```bash
# Stop and remove container (data stays in volumes)
docker compose down

# Stop + remove container + delete volumes (data lost!)
docker compose down -v

# Remove image
docker rmi decolua/9router:latest
```

---

## Security Tips

1. **Change `JWT_SECRET`** — Generate with `openssl rand -hex 64`. Prevents session hijacking.
2. **Change `API_KEY_SECRET`** — Don't use default. Used for HMAC API key signing.
3. **Change `INITIAL_PASSWORD`** — Default `123456` is very insecure.
4. **Set `REQUIRE_API_KEY=true`** if instance is accessed from the internet.
5. **Set `AUTH_COOKIE_SECURE=true`** if using HTTPS.
6. **Use a reverse proxy** (Nginx/Caddy) for SSL termination instead of exposing the container directly.
7. **Use `.env` file** — don't edit variables directly in `docker-compose.yml` to avoid committing secrets to git.

---

## Troubleshooting

| Issue | Solution |
|-------|----------|
| Forgot password | Delete `db.json` in `${HOME}/.9router/db.json`, restart container, login with `INITIAL_PASSWORD`. |
| Usage data lost | Make sure volume `/app/data-home` is mounted correctly. |
| Dashboard unreachable | Check `docker compose logs -f` for errors. |
| API key invalid | Generate new API key via dashboard (Settings → API Keys). |
| Connection refused | Make sure port `20128` is not blocked by firewall. |
| Volume permission denied | Ensure `~/.9router` and `~/.9router-usage` are accessible by the Docker user. Adjust with `chown` if needed. |
| Healthcheck fails | Make sure container is fully running. Check with `docker compose ps` and `docker compose logs`. |
