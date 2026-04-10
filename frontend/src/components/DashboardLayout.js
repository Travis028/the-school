import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';

const DashboardLayout = ({ role, tabs, activeTab, onTabChange, children }) => {
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem('user') || '{}');
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const handleLogout = () => {
    localStorage.clear();
    navigate('/login');
  };

  const roleLabel = { admin: 'Administrator', teacher: 'Teacher', student: 'Student' };
  const roleBg = { admin: 'bg-red-700', teacher: 'bg-blue-800', student: 'bg-green-700' };

  return (
    <div className="min-h-screen bg-gray-100 flex">

      {/* Mobile overlay */}
      {sidebarOpen && (
        <div className="fixed inset-0 bg-black/40 z-20 lg:hidden" onClick={() => setSidebarOpen(false)} />
      )}

      {/* Sidebar */}
      <aside className={`fixed top-0 left-0 h-full w-60 bg-gray-900 text-white z-30 flex flex-col
        transform transition-transform duration-200
        ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'} lg:translate-x-0 lg:static lg:z-auto`}>

        {/* School brand */}
        <div className="px-5 py-5 border-b border-gray-800">
          <Link to="/" className="flex items-center gap-3">
            <div className="w-8 h-8 bg-blue-700 flex items-center justify-center font-black text-white text-sm flex-shrink-0">A</div>
            <div>
              <p className="font-black text-white text-sm leading-none">Akilli School</p>
              <p className="text-gray-500 text-xs mt-0.5">{roleLabel[role]} Portal</p>
            </div>
          </Link>
        </div>

        {/* User info */}
        <div className="px-5 py-4 border-b border-gray-800">
          <div className="flex items-center gap-3">
            <div className={`w-8 h-8 ${roleBg[role]} flex items-center justify-center font-bold text-white text-sm flex-shrink-0`}>
              {user.full_name?.[0]?.toUpperCase()}
            </div>
            <div className="min-w-0">
              <p className="text-white text-sm font-semibold truncate">{user.full_name}</p>
              <p className="text-gray-500 text-xs">{roleLabel[role]}</p>
            </div>
          </div>
        </div>

        {/* Navigation */}
        <nav className="flex-1 px-3 py-4 space-y-0.5 overflow-y-auto">
          {tabs.map(t => (
            <button key={t.key}
              onClick={() => { onTabChange(t.key); setSidebarOpen(false); }}
              className={`w-full flex items-center gap-3 px-3 py-2.5 text-sm font-medium transition text-left
                ${activeTab === t.key
                  ? 'bg-blue-700 text-white'
                  : 'text-gray-400 hover:bg-gray-800 hover:text-white'}`}>
              <span className="w-1.5 h-1.5 rounded-full flex-shrink-0"
                style={{ background: activeTab === t.key ? 'white' : 'transparent', border: activeTab === t.key ? 'none' : '1px solid #6b7280' }}>
              </span>
              {t.label}
            </button>
          ))}
        </nav>

        {/* Logout */}
        <div className="px-3 py-4 border-t border-gray-800">
          <button onClick={handleLogout}
            className="w-full flex items-center gap-3 px-3 py-2.5 text-sm text-gray-400 hover:bg-gray-800 hover:text-red-400 transition text-left">
            <span className="w-1.5 h-1.5 rounded-full border border-gray-600 flex-shrink-0"></span>
            Sign Out
          </button>
        </div>
      </aside>

      {/* Main */}
      <div className="flex-1 flex flex-col min-w-0">

        {/* Top bar */}
        <header className="bg-white border-b border-gray-200 h-14 flex items-center justify-between px-4 sm:px-6 sticky top-0 z-10">
          <div className="flex items-center gap-4">
            <button onClick={() => setSidebarOpen(true)}
              className="lg:hidden p-1.5 rounded hover:bg-gray-100 transition">
              <svg className="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>
            <div>
              <p className="font-bold text-gray-900 text-sm">{tabs.find(t => t.key === activeTab)?.label}</p>
              <p className="text-gray-400 text-xs hidden sm:block">
                {new Date().toLocaleDateString('en-KE', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <span className="hidden sm:block text-sm text-gray-600">{user.full_name}</span>
            <button onClick={handleLogout}
              className="text-xs text-red-600 border border-red-200 px-3 py-1.5 hover:bg-red-50 transition font-medium">
              Sign Out
            </button>
          </div>
        </header>

        {/* Content */}
        <main className="flex-1 p-4 sm:p-6 overflow-auto">
          {children}
        </main>
      </div>
    </div>
  );
};

export default DashboardLayout;
