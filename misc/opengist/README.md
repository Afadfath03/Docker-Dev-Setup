# OpenGist

Self-hosted pastebin powered by Git — open-source alternative to GitHub Gist.
All snippets stored in Git repositories; clone/pull/push via HTTP or SSH.

## Setup

```bash
cp -n .env.example .env
# edit .env — wajib isi OG_EXTERNAL_URL & OG_SECRET_KEY
# OG_SECRET_KEY: openssl rand -hex 32
docker compose up -d
```

## Access

| Service | URL |
|---|---|
| HTTP | `http://<ip>:6157` |
| SSH | `ssh://opengist@<ip>:2222` |

Jika di belakang NPM: set domain → `http://opengist:6157`, pastikan `OG_EXTERNAL_URL` diisi dengan URL publik.

SSH bisa diakses via NPM juga kalau NPM support TCP stream, atau langsung ke port `2222`.

## Fitur

- Public / unlisted / private snippets
- Clone/pull/push via Git over HTTP or SSH
- Syntax highlighting, Markdown & CSV support
- Search snippets, browse users, likes, forks
- Revisions history
- Embed snippets
- OAuth2 (GitHub, GitLab, Gitea, OpenID Connect)
- REST API
- SQLite (no external DB needed)

## Port

| Internal | External | Description |
|---|---|---|
| 6157 | 6157 | HTTP |
| 2222 | 2222 | SSH git access |

## Konfigurasi

Semua konfigurasi via environment variables (lihat `.env.example`).
Referensi lengkap: https://opengist.io/docs/configuration/cheat-sheet.html
