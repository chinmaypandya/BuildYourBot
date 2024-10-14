import openai
from utils.config import OPENAI_API_KEY  # Ensure this points to your API key config

openai.api_key = OPENAI_API_KEY

def query_chatgpt(prompt):
    try:
        response = openai.Completion.create(
            model="text-davinci-003",
            prompt=prompt,
            max_tokens=150,
            n=1,
            stop=None,
            temperature=0.7,
        )
        return response.choices[0].text.strip()
    except Exception as e:  # General exception handling
        return f"Error: {str(e)}"
