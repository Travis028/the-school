import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const LandingPage = () => {
  const navigate = useNavigate();
  const [menuOpen, setMenuOpen] = useState(false);

  const stats = [
    { label: 'Students Enrolled', value: '1,200+', icon: '🎓' },
    { label: 'Expert Teachers', value: '80+', icon: '👨‍🏫' },
    { label: 'Courses Offered', value: '50+', icon: '📚' },
    { label: 'Years of Excellence', value: '25+', icon: '🏆' },
  ];

  const features = [
    { icon: '📚', title: 'Academic Excellence', desc: 'World-class CBC & KCSE curriculum designed to nurture critical thinking and creativity in every student.' },
    { icon: '🏆', title: 'Sports & Arts', desc: 'Comprehensive extracurricular programs including football, basketball, drama and music clubs.' },
    { icon: '💻', title: 'Modern Technology', desc: 'State-of-the-art computer labs with high-speed internet and digital learning resources.' },
    { icon: '🌍', title: 'Global Exposure', desc: 'International exchange programs and partnerships for a globally competitive education.' },
    { icon: '👨‍👩‍👧', title: 'Parent Involvement', desc: 'Active parent-teacher collaboration through our digital portal for student success.' },
    { icon: '🎓', title: 'Career Guidance', desc: 'Dedicated counselors to guide students toward their dream universities and careers.' },
  ];

  const news = [
    { date: 'Jan 15, 2025', tag: 'Achievement', title: 'Annual Science Fair Results', desc: 'Our students won 5 national awards at the Kenya Science Fair 2025.' },
    { date: 'Jan 10, 2025', tag: 'Facilities', title: 'New Computer Lab Opened', desc: 'A brand new 60-seat computer lab has been inaugurated for students.' },
    { date: 'Dec 20, 2024', tag: 'Academics', title: 'Term 3 Results Released', desc: 'Term 3 examination results are now available on the student portal.' },
  ];

  const testimonials = [
    { name: 'Sarah Kamau', role: 'Parent', text: 'Akilli School has transformed my daughter. The teachers are dedicated and the environment is nurturing.' },
    { name: 'James Otieno', role: 'Alumni, Class of 2020', text: 'I got admitted to University of Nairobi thanks to the excellent preparation I received at Akilli.' },
    { name: 'Grace Wanjiku', role: 'Teacher', text: 'Teaching at Akilli is a joy. The administration supports innovation and student-centered learning.' },
  ];

  return (
    <div className="min-h-screen bg-white font-sans">
      {/* Navbar */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-white/95 backdrop-blur-sm shadow-sm border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-gradient-to-br from-blue-600 to-blue-800 rounded-xl flex items-center justify-center font-black text-white text-lg shadow-md">A</div>
              <div>
                <h1 className="text-lg font-black text-gray-900 leading-none">Akilli School</h1>
                <p className="text-xs text-blue-600 font-medium">Excellence in Education</p>
              </div>
            </div>
            <div className="hidden md:flex items-center space-x-1">
              {['About', 'Programs', 'News', 'Contact'].map(item => (
                <a key={item} href={`#${item.toLowerCase()}`}
                  className="px-4 py-2 text-sm font-medium text-gray-600 hover:text-blue-700 hover:bg-blue-50 rounded-lg transition-all duration-200">
                  {item}
                </a>
              ))}
              <button onClick={() => navigate('/login')}
                className="ml-3 bg-blue-700 text-white px-5 py-2 rounded-xl text-sm font-semibold hover:bg-blue-800 transition-all duration-200 shadow-md hover:shadow-lg">
                Login Portal
              </button>
            </div>
            <button className="md:hidden p-2 rounded-lg hover:bg-gray-100" onClick={() => setMenuOpen(!menuOpen)}>
              <div className="w-5 h-0.5 bg-gray-700 mb-1"></div>
              <div className="w-5 h-0.5 bg-gray-700 mb-1"></div>
              <div className="w-5 h-0.5 bg-gray-700"></div>
            </button>
          </div>
          {menuOpen && (
            <div className="md:hidden py-4 border-t border-gray-100 space-y-1">
              {['About', 'Programs', 'News', 'Contact'].map(item => (
                <a key={item} href={`#${item.toLowerCase()}`} className="block px-4 py-2 text-gray-700 hover:bg-blue-50 rounded-lg">{item}</a>
              ))}
              <button onClick={() => navigate('/login')} className="w-full mt-2 bg-blue-700 text-white py-2 rounded-xl font-semibold">Login Portal</button>
            </div>
          )}
        </div>
      </nav>

      {/* Hero */}
      <section className="pt-16 min-h-screen flex items-center bg-gradient-to-br from-slate-900 via-blue-950 to-blue-900 relative overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-20 left-10 w-72 h-72 bg-blue-400 rounded-full blur-3xl"></div>
          <div className="absolute bottom-20 right-10 w-96 h-96 bg-indigo-400 rounded-full blur-3xl"></div>
          <div className="absolute top-1/2 left-1/2 w-64 h-64 bg-cyan-400 rounded-full blur-3xl"></div>
        </div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 relative z-10">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <div className="inline-flex items-center bg-blue-500/20 border border-blue-400/30 text-blue-300 px-4 py-2 rounded-full text-sm font-medium mb-6">
                🏫 Welcome to Akilli School — Est. 1999
              </div>
              <h1 className="text-5xl lg:text-6xl font-black text-white leading-tight mb-6">
                Nurturing <span className="text-transparent bg-clip-text bg-gradient-to-r from-yellow-400 to-orange-400">Tomorrow's</span> Leaders Today
              </h1>
              <p className="text-blue-200 text-lg leading-relaxed mb-8">
                Located in the heart of Nairobi, Akilli School has been providing quality, holistic education since 1999.
                We believe every child has the potential to achieve greatness.
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <button onClick={() => navigate('/login')}
                  className="bg-gradient-to-r from-yellow-400 to-orange-400 text-gray-900 px-8 py-4 rounded-xl font-bold text-lg hover:shadow-2xl hover:shadow-yellow-500/25 transition-all duration-300 transform hover:-translate-y-0.5">
                  Access Student Portal →
                </button>
                <a href="#about"
                  className="border-2 border-white/30 text-white px-8 py-4 rounded-xl font-bold text-lg hover:bg-white/10 transition-all duration-300 text-center">
                  Learn More
                </a>
              </div>
            </div>
            <div className="hidden lg:grid grid-cols-2 gap-4">
              {stats.map((s, i) => (
                <div key={i} className="bg-white/10 backdrop-blur-sm border border-white/20 rounded-2xl p-6 hover:bg-white/15 transition-all duration-300">
                  <div className="text-3xl mb-3">{s.icon}</div>
                  <p className="text-3xl font-black text-white">{s.value}</p>
                  <p className="text-blue-300 text-sm mt-1">{s.label}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
        <div className="absolute bottom-0 left-0 right-0 h-16 bg-gradient-to-t from-white to-transparent"></div>
      </section>

      {/* Stats bar */}
      <section className="bg-white py-8 shadow-sm">
        <div className="max-w-7xl mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 lg:hidden">
            {stats.map((s, i) => (
              <div key={i} className="text-center">
                <p className="text-3xl font-black text-blue-700">{s.value}</p>
                <p className="text-gray-500 text-sm mt-1">{s.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* About */}
      <section id="about" className="py-24 px-4 bg-gray-50">
        <div className="max-w-7xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <div>
              <span className="text-blue-600 font-semibold text-sm uppercase tracking-wider">About Us</span>
              <h2 className="text-4xl font-black text-gray-900 mt-2 mb-6 leading-tight">
                A Legacy of <span className="text-blue-700">Excellence</span> Since 1999
              </h2>
              <p className="text-gray-600 leading-relaxed mb-4">
                Akilli School was founded with a vision to provide holistic, quality education to students across Kenya.
                The name <strong>"Akilli"</strong> means <em>"intelligence"</em> in Swahili — reflecting our commitment to developing sharp, thoughtful, and compassionate leaders.
              </p>
              <p className="text-gray-600 leading-relaxed mb-6">
                We offer education from Grade 1 through Form 4, following the CBC and KCSE programs with a proud 98% university placement rate.
              </p>
              <div className="space-y-3">
                {['CBC & KCSE Certified Curriculum', 'KNEC Registered Examination Center', 'ISO 9001:2015 Certified School', 'Award-winning STEM Programs'].map((item, i) => (
                  <div key={i} className="flex items-center gap-3">
                    <div className="w-5 h-5 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0">
                      <span className="text-green-600 text-xs font-bold">✓</span>
                    </div>
                    <span className="text-gray-700 text-sm">{item}</span>
                  </div>
                ))}
              </div>
            </div>
            <div className="space-y-4">
              <div className="bg-gradient-to-br from-blue-700 to-blue-900 rounded-2xl p-8 text-white">
                <h3 className="text-xl font-bold mb-2 text-yellow-400">Our Mission</h3>
                <p className="text-blue-100 text-sm leading-relaxed">To provide an inclusive, innovative, and inspiring learning environment that empowers every student to reach their full potential.</p>
              </div>
              <div className="bg-gradient-to-br from-indigo-600 to-indigo-800 rounded-2xl p-8 text-white">
                <h3 className="text-xl font-bold mb-2 text-yellow-400">Our Vision</h3>
                <p className="text-indigo-100 text-sm leading-relaxed">To be the leading school in East Africa, producing globally competitive, morally upright, and socially responsible citizens.</p>
              </div>
              <div className="bg-white border border-gray-200 rounded-2xl p-6">
                <h3 className="text-lg font-bold text-gray-800 mb-3">Core Values</h3>
                <div className="flex flex-wrap gap-2">
                  {['Integrity', 'Excellence', 'Innovation', 'Respect', 'Teamwork', 'Compassion'].map((v, i) => (
                    <span key={i} className="bg-blue-50 text-blue-700 border border-blue-200 px-3 py-1 rounded-full text-sm font-medium">{v}</span>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Programs */}
      <section id="programs" className="py-24 px-4 bg-white">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <span className="text-blue-600 font-semibold text-sm uppercase tracking-wider">What We Offer</span>
            <h2 className="text-4xl font-black text-gray-900 mt-2 mb-4">Our Programs</h2>
            <p className="text-gray-500 max-w-2xl mx-auto">We offer a wide range of academic and extracurricular programs designed to develop the whole child.</p>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {features.map((f, i) => (
              <div key={i} className="group bg-white border border-gray-100 rounded-2xl p-6 hover:shadow-xl hover:border-blue-100 transition-all duration-300 hover:-translate-y-1">
                <div className="w-12 h-12 bg-blue-50 rounded-xl flex items-center justify-center text-2xl mb-4 group-hover:bg-blue-100 transition-colors">
                  {f.icon}
                </div>
                <h3 className="text-lg font-bold text-gray-900 mb-2">{f.title}</h3>
                <p className="text-gray-500 text-sm leading-relaxed">{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* News */}
      <section id="news" className="py-24 px-4 bg-gray-50">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <span className="text-blue-600 font-semibold text-sm uppercase tracking-wider">Stay Updated</span>
            <h2 className="text-4xl font-black text-gray-900 mt-2 mb-4">Latest News</h2>
            <p className="text-gray-500">Stay updated with the latest happenings at Akilli School.</p>
          </div>
          <div className="grid md:grid-cols-3 gap-6">
            {news.map((n, i) => (
              <div key={i} className="bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-lg transition-all duration-300 hover:-translate-y-1 border border-gray-100">
                <div className="h-2 bg-gradient-to-r from-blue-600 to-indigo-600"></div>
                <div className="p-6">
                  <div className="flex items-center justify-between mb-3">
                    <span className="bg-blue-50 text-blue-700 text-xs font-semibold px-3 py-1 rounded-full">{n.tag}</span>
                    <span className="text-gray-400 text-xs">{n.date}</span>
                  </div>
                  <h3 className="text-lg font-bold text-gray-900 mb-2">{n.title}</h3>
                  <p className="text-gray-500 text-sm leading-relaxed">{n.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-24 px-4 bg-gradient-to-br from-blue-900 to-indigo-900">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <span className="text-yellow-400 font-semibold text-sm uppercase tracking-wider">Testimonials</span>
            <h2 className="text-4xl font-black text-white mt-2 mb-4">What People Say</h2>
          </div>
          <div className="grid md:grid-cols-3 gap-6">
            {testimonials.map((t, i) => (
              <div key={i} className="bg-white/10 backdrop-blur-sm border border-white/20 rounded-2xl p-6 hover:bg-white/15 transition-all duration-300">
                <p className="text-blue-100 text-sm leading-relaxed mb-6 italic">"{t.text}"</p>
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-gradient-to-br from-yellow-400 to-orange-400 rounded-full flex items-center justify-center font-bold text-gray-900">
                    {t.name[0]}
                  </div>
                  <div>
                    <p className="text-white font-semibold text-sm">{t.name}</p>
                    <p className="text-blue-300 text-xs">{t.role}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Portal CTA */}
      <section className="py-24 px-4 bg-white">
        <div className="max-w-4xl mx-auto text-center">
          <span className="text-blue-600 font-semibold text-sm uppercase tracking-wider">School Portal</span>
          <h2 className="text-4xl font-black text-gray-900 mt-2 mb-4">Access Your Dashboard</h2>
          <p className="text-gray-500 mb-12">Students, teachers, and administrators can log in to manage academics, attendance, grades, and more.</p>
          <div className="grid sm:grid-cols-3 gap-4 mb-10">
            {[
              { role: 'Student', desc: 'View grades, attendance & notices', color: 'from-green-500 to-emerald-600', icon: '🎓' },
              { role: 'Teacher', desc: 'Manage classes, grades & attendance', color: 'from-blue-500 to-blue-700', icon: '👨‍🏫' },
              { role: 'Admin', desc: 'Full system management & reports', color: 'from-purple-500 to-purple-700', icon: '⚙️' },
            ].map((p, i) => (
              <div key={i} className={`bg-gradient-to-br ${p.color} rounded-2xl p-6 text-white text-left hover:shadow-xl transition-all duration-300 hover:-translate-y-1`}>
                <div className="text-3xl mb-3">{p.icon}</div>
                <p className="font-bold text-lg">{p.role}</p>
                <p className="text-white/80 text-sm mt-1">{p.desc}</p>
              </div>
            ))}
          </div>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button onClick={() => navigate('/login')}
              className="bg-blue-700 text-white px-10 py-4 rounded-xl font-bold text-lg hover:bg-blue-800 transition-all duration-300 shadow-lg hover:shadow-xl">
              Login to Portal
            </button>
            <button onClick={() => navigate('/register')}
              className="border-2 border-blue-700 text-blue-700 px-10 py-4 rounded-xl font-bold text-lg hover:bg-blue-50 transition-all duration-300">
              Create Account
            </button>
          </div>
        </div>
      </section>

      {/* Contact */}
      <section id="contact" className="py-24 px-4 bg-gray-50">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <span className="text-blue-600 font-semibold text-sm uppercase tracking-wider">Get In Touch</span>
            <h2 className="text-4xl font-black text-gray-900 mt-2 mb-4">Contact Us</h2>
          </div>
          <div className="grid md:grid-cols-3 gap-6">
            {[
              { icon: '📍', title: 'Address', info: '123 Akilli Road, Westlands\nNairobi, Kenya' },
              { icon: '📞', title: 'Phone', info: '+254 700 123 456\n+254 733 456 789' },
              { icon: '✉️', title: 'Email', info: 'info@akillischool.ac.ke\nadmissions@akillischool.ac.ke' },
            ].map((c, i) => (
              <div key={i} className="bg-white rounded-2xl p-8 text-center shadow-sm hover:shadow-md transition-all duration-300 border border-gray-100">
                <div className="w-14 h-14 bg-blue-50 rounded-2xl flex items-center justify-center text-2xl mx-auto mb-4">{c.icon}</div>
                <h3 className="font-bold text-gray-900 mb-2">{c.title}</h3>
                <p className="text-gray-500 text-sm whitespace-pre-line">{c.info}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col md:flex-row justify-between items-center gap-6">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-blue-700 rounded-xl flex items-center justify-center font-black text-white">A</div>
              <div>
                <p className="font-black text-lg">Akilli School</p>
                <p className="text-gray-400 text-xs">Excellence in Education Since 1999</p>
              </div>
            </div>
            <div className="flex gap-6 text-sm text-gray-400">
              <a href="#about" className="hover:text-white transition">About</a>
              <a href="#programs" className="hover:text-white transition">Programs</a>
              <a href="#news" className="hover:text-white transition">News</a>
              <a href="#contact" className="hover:text-white transition">Contact</a>
            </div>
            <p className="text-gray-500 text-sm">© 2025 Akilli School. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;
