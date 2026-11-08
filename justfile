set shell := ["bash", "-eu", "-o", "pipefail", "-c"]

default:
    @just --list

# Install Python + Node dependencies (one-time / after clone)
install:
    python3 -m venv backend/.venv
    backend/.venv/bin/pip install -r backend/requirements-dev.txt
    npm install --prefix frontend
    npm exec --prefix frontend -- playwright install chromium

test:
    backend/.venv/bin/pytest backend

# E2E: requires Postgres (Docker). Opens Playwright UI; starts Django + Vite if not already running.
test-e2e: db-up db-wait migrate
    npm run test:e2e:ui --prefix frontend

# Start Postgres, migrate, then Django + Vite (foreground; Ctrl+C stops app servers)
dev: db-up db-wait migrate _serve

[parallel]
_serve: backend frontend

db-up:
    docker compose up -d

db-wait:
    #!/usr/bin/env bash
    set -euo pipefail
    for _ in $(seq 1 30); do
        if docker compose exec -T db pg_isready -U accounting -d accounting &>/dev/null; then
            exit 0
        fi
        sleep 1
    done
    echo "Postgres not ready after 30s" >&2
    exit 1

migrate:
    backend/.venv/bin/python backend/manage.py migrate --noinput

backend:
    backend/.venv/bin/python backend/manage.py runserver

frontend:
    npm run dev --prefix frontend

db-down:
    docker compose down
