import json
import logging
import httpx
import asyncpg
from datetime import date, timedelta
from app.config import get_settings

log = logging.getLogger(__name__)


async def call_claude(prompt: str, image_b64: str | None = None, image_type: str = "image/jpeg") -> str:
    api_key = get_settings().anthropic_api_key
    if not api_key:
        return "AI временно недоступен (нет API ключа)"

    content: list[dict] = []
    if image_b64:
        content.append({"type": "image", "source": {"type": "base64", "media_type": image_type, "data": image_b64}})
    content.append({"type": "text", "text": prompt})

    async with httpx.AsyncClient(timeout=30) as client:
        r = await client.post(
            "https://api.anthropic.com/v1/messages",
            headers={
                "x-api-key": api_key,
                "anthropic-version": "2023-06-01",
                "content-type": "application/json",
            },
            json={"model": "claude-sonnet-4-6", "max_tokens": 700, "messages": [{"role": "user", "content": content}]},
        )
        r.raise_for_status()
    return r.json()["content"][0]["text"]


async def analyze_food(image_b64: str, image_type: str = "image/jpeg") -> dict:
    prompt = (
        "На фото блюдо. Определи название и рассчитай КБЖУ для типичной порции (~300г).\n"
        "Ответь ТОЛЬКО JSON без markdown:\n"
        '{"name":"название","kcal":число,"protein_g":число.0,"fat_g":число.0,"carb_g":число.0,'
        '"comment":"1-2 предложения совета по питанию на русском"}'
    )
    try:
        raw = await call_claude(prompt, image_b64, image_type)
        raw = raw.strip().lstrip("`").rstrip("`")
        if raw.startswith("json"):
            raw = raw[4:]
        return json.loads(raw)
    except Exception as e:
        log.error(f"Food parse error: {e}")
        return {
            "name": "Блюдо",
            "kcal": 350,
            "protein_g": 20.0,
            "fat_g": 12.0,
            "carb_g": 38.0,
            "comment": "Не удалось распознать. Введи данные вручную.",
        }


async def generate_weekly_insight(user_id: int, pool: asyncpg.Pool) -> str:
    async with pool.acquire() as c:
        mood_rows = await c.fetch(
            "SELECT entry_date, AVG(mood) am, AVG(energy) ae FROM mood_entries "
            "WHERE user_id=$1 AND entry_date >= CURRENT_DATE-6 GROUP BY entry_date",
            user_id,
        )
        sleep_rows = await c.fetch(
            "SELECT entry_date, AVG(duration_h) ah FROM sleep_entries "
            "WHERE user_id=$1 AND entry_date >= CURRENT_DATE-6 GROUP BY entry_date",
            user_id,
        )
        habit_rows = await c.fetch(
            "SELECT hl.completed_date, COUNT(*) cnt FROM habit_logs hl "
            "JOIN habits h ON h.id=hl.habit_id "
            "WHERE hl.user_id=$1 AND hl.completed_date >= CURRENT_DATE-6 GROUP BY hl.completed_date",
            user_id,
        )

    if not mood_rows and not sleep_rows:
        return "Данных пока мало. Трекай ещё несколько дней — и я покажу реальные паттерны."

    data = (
        f"Настроение: {[(str(r['entry_date']), round(float(r['am']), 1)) for r in mood_rows]}\n"
        f"Энергия: {[(str(r['entry_date']), round(float(r['ae']), 1)) for r in mood_rows]}\n"
        f"Сон (ч): {[(str(r['entry_date']), round(float(r['ah']), 1)) for r in sleep_rows]}\n"
        f"Привычки: {[(str(r['completed_date']), int(r['cnt'])) for r in habit_rows]}"
    )
    prompt = (
        f"Данные юзера за 7 дней:\n{data}\n\n"
        "Напиши недельный отчёт на русском (180-220 слов):\n"
        "1. Главный паттерн недели\n"
        "2. Одна конкретная корреляция из данных\n"
        "3. Два конкретных совета на следующую неделю\n"
        "Тон: дружелюбный, конкретный. Обращайся на 'ты'."
    )
    return await call_claude(prompt)


async def get_weekly_insight_cached(user_id: int, pool: asyncpg.Pool) -> tuple[str, bool]:
    """Returns (text, is_cached)."""
    week_start = date.today() - timedelta(days=6)
    async with pool.acquire() as c:
        cached = await c.fetchrow(
            "SELECT report_text FROM weekly_report_cache WHERE user_id=$1 AND week_start=$2",
            user_id, week_start,
        )
    if cached:
        return cached["report_text"], True

    text = await generate_weekly_insight(user_id, pool)
    async with pool.acquire() as c:
        await c.execute(
            "INSERT INTO weekly_report_cache (user_id, week_start, report_text) VALUES ($1,$2,$3) "
            "ON CONFLICT(user_id, week_start) DO UPDATE SET report_text=EXCLUDED.report_text",
            user_id, week_start, text,
        )
    return text, False
