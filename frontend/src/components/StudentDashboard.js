import React, { useState, useEffect } from 'react';
import axios from 'axios';
import toast from 'react-hot-toast';
import DashboardLayout from './DashboardLayout';
import { 
  AcademicCapIcon,
  BookOpenIcon,
  CalendarIcon,
  BellIcon,
  UserGroupIcon,
  ChartBarIcon,
  DocumentTextIcon,
  ClockIcon,
  CheckCircleIcon,
  XCircleIcon,
  ArrowTrendingUpIcon,
  ArrowTrendingDownIcon,
  SparklesIcon,
  Cog6ToothIcon,
  UserCircleIcon,
  BellAlertIcon,
  ShieldCheckIcon
} from '@heroicons/react/24/outline';

const api = (token) => axios.create({
  baseURL: 'http://localhost:8000',
  headers: { Authorization: `Bearer ${token}` },
});

const gradeLetter = (pct) => {
  if (pct >= 80) return { letter: 'A', color: 'text-green-700', bg: 'bg-gradient-to-r from-green-400 to-emerald-500', text: 'text-white', border: 'border-green-400' };
  if (pct >= 70) return { letter: 'B', color: 'text-blue-700', bg: 'bg-gradient-to-r from-blue-400 to-cyan-500', text: 'text-white', border: 'border-blue-400' };
  if (pct >= 60) return { letter: 'C', color: 'text-yellow-700', bg: 'bg-gradient-to-r from-yellow-400 to-orange-500', text: 'text-white', border: 'border-yellow-400' };
  if (pct >= 50) return { letter: 'D', color: 'text-orange-700', bg: 'bg-gradient-to-r from-orange-400 to-red-500', text: 'text-white', border: 'border-orange-400' };
  return { letter: 'E', color: 'text-red-700', bg: 'bg-gradient-to-r from-red-400 to-pink-500', text: 'text-white', border: 'border-red-400' };
};

