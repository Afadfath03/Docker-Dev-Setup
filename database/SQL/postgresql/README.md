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

⚠️ `127.0.0.1` binding only — not accessible from outside.

## Init

`init.sql` auto-runs on first start — creates dummy table.

## Resources

Memory limit 1G, shared memory 256MB.
