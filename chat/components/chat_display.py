import streamlit as st
from services.chat_service import ChatService
from datetime import datetime

class ChatDisplayHandler:
    def __init__(self, chat_service):
        self.chat_service = chat_service

    def display_chat(self):
        """Displays the chat interface."""
        if st.session_state.chat_sessions:
            current_session = st.session_state.chat_sessions[st.session_state.current_session_index]
            st.title("Build Your Bot")
            st.subheader(f"Current Session: {self.get_session_title(current_session)}")

            # Display chat history
            if current_session['history']:
                for entry in current_session['history']:
                    with st.chat_message(entry['role']):
                        st.markdown(entry['message'])
                        st.caption(f"{entry['timestamp']}")

            # Chat input
            user_query = st.chat_input("Ask anything")
            if user_query:
                self.handle_user_message(user_query)

    def handle_user_message(self, user_query):
        """Handles the user input and bot response."""
        current_session = st.session_state.chat_sessions[st.session_state.current_session_index]
        timestamp = datetime.now().strftime("%Y-%m-%d %H:%M:%S")

        # Display and store user message
        with st.chat_message('user'):
            st.markdown(user_query)
            st.caption(timestamp)
        current_session['history'].append({
            "role": "user",
            "message": user_query,
            "timestamp": timestamp
        })
        self.chat_service.store_message(st.session_state.current_session_id, st.session_state.user_id, "user", user_query)

        # Mock bot response (same as user message for now)
        with st.chat_message('assistant'):
            st.markdown(user_query)
            st.caption(timestamp)
        current_session['history'].append({
            "role": "assistant",
            "message": user_query,
            "timestamp": timestamp
        })
        self.chat_service.store_message(st.session_state.current_session_id, st.session_state.user_id, "assistant", user_query)

    def get_session_title(self, session):
        """Returns the title based on the first user message."""
        if session['history']:
            first_message = next((msg['message'] for msg in session['history'] if msg['role'] == 'user'), None)
            if first_message:
                return first_message[:30] + "..." if len(first_message) > 30 else first_message
        return "New Chat"
