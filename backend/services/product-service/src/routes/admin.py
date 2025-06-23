from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from fastapi.security import OAuth2PasswordRequestForm
from uuid import UUID
from typing import List
from database import get_db
from models.admin import AdminUser
from models.order import Order
from models.category import MainCategory
from models.subcategory import SubCategory
from models.product import Product
from models.subgroup import SubGroup
from schemas.admin import AdminLogin, AdminCreate, AdminRead
from schemas.order import OrderSummary
from schemas.category import CreateCategory, UpdateCategory, ReadCategory
from schemas.subcategory import CreateSubCategory, UpdateSubCategory, ReadSubCategory
from schemas.subgroup import CreateSubGroup, UpdateSubGroup, ReadSubGroup
from schemas.product import ProductOut, ProductCreate, ProductSummary, ProductUpdate
from auth import verify_password, get_password_hash, create_access_token, get_current_admin
from datetime import timedelta

admin_router = APIRouter(prefix="/admin", tags=["admin"])

# Login Route (Unprotected)
@admin_router.post("/login")
def login(form_data: OAuth2PasswordRequestForm = Depends(), db: Session = Depends(get_db)):
    admin = db.query(AdminUser).filter(AdminUser.email == form_data.username).first()
    if not admin or not verify_password(form_data.password, admin.password):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Incorrect email or password",
            headers={"WWW-Authenticate": "Bearer"},
        )
    access_token_expires = timedelta(minutes=30)
    access_token = create_access_token(
        data={"sub": admin.email}, expires_delta=access_token_expires
    )
    return {"access_token": access_token, "token_type": "bearer"}

# Create New Admin (Protected)
@admin_router.post("/admins", response_model=AdminRead)
def create_admin(
    admin_data: AdminCreate,
    db: Session = Depends(get_db),
    current_admin: AdminUser = Depends(get_current_admin)
):
    existing_admin = db.query(AdminUser).filter(AdminUser.email == admin_data.email).first()
    if existing_admin:
        raise HTTPException(status_code=400, detail="Email already registered")
    hashed_password = get_password_hash(admin_data.password)
    new_admin = AdminUser(email=admin_data.email, password=hashed_password)
    db.add(new_admin)
    db.commit()
    db.refresh(new_admin)
    return new_admin

# Get All Orders (Protected)
@admin_router.get("/orders", response_model=List[OrderSummary])
def get_all_orders(
    db: Session = Depends(get_db),
    current_admin: AdminUser = Depends(get_current_admin)
):
    return db.query(Order).all()

# Delete Order (Protected)
@admin_router.delete("/orders/{order_id}", response_model=dict)
def delete_order(
    order_id: UUID,
    db: Session = Depends(get_db),
    current_admin: AdminUser = Depends(get_current_admin)
):
    order = db.query(Order).filter(Order.id == order_id).first()
    if not order:
        raise HTTPException(status_code=404, detail="Order not found")
    db.delete(order)
    db.commit()
    return {"message": f"Order {order_id} deleted successfully"}

# Main Category Routes (Protected)
@admin_router.post("/categories", response_model=ReadCategory)
def create_main_category(
    category_data: CreateCategory,
    db: Session = Depends(get_db),
    current_admin: AdminUser = Depends(get_current_admin)
):
    existing_category = db.query(MainCategory).filter(MainCategory.name == category_data.name).first()
    if existing_category:
        raise HTTPException(status_code=400, detail="Main category name already exists")
    new_category = MainCategory(name=category_data.name)
    db.add(new_category)
    db.commit()
    db.refresh(new_category)
    return new_category

@admin_router.put("/categories/{category_id}", response_model=ReadCategory)
def update_main_category(
    category_id: UUID,
    category_data: UpdateCategory,
    db: Session = Depends(get_db),
    current_admin: AdminUser = Depends(get_current_admin)
):
    category = db.query(MainCategory).filter(MainCategory.id == category_id).first()
    if not category:
        raise HTTPException(status_code=404, detail="Main category not found")
    if category_data.name and category_data.name != category.name:
        existing_category = db.query(MainCategory).filter(MainCategory.name == category_data.name).first()
        if existing_category:
            raise HTTPException(status_code=400, detail="Main category name already exists")
        category.name = category_data.name
    db.commit()
    db.refresh(category)
    return category

