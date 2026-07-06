import { Course } from '../types';

export interface Teacher {
  id: string;
  name: string;
  nameBn: string;
  subject: string;
  subjectBn: string;
  education: string;
  educationBn: string;
  avatarUrl?: string;
  bio: string;
  bioBn: string;
}

export interface PaymentVerification {
  id: string;
  studentId: string;
  studentName: string;
  courseId: string;
  courseTitle: string;
  paymentMethod: 'bKash' | 'Nagad' | 'Rocket';
  phoneNumber: string;
  amount: number;
  transactionId: string;
  timestamp: string;
  status: 'VERIFIED' | 'PENDING' | 'REJECTED';
  systemRemarks?: string;
}

// Default Seed Courses
const DEFAULT_COURSES: Course[] = [
  {
    id: 'general-math',
    title: 'General Math',
    bengaliTitle: 'সাধারণ গণিত',
    description: 'Basic to advanced mathematical logic, problem solving and formulas taught with simplified interactive methods.',
    bengaliDescription: 'বেসিক থেকে অ্যাডভান্স লেভেল পর্যন্ত গণিতের সব খুঁটিনাটি শিখুন সহজ পদ্ধতিতে।',
    icon: 'badge',
    tag: 'Class 8 - 10',
    price: '৳ ১২০০ / মাস',
    duration: '৩ মাস (সপ্তাহে ৩ দিন)',
    level: 'সব লেভেল',
    demoVideoUrl: 'https://www.youtube.com/watch?v=zD_Yfby-O90'
  },
  {
    id: 'higher-math',
    title: 'Higher Math',
    bengaliTitle: 'উচ্চতর গণিত',
    description: 'Advanced calculus, algebra, trigonometry and coordinate geometry made easy for board exam preparation.',
    bengaliDescription: 'জটিল গাণিতিক সমস্যার সমাধান এবং উচ্চতর দক্ষতার জন্য বিশেষ কোর্স।',
    icon: 'sigma',
    tag: 'Class 9 - 12',
    price: '৳ ১৫০০ / মাস',
    duration: '৪ মাস (সপ্তাহে ৩ দিন)',
    level: 'ইন্টারমিডিয়েট',
    demoVideoUrl: 'https://www.youtube.com/watch?v=F3G6e8M-rJk'
  },
  {
    id: 'physics',
    title: 'Physics',
    bengaliTitle: 'পদার্থবিজ্ঞান',
    description: 'Fascinating theories of physics linked with real world demonstrations and mathematical derivations.',
    bengaliDescription: 'বিজ্ঞানের মজার দুনিয়া এবং বাস্তব প্রয়োগের মাধ্যমে পদার্থবিজ্ঞান শিখুন।',
    icon: 'flask',
    tag: 'Class 9 - 12',
    price: '৳ ১৫০০ / মাস',
    duration: '৪ মাস (সপ্তাহে ৩ দিন)',
    level: 'অ্যাডভান্সড',
    demoVideoUrl: 'https://www.youtube.com/watch?v=gT8gUeO_1j0'
  }
];

// Default Seed Teachers
const DEFAULT_TEACHERS: Teacher[] = [
  {
    id: 't-jahid',
    name: 'Mohammad Jahidul Islam',
    nameBn: 'মোহাম্মদ জাহিদুল ইসলাম',
    subject: 'Pure Mathematics & Higher Math Care',
    subjectBn: 'বিশুদ্ধ গণিত ও উচ্চতর গণিত কেয়ার',
    education: 'B.Sc. in Mathematics, Dhaka University (DU)',
    educationBn: 'বি.এসসি. (গণিত), ঢাকা বিশ্ববিদ্যালয় (ঢাবি)',
    bio: 'Professional math tutor with over 6 years of expertise in calculus, algebra and coordinate geometry instruction.',
    bioBn: 'ক্যালকুলাস, বীজগণিত এবং স্থানাঙ্ক জ্যামিতিতে ৬ বছরেরও বেশি সময় ধরে শিক্ষকতার অভিজ্ঞতা সম্পন্ন।'
  },
  {
    id: 't-tasmiah',
    name: 'Tasmiah Rahman',
    nameBn: 'তাসমিয়াহ রহমান',
    subject: 'Physics & Applied Mechanics',
    subjectBn: 'পদার্থবিজ্ঞান ও ফলিত বলবিদ্যা',
    education: 'B.Sc. in Mechanical Engineering, BUET',
    educationBn: 'বি.এসসি. (মেকানিক্যাল ইঞ্জিনিয়ারিং), বুয়েট',
    bio: 'Specialist in simplifying core physics mechanics and mathematical formulations with interactive practical models.',
    bioBn: 'বাস্তব উদাহরণ ও আকর্ষণীয় ফর্মুলার মাধ্যমে কঠিন পদার্থবিজ্ঞান সহজ করায় পারদর্শী।'
  }
];

