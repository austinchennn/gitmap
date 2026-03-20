import os
from pydantic_settings import BaseSettings
from dotenv import load_dotenv

load_dotenv()


class Settings(BaseSettings):
    github_token: str = os.getenv("GITHUB_TOKEN", "")
    redis_url: str = os.getenv("REDIS_URL", "redis://localhost:6379")
    cache_ttl: int = int(os.getenv("CACHE_TTL", "86400"))
    cors_origins: list[str] = ["http://localhost:3000", "http://127.0.0.1:3000"]

    class Config:
        env_file = ".env"


settings = Settings()
