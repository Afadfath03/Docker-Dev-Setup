# 9Router — Docker Setup

9Router adalah AI routing gateway dan token saver open-source. Bertindak sebagai proxy lokal antara AI coding CLI tools dengan 40+ provider AI, dilengkapi smart 3-tier fallback, format translation, dan kompresi token bawaan.

---

## Daftar Isi

- [Prasyarat](#prasyarat)
- [Instalasi](#instalasi)
- [Konfigurasi](#konfigurasi)
- [Akses Dashboard](#akses-dashboard)
- [Data Persistence](#data-persistence)
- [Reverse Proxy (HTTPS)](#reverse-proxy-https)
- [Backup & Restore](#backup--restore)
- [Update](#update)
- [Teardown](#teardown)
- [Tips Keamanan](#tips-keamanan)
- [Troubleshooting](#troubleshooting)

---

## Prasyarat

- **Docker** dan **Docker Compose** terinstal (minimal Docker Compose v2)
- Port `20128` tidak dipakai aplikasi lain

---

## Instalasi

```bash
# 1. Clone repository ini
git clone <repo-url> 9router
cd 9router

# 2. Setup environment variables
cp .env.example .env
nano .env   # isi JWT_SECRET, INITIAL_PASSWORD, API_KEY_SECRET

# 3. (Opsional) Generate JWT_SECRET yang kuat
openssl rand -hex 64

# 4. Jalankan container
docker compose up -d
```

### Setup `.env`

Copy file `.env.example` menjadi `.env`, lalu isi nilai-nilai yang wajib:

| Variable | Wajib | Konsekuensi jika kosong / placeholder | Keterangan |
|----------|-------|--------------------------------------|------------|
| `JWT_SECRET` | ✅ | Kosong → auto-generate tiap restart (session kadaluarsa). Placeholder → secret bisa ditebak, session dibajak. | Secret untuk JWT auth cookie. Generate dengan `openssl rand -hex 64`. |
| `INITIAL_PASSWORD` | ✅ | Kosong → app mungkin gagal startup. Placeholder → siapapun bisa login. | Password pertama kali login dashboard. Ganti setelah login. |
| `API_KEY_SECRET` | ✅ | Kosong → HMAC key kosong, API key tidak valid. Placeholder → API key bisa dipalsukan. | HMAC secret untuk API key. Jangan pakai default. |

Variable lain sudah memiliki default value dan bersifat opsional.

---

## Konfigurasi

### Environment Variable

| Variable | Default | Wajib | Konsekuensi jika kosong / placeholder | Keterangan |
|----------|---------|-------|--------------------------------------|------------|
| `JWT_SECRET` | — | ✅ | Kosong → auto-generate tiap restart (session expired). Placeholder → session bisa dibajak. | Secret untuk JWT auth cookie. Generate dengan `openssl rand -hex 64`. |
| `INITIAL_PASSWORD` | `123456` | ✅ | Kosong → app mungkin gagal startup. Placeholder → siapapun bisa login. | Password pertama kali login dashboard. Ganti setelah login. |
| `DATA_DIR` | `/app/data` | ✅ | Kosong → data tidak tersimpan, hilang saat restart. | Lokasi penyimpanan data di container. |
| `PORT` | `20128` | | Kosong → port default 20128. | Port service. |
| `HOSTNAME` | `0.0.0.0` | | Kosong → bind ke semua interface. | Bind address container. |
| `NODE_ENV` | `development` | ✅ | Kosong → development mode (verbose log). | Set ke `production` untuk deploy. |
| `API_KEY_SECRET` | `endpoint-proxy-api-key-secret` | ✅ | Kosong → HMAC key kosong, API key invalid. Placeholder → API key bisa dipalsukan. | HMAC secret untuk API key. Ganti dari default. |
| `MACHINE_ID_SALT` | `endpoint-proxy-salt` | | Salt untuk hashing machine ID. |
| `REQUIRE_API_KEY` | `false` | | Wajibkan Bearer API key di endpoint `/v1/*`. Set `true` jika publik. |
| `AUTH_COOKIE_SECURE` | `false` | | Set `true` jika di belakang HTTPS reverse proxy. |
| `BASE_URL` | `http://localhost:20128` | | Base URL internal untuk cloud sync. |
| `NEXT_PUBLIC_BASE_URL` | `http://localhost:3000` | | Base URL publik (kompatibilitas). |
| `ENABLE_REQUEST_LOGS` | `false` | | Aktifkan logging request/response. |

### Generate JWT_SECRET

```bash
openssl rand -hex 64
```

Hasilnya akan seperti: `a7f3c1e2b8d94f065a1c3e7b2d8f4a0c6e9b1d3f5a7c9e2b4d6f8a0c1e3d5b7f`

---

## Akses Dashboard

| Akses | URL |
|-------|-----|
| Lokal | http://localhost:20128 |
| Jaringan | http://<ip-server>:20128 |

**Login pertama:**
- Password default: `123456` (atau sesuai `INITIAL_PASSWORD` jika diubah)
- Tidak ada username — langsung masukkan password
- **Ganti password** segera setelah login melalui dashboard

---

## Data Persistence

Beberapa modul internal 9router menyimpan data langsung ke direktori home container (`~/.9router`), bukan ke `DATA_DIR`. Oleh karena itu diperlukan **dua volume**:

| Volume Host | Mount Container | Fungsi |
|-------------|----------------|--------|
| `${HOME}/.9router` | `/app/data` | Konfigurasi, database utama, `db.json` |
| `${HOME}/.9router-usage` | `/app/data-home` | Data pemakaian token, log, request details |

Tanpa volume kedua, data pemakaian dan log akan hilang saat container restart. Kedua direktori bisa diinspeksi langsung dari host.

---

## Reverse Proxy (HTTPS)

### Nginx

```nginx
server {
    listen 443 ssl;
    server_name 9router.domain-anda.com;

    ssl_certificate /etc/letsencrypt/live/domain/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/domain/privkey.pem;

    location / {
        proxy_pass http://127.0.0.1:20128;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_cache_bypass $http_upgrade;

        proxy_buffering off;
        proxy_read_timeout 86400s;
    }
}
```

Jangan lupa set `AUTH_COOKIE_SECURE=true` di `.env`.

### Caddy

```caddy
9router.domain-anda.com {
    reverse_proxy localhost:20128 {
        flush_interval -1
    }
}
```

Caddy otomatis mengurus sertifikat SSL.

---

## Backup & Restore

### Backup

```bash
# Backup semua data 9router
tar -czf 9router-backup-$(date +%Y%m%d).tar.gz \
  ~/.9router \
  ~/.9router-usage
```

### Restore

```bash
# Hentikan container
docker compose down

# Restore dari backup
tar -xzf 9router-backup-YYYYMMDD.tar.gz -C ~/

# Jalankan lagi
docker compose up -d
```

---

## Update

```bash
docker compose pull
docker compose up -d
```

Container akan restart dengan image terbaru tanpa kehilangan data (tersimpan di volume).

---

## Teardown

```bash
# Hentikan dan hapus container (data tetap aman di volume)
docker compose down

# Hapus container + volume data (data akan hilang!)
docker compose down -v

# Hapus image
docker rmi decolua/9router:latest
```

---

## Tips Keamanan

1. **Ganti `JWT_SECRET`** — Generate dengan `openssl rand -hex 64`. Mencegah session hijack.
2. **Ganti `API_KEY_SECRET`** — Jangan pakai default. Digunakan untuk HMAC API key.
3. **Ganti `INITIAL_PASSWORD`** — Default `123456` sangat tidak aman.
4. **Set `REQUIRE_API_KEY=true`** jika instance diakses dari internet.
5. **Set `AUTH_COOKIE_SECURE=true`** jika pakai HTTPS.
6. **Gunakan reverse proxy** (Nginx/Caddy) untuk terminasi SSL daripada mengekspos container langsung.
7. **Gunakan `.env` file** — jangan edit variable langsung di `docker-compose.yml` agar tidak ter-commit ke git.

---

## Troubleshooting

| Masalah | Solusi |
|---------|--------|
| Lupa password | Hapus file `db.json` di `${HOME}/.9router/db.json`, restart container, login dengan `INITIAL_PASSWORD`. |
| Data pemakaian hilang | Pastikan volume `/app/data-home` terpasang dengan benar. |
| Dashboard tidak bisa diakses | Periksa `docker compose logs -f` untuk melihat error. |
| API key tidak valid | Generate API key baru lewat dashboard (Settings → API Keys). |
| Connection refused | Pastikan port `20128` tidak terhalang firewall. |
| Permission denied volume | Pastikan direktori `~/.9router` dan `~/.9router-usage` bisa diakses user Docker. Atur dengan `chown` jika perlu. |
| Healthcheck gagal | Pastikan container sudah benar-benar running. Cek dengan `docker compose ps` dan `docker compose logs`. |
