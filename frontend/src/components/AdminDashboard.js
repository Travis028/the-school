import React, { useState, useEffect } from 'react';
import axios from 'axios';
import toast from 'react-hot-toast';
import DashboardLayout from './DashboardLayout';

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
  const [stats, setStats] = useState({ total_students: 0, total_teachers: 0, total_notices: 0, total_grades: 0, total_attendance: 0, total_users: 0 });
  const [noticeForm, setNoticeForm] = useState({ title: '', content: '', target_role: '' });
  const [registerForm, setRegisterForm] = useState({ email: '', username: '', full_name: '', password: '', role: 'student' });
  const [search, setSearch] = useState('');

  useEffect(() => { fetchAll(); }, []);

  const fetchAll = async () => {
    try {
      const [u, n, s, st] = await Promise.all([
        api(token).get('/api/admin/users'),
        api(token).get('/api/notices/'),
        api(token).get('/api/students/'),
        api(token).get('/api/admin/stats'),
      ]);
      setUsers(u.data); setNotices(n.data); setStudents(s.data); setStats(st.data);
    } catch { toast.error('Failed to load data'); }
  };

  const postNotice = async (e) => {
    e.preventDefault();
    try {
      await api(token).post('/api/notices/', noticeForm);
      toast.success('Notice posted');
      setNoticeForm({ title: '', content: '', target_role: '' });
      fetchAll();
    } catch { toast.error('Failed to post notice'); }
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
      toast.success('User registered');
      setRegisterForm({ email: '', username: '', full_name: '', password: '', role: 'student' });
      fetchAll();
    } catch (e) { toast.error(e.response?.data?.detail || 'Failed'); }
  };

  const deleteUser = async (id) => {
    if (!window.confirm('Delete this user?')) return;
    try { await api(token).delete(`/api/admin/users/${id}`); toast.success('User deleted'); fetchAll(); }
    catch { toast.error('Failed'); }
  };

  const tabs = [
    { key: 'dashboard', label: 'Dashboard' },
    { key: 'users', label: 'Users' },
    { key: 'students', label: 'Students' },
    { key: 'notices', label: 'Notices' },
    { key: 'register', label: 'Register User' },
  ];

  const filteredUsers = users.filter(u =>
    u.full_name?.toLowerCase().includes(search.toLowerCase()) ||
    u.username?.toLowerCase().includes(search.toLowerCase()) ||
    u.email?.toLowerCase().includes(search.toLowerCase())
  );

  const roleBadge = (role) => {
    const map = { admin: 'bg-red-100 text-red-700', teacher: 'bg-blue-100 text-blue-700', student: 'bg-green-100 text-green-700' };
    return <span className={`px-2 py-0.5 text-xs font-semibold ${map[role]}`}>{role}</span>;
  };

  const field = (label, value, onChange, type = 'text', placeholder = '') => (
    <div>
      <label className="block text-xs font-semibold text-gray-600 uppercase tracking-wider mb-1.5">{label}</label>
      <input type={type} value={value} onChange={onChange} placeholder={placeholder} required
        className="w-full px-3 py-2.5 border border-gray-300 bg-white text-sm text-gray-900 focus:outline-none focus:border-blue-700 focus:ring-1 focus:ring-blue-700 transition" />
    </div>
  );

  const select = (label, value, onChange, options) => (
    <div>
      <label className="block text-xs font-semibold text-gray-600 uppercase tracking-wider mb-1.5">{label}</label>
      <select value={value} onChange={onChange}
        className="w-full px-3 py-2.5 border border-gray-300 bg-white text-sm text-gray-700 focus:outline-none focus:border-blue-700 focus:ring-1 focus:ring-blue-700 transition">
        {options.map(o => <option key={o.value} value={o.value}>{o.label}</option>)}
      </select>
    </div>
  );

  return (
    <DashboardLayout role="admin" tabs={tabs} activeTab={tab} onTabChange={setTab}>

      {/* Dashboard */}
      {tab === 'dashboard' && (
        <div className="space-y-6">
          <div>
            <h2 className="text-xl font-black text-gray-900">Overview</h2>
            <p className="text-gray-500 text-sm mt-0.5">School management summary for {new Date().toLocaleDateString('en-KE', { month: 'long', year: 'numeric' })}</p>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
            {[
              { label: 'Students', value: stats.total_students, border: 'border-blue-600' },
              { label: 'Teachers', value: stats.total_teachers, border: 'border-green-600' },
              { label: 'Notices', value: stats.total_notices, border: 'border-yellow-500' },
              { label: 'Grades', value: stats.total_grades, border: 'border-purple-600' },
              { label: 'Attendance', value: stats.total_attendance, border: 'border-pink-600' },
              { label: 'Total Users', value: stats.total_users, border: 'border-gray-600' },
            ].map((s, i) => (
              <div key={i} className={`bg-white border-t-4 ${s.border} p-4 shadow-sm`}>
                <p className="text-2xl font-black text-gray-900">{s.value}</p>
                <p className="text-gray-500 text-xs mt-1">{s.label}</p>
              </div>
            ))}
          </div>

          <div className="grid lg:grid-cols-2 gap-6">
            <div className="bg-white border border-gray-200 p-5">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-bold text-gray-900 text-sm">Recent Notices</h3>
                <button onClick={() => setTab('notices')} className="text-blue-700 text-xs hover:underline">View all</button>
              </div>
              {notices.slice(0, 4).map((n, i) => (
                <div key={i} className="py-3 border-b border-gray-100 last:border-0">
                  <p className="font-semibold text-gray-800 text-sm">{n.title}</p>
                  <p className="text-gray-400 text-xs mt-0.5 line-clamp-1">{n.content}</p>
                </div>
              ))}
              {notices.length === 0 && <p className="text-gray-400 text-sm py-4 text-center">No notices yet.</p>}
            </div>

            <div className="bg-white border border-gray-200 p-5">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-bold text-gray-900 text-sm">Recent Users</h3>
                <button onClick={() => setTab('users')} className="text-blue-700 text-xs hover:underline">View all</button>
              </div>
              {users.slice(0, 4).map((u, i) => (
                <div key={i} className="flex items-center justify-between py-3 border-b border-gray-100 last:border-0">
                  <div>
                    <p className="font-semibold text-gray-800 text-sm">{u.full_name}</p>
                    <p className="text-gray-400 text-xs">@{u.username}</p>
                  </div>
                  {roleBadge(u.role)}
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Users */}
      {tab === 'users' && (
        <div className="space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <h2 className="text-xl font-black text-gray-900">Users</h2>
              <p className="text-gray-500 text-sm">{users.length} registered users</p>
            </div>
            <input value={search} onChange={e => setSearch(e.target.value)}
              placeholder="Search by name, username or email"
              className="px-3 py-2 border border-gray-300 text-sm focus:outline-none focus:border-blue-700 w-full sm:w-72" />
          </div>
          <div className="bg-white border border-gray-200 overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-gray-200 bg-gray-50">
                  {['Full Name', 'Username', 'Email', 'Role', 'Action'].map((h, i) => (
                    <th key={i} className="px-4 py-3 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {filteredUsers.map((u, i) => (
                  <tr key={i} className="border-b border-gray-100 hover:bg-gray-50 transition">
                    <td className="px-4 py-3 font-medium text-gray-900">{u.full_name}</td>
                    <td className="px-4 py-3 text-gray-500">@{u.username}</td>
                    <td className="px-4 py-3 text-gray-500">{u.email}</td>
                    <td className="px-4 py-3">{roleBadge(u.role)}</td>
                    <td className="px-4 py-3">
                      {u.id !== user.id && (
                        <button onClick={() => deleteUser(u.id)} className="text-red-600 text-xs hover:underline font-medium">Delete</button>
                      )}
                    </td>
                  </tr>
                ))}
                {filteredUsers.length === 0 && (
                  <tr><td colSpan={5} className="px-4 py-8 text-center text-gray-400 text-sm">No users found.</td></tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Students */}
      {tab === 'students' && (
        <div className="space-y-4">
          <div>
            <h2 className="text-xl font-black text-gray-900">Students</h2>
            <p className="text-gray-500 text-sm">{students.length} enrolled students</p>
          </div>
          <div className="bg-white border border-gray-200 overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-gray-200 bg-gray-50">
                  {['Student ID', 'Full Name', 'Class', 'Parent Name', 'Parent Phone'].map((h, i) => (
                    <th key={i} className="px-4 py-3 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {students.map((s, i) => (
                  <tr key={i} className="border-b border-gray-100 hover:bg-gray-50 transition">
                    <td className="px-4 py-3 font-mono text-xs text-blue-700 font-bold">{s.student_id}</td>
                    <td className="px-4 py-3 font-medium text-gray-900">{s.user?.full_name || '—'}</td>
                    <td className="px-4 py-3 text-gray-500">{s.class_name}</td>
                    <td className="px-4 py-3 text-gray-500">{s.parent_name}</td>
                    <td className="px-4 py-3 text-gray-500">{s.parent_phone}</td>
                  </tr>
                ))}
                {students.length === 0 && (
                  <tr><td colSpan={5} className="px-4 py-8 text-center text-gray-400 text-sm">No students found.</td></tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Notices */}
      {tab === 'notices' && (
        <div className="space-y-6">
          <div className="bg-white border border-gray-200 p-6">
            <h2 className="text-base font-black text-gray-900 mb-4">Post New Notice</h2>
            <form onSubmit={postNotice} className="space-y-4">
              {field('Title', noticeForm.title, e => setNoticeForm({ ...noticeForm, title: e.target.value }), 'text', 'e.g. School Closure Notice')}
              <div>
                <label className="block text-xs font-semibold text-gray-600 uppercase tracking-wider mb-1.5">Content</label>
                <textarea value={noticeForm.content} onChange={e => setNoticeForm({ ...noticeForm, content: e.target.value })}
                  placeholder="Write the notice content here..." required rows={3}
                  className="w-full px-3 py-2.5 border border-gray-300 bg-white text-sm text-gray-900 focus:outline-none focus:border-blue-700 focus:ring-1 focus:ring-blue-700 transition resize-none" />
              </div>
              {select('Target Audience', noticeForm.target_role, e => setNoticeForm({ ...noticeForm, target_role: e.target.value }), [
                { value: '', label: 'All Users' },
                { value: 'student', label: 'Students Only' },
                { value: 'teacher', label: 'Teachers Only' },
                { value: 'admin', label: 'Administrators Only' },
              ])}
              <button type="submit" className="bg-blue-800 text-white px-6 py-2.5 text-sm font-bold hover:bg-blue-900 transition">Post Notice</button>
            </form>
          </div>

          <div className="bg-white border border-gray-200 p-6">
            <h2 className="text-base font-black text-gray-900 mb-4">All Notices ({notices.length})</h2>
            {notices.map((n, i) => (
              <div key={i} className="flex items-start justify-between gap-4 py-4 border-b border-gray-100 last:border-0">
                <div>
                  <p className="font-bold text-gray-900 text-sm">{n.title}</p>
                  <p className="text-gray-500 text-xs mt-1">{n.content}</p>
                  <span className="inline-block mt-1.5 text-xs text-blue-700 font-medium">{n.target_role || 'All Users'}</span>
                </div>
                <button onClick={() => deleteNotice(n.id)} className="text-red-600 text-xs hover:underline font-medium flex-shrink-0">Delete</button>
              </div>
            ))}
            {notices.length === 0 && <p className="text-gray-400 text-sm text-center py-6">No notices yet.</p>}
          </div>
        </div>
      )}

      {/* Register User */}
      {tab === 'register' && (
        <div className="max-w-md">
          <div className="bg-white border border-gray-200 p-6">
            <h2 className="text-base font-black text-gray-900 mb-1">Register New User</h2>
            <p className="text-gray-500 text-sm mb-5">Create a new student, teacher or administrator account.</p>
            <form onSubmit={registerUser} className="space-y-4">
              {field('Full Name', registerForm.full_name, e => setRegisterForm({ ...registerForm, full_name: e.target.value }), 'text', 'e.g. John Kamau')}
              <div className="grid grid-cols-2 gap-3">
                {field('Username', registerForm.username, e => setRegisterForm({ ...registerForm, username: e.target.value }), 'text', 'johnkamau')}
                {select('Role', registerForm.role, e => setRegisterForm({ ...registerForm, role: e.target.value }), [
                  { value: 'student', label: 'Student' },
                  { value: 'teacher', label: 'Teacher' },
                  { value: 'admin', label: 'Administrator' },
                ])}
              </div>
              {field('Email', registerForm.email, e => setRegisterForm({ ...registerForm, email: e.target.value }), 'email', 'john@email.com')}
              {field('Password', registerForm.password, e => setRegisterForm({ ...registerForm, password: e.target.value }), 'password', 'Minimum 6 characters')}
              <button type="submit" className="w-full bg-blue-800 text-white py-3 text-sm font-bold hover:bg-blue-900 transition">Register User</button>
            </form>
          </div>
        </div>
      )}
    </DashboardLayout>
  );
};

export default AdminDashboard;
