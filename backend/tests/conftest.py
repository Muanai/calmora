import pytest
from httpx import AsyncClient, ASGITransport
from app.main import app
import jwt
from datetime import datetime, timedelta

@pytest.fixture
def mock_clerk_token():
    """Generates a mock JWT token that simulates a Clerk token."""
    payload = {
        "exp": (datetime.utcnow() + timedelta(hours=1)).timestamp(),
        "nbf": datetime.utcnow().timestamp(),
        "iat": datetime.utcnow().timestamp(),
        "sub": "user_mock123",
        "azp": "http://localhost:8081"
    }
    # Create an unverified token for testing purposes if the backend accepts it in test mode,
    # or mock the validation function in the app.
    token = jwt.encode(payload, "secret", algorithm="HS256")
    return token

@pytest.fixture
def mock_auth_middleware(monkeypatch):
    """Mocks the JWT verification in the backend to bypass JWKS validation."""
    import uuid
    def mock_verify(*args, **kwargs):
        # We need a valid UUID format string since the system parses sub as UUID.
        return uuid.UUID("12345678-1234-5678-1234-567812345678")
    
    monkeypatch.setattr("app.core.security.verify_clerk_token", mock_verify)

import pytest_asyncio

@pytest_asyncio.fixture
async def async_client():
    transport = ASGITransport(app=app)
    async with AsyncClient(transport=transport, base_url="http://test") as client:
        yield client
