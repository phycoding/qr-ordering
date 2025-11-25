from sqlalchemy import create_engine, Column, Integer, String, Float, DateTime, JSON, Boolean
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker
from datetime import datetime
import json

Base = declarative_base()

class Order(Base):
    __tablename__ = 'orders'
    
    id = Column(String, primary_key=True)
    customer_name = Column(String, nullable=False)
    table_number = Column(Integer, nullable=False)
    items = Column(JSON, nullable=False)  # Stored as JSON
    status = Column(String, default='new')
    total = Column(Float, nullable=False)
    subtotal = Column(Float, nullable=False)
    gst = Column(Float, nullable=False)
    payment_method = Column(String, nullable=False)
    customer_instructions = Column(String, nullable=True)
    timestamp = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

class MenuItem(Base):
    __tablename__ = 'menu_items'
    
    id = Column(String, primary_key=True)
    name = Column(String, nullable=False)
    description = Column(String, nullable=False)
    price = Column(Integer, nullable=False)
    category = Column(String, nullable=False)
    available = Column(Boolean, default=True)
    preparation_time = Column(Integer, default=15)
    tags = Column(JSON, nullable=True)
    nutrition_info = Column(JSON, nullable=True)
    ai_recommended = Column(Boolean, default=False)
    image = Column(String, nullable=True)

class RestaurantSettings(Base):
    __tablename__ = 'restaurant_settings'
    
    id = Column(Integer, primary_key=True)
    restaurant_name = Column(String, default='SwiftServe AI Restaurant')
    address = Column(String, nullable=True)
    phone = Column(String, nullable=True)
    email = Column(String, nullable=True)
    gst_percentage = Column(Float, default=5.0)
    service_charge = Column(Float, default=0.0)
    sound_alerts = Column(Boolean, default=True)
    browser_notifications = Column(Boolean, default=False)
    email_notifications = Column(Boolean, default=True)

# Database initialization
DATABASE_URL = "sqlite:///./swiftserve.db"
engine = create_engine(DATABASE_URL, connect_args={"check_same_thread": False})
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

def init_db():
    """Initialize database and create tables"""
    Base.metadata.create_all(bind=engine)
    print("Database initialized successfully!")

def get_db():
    """Get database session"""
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

if __name__ == "__main__":
    init_db()
    print("Database tables created!")
