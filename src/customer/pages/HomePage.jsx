import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, ShoppingCart, Star } from '@mui/icons-material';
import Card from '../../shared/components/reactbits/Card';
import AnimatedButton from '../../shared/components/reactbits/AnimatedButton';
import Tabs from '../../shared/components/reactbits/Tabs';
import { useCart } from '../../shared/context/CartContext';
import { useMenu } from '../../shared/context/MenuContext';
import { toast } from '../../shared/components/reactbits/Toast';
import { CATEGORIES } from '../../utils/constants';
import aiService from '../../shared/services/ai';
import './HomePage.css';

const HomePage = () => {
    const navigate = useNavigate();
    const { addToCart, getCartCount, getCartTotal } = useCart();
    const { menuItems } = useMenu();
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedCategory, setSelectedCategory] = useState(0);
    const [recommendations, setRecommendations] = useState([]);

    useEffect(() => {
        const getRecommendations = async () => {
            const recs = await aiService.getMenuRecommendations(menuItems);
            setRecommendations(recs);
        };
        getRecommendations();
    }, [menuItems]);

    const filteredItems = menuItems.filter(item => {
        const matchesSearch = item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
            item.description.toLowerCase().includes(searchQuery.toLowerCase());
        const matchesCategory = selectedCategory === 0 || item.category === CATEGORIES[selectedCategory];
        const isAvailable = item.available !== false;
        return matchesSearch && matchesCategory && isAvailable;
    });

    const handleAddToCart = (item) => {
        addToCart(item);
        toast.success(`${item.name} added to cart!`);
    };

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

    return (
        <div className="homepage">
            <div className="homepage-header">
                <div className="header-content">
                    <h1 className="header-title">SwiftServe AI</h1>
                    <p className="header-subtitle">AI-Enhanced QR Ordering Experience</p>
                </div>

                <button className="cart-button" onClick={() => navigate('/customer/cart')}>
                    <ShoppingCart />
                    {getCartCount() > 0 && (
                        <span className="cart-badge">{getCartCount()}</span>
                    )}
                </button>
            </div>

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

            <div className="category-section">
                <Tabs defaultTab={selectedCategory} onChange={setSelectedCategory}>
                    {CATEGORIES.map((category, index) => (
                        <Tabs.Tab key={index} label={category}>
                            <div></div>
                        </Tabs.Tab>
                    ))}
                </Tabs>
            </div>

            <div className="menu-grid">
                {filteredItems.length > 0 ? (
                    filteredItems.map((item) => (
                        <Card key={item.id} variant="elevated" hoverable className="menu-item-card">
                            <div className="card-image-container">
                                {item.aiRecommended && (
                                    <div className="ai-badge">
                                        <Star className="star-icon" />
                                        <span>AI Recommended</span>
                                    </div>
                                )}
                                <div
                                    className="card-image"
                                    style={{
                                        background: `linear-gradient(135deg, ${getRandomGradient()})`,
                                    }}
                                >
                                    <span className="image-placeholder">{item.name[0]}</span>
                                </div>
                            </div>

                            <Card.Body>
                                <h3 className="item-name">{item.name}</h3>
                                <p className="item-category">{item.category}</p>
                                <p className="item-description">{item.description}</p>
                                <div className="item-meta">
                                    <span className="prep-time">⏱️ {item.preparationTime} min</span>
                                    <span className="calories">🔥 {item.nutritionInfo?.calories || 0} cal</span>
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
                        <span className="cart-total">₹{getCartTotal()}</span>
                    </AnimatedButton>
                </div>
            )}
        </div>
    );
};

export default HomePage;
