/**
 * Sistema de Notificaciones Toast
 * Vértice Gastronómico
 *
 * Notificaciones elegantes con animaciones
 */

import React, { useState, useEffect, createContext, useContext, useCallback } from 'react';

const ToastContext = createContext(null);

const ICONS = {
  success: (
    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
    </svg>
  ),
  error: (
    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" />
    </svg>
  ),
  warning: (
    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
    </svg>
  ),
  info: (
    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
    </svg>
  ),
  loading: (
    <svg className="w-5 h-5 animate-spin" fill="none" viewBox="0 0 24 24">
      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
    </svg>
  )
};

const STYLES = {
  success: {
    bg: 'bg-emerald-600',
    icon: 'text-emerald-100',
    text: 'text-white',
    border: 'border-emerald-500'
  },
  error: {
    bg: 'bg-red-600',
    icon: 'text-red-100',
    text: 'text-white',
    border: 'border-red-500'
  },
  warning: {
    bg: 'bg-yellow-500',
    icon: 'text-yellow-100',
    text: 'text-white',
    border: 'border-yellow-400'
  },
  info: {
    bg: 'bg-blue-600',
    icon: 'text-blue-100',
    text: 'text-white',
    border: 'border-blue-500'
  },
  loading: {
    bg: 'bg-gray-700',
    icon: 'text-gray-300',
    text: 'text-white',
    border: 'border-gray-600'
  }
};

function ToastItem({ toast, onDismiss }) {
  const [isVisible, setIsVisible] = useState(false);
  const [isLeaving, setIsLeaving] = useState(false);
  const style = STYLES[toast.type] || STYLES.info;

  useEffect(() => {
    // Animate in
    requestAnimationFrame(() => {
      setIsVisible(true);
    });

    // Auto dismiss
    if (toast.duration && toast.duration > 0) {
      const timer = setTimeout(() => {
        handleDismiss();
      }, toast.duration);
      return () => clearTimeout(timer);
    }
  }, [toast.duration]);

  const handleDismiss = () => {
    setIsLeaving(true);
    setTimeout(() => {
      onDismiss(toast.id);
    }, 200);
  };

  return (
    <div
      className={`
        transform transition-all duration-200 ease-out
        ${isVisible && !isLeaving ? 'translate-x-0 opacity-100' : 'translate-x-full opacity-0'}
      `}
    >
      <div
        className={`
          flex items-start gap-3 p-4 rounded-lg shadow-lg border
          ${style.bg} ${style.border}
          min-w-[320px] max-w-md
        `}
      >
        <span className={style.icon}>
          {ICONS[toast.type] || ICONS.info}
        </span>
        <div className="flex-1 min-w-0">
          {toast.title && (
            <p className={`font-semibold ${style.text}`}>{toast.title}</p>
          )}
          <p className={`text-sm ${style.text} ${toast.title ? 'mt-0.5 opacity-90' : ''}`}>
            {toast.message}
          </p>
          {toast.action && (
            <button
              onClick={() => {
                toast.action.onClick();
                handleDismiss();
              }}
              className="mt-2 text-sm font-medium underline hover:no-underline"
            >
              {toast.action.label}
            </button>
          )}
        </div>
        {!toast.persistent && (
          <button
            onClick={handleDismiss}
            className={`${style.icon} hover:opacity-70 transition-opacity`}
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        )}
      </div>
    </div>
  );
}

export function ToastContainer({ toasts, onDismiss }) {
  return (
    <div className="fixed top-4 right-4 z-[200] flex flex-col gap-2">
      {toasts.map((toast) => (
        <ToastItem key={toast.id} toast={toast} onDismiss={onDismiss} />
      ))}
    </div>
  );
}

export function ToastProvider({ children }) {
  const [toasts, setToasts] = useState([]);

  const addToast = useCallback((options) => {
    const id = Date.now() + Math.random();
    const toast = {
      id,
      type: 'info',
      duration: 5000,
      ...options
    };
    setToasts((prev) => [...prev, toast]);
    return id;
  }, []);

  const removeToast = useCallback((id) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  const updateToast = useCallback((id, options) => {
    setToasts((prev) =>
      prev.map((t) => (t.id === id ? { ...t, ...options } : t))
    );
  }, []);

  // Convenience methods
  const success = useCallback((message, options = {}) => {
    return addToast({ type: 'success', message, ...options });
  }, [addToast]);

  const error = useCallback((message, options = {}) => {
    return addToast({ type: 'error', message, duration: 8000, ...options });
  }, [addToast]);

  const warning = useCallback((message, options = {}) => {
    return addToast({ type: 'warning', message, ...options });
  }, [addToast]);

  const info = useCallback((message, options = {}) => {
    return addToast({ type: 'info', message, ...options });
  }, [addToast]);

  const loading = useCallback((message, options = {}) => {
    return addToast({ type: 'loading', message, duration: 0, persistent: true, ...options });
  }, [addToast]);

  const promise = useCallback(async (promiseFn, { loading: loadingMsg, success: successMsg, error: errorMsg }) => {
    const id = addToast({ type: 'loading', message: loadingMsg, duration: 0, persistent: true });
    try {
      const result = await promiseFn();
      updateToast(id, { type: 'success', message: successMsg, duration: 5000, persistent: false });
      return result;
    } catch (err) {
      updateToast(id, { type: 'error', message: errorMsg || err.message, duration: 8000, persistent: false });
      throw err;
    }
  }, [addToast, updateToast]);

  const value = {
    toasts,
    addToast,
    removeToast,
    updateToast,
    success,
    error,
    warning,
    info,
    loading,
    promise
  };

  return (
    <ToastContext.Provider value={value}>
      {children}
      <ToastContainer toasts={toasts} onDismiss={removeToast} />
    </ToastContext.Provider>
  );
}

export function useToast() {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error('useToast must be used within a ToastProvider');
  }
  return context;
}

export default ToastProvider;
