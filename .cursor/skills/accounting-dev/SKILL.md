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
2. Add paired pytest in `backend/tests/` using `client.get/post/...` and `@pytest.mark.django_db`; assert side effects for the payloads the UI will send.
3. Add `frontend/src/types/` + `frontend/src/api/` helper; consume from React components.
4. Run `just test`.

### New UI screen / feature flow

1. Build with Mantine components; keep API access in `src/api/`.
2. Add **comprehensive** Playwright specs in `frontend/e2e/`: black box, `/api` mocked via `page.route`, all new paths covered.
3. Add **one pytest per Playwright test** with the same request payloads against Django; assert DB, email, session, etc.
4. Run `just test` and `npm run test:e2e --prefix frontend`.

### Database model change

1. Create/update Django app models; run `just migrate` (requires `just db-up` or `just dev`).
2. Add pytest for model/API behavior; avoid requiring Docker in unit tests when possible.

## Verification checklist

- [ ] `just test` passes (no unintended socket use); paired pytest covers payloads + side effects
- [ ] Playwright E2E passes with **mocked** `/api` (no dependency on live Django for UI tests)
- [ ] Every new user flow has both an E2E test and its pytest pair
- [ ] No secrets in committed files

## Pitfalls

- Do not use DRF — API layer is Django Ninja only.
- pytest uses `--disable-socket`; tests cannot reach external hosts or Postgres unless explicitly allowed.
- Playwright must not be integration-tested against real Django—mock `/api` and keep integration logic in pytest pairs.
