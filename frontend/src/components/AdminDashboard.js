import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import toast from 'react-hot-toast';

const api = (token) => axios.create({
  baseURL: 'http://localhost:8000',
  headers: { Authorization: `Bearer ${token}` }
});

const AdminDashboard = () => {
  const navigate = useNavigate();
  const token = localStorage.getItem('token');
  const user = JSON.parse(localStorage.getItem('user') || '{}');
  const [tab, setTab] = useState('dashboard');
  const [users, setUsers] = useState([]);
  const [notices, setNotices] = useState([]);
  const [students, setStudents] = useState([]);
  const [stats, setStats] = useState({ total_students: 0, total_teachers: 0, total_notices: 0, total_grades: 0, total_attendance: 0, total_users: 0 });
  const [noticeForm, setNoticeForm] = useState({ title: '', content: '', target_role: '' });
  const [registerForm, setRegisterForm] = useState({ email: '', username: '', full_name: '', password: '', role: 'student' });

  useEffect(() => { fetchAll(); }, []);

  const fetchAll = async () => {
    try {
      const [usersRes, noticesRes, studentsRes, statsRes] = await Promise.all([
        api(token).get('/api/admin/users'),
        api(token).get('/api/notices/'),
        api(token).get('/api/students/'),
        api(token).get('/api/admin/stats'),
      ]);
      setUsers(usersRes.data);
      setNotices(noticesRes.data);
      setStudents(studentsRes.data);
      setStats(statsRes.data);
    } catch (e) { toast.error('Failed to load data'); }
  };

  const handleLogout = () => {
    localStorage.clear();
    navigate('/login');
  };

  const postNotice = async (e) => {
    e.preventDefault();
    try {
      await api(token).post('/api/notices/', noticeForm);
      toast.success('Notice posted!');
      setNoticeForm({ title: '', content: '', target_role: '' });
      fetchAll();
    } catch { toast.error('Failed to post notice'); }
  };

  const deleteNotice = async (id) => {
    try {
      await api(token).delete(`/api/notices/${id}`);
      toast.success('Notice deleted');
      fetchAll();
    } catch { toast.error('Failed to delete notice'); }
  };

  const registerUser = async (e) => {
    e.preventDefault();
    try {
      await axios.post('http://localhost:8000/api/auth/register', registerForm);
      toast.success('User registered!');
      setRegisterForm({ email: '', username: '', full_name: '', password: '', role: 'student' });
      fetchAll();
    } catch (e) { toast.error(e.response?.data?.detail || 'Registration failed'); }
  };

  const deleteUser = async (id) => {
    try {
      await api(token).delete(`/api/admin/users/${id}`);
      toast.success('User deleted');
      fetchAll();
    } catch { toast.error('Failed to delete user'); }
  };

  const tabs = ['dashboard', 'users', 'students', 'notices', 'register'];

  return (
    <div className="min-h-screen bg-gray-50">
      <nav className="bg-blue-900 text-white shadow-lg">
        <div className="max-w-7xl mx-auto px-4 flex justify-between items-center h-16">
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 bg-yellow-400 rounded-full flex items-center justify-center font-bold text-blue-900">A</div>
            <span className="font-bold text-lg">Akilli School — Admin</span>
          </div>
          <div className="flex items-center space-x-4">
            <span className="text-blue-200 text-sm">Welcome, {user.full_name}</span>
            <button onClick={handleLogout} className="bg-red-500 px-4 py-1.5 rounded-lg text-sm hover:bg-red-600">Logout</button>
          </div>
        </div>
      </nav>

      <div className="max-w-7xl mx-auto px-4 py-6">
        {/* Tabs */}
        <div className="flex space-x-2 mb-6 flex-wrap gap-2">
          {tabs.map(t => (
            <button key={t} onClick={() => setTab(t)}
              className={`px-4 py-2 rounded-lg font-medium capitalize text-sm ${tab === t ? 'bg-blue-900 text-white' : 'bg-white text-gray-600 hover:bg-gray-100'}`}>
              {t === 'register' ? 'Register User' : t}
            </button>
          ))}
        </div>

        {/* Dashboard */}
        {tab === 'dashboard' && (
          <div>
            <h2 className="text-2xl font-bold text-blue-900 mb-6">Dashboard Overview</h2>
            <div className="grid grid-cols-1 md:grid-cols-6 gap-4 mb-8">
              {[
                { label: 'Students', value: stats.total_students, color: 'bg-blue-500', icon: 'S' },
                { label: 'Teachers', value: stats.total_teachers, color: 'bg-green-500', icon: 'T' },
                { label: 'Notices', value: stats.total_notices, color: 'bg-yellow-500', icon: 'N' },
                { label: 'Grades', value: stats.total_grades, color: 'bg-purple-500', icon: 'G' },
                { label: 'Attendance', value: stats.total_attendance, color: 'bg-pink-500', icon: 'A' },
                { label: 'Users', value: stats.total_users, color: 'bg-indigo-500', icon: 'U' },
              ].map((s, i) => (
                <div key={i} className={`${s.color} text-white rounded-xl p-6`}>
                  <div className="text-3xl mb-2">{s.icon}</div>
                  <p className="text-3xl font-bold">{s.value}</p>
                  <p className="text-sm opacity-90">{s.label}</p>
                </div>
              ))}
            </div>
            <div className="bg-white rounded-xl shadow p-6">
              <h3 className="font-bold text-lg mb-4">Recent Notices</h3>
              {notices.slice(0, 3).map((n, i) => (
                <div key={i} className="border-b py-3 last:border-0">
                  <p className="font-medium">{n.title}</p>
                  <p className="text-sm text-gray-500">{n.content}</p>
                </div>
              ))}
              {notices.length === 0 && <p className="text-gray-400">No notices yet.</p>}
            </div>
          </div>
        )}

        {/* Users */}
        {tab === 'users' && (
          <div className="bg-white rounded-xl shadow p-6">
            <h2 className="text-xl font-bold mb-4">All Users</h2>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead><tr className="bg-gray-50 text-left">
                  <th className="p-3">Name</th><th className="p-3">Username</th>
                  <th className="p-3">Email</th><th className="p-3">Role</th><th className="p-3">Action</th>
                </tr></thead>
                <tbody>
                  {users.map((u, i) => (
                    <tr key={i} className="border-t hover:bg-gray-50">
                      <td className="p-3">{u.full_name}</td>
                      <td className="p-3">{u.username}</td>
                      <td className="p-3">{u.email}</td>
                      <td className="p-3"><span className={`px-2 py-1 rounded-full text-xs font-bold ${u.role === 'admin' ? 'bg-red-100 text-red-700' : u.role === 'teacher' ? 'bg-blue-100 text-blue-700' : 'bg-green-100 text-green-700'}`}>{u.role}</span></td>
                      <td className="p-3">{u.id !== user.id && <button onClick={() => deleteUser(u.id)} className="text-red-500 hover:underline text-xs">Delete</button>}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Students */}
        {tab === 'students' && (
          <div className="bg-white rounded-xl shadow p-6">
            <h2 className="text-xl font-bold mb-4">All Students</h2>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead><tr className="bg-gray-50 text-left">
                  <th className="p-3">Student ID</th><th className="p-3">Name</th>
                  <th className="p-3">Class</th><th className="p-3">Parent</th><th className="p-3">Phone</th>
                </tr></thead>
                <tbody>
                  {students.map((s, i) => (
                    <tr key={i} className="border-t hover:bg-gray-50">
                      <td className="p-3">{s.student_id}</td>
                      <td className="p-3">{s.user?.full_name || '-'}</td>
                      <td className="p-3">{s.class_name}</td>
                      <td className="p-3">{s.parent_name}</td>
                      <td className="p-3">{s.parent_phone}</td>
                    </tr>
                  ))}
                  {students.length === 0 && <tr><td colSpan={5} className="p-3 text-gray-400 text-center">No students found.</td></tr>}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Notices */}
        {tab === 'notices' && (
          <div className="space-y-6">
            <div className="bg-white rounded-xl shadow p-6">
              <h2 className="text-xl font-bold mb-4">Post New Notice</h2>
              <form onSubmit={postNotice} className="space-y-4">
                <input value={noticeForm.title} onChange={e => setNoticeForm({ ...noticeForm, title: e.target.value })}
                  placeholder="Notice Title" required className="w-full border rounded-lg px-4 py-2" />
                <textarea value={noticeForm.content} onChange={e => setNoticeForm({ ...noticeForm, content: e.target.value })}
                  placeholder="Notice Content" required rows={3} className="w-full border rounded-lg px-4 py-2" />
                <select value={noticeForm.target_role} onChange={e => setNoticeForm({ ...noticeForm, target_role: e.target.value })}
                  className="w-full border rounded-lg px-4 py-2">
                  <option value="">All Users</option>
                  <option value="student">Students Only</option>
                  <option value="teacher">Teachers Only</option>
                  <option value="admin">Admins Only</option>
                </select>
                <button type="submit" className="bg-blue-900 text-white px-6 py-2 rounded-lg hover:bg-blue-800">Post Notice</button>
              </form>
            </div>
            <div className="bg-white rounded-xl shadow p-6">
              <h2 className="text-xl font-bold mb-4">All Notices</h2>
              {notices.map((n, i) => (
                <div key={i} className="border-b py-4 last:border-0 flex justify-between items-start">
                  <div>
                    <p className="font-bold">{n.title}</p>
                    <p className="text-sm text-gray-600 mt-1">{n.content}</p>
                    <span className="text-xs text-blue-600">{n.target_role || 'All Users'}</span>
                  </div>
                  <button onClick={() => deleteNotice(n.id)} className="text-red-500 text-sm hover:underline ml-4">Delete</button>
                </div>
              ))}
              {notices.length === 0 && <p className="text-gray-400">No notices yet.</p>}
            </div>
          </div>
        )}

        {/* Register User */}
        {tab === 'register' && (
          <div className="bg-white rounded-xl shadow p-6 max-w-lg">
            <h2 className="text-xl font-bold mb-4">Register New User</h2>
            <form onSubmit={registerUser} className="space-y-4">
              <input value={registerForm.full_name} onChange={e => setRegisterForm({ ...registerForm, full_name: e.target.value })}
                placeholder="Full Name" required className="w-full border rounded-lg px-4 py-2" />
              <input value={registerForm.username} onChange={e => setRegisterForm({ ...registerForm, username: e.target.value })}
                placeholder="Username" required className="w-full border rounded-lg px-4 py-2" />
              <input value={registerForm.email} onChange={e => setRegisterForm({ ...registerForm, email: e.target.value })}
                placeholder="Email" type="email" required className="w-full border rounded-lg px-4 py-2" />
              <input value={registerForm.password} onChange={e => setRegisterForm({ ...registerForm, password: e.target.value })}
                placeholder="Password" type="password" required className="w-full border rounded-lg px-4 py-2" />
              <select value={registerForm.role} onChange={e => setRegisterForm({ ...registerForm, role: e.target.value })}
                className="w-full border rounded-lg px-4 py-2">
                <option value="student">Student</option>
                <option value="teacher">Teacher</option>
                <option value="admin">Admin</option>
              </select>
              <button type="submit" className="w-full bg-blue-900 text-white py-2 rounded-lg hover:bg-blue-800">Register User</button>
            </form>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminDashboard;
