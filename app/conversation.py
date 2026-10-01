"""Runs one agent turn and reads back a conversation for the UI."""

from google.adk.sessions import Session
from google.genai import types

from agents.ale.protocol import is_wakeup, split_mood

from .runtime import APP_NAME, Runtime
from .schemas import ChatResponse, HistoryMessage, ToolCall

async def open_session(runtime: Runtime, user_id: str, session_id: str | None) -> Session | None:
    """Returns the requested session, a new one if no id is given, None if the id is unknown."""
    if session_id is None:
        return await runtime.sessions.create_session(app_name=APP_NAME, user_id=user_id)
    return await runtime.sessions.get_session(app_name=APP_NAME, user_id=user_id, session_id=session_id)

async def run_turn(runtime: Runtime, user_id: str, session: Session, text: str) -> ChatResponse:
    message = types.Content(role="user", parts=[types.Part(text=text)])
    reply_parts: list[str] = []
    tool_calls: list[ToolCall] = []
    async for event in runtime.runner.run_async(user_id=user_id, session_id=session.id, new_message=message):
        tool_calls.extend(ToolCall(name=call.name, args=call.args or {}) for call in event.get_function_calls())
        if event.is_final_response() and event.content and event.content.parts:
            reply_parts.extend(p.text for p in event.content.parts if p.text and not p.thought)
    mood, reply = split_mood("".join(reply_parts))
    return ChatResponse(session_id=session.id, reply=reply, mood=mood, tool_calls=tool_calls)

def to_history(session: Session) -> list[HistoryMessage]:
    messages = []
    for event in session.events:
        text = "".join(p.text for p in (event.content.parts if event.content else None) or [] if p.text and not p.thought)
        if not text or is_wakeup(text):
            continue
        if event.author == "user":
            messages.append(HistoryMessage(author="user", text=text, mood=None))
        else:
            mood, reply = split_mood(text)
            messages.append(HistoryMessage(author="ale", text=reply, mood=mood))
    return messages
