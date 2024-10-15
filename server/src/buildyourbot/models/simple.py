from pydantic import BaseModel

class SimpleNode(BaseModel):
    id: str
    parent_id: str | None
    name: str
    persona: str
    dos: str
    donts: str | None
    examples: str | None