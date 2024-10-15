from pydantic import BaseModel

class ChatRequest(BaseModel):
    graph_id: str
    nodes: list[dict[str, str]] | None = None
    name: str | None = None
    description: str | None = None
