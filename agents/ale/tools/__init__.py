from .care_tools import add_health_entry, get_care_plan, get_stable_briefing, log_workout
from .coach_tools import check_vitals, plan_session
from .horse_tools import add_horse, get_horse, list_horses, log_weight, update_horse
from .memory_tools import remember
from .nutrition_tools import calculate_horse_ration, calculate_ration, list_conditions

ALE_TOOLS = [
    list_horses,
    get_horse,
    add_horse,
    update_horse,
    log_weight,
    add_health_entry,
    get_care_plan,
    log_workout,
    get_stable_briefing,
    list_conditions,
    calculate_ration,
    calculate_horse_ration,
    check_vitals,
    plan_session,
    remember,
]
