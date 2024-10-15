import sqlite3
import time

# Initialize the database and create the table if it doesn't exist
def init_db():
    conn = sqlite3.connect('chat_history.db')
    cursor = conn.cursor()

    # Create a table to store chat history
    cursor.execute('''
        CREATE TABLE IF NOT EXISTS chat_history (
            session_id TEXT,
            timestamp TEXT,
            user_input TEXT,
            bot_response TEXT
        )
    ''')

    conn.commit()
    conn.close()

# Function to save chat to the database
def save_chat_to_db(session_id, user_input, bot_response):
    conn = sqlite3.connect('chat_history.db')
    cursor = conn.cursor()

    timestamp = time.strftime('%Y-%m-%d %H:%M:%S')  # Current timestamp

    # Insert chat data into the database
    cursor.execute('''
        INSERT INTO chat_history (session_id, timestamp, user_input, bot_response)
        VALUES (?, ?, ?, ?)
    ''', (session_id, timestamp, user_input, bot_response))

    conn.commit()
    conn.close()

# Function to retrieve chat history for a specific session
def get_chat_history(session_id):
    conn = sqlite3.connect('chat_history.db')
    cursor = conn.cursor()

    # Query to fetch chat history for the given session_id
    cursor.execute('''
        SELECT timestamp, user_input, bot_response
        FROM chat_history
        WHERE session_id = ?
        ORDER BY timestamp ASC
    ''', (session_id,))

    history = cursor.fetchall()
    conn.close()

    return history
