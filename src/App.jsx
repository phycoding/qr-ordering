import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { CartProvider } from './shared/context/CartContext';
import { OrderProvider } from './shared/context/OrderContext';
import ToastContainer from './shared/components/reactbits/Toast';

// Customer Platform
import CustomerApp from './customer/CustomerApp';
import HomePage from './customer/pages/HomePage';
import CartPage from './customer/pages/CartPage';

// Restaurant Platform
import RestaurantApp from './restaurant/RestaurantApp';
import DashboardPage from './restaurant/pages/DashboardPage';

// Global Styles
import './styles/index.css';

function App() {
  return (
    <BrowserRouter>
      <CartProvider>
        <OrderProvider>
          <ToastContainer />
          <Routes>
            {/* Root redirect to customer platform */}
            <Route path="/" element={<Navigate to="/customer" replace />} />

            {/* Customer Platform Routes */}
            <Route path="/customer" element={<CustomerApp />}>
              <Route index element={<HomePage />} />
              <Route path="cart" element={<CartPage />} />
              {/* Add more customer routes here as they're created */}
            </Route>

            {/* Restaurant Platform Routes */}
            <Route path="/restaurant" element={<RestaurantApp />}>
              <Route index element={<DashboardPage />} />
              {/* Add more restaurant routes here as they're created */}
            </Route>

            {/* Fallback route */}
            <Route path="*" element={<Navigate to="/customer" replace />} />
          </Routes>
        </OrderProvider>
      </CartProvider>
    </BrowserRouter>
  );
}

export default App;
