# arabold Docs MCP Server

Documentation index & MCP SSE server for grounding AI tools.

## Setup

```bash
cp -n .env.example .env
# edit .env with your API keys
docker compose up -d
```

## Access

| URL | Port |
|---|---|
| `http://<ip>:6280` | 6280 |

## Env

See `.env.example` for available options. At minimum, set `OPENAI_API_KEY` or `GOOGLE_API_KEY` for embedding support.
