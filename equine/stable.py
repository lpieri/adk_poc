"""Typed repositories on top of the DocumentStoreI port."""

from typing import Callable, Generic, TypeVar

from pydantic import BaseModel

from .models import HealthEntry, Horse, Place, Presence, WeightEntry, Workout
from .ports import DocumentStoreI

T = TypeVar("T", bound=BaseModel)

class Collection(Generic[T]):
    def __init__(self, store: DocumentStoreI, name: str, model: type[T], key: Callable[[T], str], parent: Callable[[T], str | None]) -> None:
        self._store, self._name, self._model = store, name, model
        self._key, self._parent = key, parent

    def put(self, owner_id: str, item: T) -> T:
        self._store.put(self._name, self._key(item), owner_id, self._parent(item), item.model_dump_json())
        return item

    def get(self, owner_id: str, item_id: str) -> T | None:
        body = self._store.get(self._name, item_id, owner_id)
        return self._model.model_validate_json(body) if body else None

    def list(self, owner_id: str, parent_id: str | None = None) -> list[T]:
        return [self._model.model_validate_json(body) for body in self._store.list(self._name, owner_id, parent_id)]

    def delete(self, owner_id: str, item_id: str) -> bool:
        return self._store.delete(self._name, item_id, owner_id)

class Stable:
    """Everything Ale knows about a user's horses and places."""

    def __init__(self, store: DocumentStoreI) -> None:
        self.horses = Collection(store, "horses", Horse, lambda h: h.id, lambda _: None)
        self.health = Collection(store, "health", HealthEntry, lambda e: e.id, lambda e: e.horse_id)
        self.weights = Collection(store, "weights", WeightEntry, lambda e: e.id, lambda e: e.horse_id)
        self.workouts = Collection(store, "workouts", Workout, lambda w: w.id, lambda w: w.horse_id)
        self.places = Collection(store, "places", Place, lambda p: p.id, lambda _: None)
        self.presences = Collection(store, "presences", Presence, lambda p: p.owner_id, lambda _: None)
