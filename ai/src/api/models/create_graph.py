from pydantic import BaseModel

class CreateGraphRequest(BaseModel):
    graph_id: str
    nodes: list[dict[str, str | None]]
    name: str
    description: str | None = None