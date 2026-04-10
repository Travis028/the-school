import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import toast from 'react-hot-toast';

const api = (token) => axios.create({
  baseURL: 'http://localhost:8000',
  headers: { Authorization: `Bearer ${token}` }
});

const TeacherDashboard = () => {
  const navigate = useNavigate();
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
      const [studentsRes, noticesRes, gradesRes, attendancesRes] = await Promise.all([
        api(token).get('/api/students/'),
        api(token).get('/api/notices/'),
        api(token).get('/api/grades/'),
        api(token).get('/api/attendance/'),
      ]);
      setStudents(studentsRes.data);
      setNotices(noticesRes.data);
      setGrades(gradesRes.data);
      setAttendances(attendancesRes.data);
    } catch { toast.error('Failed to load data'); }
  };

  const submitGrade = async (e) => {
    e.preventDefault();
    try {
      await api(token).post('/api/grades/', gradeForm);
      toast.success('Grade saved!');
      setGradeForm({ student_id: '', subject: '', marks_obtained: '', total_marks: '100', exam_type: 'midterm' });
      fetchAll();
    } catch { toast.error('Failed to save grade'); }
  };

  const submitAttendance = async (e) => {
    e.preventDefault();
    try {
      await api(token).post('/api/attendance/', attendanceForm);
      toast.success('Attendance marked!');
      setAttendanceForm({ student_id: '', status: true, remarks: '' });
      fetchAll();
    } catch { toast.error('Failed to mark attendance'); }
  };

  const handleLogout = () => { localStorage.clear(); navigate('/login'); };

  const tabs = ['dashboard', 'students', 'grades', 'attendance', 'notices'];

  return (
    <div className="min-h-screen bg-gray-50">
      <nav className="bg-blue-900 text-white shadow-lg">
        <div className="max-w-7xl mx-auto px-4 flex justify-between items-center h-16">
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 bg-yellow-400 rounded-full flex items-center justify-center font-bold text-blue-900">A</div>
            <span className="font-bold text-lg">Akilli School — Teacher</span>
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
            <h2 className="text-2xl font-bold text-blue-900 mb-6">Teacher Overview</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
              {[
                { label: 'My Students', value: students.length, color: 'bg-blue-500', icon: '🎓' },
                { label: 'Grades Entered', value: grades.length, color: 'bg-green-500', icon: '📝' },
                { label: 'Attendance Records', value: attendances.length, color: 'bg-purple-500', icon: '📋' },
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
              {notices.length === 0 && <p className="text-gray-400">No notices.</p>}
            </div>
          </div>
        )}

        {/* Students */}
        {tab === 'students' && (
          <div className="bg-white rounded-xl shadow p-6">
            <h2 className="text-xl font-bold mb-4">Students List</h2>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead><tr className="bg-gray-50 text-left">
                  <th className="p-3">Student ID</th><th className="p-3">Name</th><th className="p-3">Class</th><th className="p-3">Parent</th>
                </tr></thead>
                <tbody>
                  {students.map((s, i) => (
                    <tr key={i} className="border-t hover:bg-gray-50">
                      <td className="p-3">{s.student_id}</td>
                      <td className="p-3">{s.user?.full_name || '-'}</td>
                      <td className="p-3">{s.class_name}</td>
                      <td className="p-3">{s.parent_name}</td>
                    </tr>
                  ))}
                  {students.length === 0 && <tr><td colSpan={4} className="p-3 text-gray-400 text-center">No students found.</td></tr>}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Grades */}
        {tab === 'grades' && (
          <div className="space-y-6">
            <div className="bg-white rounded-xl shadow p-6 max-w-lg">
              <h2 className="text-xl font-bold mb-4">Enter Grade</h2>
              <form onSubmit={submitGrade} className="space-y-4">
                <select value={gradeForm.student_id} onChange={e => setGradeForm({ ...gradeForm, student_id: e.target.value })}
                  required className="w-full border rounded-lg px-4 py-2">
                  <option value="">Select Student</option>
                  {students.map(s => <option key={s.id} value={s.id}>{s.user?.full_name} ({s.student_id})</option>)}
                </select>
                <input value={gradeForm.subject} onChange={e => setGradeForm({ ...gradeForm, subject: e.target.value })}
                  placeholder="Subject" required className="w-full border rounded-lg px-4 py-2" />
                <div className="grid grid-cols-2 gap-4">
                  <input value={gradeForm.marks_obtained} onChange={e => setGradeForm({ ...gradeForm, marks_obtained: e.target.value })}
                    placeholder="Marks Obtained" type="number" required className="border rounded-lg px-4 py-2" />
                  <input value={gradeForm.total_marks} onChange={e => setGradeForm({ ...gradeForm, total_marks: e.target.value })}
                    placeholder="Total Marks" type="number" required className="border rounded-lg px-4 py-2" />
                </div>
                <select value={gradeForm.exam_type} onChange={e => setGradeForm({ ...gradeForm, exam_type: e.target.value })}
                  className="w-full border rounded-lg px-4 py-2">
                  <option value="midterm">Midterm</option>
                  <option value="final">Final</option>
                  <option value="cat">CAT</option>
                  <option value="assignment">Assignment</option>
                </select>
                <button type="submit" className="w-full bg-blue-900 text-white py-2 rounded-lg hover:bg-blue-800">Save Grade</button>
              </form>
            </div>
            <div className="bg-white rounded-xl shadow p-6">
              <h2 className="text-xl font-bold mb-4">Grade Records</h2>
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead><tr className="bg-gray-50 text-left">
                    <th className="p-3">Student</th><th className="p-3">Subject</th><th className="p-3">Marks</th><th className="p-3">Type</th><th className="p-3">%</th>
                  </tr></thead>
                  <tbody>
                    {grades.map((g, i) => (
                      <tr key={i} className="border-t hover:bg-gray-50">
                        <td className="p-3">{g.student?.user?.full_name || g.student_id}</td>
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
                    {grades.length === 0 && <tr><td colSpan={5} className="p-3 text-gray-400 text-center">No grades yet.</td></tr>}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* Attendance */}
        {tab === 'attendance' && (
          <div className="space-y-6">
            <div className="bg-white rounded-xl shadow p-6 max-w-lg">
              <h2 className="text-xl font-bold mb-4">Mark Attendance</h2>
              <form onSubmit={submitAttendance} className="space-y-4">
                <select value={attendanceForm.student_id} onChange={e => setAttendanceForm({ ...attendanceForm, student_id: e.target.value })}
                  required className="w-full border rounded-lg px-4 py-2">
                  <option value="">Select Student</option>
                  {students.map(s => <option key={s.id} value={s.id}>{s.user?.full_name} ({s.student_id})</option>)}
                </select>
                <select value={attendanceForm.status} onChange={e => setAttendanceForm({ ...attendanceForm, status: e.target.value === 'true' })}
                  className="w-full border rounded-lg px-4 py-2">
                  <option value="true">Present</option>
                  <option value="false">Absent</option>
                </select>
                <input value={attendanceForm.remarks} onChange={e => setAttendanceForm({ ...attendanceForm, remarks: e.target.value })}
                  placeholder="Remarks (optional)" className="w-full border rounded-lg px-4 py-2" />
                <button type="submit" className="w-full bg-blue-900 text-white py-2 rounded-lg hover:bg-blue-800">Mark Attendance</button>
              </form>
            </div>
            <div className="bg-white rounded-xl shadow p-6">
              <h2 className="text-xl font-bold mb-4">Attendance Records</h2>
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead><tr className="bg-gray-50 text-left">
                    <th className="p-3">Student</th><th className="p-3">Date</th><th className="p-3">Status</th><th className="p-3">Remarks</th>
                  </tr></thead>
                  <tbody>
                    {attendances.map((a, i) => (
                      <tr key={i} className="border-t hover:bg-gray-50">
                        <td className="p-3">{a.student?.user?.full_name || a.student_id}</td>
                        <td className="p-3">{new Date(a.date).toLocaleDateString()}</td>
                        <td className="p-3"><span className={`px-2 py-1 rounded-full text-xs font-bold ${a.status ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>{a.status ? 'Present' : 'Absent'}</span></td>
                        <td className="p-3">{a.remarks || '-'}</td>
                      </tr>
                    ))}
                    {attendances.length === 0 && <tr><td colSpan={4} className="p-3 text-gray-400 text-center">No records yet.</td></tr>}
                  </tbody>
                </table>
              </div>
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
                <span className="text-xs text-blue-600">{n.target_role || 'All Users'}</span>
              </div>
            ))}
            {notices.length === 0 && <p className="text-gray-400">No notices.</p>}
          </div>
        )}
      </div>
    </div>
  );
};

export default TeacherDashboard;
