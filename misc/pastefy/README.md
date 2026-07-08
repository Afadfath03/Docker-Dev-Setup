# Pastefy

Feature-rich open-source self-hosted Pastebin/GitHub Gist alternative.
Built with Vue.js (frontend) + Java Spring Boot (backend).

## Setup

```bash
cp -n .env.example .env
# edit .env — wajib isi MYSQL_ROOT_PASSWORD & MYSQL_PASSWORD
docker compose up -d
```

## Access

`http://<ip>:9999` — langsung bisa dipakai.

Jika di belakang NPM: set domain → `http://pastefy:80`.

Set `SERVER_NAME` di `.env` ke URL publik untuk OAuth redirect.

## Fitur

- REST API v2 (SDK: JS, Java, Go)
- OAuth2 login (GitHub, Google, Discord, Twitch, OIDC)
- Rich previews: Markdown, Mermaid, SVG, CSV, GeoJSON, Asciinema
- Paste expiration & password protection
- Folder organisasi
- VS Code & Raycast extensions
- Client-encrypted pastes (optional)
- Admin panel (`/admin` — set user type ke `ADMIN` di DB)

## Port

| Internal | External |
|---|---|
| 80 | 9999 |
