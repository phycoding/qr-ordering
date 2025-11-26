import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowBack, Delete, Add, Remove, LocalOffer } from '@mui/icons-material';
import { useCart } from '../../shared/context/CartContext';
import { toast } from '../../shared/components/reactbits/Toast';
import './CartPage.css';

const CartPage = () => {
    const navigate = useNavigate();
    const { cart, removeFromCart, updateQuantity, getCartTotal, getCartCount } = useCart();
    const [instruction, setInstruction] = useState('');

    const handleQuantityChange = (itemId, newQuantity) => {
        if (newQuantity < 1) {
            removeFromCart(itemId);
        } else {
            updateQuantity(itemId, newQuantity);
        }
    };

    if (cart.length === 0) {
        return (
            <div className="z-cart-empty">
                <img src="https://b.zmtcdn.com/web_assets/b40b97e677bc7b2ca77c58c61db266fe1603954218.png" alt="Empty Cart" />
                <h3>Your cart is empty</h3>
                <p>You can go to home page to view more restaurants</p>
                <button onClick={() => navigate('/customer/home')}>See restaurants near you</button>
            </div>
        );
    }

    return (
        <div className="z-cart-page">
            <div className="z-cart-header">
                <button onClick={() => navigate('/customer/home')}><ArrowBack /></button>
                <h1>Cart</h1>
            </div>

            <div className="z-cart-container">
                {/* Items Section */}
                <div className="z-cart-items-section">
                    {cart.map(item => (
                        <div key={item.id} className="z-cart-item">
                            <div className="z-cart-item-info">
                                <div className={`veg-icon ${item.isVeg ? 'veg' : 'non-veg'}`}>●</div>
                                <div className="z-cart-item-details">
                                    <h4>{item.name}</h4>
                                    <p>₹{item.price}</p>
                                    <p className="z-item-desc">{item.description}</p>
                                </div>
                            </div>
                            <div className="z-cart-actions">
                                <div className="z-qty-control small">
                                    <button onClick={() => handleQuantityChange(item.id, item.quantity - 1)}>-</button>
                                    <span>{item.quantity}</span>
                                    <button onClick={() => handleQuantityChange(item.id, item.quantity + 1)}>+</button>
                                </div>
                                <div className="z-item-total">₹{item.price * item.quantity}</div>
                            </div>
                        </div>
                    ))}

                    <div className="z-instruction-box">
                        <input
                            type="text"
                            placeholder="Write instructions for restaurant..."
                            value={instruction}
                            onChange={(e) => setInstruction(e.target.value)}
                        />
                    </div>
                </div>

                {/* Bill Details */}
                <div className="z-bill-details">
                    <h3>Bill Details</h3>
                    <div className="z-bill-row">
                        <span>Item Total</span>
                        <span>₹{getCartTotal()}</span>
                    </div>
                    <div className="z-bill-row">
                        <span>Delivery Fee</span>
                        <span>₹40</span>
                    </div>
                    <div className="z-bill-row">
                        <span>GST and Restaurant Charges</span>
                        <span>₹{Math.round(getCartTotal() * 0.05)}</span>
                    </div>
                    <div className="z-bill-divider"></div>
                    <div className="z-bill-row total">
                        <span>To Pay</span>
                        <span>₹{Math.round(getCartTotal() * 1.05) + 40}</span>
                    </div>
                </div>

                {/* Offers */}
                <div className="z-offers-section">
                    <div className="z-offer-header">
                        <LocalOffer /> <span>Offers & Benefits</span>
                    </div>
                    <div className="z-offer-input">
                        <input type="text" placeholder="Apply Coupon" />
                        <button>APPLY</button>
                    </div>
                </div>
            </div>

            {/* Bottom Bar */}
            <div className="z-cart-footer">
                <div className="z-pay-info">
                    <span className="pay-label">PAY USING</span>
                    <span className="pay-method">UPI (Google Pay)</span>
                </div>
                <button className="z-place-order-btn" onClick={() => navigate('/customer/checkout')}>
                    Place Order <span className="total-amt">₹{Math.round(getCartTotal() * 1.05) + 40}</span>
                </button>
            </div>
        </div>
    );
};

export default CartPage;
