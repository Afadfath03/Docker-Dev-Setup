# Dozzle

Real-time Docker log viewer — tail, filter, and search container logs from a web UI.

## Setup

```bash
cp -n .env.example .env
docker compose up -d
```

## Access

`http://<ip>:8888`

## Auth

Set `DOZZLE_AUTH_PROVIDER` in `.env` to enable login (e.g. `simple`). Without it, the UI is open.
