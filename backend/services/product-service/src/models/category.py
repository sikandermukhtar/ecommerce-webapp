import uuid
from sqlalchemy import Column, String
from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy.orm import relationship
from db.base import Base

class MainCategory(Base):
    __tablename__ = "main_categories"
    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4, nullable=False)
    name = Column(String(50), unique=True, nullable=False)
    #relationship with sub-categories
    sub_categories = relationship("SubCategory", back_populates="main_category", cascade="all, delete")