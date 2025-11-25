import React from 'react';
import { Toaster, toast as hotToast } from 'react-hot-toast';

// Custom toast wrapper with predefined styles
export const toast = {
    success: (message, options = {}) => {
        return hotToast.success(message, {
            duration: 3000,
            position: 'top-right',
            style: {
                background: '#10b981',
                color: '#fff',
                borderRadius: '12px',
                padding: '16px',
                fontSize: '14px',
                fontWeight: '500',
                boxShadow: '0 10px 25px rgba(16, 185, 129, 0.3)',
            },
            iconTheme: {
                primary: '#fff',
                secondary: '#10b981',
            },
            ...options,
        });
    },

    error: (message, options = {}) => {
        return hotToast.error(message, {
            duration: 4000,
            position: 'top-right',
            style: {
                background: '#ef4444',
                color: '#fff',
                borderRadius: '12px',
                padding: '16px',
                fontSize: '14px',
                fontWeight: '500',
                boxShadow: '0 10px 25px rgba(239, 68, 68, 0.3)',
            },
            iconTheme: {
                primary: '#fff',
                secondary: '#ef4444',
            },
            ...options,
        });
    },

    info: (message, options = {}) => {
        return hotToast(message, {
            duration: 3000,
            position: 'top-right',
            icon: 'ℹ️',
            style: {
                background: '#3b82f6',
                color: '#fff',
                borderRadius: '12px',
                padding: '16px',
                fontSize: '14px',
                fontWeight: '500',
                boxShadow: '0 10px 25px rgba(59, 130, 246, 0.3)',
            },
            ...options,
        });
    },

    warning: (message, options = {}) => {
        return hotToast(message, {
            duration: 3500,
            position: 'top-right',
            icon: '⚠️',
            style: {
                background: '#f59e0b',
                color: '#fff',
                borderRadius: '12px',
                padding: '16px',
                fontSize: '14px',
                fontWeight: '500',
                boxShadow: '0 10px 25px rgba(245, 158, 11, 0.3)',
            },
            ...options,
        });
    },

    loading: (message, options = {}) => {
        return hotToast.loading(message, {
            position: 'top-right',
            style: {
                background: '#6b7280',
                color: '#fff',
                borderRadius: '12px',
                padding: '16px',
                fontSize: '14px',
                fontWeight: '500',
                boxShadow: '0 10px 25px rgba(107, 114, 128, 0.3)',
            },
            ...options,
        });
    },

    promise: (promise, messages, options = {}) => {
        return hotToast.promise(
            promise,
            {
                loading: messages.loading || 'Loading...',
                success: messages.success || 'Success!',
                error: messages.error || 'Error occurred',
            },
            {
                position: 'top-right',
                style: {
                    borderRadius: '12px',
                    padding: '16px',
                    fontSize: '14px',
                    fontWeight: '500',
                },
                ...options,
            }
        );
    },

    dismiss: (toastId) => {
        hotToast.dismiss(toastId);
    },

    remove: (toastId) => {
        hotToast.remove(toastId);
    },
};

// Toast container component
const ToastContainer = () => {
    return (
        <Toaster
            position="top-right"
            reverseOrder={false}
            gutter={8}
            toastOptions={{
                duration: 3000,
                style: {
                    borderRadius: '12px',
                    fontSize: '14px',
                },
            }}
        />
    );
};

export default ToastContainer;
