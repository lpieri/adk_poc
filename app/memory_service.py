"""SQLite-backed ADK memory service: conversations and explicit facts survive restarts.

Search is keyword based (accents and case ignored), like ADK's InMemoryMemoryService.
"""

import datetime as dt
import re
import sqlite3
import threading
import unicodedata
from typing import Mapping, Sequence
from uuid import uuid4

from google.adk.events import Event
from google.adk.memory import BaseMemoryService
from google.adk.memory.base_memory_service import SearchMemoryResponse
from google.adk.memory.memory_entry import MemoryEntry
from google.adk.sessions import Session
from google.genai import types

SCHEMA = """
CREATE TABLE IF NOT EXISTS memories (
    id TEXT PRIMARY KEY,
    app_name TEXT NOT NULL,
    user_id TEXT NOT NULL,
    author TEXT,
    text TEXT NOT NULL,
    timestamp TEXT NOT NULL
);
CREATE INDEX IF NOT EXISTS memories_user ON memories (app_name, user_id);
"""
MAX_RESULTS = 10
MIN_WORD_LENGTH = 3

def keywords(text: str) -> set[str]:
    plain = unicodedata.normalize("NFKD", text.lower()).encode("ascii", "ignore").decode()
    return {word for word in re.findall(r"[a-z0-9]+", plain) if len(word) >= MIN_WORD_LENGTH}

def event_text(event: Event) -> str:
    if not event.content or not event.content.parts:
        return ""
    return " ".join(part.text for part in event.content.parts if part.text and not part.thought)

class SqliteMemoryService(BaseMemoryService):
    def __init__(self, path: str) -> None:
        self._lock = threading.Lock()
        self._db = sqlite3.connect(path, check_same_thread=False)
        self._db.executescript(SCHEMA)

    def _insert(self, rows: list[tuple[str, str, str, str | None, str, str]]) -> None:
        with self._lock, self._db:
            self._db.executemany(
                "INSERT OR IGNORE INTO memories (id, app_name, user_id, author, text, timestamp) VALUES (?, ?, ?, ?, ?, ?)",
                rows,
            )

    async def add_session_to_memory(self, session: Session) -> None:
        await self.add_events_to_memory(app_name=session.app_name, user_id=session.user_id, events=session.events)

    async def add_events_to_memory(
        self,
        *,
        app_name: str,
        user_id: str,
        events: Sequence[Event],
        session_id: str | None = None,
        custom_metadata: Mapping[str, object] | None = None,
    ) -> None:
        rows = [
            (event.id, app_name, user_id, event.author, text, dt.datetime.fromtimestamp(event.timestamp).isoformat())
            for event in events
            if (text := event_text(event))
        ]
        self._insert(rows)

    async def add_memory(
        self,
        *,
        app_name: str,
        user_id: str,
        memories: Sequence[MemoryEntry],
        custom_metadata: Mapping[str, object] | None = None,
    ) -> None:
        now = dt.datetime.now().isoformat()
        rows = [
            (memory.id or uuid4().hex, app_name, user_id, memory.author, text, memory.timestamp or now)
            for memory in memories
            if (text := " ".join(p.text for p in memory.content.parts or [] if p.text))
        ]
        self._insert(rows)

    async def search_memory(self, *, app_name: str, user_id: str, query: str) -> SearchMemoryResponse:
        wanted = keywords(query)
        with self._lock:
            rows = self._db.execute(
                "SELECT author, text, timestamp FROM memories WHERE app_name = ? AND user_id = ? ORDER BY timestamp",
                (app_name, user_id),
            ).fetchall()
        scored = [(len(wanted & keywords(text)), author, text, ts) for author, text, ts in rows]
        best = sorted((row for row in scored if row[0]), key=lambda row: -row[0])[:MAX_RESULTS]
        return SearchMemoryResponse(
            memories=[
                MemoryEntry(content=types.Content(role="user", parts=[types.Part(text=text)]), author=author, timestamp=ts)
                for _, author, text, ts in best
            ]
        )
