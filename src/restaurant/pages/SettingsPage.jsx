import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowBack, Save } from '@mui/icons-material';
import Card from '../../shared/components/reactbits/Card';
import AnimatedButton from '../../shared/components/reactbits/AnimatedButton';
import Tabs from '../../shared/components/reactbits/Tabs';
import { toast } from '../../shared/components/reactbits/Toast';
import './SettingsPage.css';

const SettingsPage = () => {
    const navigate = useNavigate();
    const [settings, setSettings] = useState(() => {
        const saved = localStorage.getItem('restaurantSettings');
        return saved ? JSON.parse(saved) : {
            restaurantName: 'SwiftServe AI Restaurant',
            address: '123 Main Street, City',
            phone: '+91 1234567890',
            email: 'contact@swiftserve.ai',
            gstPercentage: 5,
            serviceCharge: 0,
            soundAlerts: true,
            browserNotifications: false,
            emailNotifications: true
        };
    });

    const handleSave = () => {
        localStorage.setItem('restaurantSettings', JSON.stringify(settings));
        toast.success('Settings saved successfully');
    };

    const handleChange = (key, value) => {
        setSettings(prev => ({ ...prev, [key]: value }));
    };

    return (
        <div className="settings-page">
            <div className="settings-header">
                <div className="settings-header-left">
                    <button className="back-button" onClick={() => navigate('/restaurant')}>
                        <ArrowBack />
                    </button>
                    <div>
                        <h1>Settings</h1>
                        <p>Configure your restaurant preferences</p>
                    </div>
                </div>

                <AnimatedButton
                    variant="primary"
                    onClick={handleSave}
                    icon={<Save />}
                >
                    Save Changes
                </AnimatedButton>
            </div>

            <Tabs defaultTab={0}>
                <Tabs.Tab label="Restaurant Profile">
                    <Card variant="elevated" className="settings-card">
                        <Card.Header>
                            <h3>Restaurant Information</h3>
                        </Card.Header>
                        <Card.Body>
                            <div className="form-group">
                                <label>Restaurant Name</label>
                                <input
                                    type="text"
                                    value={settings.restaurantName}
                                    onChange={(e) => handleChange('restaurantName', e.target.value)}
                                    className="form-input"
                                />
                            </div>

                            <div className="form-group">
                                <label>Address</label>
                                <textarea
                                    value={settings.address}
                                    onChange={(e) => handleChange('address', e.target.value)}
                                    rows={3}
                                    className="form-input"
                                />
                            </div>

                            <div className="form-row">
                                <div className="form-group">
                                    <label>Phone Number</label>
                                    <input
                                        type="tel"
                                        value={settings.phone}
                                        onChange={(e) => handleChange('phone', e.target.value)}
                                        className="form-input"
                                    />
                                </div>

                                <div className="form-group">
                                    <label>Email</label>
                                    <input
                                        type="email"
                                        value={settings.email}
                                        onChange={(e) => handleChange('email', e.target.value)}
                                        className="form-input"
                                    />
                                </div>
                            </div>
                        </Card.Body>
                    </Card>
                </Tabs.Tab>

                <Tabs.Tab label="Tax & Pricing">
                    <Card variant="elevated" className="settings-card">
                        <Card.Header>
                            <h3>Tax & Service Charges</h3>
                        </Card.Header>
                        <Card.Body>
                            <div className="form-group">
                                <label>GST Percentage (%)</label>
                                <input
                                    type="number"
                                    value={settings.gstPercentage}
                                    onChange={(e) => handleChange('gstPercentage', parseFloat(e.target.value))}
                                    min="0"
                                    max="100"
                                    step="0.1"
                                    className="form-input"
                                />
                                <p className="form-hint">Current GST: {settings.gstPercentage}%</p>
                            </div>

                            <div className="form-group">
                                <label>Service Charge (%)</label>
                                <input
                                    type="number"
                                    value={settings.serviceCharge}
                                    onChange={(e) => handleChange('serviceCharge', parseFloat(e.target.value))}
                                    min="0"
                                    max="100"
                                    step="0.1"
                                    className="form-input"
                                />
                                <p className="form-hint">Additional service charge on orders</p>
                            </div>
                        </Card.Body>
                    </Card>
                </Tabs.Tab>

                <Tabs.Tab label="Notifications">
                    <Card variant="elevated" className="settings-card">
                        <Card.Header>
                            <h3>Notification Preferences</h3>
                        </Card.Header>
                        <Card.Body>
                            <div className="toggle-group">
                                <div className="toggle-item">
                                    <div>
                                        <h4>Sound Alerts</h4>
                                        <p>Play sound when new orders arrive</p>
                                    </div>
                                    <label className="toggle-switch">
                                        <input
                                            type="checkbox"
                                            checked={settings.soundAlerts}
                                            onChange={(e) => handleChange('soundAlerts', e.target.checked)}
                                        />
                                        <span className="toggle-slider"></span>
                                    </label>
                                </div>

                                <div className="toggle-item">
                                    <div>
                                        <h4>Browser Notifications</h4>
                                        <p>Show desktop notifications for new orders</p>
                                    </div>
                                    <label className="toggle-switch">
                                        <input
                                            type="checkbox"
                                            checked={settings.browserNotifications}
                                            onChange={(e) => handleChange('browserNotifications', e.target.checked)}
                                        />
                                        <span className="toggle-slider"></span>
                                    </label>
                                </div>

                                <div className="toggle-item">
                                    <div>
                                        <h4>Email Notifications</h4>
                                        <p>Receive email updates for important events</p>
                                    </div>
                                    <label className="toggle-switch">
                                        <input
                                            type="checkbox"
                                            checked={settings.emailNotifications}
                                            onChange={(e) => handleChange('emailNotifications', e.target.checked)}
                                        />
                                        <span className="toggle-slider"></span>
                                    </label>
                                </div>
                            </div>
                        </Card.Body>
                    </Card>
                </Tabs.Tab>

                <Tabs.Tab label="About">
                    <Card variant="elevated" className="settings-card">
                        <Card.Header>
                            <h3>About SwiftServe AI</h3>
                        </Card.Header>
                        <Card.Body>
                            <div className="about-section">
                                <h4>Version</h4>
                                <p>2.0.0</p>

                                <h4>Platform</h4>
                                <p>QR Ordering System with AI Enhancement</p>

                                <h4>Features</h4>
                                <ul>
                                    <li>Real-time Kitchen Display System</li>
                                    <li>Comprehensive Order Management</li>
                                    <li>Menu Management with CRUD operations</li>
                                    <li>Analytics & Reporting</li>
                                    <li>AI-powered customization processing</li>
                                </ul>

                                <h4>Support</h4>
                                <p>For assistance, contact support@swiftserve.ai</p>
                            </div>
                        </Card.Body>
                    </Card>
                </Tabs.Tab>
            </Tabs>
        </div>
    );
};

export default SettingsPage;
