# SFTPGo

Full-featured SFTP server with Web Admin UI.

## Ports

| Port | Protocol | Function |
|---|---|---|
| 2022 | SFTP | File transfer |
| 8080 | HTTP | Web Admin UI (internal, via npm_network) |

## Quick Start

```bash
cp .env.example .env   # if present
docker compose up -d
```

## First Setup

1. Access Web Admin via NPM (e.g. `https://sftpgo.domain.com/web/admin`)
2. Create the first admin user
3. Add SFTP users via Web Admin

## SFTP Access

```bash
sftp -P 2022 <username>@<domain>
```

## Nginx Proxy Manager

| Field | Value |
|---|---|
| Scheme | `http` |
| Forward IP | `sftpgo` |
| Port | `8080` |

## Volumes

| Volume | Path | Description |
|---|---|---|
| `sftpgo_data` | `/srv/sftpgo` | User data, backups |
| `sftpgo_config` | `/var/lib/sftpgo` | Config, host keys |
