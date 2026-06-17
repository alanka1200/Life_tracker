from pydantic_settings import BaseSettings
from functools import lru_cache


class Settings(BaseSettings):
    database_url: str = ""
    bot_token: str = ""
    anthropic_api_key: str = ""
    webapp_url: str = "https://your-twa.onrender.com"
    api_url: str = "http://localhost:8000"
    allowed_origins: str = "*"
    port: int = 8000

    model_config = {"env_file": ".env", "env_file_encoding": "utf-8"}


@lru_cache
def get_settings() -> Settings:
    return Settings()
