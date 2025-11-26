import pytest
from fastapi.testclient import TestClient
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker
import json

from main import app
from database import Base, get_db

# Test database setup
TEST_DATABASE_URL = "sqlite:///./test.db"
engine = create_engine(TEST_DATABASE_URL, connect_args={"check_same_thread": False})
TestingSessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

def override_get_db():
    try:
        db = TestingSessionLocal()
        yield db
    finally:
        db.close()

app.dependency_overrides[get_db] = override_get_db

@pytest.fixture(scope="function")
def client():
    # Create tables
    Base.metadata.create_all(bind=engine)
    yield TestClient(app)
    # Drop tables after test
    Base.metadata.drop_all(bind=engine)

# Menu Endpoint Tests

def test_get_menu_empty(client):
    """Test GET /api/menu returns empty list initially"""
    response = client.get("/api/menu")
    assert response.status_code == 200
    assert isinstance(response.json(), list)

def test_create_menu_item(client):
    """Test POST /api/menu creates new menu item"""
    menu_item = {
        "name": "Test Dish",
        "description": "A test dish",
        "price": 250,
        "category": "Main Course",
        "available": True,
        "preparationTime": 20,
        "tags": ["Test"],
        "aiRecommended": False
    }
    response = client.post("/api/menu", json=menu_item)
    assert response.status_code == 200
    assert "id" in response.json()

def test_get_menu_with_items(client):
    """Test GET /api/menu returns created items"""
    # Create an item first
    menu_item = {
        "name": "Test Dish",
        "description": "A test dish",
        "price": 250,
        "category": "Main Course",
        "available": True,
        "preparationTime": 20,
        "tags": ["Test"],
        "aiRecommended": False
    }
    client.post("/api/menu", json=menu_item)
    
    # Get menu
    response = client.get("/api/menu")
    assert response.status_code == 200
    items = response.json()
    assert len(items) == 1
    assert items[0]["name"] == "Test Dish"

def test_update_menu_item(client):
    """Test PUT /api/menu/{id} updates existing item"""
    # Create an item
    menu_item = {
        "name": "Test Dish",
        "description": "A test dish",
        "price": 250,
        "category": "Main Course",
        "available": True,
        "preparationTime": 20,
        "tags": ["Test"],
        "aiRecommended": False
    }
    create_response = client.post("/api/menu", json=menu_item)
    item_id = create_response.json()["id"]
    
    # Update the item
    updated_item = {
        **menu_item,
        "price": 300,
        "available": False
    }
    response = client.put(f"/api/menu/{item_id}", json=updated_item)
    assert response.status_code == 200
    
    # Verify update
    get_response = client.get("/api/menu")
    items = get_response.json()
    assert items[0]["price"] == 300
    assert items[0]["available"] == False

def test_delete_menu_item(client):
    """Test DELETE /api/menu/{id} removes item"""
    # Create an item
    menu_item = {
        "name": "Test Dish",
        "description": "A test dish",
        "price": 250,
        "category": "Main Course",
        "available": True,
        "preparationTime": 20,
        "tags": ["Test"],
        "aiRecommended": False
    }
    create_response = client.post("/api/menu", json=menu_item)
    item_id = create_response.json()["id"]
    
    # Delete the item
    response = client.delete(f"/api/menu/{item_id}")
    assert response.status_code == 200
    
    # Verify deletion
    get_response = client.get("/api/menu")
    items = get_response.json()
    assert len(items) == 0

def test_menu_item_validation(client):
    """Test menu item validation for required fields"""
    invalid_item = {
        "name": "Test Dish"
        # Missing required fields
    }
    response = client.post("/api/menu", json=invalid_item)
    assert response.status_code == 422  # Validation error

# Order Endpoint Tests

def test_create_order_valid(client):
    """Test POST /api/orders creates order with valid data"""
    order_data = {
        "items": [
            {
                "id": "item1",
                "name": "Test Dish",
                "price": 250,
                "quantity": 2,
                "category": "Main Course",
                "preparationTime": 20
            }
        ],
        "tableNumber": 5,
        "customerName": "John Doe",
        "paymentMethod": "cash",
        "customerInstructions": "No spicy",
        "total": 525,
        "subtotal": 500,
        "gst": 25
    }
    response = client.post("/api/orders", json=order_data)
    assert response.status_code == 200
    assert "id" in response.json()

