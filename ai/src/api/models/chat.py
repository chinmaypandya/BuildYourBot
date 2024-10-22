from pydantic import BaseModel

class ChatRequest(BaseModel):
    graph_id: str
    user_message: str