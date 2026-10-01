"""Daily ration engine: a base ration by workload, then condition constraints.

Constraints are merged conservatively: the strictest starch cap wins, the
highest number of meals wins, a feed avoided by one condition is never
recommended by another.
"""

import math

from .conditions import ConditionRule, describe_conditions
from .models import Ration, Workload

FORAGE_PCT: dict[str, float] = {"rest": 2.0, "light": 2.0, "moderate": 1.9, "intense": 1.8}
CONCENTRATE_PCT: dict[str, float] = {"rest": 0.0, "light": 0.25, "moderate": 0.5, "intense": 0.9}
SALT_G_PER_500KG: dict[str, int] = {"rest": 25, "light": 35, "moderate": 50, "intense": 75}
VITAMIN_E_IU_PER_KG: dict[str, float] = {"rest": 1.0, "light": 1.0, "moderate": 1.6, "intense": 2.0}
STARCH_SHARE_REGULAR = 0.30
STARCH_SHARE_LOW = 0.10
LOW_STARCH_CONCENTRATE_MAX_PCT = 0.4
MAX_MEAL_PCT = 0.4
MAX_MEALS = 5
MULTI_CONDITION_WARNING = "Plusieurs pathologies : faire valider cette ration par un vétérinaire ou un nutritionniste équin."

def forage_pct(workload: Workload, rules: list[ConditionRule], body_condition: int | None) -> float:
    pct = FORAGE_PCT[workload]
    if body_condition is not None and body_condition >= 7:
        pct -= 0.3
    if body_condition is not None and body_condition <= 3:
        pct += 0.3
    floor = max([1.5, *(rule.forage_min_pct for rule in rules)])
    ceiling = min([2.5, *(rule.forage_max_pct for rule in rules)])
    return max(floor, min(pct, ceiling))

def concentrate_pct(workload: Workload, no_cereals: bool, body_condition: int | None) -> float:
    pct = CONCENTRATE_PCT[workload]
    if body_condition is not None and body_condition >= 7:
        pct /= 2
    if body_condition is not None and body_condition <= 3:
        pct += 0.2
    if no_cereals:
        pct = min(pct, LOW_STARCH_CONCENTRATE_MAX_PCT)
    return pct

def max_meal_kg(weight_kg: float, starch_cap_g: float | None, no_cereals: bool) -> float:
    by_weight = weight_kg * MAX_MEAL_PCT / 100
    if starch_cap_g is None:
        return by_weight
    starch_share = STARCH_SHARE_LOW if no_cereals else STARCH_SHARE_REGULAR
    return min(by_weight, starch_cap_g / (starch_share * 1000))

def concentrate_type(concentrate_kg: float, no_cereals: bool) -> str:
    if concentrate_kg == 0:
        return "Pas de concentré : complément minéral vitaminé (CMV) uniquement"
    if no_cereals:
        return "Aliment pauvre en amidon (NSC < 10 %), riche en fibres et en matières grasses, sans céréales"
    return "Aliment floqué ou granulé adapté au travail"

def merge_feeds(rules: list[ConditionRule]) -> tuple[list[str], list[str], list[str]]:
    avoid = [item for rule in rules for item in rule.avoid]
    avoided_words = {item.split()[0].lower() for item in avoid}
    recommended: list[str] = []
    warnings: list[str] = []
    for rule in rules:
        for item in rule.recommended:
            if item.split()[0].lower() in avoided_words:
                warnings.append(f"« {item} » ({rule.label}) entre en conflit avec une autre pathologie : à arbitrer avec le vétérinaire.")
            elif item not in recommended:
                recommended.append(item)
    return recommended, list(dict.fromkeys(avoid)), warnings

def build_advice(rules: list[ConditionRule], recommended: list[str], avoid: list[str]) -> list[str]:
    advice = []
    if recommended:
        advice.append("À privilégier : " + ", ".join(recommended) + ".")
    if avoid:
        advice.append("À éviter : " + ", ".join(avoid) + ".")
    advice.extend(item for rule in rules for item in rule.advice)
    return advice

def build_warnings(conditions: list[str], rules: list[ConditionRule], conflicts: list[str]) -> list[str]:
    warnings = [f"Pathologie inconnue ignorée : {code}." for code in conditions if code not in {rule.code for rule in rules}]
    warnings.extend(conflicts)
    if len(rules) >= 2:
        warnings.append(MULTI_CONDITION_WARNING)
    if any(rule.code in {"colic_history", "laminitis"} for rule in rules):
        warnings.append("Au moindre signe de colique ou de fourbure : appeler le vétérinaire immédiatement.")
    return warnings

def oil_ml(weight_kg: float, workload: Workload, rules: list[ConditionRule], body_condition: int | None) -> int:
    fat = max([0.0, *(rule.fat_ml_per_kg for rule in rules)])
    if body_condition is not None and body_condition >= 7:
        return 0
    factor = 0.5 if workload == "rest" else 1.0
    return round(weight_kg * fat * factor)

def meals_per_day(concentrate_kg: float, per_meal_kg: float, rules: list[ConditionRule]) -> int:
    min_meals = max([2, *(rule.min_meals for rule in rules)])
    return min(MAX_MEALS, max(min_meals, math.ceil(concentrate_kg / per_meal_kg)))

def compute_ration(weight_kg: float, workload: Workload, conditions: list[str], body_condition: int | None = None) -> Ration:
    """Computes a daily ration for a horse, adapted to its chronic conditions."""
    rules = describe_conditions(conditions)
    no_cereals = any(rule.no_cereals for rule in rules)
    caps = [rule.starch_cap_g_per_kg_meal for rule in rules if rule.starch_cap_g_per_kg_meal is not None]
    starch_cap_g = round(weight_kg * min(caps)) if caps else None
    concentrate_kg = round(weight_kg * concentrate_pct(workload, no_cereals, body_condition) / 100, 1)
    per_meal_kg = round(max_meal_kg(weight_kg, starch_cap_g, no_cereals), 1)
    meals = meals_per_day(concentrate_kg, per_meal_kg, rules)
    recommended, avoid, conflicts = merge_feeds(rules)
    return Ration(
        weight_kg=weight_kg,
        workload=workload,
        conditions=[rule.code for rule in rules],
        forage_kg=round(weight_kg * forage_pct(workload, rules, body_condition) / 100, 1),
        forage_advice=f"Foin de qualité réparti en au moins {meals} distributions, idéalement en filet à petites mailles.",
        concentrate_kg=concentrate_kg,
        concentrate_type=concentrate_type(concentrate_kg, no_cereals),
        meals_per_day=meals,
        max_concentrate_per_meal_kg=per_meal_kg,
        starch_cap_g_per_meal=starch_cap_g,
        oil_ml=oil_ml(weight_kg, workload, rules, body_condition),
        vitamin_e_iu=round(weight_kg * max([VITAMIN_E_IU_PER_KG[workload], *(r.vitamin_e_iu_per_kg for r in rules)])),
        salt_g=round(SALT_G_PER_500KG[workload] * weight_kg / 500),
        water_liters=(round(weight_kg * 0.05), round(weight_kg * 0.08)),
        advice=build_advice(rules, recommended, avoid),
        warnings=build_warnings(conditions, rules, conflicts),
    )
