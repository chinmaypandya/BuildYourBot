import streamlit as st
from datetime import datetime
from chat_service import ChatService

# Initialize ChatService
chat_service = ChatService()

# Initialize ALL session state variables at the start
if 'current_chat' not in st.session_state:
    st.session_state.current_chat = []

if 'chat_sessions' not in st.session_state:
    st.session_state.chat_sessions = []

if 'current_session_index' not in st.session_state:
    st.session_state.current_session_index = 0

if 'user_id' not in st.session_state:
    st.session_state.user_id = None  # Store the user ID in session state

def load_existing_sessions(user_id):
    """Load all sessions for the user and retrieve chat history."""
    session_ids = chat_service.get_user_sessions(user_id)
    st.session_state.chat_sessions = []  # Clear current session list
    for session_id in session_ids:
        # Retrieve all messages for this session
        history = chat_service.retrieve_messages(session_id, user_id)
        # Add session to session state
        st.session_state.chat_sessions.append({
            "session_id": session_id,
            "title": "Previous Chat",
            "history": history
        })

def create_new_chat():
    """Create a new chat session and store it in session state."""
    session_id = chat_service.create_session(st.session_state.user_id)
    st.session_state.chat_sessions.append({
        "session_id": session_id,
        "title": "New Chat",
        "history": []
    })
    st.session_state.current_session_index = len(st.session_state.chat_sessions) - 1
    st.session_state.current_chat = []  # Reset current chat

def get_session_title(session):
    """Return the title based on the first message in the session history."""
    if session['history']:
        first_message = next((msg['message'] for msg in session['history'] if msg['role'] == 'user'), None)
        if first_message:
            return first_message[:30] + "..." if len(first_message) > 30 else first_message
    return "New Chat"

# Sidebar for chat sessions
with st.sidebar:
    st.title("Chat Sessions")

    # Input for user ID and store it in session state
    if not st.session_state.user_id:
        user_id_input = st.text_input("Enter your User ID")
        if user_id_input:
            st.session_state.user_id = user_id_input
            load_existing_sessions(st.session_state.user_id)  # Load previous sessions

    if st.session_state.user_id:
        if st.button("New Chat"):
            create_new_chat()
            st.rerun()

        for idx, session in enumerate(st.session_state.chat_sessions):
            session_title = get_session_title(session)
            if st.button(f"Session {idx + 1}: {session_title}", key=f"session_{idx}"):
                st.session_state.current_session_index = idx
                st.rerun()
    else:
        st.warning("Please enter a User ID to start a chat.")

# Check if there are any chat sessions
if st.session_state.chat_sessions:
    # Main chat interface
    st.title("Build Your Bot")

    current_session_index = st.session_state.current_session_index
    current_session = st.session_state.chat_sessions[current_session_index]

    current_title = get_session_title(current_session)
    st.subheader(f"Current Session: {current_title}")

    # Display chat history
    if current_session['history']:
        for entry in current_session['history']:
            with st.chat_message(entry['role']):
                st.markdown(entry['message'])
                st.caption(f"{entry['timestamp']}")

    # Chat input
    user_query = st.chat_input("Ask anything")

    if user_query:
        # Display user message
        with st.chat_message('user'):
            st.markdown(f"""
            <div class="user-message">
                {user_query}
                <div class="message-timestamp">{datetime.now().strftime("%Y-%m-%d %H:%M:%S")}</div>
            </div>
            """, unsafe_allow_html=True)

        # Add user message to history
        current_session['history'].append({
            "role": "user",
            "message": user_query,
            "timestamp": datetime.now().strftime("%Y-%m-%d %H:%M:%S")
        })

        # Store user message in Redis
        session_id = current_session['session_id']
        try:
            chat_service.store_message(session_id, st.session_state.user_id, "user", user_query)
        except ValueError as e:
            st.error(str(e))  # Show authentication error if any

        # Display bot response (same as user message)
        with st.chat_message('assistant'):
            st.markdown(user_query)  # Echo user query as bot response

            # Add bot response to history (same as user query)
            current_session['history'].append({
                "role": "assistant",
                "message": user_query,  # Echoing user query
                "timestamp": datetime.now().strftime("%Y-%m-%d %H:%M:%S")
            })

        st.rerun()

    # Clear chat functionality
    if st.sidebar.button("Clear Current Chat"):
        session_id = current_session['session_id']
        chat_service.delete_session(session_id, st.session_state.user_id)
        st.session_state.chat_sessions.pop(current_session_index)  # Remove from session state
        st.session_state.current_session_index = max(0, current_session_index - 1)
        st.session_state.current_chat = []
        st.rerun()

else:
    st.warning("No chat sessions available. Please create a new chat session.")
