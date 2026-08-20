from pydantic_settings import BaseSettings, SettingsConfigDict


class Settings(BaseSettings):

    # ==========================
    # Application Settings
    # ==========================

    app_name: str = "FinFlow"

    app_version: str = "1.0.0"

    app_description: str = (
        "FinFlow - Secure Payment Processing Platform"
    )


    # ==========================
    # CORS
    # ==========================

    cors_origins: str = (
        "http://localhost:5173,"
        "http://127.0.0.1:5173"
    )


    # ==========================
    # JWT Settings
    # ==========================

    jwt_secret_key: str

    jwt_algorithm: str = "HS256"


    # ==========================
    # Razorpay Settings
    # ==========================

    razorpay_key_id: str

    razorpay_key_secret: str


    # ==========================
    # Environment Configuration
    # ==========================

    model_config = SettingsConfigDict(
        env_file=".env",
        env_file_encoding="utf-8",
        extra="ignore",
    )


settings = Settings()