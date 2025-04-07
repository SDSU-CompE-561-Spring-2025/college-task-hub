from pydantic_settings import BaseSettings, SettingsConfigDict
from functools import lru_cache
from dotenv import load_dotenv

# Load the .env file
load_dotenv()

class Settings(BaseSettings):
    """
    Settings class to hold configuration values loaded from the .env file.
    """
    DATABASE_URL: str

    model_config = SettingsConfigDict(env_file=".env", env_file_encoding="utf-8")


@lru_cache
def get_settings() -> Settings:
    """
    Get the settings instance, cached to avoid reloading the .env file multiple times.
    """
    return Settings()

settings = get_settings()
