#schemas/subgroup.py

from pydantic import BaseModel, ConfigDict
from typing import Optional
from uuid import UUID

class CreateSubGroup(BaseModel):
    name: str
    sub_category_id: UUID

    model_config = ConfigDict(from_attributes=True)

# Schema for SubSubCategory output
class ReadSubGroup(BaseModel):
    id: UUID
    name: str

    model_config = ConfigDict(from_attributes=True) 
    

class UpdateSubGroup(BaseModel):
    name: Optional[str]
    sub_category_id: Optional[UUID]
    