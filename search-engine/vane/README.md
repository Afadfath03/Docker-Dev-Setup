# Vane

Privacy-focused AI answering engine (fork of Perplexica). Self-hosted alternative to Perplexity AI.

## Setup

```bash
cp -n .env.example .env
docker compose up -d
```

## Access

| URL | Port |
|---|---|
| `http://<ip>:3004` | `3004` |

## Reverse Proxy (NPM)

1. Add a Proxy Host in NPM → domain → `http://vane:3000`.
2. Open the domain and configure AI providers (OpenAI, Ollama, Groq, etc.) in the setup screen.

## Notes

- The full bundle image includes a bundled SearXNG instance; no extra SearXNG container is needed.
- First launch opens a setup wizard at `/` for configuring LLM/embedding models and API keys.
- Uploads are persisted in the `vane_uploads` volume.
