import streamlit as st
import asyncio
from datetime import datetime

# Initialize ALL session state variables at the start
if 'current_chat' not in st.session_state:
    st.session_state.current_chat = []

if 'chat_sessions' not in st.session_state:
    st.session_state.chat_sessions = [{
        "title": "New Chat",
        "history": []
    }]

if 'current_session_index' not in st.session_state:
    st.session_state.current_session_index = 0

def create_new_chat():
    st.session_state.chat_sessions.append({
        "title": "New Chat",
        "history": []
    })
    st.session_state.current_session_index = len(st.session_state.chat_sessions) - 1
    st.session_state.current_chat = []  # Reset current chat

def get_session_title(session):
    if session['history']:
        first_message = next((msg['message'] for msg in session['history'] if msg['role'] == 'user'), None)
        if first_message:
            return first_message[:30] + "..." if len(first_message) > 30 else first_message
    return "New Chat"

# Sidebar for chat sessions
with st.sidebar:
    st.title("Chat Sessions")
    
    if st.button("New Chat"):
        create_new_chat()
        st.rerun()
    
    for idx, session in enumerate(st.session_state.chat_sessions):
        session_title = get_session_title(session)
        if st.button(f"Session {idx + 1}: {session_title}", key=f"session_{idx}"):
            st.session_state.current_session_index = idx
            st.rerun()

# Main chat interface
st.title("Build Your Bot")

current_session_index = st.session_state.current_session_index
current_session = st.session_state.chat_sessions[current_session_index]

current_title = get_session_title(current_session)
st.subheader(f"Current Session: {current_title}")

# Display chat history
if current_session['history']:
    for entry in current_session['history']:
        with st.chat_message(entry['role']):
            st.markdown(entry['message'])
            st.caption(f"{entry['timestamp']}")

# Chat input
user_query = st.chat_input("Ask anything")

if user_query:
    # Display user message
    with st.chat_message('user'):
        st.markdown(user_query)
    
    # Add user message to history
    current_session['history'].append({
        "role": "user",
        "message": user_query,
        "timestamp": datetime.now().strftime("%Y-%m-%d %H:%M:%S")
    })
    
    # Display bot response (same as user message)
    with st.chat_message('assistant'):
        st.markdown(user_query)  # Echo user query as bot response
        
        # Add bot response to history (same as user query)
        current_session['history'].append({
            "role": "assistant",
            "message": user_query,  # Echoing user query
            "timestamp": datetime.now().strftime("%Y-%m-%d %H:%M:%S")
        })
    
    st.rerun()

# Optional: Add a way to clear chat history
if st.sidebar.button("Clear Current Chat"):
    current_session['history'] = []
    st.session_state.current_chat = []
    st.rerun()
