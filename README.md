# Accounting

Django Ninja API backend and Vite + React (TypeScript) + Mantine frontend.

## Prerequisites

- Python 3.10+
- Node.js 18+ (Node 20+ recommended)
- Docker (for PostgreSQL)
- [just](https://github.com/casey/just) (`just` command runner)

## Quick start

```bash
just install    # once: venv, pip, npm
just dev        # Postgres + migrate + Django + Vite
```

- App: [http://localhost:5173](http://localhost:5173)
- API health: [http://127.0.0.1:8000/api/health](http://127.0.0.1:8000/api/health)
- OpenAPI: [http://127.0.0.1:8000/api/docs](http://127.0.0.1:8000/api/docs)

Optional: `cp backend/.env.example backend/.env`

Stop the database container: `just db-down`

## Commands

| Command | Description |
|---------|-------------|
| `just dev` | Docker Postgres, migrations, runserver + Vite |
| `just install` | Create venv, `pip install`, `npm install` |
| `just db-down` | `docker compose down` |
| `just migrate` | Run Django migrations |
| `just test` | pytest (sockets disabled; no Docker required) |
| `just test-e2e` | Playwright UI (Postgres + Django + Vite) |
| `just fmt` | Ruff + Prettier (write) |
| `just fmt-check` | Ruff + Prettier (check only) |
| `just --list` | All recipes |

**Formatting** — Backend: [Ruff](https://docs.astral.sh/ruff/) (`format` + `lint`). Frontend: [Prettier](https://prettier.io/) (ESLint uses `eslint-config-prettier`). **pre-commit** runs on `git commit` after `just install`.

### Testing

**pytest** — `config.settings_test` (in-memory SQLite) and **`pytest-socket`** with `--disable-socket` so outbound network connections fail in tests. Allow specific hosts in a test with `@pytest.mark.allow_hosts("127.0.0.1")` if you add integration tests later.

**Playwright** — specs in `frontend/e2e/`. `just test-e2e` brings up Postgres, migrates, then opens the **Playwright UI**. Playwright starts Django and Vite automatically unless they are already running (`just dev`). Headless CI run: `npm run test:e2e --prefix frontend`.

On Linux/WSL, if Chromium fails to launch (missing `libnspr4` etc.), install OS deps once:

```bash
sudo npm exec --prefix frontend -- playwright install-deps chromium
```

## Layout

| Path | Stack |
|------|--------|
| `backend/` | Django 5, Django Ninja, CORS, PostgreSQL |
| `frontend/` | Vite 6, React 19, **TypeScript**, Mantine 9 |
| `docker-compose.yml` | PostgreSQL 16 |
