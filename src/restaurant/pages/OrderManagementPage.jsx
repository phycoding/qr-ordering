import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
    ArrowBack,
    Search,
    FilterList,
    Download,
    Visibility,
    Cancel,
    CheckCircle
} from '@mui/icons-material';
import Card from '../../shared/components/reactbits/Card';
import AnimatedButton from '../../shared/components/reactbits/AnimatedButton';
import { useOrders } from '../../shared/context/OrderContext';
import { toast } from '../../shared/components/reactbits/Toast';
import { ORDER_STATUS, ORDER_STATUS_LABELS } from '../../utils/constants';
import './OrderManagementPage.css';

const OrderManagementPage = () => {
    const navigate = useNavigate();
    const { orders, updateOrderStatus } = useOrders();
    const [searchQuery, setSearchQuery] = useState('');
    const [statusFilter, setStatusFilter] = useState('all');
    const [tableFilter, setTableFilter] = useState('all');
    const [selectedOrders, setSelectedOrders] = useState([]);
    const [selectedOrder, setSelectedOrder] = useState(null);

    const filteredOrders = orders.filter(order => {
        const matchesSearch =
            order.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
            order.items.some(item => item.name.toLowerCase().includes(searchQuery.toLowerCase()));

        const matchesStatus = statusFilter === 'all' || order.status === statusFilter;
        const matchesTable = tableFilter === 'all' || order.tableNumber === parseInt(tableFilter);

        return matchesSearch && matchesStatus && matchesTable;
    });

    const tableNumbers = [...new Set(orders.map(o => o.tableNumber))].sort((a, b) => a - b);

    const handleSelectOrder = (orderId) => {
        setSelectedOrders(prev =>
            prev.includes(orderId)
                ? prev.filter(id => id !== orderId)
                : [...prev, orderId]
        );
    };

    const handleSelectAll = () => {
        if (selectedOrders.length === filteredOrders.length) {
            setSelectedOrders([]);
        } else {
            setSelectedOrders(filteredOrders.map(o => o.id));
        }
    };

    const handleBulkComplete = async () => {
        for (const orderId of selectedOrders) {
            await updateOrderStatus(orderId, ORDER_STATUS.COMPLETED);
        }
        toast.success(`${selectedOrders.length} orders marked as completed`);
        setSelectedOrders([]);
    };

    const handleExport = () => {
        const csv = [
            ['Order ID', 'Table', 'Items', 'Total', 'Status', 'Time'].join(','),
            ...filteredOrders.map(order => [
                order.id,
                order.tableNumber,
                order.items.map(i => `${i.quantity}x ${i.name}`).join('; '),
                order.total,
                order.status,
                new Date(order.timestamp).toLocaleString()
            ].join(','))
        ].join('\n');

        const blob = new Blob([csv], { type: 'text/csv' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `orders-${new Date().toISOString().split('T')[0]}.csv`;
        a.click();
        toast.success('Orders exported successfully');
    };

    const getStatusColor = (status) => {
        const colors = {
            [ORDER_STATUS.NEW]: '#ef4444',
            [ORDER_STATUS.PREPARING]: '#f59e0b',
            [ORDER_STATUS.READY]: '#10b981',
            [ORDER_STATUS.COMPLETED]: '#6b7280',
            [ORDER_STATUS.CANCELLED]: '#dc2626'
        };
        return colors[status] || '#6b7280';
    };

    return (
        <div className="order-management-page">
            <div className="om-header">
                <div className="om-header-left">
                    <button className="back-button" onClick={() => navigate('/restaurant')}>
                        <ArrowBack />
                    </button>
                    <div>
                        <h1>Order Management</h1>
                        <p>{filteredOrders.length} orders</p>
                    </div>
                </div>

                <div className="om-header-right">
                    {selectedOrders.length > 0 && (
                        <>
                            <span className="selected-count">{selectedOrders.length} selected</span>
                            <AnimatedButton
                                variant="success"
                                size="small"
                                onClick={handleBulkComplete}
                                icon={<CheckCircle />}
                            >
                                Mark Complete
                            </AnimatedButton>
                        </>
                    )}
                    <AnimatedButton
                        variant="outline"
                        size="small"
                        onClick={handleExport}
                        icon={<Download />}
                    >
                        Export
                    </AnimatedButton>
                </div>
            </div>

            <div className="om-filters">
                <div className="search-bar">
                    <Search className="search-icon" />
                    <input
                        type="text"
                        placeholder="Search by order ID or items..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="search-input"
                    />
                </div>

                <select
                    className="filter-select"
                    value={statusFilter}
                    onChange={(e) => setStatusFilter(e.target.value)}
                >
                    <option value="all">All Status</option>
                    {Object.values(ORDER_STATUS).map(status => (
                        <option key={status} value={status}>{ORDER_STATUS_LABELS[status]}</option>
                    ))}
                </select>

                <select
                    className="filter-select"
                    value={tableFilter}
                    onChange={(e) => setTableFilter(e.target.value)}
                >
                    <option value="all">All Tables</option>
                    {tableNumbers.map(num => (
                        <option key={num} value={num}>Table {num}</option>
                    ))}
                </select>
            </div>

            <Card variant="elevated" className="orders-table-card">
                <div className="table-container">
                    <table className="orders-table">
                        <thead>
                            <tr>
                                <th>
                                    <input
                                        type="checkbox"
                                        checked={selectedOrders.length === filteredOrders.length && filteredOrders.length > 0}
                                        onChange={handleSelectAll}
                                    />
                                </th>
                                <th>Order ID</th>
                                <th>Table</th>
                                <th>Items</th>
                                <th>Total</th>
                                <th>Status</th>
                                <th>Time</th>
                                <th>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {filteredOrders.map(order => (
                                <tr key={order.id}>
                                    <td>
                                        <input
                                            type="checkbox"
                                            checked={selectedOrders.includes(order.id)}
                                            onChange={() => handleSelectOrder(order.id)}
                                        />
                                    </td>
                                    <td className="order-id-cell">#{order.id}</td>
                                    <td>
                                        <span className="table-badge">Table {order.tableNumber}</span>
                                    </td>
                                    <td className="items-cell">
                                        {order.items.map((item, idx) => (
                                            <span key={idx}>
                                                {item.quantity}x {item.name}
                                                {idx < order.items.length - 1 && ', '}
                                            </span>
                                        ))}
                                    </td>
                                    <td className="total-cell">₹{order.total}</td>
                                    <td>
                                        <span
                                            className="status-badge"
                                            style={{
                                                background: `${getStatusColor(order.status)}20`,
                                                color: getStatusColor(order.status)
                                            }}
                                        >
                                            {ORDER_STATUS_LABELS[order.status]}
                                        </span>
                                    </td>
                                    <td className="time-cell">
                                        {new Date(order.timestamp).toLocaleTimeString()}
                                    </td>
                                    <td>
                                        <button
                                            className="action-button"
                                            onClick={() => setSelectedOrder(order)}
                                        >
                                            <Visibility fontSize="small" />
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>

                    {filteredOrders.length === 0 && (
                        <div className="no-orders">
                            <p>No orders found</p>
                        </div>
                    )}
                </div>
            </Card>

            {selectedOrder && (
                <OrderDetailsModal
                    order={selectedOrder}
                    onClose={() => setSelectedOrder(null)}
                    onStatusUpdate={updateOrderStatus}
                />
            )}
        </div>
    );
};

const OrderDetailsModal = ({ order, onClose, onStatusUpdate }) => {
    const handleStatusUpdate = async (newStatus) => {
        await onStatusUpdate(order.id, newStatus);
        toast.success(`Order status updated to ${newStatus}`);
        onClose();
    };

    return (
        <div className="modal-overlay" onClick={onClose}>
            <div className="modal-content" onClick={(e) => e.stopPropagation()}>
                <div className="modal-header">
                    <h2>Order Details</h2>
                    <button className="close-button" onClick={onClose}>×</button>
                </div>

                <div className="modal-body">
                    <div className="order-detail-section">
                        <h3>Order Information</h3>
                        <div className="detail-grid">
                            <div className="detail-item">
                                <span className="detail-label">Order ID:</span>
                                <span className="detail-value">#{order.id}</span>
                            </div>
                            <div className="detail-item">
                                <span className="detail-label">Table:</span>
                                <span className="detail-value">Table {order.tableNumber}</span>
                            </div>
                            <div className="detail-item">
                                <span className="detail-label">Time:</span>
                                <span className="detail-value">{new Date(order.timestamp).toLocaleString()}</span>
                            </div>
                            <div className="detail-item">
                                <span className="detail-label">Status:</span>
                                <span className="detail-value">{ORDER_STATUS_LABELS[order.status]}</span>
                            </div>
                        </div>
                    </div>

                    <div className="order-detail-section">
                        <h3>Items</h3>
                        <div className="items-list">
                            {order.items.map((item, idx) => (
                                <div key={idx} className="item-row">
                                    <span className="item-qty">{item.quantity}x</span>
                                    <span className="item-name">{item.name}</span>
                                    <span className="item-price">₹{item.price * item.quantity}</span>
                                </div>
                            ))}
                        </div>
                        <div className="total-row">
                            <span>Total:</span>
                            <span className="total-amount">₹{order.total}</span>
                        </div>
                    </div>

                    {order.customerInstructions && (
                        <div className="order-detail-section">
                            <h3>Special Instructions</h3>
                            <p className="instructions-text">{order.customerInstructions}</p>
                        </div>
                    )}

                    <div className="order-detail-section">
                        <h3>Update Status</h3>
                        <div className="status-actions">
                            {order.status !== ORDER_STATUS.COMPLETED && (
                                <AnimatedButton
                                    variant="success"
                                    onClick={() => handleStatusUpdate(ORDER_STATUS.COMPLETED)}
                                >
                                    Mark as Completed
                                </AnimatedButton>
                            )}
                            {order.status !== ORDER_STATUS.CANCELLED && (
                                <AnimatedButton
                                    variant="danger"
                                    onClick={() => handleStatusUpdate(ORDER_STATUS.CANCELLED)}
                                >
                                    Cancel Order
                                </AnimatedButton>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default OrderManagementPage;
