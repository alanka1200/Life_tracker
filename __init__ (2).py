# 🌿 Life OS

> Персональный AI-трекер здоровья как Telegram Mini App.
> Сон, настроение, питание, привычки — всё в одном месте с AI-анализом.

---

## Что это

Life OS помогает отслеживать четыре ключевые сферы жизни и находить связи между ними: плохо спишь → падает настроение → срываешь питание → не делаешь цели. AI видит эти паттерны и говорит о них первым.

**Стек:**
- Frontend — React 18 + Vite + TypeScript (Telegram Mini App)
- Backend — FastAPI + asyncpg
- Database — PostgreSQL (Neon)
- AI — Claude API (Vision + Text)
- Bot — aiogram 3.x
- Deploy — Render

---

## Модули

| Модуль | Описание |
|--------|---------|
| 🌙 Sleep Tracker | Время сна, качество, заметки, AI-паттерны |
| 🌸 Mood & Energy | Настроение 1-10, энергия, тревога, AI-триггеры |
| 🥗 Nutrition | Фото → Claude Vision → КБЖУ, дневник питания |
| 🌱 Habits + Goals | Привычки со стриками, цели с прогрессом, AI-коуч |
| 🏠 Dashboard | Сводка всего за день, недельные графики |
| 👤 Profile | Профиль, отчёты, рефералы, настройки |

---

## Запуск локально

### Требования
- Python 3.11+
- Node.js 20+
- PostgreSQL (или Neon аккаунт)

### Backend

```bash
cd backend
python -m venv .venv
source .venv/bin/activate  # Windows: .venv\Scripts\activate
pip install -r requirements.txt

cp .env.example .env
# Заполни .env

python -m app.main          # API на :8000
python -m app.bot.bot       # Telegram-бот
```

### Frontend

```bash
cd frontend
npm install

cp .env.example .env.local
# VITE_API_URL=http://localhost:8000

npm run dev     # http://localhost:5173
npm run build   # Production build в dist/
```

### Swagger UI

После запуска бэкенда: [http://localhost:8000/docs](http://localhost:8000/docs)

---

## Деплой на Render (бесплатно)

```bash
# 1. Пуш в GitHub
git push origin main

# 2. render.com → New → Blueprint → выбери репо
# render.yaml создаст 3 сервиса автоматически

# 3. Добавь переменные окружения в Render Dashboard:
DATABASE_URL=postgresql://...neon...
BOT_TOKEN=...BotFather...
ANTHROPIC_API_KEY=sk-ant-...
WEBAPP_URL=https://life-os-twa.onrender.com
API_URL=https://life-os-api.onrender.com
```

Подробнее: [DEPLOY.md](./DEPLOY.md)

---

## Структура проекта

```
life-os/
├── frontend/              # React + Vite + TypeScript
│   ├── src/
│   │   ├── api/           # API клиент
│   │   ├── components/    # Переиспользуемые компоненты
│   │   ├── pages/         # Страницы приложения
│   │   ├── store/         # Zustand state management
│   │   ├── types/         # TypeScript типы
│   │   └── utils/         # Утилиты
│   └── package.json
├── backend/
│   ├── app/
│   │   ├── routes/        # FastAPI роутеры по модулям
│   │   ├── services/      # AI, PDF, планировщик
│   │   └── bot/           # Telegram-бот (aiogram)
│   └── requirements.txt
├── .github/workflows/     # CI/CD
├── render.yaml            # Деплой конфигурация
├── docker-compose.yml     # Локальная разработка
└── README.md
```

---

## Лицензия

Приватный репозиторий. Все права защищены.
