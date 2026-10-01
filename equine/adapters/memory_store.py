"""In-memory mock of DocumentStoreI, for tests."""

class MockDocumentStore:
    def __init__(self) -> None:
        self._docs: dict[tuple[str, str], tuple[str, str | None, str]] = {}

    def put(self, collection: str, doc_id: str, owner_id: str, parent_id: str | None, body: str) -> None:
        self._docs[(collection, doc_id)] = (owner_id, parent_id, body)

    def get(self, collection: str, doc_id: str, owner_id: str) -> str | None:
        doc = self._docs.get((collection, doc_id))
        return doc[2] if doc and doc[0] == owner_id else None

    def list(self, collection: str, owner_id: str, parent_id: str | None = None) -> list[str]:
        return [
            body
            for (name, _), (owner, parent, body) in self._docs.items()
            if name == collection and owner == owner_id and (parent_id is None or parent == parent_id)
        ]

    def delete(self, collection: str, doc_id: str, owner_id: str) -> bool:
        keys = [
            key
            for key, (owner, parent, _) in self._docs.items()
            if owner == owner_id and (key == (collection, doc_id) or parent == doc_id)
        ]
        for key in keys:
            del self._docs[key]
        return bool(keys)
