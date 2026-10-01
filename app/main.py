"""FastAPI app exposing Ale through the ADK Runner."""

from dotenv import load_dotenv

load_dotenv()

from fastapi import FastAPI  # noqa: E402

from .routes import chat, horses, places  # noqa: E402

app = FastAPI(title="Ale — agent équitation", version="0.2.0")
app.include_router(chat.router)
app.include_router(horses.router)
app.include_router(places.router)
