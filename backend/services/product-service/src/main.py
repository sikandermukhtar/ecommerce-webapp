from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from db import base, session
from routes import category, subcategory, subgroup, product, order, admin
from contextlib import asynccontextmanager
from db.base import Base
from auth import get_password_hash
import uuid
from sqlalchemy.orm import Session
from database import get_db
from db.session import engine
from models.admin import AdminUser



base.Base.metadata.create_all(bind=session.engine)

app = FastAPI(lifespan=None)

origins = [
    "http://localhost:3000",
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(router=category.category_router, prefix="/categories", tags=["categories"])
app.include_router(router=subcategory.subcategory_router, prefix="/subcategories", tags=["subcategories"])
app.include_router(router=subgroup.subgroup_router, prefix="/subgroups", tags=["subgroups"])
app.include_router(router=product.product_router, prefix="/products", tags=["Products"])
app.include_router(router=order.order_router, prefix="/orders", tags=["orders"])
app.include_router(router=admin.admin_router, prefix="", tags=["admin"])



@app.get("/")
def read_root():
    return {"msg": "Hello World"}