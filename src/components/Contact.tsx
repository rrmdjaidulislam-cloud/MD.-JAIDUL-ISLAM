import React, { useState } from 'react';
import { Mail, Phone, MapPin, Send, CheckCircle } from 'lucide-react';

export default function Contact() {
  const [formSubmitted, setFormSubmitted] = useState<boolean>(false);
  const [name, setName] = useState<string>('');
  const [email, setEmail] = useState<string>('');
  const [subject, setSubject] = useState<string>('General Math');
  const [message, setMessage] = useState<string>('');

  const handleContactSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !email || !message) return;
    setFormSubmitted(true);
    setTimeout(() => {
      setFormSubmitted(false);
      setName('');
      setEmail('');
      setMessage('');
    }, 5000);
  };

  return (
    <section className="bg-white py-20 border-b border-gray-200">
      <div className="max-w-[1280px] mx-auto px-6">
        
        {/* Section Header */}
        <div className="text-center max-w-[680px] mx-auto mb-16">
          <div className="text-xs font-bold text-[#214fc7] tracking-widest uppercase mb-2">
            যোগাযোগ করুন (CONTACT US)
          </div>
          <h2 className="font-display font-black text-[#191c1d] text-3xl sm:text-4xl tracking-tight mb-4">
            আমরা সব সময় সাহায্য করতে প্রস্তুত
          </h2>
          <div className="w-16 h-1 bg-[#fcd400] mx-auto mb-6"></div>
          <p className="font-sans text-gray-500 text-sm">
            আপনার যেকোনো প্রশ্ন, জিজ্ঞাসা বা মতামতের জন্য নিচের ফর্মটি পূরণ করুন অথবা সরাসরি হটলাইনে কল করুন।
          </p>
        </div>

        {/* Contact Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
          
          {/* Left Panel: Contact Info */}
          <div className="lg:col-span-5 bg-[#f8f9fa] border border-[#e9ecef] p-8 space-y-8 text-left">
            <div>
              <h3 className="font-display font-bold text-gray-900 text-lg mb-2">
                এডুস্টিকা সেন্টার
              </h3>
              <p className="font-sans text-gray-500 text-xs leading-relaxed">
                আমাদের ধানমন্ডি ব্রাঞ্চে স্বশরীরে এসেও আমাদের শিক্ষক ও মেন্টরদের সাথে সরাসরি দেখা করতে পারেন।
              </p>
            </div>

            <div className="space-y-6">
              {/* Address */}
              <div className="flex gap-4">
                <div className="p-3 bg-white border border-[#e9ecef] text-[#214fc7] h-fit">
                  <MapPin className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="font-display font-bold text-gray-900 text-xs uppercase tracking-wider mb-1">ঠিকানা (Address)</h4>
                  <p className="font-sans text-gray-600 text-xs">১৬/এ, রোড নং ৮, ধানমন্ডি, ঢাকা-১২০৯, বাংলাদেশ</p>
                </div>
              </div>

              {/* Email */}
              <div className="flex gap-4">
                <div className="p-3 bg-white border border-[#e9ecef] text-[#214fc7] h-fit">
                  <Mail className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="font-display font-bold text-gray-900 text-xs uppercase tracking-wider mb-1">ইমেইল (Email)</h4>
                  <p className="font-sans text-gray-600 text-xs">rr.mdjaidulislam@gmail.com</p>
                </div>
              </div>

              {/* Phone */}
              <div className="flex gap-4">
                <div className="p-3 bg-white border border-[#e9ecef] text-[#214fc7] h-fit">
                  <Phone className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="font-display font-bold text-gray-900 text-xs uppercase tracking-wider mb-1">হটলাইন (Hotline)</h4>
                  <p className="font-sans text-gray-600 text-xs">+৮৮০১৭৫২-৩৪৫৬৭৮ (সকাল ৯ টা - রাত ১০ টা)</p>
                </div>
              </div>
            </div>

            {/* Simulated Live status */}
            <div className="border-t border-gray-200 pt-6">
              <span className="inline-flex items-center gap-2 text-[10px] font-bold text-green-600 bg-green-50 px-3 py-1 border border-green-200 uppercase tracking-widest">
                <span className="w-1.5 h-1.5 bg-green-500 rounded-full animate-pulse"></span>
                ম্যানেজার অনলাইনে আছেন
              </span>
            </div>
          </div>

          {/* Right Panel: Contact Form */}
          <div className="lg:col-span-7 bg-[#f8f9fa] border border-[#e9ecef] p-8 text-left">
            {formSubmitted ? (
              <div className="flex flex-col items-center justify-center text-center py-12 bg-white border border-green-200">
                <CheckCircle className="w-12 h-12 text-green-500 mb-4" />
                <h3 className="font-display font-black text-green-800 text-xl mb-1">বার্তাটি পাঠানো হয়েছে!</h3>
                <p className="font-sans text-gray-600 text-xs max-w-[420px] leading-relaxed">
                  আপনার বার্তাটির জন্য ধন্যবাদ। আমাদের কাস্টমার রিলেশন টিম আগামী ২৪ ঘণ্টার মধ্যে আপনার সাথে যোগাযোগ করবে।
                </p>
              </div>
            ) : (
              <form onSubmit={handleContactSubmit} className="space-y-6">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block font-sans text-[10px] font-bold text-gray-500 uppercase tracking-widest mb-1.5">
                      আপনার নাম
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="যেমন: সাকিব চৌধুরী"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      className="w-full bg-white border border-[#e9ecef] px-4 py-2.5 text-xs outline-none focus:border-[#214fc7] font-sans"
                    />
                  </div>
                  <div>
                    <label className="block font-sans text-[10px] font-bold text-gray-500 uppercase tracking-widest mb-1.5">
                      আপনার ইমেইল
                    </label>
                    <input
                      type="email"
                      required
                      placeholder="যেমন: sakib@domain.com"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="w-full bg-white border border-[#e9ecef] px-4 py-2.5 text-xs outline-none focus:border-[#214fc7] font-sans"
                    />
                  </div>
                </div>

                <div>
                  <label className="block font-sans text-[10px] font-bold text-gray-500 uppercase tracking-widest mb-1.5">
                    আগ্রহের বিষয়
                  </label>
                  <select
                    value={subject}
                    onChange={(e) => setSubject(e.target.value)}
                    className="w-full bg-white border border-[#e9ecef] px-4 py-2.5 text-xs outline-none focus:border-[#214fc7] font-sans"
                  >
                    <option value="General Math">সাধারণ গণিত (General Math)</option>
                    <option value="Higher Math">উচ্চতর গণিত (Higher Math)</option>
                    <option value="Physics">পদার্থবিজ্ঞান (Physics)</option>
                    <option value="Other">অন্যান্য জিজ্ঞাসা (Other Inquiries)</option>
                  </select>
                </div>

                <div>
                  <label className="block font-sans text-[10px] font-bold text-gray-500 uppercase tracking-widest mb-1.5">
                    বার্তা (Message)
                  </label>
                  <textarea
                    required
                    rows={5}
                    placeholder="আপনার প্রশ্ন বা জিজ্ঞাসাটি বিস্তারিত লিখুন..."
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    className="w-full bg-white border border-[#e9ecef] px-4 py-2.5 text-xs outline-none focus:border-[#214fc7] font-sans resize-none"
                  />
                </div>

                <button
                  type="submit"
                  className="w-full bg-[#214fc7] text-white hover:bg-black font-sans text-xs font-bold tracking-widest py-3.5 border border-[#214fc7] hover:border-black transition-all duration-300 active:scale-[0.98] cursor-pointer flex items-center justify-center gap-2"
                >
                  <Send className="w-3.5 h-3.5 text-[#fcd400]" />
                  বার্তা পাঠান (SEND MESSAGE)
                </button>
              </form>
            )}
          </div>

        </div>

      </div>
    </section>
  );
}
