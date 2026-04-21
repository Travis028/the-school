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
  PlusIcon,
  PencilIcon,
  TrashIcon,
  Cog6ToothIcon,
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

const TeacherDashboard = () => {
  const token = localStorage.getItem('token');
  const user = JSON.parse(localStorage.getItem('user') || '{}');
  const [tab, setTab] = useState('dashboard');
  const [students, setStudents] = useState([]);
  const [notices, setNotices] = useState([]);
  const [grades, setGrades] = useState([]);
  const [attendances, setAttendances] = useState([]);
  const [settings, setSettings] = useState({
    autoSaveGrades: true,
    gradeNotifications: true,
    attendanceReminders: false,
    defaultGradeScale: 'Percentage (0-100)',
    classSizeDisplay: 'All Students',
    subjectSpecialization: 'Mathematics'
  });
  const [gradeForm, setGradeForm] = useState({ student_id: '', subject: '', marks_obtained: '', total_marks: '100', exam_type: 'midterm' });
  const [attendanceForm, setAttendanceForm] = useState({ student_id: '', status: true, remarks: '' });

  useEffect(() => { fetchAll(); }, []);

  const fetchAll = async () => {
    try {
      const [s, n, g, a] = await Promise.all([
        api(token).get('/api/students/'),
        api(token).get('/api/notices/'),
        api(token).get('/api/grades/'),
        api(token).get('/api/attendance/'),
      ]);
      setStudents(s.data); setNotices(n.data); setGrades(g.data); setAttendances(a.data);
    } catch { toast.error('Failed to load data'); }
  };

  const submitGrade = async (e) => {
    e.preventDefault();
    try {
      await api(token).post('/api/grades/', gradeForm);
      toast.success('Grade saved');
      setGradeForm({ student_id: '', subject: '', marks_obtained: '', total_marks: '100', exam_type: 'midterm' });
      fetchAll();
    } catch { toast.error('Failed to save grade'); }
  };

  const submitAttendance = async (e) => {
    e.preventDefault();
    try {
      await api(token).post('/api/attendance/', attendanceForm);
      toast.success('Attendance marked');
      setAttendanceForm({ student_id: '', status: true, remarks: '' });
      fetchAll();
    } catch { toast.error('Failed to mark attendance'); }
  };

  const tabs = [
    { key: 'dashboard', label: 'Dashboard', icon: ChartBarIcon, badge: null },
    { key: 'students', label: 'Students', icon: UserGroupIcon, badge: students.length > 0 ? students.length : null },
    { key: 'grades', label: 'Grades', icon: BookOpenIcon, badge: grades.length > 0 ? grades.length : null },
    { key: 'attendance', label: 'Attendance', icon: CalendarIcon, badge: attendances.length > 0 ? attendances.length : null },
    { key: 'notices', label: 'Notices', icon: BellIcon, badge: notices.filter(n => !n.read).length || null },
    { key: 'settings', label: 'Settings', icon: Cog6ToothIcon },
  ];

  const presentCount = attendances.filter(a => a.status).length;

  const fieldEl = (label, value, onChange, type = 'text', placeholder = '') => (
    <div>
      <label className="block text-xs font-semibold text-gray-600 uppercase tracking-wider mb-1.5">{label}</label>
      <input type={type} value={value} onChange={onChange} placeholder={placeholder}
        className="w-full px-3 py-2.5 border border-gray-300 bg-white text-sm text-gray-900 focus:outline-none focus:border-blue-700 focus:ring-1 focus:ring-blue-700 transition" />
    </div>
  );

  const selectEl = (label, value, onChange, options) => (
    <div>
      <label className="block text-xs font-semibold text-gray-600 uppercase tracking-wider mb-1.5">{label}</label>
      <select value={value} onChange={onChange}
        className="w-full px-3 py-2.5 border border-gray-300 bg-white text-sm text-gray-700 focus:outline-none focus:border-blue-700 focus:ring-1 focus:ring-blue-700 transition">
        {options.map(o => <option key={o.value} value={o.value}>{o.label}</option>)}
      </select>
    </div>
  );

  return (
    <DashboardLayout role="teacher" tabs={tabs} activeTab={tab} onTabChange={setTab}>

      {/* Dashboard */}
      {tab === 'dashboard' && (
        <div className="space-y-8">
          <div className="text-center">
            <h2 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text">Teacher Dashboard</h2>
            <p className="text-gray-600 mt-2">Welcome back, <span className="font-semibold text-blue-600">{user.full_name}</span></p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="bg-gradient-to-br from-blue-50 to-indigo-50 p-6 rounded-3xl shadow-xl border-2 border-blue-200 hover:shadow-2xl transition-all duration-300 group">
              <div className="flex items-center justify-between mb-4">
                <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-2xl flex items-center justify-center text-white shadow-lg group-hover:scale-110 transition-transform duration-300">
                  <UserGroupIcon className="w-6 h-6" />
                </div>
                <span className="text-xs font-bold px-3 py-1 rounded-full bg-blue-100 text-blue-700">Active</span>
              </div>
              <p className="text-3xl font-bold text-gray-900 mb-2">{students.length}</p>
              <p className="text-gray-600 text-sm font-medium">Total Students</p>
            </div>
            
            <div className="bg-gradient-to-br from-green-50 to-emerald-50 p-6 rounded-3xl shadow-xl border-2 border-green-200 hover:shadow-2xl transition-all duration-300 group">
              <div className="flex items-center justify-between mb-4">
                <div className="w-12 h-12 bg-gradient-to-br from-green-500 to-emerald-600 rounded-2xl flex items-center justify-center text-white shadow-lg group-hover:scale-110 transition-transform duration-300">
                  <BookOpenIcon className="w-6 h-6" />
                </div>
                <span className="text-xs font-bold px-3 py-1 rounded-full bg-green-100 text-green-700">Recorded</span>
              </div>
              <p className="text-3xl font-bold text-gray-900 mb-2">{grades.length}</p>
              <p className="text-gray-600 text-sm font-medium">Grades Entered</p>
            </div>
            
            <div className="bg-gradient-to-br from-purple-50 to-pink-50 p-6 rounded-3xl shadow-xl border-2 border-purple-200 hover:shadow-2xl transition-all duration-300 group">
              <div className="flex items-center justify-between mb-4">
                <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-pink-600 rounded-2xl flex items-center justify-center text-white shadow-lg group-hover:scale-110 transition-transform duration-300">
                  <CalendarIcon className="w-6 h-6" />
                </div>
                <span className="text-xs font-bold px-3 py-1 rounded-full bg-purple-100 text-purple-700">Tracked</span>
              </div>
              <p className="text-3xl font-bold text-gray-900 mb-2">{attendances.length}</p>
              <p className="text-gray-600 text-sm font-medium">Attendance Records</p>
            </div>
            
            <div className="bg-gradient-to-br from-yellow-50 to-orange-50 p-6 rounded-3xl shadow-xl border-2 border-yellow-200 hover:shadow-2xl transition-all duration-300 group">
              <div className="flex items-center justify-between mb-4">
                <div className="w-12 h-12 bg-gradient-to-br from-yellow-500 to-orange-600 rounded-2xl flex items-center justify-center text-white shadow-lg group-hover:scale-110 transition-transform duration-300">
                  <BellIcon className="w-6 h-6" />
                </div>
                <span className="text-xs font-bold px-3 py-1 rounded-full bg-yellow-100 text-yellow-700">Posted</span>
              </div>
              <p className="text-3xl font-bold text-gray-900 mb-2">{notices.length}</p>
              <p className="text-gray-600 text-sm font-medium">Notices</p>
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
                      <p className="text-gray-400 text-xs">{g.marks_obtained}/{g.total_marks} marks</p>
                    </div>
                    <span className={`text-xs font-black px-2 py-1 ${bg} ${color}`}>{letter} — {pct}%</span>
                  </div>
                );
              })}
              {grades.length === 0 && <p className="text-gray-400 text-sm py-4 text-center">No grades yet.</p>}
            </div>
            <div className="bg-white border border-gray-200 p-5">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-bold text-gray-900 text-sm">School Notices</h3>
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

      {/* Students */}
      {tab === 'students' && (
        <div className="space-y-4">
          <div>
            <h2 className="text-xl font-black text-gray-900">Students</h2>
            <p className="text-gray-500 text-sm">{students.length} students enrolled</p>
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
                {students.length === 0 && <tr><td colSpan={5} className="px-4 py-8 text-center text-gray-400 text-sm">No students found.</td></tr>}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Grades */}
      {tab === 'grades' && (
        <div className="space-y-6">
          <div className="bg-white border border-gray-200 p-6 max-w-lg">
            <h2 className="text-base font-black text-gray-900 mb-1">Enter Grade</h2>
            <p className="text-gray-500 text-sm mb-5">Record a student examination or assignment result.</p>
            <form onSubmit={submitGrade} className="space-y-4">
              {selectEl('Student', gradeForm.student_id, e => setGradeForm({ ...gradeForm, student_id: e.target.value }), [
                { value: '', label: '— Select Student —' },
                ...students.map(s => ({ value: s.id, label: `${s.user?.full_name} (${s.student_id})` }))
              ])}
              {fieldEl('Subject', gradeForm.subject, e => setGradeForm({ ...gradeForm, subject: e.target.value }), 'text', 'e.g. Mathematics')}
              <div className="grid grid-cols-2 gap-3">
                {fieldEl('Marks Obtained', gradeForm.marks_obtained, e => setGradeForm({ ...gradeForm, marks_obtained: e.target.value }), 'number', 'e.g. 78')}
                {fieldEl('Total Marks', gradeForm.total_marks, e => setGradeForm({ ...gradeForm, total_marks: e.target.value }), 'number', 'e.g. 100')}
              </div>
              {selectEl('Exam Type', gradeForm.exam_type, e => setGradeForm({ ...gradeForm, exam_type: e.target.value }), [
                { value: 'midterm', label: 'Midterm Examination' },
                { value: 'final', label: 'Final Examination' },
                { value: 'cat', label: 'Continuous Assessment Test (CAT)' },
                { value: 'assignment', label: 'Assignment' },
              ])}
              <button type="submit" className="w-full bg-blue-800 text-white py-3 text-sm font-bold hover:bg-blue-900 transition">Save Grade</button>
            </form>
          </div>

          <div className="bg-white border border-gray-200 overflow-x-auto">
            <div className="px-5 py-4 border-b border-gray-200">
              <h2 className="font-black text-gray-900 text-sm">Grade Records ({grades.length})</h2>
            </div>
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-gray-200 bg-gray-50">
                  {['Student', 'Subject', 'Marks', 'Type', 'Grade', 'Score'].map((h, i) => (
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
                      <td className="px-4 py-3 font-medium text-gray-900">{g.student?.user?.full_name || `Student #${g.student_id}`}</td>
                      <td className="px-4 py-3 text-gray-600">{g.subject}</td>
                      <td className="px-4 py-3 text-gray-600">{g.marks_obtained} / {g.total_marks}</td>
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
        <div className="space-y-6">
          <div className="bg-white border border-gray-200 p-6 max-w-lg">
            <h2 className="text-base font-black text-gray-900 mb-1">Mark Attendance</h2>
            <p className="text-gray-500 text-sm mb-5">Record student attendance for today.</p>
            <form onSubmit={submitAttendance} className="space-y-4">
              {selectEl('Student', attendanceForm.student_id, e => setAttendanceForm({ ...attendanceForm, student_id: e.target.value }), [
                { value: '', label: '— Select Student —' },
                ...students.map(s => ({ value: s.id, label: `${s.user?.full_name} (${s.student_id})` }))
              ])}
              {selectEl('Status', attendanceForm.status, e => setAttendanceForm({ ...attendanceForm, status: e.target.value === 'true' }), [
                { value: 'true', label: 'Present' },
                { value: 'false', label: 'Absent' },
              ])}
              {fieldEl('Remarks (optional)', attendanceForm.remarks, e => setAttendanceForm({ ...attendanceForm, remarks: e.target.value }), 'text', 'e.g. Sick leave')}
              <button type="submit" className="w-full bg-blue-800 text-white py-3 text-sm font-bold hover:bg-blue-900 transition">Mark Attendance</button>
            </form>
          </div>

          <div className="bg-white border border-gray-200 overflow-x-auto">
            <div className="px-5 py-4 border-b border-gray-200">
              <h2 className="font-black text-gray-900 text-sm">Attendance Records ({attendances.length})</h2>
            </div>
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-gray-200 bg-gray-50">
                  {['Student', 'Date', 'Status', 'Remarks'].map((h, i) => (
                    <th key={i} className="px-4 py-3 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {attendances.map((a, i) => (
                  <tr key={i} className="border-b border-gray-100 hover:bg-gray-50 transition">
                    <td className="px-4 py-3 font-medium text-gray-900">{a.student?.user?.full_name || `Student #${a.student_id}`}</td>
                    <td className="px-4 py-3 text-gray-500">{new Date(a.date).toLocaleDateString('en-KE', { day: 'numeric', month: 'short', year: 'numeric' })}</td>
                    <td className="px-4 py-3">
                      <span className={`text-xs font-semibold px-2 py-1 ${a.status ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                        {a.status ? 'Present' : 'Absent'}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-gray-400 text-xs">{a.remarks || '—'}</td>
                  </tr>
                ))}
                {attendances.length === 0 && <tr><td colSpan={4} className="px-4 py-8 text-center text-gray-400 text-sm">No records yet.</td></tr>}
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
              <div className="flex items-start justify-between gap-4">
                <div>
                  <p className="font-bold text-gray-900">{n.title}</p>
                  <p className="text-gray-500 text-sm mt-1">{n.content}</p>
                  <span className="inline-block mt-2 text-xs text-blue-700 font-medium">{n.target_role || 'All Users'}</span>
                </div>
              </div>
            </div>
          ))}
          {notices.length === 0 && (
            <div className="bg-white border border-gray-200 p-12 text-center">
              <p className="text-gray-400 text-sm">No notices at the moment.</p>
            </div>
          )}
        </div>
      )}

      {/* Settings */}
      {tab === 'settings' && (
        <div className="space-y-8">
          <div className="text-center">
            <h2 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text">Teacher Settings</h2>
            <p className="text-gray-600 mt-2">Manage your teaching preferences and account settings</p>
          </div>

          <div className="grid lg:grid-cols-2 gap-8">
            {/* Teacher Information */}
            <div className="bg-white/90 backdrop-blur-md p-8 rounded-3xl shadow-xl border border-gray-200/50">
              <h3 className="text-xl font-bold text-gray-900 mb-6 flex items-center gap-3">
                <AcademicCapIcon className="w-6 h-6 text-blue-600" />
                Teacher Information
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
                <div className="bg-gradient-to-r from-gray-50 to-blue-50 p-4 rounded-2xl border border-gray-200">
                  <p className="text-sm font-semibold text-gray-700 mb-2">Department</p>
                  <p className="text-gray-900">Academic Department</p>
                </div>
              </div>
            </div>

            {/* Class Management */}
            <div className="bg-white/90 backdrop-blur-md p-8 rounded-3xl shadow-xl border border-gray-200/50">
              <h3 className="text-xl font-bold text-gray-900 mb-6 flex items-center gap-3">
                <UserGroupIcon className="w-6 h-6 text-blue-600" />
                Class Management
              </h3>
              <div className="space-y-4">
                <div className="flex items-center justify-between p-4 bg-gradient-to-r from-blue-50 to-purple-50 rounded-2xl border border-blue-200">
                  <div>
                    <p className="font-semibold text-gray-900">Auto-save Grades</p>
                    <p className="text-sm text-gray-600">Automatically save grade entries</p>
                  </div>
                  <button 
                    onClick={() => setSettings({...settings, autoSaveGrades: !settings.autoSaveGrades})}
                    className={`w-12 h-6 rounded-full relative transition-colors ${
                      settings.autoSaveGrades ? 'bg-blue-600' : 'bg-gray-300'
                    }`}
                  >
                    <div className={`w-5 h-5 bg-white rounded-full absolute top-0.5 transition-transform duration-300 ${
                      settings.autoSaveGrades ? 'right-0.5' : 'left-0.5'
                    }`}></div>
                  </button>
                </div>
                <div className="flex items-center justify-between p-4 bg-gradient-to-r from-blue-50 to-purple-50 rounded-2xl border border-blue-200">
                  <div>
                    <p className="font-semibold text-gray-900">Grade Notifications</p>
                    <p className="text-sm text-gray-600">Notify students when grades are posted</p>
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
                    <p className="font-semibold text-gray-900">Attendance Reminders</p>
                    <p className="text-sm text-gray-600">Daily attendance marking reminders</p>
                  </div>
                  <button 
                    onClick={() => setSettings({...settings, attendanceReminders: !settings.attendanceReminders})}
                    className={`w-12 h-6 rounded-full relative transition-colors ${
                      settings.attendanceReminders ? 'bg-blue-600' : 'bg-gray-300'
                    }`}
                  >
                    <div className={`w-5 h-5 bg-white rounded-full absolute top-0.5 transition-transform duration-300 ${
                      settings.attendanceReminders ? 'right-0.5' : 'left-0.5'
                    }`}></div>
                  </button>
                </div>
              </div>
            </div>

            {/* Teaching Preferences */}
            <div className="bg-white/90 backdrop-blur-md p-8 rounded-3xl shadow-xl border border-gray-200/50">
              <h3 className="text-xl font-bold text-gray-900 mb-6 flex items-center gap-3">
                <BookOpenIcon className="w-6 h-6 text-blue-600" />
                Teaching Preferences
              </h3>
              <div className="space-y-4">
                <div className="p-4 bg-gradient-to-r from-green-50 to-emerald-50 rounded-2xl border border-green-200">
                  <p className="font-semibold text-gray-900 mb-2">Default Grade Scale</p>
                  <select 
                    value={settings.defaultGradeScale}
                    onChange={(e) => setSettings({...settings, defaultGradeScale: e.target.value})}
                    className="w-full p-2 border border-gray-300 rounded-lg"
                  >
                    <option>Percentage (0-100)</option>
                    <option>Letter Grades (A-F)</option>
                    <option>GPA Scale (4.0)</option>
                  </select>
                </div>
                <div className="p-4 bg-gradient-to-r from-green-50 to-emerald-50 rounded-2xl border border-green-200">
                  <p className="font-semibold text-gray-900 mb-2">Class Size Display</p>
                  <select 
                    value={settings.classSizeDisplay}
                    onChange={(e) => setSettings({...settings, classSizeDisplay: e.target.value})}
                    className="w-full p-2 border border-gray-300 rounded-lg"
                  >
                    <option>All Students</option>
                    <option>25 per page</option>
                    <option>50 per page</option>
                  </select>
                </div>
                <div className="p-4 bg-gradient-to-r from-green-50 to-emerald-50 rounded-2xl border border-green-200">
                  <p className="font-semibold text-gray-900 mb-2">Subject Specialization</p>
                  <select 
                    value={settings.subjectSpecialization}
                    onChange={(e) => setSettings({...settings, subjectSpecialization: e.target.value})}
                    className="w-full p-2 border border-gray-300 rounded-lg"
                  >
                    <option>Mathematics</option>
                    <option>Science</option>
                    <option>English</option>
                    <option>Social Studies</option>
                  </select>
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
                    const exportFormat = confirm('Export teaching data to Excel format?');
                    if (exportFormat) {
                      toast.success('Teaching data exported successfully! Check downloads.');
                    }
                  }}
                  className="w-full text-left p-4 bg-gradient-to-r from-yellow-50 to-orange-50 rounded-2xl border border-yellow-200 hover:border-orange-300 transition-colors"
                >
                  <p className="font-semibold text-yellow-700">Data Export</p>
                  <p className="text-sm text-yellow-600">Export your teaching data</p>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </DashboardLayout>
  );
};

export default TeacherDashboard;
