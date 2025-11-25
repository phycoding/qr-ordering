# SwiftServe AI - QR Ordering Platform

## 🎉 Major Update: Separate Customer & Restaurant Platforms

The application has been completely restructured into dedicated platforms for customers and restaurants, featuring modern ReactBits components and a scalable architecture.

---

## 🚀 Quick Start

### Prerequisites
- Node.js 16+ and npm
- Python 3.8+ (for backend)
- Modern web browser

### Installation

1. **Install dependencies:**
   ```bash
   npm install
   ```

2. **Start the development server:**
   ```bash
   npm start
   ```

3. **Access the platforms:**
   - Customer Platform: `http://localhost:3000/customer`
   - Restaurant Platform: `http://localhost:3000/restaurant`

---

## 📁 New Project Structure

```
qr-ordering/
├── src/
│   ├── App.jsx                          # Main app with routing
│   ├── index.js                         # Entry point
│   │
│   ├── customer/                        # Customer Platform
│   │   ├── CustomerApp.jsx             # Customer wrapper
│   │   ├── pages/
│   │   │   ├── HomePage.jsx            # Menu browsing ✅
│   │   │   ├── CartPage.jsx            # Shopping cart ✅
│   │   │   ├── CheckoutPage.jsx        # Checkout (Coming Soon)
│   │   │   ├── OrderHistoryPage.jsx    # Order history (Coming Soon)
│   │   │   └── OrderTrackingPage.jsx   # Order tracking (Coming Soon)
│   │   └── components/                  # Customer-specific components
│   │
│   ├── restaurant/                      # Restaurant Platform
│   │   ├── RestaurantApp.jsx           # Restaurant wrapper with sidebar
│   │   ├── pages/
│   │   │   ├── DashboardPage.jsx       # Analytics dashboard ✅
│   │   │   ├── KitchenDisplayPage.jsx  # KDS (Coming Soon)
│   │   │   ├── OrderManagementPage.jsx # Order management (Coming Soon)
│   │   │   ├── MenuManagementPage.jsx  # Menu CRUD (Coming Soon)
│   │   │   └── AnalyticsPage.jsx       # Detailed analytics (Coming Soon)
│   │   └── components/                  # Restaurant-specific components
│   │
│   ├── shared/                          # Shared Components & Services
│   │   ├── components/
│   │   │   ├── reactbits/              # ReactBits components
│   │   │   │   ├── AnimatedButton.jsx  ✅
│   │   │   │   ├── Card.jsx            ✅
│   │   │   │   ├── Toast.jsx           ✅
│   │   │   │   └── Tabs.jsx            ✅
│   │   │   └── ComingSoon.jsx          # Placeholder component
│   │   ├── context/
│   │   │   ├── CartContext.jsx         # Cart state management ✅
│   │   │   └── OrderContext.jsx        # Order state management ✅
│   │   ├── hooks/                       # Custom React hooks
│   │   └── services/
│   │       ├── firebase.js             # Firebase config ✅
│   │       ├── api.js                  # API service ✅
│   │       └── ai.js                   # AI service ✅
│   │
│   ├── styles/
│   │   └── index.css                   # Global styles ✅
│   │
│   └── utils/
│       └── constants.js                # App constants ✅
│
├── public/
│   └── index.html
├── package.json
└── README.md
```

---

## 🎨 Features Implemented

### Customer Platform ✅
- **Menu Browsing**: Beautiful grid layout with category filtering
- **Search Functionality**: Search dishes by name, description, or tags
- **Shopping Cart**: Full cart management with quantity controls
- **Customization**: AI-powered special instructions for each item
- **Responsive Design**: Works perfectly on mobile, tablet, and desktop

### Restaurant Platform ✅
- **Dashboard**: Real-time stats and metrics
- **Sidebar Navigation**: Easy access to all restaurant features
- **Order Overview**: Recent orders with status tracking
- **Quick Actions**: Fast navigation to key features

### ReactBits Components ✅
- **AnimatedButton**: Multiple variants with hover effects and loading states
- **Card**: Flexible card component with Header, Body, Footer
- **Toast**: Beautiful notification system
- **Tabs**: Animated tab navigation

### State Management ✅
- **CartContext**: Persistent shopping cart with localStorage
- **OrderContext**: Real-time order management
- **React Router**: Client-side routing for both platforms

---

## 🛣️ Routes

### Customer Routes
- `/customer` - Menu browsing (HomePage)
- `/customer/cart` - Shopping cart
- `/customer/checkout` - Checkout (Coming Soon)
- `/customer/orders` - Order history (Coming Soon)
- `/customer/track/:id` - Order tracking (Coming Soon)

### Restaurant Routes
- `/restaurant` - Dashboard
- `/restaurant/kds` - Kitchen Display System (Coming Soon)
- `/restaurant/orders` - Order Management (Coming Soon)
- `/restaurant/menu` - Menu Management (Coming Soon)
- `/restaurant/analytics` - Analytics (Coming Soon)
- `/restaurant/settings` - Settings (Coming Soon)

