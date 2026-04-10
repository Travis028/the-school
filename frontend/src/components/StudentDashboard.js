import React, { useState, useEffect } from 'react';
import axios from 'axios';
import toast from 'react-hot-toast';
import DashboardLayout from './DashboardLayout';

const api = (token) => axios.create({
  baseURL: 'http://localhost:8000',
  headers: { Authorization: `Bearer ${token}` },
});

const gradeLetter = (pct) => {
  if (pct >= 80) return { letter: 'A', color: 'text-green-700', bg: 'bg-green-100' };
  if (pct >= 70) return { letter: 'B', color: 'text-blue-700', bg: 'bg-blue-100' };
  if (pct >= 60) return { letter: 'C', color: 'text-yellow-700', bg: 'bg-yellow-100' };
  if (pct >= 50) return { letter: 'D', color: 'text-orange-700', bg: 'bg-orange-100' };
  return { letter: 'E', color: 'text-red-700', bg: 'bg-red-100' };
};

const StudentDashboard = () => {
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
      const [p, g, a, n] = await Promise.all([
        api(token).get('/api/students/me'),
        api(token).get('/api/grades/me'),
        api(token).get('/api/attendance/me'),
        api(token).get('/api/notices/'),
      ]);
      setProfile(p.data); setGrades(g.data); setAttendances(a.data); setNotices(n.data);
    } catch { toast.error('Failed to load data'); }
  };

  const presentDays = attendances.filter(a => a.status).length;
  const absentDays = attendances.length - presentDays;
  const attendanceRate = attendances.length > 0 ? Math.round((presentDays / attendances.length) * 100) : 0;
  const avgGrade = grades.length > 0
    ? Math.round(grades.reduce((sum, g) => sum + (g.marks_obtained / g.total_marks) * 100, 0) / grades.length)
    : 0;
  const subjects = [...new Set(grades.map(g => g.subject))];

  const tabs = [
    { key: 'dashboard', label: 'Dashboard' },
    { key: 'grades', label: 'My Grades' },
    { key: 'attendance', label: 'Attendance' },
    { key: 'notices', label: 'Notices' },
    { key: 'profile', label: 'My Profile' },
  ];

  return (
    <DashboardLayout role="student" tabs={tabs} activeTab={tab} onTabChange={setTab}>

      {/* Dashboard */}
      {tab === 'dashboard' && (
        <div className="space-y-6">
          <div>
            <h2 className="text-xl font-black text-gray-900">Overview</h2>
            <p className="text-gray-500 text-sm mt-0.5">Welcome back, {user.full_name}</p>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            <div className={`bg-white border-t-4 ${attendanceRate >= 75 ? 'border-green-600' : 'border-red-500'} p-4 shadow-sm`}>
              <p className="text-2xl font-black text-gray-900">{attendanceRate}%</p>
              <p className="text-gray-500 text-xs mt-1">Attendance Rate</p>
              <p className={`text-xs mt-0.5 font-medium ${attendanceRate >= 75 ? 'text-green-600' : 'text-red-600'}`}>
                {presentDays}/{attendances.length} days
              </p>
            </div>
            <div className={`bg-white border-t-4 ${avgGrade >= 50 ? 'border-blue-600' : 'border-orange-500'} p-4 shadow-sm`}>
              <p className="text-2xl font-black text-gray-900">{avgGrade}%</p>
              <p className="text-gray-500 text-xs mt-1">Average Grade</p>
              <p className={`text-xs mt-0.5 font-medium ${gradeLetter(avgGrade).color}`}>
                Grade {gradeLetter(avgGrade).letter}
              </p>
            </div>
            <div className="bg-white border-t-4 border-purple-600 p-4 shadow-sm">
              <p className="text-2xl font-black text-gray-900">{subjects.length}</p>
              <p className="text-gray-500 text-xs mt-1">Subjects</p>
              <p className="text-xs mt-0.5 text-gray-400">{grades.length} total records</p>
            </div>
            <div className="bg-white border-t-4 border-yellow-500 p-4 shadow-sm">
              <p className="text-2xl font-black text-gray-900">{notices.length}</p>
              <p className="text-gray-500 text-xs mt-1">Notices</p>
              <p className="text-xs mt-0.5 text-gray-400">School updates</p>
            </div>
          </div>

          {/* Attendance bar */}
          <div className="bg-white border border-gray-200 p-5">
            <div className="flex items-center justify-between mb-3">
              <h3 className="font-bold text-gray-900 text-sm">Attendance Progress</h3>
              <span className={`text-xs font-semibold px-2 py-1 ${attendanceRate >= 75 ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                {attendanceRate >= 75 ? 'Good Standing' : 'Below Minimum'}
              </span>
            </div>
            <div className="w-full bg-gray-100 h-2 mb-2">
              <div className={`h-2 transition-all ${attendanceRate >= 75 ? 'bg-green-600' : 'bg-red-500'}`}
                style={{ width: `${attendanceRate}%` }}></div>
            </div>
            <div className="flex justify-between text-xs text-gray-400">
              <span>{presentDays} days present</span>
              <span>{absentDays} days absent</span>
              <span>Minimum required: 75%</span>
            </div>
          </div>

          <div className="grid lg:grid-cols-2 gap-6">
            <div className="bg-white border border-gray-200 p-5">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-bold text-gray-900 text-sm">Recent Grades</h3>
                <button onClick={() => setTab('grades')} className="text-blue-700 text-xs hover:underline">View all</button>
              </div>
              {grades.slice(0, 5).map((g, i) => {
                const pct = Math.round((g.marks_obtained / g.total_marks) * 100);
                const { letter, color, bg } = gradeLetter(pct);
                return (
                  <div key={i} className="flex items-center justify-between py-2.5 border-b border-gray-100 last:border-0">
                    <div>
                      <p className="font-medium text-gray-800 text-sm">{g.subject}</p>
                      <p className="text-gray-400 text-xs capitalize">{g.exam_type}</p>
                    </div>
                    <div className="text-right">
                      <span className={`text-xs font-black px-2 py-1 ${bg} ${color}`}>{letter}</span>
                      <p className="text-xs text-gray-400 mt-0.5">{g.marks_obtained}/{g.total_marks}</p>
                    </div>
                  </div>
                );
              })}
              {grades.length === 0 && <p className="text-gray-400 text-sm py-4 text-center">No grades yet.</p>}
            </div>

            <div className="bg-white border border-gray-200 p-5">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-bold text-gray-900 text-sm">Latest Notices</h3>
                <button onClick={() => setTab('notices')} className="text-blue-700 text-xs hover:underline">View all</button>
              </div>
              {notices.slice(0, 4).map((n, i) => (
                <div key={i} className="py-2.5 border-b border-gray-100 last:border-0">
                  <p className="font-medium text-gray-800 text-sm">{n.title}</p>
                  <p className="text-gray-400 text-xs mt-0.5 line-clamp-1">{n.content}</p>
                </div>
              ))}
              {notices.length === 0 && <p className="text-gray-400 text-sm py-4 text-center">No notices.</p>}
            </div>
          </div>
        </div>
      )}

      {/* Grades */}
      {tab === 'grades' && (
        <div className="space-y-4">
          <div>
            <h2 className="text-xl font-black text-gray-900">My Grades</h2>
            <p className="text-gray-500 text-sm">Overall average: {avgGrade}% — Grade {gradeLetter(avgGrade).letter}</p>
          </div>
          <div className="bg-white border border-gray-200 overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-gray-200 bg-gray-50">
                  {['Subject', 'Marks Obtained', 'Total Marks', 'Exam Type', 'Grade', 'Score'].map((h, i) => (
                    <th key={i} className="px-4 py-3 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {grades.map((g, i) => {
                  const pct = Math.round((g.marks_obtained / g.total_marks) * 100);
                  const { letter, color, bg } = gradeLetter(pct);
                  return (
                    <tr key={i} className="border-b border-gray-100 hover:bg-gray-50 transition">
                      <td className="px-4 py-3 font-medium text-gray-900">{g.subject}</td>
                      <td className="px-4 py-3 text-gray-600">{g.marks_obtained}</td>
                      <td className="px-4 py-3 text-gray-600">{g.total_marks}</td>
                      <td className="px-4 py-3 text-gray-500 capitalize text-xs">{g.exam_type}</td>
                      <td className="px-4 py-3"><span className={`text-xs font-black px-2 py-1 ${bg} ${color}`}>{letter}</span></td>
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-2">
                          <div className="w-16 bg-gray-100 h-1.5">
                            <div className={`h-1.5 ${pct >= 50 ? 'bg-green-600' : 'bg-red-500'}`} style={{ width: `${pct}%` }}></div>
                          </div>
                          <span className="text-xs text-gray-600 font-medium">{pct}%</span>
                        </div>
                      </td>
                    </tr>
                  );
                })}
                {grades.length === 0 && <tr><td colSpan={6} className="px-4 py-8 text-center text-gray-400 text-sm">No grades recorded yet.</td></tr>}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Attendance */}
      {tab === 'attendance' && (
        <div className="space-y-4">
          <div>
            <h2 className="text-xl font-black text-gray-900">My Attendance</h2>
            <p className="text-gray-500 text-sm">{presentDays} present out of {attendances.length} school days</p>
          </div>
          <div className="grid grid-cols-3 gap-3">
            <div className="bg-white border-t-4 border-green-600 p-4 text-center shadow-sm">
              <p className="text-2xl font-black text-gray-900">{presentDays}</p>
              <p className="text-gray-500 text-xs mt-1">Days Present</p>
            </div>
            <div className="bg-white border-t-4 border-red-500 p-4 text-center shadow-sm">
              <p className="text-2xl font-black text-gray-900">{absentDays}</p>
              <p className="text-gray-500 text-xs mt-1">Days Absent</p>
            </div>
            <div className={`bg-white border-t-4 ${attendanceRate >= 75 ? 'border-blue-600' : 'border-orange-500'} p-4 text-center shadow-sm`}>
              <p className="text-2xl font-black text-gray-900">{attendanceRate}%</p>
              <p className="text-gray-500 text-xs mt-1">Attendance Rate</p>
            </div>
          </div>
          <div className="bg-white border border-gray-200 overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-gray-200 bg-gray-50">
                  {['Date', 'Day', 'Status', 'Remarks'].map((h, i) => (
                    <th key={i} className="px-4 py-3 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {attendances.map((a, i) => {
                  const d = new Date(a.date);
                  return (
                    <tr key={i} className="border-b border-gray-100 hover:bg-gray-50 transition">
                      <td className="px-4 py-3 font-medium text-gray-900">{d.toLocaleDateString('en-KE', { day: 'numeric', month: 'short', year: 'numeric' })}</td>
                      <td className="px-4 py-3 text-gray-500">{d.toLocaleDateString('en-KE', { weekday: 'long' })}</td>
                      <td className="px-4 py-3">
                        <span className={`text-xs font-semibold px-2 py-1 ${a.status ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                          {a.status ? 'Present' : 'Absent'}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-gray-400 text-xs">{a.remarks || '—'}</td>
                    </tr>
                  );
                })}
                {attendances.length === 0 && <tr><td colSpan={4} className="px-4 py-8 text-center text-gray-400 text-sm">No attendance records yet.</td></tr>}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Notices */}
      {tab === 'notices' && (
        <div className="space-y-4">
          <h2 className="text-xl font-black text-gray-900">School Notices</h2>
          {notices.map((n, i) => (
            <div key={i} className="bg-white border border-gray-200 p-5 hover:border-blue-300 transition">
              <p className="font-bold text-gray-900">{n.title}</p>
              <p className="text-gray-500 text-sm mt-1">{n.content}</p>
            </div>
          ))}
          {notices.length === 0 && (
            <div className="bg-white border border-gray-200 p-12 text-center">
              <p className="text-gray-400 text-sm">No notices at the moment.</p>
            </div>
          )}
        </div>
      )}

      {/* Profile */}
      {tab === 'profile' && (
        <div className="space-y-4 max-w-xl">
          <h2 className="text-xl font-black text-gray-900">My Profile</h2>
          <div className="bg-white border border-gray-200 p-6">
            <div className="flex items-center gap-4 pb-5 mb-5 border-b border-gray-100">
              <div className="w-12 h-12 bg-blue-800 flex items-center justify-center font-black text-white text-lg">
                {user.full_name?.[0]?.toUpperCase()}
              </div>
              <div>
                <p className="font-black text-gray-900">{user.full_name}</p>
                <p className="text-gray-500 text-sm">@{user.username}</p>
                <span className="inline-block mt-1 text-xs font-semibold bg-green-100 text-green-700 px-2 py-0.5">Student</span>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              {[
                { label: 'Full Name', value: user.full_name },
                { label: 'Username', value: user.username },
                { label: 'Email', value: user.email },
                { label: 'Role', value: 'Student' },
                { label: 'Student ID', value: profile?.student_id || '—' },
                { label: 'Class', value: profile?.class_name || '—' },
                { label: 'Parent / Guardian', value: profile?.parent_name || '—' },
                { label: 'Parent Phone', value: profile?.parent_phone || '—' },
              ].map((item, i) => (
                <div key={i} className="border border-gray-100 bg-gray-50 p-3">
                  <p className="text-xs text-gray-400 uppercase tracking-wider font-medium mb-1">{item.label}</p>
                  <p className="font-semibold text-gray-800 text-sm">{item.value}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </DashboardLayout>
  );
};

export default StudentDashboard;
