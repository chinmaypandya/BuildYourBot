import streamlit as st

# Function to render search bar UI
def render_search_bar():
    # Injecting CSS for styling
    st.markdown("""
        <style>
        .search-container {
            display: flex;
            justify-content: center;
            margin-top: 30px;
            margin-bottom: 30px;
        }
        .search-input {
            width: 60%;
            height: 40px;
            font-size: 18px;
            padding: 8px;
            border: 2px solid #ddd;
            border-radius: 5px;
            box-shadow: 0px 4px 10px rgba(0, 0, 0, 0.1);
        }
        .submit-btn {
            background-color: #4CAF50;
            color: white;
            padding: 10px 20px;
            border: none;
            border-radius: 5px;
            cursor: pointer;
            margin-left: 10px;
        }
        .submit-btn:hover {
            background-color: #45a049;
        }
        </style>
    """, unsafe_allow_html=True)
    
    st.markdown('<div class="search-container">', unsafe_allow_html=True)
    
    # Search input text box
    user_input = st.text_input("", "", key="search", placeholder="Type your query...", label_visibility="collapsed")
    
    st.markdown('<button class="submit-btn">Search</button>', unsafe_allow_html=True)
    
    st.markdown('</div>', unsafe_allow_html=True)
    
    return user_input
