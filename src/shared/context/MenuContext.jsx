import React, { createContext, useContext, useState, useEffect } from 'react';
import api from '../services/api';
import websocket from '../services/websocket';

const MenuContext = createContext();

export const useMenu = () => {
    const context = useContext(MenuContext);
    if (!context) {
        throw new Error('useMenu must be used within a MenuProvider');
    }
    return context;
};

export const MenuProvider = ({ children }) => {
    const [menuItems, setMenuItems] = useState([]);
    const [categories, setCategories] = useState([
        'Main Course', 'Appetizers', 'Breads', 'Beverages', 'Desserts'
    ]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    // Load menu from backend on mount
    useEffect(() => {
        loadMenu();
    }, []);

    // Setup WebSocket listener for menu updates
    useEffect(() => {
        websocket.connect();

        const unsubscribe = websocket.subscribe('menu_updated', () => {
            console.log('Menu updated via WebSocket, reloading...');
            loadMenu();
        });

        return () => {
            unsubscribe();
        };
    }, []);

    const loadMenu = async () => {
        try {
            setLoading(true);
            setError(null);
            const items = await api.getMenu();
            setMenuItems(items);

            // Extract unique categories from menu items
            const uniqueCategories = [...new Set(items.map(item => item.category))];
            if (uniqueCategories.length > 0) {
                setCategories(uniqueCategories);
            }
        } catch (err) {
            console.error('Error loading menu:', err);
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    const addMenuItem = async (item) => {
        try {
            const response = await api.createMenuItem({
                name: item.name,
                description: item.description,
                price: item.price,
                category: item.category,
                available: item.available !== undefined ? item.available : true,
                preparationTime: item.preparationTime || 15,
                tags: item.tags || [],
                aiRecommended: item.aiRecommended || false
            });

            // Reload menu to get the new item with server-generated ID
            await loadMenu();
            return response;
        } catch (err) {
            console.error('Error adding menu item:', err);
            throw err;
        }
    };

    const updateMenuItem = async (itemId, updates) => {
        try {
            // Get the current item to merge with updates
            const currentItem = menuItems.find(item => item.id === itemId);
            if (!currentItem) {
                throw new Error('Menu item not found');
            }

            await api.updateMenuItem(itemId, {
                name: updates.name !== undefined ? updates.name : currentItem.name,
                description: updates.description !== undefined ? updates.description : currentItem.description,
                price: updates.price !== undefined ? updates.price : currentItem.price,
                category: updates.category !== undefined ? updates.category : currentItem.category,
                available: updates.available !== undefined ? updates.available : currentItem.available,
                preparationTime: updates.preparationTime !== undefined ? updates.preparationTime : currentItem.preparationTime,
                tags: updates.tags !== undefined ? updates.tags : currentItem.tags,
                aiRecommended: updates.aiRecommended !== undefined ? updates.aiRecommended : currentItem.aiRecommended
            });

            // Update local state optimistically
            setMenuItems(prev =>
                prev.map(item => item.id === itemId ? { ...item, ...updates } : item)
            );
        } catch (err) {
            console.error('Error updating menu item:', err);
            // Reload menu to ensure consistency
            await loadMenu();
            throw err;
        }
    };

    const deleteMenuItem = async (itemId) => {
        try {
            await api.deleteMenuItem(itemId);

            // Update local state optimistically
            setMenuItems(prev => prev.filter(item => item.id !== itemId));
        } catch (err) {
            console.error('Error deleting menu item:', err);
            // Reload menu to ensure consistency
            await loadMenu();
            throw err;
        }
    };

    const toggleAvailability = async (itemId) => {
        try {
            const item = menuItems.find(item => item.id === itemId);
            if (!item) {
                throw new Error('Menu item not found');
            }

            await updateMenuItem(itemId, { available: !item.available });
        } catch (err) {
            console.error('Error toggling availability:', err);
            throw err;
        }
    };

    const bulkUpdatePrices = async (percentage) => {
        try {
            // Update all items
            const updatePromises = menuItems.map(item =>
                updateMenuItem(item.id, {
                    price: Math.round(item.price * (1 + percentage / 100))
                })
            );

            await Promise.all(updatePromises);
            await loadMenu();
        } catch (err) {
            console.error('Error bulk updating prices:', err);
            throw err;
        }
    };

    const addCategory = (category) => {
        if (!categories.includes(category)) {
            setCategories(prev => [...prev, category]);
        }
    };

    const deleteCategory = (category) => {
        setCategories(prev => prev.filter(c => c !== category));
    };

    const value = {
        menuItems,
        categories,
        loading,
        error,
        addMenuItem,
        updateMenuItem,
        deleteMenuItem,
        toggleAvailability,
        bulkUpdatePrices,
        addCategory,
        deleteCategory,
        refreshMenu: loadMenu
    };

    return <MenuContext.Provider value={value}>{children}</MenuContext.Provider>;
};

export default MenuContext;

