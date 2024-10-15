import openai
import asyncio
from utils.config import OPENAI_API_KEY

# Set the OpenAI API key directly for the client
openai.api_key = OPENAI_API_KEY

# Async function to stream responses from the new ChatCompletion API
async def query_chatgpt_stream(prompt):
    try:
        # Use the new ChatCompletion API with streaming enabled
        response = await openai.ChatCompletion.acreate(
            model="gpt-4",  # Use the appropriate model
            messages=[{"role": "user", "content": prompt}],
            max_tokens=150,
            stream=True,
            temperature=0.7
        )

        # Stream response chunks
        full_response = ""
        async for chunk in response:
            if "choices" in chunk:
                chunk_message = chunk['choices'][0]['delta'].get('content', '')
                full_response += chunk_message
                yield chunk_message

    except Exception as e:
        yield f"Error: {str(e)}"
