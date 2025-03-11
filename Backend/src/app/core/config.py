from pydantic_settings import BaseSettings, SettingsConfigDict
from functools import lru_cache
from dotenv import load_dotenv

# Load the .env file
load_dotenv()

class Settings(BaseSettings):
    # The database URL which gets populated from the .env file
    DATABASE_URL: str 

    # The model config which automatically loads the .env file and populates the variables
    model_config = SettingsConfigDict(env_file = ".env", env_file_encoding = "utf-8") 

@lru_cache # Cache the settings to avoid reading the .env file multiple times
def get_settings() -> Settings:
    return Settings()

settings = get_settings()