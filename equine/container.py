"""Process-wide Stable instance: a real SQLite store, or a mock in tests."""

import os
from pathlib import Path

from .adapters.memory_store import MockDocumentStore
from .adapters.sqlite_store import SqliteDocumentStore
from .stable import Stable

_stable: Stable | None = None

def data_dir() -> Path:
    path = Path(os.getenv("ALE_DATA_DIR", "data"))
    path.mkdir(parents=True, exist_ok=True)
    return path

def new_stable() -> Stable:
    return Stable(SqliteDocumentStore(str(data_dir() / "stable.db")))

def new_test_stable() -> Stable:
    return Stable(MockDocumentStore())

def get_stable() -> Stable:
    global _stable
    if _stable is None:
        _stable = new_stable()
    return _stable

def set_stable(stable: Stable) -> None:
    global _stable
    _stable = stable