def test_create_order_invalid(client):
    """Test POST /api/orders rejects invalid data"""
    invalid_order = {
        "items": [],  # Empty items
        "tableNumber": 5
        # Missing required fields
    }
    response = client.post("/api/orders", json=invalid_order)
    assert response.status_code == 422

def test_get_orders(client):
    """Test GET /api/orders returns all orders sorted by timestamp"""
    # Create two orders
    order1 = {
        "items": [{"id": "item1", "name": "Dish 1", "price": 250, "quantity": 1, "preparationTime": 20}],
        "tableNumber": 1,
        "customerName": "Customer 1",
        "paymentMethod": "cash",
        "total": 262.5,
        "subtotal": 250,
        "gst": 12.5
    }
    order2 = {
        "items": [{"id": "item2", "name": "Dish 2", "price": 300, "quantity": 1, "preparationTime": 20}],
        "tableNumber": 2,
        "customerName": "Customer 2",
        "paymentMethod": "card",
        "total": 315,
        "subtotal": 300,
        "gst": 15
    }
    
    client.post("/api/orders", json=order1)
    client.post("/api/orders", json=order2)
    
    response = client.get("/api/orders")
    assert response.status_code == 200
    orders = response.json()
    assert len(orders) == 2
    # Verify sorted by timestamp (newest first)
    assert orders[0]["customerName"] == "Customer 2"

def test_get_order_by_id(client):
    """Test GET /api/orders/{id} returns specific order"""
    order_data = {
        "items": [{"id": "item1", "name": "Test Dish", "price": 250, "quantity": 1, "preparationTime": 20}],
        "tableNumber": 5,
        "customerName": "John Doe",
        "paymentMethod": "cash",
        "total": 262.5,
        "subtotal": 250,
        "gst": 12.5
    }
    create_response = client.post("/api/orders", json=order_data)
    order_id = create_response.json()["id"]
    
    response = client.get(f"/api/orders/{order_id}")
    assert response.status_code == 200
    order = response.json()
    assert order["id"] == order_id
    assert order["customerName"] == "John Doe"

def test_get_order_not_found(client):
    """Test GET /api/orders/{id} returns 404 for non-existent order"""
    response = client.get("/api/orders/nonexistent-id")
    assert response.status_code == 404

def test_update_order_status(client):
    """Test PATCH /api/orders/{id} updates order status"""
    # Create an order
    order_data = {
        "items": [{"id": "item1", "name": "Test Dish", "price": 250, "quantity": 1, "preparationTime": 20}],
        "tableNumber": 5,
        "customerName": "John Doe",
        "paymentMethod": "cash",
        "total": 262.5,
        "subtotal": 250,
        "gst": 12.5
    }
    create_response = client.post("/api/orders", json=order_data)
    order_id = create_response.json()["id"]
    
    # Update status
    response = client.patch(f"/api/orders/{order_id}", json={"status": "preparing"})
    assert response.status_code == 200
    
    # Verify update
    get_response = client.get(f"/api/orders/{order_id}")
    assert get_response.json()["status"] == "preparing"

def test_order_status_transitions(client):
    """Test order status transitions (new → preparing → ready → completed)"""
    # Create an order
    order_data = {
        "items": [{"id": "item1", "name": "Test Dish", "price": 250, "quantity": 1, "preparationTime": 20}],
        "tableNumber": 5,
        "customerName": "John Doe",
        "paymentMethod": "cash",
        "total": 262.5,
        "subtotal": 250,
        "gst": 12.5
    }
    create_response = client.post("/api/orders", json=order_data)
    order_id = create_response.json()["id"]
    
    # Test status transitions
    statuses = ["preparing", "ready", "completed"]
    for status in statuses:
        response = client.patch(f"/api/orders/{order_id}", json={"status": status})
        assert response.status_code == 200
        
        get_response = client.get(f"/api/orders/{order_id}")
        assert get_response.json()["status"] == status

# Health Check Test

def test_health_check(client):
    """Test GET /api/health returns healthy status"""
    response = client.get("/api/health")
    assert response.status_code == 200
    data = response.json()
    assert data["status"] == "healthy"
    assert data["database"] == "sqlite"
