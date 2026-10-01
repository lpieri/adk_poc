import datetime as dt

import pytest

from agents.ale.protocol import is_wakeup, split_mood, WAKEUP_MARKER
from equine.adapters.sqlite_store import SqliteDocumentStore
from equine.care import due_care
from equine.container import new_test_stable
from equine.geofence import WAKEUP_COOLDOWN, distance_m, locate, should_wake
from equine.models import HealthEntry, Horse, Place, Presence, WeightEntry
from equine.stable import Stable

TODAY = dt.date(2026, 10, 1)
NOW = dt.datetime(2026, 10, 1, 18, 0)
STABLE_PLACE = Place(owner_id="u1", name="Écurie du Lac", lat=45.0, lng=5.0, radius_m=200)

def test_due_care_statuses():
    entries = [
        HealthEntry(horse_id="h", kind="farrier", date=TODAY - dt.timedelta(days=60), label="Parage"),
        HealthEntry(horse_id="h", kind="vaccine", date=TODAY - dt.timedelta(days=10), label="Grippe", next_due=TODAY + dt.timedelta(days=5)),
    ]
    care = {item.kind: item for item in due_care(entries, TODAY)}
    assert care["farrier"].status == "overdue"
    assert care["farrier"].days_left == -11
    assert care["vaccine"].status == "due_soon"
    assert care["dentist"].status == "unknown"
    assert due_care(entries, TODAY)[0].kind == "farrier"

def test_distance_and_locate():
    assert distance_m(45.0, 5.0, 45.001, 5.0) == pytest.approx(111, abs=1)
    assert locate([STABLE_PLACE], 45.001, 5.0) == STABLE_PLACE
    assert locate([STABLE_PLACE], 45.01, 5.0) is None

def test_should_wake_on_arrival_only():
    assert should_wake(None, STABLE_PLACE, NOW)
    assert not should_wake(None, None, NOW)
    there = Presence(owner_id="u1", place_id=STABLE_PLACE.id, seen_at=NOW)
    assert not should_wake(there, STABLE_PLACE, NOW)

def test_should_wake_ignores_gps_jitter_within_cooldown():
    left = Presence(owner_id="u1", place_id=None, seen_at=NOW, woken_place_id=STABLE_PLACE.id, woken_at=NOW)
    assert not should_wake(left, STABLE_PLACE, NOW + dt.timedelta(minutes=5))
    assert should_wake(left, STABLE_PLACE, NOW + WAKEUP_COOLDOWN)

def test_split_mood():
    assert split_mood("[mood:worried] Appelle le véto.") == ("worried", "Appelle le véto.")
    assert split_mood("[MOOD:Happy]Bravo") == ("happy", "Bravo")
    assert split_mood("[mood:angry] Grr") == ("idle", "Grr")
    assert split_mood("Sans balise") == ("idle", "Sans balise")
    assert is_wakeup(f"{WAKEUP_MARKER} arrivée")

@pytest.fixture(params=["mock", "sqlite"])
def stable(request) -> Stable:
    return new_test_stable() if request.param == "mock" else Stable(SqliteDocumentStore(":memory:"))

def test_store_is_scoped_by_owner(stable):
    horse = stable.horses.put("u1", Horse(owner_id="u1", name="Tornade", weight_kg=520))
    assert stable.horses.get("u1", horse.id) == horse
    assert stable.horses.get("u2", horse.id) is None
    assert stable.horses.list("u2") == []

def test_store_upserts_and_cascades(stable):
    horse = stable.horses.put("u1", Horse(owner_id="u1", name="Tornade", weight_kg=520))
    stable.horses.put("u1", horse.model_copy(update={"weight_kg": 530}))
    stable.weights.put("u1", WeightEntry(horse_id=horse.id, weight_kg=530))
    assert [h.weight_kg for h in stable.horses.list("u1")] == [530]
    assert len(stable.weights.list("u1", horse.id)) == 1
    assert stable.horses.delete("u1", horse.id)
    assert stable.weights.list("u1", horse.id) == []
    assert not stable.horses.delete("u1", horse.id)
