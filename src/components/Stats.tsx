import { Users, BookOpen, HeartHandshake, PhoneCall } from 'lucide-react';

interface StatsProps {
  language?: 'bn' | 'en';
}

export default function Stats({ language = 'bn' }: StatsProps) {
  const statsList = [
    {
      number: '৫০০+',
      label: 'সফল শিক্ষার্থী',
      numberEn: '500+',
      labelEn: 'Successful Students',
      color: 'text-[#15803d]',
      icon: Users,
    },
    {
      number: '৫০+',
      label: 'অভিজ্ঞ শিক্ষক',
      numberEn: '50+',
      labelEn: 'Experienced Teachers',
      color: 'text-gray-900',
      icon: BookOpen,
    },
    {
      number: '৯৮%',
      label: 'সন্তুষ্টির হার',
      numberEn: '98%',
      labelEn: 'Satisfaction Rate',
      color: 'text-[#15803d]',
      icon: HeartHandshake,
    },
    {
      number: '২৪/৭',
      label: 'সাপোর্ট',
      numberEn: '24/7',
      labelEn: 'Live Support',
      color: 'text-gray-900',
      icon: PhoneCall,
    },
  ];

  return (
    <div className="bg-[#f3f4f5] border-y border-[#e9ecef] py-12">
      <div className="max-w-[1280px] mx-auto px-6">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
          {statsList.map((stat, i) => {
            const IconComponent = stat.icon;
            return (
              <div
                key={i}
                className="flex flex-col items-center justify-center text-center p-6 bg-white border border-[#e9ecef] shadow-2xs hover:shadow-sm transition-all"
              >
                <div className="mb-3 p-2.5 bg-green-50 border border-green-100">
                  <IconComponent className="w-6 h-6 text-[#15803d]" />
                </div>
                <div className={`font-display font-black text-3xl sm:text-4xl ${stat.color} tracking-tight leading-none mb-2`}>
                  {language === 'bn' ? stat.number : stat.numberEn}
                </div>
                <div className="font-sans font-bold text-gray-900 text-sm">
                  {language === 'bn' ? stat.label : stat.labelEn}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
