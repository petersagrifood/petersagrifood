import React, { useState } from 'react';
import { 
  Home, 
  CalendarCheck, 
  Users, 
  BarChart3, 
  User, 
  Menu, 
  MapPin, 
  Fingerprint, 
  History,
  ChevronLeft,
  ChevronRight,
  LocateFixed,
  Plus,
  Scale
} from 'lucide-react';
import { cn } from '@/src/lib/utils';

type MobileTab = 'home' | 'attendance' | 'schedule' | 'profile';

export default function MobileApp() {
  const [tab, setTab] = useState<MobileTab>('attendance');

  return (
    <div className="mx-auto max-w-md min-h-screen bg-slate-50 flex flex-col shadow-2xl relative overflow-hidden ring-1 ring-slate-200">
      <header className="fixed top-0 w-full max-w-md z-50 bg-green-600 text-white shadow-md flex items-center justify-between px-4 h-16">
        <div className="flex items-center gap-3">
          <Menu className="h-6 w-6 cursor-pointer" />
          <h1 className="font-sans text-lg font-bold tracking-tight">Chấm Công GPS</h1>
        </div>
        <div className="h-10 w-10 rounded-full border-2 border-white/20 overflow-hidden">
          <img src="https://images.unsplash.com/photo-1599566150163-29194dcaad36?auto=format&fit=crop&q=80&w=100" alt="Avatar" className="h-full w-full object-cover" />
        </div>
      </header>

      <main className="flex-1 pt-16 pb-20">
        <div className="bg-slate-100/50 backdrop-blur-sm px-4 py-3 flex justify-between items-center">
          <div className="flex flex-col">
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest leading-none">Giờ hiện tại</span>
            <span className="text-2xl font-black text-green-600 mt-1">08:42:15</span>
          </div>
          <div className="flex flex-col items-end">
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest leading-none">Độ chính xác GPS</span>
            <div className="flex items-center gap-1 mt-1 text-green-600">
              <LocateFixed className="h-3 w-3" />
              <span className="text-[10px] font-black">+/- 3m (Rất tốt)</span>
            </div>
          </div>
        </div>

        <section className="relative h-[280px] w-full overflow-hidden bg-slate-200">
          <img 
            src="https://images.unsplash.com/photo-1526778548025-fa2f459cd5c1?auto=format&fit=crop&q=80&w=800" 
            alt="Map"
            className="w-full h-full object-cover"
          />
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
            <div className="relative flex items-center justify-center">
              <div className="absolute w-20 h-20 bg-green-500/20 rounded-full animate-ping"></div>
              <div className="absolute w-10 h-10 bg-green-500/30 rounded-full"></div>
              <div className="relative bg-white p-1 rounded-full shadow-lg border-2 border-green-600">
                <MapPin className="h-6 w-6 text-green-600 fill-green-600" />
              </div>
            </div>
          </div>
          <div className="absolute inset-x-0 bottom-0 h-16 bg-gradient-to-t from-slate-50 to-transparent pointer-events-none"></div>
          
          <div className="absolute bottom-4 right-4 flex flex-col gap-2">
            <button className="h-10 w-10 rounded-lg bg-white shadow-md flex items-center justify-center text-slate-700 active:scale-90 transition-transform"><Plus className="h-5 w-5" /></button>
            <button className="h-10 w-10 rounded-lg bg-green-600 shadow-md flex items-center justify-center text-white active:scale-90 transition-transform"><LocateFixed className="h-5 w-5" /></button>
          </div>
        </section>

        <div className="px-4 -mt-8 relative z-10">
          <div className="bg-white p-4 rounded-2xl shadow-xl border border-slate-100">
            <div className="flex items-start justify-between mb-4">
              <div className="flex gap-3">
                <div className="h-10 w-10 rounded-xl bg-green-50 flex items-center justify-center text-green-600">
                  <MapPin className="h-5 w-5 fill-green-600" />
                </div>
                <div>
                  <h2 className="text-lg font-bold text-slate-900 leading-tight">Vincom Center Đồng Khởi</h2>
                  <p className="text-xs text-slate-500">72 Lê Thánh Tôn, Bến Nghé, Quận 1</p>
                </div>
              </div>
              <div className="flex items-center gap-1 rounded-full bg-green-100 px-2 py-0.5 text-[9px] font-black text-green-700">
                <div className="h-1.5 w-1.5 rounded-full bg-green-600 animate-pulse"></div>
                Trong vùng
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4 border-t border-slate-50 pt-4">
              <div>
                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Khoảng cách</p>
                <div className="flex items-center gap-1 mt-1 text-slate-700">
                  <Navigation className="h-3 w-3 rotate-45" />
                  <span className="font-bold text-sm">15m đến tâm điểm</span>
                </div>
              </div>
              <div>
                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Bán kính an toàn</p>
                <div className="flex items-center gap-1 mt-1 text-slate-700">
                  <Scale className="h-3 w-3" />
                  <span className="font-bold text-sm">100m chuẩn</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="px-4 mt-8 flex flex-col gap-4">
          <button className="w-full h-16 bg-green-600 text-white rounded-2xl shadow-lg shadow-green-200 flex items-center justify-center gap-3 active:translate-y-0.5 active:shadow-sm transition-all overflow-hidden group">
            <Fingerprint className="h-8 w-8 transition-transform group-active:scale-125" />
            <span className="text-lg font-black uppercase tracking-widest">Chấm Công Vào</span>
          </button>
          <button className="w-full h-14 bg-white border-2 border-green-600 text-green-600 rounded-2xl flex items-center justify-center gap-2 active:bg-green-50 transition-colors font-bold">
            <History className="h-5 w-5" />
            Xem Lịch Sử Chấm Công
          </button>
        </div>

        <div className="px-4 mt-8 mb-8">
          <h3 className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-3 px-1">Thông tin phiên làm việc</h3>
          <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden divide-y divide-slate-50">
            {[
              { label: 'Ca làm việc', value: 'Hành chính (08:00 - 17:00)', color: 'text-slate-900' },
              { label: 'Trạng thái', value: 'Chưa chấm công vào', color: 'text-red-500' },
              { label: 'Mã nhân viên', value: 'SF-2024-0892', color: 'text-slate-900' }
            ].map((row, idx) => (
              <div key={idx} className="p-4 flex justify-between items-center">
                <span className="text-xs font-medium text-slate-500">{row.label}</span>
                <span className={cn("text-xs font-bold", row.color)}>{row.value}</span>
              </div>
            ))}
          </div>
        </div>
      </main>

      <nav className="fixed bottom-0 w-full max-w-md h-16 bg-white border-t border-slate-100 flex items-center justify-around px-2 z-50">
        {[
          { id: 'home', label: 'Trang chủ', icon: Home },
          { id: 'attendance', label: 'Chấm công', icon: MapPin },
          { id: 'schedule', label: 'Lịch sử', icon: CalendarCheck },
          { id: 'profile', label: 'Cá nhân', icon: User }
        ].map((item) => (
          <button 
            key={item.id}
            onClick={() => setTab(item.id as MobileTab)}
            className={cn(
              "flex flex-col items-center justify-center gap-1 transition-all h-full w-20",
              tab === item.id ? "text-green-600" : "text-slate-400"
            )}
          >
            <item.icon className={cn("h-5 w-5", tab === item.id && "fill-green-500/20")} />
            <span className="text-[10px] font-black uppercase tracking-tight">{item.label}</span>
            {tab === item.id && <div className="h-1 w-1 rounded-full bg-green-600"></div>}
          </button>
        ))}
      </nav>
    </div>
  );
}

const Navigation = ({ className }: { className?: string }) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <polygon points="3 11 22 2 13 21 11 13 3 11" />
  </svg>
);
