import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, ShoppingCart, Star, LocationOn, Person, FilterList, KeyboardArrowDown } from '@mui/icons-material';
import { useCart } from '../../shared/context/CartContext';
import { useMenu } from '../../shared/context/MenuContext';
import { toast } from '../../shared/components/reactbits/Toast';
import { CATEGORIES } from '../../utils/constants';
import './HomePage.css';

const HomePage = () => {
    const navigate = useNavigate();
    const { addToCart, removeFromCart, cart } = useCart();
    const { menuItems } = useMenu();
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedCategory, setSelectedCategory] = useState('Recommended');
    const [activeFilter, setActiveFilter] = useState('all'); // all, veg, non-veg

    const getQuantity = (itemId) => {
        const item = cart.find(i => i.id === itemId);
        return item ? item.quantity : 0;
    };

    const handleQuantityChange = (item, change) => {
        if (change > 0) {
            addToCart(item);
            if (getQuantity(item.id) === 0) toast.success(`${item.name} added`);
        } else {
            removeFromCart(item.id);
        }
    };

    const filteredItems = menuItems.filter(item => {
        const matchesSearch = item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
            item.description.toLowerCase().includes(searchQuery.toLowerCase());
        const matchesCategory = selectedCategory === 'Recommended' || item.category === selectedCategory;
        const matchesFilter = activeFilter === 'all' ||
            (activeFilter === 'veg' && item.isVeg) ||
            (activeFilter === 'non-veg' && !item.isVeg);

        return matchesSearch && matchesCategory && matchesFilter && item.available !== false;
    });

    // Group items for "Recommended" view if needed, or just show list
    // For Zomato style, we often see a list of items with images on the right

    return (
        <div className="zomato-home">
            {/* Sticky Header */}
            <div className="z-header">
                <div className="z-location-bar">
                    <div className="z-location">
                        <LocationOn className="loc-icon" />
                        <div className="loc-text">
                            <span className="loc-title">Work</span>
                            <span className="loc-subtitle">HSR Layout, Bangalore...</span>
                        </div>
                        <KeyboardArrowDown className="arrow-icon" />
                    </div>
                    <div className="z-profile">
                        <div className="profile-icon">S</div>
                    </div>
                </div>

                <div className="z-search-container">
                    <div className="z-search-box">
                        <Search className="search-icon" />
                        <input
                            type="text"
                            placeholder="Restaurant name, cuisine, or a dish..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                        />
                    </div>
                </div>
            </div>

            {/* Categories / Filters */}
            <div className="z-filters-scroll">
                <button className="z-filter-btn active">
                    <FilterList fontSize="small" /> Sort
                </button>
                <button
                    className={`z-filter-btn ${activeFilter === 'veg' ? 'selected' : ''}`}
                    onClick={() => setActiveFilter(activeFilter === 'veg' ? 'all' : 'veg')}
                >
                    Pure Veg
                </button>
                <button
                    className={`z-filter-btn ${activeFilter === 'non-veg' ? 'selected' : ''}`}
                    onClick={() => setActiveFilter(activeFilter === 'non-veg' ? 'all' : 'non-veg')}
                >
                    Non Veg
                </button>
                <button className="z-filter-btn">Rating 4.0+</button>
            </div>

            {/* Horizontal Categories */}
            <div className="z-categories-section">
                <h3>Eat what makes you happy</h3>
                <div className="z-categories-list">
                    {['Recommended', ...CATEGORIES].map((cat, idx) => (
                        <div
                            key={idx}
                            className={`z-category-item ${selectedCategory === cat ? 'active' : ''}`}
                            onClick={() => setSelectedCategory(cat)}
                        >
                            <div className="cat-image-placeholder">
                                {cat[0]}
                            </div>
                            <span>{cat}</span>
                        </div>
                    ))}
                </div>
            </div>

            {/* Menu List */}
            <div className="z-menu-list">
                <h3 className="section-title">{selectedCategory} ({filteredItems.length})</h3>

                {filteredItems.map(item => (
                    <div key={item.id} className="z-menu-item">
                        <div className="z-item-info">
                            <div className="z-item-header">
                                <span className={`veg-icon ${item.isVeg ? 'veg' : 'non-veg'}`}>
                                    ●
                                </span>
                                {item.isBestseller && <span className="bestseller-tag">Bestseller</span>}
                            </div>
                            <h4 className="z-item-name">{item.name}</h4>
                            <div className="z-item-rating">
                                <div className="stars">
                                    <Star fontSize="inherit" />
                                    <Star fontSize="inherit" />
                                    <Star fontSize="inherit" />
                                    <Star fontSize="inherit" />
                                    <Star fontSize="inherit" />
                                </div>
                                <span className="vote-count">142 votes</span>
                            </div>
                            <div className="z-item-price">₹{item.price}</div>
                            <p className="z-item-desc">{item.description}</p>
                        </div>

                        <div className="z-item-image-container">
                            {item.image ? (
                                <img src={item.image} alt={item.name} className="z-item-image" />
                            ) : (
                                <div className="z-item-placeholder">{item.name[0]}</div>
                            )}

                            <div className="z-add-button-container">
                                {getQuantity(item.id) === 0 ? (
                                    <button
                                        className="z-add-btn"
                                        onClick={() => handleQuantityChange(item, 1)}
                                    >
                                        ADD
                                    </button>
                                ) : (
                                    <div className="z-qty-control">
                                        <button onClick={() => handleQuantityChange(item, -1)}>-</button>
                                        <span>{getQuantity(item.id)}</span>
                                        <button onClick={() => handleQuantityChange(item, 1)}>+</button>
                                    </div>
                                )}
                            </div>
                            <div className="customizable-text">customisable</div>
                        </div>
                    </div>
                ))}
            </div>

            {/* Floating Cart Button */}
            {cart.length > 0 && (
                <div className="z-floating-cart" onClick={() => navigate('/customer/cart')}>
                    <div className="cart-info">
                        <span className="cart-count">{cart.reduce((sum, i) => sum + i.quantity, 0)} ITEMS</span>
                        <span className="cart-total">₹{cart.reduce((sum, i) => sum + (i.price * i.quantity), 0)}</span>
                    </div>
                    <div className="view-cart-btn">
                        View Cart <ShoppingCart fontSize="small" />
                    </div>
                </div>
            )}
        </div>
    );
};

export default HomePage;
