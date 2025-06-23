#models/product.py
import uuid
from sqlalchemy import Column, String, ForeignKey, Float, JSON, Text
from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy.orm import relationship
from db.base import Base

class Product(Base):
    __tablename__ = "products"
    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4, nullable=False)
    title = Column(String(100), nullable=False)
    description = Column(Text)
    price = Column(Float, nullable=False)
    main_category_id = Column(UUID(as_uuid=True), ForeignKey("main_categories.id"), nullable=False)
    sub_category_id = Column(UUID(as_uuid=True), ForeignKey("sub_categories.id"), nullable=False)
    sub_group_id = Column(UUID(as_uuid=True), ForeignKey("sub_group.id"), nullable=False)
    colors = Column(JSON, default=list)       # e.g. ["Red", "Blue", ...]
    sizes = Column(JSON, default=list)        # e.g. [6, 6.5, 7, ...]
    assets = Column(JSON, default=list)       # list of image/video URLs

    main_category = relationship("MainCategory")
    sub_category = relationship("SubCategory")
    sub_group = relationship("SubGroup", back_populates="products")