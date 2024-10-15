from pydantic import BaseModel

class ChatRequest(BaseModel):
    graph_id: str
    nodes: list[dict[str, str]]
    name: str
    description: str | None = None