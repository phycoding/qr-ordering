import React, { createContext, useContext, useState, useEffect } from 'react';
import api from '../services/api';
import websocket from '../services/websocket';

const OrderContext = createContext();

export const useOrders = () => {
    const context = useContext(OrderContext);
    if (!context) {
        throw new Error('useOrders must be used within an OrderProvider');
    }
    return context;
};

export const OrderProvider = ({ children }) => {
    const [orders, setOrders] = useState([]);
    const [userOrders, setUserOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    // Load orders from backend on mount
    useEffect(() => {
        loadOrders();
    }, []);

    // Setup WebSocket listeners for real-time order updates
    useEffect(() => {
        websocket.connect();

        // Listen for new orders
        const unsubscribeNewOrder = websocket.subscribe('new_order', (data) => {
            console.log('New order received via WebSocket:', data);
            if (data.order) {
                setOrders(prev => [data.order, ...prev]);
            }
        });

        // Listen for order status updates
        const unsubscribeOrderUpdate = websocket.subscribe('order_updated', (data) => {
            console.log('Order updated via WebSocket:', data);
            if (data.orderId && data.status) {
                setOrders(prev =>
                    prev.map(order =>
                        order.id === data.orderId ? { ...order, status: data.status } : order
                    )
                );
                setUserOrders(prev =>
                    prev.map(order =>
                        order.id === data.orderId ? { ...order, status: data.status } : order
                    )
                );
            }
        });

        return () => {
            unsubscribeNewOrder();
            unsubscribeOrderUpdate();
        };
    }, []);

    const loadOrders = async () => {
        try {
            setLoading(true);
            setError(null);
            const ordersData = await api.getOrders();
            setOrders(ordersData);
        } catch (err) {
            console.error('Error loading orders:', err);
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    const createOrder = async (orderData) => {
        try {
            const response = await api.createOrder(orderData);

            // Add to user orders immediately
            const newOrder = {
                id: response.id,
                ...orderData,
                timestamp: new Date().toISOString(),
                status: 'new'
            };
            setUserOrders(prev => [newOrder, ...prev]);

            return response;
        } catch (error) {
            console.error('Error creating order:', error);
            throw error;
        }
    };

    const updateOrderStatus = async (orderId, newStatus) => {
        try {
            await api.updateOrderStatus(orderId, newStatus);

            // Update local state optimistically
            setOrders(prev =>
                prev.map(order =>
                    order.id === orderId ? { ...order, status: newStatus } : order
                )
            );

            setUserOrders(prev =>
                prev.map(order =>
                    order.id === orderId ? { ...order, status: newStatus } : order
                )
            );
        } catch (error) {
            console.error('Error updating order status:', error);
            // Reload orders to ensure consistency
            await loadOrders();
            throw error;
        }
    };

    const getOrderById = async (orderId) => {
        // First check local state
        let order = orders.find(order => order.id === orderId);
        if (order) {
            return order;
        }

        // If not in local state, fetch from backend
        try {
            order = await api.getOrderById(orderId);
            // Add to user orders if not already there
            if (!userOrders.find(o => o.id === orderId)) {
                setUserOrders(prev => [order, ...prev]);
            }
            return order;
        } catch (error) {
            console.error('Error fetching order:', error);
            throw error;
        }
    };

    const getOrdersByStatus = (status) => {
        return orders.filter(order => order.status === status);
    };

    const getActiveOrders = () => {
        return orders.filter(order => order.status !== 'completed' && order.status !== 'cancelled');
    };

    const value = {
        orders,
        userOrders,
        loading,
        error,
        createOrder,
        updateOrderStatus,
        getOrderById,
        getOrdersByStatus,
        getActiveOrders,
        refreshOrders: loadOrders
    };

    return <OrderContext.Provider value={value}>{children}</OrderContext.Provider>;
};

export default OrderContext;

