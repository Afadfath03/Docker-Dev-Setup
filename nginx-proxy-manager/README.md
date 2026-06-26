# Nginx Proxy Manager

Reverse proxy dengan web UI dan dukungan Let's Encrypt SSL.

## Run

```bash
docker compose up -d
```

## Access

| Port | Fungsi |
|---|---|
| `80` | HTTP proxy |
| `81` | Admin UI (`http://<ip>:81`) |
| `443` | HTTPS proxy |

Default login: `admin@example.com` / `changeme`

## Setup Reverse Proxy

1. Login ke admin UI (port `81`)
2. **Proxy Hosts** → Add Proxy Host
3. Domain names → isi domain
4. Forward Hostname → container name (e.g. `9router`, `portainer`)
5. Forward Port → port internal container
6. **SSL** → Request Let's Encrypt certificate

## Security

Cukup buka port `80` dan `443` di firewall. Service lain cukup diakses lewat domain via NPM.
