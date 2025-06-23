#routes/category.py

from fastapi import APIRouter, Depends, HTTPException
from schemas import category
from uuid import UUID
from sqlalchemy.orm import Session, joinedload
from database import get_db
from models.category import MainCategory
from models.subcategory import SubCategory
from typing import List

category_router = APIRouter()

@category_router.post("/", response_model=category.ReadCategory)
def add_category(category: category.CreateCategory, db:Session = Depends(get_db)):
    try:
        db_category = MainCategory(name = category.name)
        db.add(db_category)
        db.commit()
        db.refresh(db_category)
        return db_category
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))
    
@category_router.get("/", response_model=List[category.ReadCategory])
def get_all_categories(db:Session = Depends(get_db)):
    return db.query(MainCategory).all()

@category_router.put("/{category_id}", response_model=category.ReadCategory)
def update_category(category_id: UUID, category: category.CreateCategory, db:Session = Depends(get_db)):
    
    db_category = db.query(MainCategory).filter(MainCategory.id == category_id).first()
    if db_category is None:
        raise HTTPException(status_code=404, detail="Category not found")
    if db_category.name is not None:
        db_category.name = category.name
    db.commit()
    db.refresh(db_category)
    return db_category

@category_router.delete("/{category_id}", response_model=dict)
def delete_category(category_id: UUID, db: Session = Depends(get_db)):
    db_category = db.query(MainCategory).filter(category_id == MainCategory.id).first()
    if db_category is None:
        raise HTTPException(status_code=404, detail="Category not found")
    db.delete(db_category)
    db.commit()
    return {"message": f"Category {category_id} deleted successfully"}

@category_router.get("/tree", response_model=List[category.ReadFullNestedCategory])
def get_full_category_tree(db: Session = Depends(get_db)):
    main_categories = db.query(MainCategory).options(
        joinedload(MainCategory.sub_categories).joinedload(SubCategory.sub_group)
    ).all()
    return [category.ReadFullNestedCategory.model_validate(main) for main in main_categories]

    
@category_router.get("/{category_id}", response_model=category.ReadCategory)
def get_category(category_id: UUID, db:Session = Depends(get_db)):
    db_category = db.query(MainCategory).filter(MainCategory.id == category_id).first()
    if db_category is None:
        raise HTTPException(status_code=404, detail="Category not found")
    return db_category