from pydantic_settings import BaseSettings


class Settings(BaseSettings):
    app_name: str = "Виртуальный музей Эрика Батуева"
    debug: bool = True
    api_prefix: str = "/api/v1"

    # База данных
    database_url: str = "postgresql+asyncpg://museum:museum_pass@localhost:5432/museum_db"

    # JWT
    secret_key: str = "CHANGE_ME_IN_PRODUCTION_USE_RANDOM_SECRET"
    algorithm: str = "HS256"
    access_token_expire_minutes: int = 60 * 24  # 24 часа

    # OpenAI (для генерации тестов)
    openai_api_key: str = ""

    # Telegram Bot
    telegram_bot_token: str = ""

    # CORS
    cors_origins: list[str] = ["http://localhost:5173", "http://localhost:3000"]

    class Config:
        env_file = ".env"
        env_file_encoding = "utf-8"


settings = Settings()
