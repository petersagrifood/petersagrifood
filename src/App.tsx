import React, { useState, useEffect } from 'react';
import Sidebar from './components/Sidebar';
import TopNav from './components/TopNav';
import Dashboard from './views/Dashboard';
import EmployeeList from './views/EmployeeList';
import Attendance from './views/Attendance';
import Reports from './views/Reports';
import MobileApp from './views/MobileApp';
import Login from './views/Login';
import Approvals from './views/Approvals';
import Settings from './views/Settings';
import Payroll from './views/Payroll';
import Compliance from './views/Compliance';
import { Smartphone, Monitor, Loader2 } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { auth } from './lib/firebase';
import { onAuthStateChanged, User } from 'firebase/auth';

export default function App() {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [viewMode, setViewMode] = useState<'desktop' | 'mobile'>('desktop');
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setUser(user);
      setLoading(false);
    });
    return () => unsubscribe();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center gap-4">
        <Loader2 className="h-10 w-10 text-green-600 animate-spin" />
        <p className="text-slate-500 font-bold animate-pulse uppercase tracking-widest text-xs">Đang tải Sagrifood HRM...</p>
      </div>
    );
  }

  if (!user) {
    return <Login />;
  }

  if (viewMode === 'mobile') {
    return (
      <div className="min-h-screen bg-slate-900 flex items-center justify-center p-4">
        <div className="relative group">
          <MobileApp />
          <button 
            onClick={() => setViewMode('desktop')}
            className="absolute -right-16 top-0 bg-white p-3 rounded-full shadow-xl text-slate-800 hover:scale-110 active:scale-95 transition-all opacity-0 group-hover:opacity-100"
            title="Sáng chế tác"
          >
            <Monitor className="h-6 w-6" />
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 font-sans text-slate-900 selection:bg-green-100 selection:text-green-900">
      <Sidebar activeTab={activeTab} setActiveTab={setActiveTab} />
      
      <main className="lg:ml-64 min-h-screen flex flex-col">
        <TopNav />
        
        <div className="flex-1 relative">
          <AnimatePresence mode="wait">
            <motion.div
              key={activeTab}
              initial={{ opacity: 0, x: 10 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -10 }}
              transition={{ duration: 0.2 }}
              className="min-h-full"
            >
              {activeTab === 'dashboard' && <Dashboard />}
              {activeTab === 'employees' && <EmployeeList />}
              {activeTab === 'attendance' && <Attendance />}
              {activeTab === 'reports' && <Reports />}
              {activeTab === 'approvals' && <Approvals />}
              {activeTab === 'settings' && <Settings />}
              {activeTab === 'payroll' && <Payroll />}
              {activeTab === 'compliance' && <Compliance />}
              {['other'].includes(activeTab) && (
                <div className="flex flex-col items-center justify-center h-[calc(100vh-64px)] text-slate-400 gap-4">
                  <div className="p-8 rounded-full bg-slate-100">
                    <Monitor className="h-12 w-12" />
                  </div>
                  <h3 className="text-xl font-bold">Tính năng đang được phát triển</h3>
                  <p className="text-sm">Vui lòng quay lại sau</p>
                </div>
              )}
            </motion.div>
          </AnimatePresence>
        </div>
      </main>

      {/* Floating Device Toggle */}
      <button 
        onClick={() => setViewMode('mobile')}
        className="fixed bottom-6 right-6 z-50 flex h-14 w-14 items-center justify-center rounded-full bg-slate-900 text-white shadow-2xl shadow-slate-400 transition-all hover:scale-110 hover:bg-slate-800 active:scale-95"
        title="Xem giao diện mobile"
      >
        <Smartphone className="h-6 w-6" />
      </button>
    </div>
  );
}
