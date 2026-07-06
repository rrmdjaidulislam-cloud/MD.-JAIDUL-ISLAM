import React, { useState, useEffect } from 'react';
import { View } from '../types';
import { BookOpen, Award, Layers, Sparkles, GraduationCap } from 'lucide-react';
import Logo from './Logo';

interface NavbarProps {
  currentView: View;
  setCurrentView: (view: View) => void;
  openBookingModal: () => void;
  language: 'bn' | 'en';
  setLanguage: (lang: 'bn' | 'en') => void;
}

export default function Navbar({ currentView, setCurrentView, openBookingModal, language, setLanguage }: NavbarProps) {
  const [userEmail, setUserEmail] = useState<string | null>(null);
  const [isAdminLoggedInDirectly, setIsAdminLoggedInDirectly] = useState<boolean>(false);
  const [authorizedAdmins, setAuthorizedAdmins] = useState<string[]>(() => {
    const raw = localStorage.getItem('edustika_authorized_admins');
    return raw ? JSON.parse(raw) : ['md.jaidulislam@hotmail.com', 'edu.mdjaidulislam@gmail.com', 'rr.mdjaidulislam@gmail.com'];
  });

  useEffect(() => {
    const checkAuth = () => {
      // 1. Direct admin login
      setIsAdminLoggedInDirectly(localStorage.getItem('edustika_admin_logged_in') === 'true');

      // 2. Student email access
      const isLoggedIn = localStorage.getItem('edustika_logged_in') === 'true';
      if (!isLoggedIn) {
        setUserEmail(null);
        return;
      }
      const currentId = localStorage.getItem('edustika_current_student_id');
      const accountsStr = localStorage.getItem('edustika_students_accounts');
      if (currentId && accountsStr) {
        try {
          const accounts = JSON.parse(accountsStr);
          const matched = accounts.find((acc: any) => acc.studentId === currentId);
          if (matched) {
            setUserEmail(matched.email);
            return;
          }
        } catch (e) {
          console.error(e);
        }
      }
      setUserEmail(null);
    };

    const updateAdmins = () => {
      const raw = localStorage.getItem('edustika_authorized_admins');
      if (raw) {
        try {
          setAuthorizedAdmins(JSON.parse(raw));
        } catch (e) {
          console.error(e);
        }
      }
    };

    checkAuth();
    updateAdmins();

    window.addEventListener('edustika-auth-change', checkAuth);
    window.addEventListener('edustika-admins-change', updateAdmins);
    return () => {
      window.removeEventListener('edustika-auth-change', checkAuth);
      window.removeEventListener('edustika-admins-change', updateAdmins);
    };
  }, []);

  const hasAdminAccess = isAdminLoggedInDirectly || (userEmail !== null && authorizedAdmins.map(e => e.toLowerCase()).includes(userEmail.toLowerCase()));

  const navItems = [
    { id: View.HOME, label: 'HOME', labelBn: 'হোম' },
    { id: View.COURSES, label: 'COURSES', labelBn: 'কোর্সসমূহ' },
    { id: View.TUTOR_JAHID, label: 'TUTOR JAHID', labelBn: 'টিউটর জাহিদ' },
    { id: View.CLASSROOM, label: 'CLASSROOM', labelBn: 'ভার্চুয়াল ক্লাস' },
    { id: View.PAYMENT, label: 'PAYMENT', labelBn: 'পেমেন্ট' },
    { id: View.DASHBOARD, label: 'PORTAL', labelBn: 'পোর্টাল' },
    ...(hasAdminAccess ? [{ id: View.ADMIN, label: 'ADMIN', labelBn: 'এডমিন' }] : []),
  ];

  return (
    <header className="sticky top-0 z-50 bg-white border-b border-[#e9ecef] shadow-xs">
      <div className="max-w-[1280px] mx-auto px-6 h-20 flex items-center justify-between font-sans">
        {/* Logo */}
        <button
          onClick={() => setCurrentView(View.HOME)}
          className="cursor-pointer group flex items-center"
        >
          <Logo variant="horizontal" iconSize={42} />
        </button>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center gap-6">
          {navItems.map((item) => (
            <button
              key={item.id}
              onClick={() => setCurrentView(item.id)}
              className={`font-sans text-xs font-semibold tracking-wider transition-all duration-200 cursor-pointer relative py-2 ${
                currentView === item.id
                  ? 'text-[#15803d]'
                  : 'text-[#434654] hover:text-[#15803d]'
              }`}
            >
              {language === 'bn' ? item.labelBn : item.label}
              {currentView === item.id && (
                <div className="absolute bottom-0 left-0 w-full h-[3px] bg-[#15803d]" />
              )}
            </button>
          ))}
        </nav>

        {/* Action Button & Language Toggle */}
        <div className="flex items-center gap-3">
          {/* Language toggle: বাং | EN */}
          <div className="flex items-center border border-gray-200 bg-gray-50 p-0.5 rounded-xs gap-0.5">
            <button
              onClick={() => setLanguage('bn')}
              className={`px-2 py-1 text-[10px] font-black cursor-pointer transition-all rounded-2xs ${
                language === 'bn' ? 'bg-[#15803d] text-white' : 'text-gray-500 hover:text-black'
              }`}
            >
              বাংলা
            </button>
            <button
              onClick={() => setLanguage('en')}
              className={`px-2 py-1 text-[10px] font-black cursor-pointer transition-all rounded-2xs ${
                language === 'en' ? 'bg-[#15803d] text-white' : 'text-gray-500 hover:text-black'
              }`}
            >
              ENG
            </button>
          </div>

          <button
            onClick={() => setCurrentView(View.CLASSROOM)}
            className="hidden lg:flex items-center gap-2 bg-green-50 text-[#15803d] hover:bg-green-100 font-sans text-xs font-bold tracking-wider px-4 py-2.5 border border-[#15803d]/20 transition-all cursor-pointer"
          >
            <Sparkles className="w-3.5 h-3.5 text-[#22c55e]" />
            {language === 'bn' ? 'এআই ক্লাসরুম' : 'AI CLASSROOM'}
          </button>
          <button
            onClick={openBookingModal}
            className="bg-[#15803d] text-white hover:bg-black font-sans text-xs font-bold tracking-widest px-6 py-2.5 transition-all duration-300 border-2 border-[#15803d] active:scale-[0.98] cursor-pointer shadow-sm"
          >
            {language === 'bn' ? 'ভর্তি হোন' : 'Enroll Now'}
          </button>
        </div>
      </div>
    </header>
  );
}
