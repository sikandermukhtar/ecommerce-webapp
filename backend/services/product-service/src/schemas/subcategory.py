from pydantic import BaseModel, ConfigDict
from typing import List
from uuid import UUID
from .subgroup import ReadSubGroup

class CreateSubCategory(BaseModel):
    name: str
    main_category_id: UUID

    model_config = ConfigDict(from_attributes=True)

class ReadSubCategory(BaseModel):
    id: UUID
    name: str
    model_config = ConfigDict(from_attributes=True) 

class ReadNestedSubCategory(BaseModel):
    id: UUID
    name: str
    sub_sub_categories: List[ReadSubGroup] = [] 

    model_config = ConfigDict(from_attributes=True) 