import streamlit as st
from services.chat_service import ChatService

class SidebarHandler:
  def __init__(self, chat_service: ChatService):
    self.chat_service = chat_service

  def display_sidebar(self):
    with st.sidebar:
      # New Chat button (automatically creates session)
      if st.button("New Chat"):
        new_session_id = self.chat_service.create_session(st.session_state.user_id)

        # Update session state and URL params
        st.session_state.session_id = new_session_id
        st.query_params['session_id'] = new_session_id

        # Rerun to refresh the page with new session
        st.rerun()

      # Display existing sessions
      st.write("Your conversations:")
      try:
        sessions = self.chat_service.get_user_sessions(st.session_state.user_id)
        for session_id in sessions:
          messages = self.chat_service.retrieve_messages(session_id, st.session_state.user_id)

          # Get the first message or use a default title
          session_title = f"Chat {session_id[:8]}..."  # Use first 8 chars of session ID

          # If there are messages, use the first one as title (limited to 30 chars)
          if messages and len(messages) > 0:
            session_title = messages[0].get('message', session_title)[:30] + "..."

          # Create a button for each session (doesn't create a new session)
          if st.button(session_title, key=f"session_{session_id}"):
            st.session_state.session_id = session_id
            st.query_params['session_id'] = session_id
            st.rerun()

      except Exception as e:
        st.error(f"Error loading sessions: {str(e)}")

      # Add a delete button for current session
      if 'session_id' in st.session_state and st.session_state.session_id:
        if st.button("Delete Current Chat", key="delete_chat"):
          self.chat_service.delete_session(
              st.session_state.session_id,
              st.session_state.user_id
          )

          # Clear session_id from state and URL
          st.session_state.session_id = None
          st.query_params['session_id'] = None
          st.rerun()