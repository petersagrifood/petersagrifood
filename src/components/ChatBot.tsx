import React, { useState, useRef, useEffect } from 'react';
import { 
  MessageCircle, 
  X, 
  Send, 
  Bot, 
  User, 
  Loader2,
  Minimize2,
  Maximize2,
  Sparkles
} from 'lucide-react';
import { chatWithHR } from '@/src/services/aiService';
import { motion, AnimatePresence } from 'motion/react';
import { cn } from '@/src/lib/utils';

export default function ChatBot() {
  const [isOpen, setIsOpen] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);
  const [input, setInput] = useState('');
  const [messages, setMessages] = useState<{ role: 'user' | 'model', text: string }[]>([
    { role: 'model', text: 'Chào bạn! Tôi là SagriBot. Tôi có thể giúp gì cho bạn về vấn đề nhân sự hôm nay?' }
  ]);
  const [loading, setLoading] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  const handleSend = async () => {
    if (!input.trim() || loading) return;

    const userMsg = input.trim();
    setInput('');
    setMessages(prev => [...prev, { role: 'user', text: userMsg }]);
    setLoading(true);

    try {
      const response = await chatWithHR(userMsg, []);
      setMessages(prev => [...prev, { role: 'model', text: response }]);
    } catch (error) {
      setMessages(prev => [...prev, { role: 'model', text: 'Xin lỗi, tôi gặp sự cố kết nối.' }]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed bottom-6 right-6 z-[60] flex flex-col items-end">
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ 
              opacity: 1, 
              scale: 1, 
              y: 0,
              height: isMinimized ? '64px' : '500px'
            }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            className="w-[380px] bg-white rounded-3xl shadow-2xl border border-slate-200 overflow-hidden flex flex-col mb-4"
          >
            {/* Header */}
            <div className="p-4 bg-green-600 text-white flex items-center justify-between shadow-lg">
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 bg-white/20 rounded-xl flex items-center justify-center backdrop-blur-md">
                  <Bot className="h-6 w-6" />
                </div>
                <div>
                  <h3 className="font-bold text-sm">SagriBot AI</h3>
                  <div className="flex items-center gap-1">
                    <div className="h-1.5 w-1.5 rounded-full bg-green-300 animate-pulse"></div>
                    <span className="text-[10px] font-medium text-green-100">Đang trực tuyến</span>
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-1">
                <button 
                  onClick={() => setIsMinimized(!isMinimized)}
                  className="p-2 hover:bg-white/10 rounded-lg transition-colors"
                >
                  {isMinimized ? <Maximize2 className="h-4 w-4" /> : <Minimize2 className="h-4 w-4" />}
                </button>
                <button 
                  onClick={() => setIsOpen(false)}
                  className="p-2 hover:bg-white/10 rounded-lg transition-colors"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>
            </div>

            {/* Chat Content */}
            {!isMinimized && (
              <>
                <div 
                  ref={scrollRef}
                  className="flex-1 overflow-y-auto p-4 space-y-4 bg-slate-50"
                >
                  {messages.map((m, i) => (
                    <div 
                      key={i} 
                      className={cn(
                        "flex gap-3 max-w-[85%]",
                        m.role === 'user' ? "ml-auto flex-row-reverse" : ""
                      )}
                    >
                      <div className={cn(
                        "h-8 w-8 rounded-lg shrink-0 flex items-center justify-center",
                        m.role === 'user' ? "bg-slate-200 text-slate-600" : "bg-green-100 text-green-700"
                      )}>
                        {m.role === 'user' ? <User className="h-4 w-4" /> : <Bot className="h-4 w-4" />}
                      </div>
                      <div className={cn(
                        "p-3 rounded-2xl text-sm leading-relaxed",
                        m.role === 'user' ? "bg-green-600 text-white rounded-tr-none shadow-md shadow-green-100" : "bg-white text-slate-700 border border-slate-200 rounded-tl-none shadow-sm"
                      )}>
                        {m.text}
                      </div>
                    </div>
                  ))}
                  {loading && (
                    <div className="flex gap-3 max-w-[85%] animate-pulse">
                      <div className="h-8 w-8 rounded-lg bg-green-100 text-green-700 flex items-center justify-center">
                        <Bot className="h-4 w-4" />
                      </div>
                      <div className="p-3 rounded-2xl text-sm bg-white border border-slate-200 rounded-tl-none shadow-sm flex items-center gap-2">
                        <Loader2 className="h-4 w-4 animate-spin" />
                        Đang suy nghĩ...
                      </div>
                    </div>
                  )}
                </div>

                {/* Input */}
                <div className="p-4 bg-white border-t border-slate-100">
                  <div className="relative flex items-center">
                    <input 
                      type="text" 
                      value={input}
                      onChange={(e) => setInput(e.target.value)}
                      onKeyDown={(e) => e.key === 'Enter' && handleSend()}
                      placeholder="Hỏi về lương, phép, chấm công..."
                      className="w-full pl-4 pr-12 py-3 bg-slate-50 border border-slate-200 rounded-2xl text-sm outline-none focus:ring-2 focus:ring-green-500/20 focus:border-green-600 transition-all"
                    />
                    <button 
                      onClick={handleSend}
                      disabled={!input.trim() || loading}
                      className="absolute right-2 p-2 bg-green-600 text-white rounded-xl shadow-md hover:bg-green-700 disabled:bg-slate-300 transition-all"
                    >
                      <Send className="h-4 w-4" />
                    </button>
                  </div>
                  <p className="text-[10px] text-slate-400 text-center mt-2 flex items-center justify-center gap-1">
                    <Sparkles className="h-3 w-3" />
                    Powered by Gemini 3 Flash
                  </p>
                </div>
              </>
            )}
          </motion.div>
        )}
      </AnimatePresence>

      <button
        onClick={() => setIsOpen(!isOpen)}
        className={cn(
          "h-16 w-16 rounded-full flex items-center justify-center shadow-2xl transition-all hover:scale-110 active:scale-95 group",
          isOpen ? "bg-slate-900 text-white" : "bg-green-600 text-white shadow-green-100"
        )}
      >
        <AnimatePresence mode="wait">
          {isOpen ? (
            <motion.div key="close" initial={{ rotate: -90 }} animate={{ rotate: 0 }} exit={{ rotate: 90 }}>
              <X className="h-7 w-7" />
            </motion.div>
          ) : (
            <motion.div key="open" initial={{ rotate: 90 }} animate={{ rotate: 0 }} exit={{ rotate: -90 }} className="relative">
              <MessageCircle className="h-7 w-7" />
              <div className="absolute -top-1 -right-1 h-4 w-4 bg-red-500 border-2 border-green-600 rounded-full animate-bounce"></div>
            </motion.div>
          )}
        </AnimatePresence>
      </button>
    </div>
  );
}
