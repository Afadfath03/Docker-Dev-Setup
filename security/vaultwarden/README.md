# Vaultwarden

Lightweight self-hosted password manager (Bitwarden-compatible).

## Setup

```bash
cp -n .env.example .env
# Edit .env — set DOMAIN and ADMIN_TOKEN
docker compose up -d
```

## Access

`https://<domain>` (via NPM) or `http://<ip>:8084`

## Admin panel

Visit `https://<domain>/admin` and log in with `ADMIN_TOKEN`. Disable in `.env` when not needed.

## Notes

Uses SQLite by default (no external DB required).
