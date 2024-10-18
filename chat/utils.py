import aiohttp
import asyncio
import uvicorn
from fastapi import FastAPI
from fastapi.responses import StreamingResponse
from fastapi.middleware.cors import CORSMiddleware
from threading import Thread
import streamlit as st
from datetime import datetime

# Initialize FastAPI app
api_app = FastAPI()

# Allow CORS (Cross-Origin Resource Sharing)
api_app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Allow all origins, can be limited in production
    allow_methods=["*"],  # Allow all HTTP methods
    allow_headers=["*"],  # Allow all headers
)

# Async function to simulate streaming chat responses
async def generate_chat_responses(message: str):
    await asyncio.sleep(1)  # Simulate delay for bot response
    yield f"{message}"  # For now, echo the user's message

# FastAPI route to stream the message back
@api_app.get("/chat_stream/{message}")
async def chat_stream(message: str):
    return StreamingResponse(
        generate_chat_responses(message=message), 
        media_type="text/event-stream"
    )

# Function to run FastAPI in a separate thread
def start_fastapi_thread():
    thread = Thread(
        target=lambda: uvicorn.run(api_app, host="0.0.0.0", port=8000)
    )
    thread.daemon = True  # Make thread daemon so it stops when main program stops
    thread.start()

# Async function to handle the streaming response in the chat
async def get_streamed_response(message):
    # Initialize session state if it doesn't exist
    if 'current_chat' not in st.session_state:
        st.session_state.current_chat = []
        
    try:
        async with aiohttp.ClientSession() as session:
            async with session.get(f"http://localhost:3001/chat_stream/{message}") as resp:
                if resp.status != 200:
                    return f"Error: Server returned status code {resp.status}"
                
                response_text = ""
                async for line in resp.content:
                    chunk = line.decode("utf-8").strip()
                    if chunk and not chunk.startswith("data:"):
                        response_text = chunk
                        break  # Stop after processing one response
                
                return response_text

    except aiohttp.ClientError as e:
        return f"Error connecting to server: {str(e)}"
    except Exception as e:
        return f"An error occurred: {str(e)}"

# Optional: Add helper functions for chat management
def initialize_chat_state():
    """Initialize all required session state variables"""
    if 'current_chat' not in st.session_state:
        st.session_state.current_chat = []
    
    if 'chat_sessions' not in st.session_state:
        st.session_state.chat_sessions = [{
            "title": "New Chat",
            "history": []
        }]
    
    if 'current_session_index' not in st.session_state:
        st.session_state.current_session_index = 0

def add_message_to_history(message, role="user"):
    """Add a message to the current chat history"""
    if 'chat_sessions' in st.session_state:
        current_session = st.session_state.chat_sessions[st.session_state.current_session_index]
        current_session['history'].append({
            "role": role,
            "message": message,
            "timestamp": datetime.now().strftime("%Y-%m-%d %H:%M:%S")
        })