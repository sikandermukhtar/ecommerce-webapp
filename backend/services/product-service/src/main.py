from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from db import base, session
from routes import category, subcategory
import models
# Create tables
base.Base.metadata.create_all(bind=session.engine)

app = FastAPI(lifespan=None)
app.include_router(router=category.router, prefix="/category", tags=["categories"])
app.include_router(router=subcategory.router, prefix="/subcategory", tags=["subcategories"])

@app.get("/")
def read_root():
    return {"msg": "Hello World"}

