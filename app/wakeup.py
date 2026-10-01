"""Location wakeups: when the user arrives at a known place, Ale speaks first."""

import datetime as dt

from agents.ale.protocol import WAKEUP_MARKER
from equine.geofence import locate, should_wake
from equine.models import Place, Presence
from equine.stable import Stable

from .conversation import open_session, run_turn
from .runtime import Runtime
from .schemas import WakeupResponse

PLACE_KIND_LABELS = {"stable": "l'écurie", "home": "la maison", "other": "un lieu enregistré"}

def wakeup_message(place: Place, now: dt.datetime) -> str:
    return (
        f"{WAKEUP_MARKER} L'utilisatrice vient d'arriver à « {place.name} » "
        f"({PLACE_KIND_LABELS[place.kind]}) à {now:%H:%M}. Prends l'initiative."
    )

async def wake_up(runtime: Runtime, user_id: str, session_id: str | None, place: Place, now: dt.datetime) -> WakeupResponse:
    session = await open_session(runtime, user_id, session_id)
    if session is None:
        session = await open_session(runtime, user_id, None)
    turn = await run_turn(runtime, user_id, session, wakeup_message(place, now))
    return WakeupResponse(triggered=True, place=place, session_id=turn.session_id, reply=turn.reply, mood=turn.mood)

def record_presence(stable: Stable, user_id: str, place: Place | None, now: dt.datetime, woke: bool) -> None:
    previous = stable.presences.get(user_id, user_id)
    presence = Presence(
        owner_id=user_id,
        place_id=place.id if place else None,
        seen_at=now,
        woken_place_id=place.id if woke and place else previous.woken_place_id if previous else None,
        woken_at=now if woke else previous.woken_at if previous else None,
    )
    stable.presences.put(user_id, presence)

async def on_position(runtime: Runtime, stable: Stable, user_id: str, session_id: str | None, lat: float, lng: float) -> WakeupResponse:
    now = dt.datetime.now()
    place = locate(stable.places.list(user_id), lat, lng)
    if place is None or not should_wake(stable.presences.get(user_id, user_id), place, now):
        record_presence(stable, user_id, place, now, woke=False)
        return WakeupResponse(triggered=False, place=place)
    response = await wake_up(runtime, user_id, session_id, place, now)
    record_presence(stable, user_id, place, now, woke=True)
    return response
