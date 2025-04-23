from pydantic import BaseModel, ConfigDict
from typing import List
from uuid import UUID
from .subcategory import ReadNestedSubCategory

class CreateCategory(BaseModel):
    name: str
    model_config = ConfigDict(from_attributes=True)

class ReadCategory(BaseModel):
    id: UUID
    name: str
    model_config = ConfigDict(from_attributes=True) 


class ReadFullNestedCategory(BaseModel):
    id: UUID
    name: str
    sub_categories: List[ReadNestedSubCategory] = [] 

    model_config = ConfigDict(from_attributes=True)