import React from 'react';
import { render, waitFor, act } from '@testing-library/react';
import { MenuProvider, useMenu } from '../MenuContext';
import api from '../../services/api';
import websocket from '../../services/websocket';

// Mock the API and WebSocket services
jest.mock('../../services/api');
jest.mock('../../services/websocket');

// Test component to access context
const TestComponent = ({ onRender }) => {
    const menu = useMenu();
    React.useEffect(() => {
        onRender(menu);
    }, [menu, onRender]);
    return null;
};

describe('MenuContext', () => {
    beforeEach(() => {
        jest.clearAllMocks();
        websocket.connect = jest.fn();
        websocket.subscribe = jest.fn(() => jest.fn()); // Return unsubscribe function
    });

    test('loads menu items from API on mount', async () => {
        const mockMenuItems = [
            { id: 'item1', name: 'Dish 1', price: 250, category: 'Main Course' },
            { id: 'item2', name: 'Dish 2', price: 300, category: 'Appetizers' }
        ];
        api.getMenu = jest.fn().mockResolvedValue(mockMenuItems);

        let contextValue;
        render(
            <MenuProvider>
                <TestComponent onRender={(value) => { contextValue = value; }} />
            </MenuProvider>
        );

        await waitFor(() => {
            expect(api.getMenu).toHaveBeenCalled();
            expect(contextValue.menuItems).toEqual(mockMenuItems);
            expect(contextValue.loading).toBe(false);
        });
    });

    test('handles API error when loading menu', async () => {
        const errorMessage = 'Network error';
        api.getMenu = jest.fn().mockRejectedValue(new Error(errorMessage));

        let contextValue;
        render(
            <MenuProvider>
                <TestComponent onRender={(value) => { contextValue = value; }} />
            </MenuProvider>
        );

        await waitFor(() => {
            expect(contextValue.error).toBe(errorMessage);
            expect(contextValue.loading).toBe(false);
        });
    });

    test('addMenuItem calls API and updates state', async () => {
        const mockMenuItems = [];
        const newItem = {
            name: 'New Dish',
            description: 'Test description',
            price: 350,
            category: 'Main Course'
        };
        const createdItem = { id: 'item-new', ...newItem };

        api.getMenu = jest.fn()
            .mockResolvedValueOnce(mockMenuItems)
            .mockResolvedValueOnce([createdItem]);
        api.createMenuItem = jest.fn().mockResolvedValue({ id: 'item-new' });

        let contextValue;
        render(
            <MenuProvider>
                <TestComponent onRender={(value) => { contextValue = value; }} />
            </MenuProvider>
        );

        await waitFor(() => expect(contextValue.loading).toBe(false));

        await act(async () => {
            await contextValue.addMenuItem(newItem);
        });

        expect(api.createMenuItem).toHaveBeenCalledWith(expect.objectContaining(newItem));
        await waitFor(() => {
            expect(contextValue.menuItems).toHaveLength(1);
        });
    });

    test('updateMenuItem calls API and updates state', async () => {
        const mockMenuItems = [
            { id: 'item1', name: 'Dish 1', price: 250, category: 'Main Course', available: true }
        ];
        api.getMenu = jest.fn().mockResolvedValue(mockMenuItems);
        api.updateMenuItem = jest.fn().mockResolvedValue({ message: 'Updated' });

        let contextValue;
        render(
            <MenuProvider>
                <TestComponent onRender={(value) => { contextValue = value; }} />
            </MenuProvider>
        );

        await waitFor(() => expect(contextValue.loading).toBe(false));

        await act(async () => {
            await contextValue.updateMenuItem('item1', { price: 300 });
        });

        expect(api.updateMenuItem).toHaveBeenCalledWith('item1', expect.objectContaining({ price: 300 }));
        expect(contextValue.menuItems[0].price).toBe(300);
    });

    test('deleteMenuItem calls API and updates state', async () => {
        const mockMenuItems = [
            { id: 'item1', name: 'Dish 1', price: 250, category: 'Main Course' }
        ];
        api.getMenu = jest.fn().mockResolvedValue(mockMenuItems);
        api.deleteMenuItem = jest.fn().mockResolvedValue({ message: 'Deleted' });

        let contextValue;
        render(
            <MenuProvider>
                <TestComponent onRender={(value) => { contextValue = value; }} />
            </MenuProvider>
        );

        await waitFor(() => expect(contextValue.loading).toBe(false));

        await act(async () => {
            await contextValue.deleteMenuItem('item1');
        });

        expect(api.deleteMenuItem).toHaveBeenCalledWith('item1');
        expect(contextValue.menuItems).toHaveLength(0);
    });

    test('toggleAvailability updates item availability', async () => {
        const mockMenuItems = [
            { id: 'item1', name: 'Dish 1', price: 250, category: 'Main Course', available: true }
        ];
        api.getMenu = jest.fn().mockResolvedValue(mockMenuItems);
        api.updateMenuItem = jest.fn().mockResolvedValue({ message: 'Updated' });

        let contextValue;
        render(
            <MenuProvider>
                <TestComponent onRender={(value) => { contextValue = value; }} />
            </MenuProvider>
        );

        await waitFor(() => expect(contextValue.loading).toBe(false));

        await act(async () => {
            await contextValue.toggleAvailability('item1');
        });

        expect(api.updateMenuItem).toHaveBeenCalledWith('item1', expect.objectContaining({ available: false }));
    });

    test('WebSocket menu_updated event refreshes menu', async () => {
        const initialItems = [{ id: 'item1', name: 'Dish 1', price: 250, category: 'Main Course' }];
        const updatedItems = [
            { id: 'item1', name: 'Dish 1', price: 250, category: 'Main Course' },
            { id: 'item2', name: 'Dish 2', price: 300, category: 'Appetizers' }
        ];

        let menuUpdatedCallback;
        websocket.subscribe = jest.fn((eventType, callback) => {
            if (eventType === 'menu_updated') {
                menuUpdatedCallback = callback;
            }
            return jest.fn(); // Unsubscribe function
        });

        api.getMenu = jest.fn()
            .mockResolvedValueOnce(initialItems)
            .mockResolvedValueOnce(updatedItems);

        let contextValue;
        render(
            <MenuProvider>
                <TestComponent onRender={(value) => { contextValue = value; }} />
            </MenuProvider>
        );

        await waitFor(() => expect(contextValue.loading).toBe(false));
        expect(contextValue.menuItems).toHaveLength(1);

        // Simulate WebSocket event
        await act(async () => {
            menuUpdatedCallback();
        });

        await waitFor(() => {
            expect(contextValue.menuItems).toHaveLength(2);
        });
    });
});
