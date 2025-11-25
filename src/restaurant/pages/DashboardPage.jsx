import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
    TrendingUp,
    ShoppingBag,
    AttachMoney,
    Restaurant,
    Kitchen,
    TableRestaurant
} from '@mui/icons-material';
import Card from '../../shared/components/reactbits/Card';
import AnimatedButton from '../../shared/components/reactbits/AnimatedButton';
import { useOrders } from '../../shared/context/OrderContext';
import { ORDER_STATUS } from '../../utils/constants';
import './DashboardPage.css';

const DashboardPage = () => {
    const navigate = useNavigate();
    const { orders, getActiveOrders } = useOrders();
    const [stats, setStats] = useState({
        totalRevenue: 0,
        totalOrders: 0,
        activeOrders: 0,
        avgOrderValue: 0
    });

    useEffect(() => {
        calculateStats();
    }, [orders]);

    const calculateStats = () => {
        const totalRevenue = orders.reduce((sum, order) => sum + order.total, 0);
        const totalOrders = orders.length;
        const activeOrders = getActiveOrders().length;
        const avgOrderValue = totalOrders > 0 ? Math.round(totalRevenue / totalOrders) : 0;

        setStats({
            totalRevenue,
            totalOrders,
            activeOrders,
            avgOrderValue
        });
    };

    const getStatusColor = (status) => {
        const colors = {
            [ORDER_STATUS.NEW]: '#ef4444',
            [ORDER_STATUS.PREPARING]: '#f59e0b',
            [ORDER_STATUS.READY]: '#10b981',
            [ORDER_STATUS.COMPLETED]: '#6b7280'
        };
        return colors[status] || '#6b7280';
    };

    const recentOrders = orders.slice(0, 5);

    return (
        <div className="dashboard-page">
            <div className="dashboard-header">
                <div>
                    <h1>Restaurant Dashboard</h1>
                    <p>Welcome back! Here's what's happening today.</p>
                </div>
                <AnimatedButton
                    variant="primary"
                    onClick={() => navigate('/restaurant/kds')}
                    icon={<Kitchen />}
                >
                    Kitchen Display
                </AnimatedButton>
            </div>

            {/* Stats Grid */}
            <div className="stats-grid">
                <Card variant="elevated" hoverable className="stat-card revenue-card">
                    <Card.Body>
                        <div className="stat-icon revenue-icon">
                            <AttachMoney />
                        </div>
                        <div className="stat-content">
                            <p className="stat-label">Total Revenue</p>
                            <h2 className="stat-value">₹{stats.totalRevenue.toLocaleString()}</h2>
                            <p className="stat-change positive">+12.5% from yesterday</p>
                        </div>
                    </Card.Body>
                </Card>

                <Card variant="elevated" hoverable className="stat-card orders-card">
                    <Card.Body>
                        <div className="stat-icon orders-icon">
                            <ShoppingBag />
                        </div>
                        <div className="stat-content">
                            <p className="stat-label">Total Orders</p>
                            <h2 className="stat-value">{stats.totalOrders}</h2>
                            <p className="stat-change positive">+8 from yesterday</p>
                        </div>
                    </Card.Body>
                </Card>

                <Card variant="elevated" hoverable className="stat-card active-card">
                    <Card.Body>
                        <div className="stat-icon active-icon">
                            <Restaurant />
                        </div>
                        <div className="stat-content">
                            <p className="stat-label">Active Orders</p>
                            <h2 className="stat-value">{stats.activeOrders}</h2>
                            <p className="stat-change">Currently in progress</p>
                        </div>
                    </Card.Body>
                </Card>

                <Card variant="elevated" hoverable className="stat-card avg-card">
                    <Card.Body>
                        <div className="stat-icon avg-icon">
                            <TrendingUp />
                        </div>
                        <div className="stat-content">
                            <p className="stat-label">Avg Order Value</p>
                            <h2 className="stat-value">₹{stats.avgOrderValue}</h2>
                            <p className="stat-change positive">+5.2% from last week</p>
                        </div>
                    </Card.Body>
                </Card>
            </div>

            {/* Recent Orders */}
            <div className="recent-orders-section">
                <Card variant="elevated">
                    <Card.Header>
                        <div className="section-header">
                            <h2>Recent Orders</h2>
                            <AnimatedButton
                                variant="outline"
                                size="small"
                                onClick={() => navigate('/restaurant/orders')}
                            >
                                View All
                            </AnimatedButton>
                        </div>
                    </Card.Header>
                    <Card.Body>
                        {recentOrders.length > 0 ? (
                            <div className="orders-list">
                                {recentOrders.map((order) => (
                                    <div key={order.id} className="order-item">
                                        <div className="order-info">
                                            <div className="order-id-section">
                                                <span className="order-id">#{order.id}</span>
                                                <div className="table-badge">
                                                    <TableRestaurant fontSize="small" />
                                                    <span>Table {order.tableNumber}</span>
                                                </div>
                                            </div>
                                            <div className="order-items">
                                                {order.items.map((item, idx) => (
                                                    <span key={idx} className="item-name">
                                                        {item.name} x{item.quantity}
                                                        {idx < order.items.length - 1 && ', '}
                                                    </span>
                                                ))}
                                            </div>
                                        </div>
                                        <div className="order-meta">
                                            <span
                                                className="order-status"
                                                style={{
                                                    background: `${getStatusColor(order.status)}20`,
                                                    color: getStatusColor(order.status)
                                                }}
                                            >
                                                {order.status.toUpperCase()}
                                            </span>
                                            <span className="order-total">₹{order.total}</span>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <div className="no-orders">
                                <p>No orders yet today</p>
                            </div>
                        )}
                    </Card.Body>
                </Card>
            </div>

            {/* Quick Actions */}
            <div className="quick-actions">
                <h2>Quick Actions</h2>
                <div className="actions-grid">
                    <AnimatedButton
                        variant="primary"
                        fullWidth
                        onClick={() => navigate('/restaurant/kds')}
                        icon={<Kitchen />}
                    >
                        Kitchen Display
                    </AnimatedButton>
                    <AnimatedButton
                        variant="secondary"
                        fullWidth
                        onClick={() => navigate('/restaurant/orders')}
                        icon={<ShoppingBag />}
                    >
                        Manage Orders
                    </AnimatedButton>
                    <AnimatedButton
                        variant="outline"
                        fullWidth
                        onClick={() => navigate('/restaurant/menu')}
                        icon={<Restaurant />}
                    >
                        Menu Management
                    </AnimatedButton>
                    <AnimatedButton
                        variant="outline"
                        fullWidth
                        onClick={() => navigate('/restaurant/analytics')}
                        icon={<TrendingUp />}
                    >
                        View Analytics
                    </AnimatedButton>
                </div>
            </div>
        </div>
    );
};

export default DashboardPage;
