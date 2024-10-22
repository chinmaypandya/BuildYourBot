import streamlit as st
import uuid

class RoutingHandler:
    def __init__(self):
        self.user_id_from_url = None
        self.session_id_from_url = None

    def handle_routing(self):
        """Handles URL routing, extracting user_id and session_id, and ensuring proper session state initialization."""
        self._parse_url_params()
        self._initialize_session_state()

    def _parse_url_params(self):
        """Parse the user_id and session_id from the URL query parameters."""
        url_params = st.experimental_get_query_params()
        self.user_id_from_url = url_params.get('user_id', [None])[0]
        self.session_id_from_url = url_params.get('session_id', [None])[0]

    def _initialize_session_state(self):
        """Initializes session state based on parsed user_id and session_id or generates new ones."""
        # If user_id is missing in the session state, use the one from the URL or generate a new one
        if 'user_id' not in st.session_state:
            if self.user_id_from_url:
                st.session_state.user_id = self.user_id_from_url
            else:
                st.session_state.user_id = str(uuid.uuid4())  # Generate a new user_id if none exists

        # If session_id is missing in the session state, use the one from the URL or create a new one
        if 'current_session_id' not in st.session_state:
            if self.session_id_from_url:
                st.session_state.current_session_id = self.session_id_from_url
            else:
                st.session_state.current_session_id = str(uuid.uuid4())  # Generate a new session_id if none exists

        # Update the URL with the new user_id and session_id if they were generated
        st.experimental_set_query_params(user_id=st.session_state.user_id, session_id=st.session_state.current_session_id)
