import React from 'react';
import { Spinner } from './LoadingSkeleton';

export const Button = ({ 
  children, 
  variant = 'primary', 
  size = 'md', 
  loading = false, 
  disabled = false, 
  icon: Icon, 
  iconPosition = 'left',
  className = '',
  ...props 
}) => {
  const variantClasses = {
    primary: 'bg-gradient-to-r from-blue-600 to-purple-600 text-white hover:from-blue-700 hover:to-purple-700 shadow-lg hover:shadow-xl',
    secondary: 'bg-gray-100 text-gray-700 hover:bg-gray-200 border border-gray-300',
    success: 'bg-gradient-to-r from-green-500 to-emerald-600 text-white hover:from-green-600 hover:to-emerald-700 shadow-lg hover:shadow-xl',
    warning: 'bg-gradient-to-r from-yellow-500 to-orange-600 text-white hover:from-yellow-600 hover:to-orange-700 shadow-lg hover:shadow-xl',
    danger: 'bg-gradient-to-r from-red-500 to-pink-600 text-white hover:from-red-600 hover:to-pink-700 shadow-lg hover:shadow-xl',
    outline: 'bg-transparent text-blue-600 border-2 border-blue-600 hover:bg-blue-50',
    ghost: 'bg-transparent text-gray-600 hover:bg-gray-100'
  };

  const sizeClasses = {
    sm: 'px-3 py-2 text-sm',
    md: 'px-4 py-3 text-base',
    lg: 'px-6 py-4 text-lg',
    xl: 'px-8 py-5 text-xl'
  };

  const classes = [
    'inline-flex items-center justify-center font-bold rounded-2xl transition-all duration-300 transform hover:scale-[1.02] disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none',
    variantClasses[variant],
    sizeClasses[size],
    className
  ].filter(Boolean).join(' ');

  const renderIcon = () => {
    if (!Icon) return null;
    return <Icon className="w-5 h-5" />;
  };

  const renderContent = () => {
    if (loading) {
      return (
        <>
          <Spinner size="sm" />
          <span className="ml-2">{children}</span>
        </>
      );
    }

    if (Icon && iconPosition === 'left') {
      return (
        <>
          {renderIcon()}
          <span className="ml-2">{children}</span>
        </>
      );
    }

    if (Icon && iconPosition === 'right') {
      return (
        <>
          <span className="mr-2">{children}</span>
          {renderIcon()}
        </>
      );
    }

    return children;
  };

  return (
    <button 
      className={classes} 
      disabled={disabled || loading} 
      {...props}
    >
      {renderContent()}
    </button>
  );
};

export const IconButton = ({ 
  children, 
  variant = 'ghost', 
  size = 'md', 
  className = '',
  ...props 
}) => {
  const sizeClasses = {
    sm: 'p-2',
    md: 'p-3',
    lg: 'p-4',
    xl: 'p-5'
  };

  const variantClasses = {
    primary: 'bg-blue-600 text-white hover:bg-blue-700',
    secondary: 'bg-gray-100 text-gray-700 hover:bg-gray-200',
    ghost: 'hover:bg-gray-100 text-gray-600',
    danger: 'hover:bg-red-100 text-red-600'
  };

  const classes = [
    'inline-flex items-center justify-center rounded-2xl transition-all duration-300 transform hover:scale-110',
    sizeClasses[size],
    variantClasses[variant],
    className
  ].filter(Boolean).join(' ');

  return (
    <button className={classes} {...props}>
      {children}
    </button>
  );
};

export default Button;
