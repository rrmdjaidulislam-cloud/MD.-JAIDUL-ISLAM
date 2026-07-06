import React, { useState } from 'react';
import { Send, CheckCircle } from 'lucide-react';

export default function Newsletter() {
  const [email, setEmail] = useState<string>('');
  const [subscribed, setSubscribed] = useState<boolean>(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim()) return;
    setSubscribed(true);
    setTimeout(() => {
      setSubscribed(false);
      setEmail('');
    }, 5000);
  };

  return (
    <section className="bg-white py-12 px-6">
      <div className="max-w-[1280px] mx-auto">
        <div className="bg-[#fcd400] p-10 sm:p-12 text-center border-2 border-[#fcd400] relative overflow-hidden">
          {/* Subtle math backdrop overlay */}
          <div className="absolute inset-0 pointer-events-none opacity-5 select-none font-serif text-3xl font-bold flex flex-wrap justify-around items-center">
            <span>∑</span>
            <span>√x</span>
            <span>π</span>
            <span>∫</span>
            <span>x²</span>
          </div>

          <div className="relative z-10 max-w-[620px] mx-auto">
            <h2 className="font-display font-black text-[#191c1d] text-2xl sm:text-3xl mb-3">
              আমাদের সাথে যুক্ত থাকুন
            </h2>
            <p className="font-sans text-[#6e5c00] font-bold text-sm sm:text-base mb-8 leading-relaxed">
              নতুন ব্যাচের আপডেট পেতে আপনার ইমেইল দিয়ে রেজিস্টার করুন।
            </p>

            {subscribed ? (
              <div className="flex flex-col sm:flex-row items-center justify-center gap-3 bg-white p-6 border border-gray-100 animate-fadeIn">
                <CheckCircle className="w-5 h-5 text-green-600" />
                <span className="font-sans text-xs font-bold text-gray-800 uppercase tracking-wider">
                  ধন্যবাদ! আপনি সফলভাবে সাবস্ক্রাইব করেছেন।
                </span>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-2 max-w-[500px] mx-auto">
                <input
                  type="email"
                  required
                  placeholder="আপনার ইমেইল"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="flex-grow bg-white border border-transparent px-5 py-4 text-sm outline-none font-sans text-gray-800 placeholder-gray-400 focus:border-[#214fc7]"
                />
                <button
                  type="submit"
                  className="bg-[#214fc7] text-white hover:bg-black font-sans text-xs font-black tracking-widest px-8 py-4 uppercase transition-all duration-300 active:scale-[0.98] cursor-pointer"
                >
                  সাবস্ক্রাইব
                </button>
              </form>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
