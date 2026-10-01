"""Helpers shared by the tools: horse lookup and date parsing."""

import datetime as dt

from equine.models import Horse
from equine.stable import Stable

def find_horse(stable: Stable, owner_id: str, name_or_id: str) -> Horse | None:
    """Finds a horse by id, exact name, then name prefix (case-insensitive)."""
    horses = stable.horses.list(owner_id)
    wanted = name_or_id.strip().lower()
    for match in (
        lambda h: h.id == name_or_id,
        lambda h: h.name.lower() == wanted,
        lambda h: h.name.lower().startswith(wanted),
    ):
        found = [h for h in horses if match(h)]
        if found:
            return found[0]
    return None

def unknown_horse(stable: Stable, owner_id: str, name: str) -> dict:
    names = [h.name for h in stable.horses.list(owner_id)]
    return {"error": f"Aucun cheval nommé « {name} ».", "known_horses": names}

def parse_date(value: str | None) -> dt.date:
    return dt.date.fromisoformat(value) if value else dt.date.today()
