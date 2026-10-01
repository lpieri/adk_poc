"""Storage port: the domain only knows this interface, never a database SDK."""

from typing import Protocol

class DocumentStoreI(Protocol):
    """Stores JSON documents grouped by collection, scoped to an owner."""

    def put(self, collection: str, doc_id: str, owner_id: str, parent_id: str | None, body: str) -> None: ...

    def get(self, collection: str, doc_id: str, owner_id: str) -> str | None: ...

    def list(self, collection: str, owner_id: str, parent_id: str | None = None) -> list[str]: ...

    def delete(self, collection: str, doc_id: str, owner_id: str) -> bool: ...
