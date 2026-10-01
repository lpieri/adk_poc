"""Conversation endpoints."""

from typing import Annotated

from fastapi import APIRouter, Depends, HTTPException

from agents.ale.agent import root_agent
from equine.conditions import CONDITIONS

from ..conversation import open_session, run_turn, to_history
from ..deps import runtime_dep
from ..runtime import APP_NAME, Runtime
from ..schemas import ChatRequest, ChatResponse, HistoryMessage

router = APIRouter()
RuntimeDep = Annotated[Runtime, Depends(runtime_dep)]

@router.get("/health")
async def health() -> dict:
    return {"status": "ok", "agent": root_agent.name, "model": str(root_agent.model)}

@router.get("/conditions")
async def conditions() -> list[dict]:
    return [{"code": rule.code, "label": rule.label, "summary": rule.summary} for rule in CONDITIONS.values()]

@router.post("/chat", response_model=ChatResponse)
async def chat(req: ChatRequest, runtime: RuntimeDep) -> ChatResponse:
    session = await open_session(runtime, req.user_id, req.session_id)
    if session is None:
        raise HTTPException(status_code=404, detail="Session introuvable.")
    return await run_turn(runtime, req.user_id, session, req.message)

@router.get("/sessions/{user_id}/{session_id}", response_model=list[HistoryMessage])
async def history(user_id: str, session_id: str, runtime: RuntimeDep) -> list[HistoryMessage]:
    session = await runtime.sessions.get_session(app_name=APP_NAME, user_id=user_id, session_id=session_id)
    if session is None:
        raise HTTPException(status_code=404, detail="Session introuvable.")
    return to_history(session)
