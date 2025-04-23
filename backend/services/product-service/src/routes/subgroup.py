from fastapi import APIRouter, Depends, HTTPException
from schemas.subgroup import ReadSubGroup, CreateSubGroup
from uuid import UUID
from sqlalchemy.orm import Session
from database import get_db
from typing import List
from sqlalchemy.exc import NoResultFound
from models.subgroup import SubGroup

router = APIRouter()