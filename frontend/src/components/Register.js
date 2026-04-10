import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import axios from 'axios';
import toast from 'react-hot-toast';

const Register = () => {
  const navigate = useNavigate();
  const [form, setForm] = useState({ full_name: '', username: '', email: '', password: '', confirm_password: '', role: 'student' });
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (form.password !== form.confirm_password) {
      toast.error('Passwords do not match');
      return;
    }
    if (form.password.length < 6) {
      toast.error('Password must be at least 6 characters');
      return;
    }
    setLoading(true);
    try {
      await axios.post('http://localhost:8000/api/auth/register', {
        full_name: form.full_name,
        username: form.username,
        email: form.email,
        password: form.password,
        role: form.role,
      });
      toast.success('Account created! Please login.');
      navigate('/login');
    } catch (error) {
      toast.error(error.response?.data?.detail || 'Registration failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex bg-gray-50">
      {/* Left Panel */}
      <div className="hidden lg:flex lg:w-1/2 bg-gradient-to-br from-indigo-900 via-blue-900 to-blue-800 flex-col justify-between p-12 relative overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-20 right-10 w-64 h-64 bg-indigo-400 rounded-full blur-3xl"></div>
          <div className="absolute bottom-20 left-10 w-80 h-80 bg-blue-400 rounded-full blur-3xl"></div>
        </div>
        <div className="relative z-10">
          <div className="flex items-center space-x-3 mb-16">
            <div className="w-12 h-12 bg-white/20 backdrop-blur rounded-xl flex items-center justify-center font-black text-white text-xl">A</div>
            <div>
              <p className="font-black text-white text-xl">Akilli School</p>
              <p className="text-blue-300 text-sm">Excellence in Education</p>
            </div>
          </div>
          <h2 className="text-4xl font-black text-white leading-tight mb-4">
            Join the <span className="text-yellow-400">Akilli</span> School Community
          </h2>
          <p className="text-blue-200 leading-relaxed mb-8">
            Create your account to access the school portal and stay connected with your academic journey.
          </p>
          <div className="space-y-4">
            {[
              { icon: '📊', text: 'Track your academic performance in real-time' },
              { icon: '📋', text: 'View attendance records and stay on track' },
              { icon: '📢', text: 'Receive important school notices instantly' },
              { icon: '🎓', text: 'Access resources and assignments anytime' },
            ].map((item, i) => (
              <div key={i} className="flex items-center gap-3 text-blue-100">
                <span className="text-xl">{item.icon}</span>
                <span className="text-sm">{item.text}</span>
              </div>
            ))}
          </div>
        </div>
        <p className="relative z-10 text-blue-400 text-sm">© 2025 Akilli School. All rights reserved.</p>
      </div>

      {/* Right Panel */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-8 overflow-y-auto">
        <div className="w-full max-w-md py-8">
          <div className="lg:hidden flex items-center space-x-3 mb-8">
            <div className="w-10 h-10 bg-blue-700 rounded-xl flex items-center justify-center font-black text-white">A</div>
            <div>
              <p className="font-black text-gray-900">Akilli School</p>
              <p className="text-blue-600 text-xs">Excellence in Education</p>
            </div>
          </div>

          <h1 className="text-3xl font-black text-gray-900 mb-2">Create Account</h1>
          <p className="text-gray-500 mb-8">Fill in your details to get started</p>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Full Name</label>
              <input name="full_name" value={form.full_name} onChange={handleChange}
                placeholder="e.g. John Doe" required
                className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-blue-500 focus:outline-none transition-colors bg-white placeholder-gray-400" />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Username</label>
                <input name="username" value={form.username} onChange={handleChange}
                  placeholder="johndoe" required
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-blue-500 focus:outline-none transition-colors bg-white placeholder-gray-400" />
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Role</label>
                <select name="role" value={form.role} onChange={handleChange}
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-blue-500 focus:outline-none transition-colors bg-white text-gray-700">
                  <option value="student">Student</option>
                  <option value="teacher">Teacher</option>
                </select>
              </div>
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Email Address</label>
              <input name="email" value={form.email} onChange={handleChange}
                placeholder="john@email.com" type="email" required
                className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-blue-500 focus:outline-none transition-colors bg-white placeholder-gray-400" />
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Password</label>
              <div className="relative">
                <input name="password" value={form.password} onChange={handleChange}
                  placeholder="Min. 6 characters" type={showPassword ? 'text' : 'password'} required
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-blue-500 focus:outline-none transition-colors bg-white placeholder-gray-400 pr-12" />
                <button type="button" onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 text-sm">
                  {showPassword ? 'Hide' : 'Show'}
                </button>
              </div>
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Confirm Password</label>
              <input name="confirm_password" value={form.confirm_password} onChange={handleChange}
                placeholder="Repeat your password" type="password" required
                className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-blue-500 focus:outline-none transition-colors bg-white placeholder-gray-400" />
            </div>

            <button type="submit" disabled={loading}
              className="w-full bg-blue-700 text-white py-3.5 rounded-xl font-bold text-base hover:bg-blue-800 transition-all duration-200 shadow-lg hover:shadow-xl disabled:opacity-60 disabled:cursor-not-allowed mt-2">
              {loading ? (
                <span className="flex items-center justify-center gap-2">
                  <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24" fill="none">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z"></path>
                  </svg>
                  Creating Account...
                </span>
              ) : 'Create Account'}
            </button>
          </form>

          <div className="mt-6 text-center">
            <p className="text-gray-500 text-sm">
              Already have an account?{' '}
              <Link to="/login" className="text-blue-700 font-semibold hover:underline">Sign in here</Link>
            </p>
            <p className="text-gray-400 text-sm mt-2">
              <Link to="/" className="hover:text-gray-600 transition">← Back to Home</Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Register;
