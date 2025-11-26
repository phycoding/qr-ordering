import React from 'react';
import { render, waitFor, act } from '@testing-library/react';
import { OrderProvider, useOrders } from '../OrderContext';
import api from '../../services/api';
import websocket from '../../services/websocket';

// Mock the API and WebSocket services
jest.mock('../../services/api');
jest.mock('../../services/websocket');

// Test component to access context
const TestComponent = ({ onRender }) => {
    const orders = useOrders();
    React.useEffect(() => {
        onRender(orders);
    }, [orders, onRender]);
    return null;
};

describe('OrderContext', () => {
    beforeEach(() => {
        jest.clearAllMocks();
        websocket.connect = jest.fn();
        websocket.subscribe = jest.fn(() => jest.fn()); // Return unsubscribe function
    });

    test('loads orders from API on mount', async () => {
        const mockOrders = [
            {
                id: 'order1',
                customerName: 'John Doe',
                tableNumber: 5,
                items: [{ id: 'item1', name: 'Dish 1', price: 250, quantity: 1 }],
                status: 'new',
                total: 262.5,
                timestamp: new Date().toISOString()
            }
        ];
        api.getOrders = jest.fn().mockResolvedValue(mockOrders);

        let contextValue;
        render(
            <OrderProvider>
                <TestComponent onRender={(value) => { contextValue = value; }} />
            </OrderProvider>
        );

        await waitFor(() => {
            expect(api.getOrders).toHaveBeenCalled();
            expect(contextValue.orders).toEqual(mockOrders);
            expect(contextValue.loading).toBe(false);
        });
    });

    test('handles API error when loading orders', async () => {
        const errorMessage = 'Network error';
        api.getOrders = jest.fn().mockRejectedValue(new Error(errorMessage));

        let contextValue;
        render(
            <OrderProvider>
                <TestComponent onRender={(value) => { contextValue = value; }} />
            </OrderProvider>
        );

        await waitFor(() => {
            expect(contextValue.error).toBe(errorMessage);
            expect(contextValue.loading).toBe(false);
        });
    });

    test('createOrder calls API and returns order ID', async () => {
        api.getOrders = jest.fn().mockResolvedValue([]);
        api.createOrder = jest.fn().mockResolvedValue({ id: 'order-123' });

        let contextValue;
        render(
            <OrderProvider>
                <TestComponent onRender={(value) => { contextValue = value; }} />
            </OrderProvider>
        );

        await waitFor(() => expect(contextValue.loading).toBe(false));

        const orderData = {
            items: [{ id: 'item1', name: 'Dish 1', price: 250, quantity: 1 }],
            tableNumber: 5,
            customerName: 'John Doe',
            paymentMethod: 'cash',
            total: 262.5,
            subtotal: 250,
            gst: 12.5
        };

        let result;
        await act(async () => {
            result = await contextValue.createOrder(orderData);
        });

        expect(api.createOrder).toHaveBeenCalledWith(orderData);
        expect(result.id).toBe('order-123');
        expect(contextValue.userOrders).toHaveLength(1);
    });

    test('updateOrderStatus calls API and updates local state', async () => {
        const mockOrders = [
            {
                id: 'order1',
                customerName: 'John Doe',
                status: 'new',
                items: [],
                total: 250
            }
        ];
        api.getOrders = jest.fn().mockResolvedValue(mockOrders);
        api.updateOrderStatus = jest.fn().mockResolvedValue({ message: 'Updated' });

        let contextValue;
        render(
            <OrderProvider>
                <TestComponent onRender={(value) => { contextValue = value; }} />
            </OrderProvider>
        );

        await waitFor(() => expect(contextValue.loading).toBe(false));

        await act(async () => {
            await contextValue.updateOrderStatus('order1', 'preparing');
        });

        expect(api.updateOrderStatus).toHaveBeenCalledWith('order1', 'preparing');
        expect(contextValue.orders[0].status).toBe('preparing');
    });

    test('getOrderById returns correct order from local state', async () => {
        const mockOrders = [
            {
                id: 'order1',
                customerName: 'John Doe',
                status: 'new',
                items: [],
                total: 250
            },
            {
                id: 'order2',
                customerName: 'Jane Doe',
                status: 'preparing',
                items: [],
                total: 300
            }
        ];
        api.getOrders = jest.fn().mockResolvedValue(mockOrders);

        let contextValue;
        render(
            <OrderProvider>
                <TestComponent onRender={(value) => { contextValue = value; }} />
            </OrderProvider>
        );

        await waitFor(() => expect(contextValue.loading).toBe(false));

        let order;
        await act(async () => {
            order = await contextValue.getOrderById('order2');
        });

        expect(order.customerName).toBe('Jane Doe');
    });

    test('getOrderById fetches from API if not in local state', async () => {
        api.getOrders = jest.fn().mockResolvedValue([]);
        api.getOrderById = jest.fn().mockResolvedValue({
            id: 'order-remote',
            customerName: 'Remote User',
            status: 'new',
            items: [],
            total: 250
        });

        let contextValue;
        render(
            <OrderProvider>
                <TestComponent onRender={(value) => { contextValue = value; }} />
            </OrderProvider>
        );

        await waitFor(() => expect(contextValue.loading).toBe(false));

        let order;
        await act(async () => {
            order = await contextValue.getOrderById('order-remote');
        });

        expect(api.getOrderById).toHaveBeenCalledWith('order-remote');
        expect(order.customerName).toBe('Remote User');
    });

    test('WebSocket new_order event adds order to state', async () => {
        let newOrderCallback;
        websocket.subscribe = jest.fn((eventType, callback) => {
            if (eventType === 'new_order') {
                newOrderCallback = callback;
            }
            return jest.fn(); // Unsubscribe function
        });

        api.getOrders = jest.fn().mockResolvedValue([]);

        let contextValue;
        render(
            <OrderProvider>
                <TestComponent onRender={(value) => { contextValue = value; }} />
            </OrderProvider>
        );

        await waitFor(() => expect(contextValue.loading).toBe(false));
        expect(contextValue.orders).toHaveLength(0);

        // Simulate WebSocket event
        const newOrder = {
            id: 'order-ws',
            customerName: 'WebSocket User',
            status: 'new',
            items: [],
            total: 250
        };

        await act(async () => {
            newOrderCallback({ order: newOrder });
        });

        await waitFor(() => {
            expect(contextValue.orders).toHaveLength(1);
            expect(contextValue.orders[0].id).toBe('order-ws');
        });
    });

    test('WebSocket order_updated event updates order status', async () => {
        let orderUpdatedCallback;
        websocket.subscribe = jest.fn((eventType, callback) => {
            if (eventType === 'order_updated') {
                orderUpdatedCallback = callback;
            }
            return jest.fn(); // Unsubscribe function
        });

        const mockOrders = [
            {
                id: 'order1',
                customerName: 'John Doe',
                status: 'new',
                items: [],
                total: 250
            }
        ];
        api.getOrders = jest.fn().mockResolvedValue(mockOrders);

        let contextValue;
        render(
            <OrderProvider>
                <TestComponent onRender={(value) => { contextValue = value; }} />
            </OrderProvider>
        );

        await waitFor(() => expect(contextValue.loading).toBe(false));
        expect(contextValue.orders[0].status).toBe('new');

        // Simulate WebSocket event
        await act(async () => {
            orderUpdatedCallback({ orderId: 'order1', status: 'preparing' });
        });

        await waitFor(() => {
            expect(contextValue.orders[0].status).toBe('preparing');
        });
    });

    test('handles error when creating order fails', async () => {
        api.getOrders = jest.fn().mockResolvedValue([]);
        api.createOrder = jest.fn().mockRejectedValue(new Error('Creation failed'));

        let contextValue;
        render(
            <OrderProvider>
                <TestComponent onRender={(value) => { contextValue = value; }} />
            </OrderProvider>
        );

        await waitFor(() => expect(contextValue.loading).toBe(false));

        const orderData = {
            items: [],
            tableNumber: 5,
            customerName: 'John Doe',
            paymentMethod: 'cash',
            total: 250
        };

        await expect(async () => {
            await act(async () => {
                await contextValue.createOrder(orderData);
            });
        }).rejects.toThrow('Creation failed');
    });
});
