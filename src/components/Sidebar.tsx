import { 
  LayoutDashboard, 
  Users, 
  FileText, 
  ShieldCheck, 
  Award, 
  BarChart3, 
  Settings, 
  Plus,
  LogOut
} from 'lucide-react';
import { cn } from '@/src/lib/utils';
import { auth } from '@/src/lib/firebase';
import { signOut } from 'firebase/auth';
import { Tooltip } from './ui/Tooltip';

interface SidebarProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  userProfile: any;
}

const menuItems = [
  { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard, roles: ['admin', 'giam_doc', 'phong_tchc', 'phong_kinh_doanh', 'to_truong'] },
  { id: 'employees', label: 'Nhân sự', icon: Users, roles: ['admin', 'giam_doc', 'phong_tchc'] },
  { id: 'contract', label: 'Hợp đồng', icon: FileText, roles: ['admin', 'giam_doc', 'phong_tchc'] },
  { id: 'payroll_insurance', label: 'Bảo hiểm & Lương', icon: ShieldCheck, roles: ['admin', 'giam_doc', 'phong_tchc'] },
  { id: 'allowance', label: 'Phụ cấp', icon: Award, roles: ['admin', 'giam_doc', 'phong_tchc'] },
  { id: 'reports', label: 'Báo cáo', icon: BarChart3, roles: ['admin', 'giam_doc', 'phong_tchc', 'phong_kinh_doanh'] },
];

export default function Sidebar({ activeTab, setActiveTab, userProfile }: SidebarProps) {
  const filteredMenuItems = menuItems.filter(item => 
    !item.roles || item.roles.includes(userProfile?.role)
  );

  return (
    <aside className="fixed left-0 top-0 hidden h-screen w-64 flex-col border-r border-slate-200 bg-white py-4 lg:flex z-50">
      <div className="mb-10 flex items-center gap-3 px-6">
        <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-white shadow-xl shadow-green-100 ring-1 ring-slate-100">
          <img 
            src="https://www.sagrifood.com.vn/wp-content/uploads/2018/06/logo-sagrifood.png" 
            alt="Sagrifood Logo" 
            className="h-10 w-auto object-contain"
            referrerPolicy="no-referrer"
          />
        </div>
        <div>
          <h1 className="text-sm font-black leading-tight text-slate-800 uppercase italic">Quản trị Nhân sự</h1>
          <p className="text-[9px] font-bold uppercase tracking-widest text-slate-400 italic">Hệ thống AgriCore</p>
        </div>
      </div>

      <nav className="flex-1 space-y-1 px-3">
        {filteredMenuItems.map((item) => {
          const Icon = item.icon;
          const isActive = activeTab === item.id || (item.id === 'employees' && activeTab === 'employees');
          return (
            <Tooltip key={item.id} content={item.label} position="right" className="w-full">
              <button
                onClick={() => setActiveTab(item.id)}
                className={cn(
                  "group relative flex w-full items-center gap-3 rounded-2xl px-4 py-3.5 font-sans text-sm font-black italic transition-all duration-300",
                  isActive 
                    ? "bg-green-50 text-green-700" 
                    : "text-slate-400 hover:bg-slate-50 hover:text-slate-600"
                )}
              >
                {isActive && <div className="absolute left-0 h-6 w-1 rounded-r-full bg-green-600" />}
                <Icon className={cn("h-5 w-5 transition-transform duration-300 group-hover:scale-110", isActive ? "text-green-600" : "text-slate-300")} />
                <span className="tracking-tight uppercase">{item.label}</span>
              </button>
            </Tooltip>
          );
        })}
      </nav>

      <div className="mt-auto px-4 space-y-3">
        {['admin', 'phong_tchc'].includes(userProfile?.role) && (
          <button className="flex w-full items-center justify-center gap-3 rounded-2xl bg-green-900 py-4 text-xs font-black italic text-white transition-all hover:bg-green-950 active:scale-[0.98] shadow-2xl shadow-green-200 uppercase">
            <Plus className="h-4 w-4" />
            Thêm nhân sự mới
          </button>
        )}
        
        <div className="rounded-3xl bg-slate-50 p-4 border border-slate-100 ring-1 ring-black/5">
          <div className="flex items-center gap-3 mb-3">
            <div className="h-10 w-10 rounded-2xl overflow-hidden border-2 border-white shadow-sm ring-1 ring-slate-100">
              {userProfile?.photoURL ? (
                <img src={userProfile.photoURL} alt="User" className="h-full w-full object-cover" referrerPolicy="no-referrer" />
              ) : (
                <div className="h-full w-full flex items-center justify-center bg-slate-100 text-slate-400 font-bold">
                  {userProfile?.displayName?.charAt(0) || 'U'}
                </div>
              )}
            </div>
            <div className="overflow-hidden">
              <p className="truncate text-xs font-black text-slate-900 italic leading-none mb-1">{userProfile?.displayName || 'User'}</p>
              <p className="truncate text-[9px] font-bold text-slate-400 italic">
                {userProfile?.role === 'admin' ? 'Quản trị viên' : 
                 userProfile?.role === 'giam_doc' ? 'Giám đốc' :
                 userProfile?.role === 'phong_tchc' ? 'P. Tổ chức Hành chính' :
                 userProfile?.role === 'phong_kinh_doanh' ? 'P. Kinh doanh' :
                 userProfile?.role === 'to_truong' ? 'Tổ trưởng' : 'Nhân viên'}
              </p>
            </div>
          </div>
          <button 
            onClick={() => signOut(auth)}
            className="flex w-full items-center justify-center gap-2 rounded-xl bg-white/50 py-2.5 text-[10px] font-black text-red-400 uppercase italic transition-all hover:bg-red-50 hover:text-red-600"
          >
            <LogOut className="h-3 w-3" />
            Đăng xuất
          </button>
        </div>
      </div>
    </aside>
  );
}

