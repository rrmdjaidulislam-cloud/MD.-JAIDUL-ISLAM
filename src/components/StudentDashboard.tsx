import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { 
  User, BookOpen, Award, Clock, Flame, CheckCircle2, 
  ChevronRight, Settings, LogOut, Lock, FileText, 
  TrendingUp, Calendar, AlertCircle, Edit2, Save, Sparkles, HelpCircle,
  Printer, X
} from 'lucide-react';

// Interfaces for our interactive student data
interface DashboardData {
  studentName: string;
  studentNameBn: string;
  school: string;
  schoolBn: string;
  studentId: string;
  classLevel: string;
  attendedHours: number;
  hoursGoal: number;
  streak: number;
  quizzes: {
    id: string;
    title: string;
    titleBn: string;
    score: number;
    total: number;
    date: string;
    status: 'PASSED' | 'FAILED' | 'EXCELLENT';
  }[];
}

const DEFAULT_DATA: DashboardData = {
  studentName: 'Abir Hasan',
  studentNameBn: 'আবির হাসান',
  school: 'Dhaka Cantonment Public School & College',
  schoolBn: 'ঢাকা ক্যান্টনমেন্ট পাবলিক স্কুল ও কলেজ',
  studentId: 'ED-2026-0489',
  classLevel: 'Class 10 (দশম শ্রেণী)',
  attendedHours: 18.5,
  hoursGoal: 24,
  streak: 6,
  quizzes: [
    { id: 'q1', title: 'Trigonometry Formulas', titleBn: 'ত্রিকোণমিতি সূত্রাবলী', score: 3, total: 3, date: '2026-06-28', status: 'EXCELLENT' },
    { id: 'q2', title: 'Calculus - Basics & Limits', titleBn: 'ক্যালকুলাস সীমা পরিচিতি', score: 2, total: 3, date: '2026-07-02', status: 'PASSED' },
    { id: 'q3', title: 'Linear Equations & Graphs', titleBn: 'সরল সমীকরণ ও লেখচিত্র', score: 4, total: 4, date: '2026-07-05', status: 'EXCELLENT' },
    { id: 'q4', title: 'Probability & Distributions', titleBn: 'সম্ভাব্যতা ও বিন্যাস', score: 4, total: 5, date: '2026-07-06', status: 'PASSED' }
  ]
};

// Simple interactive quiz questions for the Practice Arena tab
interface PracticeQuizQuestion {
  id: number;
  question: string;
  options: string[];
  correctIdx: number;
}

const PRACTICE_QUESTIONS: PracticeQuizQuestion[] = [
  {
    id: 1,
    question: 'যদি sin(θ) = 4/5 হয়, এবং θ সূক্ষ্মকোণ হয়, তবে cos(θ) এর মান কত?',
    options: ['3/5', '5/4', '3/4', '4/3'],
    correctIdx: 0,
  },
  {
    id: 2,
    question: 'log₂ x = 5 হলে, x এর মান কত?',
    options: ['10', '25', '32', '16'],
    correctIdx: 2,
  },
  {
    id: 3,
    question: 'y = 3x² + 2x + 1 বক্ররেখার x = 1 বিন্দুতে ঢাল (Slope) কত?',
    options: ['5', '6', '8', '2'],
    correctIdx: 2, // dy/dx = 6x + 2, at x=1, it is 8
  }
];

// Interface for registered accounts
interface StudentAccount {
  studentId: string;
  email: string;
  password: string;
  dashboardData: DashboardData;
}

const getInitialAccounts = (): StudentAccount[] => {
  const saved = localStorage.getItem('edustika_students_accounts');
  if (saved) {
    try {
      return JSON.parse(saved);
    } catch (e) {
      console.error(e);
    }
  }
  
  // Return the default student accounts list
  const defaultStudents: StudentAccount[] = [
    {
      studentId: 'ED-2026-0489',
      email: 'student@edustika.com',
      password: 'student123',
      dashboardData: DEFAULT_DATA
    },
    {
      studentId: 'ED-2026-1001',
      email: 'md.jaidulislam@hotmail.com',
      password: 'admin123',
      dashboardData: {
        studentName: 'Jaidul Islam (Hotmail)',
        studentNameBn: 'জাহিদুল ইসলাম (হটমেইল)',
        school: 'Edustika Academy',
        schoolBn: 'এডুস্টিকা একাডেমী',
        studentId: 'ED-2026-1001',
        classLevel: 'Class 12 (দ্বাদশ শ্রেণী)',
        attendedHours: 15,
        hoursGoal: 20,
        streak: 5,
        quizzes: [
          { id: 'welcome-q', title: 'Welcome Evaluation', titleBn: 'স্বাগতম মূল্যায়ন', score: 5, total: 5, date: '2026-07-06', status: 'EXCELLENT' }
        ]
      }
    },
    {
      studentId: 'ED-2026-1002',
      email: 'edu.mdjaidulislam@gmail.com',
      password: 'admin123',
      dashboardData: {
        studentName: 'Jaidul Islam (Gmail)',
        studentNameBn: 'জাহিদুল ইসলাম (জিমেইল)',
        school: 'Edustika Academy',
        schoolBn: 'এডুস্টিকা একাডেমী',
        studentId: 'ED-2026-1002',
        classLevel: 'Class 11 (একাদশ শ্রেণী)',
        attendedHours: 12,
        hoursGoal: 20,
        streak: 4,
        quizzes: [
          { id: 'welcome-q', title: 'Welcome Evaluation', titleBn: 'স্বাগতম মূল্যায়ন', score: 5, total: 5, date: '2026-07-06', status: 'EXCELLENT' }
        ]
      }
    },
    {
      studentId: 'ED-2026-1003',
      email: 'rr.mdjaidulislam@gmail.com',
      password: 'admin123',
      dashboardData: {
        studentName: 'Master Admin Jaidul',
        studentNameBn: 'মাস্টার এডমিন জাহিদুল',
        school: 'Dhaka University',
        schoolBn: 'ঢাকা বিশ্ববিদ্যালয়',
        studentId: 'ED-2026-1003',
        classLevel: 'University (বিশ্ববিদ্যালয়)',
        attendedHours: 24,
        hoursGoal: 24,
        streak: 10,
        quizzes: [
          { id: 'welcome-q', title: 'Welcome Evaluation', titleBn: 'স্বাগতম মূল্যায়ন', score: 5, total: 5, date: '2026-07-06', status: 'EXCELLENT' }
        ]
      }
    }
  ];
  localStorage.setItem('edustika_students_accounts', JSON.stringify(defaultStudents));
  return defaultStudents;
};

