from fastapi import FastAPI, HTTPException, Depends, WebSocket, WebSocketDisconnect
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy.orm import Session
from typing import List, Optional
from pydantic import BaseModel
from datetime import datetime
import json
import asyncio

from database import get_db, init_db, Order, MenuItem, RestaurantSettings

app = FastAPI(title="SwiftServe AI API")

# CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# WebSocket connection manager for real-time updates
class ConnectionManager:
    def __init__(self):
        self.active_connections: List[WebSocket] = []

    async def connect(self, websocket: WebSocket):
        await websocket.accept()
        self.active_connections.append(websocket)

    def disconnect(self, websocket: WebSocket):
        self.active_connections.remove(websocket)

    async def broadcast(self, message: dict):
        for connection in self.active_connections:
            try:
                await connection.send_json(message)
            except:
                pass

manager = ConnectionManager()

# Pydantic models
class OrderItem(BaseModel):
    id: str
    name: str
    price: int
    quantity: int
    category: Optional[str] = None
    customization: Optional[str] = None
    preparationTime: Optional[int] = 15

class OrderCreate(BaseModel):
    items: List[OrderItem]
    tableNumber: int
    customerName: str
    paymentMethod: str
    customerInstructions: Optional[str] = None
    total: float
    subtotal: float
    gst: float

class OrderUpdate(BaseModel):
    status: str

class MenuItemCreate(BaseModel):
    name: str
    description: str
    price: int
    category: str
    available: bool = True
    preparationTime: int = 15
    tags: Optional[List[str]] = []
    aiRecommended: bool = False
    image: Optional[str] = None

# Initialize database on startup
@app.on_event("startup")
async def startup_event():
    init_db()
    # Seed initial menu data if empty
    db = next(get_db())
    if db.query(MenuItem).count() == 0:
        seed_menu_data(db)
    db.close()

def seed_menu_data(db: Session):
    """Seed initial menu data"""
    menu_items = [
        {
            'id': 'item1',
            'name': 'Butter Chicken',
            'price': 320,
            'category': 'Main Course',
            'description': 'Rich and creamy tomato-based curry with tender chicken pieces',
            'available': True,
            'preparationTime': 20,
            'tags': ['Popular', 'Spicy'],
            'aiRecommended': True,
            'nutritionInfo': {'calories': 450, 'protein': 35, 'carbs': 15, 'fat': 28}
        },
        {
            'id': 'item2',
            'name': 'Paneer Tikka',
            'price': 280,
            'category': 'Appetizers',
            'description': 'Grilled cottage cheese marinated in aromatic spices',
            'available': True,
            'preparationTime': 15,
            'tags': ['Vegetarian', 'Grilled'],
            'aiRecommended': False,
            'nutritionInfo': {'calories': 320, 'protein': 18, 'carbs': 12, 'fat': 22}
        },
        {
            'id': 'item3',
            'name': 'Chicken Biryani',
            'price': 350,
            'category': 'Main Course',
            'description': 'Aromatic basmati rice layered with spiced chicken',
            'available': True,
            'preparationTime': 30,
            'tags': ['Popular', 'Rice Dish'],
            'aiRecommended': True,
            'nutritionInfo': {'calories': 550, 'protein': 40, 'carbs': 65, 'fat': 18}
        },
        {
            'id': 'item4',
            'name': 'Gulab Jamun',
            'price': 120,
            'category': 'Desserts',
            'description': 'Sweet milk dumplings soaked in rose-flavored syrup',
            'available': True,
            'preparationTime': 5,
            'tags': ['Sweet', 'Traditional'],
            'aiRecommended': False,
            'nutritionInfo': {'calories': 280, 'protein': 5, 'carbs': 45, 'fat': 10}
        },
        {
            'id': 'item5',
            'name': 'Masala Chai',
            'price': 60,
            'category': 'Beverages',
            'description': 'Traditional Indian spiced tea with aromatic herbs',
            'available': True,
            'preparationTime': 5,
            'tags': ['Hot', 'Refreshing'],
            'aiRecommended': True,
            'nutritionInfo': {'calories': 80, 'protein': 2, 'carbs': 15, 'fat': 2}
        },
        {
            'id': 'item6',
            'name': 'Dal Makhani',
            'price': 240,
            'category': 'Main Course',
            'description': 'Creamy black lentils slow-cooked with butter and cream',
            'available': True,
            'preparationTime': 25,
            'tags': ['Vegetarian', 'Creamy'],
            'aiRecommended': False,
            'nutritionInfo': {'calories': 380, 'protein': 15, 'carbs': 35, 'fat': 20}
        },
        {
            'id': 'item7',
            'name': 'Garlic Naan',
            'price': 80,
            'category': 'Breads',
            'description': 'Soft leavened bread topped with garlic and butter',
            'available': True,
            'preparationTime': 10,
            'tags': ['Bread', 'Side'],
            'aiRecommended': False,
            'nutritionInfo': {'calories': 260, 'protein': 7, 'carbs': 45, 'fat': 6}
        },
        {
            'id': 'item8',
            'name': 'Mango Lassi',
            'price': 100,
            'category': 'Beverages',
            'description': 'Refreshing yogurt-based drink with sweet mango pulp',
            'available': True,
            'preparationTime': 5,
            'tags': ['Cold', 'Sweet', 'Refreshing'],
            'aiRecommended': True,
            'nutritionInfo': {'calories': 180, 'protein': 6, 'carbs': 32, 'fat': 4}
        }
    ]
    
    for item_data in menu_items:
        item = MenuItem(
            id=item_data['id'],
            name=item_data['name'],
            description=item_data['description'],
            price=item_data['price'],
            category=item_data['category'],
            available=item_data['available'],
            preparation_time=item_data['preparationTime'],
            tags=json.dumps(item_data['tags']),
            nutrition_info=json.dumps(item_data['nutritionInfo']),
            ai_recommended=item_data['aiRecommended']
        )
        db.add(item)
    
    db.commit()

