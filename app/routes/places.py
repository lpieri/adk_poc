"""Known places and location wakeups."""

import datetime as dt
from typing import Annotated

from fastapi import APIRouter, Depends, HTTPException, Response

from equine.models import Place
from equine.stable import Stable

from ..deps import runtime_dep, stable_dep
from ..runtime import Runtime
from ..schemas import OwnedPlaceInput, PresenceRequest, WakeupRequest, WakeupResponse
from ..wakeup import on_position, record_presence, wake_up

router = APIRouter()
StableDep = Annotated[Stable, Depends(stable_dep)]
RuntimeDep = Annotated[Runtime, Depends(runtime_dep)]

@router.get("/places", response_model=list[Place])
async def list_places(user_id: str, stable: StableDep) -> list[Place]:
    return stable.places.list(user_id)

@router.post("/places", response_model=Place, status_code=201)
async def create_place(body: OwnedPlaceInput, stable: StableDep) -> Place:
    return stable.places.put(body.user_id, Place(owner_id=body.user_id, **body.model_dump(exclude={"user_id"})))

@router.delete("/places/{place_id}", status_code=204)
async def delete_place(place_id: str, user_id: str, stable: StableDep) -> Response:
    if not stable.places.delete(user_id, place_id):
        raise HTTPException(status_code=404, detail="Lieu introuvable.")
    return Response(status_code=204)

@router.post("/presence", response_model=WakeupResponse)
async def presence(body: PresenceRequest, stable: StableDep, runtime: RuntimeDep) -> WakeupResponse:
    return await on_position(runtime, stable, body.user_id, body.session_id, body.lat, body.lng)

@router.post("/wakeup", response_model=WakeupResponse)
async def wakeup(body: WakeupRequest, stable: StableDep, runtime: RuntimeDep) -> WakeupResponse:
    place = stable.places.get(body.user_id, body.place_id)
    if place is None:
        raise HTTPException(status_code=404, detail="Lieu introuvable.")
    now = dt.datetime.now()
    response = await wake_up(runtime, body.user_id, body.session_id, place, now)
    record_presence(stable, body.user_id, place, now, woke=True)
    return response
