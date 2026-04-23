import React, { useState } from 'react';
import { 
  LogIn, 
  ShieldCheck, 
  Leaf, 
  ArrowRight,
  AlertCircle
} from 'lucide-react';
import { auth } from '@/src/lib/firebase';
import { signInWithPopup, GoogleAuthProvider } from 'firebase/auth';
import { motion } from 'motion/react';

export default function Login() {
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleLogin = async () => {
    setLoading(true);
    setError(null);
    try {
      const provider = new GoogleAuthProvider();
      await signInWithPopup(auth, provider);
    } catch (err: any) {
      setError('Đăng nhập thất bại. Vui lòng thử lại.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center p-6 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] bg-repeat">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-md w-full bg-white rounded-[2rem] shadow-2xl overflow-hidden border border-slate-100"
      >
        <div className="p-8 pb-0 flex flex-col items-center">
          <div className="h-20 w-20 bg-green-600 rounded-3xl flex items-center justify-center shadow-2xl shadow-green-200 rotate-12 mb-8">
            <Leaf className="h-10 w-10 text-white -rotate-12" />
          </div>
          <h1 className="text-3xl font-black text-slate-900 tracking-tight text-center">
            SAGRIFOOD <span className="text-green-600">HRM</span>
          </h1>
          <p className="text-slate-500 text-center mt-3 font-medium">Hệ thống quản trị nhân sự tập trung</p>
        </div>

        <div className="p-10 pt-12">
          {error && (
            <div className="mb-6 p-4 bg-red-50 border border-red-100 text-red-600 rounded-2xl flex items-center gap-3 text-sm font-bold">
              <AlertCircle className="h-5 w-5" />
              {error}
            </div>
          )}

          <button
            onClick={handleLogin}
            disabled={loading}
            className="group relative w-full h-16 bg-white border-2 border-slate-200 rounded-2xl flex items-center justify-center gap-4 hover:border-green-600 transition-all active:scale-95 disabled:opacity-50"
          >
            <img src="https://www.google.com/favicon.ico" alt="Google" className="h-6 w-6" />
            <span className="text-lg font-bold text-slate-700 bg-white px-2">Đăng nhập với Google</span>
            {loading && (
              <div className="absolute right-6 h-5 w-5 border-2 border-green-600 border-t-transparent rounded-full animate-spin" />
            )}
          </button>

          <div className="mt-10 pt-10 border-t border-slate-50 flex flex-col items-center gap-4">
            <div className="flex items-center gap-2 text-slate-400">
              <ShieldCheck className="h-4 w-4" />
              <span className="text-xs font-bold uppercase tracking-widest">Hệ thống nội bộ bảo mật</span>
            </div>
            <p className="text-[10px] text-slate-400 text-center max-w-[240px] leading-relaxed">
              Vui lòng sử dụng email công ty được cấp bởi Sagrifood để truy cập hệ thống.
            </p>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
