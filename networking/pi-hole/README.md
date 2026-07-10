# Pi-hole

Network-wide ad & tracker blocker (DNS sinkhole).

## Prerequisites

- **Stop Blocky DNS** — Pi-hole dan Blocky DNS sama-sama membutuhkan port `53`.
  Hanya satu yang bisa berjalan dalam satu waktu.

  ```bash
  docker compose -f ../blocky_dns/docker-compose.yml down
  ```

## Run

```bash
cp -n .env.example .env
# edit .env — set FTLCONF_WEBSERVER_API_PASSWORD
docker compose up -d
```

## Access

| Port | Function |
|---|---|
| `53/udp+tcp` | DNS server (set as system DNS) |
| `67/udp` | DHCP server (aktif secara default) |
| `8089` | Web Admin UI |

**Web Admin:** `http://<ip>:8089/admin`

Login menggunakan password yang diisi di `FTLCONF_WEBSERVER_API_PASSWORD`.

Jika sengaja dikosongkan, cari password random di log:

```bash
docker logs pi-hole 2>&1 | grep random
```

## DHCP

DHCP server aktif di port `67/udp`. Konfigurasi IP range via web admin:
**Settings → DHCP** (setelah login).

Matikan DHCP di router utama agar Pi-hole yang handle.

## Konfigurasi DNS Client

Set DNS server perangkat / router ke IP host Docker ini, port `53`.

## Catatan

- Data persist di `./etc-pihole/` — backup direktori ini sebelum upgrade image.
- Pi-hole **tidak bisa** jalan bersamaan dengan Blocky DNS (port 53 conflict).
- Untuk reverse proxy via NPM: buat proxy host ke `pi-hole:80`, endpoint `/admin`.