# WebSocket endpoint for real-time updates
@app.websocket("/ws")
async def websocket_endpoint(websocket: WebSocket):
    await manager.connect(websocket)
    try:
        while True:
            data = await websocket.receive_text()
            # Keep connection alive
            await websocket.send_text(json.dumps({"type": "ping"}))
    except WebSocketDisconnect:
        manager.disconnect(websocket)

# Order endpoints
@app.post("/api/orders")
async def create_order(order: OrderCreate, db: Session = Depends(get_db)):
    """Create a new order"""
    order_id = f"order-{int(datetime.now().timestamp() * 1000)}"
    
    db_order = Order(
        id=order_id,
        customer_name=order.customerName,
        table_number=order.tableNumber,
        items=json.dumps([item.dict() for item in order.items]),
        status='new',
        total=order.total,
        subtotal=order.subtotal,
        gst=order.gst,
        payment_method=order.paymentMethod,
        customer_instructions=order.customerInstructions
    )
    
    db.add(db_order)
    db.commit()
    db.refresh(db_order)
    
    # Broadcast new order to all connected clients
    await manager.broadcast({
        "type": "new_order",
        "order": {
            "id": db_order.id,
            "customerName": db_order.customer_name,
            "tableNumber": db_order.table_number,
            "items": json.loads(db_order.items),
            "status": db_order.status,
            "total": db_order.total,
            "timestamp": db_order.timestamp.isoformat()
        }
    })
    
    return {"id": order_id}

@app.get("/api/orders")
async def get_orders(db: Session = Depends(get_db)):
    """Get all orders"""
    orders = db.query(Order).order_by(Order.timestamp.desc()).all()
    return [{
        "id": order.id,
        "customerName": order.customer_name,
        "tableNumber": order.table_number,
        "items": json.loads(order.items),
        "status": order.status,
        "total": order.total,
        "subtotal": order.subtotal,
        "gst": order.gst,
        "paymentMethod": order.payment_method,
        "customerInstructions": order.customer_instructions,
        "timestamp": order.timestamp.isoformat()
    } for order in orders]

