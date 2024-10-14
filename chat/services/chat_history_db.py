import sqlite3
from typing import List, Dict

# Initialize the SQLite database connection
def init_db():
    conn = sqlite3.connect('chat_history.db')
    cursor = conn.cursor()
    # Create the table if it doesn't exist
    cursor.execute('''
    CREATE TABLE IF NOT EXISTS chat_history (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        user_message TEXT NOT NULL,
        bot_response TEXT NOT NULL,
        session_id TEXT NOT NULL
    )
    ''')
    conn.commit()
    conn.close()

# Save the user's chat message and bot's response to the database
def save_chat_to_db(session_id: str, user_message: str, bot_response: str):
    conn = sqlite3.connect('chat_history.db')
    cursor = conn.cursor()
    cursor.execute('''
    INSERT INTO chat_history (user_message, bot_response, session_id)
    VALUES (?, ?, ?)
    ''', (user_message, bot_response, session_id))
    conn.commit()
    conn.close()

# Retrieve all chat history for a given session_id
def get_chat_history(session_id: str) -> List[Dict[str, str]]:
    conn = sqlite3.connect('chat_history.db')
    cursor = conn.cursor()
    cursor.execute('''
    SELECT user_message, bot_response FROM chat_history WHERE session_id = ?
    ''', (session_id,))
    rows = cursor.fetchall()
    conn.close()

    # Format the data into a list of dictionaries
    history = [{'user': row[0], 'bot': row[1]} for row in rows]
    return history
