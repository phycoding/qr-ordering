import React, { createContext, useContext, useState, useEffect } from 'react';
import { collection, onSnapshot, addDoc, updateDoc, doc, query, orderBy } from 'firebase/firestore';

const OrderContext = createContext();

export const useOrders = () => {
    const context = useContext(OrderContext);
    if (!context) {
        throw new Error('useOrders must be used within an OrderProvider');
    }
    return context;
};

// Mock data for demonstration
const mockOrders = [
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

export const OrderProvider = ({ children, db }) => {
    const [orders, setOrders] = useState(mockOrders);
    const [userOrders, setUserOrders] = useState([]);

    // Mock Firestore subscription
    useEffect(() => {
        // In production, this would be a real Firestore subscription
        // const q = query(collection(db, 'orders'), orderBy('timestamp', 'desc'));
        // const unsubscribe = onSnapshot(q, (snapshot) => {
        //   const ordersData = snapshot.docs.map(doc => ({
        //     id: doc.id,
        //     ...doc.data()
        //   }));
        //   setOrders(ordersData);
        // });
        // return unsubscribe;

        // For now, use mock data
        setOrders(mockOrders);
    }, [db]);

    const createOrder = async (orderData) => {
        try {
            // In production, add to Firestore
            // const docRef = await addDoc(collection(db, 'orders'), {
            //   ...orderData,
            //   timestamp: new Date(),
            //   status: 'new'
            // });

            // Mock implementation
            const newOrder = {
                id: `order-${Date.now()}`,
                ...orderData,
                timestamp: new Date(),
                status: 'new'
            };

            setOrders(prev => [newOrder, ...prev]);
            setUserOrders(prev => [newOrder, ...prev]);

            return { id: newOrder.id };
        } catch (error) {
            console.error('Error creating order:', error);
            throw error;
        }
    };

    const updateOrderStatus = async (orderId, newStatus) => {
        try {
            // In production, update Firestore
            // await updateDoc(doc(db, 'orders', orderId), { status: newStatus });

            // Mock implementation
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
            throw error;
        }
    };

    const getOrderById = (orderId) => {
        return orders.find(order => order.id === orderId);
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
        createOrder,
        updateOrderStatus,
        getOrderById,
        getOrdersByStatus,
        getActiveOrders,
    };

    return <OrderContext.Provider value={value}>{children}</OrderContext.Provider>;
};

export default OrderContext;