export default function StudentDashboard() {
  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(() => {
    return localStorage.getItem('edustika_logged_in') === 'true';
  });

  const [loginMode, setLoginMode] = useState<'login' | 'signup'>('login');
  const [loginIdentifier, setLoginIdentifier] = useState<string>('ED-2026-0489');
  const [loginPassword, setLoginPassword] = useState<string>('student123');
  const [loginError, setLoginError] = useState<string>('');

  // Signup states
  const [signupEmail, setSignupEmail] = useState<string>('');
  const [signupPassword, setSignupPassword] = useState<string>('');
  const [signupName, setSignupName] = useState<string>('');
  const [signupNameBn, setSignupNameBn] = useState<string>('');
  const [signupSchool, setSignupSchool] = useState<string>('');
  const [signupSchoolBn, setSignupSchoolBn] = useState<string>('');
  const [signupClass, setSignupClass] = useState<string>('Class 10 (দশম শ্রেণী)');
  const [signupSuccessInfo, setSignupSuccessInfo] = useState<{ studentId: string; email: string } | null>(null);

  // Dashboard Interactive States
  const [data, setData] = useState<DashboardData>(() => {
    const savedId = localStorage.getItem('edustika_current_student_id') || 'ED-2026-0489';
    const savedAccountsStr = localStorage.getItem('edustika_students_accounts');
    if (savedAccountsStr) {
      try {
        const accountsList: StudentAccount[] = JSON.parse(savedAccountsStr);
        const matched = accountsList.find(acc => acc.studentId === savedId);
        if (matched) return matched.dashboardData;
      } catch (e) {
        console.error(e);
      }
    }
    const saved = localStorage.getItem('edustika_student_data');
    return saved ? JSON.parse(saved) : DEFAULT_DATA;
  });

  const [activeTab, setActiveTab] = useState<'overview' | 'analytics' | 'practice' | 'profile'>('overview');
  const [showPrintReport, setShowPrintReport] = useState<boolean>(false);

  // Profile Edit Mode State
  const [isEditingProfile, setIsEditingProfile] = useState<boolean>(false);
  const [editName, setEditName] = useState<string>(data.studentName);
  const [editNameBn, setEditNameBn] = useState<string>(data.studentNameBn);
  const [editSchool, setEditSchool] = useState<string>(data.school);
  const [editSchoolBn, setEditSchoolBn] = useState<string>(data.schoolBn);
  const [editClass, setEditClass] = useState<string>(data.classLevel);

  // Sync edit fields with data when active student data shifts
  useEffect(() => {
    setEditName(data.studentName);
    setEditNameBn(data.studentNameBn);
    setEditSchool(data.school);
    setEditSchoolBn(data.schoolBn);
    setEditClass(data.classLevel);
  }, [data]);

  // Manual Hours log state to show interactive stats increments
  const [hoursToAdd, setHoursToAdd] = useState<string>('');
  const [hoursLogSuccess, setHoursLogSuccess] = useState<boolean>(false);

  // Practice Quiz States
  const [practiceActive, setPracticeActive] = useState<boolean>(false);
  const [practiceIdx, setPracticeIdx] = useState<number>(0);
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [practiceScore, setPracticeScore] = useState<number>(0);
  const [practiceFinished, setPracticeFinished] = useState<boolean>(false);

  // Sync data to accounts list and individual localStorage
  useEffect(() => {
    localStorage.setItem('edustika_student_data', JSON.stringify(data));
    
    // Update the corresponding account in the accounts list
    const savedId = localStorage.getItem('edustika_current_student_id') || 'ED-2026-0489';
    const savedAccountsStr = localStorage.getItem('edustika_students_accounts');
    if (savedAccountsStr) {
      try {
        const accountsList: StudentAccount[] = JSON.parse(savedAccountsStr);
        const updatedAccounts = accountsList.map(acc => {
          if (acc.studentId === savedId) {
            return { ...acc, dashboardData: data };
          }
          return acc;
        });
        localStorage.setItem('edustika_students_accounts', JSON.stringify(updatedAccounts));
      } catch (e) {
        console.error("Error updating accounts list:", e);
      }
    }
  }, [data]);

  // Handle Login submission
  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    const identifier = loginIdentifier.trim().toLowerCase();
    const accountsList = getInitialAccounts();
    
    const matchedAccount = accountsList.find(acc => 
      (acc.studentId.toLowerCase() === identifier || acc.email.toLowerCase() === identifier) && 
      acc.password === loginPassword
    );

    if (matchedAccount) {
      setIsLoggedIn(true);
      localStorage.setItem('edustika_logged_in', 'true');
      localStorage.setItem('edustika_current_student_id', matchedAccount.studentId);
      localStorage.setItem('edustika_student_data', JSON.stringify(matchedAccount.dashboardData));
      setData(matchedAccount.dashboardData);
      setLoginError('');
      setSignupSuccessInfo(null);
      // Notify other components (Navbar, App router) that auth state changed
      window.dispatchEvent(new Event('edustika-auth-change'));
    } else {
      setLoginError('ভুল আইডি, ইমেইল অথবা পাসওয়ার্ড! (সংকেত: আইডি ED-2026-0489 এবং পাসওয়ার্ড student123 ব্যবহার করুন অথবা নতুন অ্যাকাউন্ট সাইন আপ করুন)');
    }
  };

  // Handle Signup submission
  const handleSignup = (e: React.FormEvent) => {
    e.preventDefault();
    const email = signupEmail.trim().toLowerCase();
    
    // Simple email validation pattern
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailPattern.test(email)) {
      setLoginError('অনুগ্রহ করে একটি সঠিক ইমেল এড্রেস প্রদান করুন (Please enter a valid email address)।');
      return;
    }

    if (signupPassword.length < 5) {
      setLoginError('পাসওয়ার্ডটি অন্তত ৫ অক্ষরের হতে হবে (Password must be at least 5 characters)।');
      return;
    }

    const accountsList = getInitialAccounts();
    
    // Check if email already exists
    const emailExists = accountsList.some(acc => acc.email.toLowerCase() === email);
    if (emailExists) {
      setLoginError('এই ইমেলটি দিয়ে ইতিমধ্যে একটি অ্যাকাউন্ট তৈরি করা হয়েছে! (This email is already registered!)');
      return;
    }

    // Generate a unique ID: ED-2026-XXXX (sequential or random but verified unique)
    let newId = '';
    let isUnique = false;
    while (!isUnique) {
      const randNum = Math.floor(1000 + Math.random() * 9000);
      newId = `ED-2026-${randNum}`;
      isUnique = !accountsList.some(acc => acc.studentId === newId);
    }

    // Set fallback default names if left blank
    const sName = signupName.trim() || 'New Student';
    const sNameBn = signupNameBn.trim() || 'নতুন শিক্ষার্থী';
    const sSchool = signupSchool.trim() || 'Unspecified School';
    const sSchoolBn = signupSchoolBn.trim() || 'অনির্ধারিত শিক্ষা প্রতিষ্ঠান';

    const newStudentData: DashboardData = {
      studentName: sName,
      studentNameBn: sNameBn,
      school: sSchool,
      schoolBn: sSchoolBn,
      studentId: newId,
      classLevel: signupClass,
      attendedHours: 0,
      hoursGoal: 20,
      streak: 1, // Start with a 1-day streak
      quizzes: [
        { id: 'welcome-q', title: 'Welcome Evaluation', titleBn: 'স্বাগতম মূল্যায়ন', score: 5, total: 5, date: new Date().toISOString().split('T')[0], status: 'EXCELLENT' }
      ]
    };

    const newAccount: StudentAccount = {
      studentId: newId,
      email: email,
      password: signupPassword,
      dashboardData: newStudentData
    };

    const updatedAccounts = [...accountsList, newAccount];
    localStorage.setItem('edustika_students_accounts', JSON.stringify(updatedAccounts));

    // Clear signup form
    setSignupEmail('');
    setSignupPassword('');
    setSignupName('');
    setSignupNameBn('');
    setSignupSchool('');
    setSignupSchoolBn('');
    
    // Set success info so they can see their assigned student ID!
    setSignupSuccessInfo({
      studentId: newId,
      email: email
    });
    setLoginError('');
    
    // Pre-fill login identifier for convenience
    setLoginIdentifier(newId);
    setLoginPassword(signupPassword);
    
    // Auto switch to login tab
    setLoginMode('login');
  };

  // Handle Logout
  const handleLogout = () => {
    setIsLoggedIn(false);
    localStorage.removeItem('edustika_logged_in');
    localStorage.removeItem('edustika_current_student_id');
    // Notify other components (Navbar, App router) that auth state changed
    window.dispatchEvent(new Event('edustika-auth-change'));
  };

  // Log study hours dynamically
  const handleLogHours = (e: React.FormEvent) => {
    e.preventDefault();
    const added = parseFloat(hoursToAdd);
    if (!isNaN(added) && added > 0) {
      setData(prev => ({
        ...prev,
        attendedHours: Math.min(prev.hoursGoal * 1.5, parseFloat((prev.attendedHours + added).toFixed(1)))
      }));
      setHoursToAdd('');
      setHoursLogSuccess(true);
      setTimeout(() => setHoursLogSuccess(false), 3000);
    }
  };

  // Save profile edits
  const handleSaveProfile = (e: React.FormEvent) => {
    e.preventDefault();
    setData(prev => ({
      ...prev,
      studentName: editName,
      studentNameBn: editNameBn,
      school: editSchool,
      schoolBn: editSchoolBn,
      classLevel: editClass
    }));
    setIsEditingProfile(false);
  };

  // Interactive Quiz Logic
  const handleOptionSelect = (idx: number) => {
    if (selectedAnswer !== null) return;
    setSelectedAnswer(idx);
    if (idx === PRACTICE_QUESTIONS[practiceIdx].correctIdx) {
      setPracticeScore(prev => prev + 1);
    }
  };

  const handleNextPracticeQuestion = () => {
    setSelectedAnswer(null);
    if (practiceIdx + 1 < PRACTICE_QUESTIONS.length) {
      setPracticeIdx(prev => prev + 1);
    } else {
      setPracticeFinished(true);
      // Log this new quiz completed into student records!
      const finalScore = practiceScore + (selectedAnswer === PRACTICE_QUESTIONS[practiceIdx].correctIdx ? 1 : 0);
      const totalQs = PRACTICE_QUESTIONS.length;
      const percent = (finalScore / totalQs) * 100;
      const status = percent >= 80 ? 'EXCELLENT' : 'PASSED';
      
      const newQuizRecord = {
        id: `practice-${Date.now()}`,
        title: 'Daily Math Practice Run',
        titleBn: 'দৈনিক সাধারণ গণিত অনুশীলন',
        score: finalScore,
        total: totalQs,
        date: new Date().toISOString().split('T')[0],
        status: status as 'PASSED' | 'FAILED' | 'EXCELLENT'
      };

      setData(prev => ({
        ...prev,
        quizzes: [newQuizRecord, ...prev.quizzes],
        streak: prev.streak + 1 // Increment streak for practicing
      }));
    }
  };

  const resetPractice = () => {
    setPracticeActive(false);
    setPracticeIdx(0);
    setSelectedAnswer(null);
    setPracticeScore(0);
    setPracticeFinished(false);
  };

  // Calculate stats
  const totalCompletedQuizzes = data.quizzes.length;
  const totalCorrectAnswers = data.quizzes.reduce((sum, item) => sum + item.score, 0);
  const totalPossibleAnswers = data.quizzes.reduce((sum, item) => sum + item.total, 0);
  const averageQuizPercent = totalPossibleAnswers > 0 
    ? Math.round((totalCorrectAnswers / totalPossibleAnswers) * 100) 
    : 0;

  return (
    <div className={`max-w-[1280px] mx-auto px-6 py-12 ${showPrintReport ? 'print:hidden' : ''}`}>
      
      {!isLoggedIn ? (
        /* PORTAL LOGIN/SIGNUP CONTAINER */
        <div className="max-w-lg mx-auto bg-white border-2 border-[#214fc7] shadow-sm">
          {/* Tabs for switching modes */}
          <div className="flex border-b border-gray-200">
            <button
              onClick={() => { setLoginMode('login'); setLoginError(''); }}
              className={`flex-1 text-center py-4 font-sans text-xs font-bold uppercase tracking-wider transition-all cursor-pointer ${loginMode === 'login' ? 'bg-white text-[#214fc7] border-b-4 border-[#214fc7]' : 'bg-slate-50 text-gray-400 hover:text-gray-700'}`}
            >
              লগইন (LOG IN)
            </button>
            <button
              onClick={() => { setLoginMode('signup'); setLoginError(''); }}
              className={`flex-1 text-center py-4 font-sans text-xs font-bold uppercase tracking-wider transition-all cursor-pointer ${loginMode === 'signup' ? 'bg-white text-[#214fc7] border-b-4 border-[#214fc7]' : 'bg-slate-50 text-gray-400 hover:text-gray-700'}`}
            >
              নতুন সাইন আপ (REGISTER)
            </button>
          </div>

          <div className="p-8">
            <div className="text-center mb-6">
              <div className="w-12 h-12 bg-blue-50 text-[#214fc7] flex items-center justify-center border border-blue-100 mx-auto mb-3">
                <Lock className="w-6 h-6 text-[#214fc7]" />
              </div>
              <h2 className="font-display font-black text-[#191c1d] text-2xl tracking-tight">
                {loginMode === 'login' ? 'শিক্ষার্থী পোর্টাল (Student Portal)' : 'নতুন রেজিস্ট্রেশন (Student Registration)'}
              </h2>
              <p className="font-sans text-xs text-gray-400 font-bold uppercase tracking-widest mt-1">
                {loginMode === 'login' ? 'Edustika Premium Portal' : 'Create Edustika Student Account'}
              </p>
              <div className="w-12 h-1 bg-[#fcd400] mx-auto mt-4"></div>
            </div>

            {/* Success notification for registration */}
            {signupSuccessInfo && (
              <div className="bg-emerald-50 border-2 border-emerald-500/30 p-5 mb-6 text-left relative">
                <div className="flex items-start gap-3">
                  <div className="bg-emerald-500 text-white rounded-full p-1 mt-0.5 shrink-0">
                    <CheckCircle2 className="w-4 h-4" />
                  </div>
                  <div className="w-full">
                    <h4 className="font-sans font-extrabold text-emerald-900 text-sm">
                      রেজিস্ট্রেশন সফল হয়েছে! (Registration Successful)
                    </h4>
                    <p className="font-sans text-xs text-emerald-800 leading-relaxed mt-1">
                      আপনার ইউনিক আইডি ও ডিটেইলস নিচে দেওয়া হলো। এই ইউনিক আইডি অথবা আপনার ইমেইল এবং পাসওয়ার্ড দিয়ে লগইন করতে পারবেন।
                    </p>
                    <div className="mt-3.5 space-y-2 bg-white p-3.5 border border-emerald-200/50">
                      <p className="font-sans text-xs text-gray-600">
                        ইউনিক স্টুডেন্ট আইডি: <strong className="font-mono text-base text-[#214fc7] ml-1">{signupSuccessInfo.studentId}</strong>
                      </p>
                      <p className="font-sans text-xs text-gray-600">
                        নিবন্ধিত ইমেইল: <strong className="font-sans text-gray-800 ml-1">{signupSuccessInfo.email}</strong>
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {loginError && (
              <div className="bg-red-50 border-l-4 border-red-500 p-4 mb-6 flex items-start gap-2.5 text-xs text-red-700 leading-relaxed text-left">
                <AlertCircle className="w-4 h-4 flex-shrink-0 text-red-600 mt-0.5" />
                <p>{loginError}</p>
              </div>
            )}

            {loginMode === 'login' ? (
              /* LOGIN FORM */
              <form onSubmit={handleLogin} className="space-y-5 text-left">
                <div>
                  <label className="block font-sans text-[10px] font-bold text-gray-500 uppercase tracking-widest mb-1.5">
                    স্টুডেন্ট আইডি অথবা ইমেইল (Student ID or Email)
                  </label>
                  <input
                    type="text"
                    required
                    value={loginIdentifier}
                    onChange={(e) => setLoginIdentifier(e.target.value)}
                    placeholder="ED-2026-xxxx অথবা email@example.com"
                    className="w-full bg-white border border-gray-300 px-4 py-2.5 text-xs outline-none focus:border-[#214fc7] font-sans"
                  />
                </div>

                <div>
                  <label className="block font-sans text-[10px] font-bold text-gray-500 uppercase tracking-widest mb-1.5">
                    পাসওয়ার্ড (Password)
                  </label>
                  <input
                    type="password"
                    required
                    value={loginPassword}
                    onChange={(e) => setLoginPassword(e.target.value)}
                    placeholder="Password"
                    className="w-full bg-white border border-gray-300 px-4 py-2.5 text-xs outline-none focus:border-[#214fc7] font-sans"
                  />
                </div>

                <button
                  type="submit"
                  className="w-full bg-[#fcd400] text-[#191c1d] hover:bg-[#214fc7] hover:text-white font-sans text-xs font-bold tracking-widest py-3.5 transition-all duration-300 border-2 border-[#fcd400] hover:border-[#214fc7] cursor-pointer uppercase"
                >
                  লগইন করুন (SIGN IN)
                </button>
              </form>
            ) : (
              /* SIGNUP FORM */
              <form onSubmit={handleSignup} className="space-y-4 text-left">
                <div>
                  <label className="block font-sans text-[10px] font-bold text-gray-500 uppercase tracking-widest mb-1">
                    ইমেইল এড্রেস (Email Address) *
                  </label>
                  <input
                    type="email"
                    required
                    value={signupEmail}
                    onChange={(e) => setSignupEmail(e.target.value)}
                    placeholder="email@example.com"
                    className="w-full bg-white border border-gray-300 px-4 py-2 text-xs outline-none focus:border-[#214fc7] font-sans"
                  />
                </div>

                <div>
                  <label className="block font-sans text-[10px] font-bold text-gray-500 uppercase tracking-widest mb-1">
                    পাসওয়ার্ড (Password) *
                  </label>
                  <input
                    type="password"
                    required
                    value={signupPassword}
                    onChange={(e) => setSignupPassword(e.target.value)}
                    placeholder="পাসওয়ার্ড (কমপক্ষে ৫ অক্ষর)"
                    className="w-full bg-white border border-gray-300 px-4 py-2 text-xs outline-none focus:border-[#214fc7] font-sans"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block font-sans text-[10px] font-bold text-gray-500 uppercase tracking-widest mb-1">
                      শিক্ষার্থীর নাম (English)
                    </label>
                    <input
                      type="text"
                      value={signupName}
                      onChange={(e) => setSignupName(e.target.value)}
                      placeholder="e.g. Abir Hasan"
                      className="w-full bg-white border border-gray-300 px-4 py-2 text-xs outline-none focus:border-[#214fc7] font-sans"
                    />
                  </div>
                  <div>
                    <label className="block font-sans text-[10px] font-bold text-gray-500 uppercase tracking-widest mb-1">
                      শিক্ষার্থীর নাম (বাংলা)
                    </label>
                    <input
                      type="text"
                      value={signupNameBn}
                      onChange={(e) => setSignupNameBn(e.target.value)}
                      placeholder="যেমন: আবির হাসান"
                      className="w-full bg-white border border-gray-300 px-4 py-2 text-xs outline-none focus:border-[#214fc7] font-sans"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block font-sans text-[10px] font-bold text-gray-500 uppercase tracking-widest mb-1">
                      শিক্ষা প্রতিষ্ঠান (English)
                    </label>
                    <input
                      type="text"
                      value={signupSchool}
                      onChange={(e) => setSignupSchool(e.target.value)}
                      placeholder="e.g. DCPSC"
                      className="w-full bg-white border border-gray-300 px-4 py-2 text-xs outline-none focus:border-[#214fc7] font-sans"
                    />
                  </div>
                  <div>
                    <label className="block font-sans text-[10px] font-bold text-gray-500 uppercase tracking-widest mb-1">
                      শিক্ষা প্রতিষ্ঠান (বাংলা)
                    </label>
                    <input
                      type="text"
                      value={signupSchoolBn}
                      onChange={(e) => setSignupSchoolBn(e.target.value)}
                      placeholder="যেমন: ঢাকা ক্যান্টনমেন্ট স্কুল"
                      className="w-full bg-white border border-gray-300 px-4 py-2 text-xs outline-none focus:border-[#214fc7] font-sans"
                    />
                  </div>
                </div>

                <div>
                  <label className="block font-sans text-[10px] font-bold text-gray-500 uppercase tracking-widest mb-1">
                    শ্রেণী ও ব্যাচ (Class & Batch)
                  </label>
                  <select
                    value={signupClass}
                    onChange={(e) => setSignupClass(e.target.value)}
                    className="w-full bg-white border border-gray-300 px-4 py-2 text-xs outline-none focus:border-[#214fc7] font-sans"
                  >
                    <option value="Class 10 (দশম শ্রেণী)">Class 10 (দশম শ্রেণী)</option>
                    <option value="Class 11 (একাদশ শ্রেণী)">Class 11 (একাদশ শ্রেণী)</option>
                    <option value="Class 12 (দ্বাদশ শ্রেণী)">Class 12 (দ্বাদশ শ্রেণী)</option>
                    <option value="HSC Examinee (এইচএসসি পরীক্ষার্থী)">HSC Examinee (এইচএসসি পরীক্ষার্থী)</option>
                  </select>
                </div>

                <button
                  type="submit"
                  className="w-full bg-[#214fc7] text-white hover:bg-black font-sans text-xs font-bold tracking-widest py-3 transition-all duration-300 cursor-pointer uppercase mt-2"
                >
                  অ্যাকাউন্ট তৈরি করুন (REGISTER NOW)
                </button>
              </form>
            )}

            {/* Quick Demo Credentials Info Card */}
            <div className="mt-8 bg-blue-50/50 border border-blue-100 p-4 text-center">
              <span className="font-sans text-[9px] font-bold text-[#214fc7] tracking-wider uppercase block mb-1">
                Default Demo Account Info
              </span>
              <p className="font-sans text-xs text-gray-600 leading-relaxed">
                ID / Email: <code className="bg-white border border-gray-200 px-1 py-0.5 rounded font-mono text-gray-800">ED-2026-0489</code> or <code className="bg-white border border-gray-200 px-1 py-0.5 rounded font-mono text-gray-800">student@edustika.com</code> <br />
                Password: <code className="bg-white border border-gray-200 px-1.5 py-0.5 rounded font-mono text-gray-800">student123</code>
              </p>
            </div>
          </div>
        </div>
      ) : (
        /* LOGGED IN STUDENT DASHBOARD */
        <div className="space-y-8 animate-fadeIn">
          
          {/* Dashboard Header Banner */}
          <div className="bg-white border border-gray-200 p-6 sm:p-8 flex flex-col md:flex-row items-center justify-between gap-6 shadow-xs">
            <div className="flex items-center gap-4 text-left w-full md:w-auto">
              <div className="w-16 h-16 bg-[#214fc7] text-white flex items-center justify-center font-display font-black text-2xl border-2 border-[#fcd400] shrink-0">
                {data.studentName.charAt(0)}
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h1 className="font-display font-black text-gray-900 text-xl sm:text-2xl tracking-tight">
                    {data.studentNameBn} ({data.studentName})
                  </h1>
                  <span className="bg-green-100 text-green-800 text-[9px] font-bold px-2 py-0.5 uppercase tracking-wide">
                    Active Student
                  </span>
                </div>
                <p className="font-sans text-xs text-gray-500 font-medium mt-1">
                  ID: <span className="font-mono text-gray-800 font-bold">{data.studentId}</span> • {data.classLevel}
                </p>
                <p className="font-sans text-xs text-gray-400 mt-0.5">
                  {data.schoolBn}
                </p>
              </div>
            </div>

            {/* Header Actions / Info */}
            <div className="flex flex-wrap items-center gap-3 w-full md:w-auto justify-end border-t md:border-t-0 border-gray-100 pt-4 md:pt-0">
              <div className="bg-yellow-50 text-yellow-800 border border-yellow-200/50 px-3.5 py-1.5 flex items-center gap-2 text-xs font-bold font-sans">
                <Flame className="w-4 h-4 text-amber-500 animate-pulse" />
                <span>{data.streak} Days Study Streak</span>
              </div>
              <button
                onClick={() => setShowPrintReport(true)}
                className="flex items-center gap-1.5 border border-[#214fc7] bg-blue-50/40 hover:bg-[#214fc7] hover:text-white text-[#214fc7] font-sans text-xs font-bold px-3 py-1.5 cursor-pointer transition-all duration-200 uppercase tracking-wider"
              >
                <Printer className="w-3.5 h-3.5" />
                প্রগতি পত্র (Report)
              </button>
              <button
                onClick={handleLogout}
                className="flex items-center gap-1.5 border border-red-200 hover:bg-red-50 text-red-600 font-sans text-xs font-bold px-3 py-1.5 cursor-pointer transition-colors"
              >
                <LogOut className="w-3.5 h-3.5" />
                LOGOUT
              </button>
            </div>
          </div>

          {/* Quick Metrics Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            
            {/* Metric 1: Class Hours */}
            <div className="bg-white border border-gray-200 p-6 flex items-center justify-between shadow-xs">
              <div className="text-left">
                <span className="block font-sans text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1">
                  Class Hours Attended
                </span>
                <span className="font-display font-black text-gray-900 text-3xl leading-none">
                  {data.attendedHours} Hrs
                </span>
                <span className="block font-sans text-[10px] text-gray-500 mt-2">
                  Monthly Goal: {data.hoursGoal} Hrs ({Math.round((data.attendedHours / data.hoursGoal) * 100)}%)
                </span>
              </div>
              <div className="relative w-14 h-14 shrink-0">
                {/* SVG Progress Circle */}
                <svg className="w-full h-full transform -rotate-90">
                  <circle cx="28" cy="28" r="24" stroke="#f1f3f5" strokeWidth="4" fill="transparent" />
                  <circle 
                    cx="28" 
                    cy="28" 
                    r="24" 
                    stroke="#214fc7" 
                    strokeWidth="4" 
                    fill="transparent" 
                    strokeDasharray={`${2 * Math.PI * 24}`}
                    strokeDashoffset={`${2 * Math.PI * 24 * (1 - Math.min(1, data.attendedHours / data.hoursGoal))}`}
                  />
                </svg>
                <div className="absolute inset-0 flex items-center justify-center">
                  <Clock className="w-5 h-5 text-[#214fc7]" />
                </div>
              </div>
            </div>

            {/* Metric 2: Average Score */}
            <div className="bg-white border border-gray-200 p-6 flex items-center justify-between shadow-xs">
              <div className="text-left">
                <span className="block font-sans text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1">
                  Average Quiz Score
                </span>
                <span className="font-display font-black text-gray-900 text-3xl leading-none">
                  {averageQuizPercent}%
                </span>
                <span className="block font-sans text-[10px] text-gray-500 mt-2">
                  Based on {totalCompletedQuizzes} evaluations
                </span>
              </div>
              <div className="w-12 h-12 bg-blue-50 text-[#214fc7] flex items-center justify-center border border-blue-100">
                <Award className="w-6 h-6" />
              </div>
            </div>

            {/* Metric 3: Quizzes Solved */}
            <div className="bg-white border border-gray-200 p-6 flex items-center justify-between shadow-xs">
              <div className="text-left">
                <span className="block font-sans text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1">
                  Quizzes Completed
                </span>
                <span className="font-display font-black text-gray-900 text-3xl leading-none">
                  {totalCompletedQuizzes}
                </span>
                <span className="block font-sans text-[10px] text-gray-500 mt-2">
                  All tasks logged in database
                </span>
              </div>
              <div className="w-12 h-12 bg-yellow-50 text-amber-500 flex items-center justify-center border border-yellow-100">
                <CheckCircle2 className="w-6 h-6" />
              </div>
            </div>

            {/* Metric 4: Next Session */}
            <div className="bg-white border border-gray-200 p-6 flex items-center justify-between shadow-xs">
              <div className="text-left">
                <span className="block font-sans text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1">
                  Next Live Class
                </span>
                <span className="font-display font-bold text-[#214fc7] text-lg sm:text-xl leading-snug">
                  আজ রাত ৭:০০ টা
                </span>
                <span className="block font-sans text-[10px] text-gray-500 mt-1">
                  Mentored by Tutor Jahid
                </span>
              </div>
              <div className="w-12 h-12 bg-green-50 text-green-600 flex items-center justify-center border border-green-100">
                <Calendar className="w-6 h-6" />
              </div>
            </div>

          </div>

          {/* Navigation Tabs for Dashboard Panels */}
          <div className="flex border-b border-gray-200 overflow-x-auto scrollbar-none gap-2">
            {[
              { id: 'overview', label: 'সারসংক্ষেপ (Overview)' },
              { id: 'analytics', label: 'পরিসংখ্যান (Analytics)' },
              { id: 'practice', label: 'অনুশীলন এরিনা (Practice Quiz)' },
              { id: 'profile', label: 'প্রোফাইল (Profile & Goals)' }
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => {
                  setActiveTab(tab.id as any);
                  if (tab.id !== 'practice') resetPractice();
                }}
                className={`font-sans text-xs font-bold tracking-wider px-5 py-3 whitespace-nowrap border-b-2 transition-all cursor-pointer ${
                  activeTab === tab.id
                    ? 'border-[#214fc7] text-[#214fc7] bg-white'
                    : 'border-transparent text-gray-500 hover:text-[#214fc7]'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>

          {/* Panel Contents */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            
            {/* LEFT / CENTRAL 2-COLUMNS CONTENT */}
            <div className="lg:col-span-2 space-y-8">
              
              {/* TAB 1: OVERVIEW */}
              {activeTab === 'overview' && (
                <div className="space-y-6">
                  {/* Recent Quiz Attempts Table */}
                  <div className="bg-white border border-gray-200 p-6 shadow-xs">
                    <div className="flex items-center justify-between border-b border-gray-100 pb-4 mb-4">
                      <div className="text-left">
                        <h3 className="font-display font-black text-gray-900 text-lg">
                          সাম্প্রতিক মূল্যায়ন ফলাফল (Recent Quiz History)
                        </h3>
                        <p className="font-sans text-[10px] text-gray-400 font-semibold tracking-wider uppercase mt-0.5">
                          List of graded quizzes taken by you
                        </p>
                      </div>
                      <span className="font-sans text-xs font-bold text-[#214fc7] bg-blue-50 px-2.5 py-1">
                        Average: {averageQuizPercent}%
                      </span>
                    </div>

                    <div className="overflow-x-auto">
                      <table className="w-full text-left font-sans text-xs">
                        <thead>
                          <tr className="border-b border-gray-200 text-gray-400 font-bold uppercase tracking-wider">
                            <th className="py-3 px-2">কুইজের শিরোনাম (Quiz Title)</th>
                            <th className="py-3 px-2">তারিখ (Date)</th>
                            <th className="py-3 px-2 text-center">প্রাপ্ত নম্বর (Score)</th>
                            <th className="py-3 px-2 text-right">স্ট্যাটাস (Status)</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100 text-gray-700">
                          {data.quizzes.map((quiz) => (
                            <tr key={quiz.id} className="hover:bg-slate-50/50 transition-colors">
                              <td className="py-3.5 px-2 font-semibold">
                                <span className="block text-gray-900">{quiz.titleBn}</span>
                                <span className="block text-[10px] text-gray-400">{quiz.title}</span>
                              </td>
                              <td className="py-3.5 px-2 font-mono text-gray-500">{quiz.date}</td>
                              <td className="py-3.5 px-2 text-center font-bold text-gray-900 font-mono">
                                {quiz.score} / {quiz.total}
                              </td>
                              <td className="py-3.5 px-2 text-right">
                                <span className={`inline-block font-mono text-[9px] font-bold px-2 py-0.5 border ${
                                  quiz.status === 'EXCELLENT' 
                                    ? 'bg-green-50 border-green-200 text-green-700'
                                    : 'bg-blue-50 border-blue-200 text-[#214fc7]'
                                }`}>
                                  {quiz.status}
                                </span>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>

                  {/* Active Lessons / Milestones */}
                  <div className="bg-white border border-gray-200 p-6 shadow-xs">
                    <h3 className="font-display font-black text-gray-900 text-lg border-b border-gray-100 pb-4 mb-4 text-left">
                      শিক্ষা পরিকল্পনা ও মাইলস্টোন (Learning Plan Milestones)
                    </h3>
                    
                    <div className="space-y-4">
                      {[
                        { title: 'স্থানাঙ্ক জ্যামিতি (Coordinate Geometry)', subtitle: 'Chapter 11 • Basic equations and distance', status: 'Completed', progress: 100 },
                        { title: 'ত্রিকোণমিতি অনুপাত (Trigonometric Ratios)', subtitle: 'Chapter 9 • Formulas and application rules', status: 'Completed', progress: 100 },
                        { title: 'ক্যালকুলাস সীমা ও অন্তরীকরণ (Calculus Basics)', subtitle: 'Special Module • Velocity & Rate of Change', status: 'In Progress', progress: 65 },
                        { title: 'সম্ভাব্যতা তত্ত্ব (Probability Theory Basics)', subtitle: 'Chapter 14 • Dice, coin and card analysis', status: 'Up Next', progress: 0 }
                      ].map((mile, idx) => (
                        <div key={idx} className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-4 border border-gray-100 hover:border-gray-200 transition-all text-left">
                          <div className="space-y-1">
                            <div className="flex items-center gap-2">
                              <span className="font-display font-black text-[#214fc7] text-xs">0{idx + 1}.</span>
                              <h4 className="font-sans font-bold text-sm text-gray-900">{mile.title}</h4>
                            </div>
                            <p className="font-sans text-xs text-gray-500 pl-4">{mile.subtitle}</p>
                          </div>

                          <div className="flex items-center gap-4 sm:w-48">
                            <div className="w-full bg-gray-100 h-2 rounded-full overflow-hidden">
                              <div className="bg-[#214fc7] h-full transition-all duration-500" style={{ width: `${mile.progress}%` }}></div>
                            </div>
                            <span className="font-sans text-xs font-bold text-gray-700 min-w-10 text-right">
                              {mile.progress}%
                            </span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {/* TAB 2: ANALYTICS (SVG CHARTS) */}
              {activeTab === 'analytics' && (
                <div className="space-y-6">
                  {/* Weekly Study Hours Graph (SVG Custom Bar Chart) */}
                  <div className="bg-white border border-gray-200 p-6 shadow-xs text-left">
                    <h3 className="font-display font-black text-gray-900 text-lg mb-1">
                      সাপ্তাহিক ক্লাস ও পড়ালেখার ঘণ্টা (Weekly Logged Study Hours)
                    </h3>
                    <p className="font-sans text-[10px] text-gray-400 font-bold uppercase tracking-wider mb-6">
                      Your attendance compared with weekly target
                    </p>

                    {/* SVG Bar Chart */}
                    <div className="relative pt-4">
                      <div className="flex justify-between items-end h-48 border-b border-l border-gray-200 px-4 pb-2 relative">
                        {/* Y Axis helper gridlines */}
                        <div className="absolute left-0 right-0 border-t border-gray-100/80 top-[25%] pointer-events-none"></div>
                        <div className="absolute left-0 right-0 border-t border-gray-100/80 top-[50%] pointer-events-none"></div>
                        <div className="absolute left-0 right-0 border-t border-gray-100/80 top-[75%] pointer-events-none"></div>

                        {/* Chart Bars */}
                        {[
                          { day: 'Sat', hours: 2.5, color: '#214fc7' },
                          { day: 'Sun', hours: 4.0, color: '#214fc7' },
                          { day: 'Mon', hours: 1.5, color: '#fcd400' },
                          { day: 'Tue', hours: 3.5, color: '#214fc7' },
                          { day: 'Wed', hours: 5.0, color: '#214fc7' },
                          { day: 'Thu', hours: 2.0, color: '#214fc7' },
                          { day: 'Fri', hours: 0.0, color: '#e9ecef' }
                        ].map((item, idx) => {
                          const heightPct = Math.min(100, (item.hours / 6) * 100);
                          return (
                            <div key={idx} className="flex flex-col items-center w-12 group relative z-10">
                              {/* Hover Tooltip */}
                              <div className="absolute -top-10 opacity-0 group-hover:opacity-100 transition-opacity bg-gray-900 text-white font-mono text-[9px] px-2 py-1 rounded shadow-xs pointer-events-none">
                                {item.hours} Hrs
                              </div>
                              <div 
                                className="w-6 sm:w-8 transition-all duration-700 hover:brightness-95"
                                style={{ 
                                  height: `${heightPct}%`, 
                                  backgroundColor: item.color,
                                  minHeight: item.hours > 0 ? '6px' : '2px'
                                }}
                              ></div>
                              <span className="font-sans text-[10px] font-bold text-gray-500 mt-2">{item.day}</span>
                            </div>
                          );
                        })}
                      </div>
                      
                      {/* X and Y labels */}
                      <div className="flex justify-between text-[10px] text-gray-400 font-bold mt-2 font-mono">
                        <span>Min (0 Hrs)</span>
                        <span>Daily Target: 3.5 Hrs</span>
                        <span>Peak (5.0 Hrs)</span>
                      </div>
                    </div>
                  </div>

                  {/* Quiz Progress Timeline Trend Line (SVG Custom Chart) */}
                  <div className="bg-white border border-gray-200 p-6 shadow-xs text-left">
                    <h3 className="font-display font-black text-gray-900 text-lg mb-1">
                      মূল্যায়ন স্কোর ট্র্যাকার (Quiz Performance Score Trend)
                    </h3>
                    <p className="font-sans text-[10px] text-gray-400 font-bold uppercase tracking-wider mb-6">
                      Historical percentage results of completed assessments
                    </p>

                    {/* Custom SVG Line Chart representation */}
                    <div className="relative h-44 w-full flex items-center justify-center">
                      <svg className="w-full h-full" viewBox="0 0 500 120" preserveAspectRatio="none">
                        {/* Background grid */}
                        <line x1="0" y1="20" x2="500" y2="20" stroke="#f1f3f5" strokeWidth="1" strokeDasharray="4" />
                        <line x1="0" y1="60" x2="500" y2="60" stroke="#f1f3f5" strokeWidth="1" strokeDasharray="4" />
                        <line x1="0" y1="100" x2="500" y2="100" stroke="#f1f3f5" strokeWidth="1" strokeDasharray="4" />

                        {/* Chart Trend Line */}
                        <path
                          d="M 50,20 L 175,60 L 300,20 L 425,36"
                          fill="none"
                          stroke="#214fc7"
                          strokeWidth="3.5"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />

                        {/* Chart Circles with text scores */}
                        <circle cx="50" cy="20" r="5" fill="#fcd400" stroke="#214fc7" strokeWidth="2" />
                        <circle cx="175" cy="60" r="5" fill="#fcd400" stroke="#214fc7" strokeWidth="2" />
                        <circle cx="300" cy="20" r="5" fill="#fcd400" stroke="#214fc7" strokeWidth="2" />
                        <circle cx="425" cy="36" r="5" fill="#fcd400" stroke="#214fc7" strokeWidth="2" />
                      </svg>
                      
                      {/* Floating overlay indicators mapping on absolute positioning corresponding to the points */}
                      <div className="absolute inset-0 flex justify-between px-10 items-end pointer-events-none">
                        <div className="flex flex-col items-center mb-14">
                          <span className="font-mono text-[9px] bg-blue-50 text-[#214fc7] font-bold px-1.5 py-0.5 border border-blue-100">100%</span>
                          <span className="font-sans text-[9px] text-gray-400 mt-1">Trigonometry</span>
                        </div>
                        <div className="flex flex-col items-center mb-4">
                          <span className="font-mono text-[9px] bg-blue-50 text-[#214fc7] font-bold px-1.5 py-0.5 border border-blue-100">67%</span>
                          <span className="font-sans text-[9px] text-gray-400 mt-1">Calculus</span>
                        </div>
                        <div className="flex flex-col items-center mb-14">
                          <span className="font-mono text-[9px] bg-blue-50 text-[#214fc7] font-bold px-1.5 py-0.5 border border-blue-100">100%</span>
                          <span className="font-sans text-[9px] text-gray-400 mt-1">Linear Eq.</span>
                        </div>
                        <div className="flex flex-col items-center mb-9">
                          <span className="font-mono text-[9px] bg-blue-50 text-[#214fc7] font-bold px-1.5 py-0.5 border border-blue-100">80%</span>
                          <span className="font-sans text-[9px] text-gray-400 mt-1">Probability</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* TAB 3: PRACTICE QUIZ ARENA */}
              {activeTab === 'practice' && (
                <div className="bg-white border border-gray-200 p-6 shadow-xs text-left">
                  {!practiceActive ? (
                    <div className="text-center py-8 max-w-lg mx-auto space-y-5">
                      <div className="w-14 h-14 bg-yellow-50 text-amber-500 flex items-center justify-center border border-yellow-100 mx-auto rounded-full">
                        <Sparkles className="w-7 h-7" />
                      </div>
                      <h3 className="font-display font-black text-gray-900 text-xl">
                        দৈনিক গণিত অনুশীলন এরিনা (Daily Practice Arena)
                      </h3>
                      <p className="font-sans text-gray-500 text-xs leading-relaxed leading-normal">
                        ম্যাথ কেয়ারের প্রতিদিনের শর্ট প্র্যাক্টিস সেশন সম্পূর্ণ করুন। প্রতিটি সঠিক উত্তরের জন্য আপনার প্রোফাইল স্কোর এবং ধারাবাহিকতা বৃদ্ধি পাবে।
                      </p>
                      <button
                        onClick={() => {
                          setPracticeActive(true);
                          setPracticeIdx(0);
                          setPracticeScore(0);
                          setPracticeFinished(false);
                          setSelectedAnswer(null);
                        }}
                        className="bg-[#214fc7] text-white hover:bg-black font-sans text-xs font-bold tracking-widest px-8 py-3.5 transition-all duration-300"
                      >
                        প্র্যাক্টিস শুরু করুন (START NOW)
                      </button>
                    </div>
                  ) : practiceFinished ? (
                    <div className="text-center py-8 max-w-lg mx-auto space-y-4 animate-scaleIn">
                      <div className="w-16 h-16 bg-green-50 text-green-500 flex items-center justify-center border border-green-200 mx-auto rounded-full">
                        <CheckCircle2 className="w-10 h-10" />
                      </div>
                      <h3 className="font-display font-black text-gray-900 text-2xl">
                        অনুশীলন সম্পূর্ণ হয়েছে!
                      </h3>
                      <p className="font-sans text-xs text-gray-500 leading-relaxed max-w-sm mx-auto">
                        আপনার আজকের স্কোর: <strong className="text-gray-900 font-mono text-base">{practiceScore} / {PRACTICE_QUESTIONS.length}</strong> <br />
                        আপনার কুইজের ফলাফল সফলভাবে ড্যাশবোর্ডের মূল্যায়নে আপডেট করা হয়েছে এবং স্টাডি স্ট্রিক বৃদ্ধি পেয়েছে!
                      </p>
                      
                      <div className="flex justify-center gap-3 pt-4">
                        <button
                          onClick={resetPractice}
                          className="bg-gray-100 text-gray-700 hover:bg-gray-200 font-sans text-xs font-bold tracking-wider px-6 py-3"
                        >
                          ড্যাশবোর্ডে ফিরে যান
                        </button>
                        <button
                          onClick={() => {
                            setPracticeActive(true);
                            setPracticeIdx(0);
                            setPracticeScore(0);
                            setPracticeFinished(false);
                            setSelectedAnswer(null);
                          }}
                          className="bg-[#fcd400] text-[#191c1d] hover:bg-[#214fc7] hover:text-white font-sans text-xs font-bold tracking-wider px-6 py-3 transition-colors"
                        >
                          আবার খেলুন (Retry)
                        </button>
                      </div>
                    </div>
                  ) : (
                    <div className="space-y-6 animate-scaleIn">
                      {/* Quiz Progress header */}
                      <div className="flex items-center justify-between border-b border-gray-100 pb-4">
                        <span className="font-sans font-bold text-xs text-gray-500 uppercase tracking-widest">
                          প্রশ্ন নং: {practiceIdx + 1} / {PRACTICE_QUESTIONS.length}
                        </span>
                        <span className="font-sans font-bold text-xs text-[#214fc7] bg-blue-50 px-3 py-1">
                          চলতি স্কোর: {practiceScore}
                        </span>
                      </div>

                      {/* Question Text */}
                      <div className="bg-slate-50 border border-slate-200/50 p-6">
                        <span className="font-sans font-bold text-[#214fc7] text-[10px] uppercase tracking-wider flex items-center gap-1 mb-2">
                          <HelpCircle className="w-4 h-4" />
                          গাণিতিক সমস্যা (MATHEMATICAL PROBLEM)
                        </span>
                        <p className="font-sans text-gray-900 font-semibold text-base leading-relaxed leading-normal">
                          {PRACTICE_QUESTIONS[practiceIdx].question}
                        </p>
                      </div>

                      {/* Options Grid */}
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
                        {PRACTICE_QUESTIONS[practiceIdx].options.map((opt, idx) => {
                          const isSelected = selectedAnswer === idx;
                          const isCorrect = idx === PRACTICE_QUESTIONS[practiceIdx].correctIdx;
                          let btnStyle = 'border-gray-200 hover:border-[#214fc7] hover:bg-blue-50/10';
                          
                          if (selectedAnswer !== null) {
                            if (isSelected) {
                              btnStyle = isCorrect 
                                ? 'bg-green-50 border-green-500 text-green-800 font-bold' 
                                : 'bg-red-50 border-red-500 text-red-800 font-bold';
                            } else if (isCorrect) {
                              btnStyle = 'bg-green-50 border-green-200 text-green-800 font-bold';
                            } else {
                              btnStyle = 'opacity-60 border-gray-100';
                            }
                          }

                          return (
                            <button
                              key={idx}
                              disabled={selectedAnswer !== null}
                              onClick={() => handleOptionSelect(idx)}
                              className={`text-left p-4 border transition-all duration-200 font-sans text-sm cursor-pointer ${btnStyle}`}
                            >
                              <div className="flex items-center gap-3">
                                <div className={`w-6 h-6 rounded-full flex items-center justify-center border font-mono text-xs ${
                                  isSelected ? 'bg-current text-white' : 'border-gray-300'
                                }`}>
                                  {String.fromCharCode(65 + idx)}
                                </div>
                                <span>{opt}</span>
                              </div>
                            </button>
                          );
                        })}
                      </div>

                      {/* Controls and feedback */}
                      {selectedAnswer !== null && (
                        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-4 border-t border-gray-100 animate-fadeIn">
                          <p className="font-sans text-xs text-gray-500 leading-relaxed">
                            {selectedAnswer === PRACTICE_QUESTIONS[practiceIdx].correctIdx ? (
                              <span className="text-green-600 font-bold">✓ চমৎকার! সঠিক উত্তর দিয়েছেন।</span>
                            ) : (
                              <span className="text-red-500 font-bold">✗ ভুল উত্তর। সঠিক উত্তরটি ছিল "{PRACTICE_QUESTIONS[practiceIdx].options[PRACTICE_QUESTIONS[practiceIdx].correctIdx]}"।</span>
                            )}
                          </p>
                          <button
                            onClick={handleNextPracticeQuestion}
                            className="bg-[#214fc7] hover:bg-black text-white font-sans text-xs font-bold tracking-widest px-6 py-3.5 flex items-center gap-2 transition-all self-end cursor-pointer"
                          >
                            <span>পরবর্তী প্রশ্ন</span>
                            <ChevronRight className="w-4 h-4" />
                          </button>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              )}

              {/* TAB 4: PROFILE & TARGET GOALS */}
              {activeTab === 'profile' && (
                <div className="bg-white border border-gray-200 p-6 shadow-xs text-left">
                  <div className="flex items-center justify-between border-b border-gray-100 pb-4 mb-6">
                    <div>
                      <h3 className="font-display font-black text-gray-900 text-lg">
                        প্রোফাইল সেটিংস ও শিখন লক্ষ্য (Profile & Learning Targets)
                      </h3>
                      <p className="font-sans text-[10px] text-gray-400 font-semibold tracking-wider uppercase mt-0.5">
                        Customize your information and weekly hours goal
                      </p>
                    </div>
                    {!isEditingProfile && (
                      <button
                        onClick={() => {
                          setEditName(data.studentName);
                          setEditNameBn(data.studentNameBn);
                          setEditSchool(data.school);
                          setEditSchoolBn(data.schoolBn);
                          setEditClass(data.classLevel);
                          setIsEditingProfile(true);
                        }}
                        className="flex items-center gap-1.5 border border-[#214fc7]/30 hover:bg-blue-50 text-[#214fc7] font-sans text-xs font-bold px-3 py-1.5 transition-all cursor-pointer"
                      >
                        <Edit2 className="w-3.5 h-3.5" />
                        সম্পাদনা করুন
                      </button>
                    )}
                  </div>

                  {isEditingProfile ? (
                    <form onSubmit={handleSaveProfile} className="space-y-5">
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div>
                          <label className="block font-sans text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1.5">
                            শিক্ষার্থীর নাম (ইংরেজিতে)
                          </label>
                          <input
                            type="text"
                            required
                            value={editName}
                            onChange={(e) => setEditName(e.target.value)}
                            className="w-full bg-white border border-gray-300 px-4 py-2.5 text-xs outline-none focus:border-[#214fc7] font-sans"
                          />
                        </div>
                        <div>
                          <label className="block font-sans text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1.5">
                            শিক্ষার্থীর নাম (বাংলায়)
                          </label>
                          <input
                            type="text"
                            required
                            value={editNameBn}
                            onChange={(e) => setEditNameBn(e.target.value)}
                            className="w-full bg-white border border-gray-300 px-4 py-2.5 text-xs outline-none focus:border-[#214fc7] font-sans"
                          />
                        </div>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div>
                          <label className="block font-sans text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1.5">
                            শিক্ষা প্রতিষ্ঠান (ইংরেজিতে)
                          </label>
                          <input
                            type="text"
                            required
                            value={editSchool}
                            onChange={(e) => setEditSchool(e.target.value)}
                            className="w-full bg-white border border-gray-300 px-4 py-2.5 text-xs outline-none focus:border-[#214fc7] font-sans"
                          />
                        </div>
                        <div>
                          <label className="block font-sans text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1.5">
                            শিক্ষা প্রতিষ্ঠান (বাংলায়)
                          </label>
                          <input
                            type="text"
                            required
                            value={editSchoolBn}
                            onChange={(e) => setEditSchoolBn(e.target.value)}
                            className="w-full bg-white border border-gray-300 px-4 py-2.5 text-xs outline-none focus:border-[#214fc7] font-sans"
                          />
                        </div>
                      </div>

                      <div>
                        <label className="block font-sans text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1.5">
                          শ্রেণী ও ব্যাচ (Class Level & Batch)
                        </label>
                        <select
                          value={editClass}
                          onChange={(e) => setEditClass(e.target.value)}
                          className="w-full bg-white border border-gray-300 p-2.5 text-xs outline-none focus:border-[#214fc7] font-sans"
                        >
                          <option value="Class 8 (অষ্টম শ্রেণী)">Class 8 (অষ্টম শ্রেণী)</option>
                          <option value="Class 9 (নবম শ্রেণী)">Class 9 (নবম শ্রেণী)</option>
                          <option value="Class 10 (দশম শ্রেণী)">Class 10 (দশম শ্রেণী)</option>
                          <option value="HSC 1st Year (একাদশ)">HSC 1st Year (একাদশ)</option>
                          <option value="HSC 2nd Year (দ্বাদশ)">HSC 2nd Year (দ্বাদশ)</option>
                        </select>
                      </div>

                      <div className="flex gap-2.5 pt-2">
                        <button
                          type="submit"
                          className="flex items-center gap-1.5 bg-[#214fc7] hover:bg-black text-white font-sans text-xs font-bold px-6 py-2.5 transition-colors cursor-pointer"
                        >
                          <Save className="w-4 h-4" />
                          সংরক্ষণ করুন (SAVE CHANGES)
                        </button>
                        <button
                          type="button"
                          onClick={() => setIsEditingProfile(false)}
                          className="bg-gray-100 hover:bg-gray-200 text-gray-700 font-sans text-xs font-bold px-6 py-2.5 cursor-pointer"
                        >
                          বাতিল করুন
                        </button>
                      </div>
                    </form>
                  ) : (
                    <div className="space-y-6">
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-8 gap-y-4">
                        <div>
                          <span className="block text-[10px] text-gray-400 uppercase tracking-widest font-bold">শিক্ষার্থীর নাম (English)</span>
                          <span className="font-sans font-semibold text-gray-900 text-sm mt-0.5 block">{data.studentName}</span>
                        </div>
                        <div>
                          <span className="block text-[10px] text-gray-400 uppercase tracking-widest font-bold">শিক্ষার্থীর নাম (বাংলা)</span>
                          <span className="font-sans font-semibold text-gray-900 text-sm mt-0.5 block">{data.studentNameBn}</span>
                        </div>
                        <div>
                          <span className="block text-[10px] text-gray-400 uppercase tracking-widest font-bold">শিক্ষা প্রতিষ্ঠান (English)</span>
                          <span className="font-sans text-gray-700 text-sm mt-0.5 block">{data.school}</span>
                        </div>
                        <div>
                          <span className="block text-[10px] text-gray-400 uppercase tracking-widest font-bold">শিক্ষা প্রতিষ্ঠান (বাংলা)</span>
                          <span className="font-sans text-gray-700 text-sm mt-0.5 block">{data.schoolBn}</span>
                        </div>
                        <div>
                          <span className="block text-[10px] text-gray-400 uppercase tracking-widest font-bold">শিক্ষার্থী আইডি</span>
                          <span className="font-mono font-bold text-[#214fc7] text-sm mt-0.5 block">{data.studentId}</span>
                        </div>
                        <div>
                          <span className="block text-[10px] text-gray-400 uppercase tracking-widest font-bold">ব্যাচ ও শ্রেণী</span>
                          <span className="font-sans text-gray-700 text-sm mt-0.5 block">{data.classLevel}</span>
                        </div>
                      </div>

                      {/* Learning target hours editor */}
                      <div className="pt-6 border-t border-gray-100">
                        <label className="block font-sans text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-2.5">
                          সাপ্তাহিক ক্লাস ঘণ্টা লক্ষ্য (Weekly Studying Target Hours Goal)
                        </label>
                        <div className="flex items-center gap-4">
                          <input
                            type="range"
                            min="10"
                            max="50"
                            value={data.hoursGoal}
                            onChange={(e) => setData(prev => ({ ...prev, hoursGoal: parseInt(e.target.value) }))}
                            className="w-full h-1.5 bg-gray-100 accent-[#214fc7] cursor-pointer"
                          />
                          <span className="font-mono font-bold text-sm bg-blue-50 text-[#214fc7] border border-blue-100 px-3 py-1 shrink-0">
                            {data.hoursGoal} Hrs
                          </span>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              )}

            </div>

            {/* RIGHT SIDEBAR PANEL / MODULES (e.g., Quick Stats, Log Extra Study Hours) */}
            <div className="space-y-8 text-left">
              
              {/* Interactive Module: Log Study/Class Hours manually */}
              <div className="bg-white border-2 border-[#214fc7] p-6 shadow-xs relative overflow-hidden">
                <div className="absolute top-0 right-0 bg-[#fcd400] text-[#191c1d] font-mono text-[9px] font-bold px-2 py-0.5 uppercase">
                  Log Tool
                </div>
                
                <h3 className="font-display font-black text-gray-900 text-base mb-1">
                  ক্লাস সময় ট্র্যাকিং (Log Attended Hours)
                </h3>
                <p className="font-sans text-[10px] text-gray-400 font-bold uppercase tracking-wider mb-4">
                  Add additional hours attended manually
                </p>

                {hoursLogSuccess && (
                  <div className="bg-green-50 border border-green-200 text-green-700 text-[11px] p-3 mb-4 font-sans font-medium">
                    ✓ ক্লাস সময় সফলভাবে ড্যাশবোর্ডে যোগ করা হয়েছে!
                  </div>
                )}

                <form onSubmit={handleLogHours} className="space-y-4">
                  <div>
                    <label className="block font-sans text-[10px] font-bold text-gray-500 uppercase tracking-widest mb-1.5">
                      অতিরিক্ত ঘন্টা (Class Hours to Add)
                    </label>
                    <div className="flex gap-2">
                      <input
                        type="number"
                        step="0.5"
                        min="0.5"
                        max="8"
                        required
                        value={hoursToAdd}
                        onChange={(e) => setHoursToAdd(e.target.value)}
                        placeholder="যেমন: 2.0"
                        className="w-full bg-white border border-gray-300 px-3 py-2 text-xs outline-none focus:border-[#214fc7] font-mono"
                      />
                      <button
                        type="submit"
                        className="bg-[#214fc7] text-white hover:bg-black font-sans text-xs font-bold tracking-wider px-4 py-2 transition-all cursor-pointer whitespace-nowrap"
                      >
                        ঘণ্টা যোগ করুন
                      </button>
                    </div>
                  </div>
                </form>

                <p className="font-sans text-[10px] text-gray-400 leading-normal mt-4 italic">
                  *ভার্চুয়াল ক্লাস এটেন্ড করা হলে আপনার ক্লাস সময় স্বয়ংক্রিয়ভাবে এখানে সিঙ্ক ও পরিমাপ করা হয়।
                </p>
              </div>

              {/* Resource Downloads / Shared materials by Tutor Jahid */}
              <div className="bg-white border border-gray-200 p-6 shadow-xs">
                <h3 className="font-display font-black text-gray-900 text-base border-b border-gray-100 pb-3 mb-3">
                  ক্লাস ম্যাটেরিয়ালস ও নোটস (Shared Files)
                </h3>
                
                <div className="space-y-3">
                  {[
                    { title: 'ক্যালকুলাস সীমা চূড়ান্ত শিট (Calculus-Limits.pdf)', size: '2.4 MB', date: 'July 05' },
                    { title: 'সরলরেখা ও ঢালের সমীকরণ সমাধান (LinearEq-Solved.pdf)', size: '1.8 MB', date: 'June 30' },
                    { title: 'ত্রিকোণমিতি সূত্রাবলী ম্যাপ (Trig-Formula-Chart.png)', size: '4.2 MB', date: 'June 25' }
                  ].map((file, idx) => (
                    <a
                      key={idx}
                      href="#"
                      onClick={(e) => {
                        e.preventDefault();
                        alert(`ডাউনলোড করা হচ্ছে: ${file.title}`);
                      }}
                      className="flex items-start gap-3 p-2.5 hover:bg-slate-50 border border-transparent hover:border-gray-100 transition-all text-xs"
                    >
                      <FileText className="w-5 h-5 text-[#214fc7] shrink-0 mt-0.5" />
                      <div className="text-left leading-tight">
                        <span className="block text-gray-900 font-bold hover:text-[#214fc7] transition-colors">{file.title}</span>
                        <span className="block text-[10px] text-gray-400 mt-1">
                          Size: {file.size} • Uploaded: {file.date}
                        </span>
                      </div>
                    </a>
                  ))}
                </div>
              </div>

              {/* Weekly Schedule Planner */}
              <div className="bg-white border border-gray-200 p-6 shadow-xs">
                <h3 className="font-display font-black text-gray-900 text-base border-b border-gray-100 pb-3 mb-3">
                  সাপ্তাহিক রুটিন (Weekly Live Schedule)
                </h3>
                
                <div className="space-y-3 font-sans text-xs">
                  {[
                    { days: 'শনি - সোম - বুধ', time: 'রাত ৭:০০ টা - ৮:৩০ টা', topic: 'উচ্চতর গণিত (Higher Math)' },
                    { days: 'রবি - মঙ্গল', time: 'রাত ৮:০০ টা - ৯:৩০ টা', topic: 'পদার্থবিজ্ঞান ব্যাচ (Physics Intensive)' }
                  ].map((sched, idx) => (
                    <div key={idx} className="p-3 bg-slate-50/50 border border-slate-100 text-left">
                      <span className="font-bold text-gray-900 block">{sched.days}</span>
                      <span className="text-[#214fc7] font-semibold font-mono block mt-1">{sched.time}</span>
                      <span className="text-gray-500 block text-[10px] mt-0.5">{sched.topic}</span>
                    </div>
                  ))}
                </div>
              </div>

            </div>

          </div>

        </div>
      )}

      {/* PRINT-READY REPORT MODAL OVERLAY */}
      {showPrintReport && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-black/65 flex items-center justify-center p-4 sm:p-6 md:p-10 backdrop-blur-xs print:p-0 print:bg-white print:static print:z-auto print:overflow-visible">
          {/* Modal Container */}
          <div className="bg-slate-100 w-full max-w-4xl max-h-[90vh] overflow-y-auto flex flex-col shadow-2xl print:bg-white print:max-h-none print:shadow-none print:w-full print:h-auto print:overflow-visible">
            {/* Top Bar (Hidden on Print) */}
            <div className="bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between sticky top-0 print:hidden shrink-0 z-10">
              <div className="flex items-center gap-2">
                <FileText className="w-5 h-5 text-[#214fc7]" />
                <h3 className="font-display font-black text-gray-900 text-sm sm:text-base text-left">
                  একাডেমিক প্রগতি প্রতিবেদন (Academic Progress Report Card)
                </h3>
              </div>
              <div className="flex items-center gap-3">
                <button
                  onClick={() => window.print()}
                  className="flex items-center gap-1.5 bg-[#214fc7] hover:bg-black text-white font-sans text-xs font-bold px-4 py-2 transition-colors cursor-pointer"
                >
                  <Printer className="w-4 h-4" />
                  Print / Save as PDF
                </button>
                <button
                  onClick={() => setShowPrintReport(false)}
                  className="p-1.5 hover:bg-slate-100 text-gray-400 hover:text-gray-900 transition-colors cursor-pointer"
                  title="Close Modal"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* Printable Report Document Body */}
            <div className="p-8 sm:p-12 md:p-16 bg-white flex-1 text-left font-sans text-[#191c1d] print-container max-w-[210mm] mx-auto w-full print:p-4 print:mx-0">
              {/* Report Header */}
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between border-b-4 border-[#214fc7] pb-6 mb-8 gap-4">
                <div className="flex items-center gap-4 text-left">
                  <div className="w-14 h-14 bg-[#214fc7] text-white flex items-center justify-center border-2 border-[#fcd400]">
                    <span className="font-display font-black text-3xl">E</span>
                  </div>
                  <div className="text-left">
                    <h1 className="font-display font-extrabold text-[#214fc7] text-2xl tracking-tight leading-none uppercase">
                      Edustika Premium
                    </h1>
                    <span className="text-[10px] text-gray-500 font-bold tracking-widest leading-none mt-1.5 uppercase block">
                      Direct Mentorship & Math Care
                    </span>
                    <span className="text-[9px] text-gray-400 font-medium block mt-1">
                      Dhaka, Bangladesh • info@edustika.com • https://edustika.com
                    </span>
                  </div>
                </div>
                <div className="text-left sm:text-right">
                  <div className="inline-block bg-[#fcd400] text-[#191c1d] px-3 py-1 text-[10px] font-extrabold uppercase tracking-wider mb-2">
                    Official Report
                  </div>
                  <p className="font-sans text-xs text-gray-500 font-bold">
                    Report Date: <span className="font-mono text-gray-800">{new Date().toLocaleDateString('bn-BD', { year: 'numeric', month: 'long', day: 'numeric' })}</span>
                  </p>
                  <p className="font-sans text-[10px] text-gray-400 font-semibold mt-0.5">
                    Reference ID: <span className="font-mono">{data.studentId}-REP</span>
                  </p>
                </div>
              </div>

              {/* Title Section */}
              <div className="text-center mb-8">
                <h2 className="font-display font-black text-gray-900 text-xl tracking-tight uppercase">
                  শিক্ষার্থী প্রগতি প্রতিবেদন (Student Academic Progress Report)
                </h2>
                <div className="w-24 h-1 bg-[#fcd400] mx-auto mt-2.5"></div>
              </div>

              {/* Student Metadata Card */}
              <div className="bg-slate-50 border border-gray-200 p-6 mb-8 grid grid-cols-1 sm:grid-cols-2 gap-x-8 gap-y-4 print:bg-white print:border-gray-300">
                <div className="text-left">
                  <span className="block text-[9px] text-gray-400 uppercase tracking-widest font-bold">শিক্ষার্থীর নাম (Student Name)</span>
                  <span className="font-sans font-bold text-gray-900 text-base mt-0.5 block">
                    {data.studentNameBn} ({data.studentName})
                  </span>
                </div>
                <div className="text-left">
                  <span className="block text-[9px] text-gray-400 uppercase tracking-widest font-bold">শিক্ষার্থী আইডি (Student ID)</span>
                  <span className="font-mono font-bold text-[#214fc7] text-base mt-0.5 block">{data.studentId}</span>
                </div>
                <div className="text-left">
                  <span className="block text-[9px] text-gray-400 uppercase tracking-widest font-bold">শিক্ষা প্রতিষ্ঠান (School / College)</span>
                  <span className="font-sans text-gray-700 text-sm mt-0.5 block">
                    {data.schoolBn} ({data.school})
                  </span>
                </div>
                <div className="text-left">
                  <span className="block text-[9px] text-gray-400 uppercase tracking-widest font-bold">শ্রেণী ও ব্যাচ (Class & Batch)</span>
                  <span className="font-sans text-gray-700 text-sm mt-0.5 block">{data.classLevel}</span>
                </div>
              </div>

              {/* Summary Performance Analytics */}
              <div className="mb-8 text-left">
                <h3 className="font-sans font-black text-gray-900 text-xs uppercase tracking-widest border-b border-gray-200 pb-2 mb-4">
                  শিখন ও মূল্যায়ন সারসংক্ষেপ (Learning Performance Metrics)
                </h3>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div className="bg-white border border-gray-200 p-4 text-center">
                    <span className="block text-[9px] text-gray-400 uppercase tracking-wider font-bold">ক্লাসে উপস্থিতি</span>
                    <span className="font-display font-black text-[#214fc7] text-2xl block mt-1">{data.attendedHours} ঘণ্টা</span>
                    <span className="block text-[9px] text-gray-500 mt-1">লক্ষ্য: {data.hoursGoal} ঘণ্টা</span>
                  </div>
                  <div className="bg-white border border-gray-200 p-4 text-center">
                    <span className="block text-[9px] text-gray-400 uppercase tracking-wider font-bold">গড় কুইজ স্কোর</span>
                    <span className="font-display font-black text-green-700 text-2xl block mt-1">{averageQuizPercent}%</span>
                    <span className="block text-[9px] text-gray-500 mt-1">মোট মূল্যায়ন: {totalCompletedQuizzes}</span>
                  </div>
                  <div className="bg-white border border-gray-200 p-4 text-center">
                    <span className="block text-[9px] text-gray-400 uppercase tracking-wider font-bold">ধারাবাহিকতা</span>
                    <span className="font-display font-black text-amber-500 text-2xl block mt-1">{data.streak} দিন</span>
                    <span className="block text-[9px] text-gray-500 mt-1">Study Streak Days</span>
                  </div>
                  <div className="bg-white border border-gray-200 p-4 text-center">
                    <span className="block text-[9px] text-gray-400 uppercase tracking-wider font-bold">লক্ষ্য অর্জন</span>
                    <span className="font-display font-black text-gray-900 text-2xl block mt-1">
                      {Math.round((data.attendedHours / data.hoursGoal) * 100)}%
                    </span>
                    <span className="block text-[9px] text-gray-500 mt-1">Goal Achieved</span>
                  </div>
                </div>
              </div>

              {/* Quizzes Evaluation Table */}
              <div className="mb-8 text-left">
                <h3 className="font-sans font-black text-gray-900 text-xs uppercase tracking-widest border-b border-gray-200 pb-2 mb-4">
                  মূল্যায়ন সমূহের বিস্তারিত বিবরণী (Detailed Quiz History)
                </h3>
                <table className="w-full text-left font-sans text-xs border-collapse">
                  <thead>
                    <tr className="border-b-2 border-gray-300 text-gray-400 font-bold uppercase tracking-wider">
                      <th className="py-2.5 px-2">মূল্যায়ন বিষয়বস্তু (Quiz Title)</th>
                      <th className="py-2.5 px-2">তারিখ (Date)</th>
                      <th className="py-2.5 px-2 text-center">প্রাপ্ত নম্বর (Score)</th>
                      <th className="py-2.5 px-2 text-center">হার (Percentage)</th>
                      <th className="py-2.5 px-2 text-right">স্ট্যাটাস (Status)</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200 text-gray-700">
                    {data.quizzes.map((quiz) => {
                      const pct = Math.round((quiz.score / quiz.total) * 100);
                      return (
                        <tr key={quiz.id} className="hover:bg-slate-50/50">
                          <td className="py-3 px-2 font-semibold">
                            <span className="block text-gray-900 text-xs">{quiz.titleBn}</span>
                            <span className="block text-[9px] text-gray-400">{quiz.title}</span>
                          </td>
                          <td className="py-3 px-2 font-mono text-gray-500 text-xs">{quiz.date}</td>
                          <td className="py-3 px-2 text-center font-bold text-gray-900 font-mono text-xs">
                            {quiz.score} / {quiz.total}
                          </td>
                          <td className="py-3 px-2 text-center font-bold text-gray-900 font-mono text-xs">
                            {pct}%
                          </td>
                          <td className="py-3 px-2 text-right">
                            <span className="inline-block font-mono text-[9px] font-bold text-gray-900 uppercase">
                              {quiz.status}
                            </span>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>

              {/* Mentor Remarks Block */}
              <div className="border border-gray-200 p-6 mb-12 bg-slate-50/50 print:border-gray-300 print:bg-white text-left">
                <h4 className="font-sans font-bold text-[#214fc7] text-xs uppercase tracking-wider mb-2">
                  শিক্ষকের মন্তব্য (Mentor's Remarks & Recommendations)
                </h4>
                <p className="font-sans text-xs text-gray-700 leading-relaxed">
                  শিক্ষার্থী অত্যন্ত নিষ্ঠার সাথে নিয়মিত প্রতিটি ক্লাসে অংশগ্রহণ করছে। তার গণিত ও যুক্তিমূলক বিশ্লেষণ দক্ষতা চমৎকার বৃদ্ধি পেয়েছে। বিশেষ করে ত্রিকোণমিতি এবং সমীকরণ সমাধানে তার পারদর্শিতা প্রশংসনীয়। ক্যালকুলাস পার্টটিতে নিয়মিত অনুশীলন বজায় রাখার পরামর্শ রইলো।
                </p>
                <div className="w-12 h-0.5 bg-gray-200 my-3"></div>
                <p className="font-sans text-[10px] text-gray-400 italic leading-relaxed">
                  "Abir maintains a great work ethic. Consistently practices trigonometry. Continue the excellent efforts, especially focusing on calculus limits."
                </p>
              </div>

              {/* Sign-off & Verification Footer */}
              <div className="flex flex-col sm:flex-row items-end justify-between gap-8 pt-6 border-t border-gray-200 text-left">
                <div className="text-left">
                  <span className="block text-[8px] text-gray-400 uppercase font-bold tracking-widest">Digital Verification Hash</span>
                  <code className="block text-[9px] text-gray-500 font-mono">
                    ED-{data.studentId}-{averageQuizPercent}-{data.attendedHours}-SECURE-VERIFIED
                  </code>
                </div>
                
                <div className="flex gap-12 text-center">
                  <div className="flex flex-col items-center">
                    <div className="h-10 w-28 border-b border-gray-300 flex items-center justify-center italic font-mono text-gray-400 text-xs">
                      Jahidul Islam
                    </div>
                    <span className="block font-sans text-[10px] font-bold text-gray-700 mt-1.5">মোহাম্মদ জাহিদুল ইসলাম</span>
                    <span className="block font-sans text-[8px] text-gray-400 uppercase">টিউটর ও মেন্টর (Math Care)</span>
                  </div>

                  <div className="flex flex-col items-center">
                    <div className="h-10 w-28 border-b border-gray-300 flex items-center justify-center">
                      <div className="w-8 h-8 rounded-full border border-dashed border-[#214fc7] flex items-center justify-center text-[7px] font-bold text-[#214fc7] rotate-12">
                        SEAL
                      </div>
                    </div>
                    <span className="block font-sans text-[10px] font-bold text-gray-700 mt-1.5">ইডুস্টিকা কর্তৃপক্ষ</span>
                    <span className="block font-sans text-[8px] text-gray-400 uppercase">Evaluation Seal</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
