import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import toast from 'react-hot-toast';

const api = (token) => axios.create({
  baseURL: 'http://localhost:8000',
  headers: { Authorization: `Bearer ${token}` }
});

const StudentDashboard = () => {
  const navigate = useNavigate();
  const token = localStorage.getItem('token');
  const user = JSON.parse(localStorage.getItem('user') || '{}');
  const [tab, setTab] = useState('dashboard');
  const [profile, setProfile] = useState(null);
  const [grades, setGrades] = useState([]);
  const [attendances, setAttendances] = useState([]);
  const [notices, setNotices] = useState([]);

  useEffect(() => { fetchAll(); }, []);

  const fetchAll = async () => {
    try {
      const [profileRes, gradesRes, attendancesRes, noticesRes] = await Promise.all([
        api(token).get('/api/students/me'),
        api(token).get('/api/grades/me'),
        api(token).get('/api/attendance/me'),
        api(token).get('/api/notices/'),
      ]);
      setProfile(profileRes.data);
      setGrades(gradesRes.data);
      setAttendances(attendancesRes.data);
      setNotices(noticesRes.data);
    } catch { toast.error('Failed to load data'); }
  };

  const handleLogout = () => { localStorage.clear(); navigate('/login'); };

  const presentDays = attendances.filter(a => a.status).length;
  const attendanceRate = attendances.length > 0 ? Math.round((presentDays / attendances.length) * 100) : 0;
  const avgGrade = grades.length > 0 ? Math.round(grades.reduce((sum, g) => sum + (g.marks_obtained / g.total_marks) * 100, 0) / grades.length) : 0;

  const tabs = ['dashboard', 'grades', 'attendance', 'notices'];

  return (
    <div className="min-h-screen bg-gray-50">
      <nav className="bg-blue-900 text-white shadow-lg">
        <div className="max-w-7xl mx-auto px-4 flex justify-between items-center h-16">
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 bg-yellow-400 rounded-full flex items-center justify-center font-bold text-blue-900">A</div>
            <span className="font-bold text-lg">Akilli School — Student</span>
          </div>
          <div className="flex items-center space-x-4">
            <span className="text-blue-200 text-sm">Welcome, {user.full_name}</span>
            <button onClick={handleLogout} className="bg-red-500 px-4 py-1.5 rounded-lg text-sm hover:bg-red-600">Logout</button>
          </div>
        </div>
      </nav>

      <div className="max-w-7xl mx-auto px-4 py-6">
        <div className="flex space-x-2 mb-6 flex-wrap gap-2">
          {tabs.map(t => (
            <button key={t} onClick={() => setTab(t)}
              className={`px-4 py-2 rounded-lg font-medium capitalize text-sm ${tab === t ? 'bg-blue-900 text-white' : 'bg-white text-gray-600 hover:bg-gray-100'}`}>
              {t}
            </button>
          ))}
        </div>

        {/* Dashboard */}
        {tab === 'dashboard' && (
          <div>
            <h2 className="text-2xl font-bold text-blue-900 mb-6">My Overview</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
              {[
                { label: 'Attendance Rate', value: `${attendanceRate}%`, color: attendanceRate >= 75 ? 'bg-green-500' : 'bg-red-500', icon: '📋' },
                { label: 'Average Grade', value: `${avgGrade}%`, color: avgGrade >= 50 ? 'bg-blue-500' : 'bg-orange-500', icon: '📝' },
                { label: 'Subjects', value: [...new Set(grades.map(g => g.subject))].length, color: 'bg-purple-500', icon: '📚' },
              ].map((s, i) => (
                <div key={i} className={`${s.color} text-white rounded-xl p-6`}>
                  <div className="text-3xl mb-2">{s.icon}</div>
                  <p className="text-3xl font-bold">{s.value}</p>
                  <p className="text-sm opacity-90">{s.label}</p>
                </div>
              ))}
            </div>
            {profile && (
              <div className="bg-white rounded-xl shadow p-6 mb-6">
                <h3 className="font-bold text-lg mb-4">My Profile</h3>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                  <div><p className="text-gray-500">Student ID</p><p className="font-bold">{profile.student_id}</p></div>
                  <div><p className="text-gray-500">Class</p><p className="font-bold">{profile.class_name}</p></div>
                  <div><p className="text-gray-500">Parent</p><p className="font-bold">{profile.parent_name}</p></div>
                  <div><p className="text-gray-500">Parent Phone</p><p className="font-bold">{profile.parent_phone}</p></div>
                </div>
              </div>
            )}
            <div className="bg-white rounded-xl shadow p-6">
              <h3 className="font-bold text-lg mb-4">Latest Notices</h3>
              {notices.slice(0, 3).map((n, i) => (
                <div key={i} className="border-b py-3 last:border-0">
                  <p className="font-medium">{n.title}</p>
                  <p className="text-sm text-gray-500">{n.content}</p>
                </div>
              ))}
              {notices.length === 0 && <p className="text-gray-400">No notices.</p>}
            </div>
          </div>
        )}

        {/* Grades */}
        {tab === 'grades' && (
          <div className="bg-white rounded-xl shadow p-6">
            <h2 className="text-xl font-bold mb-4">My Grades</h2>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead><tr className="bg-gray-50 text-left">
                  <th className="p-3">Subject</th><th className="p-3">Marks</th><th className="p-3">Type</th><th className="p-3">Score</th>
                </tr></thead>
                <tbody>
                  {grades.map((g, i) => (
                    <tr key={i} className="border-t hover:bg-gray-50">
                      <td className="p-3">{g.subject}</td>
                      <td className="p-3">{g.marks_obtained}/{g.total_marks}</td>
                      <td className="p-3 capitalize">{g.exam_type}</td>
                      <td className="p-3">
                        <span className={`px-2 py-1 rounded-full text-xs font-bold ${(g.marks_obtained / g.total_marks) >= 0.5 ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                          {Math.round((g.marks_obtained / g.total_marks) * 100)}%
                        </span>
                      </td>
                    </tr>
                  ))}
                  {grades.length === 0 && <tr><td colSpan={4} className="p-3 text-gray-400 text-center">No grades yet.</td></tr>}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Attendance */}
        {tab === 'attendance' && (
          <div className="bg-white rounded-xl shadow p-6">
            <h2 className="text-xl font-bold mb-2">My Attendance</h2>
            <p className="text-gray-500 mb-4">Present: {presentDays}/{attendances.length} days ({attendanceRate}%)</p>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead><tr className="bg-gray-50 text-left">
                  <th className="p-3">Date</th><th className="p-3">Status</th><th className="p-3">Remarks</th>
                </tr></thead>
                <tbody>
                  {attendances.map((a, i) => (
                    <tr key={i} className="border-t hover:bg-gray-50">
                      <td className="p-3">{new Date(a.date).toLocaleDateString()}</td>
                      <td className="p-3"><span className={`px-2 py-1 rounded-full text-xs font-bold ${a.status ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>{a.status ? 'Present' : 'Absent'}</span></td>
                      <td className="p-3">{a.remarks || '-'}</td>
                    </tr>
                  ))}
                  {attendances.length === 0 && <tr><td colSpan={3} className="p-3 text-gray-400 text-center">No records yet.</td></tr>}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Notices */}
        {tab === 'notices' && (
          <div className="bg-white rounded-xl shadow p-6">
            <h2 className="text-xl font-bold mb-4">School Notices</h2>
            {notices.map((n, i) => (
              <div key={i} className="border-b py-4 last:border-0">
                <p className="font-bold">{n.title}</p>
                <p className="text-sm text-gray-600 mt-1">{n.content}</p>
              </div>
            ))}
            {notices.length === 0 && <p className="text-gray-400">No notices.</p>}
          </div>
        )}
      </div>
    </div>
  );
};

export default StudentDashboard;
