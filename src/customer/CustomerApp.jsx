import React from 'react';
import { Outlet } from 'react-router-dom';
import './CustomerApp.css';

const CustomerApp = () => {
    return (
        <div className="customer-app">
            <Outlet />
        </div>
    );
};

export default CustomerApp;
