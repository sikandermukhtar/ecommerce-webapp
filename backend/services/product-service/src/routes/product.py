#routes/product.py


from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from uuid import UUID
from typing import List

from database import get_db
from models.product import Product
from schemas.product import (
    ProductCreate, ProductUpdate, ProductOut, ProductSummary
)

product_router = APIRouter()

# Routes

@product_router.post("/", response_model=ProductOut)
def add_product(product: ProductCreate, db: Session = Depends(get_db)):
    db_product = Product(**product.model_dump())
    db.add(db_product)
    db.commit()
    db.refresh(db_product)
    return db_product

@product_router.get("/", response_model=List[ProductSummary])
def list_products(db: Session = Depends(get_db)):
    return db.query(Product).all()

@product_router.get("/main/{main_category_id}", response_model=List[ProductSummary])
def products_by_main(main_category_id: UUID, db: Session = Depends(get_db)):
    return db.query(Product).filter(Product.main_category_id == main_category_id).all()

@product_router.get("/sub/{sub_category_id}", response_model=List[ProductSummary])
def products_by_sub(sub_category_id: UUID, db: Session = Depends(get_db)):
    return db.query(Product).filter(Product.sub_category_id == sub_category_id).all()


@product_router.get("/group/{group_id}", response_model=List[ProductSummary])
def products_by_group(group_id: UUID, db: Session = Depends(get_db)):
    return db.query(Product).filter(Product.sub_group_id == group_id).all()

@product_router.get("/{product_id}", response_model=ProductOut)
def get_one(product_id: UUID, db: Session = Depends(get_db)):
    db_prod = db.query(Product).filter(Product.id == product_id).first()
    if db_prod is None:
        raise HTTPException(status_code=404, detail="Product not found")
    return db_prod

@product_router.put("/{product_id}", response_model=ProductOut)
def update_one(product_id: UUID, data: ProductUpdate, db: Session = Depends(get_db)):
    db_prod = db.query(Product).filter(Product.id == product_id).first()
    if db_prod is None:
        raise HTTPException(status_code=404, detail="Product not found")
    updates = data.model_dump(exclude_unset=True)
    for field, value in updates.items():
        setattr(db_prod, field, value)
    db.commit()
    db.refresh(db_prod)
    return db_prod

@product_router.delete("/{product_id}", response_model=dict)
def delete_one(product_id: UUID, db: Session = Depends(get_db)):
    db_prod = db.query(Product).filter(Product.id == product_id).first()
    if db_prod is None:
        raise HTTPException(status_code=404, detail="Product not found")
    db.delete(db_prod)
    db.commit()
    return {"message": "Product deleted successfully"}