import React, { useState, useEffect } from 'react';
import axios from 'axios';
import toast from 'react-hot-toast';
import DashboardLayout from './DashboardLayout';
import { 
  UserGroupIcon, 
  AcademicCapIcon, 
  BellIcon, 
  ChartBarIcon,
  ClockIcon,
  SignalIcon,
  UserCircleIcon,
  ArrowTrendingUpIcon,
  CalendarIcon,
  DocumentTextIcon,
  UserPlusIcon,
  TrashIcon,
  EyeIcon,
  SparklesIcon
} from '@heroicons/react/24/outline';

const api = (token) => axios.create({
  baseURL: 'http://localhost:8000',
  headers: { Authorization: `Bearer ${token}` },
});

const AdminDashboard = () => {
  const token = localStorage.getItem('token');
  const user = JSON.parse(localStorage.getItem('user') || '{}');
  const [tab, setTab] = useState('dashboard');
  const [users, setUsers] = useState([]);
  const [notices, setNotices] = useState([]);
  const [students, setStudents] = useState([]);
  const [onlineUsers, setOnlineUsers] = useState([]);
  const [stats, setStats] = useState({ 
    total_students: 0, 
    total_teachers: 0, 
    total_notices: 0, 
    total_grades: 0, 
    total_attendance: 0, 
    total_users: 0 
  });
  const [noticeForm, setNoticeForm] = useState({ title: '', content: '', target_role: '' });
  const [registerForm, setRegisterForm] = useState({ email: '', username: '', full_name: '', password: '', role: 'student' });
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => { 
    fetchAll(); 
    // Set up real-time updates for online users
    const interval = setInterval(fetchOnlineUsers, 30000); // Update every 30 seconds
    return () => clearInterval(interval);
  }, []);

  const fetchAll = async () => {
    setLoading(true);
    try {
      const [u, n, s, st] = await Promise.all([
        api(token).get('/api/admin/users'),
        api(token).get('/api/notices/'),
        api(token).get('/api/students/'),
        api(token).get('/api/admin/stats'),
      ]);
      setUsers(u.data); 
      setNotices(n.data); 
      setStudents(s.data); 
      setStats(st.data);
      fetchOnlineUsers();
    } catch { 
      toast.error('Failed to load data'); 
    } finally {
      setLoading(false);
    }
  };

  const fetchOnlineUsers = async () => {
    try {
      const response = await api(token).get('/api/auth/online-users');
      setOnlineUsers(response.data.online_users || []);
    } catch (error) {
      console.error('Failed to fetch online users:', error);
    }
  };

  const postNotice = async (e) => {
    e.preventDefault();
    try {
      await api(token).post('/api/notices/', noticeForm);
      toast.success('Notice posted successfully! 🎉');
      setNoticeForm({ title: '', content: '', target_role: '' });
      fetchAll();
    } catch { 
      toast.error('Failed to post notice'); 
    }
  };

  const deleteNotice = async (id) => {
    if (!window.confirm('Delete this notice?')) return;
    try { await api(token).delete(`/api/notices/${id}`); toast.success('Notice deleted'); fetchAll(); }
    catch { toast.error('Failed'); }
  };

  const registerUser = async (e) => {
    e.preventDefault();
    try {
      await axios.post('http://localhost:8000/api/auth/register', registerForm);
      toast.success('User registered successfully! 🎊');
      setRegisterForm({ email: '', username: '', full_name: '', password: '', role: 'student' });
      fetchAll();
    } catch (e) { 
      toast.error(e.response?.data?.detail || 'Failed'); 
    }
  };

  const deleteUser = async (id) => {
    if (!window.confirm('Delete this user?')) return;
    try { await api(token).delete(`/api/admin/users/${id}`); toast.success('User deleted'); fetchAll(); }
    catch { toast.error('Failed'); }
  };

  const tabs = [
    { key: 'dashboard', label: 'Dashboard', icon: ChartBarIcon },
    { key: 'online-users', label: 'Online Users', icon: SignalIcon, badge: onlineUsers.length },
    { key: 'users', label: 'Users', icon: UserGroupIcon },
    { key: 'students', label: 'Students', icon: AcademicCapIcon },
    { key: 'notices', label: 'Notices', icon: BellIcon },
    { key: 'register', label: 'Register User', icon: UserPlusIcon },
  ];

  const filteredUsers = users.filter(u =>
    u.full_name?.toLowerCase().includes(search.toLowerCase()) ||
    u.username?.toLowerCase().includes(search.toLowerCase()) ||
    u.email?.toLowerCase().includes(search.toLowerCase())
  );

  const roleBadge = (role) => {
    const map = { 
      admin: 'bg-gradient-to-r from-red-500 to-pink-500 text-white', 
      teacher: 'bg-gradient-to-r from-blue-500 to-cyan-500 text-white', 
      student: 'bg-gradient-to-r from-green-500 to-emerald-500 text-white' 
    };
    return (
      <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-bold ${map[role]} shadow-lg`}>
        {role === 'admin' && <SparklesIcon className="w-3 h-3 mr-1" />}
        {role === 'teacher' && <AcademicCapIcon className="w-3 h-3 mr-1" />}
        {role === 'student' && <UserCircleIcon className="w-3 h-3 mr-1" />}
        {role}
      </span>
    );
  };

  const StatCard = ({ icon: Icon, label, value, color, trend }) => (
    <div className={`${color} rounded-2xl p-6 shadow-xl transform hover:scale-105 transition-all duration-300 relative overflow-hidden`}>
      <div className="absolute top-0 right-0 w-32 h-32 bg-white opacity-10 rounded-full -mr-16 -mt-16"></div>
      <div className="relative">
        <Icon className="w-8 h-8 text-white mb-3" />
        <p className="text-3xl font-bold text-white">{value}</p>
        <p className="text-white/80 text-sm mt-1">{label}</p>
        {trend && (
          <div className="flex items-center mt-2 text-white/90 text-xs">
            <ArrowTrendingUpIcon className="w-3 h-3 mr-1" />
            {trend}
          </div>
        )}
      </div>
    </div>
  );

  const OnlineUserCard = ({ user }) => {
    const lastSeen = new Date(user.last_activity);
    const now = new Date();
    const diffMinutes = Math.floor((now - lastSeen) / 60000);
    
    return (
      <div className="bg-white rounded-xl p-4 shadow-lg hover:shadow-xl transition-all duration-300 border border-gray-100">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="relative">
              <div className="w-12 h-12 bg-gradient-to-br from-blue-400 to-purple-600 rounded-full flex items-center justify-center text-white font-bold">
                {user.full_name.charAt(0).toUpperCase()}
              </div>
              <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-green-500 rounded-full border-2 border-white animate-pulse"></div>
            </div>
            <div>
              <p className="font-bold text-gray-900">{user.full_name}</p>
              <p className="text-sm text-gray-500">@{user.username}</p>
              {roleBadge(user.role)}
            </div>
          </div>
          <div className="text-right">
            <div className="flex items-center text-green-600 text-sm">
              <SignalIcon className="w-4 h-4 mr-1" />
              Online
            </div>
            <div className="flex items-center text-gray-400 text-xs mt-1">
              <ClockIcon className="w-3 h-3 mr-1" />
              {user.online_duration.formatted}
            </div>
          </div>
        </div>
      </div>
    );
  };

  const field = (label, value, onChange, type = 'text', placeholder = '') => (
    <div>
      <label className="block text-sm font-bold text-gray-700 mb-2">{label}</label>
      <input 
        type={type} 
        value={value} 
        onChange={onChange} 
        placeholder={placeholder} 
        required
        className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200" 
      />
    </div>
  );

  const select = (label, value, onChange, options) => (
    <div>
      <label className="block text-sm font-bold text-gray-700 mb-2">{label}</label>
      <select 
        value={value} 
        onChange={onChange}
        className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
      >
        {options.map(o => <option key={o.value} value={o.value}>{o.label}</option>)}
      </select>
    </div>
  );

  return (
    <DashboardLayout role="admin" tabs={tabs} activeTab={tab} onTabChange={setTab}>

      {/* Dashboard */}
      {tab === 'dashboard' && (
        <div className="space-y-8">
          <div className="text-center">
            <h1 className="text-4xl font-bold text-gray-900 mb-2 bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              Admin Dashboard
            </h1>
            <p className="text-gray-600">Welcome back, {user.full_name}! Here's your school overview.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-6">
            <StatCard 
              icon={AcademicCapIcon} 
              label="Students" 
              value={stats.total_students} 
              color="bg-gradient-to-br from-blue-500 to-blue-600"
              trend="+12% this month"
            />
            <StatCard 
              icon={UserGroupIcon} 
              label="Teachers" 
              value={stats.total_teachers} 
              color="bg-gradient-to-br from-green-500 to-green-600"
              trend="+2 new"
            />
            <StatCard 
              icon={BellIcon} 
              label="Notices" 
              value={stats.total_notices} 
              color="bg-gradient-to-br from-yellow-500 to-orange-500"
            />
            <StatCard 
              icon={DocumentTextIcon} 
              label="Grades" 
              value={stats.total_grades} 
              color="bg-gradient-to-br from-purple-500 to-pink-500"
            />
            <StatCard 
              icon={CalendarIcon} 
              label="Attendance" 
              value={stats.total_attendance} 
              color="bg-gradient-to-br from-indigo-500 to-blue-500"
            />
            <StatCard 
              icon={UserGroupIcon} 
              label="Total Users" 
              value={stats.total_users} 
              color="bg-gradient-to-br from-gray-600 to-gray-700"
            />
          </div>

          <div className="grid lg:grid-cols-2 gap-8">
            <div className="bg-white rounded-2xl p-6 shadow-xl border border-gray-100">
              <div className="flex items-center justify-between mb-6">
                <h3 className="font-bold text-gray-900 text-lg flex items-center">
                  <BellIcon className="w-5 h-5 mr-2 text-yellow-500" />
                  Recent Notices
                </h3>
                <button 
                  onClick={() => setTab('notices')} 
                  className="text-blue-600 hover:text-blue-700 text-sm font-medium hover:underline transition-colors"
                >
                  View all
                </button>
              </div>
              <div className="space-y-3">
                {notices.slice(0, 4).map((n, i) => (
                  <div key={i} className="p-4 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors">
                    <p className="font-semibold text-gray-800">{n.title}</p>
                    <p className="text-gray-600 text-sm mt-1 line-clamp-2">{n.content}</p>
                  </div>
                ))}
                {notices.length === 0 && (
                  <p className="text-gray-400 text-center py-8">No notices yet.</p>
                )}
              </div>
            </div>

            <div className="bg-white rounded-2xl p-6 shadow-xl border border-gray-100">
              <div className="flex items-center justify-between mb-6">
                <h3 className="font-bold text-gray-900 text-lg flex items-center">
                  <SignalIcon className="w-5 h-5 mr-2 text-green-500" />
                  Online Now ({onlineUsers.length})
                </h3>
                <button 
                  onClick={() => setTab('online-users')} 
                  className="text-blue-600 hover:text-blue-700 text-sm font-medium hover:underline transition-colors"
                >
                  View all
                </button>
              </div>
              <div className="space-y-3">
                {onlineUsers.slice(0, 4).map((user, i) => (
                  <OnlineUserCard key={i} user={user} />
                ))}
                {onlineUsers.length === 0 && (
                  <p className="text-gray-400 text-center py-8">No users currently online.</p>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Online Users */}
      {tab === 'online-users' && (
        <div className="space-y-6">
          <div className="text-center">
            <h2 className="text-3xl font-bold text-gray-900 mb-2">Online Users</h2>
            <p className="text-gray-600">
              Real-time monitoring of active users • {onlineUsers.length} users currently online
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {onlineUsers.map((user, i) => (
              <OnlineUserCard key={i} user={user} />
            ))}
            {onlineUsers.length === 0 && (
              <div className="col-span-full text-center py-12">
                <SignalIcon className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                <p className="text-gray-500 text-lg">No users are currently online</p>
                <p className="text-gray-400 text-sm mt-2">Users will appear here when they log in and use the system</p>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Users */}
      {tab === 'users' && (
        <div className="space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h2 className="text-3xl font-bold text-gray-900">Users</h2>
              <p className="text-gray-600">{users.length} registered users</p>
            </div>
            <input 
              value={search} 
              onChange={e => setSearch(e.target.value)}
              placeholder="Search users..."
              className="px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 w-full sm:w-96"
            />
          </div>
          
          <div className="bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50 border-b border-gray-200">
                  <tr>
                    {['User', 'Contact', 'Role', 'Actions'].map((h, i) => (
                      <th key={i} className="px-6 py-4 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {filteredUsers.map((u, i) => (
                    <tr key={i} className="hover:bg-gray-50 transition-colors">
                      <td className="px-6 py-4">
                        <div className="flex items-center">
                          <div className="w-10 h-10 bg-gradient-to-br from-blue-400 to-purple-600 rounded-full flex items-center justify-center text-white font-bold mr-3">
                            {u.full_name.charAt(0).toUpperCase()}
                          </div>
                          <div>
                            <p className="font-medium text-gray-900">{u.full_name}</p>
                            <p className="text-gray-500 text-sm">@{u.username}</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-gray-500">{u.email}</td>
                      <td className="px-6 py-4">{roleBadge(u.role)}</td>
                      <td className="px-6 py-4">
                        {u.id !== user.id && (
                          <button 
                            onClick={() => deleteUser(u.id)} 
                            className="text-red-600 hover:text-red-700 text-sm font-medium hover:underline transition-colors flex items-center"
                          >
                            <TrashIcon className="w-4 h-4 mr-1" />
                            Delete
                          </button>
                        )}
                      </td>
                    </tr>
                  ))}
                  {filteredUsers.length === 0 && (
                    <tr>
                      <td colSpan={4} className="px-6 py-12 text-center text-gray-400">
                        No users found.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* Students */}
      {tab === 'students' && (
        <div className="space-y-6">
          <div>
            <h2 className="text-3xl font-bold text-gray-900">Students</h2>
            <p className="text-gray-600">{students.length} enrolled students</p>
          </div>
          
          <div className="bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50 border-b border-gray-200">
                  <tr>
                    {['Student ID', 'Name', 'Class', 'Parent', 'Contact'].map((h, i) => (
                      <th key={i} className="px-6 py-4 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {students.map((s, i) => (
                    <tr key={i} className="hover:bg-gray-50 transition-colors">
                      <td className="px-6 py-4">
                        <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-bold bg-blue-100 text-blue-800">
                          {s.student_id}
                        </span>
                      </td>
                      <td className="px-6 py-4 font-medium text-gray-900">{s.user?.full_name || '—'}</td>
                      <td className="px-6 py-4 text-gray-500">{s.class_name}</td>
                      <td className="px-6 py-4 text-gray-500">{s.parent_name}</td>
                      <td className="px-6 py-4 text-gray-500">{s.parent_phone}</td>
                    </tr>
                  ))}
                  {students.length === 0 && (
                    <tr>
                      <td colSpan={5} className="px-6 py-12 text-center text-gray-400">
                        No students found.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* Notices */}
      {tab === 'notices' && (
        <div className="space-y-8">
          <div className="bg-white rounded-2xl p-8 shadow-xl border border-gray-100">
            <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center">
              <BellIcon className="w-6 h-6 mr-3 text-yellow-500" />
              Post New Notice
            </h2>
            <form onSubmit={postNotice} className="space-y-6">
              {field('Title', noticeForm.title, e => setNoticeForm({ ...noticeForm, title: e.target.value }), 'text', 'e.g. School Closure Notice')}
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-2">Content</label>
                <textarea 
                  value={noticeForm.content} 
                  onChange={e => setNoticeForm({ ...noticeForm, content: e.target.value })}
                  placeholder="Write notice content here..." 
                  required 
                  rows={4}
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 resize-none" 
                />
              </div>
              {select('Target Audience', noticeForm.target_role, e => setNoticeForm({ ...noticeForm, target_role: e.target.value }), [
                { value: '', label: 'All Users' },
                { value: 'student', label: 'Students Only' },
                { value: 'teacher', label: 'Teachers Only' },
                { value: 'admin', label: 'Administrators Only' },
              ])}
              <button 
                type="submit" 
                className="w-full bg-gradient-to-r from-blue-600 to-purple-600 text-white py-4 text-sm font-bold rounded-xl hover:from-blue-700 hover:to-purple-700 transition-all duration-300 shadow-lg hover:shadow-xl"
              >
                Post Notice 📢
              </button>
            </form>
          </div>

          <div className="bg-white rounded-2xl p-8 shadow-xl border border-gray-100">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">All Notices ({notices.length})</h2>
            <div className="space-y-4">
              {notices.map((n, i) => (
                <div key={i} className="p-6 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <p className="font-bold text-gray-900 text-lg">{n.title}</p>
                      <p className="text-gray-600 mt-2">{n.content}</p>
                      <span className="inline-block mt-3 px-3 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                        {n.target_role || 'All Users'}
                      </span>
                    </div>
                    <button 
                      onClick={() => deleteNotice(n.id)} 
                      className="text-red-600 hover:text-red-700 font-medium hover:underline transition-colors ml-4"
                    >
                      <TrashIcon className="w-5 h-5" />
                    </button>
                  </div>
                </div>
              ))}
              {notices.length === 0 && (
                <p className="text-gray-400 text-center py-12">No notices yet.</p>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Register User */}
      {tab === 'register' && (
        <div className="max-w-2xl mx-auto">
          <div className="bg-white rounded-2xl p-8 shadow-xl border border-gray-100">
            <h2 className="text-2xl font-bold text-gray-900 mb-2 flex items-center">
              <UserPlusIcon className="w-6 h-6 mr-3 text-green-500" />
              Register New User
            </h2>
            <p className="text-gray-600 mb-8">Create a new student, teacher or administrator account.</p>
            <form onSubmit={registerUser} className="space-y-6">
              {field('Full Name', registerForm.full_name, e => setRegisterForm({ ...registerForm, full_name: e.target.value }), 'text', 'e.g. John Kamau')}
              <div className="grid grid-cols-2 gap-4">
                {field('Username', registerForm.username, e => setRegisterForm({ ...registerForm, username: e.target.value }), 'text', 'johnkamau')}
                {select('Role', registerForm.role, e => setRegisterForm({ ...registerForm, role: e.target.value }), [
                  { value: 'student', label: 'Student' },
                  { value: 'teacher', label: 'Teacher' },
                  { value: 'admin', label: 'Administrator' },
                ])}
              </div>
              {field('Email', registerForm.email, e => setRegisterForm({ ...registerForm, email: e.target.value }), 'email', 'john@email.com')}
              {field('Password', registerForm.password, e => setRegisterForm({ ...registerForm, password: e.target.value }), 'password', 'Minimum 6 characters')}
              <button 
                type="submit" 
                className="w-full bg-gradient-to-r from-green-600 to-emerald-600 text-white py-4 text-sm font-bold rounded-xl hover:from-green-700 hover:to-emerald-700 transition-all duration-300 shadow-lg hover:shadow-xl"
              >
                Register User ✨
              </button>
            </form>
          </div>
        </div>
      )}
    </DashboardLayout>
  );
};

export default AdminDashboard;