@app.get("/api/orders/{order_id}")
async def get_order(order_id: str, db: Session = Depends(get_db)):
    """Get a specific order"""
    order = db.query(Order).filter(Order.id == order_id).first()
    if not order:
        raise HTTPException(status_code=404, detail="Order not found")
    
    return {
        "id": order.id,
        "customerName": order.customer_name,
        "tableNumber": order.table_number,
        "items": json.loads(order.items),
        "status": order.status,
        "total": order.total,
        "subtotal": order.subtotal,
        "gst": order.gst,
        "paymentMethod": order.payment_method,
        "customerInstructions": order.customer_instructions,
        "timestamp": order.timestamp.isoformat()
    }

@app.patch("/api/orders/{order_id}")
async def update_order_status(order_id: str, update: OrderUpdate, db: Session = Depends(get_db)):
    """Update order status"""
    order = db.query(Order).filter(Order.id == order_id).first()
    if not order:
        raise HTTPException(status_code=404, detail="Order not found")
    
    order.status = update.status
    order.updated_at = datetime.utcnow()
    db.commit()
    
    # Broadcast status update
    await manager.broadcast({
        "type": "order_updated",
        "orderId": order_id,
        "status": update.status
    })
    
    return {"message": "Order updated successfully"}

# Menu endpoints
@app.get("/api/menu")
async def get_menu(db: Session = Depends(get_db)):
    """Get all menu items"""
    items = db.query(MenuItem).all()
    return [{
        "id": item.id,
        "name": item.name,
        "description": item.description,
        "price": item.price,
        "category": item.category,
        "available": item.available,
        "preparationTime": item.preparation_time,
        "tags": json.loads(item.tags) if item.tags else [],
        "nutritionInfo": json.loads(item.nutrition_info) if item.nutrition_info else {},
        "aiRecommended": item.ai_recommended,
        "image": item.image
    } for item in items]

@app.post("/api/menu")
async def create_menu_item(item: MenuItemCreate, db: Session = Depends(get_db)):
    """Create a new menu item"""
    item_id = f"item-{int(datetime.now().timestamp() * 1000)}"
    
    db_item = MenuItem(
        id=item_id,
        name=item.name,
        description=item.description,
        price=item.price,
        category=item.category,
        available=item.available,
        preparation_time=item.preparationTime,
        tags=json.dumps(item.tags),
        ai_recommended=item.aiRecommended
    )
    
    db.add(db_item)
    db.commit()
    
    # Broadcast menu update
    await manager.broadcast({"type": "menu_updated"})
    
    return {"id": item_id}

@app.put("/api/menu/{item_id}")
async def update_menu_item(item_id: str, item: MenuItemCreate, db: Session = Depends(get_db)):
    """Update a menu item"""
    db_item = db.query(MenuItem).filter(MenuItem.id == item_id).first()
    if not db_item:
        raise HTTPException(status_code=404, detail="Menu item not found")
    
    db_item.name = item.name
    db_item.description = item.description
    db_item.price = item.price
    db_item.category = item.category
    db_item.available = item.available
    db_item.preparation_time = item.preparationTime
    db_item.tags = json.dumps(item.tags)
    db_item.ai_recommended = item.aiRecommended
    
    db.commit()
    
    # Broadcast menu update
    await manager.broadcast({"type": "menu_updated"})
    
    return {"message": "Menu item updated successfully"}

@app.delete("/api/menu/{item_id}")
async def delete_menu_item(item_id: str, db: Session = Depends(get_db)):
    """Delete a menu item"""
    db_item = db.query(MenuItem).filter(MenuItem.id == item_id).first()
    if not db_item:
        raise HTTPException(status_code=404, detail="Menu item not found")
    
    db.delete(db_item)
    db.commit()
    
    # Broadcast menu update
    await manager.broadcast({"type": "menu_updated"})
    
    return {"message": "Menu item deleted successfully"}

# Health check
@app.get("/api/health")
async def health_check():
    return {"status": "healthy", "database": "sqlite"}

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
