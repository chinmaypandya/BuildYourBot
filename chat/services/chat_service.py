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
        try:
            # Connect to Redis server
            self.redis_client = redis.StrictRedis(
                host=os.getenv('REDIS_API_HOST', 'localhost'),
                port=int(os.getenv('REDIS_INTERNAL_PORT', 6379)),
                db=int(os.getenv("REDIS_DB", 0)),
                decode_responses=True
            )
            # Test Redis connection
            self.redis_client.ping()
        except redis.ConnectionError as e:
            raise ConnectionError("Failed to connect to Redis server.") from e

    def create_session(self, user_id: str) -> str:
        """Creates a unique session ID and associates it with the user."""
        session_id = str(uuid.uuid4())
        try:
            self.redis_client.hset(session_id, mapping={"user_id": user_id, "messages": json.dumps([])})
            self.redis_client.rpush(f"user:{user_id}:sessions", session_id)
        except redis.RedisError as e:
            raise RuntimeError(f"Failed to create session for user {user_id}.") from e
        return session_id

    def store_message(self, session_id: str, user_id: str, role: str, message: str):
        """Stores a message in the session, ensuring the session belongs to the user."""
        try:
            # Authenticate user by checking the session ID and user ID
            stored_user_id = self.redis_client.hget(session_id, "user_id")
            if stored_user_id != user_id:
                raise ValueError("Authentication failed: User ID does not match the session ID.")

            # Prepare message data
            message_data = {
                "role": role,
                "message": message,
                "timestamp": datetime.now().strftime("%Y-%m-%d %H:%M:%S")
            }

            # Retrieve and update messages
            messages = json.loads(self.redis_client.hget(session_id, "messages"))
            messages.append(message_data)
            self.redis_client.hset(session_id, "messages", json.dumps(messages))
        except redis.RedisError as e:
            raise RuntimeError(f"Failed to store message for session {session_id}.") from e

    def retrieve_messages(self, session_id: str, user_id: str) -> List[Dict]:
        """Retrieves all messages from a session, after verifying the user."""
        try:
            # Authenticate user
            stored_user_id = self.redis_client.hget(session_id, "user_id")
            if stored_user_id != user_id:
                raise ValueError("Authentication failed: User ID does not match the session ID.")
            
            # Retrieve messages
            messages = json.loads(self.redis_client.hget(session_id, "messages"))
            return messages
        except redis.RedisError as e:
            raise RuntimeError(f"Failed to retrieve messages for session {session_id}.") from e

    def get_user_sessions(self, user_id: str) -> List[str]:
        """Retrieves all session IDs associated with the user."""
        try:
            session_ids = self.redis_client.lrange(f"user:{user_id}:sessions", 0, -1)
            return session_ids
        except redis.RedisError as e:
            raise RuntimeError(f"Failed to retrieve sessions for user {user_id}.") from e

    def delete_session(self, session_id: str, user_id: str):
        """Deletes a session and removes it from the user's session list."""
        try:
            # Remove the session from the user's list
            self.redis_client.lrem(f"user:{user_id}:sessions", 0, session_id)
            # Delete the session itself
            self.redis_client.delete(session_id)
        except redis.RedisError as e:
            raise RuntimeError(f"Failed to delete session {session_id} for user {user_id}.") from e
