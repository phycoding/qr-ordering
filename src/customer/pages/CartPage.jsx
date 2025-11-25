import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowBack, Delete, Add, Remove } from '@mui/icons-material';
import Card from '../../shared/components/reactbits/Card';
import AnimatedButton from '../../shared/components/reactbits/AnimatedButton';
import { useCart } from '../../shared/context/CartContext';
import { toast } from '../../shared/components/reactbits/Toast';
import './CartPage.css';

const CartPage = () => {
    const navigate = useNavigate();
    const {
        cart,
        removeFromCart,
        updateQuantity,
        updateCustomization,
        getCartTotal,
        getCartCount
    } = useCart();

    const [expandedItems, setExpandedItems] = useState({});

    const handleQuantityChange = (itemId, newQuantity) => {
        if (newQuantity < 1) {
            handleRemoveItem(itemId);
            return;
        }
        updateQuantity(itemId, newQuantity);
    };

    const handleRemoveItem = (itemId) => {
        const item = cart.find(i => i.id === itemId);
        removeFromCart(itemId);
        toast.success(`${item?.name} removed from cart`);
    };

    const handleCustomizationChange = (itemId, value) => {
        updateCustomization(itemId, value);
    };

    const toggleCustomization = (itemId) => {
        setExpandedItems(prev => ({
            ...prev,
            [itemId]: !prev[itemId]
        }));
    };

    const handleCheckout = () => {
        if (cart.length === 0) {
            toast.warning('Your cart is empty');
            return;
        }
        navigate('/customer/checkout');
    };

    if (cart.length === 0) {
        return (
            <div className="cart-page">
                <div className="cart-header">
                    <button className="back-button" onClick={() => navigate('/customer')}>
                        <ArrowBack />
                    </button>
                    <h1>Shopping Cart</h1>
                </div>

                <div className="empty-cart">
                    <div className="empty-cart-icon">🛒</div>
                    <h2>Your cart is empty</h2>
                    <p>Add some delicious items to get started!</p>
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
        <div className="cart-page">
            <div className="cart-header">
                <button className="back-button" onClick={() => navigate('/customer')}>
                    <ArrowBack />
                </button>
                <h1>Shopping Cart</h1>
                <span className="cart-count">{getCartCount()} items</span>
            </div>

            <div className="cart-content">
                <div className="cart-items">
                    {cart.map((item) => (
                        <Card key={item.id} variant="elevated" className="cart-item-card">
                            <Card.Body>
                                <div className="cart-item">
                                    <div className="item-image">
                                        <span className="item-initial">{item.name[0]}</span>
                                    </div>

                                    <div className="item-details">
                                        <h3 className="item-name">{item.name}</h3>
                                        <p className="item-price">₹{item.price} each</p>

                                        <button
                                            className="customize-button"
                                            onClick={() => toggleCustomization(item.id)}
                                        >
                                            {expandedItems[item.id] ? '− Hide' : '+ Add'} special instructions
                                        </button>

                                        {expandedItems[item.id] && (
                                            <div className="customization-section">
                                                <textarea
                                                    className="customization-input"
                                                    placeholder="e.g., make it less spicy, extra cheese, no onions..."
                                                    value={item.customization || ''}
                                                    onChange={(e) => handleCustomizationChange(item.id, e.target.value)}
                                                    rows={3}
                                                />
                                                <p className="ai-hint">✨ AI will process your instructions for the kitchen</p>
                                            </div>
                                        )}
                                    </div>

                                    <div className="item-actions">
                                        <div className="quantity-controls">
                                            <button
                                                className="qty-button"
                                                onClick={() => handleQuantityChange(item.id, item.quantity - 1)}
                                            >
                                                <Remove />
                                            </button>
                                            <span className="quantity">{item.quantity}</span>
                                            <button
                                                className="qty-button"
                                                onClick={() => handleQuantityChange(item.id, item.quantity + 1)}
                                            >
                                                <Add />
                                            </button>
                                        </div>

                                        <div className="item-total">
                                            ₹{item.price * item.quantity}
                                        </div>

                                        <button
                                            className="remove-button"
                                            onClick={() => handleRemoveItem(item.id)}
                                        >
                                            <Delete />
                                        </button>
                                    </div>
                                </div>
                            </Card.Body>
                        </Card>
                    ))}
                </div>

                <div className="cart-summary">
                    <Card variant="elevated" className="summary-card">
                        <Card.Header>
                            <h2>Order Summary</h2>
                        </Card.Header>
                        <Card.Body>
                            <div className="summary-row">
                                <span>Subtotal ({getCartCount()} items)</span>
                                <span>₹{getCartTotal()}</span>
                            </div>
                            <div className="summary-row">
                                <span>GST (5%)</span>
                                <span>₹{Math.round(getCartTotal() * 0.05)}</span>
                            </div>
                            <div className="summary-row total-row">
                                <span>Total</span>
                                <span>₹{Math.round(getCartTotal() * 1.05)}</span>
                            </div>
                        </Card.Body>
                        <Card.Footer>
                            <AnimatedButton
                                variant="primary"
                                size="large"
                                fullWidth
                                onClick={handleCheckout}
                            >
                                Proceed to Checkout
                            </AnimatedButton>
                        </Card.Footer>
                    </Card>

                    <div className="continue-shopping">
                        <AnimatedButton
                            variant="outline"
                            fullWidth
                            onClick={() => navigate('/customer')}
                        >
                            Continue Shopping
                        </AnimatedButton>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default CartPage;
