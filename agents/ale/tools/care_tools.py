"""Tools for the health record, workouts and the stable briefing."""

import datetime as dt

from google.adk.tools import ToolContext

from equine.briefing import stable_briefing
from equine.care import due_care
from equine.container import get_stable
from equine.models import Discipline, HealthEntry, HealthKind, Intensity, Workout

from .lookup import find_horse, parse_date, unknown_horse

def add_health_entry(
    horse_name: str,
    kind: HealthKind,
    label: str,
    tool_context: ToolContext,
    date: str | None = None,
    next_due: str | None = None,
    notes: str = "",
) -> dict:
    """Adds an entry to a horse's health record (vaccine, deworming, farrier, dentist, vet, osteo...).

    Args:
        horse_name: Name (or id) of the horse.
        kind: "vaccine", "deworming", "farrier", "dentist", "vet", "osteo" or "other".
        label: Short description, e.g. "Grippe + tétanos" or "Parage antérieurs".
        date: Date of the care, ISO format YYYY-MM-DD. Defaults to today.
        next_due: Next due date if known, ISO format YYYY-MM-DD.
        notes: Free notes (product, vet name, observations).
    """
    stable, owner = get_stable(), tool_context.user_id
    horse = find_horse(stable, owner, horse_name)
    if horse is None:
        return unknown_horse(stable, owner, horse_name)
    entry = HealthEntry(
        horse_id=horse.id, kind=kind, label=label, date=parse_date(date),
        next_due=dt.date.fromisoformat(next_due) if next_due else None, notes=notes,
    )
    return {"recorded": stable.health.put(owner, entry).model_dump(mode="json")}

def get_care_plan(horse_name: str, tool_context: ToolContext) -> dict:
    """Lists a horse's recurring care (vaccines, deworming, farrier, dentist, osteo) with due dates.

    Args:
        horse_name: Name (or id) of the horse.
    """
    stable, owner = get_stable(), tool_context.user_id
    horse = find_horse(stable, owner, horse_name)
    if horse is None:
        return unknown_horse(stable, owner, horse_name)
    items = due_care(stable.health.list(owner, horse.id), dt.date.today())
    return {"horse": horse.name, "care": [item.model_dump(mode="json") for item in items]}

def log_workout(
    horse_name: str,
    discipline: Discipline,
    duration_min: int,
    tool_context: ToolContext,
    intensity: Intensity = "moderate",
    notes: str = "",
) -> dict:
    """Records a riding or groundwork session done today.

    Args:
        horse_name: Name (or id) of the horse.
        discipline: "dressage", "jumping", "cross", "hack", "groundwork" or "lunging".
        duration_min: Duration in minutes.
        intensity: "light", "moderate" or "intense".
        notes: How it went, optional.
    """
    stable, owner = get_stable(), tool_context.user_id
    horse = find_horse(stable, owner, horse_name)
    if horse is None:
        return unknown_horse(stable, owner, horse_name)
    workout = Workout(horse_id=horse.id, discipline=discipline, duration_min=duration_min, intensity=intensity, notes=notes)
    return {"recorded": stable.workouts.put(owner, workout).model_dump(mode="json")}

def get_stable_briefing(tool_context: ToolContext) -> dict:
    """Snapshot of every horse for today: sessions already done, last session, care to plan and ration.

    Use it first when the user arrives at the stable.
    """
    today = dt.date.today()
    briefings = stable_briefing(get_stable(), tool_context.user_id, today)
    return {"today": today.isoformat(), "horses": [b.model_dump(mode="json") for b in briefings]}
