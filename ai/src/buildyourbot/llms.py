from functools import cache

from langchain_google_genai import ChatGoogleGenerativeAI
from langchain_openai import ChatOpenAI

@cache
def get_google_llm():
    return ChatGoogleGenerativeAI(
        model="gemini-1.5-pro",
        temperature=0,
        max_tokens=None,
        timeout=None,
        max_retries=3
    )

@cache
def get_4o_mini():
    return ChatOpenAI(
        model="gpt-4o-mini",
        temperature=0,
        max_tokens=None,
        timeout=None,
        max_retries=2,
    )