import React from 'react';

export const ResponsiveGrid = ({ children, cols = { sm: 1, md: 2, lg: 3, xl: 4 }, gap = 6, className = '' }) => {
  const gridClasses = [
    'grid',
    `gap-${gap}`,
    `grid-cols-${cols.sm || 1}`,
    `sm:grid-cols-${cols.md || cols.sm || 1}`,
    `md:grid-cols-${cols.lg || cols.md || cols.sm || 1}`,
    `lg:grid-cols-${cols.xl || cols.lg || cols.md || cols.sm || 1}`,
    className
  ].filter(Boolean).join(' ');

  return <div className={gridClasses}>{children}</div>;
};

export const Card = ({ children, className = '', hover = true, shadow = 'xl' }) => {
  const baseClasses = 'bg-white/90 backdrop-blur-md rounded-3xl border border-gray-200/50';
  const shadowClasses = shadow ? `shadow-${shadow}` : '';
  const hoverClasses = hover ? 'hover:shadow-2xl hover:scale-[1.02] transition-all duration-300' : '';
  
  return (
    <div className={`${baseClasses} ${shadowClasses} ${hoverClasses} ${className}`}>
      {children}
    </div>
  );
};

export const GradientCard = ({ children, gradient = 'from-blue-50 to-purple-50', className = '' }) => {
  return (
    <div className={`bg-gradient-to-br ${gradient} rounded-3xl shadow-xl border-2 border-white/50 backdrop-blur-md ${className}`}>
      {children}
    </div>
  );
};

export const StatCard = ({ 
  title, 
  value, 
  subtitle, 
  icon: Icon, 
  color = 'blue',
  badge,
  trend,
  className = '' 
}) => {
  const colorClasses = {
    blue: 'from-blue-50 to-indigo-50 border-blue-200',
    green: 'from-green-50 to-emerald-50 border-green-200',
    purple: 'from-purple-50 to-pink-50 border-purple-200',
    yellow: 'from-yellow-50 to-orange-50 border-yellow-200',
    red: 'from-red-50 to-pink-50 border-red-200'
  };

  const iconColorClasses = {
    blue: 'from-blue-500 to-indigo-600',
    green: 'from-green-500 to-emerald-600',
    purple: 'from-purple-500 to-pink-600',
    yellow: 'from-yellow-500 to-orange-600',
    red: 'from-red-500 to-pink-600'
  };

  return (
    <div className={`bg-gradient-to-br ${colorClasses[color]} p-6 rounded-3xl shadow-xl border-2 hover:shadow-2xl transition-all duration-300 group ${className}`}>
      <div className="flex items-center justify-between mb-4">
        {Icon && (
          <div className={`w-12 h-12 bg-gradient-to-br ${iconColorClasses[color]} rounded-2xl flex items-center justify-center text-white shadow-lg group-hover:scale-110 transition-transform duration-300`}>
            <Icon className="w-6 h-6" />
          </div>
        )}
        {badge && (
          <span className="text-xs font-bold px-3 py-1 rounded-full bg-white/80 text-gray-700 shadow-md">
            {badge}
          </span>
        )}
      </div>
      <div className="mb-2">
        <p className="text-3xl font-bold text-gray-900">{value}</p>
        {trend && (
          <div className={`flex items-center gap-1 text-sm ${trend > 0 ? 'text-green-600' : 'text-red-600'}`}>
            {trend > 0 ? 'Trending up' : 'Trending down'}
          </div>
        )}
      </div>
      <p className="text-gray-600 text-sm font-medium">{title}</p>
      {subtitle && <p className="text-gray-500 text-xs mt-1">{subtitle}</p>}
    </div>
  );
};

export const LoadingState = ({ message = 'Loading...' }) => (
  <div className="flex items-center justify-center py-12">
    <div className="text-center">
      <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-2xl flex items-center justify-center text-white shadow-lg mx-auto mb-4">
        <svg className="animate-spin w-6 h-6" fill="none" viewBox="0 0 24 24">
          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
        </svg>
      </div>
      <p className="text-gray-600 font-medium">{message}</p>
    </div>
  </div>
);

export default ResponsiveGrid;
