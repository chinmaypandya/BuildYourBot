import streamlit as st

class SidebarHandler:
    def __init__(self, chat_service):
        self.chat_service = chat_service

    def display_sidebar(self):
        """Displays the sidebar with chat session options."""
        st.sidebar.title("Chat Sessions")  # Use st.sidebar for the sidebar

        # Create a new chat button
        if st.sidebar.button("New Chat"):
            # Call the service to create a new chat
            session_id = self.chat_service.create_session(st.session_state.user_id)
            st.session_state.current_session_id = session_id  # Update the current session ID
            st.session_state.current_chat = []  # Reset the current chat history
            st.session_state.chat_sessions.append({"session_id": session_id, "history": [], "title": "New Chat"})
            st.experimental_rerun()

        # Display existing sessions
        for idx, session in enumerate(st.session_state.chat_sessions):
            session_title = session['title']
            if st.sidebar.button(f"Session {idx + 1}: {session_title}", key=f"session_{idx}"):
                st.session_state.current_session_index = idx
                st.session_state.current_session_id = session['session_id']  # Update session ID
                st.experimental_rerun()
