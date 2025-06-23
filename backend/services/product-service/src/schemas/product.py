#schemas/product.py

from pydantic import BaseModel, Field
from typing import List, Optional
from uuid import UUID

class ProductBase(BaseModel):
    title: str
    description: Optional[str]
    price: float
    main_category_id: UUID
    sub_category_id: UUID
    sub_group_id: UUID
    colors: List[str] = Field(default_factory=list)
    sizes: List[float] = Field(default_factory=list)
    assets: List[str] = Field(default_factory=list)

class ProductCreate(ProductBase):
    pass

class ProductUpdate(BaseModel):
    title: Optional[str]
    description: Optional[str]
    price: Optional[float]
    main_category_id: Optional[UUID]
    sub_category_id: Optional[UUID]
    sub_group_id: Optional[UUID]
    colors: Optional[List[str]]
    sizes: Optional[List[float]]
    assets: Optional[List[str]]

class ProductOut(ProductBase):
    id: UUID
    class Config:
        orm_mode = True

class ProductSummary(BaseModel):
    id: UUID
    title: str
    price: float
    colors: List[str]
    sizes: List[float]
    assets: List[str]
    class Config:
        orm_mode = True