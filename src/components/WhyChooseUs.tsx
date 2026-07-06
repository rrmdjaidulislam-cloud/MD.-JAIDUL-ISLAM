import { CheckSquare, ArrowRight } from 'lucide-react';

interface WhyChooseUsProps {
  openBookingModal: () => void;
  language?: 'bn' | 'en';
}

export default function WhyChooseUs({ openBookingModal, language = 'bn' }: WhyChooseUsProps) {
  // Use the generated laptop mockup image
  const mockupImgUrl = '/src/assets/images/edustika_laptop_mockup_1783361748156.jpg';

  const reasons = [
    {
      title: language === 'bn' ? 'লাইভ ইন্টারাক্টিভ ক্লাস' : 'Live Interactive Classes',
      description: language === 'bn' 
        ? 'সরাসরি শিক্ষকের সাথে কথা বলে সমাধান বুঝে নিন। কোনো কনফিউশন থাকবে না।'
        : 'Get direct live feedback from your mentor during class. Zero confusion.',
    },
    {
      title: language === 'bn' ? 'রেকর্ড করা লেকচার' : 'Recorded Video Archives',
      description: language === 'bn'
        ? 'যেকোনো সময় যেকোনো জায়গা থেকে পুনরায় ক্লাস দেখার আনলিমিটেড সুযোগ।'
        : 'Unlimited access to review completed classes anytime, anywhere.',
    },
    {
      title: language === 'bn' ? 'নিয়মিত পরীক্ষা ও ফিডব্যাক' : 'Weekly Tests & Assessment',
      description: language === 'bn'
        ? 'আপনার অগ্রগতি সঠিকভাবে যাচাই করতে সাপ্তাহিক মক টেস্ট এবং অভিভাবক ফিডব্যাক।'
        : 'Regular mock exams and constructive tutor feedbacks to track continuous progress.',
    },
  ];

  return (
    <section className="bg-[#f3f4f5] py-20 border-b border-[#e9ecef]">
      <div className="max-w-[1280px] mx-auto px-6">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          
          {/* Left Panel: Stylized computer mockup with colored solid frame behind it */}
          <div className="relative">
            {/* Solid primary background offset frame */}
            <div className="absolute -inset-4 border-4 border-[#15803d] -rotate-2 transform translate-x-2 translate-y-2 z-0"></div>
            
            {/* High quality generated screen image */}
            <div className="relative z-10 border-4 border-white bg-white shadow-lg overflow-hidden">
              <img
                src={mockupImgUrl}
                alt="Edustika Virtual Study Monitor"
                className="w-full h-auto object-cover"
                referrerPolicy="no-referrer"
              />
            </div>
          </div>

          {/* Right Panel: Checklists */}
          <div className="text-left">
            <h2 className="font-display font-black text-[#15803d] text-3xl sm:text-4xl tracking-tight mb-8">
              {language === 'bn' ? 'কেন Edustika সেরা?' : 'Why Choose Edustika?'}
            </h2>

            {/* Checklist Items */}
            <div className="space-y-6 mb-10">
              {reasons.map((reason, idx) => (
                <div key={idx} className="flex items-start gap-4">
                  <div className="mt-1 flex-shrink-0">
                    <CheckSquare className="w-5 h-5 text-[#15803d]" />
                  </div>
                  <div>
                    <h3 className="font-display font-bold text-gray-900 text-base mb-1">
                      {reason.title}
                    </h3>
                    <p className="font-sans text-gray-600 text-sm leading-relaxed">
                      {reason.description}
                    </p>
                  </div>
                </div>
              ))}
            </div>

            {/* CTA Button */}
            <button
              onClick={openBookingModal}
              className="inline-flex items-center gap-2 bg-[#15803d] text-white hover:bg-black font-sans text-xs font-bold tracking-widest px-8 py-4 transition-all duration-300 cursor-pointer"
            >
              {language === 'bn' ? 'আরও জানুন (LEARN MORE)' : 'LEARN MORE'}
              <ArrowRight className="w-4 h-4 text-green-300" />
            </button>
          </div>

        </div>
      </div>
    </section>
  );
}
