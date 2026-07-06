import { useState, useEffect } from 'react';
import { Course, View } from '../types';
import { BookOpen, Award, CheckCircle } from 'lucide-react';
import { getCourses } from '../lib/db';

interface CoursesProps {
  setCurrentView: (view: View) => void;
  openBookingModal: (courseTitle?: string) => void;
  language?: 'bn' | 'en';
}

export default function Courses({ setCurrentView, openBookingModal, language = 'bn' }: CoursesProps) {
  const badgeImgUrl = '/src/assets/images/edustika_badge_1783361726712.jpg';
  const [coursesList, setCoursesList] = useState<Course[]>([]);
  const [activeVideoUrl, setActiveVideoUrl] = useState<string | null>(null);
  const [activeVideoTitle, setActiveVideoTitle] = useState<string>('');

  const handlePlayDemoVideo = (url: string, title: string) => {
    setActiveVideoUrl(url);
    setActiveVideoTitle(title);
  };

  const getYouTubeEmbedUrl = (url: string) => {
    if (!url) return '';
    let videoId = '';
    const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|\&v=)([^#\&\?]*).*/;
    const match = url.match(regExp);
    if (match && match[2].length === 11) {
      videoId = match[2];
    } else if (url.trim().length === 11) {
      videoId = url.trim();
    }
    return videoId ? `https://www.youtube.com/embed/${videoId}?autoplay=1` : url;
  };

  // Load from database on mount or when view changes
  useEffect(() => {
    setCoursesList(getCourses());
  }, []);

  return (
    <section className="bg-white py-20 border-b border-[#e9ecef]">
      <div className="max-w-[1280px] mx-auto px-6">
        {/* Section Header */}
        <div className="text-center max-w-[680px] mx-auto mb-16">
          <div className="text-xs font-bold text-[#15803d] tracking-widest uppercase mb-2">
            {language === 'bn' ? 'আমাদের কোর্সসমূহ' : 'OUR COURSES'}
          </div>
          <h2 className="font-display font-black text-[#191c1d] text-3xl sm:text-4xl tracking-tight mb-4">
            {language === 'bn' ? 'আপনার মেধা বিকাশের সেরা সুযোগ' : 'The Best Choice to Unlock Your Potential'}
          </h2>
          <div className="w-16 h-1 bg-[#22c55e] mx-auto mb-6"></div>
          <p className="font-sans text-gray-500 text-sm leading-relaxed">
            {language === 'bn'
              ? 'মেধাবী শিক্ষক ও আধুনিক প্রযুক্তির সহায়তায় আমরা প্রতিটি বিষয় সহজ ও আকর্ষণীয়ভাবে উপস্থাপন করি। আজই আপনার পছন্দের কোর্সে ভর্তি হয়ে আপনার সম্ভাবনাকে বিকশিত করুন।'
              : 'With professional tutors and advanced learning technologies, we present complex topics in a simplified and engaging way. Enroll today to accelerate your learning curve.'}
          </p>
        </div>

        {/* Courses Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {coursesList.map((course) => (
            <div
              key={course.id}
              className="bg-white border border-[#e9ecef] p-8 flex flex-col items-center text-center transition-all duration-300 hover:border-[#15803d] hover:-translate-y-2 group"
            >
              {/* Course Icon Container */}
              <div className="w-24 h-24 mb-6 flex items-center justify-center bg-gray-50 border border-gray-100">
                {course.icon === 'badge' ? (
                  <img
                    src={badgeImgUrl}
                    alt="General Math Badge"
                    className="w-full h-full object-cover"
                    referrerPolicy="no-referrer"
                  />
                ) : course.icon === 'sigma' ? (
                  <div className="font-display font-bold text-5xl text-[#15803d] select-none">
                    Σ
                  </div>
                ) : (
                  // Beaker / Flask representation
                  <div className="text-[#15803d] text-4xl select-none font-sans font-semibold border-2 border-[#15803d] px-4 py-1.5">
                    🧪
                  </div>
                )}
              </div>

              {/* Tag / Class Level */}
              <span className="font-mono text-[10px] font-bold tracking-widest text-[#15803d] uppercase bg-green-50 px-3 py-1 mb-4">
                {course.tag}
              </span>

              {/* Bengali Title & English Title */}
              <h3 className="font-display font-bold text-xl text-gray-900 mb-1">
                {language === 'bn' ? course.bengaliTitle : course.title}
              </h3>
              <h4 className="font-display font-semibold text-xs text-gray-400 uppercase tracking-widest mb-4">
                {language === 'bn' ? course.title : course.bengaliTitle}
              </h4>

              {/* Description */}
              <p className="font-sans text-gray-600 text-sm leading-relaxed mb-6 flex-grow">
                {language === 'bn' ? course.bengaliDescription : course.description}
              </p>

              {/* Price Tag */}
              <div className="font-display font-extrabold text-[#15803d] text-lg border-t border-gray-100 pt-5 w-full mb-6">
                {course.price}
              </div>

              {/* Details List */}
              <div className="text-left w-full space-y-2 mb-8 bg-gray-50 p-4 border border-gray-100 text-xs text-gray-600">
                <div className="flex justify-between">
                  <span className="font-semibold">{language === 'bn' ? 'সময়কাল:' : 'Duration:'}</span>
                  <span>{course.duration}</span>
                </div>
                <div className="flex justify-between">
                  <span className="font-semibold">{language === 'bn' ? 'লেভেল:' : 'Level:'}</span>
                  <span>{course.level}</span>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="w-full space-y-2 mt-auto">
                <button
                  onClick={() => openBookingModal(course.bengaliTitle || course.title)}
                  className="w-full bg-[#f3f4f5] text-[#191c1d] group-hover:bg-[#15803d] group-hover:text-white font-sans text-xs font-bold tracking-widest py-3 border border-[#e9ecef] group-hover:border-[#15803d] transition-all duration-300 active:scale-[0.98] cursor-pointer"
                >
                  {language === 'bn' ? 'ভর্তি হোন (Enroll Now)' : 'Enroll Now'}
                </button>

                {course.demoVideoUrl && (
                  <button
                    onClick={() => handlePlayDemoVideo(course.demoVideoUrl!, course.bengaliTitle || course.title)}
                    className="w-full bg-red-50 text-red-600 hover:bg-red-600 hover:text-white font-sans text-xs font-bold tracking-widest py-2.5 border border-red-100 hover:border-red-600 transition-all duration-300 active:scale-[0.98] cursor-pointer flex items-center justify-center gap-1.5"
                  >
                    <span>🔴</span> {language === 'bn' ? 'ফ্রি ডেমো ক্লাস ভিডিও' : 'Free Demo Class Video'}
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>

        {/* Bottom Banner */}
        <div className="mt-16 text-center">
          <button
            onClick={() => setCurrentView(View.CLASSROOM)}
            className="inline-flex items-center gap-2 border-2 border-[#15803d] text-[#15803d] hover:bg-green-50 font-sans text-xs font-bold tracking-widest px-8 py-4 transition-all duration-200 cursor-pointer"
          >
            {language === 'bn' ? 'ভার্চুয়াল ডেমো ক্লাস দেখুন' : 'View Virtual Demo Class'}
          </button>
        </div>
      </div>

      {/* Video Player Modal */}
      {activeVideoUrl && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-xs p-4">
          <div className="bg-white w-full max-w-[800px] border-2 border-[#15803d] relative">
            <button
              onClick={() => setActiveVideoUrl(null)}
              className="absolute -top-10 right-0 text-white hover:text-red-400 transition-colors cursor-pointer font-bold flex items-center gap-1"
            >
              <span>{language === 'bn' ? 'বন্ধ করুন [X]' : 'CLOSE [X]'}</span>
            </button>
            <div className="p-4 bg-slate-900 text-white font-display font-bold text-sm border-b border-gray-800">
              🎥 {activeVideoTitle} - {language === 'bn' ? 'ডেমো ক্লাস ভিডিও' : 'Demo Class Video'}
            </div>
            <div className="aspect-video w-full bg-black">
              <iframe
                src={getYouTubeEmbedUrl(activeVideoUrl)}
                title={activeVideoTitle}
                className="w-full h-full"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              ></iframe>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}
