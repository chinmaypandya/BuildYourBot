import streamlit as st
import asyncio
import aiohttp
from fastapi import FastAPI
from fastapi.responses import StreamingResponse
from fastapi.middleware.cors import CORSMiddleware
from threading import Thread
import uvicorn
from chat_history import add_to_chat_history, display_chat_history


# Initialize FastAPI app
api_app = FastAPI()

# Allow CORS (Cross-Origin Resource Sharing)
api_app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Allow all origins, can be limited in production
    allow_methods=["*"],   # Allow all HTTP methods
    allow_headers=["*"],   # Allow all headers
)

# Async function to simulate streaming chat responses
async def generate_chat_responses(message: str):
    await asyncio.sleep(1)  # Simulate a delay before sending the response
    yield f"data: {message} \n\n"  # Send the whole message as a response

# FastAPI route to stream the message back
@api_app.get("/chat_stream/{message}")
async def chat_stream(message: str):
    return StreamingResponse(generate_chat_responses(message=message), media_type="text/event-stream")

# Function to run FastAPI server in a separate thread
def run_fastapi():
    uvicorn.run(api_app, host="0.0.0.0", port=8000)

# Start FastAPI in a new thread
thread = Thread(target=run_fastapi)
thread.start()

# Ensure session state is initialized for chat history
if 'chat_history' not in st.session_state:
    st.session_state['chat_history'] = []

# Streamlit Sidebar (Navbar)
with st.sidebar:
    st.title("Chat History")  # Display chat history in the sidebar

# Streamlit Interface for Chat
st.title("Build Your Bot")

# Input text area for user message
user_input = st.text_area("Your message", placeholder="Type your message here...")

# Async function to handle the streaming response from FastAPI
async def get_streamed_response(message):
    async with aiohttp.ClientSession() as session:
        async with session.get(f"http://localhost:8000/chat_stream/{message}") as resp:
            response_container = st.empty()  # Placeholder to display streaming data
            async for line in resp.content:
                chunk = line.decode("utf-8").replace("data: ", "").strip()  # Extract data
                if chunk:
                    response_container.markdown(f"**Bot:** {chunk}")  # Display streamed data

# Button to send the message
if st.button("Send"):
    if user_input:  # If there is user input
        add_to_chat_history(user_input)  # Add message to chat history
        asyncio.run(get_streamed_response(user_input))  # Call the async function

        # Re-render the sidebar after the message is sent
        with st.sidebar:
            display_chat_history()  # Re-display chat history to ensure updates
