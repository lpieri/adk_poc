"""FastAPI dependencies; tests override them with app.dependency_overrides."""

from fastapi import HTTPException

from equine.container import get_stable
from equine.models import Horse
from equine.stable import Stable

from .runtime import Runtime, new_runtime

_runtime: Runtime | None = None

async def runtime_dep() -> Runtime:
    global _runtime
    if _runtime is None:
        _runtime = new_runtime()
    return _runtime

def stable_dep() -> Stable:
    return get_stable()

def require_horse(stable: Stable, user_id: str, horse_id: str) -> Horse:
    horse = stable.horses.get(user_id, horse_id)
    if horse is None:
        raise HTTPException(status_code=404, detail="Cheval introuvable.")
    return horse
