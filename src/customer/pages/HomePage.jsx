import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ShoppingCart, Search, Star } from '@mui/icons-material';
import Card from '../../shared/components/reactbits/Card';
import AnimatedButton from '../../shared/components/reactbits/AnimatedButton';
import Tabs from '../../shared/components/reactbits/Tabs';
import { useCart } from '../../shared/context/CartContext';
import { toast } from '../../shared/components/reactbits/Toast';
import { mockMenuData, CATEGORIES } from '../../utils/constants';
import './HomePage.css';

const HomePage = () => {
    const navigate = useNavigate();
    const { addToCart, getCartCount } = useCart();
    const [menuItems, setMenuItems] = useState(mockMenuData);
    const [filteredItems, setFilteredItems] = useState(mockMenuData);
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedCategory, setSelectedCategory] = useState(0);

    useEffect(() => {
        filterItems();
    }, [searchQuery, selectedCategory]);

    const filterItems = () => {
        let filtered = menuItems;

        // Filter by category
        if (selectedCategory > 0) {
            const category = CATEGORIES[selectedCategory];
            filtered = filtered.filter(item => item.category === category);
        }

        // Filter by search query
        if (searchQuery) {
            filtered = filtered.filter(item =>
                item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                item.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
                item.tags?.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()))
            );
        }

        setFilteredItems(filtered);
    };

    const handleAddToCart = (item) => {
        addToCart(item);
        toast.success(`${item.name} added to cart!`);
    };

    const handleViewProduct = (itemId) => {
        navigate(`/customer/product/${itemId}`);
    };

    return (
        <div className="homepage">
            {/* Header Section */}
            <div className="homepage-header">
                <div className="header-content">
                    <h1 className="header-title">SwiftServe AI</h1>
                    <p className="header-subtitle">AI-Enhanced QR Ordering Experience</p>
                </div>

                <button
                    className="cart-button"
                    onClick={() => navigate('/customer/cart')}
                >
                    <ShoppingCart />
                    {getCartCount() > 0 && (
                        <span className="cart-badge">{getCartCount()}</span>
                    )}
                </button>
            </div>

            {/* Search Bar */}
            <div className="search-section">
                <div className="search-bar">
                    <Search className="search-icon" />
                    <input
                        type="text"
                        placeholder="Search for dishes..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="search-input"
                    />
                </div>
            </div>

            {/* Category Tabs */}
            <div className="category-section">
                <Tabs defaultTab={selectedCategory} onChange={setSelectedCategory}>
                    {CATEGORIES.map((category, index) => (
                        <Tabs.Tab key={index} label={category}>
                            <div></div>
                        </Tabs.Tab>
                    ))}
                </Tabs>
            </div>

            {/* Menu Grid */}
            <div className="menu-grid">
                {filteredItems.length > 0 ? (
                    filteredItems.map((item) => (
                        <Card
                            key={item.id}
                            variant="elevated"
                            hoverable
                            className="menu-item-card"
                        >
                            <div className="card-image-container">
                                {item.aiRecommended && (
                                    <div className="ai-badge">
                                        <Star className="star-icon" />
                                        <span>AI Recommended</span>
                                    </div>
                                )}
                                <div
                                    className="card-image"
                                    onClick={() => handleViewProduct(item.id)}
                                    style={{
                                        background: `linear-gradient(135deg, ${getRandomGradient()})`,
                                        cursor: 'pointer'
                                    }}
                                >
                                    <span className="image-placeholder">{item.name[0]}</span>
                                </div>
                            </div>

                            <Card.Body>
                                <div
                                    className="item-header"
                                    onClick={() => handleViewProduct(item.id)}
                                    style={{ cursor: 'pointer' }}
                                >
                                    <h3 className="item-name">{item.name}</h3>
                                    <div className="item-tags">
                                        {item.tags?.slice(0, 2).map((tag, idx) => (
                                            <span key={idx} className="tag">{tag}</span>
                                        ))}
                                    </div>
                                </div>

                                <p className="item-description">{item.description}</p>

                                <div className="item-meta">
                                    <span className="prep-time">⏱️ {item.preparationTime} min</span>
                                    <span className="calories">🔥 {item.nutritionInfo.calories} cal</span>
                                </div>
                            </Card.Body>

                            <Card.Footer>
                                <div className="item-footer">
                                    <span className="item-price">₹{item.price}</span>
                                    <AnimatedButton
                                        variant="primary"
                                        size="small"
                                        onClick={() => handleAddToCart(item)}
                                        disabled={!item.available}
                                    >
                                        {item.available ? 'Add to Cart' : 'Unavailable'}
                                    </AnimatedButton>
                                </div>
                            </Card.Footer>
                        </Card>
                    ))
                ) : (
                    <div className="no-results">
                        <p>No items found matching your search.</p>
                    </div>
                )}
            </div>

            {/* Floating Cart Button for Mobile */}
            {getCartCount() > 0 && (
                <div className="floating-cart-mobile">
                    <AnimatedButton
                        variant="primary"
                        size="large"
                        fullWidth
                        onClick={() => navigate('/customer/cart')}
                    >
                        <ShoppingCart />
                        <span>View Cart ({getCartCount()} items)</span>
                        <span className="cart-total">₹{calculateCartTotal()}</span>
                    </AnimatedButton>
                </div>
            )}
        </div>
    );
};

// Helper function for random gradients
const getRandomGradient = () => {
    const gradients = [
        '#667eea 0%, #764ba2 100%',
        '#f093fb 0%, #f5576c 100%',
        '#4facfe 0%, #00f2fe 100%',
        '#43e97b 0%, #38f9d7 100%',
        '#fa709a 0%, #fee140 100%',
        '#30cfd0 0%, #330867 100%',
    ];
    return gradients[Math.floor(Math.random() * gradients.length)];
};

// Helper to calculate cart total (placeholder)
const calculateCartTotal = () => {
    return 0; // Will be implemented with cart context
};

export default HomePage;
