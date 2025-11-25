import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { CartProvider } from './shared/context/CartContext';
import { OrderProvider } from './shared/context/OrderContext';
import { MenuProvider } from './shared/context/MenuContext';
import ToastContainer from './shared/components/reactbits/Toast';

// Customer Platform
import CustomerApp from './customer/CustomerApp';
import HomePage from './customer/pages/HomePage';
import CartPage from './customer/pages/CartPage';
import CheckoutPage from './customer/pages/CheckoutPage';
import OrderTrackingPage from './customer/pages/OrderTrackingPage';

// Restaurant Platform
import RestaurantApp from './restaurant/RestaurantApp';
import DashboardPage from './restaurant/pages/DashboardPage';
import KitchenDisplayPage from './restaurant/pages/KitchenDisplayPage';
import OrderManagementPage from './restaurant/pages/OrderManagementPage';
import MenuManagementPage from './restaurant/pages/MenuManagementPage';
import AnalyticsPage from './restaurant/pages/AnalyticsPage';
import SettingsPage from './restaurant/pages/SettingsPage';

// Global Styles
import './styles/index.css';

function App() {
  return (
    <BrowserRouter>
      <MenuProvider>
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
                <Route path="checkout" element={<CheckoutPage />} />
                <Route path="track/:orderId" element={<OrderTrackingPage />} />
              </Route>

              {/* Restaurant Platform Routes */}
              <Route path="/restaurant" element={<RestaurantApp />}>
                <Route index element={<DashboardPage />} />
                <Route path="kds" element={<KitchenDisplayPage />} />
                <Route path="orders" element={<OrderManagementPage />} />
                <Route path="menu" element={<MenuManagementPage />} />
                <Route path="analytics" element={<AnalyticsPage />} />
                <Route path="settings" element={<SettingsPage />} />
              </Route>

              {/* Fallback route */}
              <Route path="*" element={<Navigate to="/customer" replace />} />
            </Routes>
          </OrderProvider>
        </CartProvider>
      </MenuProvider>
    </BrowserRouter>
  );
}

export default App;