---

## 🎯 Key Technologies

### Frontend
- **React 18** - Modern React with Hooks
- **React Router v6** - Client-side routing
- **Framer Motion** - Smooth animations
- **React Hot Toast** - Toast notifications
- **Material UI Icons** - Icon library
- **Context API** - State management

### Styling
- **Custom CSS** - Full control over design
- **CSS Gradients** - Modern, vibrant aesthetics
- **Flexbox & Grid** - Responsive layouts
- **CSS Animations** - Smooth transitions

### Backend (Existing)
- **FastAPI** - Python backend
- **Firebase** - Real-time database (mock mode)

---

## 💡 Usage Guide

### For Customers

1. **Browse Menu**
   - Visit `http://localhost:3000/customer`
   - Use category tabs to filter items
   - Search for specific dishes
   - Look for "AI Recommended" badges

2. **Add to Cart**
   - Click "Add to Cart" on any item
   - View cart count in header
   - Click cart icon or "View Cart" button

3. **Manage Cart**
   - Adjust quantities with +/- buttons
   - Add special instructions for each item
   - Remove items with delete button
   - See real-time total calculation

4. **Checkout** (Coming Soon)
   - Proceed to checkout
   - Select table number
   - Choose payment method
   - Place order

### For Restaurant Staff

1. **View Dashboard**
   - Visit `http://localhost:3000/restaurant`
   - See real-time stats (revenue, orders, etc.)
   - View recent orders
   - Access quick actions

2. **Navigate Features**
   - Use sidebar to access different sections
   - Dashboard, KDS, Orders, Menu, Analytics
   - Responsive design works on tablets

---

## 🎨 Design Philosophy

### Modern & Premium
- Gradient backgrounds and buttons
- Smooth animations and transitions
- Card-based layouts
- Consistent color scheme

### User-Centric
- Intuitive navigation
- Clear visual hierarchy
- Responsive on all devices
- Fast and performant

### AI-Enhanced
- Smart recommendations
- Natural language processing for customizations
- Server action suggestions
- Contextual intelligence

---

## 🔧 Development

### Adding New Pages

1. Create page component in appropriate directory:
   - Customer pages: `src/customer/pages/`
   - Restaurant pages: `src/restaurant/pages/`

2. Add route in `src/App.jsx`:
   ```jsx
   <Route path="new-route" element={<NewPage />} />
   ```

3. Update navigation (if needed):
   - Customer: Add to header/footer
   - Restaurant: Add to sidebar in `RestaurantApp.jsx`

### Using ReactBits Components

```jsx
import AnimatedButton from '../shared/components/reactbits/AnimatedButton';
import Card from '../shared/components/reactbits/Card';
import { toast } from '../shared/components/reactbits/Toast';

// Button
<AnimatedButton variant="primary" onClick={handleClick}>
  Click Me
</AnimatedButton>

// Card
<Card variant="elevated" hoverable>
  <Card.Header>Title</Card.Header>
  <Card.Body>Content</Card.Body>
  <Card.Footer>Footer</Card.Footer>
</Card>

// Toast
toast.success('Success message!');
toast.error('Error message!');
toast.info('Info message!');
```

### Using Context

```jsx
import { useCart } from '../shared/context/CartContext';
import { useOrders } from '../shared/context/OrderContext';

function MyComponent() {
  const { cart, addToCart, getCartTotal } = useCart();
  const { orders, createOrder } = useOrders();
  
  // Use cart and order functions
}
```

---

## 📊 Next Steps

### High Priority
1. ✅ Customer Platform - Menu & Cart
2. ✅ Restaurant Platform - Dashboard
3. 🔄 Checkout Flow
4. 🔄 Order Tracking
5. 🔄 Kitchen Display System

### Medium Priority
6. 🔄 Order Management
7. 🔄 Menu Management
8. 🔄 Analytics Dashboard
9. 🔄 Order History

### Future Enhancements
- Real Firebase integration
- Authentication system
- Payment gateway integration
- Advanced AI features
- Multi-language support
- PWA capabilities

---

## 🐛 Troubleshooting

### App won't start
```bash
# Clear node_modules and reinstall
rm -rf node_modules package-lock.json
npm install
npm start
```

### Routing issues
- Make sure you're using the correct URLs
- Check that React Router is properly configured
- Clear browser cache

### Styling issues
- Check that CSS files are imported
- Verify class names match
- Check browser console for errors

---

## 📄 License

MIT License - Feel free to use this project as a foundation for your QR ordering platform.

---

## 🙏 Credits

- **ReactBits**: Inspired by reactbits.dev component library
- **Material UI**: Icons
- **Framer Motion**: Animations
- **React Hot Toast**: Notifications

---

**SwiftServe AI** - Revolutionizing restaurant ordering with AI-enhanced experiences and zero commission fees.

Built with ❤️ using React and modern web technologies.
