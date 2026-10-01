"""Domain models shared by the store, the agent tools and the HTTP API."""

import datetime as dt
from typing import Literal
from uuid import uuid4

from pydantic import BaseModel, Field

Sex = Literal["mare", "gelding", "stallion"]
Workload = Literal["rest", "light", "moderate", "intense"]
HealthKind = Literal["vaccine", "deworming", "farrier", "dentist", "vet", "osteo", "other"]
Discipline = Literal["dressage", "jumping", "cross", "hack", "groundwork", "lunging"]
Intensity = Literal["light", "moderate", "intense"]
PlaceKind = Literal["stable", "home", "other"]
CareStatus = Literal["overdue", "due_soon", "ok", "unknown"]

def new_id() -> str:
    return uuid4().hex

class HorseInput(BaseModel):
    name: str = Field(min_length=1, max_length=80)
    breed: str = ""
    sex: Sex = "gelding"
    birth_year: int | None = Field(default=None, ge=1980, le=2100)
    weight_kg: float = Field(ge=100, le=1200)
    body_condition: int | None = Field(default=None, ge=1, le=9)
    workload: Workload = "light"
    conditions: list[str] = []
    notes: str = ""

class Horse(HorseInput):
    id: str = Field(default_factory=new_id)
    owner_id: str
    created_at: dt.datetime = Field(default_factory=dt.datetime.now)

class HealthEntryInput(BaseModel):
    kind: HealthKind
    date: dt.date
    label: str = Field(min_length=1, max_length=120)
    next_due: dt.date | None = None
    notes: str = ""

class HealthEntry(HealthEntryInput):
    id: str = Field(default_factory=new_id)
    horse_id: str

class WeightEntry(BaseModel):
    id: str = Field(default_factory=new_id)
    horse_id: str
    date: dt.date = Field(default_factory=dt.date.today)
    weight_kg: float = Field(ge=100, le=1200)

class WorkoutInput(BaseModel):
    discipline: Discipline
    duration_min: int = Field(ge=1, le=600)
    intensity: Intensity = "moderate"
    notes: str = ""
    date: dt.datetime = Field(default_factory=dt.datetime.now)

class Workout(WorkoutInput):
    id: str = Field(default_factory=new_id)
    horse_id: str

class PlaceInput(BaseModel):
    name: str = Field(min_length=1, max_length=80)
    kind: PlaceKind = "stable"
    lat: float = Field(ge=-90, le=90)
    lng: float = Field(ge=-180, le=180)
    radius_m: float = Field(default=150, ge=20, le=5000)

class Place(PlaceInput):
    id: str = Field(default_factory=new_id)
    owner_id: str

class Presence(BaseModel):
    owner_id: str
    place_id: str | None
    seen_at: dt.datetime
    woken_place_id: str | None = None
    woken_at: dt.datetime | None = None

class CareItem(BaseModel):
    kind: HealthKind
    label: str
    due_date: dt.date | None
    status: CareStatus
    days_left: int | None

class Ration(BaseModel):
    weight_kg: float
    workload: Workload
    conditions: list[str]
    forage_kg: float
    forage_advice: str
    concentrate_kg: float
    concentrate_type: str
    meals_per_day: int
    max_concentrate_per_meal_kg: float
    starch_cap_g_per_meal: float | None
    oil_ml: int
    vitamin_e_iu: int
    salt_g: int
    water_liters: tuple[int, int]
    advice: list[str]
    warnings: list[str]
