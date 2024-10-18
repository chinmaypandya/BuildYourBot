import redis
import json
import uuid
import os
from typing import List, Dict
from datetime import datetime
from dotenv import load_dotenv

load_dotenv()

class ChatService:
    def __init__(self):
        # Connect to Redis server
        self.redis_client = redis.StrictRedis(
            host=os.getenv("REDIS_INTERNAL_HOST"),
            port=os.getenv("REDIS_INTERNAL_PORT"),
            db=int(os.getenv("REDIS_DB", 0)),
            decode_responses=True
        )

    def create_session(self, user_id: str) -> str:
        # Create a unique session ID for the user
        session_id = str(uuid.uuid4())
        self.redis_client.hset(session_id, mapping={"user_id": user_id, "messages": json.dumps([])})
        return session_id

    def store_message(self, session_id: str, user_id: str, role: str, message: str):
        # Authenticate user by checking the session ID and user ID
        stored_user_id = self.redis_client.hget(session_id, "user_id")
        
        if stored_user_id != user_id:
            raise ValueError("Authentication failed: User ID does not match the session ID.")

        # Store the message in Redis
        message_data = {
            "role": role,
            "message": message,
            "timestamp": datetime.now().strftime("%Y-%m-%d %H:%M:%S")
        }
        
        # Append the new message to the existing messages list
        messages = json.loads(self.redis_client.hget(session_id, "messages"))
        messages.append(message_data)
        self.redis_client.hset(session_id, "messages", json.dumps(messages))

    def retrieve_messages(self, session_id: str, user_id: str) -> List[Dict]:
        # Authenticate user by checking the session ID and user ID
        stored_user_id = self.redis_client.hget(session_id, "user_id")
        
        if stored_user_id != user_id:
            raise ValueError("Authentication failed: User ID does not match the session ID.")

        # Retrieve messages from Redis for a specific session_id
        messages = json.loads(self.redis_client.hget(session_id, "messages"))
        return messages

# Example usage
# chat_service = ChatService()
# session_id = chat_service.create_session("user_123")
# chat_service.store_message(session_id, "user_123", "user", "Hello!")
# messages = chat_service.retrieve_messages(session_id, "user_123")
# print(messages)