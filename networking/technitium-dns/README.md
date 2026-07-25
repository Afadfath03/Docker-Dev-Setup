# Technitium DNS Server

Authoritative + recursive DNS server dengan ad/malware blocking dan web console.

## Prerequisites

- **Stop Blocky DNS dan Pi-hole** — ketiganya sama-sama membutuhkan port `53`.
  Hanya satu yang bisa berjalan dalam satu waktu.

  ```bash
  docker compose -f ../blocky_dns/docker-compose.yml down
  docker compose -f ../pi-hole/docker-compose.yml down
  ```

## Run

```bash
cp -n .env.example .env
# edit .env — set DNS_SERVER_ADMIN_PASSWORD
docker compose up -d
```

## Access

| Port | Function |
|---|---|
| `53/udp+tcp` | DNS server (set as system DNS) |
| `853/tcp` | DNS-over-TLS (aktif default) |
| `853/udp` | DNS-over-QUIC (aktif default) |
| `5380` | Web Admin UI |

**Web Admin:** `http://<ip>:5380`

Login dengan user `admin` dan password dari `DNS_SERVER_ADMIN_PASSWORD` di `.env`.

## DoH (DNS-over-HTTPS)

DoH membutuhkan port `443` yang sudah dipakai Nginx Proxy Manager.
Aktifkan hanya jika NPM tidak berjalan — uncomment port `443` di `docker-compose.yml`
dan set sertifikat TLS via web console (**Settings → Web Service**).

## DHCP

DHCP server tersedia tapi tidak aktif default. Untuk mengaktifkan:
uncomment port `67/udp` dan tambahkan `NET_RAW` ke `cap_add` di `docker-compose.yml`,
lalu konfigurasi via web console (**Settings → DHCP**).

## Konfigurasi DNS Client

Set DNS server perangkat / router ke IP host Docker ini, port `53`.

## Auto-switch DNS (laptop / dev machine)

Port 53 di laptop biasa dipakai `systemd-resolved`. Agar laptop otomatis pakai Technitium saat container jalan, dan kembali ke resolved saat container mati, install watchdog (`dns-watch.sh` + systemd timer, cek tiap 1 menit).

**Install:**

```bash
sudo cp dns-watch.sh /usr/local/bin/
sudo chmod +x /usr/local/bin/dns-watch.sh
sudo cp dns-watch.service dns-watch.timer /etc/systemd/system/
sudo systemctl daemon-reload
sudo systemctl enable --now dns-watch.timer
```

**Verifikasi:**

```bash
systemctl status dns-watch.timer        # timer aktif
cat /var/run/dns-watch.state            # "technitium" saat container jalan
dig +short google.com @127.0.0.1        # resolve via Technitium
```

**Test switch:**

```bash
docker compose down                     # stop Technitium
# tunggu maksimal 1 menit
dig +short google.com @127.0.0.53       # resolve via systemd-resolved

docker compose up -d                    # start Technitium lagi
# tunggu maksimal 1 menit — kembali ke Technitium
```

**Uninstall:**

```bash
sudo systemctl disable --now dns-watch.timer
sudo rm /etc/systemd/system/dns-watch.service /etc/systemd/system/dns-watch.timer /usr/local/bin/dns-watch.sh
sudo systemctl daemon-reload
```

Catatan: `systemd-resolved` hanya di-restart saat status berubah (bukan tiap menit), jadi tidak ada gangguan DNS berkala. Tidak perlu di VPS — di sana Technitium jalan permanen, cukup matikan stub resolved sekali.

## Catatan

- Data persist di `./config/` (bind mount, sudah di-`.gitignore`) — backup direktori ini sebelum upgrade image. `docker compose down -v` **tidak** menghapus data.
- **Tidak bisa** jalan bersamaan dengan Blocky DNS / Pi-hole (port 53 conflict).
- Untuk reverse proxy via NPM: buat proxy host ke `technitium-dns:5380`.
