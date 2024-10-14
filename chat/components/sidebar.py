import streamlit as st

def render_sidebar(chat_history):
    # Inject custom CSS for better look
    st.markdown("""
        <style>
        .sidebar .sidebar-content {
            padding: 20px;
        }
        .chat-history-container {
            max-height: 300px;
            overflow-y: auto;
            padding: 10px;
            border: 1px solid #ddd;
            border-radius: 10px;
            background-color: #f8f9fa;
        }
        .chat-message {
            padding: 8px;
            margin-bottom: 8px;
            border-radius: 5px;
        }
        .user-message {
            background-color: #e2f0ff;
        }
        .bot-message {
            background-color: #f5f5f5;
        }
        </style>
    """, unsafe_allow_html=True)

    st.sidebar.title("Chat History")

    # Chat history container
    st.sidebar.markdown('<div class="chat-history-container">', unsafe_allow_html=True)

    # Display chat history
    for chat in chat_history:
        user_msg = f'<div class="chat-message user-message"><strong>You:</strong> {chat["user"]}</div>'
        bot_msg = f'<div class="chat-message bot-message"><strong>Bot:</strong> {chat["bot"]}</div>'
        st.sidebar.markdown(user_msg, unsafe_allow_html=True)
        st.sidebar.markdown(bot_msg, unsafe_allow_html=True)

    st.sidebar.markdown('</div>', unsafe_allow_html=True)
