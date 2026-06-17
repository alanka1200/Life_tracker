# Деплой Life OS — пошаговая инструкция

## Требования

- Аккаунт GitHub (приватный репо)
- Аккаунт Render (бесплатный)
- Аккаунт Neon (бесплатный)
- Аккаунт Anthropic (от $5 на балансе)

---

## Шаг 1 — Telegram BotFather (2 мин)

```
Открой @BotFather → /newbot
Имя: Life OS
Username: lifeos_ваш_никнейм_bot

Сохрани токен: 7234567890:AAF...
```

---

## Шаг 2 — Neon Database (3 мин)

```
1. neon.tech → Sign up (GitHub)
2. New Project → life-os → регион eu-central-1
3. Dashboard → Connection string → скопируй:
   postgresql://user:pass@ep-xxx.eu-central-1.aws.neon.tech/neondb?sslmode=require
```

---

## Шаг 3 — Anthropic API ключ (2 мин)

```
1. console.anthropic.com → Sign up
2. Settings → API Keys → Create Key
3. Пополни баланс от $5
```

---

## Шаг 4 — GitHub репозиторий (3 мин)

```bash
cd life-os
git init
git add .
git commit -m "feat: initial Life OS project"

# Создай приватный репо на github.com
git remote add origin https://github.com/ВАШ_НИК/life-os.git
git push -u origin main
```

---

## Шаг 5 — Render деплой (10 мин)

```
1. render.com → Sign in with GitHub
2. New → Blueprint → выбери репо life-os
   Render найдёт render.yaml и создаст 3 сервиса:
   ├── life-os-api    (FastAPI Web Service)
   ├── life-os-bot    (Telegram Bot Worker)
   └── life-os-twa    (React Static Site)

3. Для КАЖДОГО сервиса добавь переменные окружения:
```

| Переменная | Значение |
|-----------|---------|
| `DATABASE_URL` | из Neon |
| `BOT_TOKEN` | из BotFather |
| `ANTHROPIC_API_KEY` | из Anthropic |
| `WEBAPP_URL` | https://life-os-twa.onrender.com |
| `API_URL` | https://life-os-api.onrender.com |
| `ALLOWED_ORIGINS` | https://life-os-twa.onrender.com |
| `VITE_API_URL` | https://life-os-api.onrender.com (только для frontend) |

```
4. Deploy All → подожди 3-5 минут
```

---

## Шаг 6 — Настройка Telegram Mini App (2 мин)

```
@BotFather → /setmenubutton → выбери бота
URL: https://life-os-twa.onrender.com
Текст: 🌿 Открыть Life OS

@BotFather → /setdomain → выбери бота
Домен: life-os-twa.onrender.com
```

---

## Шаг 7 — Проверка

```bash
# API работает?
curl https://life-os-api.onrender.com/health

# Ожидаемый ответ:
# {"status": "ok", "version": "2.0.0"}
```

Напиши /start своему боту → должно открыться приложение.

---

## Локальный запуск

```bash
# Backend
cd backend
python -m venv .venv && source .venv/bin/activate
pip install -r requirements.txt
cp .env.example .env  # заполни

python -m app.main          # API → http://localhost:8000
python -m app.bot.bot       # Bot (другой терминал)

# Swagger UI → http://localhost:8000/docs

# Frontend (другой терминал)
cd ../frontend
npm install
cp .env.example .env.local  # VITE_API_URL=http://localhost:8000
npm run dev  # → http://localhost:5173

# Или через Docker Compose (всё сразу)
cd ..
docker-compose up
```

---

## Стоимость

| Сервис | Лимит Free | Когда платить |
|--------|-----------|---------------|
| Render Web | 750 ч/мес | После 100+ юзеров |
| Render Static | ∞ | Никогда |
| Neon | 0.5 GB, 10k req | После 1000+ юзеров |
| Anthropic | Pay-as-you-go | ~$0.003/фото еды |

**На старте: 0 ₽**
