import React from 'react';
import { Search, Bell, Settings, HelpCircle } from 'lucide-react';

export default function TopNav() {
  return (
    <header className="sticky top-0 z-40 flex h-16 w-full items-center justify-between border-b border-slate-200 bg-white/80 px-6 backdrop-blur-md">
      <div className="flex flex-1 items-center gap-4">
        <div className="relative w-full max-w-md">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
          <input 
            type="text" 
            placeholder="Tìm kiếm nhân viên, mã NV..." 
            className="w-full rounded-xl border-transparent bg-slate-100 py-2 pl-10 pr-4 text-sm transition-all focus:border-green-600 focus:bg-white focus:ring-0"
          />
        </div>
      </div>

      <div className="flex items-center gap-2">
        <div className="flex gap-1 pr-2">
          <button className="relative rounded-full p-2 text-slate-600 transition-colors hover:bg-slate-50">
            <Bell className="h-5 w-5" />
            <span className="absolute right-2 top-2 h-2 w-2 rounded-full border-2 border-white bg-red-500"></span>
          </button>
          <button className="rounded-full p-2 text-slate-600 transition-colors hover:bg-slate-50">
            <Settings className="h-5 w-5" />
          </button>
          <button className="rounded-full p-2 text-slate-600 transition-colors hover:bg-slate-50">
            <HelpCircle className="h-5 w-5" />
          </button>
        </div>
        <div className="mx-2 h-6 w-px bg-slate-200"></div>
        <div className="flex items-center gap-3 pl-2">
          <img 
            src="https://sagrifood.com.vn/wp-content/uploads/2018/06/logo-sagrifood.png" 
            alt="Logo" 
            className="h-10 w-auto object-contain"
          />
          <span className="text-xl font-black tracking-tight text-green-700 border-l border-slate-200 pl-3">HRM</span>
        </div>
      </div>
    </header>
  );
}
