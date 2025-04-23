from fastapi import APIRouter, Depends, HTTPException
from schemas.subcategory import ReadSubCategory, CreateSubCategory
from uuid import UUID
from sqlalchemy.orm import Session
from database import get_db
from typing import List
from sqlalchemy.exc import NoResultFound
from models.subcategory import SubCategory

router = APIRouter()

@router.get("/get-subcategory/{subcategory_id}", response_model=ReadSubCategory)
def get_subcategory(subcategory_id: UUID, db:Session = Depends(get_db)):
    subcategory  = db.query(SubCategory).filter(SubCategory.id == subcategory_id).first()
    if not subcategory:
        raise NoResultFound("Subcategory not found")
    return subcategory

@router.get("/get-all-subcategories", response_model=List[ReadSubCategory])
def get_subcategory(db:Session = Depends(get_db)):
    return db.query(SubCategory).all()

@router.post("/add-subcategory", response_model=ReadSubCategory)
def add_subcategory(new_subcategory: CreateSubCategory, db:Session = Depends(get_db)):
    try:
        subcategory_new = SubCategory(
            name = new_subcategory.name,
            main_category_id = new_subcategory.main_category_id
        )
        db.add(subcategory_new)
        db.commit()
        db.refresh(subcategory_new)
        return subcategory_new
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))
    
@router.put("/update-subcategory/{subcategory_id}", response_model=ReadSubCategory)
def add_subcategory(subcategory_id: UUID, subcategory: CreateSubCategory, db:Session = Depends(get_db)):
    try:
        existing_subcategory = db.query(SubCategory).filter(SubCategory.id == subcategory_id).first()
        if not existing_subcategory:
            raise NoResultFound("No subcategory with that id exists.")
        existing_subcategory.name = subcategory.name
        db.commit()
        db.refresh(existing_subcategory)
        return existing_subcategory
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))
    

@router.delete("/delete-subcategory/{sub_category_id}", response_model=dict)
def delete_sub_category(sub_category_id: UUID, db: Session = Depends(get_db)):
    try:
        existing_subcategory = db.query(SubCategory).filter(SubCategory.id == sub_category_id).first()
        if not existing_subcategory:
            raise NoResultFound("No subcategory with that id exists.")
        db.delete(existing_subcategory)
        db.commit()
        return {"message": f"SubCategory {sub_category_id} deleted successfully"}
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))