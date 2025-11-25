import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowBack, TableRestaurant, Payment, Person } from '@mui/icons-material';
import Card from '../../shared/components/reactbits/Card';
import AnimatedButton from '../../shared/components/reactbits/AnimatedButton';
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
    const [specialInstructions, setSpecialInstructions] = useState('');
    const [isProcessing, setIsProcessing] = useState(false);

    const subtotal = getCartTotal();
    const gst = Math.round(subtotal * 0.05);
    const total = subtotal + gst;

    const handlePlaceOrder = async () => {
        if (!tableNumber) {
            toast.error('Please select a table number');
            return;
        }

        if (!customerName.trim()) {
            toast.error('Please enter your name');
            return;
        }

        setIsProcessing(true);

        try {
            const order = {
                items: cart,
                tableNumber: parseInt(tableNumber),
                customerName: customerName.trim(),
                paymentMethod,
                customerInstructions: specialInstructions,
                total,
                subtotal,
                gst
            };

            const result = await createOrder(order);
            const orderId = result.id || result;

            toast.success('Order placed successfully!');
            clearCart();

            // Navigate to order tracking page
            setTimeout(() => {
                navigate(`/customer/track/${orderId}`);
            }, 1000);
        } catch (error) {
            toast.error('Failed to place order. Please try again.');
            setIsProcessing(false);
        }
    };

    if (cart.length === 0) {
        return (
            <div className="checkout-page">
                <div className="checkout-header">
                    <button className="back-button" onClick={() => navigate('/customer')}>
                        <ArrowBack />
                    </button>
                    <h1>Checkout</h1>
                </div>

                <div className="empty-checkout">
                    <div className="empty-icon">🛒</div>
                    <h2>Your cart is empty</h2>
                    <p>Add some items to proceed with checkout</p>
                    <AnimatedButton
                        variant="primary"
                        onClick={() => navigate('/customer')}
                    >
                        Browse Menu
                    </AnimatedButton>
                </div>
            </div>
        );
    }

    return (
        <div className="checkout-page">
            <div className="checkout-header">
                <button className="back-button" onClick={() => navigate('/customer/cart')}>
                    <ArrowBack />
                </button>
                <h1>Checkout</h1>
            </div>

            <div className="checkout-content">
                <div className="checkout-main">
                    {/* Customer Details */}
                    <Card variant="elevated" className="checkout-section">
                        <Card.Header>
                            <h2><Person /> Customer Details</h2>
                        </Card.Header>
                        <Card.Body>
                            <div className="form-group">
                                <label>Your Name *</label>
                                <input
                                    type="text"
                                    placeholder="Enter your name"
                                    value={customerName}
                                    onChange={(e) => setCustomerName(e.target.value)}
                                    className="form-input"
                                />
                            </div>
                        </Card.Body>
                    </Card>

                    {/* Table Selection */}
                    <Card variant="elevated" className="checkout-section">
                        <Card.Header>
                            <h2><TableRestaurant /> Select Table</h2>
                        </Card.Header>
                        <Card.Body>
                            <div className="table-grid">
                                {TABLE_NUMBERS.map(num => (
                                    <button
                                        key={num}
                                        className={`table-button ${tableNumber === num.toString() ? 'selected' : ''}`}
                                        onClick={() => setTableNumber(num.toString())}
                                    >
                                        {num}
                                    </button>
                                ))}
                            </div>
                        </Card.Body>
                    </Card>

                    {/* Payment Method */}
                    <Card variant="elevated" className="checkout-section">
                        <Card.Header>
                            <h2><Payment /> Payment Method</h2>
                        </Card.Header>
                        <Card.Body>
                            <div className="payment-options">
                                <label className="payment-option">
                                    <input
                                        type="radio"
                                        name="payment"
                                        value={PAYMENT_METHODS.UPI}
                                        checked={paymentMethod === PAYMENT_METHODS.UPI}
                                        onChange={(e) => setPaymentMethod(e.target.value)}
                                    />
                                    <div className="payment-label">
                                        <span className="payment-icon">📱</span>
                                        <span>UPI</span>
                                    </div>
                                </label>

                                <label className="payment-option">
                                    <input
                                        type="radio"
                                        name="payment"
                                        value={PAYMENT_METHODS.CARD}
                                        checked={paymentMethod === PAYMENT_METHODS.CARD}
                                        onChange={(e) => setPaymentMethod(e.target.value)}
                                    />
                                    <div className="payment-label">
                                        <span className="payment-icon">💳</span>
                                        <span>Card</span>
                                    </div>
                                </label>

                                <label className="payment-option">
                                    <input
                                        type="radio"
                                        name="payment"
                                        value={PAYMENT_METHODS.CASH}
                                        checked={paymentMethod === PAYMENT_METHODS.CASH}
                                        onChange={(e) => setPaymentMethod(e.target.value)}
                                    />
                                    <div className="payment-label">
                                        <span className="payment-icon">💵</span>
                                        <span>Cash</span>
                                    </div>
                                </label>
                            </div>
                        </Card.Body>
                    </Card>

                    {/* Special Instructions */}
                    <Card variant="elevated" className="checkout-section">
                        <Card.Header>
                            <h2>Special Instructions (Optional)</h2>
                        </Card.Header>
                        <Card.Body>
                            <textarea
                                className="form-textarea"
                                placeholder="Any special requests for your order?"
                                value={specialInstructions}
                                onChange={(e) => setSpecialInstructions(e.target.value)}
                                rows={4}
                            />
                        </Card.Body>
                    </Card>
                </div>

                {/* Order Summary */}
                <div className="checkout-sidebar">
                    <Card variant="elevated" className="summary-card">
                        <Card.Header>
                            <h2>Order Summary</h2>
                        </Card.Header>
                        <Card.Body>
                            <div className="summary-items">
                                {cart.map((item, idx) => (
                                    <div key={idx} className="summary-item">
                                        <span className="item-qty">{item.quantity}x</span>
                                        <span className="item-name">{item.name}</span>
                                        <span className="item-price">₹{item.price * item.quantity}</span>
                                    </div>
                                ))}
                            </div>

                            <div className="summary-divider"></div>

                            <div className="summary-row">
                                <span>Subtotal</span>
                                <span>₹{subtotal}</span>
                            </div>
                            <div className="summary-row">
                                <span>GST (5%)</span>
                                <span>₹{gst}</span>
                            </div>
                            <div className="summary-row total-row">
                                <span>Total</span>
                                <span>₹{total}</span>
                            </div>
                        </Card.Body>
                        <Card.Footer>
                            <AnimatedButton
                                variant="primary"
                                size="large"
                                fullWidth
                                onClick={handlePlaceOrder}
                                loading={isProcessing}
                                disabled={isProcessing}
                            >
                                {isProcessing ? 'Placing Order...' : 'Place Order'}
                            </AnimatedButton>
                        </Card.Footer>
                    </Card>
                </div>
            </div>
        </div>
    );
};

export default CheckoutPage;
