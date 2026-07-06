import { Mail, Phone, ExternalLink } from 'lucide-react';
import Logo from './Logo';

interface FooterProps {
  language?: 'bn' | 'en';
  onOpenPolicy?: (type: 'privacy' | 'terms' | 'help') => void;
}

export default function Footer({ language = 'bn', onOpenPolicy }: FooterProps) {
  return (
    <footer className="bg-[#f8f9fa] border-t border-gray-200 text-left pt-16 pb-8 font-sans">
      <div className="max-w-[1280px] mx-auto px-6">
        
        {/* Footer Columns */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-10 mb-12">
          
          {/* Column 1: Brand Info */}
          <div className="space-y-4">
            <Logo variant="horizontal" iconSize={36} />
            <p className="font-sans text-gray-500 text-xs leading-relaxed max-w-[240px]">
              {language === 'bn' 
                ? 'সেরা অনলাইন লার্নিং প্ল্যাটফর্ম। আপনার সন্তানের গণিত ভীতি দূর করে একটি সফল ও উজ্জ্বল ভবিষ্যতের পথ প্রদর্শক।'
                : 'The ultimate online learning platform. Helping conquer your child\'s fear of mathematics and guiding them toward a stellar and brilliant academic future.'}
            </p>
          </div>

          {/* Column 2: Quick Links */}
          <div>
            <h4 className="font-display font-bold text-gray-900 text-xs uppercase tracking-widest mb-4">
              {language === 'bn' ? 'কুইক লিঙ্ক' : 'QUICK LINKS'}
            </h4>
            <ul className="space-y-2.5 font-sans text-xs">
              <li>
                <button
                  onClick={() => onOpenPolicy?.('privacy')}
                  className="text-gray-500 hover:text-[#15803d] transition-colors cursor-pointer block text-left bg-transparent border-0 p-0"
                >
                  {language === 'bn' ? 'গোপনীয়তা নীতি (Privacy Policy)' : 'Privacy Policy'}
                </button>
              </li>
              <li>
                <button
                  onClick={() => onOpenPolicy?.('terms')}
                  className="text-gray-500 hover:text-[#15803d] transition-colors cursor-pointer block text-left bg-transparent border-0 p-0"
                >
                  {language === 'bn' ? 'ব্যবহারের শর্তাবলী (Terms of Service)' : 'Terms of Service'}
                </button>
              </li>
              <li>
                <button
                  onClick={() => onOpenPolicy?.('help')}
                  className="text-gray-500 hover:text-[#15803d] transition-colors cursor-pointer block text-left bg-transparent border-0 p-0"
                >
                  {language === 'bn' ? 'হেল্প ও সাপোর্ট সেন্টার (Help Center)' : 'Help Center'}
                </button>
              </li>
            </ul>
          </div>

          {/* Column 3: Social Media */}
          <div>
            <h4 className="font-display font-bold text-gray-900 text-xs uppercase tracking-widest mb-4">
              {language === 'bn' ? 'সোশ্যাল মিডিয়া' : 'SOCIAL MEDIA'}
            </h4>
            <ul className="space-y-2.5 font-sans text-xs">
              <li>
                <a 
                  href="https://www.facebook.com/EdustikaBD" 
                  target="_blank" 
                  rel="noopener noreferrer" 
                  className="text-gray-500 hover:text-[#15803d] flex items-center gap-1.5 transition-colors"
                >
                  Facebook <ExternalLink className="w-3 h-3 opacity-60" />
                </a>
              </li>
              <li>
                <a 
                  href="https://www.youtube.com/@EdustikaBD" 
                  target="_blank" 
                  rel="noopener noreferrer" 
                  className="text-gray-500 hover:text-[#15803d] flex items-center gap-1.5 transition-colors"
                >
                  YouTube <ExternalLink className="w-3 h-3 opacity-60" />
                </a>
              </li>
              <li>
                <a 
                  href="https://wa.me/+8801619424854" 
                  target="_blank" 
                  rel="noopener noreferrer" 
                  className="text-gray-500 hover:text-[#15803d] flex items-center gap-1.5 transition-colors"
                >
                  WhatsApp <ExternalLink className="w-3 h-3 opacity-60" />
                </a>
              </li>
            </ul>
          </div>

          {/* Column 4: Contact details */}
          <div>
            <h4 className="font-display font-bold text-gray-900 text-xs uppercase tracking-widest mb-4">
              {language === 'bn' ? 'যোগাযোগ' : 'CONTACT US'}
            </h4>
            <ul className="space-y-3 font-sans text-xs text-gray-500">
              <li className="flex items-center gap-2.5">
                <Mail className="w-4 h-4 text-[#15803d] flex-shrink-0" />
                <a href="mailto:rr.mdjaidulislam@gmail.com" className="hover:text-[#15803d] transition-colors">
                  rr.mdjaidulislam@gmail.com
                </a>
              </li>
              <li className="flex items-center gap-2.5">
                <Phone className="w-4 h-4 text-[#15803d] flex-shrink-0" />
                <a href="tel:+8801619424854" className="hover:text-[#15803d] transition-colors">
                  +৮৮০ ১৬১৯-৪২৪৮৫৪
                </a>
              </li>
            </ul>
          </div>

        </div>

        {/* Bottom Banner */}
        <div className="border-t border-gray-200 pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 font-sans text-[11px] text-gray-400">
          <span>
            &copy; 2026 Edustika Online Tutoring. All rights reserved.
          </span>
          <div className="flex gap-4">
            <span>Powered by Edustika Premium Lab</span>
          </div>
        </div>

      </div>
    </footer>
  );
}
