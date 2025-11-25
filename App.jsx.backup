import React, { useState, useEffect } from 'react';
import {
  AppBar,
  Toolbar,
  Typography,
  Container,
  Grid,
  Card,
  CardContent,
  CardActions,
  Button,
  Chip,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  List,
  ListItem,
  ListItemText,
  ListItemSecondaryAction,
  IconButton,
  Badge,
  Box,
  Paper,
  Tabs,
  Tab,
  Divider,
  Alert,
  Snackbar,
  Switch,
  FormControlLabel,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Avatar
} from '@mui/material';
import {
  ShoppingCart,
  Add,
  Remove,
  Restaurant,
  LocalDining,
  CheckCircle,
  Schedule,
  Person,
  CallEnd,
  Notifications,
  Kitchen,
  TableRestaurant
} from '@mui/icons-material';

// Mock Firebase configuration using global variables
const firebaseConfig = window.__firebase_config || {
  apiKey: "mock-api-key",
  authDomain: "swiftserve-ai.firebaseapp.com",
  projectId: "swiftserve-ai",
  storageBucket: "swiftserve-ai.appspot.com",
  messagingSenderId: "123456789",
  appId: window.__app_id || "mock-app-id"
};

// Mock Firebase functions for demonstration
const mockFirestore = {
  collection: (name) => ({
    add: async (data) => {
      console.log(`Adding to ${name}:`, data);
      return { id: `mock-${Date.now()}` };
    },
    onSnapshot: (callback) => {
      // Mock real-time data
      if (name === 'orders') {
        callback({
          docs: mockOrders.map(order => ({
            id: order.id,
            data: () => order
          }))
        });
      } else if (name === 'menus') {
        callback({
          docs: mockMenuData.map(item => ({
            id: item.id,
            data: () => item
          }))
        });
      }
      return () => {}; // unsubscribe function
    },
    doc: (id) => ({
      update: async (data) => {
        console.log(`Updating ${name}/${id}:`, data);
        // Update mock data
        if (name === 'orders') {
          const orderIndex = mockOrders.findIndex(o => o.id === id);
          if (orderIndex !== -1) {
            mockOrders[orderIndex] = { ...mockOrders[orderIndex], ...data };
          }
        }
      }
    })
  })
};

// Mock data
const mockMenuData = [
  {
    id: 'item1',
    name: 'Butter Chicken',
    price: 320,
    category: 'Main Course',
    description: 'Rich and creamy tomato-based curry',
    aiRecommended: true
  },
  {
    id: 'item2',
    name: 'Paneer Tikka',
    price: 280,
    category: 'Appetizers',
    description: 'Grilled cottage cheese with spices',
    aiRecommended: false
  },
  {
    id: 'item3',
    name: 'Biryani',
    price: 350,
    category: 'Main Course',
    description: 'Aromatic basmati rice with spices',
    aiRecommended: true
  },
  {
    id: 'item4',
    name: 'Gulab Jamun',
    price: 120,
    category: 'Desserts',
    description: 'Sweet milk dumplings in syrup',
    aiRecommended: false
  },
  {
    id: 'item5',
    name: 'Masala Chai',
    price: 60,
    category: 'Beverages',
    description: 'Spiced Indian tea',
    aiRecommended: true
  }
];

let mockOrders = [
  {
    id: 'order1',
    items: [
      { id: 'item1', name: 'Butter Chicken', price: 320, quantity: 1, customization: 'make it not too spicy please and add extra paneer' }
    ],
    status: 'new',
    total: 320,
    tableNumber: 3,
    timestamp: new Date(),
    customerInstructions: 'make it not too spicy please and add extra paneer'
  },
  {
    id: 'order2',
    items: [
      { id: 'item3', name: 'Biryani', price: 350, quantity: 1, customization: 'no onions, extra raita' }
    ],
    status: 'preparing',
    total: 350,
    tableNumber: 5,
    timestamp: new Date(Date.now() - 600000),
    customerInstructions: 'no onions, extra raita'
  }
];

// FloatingButton component (reactbits.dev style)
const FloatingButton = ({ onClick, icon, label, color = 'primary' }) => (
  <Button
    variant="contained"
    color={color}
    startIcon={icon}
    onClick={onClick}
    sx={{
      position: 'fixed',
      bottom: 20,
      right: 20,
      borderRadius: 25,
      px: 3,
      py: 1.5,
      boxShadow: 3,
      zIndex: 1000
    }}
  >
    {label}
  </Button>
);

