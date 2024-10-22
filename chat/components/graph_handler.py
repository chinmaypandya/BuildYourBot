import streamlit as st
import requests

def get_ai_response(user_message:str):
    try:
        query_params = st.session_state.get("query_params", {})
        
        graph_id = query_params.get("graph_id", None)
        
        if graph_id:
            response = requests.post(f"{"http://ai:8000"}/v1/chat", {
                "graph_id": graph_id,
                "user_message": user_message
                
            })
            
            print(response)
            return response
            
    except Exception as e:
        print(e)
            
        