from fastapi import APIRouter, Depends, HTTPException
from schemas.subgroup import ReadSubGroup, CreateSubGroup
from uuid import UUID
from sqlalchemy.orm import Session
from database import get_db
from typing import List
from sqlalchemy.exc import NoResultFound
from models.subgroup import SubGroup

subgroup_router = APIRouter()

@subgroup_router.get("/", response_model=List[ReadSubGroup])
def get_subgroup(db:Session = Depends(get_db)):
    return db.query(SubGroup).all()

@subgroup_router.get("/{subgroup_id}", response_model=ReadSubGroup)
def get_subgroup(subgroup_id: UUID, db:Session = Depends(get_db)):
    db_subgroup  = db.query(SubGroup).filter(SubGroup.id == subgroup_id).first()
    if db_subgroup is None:
        raise HTTPException(status_code=404, detail="Subgroup not found")
    return db_subgroup

@subgroup_router.post("/", response_model=ReadSubGroup)
def add_subgroup(subgroup: CreateSubGroup, db:Session = Depends(get_db)):
    try:
        db_subgroup = SubGroup(
            name = subgroup.name,
            sub_category_id = subgroup.sub_category_id
        )
        db.add(db_subgroup)
        db.commit()
        db.refresh(db_subgroup)
        return db_subgroup
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))
    
@subgroup_router.put("/{subgroup_id}", response_model=ReadSubGroup)
def add_subgroup(subgroup_id: UUID, subgroup: CreateSubGroup, db:Session = Depends(get_db)):
    try:
        db_subgroup = db.query(SubGroup).filter(SubGroup.id == subgroup_id).first()
        if not db_subgroup:
            raise NoResultFound("No subgroup with that id exists.")
        if subgroup.name is not None:
            db_subgroup.name = subgroup.name
        if subgroup.sub_category_id is not None:
            db_subgroup.sub_category_id = subgroup.sub_category_id
        db.commit()
        db.refresh(db_subgroup)
        return db_subgroup
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))
    

@subgroup_router.delete("/{subgroup_id}", response_model=dict)
def delete_subgroup(subgroup_id: UUID, db: Session = Depends(get_db)):
    try:
        db_subgroup = db.query(SubGroup).filter(SubGroup.id == subgroup_id).first()
        if db_subgroup is None:
            raise HTTPException(status_code=404, detail="Subcategory not found")
        db.delete(db_subgroup)
        db.commit()
        return {"message": f"SubCategory {subgroup_id} deleted successfully"}
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))