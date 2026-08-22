from pydantic_settings import BaseSettings


class Settings(BaseSettings):
    DATABASE_URL: str = ""
    LLM_API_KEY: str = ""
    LLM_MODEL_NAME: str = "gemini-flash-lite-latest"
    CLERK_JWKS_URL: str = ""

    model_config = {"env_file": ".env"}
