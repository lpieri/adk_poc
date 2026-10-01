"""SQLite adapter of DocumentStoreI (stdlib only)."""

import sqlite3
import threading

SCHEMA = """
CREATE TABLE IF NOT EXISTS documents (
    collection TEXT NOT NULL,
    id TEXT NOT NULL,
    owner_id TEXT NOT NULL,
    parent_id TEXT,
    body TEXT NOT NULL,
    created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (collection, id)
);
CREATE INDEX IF NOT EXISTS documents_owner ON documents (collection, owner_id, parent_id);
"""

class SqliteDocumentStore:
    def __init__(self, path: str) -> None:
        self._lock = threading.Lock()
        self._db = sqlite3.connect(path, check_same_thread=False)
        self._db.executescript(SCHEMA)

    def put(self, collection: str, doc_id: str, owner_id: str, parent_id: str | None, body: str) -> None:
        with self._lock, self._db:
            self._db.execute(
                "INSERT INTO documents (collection, id, owner_id, parent_id, body) VALUES (?, ?, ?, ?, ?) "
                "ON CONFLICT (collection, id) DO UPDATE SET body = excluded.body",
                (collection, doc_id, owner_id, parent_id, body),
            )

    def get(self, collection: str, doc_id: str, owner_id: str) -> str | None:
        with self._lock:
            row = self._db.execute(
                "SELECT body FROM documents WHERE collection = ? AND id = ? AND owner_id = ?",
                (collection, doc_id, owner_id),
            ).fetchone()
        return row[0] if row else None

    def list(self, collection: str, owner_id: str, parent_id: str | None = None) -> list[str]:
        query = "SELECT body FROM documents WHERE collection = ? AND owner_id = ?"
        params: tuple = (collection, owner_id)
        if parent_id is not None:
            query += " AND parent_id = ?"
            params += (parent_id,)
        with self._lock:
            rows = self._db.execute(query + " ORDER BY created_at, rowid", params).fetchall()
        return [row[0] for row in rows]

    def delete(self, collection: str, doc_id: str, owner_id: str) -> bool:
        with self._lock, self._db:
            cursor = self._db.execute(
                "DELETE FROM documents WHERE (collection = ? AND id = ? OR parent_id = ?) AND owner_id = ?",
                (collection, doc_id, doc_id, owner_id),
            )
        return cursor.rowcount > 0
