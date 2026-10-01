"""Conventions shared by the agent prompt and the API: mood tags and wakeup triggers."""

import re
from typing import Literal

Mood = Literal["idle", "happy", "thinking", "worried", "surprised"]

MOODS: tuple[str, ...] = ("idle", "happy", "thinking", "worried", "surprised")
DEFAULT_MOOD: Mood = "idle"
WAKEUP_MARKER = "[RÉVEIL AUTONOME]"
MOOD_TAG = re.compile(r"^\s*\[mood:(\w+)\]\s*", re.IGNORECASE)

def split_mood(text: str) -> tuple[Mood, str]:
    """Extracts the leading [mood:x] tag of a reply; unknown or missing → idle."""
    match = MOOD_TAG.match(text)
    if match is None:
        return DEFAULT_MOOD, text.strip()
    mood = match.group(1).lower()
    return (mood if mood in MOODS else DEFAULT_MOOD), text[match.end():].strip()

def is_wakeup(text: str) -> bool:
    return text.startswith(WAKEUP_MARKER)
