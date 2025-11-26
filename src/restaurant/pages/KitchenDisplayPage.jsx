import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowBack, Timer, Print, Fullscreen, FilterList } from '@mui/icons-material';
import Card from '../../shared/components/reactbits/Card';
import AnimatedButton from '../../shared/components/reactbits/AnimatedButton';
import { useOrders } from '../../shared/context/OrderContext';
import { toast } from '../../shared/components/reactbits/Toast';
import { ORDER_STATUS } from '../../utils/constants';
import aiService from '../../shared/services/ai';
import './KitchenDisplayPage.css';

const KitchenDisplayPage = () => {
    const navigate = useNavigate();
    const { orders, updateOrderStatus, getActiveOrders } = useOrders();
    const [filter, setFilter] = useState('all');
    const [fullscreen, setFullscreen] = useState(false);

    const activeOrders = getActiveOrders();

    const getOrdersByStatus = (status) => {
        let filtered = activeOrders.filter(order => order.status === status);
        if (filter !== 'all') {
            filtered = filtered.filter(order => order.tableNumber === parseInt(filter));
        }
        return filtered.sort((a, b) => new Date(a.timestamp) - new Date(b.timestamp));
    };

    const handleStatusUpdate = async (orderId, newStatus) => {
        await updateOrderStatus(orderId, newStatus);
        toast.success(`Order #${orderId} moved to ${newStatus}`);
    };

    const getElapsedTime = (timestamp) => {
        const now = new Date();
        const orderTime = new Date(timestamp);
        const diff = Math.floor((now - orderTime) / 1000 / 60);
        return diff;
    };

    const toggleFullscreen = () => {
        if (!document.fullscreenElement) {
            document.documentElement.requestFullscreen();
            setFullscreen(true);
        } else {
            document.exitFullscreen();
            setFullscreen(false);
        }
    };

    const tableNumbers = [...new Set(activeOrders.map(o => o.tableNumber))].sort((a, b) => a - b);

    return (
        <div className={`kds-page ${fullscreen ? 'fullscreen' : ''}`}>
            <div className="kds-header">
                <div className="kds-header-left">
                    {!fullscreen && (
                        <button className="back-button" onClick={() => navigate('/restaurant')}>
                            <ArrowBack />
                        </button>
                    )}
                    <div>
                        <h1>Kitchen Display System</h1>
                        <p>{activeOrders.length} active orders</p>
                    </div>
                </div>

                <div className="kds-header-right">
                    <select
                        className="filter-select"
                        value={filter}
                        onChange={(e) => setFilter(e.target.value)}
                    >
                        <option value="all">All Tables</option>
                        {tableNumbers.map(num => (
                            <option key={num} value={num}>Table {num}</option>
                        ))}
                    </select>

                    <button className="icon-button" onClick={toggleFullscreen}>
                        <Fullscreen />
                    </button>
                </div>
            </div>

            <div className="kds-board">
                {/* New Orders Column */}
                <div className="kds-column new-column">
                    <div className="column-header">
                        <h3>New Orders</h3>
                        <span className="count-badge">{getOrdersByStatus(ORDER_STATUS.NEW).length}</span>
                    </div>
                    <div className="column-content">
                        {getOrdersByStatus(ORDER_STATUS.NEW).map(order => (
                            <OrderCard
                                key={order.id}
                                order={order}
                                onStatusUpdate={handleStatusUpdate}
                                elapsedTime={getElapsedTime(order.timestamp)}
                            />
                        ))}
                        {getOrdersByStatus(ORDER_STATUS.NEW).length === 0 && (
                            <div className="empty-column">No new orders</div>
                        )}
                    </div>
                </div>

                {/* Preparing Column */}
                <div className="kds-column preparing-column">
                    <div className="column-header">
                        <h3>Preparing</h3>
                        <span className="count-badge">{getOrdersByStatus(ORDER_STATUS.PREPARING).length}</span>
                    </div>
                    <div className="column-content">
                        {getOrdersByStatus(ORDER_STATUS.PREPARING).map(order => (
                            <OrderCard
                                key={order.id}
                                order={order}
                                onStatusUpdate={handleStatusUpdate}
                                elapsedTime={getElapsedTime(order.timestamp)}
                            />
                        ))}
                        {getOrdersByStatus(ORDER_STATUS.PREPARING).length === 0 && (
                            <div className="empty-column">No orders preparing</div>
                        )}
                    </div>
                </div>

                {/* Ready Column */}
                <div className="kds-column ready-column">
                    <div className="column-header">
                        <h3>Ready to Serve</h3>
                        <span className="count-badge">{getOrdersByStatus(ORDER_STATUS.READY).length}</span>
                    </div>
                    <div className="column-content">
                        {getOrdersByStatus(ORDER_STATUS.READY).map(order => (
                            <OrderCard
                                key={order.id}
                                order={order}
                                onStatusUpdate={handleStatusUpdate}
                                elapsedTime={getElapsedTime(order.timestamp)}
                            />
                        ))}
                        {getOrdersByStatus(ORDER_STATUS.READY).length === 0 && (
                            <div className="empty-column">No orders ready</div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

const OrderCard = ({ order, onStatusUpdate, elapsedTime }) => {
    const [processedInstructions, setProcessedInstructions] = useState({});

    useEffect(() => {
        const processInstructions = async () => {
            const processed = {};
            for (const item of order.items) {
                if (item.customization) {
                    processed[item.id] = await aiService.processCustomization(item.customization);
                }
            }
            setProcessedInstructions(processed);
        };
        processInstructions();
    }, [order]);

    const getNextStatus = () => {
        switch (order.status) {
            case ORDER_STATUS.NEW:
                return ORDER_STATUS.PREPARING;
            case ORDER_STATUS.PREPARING:
                return ORDER_STATUS.READY;
            case ORDER_STATUS.READY:
                return ORDER_STATUS.COMPLETED;
            default:
                return null;
        }
    };

    const getActionLabel = () => {
        switch (order.status) {
            case ORDER_STATUS.NEW:
                return 'Start Preparing';
            case ORDER_STATUS.PREPARING:
                return 'Ready to Serve';
            case ORDER_STATUS.READY:
                return 'Mark Served';
            default:
                return 'Update';
        }
    };

    const getTimerClass = () => {
        if (elapsedTime > 30) return 'timer-critical';
        if (elapsedTime > 20) return 'timer-warning';
        return 'timer-normal';
    };

    return (
        <Card variant="elevated" className="order-card">
            <div className="order-card-header">
                <div className="order-info">
                    <span className="order-id">#{order.id}</span>
                    <span className="table-badge">Table {order.tableNumber}</span>
                </div>
                <div className={`timer-badge ${getTimerClass()}`}>
                    <Timer fontSize="small" />
                    <span>{elapsedTime} min</span>
                </div>
            </div>

            <div className="order-items">
                {order.items.map((item, idx) => (
                    <div key={idx} className="order-item">
                        <div className="item-main">
                            <span className="item-qty">{item.quantity}x</span>
                            <span className="item-name">{item.name}</span>
                        </div>
                        {item.customization && (
                            <div className="item-instructions">
                                <div className="customer-instruction">
                                    <span className="instruction-label">Customer:</span>
                                    <span className="instruction-text">"{item.customization}"</span>
                                </div>
                                {processedInstructions[item.id] && (
                                    <div className="kitchen-instruction">
                                        <span className="instruction-label">Kitchen:</span>
                                        <span className="instruction-text">{processedInstructions[item.id]}</span>
                                    </div>
                                )}
                            </div>
                        )}
                    </div>
                ))}
            </div>

            {order.customerInstructions && !order.items.some(i => i.customization) && (
                <div className="global-instructions">
                    <span className="instruction-label">Special Instructions:</span>
                    <p>{order.customerInstructions}</p>
                </div>
            )}

            <div className="order-card-footer">
                <button className="print-button">
                    <Print fontSize="small" />
                </button>
                <AnimatedButton
                    variant="primary"
                    size="small"
                    onClick={() => onStatusUpdate(order.id, getNextStatus())}
                    fullWidth
                >
                    {getActionLabel()}
                </AnimatedButton>
            </div>
        </Card>
    );
};

export default KitchenDisplayPage;
