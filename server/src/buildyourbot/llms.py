from functools import cache

from langchain_google_genai import ChatGoogleGenerativeAI

@cache
def get_google_llm():
    return ChatGoogleGenerativeAI(
        temperature=0,
        max_tokens=None,
        timeout=None,
        max_retries=3
    )