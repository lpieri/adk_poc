"""FastAPI app exposing Ale through the ADK Runner."""

import os

from dotenv import load_dotenv

load_dotenv()

from fastapi import FastAPI  # noqa: E402
from fastapi.middleware.cors import CORSMiddleware  # noqa: E402

from .routes import chat, horses, places  # noqa: E402

def cors_origins(raw: str) -> list[str]:
    """Parses ALE_CORS_ORIGINS, a comma-separated list of allowed front origins."""
    return [origin.strip().rstrip("/") for origin in raw.split(",") if origin.strip()]

app = FastAPI(title="Ale — agent équitation", version="0.2.0")
app.add_middleware(
    CORSMiddleware,
    allow_origins=cors_origins(os.getenv("ALE_CORS_ORIGINS", "")),
    allow_methods=["GET", "POST", "PUT", "DELETE"],
    allow_headers=["Content-Type"],
)
app.include_router(chat.router)
app.include_router(horses.router)
app.include_router(places.router)
