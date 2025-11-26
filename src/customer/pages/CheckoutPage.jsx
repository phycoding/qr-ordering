import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowBack, Person, TableRestaurant, Payment, CheckCircle } from '@mui/icons-material';
import { useCart } from '../../shared/context/CartContext';
import { useOrders } from '../../shared/context/OrderContext';
import { toast } from '../../shared/components/reactbits/Toast';
import { TABLE_NUMBERS, PAYMENT_METHODS } from '../../utils/constants';
import './CheckoutPage.css';

const CheckoutPage = () => {
    const navigate = useNavigate();
    const { cart, getCartTotal, clearCart } = useCart();
    const { createOrder } = useOrders();

    const [tableNumber, setTableNumber] = useState('');
    const [paymentMethod, setPaymentMethod] = useState(PAYMENT_METHODS.UPI);
    const [customerName, setCustomerName] = useState('');
    const [isProcessing, setIsProcessing] = useState(false);

    const subtotal = getCartTotal();
    const gst = Math.round(subtotal * 0.05);
    const total = subtotal + gst + 40; // Including delivery fee

    const handlePlaceOrder = async () => {
        if (!tableNumber || !customerName.trim()) {
            toast.error('Please fill all details');
            return;
        }

        setIsProcessing(true);
        try {
            const order = {
                items: cart,
                tableNumber: parseInt(tableNumber),
                customerName: customerName.trim(),
                paymentMethod,
                total,
                subtotal,
                gst
            };

            const result = await createOrder(order);
            const orderId = result.id || result;

            toast.success('Order placed successfully!');
            clearCart();
            setTimeout(() => navigate(`/customer/track/${orderId}`), 1000);
        } catch (error) {
            toast.error('Failed to place order');
            setIsProcessing(false);
        }
    };

    return (
        <div className="z-checkout-page">
            <div className="z-checkout-header">
                <button onClick={() => navigate('/customer/cart')}><ArrowBack /></button>
                <h1>Checkout</h1>
            </div>

            <div className="z-checkout-content">
                {/* Personal Details */}
                <div className="z-checkout-section">
                    <div className="z-section-header">
                        <Person /> <h2>Personal Details</h2>
                    </div>
                    <input
                        type="text"
                        placeholder="Enter your name"
                        className="z-input"
                        value={customerName}
                        onChange={(e) => setCustomerName(e.target.value)}
                    />
                </div>

                {/* Table Selection */}
                <div className="z-checkout-section">
                    <div className="z-section-header">
                        <TableRestaurant /> <h2>Select Table</h2>
                    </div>
                    <div className="z-table-grid">
                        {TABLE_NUMBERS.map(num => (
                            <button
                                key={num}
                                className={`z-table-btn ${tableNumber === num.toString() ? 'selected' : ''}`}
                                onClick={() => setTableNumber(num.toString())}
                            >
                                {num}
                            </button>
                        ))}
                    </div>
                </div>

                {/* Payment Method */}
                <div className="z-checkout-section">
                    <div className="z-section-header">
                        <Payment /> <h2>Payment Method</h2>
                    </div>
                    <div className="z-payment-options">
                        {[
                            { id: PAYMENT_METHODS.UPI, label: 'UPI', icon: '📱' },
                            { id: PAYMENT_METHODS.CARD, label: 'Card', icon: '💳' },
                            { id: PAYMENT_METHODS.CASH, label: 'Cash', icon: '💵' }
                        ].map(method => (
                            <label key={method.id} className={`z-payment-option ${paymentMethod === method.id ? 'selected' : ''}`}>
                                <input
                                    type="radio"
                                    name="payment"
                                    value={method.id}
                                    checked={paymentMethod === method.id}
                                    onChange={(e) => setPaymentMethod(e.target.value)}
                                />
                                <span className="p-icon">{method.icon}</span>
                                <span className="p-label">{method.label}</span>
                                {paymentMethod === method.id && <CheckCircle className="check-icon" />}
                            </label>
                        ))}
                    </div>
                </div>

                {/* Summary */}
                <div className="z-checkout-summary">
                    <div className="z-summary-row total">
                        <span>Total Amount</span>
                        <span>₹{total}</span>
                    </div>
                    <button
                        className="z-pay-btn"
                        onClick={handlePlaceOrder}
                        disabled={isProcessing}
                    >
                        {isProcessing ? 'Processing...' : `PAY ₹${total}`}
                    </button>
                </div>
            </div>
        </div>
    );
};

export default CheckoutPage;
