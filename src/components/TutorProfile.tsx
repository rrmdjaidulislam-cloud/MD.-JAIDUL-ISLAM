import React, { useState } from 'react';
import { Award, GraduationCap, Calendar, Sparkles, CheckCircle, MessageSquare, Heart } from 'lucide-react';

interface TutorProfileProps {
  openBookingModal: (course?: string) => void;
  language?: 'bn' | 'en';
}

export default function TutorProfile({ openBookingModal, language = 'bn' }: TutorProfileProps) {
  const [activeTab, setActiveTab] = useState<'bio' | 'specialties' | 'schedule'>('bio');
  const [selectedDay, setSelectedDay] = useState<string>('Monday');
  const [selectedSlot, setSelectedSlot] = useState<string>('');
  const [bookingSuccess, setBookingSuccess] = useState<boolean>(false);
  const [studentName, setStudentName] = useState<string>('');
  const [studentContact, setStudentContact] = useState<string>('');

  const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Saturday', 'Sunday'];
  const slotsByDay: Record<string, string[]> = {
    Monday: ['04:00 PM - 05:00 PM', '06:00 PM - 07:00 PM', '08:30 PM - 09:30 PM'],
    Tuesday: ['05:00 PM - 06:00 PM', '07:30 PM - 08:30 PM'],
    Wednesday: ['04:00 PM - 05:00 PM', '06:00 PM - 07:00 PM', '08:30 PM - 09:30 PM'],
    Thursday: ['05:00 PM - 06:00 PM', '07:30 PM - 08:30 PM'],
    Saturday: ['10:00 AM - 11:30 AM', '02:00 PM - 03:30 PM', '06:00 PM - 07:30 PM'],
    Sunday: ['10:00 AM - 11:30 AM', '04:00 PM - 05:30 PM', '08:00 PM - 09:30 PM'],
  };

  const reviews = [
    {
      student: 'তাসনিম আহমেদ (ক্যান্টনমেন্ট পাবলিক)',
      reviewBn: 'জাহিদ ভাইয়ের পড়ানোর কৌশল আসলেই অসামান্য। বিশেষ করে ক্যালকুলাসের কঠিন বিষয়গুলো এত সহজে মাথায় ঢুকবে ভাবতেই পারিনি!',
      reviewEn: 'Bhai\'s teaching methods are truly spectacular. Specially his way of breaking down calculus made it extremely easy.',
      rating: '⭐⭐⭐⭐⭐',
      relation: 'ক্লাস ১০ এর শিক্ষার্থী',
    },
    {
      student: 'মোহাম্মদ আলী (অভিভাবক)',
      reviewBn: 'আমার ছেলে গণিতে সবসময় দুর্বল ছিল। এডুস্টিকায় জাহিদ স্যারের কাছে পড়ার পর ওর ভয় কেটে গেছে এবং শেষ পরীক্ষায় জিপিএ ৫ পেয়েছে।',
      reviewEn: 'My son was always weak in math. After starting with Tutor Jahid at Edustika, his fear is gone and he scored GPA-5.',
      rating: '⭐⭐⭐⭐⭐',
      relation: 'অভিভাবক',
    },
  ];

  const handleBookingSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!studentName || !studentContact || !selectedSlot) return;
    setBookingSuccess(true);
    setTimeout(() => {
      setBookingSuccess(false);
      setStudentName('');
      setStudentContact('');
      setSelectedSlot('');
    }, 5000);
  };

  return (
    <section className="bg-white py-20 border-b border-[#e9ecef]">
      <div className="max-w-[1280px] mx-auto px-6">
        
        {/* Section Header */}
        <div className="text-center max-w-[680px] mx-auto mb-16">
          <div className="text-xs font-bold text-[#214fc7] tracking-widest uppercase mb-2">
            আমাদের তারকা শিক্ষক (OUR STAR INSTRUCTOR)
          </div>
          <h2 className="font-display font-black text-[#191c1d] text-3xl sm:text-4xl tracking-tight mb-4">
            পরিচিত হোন টিউটর জাহিদ এর সাথে
          </h2>
          <div className="w-16 h-1 bg-[#fcd400] mx-auto mb-6"></div>
          <p className="font-sans text-gray-500 text-sm">
            বুয়েট এবং ঢাকা বিশ্ববিদ্যালয়ের তুখোড় শিক্ষক মণ্ডলী দিয়ে গঠিত আমাদের টিম। গণিতের ভীতি কাটিয়ে তোলার দায়িত্ব আমাদের।
          </p>
        </div>

        {/* Profile Card Breakdown */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
          
          {/* Left Panel: Tutor Hero Graphic / Avatar */}
          <div className="lg:col-span-5 bg-[#f3f4f5] border border-[#e9ecef] p-8 text-center">
            {/* Minimalist Professional Tutor Avatar Illustration */}
            <div className="w-48 h-48 mx-auto bg-gradient-to-tr from-[#214fc7] to-[#4169e1] border-4 border-white flex items-center justify-center text-white text-7xl font-display font-black mb-6 shadow-sm select-none">
              J
            </div>
            
            <h3 className="font-display font-black text-2xl text-gray-900 mb-1">
              মোঃ জাহিদুল ইসলাম (টিউটর জাহিদ)
            </h3>
            <p className="font-sans text-[#214fc7] text-xs font-bold tracking-wider uppercase mb-4">
              Senior Mathematics Mentor, Edustika
            </p>

            <div className="flex justify-center gap-2 mb-6">
              <span className="bg-white border border-[#e9ecef] font-mono text-[10px] px-3 py-1 font-bold">
                B.Sc. in Mathematics (DU)
              </span>
              <span className="bg-white border border-[#e9ecef] font-mono text-[10px] px-3 py-1 font-bold">
                5+ Years Exp
              </span>
            </div>

            <p className="font-sans text-gray-600 text-sm leading-relaxed mb-6">
              &ldquo;গণিত কোনো মুখস্থ করার বিষয় নয়, এটি একটি শিল্প ও চমৎকার যুক্তি। আমি শিক্ষার্থীদের গণিতের মাঝে সৌন্দর্য খুঁজে পেতে সহায়তা করি।&rdquo;
            </p>

            {/* Quick stats grid */}
            <div className="grid grid-cols-2 gap-4 border-t border-gray-200 pt-6">
              <div className="text-center">
                <div className="font-display font-extrabold text-xl text-[#214fc7]">১০০০+ ঘন্টা</div>
                <div className="text-[10px] text-gray-500 font-semibold uppercase">অনলাইন ক্লাস</div>
              </div>
              <div className="text-center">
                <div className="font-display font-extrabold text-xl text-[#705d00]">৯৯%</div>
                <div className="text-[10px] text-gray-500 font-semibold uppercase">সফল গ্রেড বৃদ্ধি</div>
              </div>
            </div>
          </div>

          {/* Right Panel: Academic Specialties & Custom Booking Calendar */}
          <div className="lg:col-span-7 space-y-8 text-left">
            
            {/* Tabs */}
            <div className="flex border-b border-[#e9ecef]">
              <button
                onClick={() => setActiveTab('bio')}
                className={`flex-1 py-4 text-xs font-bold tracking-wider border-b-2 uppercase transition-all cursor-pointer ${
                  activeTab === 'bio'
                    ? 'border-[#214fc7] text-[#214fc7]'
                    : 'border-transparent text-gray-500 hover:text-gray-900'
                }`}
              >
                যোগ্যতা ও অভিজ্ঞতা (Bio)
              </button>
              <button
                onClick={() => setActiveTab('specialties')}
                className={`flex-1 py-4 text-xs font-bold tracking-wider border-b-2 uppercase transition-all cursor-pointer ${
                  activeTab === 'specialties'
                    ? 'border-[#214fc7] text-[#214fc7]'
                    : 'border-transparent text-gray-500 hover:text-gray-900'
                }`}
              >
                স্পেশাল স্কিলসমূহ (Specialties)
              </button>
              <button
                onClick={() => setActiveTab('schedule')}
                className={`flex-1 py-4 text-xs font-bold tracking-wider border-b-2 uppercase transition-all cursor-pointer ${
                  activeTab === 'schedule'
                    ? 'border-[#214fc7] text-[#214fc7]'
                    : 'border-transparent text-gray-500 hover:text-gray-900'
                }`}
              >
                ফ্রি ডেমো স্লট বুকিং (Schedule)
              </button>
            </div>

            {/* Tab content */}
            <div className="bg-[#f8f9fa] border border-[#e9ecef] p-8 min-h-[300px]">
              
              {/* Bio Tab */}
              {activeTab === 'bio' && (
                <div className="space-y-6">
                  <div className="flex gap-4">
                    <div className="p-2.5 bg-white border border-[#e9ecef] h-fit">
                      <GraduationCap className="w-5 h-5 text-[#214fc7]" />
                    </div>
                    <div>
                      <h4 className="font-display font-bold text-gray-900 text-sm mb-1">শিক্ষাগত যোগ্যতা</h4>
                      <p className="font-sans text-gray-600 text-sm">ঢাকা বিশ্ববিদ্যালয় (Department of Mathematics) থেকে ফার্স্ট ক্লাস নিয়ে বি.এসসি ও এম.এসসি সম্পন্ন করেছেন।</p>
                    </div>
                  </div>

                  <div className="flex gap-4">
                    <div className="p-2.5 bg-white border border-[#e9ecef] h-fit">
                      <Award className="w-5 h-5 text-[#705d00]" />
                    </div>
                    <div>
                      <h4 className="font-display font-bold text-gray-900 text-sm mb-1">অসাধারণ অর্জনসমূহ</h4>
                      <p className="font-sans text-gray-600 text-sm">জাতীয় গণিত অলিম্পিয়াড মেন্টর এবং খ্যাতনামা স্কুলগুলোতে ৫ বছরেরও বেশি সময় ধরে অফলাইন ও অনলাইন শিক্ষকতা।</p>
                    </div>
                  </div>

                  <div className="flex gap-4">
                    <div className="p-2.5 bg-white border border-[#e9ecef] h-fit">
                      <Sparkles className="w-5 h-5 text-[#214fc7]" />
                    </div>
                    <div>
                      <h4 className="font-display font-bold text-gray-900 text-sm mb-1">টিচিং মেথডোলজি</h4>
                      <p className="font-sans text-gray-600 text-sm">ডিজিটাল ও পেন-ট্যাবলেট ভিত্তিক লাইভ হোয়াইটবোর্ড সেশন, ভিজ্যুয়াল উদাহরণ, এবং রিয়েল-টাইম এআই সলভার টুলের ব্যবহার।</p>
                    </div>
                  </div>
                </div>
              )}

              {/* Specialties Tab */}
              {activeTab === 'specialties' && (
                <div className="space-y-4">
                  <p className="font-sans text-gray-600 text-sm mb-6">টিউটর জাহিদ বিশেষ ভাবে নিচের বিষয়গুলোতে অত্যন্ত দক্ষ:</p>
                  
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="bg-white border border-[#e9ecef] p-4 flex items-center gap-3">
                      <div className="w-3 h-3 bg-[#214fc7]"></div>
                      <span className="font-sans font-bold text-gray-800 text-xs uppercase tracking-wide">বীজগণিত ও পাটিগণিত (Algebra)</span>
                    </div>
                    <div className="bg-white border border-[#e9ecef] p-4 flex items-center gap-3">
                      <div className="w-3 h-3 bg-[#705d00]"></div>
                      <span className="font-sans font-bold text-gray-800 text-xs uppercase tracking-wide">ক্যালকুলাস ও ফাংশন (Calculus)</span>
                    </div>
                    <div className="bg-white border border-[#e9ecef] p-4 flex items-center gap-3">
                      <div className="w-3 h-3 bg-[#214fc7]"></div>
                      <span className="font-sans font-bold text-gray-800 text-xs uppercase tracking-wide">ত্রিকোণমিতি (Trigonometry)</span>
                    </div>
                    <div className="bg-white border border-[#e9ecef] p-4 flex items-center gap-3">
                      <div className="w-3 h-3 bg-[#705d00]"></div>
                      <span className="font-sans font-bold text-gray-800 text-xs uppercase tracking-wide">জ্যামিতি ও স্থানাঙ্ক (Geometry)</span>
                    </div>
                  </div>

                  <div className="mt-8 bg-[#214fc7]/5 border border-[#214fc7]/10 p-4">
                    <span className="font-sans font-semibold text-[#214fc7] text-xs">⭐ বিশেষ অলিম্পিয়াড ক্লাস:</span>
                    <p className="font-sans text-gray-600 text-xs mt-1">কঠিন গণিত অলিম্পিয়াডের সমস্যা সমাধানের জটিল টেকনিকগুলো সহজে আয়ত্ত করানোর জন্য প্রতি সপ্তাহে বিশেষ মেন্টরিং ক্লাস নেওয়া হয়।</p>
                  </div>
                </div>
              )}

              {/* Schedule Tab */}
              {activeTab === 'schedule' && (
                <div>
                  {bookingSuccess ? (
                    <div className="flex flex-col items-center justify-center text-center p-8 bg-white border border-green-200">
                      <CheckCircle className="w-12 h-12 text-green-500 mb-4" />
                      <h4 className="font-display font-black text-green-800 text-xl mb-2">সফল বুকিং!</h4>
                      <p className="font-sans text-gray-600 text-sm max-w-[400px]">
                        আপনার ফ্রি ডেমো স্লটটি বুক করা হয়েছে। আমরা দ্রুত আপনার ফোনে বা ইমেইলে ক্লাসের লিঙ্ক ও ডিটেইলস পাঠিয়ে দেব। ধন্যবাদ!
                      </p>
                    </div>
                  ) : (
                    <form onSubmit={handleBookingSubmit} className="space-y-6">
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <label className="block font-sans text-[10px] font-bold text-gray-500 uppercase tracking-widest mb-1.5">
                            শিক্ষার্থীর নাম
                          </label>
                          <input
                            type="text"
                            required
                            placeholder="যেমন: আরিয়ান আহমেদ"
                            value={studentName}
                            onChange={(e) => setStudentName(e.target.value)}
                            className="w-full bg-white border border-[#e9ecef] px-4 py-2.5 text-sm outline-none focus:border-[#214fc7] font-sans"
                          />
                        </div>
                        <div>
                          <label className="block font-sans text-[10px] font-bold text-gray-500 uppercase tracking-widest mb-1.5">
                            মোবাইল নাম্বার
                          </label>
                          <input
                            type="text"
                            required
                            placeholder="যেমন: 017xxxxxxxx"
                            value={studentContact}
                            onChange={(e) => setStudentContact(e.target.value)}
                            className="w-full bg-white border border-[#e9ecef] px-4 py-2.5 text-sm outline-none focus:border-[#214fc7] font-sans"
                          />
                        </div>
                      </div>

                      {/* Day Select */}
                      <div>
                        <label className="block font-sans text-[10px] font-bold text-gray-500 uppercase tracking-widest mb-2">
                          দিন নির্বাচন করুন
                        </label>
                        <div className="flex flex-wrap gap-2">
                          {days.map((day) => (
                            <button
                              key={day}
                              type="button"
                              onClick={() => {
                                setSelectedDay(day);
                                setSelectedSlot('');
                              }}
                              className={`px-3 py-1.5 font-sans text-xs border cursor-pointer ${
                                selectedDay === day
                                  ? 'bg-[#214fc7] text-white border-[#214fc7]'
                                  : 'bg-white text-gray-600 border-[#e9ecef] hover:border-gray-400'
                              }`}
                            >
                              {day}
                            </button>
                          ))}
                        </div>
                      </div>

                      {/* Time Slot Select */}
                      <div>
                        <label className="block font-sans text-[10px] font-bold text-gray-500 uppercase tracking-widest mb-2">
                          ফ্রি সময় স্লট
                        </label>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                          {slotsByDay[selectedDay].map((slot) => (
                            <button
                              key={slot}
                              type="button"
                              onClick={() => setSelectedSlot(slot)}
                              className={`px-4 py-2.5 font-mono text-xs border text-left flex items-center justify-between cursor-pointer ${
                                selectedSlot === slot
                                  ? 'bg-[#705d00]/10 border-[#705d00] text-[#705d00] font-bold'
                                  : 'bg-white text-gray-600 border-[#e9ecef] hover:border-gray-400'
                              }`}
                            >
                              <span>{slot}</span>
                              {selectedSlot === slot && <span className="text-xs">✔</span>}
                            </button>
                          ))}
                        </div>
                      </div>

                      <button
                        type="submit"
                        className="w-full bg-[#fcd400] text-[#191c1d] hover:bg-[#214fc7] hover:text-white font-sans text-xs font-bold tracking-widest py-3.5 transition-all duration-300 border-2 border-[#fcd400] hover:border-[#214fc7] active:scale-[0.98] cursor-pointer"
                      >
                        ফ্রি ডেমো ক্লাস বুক করুন (BOOK DEMO SLOT)
                      </button>
                    </form>
                  )}
                </div>
              )}

            </div>

            {/* Testimonials nested inside Profile Section */}
            <div className="pt-4">
              <h4 className="font-display font-black text-[#191c1d] text-lg mb-4 flex items-center gap-2">
                <MessageSquare className="w-5 h-5 text-[#214fc7]" />
                শিক্ষার্থী ও অভিভাবকদের মতামত
              </h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {reviews.map((rev, idx) => (
                  <div key={idx} className="bg-[#f8f9fa] border border-[#e9ecef] p-5">
                    <div className="text-amber-500 mb-2">{rev.rating}</div>
                    <p className="font-sans text-gray-700 text-xs italic leading-relaxed mb-4">
                      &ldquo;{rev.reviewBn}&rdquo;
                    </p>
                    <div className="border-t border-gray-200 pt-3">
                      <div className="font-sans font-bold text-gray-900 text-xs">{rev.student}</div>
                      <div className="font-sans text-[10px] text-gray-500 mt-0.5">{rev.relation}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

          </div>

        </div>

      </div>
    </section>
  );
}
