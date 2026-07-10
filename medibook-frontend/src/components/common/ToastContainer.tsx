import React from 'react';
import { CheckCircle, XCircle, AlertTriangle, Info, X } from 'lucide-react';
import { useToast } from '../../context/ToastContext';

const icons = {
  success: <CheckCircle size={18} />,
  error: <XCircle size={18} />,
  warning: <AlertTriangle size={18} />,
  info: <Info size={18} />,
};

export const ToastContainer = () => {
  const { toasts, removeToast } = useToast();

  return (
    <div className="toast-container">
      {toasts.map((toast) => (
        <div key={toast.id} className={`toast toast--${toast.type}`}>
          <span className="toast__icon">{icons[toast.type]}</span>
          <span className="toast__message">{toast.message}</span>
          <button className="toast__close" onClick={() => removeToast(toast.id)}>
            <X size={16} />
          </button>
        </div>
      ))}
    </div>
  );
};
