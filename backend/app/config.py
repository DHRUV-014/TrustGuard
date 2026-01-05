from functools import lru_cache
from pydantic_settings import BaseSettings, SettingsConfigDict
from pydantic import Field

class Settings(BaseSettings):
    # Use validation_alias instead of env
    firebase_service_account_path: str = Field(validation_alias="FIREBASE_SERVICE_ACCOUNT_PATH")
    firebase_project_id: str = Field(validation_alias="FIREBASE_PROJECT_ID")
    firebase_storage_bucket: str = Field(validation_alias="FIREBASE_STORAGE_BUCKET")

    # This tells Pydantic to look in your .env file
    model_config = SettingsConfigDict(env_file=".env")

@lru_cache()
def get_settings():
    return Settings()

settings = get_settings()