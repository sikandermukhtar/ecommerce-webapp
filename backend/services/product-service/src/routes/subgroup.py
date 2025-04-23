from fastapi import APIRouter, Depends, HTTPException
from schemas.subgroup import ReadSubGroup, CreateSubGroup
from uuid import UUID
from sqlalchemy.orm import Session
from database import get_db
from typing import List
from sqlalchemy.exc import NoResultFound
from models.subgroup import SubGroup

router = APIRouter()


@router.get("/get-subgroup/{subgroup_id}", response_model=ReadSubGroup)
def get_subgroup(subgroup_id: UUID, db:Session = Depends(get_db)):
    subgroup  = db.query(SubGroup).filter(SubGroup.id == subgroup_id).first()
    if not subgroup:
        raise NoResultFound("Subgroup not found")
    return subgroup

@router.get("/get-all-subgroups", response_model=List[ReadSubGroup])
def get_subgroup(db:Session = Depends(get_db)):
    return db.query(SubGroup).all()

@router.post("/add-subgroup", response_model=ReadSubGroup)
def add_subgroup(subgroup: CreateSubGroup, db:Session = Depends(get_db)):
    try:
        new_subgroup = SubGroup(
            name = subgroup.name,
            sub_category_id = subgroup.sub_category_id
        )
        db.add(new_subgroup)
        db.commit()
        db.refresh(new_subgroup)
        return new_subgroup
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))
    
@router.put("/update-subgroup/{subgroup_id}", response_model=ReadSubGroup)
def add_subgroup(subgroup_id: UUID, subgroup: CreateSubGroup, db:Session = Depends(get_db)):
    try:
        existing_subgroup = db.query(SubGroup).filter(SubGroup.id == subgroup_id).first()
        if not existing_subgroup:
            raise NoResultFound("No subgroup with that id exists.")
        existing_subgroup.name = subgroup.name
        db.commit()
        db.refresh(existing_subgroup)
        return existing_subgroup
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))
    

@router.delete("/delete-subgroup/{subgroup_id}", response_model=dict)
def delete_subgroup(subgroup_id: UUID, db: Session = Depends(get_db)):
    try:
        existing_subgroup = db.query(SubGroup).filter(SubGroup.id == subgroup_id).first()
        if not existing_subgroup:
            raise NoResultFound("No subgroup with that id exists.")
        db.delete(existing_subgroup)
        db.commit()
        return {"message": f"SubCategory {subgroup_id} deleted successfully"}
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))