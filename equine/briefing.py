"""Aggregated views of a horse: full detail for the UI, briefing for the agent."""

import datetime as dt

from pydantic import BaseModel

from .care import due_care
from .models import CareItem, HealthEntry, Horse, Ration, WeightEntry, Workout
from .nutrition import compute_ration
from .stable import Stable

RECENT_WORKOUT_DAYS = 30

class HorseDetail(BaseModel):
    horse: Horse
    health: list[HealthEntry]
    weights: list[WeightEntry]
    workouts: list[Workout]
    due_care: list[CareItem]
    ration: Ration

class HorseBriefing(BaseModel):
    horse_id: str
    name: str
    conditions: list[str]
    worked_today: list[Workout]
    last_workout: Workout | None
    care_to_plan: list[CareItem]
    ration: Ration

def horse_ration(horse: Horse) -> Ration:
    return compute_ration(horse.weight_kg, horse.workload, horse.conditions, horse.body_condition)

def horse_detail(stable: Stable, owner_id: str, horse: Horse, today: dt.date) -> HorseDetail:
    health = sorted(stable.health.list(owner_id, horse.id), key=lambda e: e.date, reverse=True)
    since = dt.datetime.combine(today - dt.timedelta(days=RECENT_WORKOUT_DAYS), dt.time())
    workouts = [w for w in stable.workouts.list(owner_id, horse.id) if w.date >= since]
    return HorseDetail(
        horse=horse,
        health=health,
        weights=sorted(stable.weights.list(owner_id, horse.id), key=lambda e: e.date),
        workouts=sorted(workouts, key=lambda w: w.date, reverse=True),
        due_care=due_care(health, today),
        ration=horse_ration(horse),
    )

def horse_briefing(stable: Stable, owner_id: str, horse: Horse, today: dt.date) -> HorseBriefing:
    workouts = sorted(stable.workouts.list(owner_id, horse.id), key=lambda w: w.date)
    care = due_care(stable.health.list(owner_id, horse.id), today)
    return HorseBriefing(
        horse_id=horse.id,
        name=horse.name,
        conditions=horse.conditions,
        worked_today=[w for w in workouts if w.date.date() == today],
        last_workout=workouts[-1] if workouts else None,
        care_to_plan=[item for item in care if item.status != "ok"],
        ration=horse_ration(horse),
    )

def stable_briefing(stable: Stable, owner_id: str, today: dt.date) -> list[HorseBriefing]:
    return [horse_briefing(stable, owner_id, horse, today) for horse in stable.horses.list(owner_id)]
