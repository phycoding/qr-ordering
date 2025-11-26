import api from '../api';

// Mock fetch globally
global.fetch = jest.fn();

describe('API Service', () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    describe('request method', () => {
        test('handles successful responses', async () => {
            const mockData = { message: 'Success' };
            global.fetch.mockResolvedValueOnce({
                ok: true,
                json: async () => mockData
            });

            const result = await api.get('/test');
            expect(result).toEqual(mockData);
        });

        test('handles HTTP errors', async () => {
            global.fetch.mockResolvedValueOnce({
                ok: false,
                statusText: 'Not Found',
                json: async () => ({ detail: 'Resource not found' })
            });

            await expect(api.get('/test')).rejects.toThrow('Resource not found');
        });

        test('handles network errors', async () => {
            global.fetch.mockRejectedValueOnce(new Error('Network error'));

            await expect(api.get('/test')).rejects.toThrow('Network error');
        });

        test('includes proper headers', async () => {
            global.fetch.mockResolvedValueOnce({
                ok: true,
                json: async () => ({})
            });

            await api.get('/test');

            expect(global.fetch).toHaveBeenCalledWith(
                expect.any(String),
                expect.objectContaining({
                    headers: expect.objectContaining({
                        'Content-Type': 'application/json'
                    })
                })
            );
        });
    });

    describe('HTTP methods', () => {
        test('GET request', async () => {
            global.fetch.mockResolvedValueOnce({
                ok: true,
                json: async () => ({ data: 'test' })
            });

            await api.get('/test');

            expect(global.fetch).toHaveBeenCalledWith(
                expect.stringContaining('/test'),
                expect.objectContaining({ method: 'GET' })
            );
        });

        test('POST request with body', async () => {
            const postData = { name: 'Test' };
            global.fetch.mockResolvedValueOnce({
                ok: true,
                json: async () => ({ id: '123' })
            });

            await api.post('/test', postData);

            expect(global.fetch).toHaveBeenCalledWith(
                expect.stringContaining('/test'),
                expect.objectContaining({
                    method: 'POST',
                    body: JSON.stringify(postData)
                })
            );
        });

        test('PUT request with body', async () => {
            const putData = { name: 'Updated' };
            global.fetch.mockResolvedValueOnce({
                ok: true,
                json: async () => ({ message: 'Updated' })
            });

            await api.put('/test/123', putData);

            expect(global.fetch).toHaveBeenCalledWith(
                expect.stringContaining('/test/123'),
                expect.objectContaining({
                    method: 'PUT',
                    body: JSON.stringify(putData)
                })
            );
        });

        test('PATCH request with body', async () => {
            const patchData = { status: 'active' };
            global.fetch.mockResolvedValueOnce({
                ok: true,
                json: async () => ({ message: 'Patched' })
            });

            await api.patch('/test/123', patchData);

            expect(global.fetch).toHaveBeenCalledWith(
                expect.stringContaining('/test/123'),
                expect.objectContaining({
                    method: 'PATCH',
                    body: JSON.stringify(patchData)
                })
            );
        });

        test('DELETE request', async () => {
            global.fetch.mockResolvedValueOnce({
                ok: true,
                json: async () => ({ message: 'Deleted' })
            });

            await api.delete('/test/123');

            expect(global.fetch).toHaveBeenCalledWith(
                expect.stringContaining('/test/123'),
                expect.objectContaining({ method: 'DELETE' })
            );
        });
    });

    describe('Menu API methods', () => {
        test('getMenu', async () => {
            const mockMenu = [{ id: 'item1', name: 'Dish 1' }];
            global.fetch.mockResolvedValueOnce({
                ok: true,
                json: async () => mockMenu
            });

            const result = await api.getMenu();
            expect(result).toEqual(mockMenu);
            expect(global.fetch).toHaveBeenCalledWith(
                expect.stringContaining('/api/menu'),
                expect.objectContaining({ method: 'GET' })
            );
        });

        test('createMenuItem', async () => {
            const newItem = { name: 'New Dish', price: 250 };
            global.fetch.mockResolvedValueOnce({
                ok: true,
                json: async () => ({ id: 'item-new' })
            });

            await api.createMenuItem(newItem);
            expect(global.fetch).toHaveBeenCalledWith(
                expect.stringContaining('/api/menu'),
                expect.objectContaining({
                    method: 'POST',
                    body: JSON.stringify(newItem)
                })
            );
        });

        test('updateMenuItem', async () => {
            const updates = { price: 300 };
            global.fetch.mockResolvedValueOnce({
                ok: true,
                json: async () => ({ message: 'Updated' })
            });

            await api.updateMenuItem('item1', updates);
            expect(global.fetch).toHaveBeenCalledWith(
                expect.stringContaining('/api/menu/item1'),
                expect.objectContaining({
                    method: 'PUT',
                    body: JSON.stringify(updates)
                })
            );
        });

        test('deleteMenuItem', async () => {
            global.fetch.mockResolvedValueOnce({
                ok: true,
                json: async () => ({ message: 'Deleted' })
            });

            await api.deleteMenuItem('item1');
            expect(global.fetch).toHaveBeenCalledWith(
                expect.stringContaining('/api/menu/item1'),
                expect.objectContaining({ method: 'DELETE' })
            );
        });
    });

    describe('Order API methods', () => {
        test('getOrders', async () => {
            const mockOrders = [{ id: 'order1', status: 'new' }];
            global.fetch.mockResolvedValueOnce({
                ok: true,
                json: async () => mockOrders
            });

            const result = await api.getOrders();
            expect(result).toEqual(mockOrders);
        });

        test('getOrderById', async () => {
            const mockOrder = { id: 'order1', status: 'new' };
            global.fetch.mockResolvedValueOnce({
                ok: true,
                json: async () => mockOrder
            });

            const result = await api.getOrderById('order1');
            expect(result).toEqual(mockOrder);
            expect(global.fetch).toHaveBeenCalledWith(
                expect.stringContaining('/api/orders/order1'),
                expect.objectContaining({ method: 'GET' })
            );
        });

        test('createOrder', async () => {
            const orderData = { items: [], total: 250 };
            global.fetch.mockResolvedValueOnce({
                ok: true,
                json: async () => ({ id: 'order-new' })
            });

            await api.createOrder(orderData);
            expect(global.fetch).toHaveBeenCalledWith(
                expect.stringContaining('/api/orders'),
                expect.objectContaining({
                    method: 'POST',
                    body: JSON.stringify(orderData)
                })
            );
        });

        test('updateOrderStatus', async () => {
            global.fetch.mockResolvedValueOnce({
                ok: true,
                json: async () => ({ message: 'Updated' })
            });

            await api.updateOrderStatus('order1', 'preparing');
            expect(global.fetch).toHaveBeenCalledWith(
                expect.stringContaining('/api/orders/order1'),
                expect.objectContaining({
                    method: 'PATCH',
                    body: JSON.stringify({ status: 'preparing' })
                })
            );
        });
    });

    describe('AI API methods', () => {
        test('processCustomization', async () => {
            const customText = 'extra spicy';
            global.fetch.mockResolvedValueOnce({
                ok: true,
                json: async () => ({ kitchen_instruction: 'SPICE: HIGH' })
            });

            await api.processCustomization(customText);
            expect(global.fetch).toHaveBeenCalledWith(
                expect.stringContaining('/api/ai/customize'),
                expect.objectContaining({
                    method: 'POST',
                    body: JSON.stringify({ custom_text: customText })
                })
            );
        });

        test('suggestServerAction', async () => {
            global.fetch.mockResolvedValueOnce({
                ok: true,
                json: async () => ({ suggestion: 'Offer dessert' })
            });

            await api.suggestServerAction('order1');
            expect(global.fetch).toHaveBeenCalledWith(
                expect.stringContaining('/api/ai/suggest_action'),
                expect.objectContaining({
                    method: 'POST',
                    body: JSON.stringify({ order_id: 'order1' })
                })
            );
        });
    });

    describe('healthCheck', () => {
        test('returns healthy status', async () => {
            global.fetch.mockResolvedValueOnce({
                ok: true,
                json: async () => ({ status: 'healthy' })
            });

            const result = await api.healthCheck();
            expect(result.status).toBe('healthy');
        });

        test('returns offline status on error', async () => {
            global.fetch.mockRejectedValueOnce(new Error('Connection failed'));

            const result = await api.healthCheck();
            expect(result.status).toBe('offline');
            expect(result.error).toBe('Connection failed');
        });
    });
});
