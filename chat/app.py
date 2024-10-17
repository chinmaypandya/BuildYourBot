import streamlit as st
import asyncio
from datetime import datetime
from utils import get_streamed_response, start_fastapi_thread

# Initialize all session state variables
if 'chat_sessions' not in st.session_state:
    st.session_state['chat_sessions'] = [
        {
            "title": "New Chat",
            "history": []
        }
    ]
    
if 'current_session_index' not in st.session_state:
    st.session_state['current_session_index'] = 0

# Sidebar for chat sessions
with st.sidebar:
    st.title("Chat Sessions")
    
    # New Chat button
    if st.button("New Chat"):
        # Create a new session
        st.session_state['chat_sessions'].append({
            "title": "New Chat",
            "history": []
        })
        # Set current session to the new one
        st.session_state['current_session_index'] = len(st.session_state['chat_sessions']) - 1
        st.rerun()
    
    # Display all chat sessions
    for idx, session in enumerate(st.session_state['chat_sessions']):
        # Get the first message as title, or use default
        session_title = (
            session['history'][0]['message'][:30] + "..." 
            if session['history'] 
            else f"Session {idx + 1}"
        )
        
        if st.button(f"Session {idx + 1}: {session_title}", key=f"session_{idx}"):
            st.session_state['current_session_index'] = idx
            st.rerun()

# Main chat interface
st.title("Build Your Bot")

# Ensure we have a valid session index
current_session_index = st.session_state['current_session_index']
if current_session_index >= len(st.session_state['chat_sessions']):
    current_session_index = 0
    st.session_state['current_session_index'] = 0

current_session = st.session_state['chat_sessions'][current_session_index]

# Display current session title
st.subheader(f"Current Session: {current_session['title']}")

# Chat input
user_input = st.text_area("Your message", placeholder="Type your message here...")

# Send button
if st.button("Send") and user_input:
    # Add user message to current session history
    current_session['history'].append({
        "role": "user",
        "message": user_input,
        "timestamp": datetime.now().strftime("%Y-%m-%d %H:%M:%S")
    })
    
    try:
        # Get bot response
        bot_response = asyncio.run(get_streamed_response(user_input))
        
        # Add bot response to history
        current_session['history'].append({
            "role": "assistant",
            "message": bot_response,
            "timestamp": datetime.now().strftime("%Y-%m-%d %H:%M:%S")
        })
        
        # Update session title if this is the first message
        if len(current_session['history']) == 2:  # After first exchange
            current_session['title'] = user_input[:30] + "..."
    except Exception as e:
        st.error(f"Error getting response: {str(e)}")
    
    st.rerun()

# Display chat history for current session
if current_session['history']:
    st.write("### Chat History")
    for entry in current_session['history']:
        role_emoji = "👤" if entry['role'] == "user" else "🤖"
        st.markdown(
            f"{role_emoji} **{entry['role'].title()}**: {entry['message']}  \n"
            f"*{entry['timestamp']}*"
        )

# Start FastAPI in a separate thread
start_fastapi_thread()