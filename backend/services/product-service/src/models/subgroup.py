import uuid
from sqlalchemy import Column, String, ForeignKey
from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy.orm import relationship
from db.base import Base

class SubGroup(Base):
    __tablename__ = "sub_group"
    id = Column(UUID(as_uuid=True), primary_key=True, nullable=False, default=uuid.uuid4)
    name = Column(String(50), nullable=False)
    sub_category_id = Column(UUID(as_uuid=True), ForeignKey("sub_categories.id"), nullable=False)
    sub_category = relationship("SubCategory", back_populates="sub_group")
    #Each sub-sub-category has many products.
    # products = relationship("Product", back_populates="sub_group", cascade="all, delete")