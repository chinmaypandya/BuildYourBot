from pydantic import BaseModel

class SimpleAgentModel(BaseModel):
    id: str
    parent_id: str | None = None
    name: str
    persona: str
    dos: str
    donts: str | None = None
    examples: str | None = None