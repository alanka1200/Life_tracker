import logging
from contextlib import asynccontextmanager
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.db import init_db
from app.config import get_settings
from app.routes import (
    users_router, sleep_router, mood_router,
    nutrition_router, habits_router, goals_router,
    stats_router, reports_router, referral_router,
)

logging.basicConfig(
    level=logging.INFO,
    format="%(asctime)s %(name)s %(levelname)s %(message)s",
)
log = logging.getLogger(__name__)


@asynccontextmanager
async def lifespan(app: FastAPI):
    await init_db()
    yield


app = FastAPI(
    title="Life OS API",
    version="2.0.0",
    description="Персональный AI-трекер здоровья",
    lifespan=lifespan,
)

settings = get_settings()

app.add_middleware(
    CORSMiddleware,
    allow_origins=[settings.allowed_origins] if settings.allowed_origins != "*" else ["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)

# ── Routers ──────────────────────────────────────────────
app.include_router(users_router)
app.include_router(sleep_router)
app.include_router(mood_router)
app.include_router(nutrition_router)
app.include_router(habits_router)
app.include_router(goals_router)
app.include_router(stats_router)
app.include_router(reports_router)
app.include_router(referral_router)


# ── Health ────────────────────────────────────────────────
@app.get("/health", tags=["system"])
async def health():
    return {"status": "ok", "version": "2.0.0"}


if __name__ == "__main__":
    import uvicorn
    uvicorn.run("app.main:app", host="0.0.0.0", port=settings.port, reload=True)
