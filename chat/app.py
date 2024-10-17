import streamlit as st
import asyncio
from datetime import datetime
from utils import get_streamed_response, start_fastapi_thread

# Initialize session state for chat sessions
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
        st.session_state['chat_sessions'].append({
            "title": "New Chat",
            "history": []
        })
        st.session_state['current_session_index'] = len(st.session_state['chat_sessions']) - 1
        st.rerun()

    # Display all chat sessions
    for idx, session in enumerate(st.session_state['chat_sessions']):
        session_title = session['history'][0]['message'][:30] + "..." if session['history'] else f"Session {idx + 1}"
        if st.button(f"Session {idx + 1}: {session_title}", key=f"session_{idx}"):
            st.session_state['current_session_index'] = idx
            st.rerun()

# Main chat interface
st.title("Build Your Bot")

# Ensure we have a valid session index
current_session_index = st.session_state['current_session_index']
current_session = st.session_state['chat_sessions'][current_session_index]

# Display current session title
st.subheader(f"Current Session: {current_session['title']}")

# Chatbot section

user_query = st.chat_input("Ask anything")

# If user inputs a query, display it and fetch a response
if user_query:
    st.chat_message('Human').markdown(user_query)

    # Append user's message to the chat history
    current_session['history'].append({
        "role": "user",
        "message": user_query,
        "timestamp": datetime.now().strftime("%Y-%m-%d %H:%M:%S")
    })

    with st.chat_message('AI'):
        # Simulate AI response - you can replace this with your actual chatbot response function
        bot_response = asyncio.run(get_streamed_response(user_query))
        
        # Display the bot's response
        st.markdown(bot_response)

        # Append bot's response to the chat history
        current_session['history'].append({
            "role": "assistant",
            "message": bot_response,
            "timestamp": datetime.now().strftime("%Y-%m-%d %H:%M:%S")
        })
    st.rerun()

# Display chat history for the current session
if current_session['history']:
    st.write("### Chat History")
    for entry in current_session['history']:
        role_emoji = "👤" if entry['role'] == "user" else "🤖"
        st.markdown(f"{role_emoji} **{entry['role'].title()}**: {entry['message']}  \n*{entry['timestamp']}*")

# Start FastAPI in a separate thread (if applicable to your app)
start_fastapi_thread()
