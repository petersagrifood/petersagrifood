import { Search, Bell, HelpCircle } from 'lucide-react';

export default function TopNav() {
  return (
    <header className="sticky top-0 z-40 flex h-16 w-full items-center justify-between border-b border-slate-100 bg-white/50 px-8 backdrop-blur-xl">
      <div className="flex flex-1 items-center gap-4">
        <div className="relative w-full max-w-sm">
          <Search className="absolute left-3 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-slate-300" />
          <input 
            type="text" 
            placeholder="Tìm kiếm nhân viên..." 
            className="w-full rounded-2xl border-transparent bg-slate-50 py-2.5 pl-10 pr-4 text-[11px] font-black italic tracking-tight text-slate-900 transition-all focus:border-green-600 focus:bg-white focus:ring-0 placeholder:text-slate-300 placeholder:font-bold"
          />
        </div>
      </div>

      <div className="flex items-center gap-6">
        <div className="flex items-center gap-1">
          <button className="relative group rounded-xl p-2 text-slate-400 transition-all hover:bg-slate-50 hover:text-green-600">
            <Bell className="h-5 w-5 transition-transform group-hover:rotate-12" />
            <span className="absolute right-2.5 top-2.5 h-2 w-2 rounded-full border-2 border-white bg-red-500 shadow-sm"></span>
          </button>
          <button className="rounded-xl p-2 text-slate-400 transition-all hover:bg-slate-50 hover:text-green-600">
            <HelpCircle className="h-5 w-5" />
          </button>
        </div>
        
        <div className="h-4 w-px bg-slate-100"></div>
        
        <div className="flex items-center gap-3">
          <div className="text-right">
            <p className="text-[11px] font-black text-slate-900 italic leading-none mb-1">Admin Sagrifood</p>
            <p className="text-[9px] font-bold text-slate-400 italic">Quản trị viên hệ thống</p>
          </div>
          <div className="h-10 w-10 rounded-2xl overflow-hidden border border-slate-100 shadow-sm ring-1 ring-black/5 bg-slate-50 flex items-center justify-center font-black text-[10px] italic text-slate-300">
            AD
          </div>
        </div>
      </div>
    </header>
  );
}

