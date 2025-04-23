from fastapi import APIRouter, Depends, HTTPException
from schemas import category
from uuid import UUID
from sqlalchemy.orm import Session
from database import get_db
from models.category import MainCategory
from typing import List
from sqlalchemy.exc import NoResultFound

router = APIRouter()

@router.post("/add-category", response_model=dict)
def add_category(category: category.CreateCategory, db:Session = Depends(get_db)):
    try:
        new_category = MainCategory(
            name = category.name
        )
        db.add(new_category)
        db.commit()
        db.refresh(new_category)
        return new_category
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))
    
@router.get("/get-category/{category_id}", response_model=category.ReadCategory)
def get_category(category_id: UUID, db:Session = Depends(get_db)):
    try:
        category = db.query(MainCategory).filter(MainCategory.id == category_id).first()
        return category
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))
    
@router.get("/get-all-categories", response_model=List[category.ReadCategory])
def get_all_categories(db:Session = Depends(get_db)):
    return db.query(MainCategory).all()

@router.put("/update-category/{category_id}", response_model=category.ReadCategory)
def update_category(category_id: UUID, category: category.CreateCategory, db:Session = Depends(get_db)):
    try:
        updated_category = db.query(MainCategory).filter(MainCategory.id == category_id).first()
        if not category:
            raise NoResultFound("Category not found")
        updated_category.name = category.name
        db.commit()
        db.refresh(updated_category)
        return updated_category
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))

@router.delete("/delete-category/{category_id}", response_model=dict)
def delete_category(category_id: UUID, db: Session = Depends(get_db)):
    try:
        existing_category = db.query(MainCategory).filter(category_id == MainCategory.id).first()
        if not category:
            raise NoResultFound("Category not found")
        db.delete(existing_category)
        db.commit()
        return {"message": f"Category {category_id} deleted successfully"}
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))