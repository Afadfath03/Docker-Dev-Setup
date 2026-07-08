# PrivateBin

Minimalist, open-source online pastebin where the server has zero knowledge of pasted data.
Data is encrypted and decrypted in the browser using 256-bit AES (client-side encryption).

## Setup

```bash
cp -n .env.example .env
docker compose up -d
```

Untuk konfigurasi kustom (password wajib, dark theme, dll):

```bash
cp -n conf.php.example conf.php
# uncomment volume mount in docker-compose.yml, then:
docker compose up -d
```

## Access

`http://<ip>:8080` — langsung bisa dipakai.

Jika di belakang NPM: set domain → `http://privatebin:8080`.

## Defaults

- Tanpa `conf.php`: semua fitur aktif (diskusi, upload file, tanpa password)
- Dengan `conf.php.example`: password wajib, burn-after-reading, dark theme, diskusi mati, max expire 1 bulan

## Port

| Internal | External |
|---|---|
| 8080 | 8080 |
