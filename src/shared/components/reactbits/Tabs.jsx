import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import './Tabs.css';

const Tabs = ({ children, defaultTab = 0, onChange, className = '' }) => {
    const [activeTab, setActiveTab] = useState(defaultTab);

    const handleTabChange = (index) => {
        setActiveTab(index);
        if (onChange) onChange(index);
    };

    const tabs = React.Children.toArray(children).filter(
        child => child.type === Tab
    );

    return (
        <div className={`tabs-container ${className}`}>
            <div className="tabs-header">
                {tabs.map((tab, index) => (
                    <button
                        key={index}
                        className={`tab-button ${activeTab === index ? 'tab-active' : ''}`}
                        onClick={() => handleTabChange(index)}
                    >
                        {tab.props.icon && <span className="tab-icon">{tab.props.icon}</span>}
                        <span className="tab-label">{tab.props.label}</span>
                        {activeTab === index && (
                            <motion.div
                                className="tab-indicator"
                                layoutId="activeTab"
                                transition={{ type: "spring", stiffness: 500, damping: 30 }}
                            />
                        )}
                    </button>
                ))}
            </div>
            <div className="tabs-content">
                <AnimatePresence mode="wait">
                    <motion.div
                        key={activeTab}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        transition={{ duration: 0.2 }}
                    >
                        {tabs[activeTab]?.props.children}
                    </motion.div>
                </AnimatePresence>
            </div>
        </div>
    );
};

const Tab = ({ children }) => {
    return <>{children}</>;
};

Tabs.Tab = Tab;

export default Tabs;
