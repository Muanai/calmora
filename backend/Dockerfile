FROM python:3.12-slim

# Install system dependencies
RUN apt-get update && apt-get install -y --no-install-recommends \
    curl \
    ca-certificates \
    && rm -rf /var/lib/apt/lists/*

# Install uv (fast python package manager)
COPY --from=ghcr.io/astral-sh/uv:latest /uv /uvx /bin/

WORKDIR /app

# Copy dependency files first (for caching)
COPY pyproject.toml uv.lock ./

# Sync dependencies (creates .venv)
RUN uv sync --frozen --no-dev

# Copy application source code
COPY . .

# Expose the application port
EXPOSE 8000

# Start the FastAPI application
CMD ["uv", "run", "uvicorn", "app.main:app", "--host", "0.0.0.0", "--port", "8000"]
