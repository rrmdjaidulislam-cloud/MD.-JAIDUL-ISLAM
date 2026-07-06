import React, { useState, useEffect } from 'react';
import { View } from './types';
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import Stats from './components/Stats';
import Courses from './components/Courses';
import WhyChooseUs from './components/WhyChooseUs';
import TutorProfile from './components/TutorProfile';
import WhiteboardClassroom from './components/WhiteboardClassroom';
import Contact from './components/Contact';
import Newsletter from './components/Newsletter';
import Footer from './components/Footer';
import StudentDashboard from './components/StudentDashboard';
import PaymentGateway from './components/PaymentGateway';
import AdminPanel from './components/AdminPanel';
import BlogSection from './components/BlogSection';
import FloatingWhatsAppButton from './components/FloatingWhatsAppButton';
import PolicyModal from './components/PolicyModal';
import { X, CheckCircle, GraduationCap } from 'lucide-react';

export default function App() {
  const [currentView, setCurrentView] = useState<View>(View.HOME);
  const [language, setLanguage] = useState<'bn' | 'en'>(() => (localStorage.getItem('edustika_lang') as 'bn' | 'en') || 'bn');

  useEffect(() => {
    localStorage.setItem('edustika_lang', language);
  }, [language]);
  const [isBookingOpen, setIsBookingOpen] = useState<boolean>(false);
  const [prefilledCourse, setPrefilledCourse] = useState<string>('');
  
  // Booking modal form states
  const [studentName, setStudentName] = useState<string>('');
  const [parentName, setParentName] = useState<string>('');
  const [mobile, setMobile] = useState<string>('');
  const [studentEmail, setStudentEmail] = useState<string>('');
  const [schoolName, setSchoolName] = useState<string>('');
  const [homeAddress, setHomeAddress] = useState<string>('');
  const [preferredShift, setPreferredShift] = useState<string>('সন্ধ্যা (Evening Shift)');
  const [selectedCourse, setSelectedCourse] = useState<string>('সাধারণ গণিত (General Math)');
  const [classLevel, setClassLevel] = useState<string>('Class 10');
  const [bookingSuccess, setBookingSuccess] = useState<boolean>(false);
  const [activePolicyModal, setActivePolicyModal] = useState<'privacy' | 'terms' | 'help' | null>(null);

  // Security auto-redirect for Admin view
  useEffect(() => {
    const checkRedirect = () => {
      if (currentView === View.ADMIN) {
        const isAdminDirect = localStorage.getItem('edustika_admin_logged_in') === 'true';
        const isStudentIn = localStorage.getItem('edustika_logged_in') === 'true';
        const currentId = localStorage.getItem('edustika_current_student_id');
        const accountsStr = localStorage.getItem('edustika_students_accounts');
        const rawAdmins = localStorage.getItem('edustika_authorized_admins');
        const authorized = rawAdmins ? JSON.parse(rawAdmins) : ['md.jaidulislam@hotmail.com', 'edu.mdjaidulislam@gmail.com', 'rr.mdjaidulislam@gmail.com'];
        
        let hasAccess = isAdminDirect;
        if (!hasAccess && isStudentIn && currentId && accountsStr) {
          try {
            const accounts = JSON.parse(accountsStr);
            const matched = accounts.find((acc: any) => acc.studentId === currentId);
            if (matched && authorized.map((e: string) => e.toLowerCase()).includes(matched.email.toLowerCase())) {
              hasAccess = true;
            }
          } catch (e) {
            console.error(e);
          }
        }
        if (!hasAccess) {
          setCurrentView(View.HOME);
        }
      }
    };

    checkRedirect();
    window.addEventListener('edustika-auth-change', checkRedirect);
    window.addEventListener('edustika-admins-change', checkRedirect);
    return () => {
      window.removeEventListener('edustika-auth-change', checkRedirect);
      window.removeEventListener('edustika-admins-change', checkRedirect);
    };
  }, [currentView]);

  const openBookingModal = (courseTitle?: string) => {
    if (courseTitle) {
      setPrefilledCourse(courseTitle);
      setSelectedCourse(courseTitle);
    } else {
      setPrefilledCourse('');
    }
    setIsBookingOpen(true);
  };

  const closeBookingModal = () => {
    setIsBookingOpen(false);
    setBookingSuccess(false);
    setStudentName('');
    setParentName('');
    setMobile('');
    setStudentEmail('');
    setSchoolName('');
    setHomeAddress('');
    setPreferredShift('সন্ধ্যা (Evening Shift)');
  };

  const handleBookingSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!studentName || !mobile) return;
    setBookingSuccess(true);
    setTimeout(() => {
      closeBookingModal();
    }, 4000);
  };

  return (
    <div className="min-h-screen bg-[#f8f9fa] font-sans text-gray-900 flex flex-col selection:bg-[#15803d] selection:text-white">
      
      {/* Navigation Topbar */}
      <Navbar
        currentView={currentView}
        setCurrentView={setCurrentView}
        openBookingModal={() => openBookingModal()}
        language={language}
        setLanguage={setLanguage}
      />

      {/* Main Page Layout Route rendering */}
      <main className="flex-grow">
        {currentView === View.HOME && (
          <div className="animate-fadeIn">
            <Hero setCurrentView={setCurrentView} openBookingModal={openBookingModal} language={language} />
            <Stats language={language} />
            <Courses setCurrentView={setCurrentView} openBookingModal={openBookingModal} language={language} />
            <WhyChooseUs openBookingModal={() => openBookingModal()} language={language} />
            <BlogSection language={language} />
            <Newsletter language={language} />
          </div>
        )}

        {currentView === View.COURSES && (
          <div className="animate-fadeIn">
            <Courses setCurrentView={setCurrentView} openBookingModal={openBookingModal} language={language} />
            <Newsletter language={language} />
          </div>
        )}

        {currentView === View.TUTOR_JAHID && (
          <div className="animate-fadeIn">
            <TutorProfile openBookingModal={openBookingModal} language={language} />
            <Newsletter language={language} />
          </div>
        )}

        {currentView === View.CLASSROOM && (
          <div className="animate-fadeIn">
            <WhiteboardClassroom language={language} />
          </div>
        )}

        {currentView === View.CONTACT && (
          <div className="animate-fadeIn">
            <Contact language={language} />
          </div>
        )}

        {currentView === View.DASHBOARD && (
          <div className="animate-fadeIn">
            <StudentDashboard language={language} />
          </div>
        )}

        {currentView === View.PAYMENT && (
          <div className="animate-fadeIn">
            <PaymentGateway language={language} />
          </div>
        )}

        {currentView === View.ADMIN && (
          <div className="animate-fadeIn">
            <AdminPanel />
          </div>
        )}
      </main>

      {/* Footer Branding block */}
      <Footer language={language} onOpenPolicy={(type) => setActivePolicyModal(type)} />

      <FloatingWhatsAppButton language={language} />

      {/* Policy Details Overlay Sheet Modals */}
      <PolicyModal
        isOpen={activePolicyModal !== null}
        type={activePolicyModal}
        onClose={() => setActivePolicyModal(null)}
        language={language}
      />

      {/* Global Academic Enrollment Booking Modal */}
      {isBookingOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4">
          <div className="bg-white border-2 border-[#15803d] w-full max-w-[550px] max-h-[90vh] overflow-y-auto text-left p-8 relative animate-scaleIn">
            
            {/* Close Button */}
            <button
              onClick={closeBookingModal}
              className="absolute top-4 right-4 text-gray-400 hover:text-black transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>

            {bookingSuccess ? (
              <div className="text-center py-8 space-y-4">
                <CheckCircle className="w-16 h-16 text-green-500 mx-auto" />
                <h3 className="font-display font-black text-gray-900 text-2xl">বুকিং সম্পূর্ণ হয়েছে!</h3>
                <p className="font-sans text-xs text-gray-500 max-w-[360px] mx-auto leading-relaxed">
                  এডুস্টিকা প্রিমিয়াম ম্যাথ কেয়ারে আপনার ডেমো ক্লাসের আবেদনটি সফলভাবে জমা পড়েছে। আমাদের মেন্টর টিম দ্রুত আপনার নাম্বারে যোগাযোগ করবে।
                </p>
              </div>
            ) : (
              <form onSubmit={handleBookingSubmit} className="space-y-5">
                <div className="flex items-center gap-2 text-[#15803d] border-b border-gray-100 pb-4 mb-2">
                  <GraduationCap className="w-6 h-6 text-[#22c55e]" />
                  <div>
                    <h3 className="font-display font-black text-lg text-gray-900 leading-tight">
                      এডুস্টিকা প্রিমিয়াম ভর্তি ফোরাম
                    </h3>
                    <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest mt-0.5">
                      Apply for Free Demo Slot
                    </p>
                  </div>
                </div>

                <div className="space-y-4">
                  {/* Student Name */}
                  <div>
                    <label className="block font-sans text-[10px] font-bold text-gray-500 uppercase tracking-widest mb-1.5">
                      শিক্ষার্থীর নাম (Student Name) *
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="যেমন: আবির হাসান"
                      value={studentName}
                      onChange={(e) => setStudentName(e.target.value)}
                      className="w-full bg-white border border-gray-300 px-4 py-2.5 text-xs outline-none focus:border-[#15803d] font-sans"
                    />
                  </div>

                  {/* Parent Name */}
                  <div>
                    <label className="block font-sans text-[10px] font-bold text-gray-500 uppercase tracking-widest mb-1.5">
                      অভিভাবকের নাম (Parent Name)
                    </label>
                    <input
                      type="text"
                      placeholder="যেমন: এম ডি রফিকুল ইসলাম"
                      value={parentName}
                      onChange={(e) => setParentName(e.target.value)}
                      className="w-full bg-white border border-gray-300 px-4 py-2.5 text-xs outline-none focus:border-[#15803d] font-sans"
                    />
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {/* Mobile Number */}
                    <div>
                      <label className="block font-sans text-[10px] font-bold text-gray-500 uppercase tracking-widest mb-1.5">
                        মোবাইল নাম্বার (Mobile Number) *
                      </label>
                      <input
                        type="tel"
                        required
                        placeholder="যেমন: 017xxxxxxxx"
                        value={mobile}
                        onChange={(e) => setMobile(e.target.value)}
                        className="w-full bg-white border border-gray-300 px-4 py-2.5 text-xs outline-none focus:border-[#15803d] font-sans"
                      />
                    </div>

                    {/* Email Address */}
                    <div>
                      <label className="block font-sans text-[10px] font-bold text-gray-500 uppercase tracking-widest mb-1.5">
                        ইমেইল এড্রেস (Email Address)
                      </label>
                      <input
                        type="email"
                        placeholder="যেমন: student@example.com"
                        value={studentEmail}
                        onChange={(e) => setStudentEmail(e.target.value)}
                        className="w-full bg-white border border-gray-300 px-4 py-2.5 text-xs outline-none focus:border-[#15803d] font-sans"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {/* School Name */}
                    <div>
                      <label className="block font-sans text-[10px] font-bold text-gray-500 uppercase tracking-widest mb-1.5">
                        শিক্ষাপ্রতিষ্ঠানের নাম (School/College)
                      </label>
                      <input
                        type="text"
                        placeholder="যেমন: রাজউক উত্তরা মডেল কলেজ"
                        value={schoolName}
                        onChange={(e) => setSchoolName(e.target.value)}
                        className="w-full bg-white border border-gray-300 px-4 py-2.5 text-xs outline-none focus:border-[#15803d] font-sans"
                      />
                    </div>

                    {/* Home Address */}
                    <div>
                      <label className="block font-sans text-[10px] font-bold text-gray-500 uppercase tracking-widest mb-1.5">
                        ঠিকানা / জেলা (Location/District)
                      </label>
                      <input
                        type="text"
                        placeholder="যেমন: উত্তরা, ঢাকা"
                        value={homeAddress}
                        onChange={(e) => setHomeAddress(e.target.value)}
                        className="w-full bg-white border border-gray-300 px-4 py-2.5 text-xs outline-none focus:border-[#15803d] font-sans"
                      />
                    </div>
                  </div>

                  {/* Class and Course selection */}
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block font-sans text-[10px] font-bold text-gray-500 uppercase tracking-widest mb-1.5">
                        শ্রেণী (Class Level)
                      </label>
                      <select
                        value={classLevel}
                        onChange={(e) => setClassLevel(e.target.value)}
                        className="w-full bg-white border border-gray-300 p-2.5 text-xs outline-none focus:border-[#15803d] font-sans"
                      >
                        <option value="Class 8">Class 8 (অষ্টম শ্রেণী)</option>
                        <option value="Class 9">Class 9 (নবম শ্রেণী)</option>
                        <option value="Class 10">Class 10 (দশম শ্রেণী)</option>
                        <option value="HSC 1st Year">HSC 1st Year (একাদশ)</option>
                        <option value="HSC 2nd Year">HSC 2nd Year (দ্বাদশ)</option>
                      </select>
                    </div>

                    <div>
                      <label className="block font-sans text-[10px] font-bold text-gray-500 uppercase tracking-widest mb-1.5">
                        আকাঙ্ক্ষিত কোর্স (Course)
                      </label>
                      <select
                        value={selectedCourse}
                        onChange={(e) => setSelectedCourse(e.target.value)}
                        className="w-full bg-white border border-gray-300 p-2.5 text-xs outline-none focus:border-[#15803d] font-sans"
                      >
                        <option value="সাধারণ গণিত (General Math)">সাধারণ গণিত (General Math)</option>
                        <option value="উচ্চতর গণিত (Higher Math)">উচ্চতর গণিত (Higher Math)</option>
                        <option value="পদার্থবিজ্ঞান (Physics)">পদার্থবিজ্ঞান (Physics)</option>
                      </select>
                    </div>
                  </div>

                  {/* Preferred Shift */}
                  <div>
                    <label className="block font-sans text-[10px] font-bold text-gray-500 uppercase tracking-widest mb-1.5">
                      পছন্দের ব্যাচ সময় (Preferred Shift / Batch Time)
                    </label>
                    <select
                      value={preferredShift}
                      onChange={(e) => setPreferredShift(e.target.value)}
                      className="w-full bg-white border border-gray-300 p-2.5 text-xs outline-none focus:border-[#15803d] font-sans"
                    >
                      <option value="সকাল (Morning Shift - 8:00 AM - 12:00 PM)">সকাল (Morning Shift - 8:00 AM - 12:00 PM)</option>
                      <option value="বিকাল (Afternoon Shift - 2:00 PM - 5:00 PM)">বিকাল (Afternoon Shift - 2:00 PM - 5:00 PM)</option>
                      <option value="সন্ধ্যা (Evening Shift - 6:00 PM - 9:00 PM)">সন্ধ্যা (Evening Shift - 6:00 PM - 9:00 PM)</option>
                      <option value="যেকোনো সময় (Flexible/Any)">যেকোনো সময় (Flexible/Any)</option>
                    </select>
                  </div>
                </div>

                <button
                  type="submit"
                  className="w-full bg-[#15803d] text-white hover:bg-black font-sans text-xs font-bold tracking-widest py-4 transition-all duration-300 border-2 border-[#15803d] hover:border-black active:scale-[0.98] cursor-pointer mt-4 uppercase"
                >
                  আবেদন সম্পন্ন করুন (SUBMIT APPLICATION)
                </button>
              </form>
            )}

          </div>
        </div>
      )}

    </div>
  );
}
