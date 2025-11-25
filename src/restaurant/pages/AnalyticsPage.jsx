import React, { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowBack, Download, TrendingUp } from '@mui/icons-material';
import {
    LineChart, Line, BarChart, Bar, PieChart, Pie, Cell,
    XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer
} from 'recharts';
import Card from '../../shared/components/reactbits/Card';
import AnimatedButton from '../../shared/components/reactbits/AnimatedButton';
import { useOrders } from '../../shared/context/OrderContext';
import { ORDER_STATUS } from '../../utils/constants';
import './AnalyticsPage.css';

const AnalyticsPage = () => {
    const navigate = useNavigate();
    const { orders } = useOrders();
    const [dateRange, setDateRange] = useState('week');

    const analytics = useMemo(() => {
        const totalRevenue = orders.reduce((sum, order) => sum + order.total, 0);
        const completedOrders = orders.filter(o => o.status === ORDER_STATUS.COMPLETED);
        const avgOrderValue = completedOrders.length > 0
            ? Math.round(totalRevenue / completedOrders.length)
            : 0;

        // Revenue by day
        const revenueByDay = {};
        orders.forEach(order => {
            const day = new Date(order.timestamp).toLocaleDateString();
            revenueByDay[day] = (revenueByDay[day] || 0) + order.total;
        });

        const revenueData = Object.entries(revenueByDay).map(([day, revenue]) => ({
            day: day.split('/').slice(0, 2).join('/'),
            revenue
        })).slice(-7);

        // Popular items
        const itemCounts = {};
        orders.forEach(order => {
            order.items.forEach(item => {
                if (!itemCounts[item.name]) {
                    itemCounts[item.name] = { name: item.name, count: 0, revenue: 0 };
                }
                itemCounts[item.name].count += item.quantity;
                itemCounts[item.name].revenue += item.price * item.quantity;
            });
        });

        const popularItems = Object.values(itemCounts)
            .sort((a, b) => b.count - a.count)
            .slice(0, 5);

        // Category breakdown
        const categoryRevenue = {};
        orders.forEach(order => {
            order.items.forEach(item => {
                const category = item.category || 'Other';
                categoryRevenue[category] = (categoryRevenue[category] || 0) + (item.price * item.quantity);
            });
        });

        const categoryData = Object.entries(categoryRevenue).map(([name, value]) => ({
            name,
            value
        }));

        // Peak hours
        const hourCounts = Array(24).fill(0);
        orders.forEach(order => {
            const hour = new Date(order.timestamp).getHours();
            hourCounts[hour]++;
        });

        const peakHour = hourCounts.indexOf(Math.max(...hourCounts));

        return {
            totalRevenue,
            totalOrders: orders.length,
            avgOrderValue,
            completedOrders: completedOrders.length,
            revenueData,
            popularItems,
            categoryData,
            peakHour
        };
    }, [orders]);

    const COLORS = ['#667eea', '#764ba2', '#f093fb', '#f5576c', '#4facfe'];

    return (
        <div className="analytics-page">
            <div className="analytics-header">
                <div className="analytics-header-left">
                    <button className="back-button" onClick={() => navigate('/restaurant')}>
                        <ArrowBack />
                    </button>
                    <div>
                        <h1>Analytics & Reports</h1>
                        <p>Business insights and performance metrics</p>
                    </div>
                </div>

                <div className="analytics-header-right">
                    <select
                        className="date-range-select"
                        value={dateRange}
                        onChange={(e) => setDateRange(e.target.value)}
                    >
                        <option value="today">Today</option>
                        <option value="week">This Week</option>
                        <option value="month">This Month</option>
                    </select>
                    <AnimatedButton
                        variant="outline"
                        size="small"
                        icon={<Download />}
                    >
                        Export Report
                    </AnimatedButton>
                </div>
            </div>

            {/* Key Metrics */}
            <div className="metrics-grid">
                <Card variant="elevated" className="metric-card">
                    <Card.Body>
                        <div className="metric-content">
                            <div className="metric-icon revenue-icon">₹</div>
                            <div>
                                <p className="metric-label">Total Revenue</p>
                                <h2 className="metric-value">₹{analytics.totalRevenue.toLocaleString()}</h2>
                                <p className="metric-trend positive">+12.5% from last period</p>
                            </div>
                        </div>
                    </Card.Body>
                </Card>

                <Card variant="elevated" className="metric-card">
                    <Card.Body>
                        <div className="metric-content">
                            <div className="metric-icon orders-icon">📦</div>
                            <div>
                                <p className="metric-label">Total Orders</p>
                                <h2 className="metric-value">{analytics.totalOrders}</h2>
                                <p className="metric-trend positive">+8 from last period</p>
                            </div>
                        </div>
                    </Card.Body>
                </Card>

                <Card variant="elevated" className="metric-card">
                    <Card.Body>
                        <div className="metric-content">
                            <div className="metric-icon avg-icon">📊</div>
                            <div>
                                <p className="metric-label">Avg Order Value</p>
                                <h2 className="metric-value">₹{analytics.avgOrderValue}</h2>
                                <p className="metric-trend positive">+5.2% from last period</p>
                            </div>
                        </div>
                    </Card.Body>
                </Card>

                <Card variant="elevated" className="metric-card">
                    <Card.Body>
                        <div className="metric-content">
                            <div className="metric-icon peak-icon">⏰</div>
                            <div>
                                <p className="metric-label">Peak Hour</p>
                                <h2 className="metric-value">{analytics.peakHour}:00</h2>
                                <p className="metric-trend">Most orders received</p>
                            </div>
                        </div>
                    </Card.Body>
                </Card>
            </div>

            {/* Charts */}
            <div className="charts-grid">
                <Card variant="elevated" className="chart-card">
                    <Card.Header>
                        <h3>Revenue Trend</h3>
                    </Card.Header>
                    <Card.Body>
                        <ResponsiveContainer width="100%" height={300}>
                            <LineChart data={analytics.revenueData}>
                                <CartesianGrid strokeDasharray="3 3" />
                                <XAxis dataKey="day" />
                                <YAxis />
                                <Tooltip />
                                <Legend />
                                <Line type="monotone" dataKey="revenue" stroke="#667eea" strokeWidth={2} />
                            </LineChart>
                        </ResponsiveContainer>
                    </Card.Body>
                </Card>

                <Card variant="elevated" className="chart-card">
                    <Card.Header>
                        <h3>Popular Items</h3>
                    </Card.Header>
                    <Card.Body>
                        <ResponsiveContainer width="100%" height={300}>
                            <BarChart data={analytics.popularItems}>
                                <CartesianGrid strokeDasharray="3 3" />
                                <XAxis dataKey="name" />
                                <YAxis />
                                <Tooltip />
                                <Legend />
                                <Bar dataKey="count" fill="#667eea" />
                            </BarChart>
                        </ResponsiveContainer>
                    </Card.Body>
                </Card>

                <Card variant="elevated" className="chart-card">
                    <Card.Header>
                        <h3>Category Breakdown</h3>
                    </Card.Header>
                    <Card.Body>
                        <ResponsiveContainer width="100%" height={300}>
                            <PieChart>
                                <Pie
                                    data={analytics.categoryData}
                                    cx="50%"
                                    cy="50%"
                                    labelLine={false}
                                    label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                                    outerRadius={80}
                                    fill="#8884d8"
                                    dataKey="value"
                                >
                                    {analytics.categoryData.map((entry, index) => (
                                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                    ))}
                                </Pie>
                                <Tooltip />
                            </PieChart>
                        </ResponsiveContainer>
                    </Card.Body>
                </Card>
            </div>
        </div>
    );
};

export default AnalyticsPage;
