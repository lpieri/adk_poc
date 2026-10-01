import asyncio

from agents.ale.tools import (
    add_health_entry,
    add_horse,
    calculate_horse_ration,
    calculate_ration,
    check_vitals,
    get_care_plan,
    get_horse,
    get_stable_briefing,
    list_conditions,
    list_horses,
    log_weight,
    log_workout,
    plan_session,
    update_horse,
)
from app.memory_service import SqliteMemoryService

def test_horse_lifecycle(stable, tool_context):
    created = add_horse("Tornade", 520, "moderate", tool_context, conditions=["pssm1"])
    assert created["created"]["name"] == "Tornade"
    assert [h["name"] for h in list_horses(tool_context)["horses"]] == ["Tornade"]
    update_horse("torn", tool_context, workload="intense", body_condition=6)
    log_weight("Tornade", 530, tool_context)
    detail = get_horse("Tornade", tool_context)
    assert detail["horse"]["workload"] == "intense"
    assert detail["horse"]["weight_kg"] == 530
    assert detail["weights"][0]["weight_kg"] == 530

def test_unknown_horse_lists_known_names(stable, tool_context):
    add_horse("Tornade", 520, "light", tool_context)
    result = get_horse("Pégase", tool_context)
    assert result["known_horses"] == ["Tornade"]

def test_invalid_horse_is_rejected(stable, tool_context):
    assert "error" in add_horse("Mini", 20, "light", tool_context)

def test_health_record_and_briefing(stable, tool_context):
    add_horse("Tornade", 520, "light", tool_context)
    add_health_entry("Tornade", "farrier", "Parage", tool_context, date="2020-01-01")
    care = {item["kind"]: item["status"] for item in get_care_plan("Tornade", tool_context)["care"]}
    assert care["farrier"] == "overdue"
    briefing = get_stable_briefing(tool_context)["horses"][0]
    assert briefing["worked_today"] == []
    log_workout("Tornade", "dressage", 45, tool_context)
    assert len(get_stable_briefing(tool_context)["horses"][0]["worked_today"]) == 1

def test_rations(stable, tool_context):
    assert "error" in calculate_ration(50, "light")
    assert calculate_ration(500, "moderate", ["pssm1"])["oil_ml"] == 250
    add_horse("Tornade", 500, "moderate", tool_context, conditions=["colic_history"])
    assert calculate_horse_ration("Tornade", tool_context)["meals_per_day"] == 3
    assert {c["code"] for c in list_conditions()["conditions"]} >= {"pssm1", "colic_history", "ems"}

def test_vitals_and_session():
    assert check_vitals(37.8, 36, 12)["call_vet"] is False
    assert check_vitals(39.5, 60, 12)["temperature"] == "high"
    assert len(plan_session("beginner", "jumping")["steps"][1]["content"]) == 2
    assert "error" in plan_session("advanced", "polo")

def test_sqlite_memory_service_round_trip(tmp_path):
    from google.adk.memory.memory_entry import MemoryEntry
    from google.genai import types

    service = SqliteMemoryService(str(tmp_path / "memory.db"))
    fact = MemoryEntry(content=types.Content(role="user", parts=[types.Part(text="Tornade déteste la tondeuse")]))
    asyncio.run(service.add_memory(app_name="ale", user_id="u1", memories=[fact]))
    found = asyncio.run(service.search_memory(app_name="ale", user_id="u1", query="la TONDEUSE de tornade ?"))
    assert found.memories[0].content.parts[0].text == "Tornade déteste la tondeuse"
    other = asyncio.run(service.search_memory(app_name="ale", user_id="u2", query="tondeuse"))
    assert other.memories == []
