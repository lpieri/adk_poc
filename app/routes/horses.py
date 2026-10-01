"""Horse file endpoints: profile, health record, weights, workouts."""

import datetime as dt
from typing import Annotated

from fastapi import APIRouter, Depends, HTTPException, Response

from equine.briefing import HorseDetail, horse_detail
from equine.models import HealthEntry, Horse, WeightEntry, Workout
from equine.stable import Stable

from ..deps import require_horse, stable_dep
from ..schemas import OwnedHealthEntryInput, OwnedHorseInput, OwnedWorkoutInput, WeightRequest

router = APIRouter(prefix="/horses")
StableDep = Annotated[Stable, Depends(stable_dep)]
NO_CONTENT = Response(status_code=204)

@router.get("", response_model=list[Horse])
async def list_horses(user_id: str, stable: StableDep) -> list[Horse]:
    return sorted(stable.horses.list(user_id), key=lambda h: h.name.lower())

@router.post("", response_model=Horse, status_code=201)
async def create_horse(body: OwnedHorseInput, stable: StableDep) -> Horse:
    return stable.horses.put(body.user_id, Horse(owner_id=body.user_id, **body.model_dump(exclude={"user_id"})))

@router.get("/{horse_id}", response_model=HorseDetail)
async def get_horse(horse_id: str, user_id: str, stable: StableDep) -> HorseDetail:
    return horse_detail(stable, user_id, require_horse(stable, user_id, horse_id), dt.date.today())

@router.put("/{horse_id}", response_model=Horse)
async def update_horse(horse_id: str, body: OwnedHorseInput, stable: StableDep) -> Horse:
    horse = require_horse(stable, body.user_id, horse_id)
    return stable.horses.put(body.user_id, horse.model_copy(update=body.model_dump(exclude={"user_id"})))

@router.delete("/{horse_id}", status_code=204)
async def delete_horse(horse_id: str, user_id: str, stable: StableDep) -> Response:
    require_horse(stable, user_id, horse_id)
    stable.horses.delete(user_id, horse_id)
    return NO_CONTENT

@router.post("/{horse_id}/health", response_model=HealthEntry, status_code=201)
async def add_health_entry(horse_id: str, body: OwnedHealthEntryInput, stable: StableDep) -> HealthEntry:
    require_horse(stable, body.user_id, horse_id)
    entry = HealthEntry(horse_id=horse_id, **body.model_dump(exclude={"user_id"}))
    return stable.health.put(body.user_id, entry)

@router.delete("/{horse_id}/health/{entry_id}", status_code=204)
async def delete_health_entry(horse_id: str, entry_id: str, user_id: str, stable: StableDep) -> Response:
    entry = stable.health.get(user_id, entry_id)
    if entry is None or entry.horse_id != horse_id:
        raise HTTPException(status_code=404, detail="Entrée introuvable.")
    stable.health.delete(user_id, entry_id)
    return NO_CONTENT

@router.post("/{horse_id}/weights", response_model=WeightEntry, status_code=201)
async def add_weight(horse_id: str, body: WeightRequest, stable: StableDep) -> WeightEntry:
    horse = require_horse(stable, body.user_id, horse_id)
    stable.horses.put(body.user_id, horse.model_copy(update={"weight_kg": body.weight_kg}))
    return stable.weights.put(body.user_id, WeightEntry(horse_id=horse_id, weight_kg=body.weight_kg))

@router.post("/{horse_id}/workouts", response_model=Workout, status_code=201)
async def add_workout(horse_id: str, body: OwnedWorkoutInput, stable: StableDep) -> Workout:
    require_horse(stable, body.user_id, horse_id)
    return stable.workouts.put(body.user_id, Workout(horse_id=horse_id, **body.model_dump(exclude={"user_id"})))
