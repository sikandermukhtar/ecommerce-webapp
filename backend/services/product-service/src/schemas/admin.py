# schemas/admin.py
from pydantic import BaseModel
from uuid import UUID

class AdminLogin(BaseModel):
    email: str
    password: str

class AdminCreate(BaseModel):
    email: str
    password: str

class AdminRead(BaseModel):
    id: UUID
    email: str

    class Config:
        orm_mode = True