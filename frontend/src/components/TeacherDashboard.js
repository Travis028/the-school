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

const TeacherDashboard = () => {
  const token = localStorage.getItem('token');
  const user = JSON.parse(localStorage.getItem('user') || '{}');
  const [tab, setTab] = useState('dashboard');
  const [students, setStudents] = useState([]);
  const [notices, setNotices] = useState([]);
  const [grades, setGrades] = useState([]);
  const [attendances, setAttendances] = useState([]);
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
    { key: 'dashboard', label: 'Dashboard' },
    { key: 'students', label: 'Students' },
    { key: 'grades', label: 'Grades' },
    { key: 'attendance', label: 'Attendance' },
    { key: 'notices', label: 'Notices' },
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
        <div className="space-y-6">
          <div>
            <h2 className="text-xl font-black text-gray-900">Overview</h2>
            <p className="text-gray-500 text-sm mt-0.5">Welcome back, {user.full_name}</p>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {[
              { label: 'Students', value: students.length, border: 'border-blue-600' },
              { label: 'Grades Entered', value: grades.length, border: 'border-green-600' },
              { label: 'Attendance Records', value: attendances.length, border: 'border-purple-600' },
              { label: 'Notices', value: notices.length, border: 'border-yellow-500' },
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
    </DashboardLayout>
  );
};

export default TeacherDashboard;
