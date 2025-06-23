#routes/subcategory.py

from fastapi import APIRouter, Depends, HTTPException
from schemas.subcategory import ReadSubCategory, CreateSubCategory
from uuid import UUID
from sqlalchemy.orm import Session
from database import get_db
from typing import List
from sqlalchemy.exc import NoResultFound
from models.subcategory import SubCategory

subcategory_router = APIRouter()

@subcategory_router.get("/", response_model=List[ReadSubCategory])
def get_subcategory(db:Session = Depends(get_db)):
    return db.query(SubCategory).all()

@subcategory_router.get("/{subcategory_id}", response_model=ReadSubCategory)
def get_subcategory(subcategory_id: UUID, db:Session = Depends(get_db)):
    db_subcategory  = db.query(SubCategory).filter(SubCategory.id == subcategory_id).first()
    if not db_subcategory:
        raise NoResultFound("Subcategory not found")
    return db_subcategory


@subcategory_router.post("/", response_model=ReadSubCategory)
def add_subcategory(subcategory: CreateSubCategory, db:Session = Depends(get_db)):
    try:
        db_subcategory = SubCategory(
            name = subcategory.name,
            main_category_id = subcategory.main_category_id
        )
        db.add(db_subcategory)
        db.commit()
        db.refresh(db_subcategory)
        return db_subcategory
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))
    
@subcategory_router.put("/{subcategory_id}", response_model=ReadSubCategory)
def add_subcategory(subcategory_id: UUID, subcategory: CreateSubCategory, db:Session = Depends(get_db)):
    try:
        db_subcategory = db.query(SubCategory).filter(SubCategory.id == subcategory_id).first()
        if db_subcategory is None:
            raise NoResultFound("No subcategory with that id exists.")
        if subcategory.main_category_id is not None:
            db_subcategory.main_category_id = subcategory.main_category_id
        if subcategory.main_category_id is not None:
            db_subcategory.main_category_id = subcategory.main_category_id
        db.commit()
        db.refresh(db_subcategory)
        return db_subcategory
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))
    

@subcategory_router.delete("/{sub_category_id}", response_model=dict)
def delete_sub_category(sub_category_id: UUID, db: Session = Depends(get_db)):
    try:
        db_subcategory = db.query(SubCategory).filter(SubCategory.id == sub_category_id).first()
        if db_subcategory is None:
            raise NoResultFound("No subcategory with that id exists.")
        db.delete(db_subcategory)
        db.commit()
        return {"message": f"SubCategory {sub_category_id} deleted successfully"}
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))