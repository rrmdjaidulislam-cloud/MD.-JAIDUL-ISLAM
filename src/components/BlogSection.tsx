import React, { useState, useEffect } from 'react';
import { BookOpen, Calendar, User, ArrowRight, X, MessageSquare, Sparkles } from 'lucide-react';

export interface BlogPost {
  id: string;
  titleBn: string;
  titleEn: string;
  categoryBn: string;
  categoryEn: string;
  dateBn: string;
  dateEn: string;
  authorBn: string;
  authorEn: string;
  summaryBn: string;
  summaryEn: string;
  contentBn: string;
  contentEn: string;
}

interface BlogSectionProps {
  language: 'bn' | 'en';
}

export default function BlogSection({ language }: BlogSectionProps) {
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [selectedPost, setSelectedPost] = useState<BlogPost | null>(null);

  // Load posts
  useEffect(() => {
    const raw = localStorage.getItem('edustika_blog_posts');
    if (raw) {
      try {
        setPosts(JSON.parse(raw));
      } catch (e) {
        console.error(e);
      }
    } else {
      const defaultPosts: BlogPost[] = [
        {
          id: 'post-1',
          titleBn: 'গণিতের ভয় দূর করার ৫টি সহজ উপায়',
          titleEn: '5 Easy Ways to Overcome the Fear of Mathematics',
          categoryBn: 'পড়াশোনার টিপস',
          categoryEn: 'Study Tips',
          dateBn: '৬ জুলাই, ২০২৬',
          dateEn: 'July 6, 2026',
          authorBn: 'টিউটর জাহিদ',
          authorEn: 'Tutor Jahid',
          summaryBn: 'গণিত কোনো ভীতি নয়, বরং একটি মজার খেলা। আজ আমরা আলোচনা করব কীভাবে কিছু সহজ কৌশল ব্যবহার করে গণিতের ভয় দূর করা যায় এবং গণিতে ভালো স্কোর করা যায়।',
          summaryEn: 'Math is not something to be feared, but a fun game to play. Today we will discuss how to conquer math anxiety and score higher using simple strategies.',
          contentBn: `গণিত নিয়ে ভীতি আমাদের দেশের শিক্ষার্থীদের মধ্যে একটি অত্যন্ত সাধারণ সমস্যা। কিন্তু একটু কৌশল আর অনুশীলনের অভ্যাস থাকলে গণিতকে অনেক সহজ ও আনন্দদায়ক করে তোলা সম্ভব। নিচে গণিতের ভয় দূর করার ৫টি সহজ উপায় আলোচনা করা হলো:

১. সূত্র মুখস্থ করার চেয়ে বোঝার ওপর জোর দিন: গণিতের কোনো সূত্র সরাসরি মুখস্থ না করে সেটি কীভাবে আসলো তা বুঝার চেষ্টা করুন। বাস্তব উদাহরণ দিয়ে সূত্রটি মনে রাখার চেষ্টা করলে তা দীর্ঘদিন মনে থাকবে।

২. নিয়মিত ছোট ছোট অনুশীলনের অভ্যাস করুন: প্রতিদিন অন্তত ৩০ মিনিট গণিত অনুশীলন করুন। হুট করে জটিল অংক না করে প্রথমে সহজ ও ছোট অংক দিয়ে শুরু করুন। এতে আপনার আত্মবিশ্বাস বাড়বে।

৩. ভুল থেকে শিক্ষা নিন: অংক করতে গিয়ে ভুল হওয়া খুবই স্বাভাবিক। ভুল অংকটি কেটে না দিয়ে সেটি কেন ভুল হলো তা খুঁজে বের করুন। ভুলগুলোই আপনার শেখার সবচেয়ে বড় মাধ্যম।

৪. ভিজ্যুয়াল বা ছবির সাহায্য নিন: জ্যামিতি বা বিভিন্ন গাণিতিক সমস্যা বোঝার জন্য চিত্র বা গ্রাফের সাহায্য নিন। কোনো সমস্যাকে ছবিতে রূপান্তর করতে পারলে সেটি সমাধান করা অনেক সহজ হয়ে যায়।

৫. ধৈর্য ধরুন ও ইতিবাচক মনোভাব রাখুন: গণিত শেখার জন্য ধৈর্য খুবই প্রয়োজন। প্রথমবারেই সঠিক উত্তর না আসলে হতাশ হবেন না। নিজের ওপর বিশ্বাস রাখুন যে আপনিও গণিতে ভালো করতে পারবেন।`,
          contentEn: `Math anxiety is a very common issue among students. However, with the right strategies and regular practice, mathematics can become simple and enjoyable. Here are 5 easy ways to overcome your fear of math:

1. Focus on understanding rather than memorizing formulas: Instead of blindly memorizing math formulas, try to understand how they are derived. Relating them to real-life examples helps you remember them longer.

2. Build a habit of daily practice: Practice math for at least 30 minutes every day. Don't jump straight to complex problems; start with simpler ones to build your confidence gradually.

3. Learn from your mistakes: Making mistakes is a natural part of solving math. Don't just erase or cross out a wrong answer; instead, find out why it was wrong. Mistakes are your best teachers.

4. Use visuals and diagrams: Use diagrams, shapes, or graphs to understand geometry and algebraic word problems. Converting a problem into a visual representation makes it much easier to solve.

5. Be patient and maintain a positive attitude: Learning math takes time and patience. Don't get discouraged if you don't get the correct answer on your first try. Believe in yourself and keep practicing!`
        },
        {
          id: 'post-2',
          titleBn: 'এসএসসি পরীক্ষায় গণিতে এ+ পাওয়ার গোপন সূত্র',
          titleEn: 'The Secret Formula to Scoring A+ in SSC Math',
          categoryBn: 'পরীক্ষার প্রস্তুতি',
          categoryEn: 'Exam Prep',
          dateBn: '৫ জুলাই, ২০২৬',
          dateEn: 'July 5, 2026',
          authorBn: 'টিউটর জাহিদ',
          authorEn: 'Tutor Jahid',
          summaryBn: 'এসএসসি পরীক্ষায় গণিতে পূর্ণ নম্বর বা এ+ পাওয়া কিন্তু কঠিন কিছু নয়। সঠিক পরিকল্পনা এবং টেস্ট পেপার সলভ করার মাধ্যমে কীভাবে সহজেই এ+ নিশ্চিত করা যায় তার গাইডলাইন।',
          summaryEn: 'Scoring full marks or a perfect A+ in SSC Math is not as hard as it seems. Here is a guided roadmap to secure your A+ through proper planning and solving board questions.',
          contentBn: `এসএসসি শিক্ষার্থীদের জন্য গণিত একটি অতি গুরুত্বপূর্ণ বিষয়। গণিতে এ+ পাওয়া মানে সামগ্রিক জিপিএ-৫ পাওয়ার পথ অনেক সহজ হয়ে যাওয়া। পরীক্ষায় ভালো করার এবং নিশ্চিত এ+ পাওয়ার কিছু দরকারি গাইডলাইন নিচে দেওয়া হলো:

১. বোর্ড প্রশ্ন বিশ্লেষণ ও সমাধান: বিগত ৫ বছরের বোর্ড পরীক্ষার প্রশ্নগুলো ভালোভাবে সমাধান করুন। কোন অধ্যায় থেকে প্রতি বছর প্রশ্ন আসে তা চিহ্নিত করুন এবং সেগুলোতে বেশি জোর দিন।

২. নির্বাচনী পরীক্ষা বা টেস্ট পেপার সলভ: বিভিন্ন স্বনামধন্য স্কুলের টেস্ট পেপারের প্রশ্নগুলো সমাধান করুন। এটি আপনাকে সময়ের মধ্যে উত্তর করার এবং বিভিন্ন ধরণের কঠিন প্রশ্নের মুখোমুখি হওয়ার জন্য প্রস্তুত করবে।

৩. খাতার পরিচ্ছন্নতা ও স্টেপ ওয়াইজ নম্বর: গণিতে প্রতিটি সঠিক লাইনের জন্য মার্কস থাকে। তাই উত্তর মেলেনি বলে পুরো অংক কেটে দেবেন না। খাতা পরিষ্কার রাখুন এবং প্রতিটি স্টেপ সুন্দরভাবে উপস্থাপন করুন।

৪. সময় বন্টন নির্ধারণ: পরীক্ষার হলের ৩ ঘণ্টা সময়কে সঠিকভাবে ভাগ করে নিন। সৃজনশীল প্রশ্নের জন্য প্রতিটি প্রশ্নে ২১-২২ মিনিটের বেশি সময় নেবেন না। নৈর্ব্যক্তিক বা MCQ-এর জন্য দ্রুত সমাধান করার শর্টকাট টেকনিক শিখুন।

৫. নিয়মিত রিভিশন: সূত্র ও জ্যামিতির উপপাদ্যগুলো নিয়মিত রিভিশন দিন। পরীক্ষার আগের দিন নতুন কোনো অধ্যায় শুরু করার চেয়ে যেগুলো ভালো পারেন সেগুলো বেশি রিভিশন দেওয়া বুদ্ধিমানের কাজ।`,
          contentEn: `Mathematics is a highly crucial subject for SSC students. Scoring an A+ in math makes the path to a GPA-5 much smoother. Here are some highly effective guidelines to secure an A+ in your board exam:

1. Analyze and Solve Board Papers: Solve the board question papers of the past 5 years. Identify the chapters from which questions are repeatedly asked and prioritize those.

2. Solve Renowned School Test Papers: Solving test papers from top-tier schools exposes you to high-quality and challenging problems, improving your speed and adaptability.

3. Step-by-step Marking & Neatness: Math exams reward step-by-step progress. Even if your final calculation goes wrong, you will receive partial marks for correct steps. Keep your script clean and structured.

4. Time Management: Plan how you will divide your 3 hours in the exam hall. Allocate no more than 21-22 minutes per creative (CQ) question. Learn shortcut techniques to quickly solve MCQs.

5. Regular Revision: Periodically revise geometry theorems and algebraic formulas. On the day before the exam, focus on revising what you already know rather than studying a completely new chapter.`
        },
        {
          id: 'post-3',
          titleBn: 'অনলাইন লার্নিং ড্যাশবোর্ড ব্যবহারের সঠিক নিয়মাবলী',
          titleEn: 'How to Properly Utilize Your Online Learning Dashboard',
          categoryBn: 'নির্দেশিকা',
          categoryEn: 'Guides',
          dateBn: '৪ জুলাই, ২০২৬',
          dateEn: 'July 4, 2026',
          authorBn: 'এডুস্টিকা সাপোর্ট টিম',
          authorEn: 'Edustika Support',
          summaryBn: 'এডুস্টিকা ড্যাশবোর্ডে ক্লাস ভিডিও, কুইজ এবং হোমওয়ার্ক ফাইল কীভাবে আপলোড করবেন ও সঠিক সুবিধা নিবেন তার সম্পূর্ণ নির্দেশিকা।',
          summaryEn: 'A comprehensive guide on how to access class recordings, participate in quizzes, submit homework files, and maximize your learning on the Edustika portal.',
          contentBn: `এডুস্টিকা একাডেমীর ভার্চুয়াল পোর্টালটি এমনভাবে ডিজাইন করা হয়েছে যেন শিক্ষার্থীরা খুব সহজেই তাদের ক্লাসের পড়া সম্পন্ন করতে পারে। তবে পোর্টালে অনেক ফিচার থাকায় এর সঠিক ব্যবহার জানা অত্যন্ত জরুরি। নিচে এর সঠিক ব্যবহার বিধি দেওয়া হলো:

১. ক্লাসের রেকর্ড খুঁজে পাওয়া: কোনো কারণে লাইভ ক্লাস মিস হলে বা পুনরায় দেখতে চাইলে ড্যাশবোর্ডের "লাইভ ক্লাস ও রেকর্ডস" সেকশনে যান। সেখানে অধ্যায় ভিত্তিক পূর্ববর্তী সকল ক্লাসের ফুল HD রেকর্ড ভিডিও পেয়ে যাবেন।

২. ইনস্ট্যান্ট কুইজ সেশন: প্রতিটি লাইভ ক্লাসের শেষে বা অধ্যায় শেষে একটি সেলফ-অ্যাসেসমেন্ট কুইজ দেওয়া থাকে। কুইজে অংশ নিয়ে নিজের মেধা যাচাই করুন এবং কোন বিষয়ে দুর্বলতা আছে তা চিহ্নিত করে পুনরায় প্র্যাকটিস করুন।

৩. হোমওয়ার্ক আপলোড: আপনার এসাইনমেন্ট বা বাড়ির কাজ শেষ করার পর ড্যাশবোর্ডের "হোমওয়ার্ক সাবমিট" বাটনে ক্লিক করে খাতার ছবি বা পিডিএফ ফাইল আপলোড করে দিন। আমাদের টিউটর আপনার খাতা মূল্যায়ন করে ফিডব্যাক দেবেন।

৪. ভার্চুয়াল এআই ক্লাসরুম: কোনো কঠিন টপিক বুঝতে সমস্যা হলে আমাদের ২৪/৭ হোয়াইটবোর্ড ইন্টারেক্টিভ চ্যাটবটকে জিজ্ঞেস করতে পারেন। এটি আপনাকে রিয়েল-টাইমে সুন্দর সমাধান বা গাইডলাইন প্রদান করবে।`,
          contentEn: `The Edustika Virtual Portal is designed to make learning incredibly simple and productive. However, to maximize its potential, students should know how to utilize all its built-in features properly. Here is a guide on how to do that:

1. Accessing Class Recordings: If you miss a live class or want to review a topic, visit the "Live Classes & Records" section on your dashboard. There you will find full HD recordings of all past classes categorized by chapters.

2. Instant Quiz Sessions: After every live class or chapter, self-assessment quizzes are made available. Take these quizzes to evaluate your understanding, identify weak spots, and strengthen your concepts.

3. Submitting Homework: Once you finish your assignments, click the "Submit Homework" button on the dashboard to upload images of your solution pages or a PDF. Our tutor will evaluate and provide detailed feedback.

4. Virtual AI Classroom: If you ever get stuck on a tough question, ask our 24/7 interactive whiteboard chatbot. It provides real-time explanations, steps, and academic guidance instantly.`
        }
      ];
      localStorage.setItem('edustika_blog_posts', JSON.stringify(defaultPosts));
      setPosts(defaultPosts);
    }

    // Listen for changes
    const syncPosts = () => {
      const rawNow = localStorage.getItem('edustika_blog_posts');
      if (rawNow) {
        setPosts(JSON.parse(rawNow));
      }
    };
    window.addEventListener('edustika-posts-change', syncPosts);
    return () => window.removeEventListener('edustika-posts-change', syncPosts);
  }, []);

  return (
    <section className="bg-white py-20 border-b border-[#e9ecef]" id="blog-section">
      <div className="max-w-[1280px] mx-auto px-6">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16 space-y-4">
          <div className="inline-flex items-center gap-2 bg-green-50 border border-green-200 text-[#15803d] font-sans text-[11px] font-extrabold tracking-widest px-3 py-1.5 uppercase rounded-xs">
            <BookOpen className="w-3.5 h-3.5" />
            {language === 'bn' ? 'ব্লগ ও শিক্ষামূলক পোস্ট' : 'BLOG & ACADEMIC POSTS'}
          </div>
          <h2 className="font-display font-black text-gray-900 text-3xl sm:text-4xl tracking-tight">
            {language === 'bn' ? 'টিউটোরিয়াল ও গাণিতিক টিপস' : 'Tutorials & Mathematical Tips'}
          </h2>
          <p className="font-sans text-gray-500 text-sm leading-relaxed">
            {language === 'bn' 
              ? 'আমাদের অভিজ্ঞ টিউটরদের দেওয়া বিভিন্ন শিক্ষামূলক কলাম, পরীক্ষার টিপস এবং পোর্টাল ব্যবহারের দিকনির্দেশনা নিচে পড়ুন।'
              : 'Read educational columns, exam preparation tips, and dashboard guidance written by our experienced mentor team.'}
          </p>
        </div>

        {/* Posts Bento Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {posts.map((post) => (
            <article 
              key={post.id} 
              className="border-2 border-gray-100 hover:border-[#15803d] bg-slate-50/50 p-6 flex flex-col justify-between transition-all duration-300 shadow-2xs hover:shadow-md relative overflow-hidden group"
            >
              <div className="space-y-4">
                {/* Tag & Date */}
                <div className="flex items-center justify-between text-[10px] font-bold text-gray-400">
                  <span className="text-[#15803d] uppercase tracking-wider bg-[#15803d]/5 px-2.5 py-1 font-mono">
                    {language === 'bn' ? post.categoryBn : post.categoryEn}
                  </span>
                  <span className="flex items-center gap-1 font-mono">
                    <Calendar className="w-3.5 h-3.5" />
                    {language === 'bn' ? post.dateBn : post.dateEn}
                  </span>
                </div>

                {/* Title */}
                <h3 className="font-display font-bold text-gray-900 text-lg group-hover:text-[#15803d] transition-colors leading-snug">
                  {language === 'bn' ? post.titleBn : post.titleEn}
                </h3>

                {/* Summary */}
                <p className="font-sans text-gray-600 text-xs leading-relaxed line-clamp-3">
                  {language === 'bn' ? post.summaryBn : post.summaryEn}
                </p>
              </div>

              {/* Author & Button */}
              <div className="border-t border-gray-100 mt-6 pt-4 flex items-center justify-between text-xs">
                <span className="flex items-center gap-1.5 text-gray-500 font-medium">
                  <User className="w-3.5 h-3.5 text-gray-400" />
                  {language === 'bn' ? post.authorBn : post.authorEn}
                </span>
                <button
                  onClick={() => setSelectedPost(post)}
                  className="text-[#15803d] hover:text-black font-bold tracking-wider uppercase inline-flex items-center gap-1 transition-all cursor-pointer text-[10px]"
                >
                  {language === 'bn' ? 'বিস্তারিত পড়ুন' : 'Read More'}
                  <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                </button>
              </div>
            </article>
          ))}
        </div>

      </div>

      {/* Post Reading Full Screen Backdrop Modal */}
      {selectedPost && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4">
          <div className="bg-white border-2 border-[#15803d] w-full max-w-[700px] text-left p-8 relative animate-scaleIn shadow-2xl max-h-[90vh] flex flex-col">
            
            {/* Close Button */}
            <button
              onClick={() => setSelectedPost(null)}
              className="absolute top-4 right-4 text-gray-400 hover:text-black transition-colors cursor-pointer p-1"
            >
              <X className="w-6 h-6" />
            </button>

            {/* Modal Header */}
            <div className="border-b border-gray-100 pb-5 mb-5 shrink-0 pr-8">
              <span className="text-[10px] font-mono font-bold text-[#15803d] uppercase tracking-wider bg-[#15803d]/5 px-2.5 py-1">
                {language === 'bn' ? selectedPost.categoryBn : selectedPost.categoryEn}
              </span>
              <h3 className="font-display font-black text-gray-900 text-xl sm:text-2xl mt-3 leading-tight">
                {language === 'bn' ? selectedPost.titleBn : selectedPost.titleEn}
              </h3>
              
              <div className="flex items-center gap-4 text-xs text-gray-400 font-semibold mt-3">
                <span className="flex items-center gap-1">
                  <User className="w-3.5 h-3.5" />
                  {language === 'bn' ? selectedPost.authorBn : selectedPost.authorEn}
                </span>
                <span className="flex items-center gap-1 font-mono">
                  <Calendar className="w-3.5 h-3.5" />
                  {language === 'bn' ? selectedPost.dateBn : selectedPost.dateEn}
                </span>
              </div>
            </div>

            {/* Scrollable Modal Content */}
            <div className="flex-grow overflow-y-auto pr-2">
              <div className="font-sans text-xs text-gray-700 leading-relaxed whitespace-pre-wrap space-y-4">
                {language === 'bn' ? selectedPost.contentBn : selectedPost.contentEn}
              </div>
            </div>

            {/* Modal Footer */}
            <div className="border-t border-gray-100 pt-5 mt-5 shrink-0 flex justify-end">
              <button
                onClick={() => setSelectedPost(null)}
                className="bg-black hover:bg-[#15803d] text-white font-bold text-xs px-6 py-2.5 transition-colors cursor-pointer uppercase tracking-wider"
              >
                {language === 'bn' ? 'বন্ধ করুন' : 'Close'}
              </button>
            </div>

          </div>
        </div>
      )}

    </section>
  );
}
