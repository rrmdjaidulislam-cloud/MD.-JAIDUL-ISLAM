import React, { useState, useRef, useEffect } from 'react';
import { Video, VideoOff, Mic, MicOff, ScreenShare, RefreshCw, PenTool, Eraser, Trash2, Send, HelpCircle, Award, Sparkles, BookOpen, ChevronRight, Check, AlertCircle } from 'lucide-react';
import { Message, QuizQuestion } from '../types';

export default function WhiteboardClassroom() {
  // Video and Call State
  const [tutorMuted, setTutorMuted] = useState<boolean>(false);
  const [cameraOn, setCameraOn] = useState<boolean>(true);
  const [micOn, setMicOn] = useState<boolean>(true);
  const [screenSharing, setScreenSharing] = useState<boolean>(false);
  const [classActive, setClassActive] = useState<boolean>(true);

  // Whiteboard Canvas State
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [isDrawing, setIsDrawing] = useState<boolean>(false);
  const [color, setColor] = useState<string>('#1e293b'); // Dark gray/navy pen
  const [lineWidth, setLineWidth] = useState<number>(3);
  const [tool, setTool] = useState<'pen' | 'eraser'>('pen');
  const [showEquationsOverlay, setShowEquationsOverlay] = useState<boolean>(true);
  const drawHistory = useRef<string[]>([]);

  // AI Tutor & Solver State
  const [aiPrompt, setAiPrompt] = useState<string>('');
  const [solverTopic, setSolverTopic] = useState<string>('General Math');
  const [aiResponse, setAiResponse] = useState<string>('');
  const [aiLoading, setAiLoading] = useState<boolean>(false);
  const [chatMessages, setChatMessages] = useState<Message[]>([
    { id: '1', sender: 'tutor', text: 'আসসালামু আলাইকুম! আমি টিউটর জাহিদ। আজ আমরা কোন গাণিতিক সমস্যা নিয়ে আলোচনা করব?', timestamp: '11:13 AM' }
  ]);

  // AI Quiz State
  const [quizTopic, setQuizTopic] = useState<string>('Algebra');
  const [quizDifficulty, setQuizDifficulty] = useState<string>('Medium');
  const [quizzes, setQuizzes] = useState<QuizQuestion[]>([]);
  const [quizLoading, setQuizLoading] = useState<boolean>(false);
  const [currentQuizIdx, setCurrentQuizIdx] = useState<number>(0);
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [showExplanation, setShowExplanation] = useState<boolean>(false);
  const [quizScore, setQuizScore] = useState<number>(0);
  const [quizCompleted, setQuizCompleted] = useState<boolean>(false);

  // Initialize whiteboard canvas content
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Set canvas dimensions
    canvas.width = canvas.parentElement?.clientWidth || 800;
    canvas.height = 450;

    // Initial drawing background
    ctx.fillStyle = '#ffffff';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Write initial equation on whiteboard
    ctx.font = '22px Montserrat, sans-serif';
    ctx.fillStyle = '#214fc7';
    ctx.fillText('Edustika Online Tutor', 30, 50);

    ctx.font = '18px Courier New, monospace';
    ctx.fillStyle = '#475569';
    ctx.fillText('∫ f(x) dx = dy/dx', 30, 100);
    ctx.fillText('f(x+h) - f(x) / h', 30, 140);
    ctx.fillText('x² + y² = r²', 30, 180);

    // Save initial state to history
    drawHistory.current = [canvas.toDataURL()];
  }, [classActive]);

  // Canvas Drawing Handlers
  const startDrawing = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const rect = canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    ctx.beginPath();
    ctx.moveTo(x, y);
    setIsDrawing(true);
  };

  const draw = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (!isDrawing) return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const rect = canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    ctx.lineTo(x, y);
    ctx.strokeStyle = tool === 'eraser' ? '#ffffff' : color;
    ctx.lineWidth = tool === 'eraser' ? 20 : lineWidth;
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';
    ctx.stroke();
  };

  const stopDrawing = () => {
    if (!isDrawing) return;
    setIsDrawing(false);
    const canvas = canvasRef.current;
    if (canvas) {
      drawHistory.current.push(canvas.toDataURL());
    }
  };

  const clearCanvas = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    ctx.fillStyle = '#ffffff';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    drawHistory.current = [canvas.toDataURL()];
  };

  const undoCanvas = () => {
    if (drawHistory.current.length <= 1) return;
    drawHistory.current.pop(); // Remove current state
    const previousState = drawHistory.current[drawHistory.current.length - 1];
    
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const img = new Image();
    img.onload = () => {
      ctx.fillStyle = '#ffffff';
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      ctx.drawImage(img, 0, 0);
    };
    img.src = previousState;
  };

  // AI Math Solver API Integration
  const handleSolvePrompt = async (presetPrompt?: string) => {
    const question = presetPrompt || aiPrompt;
    if (!question.trim()) return;

    // Add student message to chat
    const studentMsg: Message = {
      id: Date.now().toString(),
      sender: 'student',
      text: question,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };
    setChatMessages(prev => [...prev, studentMsg]);
    setAiPrompt('');
    setAiLoading(true);

    try {
      const response = await fetch('/api/gemini/solve', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prompt: question, topic: solverTopic })
      });
      const data = await response.json();

      if (data.error) {
        throw new Error(data.error);
      }

      // Add AI response to chat
      const aiMsg: Message = {
        id: (Date.now() + 1).toString(),
        sender: 'tutor',
        text: data.text || 'কোনো সমাধান পাওয়া যায়নি। অনুগ্রহ করে আবার চেষ্টা করুন।',
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };
      setChatMessages(prev => [...prev, aiMsg]);
    } catch (err: any) {
      console.error(err);
      const errorMsg: Message = {
        id: (Date.now() + 1).toString(),
        sender: 'tutor',
        text: 'দুঃখিত, এআই টিউটর সার্ভিসটি এই মুহূর্তে কাজ করছে না। অনুগ্রহ করে সঠিক API Key সেটিংস চেক করুন।',
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };
      setChatMessages(prev => [...prev, errorMsg]);
    } finally {
      setAiLoading(false);
    }
  };

  // AI Quiz Generator API Integration
  const generateQuiz = async () => {
    setQuizLoading(true);
    setQuizzes([]);
    setCurrentQuizIdx(0);
    setSelectedAnswer(null);
    setShowExplanation(false);
    setQuizCompleted(false);
    setQuizScore(0);

    try {
      const response = await fetch('/api/gemini/quiz', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ topic: quizTopic, difficulty: quizDifficulty })
      });
      const data = await response.json();

      if (data.error) throw new Error(data.error);

      if (data.quizzes && data.quizzes.length > 0) {
        setQuizzes(data.quizzes);
      } else {
        throw new Error("No quizzes returned");
      }
    } catch (err) {
      console.error(err);
      // Fallback quizzes if API errors out
      setQuizzes([
        {
          id: 'fb1',
          question: 'যদি x + y = 5 এবং x - y = 3 হয়, তবে x এবং y এর মান কত?',
          options: ['x = 4, y = 1', 'x = 3, y = 2', 'x = 5, y = 0', 'x = 2, y = 3'],
          correctAnswer: 0,
          explanation: 'সমীকরণ দুটি যোগ করলে পাই: 2x = 8 => x = 4। প্রথম সমীকরণে x এর মান বসালে পাই: 4 + y = 5 => y = 1। সুতরাং সঠিক উত্তর x = 4, y = 1।'
        },
        {
          id: 'fb2',
          question: 'sin²(θ) + cos²(θ) এর ত্রিকোণমিতিক সরল মান কত?',
          options: ['0', '1', '2', '-1'],
          correctAnswer: 1,
          explanation: 'ত্রিকোণমিতির মৌলিক সূত্র অনুযায়ী, যেকোনো কোণ θ এর জন্য sin²(θ) + cos²(θ) = 1।'
        }
      ]);
    } finally {
      setQuizLoading(false);
    }
  };

  const handleSelectAnswer = (idx: number) => {
    if (selectedAnswer !== null) return; // Prevent change after selecting
    setSelectedAnswer(idx);
    setShowExplanation(true);
    if (idx === quizzes[currentQuizIdx].correctAnswer) {
      setQuizScore(prev => prev + 1);
    }
  };

  const handleNextQuiz = () => {
    setSelectedAnswer(null);
    setShowExplanation(false);
    if (currentQuizIdx < quizzes.length - 1) {
      setCurrentQuizIdx(prev => prev + 1);
    } else {
      setQuizCompleted(true);
    }
  };

  // Math Preset Problems
  const presets = [
    { title: 'দ্বিপদী বিস্তৃতি', query: 'দ্বিপদী বিস্তৃতি (Binomial Expansion) এর সূত্রটি বুঝিয়ে দিন এবং একটি উদাহরণ দিন।' },
    { title: 'উৎপাদকে বিশ্লেষণ', query: 'x^2 - 5x + 6 = 0 এই সমীকরণটি উৎপাদকে বিশ্লেষণ করে সমাধান করুন।' },
    { title: 'ক্যালকুলাস ডেরিভেটিভ', query: 'f(x) = x^2 এর অন্তরীকরণ (Derivative) এর প্রথম নীতি থেকে প্রমাণ করে দিন।' },
    { title: 'পিথাগোরাস উপপাদ্য', query: 'পিথাগোরাসের উপপাদ্যের মূল বক্তব্য এবং জ্যামিতিক প্রমাণ সহজে বুঝিয়ে দিন।' }
  ];

  return (
    <section className="bg-gray-100 min-h-screen py-10">
      <div className="max-w-[1280px] mx-auto px-6">
        
        {/* Header Block */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-8">
          <div className="text-left">
            <span className="bg-[#214fc7] text-white font-mono text-[9px] font-bold tracking-widest px-2 py-0.5 uppercase">
              🔵 LIVE INTERACTIVE CLASSROOM
            </span>
            <h1 className="font-display font-black text-gray-900 text-3xl tracking-tight mt-1">
              এডুস্টিকা ভার্চুয়াল ল্যাব ও ক্লাস
            </h1>
          </div>
          <div className="flex items-center gap-2">
            <div className="flex items-center gap-1.5 bg-red-100 border border-red-200 text-red-700 px-3 py-1 font-mono text-xs font-bold uppercase animate-pulse">
              <span className="w-2 h-2 bg-red-600 rounded-full"></span>
              LIVE CONNECTED
            </div>
            <button
              onClick={() => setClassActive(!classActive)}
              className={`px-4 py-1.5 font-sans text-xs font-bold tracking-wide border ${
                classActive
                  ? 'bg-red-600 border-red-600 text-white hover:bg-red-700'
                  : 'bg-green-600 border-green-600 text-white hover:bg-green-700'
              } cursor-pointer`}
            >
              {classActive ? 'Disconnect' : 'Connect'}
            </button>
          </div>
        </div>

        {classActive ? (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            
            {/* LEFT / CENTER COLUMN: Video Feed + Whiteboard (Lg: col-span-8) */}
            <div className="lg:col-span-8 space-y-6">
              
              {/* Split Screen Video Call */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                
                {/* Video 1: Tutor Jannat Simulation */}
                <div className="relative bg-[#1e293b] aspect-video border-2 border-[#214fc7] overflow-hidden flex items-center justify-center text-white">
                  {tutorMuted ? (
                    <div className="flex flex-col items-center">
                      <MicOff className="w-10 h-10 text-red-500 mb-2" />
                      <span className="font-sans text-xs text-gray-400">Tutor Jahid has muted audio</span>
                    </div>
                  ) : (
                    <div className="absolute inset-0 z-0">
                      {/* Generous animated pulse simulating video motion */}
                      <div className="w-full h-full bg-slate-800 flex items-center justify-center relative">
                        {/* Elegant visual representation of Tutor Jahid on call */}
                        <div className="w-24 h-24 bg-gradient-to-tr from-[#705d00] to-[#fcd400] text-gray-900 font-display font-black text-4xl flex items-center justify-center border-4 border-white">
                          J
                        </div>
                        <div className="absolute bottom-4 right-4 flex gap-1 items-end h-6">
                          <span className="w-1 bg-green-500 animate-bounce h-2" style={{ animationDelay: '0s' }}></span>
                          <span className="w-1 bg-green-500 animate-bounce h-5" style={{ animationDelay: '0.1s' }}></span>
                          <span className="w-1 bg-green-500 animate-bounce h-3" style={{ animationDelay: '0.2s' }}></span>
                        </div>
                      </div>
                    </div>
                  )}
                  {/* Overlay Labels */}
                  <div className="absolute top-3 left-3 bg-[#214fc7] border border-blue-400 font-mono text-[9px] font-bold tracking-widest px-2 py-0.5 text-white uppercase">
                    TUTOR: MD. JAHIDUL ISLAM (LIVE)
                  </div>
                  <div className="absolute top-3 right-3 bg-red-600 font-mono text-[9px] font-bold px-2 py-0.5 text-white">
                    🔴 AUDIO CONNECTED
                  </div>
                </div>

                {/* Video 2: Student Simulation */}
                <div className="relative bg-[#1e293b] aspect-video border border-[#e9ecef] overflow-hidden flex items-center justify-center text-white">
                  {!cameraOn ? (
                    <div className="flex flex-col items-center">
                      <VideoOff className="w-10 h-10 text-gray-500 mb-2" />
                      <span className="font-sans text-xs text-gray-400">Your camera is off</span>
                    </div>
                  ) : (
                    <div className="absolute inset-0 z-0">
                      <div className="w-full h-full bg-slate-900 flex items-center justify-center">
                        <div className="w-20 h-20 bg-[#214fc7] text-white font-display font-bold text-3xl flex items-center justify-center border-2 border-white">
                          S
                        </div>
                      </div>
                    </div>
                  )}
                  {/* Overlay Labels */}
                  <div className="absolute top-3 left-3 bg-gray-900 font-mono text-[9px] font-bold tracking-widest px-2 py-0.5 text-white uppercase">
                    YOU: STUDENT FEED
                  </div>
                  <div className="absolute bottom-3 left-3 flex items-center gap-2">
                    <button
                      onClick={() => setMicOn(!micOn)}
                      className={`p-1.5 ${micOn ? 'bg-gray-800 hover:bg-gray-700' : 'bg-red-600'} text-white rounded-none cursor-pointer`}
                    >
                      {micOn ? <Mic className="w-3.5 h-3.5" /> : <MicOff className="w-3.5 h-3.5" />}
                    </button>
                    <button
                      onClick={() => setCameraOn(!cameraOn)}
                      className={`p-1.5 ${cameraOn ? 'bg-gray-800 hover:bg-gray-700' : 'bg-red-600'} text-white rounded-none cursor-pointer`}
                    >
                      {cameraOn ? <Video className="w-3.5 h-3.5" /> : <VideoOff className="w-3.5 h-3.5" />}
                    </button>
                  </div>
                </div>

              </div>

              {/* Working Digital Whiteboard Canvas */}
              <div className="bg-white border border-[#e9ecef]">
                {/* Whiteboard toolbar */}
                <div className="bg-gray-50 border-b border-[#e9ecef] px-4 py-3 flex flex-wrap items-center justify-between gap-3">
                  <div className="flex items-center gap-3">
                    <span className="font-display font-bold text-gray-800 text-xs uppercase tracking-wide">
                      Digital Whiteboard (ডিজিটাল হোয়াইটবোর্ড)
                    </span>
                  </div>
                  
                  {/* Drawing Controls */}
                  <div className="flex items-center gap-2">
                    {/* Pen Mode */}
                    <button
                      onClick={() => setTool('pen')}
                      className={`p-1.5 border ${
                        tool === 'pen' ? 'bg-[#214fc7] border-[#214fc7] text-white' : 'bg-white border-gray-300 text-gray-600 hover:bg-gray-100'
                      } cursor-pointer`}
                      title="Pen Tool"
                    >
                      <PenTool className="w-4 h-4" />
                    </button>
                    {/* Eraser */}
                    <button
                      onClick={() => setTool('eraser')}
                      className={`p-1.5 border ${
                        tool === 'eraser' ? 'bg-[#214fc7] border-[#214fc7] text-white' : 'bg-white border-gray-300 text-gray-600 hover:bg-gray-100'
                      } cursor-pointer`}
                      title="Eraser"
                    >
                      <Eraser className="w-4 h-4" />
                    </button>
                    {/* Color selection */}
                    {tool === 'pen' && (
                      <div className="flex items-center gap-1.5 ml-1 border-l pl-2.5 border-gray-300">
                        {['#1e293b', '#214fc7', '#ef4444', '#10b981'].map((c) => (
                          <button
                            key={c}
                            onClick={() => setColor(c)}
                            className="w-5 h-5 border cursor-pointer border-white hover:scale-110 active:scale-95 transition-transform"
                            style={{ backgroundColor: c, outline: color === c ? `2px solid #214fc7` : 'none' }}
                          />
                        ))}
                      </div>
                    )}
                    {/* Brush Size */}
                    <div className="flex items-center gap-1 border-l pl-2.5 border-gray-300">
                      <span className="text-[10px] text-gray-400 font-bold uppercase">Size:</span>
                      <select
                        value={lineWidth}
                        onChange={(e) => setLineWidth(Number(e.target.value))}
                        className="bg-white border border-gray-300 font-mono text-xs p-1 outline-none"
                      >
                        <option value={2}>2px</option>
                        <option value={4}>4px</option>
                        <option value={8}>8px</option>
                      </select>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => setShowEquationsOverlay(!showEquationsOverlay)}
                      className={`px-2.5 py-1 text-[10px] border font-bold cursor-pointer ${
                        showEquationsOverlay ? 'bg-[#705d00]/10 border-[#705d00] text-[#705d00]' : 'bg-white text-gray-500 border-gray-300'
                      }`}
                    >
                      Equation Grid
                    </button>
                    <button
                      onClick={undoCanvas}
                      className="p-1.5 bg-white border border-gray-300 text-gray-600 hover:bg-gray-100 cursor-pointer"
                      title="Undo"
                    >
                      <RefreshCw className="w-4 h-4" />
                    </button>
                    <button
                      onClick={clearCanvas}
                      className="p-1.5 bg-red-50 border border-red-200 text-red-600 hover:bg-red-100 cursor-pointer"
                      title="Clear Board"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                {/* Whiteboard Canvas container with floating math background */}
                <div className="relative overflow-hidden cursor-crosshair">
                  {showEquationsOverlay && (
                    <div className="absolute inset-0 z-0 pointer-events-none select-none opacity-10">
                      {/* Floating glowing equation grid matching screenshot 1 */}
                      <div className="absolute top-[10%] left-[15%] text-2xl font-serif">{"f(s) = dy/dx = -dy/dx"}</div>
                      <div className="absolute top-[40%] left-[5%] text-xl font-serif">{"f(s*s) = \u222bf(x)dx - 2a)dx"}</div>
                      <div className="absolute bottom-[10%] left-[30%] text-xl font-serif">{"f(.x) = (2s+L)"}</div>
                      <div className="absolute top-[20%] right-[10%] text-3xl font-serif">{"x\u00b2 + y\u00b2 = r\u00b2"}</div>
                      <div className="absolute top-[60%] right-[35%] text-2xl font-serif">{"d = \u221a(1 + r\u00b2)"}</div>
                      <div className="absolute bottom-[20%] right-[15%] text-2xl font-serif">{"\u221a(k - x\u00b2)"}</div>
                    </div>
                  )}
                  <canvas
                    ref={canvasRef}
                    onMouseDown={startDrawing}
                    onMouseMove={draw}
                    onMouseUp={stopDrawing}
                    onMouseLeave={stopDrawing}
                    className="w-full bg-white relative z-10 touch-none block"
                  />
                </div>
              </div>

            </div>

            {/* RIGHT COLUMN: AI Helper & Interactive Quiz Widgets (Lg: col-span-4) */}
            <div className="lg:col-span-4 space-y-6 text-left">
              
              {/* AI Math Helper Chat Widget */}
              <div className="bg-white border border-[#e9ecef] flex flex-col h-[400px]">
                <div className="bg-[#214fc7] text-white p-4 flex items-center justify-between border-b border-[#214fc7]">
                  <div className="flex items-center gap-2">
                    <Sparkles className="w-5 h-5 text-[#fcd400]" />
                    <div>
                      <h3 className="font-display font-black text-sm tracking-wide">
                        AI Math Solver (এআই টিউটর)
                      </h3>
                      <p className="text-[10px] text-blue-200 font-semibold uppercase leading-none mt-1">
                        Powered by Gemini 3.5 Flash
                      </p>
                    </div>
                  </div>
                </div>

                {/* Chat window messaging list */}
                <div className="flex-grow overflow-y-auto p-4 space-y-3 font-sans text-xs">
                  {chatMessages.map((msg) => (
                    <div
                      key={msg.id}
                      className={`flex flex-col max-w-[85%] ${
                        msg.sender === 'student' ? 'ml-auto items-end' : 'mr-auto items-start'
                      }`}
                    >
                      <span className="text-[9px] text-gray-400 font-bold mb-0.5 uppercase tracking-wider">
                        {msg.sender === 'student' ? 'You' : 'Tutor Jahid (AI)'}
                      </span>
                      <div
                        className={`p-3 border ${
                          msg.sender === 'student'
                            ? 'bg-[#214fc7] border-[#214fc7] text-white'
                            : 'bg-gray-50 border-gray-200 text-gray-800'
                        } whitespace-pre-line leading-relaxed`}
                      >
                        {msg.text}
                      </div>
                      <span className="text-[8px] text-gray-400 mt-0.5">{msg.timestamp}</span>
                    </div>
                  ))}
                  {aiLoading && (
                    <div className="flex items-center gap-2 text-gray-500 bg-gray-50 p-3 border border-gray-100 mr-auto">
                      <div className="w-1.5 h-1.5 bg-[#214fc7] rounded-full animate-bounce"></div>
                      <div className="w-1.5 h-1.5 bg-[#214fc7] rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                      <div className="w-1.5 h-1.5 bg-[#214fc7] rounded-full animate-bounce" style={{ animationDelay: '0.4s' }}></div>
                      <span className="text-[10px] font-bold">এআই টিউটর বিশ্লেষণ করছে...</span>
                    </div>
                  )}
                </div>

                {/* Preset Problem click triggers */}
                <div className="p-2 bg-gray-50 border-t border-gray-100 flex gap-1.5 overflow-x-auto select-none shrink-0 scrollbar-none">
                  {presets.map((p, idx) => (
                    <button
                      key={idx}
                      onClick={() => handleSolvePrompt(p.query)}
                      className="px-2.5 py-1 bg-white border border-gray-200 text-gray-600 hover:border-[#214fc7] hover:text-[#214fc7] text-[10px] font-bold tracking-wide whitespace-nowrap cursor-pointer transition-colors"
                    >
                      {p.title}
                    </button>
                  ))}
                </div>

                {/* Chat input block */}
                <div className="p-3 border-t border-gray-200 flex gap-2 shrink-0">
                  <input
                    type="text"
                    placeholder="বীজগণিত বা ক্যালকুলাস প্রশ্ন টাইপ করুন..."
                    value={aiPrompt}
                    onChange={(e) => setAiPrompt(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && handleSolvePrompt()}
                    className="flex-grow border border-gray-300 px-3 py-2 text-xs outline-none focus:border-[#214fc7] font-sans"
                  />
                  <button
                    onClick={() => handleSolvePrompt()}
                    disabled={aiLoading}
                    className="bg-[#214fc7] text-white p-2.5 hover:bg-gray-900 transition-colors cursor-pointer"
                  >
                    <Send className="w-4 h-4" />
                  </button>
                </div>
              </div>

              {/* Smart Quiz Widget */}
              <div className="bg-white border border-[#e9ecef] p-5">
                <div className="flex items-center gap-2 text-[#214fc7] mb-4">
                  <Award className="w-5 h-5 text-[#fcd400]" />
                  <h3 className="font-display font-black text-sm uppercase tracking-wide">
                    AI Mathematics Quiz (ম্যাথ কুইজ)
                  </h3>
                </div>

                {quizzes.length === 0 ? (
                  <div className="space-y-4">
                    <p className="font-sans text-xs text-gray-500 leading-relaxed">
                      এআই মডেল দিয়ে আপনার মেধা যাচাই করার জন্য তাৎক্ষণিক ৩-৫টি এমসিকিউ প্রশ্ন তৈরি করে নিন এবং সমাধান বুঝে নিন।
                    </p>
                    <div className="grid grid-cols-2 gap-2">
                      <div>
                        <label className="block text-[9px] font-bold text-gray-400 uppercase tracking-widest mb-1">টপিক</label>
                        <select
                          value={quizTopic}
                          onChange={(e) => setQuizTopic(e.target.value)}
                          className="w-full bg-white border border-gray-300 font-sans text-xs p-1.5 outline-none"
                        >
                          <option value="Algebra">বীজগণিত (Algebra)</option>
                          <option value="Calculus">ক্যালকুলাস (Calculus)</option>
                          <option value="Trigonometry">ত্রিকোণমিতি (Trigonometry)</option>
                          <option value="Geometry">জ্যামিতি (Geometry)</option>
                        </select>
                      </div>
                      <div>
                        <label className="block text-[9px] font-bold text-gray-400 uppercase tracking-widest mb-1">কঠিনতা</label>
                        <select
                          value={quizDifficulty}
                          onChange={(e) => setQuizDifficulty(e.target.value)}
                          className="w-full bg-white border border-gray-300 font-sans text-xs p-1.5 outline-none"
                        >
                          <option value="Easy">সহজ (Easy)</option>
                          <option value="Medium">মাঝারি (Medium)</option>
                          <option value="Hard">কঠিন (Hard)</option>
                        </select>
                      </div>
                    </div>
                    <button
                      onClick={generateQuiz}
                      disabled={quizLoading}
                      className="w-full bg-[#fcd400] text-gray-900 hover:bg-[#214fc7] hover:text-white border-2 border-[#fcd400] hover:border-[#214fc7] font-sans text-xs font-bold tracking-widest py-2.5 transition-all cursor-pointer flex items-center justify-center gap-2"
                    >
                      {quizLoading ? (
                        <>
                          <RefreshCw className="w-4 h-4 animate-spin" />
                          কুইজ জেনারেট হচ্ছে...
                        </>
                      ) : (
                        'কুইজ শুরু করুন (GENERATE QUIZ)'
                      )}
                    </button>
                  </div>
                ) : quizCompleted ? (
                  <div className="text-center py-6 space-y-4">
                    <div className="text-4xl">🏆</div>
                    <h4 className="font-display font-black text-gray-900 text-base">কুইজ সম্পন্ন হয়েছে!</h4>
                    <p className="font-sans text-xs text-gray-600">
                      আপনার স্কোর: <strong className="text-[#214fc7] text-sm">{quizScore} / {quizzes.length}</strong>
                    </p>
                    <button
                      onClick={() => setQuizzes([])}
                      className="bg-[#214fc7] text-white font-sans text-xs font-bold tracking-widest px-6 py-2 border-2 border-[#214fc7] cursor-pointer hover:bg-gray-900"
                    >
                      পুনরায় খেলুন
                    </button>
                  </div>
                ) : (
                  <div className="space-y-4 text-xs font-sans">
                    <div className="flex justify-between items-center text-gray-400 font-mono text-[10px] font-bold">
                      <span>QUESTION {currentQuizIdx + 1} OF {quizzes.length}</span>
                      <span>SCORE: {quizScore}</span>
                    </div>

                    {/* Question text */}
                    <p className="font-sans font-bold text-gray-800 leading-relaxed bg-gray-50 p-3 border border-gray-100">
                      {quizzes[currentQuizIdx].question}
                    </p>

                    {/* Options list */}
                    <div className="space-y-2">
                      {quizzes[currentQuizIdx].options.map((opt, i) => {
                        const isSelected = selectedAnswer === i;
                        const isCorrect = i === quizzes[currentQuizIdx].correctAnswer;
                        const showsRight = selectedAnswer !== null && isCorrect;
                        const showsWrong = selectedAnswer !== null && isSelected && !isCorrect;

                        return (
                          <button
                            key={i}
                            onClick={() => handleSelectAnswer(i)}
                            disabled={selectedAnswer !== null}
                            className={`w-full text-left p-3 border font-sans font-semibold flex items-center justify-between cursor-pointer transition-all ${
                              showsRight
                                ? 'bg-green-50 border-green-500 text-green-800'
                                : showsWrong
                                ? 'bg-red-50 border-red-500 text-red-800'
                                : isSelected
                                ? 'bg-[#214fc7] border-[#214fc7] text-white'
                                : 'bg-white border-[#e9ecef] hover:border-gray-400 text-gray-700'
                            }`}
                          >
                            <span>{i + 1}. {opt}</span>
                            {showsRight && <Check className="w-4 h-4 text-green-600" />}
                            {showsWrong && <AlertCircle className="w-4 h-4 text-red-600" />}
                          </button>
                        );
                      })}
                    </div>

                    {/* Step-by-step Tutor Explanation */}
                    {showExplanation && (
                      <div className="bg-blue-50/50 border border-blue-200 p-4 space-y-2">
                        <span className="font-sans font-bold text-[#214fc7] text-[10px] uppercase tracking-wider flex items-center gap-1">
                          <HelpCircle className="w-3.5 h-3.5" />
                          টিউটর জাহিদ এর সমাধান ব্যাখ্যা:
                        </span>
                        <p className="font-sans text-gray-700 leading-relaxed leading-normal text-xs whitespace-pre-line">
                          {quizzes[currentQuizIdx].explanation}
                        </p>
                        <button
                          onClick={handleNextQuiz}
                          className="mt-3 w-full bg-[#214fc7] text-white font-sans text-[10px] font-bold tracking-widest py-2 transition-all hover:bg-gray-900 cursor-pointer text-center uppercase"
                        >
                          {currentQuizIdx < quizzes.length - 1 ? 'Next Question' : 'Finish Quiz'}
                        </button>
                      </div>
                    )}
                  </div>
                )}
              </div>

            </div>

          </div>
        ) : (
          <div className="flex flex-col items-center justify-center py-20 bg-white border border-[#e9ecef] text-center p-8 max-w-[600px] mx-auto">
            <VideoOff className="w-16 h-16 text-gray-300 mb-4" />
            <h3 className="font-display font-black text-gray-900 text-xl mb-2">ভার্চুয়াল ক্লাস অফলাইন</h3>
            <p className="font-sans text-gray-500 text-sm mb-6 leading-relaxed">
              আপনি লাইভ ক্লাসরুম থেকে ডিসকানেক্ট হয়েছেন। টিউটর জাহিদ-এর সাথে ক্লাসে জয়েন করতে নিচের বাটনে ক্লিক করুন।
            </p>
            <button
              onClick={() => setClassActive(true)}
              className="bg-[#214fc7] text-white hover:bg-[#191c1d] font-sans text-xs font-bold tracking-widest px-8 py-3.5 border-2 border-[#214fc7] transition-all cursor-pointer"
            >
              জয়েন লাইভ ক্লাস (JOIN LIVE CLASS)
            </button>
          </div>
        )}

      </div>
    </section>
  );
}
