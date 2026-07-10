import React from 'react';
import { Loader2 } from 'lucide-react';

interface LoadingSpinnerProps {
  size?: number;
  text?: string;
  fullPage?: boolean;
}

export const LoadingSpinner = ({ size = 32, text = 'Loading...', fullPage = false }: LoadingSpinnerProps) => {
  return (
    <div className={fullPage ? 'loading-full' : 'loading-inline'}>
      <Loader2 size={size} className="loading-spinner" />
      {text && <p className="loading-text">{text}</p>}
    </div>
  );
};

interface EmptyStateProps {
  icon?: React.ReactNode;
  title: string;
  description?: string;
  action?: React.ReactNode;
}

export const EmptyState = ({ icon, title, description, action }: EmptyStateProps) => {
  return (
    <div className="empty-state">
      {icon && <div className="empty-state__icon">{icon}</div>}
      <h3 className="empty-state__title">{title}</h3>
      {description && <p className="empty-state__description">{description}</p>}
      {action && <div className="empty-state__action">{action}</div>}
    </div>
  );
};

interface ErrorStateProps {
  message?: string;
  onRetry?: () => void;
}

export const ErrorState = ({ message = 'Something went wrong.', onRetry }: ErrorStateProps) => {
  return (
    <div className="empty-state empty-state--error">
      <div className="empty-state__icon">⚠️</div>
      <h3 className="empty-state__title">Unable to load data</h3>
      <p className="empty-state__description">{message}</p>
      {onRetry && (
        <button className="btn btn--outline btn--sm" onClick={onRetry}>
          Try Again
        </button>
      )}
    </div>
  );
};
