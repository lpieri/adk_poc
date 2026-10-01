"""API tests with a fake LLM: no network nor API key needed."""

HORSE = {"user_id": "u1", "name": "Tornade", "weight_kg": 520, "workload": "moderate", "conditions": ["pssm1"]}
PLACE = {"user_id": "u1", "name": "Écurie du Lac", "kind": "stable", "lat": 45.0, "lng": 5.0, "radius_m": 200}

def test_health(client):
    assert client.get("/health").json()["status"] == "ok"

def test_chat_returns_mood_and_keeps_history(client):
    body = client.post("/chat", json={"user_id": "u1", "message": "Ration pour ma PSSM de 500 kg ?"}).json()
    assert body["mood"] == "thinking"
    assert body["reply"] == "Donne environ 9.5 kg de foin par jour."
    assert body["tool_calls"][0]["name"] == "calculate_ration"
    history = client.get(f"/sessions/u1/{body['session_id']}").json()
    assert history[0] == {"author": "user", "text": "Ration pour ma PSSM de 500 kg ?", "mood": None}
    assert history[-1] == {"author": "ale", "text": body["reply"], "mood": "thinking"}

def test_chat_unknown_session(client):
    resp = client.post("/chat", json={"user_id": "u1", "session_id": "nope", "message": "Salut"})
    assert resp.status_code == 404

def test_horse_crud_and_detail(client):
    horse = client.post("/horses", json=HORSE).json()
    assert client.get("/horses", params={"user_id": "u2"}).json() == []
    client.post(f"/horses/{horse['id']}/health", json={"user_id": "u1", "kind": "vaccine", "date": "2026-09-01", "label": "Grippe"})
    client.post(f"/horses/{horse['id']}/weights", json={"user_id": "u1", "weight_kg": 530})
    client.post(f"/horses/{horse['id']}/workouts", json={"user_id": "u1", "discipline": "dressage", "duration_min": 40})
    detail = client.get(f"/horses/{horse['id']}", params={"user_id": "u1"}).json()
    assert detail["horse"]["weight_kg"] == 530
    assert detail["ration"]["oil_ml"] == 265
    assert len(detail["health"]) == len(detail["workouts"]) == 1
    updated = client.put(f"/horses/{horse['id']}", json={**HORSE, "workload": "rest"}).json()
    assert updated["workload"] == "rest"
    assert client.delete(f"/horses/{horse['id']}", params={"user_id": "u1"}).status_code == 204
    assert client.get(f"/horses/{horse['id']}", params={"user_id": "u1"}).status_code == 404

def test_delete_health_entry(client):
    horse = client.post("/horses", json=HORSE).json()
    entry = client.post(f"/horses/{horse['id']}/health", json={"user_id": "u1", "kind": "vet", "date": "2026-09-01", "label": "Visite"}).json()
    url = f"/horses/{horse['id']}/health/{entry['id']}"
    assert client.delete(url, params={"user_id": "u1"}).status_code == 204
    assert client.delete(url, params={"user_id": "u1"}).status_code == 404

def test_conditions_catalog(client):
    codes = {c["code"] for c in client.get("/conditions").json()}
    assert {"pssm1", "colic_history", "gastric_ulcers"} <= codes

def test_presence_wakes_ale_once_on_arrival(client):
    client.post("/horses", json=HORSE)
    client.post("/places", json=PLACE)
    away = client.post("/presence", json={"user_id": "u1", "lat": 46.0, "lng": 5.0}).json()
    assert away == {"triggered": False, "place": None, "session_id": None, "reply": None, "mood": None}
    arrived = client.post("/presence", json={"user_id": "u1", "lat": 45.0005, "lng": 5.0}).json()
    assert arrived["triggered"] is True
    assert arrived["mood"] == "happy"
    assert arrived["reply"] == "Coucou ! As-tu monté Tornade aujourd'hui ?"
    again = client.post("/presence", json={"user_id": "u1", "session_id": arrived["session_id"], "lat": 45.0, "lng": 5.0}).json()
    assert again["triggered"] is False
    history = client.get(f"/sessions/u1/{arrived['session_id']}").json()
    assert [m["author"] for m in history] == ["ale"]

def test_manual_wakeup_and_places(client):
    place = client.post("/places", json=PLACE).json()
    assert client.get("/places", params={"user_id": "u1"}).json() == [place]
    woke = client.post("/wakeup", json={"user_id": "u1", "place_id": place["id"]}).json()
    assert woke["triggered"] is True
    assert client.post("/wakeup", json={"user_id": "u1", "place_id": "nope"}).status_code == 404
    assert client.delete(f"/places/{place['id']}", params={"user_id": "u1"}).status_code == 204
    assert client.delete(f"/places/{place['id']}", params={"user_id": "u1"}).status_code == 404

def test_cors_origins_parsing():
    from app.main import cors_origins

    assert cors_origins("") == []
    assert cors_origins("https://ale.swone.fr/, http://localhost:5173 ,") == ["https://ale.swone.fr", "http://localhost:5173"]
