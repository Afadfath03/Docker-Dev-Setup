# n8n

Workflow automation — connect APIs, databases, and services with a visual editor.

## Setup

```bash
cp -n .env.example .env
# Generate encryption key for production
openssl rand -hex 32
# Then edit .env — set N8N_ENCRYPTION_KEY, N8N_HOST, WEBHOOK_URL
docker compose up -d
```

## Access

`https://<domain>` (via NPM) or `http://<ip>:5678`
