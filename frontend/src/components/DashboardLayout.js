import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { 
  HomeIcon,
  UserGroupIcon,
  AcademicCapIcon,
  BellIcon,
  ChartBarIcon,
  SignalIcon,
  UserPlusIcon,
  ArrowRightOnRectangleIcon,
  Cog6ToothIcon,
  DocumentTextIcon,
  CalendarIcon
} from '@heroicons/react/24/outline';
import { SparklesIcon } from '@heroicons/react/24/solid';

const DashboardLayout = ({ role, tabs, activeTab, onTabChange, children }) => {
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem('user') || '{}');
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [expanded, setExpanded] = useState(true);

  const handleLogout = () => {
    localStorage.clear();
    navigate('/login');
  };

  const roleLabel = { admin: 'Administrator', teacher: 'Teacher', student: 'Student' };
  const roleBg = { admin: 'from-red-600 to-pink-600', teacher: 'from-blue-600 to-cyan-600', student: 'from-green-600 to-emerald-600' };
  const roleIcon = { admin: SparklesIcon, teacher: AcademicCapIcon, student: UserGroupIcon };
  const RoleIcon = roleIcon[role];

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 flex">

      {/* Mobile overlay */}
      {sidebarOpen && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-md z-20 lg:hidden" onClick={() => setSidebarOpen(false)} />
      )}

      {/* Sidebar */}
      <aside className={`fixed top-0 left-0 h-screen bg-gradient-to-b from-slate-900 via-purple-900 to-slate-900 text-white z-30 flex flex-col shadow-2xl
        transform transition-all duration-300 ease-in-out
        ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'} lg:translate-x-0 lg:static lg:z-auto
        ${expanded ? 'w-80' : 'w-24'}`}>

        {/* School brand */}
        <div className="px-6 py-8 border-b border-white/10 backdrop-blur-sm">
          <Link to="/" className="flex items-center gap-4 group">
            <div className="relative">
              <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center font-black text-white rounded-2xl flex-shrink-0 shadow-2xl group-hover:scale-110 transition-transform duration-300">
                A
              </div>
              <div className="absolute -top-1 -right-1 w-4 h-4 bg-green-400 rounded-full animate-pulse border-2 border-slate-900"></div>
            </div>
            <div className={`${expanded ? 'opacity-100' : 'opacity-0 w-0 overflow-hidden'} transition-all duration-300`}>
              <p className="font-black text-white text-xl leading-none bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text">Akilli School</p>
              <p className="text-gray-400 text-sm mt-2">{roleLabel[role]} Portal</p>
            </div>
          </Link>
        </div>

        {/* User info */}
        <div className="px-6 py-6 border-b border-white/10 backdrop-blur-sm">
          <div className="flex items-center gap-4">
            <div className="relative">
              <div className={`w-14 h-14 bg-gradient-to-br ${roleBg[role]} flex items-center justify-center font-bold text-white rounded-2xl flex-shrink-0 shadow-2xl`}>
                {user.full_name?.[0]?.toUpperCase()}
              </div>
              <div className="absolute -bottom-1 -right-1 w-5 h-5 bg-green-400 rounded-full border-2 border-slate-900 animate-pulse"></div>
            </div>
            <div className={`min-w-0 ${expanded ? 'opacity-100' : 'opacity-0 w-0 overflow-hidden'} transition-all duration-300`}>
              <p className="text-white text-base font-semibold truncate">{user.full_name}</p>
              <p className="text-gray-400 text-sm mt-1">{roleLabel[role]}</p>
              <div className="flex items-center gap-2 mt-2">
                <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                <span className="text-xs text-green-400">Active</span>
              </div>
            </div>
          </div>
        </div>

        {/* Navigation */}
        <nav className="flex-1 px-6 py-8 space-y-3 overflow-y-auto">
          {tabs.map(t => {
            const Icon = t.icon;
            const isActive = activeTab === t.key;
            return (
              <button key={t.key}
                onClick={() => { onTabChange(t.key); setSidebarOpen(false); }}
                className={`w-full group relative flex items-center gap-4 px-5 py-4 text-sm font-medium transition-all duration-300 rounded-2xl overflow-hidden
                  ${isActive
                    ? 'bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-2xl shadow-blue-500/25 scale-105'
                    : 'text-gray-400 hover:bg-white/10 hover:text-white hover:scale-105'}`}>
                {/* Background effect */}
                <div className={`absolute inset-0 bg-gradient-to-r from-blue-600/20 to-purple-600/20 rounded-2xl transition-opacity duration-300 ${isActive ? 'opacity-100' : 'opacity-0 group-hover:opacity-100'}`}></div>
                
                {/* Icon */}
                <div className={`relative z-10 ${isActive ? 'text-white' : 'text-gray-400 group-hover:text-white'} transition-colors duration-300`}>
                  <Icon className="w-7 h-7" />
                </div>
                
                {/* Label */}
                <span className={`flex-1 text-left z-10 font-semibold ${expanded ? 'opacity-100' : 'opacity-0 w-0 overflow-hidden'} transition-all duration-300`}>
                  {t.label}
                </span>
                
                {/* Badge */}
                {t.badge !== undefined && (
                  <span className={`z-10 px-3 py-1.5 text-xs font-bold rounded-full transition-all duration-300 ${
                    isActive 
                      ? 'bg-white text-blue-700 shadow-2xl' 
                      : 'bg-gradient-to-r from-blue-500 to-purple-500 text-white shadow-lg'
                  } ${expanded ? 'opacity-100 scale-100' : 'opacity-0 scale-75'}`}>
                    {t.badge}
                  </span>
                )}
                
                {/* Active indicator */}
                {isActive && (
                  <div className="absolute right-3 top-1/2 -translate-y-1/2 w-1.5 h-10 bg-white rounded-full shadow-2xl z-10"></div>
                )}
              </button>
            );
          })}
        </nav>

        {/* Bottom actions */}
        <div className="px-6 py-6 border-t border-white/10 backdrop-blur-sm space-y-3 mt-auto">
          {/* Expand/Collapse button */}
          <button 
            onClick={() => setExpanded(!expanded)}
            className="w-full flex items-center justify-center gap-3 px-5 py-4 text-sm text-gray-400 hover:text-white hover:bg-white/10 transition-all duration-300 rounded-2xl group"
          >
            <div className={`transform transition-transform duration-300 ${expanded ? 'rotate-180' : ''}`}>
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </div>
            {expanded && <span className="text-sm font-medium">Collapse</span>}
          </button>
          
          {/* Logout */}
          <button onClick={handleLogout}
            className="w-full flex items-center gap-3 px-5 py-4 text-sm text-gray-400 hover:bg-red-500/20 hover:text-red-400 transition-all duration-300 rounded-2xl group">
            <ArrowRightOnRectangleIcon className="w-6 h-6" />
            <span className={`${expanded ? 'opacity-100' : 'opacity-0 w-0 overflow-hidden'} transition-all duration-300 font-medium`}>Sign Out</span>
          </button>
        </div>
      </aside>

      {/* Main */}
      <div className="flex-1 flex flex-col min-w-0">

        {/* Top bar */}
        <header className="bg-white/90 backdrop-blur-lg border-b border-gray-200/50 h-20 flex items-center justify-between px-6 sm:px-8 lg:px-12 sticky top-0 z-10 shadow-lg">
          <div className="flex items-center gap-6">
            <button onClick={() => setSidebarOpen(true)}
              className="lg:hidden p-3 rounded-2xl hover:bg-gray-100 transition-all duration-300 group">
              <svg className="w-7 h-7 text-gray-600 group-hover:text-gray-900" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>
            <div>
              <p className="font-bold text-gray-900 text-xl bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text">{tabs.find(t => t.key === activeTab)?.label}</p>
              <p className="text-gray-500 text-base hidden sm:block">
                {new Date().toLocaleDateString('en-KE', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-4">
            {/* Quick actions */}
            <div className="hidden sm:flex items-center gap-3">
              <button className="p-3 rounded-2xl hover:bg-gray-100 transition-all duration-300 group relative">
                <BellIcon className="w-6 h-6 text-gray-600 group-hover:text-gray-900" />
                <div className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full border-2 border-white"></div>
              </button>
              <button className="p-3 rounded-2xl hover:bg-gray-100 transition-all duration-300 group">
                <Cog6ToothIcon className="w-6 h-6 text-gray-600 group-hover:text-gray-900" />
              </button>
            </div>
            
            {/* User info */}
            <div className="flex items-center gap-4">
              <span className="hidden sm:block text-base font-medium text-gray-700">{user.full_name}</span>
              <div className="relative">
                <div className={`w-12 h-12 bg-gradient-to-br ${roleBg[role]} flex items-center justify-center text-white font-bold rounded-2xl shadow-2xl`}>
                  {user.full_name?.[0]?.toUpperCase()}
                </div>
                <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-green-400 rounded-full border-2 border-white animate-pulse"></div>
              </div>
            </div>
          </div>
        </header>

        {/* Content */}
        <main className="flex-1 p-6 sm:p-8 lg:p-12 overflow-auto">
          <div className="max-w-full xl:max-w-8xl mx-auto">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
};

export default DashboardLayout;
