# Blocky DNS

DNS-level ad, tracker & malware blocker.

## Run

```bash
docker compose up -d
```

## Access

| Port | Function |
|---|---|
| `53/udp+tcp` | DNS server (set as system DNS) |
| `4000` | HTTP API / metrics |

## Config

`config.yml` — upstream DNS, blocklists, caching.

## Blocklists

- StevenBlack (hosts + fakenews + gambling)
- oisd.nl (big)
- HaGeZi (pro)

## Security

Port `53` must be open in the firewall for DNS to work.