@admin_router.delete("/categories/{category_id}", response_model=dict)
def delete_main_category(
    category_id: UUID,
    db: Session = Depends(get_db),
    current_admin: AdminUser = Depends(get_current_admin)
):
    category = db.query(MainCategory).filter(MainCategory.id == category_id).first()
    if not category:
        raise HTTPException(status_code=404, detail="Main category not found")
    db.delete(category)
    db.commit()
    return {"message": f"Main category {category_id} deleted successfully"}

# SubCategory Routes (Protected)
@admin_router.post("/subcategories", response_model=ReadSubCategory)
def create_sub_category(
    category_data: CreateSubCategory,
    db: Session = Depends(get_db),
    current_admin: AdminUser = Depends(get_current_admin)
):
    main_category = db.query(MainCategory).filter(MainCategory.id == category_data.main_category_id).first()
    if not main_category:
        raise HTTPException(status_code=404, detail="Main category not found")
    new_category = SubCategory(name=category_data.name, main_category_id=category_data.main_category_id)
    db.add(new_category)
    db.commit()
    db.refresh(new_category)
    return new_category

@admin_router.put("/subcategories/{category_id}", response_model=ReadSubCategory)
def update_sub_category(
    category_id: UUID,
    category_data: UpdateSubCategory,
    db: Session = Depends(get_db),
    current_admin: AdminUser = Depends(get_current_admin)
):
    category = db.query(SubCategory).filter(SubCategory.id == category_id).first()
    if not category:
        raise HTTPException(status_code=404, detail="Subcategory not found")
    if category_data.name is not None:
        category.name = category_data.name
    if category_data.main_category_id is not None:
        main_category = db.query(MainCategory).filter(MainCategory.id == category_data.main_category_id).first()
        if not main_category:
            raise HTTPException(status_code=404, detail="Main category not found")
        category.main_category_id = category_data.main_category_id
    db.commit()
    db.refresh(category)
    return category

@admin_router.delete("/subcategories/{category_id}", response_model=dict)
def delete_sub_category(
    category_id: UUID,
    db: Session = Depends(get_db),
    current_admin: AdminUser = Depends(get_current_admin)
):
    category = db.query(SubCategory).filter(SubCategory.id == category_id).first()
    if not category:
        raise HTTPException(status_code=404, detail="Subcategory not found")
    db.delete(category)
    db.commit()
    return {"message": f"Subcategory {category_id} deleted successfully"}

# SubGroup Routes (Protected)
@admin_router.post("/subgroups", response_model=ReadSubGroup)
def create_sub_group(
    group_data: CreateSubGroup,
    db: Session = Depends(get_db),
    current_admin: AdminUser = Depends(get_current_admin)
):
    sub_category = db.query(SubCategory).filter(SubCategory.id == group_data.sub_category_id).first()
    if not sub_category:
        raise HTTPException(status_code=404, detail="Subcategory not found")
    new_group = SubGroup(name=group_data.name, sub_category_id=group_data.sub_category_id)
    db.add(new_group)
    db.commit()
    db.refresh(new_group)
    return new_group

@admin_router.put("/subgroups/{group_id}", response_model=ReadSubGroup)
def update_sub_group(
    group_id: UUID,
    group_data: UpdateSubGroup,
    db: Session = Depends(get_db),
    current_admin: AdminUser = Depends(get_current_admin)
):
    group = db.query(SubGroup).filter(SubGroup.id == group_id).first()
    if not group:
        raise HTTPException(status_code=404, detail="Subgroup not found")
    if group_data.name is not None:
        group.name = group_data.name
    if group_data.sub_category_id is not None:
        sub_category = db.query(SubCategory).filter(SubCategory.id == group_data.sub_category_id).first()
        if not sub_category:
            raise HTTPException(status_code=404, detail="Subcategory not found")
        group.sub_category_id = group_data.sub_category_id
    db.commit()
    db.refresh(group)
    return group

