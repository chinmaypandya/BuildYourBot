import os
from dotenv import load_dotenv

# Load environment variables from the .env file
load_dotenv()

# Store your OpenAI API key here
OPENAI_API_KEY = os.getenv("OPENAI_API_KEY", "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")

