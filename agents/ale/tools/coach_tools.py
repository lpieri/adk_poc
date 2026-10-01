"""Vital signs check and training session planning."""

from typing import Literal

Level = Literal["beginner", "intermediate", "advanced"]
SessionDiscipline = Literal["dressage", "jumping", "cross", "hack"]

TEMPERATURE_C = (37.2, 38.2)
HEART_RATE = (28, 44)
RESPIRATORY_RATE = (8, 16)
DURATION_MIN: dict[str, int] = {"beginner": 30, "intermediate": 45, "advanced": 60}
EXERCISES: dict[str, list[str]] = {
    "dressage": ["cercles de 20 m aux trois allures", "transitions pas-trot-pas", "cessions à la jambe"],
    "jumping": ["barres au sol au trot", "cavalettis", "petit parcours d'enchaînement"],
    "cross": ["travail en terrain varié", "montées et descentes au trot", "petits obstacles naturels"],
    "hack": ["détente au pas rênes longues", "trot en extérieur", "équilibre en terrain varié"],
}

def vital_status(value: float, normal: tuple[float, float]) -> str:
    if value < normal[0]:
        return "low"
    if value > normal[1]:
        return "high"
    return "normal"

def check_vitals(temperature_c: float, heart_rate: int, respiratory_rate: int) -> dict:
    """Compares a resting adult horse's vital signs with normal ranges.

    Args:
        temperature_c: Rectal temperature in °C.
        heart_rate: Beats per minute at rest.
        respiratory_rate: Breaths per minute at rest.
    """
    statuses = {
        "temperature": vital_status(temperature_c, TEMPERATURE_C),
        "heart_rate": vital_status(heart_rate, HEART_RATE),
        "respiratory_rate": vital_status(respiratory_rate, RESPIRATORY_RATE),
    }
    normal_ranges = {"temperature_c": TEMPERATURE_C, "heart_rate": HEART_RATE, "respiratory_rate": RESPIRATORY_RATE}
    return {**statuses, "normal_ranges": normal_ranges, "call_vet": any(s != "normal" for s in statuses.values())}

def plan_session(level: Level, discipline: SessionDiscipline) -> dict:
    """Suggests a training session adapted to the rider's level and the discipline.

    Args:
        level: "beginner", "intermediate" or "advanced".
        discipline: "dressage", "jumping", "cross" or "hack".
    """
    if level not in DURATION_MIN or discipline not in EXERCISES:
        return {"error": f"Niveau ou discipline inconnu : {level}, {discipline}."}
    duration = DURATION_MIN[level]
    exercises = EXERCISES[discipline][: 2 if level == "beginner" else 3]
    return {
        "level": level,
        "discipline": discipline,
        "total_min": duration,
        "steps": [
            {"phase": "warm_up", "min": 10, "content": "pas rênes longues puis trot enlevé"},
            {"phase": "work", "min": duration - 20, "content": exercises},
            {"phase": "cool_down", "min": 10, "content": "pas rênes longues, étirements"},
        ],
    }