// SectionHeader component (reactbits.dev style)
const SectionHeader = ({ title, subtitle, icon }) => (
  <Box sx={{ mb: 3, textAlign: 'center' }}>
    <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', mb: 1 }}>
      {icon}
      <Typography variant="h4" component="h2" sx={{ ml: 1, fontWeight: 'bold' }}>
        {title}
      </Typography>
    </Box>
    {subtitle && (
      <Typography variant="subtitle1" color="text.secondary">
        {subtitle}
      </Typography>
    )}
  </Box>
);

function App() {
  const [viewMode, setViewMode] = useState('customer'); // 'customer' or 'restaurant'
  const [menuData, setMenuData] = useState([]);
  const [orders, setOrders] = useState([]);
  const [cart, setCart] = useState([]);
  const [specialInstructions, setSpecialInstructions] = useState('');
  const [orderDialog, setOrderDialog] = useState(false);
  const [showCart, setShowCart] = useState(false);
  const [serverPrompts, setServerPrompts] = useState([]);
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'info' });
  const [selectedTab, setSelectedTab] = useState(0);

  // AI Mock function for customization
  const processCustomization = async (customText) => {
    try {
      const response = await fetch('http://127.0.0.1:8000/api/ai/customize', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ custom_text: customText })
      });
      
      if (response.ok) {
        const data = await response.json();
        return data.kitchen_instruction;
      }
    } catch (error) {
      console.log('API not available, using local mock');
    }
    
    // Local fallback logic
    let instruction = "KITCHEN: ";
    if (customText.toLowerCase().includes('spicy') || customText.toLowerCase().includes('hot')) {
      instruction += "SPICE LEVEL: " + (customText.toLowerCase().includes('not') ? "LOW" : "HIGH") + ". ";
    }
    if (customText.toLowerCase().includes('extra')) {
      const match = customText.match(/extra\s+(\w+)/i);
      if (match) {
        instruction += `ADD-ON: ${match[1].toUpperCase()} (Extra). `;
      }
    }
    if (customText.toLowerCase().includes('no ')) {
      const match = customText.match(/no\s+(\w+)/i);
      if (match) {
        instruction += `REMOVE: ${match[1].toUpperCase()}. `;
      }
    }
    return instruction || "KITCHEN: STANDARD PREPARATION";
  };

  // AI Mock function for server suggestions
  const getServerSuggestion = async (orderId) => {
    try {
      const response = await fetch('http://127.0.0.1:8000/api/ai/suggest_action', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ order_id: orderId })
      });
      
      if (response.ok) {
        const data = await response.json();
        return data.suggestion;
      }
    } catch (error) {
      console.log('API not available, using local mock');
    }
    
    // Local fallback logic
    const suggestions = [
      "Suggest today's dessert special",
      "Check if drinks are needed",
      "Offer appetizer recommendations",
      "Ask about spice preference",
      "Suggest pairing beverages"
    ];
    return suggestions[Math.floor(Math.random() * suggestions.length)];
  };

  // Initialize Firebase and load data
  useEffect(() => {
    console.log('Initializing Firebase with config:', firebaseConfig);
    
    // Load menu data
    const unsubscribeMenu = mockFirestore.collection('menus').onSnapshot((snapshot) => {
      const menuItems = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setMenuData(menuItems.length > 0 ? menuItems : mockMenuData);
    });

    // Load orders with real-time updates
    const unsubscribeOrders = mockFirestore.collection('orders').onSnapshot((snapshot) => {
      const orderList = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setOrders(orderList.length > 0 ? orderList : mockOrders);
    });

    return () => {
      unsubscribeMenu();
      unsubscribeOrders();
    };
  }, []);

  // Generate server prompts periodically
  useEffect(() => {
    const interval = setInterval(() => {
      if (viewMode === 'restaurant' && orders.length > 0) {
        const activeOrders = orders.filter(order => order.status !== 'completed');
        if (activeOrders.length > 0) {
          const randomOrder = activeOrders[Math.floor(Math.random() * activeOrders.length)];
          getServerSuggestion(randomOrder.id).then(suggestion => {
            const newPrompt = {
              id: Date.now(),
              tableNumber: randomOrder.tableNumber,
              message: suggestion,
              timestamp: new Date()
            };
            setServerPrompts(prev => [...prev.slice(-2), newPrompt]); // Keep last 3 prompts
          });
        }
      }
    }, 15000); // Every 15 seconds

    return () => clearInterval(interval);
  }, [viewMode, orders]);

  const addToCart = (item) => {
    setCart(prev => {
      const existing = prev.find(cartItem => cartItem.id === item.id);
      if (existing) {
        return prev.map(cartItem =>
          cartItem.id === item.id
            ? { ...cartItem, quantity: cartItem.quantity + 1 }
            : cartItem
        );
      }
      return [...prev, { ...item, quantity: 1, customization: '' }];
    });
    setSnackbar({ open: true, message: `${item.name} added to cart`, severity: 'success' });
  };

  const removeFromCart = (itemId) => {
    setCart(prev => prev.filter(item => item.id !== itemId));
  };

  const updateCartItemCustomization = (itemId, customization) => {
    setCart(prev => prev.map(item =>
      item.id === itemId ? { ...item, customization } : item
    ));
  };

  const getTotalAmount = () => {
    return cart.reduce((total, item) => total + (item.price * item.quantity), 0);
  };

  const placeOrder = async () => {
    if (cart.length === 0) return;

    const orderData = {
      items: cart.map(item => ({
        id: item.id,
        name: item.name,
        price: item.price,
        quantity: item.quantity,
        customization: item.customization || specialInstructions
      })),
      total: getTotalAmount(),
      status: 'new',
      tableNumber: Math.floor(Math.random() * 10) + 1,
      timestamp: new Date(),
      customerInstructions: specialInstructions
    };

    try {
      await mockFirestore.collection('orders').add(orderData);
      setCart([]);
      setSpecialInstructions('');
      setOrderDialog(true);
      setSnackbar({ open: true, message: 'Order placed successfully!', severity: 'success' });
    } catch (error) {
      setSnackbar({ open: true, message: 'Error placing order', severity: 'error' });
    }
  };

  const updateOrderStatus = async (orderId, newStatus) => {
    try {
      await mockFirestore.collection('orders').doc(orderId).update({ status: newStatus });
      setSnackbar({ open: true, message: `Order status updated to ${newStatus}`, severity: 'info' });
    } catch (error) {
      setSnackbar({ open: true, message: 'Error updating order status', severity: 'error' });
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'new': return 'error';
      case 'preparing': return 'warning';
      case 'ready': return 'success';
      case 'completed': return 'default';
      default: return 'default';
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'new': return <Schedule />;
      case 'preparing': return <Kitchen />;
      case 'ready': return <CheckCircle />;
      case 'completed': return <CheckCircle />;
      default: return <Schedule />;
    }
  };

  const renderCustomerView = () => (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <SectionHeader
        title="SwiftServe AI"
        subtitle="AI-Enhanced QR Ordering Experience"
        icon={<Restaurant color="primary" sx={{ fontSize: 40 }} />}
      />

      <Alert severity="info" sx={{ mb: 3 }}>
        Welcome! Browse our AI-curated menu and place your order seamlessly.
      </Alert>

      <Tabs value={selectedTab} onChange={(e, v) => setSelectedTab(v)} sx={{ mb: 3 }}>
        <Tab label="All Items" />
        <Tab label="Main Course" />
        <Tab label="Appetizers" />
        <Tab label="Beverages" />
        <Tab label="Desserts" />
      </Tabs>

      <Grid container spacing={3}>
        {menuData
          .filter(item => selectedTab === 0 || item.category === ['All Items', 'Main Course', 'Appetizers', 'Beverages', 'Desserts'][selectedTab])
          .map((item) => (
          <Grid item xs={12} sm={6} md={4} key={item.id}>
            <Card sx={{ height: '100%', position: 'relative' }}>
              {item.aiRecommended && (
                <Chip
                  label="AI Recommended"
                  color="secondary"
                  size="small"
                  sx={{ position: 'absolute', top: 10, right: 10, zIndex: 1 }}
                />
              )}
              <CardContent>
                <Typography variant="h6" component="h3" gutterBottom>
                  {item.name}
                </Typography>
                <Typography variant="body2" color="text.secondary" gutterBottom>
                  {item.description}
                </Typography>
                <Typography variant="h6" color="primary" sx={{ fontWeight: 'bold' }}>
                  ₹{item.price}
                </Typography>
              </CardContent>
              <CardActions>
                <Button
                  variant="contained"
                  startIcon={<Add />}
                  onClick={() => addToCart(item)}
                  fullWidth
                >
                  Add to Cart
                </Button>
              </CardActions>
            </Card>
          </Grid>
        ))}
      </Grid>

      {/* Cart Summary */}
      <Paper
        sx={{
          position: 'fixed',
          bottom: 0,
          left: 0,
          right: 0,
          p: 2,
          zIndex: 1000,
          borderRadius: '20px 20px 0 0'
        }}
        elevation={8}
      >
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Badge badgeContent={cart.length} color="primary">
            <ShoppingCart />
          </Badge>
          <Typography variant="h6">
            Total: ₹{getTotalAmount()}
          </Typography>
          <Button
            variant="contained"
            onClick={() => setShowCart(true)}
            disabled={cart.length === 0}
          >
            View Cart
          </Button>
        </Box>
      </Paper>

      {/* Cart Dialog */}
      <Dialog open={showCart} onClose={() => setShowCart(false)} maxWidth="md" fullWidth>
        <DialogTitle>Your Order</DialogTitle>
        <DialogContent>
          <List>
            {cart.map((item) => (
              <ListItem key={item.id}>
                <ListItemText
                  primary={`${item.name} x${item.quantity}`}
                  secondary={`₹${item.price} each`}
                />
                <ListItemSecondaryAction>
                  <IconButton onClick={() => removeFromCart(item.id)}>
                    <Remove />
                  </IconButton>
                </ListItemSecondaryAction>
              </ListItem>
            ))}
          </List>
          <Divider sx={{ my: 2 }} />
          <TextField
            fullWidth
            multiline
            rows={3}
            label="Special Instructions (AI will process this)"
            value={specialInstructions}
            onChange={(e) => setSpecialInstructions(e.target.value)}
            placeholder="e.g., make it less spicy, extra cheese, no onions..."
            sx={{ mb: 2 }}
          />
          <Typography variant="h6" align="right">
            Total: ₹{getTotalAmount()}
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setShowCart(false)}>Continue Shopping</Button>
          <Button variant="contained" onClick={placeOrder} disabled={cart.length === 0}>
            Place Order
          </Button>
        </DialogActions>
      </Dialog>

      {/* Order Confirmation Dialog */}
      <Dialog open={orderDialog} onClose={() => setOrderDialog(false)}>
        <DialogTitle>Order Confirmed!</DialogTitle>
        <DialogContent>
          <Alert severity="success" sx={{ mb: 2 }}>
            Your order has been placed successfully!
          </Alert>
          <Typography variant="body1" gutterBottom>
            Payment will be processed via UPI integration.
          </Typography>
          <Typography variant="body2" color="text.secondary">
            You'll receive updates on your order status. Thank you for choosing SwiftServe AI!
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button variant="contained" onClick={() => setOrderDialog(false)}>
            Got it!
          </Button>
        </DialogActions>
      </Dialog>

      {/* Call Server Button */}
      <FloatingButton
        onClick={() => setSnackbar({ open: true, message: 'Server has been notified!', severity: 'info' })}
        icon={<Person />}
        label="Call Server"
        color="secondary"
      />
    </Container>
  );

  const renderRestaurantView = () => (
    <Container maxWidth="xl" sx={{ py: 4 }}>
      <SectionHeader
        title="SwiftServe AI Kitchen"
        subtitle="AI-Enhanced Kitchen Display & Server Management System"
        icon={<Kitchen color="primary" sx={{ fontSize: 40 }} />}
      />

      <Grid container spacing={3}>
        {/* Orders KDS */}
        <Grid item xs={12} lg={8}>
          <Paper sx={{ p: 3 }}>
            <Typography variant="h5" gutterBottom>
              Kitchen Display System (KDS)
            </Typography>
            <TableContainer>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>Order ID</TableCell>
                    <TableCell>Table</TableCell>
                    <TableCell>Items</TableCell>
                    <TableCell>Status</TableCell>
                    <TableCell>Actions</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {orders.filter(order => order.status !== 'completed').map((order) => (
                    <TableRow key={order.id}>
                      <TableCell>{order.id}</TableCell>
                      <TableCell>
                        <Chip label={`Table ${order.tableNumber}`} variant="outlined" />
                      </TableCell>
                      <TableCell>
                        <Box>
                          {order.items.map((item, index) => (
                            <Box key={index} sx={{ mb: 2, p: 1, bgcolor: 'grey.50', borderRadius: 1 }}>
                              <Typography variant="subtitle2">
                                {item.name} x{item.quantity}
                              </Typography>
                              {item.customization && (
                                <Box sx={{ mt: 1 }}>
                                  <Typography variant="caption" color="text.secondary">
                                    Customer: "{item.customization}"
                                  </Typography>
                                  <Typography variant="caption" color="primary" sx={{ display: 'block', fontWeight: 'bold' }}>
                                    {/* AI processed instruction would go here */}
                                    KDS: KITCHEN: SPICE LEVEL: LOW. ADD-ON: PANEER (Extra)
                                  </Typography>
                                </Box>
                              )}
                            </Box>
                          ))}
                        </Box>
                      </TableCell>
                      <TableCell>
                        <Chip
                          label={order.status.toUpperCase()}
                          color={getStatusColor(order.status)}
                          icon={getStatusIcon(order.status)}
                        />
                      </TableCell>
                      <TableCell>
                        <Box sx={{ display: 'flex', gap: 1 }}>
                          {order.status === 'new' && (
                            <Button
                              size="small"
                              variant="outlined"
                              onClick={() => updateOrderStatus(order.id, 'preparing')}
                            >
                              Start Preparing
                            </Button>
                          )}
                          {order.status === 'preparing' && (
                            <Button
                              size="small"
                              variant="outlined"
                              onClick={() => updateOrderStatus(order.id, 'ready')}
                            >
                              Mark Ready
                            </Button>
                          )}
                          {order.status === 'ready' && (
                            <Button
                              size="small"
                              variant="outlined"
                              onClick={() => updateOrderStatus(order.id, 'completed')}
                            >
                              Complete
                            </Button>
                          )}
                        </Box>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          </Paper>
        </Grid>

        {/* Server Actions Panel */}
        <Grid item xs={12} lg={4}>
          <Paper sx={{ p: 3 }}>
            <Typography variant="h6" gutterBottom>
              AI Server Actions
            </Typography>
            <Typography variant="body2" color="text.secondary" gutterBottom>
              Real-time AI suggestions for improved hospitality
            </Typography>
            <List>
              {serverPrompts.map((prompt) => (
                <ListItem key={prompt.id} sx={{ bgcolor: 'primary.light', borderRadius: 1, mb: 1 }}>
                  <Avatar sx={{ bgcolor: 'primary.main', mr: 2 }}>
                    <TableRestaurant />
                  </Avatar>
                  <ListItemText
                    primary={`Table ${prompt.tableNumber}`}
                    secondary={prompt.message}
                  />
                </ListItem>
              ))}
              {serverPrompts.length === 0 && (
                <ListItem>
                  <ListItemText
                    primary="No active suggestions"
                    secondary="AI will generate prompts based on order activity"
                  />
                </ListItem>
              )}
            </List>
          </Paper>

          <Paper sx={{ p: 3, mt: 2 }}>
            <Typography variant="h6" gutterBottom>
              Order Analytics
            </Typography>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
              <Typography variant="body2">Active Orders:</Typography>
              <Typography variant="body2" fontWeight="bold">
                {orders.filter(o => o.status !== 'completed').length}
              </Typography>
            </Box>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
              <Typography variant="body2">Completed Today:</Typography>
              <Typography variant="body2" fontWeight="bold">
                {orders.filter(o => o.status === 'completed').length}
              </Typography>
            </Box>
            <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
              <Typography variant="body2">Revenue Today:</Typography>
              <Typography variant="body2" fontWeight="bold">
                ₹{orders.reduce((sum, order) => sum + order.total, 0)}
              </Typography>
            </Box>
          </Paper>
        </Grid>
      </Grid>
    </Container>
  );

  return (
    <Box sx={{ flexGrow: 1, bgcolor: 'grey.50', minHeight: '100vh' }}>
      <AppBar position="static">
        <Toolbar>
          <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
            SwiftServe AI - QR Ordering Platform
          </Typography>
          <FormControlLabel
            control={
              <Switch
                checked={viewMode === 'restaurant'}
                onChange={(e) => setViewMode(e.target.checked ? 'restaurant' : 'customer')}
                color="secondary"
              />
            }
            label={viewMode === 'restaurant' ? 'Restaurant View' : 'Customer View'}
            labelPlacement="start"
          />
        </Toolbar>
      </AppBar>

      {viewMode === 'customer' ? renderCustomerView() : renderRestaurantView()}

      <Snackbar
        open={snackbar.open}
        autoHideDuration={3000}
        onClose={() => setSnackbar({ ...snackbar, open: false })}
      >
        <Alert severity={snackbar.severity} onClose={() => setSnackbar({ ...snackbar, open: false })}>
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Box>
  );
}

export default App;
