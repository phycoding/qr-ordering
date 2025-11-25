# SQLite Real-Time Database Setup

## Overview

The application now uses SQLite as a real-time database with WebSocket support for live updates across all clients.

## Database Schema

### Tables

1. **orders**
   - `id` (String, Primary Key): Unique order identifier
   - `customer_name` (String): Customer's name
   - `table_number` (Integer): Table number
   - `items` (JSON): Order items with details
   - `status` (String): Order status (new, preparing, ready, completed, cancelled)
   - `total` (Float): Total amount
   - `subtotal` (Float): Subtotal before tax
   - `gst` (Float): GST amount
   - `payment_method` (String): Payment method (upi, card, cash)
   - `customer_instructions` (String): Special instructions
   - `timestamp` (DateTime): Order creation time
   - `updated_at` (DateTime): Last update time

2. **menu_items**
   - `id` (String, Primary Key): Unique item identifier
   - `name` (String): Item name
   - `description` (String): Item description
   - `price` (Integer): Price in rupees
   - `category` (String): Category (Main Course, Appetizers, etc.)
   - `available` (Boolean): Availability status
   - `preparation_time` (Integer): Preparation time in minutes
   - `tags` (JSON): Tags array
   - `nutrition_info` (JSON): Nutrition information
   - `ai_recommended` (Boolean): AI recommendation flag
   - `image` (String): Image URL

3. **restaurant_settings**
   - `id` (Integer, Primary Key)
   - `restaurant_name` (String): Restaurant name
   - `address` (String): Address
   - `phone` (String): Phone number
   - `email` (String): Email
   - `gst_percentage` (Float): GST percentage
   - `service_charge` (Float): Service charge percentage
   - `sound_alerts` (Boolean): Sound alerts enabled
   - `browser_notifications` (Boolean): Browser notifications enabled
   - `email_notifications` (Boolean): Email notifications enabled

## Setup Instructions

### 1. Install Dependencies

```bash
pip install -r backend/requirements.txt
```

### 2. Initialize Database

```bash
python backend/database.py
```

This creates the `swiftserve.db` file and all tables.

### 3. Start Backend Server

**Windows:**
```bash
start-backend.bat
```

**Linux/Mac:**
```bash
cd backend
python -m uvicorn main:app --reload --host 0.0.0.0 --port 8000
```

### 4. Start Frontend

```bash
npm start
```

## API Endpoints

### Orders

- `POST /api/orders` - Create new order
- `GET /api/orders` - Get all orders
- `GET /api/orders/{order_id}` - Get specific order
- `PATCH /api/orders/{order_id}` - Update order status

### Menu

- `GET /api/menu` - Get all menu items
- `POST /api/menu` - Create menu item
- `PUT /api/menu/{item_id}` - Update menu item
- `DELETE /api/menu/{item_id}` - Delete menu item

### WebSocket

- `WS /ws` - Real-time updates connection

## Real-Time Features

### WebSocket Events

1. **new_order** - Broadcast when new order is created
2. **order_updated** - Broadcast when order status changes
3. **menu_updated** - Broadcast when menu is modified

### How It Works

1. Frontend connects to WebSocket at `ws://localhost:8000/ws`
2. Backend broadcasts events to all connected clients
3. Frontend updates UI automatically when events are received
4. No page refresh needed - true real-time experience

## Database File Location

- **File**: `swiftserve.db`
- **Location**: Root directory of the project
- **Size**: Starts at ~100KB, grows with data

## Advantages Over localStorage

1. **Persistent**: Data survives browser refresh and restart
2. **Centralized**: Single source of truth for all clients
3. **Real-time**: WebSocket updates across all connected devices
4. **Scalable**: Can handle thousands of orders
5. **Query-able**: SQL queries for analytics and reporting
6. **Backup-able**: Easy to backup and restore

## Migration from localStorage

The backend automatically seeds initial menu data on first run. Existing localStorage data will continue to work but won't sync with the database until you:

1. Start the backend server
2. Update the frontend to use API endpoints instead of localStorage

## Monitoring

View database contents:
```bash
sqlite3 swiftserve.db
.tables
SELECT * FROM orders;
SELECT * FROM menu_items;
```

## Backup

```bash
# Backup
cp swiftserve.db swiftserve_backup.db

# Restore
cp swiftserve_backup.db swiftserve.db
```

## Production Deployment

For production, consider:
1. Using PostgreSQL instead of SQLite
2. Adding authentication/authorization
3. Implementing rate limiting
4. Adding database migrations (Alembic)
5. Setting up SSL for WebSocket connections
6. Implementing connection pooling
7. Adding database indexes for performance

## Troubleshooting

### Database locked error
- Close all connections to the database
- Restart the backend server

### WebSocket connection failed
- Ensure backend is running on port 8000
- Check firewall settings
- Verify CORS configuration

### Data not syncing
- Check WebSocket connection in browser console
- Verify backend is broadcasting events
- Ensure frontend is listening to WebSocket events
