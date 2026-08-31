from pydantic_settings import BaseSettings


class Settings(BaseSettings):
    DATABASE_URL: str = ""
    LLM_API_KEY: str = ""
    LLM_MODEL_NAME: str = "gemini-flash-lite-latest"
    EMBEDDING_MODEL_NAME: str = "models/text-embedding-004"
    CLERK_JWKS_URL: str = ""
    ENCRYPTION_KEY: str = ""
    RAG_TOP_K: int = 4
    ADMIN_API_KEY: str = ""

    model_config = {"env_file": ".env"}
