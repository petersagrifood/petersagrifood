import React from 'react';
import { 
  LayoutDashboard, 
  Users, 
  CalendarDays, 
  Banknote, 
  BarChart3, 
  Settings, 
  Plus,
  Leaf,
  CheckCircle,
  LogOut
} from 'lucide-react';
import { cn } from '@/src/lib/utils';
import { auth } from '@/src/lib/firebase';
import { signOut } from 'firebase/auth';

interface SidebarProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
}

const menuItems = [
  { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { id: 'employees', label: 'Nhân sự', icon: Users },
  { id: 'attendance', label: 'Chấm công', icon: CalendarDays },
  { id: 'approvals', label: 'Phê duyệt', icon: CheckCircle },
  { id: 'payroll', label: 'Bảng lương', icon: Banknote },
  { id: 'reports', label: 'Báo cáo', icon: BarChart3 },
  { id: 'settings', label: 'Cấu hình', icon: Settings },
];

export default function Sidebar({ activeTab, setActiveTab }: SidebarProps) {
  return (
    <aside className="fixed left-0 top-0 hidden h-screen w-64 flex-col border-r border-slate-200 bg-slate-50 py-4 lg:flex z-50">
      <div className="mb-8 flex items-center gap-3 px-6">
        <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-green-600 text-white shadow-sm shadow-green-200">
          <Leaf className="h-6 w-6" />
        </div>
        <div>
          <h1 className="text-lg font-black leading-tight text-green-700">Quản trị HRM</h1>
          <p className="text-[10px] font-bold uppercase tracking-widest text-slate-400">Sagrifood Group</p>
        </div>
      </div>

      <nav className="flex-1 space-y-1 px-3">
        {menuItems.map((item) => {
          const Icon = item.icon;
          const isActive = activeTab === item.id;
          return (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              className={cn(
                "flex w-full items-center gap-3 rounded-lg px-3 py-3 font-sans text-sm font-semibold transition-all duration-200",
                isActive 
                  ? "border-r-4 border-green-600 bg-green-50 text-green-700" 
                  : "text-slate-500 hover:bg-slate-100 hover:text-slate-900"
              )}
            >
              <Icon className={cn("h-5 w-5", isActive ? "fill-green-700" : "")} />
              <span>{item.label}</span>
            </button>
          );
        })}
      </nav>

      <div className="mt-auto px-4 space-y-2">
        <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
          <div className="mb-3 flex items-center gap-3">
            <img 
              src={auth.currentUser?.photoURL || "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=100"} 
              alt="User" 
              className="h-10 w-10 rounded-full object-cover border border-slate-100 shadow-sm"
            />
            <div className="overflow-hidden">
              <p className="truncate text-xs font-bold text-slate-900">{auth.currentUser?.displayName || 'Cán bộ quản lý'}</p>
              <p className="truncate text-[10px] text-slate-500">Sagrifood Group</p>
            </div>
          </div>
          <button 
            onClick={() => signOut(auth)}
            className="flex w-full items-center justify-center gap-2 rounded-lg bg-white border border-slate-200 py-2 text-xs font-bold text-slate-600 transition-all hover:bg-slate-50 active:scale-[0.98]"
          >
            <LogOut className="h-4 w-4" />
            Đăng xuất
          </button>
        </div>
        <button className="flex w-full items-center justify-center gap-2 rounded-lg bg-green-600 py-3 text-xs font-bold text-white transition-all hover:bg-green-700 active:scale-[0.98] shadow-lg shadow-green-100">
          <Plus className="h-4 w-4" />
          Thêm nhân sự mới
        </button>
      </div>
    </aside>
  );
}
