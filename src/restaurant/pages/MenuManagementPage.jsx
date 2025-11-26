import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
    ArrowBack,
    Add,
    Edit,
    Delete,
    Search,
    GridView,
    TableRows,
    ToggleOn,
    ToggleOff
} from '@mui/icons-material';
import Card from '../../shared/components/reactbits/Card';
import AnimatedButton from '../../shared/components/reactbits/AnimatedButton';
import { useMenu } from '../../shared/context/MenuContext';
import { toast } from '../../shared/components/reactbits/Toast';
import './MenuManagementPage.css';

const MenuManagementPage = () => {
    const navigate = useNavigate();
    const { menuItems, categories, addMenuItem, updateMenuItem, deleteMenuItem, toggleAvailability } = useMenu();
    const [viewMode, setViewMode] = useState('grid');
    const [searchQuery, setSearchQuery] = useState('');
    const [categoryFilter, setCategoryFilter] = useState('all');
    const [showAddModal, setShowAddModal] = useState(false);
    const [editingItem, setEditingItem] = useState(null);

    const filteredItems = menuItems.filter(item => {
        const matchesSearch = item.name.toLowerCase().includes(searchQuery.toLowerCase());
        const matchesCategory = categoryFilter === 'all' || item.category === categoryFilter;
        return matchesSearch && matchesCategory;
    });

    const handleDelete = (item) => {
        if (window.confirm(`Delete ${item.name}?`)) {
            deleteMenuItem(item.id);
            toast.success(`${item.name} deleted`);
        }
    };

    const handleToggleAvailability = (item) => {
        toggleAvailability(item.id);
        toast.success(`${item.name} ${item.available ? 'marked unavailable' : 'marked available'}`);
    };

    return (
        <div className="menu-management-page">
            <div className="mm-header">
                <div className="mm-header-left">
                    <button className="back-button" onClick={() => navigate('/restaurant')}>
                        <ArrowBack />
                    </button>
                    <div>
                        <h1>Menu Management</h1>
                        <p>{filteredItems.length} items</p>
                    </div>
                </div>

                <div className="mm-header-right">
                    <div className="view-toggle">
                        <button
                            className={`view-button ${viewMode === 'grid' ? 'active' : ''}`}
                            onClick={() => setViewMode('grid')}
                        >
                            <GridView />
                        </button>
                        <button
                            className={`view-button ${viewMode === 'table' ? 'active' : ''}`}
                            onClick={() => setViewMode('table')}
                        >
                            <TableRows />
                        </button>
                    </div>
                    <AnimatedButton
                        variant="primary"
                        onClick={() => setShowAddModal(true)}
                        icon={<Add />}
                    >
                        Add Item
                    </AnimatedButton>
                </div>
            </div>

            <div className="mm-filters">
                <div className="search-bar">
                    <Search className="search-icon" />
                    <input
                        type="text"
                        placeholder="Search menu items..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="search-input"
                    />
                </div>

                <select
                    className="filter-select"
                    value={categoryFilter}
                    onChange={(e) => setCategoryFilter(e.target.value)}
                >
                    <option value="all">All Categories</option>
                    {categories.map(cat => (
                        <option key={cat} value={cat}>{cat}</option>
                    ))}
                </select>
            </div>

            {viewMode === 'grid' ? (
                <div className="menu-grid">
                    {filteredItems.map(item => (
                        <Card key={item.id} variant="elevated" className="menu-item-card">
                            {item.image ? (
                                <img
                                    src={item.image}
                                    alt={item.name}
                                    className="item-image"
                                    onError={(e) => {
                                        e.target.style.display = 'none';
                                        e.target.nextSibling.style.display = 'flex';
                                    }}
                                />
                            ) : null}
                            <div className="item-image-placeholder" style={{ display: item.image ? 'none' : 'flex' }}>
                                {item.name[0]}
                            </div>
                            <Card.Body>
                                <div className="item-header">
                                    <h3>{item.name}</h3>
                                    <button
                                        className="availability-toggle"
                                        onClick={() => handleToggleAvailability(item)}
                                    >
                                        {item.available ? <ToggleOn color="success" /> : <ToggleOff />}
                                    </button>
                                </div>
                                <p className="item-category">{item.category}</p>
                                <p className="item-description">{item.description}</p>
                                <div className="item-footer">
                                    <span className="item-price">₹{item.price}</span>
                                    <div className="item-actions">
                                        <button
                                            className="action-btn edit-btn"
                                            onClick={() => setEditingItem(item)}
                                        >
                                            <Edit fontSize="small" />
                                        </button>
                                        <button
                                            className="action-btn delete-btn"
                                            onClick={() => handleDelete(item)}
                                        >
                                            <Delete fontSize="small" />
                                        </button>
                                    </div>
                                </div>
                            </Card.Body>
                        </Card>
                    ))}
                </div>
            ) : (
                <Card variant="elevated" className="menu-table-card">
                    <table className="menu-table">
                        <thead>
                            <tr>
                                <th>Name</th>
                                <th>Category</th>
                                <th>Price</th>
                                <th>Available</th>
                                <th>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {filteredItems.map(item => (
                                <tr key={item.id}>
                                    <td className="name-cell">{item.name}</td>
                                    <td>{item.category}</td>
                                    <td className="price-cell">₹{item.price}</td>
                                    <td>
                                        <button
                                            className="availability-toggle"
                                            onClick={() => handleToggleAvailability(item)}
                                        >
                                            {item.available ? <ToggleOn color="success" /> : <ToggleOff />}
                                        </button>
                                    </td>
                                    <td>
                                        <div className="table-actions">
                                            <button
                                                className="action-btn edit-btn"
                                                onClick={() => setEditingItem(item)}
                                            >
                                                <Edit fontSize="small" />
                                            </button>
                                            <button
                                                className="action-btn delete-btn"
                                                onClick={() => handleDelete(item)}
                                            >
                                                <Delete fontSize="small" />
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </Card>
            )}

            {showAddModal && (
                <MenuItemModal
                    onClose={() => setShowAddModal(false)}
                    onSave={(item) => {
                        addMenuItem(item);
                        setShowAddModal(false);
                        toast.success('Menu item added');
                    }}
                    categories={categories}
                />
            )}

            {editingItem && (
                <MenuItemModal
                    item={editingItem}
                    onClose={() => setEditingItem(null)}
                    onSave={(updates) => {
                        updateMenuItem(editingItem.id, updates);
                        setEditingItem(null);
                        toast.success('Menu item updated');
                    }}
                    categories={categories}
                />
            )}
        </div>
    );
};

const MenuItemModal = ({ item, onClose, onSave, categories }) => {
    const [formData, setFormData] = useState(item || {
        name: '',
        description: '',
        price: '',
        category: categories[0] || '',
        preparationTime: 15,
        tags: [],
        nutritionInfo: { calories: 0, protein: 0, carbs: 0, fat: 0 }
    });

    const handleSubmit = (e) => {
        e.preventDefault();
        onSave({
            ...formData,
            price: parseInt(formData.price)
        });
    };

    return (
        <div className="modal-overlay" onClick={onClose}>
            <div className="modal-content menu-modal" onClick={(e) => e.stopPropagation()}>
                <div className="modal-header">
                    <h2>{item ? 'Edit Menu Item' : 'Add Menu Item'}</h2>
                    <button className="close-button" onClick={onClose}>×</button>
                </div>

                <form onSubmit={handleSubmit} className="modal-body">
                    <div className="form-group">
                        <label>Name *</label>
                        <input
                            type="text"
                            value={formData.name}
                            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                            required
                            className="form-input"
                        />
                    </div>

                    <div className="form-group">
                        <label>Description *</label>
                        <textarea
                            value={formData.description}
                            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                            required
                            rows={3}
                            className="form-input"
                        />
                    </div>

                    <div className="form-row">
                        <div className="form-group">
                            <label>Price (₹) *</label>
                            <input
                                type="number"
                                value={formData.price}
                                onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                                required
                                min="0"
                                className="form-input"
                            />
                        </div>

                        <div className="form-group">
                            <label>Category *</label>
                            <select
                                value={formData.category}
                                onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                                required
                                className="form-input"
                            >
                                {categories.map(cat => (
                                    <option key={cat} value={cat}>{cat}</option>
                                ))}
                            </select>
                        </div>
                    </div>

                    <div className="form-group">
                        <label>Preparation Time (minutes)</label>
                        <input
                            type="number"
                            value={formData.preparationTime}
                            onChange={(e) => setFormData({ ...formData, preparationTime: parseInt(e.target.value) })}
                            min="1"
                            className="form-input"
                        />
                    </div>

                    <div className="modal-footer">
                        <AnimatedButton variant="outline" onClick={onClose} type="button">
                            Cancel
                        </AnimatedButton>
                        <AnimatedButton variant="primary" type="submit">
                            {item ? 'Update' : 'Add'} Item
                        </AnimatedButton>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default MenuManagementPage;
