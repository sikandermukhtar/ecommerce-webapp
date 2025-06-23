from pydantic import BaseModel, ConfigDict
from typing import List
from uuid import UUID
from datetime import datetime
from models.order import OrderStatus


class CustomerInfo(BaseModel):
    firstName: str
    lastName: str
    email: str
    phone: str
    address: str
    city: str
    state: str
    zipCode: str
    country: str

class OrderItemCreate(BaseModel):
    productId: UUID
    name: str
    price: float
    quantity: int
    color: str
    size: float
    image: str

class Totals(BaseModel):
    subtotal: float
    tax: float
    shipping: float
    total: float

class CreateOrder(BaseModel):
    customer: CustomerInfo
    items: List[OrderItemCreate]
    totals: Totals
    paymentMethod: str
    orderDate: datetime

class ReadOrderItem(BaseModel):
    id: UUID
    product_id: UUID
    name: str
    price: float
    quantity: int
    color: str
    size: float
    image: str
    model_config = ConfigDict(from_attributes=True)

class ReadOrder(BaseModel):
    id: UUID
    customer: CustomerInfo
    subtotal: float
    tax: float
    shipping: float
    total: float
    payment_method: str
    order_date: datetime
    status: OrderStatus
    items: List[ReadOrderItem]
    model_config = ConfigDict(from_attributes=True)

class OrderSummary(BaseModel):
    id: UUID
    order_date: datetime
    total: float
    status: OrderStatus
    model_config = ConfigDict(from_attributes=True)

class UpdateOrderStatus(BaseModel):
    status: OrderStatus