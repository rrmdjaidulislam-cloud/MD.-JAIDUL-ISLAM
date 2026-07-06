export enum View {
  HOME = 'HOME',
  COURSES = 'COURSES',
  ABOUT = 'ABOUT',
  TUTOR_JAHID = 'TUTOR_JAHID',
  CLASSROOM = 'CLASSROOM',
  CONTACT = 'CONTACT',
  DASHBOARD = 'DASHBOARD',
  PAYMENT = 'PAYMENT',
  ADMIN = 'ADMIN',
}

export interface Course {
  id: string;
  title: string;
  bengaliTitle: string;
  description: string;
  bengaliDescription: string;
  icon: string; // Icon name from lucide-react
  tag: string;
  price: string;
  duration: string;
  level: string;
  demoVideoUrl?: string;
}

export interface Message {
  id: string;
  sender: 'student' | 'tutor' | 'ai';
  text: string;
  timestamp: string;
}

export interface QuizQuestion {
  id: string;
  question: string;
  options: string[];
  correctAnswer: number;
  explanation: string;
}
