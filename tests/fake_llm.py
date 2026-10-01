"""Scripted LLM: one tool call, then a reply built from the tool result."""

from typing import AsyncGenerator

from google.adk.models import BaseLlm, LlmRequest, LlmResponse
from google.genai import types

from agents.ale.protocol import is_wakeup

def last_user_text(llm_request: LlmRequest) -> str:
    for content in reversed(llm_request.contents):
        texts = [p.text for p in content.parts or [] if p.text]
        if content.role == "user" and texts:
            return texts[-1]
    return ""

def reply_from(response: types.FunctionResponse) -> str:
    if response.name == "get_stable_briefing":
        names = ", ".join(h["name"] for h in response.response["horses"])
        return f"[mood:happy] Coucou ! As-tu monté {names} aujourd'hui ?"
    return f"[mood:thinking] Donne environ {response.response['forage_kg']} kg de foin par jour."

class FakeLlm(BaseLlm):
    async def generate_content_async(self, llm_request: LlmRequest, stream: bool = False) -> AsyncGenerator[LlmResponse, None]:
        last_part = llm_request.contents[-1].parts[0]
        if last_part.function_response:
            part = types.Part(text=reply_from(last_part.function_response))
        elif is_wakeup(last_user_text(llm_request)):
            part = types.Part(function_call=types.FunctionCall(name="get_stable_briefing", args={}))
        else:
            args = {"weight_kg": 500, "workload": "moderate", "conditions": ["pssm1"]}
            part = types.Part(function_call=types.FunctionCall(name="calculate_ration", args=args))
        yield LlmResponse(content=types.Content(role="model", parts=[part]))
