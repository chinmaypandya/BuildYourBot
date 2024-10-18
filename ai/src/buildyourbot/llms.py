from functools import cache

from langchain_google_genai import ChatGoogleGenerativeAI

@cache
def get_google_llm():
    return ChatGoogleGenerativeAI(
        model="gemini-1.5-pro",
        temperature=0,
        max_tokens=None,
        timeout=None,
        max_retries=3
    )