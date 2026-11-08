# Agent guidance

This repo uses **Cursor rules** and a **project skill** for consistent AI assistance.

## Rules (`.cursor/rules/`)

| File | Scope |
|------|--------|
| `project.mdc` | Always on — monorepo layout, `just` commands, feature testing (Playwright + paired pytest) |
| `backend.mdc` | `backend/**/*` — Django Ninja, pytest |
| `frontend.mdc` | `frontend/**/*.{ts,tsx}` — React, Mantine, Playwright |

## Skill (`.cursor/skills/`)

- **`accounting-dev`** — workflows for APIs, UI, migrations, and running `just test` / `just test-e2e`.

Human-oriented setup and commands: [README.md](README.md).
