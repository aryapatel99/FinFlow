from pydantic_settings import BaseSettings


class Settings(BaseSettings):
    app_name: str = "FinFlow API"
    app_version: str = "1.0.0"
    app_description: str = "Event-Driven Payment Processing Platform"

    class Config:
        env_file = ".env"


settings = Settings()