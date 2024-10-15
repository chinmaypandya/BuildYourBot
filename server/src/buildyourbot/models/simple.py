from pydantic import BaseModel

class SimpleNode(BaseModel):
    id: str
    name: str
    persona: str
    dos: str
    donts: str | None
    examples: str | None