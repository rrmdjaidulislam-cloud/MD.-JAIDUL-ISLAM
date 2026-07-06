import React, { useState, useEffect } from 'react';
import { 
  getCourses, saveCourses, addCourse, removeCourse, 
  getTeachers, saveTeachers, addTeacher, removeTeacher, 
  getPayments, updatePaymentStatus, Teacher, PaymentVerification 
} from '../lib/db';
import { Course } from '../types';
import { 
  ShieldAlert, Settings, PlusCircle, Trash2, Users, BookOpen, 
  Award, Receipt, CheckCircle, XCircle, Clock, Check, Edit, Save, Plus,
  MessageSquare, Send, Lock, Shield, Calendar, User
} from 'lucide-react';

interface StudentAccount {
  studentId: string;
  email: string;
  password: string;
  dashboardData: {
    studentName: string;
    studentNameBn: string;
    school: string;
    schoolBn: string;
    studentId: string;
    classLevel: string;
    attendedHours: number;
    hoursGoal: number;
    streak: number;
    phone?: string;
    parentPhone?: string;
    homeAddress?: string;
    gender?: string;
  };
}

export default function AdminPanel() {
  const [isAdminLoggedIn, setIsAdminLoggedIn] = useState<boolean>(() => {
    if (localStorage.getItem('edustika_admin_logged_in') === 'true') return true;
    
    // Check if logged in as authorized student
    const isLoggedIn = localStorage.getItem('edustika_logged_in') === 'true';
    const currentId = localStorage.getItem('edustika_current_student_id');
    if (isLoggedIn && currentId) {
      const accountsStr = localStorage.getItem('edustika_students_accounts');
      const rawAdmins = localStorage.getItem('edustika_authorized_admins');
      const authorized = rawAdmins ? JSON.parse(rawAdmins) : ['md.jaidulislam@hotmail.com', 'edu.mdjaidulislam@gmail.com', 'rr.mdjaidulislam@gmail.com'];
      if (accountsStr) {
        try {
          const accounts = JSON.parse(accountsStr);
          const matched = accounts.find((acc: any) => acc.studentId === currentId);
          if (matched && authorized.map((e: string) => e.toLowerCase()).includes(matched.email.toLowerCase())) {
            return true;
          }
        } catch (e) {
          console.error(e);
        }
      }
    }
    return false;
  });

  const [adminEmail, setAdminEmail] = useState<string>('admin@edustika.com');
  const [adminPassword, setAdminPassword] = useState<string>('admin123');
  const [loginError, setLoginError] = useState<string>('');

  // Active Admin View Tab
  const [activeTab, setActiveTab] = useState<'courses' | 'students' | 'teachers' | 'payments' | 'access' | 'chat' | 'blog'>('courses');
  const [searchQuery, setSearchQuery] = useState('');

  // Blog managing states
  const [blogPosts, setBlogPosts] = useState<any[]>([]);
  const [newPostTitleBn, setNewPostTitleBn] = useState('');
  const [newPostTitleEn, setNewPostTitleEn] = useState('');
  const [newPostCategoryBn, setNewPostCategoryBn] = useState('পড়াশোনার টিপস');
  const [newPostCategoryEn, setNewPostCategoryEn] = useState('Study Tips');
  const [newPostSummaryBn, setNewPostSummaryBn] = useState('');
  const [newPostSummaryEn, setNewPostSummaryEn] = useState('');
  const [newPostContentBn, setNewPostContentBn] = useState('');
  const [newPostContentEn, setNewPostContentEn] = useState('');

  // Reset search when active tab shifts
  useEffect(() => {
    setSearchQuery('');
  }, [activeTab]);

  const [authorizedAdmins, setAuthorizedAdmins] = useState<string[]>(() => {
    const raw = localStorage.getItem('edustika_authorized_admins');
    return raw ? JSON.parse(raw) : ['md.jaidulislam@hotmail.com', 'edu.mdjaidulislam@gmail.com', 'rr.mdjaidulislam@gmail.com'];
  });

  const [newAdminEmail, setNewAdminEmail] = useState('');
  const [newAdminRole, setNewAdminRole] = useState<'MASTER' | 'COURSE_MANAGER' | 'MODERATOR' | 'FINANCE'>('COURSE_MANAGER');

  // Roles state mapping email to role
  const [adminRoles, setAdminRoles] = useState<Record<string, 'MASTER' | 'COURSE_MANAGER' | 'MODERATOR' | 'FINANCE'>>(() => {
    const raw = localStorage.getItem('edustika_admin_roles_config');
    if (raw) {
      try {
        return JSON.parse(raw);
      } catch (e) {
        console.error(e);
      }
    }
    return {
      'rr.mdjaidulislam@gmail.com': 'MASTER',
      'edu.mdjaidulislam@gmail.com': 'MASTER',
      'md.jaidulislam@hotmail.com': 'MASTER',
      'admin@edustika.com': 'MASTER'
    };
  });

  // Track the logged in admin info
  const [currentAdminUser, setCurrentAdminUser] = useState<{
    email: string;
    name: string;
    role: 'MASTER' | 'COURSE_MANAGER' | 'MODERATOR' | 'FINANCE';
  }>(() => {
    if (localStorage.getItem('edustika_admin_logged_in') === 'true') {
      return {
        email: 'admin@edustika.com',
        name: 'সিস্টেম মাস্টার এডমিন (Default Admin)',
        role: 'MASTER'
      };
    }
    const isLoggedIn = localStorage.getItem('edustika_logged_in') === 'true';
    const currentId = localStorage.getItem('edustika_current_student_id');
    if (isLoggedIn && currentId) {
      const accountsStr = localStorage.getItem('edustika_students_accounts');
      if (accountsStr) {
        try {
          const accounts = JSON.parse(accountsStr);
          const matched = accounts.find((acc: any) => acc.studentId === currentId);
          if (matched) {
            const savedRoles = localStorage.getItem('edustika_admin_roles_config');
            let rolesObj: any = {
              'rr.mdjaidulislam@gmail.com': 'MASTER',
              'edu.mdjaidulislam@gmail.com': 'MASTER',
              'md.jaidulislam@hotmail.com': 'MASTER'
            };
            if (savedRoles) {
              rolesObj = JSON.parse(savedRoles);
            }
            const emailLower = matched.email.toLowerCase();
            const role = rolesObj[emailLower] || 'MASTER';
            return {
              email: emailLower,
              name: matched.dashboardData?.studentNameBn || matched.dashboardData?.studentName || 'প্যানেল মেম্বার',
              role
            };
          }
        } catch (e) {
          console.error(e);
        }
      }
    }
    return {
      email: 'guest@edustika.com',
      name: 'অতিথি (Guest)',
      role: 'FINANCE'
    };
  });

  useEffect(() => {
    localStorage.setItem('edustika_authorized_admins', JSON.stringify(authorizedAdmins));
    localStorage.setItem('edustika_admin_roles_config', JSON.stringify(adminRoles));
    window.dispatchEvent(new Event('edustika-admins-change'));
  }, [authorizedAdmins, adminRoles]);

  // Sync current user states when logging in or role changes
  useEffect(() => {
    const syncAdminUser = () => {
      if (localStorage.getItem('edustika_admin_logged_in') === 'true') {
        setCurrentAdminUser({
          email: 'admin@edustika.com',
          name: 'সিস্টেম মাস্টার এডমিন (Default Admin)',
          role: 'MASTER'
        });
        return;
      }
      const isLoggedIn = localStorage.getItem('edustika_logged_in') === 'true';
      const currentId = localStorage.getItem('edustika_current_student_id');
      if (isLoggedIn && currentId) {
        const accountsStr = localStorage.getItem('edustika_students_accounts');
        if (accountsStr) {
          try {
            const accounts = JSON.parse(accountsStr);
            const matched = accounts.find((acc: any) => acc.studentId === currentId);
            if (matched) {
              const savedRoles = localStorage.getItem('edustika_admin_roles_config');
              let rolesObj: Record<string, any> = {
                'rr.mdjaidulislam@gmail.com': 'MASTER',
                'edu.mdjaidulislam@gmail.com': 'MASTER',
                'md.jaidulislam@hotmail.com': 'MASTER'
              };
              if (savedRoles) {
                rolesObj = JSON.parse(savedRoles);
              }
              const emailLower = matched.email.toLowerCase();
              const role = rolesObj[emailLower] || 'MASTER';
              setCurrentAdminUser({
                email: emailLower,
                name: matched.dashboardData?.studentNameBn || matched.dashboardData?.studentName || 'প্যানেল মেম্বার',
                role
              });
            }
          } catch (e) {
            console.error(e);
          }
        }
      }
    };
    syncAdminUser();
    window.addEventListener('edustika-auth-change', syncAdminUser);
    window.addEventListener('edustika-admins-change', syncAdminUser);
    return () => {
      window.removeEventListener('edustika-auth-change', syncAdminUser);
      window.removeEventListener('edustika-admins-change', syncAdminUser);
    };
  }, [isAdminLoggedIn, authorizedAdmins, adminRoles]);

  // Interface for Team Chat
  interface ChatMessage {
    id: string;
    senderEmail: string;
    senderName: string;
    senderRole: 'MASTER' | 'COURSE_MANAGER' | 'MODERATOR' | 'FINANCE';
    text: string;
    timestamp: string;
  }

  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([]);
  const [newMessageText, setNewMessageText] = useState('');

  // Load chat messages
  useEffect(() => {
    const raw = localStorage.getItem('edustika_team_chat_messages');
    if (raw) {
      try {
        setChatMessages(JSON.parse(raw));
      } catch (e) {
        console.error(e);
      }
    } else {
      const defaultMessages: ChatMessage[] = [
        {
          id: 'msg-1',
          senderEmail: 'rr.mdjaidulislam@gmail.com',
          senderName: 'মাস্টার এডমিন জাহিদুল',
          senderRole: 'MASTER',
          text: 'আসসালামু আলাইকুম টিম মেম্বারস! এডুস্টিকা একাডেমীর নতুন ড্যাশবোর্ডে আপনাদের স্বাগতম। সবাই নিজ নিজ দায়িত্ব অনুসারে প্যানেল মনিটর করুন।',
          timestamp: new Date(Date.now() - 3600 * 1000 * 4).toISOString()
        },
        {
          id: 'msg-2',
          senderEmail: 'edu.mdjaidulislam@gmail.com',
          senderName: 'জাহিদুল ইসলাম (জিমেইল)',
          senderRole: 'MASTER',
          text: 'ওয়া আলাইকুম আসসালাম ভাইয়া। ফাইন্যান্স অফিসাররা নতুন পেমেন্ট রিকোয়েস্টগুলো দ্রুত ভেরিফাই করে দিন, শিক্ষার্থীরা ক্লাসে জয়েন করতে চাচ্ছে।',
          timestamp: new Date(Date.now() - 3600 * 1000 * 2.5).toISOString()
        },
        {
          id: 'msg-3',
          senderEmail: 'student@edustika.com',
          senderName: 'আবির হাসান',
          senderRole: 'MODERATOR',
          text: 'জি ভাইয়া, আমি মডারেটর প্যানেল থেকে নতুন নিবন্ধিত শিক্ষার্থীদের তালিকা এবং তাদের রোল এসাইনমেন্ট চেক করে রাখছি। কোনো ভুল মেইল থাকলে জানাচ্ছি।',
          timestamp: new Date(Date.now() - 3600 * 1000 * 1).toISOString()
        }
      ];
      localStorage.setItem('edustika_team_chat_messages', JSON.stringify(defaultMessages));
      setChatMessages(defaultMessages);
    }
  }, []);

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMessageText.trim()) return;

    const newMsg: ChatMessage = {
      id: `msg-${Date.now()}`,
      senderEmail: currentAdminUser.email,
      senderName: currentAdminUser.name,
      senderRole: currentAdminUser.role,
      text: newMessageText.trim(),
      timestamp: new Date().toISOString()
    };

    const updated = [...chatMessages, newMsg];
    setChatMessages(updated);
    localStorage.setItem('edustika_team_chat_messages', JSON.stringify(updated));
    setNewMessageText('');
  };

  const handleClearChat = () => {
    if (currentAdminUser.role !== 'MASTER') {
      alert('শুধুমাত্র মাস্টার এডমিন চ্যাট হিস্ট্রি মুছতে পারবেন!');
      return;
    }
    if (confirm('আপনি কি নিশ্চিত যে সম্পূর্ণ চ্যাট হিস্ট্রি মুছে ফেলতে চান?')) {
      const empty: ChatMessage[] = [];
      setChatMessages(empty);
      localStorage.setItem('edustika_team_chat_messages', JSON.stringify(empty));
    }
  };

  // Sync blog posts
  useEffect(() => {
    const raw = localStorage.getItem('edustika_blog_posts');
    if (raw) {
      try {
        setBlogPosts(JSON.parse(raw));
      } catch (e) {
        console.error(e);
      }
    }
  }, [activeTab]);

  const handleAddBlogPost = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newPostTitleBn || !newPostTitleEn || !newPostContentBn || !newPostContentEn) {
      alert('সবগুলো ফিল্ড পূরণ করুন! (Please fill all fields)');
      return;
    }
    const newPost = {
      id: `post-${Date.now()}`,
      titleBn: newPostTitleBn,
      titleEn: newPostTitleEn,
      categoryBn: newPostCategoryBn,
      categoryEn: newPostCategoryEn,
      dateBn: new Date().toLocaleDateString('bn-BD', { year: 'numeric', month: 'long', day: 'numeric' }),
      dateEn: new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' }),
      authorBn: currentAdminUser.name || 'এডমিন',
      authorEn: currentAdminUser.role === 'MASTER' ? 'Master Admin' : 'Admin',
      summaryBn: newPostSummaryBn || newPostContentBn.slice(0, 150) + '...',
      summaryEn: newPostSummaryEn || newPostContentEn.slice(0, 150) + '...',
      contentBn: newPostContentBn,
      contentEn: newPostContentEn
    };
    const updated = [newPost, ...blogPosts];
    setBlogPosts(updated);
    localStorage.setItem('edustika_blog_posts', JSON.stringify(updated));
    window.dispatchEvent(new Event('edustika-posts-change'));

    // Clear form
    setNewPostTitleBn('');
    setNewPostTitleEn('');
    setNewPostSummaryBn('');
    setNewPostSummaryEn('');
    setNewPostContentBn('');
    setNewPostContentEn('');
  };

  const handleDeleteBlogPost = (id: string) => {
    if (window.confirm('আপনি কি নিশ্চিত যে এই পোস্টটি মুছে ফেলতে চান? (Are you sure you want to delete this post?)')) {
      const updated = blogPosts.filter(p => p.id !== id);
      setBlogPosts(updated);
      localStorage.setItem('edustika_blog_posts', JSON.stringify(updated));
      window.dispatchEvent(new Event('edustika-posts-change'));
    }
  };

  const handleAddAdminEmail = (e: React.FormEvent) => {
    e.preventDefault();
    if (currentAdminUser.role !== 'MASTER') {
      alert('শুধুমাত্র মাস্টার এডমিন পরিবর্তন করার ক্ষমতা রাখেন!');
      return;
    }
    const emailStr = newAdminEmail.trim().toLowerCase();
    if (!emailStr) return;
    if (authorizedAdmins.map(e => e.toLowerCase()).includes(emailStr)) {
      alert('এই ইমেইল ইতিমধ্যে এডমিন অ্যাক্সেস তালিকায় রয়েছে!');
      return;
    }
    setAuthorizedAdmins(prev => [...prev, emailStr]);
    setAdminRoles(prev => ({ ...prev, [emailStr]: newAdminRole }));
    setNewAdminEmail('');
  };

  const handleRemoveAdminEmail = (emailStr: string) => {
    if (currentAdminUser.role !== 'MASTER') {
      alert('শুধুমাত্র মাস্টার এডমিন পরিবর্তন করার ক্ষমতা রাখেন!');
      return;
    }
    const lowerEmail = emailStr.trim().toLowerCase();
    if (lowerEmail === 'rr.mdjaidulislam@gmail.com' || lowerEmail === 'edu.mdjaidulislam@gmail.com' || lowerEmail === 'md.jaidulislam@hotmail.com') {
      alert('নিরাপত্তা জনিত কারণে মাস্টার এডমিন অ্যাক্সেস বন্ধ করা যাবে না!');
      return;
    }
    if (confirm(`আপনি কি নিশ্চিত যে ${emailStr} এর এডমিন অ্যাক্সেস বন্ধ করতে চান?`)) {
      setAuthorizedAdmins(prev => prev.filter(e => e.toLowerCase() !== lowerEmail));
      setAdminRoles(prev => {
        const copy = { ...prev };
        delete copy[lowerEmail];
        return copy;
      });
    }
  };

  const handleUpdateAdminRole = (email: string, role: 'MASTER' | 'COURSE_MANAGER' | 'MODERATOR' | 'FINANCE') => {
    if (currentAdminUser.role !== 'MASTER') {
      alert('শুধুমাত্র মাস্টার এডমিন পরিবর্তন করার ক্ষমতা রাখেন!');
      return;
    }
    const lowerEmail = email.trim().toLowerCase();
    if (lowerEmail === 'rr.mdjaidulislam@gmail.com' || lowerEmail === 'edu.mdjaidulislam@gmail.com' || lowerEmail === 'md.jaidulislam@hotmail.com') {
      alert('মাস্টার এডমিনের রোল পরিবর্তন করা যাবে না!');
      return;
    }
    setAdminRoles(prev => ({ ...prev, [lowerEmail]: role }));
  };

  // Dynamic Database States
  const [courses, setCourses] = useState<Course[]>([]);
  const [teachers, setTeachers] = useState<Teacher[]>([]);
  const [students, setStudents] = useState<StudentAccount[]>([]);
  const [payments, setPayments] = useState<PaymentVerification[]>([]);

  // Editing / adding state placeholders
  // 1. Course Add Form
  const [newCourseId, setNewCourseId] = useState('');
  const [newCourseTitle, setNewCourseTitle] = useState('');
  const [newCourseTitleBn, setNewCourseTitleBn] = useState('');
  const [newCourseDesc, setNewCourseDesc] = useState('');
  const [newCourseDescBn, setNewCourseDescBn] = useState('');
  const [newCourseTag, setNewCourseTag] = useState('Class 9 - 10');
  const [newCoursePrice, setNewCoursePrice] = useState('৳ ১২০০ / মাস');
  const [newCourseDuration, setNewCourseDuration] = useState('৩ মাস (সপ্তাহে ৩ দিন)');
  const [newCourseLevel, setNewCourseLevel] = useState('সব লেভেল');
  const [newCourseIcon, setNewCourseIcon] = useState('badge');
  const [newCourseDemoVideoUrl, setNewCourseDemoVideoUrl] = useState('');

  // 2. Student Add Form
  const [newStudentEmail, setNewStudentEmail] = useState('');
  const [newStudentPassword, setNewStudentPassword] = useState('');
  const [newStudentName, setNewStudentName] = useState('');
  const [newStudentNameBn, setNewStudentNameBn] = useState('');
  const [newStudentSchool, setNewStudentSchool] = useState('');
  const [newStudentSchoolBn, setNewStudentSchoolBn] = useState('');
  const [newStudentClass, setNewStudentClass] = useState('Class 10 (দশম শ্রেণী)');
  const [newStudentPhone, setNewStudentPhone] = useState('');
  const [newStudentParentPhone, setNewStudentParentPhone] = useState('');
  const [newStudentAddress, setNewStudentAddress] = useState('');
  const [newStudentGender, setNewStudentGender] = useState('পুরুষ (Male)');

  // 3. Teacher Add Form
  const [newTeacherName, setNewTeacherName] = useState('');
  const [newTeacherNameBn, setNewTeacherNameBn] = useState('');
  const [newTeacherSubject, setNewTeacherSubject] = useState('');
  const [newTeacherSubjectBn, setNewTeacherSubjectBn] = useState('');
  const [newTeacherEdu, setNewTeacherEdu] = useState('');
  const [newTeacherEduBn, setNewTeacherEduBn] = useState('');
  const [newTeacherBio, setNewTeacherBio] = useState('');
  const [newTeacherBioBn, setNewTeacherBioBn] = useState('');

  // Synchronize dynamic login state events
  useEffect(() => {
    const updateLoggedInState = () => {
      const isDirect = localStorage.getItem('edustika_admin_logged_in') === 'true';
      if (isDirect) {
        setIsAdminLoggedIn(true);
        return;
      }
      const isLoggedIn = localStorage.getItem('edustika_logged_in') === 'true';
      const currentId = localStorage.getItem('edustika_current_student_id');
      if (isLoggedIn && currentId) {
        const accountsStr = localStorage.getItem('edustika_students_accounts');
        const rawAdmins = localStorage.getItem('edustika_authorized_admins');
        const authorized = rawAdmins ? JSON.parse(rawAdmins) : ['md.jaidulislam@hotmail.com', 'edu.mdjaidulislam@gmail.com', 'rr.mdjaidulislam@gmail.com'];
        if (accountsStr) {
          try {
            const accounts = JSON.parse(accountsStr);
            const matched = accounts.find((acc: any) => acc.studentId === currentId);
            if (matched && authorized.map((e: string) => e.toLowerCase()).includes(matched.email.toLowerCase())) {
              setIsAdminLoggedIn(true);
              return;
            }
          } catch (e) {
            console.error(e);
          }
        }
      }
      setIsAdminLoggedIn(false);
    };

    window.addEventListener('edustika-auth-change', updateLoggedInState);
    window.addEventListener('edustika-admins-change', updateLoggedInState);
    return () => {
      window.removeEventListener('edustika-auth-change', updateLoggedInState);
      window.removeEventListener('edustika-admins-change', updateLoggedInState);
    };
  }, []);

  // Load Admin Data
  useEffect(() => {
    if (isAdminLoggedIn) {
      setCourses(getCourses());
      setTeachers(getTeachers());
      setPayments(getPayments());
      
      // Load student accounts
      const savedStudents = localStorage.getItem('edustika_students_accounts');
      if (savedStudents) {
        try {
          setStudents(JSON.parse(savedStudents));
        } catch (e) {
          console.error(e);
        }
      } else {
        // Fallback default student accounts
        const defaultStudents: StudentAccount[] = [
          {
            studentId: 'ED-2026-0489',
            email: 'student@edustika.com',
            password: 'student123',
            dashboardData: {
              studentName: 'Abir Hasan',
              studentNameBn: 'আবির হাসান',
              school: 'Dhaka Cantonment Public School & College',
              schoolBn: 'ঢাকা ক্যান্টনমেন্ট পাবলিক স্কুল ও কলেজ',
              studentId: 'ED-2026-0489',
              classLevel: 'Class 10 (দশম শ্রেণী)',
              attendedHours: 18.5,
              hoursGoal: 24,
              streak: 6
            }
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
              streak: 5
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
              streak: 4
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
              streak: 10
            }
          }
        ];
        localStorage.setItem('edustika_students_accounts', JSON.stringify(defaultStudents));
        setStudents(defaultStudents);
      }
    }
  }, [isAdminLoggedIn]);

  // Handle Admin Login
  const handleAdminLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (adminEmail.trim() === 'admin@edustika.com' && adminPassword === 'admin123') {
      setIsAdminLoggedIn(true);
      localStorage.setItem('edustika_admin_logged_in', 'true');
      setLoginError('');
      window.dispatchEvent(new Event('edustika-auth-change'));
    } else {
      setLoginError('ভুল এডমিন ইমেইল অথবা পাসওয়ার্ড! (সংকেত: admin@edustika.com এবং পাসওয়ার্ড admin123 ব্যবহার করুন)');
    }
  };

  // Handle Admin Logout
  const handleAdminLogout = () => {
    setIsAdminLoggedIn(false);
    localStorage.removeItem('edustika_admin_logged_in');
    window.dispatchEvent(new Event('edustika-auth-change'));
  };

  // Get visible tabs for roles
  const getTabsForRole = (role: 'MASTER' | 'COURSE_MANAGER' | 'MODERATOR' | 'FINANCE') => {
    switch (role) {
      case 'COURSE_MANAGER':
        return ['courses', 'blog', 'chat'] as const;
      case 'MODERATOR':
        return ['students', 'teachers', 'chat'] as const;
      case 'FINANCE':
        return ['payments', 'chat'] as const;
      case 'MASTER':
      default:
        return ['courses', 'students', 'teachers', 'payments', 'blog', 'access', 'chat'] as const;
    }
  };

  // Redirect if current active tab is not allowed for the current role
  useEffect(() => {
    if (isAdminLoggedIn) {
      const allowed = getTabsForRole(currentAdminUser.role);
      if (!allowed.includes(activeTab as any)) {
        setActiveTab(allowed[0] as any);
      }
    }
  }, [currentAdminUser.role, isAdminLoggedIn]);

  // Course Management handlers
  const handleAddCourse = (e: React.FormEvent) => {
    e.preventDefault();
    if (currentAdminUser.role !== 'MASTER') {
      alert('শুধুমাত্র মাস্টার এডমিন পরিবর্তন করার ক্ষমতা রাখেন!');
      return;
    }
    if (!newCourseTitle || !newCourseTitleBn) return;

    const newId = newCourseId.trim().toLowerCase() || `course-${Date.now()}`;
    const course: Course = {
      id: newId,
      title: newCourseTitle,
      bengaliTitle: newCourseTitleBn,
      description: newCourseDesc,
      bengaliDescription: newCourseDescBn,
      tag: newCourseTag,
      price: newCoursePrice,
      duration: newCourseDuration,
      level: newCourseLevel,
      icon: newCourseIcon,
      demoVideoUrl: newCourseDemoVideoUrl
    };

    addCourse(course);
    setCourses(getCourses()); // Reload state

    // Clear form
    setNewCourseId('');
    setNewCourseTitle('');
    setNewCourseTitleBn('');
    setNewCourseDesc('');
    setNewCourseDescBn('');
    setNewCourseDemoVideoUrl('');
  };

  const handleRemoveCourse = (id: string) => {
    if (currentAdminUser.role !== 'MASTER') {
      alert('শুধুমাত্র মাস্টার এডমিন পরিবর্তন করার ক্ষমতা রাখেন!');
      return;
    }
    if (confirm('আপনি কি নিশ্চিত যে আপনি এই কোর্সটি ডিলিট করতে চান?')) {
      removeCourse(id);
      setCourses(getCourses());
    }
  };

  // Student Management handlers
  const handleAddStudent = (e: React.FormEvent) => {
    e.preventDefault();
    if (currentAdminUser.role !== 'MASTER') {
      alert('শুধুমাত্র মাস্টার এডমিন পরিবর্তন করার ক্ষমতা রাখেন!');
      return;
    }
    if (!newStudentEmail || !newStudentPassword) return;

    // Check if email already registered
    const exists = students.some(s => s.email.toLowerCase() === newStudentEmail.toLowerCase());
    if (exists) {
      alert('এই ইমেইল দিয়ে ইতিমধ্যে অ্যাকাউন্ট খোলা হয়েছে!');
      return;
    }

    const newId = `ED-2026-${Math.floor(1000 + Math.random() * 9000)}`;
    const newStudent: StudentAccount = {
      studentId: newId,
      email: newStudentEmail,
      password: newStudentPassword,
      dashboardData: {
        studentName: newStudentName || 'Registered Student',
        studentNameBn: newStudentNameBn || 'নিবন্ধিত শিক্ষার্থী',
        school: newStudentSchool || 'Unspecified School',
        schoolBn: newStudentSchoolBn || 'অনির্ধারিত শিক্ষাপ্রতিষ্ঠান',
        studentId: newId,
        classLevel: newStudentClass,
        attendedHours: 0,
        hoursGoal: 20,
        streak: 1,
        phone: newStudentPhone,
        parentPhone: newStudentParentPhone,
        homeAddress: newStudentAddress,
        gender: newStudentGender
      }
    };

    const updated = [...students, newStudent];
    localStorage.setItem('edustika_students_accounts', JSON.stringify(updated));
    setStudents(updated);

    // Reset Form
    setNewStudentEmail('');
    setNewStudentPassword('');
    setNewStudentName('');
    setNewStudentNameBn('');
    setNewStudentSchool('');
    setNewStudentSchoolBn('');
    setNewStudentPhone('');
    setNewStudentParentPhone('');
    setNewStudentAddress('');
    setNewStudentGender('পুরুষ (Male)');
  };

  const handleRemoveStudent = (studentId: string) => {
    if (currentAdminUser.role !== 'MASTER') {
      alert('শুধুমাত্র মাস্টার এডমিন পরিবর্তন করার ক্ষমতা রাখেন!');
      return;
    }
    if (confirm(`আপনি কি নিশ্চিত যে আপনি শিক্ষার্থী ${studentId} ডিলিট করতে চান?`)) {
      const filtered = students.filter(s => s.studentId !== studentId);
      localStorage.setItem('edustika_students_accounts', JSON.stringify(filtered));
      setStudents(filtered);
    }
  };

  // Teacher Management handlers
  const handleAddTeacher = (e: React.FormEvent) => {
    e.preventDefault();
    if (currentAdminUser.role !== 'MASTER') {
      alert('শুধুমাত্র মাস্টার এডমিন পরিবর্তন করার ক্ষমতা রাখেন!');
      return;
    }
    if (!newTeacherName || !newTeacherNameBn) return;

    const teacher: Teacher = {
      id: `t-${Date.now()}`,
      name: newTeacherName,
      nameBn: newTeacherNameBn,
      subject: newTeacherSubject,
      subjectBn: newTeacherSubjectBn,
      education: newTeacherEdu,
      educationBn: newTeacherEduBn,
      bio: newTeacherBio,
      bioBn: newTeacherBioBn
    };

    addTeacher(teacher);
    setTeachers(getTeachers());

    // Reset Form
    setNewTeacherName('');
    setNewTeacherNameBn('');
    setNewTeacherSubject('');
    setNewTeacherSubjectBn('');
    setNewTeacherEdu('');
    setNewTeacherEduBn('');
    setNewTeacherBio('');
    setNewTeacherBioBn('');
  };

  const handleRemoveTeacher = (id: string) => {
    if (currentAdminUser.role !== 'MASTER') {
      alert('শুধুমাত্র মাস্টার এডমিন পরিবর্তন করার ক্ষমতা রাখেন!');
      return;
    }
    if (confirm('আপনি কি নিশ্চিত যে আপনি এই শিক্ষককে ডিলিট করতে চান?')) {
      removeTeacher(id);
      setTeachers(getTeachers());
    }
  };

  // Payment Status controls
  const handleUpdatePayment = (payId: string, status: 'VERIFIED' | 'PENDING' | 'REJECTED') => {
    if (currentAdminUser.role !== 'MASTER') {
      alert('শুধুমাত্র মাস্টার এডমিন পরিবর্তন করার ক্ষমতা রাখেন!');
      return;
    }
    updatePaymentStatus(payId, status);
    setPayments(getPayments()); // Reload state
  };

  // Filter variables for the dynamic context-aware search filters
  const filteredCourses = courses.filter(course => {
    if (!searchQuery) return true;
    const q = searchQuery.toLowerCase();
    return (
      course.title?.toLowerCase().includes(q) ||
      course.bengaliTitle?.toLowerCase().includes(q) ||
      course.tag?.toLowerCase().includes(q) ||
      course.id?.toLowerCase().includes(q)
    );
  });

  const filteredStudents = students.filter(student => {
    if (!searchQuery) return true;
    const q = searchQuery.toLowerCase();
    return (
      student.studentId?.toLowerCase().includes(q) ||
      student.email?.toLowerCase().includes(q) ||
      student.dashboardData?.studentName?.toLowerCase().includes(q) ||
      student.dashboardData?.studentNameBn?.toLowerCase().includes(q) ||
      student.dashboardData?.schoolBn?.toLowerCase().includes(q)
    );
  });

  const filteredTeachers = teachers.filter(teacher => {
    if (!searchQuery) return true;
    const q = searchQuery.toLowerCase();
    return (
      teacher.name?.toLowerCase().includes(q) ||
      teacher.nameBn?.toLowerCase().includes(q) ||
      teacher.subject?.toLowerCase().includes(q) ||
      teacher.subjectBn?.toLowerCase().includes(q)
    );
  });

  const filteredPayments = payments.filter(pay => {
    if (!searchQuery) return true;
    const q = searchQuery.toLowerCase();
    return (
      pay.id?.toLowerCase().includes(q) ||
      pay.transactionId?.toLowerCase().includes(q) ||
      pay.studentName?.toLowerCase().includes(q) ||
      pay.studentId?.toLowerCase().includes(q) ||
      pay.courseTitle?.toLowerCase().includes(q) ||
      pay.phoneNumber?.toLowerCase().includes(q)
    );
  });

  const filteredAccessAdmins = authorizedAdmins.filter(email => {
    if (!searchQuery) return true;
    return email.toLowerCase().includes(searchQuery.toLowerCase());
  });

  return (
    <div className="max-w-[1280px] mx-auto px-6 py-12 text-left">
      {!isAdminLoggedIn ? (
        /* ADMIN PORTAL LOGIN CONTAINER */
        <div className="max-w-md mx-auto bg-white border-2 border-[#15803d] p-8 shadow-sm">
          <div className="text-center mb-8">
            <div className="w-12 h-12 bg-green-50 text-[#15803d] flex items-center justify-center border border-green-100 mx-auto mb-3">
              <Settings className="w-6 h-6 text-[#15803d]" />
            </div>
            <h2 className="font-display font-black text-gray-900 text-2xl tracking-tight">
              এডমিন ড্যাশবোর্ড (Admin Control)
            </h2>
            <p className="font-sans text-xs text-gray-400 font-bold uppercase tracking-widest mt-1">
              Edustika Master Portal Log-In
            </p>
            <div className="w-12 h-1 bg-[#22c55e] mx-auto mt-4"></div>
          </div>

          {loginError && (
            <div className="bg-red-50 border-l-4 border-red-500 p-4 mb-6 flex items-start gap-2.5 text-xs text-red-700 leading-relaxed">
              <ShieldAlert className="w-4 h-4 flex-shrink-0 text-red-600 mt-0.5" />
              <p>{loginError}</p>
            </div>
          )}

          <form onSubmit={handleAdminLogin} className="space-y-5">
            <div>
              <label className="block font-sans text-[10px] font-bold text-gray-500 uppercase tracking-widest mb-1.5">
                এডমিন ইমেইল (Admin Email)
              </label>
              <input
                type="email"
                required
                value={adminEmail}
                onChange={(e) => setAdminEmail(e.target.value)}
                placeholder="admin@edustika.com"
                className="w-full bg-white border border-gray-300 px-4 py-2.5 text-xs outline-none focus:border-[#15803d] font-sans"
              />
            </div>

            <div>
              <label className="block font-sans text-[10px] font-bold text-gray-500 uppercase tracking-widest mb-1.5">
                মাস্টার পাসওয়ার্ড (Password)
              </label>
              <input
                type="password"
                required
                value={adminPassword}
                onChange={(e) => setAdminPassword(e.target.value)}
                placeholder="admin123"
                className="w-full bg-white border border-gray-300 px-4 py-2.5 text-xs outline-none focus:border-[#15803d] font-sans"
              />
            </div>

            <button
              type="submit"
              className="w-full bg-[#15803d] text-white hover:bg-black font-sans text-xs font-bold tracking-widest py-3.5 transition-all duration-300 border-2 border-[#15803d] hover:border-black cursor-pointer uppercase"
            >
              এডমিন প্যানেলে প্রবেশ করুন (LOGIN CONTROL)
            </button>
          </form>

          <div className="mt-6 bg-green-50 p-3 text-center border border-green-100">
            <p className="font-sans text-[11px] text-gray-600">
              এডমিন ডেমো লগইন ক্রেডেনশিয়াল:<br/>
              ইমেইল: <strong className="font-mono">admin@edustika.com</strong><br/>
              পাসওয়ার্ড: <strong className="font-mono">admin123</strong>
            </p>
          </div>
        </div>
      ) : (
        /* MASTER CONTROL AREA */
        <div className="space-y-8 font-sans">
          
          {/* Header Dashboard section */}
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b border-gray-200 pb-6">
            <div>
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-[#15803d] animate-pulse"></span>
                <span className="font-mono text-[10px] text-emerald-800 font-extrabold uppercase bg-emerald-50 px-2 py-0.5">
                  SYSTEM CORE: ONLINE
                </span>
                <span className="font-mono text-[10px] text-blue-800 font-extrabold uppercase bg-blue-50 px-2 py-0.5">
                  ROLE: {currentAdminUser.role}
                </span>
              </div>
              <h1 className="font-display font-black text-3xl text-gray-900 mt-1">
                এডমিন কন্ট্রোল প্যানেল (Master Admin Control)
              </h1>
              
              {/* Profile Card and Access Badge */}
              <div className="mt-3 flex flex-wrap items-center gap-2 text-xs">
                <span className="text-gray-500 font-medium">লগইন অ্যাকাউন্ট:</span>
                <span className="font-bold text-gray-900 bg-gray-100 px-2.5 py-1">{currentAdminUser.name}</span>
                {/* Ensure Master emails are only displayed to MASTER admins */}
                {(currentAdminUser.role === 'MASTER' || 
                  !(currentAdminUser.email.toLowerCase() === 'rr.mdjaidulislam@gmail.com' || 
                    currentAdminUser.email.toLowerCase() === 'edu.mdjaidulislam@gmail.com' || 
                    currentAdminUser.email.toLowerCase() === 'md.jaidulislam@hotmail.com')) && (
                  <span className="font-mono text-gray-500 bg-gray-50 border border-gray-200 px-2.5 py-1">{currentAdminUser.email}</span>
                )}
                
                <span className={`px-2.5 py-1 font-bold border rounded-xs uppercase tracking-wide flex items-center gap-1 ${
                  currentAdminUser.role === 'MASTER' ? 'bg-amber-50 text-amber-800 border-amber-200' :
                  currentAdminUser.role === 'COURSE_MANAGER' ? 'bg-blue-50 text-blue-800 border-blue-200' :
                  currentAdminUser.role === 'MODERATOR' ? 'bg-emerald-50 text-emerald-800 border-emerald-200' :
                  'bg-purple-50 text-purple-800 border-purple-200'
                }`}>
                  <Shield className="w-3.5 h-3.5" />
                  {currentAdminUser.role === 'MASTER' && 'মাস্টার এডমিন (MASTER)'}
                  {currentAdminUser.role === 'COURSE_MANAGER' && 'কোর্স ম্যানেজার (COURSE MANAGER)'}
                  {currentAdminUser.role === 'MODERATOR' && 'মডারেটর (MODERATOR)'}
                  {currentAdminUser.role === 'FINANCE' && 'অর্থ কর্মকর্তা (FINANCE)'}
                </span>
              </div>
            </div>
            
            <button
              onClick={handleAdminLogout}
              className="bg-black text-white hover:bg-red-700 font-sans text-xs font-bold tracking-wider px-5 py-2.5 cursor-pointer transition-colors shrink-0"
            >
              লগআউট (LOGOUT)
            </button>
          </div>

          {/* Quick Stats Bento Blocks */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="bg-slate-50 border border-gray-200 p-5">
              <span className="text-gray-400 text-[10px] font-bold uppercase tracking-widest block">মোট কোর্স (COURSES)</span>
              <span className="font-display font-extrabold text-3xl text-[#15803d] mt-1 block">{courses.length}</span>
            </div>
            <div className="bg-slate-50 border border-gray-200 p-5">
              <span className="text-gray-400 text-[10px] font-bold uppercase tracking-widest block">মোট শিক্ষার্থী (STUDENTS)</span>
              <span className="font-display font-extrabold text-3xl text-[#15803d] mt-1 block">{students.length}</span>
            </div>
            <div className="bg-slate-50 border border-gray-200 p-5">
              <span className="text-gray-400 text-[10px] font-bold uppercase tracking-widest block">মোট শিক্ষক (TEACHERS)</span>
              <span className="font-display font-extrabold text-3xl text-[#15803d] mt-1 block">{teachers.length}</span>
            </div>
            <div className="bg-slate-50 border border-gray-200 p-5">
              <span className="text-gray-400 text-[10px] font-bold uppercase tracking-widest block">পেমেন্ট ভেরিফিকেশন (PAYMENTS)</span>
              <span className="font-display font-extrabold text-3xl text-[#15803d] mt-1 block">{payments.length}</span>
            </div>
          </div>

          {/* Navigation Controls Tabs */}
          <div className="flex flex-wrap border-b border-gray-200 bg-white shadow-xs">
            {getTabsForRole(currentAdminUser.role).map(tab => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`flex-1 sm:flex-none px-6 py-4 text-xs font-bold uppercase tracking-wider border-b-2 transition-all cursor-pointer text-center ${activeTab === tab ? 'border-[#15803d] text-[#15803d] bg-green-50/20' : 'border-transparent text-gray-500 hover:text-[#15803d]'}`}
              >
                {tab === 'courses' && 'কোর্স ম্যানেজমেন্ট (Courses)'}
                {tab === 'students' && 'শিক্ষার্থী তালিকা (Students)'}
                {tab === 'teachers' && 'শিক্ষক তালিকা (Teachers)'}
                {tab === 'payments' && 'পেমেন্ট ভেরিফিকেশন (Payments)'}
                {tab === 'access' && 'অ্যাক্সেস কন্ট্রোল (Access)'}
                {tab === 'blog' && 'ব্লগ ও পোস্ট (Blog)'}
                {tab === 'chat' && (
                  <span className="flex items-center gap-1.5 justify-center">
                    <MessageSquare className="w-3.5 h-3.5 text-[#15803d]" />
                    টিম চ্যাট প্যানেল (Team Chat)
                  </span>
                )}
              </button>
            ))}
          </div>

          {/* Dynamic Section-Aware Search Filter Bar */}
          {activeTab !== 'chat' && activeTab !== 'blog' && (
            <div className="bg-slate-50 border border-gray-200 p-4 flex flex-col md:flex-row gap-4 items-center justify-between">
              <div className="flex-1 w-full">
                <label className="block text-gray-500 font-bold text-[10px] uppercase tracking-widest mb-1.5">
                  অনুসন্ধান করুন (Search inside {' '}
                  {activeTab === 'courses' ? 'Courses' : 
                   activeTab === 'students' ? 'Students' : 
                   activeTab === 'teachers' ? 'Teachers' : 
                   activeTab === 'payments' ? 'Payments' : 'Access Settings'}
                  )
                </label>
                <div className="relative">
                  <input
                    type="text"
                    placeholder="যেকোনো কিওয়ার্ড দিয়ে সার্চ করুন... (Type keyword to filter dynamically)"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full bg-white border border-gray-300 px-4 py-2.5 pl-10 text-xs outline-none focus:border-[#15803d]"
                  />
                  <div className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                    </svg>
                  </div>
                  {searchQuery && (
                    <button 
                      type="button"
                      onClick={() => setSearchQuery('')}
                      className="absolute right-3.5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-red-600 font-bold text-xs"
                    >
                      Clear
                    </button>
                  )}
                </div>
              </div>
              {searchQuery && (
                <div className="shrink-0 text-xs bg-green-50 border border-green-200 text-[#15803d] px-3 py-2 font-bold uppercase tracking-wide">
                  ফলাফল পাওয়া গেছে
                </div>
              )}
            </div>
          )}

          {/* Active Panel Content */}
          <div className="bg-white border border-gray-200 p-6 md:p-8">
            
            {/* 1. COURSES TAB */}
            {activeTab === 'courses' && (
              <div className="space-y-8">
                {/* Add Course Form */}
                <div className="bg-slate-50 border border-gray-200 p-6">
                  <h3 className="font-display font-bold text-lg text-gray-900 flex items-center gap-2 mb-4">
                    <PlusCircle className="w-5 h-5 text-[#15803d]" />
                    নতুন কোর্স যুক্ত করুন (Add New Course)
                  </h3>
                  
                  <form onSubmit={handleAddCourse} className="space-y-4 text-xs">
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                      <div>
                        <label className="block text-gray-500 font-bold mb-1">কোর্স আইডি (Unique ID)</label>
                        <input
                          type="text"
                          required
                          placeholder="e.g. general-math"
                          value={newCourseId}
                          onChange={(e) => setNewCourseId(e.target.value)}
                          className="w-full p-2.5 border border-gray-300 bg-white outline-none focus:border-[#15803d]"
                        />
                      </div>
                      <div>
                        <label className="block text-gray-500 font-bold mb-1">কোর্সের নাম (English) *</label>
                        <input
                          type="text"
                          required
                          placeholder="e.g. General Math Masterclass"
                          value={newCourseTitle}
                          onChange={(e) => setNewCourseTitle(e.target.value)}
                          className="w-full p-2.5 border border-gray-300 bg-white outline-none focus:border-[#15803d]"
                        />
                      </div>
                      <div>
                        <label className="block text-gray-500 font-bold mb-1">কোর্সের নাম (বাংলা) *</label>
                        <input
                          type="text"
                          required
                          placeholder="যেমন: সাধারণ গণিত"
                          value={newCourseTitleBn}
                          onChange={(e) => setNewCourseTitleBn(e.target.value)}
                          className="w-full p-2.5 border border-gray-300 bg-white outline-none focus:border-[#15803d]"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-gray-500 font-bold mb-1">ইংলিশ বিবরণ (English Description)</label>
                        <textarea
                          placeholder="Course description in English..."
                          value={newCourseDesc}
                          onChange={(e) => setNewCourseDesc(e.target.value)}
                          className="w-full p-2.5 border border-gray-300 bg-white h-20 outline-none focus:border-[#15803d]"
                        />
                      </div>
                      <div>
                        <label className="block text-gray-500 font-bold mb-1">বাংলা বিবরণ (Bengali Description)</label>
                        <textarea
                          placeholder="কোর্সের বাংলা বিবরণী..."
                          value={newCourseDescBn}
                          onChange={(e) => setNewCourseDescBn(e.target.value)}
                          className="w-full p-2.5 border border-gray-300 bg-white h-20 outline-none focus:border-[#15803d]"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
                      <div>
                        <label className="block text-gray-500 font-bold mb-1">ক্লাস লেভেল ট্যাগ</label>
                        <input
                          type="text"
                          value={newCourseTag}
                          onChange={(e) => setNewCourseTag(e.target.value)}
                          placeholder="e.g. Class 9 - 10"
                          className="w-full p-2.5 border border-gray-300 bg-white outline-none focus:border-[#15803d]"
                        />
                      </div>
                      <div>
                        <label className="block text-gray-500 font-bold mb-1">কোর্স ফি (Price)</label>
                        <input
                          type="text"
                          value={newCoursePrice}
                          onChange={(e) => setNewCoursePrice(e.target.value)}
                          placeholder="যেমন: ৳ ১২০০ / মাস"
                          className="w-full p-2.5 border border-gray-300 bg-white outline-none focus:border-[#15803d]"
                        />
                      </div>
                      <div>
                        <label className="block text-gray-500 font-bold mb-1">সময়সীমা ও সিডিউল</label>
                        <input
                          type="text"
                          value={newCourseDuration}
                          onChange={(e) => setNewCourseDuration(e.target.value)}
                          placeholder="যেমন: ৩ মাস (সপ্তাহে ৩ দিন)"
                          className="w-full p-2.5 border border-gray-300 bg-white outline-none focus:border-[#15803d]"
                        />
                      </div>
                      <div>
                        <label className="block text-gray-500 font-bold mb-1">কোর্স আইকন টাইপ</label>
                        <select
                          value={newCourseIcon}
                          onChange={(e) => setNewCourseIcon(e.target.value)}
                          className="w-full p-2.5 border border-gray-300 bg-white outline-none focus:border-[#15803d]"
                        >
                          <option value="badge">Badge Image Accent</option>
                          <option value="sigma">Sigma Symbol (Σ)</option>
                          <option value="flask">Flask Beaker (🧪)</option>
                        </select>
                      </div>
                    </div>

                    <div>
                      <label className="block text-gray-500 font-bold mb-1">ডেমো ক্লাসের ইউটিউব ভিডিও লিংক (YouTube Demo Class URL)</label>
                      <input
                        type="url"
                        placeholder="যেমন: https://www.youtube.com/watch?v=dQw4w9WgXcQ"
                        value={newCourseDemoVideoUrl}
                        onChange={(e) => setNewCourseDemoVideoUrl(e.target.value)}
                        className="w-full p-2.5 border border-gray-300 bg-white outline-none focus:border-[#15803d]"
                      />
                    </div>

                    <button
                      type="submit"
                      className="bg-[#15803d] text-white hover:bg-black font-bold tracking-wider px-6 py-3 cursor-pointer transition-colors"
                    >
                      কোর্স যোগ করুন (PUBLISH COURSE)
                    </button>
                  </form>
                </div>

                {/* Course List Grid */}
                <div className="space-y-4">
                  <h3 className="font-display font-bold text-gray-900 text-base">বিদ্যমান কোর্সসমূহ (Active Courses List)</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {filteredCourses.length === 0 ? (
                      <div className="col-span-2 text-center text-gray-400 p-8 border border-dashed border-gray-200 bg-slate-50">
                        কোনো কোর্স খুঁজে পাওয়া যায়নি। (No courses found matching the filter query)
                      </div>
                    ) : (
                      filteredCourses.map(course => (
                        <div key={course.id} className="border border-gray-200 p-5 flex justify-between items-start gap-4 bg-white hover:border-[#15803d] transition-colors">
                          <div>
                            <span className="font-mono text-[9px] font-bold text-[#15803d] uppercase bg-green-50 px-2 py-0.5">{course.tag}</span>
                            <h4 className="font-display font-bold text-gray-900 text-base mt-1.5">{course.bengaliTitle} ({course.title})</h4>
                            <p className="text-gray-500 text-xs mt-1 leading-relaxed line-clamp-2">{course.bengaliDescription}</p>
                            <div className="flex flex-wrap gap-4 mt-3 text-[11px] text-gray-400 font-semibold">
                              <span>ফি: {course.price}</span>
                              <span>সময়: {course.duration}</span>
                              {course.demoVideoUrl && (
                                <span className="text-red-600 bg-red-50 border border-red-100 px-1.5 py-0.5 text-[9px] font-mono flex items-center gap-1">
                                  🔴 YouTube Video Linked
                                </span>
                              )}
                            </div>
                          </div>
                          <button
                            onClick={() => handleRemoveCourse(course.id)}
                            className="text-gray-400 hover:text-red-600 p-1.5 transition-colors shrink-0 cursor-pointer"
                            title="রিমুভ কোর্স"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      ))
                    )}
                  </div>
                </div>

              </div>
            )}

            {/* 2. STUDENTS TAB */}
            {activeTab === 'students' && (
              <div className="space-y-8">
                {/* Manual Student Addition */}
                <div className="bg-slate-50 border border-gray-200 p-6">
                  <h3 className="font-display font-bold text-lg text-gray-900 flex items-center gap-2 mb-4">
                    <Users className="w-5 h-5 text-[#15803d]" />
                    নতুন শিক্ষার্থী যোগ করুন (Register New Student)
                  </h3>

                  <form onSubmit={handleAddStudent} className="space-y-4 text-xs">
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                      <div>
                        <label className="block text-gray-500 font-bold mb-1">ইমেইল এড্রেস *</label>
                        <input
                          type="email"
                          required
                          placeholder="student@example.com"
                          value={newStudentEmail}
                          onChange={(e) => setNewStudentEmail(e.target.value)}
                          className="w-full p-2.5 border border-gray-300 bg-white outline-none focus:border-[#15803d]"
                        />
                      </div>
                      <div>
                        <label className="block text-gray-500 font-bold mb-1">পাসওয়ার্ড *</label>
                        <input
                          type="password"
                          required
                          placeholder="Password"
                          value={newStudentPassword}
                          onChange={(e) => setNewStudentPassword(e.target.value)}
                          className="w-full p-2.5 border border-gray-300 bg-white outline-none focus:border-[#15803d]"
                        />
                      </div>
                      <div>
                        <label className="block text-gray-500 font-bold mb-1">শ্রেণী ও ব্যাচ</label>
                        <select
                          value={newStudentClass}
                          onChange={(e) => setNewStudentClass(e.target.value)}
                          className="w-full p-2.5 border border-gray-300 bg-white outline-none focus:border-[#15803d]"
                        >
                          <option value="Class 10 (দশম শ্রেণী)">Class 10 (দশম শ্রেণী)</option>
                          <option value="Class 11 (একাদশ শ্রেণী)">Class 11 (একাদশ শ্রেণী)</option>
                          <option value="Class 12 (দ্বাদশ শ্রেণী)">Class 12 (দ্বাদশ শ্রেণী)</option>
                          <option value="HSC Examinee (এইচএসসি পরীক্ষার্থী)">HSC Examinee (এইচএসসি পরীক্ষার্থী)</option>
                        </select>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-gray-500 font-bold mb-1">শিক্ষার্থীর নাম (English)</label>
                        <input
                          type="text"
                          placeholder="Abir Hasan"
                          value={newStudentName}
                          onChange={(e) => setNewStudentName(e.target.value)}
                          className="w-full p-2.5 border border-gray-300 bg-white outline-none focus:border-[#15803d]"
                        />
                      </div>
                      <div>
                        <label className="block text-gray-500 font-bold mb-1">শিক্ষার্থীর নাম (বাংলা)</label>
                        <input
                          type="text"
                          placeholder="আবির হাসান"
                          value={newStudentNameBn}
                          onChange={(e) => setNewStudentNameBn(e.target.value)}
                          className="w-full p-2.5 border border-gray-300 bg-white outline-none focus:border-[#15803d]"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-gray-500 font-bold mb-1">প্রতিষ্ঠানের নাম (English)</label>
                        <input
                          type="text"
                          placeholder="DCPSC"
                          value={newStudentSchool}
                          onChange={(e) => setNewStudentSchool(e.target.value)}
                          className="w-full p-2.5 border border-gray-300 bg-white outline-none focus:border-[#15803d]"
                        />
                      </div>
                      <div>
                        <label className="block text-gray-500 font-bold mb-1">প্রতিষ্ঠানের নাম (বাংলা)</label>
                        <input
                          type="text"
                          placeholder="ঢাকা ক্যান্টনমেন্ট স্কুল"
                          value={newStudentSchoolBn}
                          onChange={(e) => setNewStudentSchoolBn(e.target.value)}
                          className="w-full p-2.5 border border-gray-300 bg-white outline-none focus:border-[#15803d]"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
                      <div>
                        <label className="block text-gray-500 font-bold mb-1">মোবাইল নাম্বার (Student Phone)</label>
                        <input
                          type="tel"
                          placeholder="017xxxxxxxx"
                          value={newStudentPhone}
                          onChange={(e) => setNewStudentPhone(e.target.value)}
                          className="w-full p-2.5 border border-gray-300 bg-white outline-none focus:border-[#15803d]"
                        />
                      </div>
                      <div>
                        <label className="block text-gray-500 font-bold mb-1">অভিভাবকের মোবাইল (Parent Phone)</label>
                        <input
                          type="tel"
                          placeholder="016xxxxxxxx"
                          value={newStudentParentPhone}
                          onChange={(e) => setNewStudentParentPhone(e.target.value)}
                          className="w-full p-2.5 border border-gray-300 bg-white outline-none focus:border-[#15803d]"
                        />
                      </div>
                      <div>
                        <label className="block text-gray-500 font-bold mb-1">ঠিকানা (Home Address)</label>
                        <input
                          type="text"
                          placeholder="যেমন: উত্তরা, ঢাকা"
                          value={newStudentAddress}
                          onChange={(e) => setNewStudentAddress(e.target.value)}
                          className="w-full p-2.5 border border-gray-300 bg-white outline-none focus:border-[#15803d]"
                        />
                      </div>
                      <div>
                        <label className="block text-gray-500 font-bold mb-1">লিঙ্গ (Gender)</label>
                        <select
                          value={newStudentGender}
                          onChange={(e) => setNewStudentGender(e.target.value)}
                          className="w-full p-2.5 border border-gray-300 bg-white outline-none focus:border-[#15803d]"
                        >
                          <option value="পুরুষ (Male)">পুরুষ (Male)</option>
                          <option value="মহিলা (Female)">মহিলা (Female)</option>
                          <option value="অন্যান্য (Other)">অন্যান্য (Other)</option>
                        </select>
                      </div>
                    </div>

                    <button
                      type="submit"
                      className="bg-[#15803d] text-white hover:bg-black font-bold tracking-wider px-6 py-3 cursor-pointer transition-colors"
                    >
                      শিক্ষার্থী নিবন্ধন করুন (REGISTER STUDENT)
                    </button>
                  </form>
                </div>

                {/* Students List Table */}
                <div className="overflow-x-auto border border-gray-200">
                  <table className="w-full text-left border-collapse text-xs">
                    <thead>
                      <tr className="bg-slate-50 border-b border-gray-200 font-bold text-gray-700">
                        <th className="p-4">স্টুডেন্ট আইডি</th>
                        <th className="p-4">শিক্ষার্থীর নাম</th>
                        <th className="p-4">শ্রেণী ও প্রতিষ্ঠান</th>
                        <th className="p-4">ইমেইল / পাসওয়ার্ড</th>
                        <th className="p-4 text-center">অ্যাকশন</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100">
                      {filteredStudents.length === 0 ? (
                        <tr>
                          <td colSpan={5} className="p-8 text-center text-gray-400 bg-slate-50">
                            কোনো শিক্ষার্থী তথ্য পাওয়া যায়নি। (No student profiles found matching the filter query)
                          </td>
                        </tr>
                      ) : (
                        filteredStudents.map(student => (
                          <tr key={student.studentId} className="hover:bg-slate-50">
                            <td className="p-4 font-mono font-bold text-[#15803d]">{student.studentId}</td>
                            <td className="p-4">
                              <div className="font-bold text-gray-900">{student.dashboardData?.studentNameBn}</div>
                              <div className="text-gray-400 text-[10px]">{student.dashboardData?.studentName} {student.dashboardData?.gender && `(${student.dashboardData.gender})`}</div>
                            </td>
                            <td className="p-4">
                              <div className="font-medium text-gray-700">{student.dashboardData?.classLevel}</div>
                              <div className="text-gray-400 text-[10px]">{student.dashboardData?.schoolBn}</div>
                              {student.dashboardData?.homeAddress && (
                                <div className="text-gray-400 text-[9px] italic mt-0.5">📍 {student.dashboardData.homeAddress}</div>
                              )}
                            </td>
                            <td className="p-4">
                              <div className="text-gray-700">{student.email}</div>
                              <div className="text-gray-400 font-mono text-[10px]">PWD: {student.password}</div>
                              {student.dashboardData?.phone && (
                                <div className="text-blue-600 font-medium text-[10px] mt-0.5">📞 {student.dashboardData.phone}</div>
                              )}
                              {student.dashboardData?.parentPhone && (
                                <div className="text-purple-600 font-medium text-[10px]">👨‍👩‍👦 {student.dashboardData.parentPhone}</div>
                              )}
                            </td>
                            <td className="p-4 text-center">
                              <button
                                onClick={() => handleRemoveStudent(student.studentId)}
                                className="text-gray-400 hover:text-red-600 p-1.5 transition-colors cursor-pointer"
                                title="শিক্ষার্থী রিমুভ করুন"
                              >
                                <Trash2 className="w-4.5 h-4.5" />
                              </button>
                            </td>
                          </tr>
                        ))
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {/* 3. TEACHERS TAB */}
            {activeTab === 'teachers' && (
              <div className="space-y-8">
                {/* Add Teacher Form */}
                <div className="bg-slate-50 border border-gray-200 p-6">
                  <h3 className="font-display font-bold text-lg text-gray-900 flex items-center gap-2 mb-4">
                    <Award className="w-5 h-5 text-[#15803d]" />
                    নতুন শিক্ষক যুক্ত করুন (Add Teacher Profile)
                  </h3>

                  <form onSubmit={handleAddTeacher} className="space-y-4 text-xs">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-gray-500 font-bold mb-1">শিক্ষকের নাম (English) *</label>
                        <input
                          type="text"
                          required
                          placeholder="e.g. Dr. Jahidul Islam"
                          value={newTeacherName}
                          onChange={(e) => setNewTeacherName(e.target.value)}
                          className="w-full p-2.5 border border-gray-300 bg-white outline-none focus:border-[#15803d]"
                        />
                      </div>
                      <div>
                        <label className="block text-gray-500 font-bold mb-1">শিক্ষকের নাম (বাংলা) *</label>
                        <input
                          type="text"
                          required
                          placeholder="যেমন: ড. জাহিদুল ইসলাম"
                          value={newTeacherNameBn}
                          onChange={(e) => setNewTeacherNameBn(e.target.value)}
                          className="w-full p-2.5 border border-gray-300 bg-white outline-none focus:border-[#15803d]"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-gray-500 font-bold mb-1">অধীনস্থ বিষয় (Subject English)</label>
                        <input
                          type="text"
                          placeholder="e.g. Pure Mathematics"
                          value={newTeacherSubject}
                          onChange={(e) => setNewTeacherSubject(e.target.value)}
                          className="w-full p-2.5 border border-gray-300 bg-white outline-none focus:border-[#15803d]"
                        />
                      </div>
                      <div>
                        <label className="block text-gray-500 font-bold mb-1">অধীনস্থ বিষয় (বিষয় বাংলা)</label>
                        <input
                          type="text"
                          placeholder="যেমন: বিশুদ্ধ গণিত কেয়ার"
                          value={newTeacherSubjectBn}
                          onChange={(e) => setNewTeacherSubjectBn(e.target.value)}
                          className="w-full p-2.5 border border-gray-300 bg-white outline-none focus:border-[#15803d]"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-gray-500 font-bold mb-1">শিক্ষাগত যোগ্যতা (English)</label>
                        <input
                          type="text"
                          placeholder="e.g. B.Sc. in Mathematics, DU"
                          value={newTeacherEdu}
                          onChange={(e) => setNewTeacherEdu(e.target.value)}
                          className="w-full p-2.5 border border-gray-300 bg-white outline-none focus:border-[#15803d]"
                        />
                      </div>
                      <div>
                        <label className="block text-gray-500 font-bold mb-1">শিক্ষাগত যোগ্যতা (বাংলা)</label>
                        <input
                          type="text"
                          placeholder="যেমন: বি.এসসি. (গণিত), ঢাবি"
                          value={newTeacherEduBn}
                          onChange={(e) => setNewTeacherEduBn(e.target.value)}
                          className="w-full p-2.5 border border-gray-300 bg-white outline-none focus:border-[#15803d]"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-gray-500 font-bold mb-1">ছোট বায়ো (English Bio)</label>
                        <textarea
                          placeholder="Short biography..."
                          value={newTeacherBio}
                          onChange={(e) => setNewTeacherBio(e.target.value)}
                          className="w-full p-2.5 border border-gray-300 bg-white h-20 outline-none focus:border-[#15803d]"
                        />
                      </div>
                      <div>
                        <label className="block text-gray-500 font-bold mb-1">ছোট বায়ো (বাংলা বায়োগ্রাফি)</label>
                        <textarea
                          placeholder="শিক্ষকের সংক্ষিপ্ত পরিচিতি..."
                          value={newTeacherBioBn}
                          onChange={(e) => setNewTeacherBioBn(e.target.value)}
                          className="w-full p-2.5 border border-gray-300 bg-white h-20 outline-none focus:border-[#15803d]"
                        />
                      </div>
                    </div>

                    <button
                      type="submit"
                      className="bg-[#15803d] text-white hover:bg-black font-bold tracking-wider px-6 py-3 cursor-pointer transition-colors"
                    >
                      শিক্ষক যুক্ত করুন (PUBLISH TUTOR)
                    </button>
                  </form>
                </div>

                {/* Teachers List Grid */}
                <div className="space-y-4">
                  <h3 className="font-display font-bold text-gray-900 text-base">বিদ্যমান শিক্ষকবৃন্দ (Active Instructors)</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {filteredTeachers.length === 0 ? (
                      <div className="col-span-2 text-center text-gray-400 p-8 border border-dashed border-gray-200 bg-slate-50">
                        কোনো শিক্ষক তথ্য পাওয়া যায়নি। (No instructor profiles found matching the filter query)
                      </div>
                    ) : (
                      filteredTeachers.map(teacher => (
                        <div key={teacher.id} className="border border-gray-200 p-5 flex justify-between items-start gap-4 bg-white hover:border-[#15803d] transition-colors">
                          <div>
                            <h4 className="font-display font-bold text-gray-900 text-base">{teacher.nameBn}</h4>
                            <span className="text-[10px] text-gray-400 font-bold uppercase tracking-wider block mb-1">{teacher.name}</span>
                            <p className="text-[#15803d] text-xs font-semibold">{teacher.subjectBn}</p>
                            <p className="text-gray-400 text-xs mt-1">{teacher.educationBn}</p>
                          </div>
                          <button
                            onClick={() => handleRemoveTeacher(teacher.id)}
                            className="text-gray-400 hover:text-red-600 p-1.5 transition-colors shrink-0 cursor-pointer"
                            title="রিমুভ শিক্ষক"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      ))
                    )}
                  </div>
                </div>

              </div>
            )}

            {/* 4. PAYMENTS TAB */}
            {activeTab === 'payments' && (
              <div className="space-y-6">
                <div className="flex justify-between items-center">
                  <h3 className="font-display font-bold text-gray-900 text-base">জমা পড়া পেমেন্ট বিবরণীসমূহ (Payment Verification Logs)</h3>
                  <span className="font-mono text-[10px] bg-blue-50 text-[#15803d] font-bold px-2 py-1">REAL-TIME INCOMING DB</span>
                </div>

                {/* Payments Table */}
                <div className="overflow-x-auto border border-gray-200">
                  <table className="w-full text-left border-collapse text-xs">
                    <thead>
                      <tr className="bg-slate-50 border-b border-gray-200 font-bold text-gray-700">
                        <th className="p-4">ট্রানজেকশন / রশিদ</th>
                        <th className="p-4">শিক্ষার্থী বিবরণ</th>
                        <th className="p-4">কোর্স ও অ্যামাউন্ট</th>
                        <th className="p-4">পেমেন্ট মেথড ও প্রেৱক</th>
                        <th className="p-4 text-center">স্ট্যাটাস</th>
                        <th className="p-4 text-right">পদক্ষেপ (Actions)</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100">
                      {filteredPayments.length === 0 ? (
                        <tr>
                          <td colSpan={6} className="p-8 text-center text-gray-400 bg-slate-50">কোনো পেমেন্ট তথ্য খুঁজে পাওয়া যায়নি। (No payments found matching search query)</td>
                        </tr>
                      ) : (
                        filteredPayments.map(pay => (
                          <tr key={pay.id} className="hover:bg-slate-50">
                            <td className="p-4">
                              <div className="font-bold text-[#15803d] font-mono">{pay.id}</div>
                              <div className="text-gray-400 font-mono text-[10px]">Trx: {pay.transactionId}</div>
                              <div className="text-gray-400 text-[9px] mt-0.5">{new Date(pay.timestamp).toLocaleString('bn-BD')}</div>
                            </td>
                            <td className="p-4">
                              <div className="font-bold text-gray-900">{pay.studentName}</div>
                              <div className="font-mono text-gray-500 text-[10px]">{pay.studentId}</div>
                            </td>
                            <td className="p-4">
                              <div className="font-semibold text-gray-800">{pay.courseTitle}</div>
                              <div className="font-bold text-gray-900">৳ {pay.amount} BDT</div>
                            </td>
                            <td className="p-4">
                              <div className="font-bold text-gray-800">{pay.paymentMethod}</div>
                              <div className="text-gray-400 font-mono text-[10px]">{pay.phoneNumber}</div>
                            </td>
                            <td className="p-4 text-center">
                              <span className={`inline-block px-2.5 py-1 text-[9px] font-bold rounded-full ${
                                pay.status === 'VERIFIED' ? 'bg-emerald-50 text-emerald-700 border border-emerald-200' :
                                pay.status === 'REJECTED' ? 'bg-red-50 text-red-700 border border-red-200' :
                                'bg-amber-50 text-amber-700 border border-amber-200'
                              }`}>
                                {pay.status === 'VERIFIED' ? 'SUCCESS / VERIFIED' :
                                 pay.status === 'REJECTED' ? 'REJECTED / EXPIRED' :
                                 'PENDING CHECK'}
                              </span>
                            </td>
                            <td className="p-4 text-right space-y-1.5">
                              {pay.status !== 'VERIFIED' && (
                                <button
                                  onClick={() => handleUpdatePayment(pay.id, 'VERIFIED')}
                                  className="inline-flex items-center gap-1 bg-[#15803d] hover:bg-emerald-700 text-white font-bold text-[10px] px-2.5 py-1.5 mr-1 transition-colors cursor-pointer"
                                >
                                  <Check className="w-3 h-3" /> Approve
                                </button>
                              )}
                              {pay.status !== 'REJECTED' && (
                                <button
                                  onClick={() => handleUpdatePayment(pay.id, 'REJECTED')}
                                  className="inline-flex items-center gap-1 bg-red-600 hover:bg-red-700 text-white font-bold text-[10px] px-2.5 py-1.5 transition-colors cursor-pointer"
                                >
                                  Reject
                                </button>
                              )}
                            </td>
                          </tr>
                        ))
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {/* 5. ACCESS CONTROL TAB */}
            {activeTab === 'access' && (
              <div className="space-y-8">
                <div className="bg-emerald-50 border-l-4 border-[#15803d] p-5 text-xs text-emerald-800 leading-relaxed">
                  <h4 className="font-bold text-sm mb-1 text-[#15803d]">মাস্টার এডমিন অ্যাক্সেস কন্ট্রোল (Master Admin Access Control)</h4>
                  <p>
                    এখান থেকে আপনি যেকোনো ইমেইল এড্রেসকে এডমিন প্যানেল এক্সেস দিতে অথবা বন্ধ করতে পারেন। যে শিক্ষার্থীরা নিবন্ধিত রয়েছে, তাদের ইমেইল অনুযায়ী অ্যাক্সেস কন্ট্রোল করা যাবে এবং নির্দিষ্ট রোল এসাইন করা যাবে।
                  </p>
                </div>

                {/* Add Custom Email Form */}
                <div className="bg-slate-50 border border-gray-200 p-6">
                  <h3 className="font-display font-bold text-lg text-gray-900 flex items-center gap-2 mb-4">
                    <PlusCircle className="w-5 h-5 text-[#15803d]" />
                    নতুন ইমেইলকে এডমিন অ্যাক্সেস ও রোল দিন (Grant Admin Access & Role)
                  </h3>
                  <form onSubmit={handleAddAdminEmail} className="flex flex-col sm:flex-row gap-3 max-w-2xl text-xs">
                    <input
                      type="email"
                      required
                      placeholder="যেমন: example@gmail.com"
                      value={newAdminEmail}
                      onChange={(e) => setNewAdminEmail(e.target.value)}
                      className="flex-grow p-2.5 border border-gray-300 bg-white outline-none focus:border-[#15803d]"
                    />
                    <select
                      value={newAdminRole}
                      onChange={(e) => setNewAdminRole(e.target.value as any)}
                      className="p-2.5 border border-gray-300 bg-white outline-none focus:border-[#15803d] font-bold text-gray-700"
                    >
                      <option value="COURSE_MANAGER">কোর্স ম্যানেজার (Course Manager)</option>
                      <option value="MODERATOR">মডারেটর (Moderator)</option>
                      <option value="FINANCE">অর্থ কর্মকর্তা (Finance Officer)</option>
                      <option value="MASTER">মাস্টার এডমিন (Master Admin)</option>
                    </select>
                    <button
                      type="submit"
                      className="bg-[#15803d] text-white hover:bg-black font-bold tracking-wider px-6 py-2.5 cursor-pointer transition-colors"
                    >
                      অ্যাক্সেস দিন (GRANT ACCESS)
                    </button>
                  </form>
                </div>

                {/* Dynamic Admin List with Search & Actions */}
                <div className="space-y-4">
                  <h3 className="font-display font-bold text-gray-900 text-base">অ্যাক্সেসপ্রাপ্ত ইমেইল ও রোল তালিকা (Authorized Emails & Roles)</h3>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {filteredAccessAdmins.filter(email => {
                      const isMaster = email.toLowerCase() === 'rr.mdjaidulislam@gmail.com' || email.toLowerCase() === 'edu.mdjaidulislam@gmail.com' || email.toLowerCase() === 'md.jaidulislam@hotmail.com';
                      if (isMaster) {
                        return currentAdminUser.role === 'MASTER';
                      }
                      return true;
                    }).length === 0 ? (
                      <div className="col-span-2 text-center text-gray-400 p-8 border border-dashed border-gray-200 bg-slate-50 text-xs">
                        কোনো অনুমোদিত ইমেইল খুঁজে পাওয়া যায়নি। (No authorized admin emails found matching query)
                      </div>
                    ) : (
                      filteredAccessAdmins.filter(email => {
                        const isMaster = email.toLowerCase() === 'rr.mdjaidulislam@gmail.com' || email.toLowerCase() === 'edu.mdjaidulislam@gmail.com' || email.toLowerCase() === 'md.jaidulislam@hotmail.com';
                        if (isMaster) {
                          return currentAdminUser.role === 'MASTER';
                        }
                        return true;
                      }).map(email => {
                        const isMaster = email.toLowerCase() === 'rr.mdjaidulislam@gmail.com' || email.toLowerCase() === 'edu.mdjaidulislam@gmail.com' || email.toLowerCase() === 'md.jaidulislam@hotmail.com';
                        const assignedRole = adminRoles[email.toLowerCase()] || 'COURSE_MANAGER';
                        return (
                          <div key={email} className="border border-gray-200 p-4 flex justify-between items-center bg-white shadow-2xs hover:border-[#15803d] transition-all">
                            <div className="flex items-center gap-2.5">
                              <div className={`w-2.5 h-2.5 rounded-full ${isMaster ? 'bg-amber-500 animate-pulse' : 'bg-[#15803d]'}`} />
                              <div>
                                <span className="font-mono text-xs font-bold text-gray-900">{email}</span>
                                
                                <div className="mt-1 flex items-center gap-2 text-[10px]">
                                  <span className="text-gray-400 font-medium">রোল:</span>
                                  {isMaster ? (
                                    <span className="block text-[8px] font-bold text-amber-600 bg-amber-50 border border-amber-200 px-1.5 py-0.2 rounded-xs uppercase">
                                      MASTER ADMIN / SYSTEM FIXED
                                    </span>
                                  ) : (
                                    <select
                                      value={assignedRole}
                                      onChange={(e) => handleUpdateAdminRole(email, e.target.value as any)}
                                      className="text-[10px] p-1 border border-gray-200 bg-white rounded-xs focus:border-[#15803d] font-bold text-[#15803d]"
                                    >
                                      <option value="COURSE_MANAGER">COURSE MANAGER</option>
                                      <option value="MODERATOR">MODERATOR</option>
                                      <option value="FINANCE">FINANCE OFFICER</option>
                                      <option value="MASTER">MASTER ADMIN</option>
                                    </select>
                                  )}
                                </div>
                              </div>
                            </div>
                            {!isMaster && (
                              <button
                                onClick={() => handleRemoveAdminEmail(email)}
                                className="text-gray-400 hover:text-red-600 p-1.5 transition-colors cursor-pointer"
                                title="অ্যাক্সেস বন্ধ করুন"
                              >
                                <Trash2 className="w-4.5 h-4.5" />
                              </button>
                            )}
                          </div>
                        );
                      })
                    )}
                  </div>
                </div>

                {/* Integration List of Registered Students */}
                <div className="space-y-4">
                  <h3 className="font-display font-bold text-gray-900 text-base">শিক্ষার্থী তালিকা ও অ্যাক্সেস স্থিতি (Registered Students Admin Access Panel)</h3>
                  <div className="overflow-x-auto border border-gray-200">
                    <table className="w-full text-left border-collapse text-xs">
                      <thead>
                        <tr className="bg-slate-50 border-b border-gray-200 font-bold text-gray-700">
                          <th className="p-4">স্টুডেন্ট আইডি</th>
                          <th className="p-4">শিক্ষার্থীর নাম</th>
                          <th className="p-4">ইমেইল</th>
                          <th className="p-4">বর্তমান স্ট্যাটাস ও রোল</th>
                          <th className="p-4 text-center">অ্যাকশন</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-gray-100">
                        {students.filter(student => {
                          const isMaster = student.email.toLowerCase() === 'rr.mdjaidulislam@gmail.com' || student.email.toLowerCase() === 'edu.mdjaidulislam@gmail.com' || student.email.toLowerCase() === 'md.jaidulislam@hotmail.com';
                          if (isMaster) {
                            return currentAdminUser.role === 'MASTER';
                          }
                          return true;
                        }).length === 0 ? (
                          <tr>
                            <td colSpan={5} className="p-8 text-center text-gray-400">কোনো নিবন্ধিত শিক্ষার্থী নেই।</td>
                          </tr>
                        ) : (
                          students.filter(student => {
                            const isMaster = student.email.toLowerCase() === 'rr.mdjaidulislam@gmail.com' || student.email.toLowerCase() === 'edu.mdjaidulislam@gmail.com' || student.email.toLowerCase() === 'md.jaidulislam@hotmail.com';
                            if (isMaster) {
                              return currentAdminUser.role === 'MASTER';
                            }
                            return true;
                          }).map(student => {
                            const hasAccess = authorizedAdmins.map(e => e.toLowerCase()).includes(student.email.toLowerCase());
                            const isMaster = student.email.toLowerCase() === 'rr.mdjaidulislam@gmail.com' || student.email.toLowerCase() === 'edu.mdjaidulislam@gmail.com' || student.email.toLowerCase() === 'md.jaidulislam@hotmail.com';
                            const studentRole = adminRoles[student.email.toLowerCase()] || 'COURSE_MANAGER';
                            return (
                              <tr key={student.studentId} className="hover:bg-slate-50">
                                <td className="p-4 font-mono font-bold text-[#15803d]">{student.studentId}</td>
                                <td className="p-4">
                                  <div className="font-bold text-gray-900">{student.dashboardData?.studentNameBn || 'নিবন্ধিত শিক্ষার্থী'}</div>
                                  <div className="text-gray-400 text-[10px]">{student.dashboardData?.studentName || student.email.split('@')[0]}</div>
                                </td>
                                <td className="p-4 font-mono">{student.email}</td>
                                <td className="p-4 space-y-1">
                                  <div>
                                    <span className={`inline-block px-2 py-0.5 text-[9px] font-bold rounded-full ${hasAccess ? 'bg-green-50 text-green-700 border border-green-200' : 'bg-gray-50 text-gray-500 border border-gray-200'}`}>
                                      {hasAccess ? 'AUTHORIZED ADMIN' : 'STUDENT ONLY'}
                                    </span>
                                  </div>
                                  {hasAccess && (
                                    <div className="text-[9px] text-gray-500">
                                      রোল: <span className="font-bold text-[#15803d]">{studentRole}</span>
                                    </div>
                                  )}
                                </td>
                                <td className="p-4 text-center">
                                  {isMaster ? (
                                    <span className="text-[10px] text-amber-600 font-bold uppercase">SYSTEM FIXED</span>
                                  ) : (
                                    <button
                                      onClick={() => {
                                        if (hasAccess) {
                                          handleRemoveAdminEmail(student.email);
                                        } else {
                                          setAuthorizedAdmins(prev => [...prev, student.email.toLowerCase()]);
                                        }
                                      }}
                                      className={`px-3 py-1.5 font-bold text-[10px] uppercase cursor-pointer transition-all ${hasAccess ? 'bg-red-50 text-red-600 hover:bg-red-100 border border-red-200' : 'bg-emerald-50 text-emerald-700 hover:bg-emerald-100 border border-emerald-200'}`}
                                    >
                                      {hasAccess ? 'Revoke Access' : 'Grant Access'}
                                    </button>
                                  )}
                                </td>
                              </tr>
                            );
                          })
                        )}
                      </tbody>
                    </table>
                  </div>
                </div>

              </div>
            )}

            {/* 6. TEAM CHAT PANEL */}
            {activeTab === 'chat' && (
              <div className="space-y-6">
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-slate-50 border border-gray-200 p-5">
                  <div>
                    <h3 className="font-display font-black text-lg text-gray-900 flex items-center gap-2">
                      <MessageSquare className="w-5 h-5 text-[#15803d]" />
                      টিম অভ্যন্তরীণ চ্যাট প্যানেল (Internal Team Chat Board)
                    </h3>
                    <p className="text-xs text-gray-500 mt-1">
                      এখানে প্যানেলের দায়িত্বপ্রাপ্ত ব্যক্তিরা একে অপরের সাথে রিয়েল-টাইমে যোগাযোগ করতে পারেন। (Only authorized admins can chat here)
                    </p>
                  </div>
                  {currentAdminUser.role === 'MASTER' && (
                    <button
                      onClick={handleClearChat}
                      className="bg-red-50 hover:bg-red-100 text-red-700 border border-red-200 font-bold text-xs px-4 py-2 transition-all cursor-pointer"
                    >
                      চ্যাট হিস্ট্রি মুছুন (Clear All Messages)
                    </button>
                  )}
                </div>

                {/* Message display board */}
                <div className="border border-gray-200 h-[450px] flex flex-col bg-slate-50/50">
                  <div className="flex-grow p-4 overflow-y-auto space-y-4">
                    {chatMessages.length === 0 ? (
                      <div className="h-full flex flex-col items-center justify-center text-gray-400 text-xs">
                        <MessageSquare className="w-10 h-10 text-gray-300 mb-2" />
                        কোনো মেসেজ পাওয়া যায়নি। নতুন একটি মেসেজ পাঠিয়ে আলোচনা শুরু করুন!
                      </div>
                    ) : (
                      chatMessages.map(msg => {
                        const isMyMessage = msg.senderEmail.toLowerCase() === currentAdminUser.email.toLowerCase();
                        // Filter out Master admin messages/emails if the logged in user is NOT master!
                        const isMsgSenderMaster = msg.senderRole === 'MASTER';
                        let finalMsg = { ...msg };
                        if (isMsgSenderMaster && currentAdminUser.role !== 'MASTER') {
                          // Obfuscate the sender's master email and display a simplified, friendly, protected sender name
                          finalMsg.senderEmail = 'protected@edustika.com';
                          finalMsg.senderName = 'এডমিন টিম লিডার (Protected)';
                        }

                        return (
                          <div
                            key={finalMsg.id}
                            className={`flex flex-col max-w-[80%] ${isMyMessage ? 'ml-auto items-end' : 'mr-auto items-start'}`}
                          >
                            <div className="flex items-center gap-1.5 mb-1 text-[10px]">
                              <span className="font-bold text-gray-800">{finalMsg.senderName}</span>
                              <span className={`px-1.5 py-0.2 text-[8px] font-bold border rounded-xs uppercase tracking-wide ${
                                finalMsg.senderRole === 'MASTER' ? 'bg-amber-50 text-amber-700 border-amber-200' :
                                finalMsg.senderRole === 'COURSE_MANAGER' ? 'bg-blue-50 text-blue-700 border-blue-200' :
                                finalMsg.senderRole === 'MODERATOR' ? 'bg-emerald-50 text-emerald-700 border-emerald-200' :
                                'bg-purple-50 text-purple-700 border-purple-200'
                              }`}>
                                {finalMsg.senderRole}
                              </span>
                              <span className="text-gray-400 font-mono text-[9px]">
                                {new Date(finalMsg.timestamp).toLocaleTimeString('bn-BD', { hour: '2-digit', minute: '2-digit' })}
                              </span>
                            </div>
                            <div className={`p-3 text-xs leading-relaxed ${
                              isMyMessage ? 'bg-[#15803d] text-white rounded-l-lg rounded-tr-lg' : 'bg-white text-gray-800 border border-gray-200 rounded-r-lg rounded-tl-lg'
                            }`}>
                              <p className="whitespace-pre-wrap">{finalMsg.text}</p>
                            </div>
                            {/* Display sender email only if authorized or if it is not master admin */}
                            {(currentAdminUser.role === 'MASTER' || finalMsg.senderEmail !== 'protected@edustika.com') && (
                              <span className="text-[9px] font-mono text-gray-400 mt-0.5">{finalMsg.senderEmail}</span>
                            )}
                          </div>
                        );
                      })
                    )}
                  </div>

                  {/* Typing input form container */}
                  <form onSubmit={handleSendMessage} className="border-t border-gray-200 p-3 bg-white flex gap-2">
                    <input
                      type="text"
                      value={newMessageText}
                      onChange={(e) => setNewMessageText(e.target.value)}
                      placeholder="এখানে আপনার বার্তা লিখুন... (Type your internal team message here)"
                      className="flex-grow p-2.5 border border-gray-300 bg-white text-xs outline-none focus:border-[#15803d]"
                    />
                    <button
                      type="submit"
                      className="bg-[#15803d] text-white hover:bg-black font-bold text-xs px-5 py-2.5 flex items-center gap-1.5 transition-colors cursor-pointer"
                    >
                      <Send className="w-4 h-4" />
                      পাঠান (Send)
                    </button>
                  </form>
                </div>
              </div>
            )}

            {/* 7. BLOG MANAGER PANEL */}
            {activeTab === 'blog' && (
              <div className="space-y-8 animate-fadeIn text-left">
                <div className="bg-slate-50 border border-gray-200 p-5 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                  <div>
                    <h3 className="font-display font-black text-lg text-gray-900 flex items-center gap-2">
                      <BookOpen className="w-5 h-5 text-[#15803d]" />
                      ব্লগ ও শিক্ষামূলক পোস্ট ম্যানেজার (Educational Blog Management)
                    </h3>
                    <p className="text-xs text-gray-500 mt-1">
                      হোমপেজে প্রদর্শিত পোস্টসমূহ এখানে তৈরি ও মুছে ফেলা যাবে। (Publish, update, or remove academic posts from the homepage)
                    </p>
                  </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                  {/* Create New Post Form */}
                  <div className="lg:col-span-5 bg-white border border-gray-200 p-6 space-y-4">
                    <h4 className="font-sans font-extrabold text-xs uppercase tracking-wider text-gray-900 border-b border-gray-100 pb-3 flex items-center gap-1.5">
                      <PlusCircle className="w-4 h-4 text-[#15803d]" />
                      নতুন পোস্ট প্রকাশ করুন (Publish New Post)
                    </h4>

                    <form onSubmit={handleAddBlogPost} className="space-y-4 text-xs">
                      {/* Bangla Title */}
                      <div className="space-y-1">
                        <label className="block font-bold text-gray-700">পোস্টের শিরোনাম (বাংলা) *</label>
                        <input
                          type="text"
                          required
                          value={newPostTitleBn}
                          onChange={(e) => setNewPostTitleBn(e.target.value)}
                          placeholder="উদা: গণিতের ভয় দূর করার ৫টি সহজ উপায়"
                          className="w-full p-2.5 border border-gray-300 bg-white text-xs outline-none focus:border-[#15803d]"
                        />
                      </div>

                      {/* English Title */}
                      <div className="space-y-1">
                        <label className="block font-bold text-gray-700">Post Title (English) *</label>
                        <input
                          type="text"
                          required
                          value={newPostTitleEn}
                          onChange={(e) => setNewPostTitleEn(e.target.value)}
                          placeholder="e.g., 5 Easy Ways to Overcome Math Fear"
                          className="w-full p-2.5 border border-gray-300 bg-white text-xs outline-none focus:border-[#15803d]"
                        />
                      </div>

                      {/* Category Selector */}
                      <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-1">
                          <label className="block font-bold text-gray-700">ক্যাটাগরি (বাংলা)</label>
                          <select
                            value={newPostCategoryBn}
                            onChange={(e) => setNewPostCategoryBn(e.target.value)}
                            className="w-full p-2.5 border border-gray-300 bg-white text-xs outline-none focus:border-[#15803d]"
                          >
                            <option value="পড়াশোনার টিপস">পড়াশোনার টিপস</option>
                            <option value="পরীক্ষার প্রস্তুতি">পরীক্ষার প্রস্তুতি</option>
                            <option value="নির্দেশিকা">নির্দেশিকা</option>
                            <option value="অন্যান্য">অন্যান্য</option>
                          </select>
                        </div>
                        <div className="space-y-1">
                          <label className="block font-bold text-gray-700">Category (English)</label>
                          <select
                            value={newPostCategoryEn}
                            onChange={(e) => setNewPostCategoryEn(e.target.value)}
                            className="w-full p-2.5 border border-gray-300 bg-white text-xs outline-none focus:border-[#15803d]"
                          >
                            <option value="Study Tips">Study Tips</option>
                            <option value="Exam Prep">Exam Prep</option>
                            <option value="Guides">Guides</option>
                            <option value="Others">Others</option>
                          </select>
                        </div>
                      </div>

                      {/* Summary BN */}
                      <div className="space-y-1">
                        <label className="block font-bold text-gray-700">সংক্ষিপ্ত সারসংক্ষেপ (বাংলা) [ঐচ্ছিক]</label>
                        <textarea
                          rows={2}
                          value={newPostSummaryBn}
                          onChange={(e) => setNewPostSummaryBn(e.target.value)}
                          placeholder="পোস্টের একটি ছোট ভূমিকা বা সামারি..."
                          className="w-full p-2.5 border border-gray-300 bg-white text-xs outline-none focus:border-[#15803d]"
                        />
                      </div>

                      {/* Summary EN */}
                      <div className="space-y-1">
                        <label className="block font-bold text-gray-700">Short Summary (English) [Optional]</label>
                        <textarea
                          rows={2}
                          value={newPostSummaryEn}
                          onChange={(e) => setNewPostSummaryEn(e.target.value)}
                          placeholder="A brief introduction or summary of the post..."
                          className="w-full p-2.5 border border-gray-300 bg-white text-xs outline-none focus:border-[#15803d]"
                        />
                      </div>

                      {/* Content BN */}
                      <div className="space-y-1">
                        <label className="block font-bold text-gray-700">সম্পূর্ণ মূল লেখা (বাংলা) *</label>
                        <textarea
                          rows={5}
                          required
                          value={newPostContentBn}
                          onChange={(e) => setNewPostContentBn(e.target.value)}
                          placeholder="এখানে পুরো পোস্টের বিস্তারিত লিখুন..."
                          className="w-full p-2.5 border border-gray-300 bg-white text-xs outline-none focus:border-[#15803d]"
                        />
                      </div>

                      {/* Content EN */}
                      <div className="space-y-1">
                        <label className="block font-bold text-gray-700">Full Content Article (English) *</label>
                        <textarea
                          rows={5}
                          required
                          value={newPostContentEn}
                          onChange={(e) => setNewPostContentEn(e.target.value)}
                          placeholder="Type the complete detailed post here..."
                          className="w-full p-2.5 border border-gray-300 bg-white text-xs outline-none focus:border-[#15803d]"
                        />
                      </div>

                      <button
                        type="submit"
                        className="w-full bg-[#15803d] text-white hover:bg-black font-bold text-xs py-3 tracking-widest uppercase transition-colors cursor-pointer"
                      >
                        পোস্ট প্রকাশ করুন (Publish Post)
                      </button>
                    </form>
                  </div>

                  {/* List of Published Posts */}
                  <div className="lg:col-span-7 bg-white border border-gray-200 p-6 space-y-4">
                    <h4 className="font-sans font-extrabold text-xs uppercase tracking-wider text-gray-900 border-b border-gray-100 pb-3 flex items-center justify-between">
                      <span>প্রকাশিত পোস্টসমূহ (Published Posts List)</span>
                      <span className="font-mono bg-green-50 text-[#15803d] px-2 py-0.5 rounded-xs font-bold text-[10px]">
                        {blogPosts.length} POSTS
                      </span>
                    </h4>

                    {blogPosts.length === 0 ? (
                      <div className="py-16 text-center text-gray-400 text-xs flex flex-col items-center justify-center">
                        <BookOpen className="w-12 h-12 text-gray-200 mb-2" />
                        কোনো পোস্ট পাওয়া যায়নি। নতুন পোস্ট তৈরি করুন।
                      </div>
                    ) : (
                      <div className="space-y-4 overflow-y-auto max-h-[650px] pr-2">
                        {blogPosts.map((post) => (
                          <div
                            key={post.id}
                            className="p-4 border border-gray-100 bg-slate-50/50 flex flex-col sm:flex-row sm:items-start justify-between gap-4 transition-all hover:bg-slate-50"
                          >
                            <div className="space-y-2 text-left">
                              <div className="flex flex-wrap items-center gap-2 text-[10px] font-bold">
                                <span className="text-[#15803d] uppercase tracking-wider bg-green-50 px-2 py-0.5 border border-green-100">
                                  {post.categoryBn} ({post.categoryEn})
                                </span>
                                <span className="text-gray-400 font-mono">
                                  {post.dateBn} | {post.dateEn}
                                </span>
                              </div>
                              <h5 className="font-sans font-bold text-gray-900 text-sm">
                                {post.titleBn}
                              </h5>
                              <p className="font-mono text-gray-400 text-[10px]">
                                EN: {post.titleEn}
                              </p>
                              <p className="text-gray-500 text-[11px] line-clamp-2">
                                {post.summaryBn}
                              </p>
                            </div>

                            <button
                              onClick={() => handleDeleteBlogPost(post.id)}
                              className="text-red-600 hover:text-white hover:bg-red-600 border border-red-100 hover:border-red-600 p-2 transition-all self-start cursor-pointer rounded-xs"
                              title="Delete Post"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            )}

          </div>

        </div>
      )}
    </div>
  );
}