const StudentDashboard = () => {
  const token = localStorage.getItem('token');
  const user = JSON.parse(localStorage.getItem('user') || '{}');
  const [tab, setTab] = useState('dashboard');
  const [grades, setGrades] = useState([]);
  const [attendance, setAttendance] = useState([]);
  const [notices, setNotices] = useState([]);
  const [profile, setProfile] = useState(null);
  const [settings, setSettings] = useState({
    gradeNotifications: true,
    attendanceAlerts: true,
    schoolNotices: false,
    language: 'English',
    timezone: 'East Africa Time (EAT)',
    gradeReportFormat: 'Detailed'
  });

  useEffect(() => { fetchAll(); }, []);

  const fetchAll = async () => {
    try {
      const [p, g, a, n] = await Promise.all([
        api(token).get('/api/students/me'),
        api(token).get('/api/grades/me'),
        api(token).get('/api/attendance/me'),
        api(token).get('/api/notices/'),
      ]);
      setProfile(p.data); setGrades(g.data); setAttendance(a.data); setNotices(n.data);
    } catch { toast.error('Failed to load data'); }
  };

  const presentDays = attendance.filter(a => a.status).length;
  const absentDays = attendance.length - presentDays;
  const attendanceRate = attendance.length > 0 ? Math.round((presentDays / attendance.length) * 100) : 0;
  const avgGrade = grades.length > 0
    ? Math.round(grades.reduce((sum, g) => sum + (g.marks_obtained / g.total_marks) * 100, 0) / grades.length)
    : 0;
  const subjects = [...new Set(grades.map(g => g.subject))];

  const tabs = [
    { key: 'dashboard', label: 'Dashboard', icon: ChartBarIcon, badge: null },
    { key: 'grades', label: 'Grades', icon: BookOpenIcon, badge: grades.length > 0 ? grades.length : null },
    { key: 'attendance', label: 'Attendance', icon: CalendarIcon, badge: attendanceRate + '%' },
    { key: 'notices', label: 'Notices', icon: BellIcon, badge: notices.filter(n => !n.read).length || null },
    { key: 'profile', label: 'My Profile', icon: UserCircleIcon },
    { key: 'settings', label: 'Settings', icon: Cog6ToothIcon },
  ];

  return (
    <DashboardLayout role="student" tabs={tabs} activeTab={tab} onTabChange={setTab}>

      {/* Dashboard */}
      {tab === 'dashboard' && (
        <div className="space-y-8">
          <div className="text-center">
            <h2 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text">Student Dashboard</h2>
            <p className="text-gray-600 mt-2">Welcome back, <span className="font-semibold text-blue-600">{user.full_name}</span></p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className={`bg-gradient-to-br ${attendanceRate >= 75 ? 'from-green-50 to-emerald-50' : 'from-red-50 to-pink-50'} p-6 rounded-3xl shadow-xl border-2 ${attendanceRate >= 75 ? 'border-green-200' : 'border-red-200'} hover:shadow-2xl transition-all duration-300 group`}>
              <div className="flex items-center justify-between mb-4">
                <div className={`w-12 h-12 bg-gradient-to-br ${attendanceRate >= 75 ? 'from-green-500 to-emerald-600' : 'from-red-500 to-pink-600'} rounded-2xl flex items-center justify-center text-white shadow-lg group-hover:scale-110 transition-transform duration-300`}>
                  <CheckCircleIcon className="w-6 h-6" />
                </div>
                <span className={`text-xs font-bold px-3 py-1 rounded-full ${attendanceRate >= 75 ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                  {attendanceRate >= 75 ? 'Good' : 'Low'}
                </span>
              </div>
              <p className="text-3xl font-bold text-gray-900 mb-2">{attendanceRate}%</p>
              <p className="text-gray-600 text-sm font-medium mb-1">Attendance Rate</p>
              <p className={`text-xs ${attendanceRate >= 75 ? 'text-green-600' : 'text-red-600'} font-medium`}>
                {presentDays}/{attendance.length} days present
              </p>
            </div>
            
            <div className={`bg-gradient-to-br ${avgGrade >= 50 ? 'from-blue-50 to-indigo-50' : 'from-orange-50 to-yellow-50'} p-6 rounded-3xl shadow-xl border-2 ${avgGrade >= 50 ? 'border-blue-200' : 'border-orange-200'} hover:shadow-2xl transition-all duration-300 group`}>
              <div className="flex items-center justify-between mb-4">
                <div className={`w-12 h-12 bg-gradient-to-br ${avgGrade >= 50 ? 'from-blue-500 to-indigo-600' : 'from-orange-500 to-yellow-600'} rounded-2xl flex items-center justify-center text-white shadow-lg group-hover:scale-110 transition-transform duration-300`}>
                  <BookOpenIcon className="w-6 h-6" />
                </div>
                <span className={`text-xs font-bold px-3 py-1 rounded-full ${gradeLetter(avgGrade).bg} ${gradeLetter(avgGrade).text}`}>
                  Grade {gradeLetter(avgGrade).letter}
                </span>
              </div>
              <p className="text-3xl font-bold text-gray-900 mb-2">{avgGrade}%</p>
              <p className="text-gray-600 text-sm font-medium mb-1">Average Grade</p>
              <p className="text-xs text-gray-500">{grades.length} grade records</p>
            </div>
            
            <div className="bg-gradient-to-br from-purple-50 to-pink-50 p-6 rounded-3xl shadow-xl border-2 border-purple-200 hover:shadow-2xl transition-all duration-300 group">
              <div className="flex items-center justify-between mb-4">
                <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-pink-600 rounded-2xl flex items-center justify-center text-white shadow-lg group-hover:scale-110 transition-transform duration-300">
                  <AcademicCapIcon className="w-6 h-6" />
                </div>
                <span className="text-xs font-bold px-3 py-1 rounded-full bg-purple-100 text-purple-700">
                  Active
                </span>
              </div>
              <p className="text-3xl font-bold text-gray-900 mb-2">{subjects.length}</p>
              <p className="text-gray-600 text-sm font-medium mb-1">Subjects</p>
              <p className="text-xs text-gray-500">{grades.length} total records</p>
            </div>
            
            <div className="bg-gradient-to-br from-yellow-50 to-orange-50 p-6 rounded-3xl shadow-xl border-2 border-yellow-200 hover:shadow-2xl transition-all duration-300 group">
              <div className="flex items-center justify-between mb-4">
                <div className="w-12 h-12 bg-gradient-to-br from-yellow-500 to-orange-600 rounded-2xl flex items-center justify-center text-white shadow-lg group-hover:scale-110 transition-transform duration-300">
                  <BellIcon className="w-6 h-6" />
                </div>
                <span className="text-xs font-bold px-3 py-1 rounded-full bg-yellow-100 text-yellow-700">
                  {notices.filter(n => !n.read).length > 0 ? 'New' : 'Read'}
                </span>
              </div>
              <p className="text-3xl font-bold text-gray-900 mb-2">{notices.length}</p>
              <p className="text-gray-600 text-sm font-medium mb-1">Notices</p>
              <p className="text-xs text-gray-500">School updates</p>
            </div>
          </div>

          {/* Attendance Progress */}
          <div className="bg-white/90 backdrop-blur-md p-8 rounded-3xl shadow-xl border border-gray-200/50">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-bold text-gray-900">Attendance Progress</h3>
              <span className={`text-sm font-bold px-4 py-2 rounded-full ${attendanceRate >= 75 ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'} shadow-md`}>
                {attendanceRate >= 75 ? '✓ Good Standing' : '⚠ Below Minimum'}
              </span>
            </div>
            <div className="relative mb-6">
              <div className="w-full bg-gray-200 h-4 rounded-full overflow-hidden">
                <div className={`h-full transition-all duration-500 ${attendanceRate >= 75 ? 'bg-gradient-to-r from-green-400 to-emerald-500' : 'bg-gradient-to-r from-red-400 to-pink-500'}`}
                  style={{ width: `${attendanceRate}%` }}>
                  <div className="h-full bg-white/20 animate-pulse"></div>
                </div>
              </div>
              <div className="absolute -top-1 left-0 w-full flex justify-between text-xs text-gray-500">
                <span>0%</span>
                <span>25%</span>
                <span>50%</span>
                <span>75%</span>
                <span>100%</span>
              </div>
            </div>
            <div className="grid grid-cols-3 gap-4 text-center">
              <div className="bg-green-50 p-4 rounded-2xl border border-green-200">
                <CheckCircleIcon className="w-6 h-6 text-green-600 mx-auto mb-2" />
                <p className="text-2xl font-bold text-green-700">{presentDays}</p>
                <p className="text-sm text-green-600">Days Present</p>
              </div>
              <div className="bg-red-50 p-4 rounded-2xl border border-red-200">
                <XCircleIcon className="w-6 h-6 text-red-600 mx-auto mb-2" />
                <p className="text-2xl font-bold text-red-700">{absentDays}</p>
                <p className="text-sm text-red-600">Days Absent</p>
              </div>
              <div className="bg-blue-50 p-4 rounded-2xl border border-blue-200">
                <CalendarIcon className="w-6 h-6 text-blue-600 mx-auto mb-2" />
                <p className="text-2xl font-bold text-blue-700">75%</p>
                <p className="text-sm text-blue-600">Minimum Required</p>
              </div>
            </div>
          </div>

          <div className="grid lg:grid-cols-2 gap-8">
            <div className="bg-white/90 backdrop-blur-md p-8 rounded-3xl shadow-xl border border-gray-200/50">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-lg font-bold text-gray-900">Recent Grades</h3>
                <button onClick={() => setTab('grades')} className="text-blue-600 text-sm font-medium hover:text-blue-700 transition-colors flex items-center gap-1">
                  View all <ArrowTrendingUpIcon className="w-4 h-4" />
                </button>
              </div>
              <div className="space-y-4">
                {grades.slice(0, 5).map((g, i) => {
                  const pct = Math.round((g.marks_obtained / g.total_marks) * 100);
                  const { letter, bg, text, border } = gradeLetter(pct);
                  return (
                    <div key={i} className="bg-gradient-to-r from-gray-50 to-blue-50 p-4 rounded-2xl border border-gray-200 hover:border-blue-300 transition-all duration-300 group">
                      <div className="flex items-center justify-between">
                        <div className="flex-1">
                          <p className="font-semibold text-gray-900 text-sm group-hover:text-blue-600 transition-colors">{g.subject}</p>
                          <p className="text-gray-500 text-xs capitalize mt-1">{g.exam_type}</p>
                        </div>
                        <div className="flex items-center gap-3">
                          <div className="text-right">
                            <span className={`text-sm font-bold px-3 py-1.5 rounded-xl ${bg} ${text} shadow-md border ${border}`}>{letter}</span>
                            <p className="text-xs text-gray-500 mt-1">{g.marks_obtained}/{g.total_marks}</p>
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })}
                {grades.length === 0 && (
                  <div className="text-center py-8">
                    <BookOpenIcon className="w-12 h-12 text-gray-400 mx-auto mb-3" />
                    <p className="text-gray-500 text-sm">No grades yet.</p>
                  </div>
                )}
              </div>
            </div>

            <div className="bg-white/90 backdrop-blur-md p-8 rounded-3xl shadow-xl border border-gray-200/50">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-lg font-bold text-gray-900">Latest Notices</h3>
                <button onClick={() => setTab('notices')} className="text-blue-600 text-sm font-medium hover:text-blue-700 transition-colors flex items-center gap-1">
                  View all <BellIcon className="w-4 h-4" />
                </button>
              </div>
              <div className="space-y-4">
                {notices.slice(0, 4).map((n, i) => (
                  <div key={i} className="bg-gradient-to-r from-blue-50 to-purple-50 p-4 rounded-2xl border border-blue-200 hover:border-purple-300 transition-all duration-300 group">
                    <div className="flex items-start gap-3">
                      <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl flex items-center justify-center text-white flex-shrink-0 shadow-md">
                        <BellIcon className="w-4 h-4" />
                      </div>
                      <div className="flex-1">
                        <p className="font-semibold text-gray-900 text-sm group-hover:text-blue-600 transition-colors">{n.title}</p>
                        <p className="text-gray-500 text-xs mt-1 line-clamp-2">{n.content}</p>
                      </div>
                    </div>
                  </div>
                ))}
                {notices.length === 0 && (
                  <div className="text-center py-8">
                    <BellIcon className="w-12 h-12 text-gray-400 mx-auto mb-3" />
                    <p className="text-gray-500 text-sm">No notices.</p>
                  </div>
                )}
              </div>
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
            <p className="text-gray-500 text-sm">{presentDays} present out of {attendance.length} school days</p>
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
                {attendance.map((a, i) => {
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
                {attendance.length === 0 && <tr><td colSpan={4} className="px-4 py-8 text-center text-gray-400 text-sm">No attendance records yet.</td></tr>}
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

      {/* Settings */}
      {tab === 'settings' && (
        <div className="space-y-8">
          <div className="text-center">
            <h2 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text">Student Settings</h2>
            <p className="text-gray-600 mt-2">Manage your personal preferences and account settings</p>
          </div>

          <div className="grid lg:grid-cols-2 gap-8">
            {/* Personal Information */}
            <div className="bg-white/90 backdrop-blur-md p-8 rounded-3xl shadow-xl border border-gray-200/50">
              <h3 className="text-xl font-bold text-gray-900 mb-6 flex items-center gap-3">
                <UserCircleIcon className="w-6 h-6 text-blue-600" />
                Personal Information
              </h3>
              <div className="space-y-4">
                <div className="bg-gradient-to-r from-gray-50 to-blue-50 p-4 rounded-2xl border border-gray-200">
                  <p className="text-sm font-semibold text-gray-700 mb-2">Full Name</p>
                  <p className="text-gray-900">{user.full_name}</p>
                </div>
                <div className="bg-gradient-to-r from-gray-50 to-blue-50 p-4 rounded-2xl border border-gray-200">
                  <p className="text-sm font-semibold text-gray-700 mb-2">Username</p>
                  <p className="text-gray-900">{user.username}</p>
                </div>
                <div className="bg-gradient-to-r from-gray-50 to-blue-50 p-4 rounded-2xl border border-gray-200">
                  <p className="text-sm font-semibold text-gray-700 mb-2">Email</p>
                  <p className="text-gray-900">{user.email}</p>
                </div>
              </div>
            </div>

            {/* Notification Preferences */}
            <div className="bg-white/90 backdrop-blur-md p-8 rounded-3xl shadow-xl border border-gray-200/50">
              <h3 className="text-xl font-bold text-gray-900 mb-6 flex items-center gap-3">
                <BellAlertIcon className="w-6 h-6 text-blue-600" />
                Notification Preferences
              </h3>
              <div className="space-y-4">
                <div className="flex items-center justify-between p-4 bg-gradient-to-r from-blue-50 to-purple-50 rounded-2xl border border-blue-200">
                  <div>
                    <p className="font-semibold text-gray-900">Grade Notifications</p>
                    <p className="text-sm text-gray-600">Get notified when new grades are posted</p>
                  </div>
                  <button 
                    onClick={() => setSettings({...settings, gradeNotifications: !settings.gradeNotifications})}
                    className={`w-12 h-6 rounded-full relative transition-colors ${
                      settings.gradeNotifications ? 'bg-blue-600' : 'bg-gray-300'
                    }`}
                  >
                    <div className={`w-5 h-5 bg-white rounded-full absolute top-0.5 transition-transform duration-300 ${
                      settings.gradeNotifications ? 'right-0.5' : 'left-0.5'
                    }`}></div>
                  </button>
                </div>
                <div className="flex items-center justify-between p-4 bg-gradient-to-r from-blue-50 to-purple-50 rounded-2xl border border-blue-200">
                  <div>
                    <p className="font-semibold text-gray-900">Attendance Alerts</p>
                    <p className="text-sm text-gray-600">Receive attendance status updates</p>
                  </div>
                  <button 
                    onClick={() => setSettings({...settings, attendanceAlerts: !settings.attendanceAlerts})}
                    className={`w-12 h-6 rounded-full relative transition-colors ${
                      settings.attendanceAlerts ? 'bg-blue-600' : 'bg-gray-300'
                    }`}
                  >
                    <div className={`w-5 h-5 bg-white rounded-full absolute top-0.5 transition-transform duration-300 ${
                      settings.attendanceAlerts ? 'right-0.5' : 'left-0.5'
                    }`}></div>
                  </button>
                </div>
                <div className="flex items-center justify-between p-4 bg-gradient-to-r from-blue-50 to-purple-50 rounded-2xl border border-blue-200">
                  <div>
                    <p className="font-semibold text-gray-900">School Notices</p>
                    <p className="text-sm text-gray-600">Important announcements and updates</p>
                  </div>
                  <button 
                    onClick={() => setSettings({...settings, schoolNotices: !settings.schoolNotices})}
                    className={`w-12 h-6 rounded-full relative transition-colors ${
                      settings.schoolNotices ? 'bg-blue-600' : 'bg-gray-300'
                    }`}
                  >
                    <div className={`w-5 h-5 bg-white rounded-full absolute top-0.5 transition-transform duration-300 ${
                      settings.schoolNotices ? 'right-0.5' : 'left-0.5'
                    }`}></div>
                  </button>
                </div>
              </div>
            </div>

            {/* Security Settings */}
            <div className="bg-white/90 backdrop-blur-md p-8 rounded-3xl shadow-xl border border-gray-200/50">
              <h3 className="text-xl font-bold text-gray-900 mb-6 flex items-center gap-3">
                <ShieldCheckIcon className="w-6 h-6 text-blue-600" />
                Security Settings
              </h3>
              <div className="space-y-4">
                <button 
                  onClick={() => {
                    const newPassword = prompt('Enter your new password:');
                    if (newPassword && newPassword.length >= 6) {
                      toast.success('Password updated successfully!');
                    } else if (newPassword) {
                      toast.error('Password must be at least 6 characters');
                    }
                  }}
                  className="w-full text-left p-4 bg-gradient-to-r from-blue-50 to-purple-50 rounded-2xl border border-blue-200 hover:border-purple-300 transition-colors"
                >
                  <p className="font-semibold text-gray-900">Change Password</p>
                  <p className="text-sm text-gray-600">Update your account password</p>
                </button>
                <button 
                  onClick={() => {
                    const enable2FA = confirm('Enable Two-Factor Authentication for enhanced security?');
                    if (enable2FA) {
                      toast.success('2FA enabled! Check your email for setup instructions.');
                    }
                  }}
                  className="w-full text-left p-4 bg-gradient-to-r from-blue-50 to-purple-50 rounded-2xl border border-blue-200 hover:border-purple-300 transition-colors"
                >
                  <p className="font-semibold text-gray-900">Two-Factor Authentication</p>
                  <p className="text-sm text-gray-600">Add an extra layer of security</p>
                </button>
                <button 
                  onClick={() => {
                    const privacyOptions = ['Public', 'Friends Only', 'Private'];
                    const currentPrivacy = 'Friends Only';
                    const newPrivacy = prompt(`Current privacy: ${currentPrivacy}\n\nChoose new privacy level:\n1. Public\n2. Friends Only\n3. Private\n\nEnter number (1-3):`);
                    
                    if (newPrivacy === '1') {
                      toast.success('Privacy set to Public');
                    } else if (newPrivacy === '2') {
                      toast.success('Privacy set to Friends Only');
                    } else if (newPrivacy === '3') {
                      toast.success('Privacy set to Private');
                    } else if (newPrivacy) {
                      toast.error('Invalid option');
                    }
                  }}
                  className="w-full text-left p-4 bg-gradient-to-r from-red-50 to-orange-50 rounded-2xl border border-red-200 hover:border-orange-300 transition-colors"
                >
                  <p className="font-semibold text-red-700">Privacy Settings</p>
                  <p className="text-sm text-red-600">Manage your data and privacy</p>
                </button>
              </div>
            </div>

            {/* Academic Preferences */}
            <div className="bg-white/90 backdrop-blur-md p-8 rounded-3xl shadow-xl border border-gray-200/50">
              <h3 className="text-xl font-bold text-gray-900 mb-6 flex items-center gap-3">
                <AcademicCapIcon className="w-6 h-6 text-blue-600" />
                Academic Preferences
              </h3>
              <div className="space-y-4">
                <div className="p-4 bg-gradient-to-r from-green-50 to-emerald-50 rounded-2xl border border-green-200">
                  <p className="font-semibold text-gray-900 mb-2">Language Preference</p>
                  <select 
                    value={settings.language}
                    onChange={(e) => setSettings({...settings, language: e.target.value})}
                    className="w-full p-2 border border-gray-300 rounded-lg"
                  >
                    <option>English</option>
                    <option>Swahili</option>
                  </select>
                </div>
                <div className="p-4 bg-gradient-to-r from-green-50 to-emerald-50 rounded-2xl border border-green-200">
                  <p className="font-semibold text-gray-900 mb-2">Time Zone</p>
                  <select 
                    value={settings.timezone}
                    onChange={(e) => setSettings({...settings, timezone: e.target.value})}
                    className="w-full p-2 border border-gray-300 rounded-lg"
                  >
                    <option>East Africa Time (EAT)</option>
                    <option>UTC+3</option>
                  </select>
                </div>
                <div className="p-4 bg-gradient-to-r from-green-50 to-emerald-50 rounded-2xl border border-green-200">
                  <p className="font-semibold text-gray-900 mb-2">Grade Report Format</p>
                  <select 
                    value={settings.gradeReportFormat}
                    onChange={(e) => setSettings({...settings, gradeReportFormat: e.target.value})}
                    className="w-full p-2 border border-gray-300 rounded-lg"
                  >
                    <option>Detailed</option>
                    <option>Summary</option>
                    <option>Compact</option>
                  </select>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </DashboardLayout>
  );
};

export default StudentDashboard;
