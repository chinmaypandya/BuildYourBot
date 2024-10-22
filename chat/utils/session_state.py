import streamlit as st
import uuid

class SessionStateHandler:
    def __init__(self):
        pass

    def initialize_session_state(self):
        """Initializes the session state for user_id and current_session_id."""
        if 'user_id' not in st.session_state:
            # Generate a new user_id if none exists
            st.session_state.user_id = str(uuid.uuid4())

        if 'current_session_id' not in st.session_state:
            # Generate a new session_id if none exists
            st.session_state.current_session_id = str(uuid.uuid4())

        if 'chat_sessions' not in st.session_state:
            # Initialize chat sessions if not already present
            st.session_state.chat_sessions = []

        if 'current_session_index' not in st.session_state:
            # Set the current session index for active chat session
            st.session_state.current_session_index = len(st.session_state.chat_sessions)

    def add_new_chat_session(self):
        """Adds a new chat session to the session state and updates the session index."""
        new_session = {
            'session_id': st.session_state.current_session_id,
            'history': []
        }
        st.session_state.chat_sessions.append(new_session)
        st.session_state.current_session_index = len(st.session_state.chat_sessions) - 1