// Default Seed Payments
const DEFAULT_PAYMENTS: PaymentVerification[] = [
  {
    id: 'PAY-8921-A',
    studentId: 'ED-2026-0489',
    studentName: 'Abir Hasan',
    courseId: 'higher-math',
    courseTitle: 'উচ্চতর গণিত',
    paymentMethod: 'bKash',
    phoneNumber: '01712345678',
    amount: 1500,
    transactionId: 'BKX89201AS8',
    timestamp: '2026-06-28T10:30:00Z',
    status: 'VERIFIED',
    systemRemarks: 'Verified automatically via API gateway routing.'
  }
];

// Setup functions
export const initDatabase = () => {
  if (!localStorage.getItem('edustika_courses_db')) {
    localStorage.setItem('edustika_courses_db', JSON.stringify(DEFAULT_COURSES));
  } else {
    try {
      const stored = JSON.parse(localStorage.getItem('edustika_courses_db') || '[]');
      let updated = false;
      const newStored = stored.map((c: any) => {
        const d = DEFAULT_COURSES.find(dc => dc.id === c.id);
        if (d && !c.demoVideoUrl) {
          c.demoVideoUrl = d.demoVideoUrl;
          updated = true;
        }
        return c;
      });
      if (updated) {
        localStorage.setItem('edustika_courses_db', JSON.stringify(newStored));
      }
    } catch (e) {
      console.error(e);
    }
  }
  if (!localStorage.getItem('edustika_teachers_db')) {
    localStorage.setItem('edustika_teachers_db', JSON.stringify(DEFAULT_TEACHERS));
  }
  if (!localStorage.getItem('edustika_payments_db')) {
    localStorage.setItem('edustika_payments_db', JSON.stringify(DEFAULT_PAYMENTS));
  }
  if (!localStorage.getItem('edustika_students_accounts')) {
    const defaultStudents = [
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
          streak: 6,
          quizzes: [
            { id: 'q1', title: 'Trigonometry Formulas', titleBn: 'ত্রিকোণমিতি সূত্রাবলী', score: 3, total: 3, date: '2026-06-28', status: 'EXCELLENT' },
            { id: 'q2', title: 'Calculus - Basics & Limits', titleBn: 'ক্যালকুলাস সীমা পরিচিতি', score: 2, total: 3, date: '2026-07-02', status: 'PASSED' },
            { id: 'q3', title: 'Linear Equations & Graphs', titleBn: 'সরল সমীকরণ ও লেখচিত্র', score: 4, total: 4, date: '2026-07-05', status: 'EXCELLENT' },
            { id: 'q4', title: 'Probability & Distributions', titleBn: 'সম্ভাব্যতা ও বিন্যাস', score: 4, total: 5, date: '2026-07-06', status: 'PASSED' }
          ]
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
  }
  if (!localStorage.getItem('edustika_authorized_admins')) {
    localStorage.setItem('edustika_authorized_admins', JSON.stringify([
      'md.jaidulislam@hotmail.com',
      'edu.mdjaidulislam@gmail.com',
      'rr.mdjaidulislam@gmail.com'
    ]));
  }
};

// Course actions
export const getCourses = (): Course[] => {
  initDatabase();
  const raw = localStorage.getItem('edustika_courses_db');
  return raw ? JSON.parse(raw) : DEFAULT_COURSES;
};

export const saveCourses = (courses: Course[]) => {
  localStorage.setItem('edustika_courses_db', JSON.stringify(courses));
};

export const addCourse = (course: Course) => {
  const courses = getCourses();
  courses.push(course);
  saveCourses(courses);
};

export const removeCourse = (courseId: string) => {
  const courses = getCourses();
  const filtered = courses.filter(c => c.id !== courseId);
  saveCourses(filtered);
};

// Teacher actions
export const getTeachers = (): Teacher[] => {
  initDatabase();
  const raw = localStorage.getItem('edustika_teachers_db');
  return raw ? JSON.parse(raw) : DEFAULT_TEACHERS;
};

export const saveTeachers = (teachers: Teacher[]) => {
  localStorage.setItem('edustika_teachers_db', JSON.stringify(teachers));
};

export const addTeacher = (teacher: Teacher) => {
  const teachers = getTeachers();
  teachers.push(teacher);
  saveTeachers(teachers);
};

export const removeTeacher = (teacherId: string) => {
  const teachers = getTeachers();
  const filtered = teachers.filter(t => t.id !== teacherId);
  saveTeachers(filtered);
};

// Payment actions
export const getPayments = (): PaymentVerification[] => {
  initDatabase();
  const raw = localStorage.getItem('edustika_payments_db');
  return raw ? JSON.parse(raw) : DEFAULT_PAYMENTS;
};

export const savePayments = (payments: PaymentVerification[]) => {
  localStorage.setItem('edustika_payments_db', JSON.stringify(payments));
};

export const addPayment = (payment: PaymentVerification) => {
  const payments = getPayments();
  payments.unshift(payment); // Add new at top
  savePayments(payments);
};

export const updatePaymentStatus = (paymentId: string, status: 'VERIFIED' | 'PENDING' | 'REJECTED') => {
  const payments = getPayments();
  const updated = payments.map(p => {
    if (p.id === paymentId) {
      return { ...p, status };
    }
    return p;
  });
  savePayments(updated);
};
