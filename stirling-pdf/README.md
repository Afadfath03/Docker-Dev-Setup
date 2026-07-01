# Stirling PDF

Self-hosted PDF manipulation tools — merge, split, compress, convert, OCR, and more.

## Setup

```bash
cp -n .env.example .env
docker compose up -d
```

## Access

`https://<domain>` (via NPM) or `http://<ip>:8085`

## Memory

Uses 512M by default. Increase to 1G in `docker-compose.yml` for large files.
