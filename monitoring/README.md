# Monitoring Stack

Prometheus + Grafana + Node Exporter + cAdvisor.

## Run

```bash
cp .env.example .env
docker compose up -d
```

## Services

| Service | Port | Fungsi |
|---|---|---|
| Prometheus | `9090` | Time-series metrics |
| Grafana | `3001` | Dashboard & visualisasi |
| Node Exporter | `9100` | Host metrics (CPU, memory, disk) |
| cAdvisor | `8081` | Container metrics |

## Grafana

Login dari `.env` — `GF_SECURITY_ADMIN_USER` / `GF_SECURITY_ADMIN_PASSWORD`.

Data source Prometheus auto-terkonfigurasi via provisioning.
