from io import BytesIO
from datetime import datetime
import asyncpg


async def generate_monthly_pdf(user_id: int, pool: asyncpg.Pool) -> bytes:
    try:
        from reportlab.lib.pagesizes import A4
        from reportlab.lib.styles import ParagraphStyle
        from reportlab.lib import colors
        from reportlab.platypus import SimpleDocTemplate, Paragraph, Spacer, Table, TableStyle, HRFlowable
        from reportlab.lib.units import cm
    except ImportError:
        raise RuntimeError("reportlab not installed: pip install reportlab")

    month_start = datetime.now().replace(day=1).date()
    buf = BytesIO()
    doc = SimpleDocTemplate(buf, pagesize=A4, leftMargin=2*cm, rightMargin=2*cm, topMargin=2*cm, bottomMargin=2*cm)

    green = colors.HexColor("#2d4a2b")
    sage  = colors.HexColor("#7d8471")

    title_s = ParagraphStyle("T", fontSize=24, textColor=green, spaceAfter=4, fontName="Helvetica-Bold")
    sub_s   = ParagraphStyle("S", fontSize=10, textColor=sage,  spaceAfter=4)
    h2_s    = ParagraphStyle("H2", fontSize=14, textColor=green, spaceBefore=16, spaceAfter=8, fontName="Helvetica-Bold")
    body_s  = ParagraphStyle("B", fontSize=10, textColor=colors.HexColor("#2a2c28"), leading=16)

    async with pool.acquire() as c:
        mood  = await c.fetchrow("SELECT AVG(mood) am, AVG(energy) ae, AVG(anxiety) aa, COUNT(*) cnt FROM mood_entries WHERE user_id=$1 AND entry_date>=$2", user_id, month_start)
        sleep = await c.fetchrow("SELECT AVG(duration_h) ah, AVG(quality) aq, COUNT(*) cnt FROM sleep_entries WHERE user_id=$1 AND entry_date>=$2", user_id, month_start)
        hcnt  = await c.fetchval("SELECT COUNT(*) FROM habit_logs hl JOIN habits h ON h.id=hl.habit_id WHERE hl.user_id=$1 AND hl.completed_date>=$2", user_id, month_start)
        meals = await c.fetchrow("SELECT SUM(kcal) sk, COUNT(*) cnt FROM meals WHERE user_id=$1 AND entry_date>=$2", user_id, month_start)
        top_h = await c.fetch("SELECT h.emoji, h.name, (SELECT COUNT(*) FROM habit_logs hl WHERE hl.habit_id=h.id AND hl.completed_date>=$2) cnt FROM habits h WHERE h.user_id=$1 AND h.is_active=TRUE ORDER BY cnt DESC LIMIT 5", user_id, month_start)

    story = [
        Paragraph("Life OS", title_s),
        Paragraph(f"Ежемесячный отчёт · {datetime.now().strftime('%B %Y')}", sub_s),
        HRFlowable(width="100%", thickness=1, color=colors.HexColor("#d4e8da"), spaceAfter=16),
        Paragraph("Итоги месяца", h2_s),
    ]

    tbl_data = [
        ["Метрика", "Значение", "Записей"],
        ["Настроение", f"{float(mood['am'] or 0):.1f}/10", str(mood["cnt"] or 0)],
        ["Энергия",    f"{float(mood['ae'] or 0):.1f}/10", ""],
        ["Тревога",    f"{float(mood['aa'] or 0):.1f}/10", ""],
        ["Сон",        f"{float(sleep['ah'] or 0):.1f} ч/ночь", str(sleep["cnt"] or 0)],
        ["Качество сна", f"{float(sleep['aq'] or 0):.1f}/10", ""],
        ["Привычек выполнено", str(hcnt or 0), ""],
        ["Блюд записано", str(meals["cnt"] or 0), f"{int(meals['sk'] or 0)} ккал"],
    ]
    tbl = Table(tbl_data, colWidths=[8*cm, 5*cm, 4*cm])
    tbl.setStyle(TableStyle([
        ("BACKGROUND", (0, 0), (-1, 0), green),
        ("TEXTCOLOR",  (0, 0), (-1, 0), colors.white),
        ("FONTNAME",   (0, 0), (-1, 0), "Helvetica-Bold"),
        ("FONTSIZE",   (0, 0), (-1, -1), 10),
        ("ROWBACKGROUNDS", (0, 1), (-1, -1), [colors.white, colors.HexColor("#f0f7f2")]),
        ("GRID",       (0, 0), (-1, -1), 0.5, colors.HexColor("#d4e8da")),
        ("TOPPADDING",    (0, 0), (-1, -1), 7),
        ("BOTTOMPADDING", (0, 0), (-1, -1), 7),
        ("LEFTPADDING",   (0, 0), (-1, -1), 10),
    ]))
    story.append(tbl)

    if top_h:
        story.append(Paragraph("Топ привычек месяца", h2_s))
        for i, h in enumerate(top_h):
            story.append(Paragraph(f"{i+1}. {h['emoji']} {h['name']} — {h['cnt']} раз", body_s))

    story += [
        Spacer(1, 24),
        HRFlowable(width="100%", thickness=1, color=colors.HexColor("#d4e8da")),
        Spacer(1, 8),
        Paragraph("Сгенерировано Life OS", sub_s),
    ]
    doc.build(story)
    return buf.getvalue()
