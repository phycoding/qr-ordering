import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowBack, SupportAgent } from '@mui/icons-material';
import { useOrders } from '../../shared/context/OrderContext';
import { ORDER_STATUS } from '../../utils/constants';
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
        const interval = setInterval(loadOrder, 5000);
        return () => clearInterval(interval);
    }, [orderId, getOrderById]);

    if (!order) return <div className="z-loading">Loading...</div>;

    const getStatusMessage = () => {
        switch (order.status) {
            case ORDER_STATUS.NEW: return "Order Received";
            case ORDER_STATUS.PREPARING: return "Preparing your food";
            case ORDER_STATUS.READY: return "Ready to Serve";
            case ORDER_STATUS.COMPLETED: return "Served";
            default: return "Processing";
        }
    };

    const getStatusSubtext = () => {
        switch (order.status) {
            case ORDER_STATUS.NEW: return "Kitchen has received your order";
            case ORDER_STATUS.PREPARING: return "Chef is working on your dishes";
            case ORDER_STATUS.READY: return "Your food is ready!";
            case ORDER_STATUS.COMPLETED: return "Enjoy your meal!";
            default: return "Please wait...";
        }
    };

    return (
        <div className="z-tracking-page dine-in">
            {/* Dine-in Header */}
            <div className="z-dine-in-header">
                <div className="z-nav-bar">
                    <button onClick={() => navigate('/customer/home')}><ArrowBack /></button>
                    <div className="z-nav-actions">
                        <button className="z-action-btn"><SupportAgent /> Call Waiter</button>
                    </div>
                </div>
                <div className="z-table-info">
                    <h1>Table {order.tableNumber}</h1>
                    <p>Order #{order.id.slice(-8)}</p>
                </div>
            </div>

            {/* Status Card */}
            <div className="z-status-card-container">
                <div className="z-status-card">
                    <div className="z-status-header">
                        <div className="z-status-info">
                            <h2>{getStatusMessage()}</h2>
                            <p>{getStatusSubtext()}</p>
                        </div>
                        <div className="z-status-icon">
                            {order.status === ORDER_STATUS.COMPLETED ? (
                                <img src="https://cdn-icons-png.flaticon.com/512/7518/7518748.png" alt="Served" />
                            ) : (
                                <img src="https://cdn-icons-png.flaticon.com/512/3496/3496156.png" alt="Cooking" />
                            )}
                        </div>
                    </div>

                    <div className="z-progress-bar">
                        <div className={`z-progress-fill status-${order.status}`}></div>
                    </div>

                    <div className="z-status-steps">
                        <div className={`step ${order.status !== ORDER_STATUS.NEW ? 'active' : ''}`}>Ordered</div>
                        <div className={`step ${order.status === ORDER_STATUS.PREPARING || order.status === ORDER_STATUS.READY || order.status === ORDER_STATUS.COMPLETED ? 'active' : ''}`}>Cooking</div>
                        <div className={`step ${order.status === ORDER_STATUS.READY || order.status === ORDER_STATUS.COMPLETED ? 'active' : ''}`}>Ready</div>
                        <div className={`step ${order.status === ORDER_STATUS.COMPLETED ? 'active' : ''}`}>Served</div>
                    </div>
                </div>
            </div>

            {/* Order Details */}
            <div className="z-order-details">
                <div className="z-bill-summary">
                    <h3>Your Order</h3>
                    {order.items && order.items.length > 0 ? (
                        order.items.map((item, idx) => (
                            <div key={idx} className="z-bill-item">
                                <div className="item-name-qty">
                                    <span className="qty-box">{item.quantity}</span>
                                    <span>{item.name}</span>
                                </div>
                                <span>₹{item.price * item.quantity}</span>
                            </div>
                        ))
                    ) : (
                        <div className="z-bill-item">
                            <span>No items found</span>
                        </div>
                    )}
                    <div className="z-bill-divider"></div>
                    <div className="z-bill-total">
                        <span>Grand Total</span>
                        <span>₹{order.total}</span>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default OrderTrackingPage;
