import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const LandingPage = () => {
  const navigate = useNavigate();
  const [menuOpen, setMenuOpen] = useState(false);

  const stats = [
    { label: 'Students Enrolled', value: '1,200+' },
    { label: 'Qualified Teachers', value: '80+' },
    { label: 'Courses Offered', value: '50+' },
    { label: 'Years of Excellence', value: '25+' },
  ];

  const programs = [
    {
      title: 'Academic Excellence',
      desc: 'We follow the CBC and KCSE curriculum with a focus on critical thinking, problem solving and strong academic foundations from Grade 1 through Form 4.',
    },
    {
      title: 'Sports and Physical Education',
      desc: 'Our students participate in football, basketball, athletics, volleyball and swimming. We compete at zonal, county and national levels every year.',
    },
    {
      title: 'Science and Technology',
      desc: 'Fully equipped computer labs, a science laboratory and a robotics club give students hands-on experience with modern technology.',
    },
    {
      title: 'Arts and Culture',
      desc: 'Drama, music, fine art and Swahili poetry are part of our curriculum. Students perform at national festivals and cultural events.',
    },
    {
      title: 'Parent and Community',
      desc: 'We maintain an open-door policy for parents. Regular meetings, progress reports and our online portal keep families informed and involved.',
    },
    {
      title: 'Career Guidance',
      desc: 'Our counselling department helps students from Form 2 onwards to explore career paths, university choices and scholarship opportunities.',
    },
  ];

  const news = [
    {
      date: '15 January 2025',
      category: 'Achievement',
      title: 'Students Win Five Awards at National Science Fair',
      desc: 'Akilli School students took home five awards at the Kenya National Science and Engineering Fair held in Nairobi this month.',
    },
    {
      date: '10 January 2025',
      category: 'Facilities',
      title: 'New Computer Laboratory Commissioned',
      desc: 'The school has opened a new 60-seat computer laboratory equipped with high-speed internet and the latest software for students.',
    },
    {
      date: '20 December 2024',
      category: 'Academics',
      title: 'Term Three Examination Results Available',
      desc: 'Term Three results have been released. Students and parents can view results through the school portal using their login credentials.',
    },
  ];

  const testimonials = [
    {
      name: 'Sarah Kamau',
      role: 'Parent',
      quote: 'My daughter joined Akilli in Grade 4 and the change has been remarkable. The teachers are attentive and the school environment is safe and encouraging.',
    },
    {
      name: 'James Otieno',
      role: 'Alumni, Class of 2020',
      quote: 'Akilli prepared me well for university. The discipline, the teachers and the culture of hard work gave me a strong foundation that I still rely on today.',
    },
    {
      name: 'Grace Wanjiku',
      role: 'Teacher, Mathematics',
      quote: 'I have taught here for eight years. The school supports professional growth and genuinely cares about both students and staff.',
    },
  ];

  return (
    <div className="min-h-screen bg-white text-gray-900">

      {/* Navbar */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex justify-between items-center h-16">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 bg-blue-800 rounded flex items-center justify-center">
              <span className="text-white font-black text-base">A</span>
            </div>
            <div>
              <p className="font-black text-gray-900 text-sm leading-none">Akilli School</p>
              <p className="text-blue-700 text-xs">Nairobi, Kenya</p>
            </div>
          </div>
          <div className="hidden md:flex items-center gap-1">
            {['About', 'Programs', 'News', 'Contact'].map(item => (
              <a key={item} href={`#${item.toLowerCase()}`}
                className="px-4 py-2 text-sm text-gray-600 hover:text-blue-800 hover:bg-gray-50 rounded transition">
                {item}
              </a>
            ))}
            <button onClick={() => navigate('/login')}
              className="ml-4 bg-blue-800 text-white px-5 py-2 rounded text-sm font-semibold hover:bg-blue-900 transition">
              Student Portal
            </button>
          </div>
          <button className="md:hidden p-2" onClick={() => setMenuOpen(!menuOpen)}>
            <svg className="w-5 h-5 text-gray-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              {menuOpen
                ? <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                : <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />}
            </svg>
          </button>
        </div>
        {menuOpen && (
          <div className="md:hidden border-t border-gray-100 bg-white px-4 py-3 space-y-1">
            {['About', 'Programs', 'News', 'Contact'].map(item => (
              <a key={item} href={`#${item.toLowerCase()}`}
                onClick={() => setMenuOpen(false)}
                className="block px-3 py-2 text-gray-700 hover:bg-gray-50 rounded text-sm">{item}</a>
            ))}
            <button onClick={() => navigate('/login')}
              className="w-full mt-2 bg-blue-800 text-white py-2 rounded text-sm font-semibold">
              Student Portal
            </button>
          </div>
        )}
      </nav>

      {/* Hero */}
      <section className="pt-16 bg-blue-900 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 lg:py-28">
          <div className="max-w-3xl">
            <p className="text-blue-300 text-sm font-medium uppercase tracking-widest mb-4">
              Established 1999 — Nairobi, Kenya
            </p>
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black leading-tight mb-6">
              Quality Education.<br />
              <span className="text-blue-300">Real Results.</span>
            </h1>
            <p className="text-blue-100 text-lg leading-relaxed mb-8 max-w-xl">
              Akilli School provides a structured, disciplined and nurturing environment where students from Grade 1 to Form 4 develop the knowledge, character and skills to succeed in life.
            </p>
            <div className="flex flex-col sm:flex-row gap-3">
              <button onClick={() => navigate('/login')}
                className="bg-white text-blue-900 px-7 py-3 rounded font-bold text-sm hover:bg-blue-50 transition">
                Access the Portal
              </button>
              <button onClick={() => navigate('/register')}
                className="border border-white/40 text-white px-7 py-3 rounded font-semibold text-sm hover:bg-white/10 transition">
                Create an Account
              </button>
              <a href="#about"
                className="border border-white/40 text-white px-7 py-3 rounded font-semibold text-sm hover:bg-white/10 transition text-center">
                Learn More
              </a>
            </div>
          </div>
        </div>

        {/* Stats strip */}
        <div className="border-t border-blue-800 bg-blue-950">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-2 md:grid-cols-4 divide-x divide-blue-800">
              {stats.map((s, i) => (
                <div key={i} className="py-6 px-6 text-center">
                  <p className="text-2xl sm:text-3xl font-black text-white">{s.value}</p>
                  <p className="text-blue-400 text-xs mt-1">{s.label}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* About */}
      <section id="about" className="py-20 px-4 bg-white">
        <div className="max-w-7xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-16 items-start">
            <div>
              <p className="text-blue-700 text-xs font-bold uppercase tracking-widest mb-3">About the School</p>
              <h2 className="text-3xl sm:text-4xl font-black text-gray-900 mb-5 leading-tight">
                A School Built on Discipline, Values and Results
              </h2>
              <p className="text-gray-600 leading-relaxed mb-4">
                Akilli School was founded in 1999 by a group of educators who believed that every Kenyan child deserves access to quality, structured education. The name <strong>Akilli</strong> — meaning <em>intelligence</em> in Swahili — reflects the school's core belief that every child is capable of achieving academic and personal excellence.
              </p>
              <p className="text-gray-600 leading-relaxed mb-6">
                Today, Akilli School serves over 1,200 students from Grade 1 through Form 4, following both the Competency Based Curriculum (CBC) and the Kenya Certificate of Secondary Education (KCSE) programmes. Our university placement rate stands at 98 percent.
              </p>
              <div className="space-y-2">
                {[
                  'CBC and KCSE certified curriculum',
                  'KNEC registered examination centre',
                  'Fully equipped science and computer laboratories',
                  'Qualified and experienced teaching staff',
                  'Safe, structured and inclusive learning environment',
                ].map((item, i) => (
                  <div key={i} className="flex items-start gap-3">
                    <div className="w-1.5 h-1.5 bg-blue-700 rounded-full mt-2 flex-shrink-0"></div>
                    <span className="text-gray-700 text-sm">{item}</span>
                  </div>
                ))}
              </div>
            </div>
            <div className="space-y-4">
              <div className="border-l-4 border-blue-800 bg-gray-50 p-6">
                <p className="text-xs font-bold text-blue-800 uppercase tracking-widest mb-2">Mission</p>
                <p className="text-gray-700 text-sm leading-relaxed">
                  To provide an inclusive, structured and high-quality learning environment that equips every student with the knowledge, values and skills needed to thrive in a competitive world.
                </p>
              </div>
              <div className="border-l-4 border-gray-800 bg-gray-50 p-6">
                <p className="text-xs font-bold text-gray-800 uppercase tracking-widest mb-2">Vision</p>
                <p className="text-gray-700 text-sm leading-relaxed">
                  To be the most trusted school in East Africa, recognised for producing graduates who are academically strong, morally grounded and socially responsible.
                </p>
              </div>
              <div className="bg-blue-900 text-white p-6">
                <p className="text-xs font-bold text-blue-300 uppercase tracking-widest mb-3">Core Values</p>
                <div className="grid grid-cols-2 gap-2">
                  {['Integrity', 'Excellence', 'Discipline', 'Respect', 'Teamwork', 'Responsibility'].map((v, i) => (
                    <div key={i} className="flex items-center gap-2">
                      <div className="w-1 h-1 bg-blue-400 rounded-full"></div>
                      <span className="text-blue-100 text-sm">{v}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Programs */}
      <section id="programs" className="py-20 px-4 bg-gray-50">
        <div className="max-w-7xl mx-auto">
          <div className="mb-12">
            <p className="text-blue-700 text-xs font-bold uppercase tracking-widest mb-3">What We Offer</p>
            <h2 className="text-3xl sm:text-4xl font-black text-gray-900 mb-3">Our Programmes</h2>
            <p className="text-gray-500 max-w-xl text-sm">
              We offer a broad range of academic and extracurricular programmes designed to develop every student fully.
            </p>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {programs.map((p, i) => (
              <div key={i} className="bg-white border border-gray-200 p-6 hover:border-blue-300 hover:shadow-md transition">
                <div className="w-8 h-1 bg-blue-800 mb-4"></div>
                <h3 className="font-bold text-gray-900 mb-2">{p.title}</h3>
                <p className="text-gray-500 text-sm leading-relaxed">{p.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* News */}
      <section id="news" className="py-20 px-4 bg-white">
        <div className="max-w-7xl mx-auto">
          <div className="mb-12">
            <p className="text-blue-700 text-xs font-bold uppercase tracking-widest mb-3">Latest Updates</p>
            <h2 className="text-3xl sm:text-4xl font-black text-gray-900">School News</h2>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {news.map((n, i) => (
              <div key={i} className="border border-gray-200 hover:border-blue-300 hover:shadow-md transition">
                <div className="h-1 bg-blue-800"></div>
                <div className="p-6">
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-xs font-bold text-blue-700 uppercase tracking-wider">{n.category}</span>
                    <span className="text-xs text-gray-400">{n.date}</span>
                  </div>
                  <h3 className="font-bold text-gray-900 mb-2 leading-snug">{n.title}</h3>
                  <p className="text-gray-500 text-sm leading-relaxed">{n.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-20 px-4 bg-blue-900 text-white">
        <div className="max-w-7xl mx-auto">
          <div className="mb-12">
            <p className="text-blue-300 text-xs font-bold uppercase tracking-widest mb-3">Testimonials</p>
            <h2 className="text-3xl sm:text-4xl font-black">What Our Community Says</h2>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {testimonials.map((t, i) => (
              <div key={i} className="border border-blue-700 bg-blue-800 p-6">
                <p className="text-blue-100 text-sm leading-relaxed mb-6">"{t.quote}"</p>
                <div className="border-t border-blue-700 pt-4">
                  <p className="font-bold text-white text-sm">{t.name}</p>
                  <p className="text-blue-400 text-xs mt-0.5">{t.role}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Portal Access */}
      <section className="py-20 px-4 bg-gray-50">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-12">
            <p className="text-blue-700 text-xs font-bold uppercase tracking-widest mb-3">School Portal</p>
            <h2 className="text-3xl sm:text-4xl font-black text-gray-900 mb-3">Access Your Account</h2>
            <p className="text-gray-500 text-sm max-w-xl mx-auto">
              Students, teachers and administrators each have a dedicated dashboard for managing academics, attendance, grades and school communications.
            </p>
          </div>
          <div className="grid sm:grid-cols-3 gap-4 mb-8">
            {[
              { role: 'Student', desc: 'View your grades, attendance records and school notices.', color: 'border-green-600 bg-green-50', label: 'bg-green-600' },
              { role: 'Teacher', desc: 'Record grades, mark attendance and communicate with students.', color: 'border-blue-600 bg-blue-50', label: 'bg-blue-600' },
              { role: 'Administrator', desc: 'Manage users, classes, notices and all school data.', color: 'border-gray-700 bg-gray-100', label: 'bg-gray-700' },
            ].map((p, i) => (
              <div key={i} className={`border-2 ${p.color} p-6`}>
                <span className={`${p.label} text-white text-xs font-bold px-2 py-1 rounded`}>{p.role}</span>
                <p className="text-gray-600 text-sm mt-3 leading-relaxed">{p.desc}</p>
              </div>
            ))}
          </div>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <button onClick={() => navigate('/login')}
              className="bg-blue-800 text-white px-8 py-3 font-bold text-sm hover:bg-blue-900 transition">
              Login to Portal
            </button>
            <button onClick={() => navigate('/register')}
              className="border-2 border-blue-800 text-blue-800 px-8 py-3 font-bold text-sm hover:bg-blue-50 transition">
              Register New Account
            </button>
          </div>
        </div>
      </section>

      {/* Contact */}
      <section id="contact" className="py-20 px-4 bg-white">
        <div className="max-w-7xl mx-auto">
          <div className="mb-12">
            <p className="text-blue-700 text-xs font-bold uppercase tracking-widest mb-3">Get in Touch</p>
            <h2 className="text-3xl sm:text-4xl font-black text-gray-900">Contact Us</h2>
          </div>
          <div className="grid sm:grid-cols-3 gap-6">
            {[
              { title: 'Physical Address', lines: ['123 Akilli Road, Westlands', 'Nairobi, Kenya', 'P.O. Box 12345 - 00100'] },
              { title: 'Phone Numbers', lines: ['+254 700 123 456', '+254 733 456 789', 'Mon – Fri, 7:00am – 5:00pm'] },
              { title: 'Email Addresses', lines: ['info@akillischool.ac.ke', 'admissions@akillischool.ac.ke', 'principal@akillischool.ac.ke'] },
            ].map((c, i) => (
              <div key={i} className="border border-gray-200 p-6">
                <p className="text-xs font-bold text-blue-800 uppercase tracking-widest mb-3">{c.title}</p>
                {c.lines.map((line, j) => (
                  <p key={j} className="text-gray-600 text-sm leading-relaxed">{line}</p>
                ))}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-10 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
            <div>
              <div className="flex items-center gap-3 mb-2">
                <div className="w-8 h-8 bg-blue-700 flex items-center justify-center font-black text-white text-sm">A</div>
                <p className="font-black text-white">Akilli School</p>
              </div>
              <p className="text-gray-400 text-xs">123 Akilli Road, Westlands, Nairobi, Kenya</p>
              <p className="text-gray-400 text-xs">info@akillischool.ac.ke | +254 700 123 456</p>
            </div>
            <div className="flex gap-6 text-sm text-gray-400">
              <a href="#about" className="hover:text-white transition">About</a>
              <a href="#programs" className="hover:text-white transition">Programs</a>
              <a href="#news" className="hover:text-white transition">News</a>
              <a href="#contact" className="hover:text-white transition">Contact</a>
            </div>
          </div>
          <div className="border-t border-gray-800 mt-8 pt-6 text-xs text-gray-500">
            &copy; {new Date().getFullYear()} Akilli School. All rights reserved. | Nairobi, Kenya
          </div>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;
