name: CI

on:
  push:
    branches: [main, develop]
  pull_request:
    branches: [main]

jobs:
  # ── Backend linting & tests ────────────────────────
  backend:
    name: Backend
    runs-on: ubuntu-latest
    defaults:
      run:
        working-directory: backend

    steps:
      - uses: actions/checkout@v4

      - name: Set up Python
        uses: actions/setup-python@v5
        with:
          python-version: "3.11"
          cache: "pip"

      - name: Install dependencies
        run: pip install -r requirements.txt -r requirements-dev.txt

      - name: Lint (ruff)
        run: ruff check app/

      - name: Type check (mypy)
        run: mypy app/ --ignore-missing-imports

      - name: Tests
        run: pytest tests/ -v --tb=short
        env:
          DATABASE_URL: "sqlite+aiosqlite:///./test.db"
          BOT_TOKEN: "test_token"
          ANTHROPIC_API_KEY: "test_key"

  # ── Frontend build & type check ────────────────────
  frontend:
    name: Frontend
    runs-on: ubuntu-latest
    defaults:
      run:
        working-directory: frontend

    steps:
      - uses: actions/checkout@v4

      - name: Set up Node.js
        uses: actions/setup-node@v4
        with:
          node-version: "20"
          cache: "npm"
          cache-dependency-path: frontend/package-lock.json

      - name: Install dependencies
        run: npm ci

      - name: Type check
        run: npm run type-check

      - name: Lint
        run: npm run lint

      - name: Build
        run: npm run build
        env:
          VITE_API_URL: "https://life-os-api.onrender.com"
