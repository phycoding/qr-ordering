import React, { createContext, useContext, useState, useEffect } from 'react';
import { mockMenuData } from '../../utils/constants';

const MenuContext = createContext();

export const useMenu = () => {
    const context = useContext(MenuContext);
    if (!context) {
        throw new Error('useMenu must be used within a MenuProvider');
    }
    return context;
};

export const MenuProvider = ({ children }) => {
    const [menuItems, setMenuItems] = useState(() => {
        const saved = localStorage.getItem('menuItems');
        return saved ? JSON.parse(saved) : mockMenuData;
    });

    const [categories, setCategories] = useState(() => {
        const saved = localStorage.getItem('categories');
        return saved ? JSON.parse(saved) : [
            'Main Course', 'Appetizers', 'Breads', 'Beverages', 'Desserts'
        ];
    });

    useEffect(() => {
        localStorage.setItem('menuItems', JSON.stringify(menuItems));
    }, [menuItems]);

    useEffect(() => {
        localStorage.setItem('categories', JSON.stringify(categories));
    }, [categories]);

    const addMenuItem = (item) => {
        const newItem = {
            ...item,
            id: `item-${Date.now()}`,
            available: true
        };
        setMenuItems(prev => [...prev, newItem]);
        return newItem;
    };

    const updateMenuItem = (itemId, updates) => {
        setMenuItems(prev =>
            prev.map(item => item.id === itemId ? { ...item, ...updates } : item)
        );
    };

    const deleteMenuItem = (itemId) => {
        setMenuItems(prev => prev.filter(item => item.id !== itemId));
    };

    const toggleAvailability = (itemId) => {
        setMenuItems(prev =>
            prev.map(item =>
                item.id === itemId ? { ...item, available: !item.available } : item
            )
        );
    };

    const bulkUpdatePrices = (percentage) => {
        setMenuItems(prev =>
            prev.map(item => ({
                ...item,
                price: Math.round(item.price * (1 + percentage / 100))
            }))
        );
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
        addMenuItem,
        updateMenuItem,
        deleteMenuItem,
        toggleAvailability,
        bulkUpdatePrices,
        addCategory,
        deleteCategory
    };

    return <MenuContext.Provider value={value}>{children}</MenuContext.Provider>;
};

export default MenuContext;
