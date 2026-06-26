# SearXNG

Private meta-search engine — privacy-respecting, agregator hasil pencarian dari berbagai engine.

## Run

```bash
cp .env.example .env
docker compose up -d
```

## Access

`http://<ip>:8443`

## Config

| File | Fungsi |
|---|---|
| `.env` | `SEARXNG_BASE_URL`, `SEARXNG_SECRET` |
| `settings.yml` | Search, UI, outgoing timeout |
| `limiter.toml` | Rate limit (default 10 req/60s) |
