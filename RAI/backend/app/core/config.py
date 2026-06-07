from pydantic_settings import BaseSettings

class Settings(BaseSettings):
    MONGO_URI: str
    DB_NAME: str = "gymmer"
    TEST_DB_NAME: str = "gymmer_test"
    
    ORV_API_URL: str = "http://127.0.0.1:8001"
    
    # Dodane MQTT nastavitve (to reši "extra_forbidden" napako)
    MQTT_BROKER_HOST: str = "127.0.0.1"
    MQTT_PORT: int = 1883

    class Config:
        env_file = ".env"

settings = Settings()