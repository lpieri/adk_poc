"""Geofencing: which known place the user is at, and whether to wake Ale up."""

import datetime as dt
import math

from .models import Place, Presence

EARTH_RADIUS_M = 6_371_000
WAKEUP_COOLDOWN = dt.timedelta(hours=3)

def distance_m(lat1: float, lng1: float, lat2: float, lng2: float) -> float:
    phi1, phi2 = math.radians(lat1), math.radians(lat2)
    d_phi = math.radians(lat2 - lat1)
    d_lambda = math.radians(lng2 - lng1)
    a = math.sin(d_phi / 2) ** 2 + math.cos(phi1) * math.cos(phi2) * math.sin(d_lambda / 2) ** 2
    return 2 * EARTH_RADIUS_M * math.asin(math.sqrt(a))

def locate(places: list[Place], lat: float, lng: float) -> Place | None:
    """Returns the closest place whose radius contains the point."""
    inside = [(distance_m(lat, lng, p.lat, p.lng), p) for p in places]
    inside = [(d, p) for d, p in inside if d <= p.radius_m]
    return min(inside, key=lambda pair: pair[0])[1] if inside else None

def should_wake(previous: Presence | None, place: Place | None, now: dt.datetime) -> bool:
    """Wakes up on arrival at a place; GPS jitter cannot re-trigger it within the cooldown."""
    if place is None:
        return False
    if previous is None:
        return True
    if previous.place_id == place.id:
        return False
    recently_woken = previous.woken_at is not None and now - previous.woken_at < WAKEUP_COOLDOWN
    return not (recently_woken and previous.woken_place_id == place.id)
