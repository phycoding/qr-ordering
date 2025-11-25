import React from 'react';
import { Outlet, useNavigate, useLocation } from 'react-router-dom';
import { Dashboard, Kitchen, ShoppingBag, Restaurant, BarChart, Settings } from '@mui/icons-material';
import './RestaurantApp.css';

const RestaurantApp = () => {
    const navigate = useNavigate();
    const location = useLocation();

    const menuItems = [
        { path: '/restaurant', icon: <Dashboard />, label: 'Dashboard' },
        { path: '/restaurant/kds', icon: <Kitchen />, label: 'Kitchen Display' },
        { path: '/restaurant/orders', icon: <ShoppingBag />, label: 'Orders' },
        { path: '/restaurant/menu', icon: <Restaurant />, label: 'Menu' },
        { path: '/restaurant/analytics', icon: <BarChart />, label: 'Analytics' },
        { path: '/restaurant/settings', icon: <Settings />, label: 'Settings' },
    ];

    const isActive = (path) => {
        if (path === '/restaurant') {
            return location.pathname === path;
        }
        return location.pathname.startsWith(path);
    };

    return (
        <div className="restaurant-app">
            <aside className="restaurant-sidebar">
                <div className="sidebar-header">
                    <h2>SwiftServe AI</h2>
                    <p>Restaurant Portal</p>
                </div>

                <nav className="sidebar-nav">
                    {menuItems.map((item) => (
                        <button
                            key={item.path}
                            className={`nav-item ${isActive(item.path) ? 'active' : ''}`}
                            onClick={() => navigate(item.path)}
                        >
                            <span className="nav-icon">{item.icon}</span>
                            <span className="nav-label">{item.label}</span>
                        </button>
                    ))}
                </nav>
            </aside>

            <main className="restaurant-main">
                <Outlet />
            </main>
        </div>
    );
};

export default RestaurantApp;
