"""Long-term memory tool: explicit facts the user wants Ale to keep."""

from google.adk.memory.memory_entry import MemoryEntry
from google.adk.tools import ToolContext
from google.genai import types

async def remember(fact: str, tool_context: ToolContext) -> dict:
    """Saves a durable fact about the user or their horses in long-term memory.

    Use it for preferences, habits and context that are not part of a horse's
    file, e.g. "Louise monte Tornade le mardi et le jeudi".

    Args:
        fact: The fact to remember, as one self-contained sentence in French.
    """
    content = types.Content(role="user", parts=[types.Part(text=fact)])
    await tool_context.add_memory(memories=[MemoryEntry(content=content, author="memo")])
    return {"remembered": fact}
