"""ADK runtime: Runner + persistent sessions and memory (in-memory variant for tests)."""

from dataclasses import dataclass

from google.adk.memory import BaseMemoryService, InMemoryMemoryService
from google.adk.runners import Runner
from google.adk.sessions import BaseSessionService, DatabaseSessionService, InMemorySessionService

from agents.ale.agent import root_agent
from equine.container import data_dir

from .memory_service import SqliteMemoryService

APP_NAME = "ale"

@dataclass
class Runtime:
    sessions: BaseSessionService
    memory: BaseMemoryService
    runner: Runner

def build_runtime(sessions: BaseSessionService, memory: BaseMemoryService) -> Runtime:
    runner = Runner(app_name=APP_NAME, agent=root_agent, session_service=sessions, memory_service=memory)
    return Runtime(sessions=sessions, memory=memory, runner=runner)

def new_runtime() -> Runtime:
    directory = data_dir()
    sessions = DatabaseSessionService(db_url=f"sqlite+aiosqlite:///{directory / 'sessions.db'}")
    return build_runtime(sessions, SqliteMemoryService(str(directory / "memory.db")))

def new_test_runtime() -> Runtime:
    return build_runtime(InMemorySessionService(), InMemoryMemoryService())
