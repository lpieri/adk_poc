"""Tools to read and update the user's horses."""

import datetime as dt

from google.adk.tools import ToolContext
from pydantic import ValidationError

from equine.briefing import horse_detail
from equine.container import get_stable
from equine.models import Horse, Sex, WeightEntry, Workload

from .lookup import find_horse, unknown_horse

def list_horses(tool_context: ToolContext) -> dict:
    """Lists the user's horses with their weight, workload and chronic conditions.

    Returns:
        A dict with a "horses" list.
    """
    horses = get_stable().horses.list(tool_context.user_id)
    return {"horses": [h.model_dump(include={"id", "name", "breed", "weight_kg", "workload", "conditions", "birth_year"}) for h in horses]}

def get_horse(horse_name: str, tool_context: ToolContext) -> dict:
    """Returns a horse's full file: profile, health record, weights, recent workouts, due care and ration.

    Args:
        horse_name: Name (or id) of the horse.
    """
    stable, owner = get_stable(), tool_context.user_id
    horse = find_horse(stable, owner, horse_name)
    if horse is None:
        return unknown_horse(stable, owner, horse_name)
    return horse_detail(stable, owner, horse, dt.date.today()).model_dump(mode="json")

def add_horse(
    name: str,
    weight_kg: float,
    workload: Workload,
    tool_context: ToolContext,
    conditions: list[str] | None = None,
    breed: str = "",
    sex: Sex = "gelding",
    birth_year: int | None = None,
    body_condition: int | None = None,
    notes: str = "",
) -> dict:
    """Registers a new horse for the user.

    Args:
        name: Horse name.
        weight_kg: Body weight in kg.
        workload: "rest", "light", "moderate" or "intense".
        conditions: Chronic condition codes (see list_conditions), e.g. ["pssm1"].
        breed: Breed, optional.
        sex: "mare", "gelding" or "stallion".
        birth_year: Year of birth, optional.
        body_condition: Body condition score from 1 (emaciated) to 9 (obese), optional.
        notes: Free notes (temperament, habits...).
    """
    try:
        horse = Horse(
            owner_id=tool_context.user_id, name=name, weight_kg=weight_kg, workload=workload,
            conditions=conditions or [], breed=breed, sex=sex, birth_year=birth_year,
            body_condition=body_condition, notes=notes,
        )
    except ValidationError as err:
        return {"error": str(err)}
    get_stable().horses.put(tool_context.user_id, horse)
    return {"created": horse.model_dump(mode="json")}

def update_horse(
    horse_name: str,
    tool_context: ToolContext,
    workload: Workload | None = None,
    conditions: list[str] | None = None,
    body_condition: int | None = None,
    notes: str | None = None,
) -> dict:
    """Updates a horse's workload, chronic conditions, body condition score or notes.

    Args:
        horse_name: Name (or id) of the horse.
        workload: New workload, optional.
        conditions: Full new list of condition codes, optional.
        body_condition: New body condition score (1-9), optional.
        notes: New notes, optional.
    """
    stable, owner = get_stable(), tool_context.user_id
    horse = find_horse(stable, owner, horse_name)
    if horse is None:
        return unknown_horse(stable, owner, horse_name)
    changes = {"workload": workload, "conditions": conditions, "body_condition": body_condition, "notes": notes}
    updated = horse.model_copy(update={k: v for k, v in changes.items() if v is not None})
    stable.horses.put(owner, Horse.model_validate(updated.model_dump()))
    return {"updated": updated.model_dump(mode="json")}

def log_weight(horse_name: str, weight_kg: float, tool_context: ToolContext) -> dict:
    """Records a new weighing (scale or weight tape) and updates the horse's weight.

    Args:
        horse_name: Name (or id) of the horse.
        weight_kg: Measured weight in kg.
    """
    stable, owner = get_stable(), tool_context.user_id
    horse = find_horse(stable, owner, horse_name)
    if horse is None:
        return unknown_horse(stable, owner, horse_name)
    entry = stable.weights.put(owner, WeightEntry(horse_id=horse.id, weight_kg=weight_kg))
    stable.horses.put(owner, horse.model_copy(update={"weight_kg": weight_kg}))
    return {"recorded": entry.model_dump(mode="json"), "previous_weight_kg": horse.weight_kg}
