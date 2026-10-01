from types import SimpleNamespace

import pytest
from fastapi.testclient import TestClient

from agents.ale.agent import root_agent
from app.deps import runtime_dep, stable_dep
from app.main import app
from app.runtime import new_test_runtime
from equine.container import new_test_stable, set_stable
from equine.stable import Stable
from tests.fake_llm import FakeLlm

@pytest.fixture
def stable() -> Stable:
    test_stable = new_test_stable()
    set_stable(test_stable)
    return test_stable

@pytest.fixture
def tool_context() -> SimpleNamespace:
    return SimpleNamespace(user_id="u1")

@pytest.fixture
def client(stable, monkeypatch):
    monkeypatch.setattr(root_agent, "model", FakeLlm(model="fake"))
    runtime = new_test_runtime()
    app.dependency_overrides[runtime_dep] = lambda: runtime
    app.dependency_overrides[stable_dep] = lambda: stable
    yield TestClient(app)
    app.dependency_overrides.clear()
