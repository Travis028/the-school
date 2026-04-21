// Color scheme constants for consistent theming
export const COLORS = {
  primary: {
    50: '#eff6ff',
    100: '#dbeafe',
    500: '#3b82f6',
    600: '#2563eb',
    700: '#1d4ed8',
    900: '#1e3a8a'
  },
  secondary: {
    50: '#f8fafc',
    100: '#f1f5f9',
    500: '#64748b',
    600: '#475569',
    700: '#334155',
    900: '#0f172a'
  },
  success: {
    50: '#f0fdf4',
    100: '#dcfce7',
    500: '#22c55e',
    600: '#16a34a',
    700: '#15803d',
    900: '#14532d'
  },
  warning: {
    50: '#fffbeb',
    100: '#fef3c7',
    500: '#eab308',
    600: '#ca8a04',
    700: '#a16207',
    900: '#713f12'
  },
  danger: {
    50: '#fef2f2',
    100: '#fee2e2',
    500: '#ef4444',
    600: '#dc2626',
    700: '#b91c1c',
    900: '#7f1d1d'
  },
  purple: {
    50: '#faf5ff',
    100: '#f3e8ff',
    500: '#a855f7',
    600: '#9333ea',
    700: '#7c3aed',
    900: '#581c87'
  }
};

// Gradient combinations for consistent styling
export const GRADIENTS = {
  primary: 'from-blue-600 to-purple-600',
  success: 'from-green-500 to-emerald-600',
  warning: 'from-yellow-500 to-orange-600',
  danger: 'from-red-500 to-pink-600',
  info: 'from-cyan-500 to-blue-600',
  dark: 'from-gray-900 to-slate-900',
  light: 'from-gray-50 to-blue-50'
};

// Role-based color schemes
export const ROLE_COLORS = {
  admin: {
    primary: 'from-red-600 to-pink-600',
    secondary: 'from-red-50 to-pink-50',
    badge: 'bg-red-100 text-red-700'
  },
  teacher: {
    primary: 'from-blue-600 to-cyan-600',
    secondary: 'from-blue-50 to-cyan-50',
    badge: 'bg-blue-100 text-blue-700'
  },
  student: {
    primary: 'from-green-600 to-emerald-600',
    secondary: 'from-green-50 to-emerald-50',
    badge: 'bg-green-100 text-green-700'
  }
};

// Breakpoint constants for responsive design
export const BREAKPOINTS = {
  sm: '640px',
  md: '768px',
  lg: '1024px',
  xl: '1280px',
  '2xl': '1536px'
};

// Animation durations
export const ANIMATIONS = {
  fast: '150ms',
  normal: '300ms',
  slow: '500ms',
  slower: '1000ms'
};

// Common spacing values
export const SPACING = {
  xs: '0.25rem',
  sm: '0.5rem',
  md: '1rem',
  lg: '1.5rem',
  xl: '2rem',
  '2xl': '3rem',
  '3xl': '4rem'
};

// Border radius values
export const BORDER_RADIUS = {
  sm: '0.25rem',
  md: '0.375rem',
  lg: '0.5rem',
  xl: '0.75rem',
  '2xl': '1rem',
  '3xl': '1.5rem',
  full: '9999px'
};

// Shadow values
export const SHADOWS = {
  sm: '0 1px 2px 0 rgba(0, 0, 0, 0.05)',
  md: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
  lg: '0 10px 15px -3px rgba(0, 0, 0, 0.1)',
  xl: '0 20px 25px -5px rgba(0, 0, 0, 0.1)',
  '2xl': '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
  inner: 'inset 0 2px 4px 0 rgba(0, 0, 0, 0.06)'
};

// API endpoints
export const API_ENDPOINTS = {
  auth: {
    login: '/api/auth/login',
    register: '/api/auth/register',
    me: '/api/auth/me',
    onlineUsers: '/api/auth/online-users'
  },
  students: {
    list: '/api/students/',
    me: '/api/students/me',
    grades: '/api/grades/me',
    attendance: '/api/attendance/me'
  },
  teachers: {
    list: '/api/teachers/',
    grades: '/api/grades/',
    attendance: '/api/attendance/'
  },
  admin: {
    users: '/api/admin/users',
    stats: '/api/admin/stats',
    notices: '/api/notices/'
  }
};

// Error messages
export const ERROR_MESSAGES = {
  network: 'Network error. Please check your connection.',
  unauthorized: 'You are not authorized to perform this action.',
  forbidden: 'You do not have permission to access this resource.',
  notFound: 'The requested resource was not found.',
  serverError: 'Server error. Please try again later.',
  validation: 'Please check your input and try again.',
  unknown: 'An unexpected error occurred.'
};

// Success messages
export const SUCCESS_MESSAGES = {
  login: 'Login successful!',
  logout: 'Logged out successfully.',
  register: 'Account created successfully!',
  save: 'Changes saved successfully.',
  delete: 'Item deleted successfully.',
  update: 'Item updated successfully.'
};
