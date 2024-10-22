import streamlit as st
import redis
from utils.routing import RoutingHandler
from utils.session_state import SessionStateHandler
from components.sidebar import SidebarHandler
from components.chat_display import ChatDisplayHandler
from components.graph_handler import GraphHandler
from services.chat_service import ChatService

redis_client = redis.Redis(host='localhost', port=6379, db=0, decode_responses=True)

# Initialize the services
chat_service = ChatService()


# Initialize the utility classes
routing_handler = RoutingHandler()
session_state_handler = SessionStateHandler()
sidebar_handler = SidebarHandler(chat_service)
chat_display_handler = ChatDisplayHandler(chat_service)

def main():
    # Handle routing
    routing_handler.handle_routing()

    # Initialize session state (assume user is already logged in)
    session_state_handler.initialize_session_state()

    # Check if this is a graph request
    if 'graph_id' in st.query_params:
        graph_id = st.query_params.get('graph_id')
        if not graph_id:
            st.error("graph not submitted for chat")
            
            
            return
        return

    # Regular chat interface
    sidebar_handler.display_sidebar()
    chat_display_handler.display_chat()

if __name__ == '__main__':
    main()