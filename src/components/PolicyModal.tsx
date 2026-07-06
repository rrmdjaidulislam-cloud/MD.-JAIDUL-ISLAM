import React from 'react';
import { X, Shield, FileText, HelpCircle, Phone, Mail, CheckCircle, Sparkles, MessageSquare } from 'lucide-react';

interface PolicyModalProps {
  isOpen: boolean;
  type: 'privacy' | 'terms' | 'help' | null;
  onClose: () => void;
  language: 'bn' | 'en';
}

export default function PolicyModal({ isOpen, type, onClose, language }: PolicyModalProps) {
  if (!isOpen || !type) return null;

  const titleBn = {
    privacy: 'গোপনীয়তা নীতি ও তথ্য সুরক্ষা',
    terms: 'ব্যবহারের নিয়ম ও শর্তাবলী',
    help: 'হেল্প ও সাপোর্ট সেন্টার',
  }[type];

  const titleEn = {
    privacy: 'Privacy Policy & Data Security',
    terms: 'Terms of Service & Usage rules',
    help: 'Help & Support Center',
  }[type];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4 overflow-y-auto">
      <div className="bg-white border-2 border-[#15803d] w-full max-w-[800px] text-left p-6 sm:p-8 relative animate-scaleIn shadow-2xl max-h-[90vh] flex flex-col my-8">
        
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-400 hover:text-black transition-colors cursor-pointer p-1.5 rounded-full hover:bg-gray-100"
          aria-label="Close modal"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Modal Header */}
        <div className="border-b border-gray-100 pb-5 mb-5 shrink-0 pr-8 flex items-center gap-3">
          <div className="p-2.5 bg-green-50 border border-green-100 text-[#15803d]">
            {type === 'privacy' && <Shield className="w-6 h-6" />}
            {type === 'terms' && <FileText className="w-6 h-6" />}
            {type === 'help' && <HelpCircle className="w-6 h-6" />}
          </div>
          <div>
            <span className="text-[10px] font-mono font-bold text-[#15803d] uppercase tracking-wider bg-[#15803d]/5 px-2.5 py-1">
              {language === 'bn' ? 'এডুস্টিকা ডিক্লেয়ারেশন' : 'Edustika Declaration'}
            </span>
            <h3 className="font-display font-black text-gray-900 text-xl sm:text-2xl mt-1 leading-tight">
              {language === 'bn' ? titleBn : titleEn}
            </h3>
          </div>
        </div>

        {/* Scrollable Modal Content */}
        <div className="flex-grow overflow-y-auto pr-2 text-xs sm:text-sm leading-relaxed text-gray-700 font-sans space-y-6">
          
          {type === 'privacy' && (
            language === 'bn' ? (
              <div className="space-y-6">
                <p className="font-bold text-gray-900">
                  এডুস্টিকা অনলাইন প্ল্যাটফর্মে আপনার গোপনীয়তা রক্ষা করা আমাদের প্রথম অঙ্গীকার। এই ডকুমেন্টে আমরা কীভাবে আপনার ব্যক্তিগত ডেটা সংগ্রহ ও ব্যবহার করি তা বিস্তারিত তুলে ধরা হলো:
                </p>

                <div className="space-y-2">
                  <h4 className="font-display font-bold text-[#15803d] text-base">১. যেসব তথ্য আমরা সংগ্রহ করি</h4>
                  <p>আমাদের পোর্টালে নিবন্ধন, ভর্তি বা এআই চ্যাট ব্যবহারে নিম্নোক্ত তথ্যগুলো সংরক্ষিত হয়:</p>
                  <ul className="list-disc pl-5 space-y-1">
                    <li>শিক্ষার্থীর নাম, শ্রেণি এবং অভিভাবকের নাম।</li>
                    <li>যোগাযোগের জন্য সক্রিয় মোবাইল নম্বর ও সচল ইমেইল অ্যাড্রেস।</li>
                    <li>পেমেন্ট ভেরিফিকেশনের জন্য বিকাশ/নগদ নম্বর এবং ট্রানজেকশন আইডি (TxnID)।</li>
                    <li>হোয়াইটবোর্ড এআই অ্যাসিস্ট্যান্টের সাথে কৃত প্রশ্নের ইতিহাস (যাতে আপনার প্রগতি ট্র্যাক করা যায়)।</li>
                  </ul>
                </div>

                <div className="space-y-2">
                  <h4 className="font-display font-bold text-[#15803d] text-base">২. তথ্যের সঠিক ব্যবহার</h4>
                  <p>সংগৃহীত তথ্যগুলো নিম্নোক্ত কাজে ব্যবহৃত হয়:</p>
                  <ul className="list-disc pl-5 space-y-1">
                    <li>আপনার শিক্ষার্থীর জন্য ব্যক্তিগত ড্যাশবোর্ড ও ক্লাসরুম প্রোফাইল তৈরি করতে।</li>
                    <li>পেমেন্ট গেটওয়ের মাধ্যমে পরিশোধিত টিউশন ফি ম্যানুয়ালি এবং স্বয়ংক্রিয়ভাবে ভেরিফাই করতে।</li>
                    <li>মোবাইলে ভর্তি নিশ্চিতকরণের এসএমএস এবং গুরুত্বপূর্ণ নোটিশ পাঠাতে।</li>
                    <li>এআই টিউটর সিস্টেমের উত্তর প্রদান আরও নির্ভুল ও দ্রুততর করতে।</li>
                  </ul>
                </div>

                <div className="space-y-2">
                  <h4 className="font-display font-bold text-[#15803d] text-base">৩. তথ্য সুরক্ষা ও গোপনীয়তা</h4>
                  <p>আমরা আমাদের শিক্ষার্থীদের তথ্য সুরক্ষায় আধুনিক ক্রিপ্টোগ্রাফি ও সিকিউর সেশন ব্যবহার করি। আমরা কোনো অবস্থাতেই আপনার ফোন নম্বর বা ইমেইল বাণিজ্যিক উদ্দেশ্যে অন্য কোনো থার্ড-পার্টির নিকট বিক্রয় বা শেয়ার করি না। সকল ডেটা সম্পূর্ণ গোপন রাখা হয়।</p>
                </div>

                <div className="space-y-2">
                  <h4 className="font-display font-bold text-[#15803d] text-base">৪. ব্রাউজার কুকিজ ও লোকাল স্টোরেজ</h4>
                  <p>আপনার ড্যাশবোর্ড সেশন সচল রাখতে এবং ভাষা পরিবর্তন (বাংলা/ইংরেজি) মনে রাখতে আমরা ব্রাউজারের <code className="bg-slate-100 px-1 py-0.5 rounded font-mono text-xs text-red-600">localStorage</code> ব্যবহার করি। এটি আপনার কম্পিউটারকে কোনো ক্ষতি করে না এবং সুরক্ষিত থাকে।</p>
                </div>

                <div className="space-y-2">
                  <h4 className="font-display font-bold text-[#15803d] text-base">৫. আপডেট ও পরিবর্তন</h4>
                  <p>প্রয়োজনে এডুস্টিকা এই নীতিমালায় যেকোনো সময় সংশোধন করার অধিকার রাখে। নীতিমালার যেকোনো পরিবর্তন এই পৃষ্ঠায় প্রকাশ করা হবে। আমাদের সেবা ব্যবহারের মাধ্যমে আপনি এই নীতিসমূহ মেনে নিচ্ছেন বলে গণ্য হবে।</p>
                </div>
              </div>
            ) : (
              <div className="space-y-6">
                <p className="font-bold text-gray-900">
                  Protecting your privacy on the Edustika portal is our top commitment. This policy describes how we collect, process, and safeguard your personal data:
                </p>

                <div className="space-y-2">
                  <h4 className="font-display font-bold text-[#15803d] text-base">1. Information We Collect</h4>
                  <p>When you register, enroll, or interact with our system, we collect the following:</p>
                  <ul className="list-disc pl-5 space-y-1">
                    <li>Student Name, Class level, and Parent/Guardian Name.</li>
                    <li>Contact details including active Mobile Number and Email address.</li>
                    <li>Payment tracking details: Sender bKash/Nagad number and Transaction ID (TxnID).</li>
                    <li>AI Chatbot inquiry history to preserve context and trace academic progress.</li>
                  </ul>
                </div>

                <div className="space-y-2">
                  <h4 className="font-display font-bold text-[#15803d] text-base">2. How We Use Your Information</h4>
                  <p>Your details are strictly utilized to ensure seamless delivery of learning services:</p>
                  <ul className="list-disc pl-5 space-y-1">
                    <li>To set up and authorize access to your personal Student Dashboard and online recorded sessions.</li>
                    <li>To verify batch enrollment fees sent via mobile financial channels.</li>
                    <li>To dispatch essential text updates, enrollment slips, and exam announcements.</li>
                    <li>To personalize step-by-step math answers from our whiteboard AI engine.</li>
                  </ul>
                </div>

                <div className="space-y-2">
                  <h4 className="font-display font-bold text-[#15803d] text-base">3. Data Security & Third-Party Sharing</h4>
                  <p>We deploy modern session encryption to keep accounts safe. We hold a strict zero-spam policy and never sell or exchange phone numbers or records with any advertising broker. All data is securely locked inside our server perimeter.</p>
                </div>

                <div className="space-y-2">
                  <h4 className="font-display font-bold text-[#15803d] text-base">4. Browser Cookies & Local Storage</h4>
                  <p>To preserve login states and language toggles without constant credentials prompt, we utilize standard browser <code className="bg-slate-100 px-1 py-0.5 rounded font-mono text-xs text-red-600">localStorage</code>. This mechanism is secured and sandboxed inside your local browser context.</p>
                </div>

                <div className="space-y-2">
                  <h4 className="font-display font-bold text-[#15803d] text-base">5. Updates to This Policy</h4>
                  <p>Edustika reserves the right to revise this Privacy Policy periodically. Continued use of our portal signifies agreement to the terms outlined on this official page.</p>
                </div>
              </div>
            )
          )}

          {type === 'terms' && (
            language === 'bn' ? (
              <div className="space-y-6">
                <p className="font-bold text-gray-900">
                  এডুস্টিকা পোর্টাল ও শিক্ষাসেবা ব্যবহারের ক্ষেত্রে সকল ছাত্র-ছাত্রী ও অভিভাবকদের নিম্নোক্ত শর্তাবলী মেনে চলা আবশ্যক:
                </p>

                <div className="space-y-2">
                  <h4 className="font-display font-bold text-[#15803d] text-base">১. সঠিক তথ্য প্রদান</h4>
                  <p>নিবন্ধন ফরম পূরণ করার সময় বা হোমওয়ার্ক সাবমিট করার সময় সঠিক নাম ও যোগাযোগের নম্বর ব্যবহার করতে হবে। ভুয়া বা বিভ্রান্তিকর তথ্য প্রদান করা হলে অ্যাকাউন্ট সাময়িকভাবে স্থগিত বা বাতিল হতে পারে।</p>
                </div>

                <div className="space-y-2">
                  <h4 className="font-display font-bold text-[#15803d] text-base">২. পেমেন্ট ও অ্যাক্টিভেশন</h4>
                  <p>প্রতিটি পেইড কোর্সের ফি বা টিউটরিং চার্জ অগ্রিম পরিশোধযোগ্য। সঠিক ট্রানজেকশন আইডি সহ পেমেন্ট সাবমিট করার পর আমাদের ভেরিফিকেশন টিম সর্বোচ্চ ১২-২৪ ঘণ্টার মধ্যে অ্যাকাউন্ট ক্লাসরুম সচল করে দেবে। পেমেন্ট জালিয়াতি বা ভুয়া ট্রানজেকশন আইডি প্রদান করা আইনত দণ্ডনীয় অপরাধ এবং তা সরাসরি স্থায়ী ব্যান নিশ্চিত করবে।</p>
                </div>

                <div className="space-y-2">
                  <h4 className="font-display font-bold text-[#15803d] text-base">৩. বুদ্ধিবৃত্তিক সম্পদ ও কপিরাইট</h4>
                  <p>এডুস্টিকা অনলাইন প্ল্যাটফর্মে প্রকাশিত সকল ভিডিও লেকচার, লাইভ ক্লাসের রেকর্ড, লেকচার শিট, হ্যান্ডনোট এবং কুইজ সামগ্রী সম্পূর্ণভাবে এডুস্টিকার সম্পদ। এগুলো ডাউনলোড করে শেয়ার করা, অন্য কোনো বাণিজ্যিক সাইটে বিক্রি করা বা ইউটিউব/ফেসবুকে ছড়িয়ে দেওয়া আইনত সম্পূর্ণ নিষিদ্ধ।</p>
                </div>

                <div className="space-y-2">
                  <h4 className="font-display font-bold text-[#15803d] text-base">৪. এআই ক্লাসরুমের শিষ্টাচার</h4>
                  <p>আমাদের ২৪/৭ এআই হোয়াইটবোর্ড ক্লাসরুম একটি পবিত্র শিক্ষার স্থান। এখানে অশালীন ভাষা ব্যবহার, অপ্রাসঙ্গিক গালগল্প বা ক্ষতিকর কোড ইনজেক্ট করার যেকোনো প্রচেষ্টা সনাক্ত হলে সেই স্টুডেন্ট আইডি স্বয়ংক্রিয়ভাবে স্থায়ী ব্লক করা হবে।</p>
                </div>

                <div className="space-y-2">
                  <h4 className="font-display font-bold text-[#15803d] text-base">৫. রিফান্ড বা ফেরত নীতিমালা</h4>
                  <p>আমাদের যেকোনো কোর্সে ভর্তির পূর্বে ফ্রি ডেমো ক্লাস ও ওরিয়েন্টেশন ভিডিও দেখার সুযোগ থাকে। ভর্তি সম্পন্ন করার পর ৩ কার্যদিবসের মধ্যে যৌক্তিক কারণ দর্শিয়ে ভর্তি বাতিলের আবেদন জানালে প্রযোজ্য সার্ভিস চার্জ কেটে রেখে অবশিষ্ট ফি রিফান্ড করা হবে। ৩ দিন পর কোনো প্রকার রিফান্ড গ্রহণযোগ্য নয়।</p>
                </div>
              </div>
            ) : (
              <div className="space-y-6">
                <p className="font-bold text-gray-900">
                  By accessing and enrolling in Edustika, both students and parents agree to strictly adhere to the following Terms of Service:
                </p>

                <div className="space-y-2">
                  <h4 className="font-display font-bold text-[#15803d] text-base">1. Profile and Identity Integrity</h4>
                  <p>Students must provide authentic contact info, parent details, and active mobile numbers during enrolment. Impersonation or submitting fraudulent details is ground for account deactivation.</p>
                </div>

                <div className="space-y-2">
                  <h4 className="font-display font-bold text-[#15803d] text-base">2. Payment Verification & License Access</h4>
                  <p>Premium courses must be cleared in advance. After registering a Payment Ticket with a unique transaction token, we activate course records within 12-24 hours. Inputting fake txn hashes or repeating transaction IDs will lead to permanent service cancellation.</p>
                </div>

                <div className="space-y-2">
                  <h4 className="font-display font-bold text-[#15803d] text-base">3. Intellectual Property Rights</h4>
                  <p>All recorded stream assets, curated PDFs, math challenge modules, graphics, and chatbot models are the exclusive intellectual property of Edustika. Distributing, recording, mirroring, or selling any of our premium content publicly is legally prohibited.</p>
                </div>

                <div className="space-y-2">
                  <h4 className="font-display font-bold text-[#15803d] text-base">4. Acceptable Conduct in Virtual Spaces</h4>
                  <p>The 24/7 AI Classroom whiteboard is an exclusive academic platform. Any attempt to abuse the chatbot, execute malicious prompts, spam queries, or write offensive inputs will instantly revoke chatbot credentials permanently.</p>
                </div>

                <div className="space-y-2">
                  <h4 className="font-display font-bold text-[#15803d] text-base">5. Cancellation and Refund Policy</h4>
                  <p>We supply detailed free demo materials to all aspirants prior to billing. Refund requests will be processed exclusively within 3 business days of batch start (minus gateway fees). No refund requests will be processed after this duration.</p>
                </div>
              </div>
            )
          )}

          {type === 'help' && (
            <div className="space-y-6">
              <div className="bg-green-50 border border-green-200 p-4 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 shrink-0">
                <div className="text-left">
                  <h4 className="font-display font-black text-sm text-gray-900 flex items-center gap-1.5">
                    <Sparkles className="w-4 h-4 text-[#15803d]" />
                    {language === 'bn' ? '২৪/৭ সরাসরি যোগাযোগ লাইন' : '24/7 Direct Support Hotline'}
                  </h4>
                  <p className="text-[11px] text-gray-500 mt-0.5">
                    {language === 'bn' ? 'যেকোনো কারিগরি সমস্যায় আমাদের টিমের সাথে কথা বলুন' : 'Talk with our engineering and academic team instantly'}
                  </p>
                </div>
                <div className="flex gap-2 w-full sm:w-auto shrink-0">
                  <a
                    href="https://wa.me/+8801619424854"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex-1 sm:flex-initial bg-[#25D366] hover:bg-[#20ba5a] text-white text-[11px] font-black tracking-wider uppercase px-3 py-2 flex items-center justify-center gap-1.5 transition-all cursor-pointer"
                  >
                    WhatsApp Support
                  </a>
                  <a
                    href="tel:+8801619424854"
                    className="flex-1 sm:flex-initial bg-black hover:bg-[#15803d] text-white text-[11px] font-black tracking-wider uppercase px-3 py-2 flex items-center justify-center gap-1.5 transition-all cursor-pointer"
                  >
                    Call Us
                  </a>
                </div>
              </div>

              {/* FAQs Section */}
              <div className="space-y-4">
                <h4 className="font-display font-black text-[#15803d] text-base border-b border-gray-100 pb-2">
                  {language === 'bn' ? 'সচরাচর জিজ্ঞাসিত প্রশ্নসমূহ (FAQs)' : 'Frequently Asked Questions (FAQs)'}
                </h4>

                {language === 'bn' ? (
                  <div className="space-y-4 text-left">
                    <div className="p-3.5 border border-gray-100 bg-slate-50/50 space-y-1">
                      <p className="font-bold text-gray-900">প্রশ্ন: কিভাবে আমি লাইভ ক্লাস করব এবং রেকর্ড পাব?</p>
                      <p className="text-gray-600 text-xs">উত্তর: প্রথমে আমাদের অ্যাডমিশন ফর্ম পূরণ করে কোর্স ফি পে করুন। সফলভাবে ভেরিফিকেশনের পর আপনার স্টুডেন্ট আইডি দিয়ে পোর্টালে লগইন করুন। ড্যাশবোর্ডে প্রবেশ করলেই আপনার কাঙ্ক্ষিত কোর্সের লাইভ লিঙ্ক এবং অধ্যায়ভিত্তিক ভিডিও রেকর্ডসমূহ পেয়ে যাবেন।</p>
                    </div>

                    <div className="p-3.5 border border-gray-100 bg-slate-50/50 space-y-1">
                      <p className="font-bold text-gray-900">প্রশ্ন: পেমেন্ট করার পর আইডি সচল হতে কত সময় লাগে?</p>
                      <p className="text-gray-600 text-xs">উত্তর: আমাদের ডেডিকেটেড অ্যাডমিন টিম ট্রানজেকশন আইডি এবং পেমেন্ট রশিদ যাচাই করার জন্য সচেষ্ট রয়েছে। সাধারণত পেমেন্ট টিকিটের ১ থেকে ২ ঘণ্টার মধ্যেই অ্যাকাউন্ট সক্রিয় হয়ে যায়। তবে কোনো বিশেষ কারিগরি জটিলতা থাকলে সর্বোচ্চ ২৪ ঘণ্টা সময় লাগতে পারে।</p>
                    </div>

                    <div className="p-3.5 border border-gray-100 bg-slate-50/50 space-y-1">
                      <p className="font-bold text-gray-900">প্রশ্ন: এআই ক্লাসরুমের হোয়াইটবোর্ড কি সম্পূর্ণ ফ্রী?</p>
                      <p className="text-gray-600 text-xs">উত্তর: হ্যাঁ, এডুস্টিকার এআই ক্লাসরুম আমাদের যেকোনো পেইড এবং ডেমো স্টুডেন্টদের জন্য সম্পূর্ণ ফ্রি। গণিতের কোনো কঠিন অংক আটকে গেলে আপনি যেকোনো সময় চ্যাটবটে প্রশ্ন করে তার সঠিক সমাধান এবং বিস্তারিত স্টেপ-বাই-স্টেপ নিয়ম জেনে নিতে পারবেন।</p>
                    </div>

                    <div className="p-3.5 border border-gray-100 bg-slate-50/50 space-y-1">
                      <p className="font-bold text-gray-900">প্রশ্ন: হোমওয়ার্ক ফাইল সাবমিট কীভাবে করব এবং কিভাবে রেজাল্ট দেখব?</p>
                      <p className="text-gray-600 text-xs">উত্তর: আপনার স্টুডেন্ট ড্যাশবোর্ডে গিয়ে "হোমওয়ার্ক সাবমিশন" প্যানেলে ক্লিক করুন। সেখানে বাড়ির কাজের ছবি বা পিডিএফ ফাইল আপলোড করার অপশন পাবেন। আপনার কাজ মূল্যায়ন শেষ হওয়ার সাথে সাথে আপনার ড্যাশবোর্ডে মার্কস ও টিউটর সাহেবের মন্তব্য দৃশ্যমান হবে।</p>
                    </div>
                  </div>
                ) : (
                  <div className="space-y-4 text-left">
                    <div className="p-3.5 border border-gray-100 bg-slate-50/50 space-y-1">
                      <p className="font-bold text-gray-900">Q: How do I participate in live streams and review records?</p>
                      <p className="text-gray-600 text-xs">A: First fill up the enrolment registration ticket and submit payment details. Once checked, log in using your private Student Credentials. Your Dashboard will show streaming buttons and high-definition video archives categorised by academic chapters.</p>
                    </div>

                    <div className="p-3.5 border border-gray-100 bg-slate-50/50 space-y-1">
                      <p className="font-bold text-gray-900">Q: How long does it take to activate accounts after transaction?</p>
                      <p className="text-gray-600 text-xs">A: Our administrative desk checks incoming transactions promptly. Your Student Account gets unlocked within 1-2 hours of payment registration. On weekends or under unexpected volume, it can take up to 12-24 hours.</p>
                    </div>

                    <div className="p-3.5 border border-gray-100 bg-slate-50/50 space-y-1">
                      <p className="font-bold text-gray-900">Q: Is the Virtual AI Classroom absolutely free?</p>
                      <p className="text-gray-600 text-xs">A: Yes, the AI classroom with interactive digital board assists all demo or paid enrolled students for free. You can request mathematical explanations or query derivation formulas any time, 24/7, to get detailed answers.</p>
                    </div>

                    <div className="p-3.5 border border-gray-100 bg-slate-50/50 space-y-1">
                      <p className="font-bold text-gray-900">Q: How do I submit my assignments and see evaluations?</p>
                      <p className="text-gray-600 text-xs">A: Navigate to the Homework section of your Student Portal, write the assignment number, upload snaps of your papers or a PDF, and click submit. Once checked by our mentor team, scores and specific feed-backs will instantly pop up on your log.</p>
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}

        </div>

        {/* Modal Footer */}
        <div className="border-t border-gray-100 pt-5 mt-5 shrink-0 flex justify-between items-center text-xs">
          <p className="text-gray-400 font-mono">
            {language === 'bn' ? 'এডুস্টিকা ডট কম © ২০২৬' : 'edustika.com © 2026'}
          </p>
          <button
            onClick={onClose}
            className="bg-black hover:bg-[#15803d] text-white font-bold text-xs px-6 py-2.5 transition-colors cursor-pointer uppercase tracking-wider"
          >
            {language === 'bn' ? 'বন্ধ করুন' : 'Close'}
          </button>
        </div>

      </div>
    </div>
  );
}
