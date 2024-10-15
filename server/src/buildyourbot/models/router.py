from pydantic import BaseModel

class RouterNode(BaseModel):
    id: str
    name: str
    member_roles: dict[str, str]