services:
  # ── FastAPI (API + Scheduler) ──────────────────────
  - type: web
    name: life-os-api
    env: python
    rootDir: backend
    buildCommand: pip install -r requirements.txt
    startCommand: uvicorn app.main:app --host 0.0.0.0 --port $PORT
    healthCheckPath: /health
    envVars:
      - key: DATABASE_URL
        sync: false
      - key: BOT_TOKEN
        sync: false
      - key: ANTHROPIC_API_KEY
        sync: false
      - key: WEBAPP_URL
        sync: false
      - key: ALLOWED_ORIGINS
        sync: false

  # ── Telegram Bot (Worker) ──────────────────────────
  - type: worker
    name: life-os-bot
    env: python
    rootDir: backend
    buildCommand: pip install -r requirements.txt
    startCommand: python -m app.bot.bot
    envVars:
      - key: DATABASE_URL
        sync: false
      - key: BOT_TOKEN
        sync: false
      - key: ANTHROPIC_API_KEY
        sync: false
      - key: WEBAPP_URL
        sync: false
      - key: API_URL
        sync: false

  # ── Frontend (Static Site) ─────────────────────────
  - type: web
    name: life-os-twa
    env: static
    rootDir: frontend
    buildCommand: npm install && npm run build
    staticPublishPath: dist
    routes:
      - type: rewrite
        source: /*
        destination: /index.html
    envVars:
      - key: VITE_API_URL
        sync: false
