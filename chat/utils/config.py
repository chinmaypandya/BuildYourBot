import os
from dotenv import load_dotenv

# Load environment variables from the .env file
load_dotenv()
api_key = os.getenv("API_KEY")

# Store your OpenAI API key here
OPENAI_API_KEY = os.getenv("OPENAI_API_KEY", api_key)

