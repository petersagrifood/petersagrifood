import React, { useState, useEffect } from 'react';
import { 
  Building2, 
  MapPin, 
  Clock, 
  ShieldCheck, 
  Save,
  RefreshCw,
  Bell,
  Cpu,
  UserCheck,
  CheckCircle2
} from 'lucide-react';
import { motion } from 'motion/react';
import { cn } from '@/src/lib/utils';
import { auth } from '@/src/lib/firebase';
import { getUserProfile, updateUserRole } from '@/src/services/dbService';

const ROLL_OPTIONS = [
  { id: 'nhan_vien', label: 'Nhân viên', desc: 'Chỉ truy cập Mobile App' },
  { id: 'to_truong', label: 'Tổ trưởng', desc: 'Dashboard & Chấm công' },
  { id: 'phong_kinh_doanh', label: 'P. Kinh doanh', desc: 'Dashboard, Reports & Approvals' },
  { id: 'phong_tchc', label: 'P. Tổ chức Hành chính', desc: 'Toàn quyền quản trị nhân sự' },
  { id: 'giam_doc', label: 'Giám đốc', desc: 'Toàn quyền hệ thống' },
];

interface SettingsProps {
  userProfile?: any;
}

export default function Settings({ userProfile: initialProfile }: SettingsProps) {
  const [loading, setLoading] = useState(false);
  const [userProfile, setUserProfile] = useState<any>(initialProfile || null);
  const [updatingRole, setUpdatingRole] = useState(false);

  useEffect(() => {
    const fetchProfile = async () => {
      if (auth.currentUser) {
        const profile = await getUserProfile(auth.currentUser.uid);
        setUserProfile(profile);
      }
    };
    fetchProfile();
  }, []);

  const handleRoleChange = async (role: string) => {
    if (!auth.currentUser) return;
    setUpdatingRole(true);
    try {
      await updateUserRole(auth.currentUser.uid, role);
      setUserProfile((prev: any) => ({ ...prev, role }));
      // Reload page to apply changes
      window.location.reload();
    } catch (error) {
      console.error(error);
    } finally {
      setUpdatingRole(false);
    }
  };

  return (
    <div className="p-8 max-w-4xl mx-auto">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-slate-900">Cấu hình hệ thống</h1>
        <p className="text-slate-500 text-sm mt-1">Thiết lập các thông số vận hành cho toàn bộ Sagrifood Group</p>
      </div>

      <div className="space-y-6">
        {/* Role Simulator Section */}
        <section className="bg-gradient-to-br from-green-900 to-green-950 border border-green-800 rounded-[2.5rem] overflow-hidden shadow-2xl p-8 mb-8">
          <div className="flex items-center gap-3 mb-6">
            <UserCheck className="h-6 w-6 text-green-400" />
            <h2 className="text-xl font-black italic uppercase text-white tracking-tight">Mô phỏng Phân quyền (Demo)</h2>
          </div>
          <p className="text-green-300/80 text-sm italic font-medium mb-8">
            Sagrifood HRM hỗ trợ phân quyền đa cấp. Chọn một vai trò bên dưới để kiểm tra giao diện phù hợp. 
            (Sau khi chọn, hệ thống sẽ tự động tải lại để áp dụng cấu hình).
          </p>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {ROLL_OPTIONS.map((option) => (
              <button
                key={option.id}
                onClick={() => handleRoleChange(option.id)}
                disabled={updatingRole}
                className={cn(
                  "relative p-5 rounded-3xl text-left transition-all border-2 group",
                  userProfile?.role === option.id 
                    ? "bg-white border-green-400 shadow-xl shadow-green-900/20" 
                    : "bg-white/5 border-white/10 hover:bg-white/10"
                )}
              >
                <div className="flex items-center justify-between mb-1">
                  <span className={cn(
                    "text-sm font-black italic uppercase italic tracking-tight",
                    userProfile?.role === option.id ? "text-green-900" : "text-white"
                  )}>
                    {option.label}
                  </span>
                  {userProfile?.role === option.id && <CheckCircle2 className="h-4 w-4 text-green-500" />}
                </div>
                <p className={cn(
                  "text-[10px] font-bold italic",
                  userProfile?.role === option.id ? "text-green-700/60" : "text-white/40"
                )}>
                  {option.desc}
                </p>
                {updatingRole && userProfile?.role === option.id && (
                  <div className="absolute inset-0 bg-white/50 backdrop-blur-sm rounded-3xl flex items-center justify-center">
                    <RefreshCw className="h-5 w-5 animate-spin text-green-900" />
                  </div>
                )}
              </button>
            ))}
          </div>
        </section>

        <section className="bg-white border border-slate-200 rounded-2xl overflow-hidden shadow-sm">
          <div className="px-6 py-4 border-b border-slate-100 flex items-center gap-3 bg-slate-50/50">
            <MapPin className="h-5 w-5 text-green-600" />
            <h2 className="font-bold text-slate-900">Địa giới & Chấm công</h2>
          </div>
          <div className="p-6 grid gap-6 md:grid-cols-2">
            <div>
              <label className="block text-xs font-bold text-slate-400 uppercase tracking-widest mb-2">Bán kính GPS (mét)</label>
              <input 
                type="number" 
                defaultValue={100}
                className="w-full px-4 py-2 bg-white border border-slate-200 rounded-lg text-sm focus:ring-2 focus:ring-green-500/20 focus:border-green-500 outline-none"
              />
              <p className="text-[10px] text-slate-400 mt-2">Khoảng cách tối đa cho phép nhân viên chấm công từ tâm vị trí trạm.</p>
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-400 uppercase tracking-widest mb-2">Xác thực khuôn mặt</label>
              <div className="flex items-center gap-3 h-10">
                <div className="relative inline-flex h-6 w-11 items-center rounded-full bg-green-600 transition-colors">
                  <span className="inline-block h-4 w-4 translate-x-6 rounded-full bg-white transition-transform" />
                </div>
                <span className="text-sm font-medium text-slate-900">Bắt buộc ảnh chụp</span>
              </div>
            </div>
          </div>
        </section>

        <section className="bg-white border border-slate-200 rounded-2xl overflow-hidden shadow-sm">
          <div className="px-6 py-4 border-b border-slate-100 flex items-center gap-3 bg-slate-50/50">
            <Clock className="h-5 w-5 text-blue-600" />
            <h2 className="font-bold text-slate-900">Thời gian biểu</h2>
          </div>
          <div className="p-6 grid gap-6 md:grid-cols-2">
            <div>
              <label className="block text-xs font-bold text-slate-400 uppercase tracking-widest mb-2">Giờ bắt đầu ca chính</label>
              <input type="time" defaultValue="08:00" className="w-full px-4 py-2 border border-slate-200 rounded-lg text-sm outline-none" />
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-400 uppercase tracking-widest mb-2">Giờ kết thúc ca chính</label>
              <input type="time" defaultValue="17:00" className="w-full px-4 py-2 border border-slate-200 rounded-lg text-sm outline-none" />
            </div>
          </div>
        </section>

        <section className="bg-white border border-slate-200 rounded-2xl overflow-hidden shadow-sm">
          <div className="px-6 py-4 border-b border-slate-100 flex items-center gap-3 bg-slate-50/50">
            <ShieldCheck className="h-5 w-5 text-purple-600" />
            <h2 className="font-bold text-slate-900">Bảo mật & Quyền hạn</h2>
          </div>
          <div className="p-6">
            <div className="flex items-center justify-between p-4 bg-slate-50 rounded-xl border border-slate-200">
              <div className="flex items-center gap-4">
                <div className="h-10 w-10 rounded-full bg-white flex items-center justify-center text-purple-600 border border-purple-100 shadow-sm">
                  <Cpu className="h-5 w-5" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-slate-900">Trí tuệ nhân tạo (Gemini AI)</h3>
                  <p className="text-xs text-slate-500">Tự động phân tích hiệu suất và phát hiện gian lận.</p>
                </div>
              </div>
              <div className="relative inline-flex h-6 w-11 items-center rounded-full bg-slate-300">
                <span className="inline-block h-4 w-4 translate-x-1 rounded-full bg-white" />
              </div>
            </div>
          </div>
        </section>

        <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-100">
          <button className="flex items-center gap-2 px-6 py-2.5 text-slate-600 hover:bg-slate-50 rounded-xl font-bold text-sm transition-all">
            <RefreshCw className="h-4 w-4" />
            Đặt lại
          </button>
          <button className="flex items-center gap-2 px-8 py-2.5 bg-green-600 text-white rounded-xl font-bold text-sm shadow-lg shadow-green-200 hover:bg-green-700 transition-all hover:-translate-y-0.5">
            <Save className="h-4 w-4" />
            Lưu cấu hình
          </button>
        </div>
      </div>
    </div>
  );
}
