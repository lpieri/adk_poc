"""Ale, the ADK horse-care agent.

Exposes `root_agent`, the convention expected by the ADK CLI (`adk web agents`,
`adk run agents/ale`); the FastAPI app reuses it.
"""

import logging
import os

from google.adk.agents import Agent
from google.adk.agents.callback_context import CallbackContext
from google.adk.tools.preload_memory_tool import PreloadMemoryTool

from .instruction import build_instruction
from .tools import ALE_TOOLS

logger = logging.getLogger(__name__)

async def save_to_memory(callback_context: CallbackContext) -> None:
    """Indexes the conversation in long-term memory after each turn."""
    try:
        await callback_context.add_session_to_memory()
    except ValueError:
        logger.debug("No memory service configured, skipping memory save.")

root_agent = Agent(
    name="ale",
    model=os.getenv("ALE_MODEL", "gemini-3.5-flash"),
    description="Ale, mascotte licorne experte en équitation : rations (pathologies comprises), carnet de santé, séances.",
    instruction=build_instruction,
    tools=[PreloadMemoryTool(), *ALE_TOOLS],
    after_agent_callback=save_to_memory,
)
