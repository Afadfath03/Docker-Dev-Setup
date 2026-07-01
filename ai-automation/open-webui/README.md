# Open WebUI

Self-hosted, feature-rich AI platform supporting Ollama and OpenAI-compatible APIs, with built-in RAG and offline capabilities.

## Setup

```bash
cp -n .env.example .env
# Edit .env — set WEBUI_SECRET_KEY (wajib untuk production)
docker compose up -d
```

## Access

| URL | Port |
|---|---|
| `http://<ip>:3002` | `3002` |

## Environment

- `WEBUI_SECRET_KEY` — wajib diisi; generate via `openssl rand -hex 32`
- `WEBUI_URL` — domain jika pakai reverse proxy NPM
- `OLLAMA_BASE_URL` — URL Ollama server (opsional, default `http://host.docker.internal:11434`)
- `ENABLE_SIGNUP` — `true`/`false`
- `DEFAULT_USER_ROLE` — `pending` | `user` | `admin`

## Reverse Proxy (NPM)

1. Tambah Proxy Host di NPM → domain → `http://open-webui:8080`
2. Set `WEBUI_URL` di `.env` ke domain tersebut
3. Restart: `docker compose up -d`
