"""HTTP request and response models."""

from pydantic import BaseModel, Field

from agents.ale.protocol import Mood
from equine.models import HealthEntryInput, HorseInput, Place, PlaceInput, WorkoutInput

class ChatRequest(BaseModel):
    user_id: str = Field(min_length=1)
    session_id: str | None = None
    message: str = Field(min_length=1)

class ToolCall(BaseModel):
    name: str
    args: dict

class ChatResponse(BaseModel):
    session_id: str
    reply: str
    mood: Mood
    tool_calls: list[ToolCall]

class HistoryMessage(BaseModel):
    author: str
    text: str
    mood: Mood | None

class OwnedHorseInput(HorseInput):
    user_id: str = Field(min_length=1)

class OwnedHealthEntryInput(HealthEntryInput):
    user_id: str = Field(min_length=1)

class OwnedWorkoutInput(WorkoutInput):
    user_id: str = Field(min_length=1)

class OwnedPlaceInput(PlaceInput):
    user_id: str = Field(min_length=1)

class WeightRequest(BaseModel):
    user_id: str = Field(min_length=1)
    weight_kg: float = Field(ge=100, le=1200)

class PresenceRequest(BaseModel):
    user_id: str = Field(min_length=1)
    session_id: str | None = None
    lat: float = Field(ge=-90, le=90)
    lng: float = Field(ge=-180, le=180)

class WakeupRequest(BaseModel):
    user_id: str = Field(min_length=1)
    session_id: str | None = None
    place_id: str

class WakeupResponse(BaseModel):
    triggered: bool
    place: Place | None = None
    session_id: str | None = None
    reply: str | None = None
    mood: Mood | None = None
