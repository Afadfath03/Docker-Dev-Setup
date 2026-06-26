# PostgreSQL

Database engine Alpine-based.

## Run

```bash
docker compose up -d
```

## Access

| Host | Port | User | Password |
|---|---|---|---|
| `localhost` | `5432` | `postgres` | `admin123` |

⚠️ Binding `127.0.0.1` saja — tidak bisa diakses dari luar.

## Init

`init.sql` auto-jalan saat pertama kali — buat dummy table.

## Resources

Memory limit 1G, shared memory 256MB.
