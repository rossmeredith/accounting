---
name: accounting-dev
description: >-
  Develop and test the Accounting monorepo (Django Ninja, Vite React TypeScript,
  Mantine, PostgreSQL, just). Use when adding features, APIs, UI, migrations,
  pytest, or Playwright in this repository or when the user mentions just dev,
  docker compose, or project layout.
---

# Accounting development workflow

## Before coding

1. Read `.cursor/rules/project.mdc` and the area rule (`backend.mdc` or `frontend.mdc`).
2. Confirm whether the change needs Postgres (runtime) or only pytest (SQLite test settings).

## Common workflows

### New API endpoint

1. Add Ninja `Schema` types and route on `NinjaAPI` in `backend/config/api.py` (or a new router module included from there).
2. Add pytest in `backend/tests/` using `client.get/post/...` and `@pytest.mark.django_db` if needed.
3. Add `frontend/src/types/` + `frontend/src/api/` helper; consume from React components.
4. Run `just test`.

### New UI screen

1. Build with Mantine components; keep API access in `src/api/`.
2. Add Playwright coverage in `frontend/e2e/` when behavior is user-visible.
3. Run `just test-e2e` (or headless `npm run test:e2e --prefix frontend` in CI).

### Database model change

1. Create/update Django app models; run `just migrate` (requires `just db-up` or `just dev`).
2. Add pytest for model/API behavior; avoid requiring Docker in unit tests when possible.

## Verification checklist

- [ ] `just test` passes (no unintended socket use)
- [ ] If API or full-stack UI changed: `just test-e2e` or document why E2E was skipped
- [ ] No secrets in committed files

## Pitfalls

- Do not use DRF — API layer is Django Ninja only.
- pytest uses `--disable-socket`; tests cannot reach external hosts or Postgres unless explicitly allowed.
- Playwright E2E needs Docker Postgres (`just test-e2e` runs `db-up` first).
