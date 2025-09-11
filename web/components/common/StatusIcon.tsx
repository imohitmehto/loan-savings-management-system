'use client';
import React from 'react';
import {
  CheckCircleIcon,
  ClockIcon,
  XCircleIcon,
} from '@heroicons/react/24/solid';

type StatusConfig = {
  icon: React.ElementType;
  color: string;
  label: string;
};

const STATUS_MAP: Record<string, StatusConfig> = {
  ACTIVE: {
    icon: CheckCircleIcon,
    color: 'text-green-500',
    label: 'Active',
  },
  INACTIVE: {
    icon: ClockIcon,
    color: 'text-yellow-400',
    label: 'Inactive',
  },
  PENDING: {
    icon: ClockIcon,
    color: 'text-yellow-500',
    label: 'Pending',
  },
  DEACTIVATED: {
    icon: XCircleIcon,
    color: 'text-grey-400',
    label: 'Deactivated',
  },
  CLOSED: {
    icon: XCircleIcon,
    color: 'text-red-500',
    label: 'Closed',
  },
  HOLD: {
    icon: ClockIcon,
    color: 'text-blue-500',
    label: 'Hold',
  },
  SUSPENDED: {
    icon: XCircleIcon,
    color: 'text-red-600',
    label: 'Suspended',
  },
};

interface StatusIconProps {
  status: string;
  configMap?: Record<string, StatusConfig>;
  className?: string;
}

export const statusTextColorMap: Record<string, string> = {
  ACTIVE: 'text-green-600',
  INACTIVE: 'text-yellow-600',
  PENDING: 'text-yellow-600',
  DEACTIVATED: 'text-red-400',
  CLOSED: 'text-gray-600',
  HOLD: 'text-blue-600',
  SUSPENDED: 'text-red-700',
};

export default function StatusIcon({
  status,
  configMap = STATUS_MAP,
  className = 'h-5 w-5',
}: StatusIconProps) {
  const config = configMap[status.toUpperCase()];

  if (!config) return null;

  const Icon = config.icon;

  return (
    <Icon
      className={`${className} ${config.color}`}
      title={config.label}
      aria-label={config.label}
    />
  );
}
