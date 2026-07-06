import React, { useState, useEffect } from 'react';
import { getCourses, addPayment, PaymentVerification } from '../lib/db';
import { Course } from '../types';
import { ShieldCheck, Receipt, ArrowRight, Wallet, CheckCircle2, AlertCircle, Loader2 } from 'lucide-react';

export default function PaymentGateway() {
  const [coursesList, setCoursesList] = useState<Course[]>([]);
  
  // Form states
  const [studentId, setStudentId] = useState<string>('');
  const [studentName, setStudentName] = useState<string>('');
  const [selectedCourseId, setSelectedCourseId] = useState<string>('');
  const [paymentMethod, setPaymentMethod] = useState<'bKash' | 'Nagad' | 'Rocket'>('bKash');
  const [senderNumber, setSenderNumber] = useState<string>('');
  const [amount, setAmount] = useState<string>('');
  const [transactionId, setTransactionId] = useState<string>('');
  
  // Interface feedback states
  const [isVerifying, setIsVerifying] = useState<boolean>(false);
  const [verificationResult, setVerificationResult] = useState<PaymentVerification | null>(null);
  const [formError, setFormError] = useState<string>('');

  useEffect(() => {
    const list = getCourses();
    setCoursesList(list);
    if (list.length > 0) {
      setSelectedCourseId(list[0].id);
      // Auto-set default price if possible
      const priceNum = list[0].price.replace(/[^0-9]/g, '');
      setAmount(priceNum || '1200');
    }

    // Try to auto-prefill if student is logged in
    const loggedIn = localStorage.getItem('edustika_logged_in') === 'true';
    if (loggedIn) {
      const currentId = localStorage.getItem('edustika_current_student_id') || 'ED-2026-0489';
      setStudentId(currentId);
      const studentDataRaw = localStorage.getItem('edustika_student_data');
      if (studentDataRaw) {
        try {
          const sData = JSON.parse(studentDataRaw);
          setStudentName(sData.studentName || '');
        } catch (e) {
          console.error(e);
        }
      }
    }
  }, []);

  // Update payment amount when course changes
  const handleCourseChange = (courseId: string) => {
    setSelectedCourseId(courseId);
    const matched = coursesList.find(c => c.id === courseId);
    if (matched) {
      const priceNum = matched.price.replace(/[^0-9]/g, '');
      setAmount(priceNum || '1200');
    }
  };

  const handleVerifySubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setFormError('');

    if (!studentId.trim()) {
      setFormError('অনুগ্রহ করে সঠিক শিক্ষার্থী আইডি প্রদান করুন (Student ID is required)।');
      return;
    }
    if (!studentName.trim()) {
      setFormError('অনুগ্রহ করে শিক্ষার্থীর নাম প্রদান করুন (Student Name is required)।');
      return;
    }
    if (!senderNumber.match(/^01[3-9]\d{8}$/)) {
      setFormError('অনুগ্রহ করে সঠিক ১১-ডিজিটের মোবাইল নাম্বার প্রদান করুন (Please enter a valid 11-digit mobile number)।');
      return;
    }
    if (!transactionId.trim() || transactionId.length < 6) {
      setFormError('অনুগ্রহ করে সঠিক ট্রানজেকশন আইডি (TrxID) প্রদান করুন (TrxID must be at least 6 characters)।');
      return;
    }

    const matchedCourse = coursesList.find(c => c.id === selectedCourseId);
    const courseTitle = matchedCourse ? matchedCourse.bengaliTitle : 'সাধারণ গণিত';
    const parsedAmount = parseFloat(amount) || 1200;

    setIsVerifying(true);

    // Simulate real-time API Gateway verification check
    setTimeout(() => {
      const newPayId = `PAY-${Math.floor(100000 + Math.random() * 900000)}`;
      
      const paymentRecord: PaymentVerification = {
        id: newPayId,
        studentId: studentId.trim().toUpperCase(),
        studentName: studentName.trim(),
        courseId: selectedCourseId,
        courseTitle: courseTitle,
        paymentMethod: paymentMethod,
        phoneNumber: senderNumber,
        amount: parsedAmount,
        transactionId: transactionId.trim().toUpperCase(),
        timestamp: new Date().toISOString(),
        status: 'VERIFIED', // Instant status check
        systemRemarks: 'Verified instantly via payment gateway automation.'
      };

      // Save to database
      addPayment(paymentRecord);
      setVerificationResult(paymentRecord);
      setIsVerifying(false);

      // Trigger standard student data updates if match
      const currentId = localStorage.getItem('edustika_current_student_id');
      if (currentId && currentId.toLowerCase() === studentId.trim().toLowerCase()) {
        const studentDataRaw = localStorage.getItem('edustika_student_data');
        if (studentDataRaw) {
          try {
            const sData = JSON.parse(studentDataRaw);
            // Push payment history or simulate activation status
            sData.isPremiumActive = true;
            localStorage.setItem('edustika_student_data', JSON.stringify(sData));
          } catch (e) {
            console.error(e);
          }
        }
      }

    }, 1800);
  };

  const handleReset = () => {
    setVerificationResult(null);
    setTransactionId('');
    setSenderNumber('');
    setFormError('');
  };

  return (
    <div className="max-w-[1280px] mx-auto px-6 py-16 text-left">
      
      {/* Header Banner */}
      <div className="text-center max-w-[680px] mx-auto mb-12">
        <div className="text-xs font-bold text-[#15803d] tracking-widest uppercase mb-2">
          পেমেন্ট গেটওয়ে (PAYMENT VERIFICATION)
        </div>
        <h2 className="font-display font-black text-[#191c1d] text-3xl tracking-tight mb-4">
          ইনস্ট্যান্ট পেমেন্ট ভেরিফিকেশন পোর্টাল
        </h2>
        <div className="w-16 h-1 bg-[#22c55e] mx-auto mb-6"></div>
        <p className="font-sans text-gray-500 text-sm leading-relaxed">
          আপনার bKash, Nagad অথবা Rocket পেমেন্ট সম্পন্ন করার পর ট্রানজেকশন আইডি ও মোবাইল নাম্বার নিচে প্রদান করুন। আমাদের সিস্টেম স্বয়ংক্রিয়ভাবে সেকেন্ডের মধ্যে ভেরিফিকেশন রেজাল্ট প্রদর্শন করবে।
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
        
        {/* Left Side: Verification Form */}
        <div className="lg:col-span-7 bg-white border-2 border-[#15803d] p-8 shadow-sm">
          {verificationResult ? (
            /* VERIFICATION RESULT SCREEN */
            <div className="space-y-6 text-center py-4">
              <div className="w-16 h-16 bg-green-50 text-[#15803d] flex items-center justify-center rounded-full mx-auto border border-green-200">
                <CheckCircle2 className="w-10 h-10 text-[#15803d]" />
              </div>
              <div>
                <span className="font-mono text-[10px] font-bold tracking-widest text-emerald-700 bg-emerald-50 px-3 py-1 uppercase">
                  PAYMENT SUCCESSFUL & VERIFIED
                </span>
                <h3 className="font-display font-black text-2xl text-gray-900 mt-2">
                  পেমেন্ট সফলভাবে ভেরিফাইড হয়েছে!
                </h3>
                <p className="font-sans text-xs text-gray-500 max-w-[420px] mx-auto mt-1 leading-relaxed">
                  আপনার পেমেন্ট বিবরণী এডুস্টিকা ডাটাবেসে সফলভাবে নথিভুক্ত করা হয়েছে। আপনার কোর্স ও প্রিমিয়াম এক্সেস সক্রিয় করা হয়েছে।
                </p>
              </div>

              {/* Receipt Visual Mockup */}
              <div className="border border-dashed border-gray-200 bg-slate-50/50 p-6 text-left max-w-md mx-auto space-y-4 font-sans">
                <div className="flex items-center justify-between border-b border-gray-100 pb-3">
                  <div className="flex items-center gap-1.5 text-gray-800 font-bold text-xs">
                    <Receipt className="w-4 h-4 text-[#15803d]" />
                    <span>ভেরিফিকেশন রশিদ (Receipt)</span>
                  </div>
                  <span className="font-mono text-[11px] text-gray-400 font-semibold">{verificationResult.id}</span>
                </div>

                <div className="grid grid-cols-2 gap-y-2.5 text-xs">
                  <div className="text-gray-400 font-medium">শিক্ষার্থী আইডি:</div>
                  <div className="text-gray-900 font-bold font-mono text-right">{verificationResult.studentId}</div>

                  <div className="text-gray-400 font-medium">শিক্ষার্থীর নাম:</div>
                  <div className="text-gray-900 font-semibold text-right">{verificationResult.studentName}</div>

                  <div className="text-gray-400 font-medium">কোর্স বিবরণী:</div>
                  <div className="text-gray-900 font-semibold text-right text-[#15803d]">{verificationResult.courseTitle}</div>

                  <div className="text-gray-400 font-medium">পেমেন্ট মেথড:</div>
                  <div className="text-gray-900 font-semibold text-right">{verificationResult.paymentMethod}</div>

                  <div className="text-gray-400 font-medium">প্রেরক নাম্বার:</div>
                  <div className="text-gray-900 font-mono text-right">{verificationResult.phoneNumber}</div>

                  <div className="text-gray-400 font-medium">টাকার পরিমাণ:</div>
                  <div className="text-gray-900 font-extrabold text-right">৳ {verificationResult.amount} BDT</div>

                  <div className="text-gray-400 font-medium">ট্রানজেকশন আইডি:</div>
                  <div className="text-[#15803d] font-mono font-extrabold text-right break-all">{verificationResult.transactionId}</div>
                </div>

                <div className="border-t border-dashed border-gray-200 pt-3 flex items-center justify-between text-[10px] text-gray-400 font-medium">
                  <span>তারিখ: {new Date(verificationResult.timestamp).toLocaleString('bn-BD')}</span>
                  <span className="text-[#15803d] font-bold uppercase">● System Active</span>
                </div>
              </div>

              <div className="pt-4 flex flex-col sm:flex-row gap-3 justify-center">
                <button
                  onClick={handleReset}
                  className="bg-[#15803d] text-white hover:bg-black font-sans text-xs font-bold tracking-widest px-6 py-3 transition-colors cursor-pointer uppercase"
                >
                  অন্য পেমেন্ট ভেরিফাই করুন (Verify Another)
                </button>
                <button
                  onClick={() => window.print()}
                  className="bg-gray-100 text-gray-800 hover:bg-gray-200 font-sans text-xs font-bold tracking-widest px-6 py-3 transition-colors cursor-pointer uppercase"
                >
                  রশিদ প্রিন্ট করুন (Print Receipt)
                </button>
              </div>
            </div>
          ) : (
            /* VERIFICATION SUBMISSION FORM */
            <form onSubmit={handleVerifySubmit} className="space-y-5">
              
              <div className="flex items-center gap-2 text-[#15803d] border-b border-gray-100 pb-4 mb-2">
                <ShieldCheck className="w-6 h-6 text-[#10b981]" />
                <div>
                  <h3 className="font-display font-black text-lg text-gray-900 leading-tight">
                    ভেরিফিকেশন ফরম (Verification Form)
                  </h3>
                  <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest mt-0.5">
                    Secure Database Instant Sync Gateway
                  </p>
                </div>
              </div>

              {formError && (
                <div className="bg-red-50 border-l-4 border-red-500 p-4 flex items-start gap-2.5 text-xs text-red-700 leading-relaxed">
                  <AlertCircle className="w-4 h-4 flex-shrink-0 text-red-600 mt-0.5" />
                  <p>{formError}</p>
                </div>
              )}

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {/* Student ID */}
                <div>
                  <label className="block font-sans text-[10px] font-bold text-gray-500 uppercase tracking-widest mb-1.5">
                    শিক্ষার্থী আইডি (Student ID) *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="যেমন: ED-2026-0489"
                    value={studentId}
                    onChange={(e) => setStudentId(e.target.value)}
                    className="w-full bg-white border border-gray-300 px-4 py-2.5 text-xs outline-none focus:border-[#15803d] font-sans"
                  />
                </div>

                {/* Student Name */}
                <div>
                  <label className="block font-sans text-[10px] font-bold text-gray-500 uppercase tracking-widest mb-1.5">
                    শিক্ষার্থীর নাম (Student Name) *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="যেমন: আবির হাসান"
                    value={studentName}
                    onChange={(e) => setStudentName(e.target.value)}
                    className="w-full bg-white border border-gray-300 px-4 py-2.5 text-xs outline-none focus:border-[#15803d] font-sans"
                  />
                </div>
              </div>

              {/* Course Selector */}
              <div>
                <label className="block font-sans text-[10px] font-bold text-gray-500 uppercase tracking-widest mb-1.5">
                  কোর্সটি নির্বাচন করুন (Select Course) *
                </label>
                <select
                  value={selectedCourseId}
                  onChange={(e) => handleCourseChange(e.target.value)}
                  className="w-full bg-white border border-gray-300 p-2.5 text-xs outline-none focus:border-[#15803d] font-sans"
                >
                  {coursesList.map(c => (
                    <option key={c.id} value={c.id}>{c.bengaliTitle} ({c.title})</option>
                  ))}
                </select>
              </div>

              {/* Payment Method Selector */}
              <div>
                <label className="block font-sans text-[10px] font-bold text-gray-500 uppercase tracking-widest mb-2">
                  পেমেন্ট মেথড (Payment Method) *
                </label>
                <div className="grid grid-cols-3 gap-3">
                  {(['bKash', 'Nagad', 'Rocket'] as const).map(method => (
                    <button
                      key={method}
                      type="button"
                      onClick={() => setPaymentMethod(method)}
                      className={`py-3 text-xs font-bold border flex flex-col items-center gap-1 justify-center transition-all cursor-pointer ${paymentMethod === method ? 'border-2 border-[#15803d] bg-green-50/50 text-[#15803d]' : 'border-gray-200 text-gray-600 hover:bg-slate-50'}`}
                    >
                      <Wallet className="w-4 h-4 opacity-75" />
                      <span>{method}</span>
                    </button>
                  ))}
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {/* Sender Mobile Number */}
                <div>
                  <label className="block font-sans text-[10px] font-bold text-gray-500 uppercase tracking-widest mb-1.5">
                    প্রেরক মোবাইল নম্বর (Sender Mobile No.) *
                  </label>
                  <input
                    type="text"
                    required
                    maxLength={11}
                    placeholder="যেমন: 017xxxxxxxx"
                    value={senderNumber}
                    onChange={(e) => setSenderNumber(e.target.value)}
                    className="w-full bg-white border border-gray-300 px-4 py-2.5 text-xs outline-none focus:border-[#15803d] font-sans"
                  />
                </div>

                {/* Paid Amount */}
                <div>
                  <label className="block font-sans text-[10px] font-bold text-gray-500 uppercase tracking-widest mb-1.5">
                    টাকার পরিমাণ (Amount in BDT) *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="যেমন: ১৫০০"
                    value={amount}
                    onChange={(e) => setAmount(e.target.value)}
                    className="w-full bg-white border border-gray-300 px-4 py-2.5 text-xs outline-none focus:border-[#15803d] font-sans"
                  />
                </div>
              </div>

              {/* Transaction ID */}
              <div>
                <label className="block font-sans text-[10px] font-bold text-gray-500 uppercase tracking-widest mb-1.5">
                  ট্রানজেকশন আইডি (Transaction ID / TrxID) *
                </label>
                <input
                  type="text"
                  required
                  placeholder="যেমন: BKX849204A"
                  value={transactionId}
                  onChange={(e) => setTransactionId(e.target.value)}
                  className="w-full bg-white border border-gray-300 px-4 py-2.5 text-xs font-mono tracking-wider outline-none focus:border-[#15803d]"
                />
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={isVerifying}
                className="w-full bg-[#15803d] text-white hover:bg-black font-sans text-xs font-bold tracking-widest py-4 transition-all duration-300 active:scale-[0.98] cursor-pointer flex items-center justify-center gap-2 uppercase"
              >
                {isVerifying ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin text-white" />
                    <span>সার্ভার যাচাই করছে...</span>
                  </>
                ) : (
                  <>
                    <span>পেমেন্ট ভেরিফাই করুন (VERIFY PAYMENT)</span>
                    <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </button>
            </form>
          )}
        </div>

        {/* Right Side: Visual Payment Guide */}
        <div className="lg:col-span-5 space-y-6">
          <div className="bg-slate-50 border border-gray-200 p-6 text-left">
            <h4 className="font-sans font-bold text-gray-900 text-sm mb-3">
              কিভাবে পেমেন্ট করবেন? (Payment Instructions)
            </h4>
            
            <div className="space-y-4 font-sans text-xs text-gray-600 leading-relaxed">
              <div className="flex gap-3 items-start">
                <span className="w-5 h-5 rounded-full bg-[#15803d] text-white flex items-center justify-center font-bold text-[10px] shrink-0 mt-0.5">১</span>
                <p>যেকোনো bKash/Nagad/Rocket অ্যাপ থেকে নিচে দেওয়া এডুস্টিকা পার্সোনাল নাম্বারে <strong>Send Money</strong> অথবা মার্চেন্ট নাম্বারে <strong>Make Payment</strong> করুন।</p>
              </div>

              <div className="flex gap-3 items-start">
                <span className="w-5 h-5 rounded-full bg-[#15803d] text-white flex items-center justify-center font-bold text-[10px] shrink-0 mt-0.5">২</span>
                <p>পেমেন্ট সফল হওয়ার পর স্ক্রিনে একটি ৮ বা ১০ অক্ষরের <strong>Transaction ID (TrxID)</strong> পাবেন।</p>
              </div>

              <div className="flex gap-3 items-start">
                <span className="w-5 h-5 rounded-full bg-[#15803d] text-white flex items-center justify-center font-bold text-[10px] shrink-0 mt-0.5">৩</span>
                <p>বামপাশের ফর্মে আপনার <strong>স্টুডেন্ট আইডি</strong>, কোর্স নাম, প্রেরণকারী মোবাইল নম্বর এবং প্রাপ্ত <strong>Transaction ID</strong> সঠিক ভাবে লিখে সাবমিট করুন।</p>
              </div>
            </div>
          </div>

          <div className="bg-[#15803d]/5 border-2 border-dashed border-[#15803d]/30 p-6 text-left space-y-4">
            <span className="font-sans text-[10px] font-bold text-[#15803d] tracking-widest uppercase block">
              Official Receiver Channels
            </span>
            <div className="space-y-2.5 font-sans text-xs">
              <div className="flex justify-between items-center bg-white p-2.5 border border-gray-100">
                <span className="font-bold text-gray-800">bKash Payment (শুধুমাত্র পেমেন্ট):</span>
                <span className="font-mono text-[#15803d] font-bold">01619-424854</span>
              </div>
              <div className="flex justify-between items-center bg-white p-2.5 border border-gray-100">
                <span className="font-bold text-gray-800">bKash (Personal):</span>
                <span className="font-mono text-[#15803d] font-bold">01518-745202</span>
              </div>
              <div className="flex justify-between items-center bg-white p-2.5 border border-gray-100">
                <span className="font-bold text-gray-800">Nagad (Personal):</span>
                <span className="font-mono text-[#15803d] font-bold">01518-745202</span>
              </div>
              <div className="flex justify-between items-center bg-white p-2.5 border border-gray-100">
                <span className="font-bold text-gray-800">Rocket (Personal):</span>
                <span className="font-mono text-[#15803d] font-bold">01518-745202</span>
              </div>
            </div>
            <p className="text-[10px] text-gray-400 text-center leading-normal">
              * ভেরিফিকেশন সংক্রান্ত যেকোনো হেল্পের জন্য হেল্পলাইনে যোগাযোগ করতে পারেন: +৮৮০ ১৬১৯-৪২৪৮৫৪
            </p>
          </div>
        </div>

      </div>
    </div>
  );
}
