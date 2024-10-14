import streamlit as st
import uuid
from components.sidebar import render_sidebar
from services.chat_history_db import init_db, save_chat_to_db, get_chat_history
from services.openai_service import query_chatgpt

# Initialize the database (creates tables if not exists)
init_db()

# Unique session ID for the user (stored in session state)
if 'session_id' not in st.session_state:
    st.session_state['session_id'] = str(uuid.uuid4())  # Generate a unique session ID for the user

# Load chat history from the database
session_id = st.session_state['session_id']
chat_history = get_chat_history(session_id)

# Sidebar - display chat history
render_sidebar(chat_history)

# Main chat input area
st.title("ChatGPT-like Chat with Persistent Chat History")
user_input = st.text_area("Your message", placeholder="Type your message here...")

# Callback function to send a message and update chat history
def send_message():
    if user_input:
        # Get bot response
        with st.spinner("Generating response..."):
            bot_response = query_chatgpt(user_input)

        # Save chat to the database
        save_chat_to_db(session_id, user_input, bot_response)

        # Update chat history
        st.session_state['chat_history'].append({
            "user": user_input,
            "bot": bot_response
        })

        # Display the latest chat in the main area
        st.write(f"**You:** {user_input}")
        st.write(f"**Bot:** {bot_response}")
    else:
        st.warning("Please enter a message.")

# When the user clicks "Send", trigger the callback function
if st.button("Send"):
    send_message()

# Display all previous chat history on page load (even after session expiration)
if chat_history:
    for chat in chat_history:
        st.write(f"**You:** {chat['user']}")
        st.write(f"**Bot:** {chat['bot']}")
