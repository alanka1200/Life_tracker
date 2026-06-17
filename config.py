version: "3.9"

services:
  # ── PostgreSQL (локальная разработка) ─────────────
  db:
    image: postgres:16-alpine
    restart: unless-stopped
    environment:
      POSTGRES_DB: lifeos
      POSTGRES_USER: lifeos
      POSTGRES_PASSWORD: lifeos_local
    ports:
      - "5432:5432"
    volumes:
      - pgdata:/var/lib/postgresql/data

  # ── FastAPI Backend ────────────────────────────────
  api:
    build:
      context: ./backend
      dockerfile: Dockerfile
    restart: unless-stopped
    ports:
      - "8000:8000"
    env_file:
      - ./backend/.env
    environment:
      DATABASE_URL: postgresql://lifeos:lifeos_local@db:5432/lifeos
    depends_on:
      - db
    volumes:
      - ./backend:/app
    command: uvicorn app.main:app --host 0.0.0.0 --port 8000 --reload

  # ── Telegram Bot ───────────────────────────────────
  bot:
    build:
      context: ./backend
      dockerfile: Dockerfile
    restart: unless-stopped
    env_file:
      - ./backend/.env
    environment:
      DATABASE_URL: postgresql://lifeos:lifeos_local@db:5432/lifeos
    depends_on:
      - db
      - api
    volumes:
      - ./backend:/app
    command: python -m app.bot.bot

  # ── Frontend (dev server) ──────────────────────────
  frontend:
    image: node:20-alpine
    working_dir: /app
    ports:
      - "5173:5173"
    volumes:
      - ./frontend:/app
      - /app/node_modules
    command: sh -c "npm install && npm run dev -- --host"
    environment:
      VITE_API_URL: http://localhost:8000

volumes:
  pgdata:
