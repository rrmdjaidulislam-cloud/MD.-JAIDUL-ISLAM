import React from 'react';

interface FloatingWhatsAppButtonProps {
  language: 'bn' | 'en';
}

export default function FloatingWhatsAppButton({ language }: FloatingWhatsAppButtonProps) {
  return (
    <a
      href="https://wa.me/+8801619424854"
      target="_blank"
      rel="noopener noreferrer"
      className="fixed bottom-6 right-6 z-40 bg-[#25D366] text-white p-4 rounded-full shadow-2xl hover:bg-[#20ba5a] hover:scale-110 transition-all duration-300 flex items-center gap-2 group cursor-pointer"
      title={language === 'bn' ? 'হোয়াটসঅ্যাপ সহায়তা' : 'WhatsApp Support'}
      id="floating-whatsapp-btn"
    >
      <span className="max-w-0 overflow-hidden group-hover:max-w-[150px] transition-all duration-300 ease-out font-sans text-xs font-black tracking-wider uppercase whitespace-nowrap">
        {language === 'bn' ? 'যোগাযোগ করুন' : 'WhatsApp Help'}
      </span>
      {/* Dynamic pulse outer ring */}
      <div className="absolute inset-0 rounded-full bg-[#25D366] -z-10 animate-ping opacity-30" />
      
      <svg
        className="w-6 h-6 fill-current"
        viewBox="0 0 24 24"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path d="M12.004 2C6.48 2 2 6.48 2 12c0 1.95.56 3.77 1.52 5.31L2 22l4.83-1.46c1.47.8 3.14 1.26 4.9 1.26 5.52 0 10-4.48 10-10S17.52 2 12.004 2zM12 20.33c-1.74 0-3.41-.45-4.87-1.32l-.35-.2-2.87.87.88-2.8-.23-.37c-.95-1.52-1.46-3.29-1.46-5.14 0-5.15 4.18-9.33 9.33-9.33s9.33 4.18 9.33 9.33-4.18 9.33-9.33 9.33zm5.12-6.99c-.28-.14-1.64-.81-1.9-.9-.25-.09-.44-.14-.62.14-.18.27-.69.9-.85 1.08-.15.18-.31.2-.59.06-.28-.14-1.18-.43-2.25-1.38-.83-.74-1.39-1.66-1.55-1.94-.16-.28-.02-.43.12-.57.12-.13.28-.32.42-.48.14-.16.18-.28.28-.46.09-.18.05-.35-.02-.49-.07-.14-.62-1.5-.85-2.05-.22-.54-.45-.47-.62-.48-.16-.01-.35-.01-.54-.01-.19 0-.5.07-.76.35-.26.28-1 1-1 2.44 0 1.44 1.05 2.84 1.2 3.03.15.19 2.07 3.16 5.02 4.43.7.3 1.25.48 1.68.62.7.22 1.34.19 1.84.11.56-.08 1.64-.67 1.87-1.32.23-.65.23-1.2.16-1.32-.07-.12-.25-.19-.53-.33z" />
      </svg>
    </a>
  );
}
