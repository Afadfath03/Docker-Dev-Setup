# Nginx Proxy Manager

Reverse proxy with web UI and Let's Encrypt SSL support.

## Run

```bash
docker compose up -d
```

## Access

| Port | Function |
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

Only ports `80` and `443` need to be open in the firewall. Other services are accessed through domains via NPM.
