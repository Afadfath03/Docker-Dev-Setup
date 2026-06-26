# MySQL

Database engine LTS.

## Run

```bash
docker compose up -d
```

## Access

| Host | Port | User | Password | Database |
|---|---|---|---|---|
| `<ip>` | `3306` | `root` | `admin123` | `app` |

## Init

`init.sql` auto-runs on first start — creates DB `app` + dummy table.

## Resources

Memory limit 1G.
