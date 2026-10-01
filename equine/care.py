"""Due-care computation from a horse's health record."""

import datetime as dt

from .models import CareItem, HealthEntry, HealthKind

DEFAULT_INTERVAL_DAYS: dict[HealthKind, int] = {
    "vaccine": 182,
    "deworming": 120,
    "farrier": 49,
    "dentist": 365,
    "osteo": 365,
}
CARE_LABELS: dict[HealthKind, str] = {
    "vaccine": "Rappel de vaccin (grippe / rhino)",
    "deworming": "Vermifuge ou coproscopie",
    "farrier": "Maréchal-ferrant / parage",
    "dentist": "Contrôle dentaire",
    "osteo": "Ostéopathe",
}
DUE_SOON_DAYS = 14

def care_status(days_left: int | None) -> str:
    if days_left is None:
        return "unknown"
    if days_left < 0:
        return "overdue"
    if days_left <= DUE_SOON_DAYS:
        return "due_soon"
    return "ok"

def next_due(entries: list[HealthEntry], kind: HealthKind) -> dt.date | None:
    of_kind = sorted((e for e in entries if e.kind == kind), key=lambda e: e.date)
    if not of_kind:
        return None
    last = of_kind[-1]
    return last.next_due or last.date + dt.timedelta(days=DEFAULT_INTERVAL_DAYS[kind])

def due_care(entries: list[HealthEntry], today: dt.date) -> list[CareItem]:
    """Lists recurring care with its status, the most urgent first."""
    items = []
    for kind, label in CARE_LABELS.items():
        due = next_due(entries, kind)
        days_left = (due - today).days if due else None
        items.append(CareItem(kind=kind, label=label, due_date=due, status=care_status(days_left), days_left=days_left))
    return sorted(items, key=lambda item: item.days_left if item.days_left is not None else 10_000)
