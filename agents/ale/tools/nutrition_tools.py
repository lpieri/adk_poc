"""Ration tools, generic or for a registered horse."""

from google.adk.tools import ToolContext

from equine.briefing import horse_ration
from equine.conditions import CONDITIONS
from equine.container import get_stable
from equine.models import Workload
from equine.nutrition import compute_ration

from .lookup import find_horse, unknown_horse

MIN_WEIGHT_KG = 100
MAX_WEIGHT_KG = 1200

def list_conditions() -> dict:
    """Lists the chronic conditions the ration engine handles, with their codes."""
    return {"conditions": [{"code": r.code, "label": r.label, "summary": r.summary} for r in CONDITIONS.values()]}

def calculate_ration(
    weight_kg: float,
    workload: Workload,
    conditions: list[str] | None = None,
    body_condition: int | None = None,
) -> dict:
    """Computes a daily ration for any horse, adapted to its chronic conditions.

    Args:
        weight_kg: Body weight in kg (100 to 1200).
        workload: "rest", "light", "moderate" or "intense".
        conditions: Condition codes, e.g. ["pssm1", "colic_history"]. See list_conditions.
        body_condition: Body condition score 1-9, optional (adjusts forage and fat).

    Returns:
        Forage, concentrate, meals, starch cap per meal, oil, vitamin E, salt, water,
        advice and warnings.
    """
    if not MIN_WEIGHT_KG <= weight_kg <= MAX_WEIGHT_KG:
        return {"error": f"Le poids doit être compris entre {MIN_WEIGHT_KG} et {MAX_WEIGHT_KG} kg."}
    return compute_ration(weight_kg, workload, conditions or [], body_condition).model_dump(mode="json")

def calculate_horse_ration(horse_name: str, tool_context: ToolContext) -> dict:
    """Computes the daily ration of a registered horse from its file (weight, workload, conditions).

    Args:
        horse_name: Name (or id) of the horse.
    """
    stable, owner = get_stable(), tool_context.user_id
    horse = find_horse(stable, owner, horse_name)
    if horse is None:
        return unknown_horse(stable, owner, horse_name)
    return {"horse": horse.name, **horse_ration(horse).model_dump(mode="json")}
