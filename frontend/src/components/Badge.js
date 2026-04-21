import React from 'react';

export const Badge = ({ 
  children, 
  variant = 'primary', 
  size = 'md', 
  className = '',
  ...props 
}) => {
  const variantClasses = {
    primary: 'bg-gradient-to-r from-blue-500 to-purple-600 text-white',
    secondary: 'bg-gray-100 text-gray-700',
    success: 'bg-gradient-to-r from-green-500 to-emerald-600 text-white',
    warning: 'bg-gradient-to-r from-yellow-500 to-orange-600 text-white',
    danger: 'bg-gradient-to-r from-red-500 to-pink-600 text-white',
    info: 'bg-gradient-to-r from-cyan-500 to-blue-600 text-white'
  };

  const sizeClasses = {
    sm: 'px-2 py-1 text-xs',
    md: 'px-3 py-1.5 text-sm',
    lg: 'px-4 py-2 text-base'
  };

  const classes = [
    'inline-flex items-center justify-center font-bold rounded-full shadow-md',
    variantClasses[variant],
    sizeClasses[size],
    className
  ].filter(Boolean).join(' ');

  return (
    <span className={classes} {...props}>
      {children}
    </span>
  );
};

export const StatusBadge = ({ status, children, className = '' }) => {
  const statusConfig = {
    active: { variant: 'success', icon: '·' },
    inactive: { variant: 'secondary', icon: '·' },
    pending: { variant: 'warning', icon: '·' },
    error: { variant: 'danger', icon: '·' },
    new: { variant: 'info', icon: '·' }
  };

  const config = statusConfig[status] || statusConfig.pending;

  return (
    <Badge variant={config.variant} size="sm" className={className}>
      <span className="mr-1">{config.icon}</span>
      {children || status}
    </Badge>
  );
};

export const CountBadge = ({ count, max = 99, showZero = false, className = '' }) => {
  if (!showZero && count === 0) return null;
  
  const displayCount = count > max ? `${max}+` : count;
  
  return (
    <Badge variant="danger" size="sm" className="min-w-[20px] h-5 flex items-center justify-center">
      {displayCount}
    </Badge>
  );
};

export default Badge;
