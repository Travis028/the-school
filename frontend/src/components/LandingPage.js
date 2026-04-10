import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const LandingPage = () => {
  const navigate = useNavigate();
  const [menuOpen, setMenuOpen] = useState(false);

  const stats = [
    { label: 'Students', value: '1,200+' },
    { label: 'Teachers', value: '80+' },
    { label: 'Courses', value: '50+' },
    { label: 'Years of Excellence', value: '25+' },
  ];

  const features = [
    { icon: '📚', title: 'Academic Excellence', desc: 'World-class curriculum designed to nurture critical thinking and creativity.' },
    { icon: '🏆', title: 'Sports & Arts', desc: 'Comprehensive extracurricular programs to develop well-rounded students.' },
    { icon: '💻', title: 'Modern Technology', desc: 'State-of-the-art computer labs and digital learning resources.' },
    { icon: '🌍', title: 'Global Exposure', desc: 'Exchange programs and international partnerships for global learning.' },
    { icon: '👨‍👩‍👧', title: 'Parent Involvement', desc: 'Active parent-teacher collaboration for student success.' },
    { icon: '🎓', title: 'Career Guidance', desc: 'Dedicated counselors to guide students toward their future careers.' },
  ];

  const news = [
    { date: 'Jan 15, 2025', title: 'Annual Science Fair Results', desc: 'Our students won 5 national awards at the Kenya Science Fair 2025.' },
    { date: 'Jan 10, 2025', title: 'New Computer Lab Opened', desc: 'A brand new 60-seat computer lab has been inaugurated for students.' },
    { date: 'Dec 20, 2024', title: 'Term 3 Results Released', desc: 'Term 3 examination results are now available on the student portal.' },
  ];

  return (
    <div className="min-h-screen bg-white">
      {/* Navbar */}
      <nav className="bg-blue-900 text-white shadow-lg sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-yellow-400 rounded-full flex items-center justify-center font-bold text-blue-900 text-lg">A</div>
              <div>
                <h1 className="text-xl font-bold">Akilli School</h1>
                <p className="text-xs text-blue-300">Excellence in Education</p>
              </div>
            </div>
            <div className="hidden md:flex items-center space-x-8">
              <a href="#about" className="hover:text-yellow-400 transition">About</a>
              <a href="#features" className="hover:text-yellow-400 transition">Programs</a>
              <a href="#news" className="hover:text-yellow-400 transition">News</a>
              <a href="#contact" className="hover:text-yellow-400 transition">Contact</a>
              <button onClick={() => navigate('/login')} className="bg-yellow-400 text-blue-900 px-5 py-2 rounded-lg font-semibold hover:bg-yellow-300 transition">
                Login Portal
              </button>
            </div>
            <button className="md:hidden" onClick={() => setMenuOpen(!menuOpen)}>
              <span className="text-2xl">{menuOpen ? '✕' : '☰'}</span>
            </button>
          </div>
          {menuOpen && (
            <div className="md:hidden pb-4 space-y-2">
              <a href="#about" className="block py-2 hover:text-yellow-400">About</a>
              <a href="#features" className="block py-2 hover:text-yellow-400">Programs</a>
              <a href="#news" className="block py-2 hover:text-yellow-400">News</a>
              <a href="#contact" className="block py-2 hover:text-yellow-400">Contact</a>
              <button onClick={() => navigate('/login')} className="w-full bg-yellow-400 text-blue-900 px-5 py-2 rounded-lg font-semibold">Login Portal</button>
            </div>
          )}
        </div>
      </nav>

      {/* Hero */}
      <section className="bg-gradient-to-br from-blue-900 via-blue-800 to-blue-700 text-white py-24 px-4">
        <div className="max-w-7xl mx-auto text-center">
          <div className="w-24 h-24 bg-yellow-400 rounded-full flex items-center justify-center font-bold text-blue-900 text-4xl mx-auto mb-6">A</div>
          <h1 className="text-5xl md:text-6xl font-bold mb-4">Welcome to <span className="text-yellow-400">Akilli School</span></h1>
          <p className="text-xl text-blue-200 mb-4">Nurturing Tomorrow's Leaders Today</p>
          <p className="text-blue-300 max-w-2xl mx-auto mb-10">
            Located in the heart of Nairobi, Akilli School has been providing quality education since 1999.
            We believe every child has the potential to achieve greatness.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button onClick={() => navigate('/login')} className="bg-yellow-400 text-blue-900 px-8 py-3 rounded-lg font-bold text-lg hover:bg-yellow-300 transition">
              Access Student Portal
            </button>
            <a href="#about" className="border-2 border-white text-white px-8 py-3 rounded-lg font-bold text-lg hover:bg-white hover:text-blue-900 transition">
              Learn More
            </a>
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="bg-yellow-400 py-12">
        <div className="max-w-7xl mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
            {stats.map((s, i) => (
              <div key={i}>
                <p className="text-4xl font-bold text-blue-900">{s.value}</p>
                <p className="text-blue-800 font-medium mt-1">{s.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* About */}
      <section id="about" className="py-20 px-4 bg-gray-50">
        <div className="max-w-7xl mx-auto">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-4xl font-bold text-blue-900 mb-4">About Akilli School</h2>
              <p className="text-gray-600 mb-4">
                Akilli School was founded in 1999 with a vision to provide holistic, quality education to students across Kenya.
                The name "Akilli" means "intelligence" in Swahili — reflecting our commitment to developing sharp, thoughtful, and compassionate leaders.
              </p>
              <p className="text-gray-600 mb-4">
                Our school offers education from Grade 1 through Form 4, following the Competency Based Curriculum (CBC) and KCSE programs.
                We are proud of our 98% university placement rate and numerous national academic awards.
              </p>
              <ul className="space-y-2 text-gray-700">
                {['CBC & KCSE Certified', 'KNEC Registered Examination Center', 'ISO 9001:2015 Certified School', 'Award-winning STEM Programs'].map((item, i) => (
                  <li key={i} className="flex items-center gap-2"><span className="text-green-500 font-bold">✓</span> {item}</li>
                ))}
              </ul>
            </div>
            <div className="bg-blue-900 rounded-2xl p-8 text-white">
              <h3 className="text-2xl font-bold mb-6 text-yellow-400">Our Mission & Vision</h3>
              <div className="mb-6">
                <h4 className="font-bold text-lg mb-2">Mission</h4>
                <p className="text-blue-200">To provide an inclusive, innovative, and inspiring learning environment that empowers every student to reach their full potential.</p>
              </div>
              <div className="mb-6">
                <h4 className="font-bold text-lg mb-2">Vision</h4>
                <p className="text-blue-200">To be the leading school in East Africa, producing globally competitive, morally upright, and socially responsible citizens.</p>
              </div>
              <div>
                <h4 className="font-bold text-lg mb-2">Core Values</h4>
                <div className="flex flex-wrap gap-2">
                  {['Integrity', 'Excellence', 'Innovation', 'Respect', 'Teamwork'].map((v, i) => (
                    <span key={i} className="bg-yellow-400 text-blue-900 px-3 py-1 rounded-full text-sm font-semibold">{v}</span>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features */}
      <section id="features" className="py-20 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-blue-900 mb-4">Our Programs</h2>
            <p className="text-gray-600 max-w-2xl mx-auto">We offer a wide range of academic and extracurricular programs designed to develop the whole child.</p>
          </div>
          <div className="grid md:grid-cols-3 gap-8">
            {features.map((f, i) => (
              <div key={i} className="bg-white border border-gray-100 rounded-xl p-6 shadow-sm hover:shadow-md transition">
                <div className="text-4xl mb-4">{f.icon}</div>
                <h3 className="text-xl font-bold text-blue-900 mb-2">{f.title}</h3>
                <p className="text-gray-600">{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* News */}
      <section id="news" className="py-20 px-4 bg-gray-50">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-blue-900 mb-4">Latest News</h2>
            <p className="text-gray-600">Stay updated with the latest happenings at Akilli School.</p>
          </div>
          <div className="grid md:grid-cols-3 gap-8">
            {news.map((n, i) => (
              <div key={i} className="bg-white rounded-xl shadow-sm p-6 hover:shadow-md transition">
                <span className="text-sm text-blue-600 font-medium">{n.date}</span>
                <h3 className="text-lg font-bold text-gray-800 mt-2 mb-2">{n.title}</h3>
                <p className="text-gray-600 text-sm">{n.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Portal CTA */}
      <section className="py-20 px-4 bg-blue-900 text-white text-center">
        <div className="max-w-3xl mx-auto">
          <h2 className="text-4xl font-bold mb-4">Access the School Portal</h2>
          <p className="text-blue-200 mb-8">Students, teachers, and administrators can log in to manage academics, attendance, grades, and more.</p>
          <div className="grid sm:grid-cols-3 gap-4 mb-8">
            {[
              { role: 'Student', desc: 'View grades, attendance & notices', color: 'bg-green-500' },
              { role: 'Teacher', desc: 'Manage classes, grades & attendance', color: 'bg-yellow-400 text-blue-900' },
              { role: 'Admin', desc: 'Full system management & reports', color: 'bg-red-500' },
            ].map((p, i) => (
              <div key={i} className="bg-blue-800 rounded-xl p-4">
                <span className={`${p.color} px-3 py-1 rounded-full text-sm font-bold`}>{p.role}</span>
                <p className="text-blue-200 text-sm mt-2">{p.desc}</p>
              </div>
            ))}
          </div>
          <button onClick={() => navigate('/login')} className="bg-yellow-400 text-blue-900 px-10 py-4 rounded-lg font-bold text-xl hover:bg-yellow-300 transition">
            Login to Portal →
          </button>
        </div>
      </section>

      {/* Contact */}
      <section id="contact" className="py-20 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-blue-900 mb-4">Contact Us</h2>
          </div>
          <div className="grid md:grid-cols-3 gap-8 text-center">
            {[
              { icon: '📍', title: 'Address', info: '123 Akilli Road, Westlands, Nairobi, Kenya' },
              { icon: '📞', title: 'Phone', info: '+254 700 123 456' },
              { icon: '✉️', title: 'Email', info: 'info@akillischool.ac.ke' },
            ].map((c, i) => (
              <div key={i} className="bg-gray-50 rounded-xl p-6">
                <div className="text-4xl mb-3">{c.icon}</div>
                <h3 className="font-bold text-blue-900 mb-1">{c.title}</h3>
                <p className="text-gray-600">{c.info}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-blue-900 text-white py-8 px-4 text-center">
        <div className="flex items-center justify-center space-x-3 mb-3">
          <div className="w-8 h-8 bg-yellow-400 rounded-full flex items-center justify-center font-bold text-blue-900">A</div>
          <span className="font-bold text-lg">Akilli School</span>
        </div>
        <p className="text-blue-300 text-sm">© 2025 Akilli School. All rights reserved. | Excellence in Education Since 1999</p>
      </footer>
    </div>
  );
};

export default LandingPage;
