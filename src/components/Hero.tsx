import { View } from '../types';
import { ArrowRight, Sparkles } from 'lucide-react';
import Logo from './Logo';

interface HeroProps {
  setCurrentView: (view: View) => void;
  openBookingModal: () => void;
  language: 'bn' | 'en';
}

export default function Hero({ setCurrentView, openBookingModal, language }: HeroProps) {
  // Use the generated high-quality hero image
  const heroImgUrl = '/src/assets/images/edustika_hero_1783361708752.jpg';

  return (
    <section className="relative bg-black min-h-[580px] flex items-center overflow-hidden">
      {/* Background Image with Dark Gradient Overlay */}
      <div className="absolute inset-0 z-0">
        <img
          src={heroImgUrl}
          alt="Tutoring Session"
          className="w-full h-full object-cover object-center opacity-45"
          referrerPolicy="no-referrer"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-black via-black/80 to-transparent z-10" />
      </div>

      {/* Floating Glowing Mathematical Symbols Overlay */}
      <div className="absolute inset-0 z-10 pointer-events-none select-none opacity-40">
        <div className="absolute top-[15%] left-[10%] text-[#22c55e] text-3xl font-serif blur-[0.5px] animate-pulse">
          {"f(x) = dy/dx"}
        </div>
        <div className="absolute top-[50%] left-[25%] text-[#22c55e] text-2xl font-serif blur-[0.5px]">
          {"d = \u221a(1 + r\u00b2)"}
        </div>
        <div className="absolute bottom-[20%] left-[15%] text-white text-3xl font-serif opacity-30">
          {"\u222b(3x\u00b2/a)dx"}
        </div>
        <div className="absolute top-[25%] right-[20%] text-[#22c55e]/80 text-4xl font-serif blur-[0.8px] animate-pulse">
          {"\u221a(k - x\u00b2)"}
        </div>
        <div className="absolute bottom-[35%] right-[30%] text-white text-2xl font-mono">
          {"x\u00b2 + y\u00b2 = r\u00b2"}
        </div>
      </div>

      {/* Hero Content */}
      <div className="relative z-20 max-w-[1280px] w-full mx-auto px-6 py-16 text-left">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          {/* Left Text Block */}
          <div className="lg:col-span-7">
            {/* Tagline Badge */}
            <div className="inline-flex items-center gap-2 bg-[#15803d] border border-green-400 text-white font-mono text-[11px] tracking-widest px-3 py-1 uppercase mb-6">
              <Sparkles className="w-3.5 h-3.5 text-[#22c55e]" />
              {language === 'bn' ? 'ব্যক্তিগত অনলাইন শিক্ষা সেবা' : 'PERSONALIZED ONLINE TUTORING'}
            </div>

            {/* Main Titles */}
            <h1 className="font-display font-extrabold text-white text-5xl sm:text-6xl tracking-tight leading-tight mb-2">
              EDUSTIKA
            </h1>
            <h2 className="font-display font-bold text-[#22c55e] text-3xl sm:text-4xl tracking-wide mb-6">
              {language === 'bn' ? 'প্রিমিয়াম ম্যাথ কেয়ার' : 'PREMIUM MATH CARE'}
            </h2>

            {/* Description */}
            <p className="font-sans text-gray-300 text-base sm:text-lg leading-relaxed mb-10 max-w-[540px]">
              {language === 'bn' 
                ? 'আপনার সন্তানের শিক্ষার সঠিক দিশারী। আমরা প্রদান করি আধুনিক এবং কার্যকর অনলাইন টিউশনি সেবা। এডুস্টিকার সাথে গাণিতিক জটিলতা জয় করুন এবং সর্বোচ্চ ফলাফল অর্জন করুন।'
                : 'The ultimate learning platform for your child. We provide modern, highly interactive, and result-oriented online tutoring services. Conquer mathematical complexities and achieve top academic excellence.'}
            </p>

            {/* CTAs */}
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-4">
              <button
                onClick={openBookingModal}
                className="bg-[#15803d] text-white hover:bg-black font-sans text-sm font-bold tracking-widest px-8 py-4 transition-all duration-300 border-2 border-[#15803d] text-center active:scale-[0.98] cursor-pointer shadow-md"
              >
                {language === 'bn' ? 'ভর্তি হোন (ফ্রি ডেমো)' : 'Enroll Now (Free Demo)'}
              </button>
              <button
                onClick={() => setCurrentView(View.CLASSROOM)}
                className="bg-transparent text-white hover:bg-white/10 font-sans text-sm font-semibold tracking-wider px-8 py-4 transition-all border border-white/30 text-center flex items-center justify-center gap-2 cursor-pointer"
              >
                {language === 'bn' ? 'ভার্চুয়াল ক্লাস দেখুন' : 'View Virtual Class'}
                <ArrowRight className="w-4 h-4 text-[#22c55e]" />
              </button>
            </div>
          </div>

          {/* Right Logo Block - Visible on Large Screens */}
          <div className="hidden lg:block lg:col-span-5">
            <div className="bg-white/95 backdrop-blur-md p-8 border-4 border-[#15803d] shadow-2xl relative overflow-hidden group">
              {/* Decorative math equation on background */}
              <div className="absolute -right-8 -bottom-8 text-green-100 font-serif text-8xl select-none opacity-20 pointer-events-none font-black">
                {"π"}
              </div>
              <Logo variant="full" className="bg-transparent" />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
