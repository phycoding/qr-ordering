// API service for backend communication
const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://127.0.0.1:8000';

class ApiService {
    async request(endpoint, options = {}) {
        const url = `${API_BASE_URL}${endpoint}`;
        const config = {
            headers: {
                'Content-Type': 'application/json',
                ...options.headers,
            },
            ...options,
        };

        try {
            const response = await fetch(url, config);

            if (!response.ok) {
                const errorData = await response.json().catch(() => ({}));
                throw new Error(errorData.detail || `API Error: ${response.statusText}`);
            }

            return await response.json();
        } catch (error) {
            console.error('API Request failed:', error);
            throw error;
        }
    }

    // GET request
    async get(endpoint, options = {}) {
        return this.request(endpoint, { ...options, method: 'GET' });
    }

    // POST request
    async post(endpoint, data, options = {}) {
        return this.request(endpoint, {
            ...options,
            method: 'POST',
            body: JSON.stringify(data),
        });
    }

    // PUT request
    async put(endpoint, data, options = {}) {
        return this.request(endpoint, {
            ...options,
            method: 'PUT',
            body: JSON.stringify(data),
        });
    }

    // PATCH request
    async patch(endpoint, data, options = {}) {
        return this.request(endpoint, {
            ...options,
            method: 'PATCH',
            body: JSON.stringify(data),
        });
    }

    // DELETE request
    async delete(endpoint, options = {}) {
        return this.request(endpoint, { ...options, method: 'DELETE' });
    }

    // Health check
    async healthCheck() {
        try {
            return await this.get('/api/health');
        } catch (error) {
            return { status: 'offline', error: error.message };
        }
    }

    // Menu API methods
    async getMenu() {
        return this.get('/api/menu');
    }

    async createMenuItem(itemData) {
        return this.post('/api/menu', itemData);
    }

    async updateMenuItem(itemId, itemData) {
        return this.put(`/api/menu/${itemId}`, itemData);
    }

    async deleteMenuItem(itemId) {
        return this.delete(`/api/menu/${itemId}`);
    }

    // Order API methods
    async getOrders() {
        return this.get('/api/orders');
    }

    async getOrderById(orderId) {
        return this.get(`/api/orders/${orderId}`);
    }

    async createOrder(orderData) {
        return this.post('/api/orders', orderData);
    }

    async updateOrderStatus(orderId, status) {
        return this.patch(`/api/orders/${orderId}`, { status });
    }

    // AI API methods
    async processCustomization(customText) {
        return this.post('/api/ai/customize', { custom_text: customText });
    }

    async suggestServerAction(orderId) {
        return this.post('/api/ai/suggest_action', { order_id: orderId });
    }
}

export default new ApiService();

