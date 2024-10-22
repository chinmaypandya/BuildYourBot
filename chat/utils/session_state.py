import streamlit as st
import uuid

class SessionStateHandler:
    def __init__(self):
        pass

    def initialize_session_state(self):
        
        query_params = st.session_state.get("query_params", {})
        
        graph_id = query_params.get("graph_id", None)
        
        """Initializes the session state for user_id and current_session_id (if not already created)."""
        if 'user_id' not in st.session_state:
            st.session_state.user_id = None

        # Only create session_id if it doesn't exist yet (avoid overwriting)
        if 'session_id' not in st.session_state:
            st.session_state.session_id = None

        if 'chat_sessions' not in st.session_state:
            # Initialize chat sessions if not already present
            st.session_state.chat_sessions = []

        if 'current_session_index' not in st.session_state:
            # Set the current session index for active chat session
            st.session_state.current_session_index = len(st.session_state.chat_sessions)
            
        if 'graph_id' in query_params:
            graph_id = query_params['graph_id'][0]
            st.session_state.current_graph_id = graph_id  # Store graph_id in session state

    def create_new_session(self):
        """Creates a new session_id and updates chat_sessions."""
        st.session_state.session_id = uuid.uuid4().hex  # Generate random session_id
        self.add_new_chat_session()  # Add a new chat session for this user/session

    def add_new_chat_session(self):
        """Adds a new chat session to the session state and updates the session index."""
        new_session = {
            'session_id': st.session_state.current_session_id,
            'history': []
        }
        st.session_state.chat_sessions.append(new_session)
        st.session_state.current_session_index = len(st.session_state.chat_sessions) - 1