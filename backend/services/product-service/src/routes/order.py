from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from uuid import UUID
from typing import List, Optional
from database import get_db
from models.order import Order, OrderItem, OrderStatus
from schemas.order import CreateOrder, ReadOrder, OrderSummary, UpdateOrderStatus

order_router = APIRouter()

@order_router.post("/create", response_model=ReadOrder)
def create_order(order_data: CreateOrder, db: Session = Depends(get_db)):
    try:
        # Step 1: Create and save the Order to generate an order_id
        db_order = Order(
            customer=order_data.customer.model_dump(),  # Adjust based on your schema
            subtotal=order_data.totals.subtotal,
            tax=order_data.totals.tax,
            shipping=order_data.totals.shipping,
            total=order_data.totals.total,
            payment_method=order_data.paymentMethod,
            order_date=order_data.orderDate,
            status="pending"  # Default status, adjust as needed
        )
        db.add(db_order)
        db.commit()  # Save the order to the database to generate the ID
        db.refresh(db_order)  # Refresh to get the generated ID

        # Step 2: Create OrderItems with the generated order_id
        for item in order_data.items:
            db_item = OrderItem(
                order_id=db_order.id,  # Link to the order using its ID
                product_id=item.productId,
                name=item.name,
                price=item.price,
                quantity=item.quantity,
                color=item.color,
                size=item.size,
                image=item.image
            )
            db.add(db_item)

        # Step 3: Commit the OrderItems
        db.commit()

        # Return the created order (adjust response as needed)
        return db_order

    except Exception as e:
        db.rollback()  # Roll back the transaction if something goes wrong
        raise HTTPException(status_code=500, detail=f"Failed to create order: {str(e)}")

@order_router.get("/", response_model=List[OrderSummary])
def get_orders(db: Session = Depends(get_db), status: Optional[OrderStatus] = None, area: Optional[str] = None):
    query = db.query(Order)
    if status:
        query = query.filter(Order.status == status)
    if area:
        query = query.filter(Order.customer.op('->>')('city') == area)
    return query.all()

@order_router.get("/{order_id}", response_model=ReadOrder)
def get_order(order_id: UUID, db: Session = Depends(get_db)):
    db_order = db.query(Order).filter(Order.id == order_id).first()
    if db_order is None:
        raise HTTPException(status_code=404, detail="Order not found")
    return db_order

@order_router.put("/{order_id}/status", response_model=ReadOrder)
def update_order_status(order_id: UUID, data: UpdateOrderStatus, db: Session = Depends(get_db)):
    db_order = db.query(Order).filter(Order.id == order_id).first()
    if db_order is None:
        raise HTTPException(status_code=404, detail="Order not found")
    db_order.status = data.status
    db.commit()
    db.refresh(db_order)
    return db_order