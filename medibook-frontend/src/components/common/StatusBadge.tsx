import React from 'react';
import type { BookingStatus, ServiceStatus } from '../../types';

type BadgeStatus = BookingStatus | ServiceStatus;

const statusConfig: Record<BadgeStatus, { label: string; className: string }> = {
  pending: { label: 'Pending', className: 'badge badge--warning' },
  confirmed: { label: 'Confirmed', className: 'badge badge--success' },
  cancelled: { label: 'Cancelled', className: 'badge badge--danger' },
  completed: { label: 'Completed', className: 'badge badge--primary' },
  active: { label: 'Active', className: 'badge badge--success' },
  inactive: { label: 'Inactive', className: 'badge badge--neutral' },
};

interface StatusBadgeProps {
  status: BadgeStatus;
}

export const StatusBadge = ({ status }: StatusBadgeProps) => {
  const config = statusConfig[status] ?? { label: status, className: 'badge badge--neutral' };
  return <span className={config.className}>{config.label}</span>;
};
