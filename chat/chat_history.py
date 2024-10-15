import streamlit as st
from datetime import datetime, timedelta

# Function to add a message to chat history
def add_to_chat_history(message):
    if "chat_history" not in st.session_state:
        st.session_state['chat_history'] = []

    # Add the message with the current timestamp
    st.session_state['chat_history'].append({
        "message": message,
        "timestamp": datetime.now().strftime("%Y-%m-%d %H:%M:%S")
    })

# Function to categorize messages by Today, Yesterday, and Past 7 Days
def categorize_messages():
    today = datetime.now().date()
    yesterday = today - timedelta(days=1)
    past_7_days = today - timedelta(days=7)

    today_msgs = []
    yesterday_msgs = []
    past_7_days_msgs = []

    for entry in reversed(st.session_state['chat_history']):  # Reverse to show the latest first
        msg_time = datetime.strptime(entry['timestamp'], "%Y-%m-%d %H:%M:%S").date()

        if msg_time == today:
            today_msgs.append(entry)
        elif msg_time == yesterday:
            yesterday_msgs.append(entry)
        elif past_7_days <= msg_time < yesterday:
            past_7_days_msgs.append(entry)

    return today_msgs, yesterday_msgs, past_7_days_msgs

# Function to display categorized chat history in the sidebar
def display_chat_history():
    if "chat_history" in st.session_state and st.session_state['chat_history']:
        today_msgs, yesterday_msgs, past_7_days_msgs = categorize_messages()

        if today_msgs:
            st.write("### Today")
            for entry in today_msgs:
                st.write(f"**[{entry['timestamp']}]**: {entry['message']}")

        if yesterday_msgs:
            st.write("### Yesterday")
            for entry in yesterday_msgs:
                st.write(f"**[{entry['timestamp']}]**: {entry['message']}")

        if past_7_days_msgs:
            st.write("### Past 7 Days")
            for entry in past_7_days_msgs:
                st.write(f"**[{entry['timestamp']}]**: {entry['message']}")
    else:
        st.write("No chat history available.")
