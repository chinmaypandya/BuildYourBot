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
            host=os.getenv('REDIS_INTERNAL_HOST', 'redis'),
            port=int(os.getenv('REDIS_INTERNAL_PORT', 6379)),
            db=int(os.getenv("REDIS_DB", 0)),
            decode_responses=True
        )

    def create_session(self, user_id: str) -> str:
        # Create a unique session ID for the user
        session_id = str(uuid.uuid4())
        self.redis_client.hset(session_id, mapping={"user_id": user_id, "messages": json.dumps([])})
        
        # Add session ID to the user's list of sessions
        self.redis_client.rpush(f"user:{user_id}:sessions", session_id)
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

    def get_user_sessions(self, user_id: str) -> List[str]:
        # Retrieve all session IDs associated with the user
        session_ids = self.redis_client.lrange(f"user:{user_id}:sessions", 0, -1)
        return session_ids

    def delete_session(self, session_id: str, user_id: str):
        """Deletes the session from Redis and removes it from the user's session list."""
        # Remove the session from the user's list
        self.redis_client.lrem(f"user:{user_id}:sessions", 0, session_id)
        # Delete the session itself
        self.redis_client.delete(session_id)
