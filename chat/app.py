import streamlit as st
from utils.routing import RoutingHandler
from utils.session_state import SessionStateHandler
from components.sidebar import SidebarHandler
from components.chat_display import ChatDisplayHandler
from services.chat_service import ChatService  # Import ChatService

# Initialize the utility classes
chat_service = ChatService()  # Create a single instance of ChatService
routing_handler = RoutingHandler()
session_state_handler = SessionStateHandler()
sidebar_handler = SidebarHandler(chat_service)  # Pass chat_service to SidebarHandler
chat_display_handler = ChatDisplayHandler(chat_service)  # Pass chat_service to ChatDisplayHandler

def main():
    # Handle routing
    routing_handler.handle_routing()

    # Initialize session state
    session_state_handler.initialize_session_state()

    # Display the sidebar
    sidebar_handler.display_sidebar()

    # Display chat session
    chat_display_handler.display_chat()

if __name__ == '__main__':
    main()
