// WebSocket service for real-time updates
const WS_URL = process.env.REACT_APP_WS_URL || 'ws://127.0.0.1:8000/ws';

class WebSocketService {
    constructor() {
        this.ws = null;
        this.listeners = new Map();
        this.reconnectAttempts = 0;
        this.maxReconnectAttempts = 5;
        this.reconnectDelay = 3000;
        this.isConnecting = false;
    }

    connect() {
        if (this.ws?.readyState === WebSocket.OPEN || this.isConnecting) {
            return;
        }

        this.isConnecting = true;

        try {
            this.ws = new WebSocket(WS_URL);

            this.ws.onopen = () => {
                console.log('WebSocket connected');
                this.isConnecting = false;
                this.reconnectAttempts = 0;
                this.notifyListeners('connected', { status: 'connected' });
            };

            this.ws.onmessage = (event) => {
                try {
                    const data = JSON.parse(event.data);
                    this.handleMessage(data);
                } catch (error) {
                    console.error('Error parsing WebSocket message:', error);
                }
            };

            this.ws.onerror = (error) => {
                console.error('WebSocket error:', error);
                this.isConnecting = false;
            };

            this.ws.onclose = () => {
                console.log('WebSocket disconnected');
                this.isConnecting = false;
                this.notifyListeners('disconnected', { status: 'disconnected' });
                this.attemptReconnect();
            };
        } catch (error) {
            console.error('Error creating WebSocket connection:', error);
            this.isConnecting = false;
            this.attemptReconnect();
        }
    }

    disconnect() {
        if (this.ws) {
            this.ws.close();
            this.ws = null;
        }
        this.reconnectAttempts = this.maxReconnectAttempts; // Prevent reconnection
    }

    attemptReconnect() {
        if (this.reconnectAttempts < this.maxReconnectAttempts) {
            this.reconnectAttempts++;
            console.log(`Attempting to reconnect (${this.reconnectAttempts}/${this.maxReconnectAttempts})...`);
            setTimeout(() => this.connect(), this.reconnectDelay);
        } else {
            console.error('Max reconnection attempts reached');
        }
    }

    handleMessage(data) {
        const { type, ...payload } = data;

        // Handle ping/pong for keep-alive
        if (type === 'ping') {
            return;
        }

        // Notify all listeners for this message type
        this.notifyListeners(type, payload);
    }

    notifyListeners(type, payload) {
        const typeListeners = this.listeners.get(type);
        if (typeListeners) {
            typeListeners.forEach(callback => {
                try {
                    callback(payload);
                } catch (error) {
                    console.error(`Error in listener for ${type}:`, error);
                }
            });
        }
    }

    subscribe(eventType, callback) {
        if (!this.listeners.has(eventType)) {
            this.listeners.set(eventType, new Set());
        }
        this.listeners.get(eventType).add(callback);

        // Return unsubscribe function
        return () => {
            const typeListeners = this.listeners.get(eventType);
            if (typeListeners) {
                typeListeners.delete(callback);
            }
        };
    }

    unsubscribe(eventType, callback) {
        const typeListeners = this.listeners.get(eventType);
        if (typeListeners) {
            typeListeners.delete(callback);
        }
    }

    send(data) {
        if (this.ws?.readyState === WebSocket.OPEN) {
            this.ws.send(JSON.stringify(data));
        } else {
            console.warn('WebSocket is not connected. Message not sent:', data);
        }
    }

    isConnected() {
        return this.ws?.readyState === WebSocket.OPEN;
    }
}

export default new WebSocketService();
