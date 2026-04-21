import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { AcademicCapIcon, UserGroupIcon, BookOpenIcon, SparklesIcon, ArrowRightIcon, Bars3Icon, XMarkIcon, CheckCircleIcon, StarIcon, GlobeAltIcon, HeartIcon, TrophyIcon, LightBulbIcon, RocketLaunchIcon } from '@heroicons/react/24/outline';

const LandingPage = () => {
  const navigate = useNavigate();
  const [menuOpen, setMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToSection = (sectionId) => {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
      setMenuOpen(false);
    }
  };

  const stats = [
    { label: 'Students Enrolled', value: '1,200+', icon: UserGroupIcon, color: 'from-blue-500 to-cyan-500' },
    { label: 'Qualified Teachers', value: '80+', icon: AcademicCapIcon, color: 'from-green-500 to-emerald-500' },
    { label: 'Courses Offered', value: '50+', icon: BookOpenIcon, color: 'from-purple-500 to-pink-500' },
    { label: 'Years of Excellence', value: '25+', icon: TrophyIcon, color: 'from-yellow-500 to-orange-500' },
  ];

  const programs = [
    { title: 'Academic Excellence', desc: 'CBC and KCSE curriculum with focus on critical thinking and problem solving.', icon: AcademicCapIcon, color: 'from-blue-500 to-indigo-600' },
    { title: 'Sports & Physical Education', desc: 'Football, basketball, athletics, volleyball and swimming competitions.', icon: TrophyIcon, color: 'from-green-500 to-emerald-600' },
    { title: 'Science & Technology', desc: 'Computer labs, science laboratory and robotics club with modern equipment.', icon: LightBulbIcon, color: 'from-purple-500 to-pink-600' },
    { title: 'Arts & Culture', desc: 'Drama, music, fine art and Swahili poetry performances at festivals.', icon: SparklesIcon, color: 'from-yellow-500 to-red-500' },
    { title: 'Parent & Community', desc: 'Open-door policy, regular meetings and online parent portal.', icon: HeartIcon, color: 'from-pink-500 to-rose-600' },
    { title: 'Career Guidance', desc: 'Counselling for university choices and scholarship opportunities.', icon: RocketLaunchIcon, color: 'from-indigo-500 to-purple-600' },
  ];

  const testimonials = [
    { name: 'Sarah Johnson', role: 'Parent', content: 'Akilli School has transformed my daughter\'s education. The teachers are dedicated and the facilities are outstanding.', rating: 5 },
    { name: 'Michael Kimani', role: 'Alumni', content: 'The foundation I received at Akilli prepared me for university success. I\'m now pursuing engineering at a top university.', rating: 5 },
    { name: 'Grace Wangari', role: 'Student', content: 'I love the supportive environment and the variety of activities available. The teachers really care about our success.', rating: 5 },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50">
      {/* Navigation */}
      <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${scrolled ? 'bg-white/95 backdrop-blur-md shadow-lg' : 'bg-transparent'}`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-20">
            <div className="flex items-center gap-2">
              <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-2xl flex items-center justify-center text-white font-bold text-xl shadow-lg">A</div>
              <span className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text">Akilli School</span>
            </div>
            <div className="hidden md:flex items-center gap-8">
              <button onClick={() => scrollToSection('features')} className="text-gray-700 hover:text-blue-600 font-medium transition-colors">Features</button>
              <button onClick={() => scrollToSection('programs')} className="text-gray-700 hover:text-blue-600 font-medium transition-colors">Programs</button>
              <button onClick={() => scrollToSection('testimonials')} className="text-gray-700 hover:text-blue-600 font-medium transition-colors">Testimonials</button>
            </div>
            <div className="flex items-center gap-4">
              <button onClick={() => navigate('/login')} className="hidden sm:block px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white font-medium rounded-2xl hover:from-blue-700 hover:to-purple-700 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-105">Sign In</button>
              <button onClick={() => setMenuOpen(!menuOpen)} className="p-2 rounded-2xl hover:bg-gray-100 transition-colors md:hidden">
                {menuOpen ? <XMarkIcon className="w-6 h-6" /> : <Bars3Icon className="w-6 h-6" />}
              </button>
            </div>
          </div>
        </div>
        {menuOpen && (
          <div className="md:hidden bg-white border-t border-gray-200 shadow-lg">
            <div className="px-4 py-4 space-y-3">
              <button onClick={() => scrollToSection('features')} className="block text-gray-700 hover:text-blue-600 font-medium transition-colors py-2">Features</button>
              <button onClick={() => scrollToSection('programs')} className="block text-gray-700 hover:text-blue-600 font-medium transition-colors py-2">Programs</button>
              <button onClick={() => scrollToSection('testimonials')} className="block text-gray-700 hover:text-blue-600 font-medium transition-colors py-2">Testimonials</button>
              <button onClick={() => navigate('/login')} className="w-full px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white font-medium rounded-2xl hover:from-blue-700 hover:to-purple-700 transition-all duration-300">Sign In</button>
            </div>
          </div>
        )}
      </nav>

      {/* Hero Section */}
      <section className="relative overflow-hidden pt-20">
        <div className="absolute inset-0 bg-gradient-to-br from-blue-600/20 to-purple-600/20"></div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 lg:py-32">
          <div className="text-center">
            <h1 className="text-5xl sm:text-6xl lg:text-7xl font-bold text-gray-900 mb-6 leading-tight">
              <span className="bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-600 bg-clip-text">Excellence in Education,</span><br />
              <span className="bg-gradient-to-r from-purple-600 via-pink-600 to-red-600 bg-clip-text">Innovation for Tomorrow</span>
            </h1>
            <p className="text-xl text-gray-600 mb-12 max-w-3xl mx-auto leading-relaxed">Empowering students with quality education, modern facilities, and a nurturing environment that prepares them for success in an ever-changing world.</p>
            <div className="flex flex-col sm:flex-row gap-6 justify-center mb-16">
              <button onClick={() => navigate('/login')} className="px-8 py-4 bg-gradient-to-r from-blue-600 to-purple-600 text-white font-bold text-lg rounded-2xl hover:from-blue-700 hover:to-purple-700 transition-all duration-300 shadow-2xl hover:shadow-3xl transform hover:scale-105">Get Started<ArrowRightIcon className="w-5 h-5 ml-2 inline-block" /></button>
              <button onClick={() => navigate('/register')} className="px-8 py-4 bg-white text-gray-900 font-bold text-lg rounded-2xl border-2 border-gray-300 hover:border-gray-400 hover:bg-gray-50 transition-all duration-300 shadow-2xl hover:shadow-3xl transform hover:scale-105">Learn More</button>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {stats.map((stat, index) => {
              const Icon = stat.icon;
              return (
                <div key={index} className="text-center group">
                  <div className={`w-20 h-20 mx-auto bg-gradient-to-br ${stat.color} rounded-3xl flex items-center justify-center text-white shadow-2xl group-hover:scale-110 transition-transform duration-300 mb-6`}>
                    <Icon className="w-10 h-10" />
                  </div>
                  <h3 className="text-4xl font-bold text-gray-900 mb-2">{stat.value}</h3>
                  <p className="text-gray-600 font-medium">{stat.label}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Programs Section */}
      <section id="programs" className="py-20 bg-gradient-to-br from-gray-50 to-blue-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">Our <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text">Programs</span></h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">Comprehensive educational programs designed to nurture every aspect of student development</p>
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {programs.map((program, index) => {
              const Icon = program.icon;
              return (
                <div key={index} className="bg-white p-8 rounded-3xl shadow-xl hover:shadow-2xl transition-all duration-300 group">
                  <div className="flex items-start gap-6">
                    <div className={`w-16 h-16 bg-gradient-to-br ${program.color} rounded-2xl flex items-center justify-center text-white shadow-lg group-hover:scale-110 transition-transform duration-300 flex-shrink-0`}>
                      <Icon className="w-8 h-8" />
                    </div>
                    <div className="flex-1">
                      <h3 className="text-xl font-bold text-gray-900 mb-3 group-hover:text-blue-600 transition-colors">{program.title}</h3>
                      <p className="text-gray-600 leading-relaxed">{program.desc}</p>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section id="testimonials" className="py-20 bg-gradient-to-br from-blue-50 to-purple-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">What Our <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text">Community Says</span></h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">Hear from parents, students, and alumni about their experience at Akilli School</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {testimonials.map((testimonial, index) => (
              <div key={index} className="bg-white p-8 rounded-3xl shadow-xl hover:shadow-2xl transition-all duration-300 group">
                <div className="flex items-start gap-4 mb-4">
                  <div className="w-16 h-16 bg-gradient-to-br from-blue-400 to-purple-600 rounded-full flex items-center justify-center text-white font-bold text-xl flex-shrink-0">{testimonial.name.charAt(0)}</div>
                  <div>
                    <div className="flex items-center gap-1 mb-2">{[...Array(testimonial.rating)].map((_, i) => <StarIcon key={i} className="w-5 h-5 text-yellow-400 fill-current" />)}</div>
                    <h4 className="font-bold text-gray-900">{testimonial.name}</h4>
                    <p className="text-sm text-blue-600 font-medium">{testimonial.role}</p>
                  </div>
                </div>
                <p className="text-gray-600 italic leading-relaxed">"{testimonial.content}"</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-blue-600 to-purple-600">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-4xl font-bold text-white mb-6">Ready to Join Our <span className="text-yellow-300">Learning Community</span>?</h2>
          <p className="text-xl text-blue-100 mb-12 max-w-3xl mx-auto">Take the first step towards a brighter future. Enroll today or schedule a visit to our campus.</p>
          <div className="flex flex-col sm:flex-row gap-6 justify-center">
            <button onClick={() => navigate('/register')} className="px-8 py-4 bg-white text-blue-600 font-bold text-lg rounded-2xl hover:bg-gray-50 transition-all duration-300 shadow-2xl hover:shadow-3xl transform hover:scale-105">Enroll Now<CheckCircleIcon className="w-5 h-5 ml-2 inline-block" /></button>
            <button onClick={() => navigate('/login')} className="px-8 py-4 bg-transparent text-white font-bold text-lg rounded-2xl border-2 border-white hover:bg-white hover:text-blue-600 transition-all duration-300">Schedule Visit</button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div>
              <h3 className="text-lg font-bold mb-4">Akilli School</h3>
              <p className="text-gray-400 leading-relaxed">Providing quality education and nurturing young minds for over 25 years.</p>
            </div>
            <div>
              <h3 className="text-lg font-bold mb-4">Quick Links</h3>
              <ul className="space-y-2">
                <li><a href="#" className="text-gray-400 hover:text-white transition-colors">About Us</a></li>
                <li><a href="#" className="text-gray-400 hover:text-white transition-colors">Programs</a></li>
                <li><a href="#" className="text-gray-400 hover:text-white transition-colors">Admissions</a></li>
                <li><a href="#" className="text-gray-400 hover:text-white transition-colors">Contact</a></li>
              </ul>
            </div>
            <div>
              <h3 className="text-lg font-bold mb-4">Contact Info</h3>
              <ul className="space-y-2 text-gray-400">
                <li>123 Education Street</li>
                <li>Nairobi, Kenya</li>
                <li>+254 123 4567</li>
                <li>info@akillischool.ke</li>
              </ul>
            </div>
            <div>
              <h3 className="text-lg font-bold mb-4">Follow Us</h3>
              <div className="flex space-x-4">
                <a href="#" className="w-10 h-10 bg-gray-800 rounded-full flex items-center justify-center hover:bg-gray-700 transition-colors"><span className="text-sm">f</span></a>
                <a href="#" className="w-10 h-10 bg-gray-800 rounded-full flex items-center justify-center hover:bg-gray-700 transition-colors"><span className="text-sm">t</span></a>
                <a href="#" className="w-10 h-10 bg-gray-800 rounded-full flex items-center justify-center hover:bg-gray-700 transition-colors"><span className="text-sm">in</span></a>
              </div>
            </div>
          </div>
          <div className="border-t border-gray-800 mt-12 pt-8 text-center text-gray-400">
            <p>&copy; 2025 Akilli School. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;
