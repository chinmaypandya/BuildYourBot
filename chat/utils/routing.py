# utils/routing.py

import streamlit as st
import uuid

class RoutingHandler:
    def __init__(self):
        self.graph_id_from_url = None
        self.session_id_from_url = None

    def handle_routing(self):
        self._parse_url_params()
        self._initialize_session_state()

    def _parse_url_params(self):
        self.graph_id_from_url = st.query_params.get('graph_id')
        self.session_id_from_url = st.query_params.get('session_id')

    def _initialize_session_state(self):
        if self.graph_id_from_url and self.session_id_from_url:
            st.session_state.graph_id = self.graph_id_from_url
            st.session_state.session_id = self.session_id_from_url
        elif self.graph_id_from_url:
            st.session_state.user_id = self.graph_id_from_url
            if 'session_id' not in st.session_state:
                st.session_state.session_id = str(uuid.uuid4())
        else:
            st.session_state.graph_id = str(uuid.uuid4())
            st.session_state.session_id = None
            
    def update_url_params(self, **params):
        """Update URL parameters."""
        current_params = dict(st.query_params)
        current_params.update(params)
        st.query_params.update(current_params)