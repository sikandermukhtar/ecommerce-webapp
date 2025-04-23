import uuid
from sqlalchemy import Column, String, ForeignKey
from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy.orm import relationship
from db.base import Base


class SubCategory(Base):
    __tablename__ = "sub_categories"
    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4, nullable=False)
    name = Column(String(50), nullable=False)
    main_category_id = Column(UUID(as_uuid=True), ForeignKey("main_categories.id"), nullable=False)
    main_category = relationship("MainCategory", back_populates="sub_categories")
    #each sub category can have many sub-sub-categories
    sub_group = relationship("SubGroup", back_populates="sub_category", cascade="all, delete")