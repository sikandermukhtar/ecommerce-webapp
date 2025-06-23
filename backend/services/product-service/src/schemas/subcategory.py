#schemas/subcategory.py

from pydantic import BaseModel, ConfigDict
from typing import List
from uuid import UUID
from .subgroup import ReadSubGroup
from typing import Optional

class CreateSubCategory(BaseModel):
    name: str
    main_category_id: UUID

    model_config = ConfigDict(from_attributes=True)

class ReadSubCategory(BaseModel):
    id: UUID
    name: str
    model_config = ConfigDict(from_attributes=True) 
    

class UpdateSubCategory(BaseModel):
    name: Optional[str]
    main_category_id: Optional[UUID]

class ReadNestedSubCategory(BaseModel):
    id: UUID
    name: str
    sub_group: List[ReadSubGroup] = [] 

    model_config = ConfigDict(from_attributes=True) 