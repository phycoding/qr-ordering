import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowBack, CheckCircle, Restaurant, LocalShipping, Phone } from '@mui/icons-material';
import Card from '../../shared/components/reactbits/Card';
import AnimatedButton from '../../shared/components/reactbits/AnimatedButton';
import { useOrders } from '../../shared/context/OrderContext';
import { ORDER_STATUS, ORDER_STATUS_LABELS } from '../../utils/constants';
import './OrderTrackingPage.css';

const OrderTrackingPage = () => {
    const { orderId } = useParams();
    const navigate = useNavigate();
    const { getOrderById } = useOrders();
    const [order, setOrder] = useState(null);

    useEffect(() => {
        const loadOrder = () => {
            const orderData = getOrderById(orderId);
            setOrder(orderData);
        };

        loadOrder();

        // Poll for updates every 5 seconds
        const interval = setInterval(loadOrder, 5000);
        return () => clearInterval(interval);
    }, [orderId, getOrderById]);

    if (!order) {
        return (
            <div className="tracking-page">
                <div className="tracking-header">
                    <button className="back-button" onClick={() => navigate('/customer')}>
                        <ArrowBack />
                    </button>
                    <h1>Order Tracking</h1>
                </div>
                <div className="loading-order">
                    <p>Loading order details...</p>
                </div>
            </div>
        );
    }

    const getStatusStep = () => {
        switch (order.status) {
            case ORDER_STATUS.NEW:
                return 0;
            case ORDER_STATUS.PREPARING:
                return 1;
            case ORDER_STATUS.READY:
                return 2;
            case ORDER_STATUS.COMPLETED:
                return 3;
            default:
                return 0;
        }
    };

    const currentStep = getStatusStep();

    const steps = [
        { label: 'Order Placed', icon: <CheckCircle />, status: ORDER_STATUS.NEW },
        { label: 'Preparing', icon: <Restaurant />, status: ORDER_STATUS.PREPARING },
        { label: 'Ready', icon: <LocalShipping />, status: ORDER_STATUS.READY },
        { label: 'Completed', icon: <CheckCircle />, status: ORDER_STATUS.COMPLETED }
    ];

    const getEstimatedTime = () => {
        // Add null check for order.items
        if (!order.items || order.items.length === 0) {
            return 'Calculating...';
        }

        const totalPrepTime = order.items.reduce((sum, item) => sum + (item.preparationTime || 15), 0);
        const avgPrepTime = Math.ceil(totalPrepTime / order.items.length);

        switch (order.status) {
            case ORDER_STATUS.NEW:
                return `${avgPrepTime} minutes`;
            case ORDER_STATUS.PREPARING:
                return `${Math.ceil(avgPrepTime * 0.6)} minutes`;
            case ORDER_STATUS.READY:
                return 'Ready for pickup!';
            case ORDER_STATUS.COMPLETED:
                return 'Delivered';
            default:
                return 'Calculating...';
        }
    };

    return (
        <div className="tracking-page">
            <div className="tracking-header">
                <button className="back-button" onClick={() => navigate('/customer')}>
                    <ArrowBack />
                </button>
                <h1>Order Tracking</h1>
            </div>

            <div className="tracking-content">
                <Card variant="elevated" className="tracking-card">
                    <Card.Header>
                        <div className="order-header">
                            <div>
                                <h2>Order #{order.id}</h2>
                                <p>Table {order.tableNumber}</p>
                            </div>
                            <div className="status-badge" data-status={order.status}>
                                {ORDER_STATUS_LABELS[order.status]}
                            </div>
                        </div>
                    </Card.Header>

                    <Card.Body>
                        {/* Progress Steps */}
                        <div className="progress-steps">
                            {steps.map((step, index) => (
                                <div key={index} className="step-container">
                                    <div className={`step ${index <= currentStep ? 'active' : ''} ${index < currentStep ? 'completed' : ''}`}>
                                        <div className="step-icon">{step.icon}</div>
                                        <div className="step-label">{step.label}</div>
                                    </div>
                                    {index < steps.length - 1 && (
                                        <div className={`step-line ${index < currentStep ? 'completed' : ''}`}></div>
                                    )}
                                </div>
                            ))}
                        </div>

                        {/* Estimated Time */}
                        <div className="estimated-time">
                            <h3>Estimated Time</h3>
                            <p className="time-value">{getEstimatedTime()}</p>
                        </div>

                        {/* Order Items */}
                        <div className="order-items-section">
                            <h3>Your Order</h3>
                            <div className="order-items-list">
                                {order.items.map((item, idx) => (
                                    <div key={idx} className="order-item-row">
                                        <span className="item-qty">{item.quantity}x</span>
                                        <span className="item-name">{item.name}</span>
                                        <span className="item-price">₹{item.price * item.quantity}</span>
                                    </div>
                                ))}
                            </div>
                            <div className="order-total">
                                <span>Total</span>
                                <span>₹{order.total}</span>
                            </div>
                        </div>

                        {/* Special Instructions */}
                        {order.customerInstructions && (
                            <div className="instructions-section">
                                <h3>Special Instructions</h3>
                                <p>{order.customerInstructions}</p>
                            </div>
                        )}
                    </Card.Body>

                    <Card.Footer>
                        <div className="tracking-actions">
                            <AnimatedButton
                                variant="outline"
                                icon={<Phone />}
                                onClick={() => alert('Calling restaurant...')}
                            >
                                Call Restaurant
                            </AnimatedButton>
                            {order.status === ORDER_STATUS.COMPLETED && (
                                <AnimatedButton
                                    variant="primary"
                                    onClick={() => navigate('/customer')}
                                >
                                    Order Again
                                </AnimatedButton>
                            )}
                        </div>
                    </Card.Footer>
                </Card>
            </div>
        </div>
    );
};

export default OrderTrackingPage;
