import uuid
from typing import Annotated

import jwt
from fastapi import Depends, HTTPException, status
from fastapi.security import HTTPAuthorizationCredentials, HTTPBearer

from app.core.config import Settings

settings: Settings = Settings()
_bearer = HTTPBearer()


def _get_jwks() -> dict:
    import httpx

    response = httpx.get(settings.CLERK_JWKS_URL, timeout=5.0)
    response.raise_for_status()
    return response.json()


def verify_clerk_token(credentials: Annotated[HTTPAuthorizationCredentials, Depends(_bearer)]) -> str:
    token: str = credentials.credentials
    try:
        jwks = _get_jwks()
        signing_key = jwt.algorithms.RSAAlgorithm.from_jwk(jwks["keys"][0])
        payload: dict = jwt.decode(
            token,
            key=signing_key,
            algorithms=["RS256"],
            options={"verify_aud": False},
        )
        sub: str | None = payload.get("sub")
        if sub is None:
            raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Token missing subject claim")
        return sub
    except jwt.ExpiredSignatureError:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Token has expired")
    except jwt.InvalidTokenError as exc:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail=f"Invalid token: {exc}")
    except Exception as e:
        print(f"Auth error: {e}")
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Could not validate credentials")
