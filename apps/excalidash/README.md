# ExcaliDash

Self-hosted dashboard and organizer for Excalidraw with persistent storage, real-time collaboration, multi-user authentication, version history, and drawing collections.

## Run

```bash
cp .env.example .env
# edit .env — ganti JWT_SECRET dan CSRF_SECRET
docker compose up -d
```

## Access

`http://<ip>:6767`

Register user pertama → otomatis menjadi admin.

## Reverse Proxy (NPM)

Set `TRUST_PROXY=1` di `.env` jika di belakang NPM. Buat proxy host di NPM dengan target `http://excalidash-frontend:80`.

## Defaults

| Item | Value |
|---|---|
| Storage | SQLite (volume `excalidash_data`) |
| Auth | local (register via UI) |
| Port | 6767 |