@admin_router.delete("/subgroups/{group_id}", response_model=dict)
def delete_sub_group(
    group_id: UUID,
    db: Session = Depends(get_db),
    current_admin: AdminUser = Depends(get_current_admin)
):
    group = db.query(SubGroup).filter(SubGroup.id == group_id).first()
    if not group:
        raise HTTPException(status_code=404, detail="Subgroup not found")
    db.delete(group)
    db.commit()
    return {"message": f"Subgroup {group_id} deleted successfully"}


# Product Routes (Protected)
@admin_router.post("/products", response_model=ProductOut)
def create_product(
    product_data: ProductCreate,
    db: Session = Depends(get_db),
    current_admin: AdminUser = Depends(get_current_admin)
):
    # Validate foreign keys
    main_category = db.query(MainCategory).filter(MainCategory.id == product_data.main_category_id).first()
    if not main_category:
        raise HTTPException(status_code=404, detail="Main category not found")
    sub_category = db.query(SubCategory).filter(SubCategory.id == product_data.sub_category_id).first()
    if not sub_category:
        raise HTTPException(status_code=404, detail="Subcategory not found")
    sub_group = db.query(SubGroup).filter(SubGroup.id == product_data.sub_group_id).first()
    if not sub_group:
        raise HTTPException(status_code=404, detail="Subgroup not found")
    
    # Check for duplicate product title
    existing_product = db.query(Product).filter(Product.title == product_data.title).first()
    if existing_product:
        raise HTTPException(status_code=400, detail="Product title already exists")
    
    # Create product
    new_product = Product(**product_data.model_dump())
    db.add(new_product)
    db.commit()
    db.refresh(new_product)
    return new_product

@admin_router.get("/products", response_model=List[ProductSummary])
def get_all_products(
    db: Session = Depends(get_db),
    current_admin: AdminUser = Depends(get_current_admin)
):
    return db.query(Product).all()

@admin_router.get("/products/{product_id}", response_model=ProductOut)
def get_product(
    product_id: UUID,
    db: Session = Depends(get_db),
    current_admin: AdminUser = Depends(get_current_admin)
):
    product = db.query(Product).filter(Product.id == product_id).first()
    if not product:
        raise HTTPException(status_code=404, detail="Product not found")
    return product

@admin_router.put("/products/{product_id}", response_model=ProductOut)
def update_product(
    product_id: UUID,
    product_data: ProductUpdate,
    db: Session = Depends(get_db),
    current_admin: AdminUser = Depends(get_current_admin)
):
    product = db.query(Product).filter(Product.id == product_id).first()
    if not product:
        raise HTTPException(status_code=404, detail="Product not found")
    
    # Validate foreign keys if provided
    if product_data.main_category_id is not None:
        main_category = db.query(MainCategory).filter(MainCategory.id == product_data.main_category_id).first()
        if not main_category:
            raise HTTPException(status_code=404, detail="Main category not found")
    if product_data.sub_category_id is not None:
        sub_category = db.query(SubCategory).filter(SubCategory.id == product_data.sub_category_id).first()
        if not sub_category:
            raise HTTPException(status_code=404, detail="Subcategory not found")
    if product_data.sub_group_id is not None:
        sub_group = db.query(SubGroup).filter(SubGroup.id == product_data.sub_group_id).first()
        if not sub_group:
            raise HTTPException(status_code=404, detail="Subgroup not found")
    
    # Check for duplicate title if updated
    if product_data.title and product_data.title != product.title:
        existing_product = db.query(Product).filter(Product.title == product_data.title).first()
        if existing_product:
            raise HTTPException(status_code=400, detail="Product title already exists")
    
    # Update fields
    updates = product_data.model_dump(exclude_unset=True)
    for field, value in updates.items():
        setattr(product, field, value)
    db.commit()
    db.refresh(product)
    return product

@admin_router.delete("/products/{product_id}", response_model=dict)
def delete_product(
    product_id: UUID,
    db: Session = Depends(get_db),
    current_admin: AdminUser = Depends(get_current_admin)
):
    product = db.query(Product).filter(Product.id == product_id).first()
    if not product:
        raise HTTPException(status_code=404, detail="Product not found")
    db.delete(product)
    db.commit()
    return {"message": f"Product {product_id} deleted successfully"}