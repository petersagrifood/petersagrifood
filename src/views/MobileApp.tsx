import React, { useState, useEffect } from 'react';
import { 
  Home, 
  BarChart3, 
  User, 
  Menu, 
  MapPin, 
  Fingerprint, 
  History,
  Users,
  ChevronLeft,
  ChevronRight,
  Plus,
  ArrowRight,
  CheckCircle2,
  Clock,
  Briefcase,
  AlertCircle,
  Bell,
  Map,
  X,
  Camera,
  Navigation,
  Scale,
  Loader2,
  Check,
  Sun,
  Waves,
  Moon,
  CalendarDays,
  Award,
  Calendar,
  Gift,
  XCircle,
  Search
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { cn } from '@/src/lib/utils';
import { 
  getEmployees, 
  addEmployee, 
  updateEmployee, 
  deleteEmployee,
  getLocations,
  getShifts,
  getAssignmentsByLocation,
  getAssignmentsByEmployee,
  assignShift,
  getNotifications,
  markNotificationRead,
  submitLeaveRequest
} from '@/src/services/dbService';
import { Tooltip } from '@/src/components/ui/Tooltip';
import ShiftAssignmentModal from '@/src/components/ShiftAssignmentModal';

type MobileTab = 'dashboard' | 'attendance' | 'management' | 'allocation' | 'reports' | 'profile' | 'requests';

interface MobileAppProps {
  userProfile: any;
}

export default function MobileApp({ userProfile }: MobileAppProps) {
  const [tab, setTab] = useState<MobileTab>('dashboard');
  const [isConfirming, setIsConfirming] = useState(false);
  const [selectedLocation, setSelectedLocation] = useState<any>(null);
  const [requestSubView, setRequestSubView] = useState<'list' | 'shift-change' | 'leave-approval'>('list');
  const [todayAssignment, setTodayAssignment] = useState<any>(null);
  const [showNotifications, setShowNotifications] = useState(false);
  const [notifications, setNotifications] = useState<any[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [showSubmitLeave, setShowSubmitLeave] = useState(false);
  
  const role = userProfile?.role || 'nhan_vien';
  const isManagement = ['admin', 'to_truong', 'phong_kinh_doanh', 'phong_tchc', 'giam_doc'].includes(role);

  useEffect(() => {
    if (userProfile?.uid) {
      const fetchInitial = async () => {
        const [assignments, notifs] = await Promise.all([
          getAssignmentsByEmployee(userProfile.uid, new Date().toISOString().split('T')[0]),
          getNotifications(userProfile.uid)
        ]);
        
        if (assignments && assignments.length > 0) {
          setTodayAssignment(assignments[0]);
        }
        
        if (notifs) {
          setNotifications(notifs);
          setUnreadCount(notifs.filter((n: any) => !n.isRead).length);
        }
      };
      fetchInitial();
    }
  }, [userProfile]);

  const handleMarkAsRead = async (id: string) => {
    await markNotificationRead(id);
    setNotifications(prev => prev.map(n => n.id === id ? { ...n, isRead: true } : n));
    setUnreadCount(prev => Math.max(0, prev - 1));
  };
  
  const allTabs = [
    { id: 'dashboard', label: 'Trang chủ', icon: Home },
    { id: 'requests', label: 'Yêu cầu', icon: Waves },
    { id: 'attendance', label: 'Chấm công', icon: MapPin },
    { id: 'allocation', label: 'Điều động', icon: Briefcase, managerOnly: true },
    { id: 'management', label: 'Quản lý', icon: Users, managerOnly: true },
    { id: 'reports', label: 'Báo cáo', icon: BarChart3 },
    { id: 'profile', label: 'Cá nhân', icon: User }
  ];

  const finalTabs = allTabs.filter(t => !t.managerOnly || isManagement);
  
  return (
    <div className="mx-auto max-w-md min-h-screen bg-slate-50 flex flex-col shadow-2xl relative overflow-hidden ring-1 ring-slate-200 font-sans">
      {/* Header */}
      <header className="fixed top-0 w-full max-w-md z-50 bg-green-600 text-white shadow-md flex items-center justify-between px-4 h-14">
        <div className="flex items-center gap-3">
          <Menu className="h-5 w-5 cursor-pointer" />
          <div className="flex items-center gap-2 border-l border-white/20 pl-2">
            <img 
              src="https://www.social-force.jp/wp-content/themes/socialforce/assets/images/common/logo_white.svg" 
              alt="Logo" 
              className="h-8 w-auto brightness-0 invert"
              referrerPolicy="no-referrer"
            />
            <h1 className="font-bold text-sm tracking-tight text-white uppercase italic">
              {tab === 'dashboard' && 'Dashboard'}
              {tab === 'requests' && (
                requestSubView === 'shift-change' 
                  ? 'Đổi ca làm việc' 
                  : requestSubView === 'leave-approval' 
                    ? 'Phê duyệt nghỉ phép' 
                    : !isManagement ? 'Lịch làm việc' : 'Phê duyệt & Theo dõi'
              )}
              {tab === 'attendance' && (isConfirming ? 'Xác nhận Chấm công' : 'Chấm Công GPS')}
              {tab === 'management' && 'Quản lý Nhân sự'}
              {tab === 'allocation' && (selectedLocation ? 'Chi tiết Trực ca' : 'Điều Động Nhân Sự')}
              {tab === 'reports' && 'Báo cáo Công & Phép'}
              {tab === 'profile' && 'Hồ Sơ Cá Nhân'}
            </h1>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <button 
            className="relative h-10 w-10 flex items-center justify-center hover:bg-white/10 rounded-xl transition-all"
            onClick={() => setShowNotifications(true)}
          >
            <Bell className="h-5 w-5" />
            {unreadCount > 0 && (
              <span className="absolute top-2 right-2 h-3.5 w-3.5 bg-red-500 border-2 border-green-600 rounded-full flex items-center justify-center text-[7px] font-bold">
                {unreadCount}
              </span>
            )}
          </button>
          <div className="h-8 w-8 rounded-full border border-white/30 overflow-hidden">
            <img 
              src={userProfile?.photoURL || "https://images.unsplash.com/photo-1599566150163-29194dcaad36?auto=format&fit=crop&q=80&w=100"} 
              alt="Avatar" 
              className="h-full w-full object-cover" 
              referrerPolicy="no-referrer"
            />
          </div>
        </div>
      </header>

      <main className="flex-1 pt-14 pb-16 overflow-y-auto overflow-x-hidden">
        <AnimatePresence mode="wait">
          {showNotifications ? (
            <NotificationsView 
              key="notifications"
              notifications={notifications}
              onBack={() => setShowNotifications(false)}
              onMarkAsRead={handleMarkAsRead}
            />
          ) : showSubmitLeave ? (
            <SubmitLeaveRequestView 
              key="submit-leave" 
              userProfile={userProfile} 
              onBack={() => setShowSubmitLeave(false)} 
            />
          ) : (
            <div key={tab}>
              {tab === 'dashboard' && <DashboardView assignment={todayAssignment} />}
              
              {tab === 'requests' && (
                requestSubView === 'shift-change' ? (
                  <ShiftChangeView onBack={() => setRequestSubView('list')} />
                ) : requestSubView === 'leave-approval' ? (
                  <LeaveApprovalView onBack={() => setRequestSubView('list')} />
                ) : !isManagement ? (
                  <MyScheduleView key="my-schedule" onShiftChange={() => setRequestSubView('shift-change')} />
                ) : (
                  <RequestsListView 
                    onShiftChange={() => setRequestSubView('shift-change')} 
                    onLeaveApproval={() => setRequestSubView('leave-approval')} 
                  />
                )
              )}

              {tab === 'attendance' && (
                isConfirming ? (
                  <AttendanceConfirmView 
                    userProfile={userProfile} 
                    onBack={() => setIsConfirming(false)} 
                  />
                ) : (
                  <GPSAttendanceView 
                    userProfile={userProfile} 
                    onConfirm={() => setIsConfirming(true)} 
                  />
                )
              )}

              {tab === 'management' && <ManagementView />}
              
              {tab === 'allocation' && (
                selectedLocation ? (
                  <LocationShiftDetailView 
                    location={selectedLocation}
                    onBack={() => setSelectedLocation(null)} 
                    isManagement={isManagement}
                  />
                ) : (
                  <PersonnelAllocationReportView 
                    onSelect={(loc) => setSelectedLocation(loc)} 
                  />
                )
              )}

              {tab === 'reports' && <ReportsView onLeaveRequest={() => setShowSubmitLeave(true)} />}
              
              {tab === 'profile' && <ProfileView userProfile={userProfile} />}
            </div>
          )}
        </AnimatePresence>
      </main>

      <nav className="fixed bottom-0 w-full max-w-md h-16 bg-white border-t border-slate-100 flex items-center justify-around px-1 z-50">
        {finalTabs.map((item) => (
          <Tooltip key={item.id} content={item.label} position="top" className={cn(finalTabs.length > 4 ? "w-[16%]" : "flex-1")}>
            <button 
              onClick={() => {
                setTab(item.id as MobileTab);
                setIsConfirming(false);
                setSelectedLocation(null);
                setRequestSubView('list');
              }}
              className={cn(
                "flex flex-col items-center justify-center gap-1 transition-all h-full w-full",
                tab === item.id ? "text-green-600" : "text-slate-400"
              )}
            >
              <item.icon className={cn("h-4 w-4", tab === item.id && "fill-green-600/10")} />
              <div className="relative">
                <span className="text-[8px] font-bold tracking-tighter truncate w-full text-center">{item.label}</span>
                {tab === item.id && (
                  <motion.div 
                    layoutId="activeTab"
                    className="absolute -bottom-1 left-1/2 -translate-x-1/2 h-0.5 w-1 bg-green-600 rounded-full"
                  />
                )}
              </div>
            </button>
          </Tooltip>
        ))}
      </nav>
    </div>
  );
}

function MyScheduleView({ onShiftChange }: { onShiftChange: () => void }) {
  const days = [
    { id: 't2', label: 'Thứ Hai, 24/07', status: 'completed', desc: 'Đã hoàn thành' },
    { id: 't3', label: 'Thứ Ba, 25/07', status: 'today', desc: 'Lịch làm việc hôm nay', 
      location: 'CM XTRA TÂN PHONG', 
      address: 'Tầng trệt, SC VivoCity, 1058 Nguyễn Văn Linh, P. Tân Phong, Quận 7, TP. HCM',
      shift: '07h30 - 16h30', type: 'Hành chính' 
    },
    { id: 't4', label: 'Thứ Tư, 26/07', status: 'pending', desc: 'Chưa bắt đầu' },
    { id: 't5', label: 'Thứ Năm, 27/07', status: 'pending', desc: 'Chưa bắt đầu' },
    { id: 't6', label: 'Thứ Sáu, 28/07', status: 'pending', desc: 'Chưa bắt đầu' },
  ];

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="p-4 space-y-4 font-sans pb-20">
      <div className="bg-white p-4 rounded-3xl shadow-sm border border-slate-100 ring-1 ring-black/5">
        <p className="text-[9px] font-black text-slate-400 uppercase italic mb-1">THỜI GIAN HIỆN TẠI</p>
        <div className="flex justify-between items-center">
          <h2 className="text-sm font-black text-green-600 uppercase italic">Tuần 30 (24/07 - 30/07)</h2>
          <CalendarDays className="h-5 w-5 text-slate-300" />
        </div>
      </div>

      <div className="space-y-3">
        {days.map((day) => (
          <div key={day.id} className={cn(
            "bg-white rounded-3xl border transition-all overflow-hidden",
            day.status === 'today' ? "border-green-600 ring-4 ring-green-50 shadow-lg" : "border-slate-100 shadow-sm"
          )}>
            <div className={cn(
              "p-4 flex items-center justify-between",
              day.status === 'today' ? "bg-white" : "bg-white"
            )}>
              <div className="flex items-center gap-4">
                <div className={cn(
                  "h-10 w-10 rounded-2xl flex items-center justify-center text-xs font-black italic shadow-inner",
                  day.status === 'today' ? "bg-green-600 text-white" : "bg-slate-50 text-slate-400"
                )}>
                  {day.id.toUpperCase()}
                </div>
                <div>
                  <p className="text-[11px] font-black text-slate-900 italic leading-none mb-1">{day.label}</p>
                  <p className={cn("text-[9px] font-bold italic", day.status === 'today' ? "text-green-600" : "text-slate-400")}>{day.desc}</p>
                </div>
              </div>
              <ChevronRight className={cn("h-4 w-4", day.status === 'today' ? "text-green-600 rotate-90" : "text-slate-100")} />
            </div>

            {day.status === 'today' && (
              <div className="px-4 pb-4 space-y-4">
                <div className="bg-slate-50 p-4 rounded-2xl border border-slate-100">
                  <div className="flex gap-3 mb-3">
                    <div className="h-8 w-8 bg-white rounded-xl shadow-sm flex items-center justify-center text-slate-300">
                      <Briefcase className="h-4 w-4" />
                    </div>
                    <div className="flex-1">
                      <h4 className="text-[10px] font-black text-slate-900 uppercase italic tracking-widest">{day.location}</h4>
                      <p className="text-[9px] text-slate-400 font-bold italic leading-tight mt-1">{day.address}</p>
                    </div>
                  </div>
                  <div className="flex items-center justify-between pt-3 border-t border-slate-100">
                    <div className="flex items-center gap-2">
                      <div className="h-6 w-6 bg-green-50 rounded-full flex items-center justify-center text-green-600 shadow-sm">
                        <Clock className="h-3.3 w-3.3" />
                      </div>
                      <div>
                        <p className="text-[8px] font-black text-slate-400 uppercase italic leading-none mb-0.5">CA HIỆN TẠI</p>
                        <p className="text-[10px] font-black text-green-700 italic leading-none">{day.shift}</p>
                      </div>
                    </div>
                    <span className="bg-green-100 text-green-600 px-2 py-0.5 rounded-lg text-[8px] font-black uppercase italic">{day.type}</span>
                  </div>
                </div>

                <div className="flex gap-2">
                  <button 
                    onClick={onShiftChange}
                    className="flex-1 h-12 bg-green-600 text-white rounded-2xl flex items-center justify-center gap-2 text-[9px] font-black uppercase tracking-widest shadow-xl shadow-green-100 active:scale-95 transition-all"
                  >
                    <Waves className="h-4 w-4" />
                    <span>Xin đổi ca</span>
                  </button>
                  <button className="flex-1 h-12 bg-white border-2 border-green-600 text-green-600 rounded-2xl flex items-center justify-center gap-2 text-[9px] font-black uppercase tracking-widest active:bg-green-50 transition-all">
                    <Clock className="h-4 w-4" />
                    <span>Đi trễ/Về sớm</span>
                  </button>
                </div>
              </div>
            )}
          </div>
        ))}
      </div>

      <div className="bg-green-50 p-4 rounded-3xl border border-green-100 flex items-start gap-4">
        <div className="h-8 w-8 bg-green-600 rounded-full flex items-center justify-center text-white flex-shrink-0">
          <AlertCircle className="h-4 w-4" />
        </div>
        <div>
          <h4 className="text-[10px] font-black text-green-800 uppercase italic mb-1 tracking-widest">Quy định đổi ca</h4>
          <p className="text-[9px] text-green-700 font-bold italic leading-relaxed">Yêu cầu đổi ca phải được gửi trước ít nhất 24 giờ. Vui lòng liên hệ quản lý trực tiếp nếu có trường hợp khẩn cấp.</p>
        </div>
      </div>
    </motion.div>
  );
}

function RequestsListView({ onShiftChange, onLeaveApproval }: { onShiftChange: () => void, onLeaveApproval: () => void }) {
  const [filter, setFilter] = useState<'all' | 'pending' | 'approved' | 'rejected'>('pending');

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="p-4 space-y-4">
      <div className="bg-white p-4 rounded-2xl shadow-sm border border-slate-100">
        <h3 className="text-sm font-black text-slate-900 uppercase italic mb-3">Phê duyệt đối ca</h3>
        <p className="text-[10px] text-slate-500 font-bold italic mb-4">Quản lý và theo dõi tiến độ các yêu cầu hoán đổi ca làm việc.</p>
        
        <div className="flex gap-1">
          {[
            { id: 'pending', label: 'Đang chờ (3)', color: 'bg-green-600 text-white' },
            { id: 'approved', label: 'Đã duyệt', color: 'bg-slate-100 text-slate-400' },
            { id: 'rejected', label: 'Bị từ chối', color: 'bg-slate-100 text-slate-400' }
          ].map((btn) => (
            <button 
              key={btn.id} 
              onClick={() => setFilter(btn.id as any)}
              className={cn("flex-1 py-1.5 rounded-lg text-[8px] font-black uppercase tracking-widest transition-all", filter === btn.id ? btn.color : "bg-slate-50 text-slate-400")}
            >
              {btn.label}
            </button>
          ))}
        </div>
      </div>

      <div className="space-y-3">
        <div onClick={onShiftChange} className="bg-white p-4 rounded-2xl border-l-4 border-l-green-600 shadow-sm transition-all active:scale-95 cursor-pointer">
          <div className="flex justify-between items-start mb-3">
            <div className="flex items-center gap-2">
              <div className="h-8 w-8 bg-green-50 rounded-full flex items-center justify-center text-green-600">
                <ArrowRight className="h-4 w-4" />
              </div>
              <div>
                <p className="text-[8px] font-black text-slate-400 uppercase italic leading-none mb-1">YÊU CẦU MSF-0012</p>
                <p className="text-xs font-black text-slate-900 italic">Nguyễn Văn An</p>
              </div>
            </div>
            <span className="bg-green-50 text-green-600 px-2 py-0.5 rounded text-[8px] font-black uppercase italic">CẦN DUYỆT</span>
          </div>
          
          <div className="grid grid-cols-2 gap-4 py-2 border-y border-slate-50 mb-3">
            <div>
              <p className="text-[8px] font-black text-slate-400 uppercase italic leading-none mb-1">CA HIỆN TẠI</p>
              <p className="text-[10px] font-black text-slate-900 leading-tight italic">Ca Sáng (06h00 - 14h00)</p>
              <p className="text-[9px] text-slate-500 font-bold italic">Thứ Ba, 24/10</p>
            </div>
            <div>
              <p className="text-[8px] font-black text-slate-400 uppercase italic leading-none mb-1">CA ĐỔI SANG</p>
              <p className="text-[10px] font-black text-green-600 leading-tight italic">Ca Chiều (14h00 - 22h00)</p>
              <p className="text-[9px] text-slate-500 font-bold italic">Thứ Ba, 24/10</p>
            </div>
          </div>
          
          <div className="mb-3">
            <p className="text-[8px] font-black text-slate-400 uppercase italic leading-none mb-1">LÝ DO ĐỔI CA</p>
            <p className="text-[9px] text-slate-600 font-bold italic leading-relaxed">Gia đình có việc đột xuất cần hỗ trợ đưa con đi khám bệnh định kỳ vào buổi sáng.</p>
          </div>

          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="h-6 w-6 rounded-full bg-slate-100 flex items-center justify-center border border-slate-200">
                <Check className="h-3 w-3 text-slate-300" />
              </div>
              <p className="text-[9px] text-slate-400 font-black italic">Tổ trưởng trực tiếp (Đang chờ)</p>
            </div>
            <ChevronRight className="h-4 w-4 text-slate-200" />
          </div>
        </div>

        <div onClick={onLeaveApproval} className="bg-white p-4 rounded-2xl border-l-4 border-l-slate-200 shadow-sm active:bg-slate-50 transition-all cursor-pointer">
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-2">
              <div className="h-6 w-6 bg-slate-100 rounded-full flex items-center justify-center">
                <Sun className="h-3 w-3 text-slate-400" />
              </div>
              <p className="text-xs font-black text-slate-900 italic">Lê Thị Hoa</p>
            </div>
            <span className="text-[8px] font-black text-slate-400 uppercase italic">ĐÃ DUYỆT</span>
          </div>
          <p className="text-[9px] text-slate-500 font-bold italic lowercase pl-8">Nghỉ phép: 28/10 • 1 ngày</p>
        </div>

        <div className="bg-white p-4 rounded-2xl border-l-4 border-l-red-200 shadow-sm opacity-60">
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-2">
              <div className="h-6 w-6 bg-red-50 rounded-full flex items-center justify-center">
                <Moon className="h-3 w-3 text-red-400" />
              </div>
              <p className="text-xs font-black text-slate-900 italic">Phạm Minh Tuấn</p>
            </div>
            <span className="text-[8px] font-black text-red-400 uppercase italic">TỪ CHỐI</span>
          </div>
          <p className="text-[9px] text-slate-500 font-bold italic lowercase pl-8">Đổi ca: 25/10 • Ca Chiều</p>
        </div>
      </div>
    </motion.div>
  );
}

function ShiftChangeView({ onBack, isManager = false }: { onBack: () => void, isManager?: boolean }) {
  const [reason, setReason] = useState('Gia đình');

  return (
    <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="p-4 space-y-4 font-sans pb-20">
      <div className="bg-white p-6 rounded-3xl shadow-sm border border-slate-100 ring-1 ring-black/5">
        <div className="flex items-center gap-3 mb-6">
          <Calendar className="h-5 w-5 text-green-600" />
          <p className="text-[10px] font-black text-slate-400 uppercase italic">CA HIỆN TẠI</p>
        </div>
        <div className="flex justify-between items-start mb-4">
          <div>
            <h3 className="text-xl font-black text-slate-900 italic leading-none">07h30 - 16h30</h3>
            <p className="text-[11px] text-slate-500 font-bold italic mt-2">Thứ Hai, 24 Tháng 7, 2023</p>
          </div>
          <span className="bg-green-50 text-green-600 px-3 py-1 rounded-full text-[9px] font-black uppercase italic border border-green-100">Hành chính</span>
        </div>
      </div>

      <div className="space-y-6 pt-2">
        <div className="space-y-2">
          <label className="text-[9px] font-black text-slate-400 uppercase italic px-1">Ca chuyển</label>
          <div className="relative group">
            <select className="w-full h-14 bg-white border border-slate-100 rounded-2xl px-5 text-xs font-black italic shadow-sm outline-none focus:border-green-600 appearance-none transition-all">
              <option>Chọn ca muốn đổi</option>
              <option>Ca Chiều (14:00 - 22:00)</option>
              <option>Ca Đêm (22:00 - 06:00)</option>
            </select>
            <ChevronRight className="absolute right-5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-300 rotate-90" />
          </div>
        </div>

        <div className="space-y-2">
          <label className="text-[9px] font-black text-slate-400 uppercase italic px-1">Lý do</label>
          <div className="flex gap-2">
            {['Bận việc riêng', 'Việc gia đình'].map((r) => (
              <button 
                key={r} 
                onClick={() => setReason(r)}
                className={cn(
                  "flex-1 h-12 rounded-2xl text-[10px] font-black uppercase tracking-widest border transition-all",
                  reason === r ? "bg-green-50 border-green-600 text-green-700 shadow-sm" : "bg-white border-slate-100 text-slate-400"
                )}
              >
                {r}
              </button>
            ))}
          </div>
        </div>

        <div className="space-y-2">
          <label className="text-[9px] font-black text-slate-400 uppercase italic px-1">Đối tượng đổi ca cùng</label>
          <div className="bg-white p-4 rounded-3xl border border-slate-100 shadow-sm flex items-center justify-between group active:bg-slate-50 transition-all">
            <div className="flex items-center gap-4">
              <div className="h-10 w-10 bg-slate-50 rounded-2xl overflow-hidden border border-slate-100 flex items-center justify-center italic text-slate-300 font-black">
                <img src="https://images.unsplash.com/photo-1599566150163-29194dcaad36?auto=format&fit=crop&q=80&w=100" className="h-full w-full object-cover" alt="" />
              </div>
              <div>
                <p className="text-xs font-black text-slate-900 italic leading-none mb-1">Nguyễn Văn An</p>
                <p className="text-[9px] text-slate-400 font-bold italic uppercase tracking-tighter">NV0492 - Tổ Sản Xuất</p>
              </div>
            </div>
            <div className="h-8 w-8 bg-green-50 rounded-xl flex items-center justify-center text-green-600">
              <Waves className="h-4 w-4 rotate-90" />
            </div>
          </div>
        </div>

        <div className="space-y-2">
          <label className="text-[9px] font-black text-slate-400 uppercase italic px-1">Ghi chú</label>
          <textarea 
            placeholder="Nhập thêm chi tiết nếu cần thiết..."
            className="w-full h-32 bg-white border border-slate-100 rounded-3xl p-5 text-xs font-bold italic shadow-inner outline-none focus:border-green-600 transition-all"
          />
        </div>
      </div>

      <div className="pt-4 space-y-4">
        <button onClick={onBack} className="w-full h-14 bg-green-600 text-white rounded-[1.5rem] text-xs font-black uppercase tracking-widest shadow-xl shadow-green-100 active:translate-y-0.5 transition-all flex items-center justify-center gap-2">
          <Plus className="h-4 w-4 rotate-45" />
          <span>Xin đổi ca</span>
        </button>
        
        <div className="bg-green-50 p-4 rounded-2xl border border-green-100 flex items-start gap-3">
          <AlertCircle className="h-4 w-4 text-green-600 flex-shrink-0 mt-0.5" />
          <p className="text-[9px] text-green-700 font-bold italic leading-relaxed">Đề xuất đổi ca của bạn sẽ được gửi tới Quản lý tổ để phê duyệt trong vòng 24h làm việc.</p>
        </div>
        <button onClick={onBack} className="w-full py-2 text-slate-300 text-[10px] font-black uppercase tracking-widest italic">Quay lại</button>
      </div>
    </motion.div>
  );
}

function LeaveApprovalView({ onBack }: { onBack: () => void }) {
  const levels = [
    { label: 'Phòng kinh doanh', name: 'Trưởng phòng: Trần Thị Mai', status: 'approved', time: '09:20 - 20/10/2023' },
    { label: 'Phòng Tổ chức Hành chính', name: 'Chuyên viên: Lê Hoàng Nam', status: 'pending', time: '' },
    { label: 'Giám đốc', name: 'Ông: Phạm Văn Hùng', status: 'upcoming', time: '' }
  ];

  return (
    <motion.div initial={{ opacity: 0, scale: 0.98 }} animate={{ opacity: 1, scale: 1 }} className="p-4 space-y-4 pb-20">
      <div className="bg-white p-4 rounded-3xl shadow-sm border border-slate-100 ring-1 ring-black/5">
        <div className="flex items-center gap-3 mb-6">
          <div className="h-12 w-12 rounded-full overflow-hidden border border-slate-100">
            <img 
              src="https://images.unsplash.com/photo-1599566150163-29194dcaad36?auto=format&fit=crop&q=80&w=100" 
              className="h-full w-full object-cover" 
              alt="" 
              referrerPolicy="no-referrer"
            />
          </div>
          <div>
            <h3 className="text-sm font-black text-slate-900 uppercase italic">Nguyễn Văn An</h3>
            <p className="text-[10px] text-slate-500 font-bold italic">Nhân viên Phòng Kinh doanh</p>
            <p className="text-[8px] text-slate-400 font-black mt-1 uppercase italic tracking-widest opacity-60 leading-none">LOẠI NGỈ: VIỆC GIA ĐÌNH</p>
          </div>
          <div className="ml-auto text-right">
            <p className="text-[8px] font-black text-slate-400 uppercase italic mb-1">TỔNG THỜI GIAN</p>
            <p className="text-base font-black text-green-600 italic">2.5 Ngày</p>
          </div>
        </div>

        <div className="space-y-4 border-t border-slate-50 pt-4">
          <div className="space-y-1">
            <p className="text-[9px] font-black text-slate-400 uppercase italic">CHI TIẾT THỜI GIAN</p>
            <div className="flex justify-between items-center text-[10px] font-black text-slate-900 italic">
              <span>24/10/2023 - 25/10/2023</span>
              <span className="text-green-600">Sáng & Chiều</span>
            </div>
            <div className="flex justify-between items-center text-[10px] font-black text-slate-900 italic">
              <span>26/10/2023</span>
              <span className="text-slate-400">Nghỉ buổi sáng</span>
            </div>
          </div>

          <div className="space-y-1">
            <p className="text-[9px] font-black text-slate-400 uppercase italic">LÝ DO CHI TIẾT</p>
            <p className="text-[9px] text-slate-600 font-bold italic leading-relaxed">“Đưa người thân đi kiểm tra sức khỏe định kỳ tại Bệnh viện Hòa Hảo và xử lý một số công việc gia đình quan trọng.”</p>
          </div>
        </div>
      </div>

      <div className="bg-white p-5 rounded-3xl border border-slate-100 shadow-sm">
        <h4 className="text-[10px] font-black text-slate-900 uppercase italic tracking-widest mb-6">Quy trình phê duyệt</h4>
        <div className="space-y-8 relative">
          <div className="absolute left-4 top-2 bottom-2 w-px bg-slate-100"></div>
          {levels.map((lvl, i) => (
            <div key={i} className="relative pl-10">
              <div className={cn(
                "absolute left-2.5 -translate-x-1/2 h-3 w-3 rounded-full border-2",
                lvl.status === 'approved' ? "bg-green-600 border-green-200" : lvl.status === 'pending' ? "bg-orange-400 border-orange-100 animate-pulse" : "bg-white border-slate-100"
              )}></div>
              <div className="flex justify-between items-start">
                <div>
                  <p className="text-[10px] font-black text-slate-900 uppercase italic lowercase first-letter:uppercase">{lvl.label}</p>
                  <p className="text-[9px] text-slate-500 font-bold italic mt-0.5">{lvl.name}</p>
                  {lvl.time && <p className="text-[8px] text-slate-300 font-black italic mt-1 uppercase">{lvl.time}</p>}
                </div>
                <span className={cn(
                  "text-[8px] font-black uppercase italic px-1.5 py-0.5 rounded",
                  lvl.status === 'approved' ? "bg-green-50 text-green-600" : lvl.status === 'pending' ? "bg-orange-50 text-orange-400" : "bg-slate-50 text-slate-300"
                )}>
                  {lvl.status === 'approved' ? 'ĐÃ DUYỆT' : lvl.status === 'pending' ? 'ĐANG CHỜ' : 'CHƯA ĐẾN LƯỢT'}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="fixed bottom-16 left-0 right-0 bg-white/80 backdrop-blur-md p-4 flex gap-3 z-50 ring-1 ring-black/5 max-w-md mx-auto">
        <button onClick={onBack} className="flex-1 h-12 border-2 border-red-100 text-red-500 rounded-2xl text-[10px] font-black uppercase tracking-widest active:bg-red-50 transition-colors">TỪ CHỐI</button>
        <button onClick={onBack} className="flex-[2] h-12 bg-green-600 text-white rounded-2xl text-[10px] font-black uppercase tracking-widest shadow-xl shadow-green-100 active:scale-98 transition-all">DUYỆT YÊU CẦU</button>
      </div>
    </motion.div>
  );
}

function DashboardView({ assignment }: { assignment?: any }) {
  return (
    <motion.div 
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -20 }}
      className="p-4 space-y-4 font-sans"
    >
      <div className="grid grid-cols-2 gap-3">
        <div className="bg-white p-4 rounded-3xl shadow-sm border border-slate-100 flex flex-col justify-between">
          <div className="flex justify-between items-start">
            <p className="text-[8px] font-black text-slate-400 uppercase italic">TRẠNG THÁI</p>
            <span className="bg-green-100 text-green-600 px-1.5 py-0.5 rounded text-[7px] font-black italic">LIVE</span>
          </div>
          <div className="flex items-baseline gap-1 my-2">
            <span className="text-xl font-black text-slate-900">{assignment ? 'ĐÃ PHÂN CA' : '100%'}</span>
          </div>
          <div className="h-1 bg-slate-100 rounded-full overflow-hidden">
            <div className="h-full bg-green-600 w-full rounded-full"></div>
          </div>
        </div>
        
        <div className="grid grid-rows-2 gap-3">
          <div className="bg-white p-3 rounded-2xl shadow-sm border border-slate-100 flex items-center justify-between">
            <div>
              <p className="text-[8px] font-black text-slate-400 uppercase italic">ĐIỂM TRỰC</p>
              <p className="text-xs font-black text-slate-900 tracking-tighter">1/1 POS</p>
            </div>
            <div className="h-6 w-6 rounded-full border-2 border-green-600 flex items-center justify-center">
              <Check className="h-3 w-3 text-green-600" />
            </div>
          </div>
          <div className="bg-white p-3 rounded-2xl shadow-sm border border-slate-100 flex items-center justify-between">
            <div>
              <p className="text-[8px] font-black text-slate-400 uppercase italic">KPI NGÀY</p>
              <p className="text-xs font-black text-slate-900 tracking-tighter">95%</p>
            </div>
            <Award className="h-4 w-4 text-orange-400" />
          </div>
        </div>
      </div>

      <div className="bg-white rounded-[2.5rem] shadow-xl border border-slate-100 overflow-hidden ring-1 ring-black/5">
        <div className="h-36 bg-slate-200 relative group overflow-hidden">
          <img 
            src={assignment?.locationPhoto || "https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?auto=format&fit=crop&q=80&w=800"} 
            alt="Worksite" 
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" 
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent flex items-end p-5">
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 bg-white/20 backdrop-blur-md rounded-xl flex items-center justify-center text-white">
                <MapPin className="h-5 w-5" />
              </div>
              <div>
                <span className="text-white text-[10px] font-black leading-none uppercase italic tracking-widest block mb-1">ĐIỂM TRỰC HIỆN TẠI</span>
                <span className="text-white text-base font-black leading-none uppercase italic">{assignment?.locationName || 'Co.op Mart Cống Quỳnh'}</span>
              </div>
            </div>
          </div>
        </div>
        <div className="p-6">
          <div className="flex justify-between items-start mb-6">
            <div>
              <h3 className="text-xs font-black text-slate-900 uppercase italic tracking-widest leading-tight">
                {assignment?.locationName || 'SIÊU THỊ CO.OP MART'}
              </h3>
              <p className="text-[10px] text-slate-500 italic mt-0.5">{assignment?.address || '189 Cống Quỳnh, Quận 1, TP.HCM'}</p>
              <div className="flex items-center gap-1.5 mt-3 text-green-600 bg-green-50 w-fit px-2 py-0.5 rounded-full">
                <div className="h-1.5 w-1.5 rounded-full bg-green-600 animate-pulse"></div>
                <span className="text-[9px] font-black italic uppercase tracking-tighter">ĐÃ VÀO CA 2H 45M</span>
              </div>
            </div>
            <div className="text-right">
              <span className="bg-slate-100 text-slate-500 px-2 py-1 rounded-lg text-[7px] font-black uppercase tracking-widest italic">CA TRỰC</span>
              <p className="text-xs font-black text-slate-900 mt-2 italic">{assignment?.shiftTime || '07:30 - 16:30'}</p>
            </div>
          </div>
          
          <div className="grid grid-cols-2 gap-4">
            <button className="flex flex-col items-center justify-center p-4 bg-green-600 text-white rounded-[1.5rem] shadow-xl shadow-green-100 active:scale-95 transition-all relative overflow-hidden group">
              <div className="absolute inset-0 bg-white/10 opacity-0 group-hover:opacity-100 transition-opacity"></div>
              <div className="h-10 w-10 bg-white/20 rounded-full flex items-center justify-center mb-2">
                <ArrowRight className="h-6 w-6" />
              </div>
              <span className="text-[9px] font-black uppercase tracking-widest leading-none">Chấm công vào</span>
              <span className="text-[7px] opacity-60 uppercase mt-1 italic">SUCCESS (07:28)</span>
            </button>
            <button className="flex flex-col items-center justify-center p-4 bg-white border-2 border-slate-100 text-slate-400 rounded-[1.5rem] active:scale-95 transition-all group overflow-hidden relative">
              <div className="absolute inset-0 bg-slate-50 opacity-0 group-hover:opacity-100 transition-opacity"></div>
              <div className="h-10 w-10 border-2 border-slate-100 rounded-full flex items-center justify-center mb-2">
                <ArrowRight className="h-6 w-6" />
              </div>
              <span className="text-[9px] font-black uppercase tracking-widest leading-none">Chấm công ra</span>
              <span className="text-[7px] opacity-60 uppercase mt-1 italic">WAITING...</span>
            </button>
          </div>
        </div>
      </div>

      <div>
        <div className="flex justify-between items-center mb-3 px-1">
          <h3 className="text-[10px] font-black text-slate-900 uppercase tracking-widest italic">LỊCH SỬ POS GẦN ĐÂY</h3>
          <button className="text-[8px] font-black text-green-600 uppercase tracking-widest bg-green-50 px-2 py-1 rounded-lg">TẤT CẢ</button>
        </div>
        <div className="space-y-3">
          {[
            { type: 'Vào ca', site: assignment?.locationName || 'Co.op Mart', time: '07:28 AM', status: 'success' },
            { type: 'Vào ca', site: 'Emart Gò Vấp', time: 'Yesterday 07:15 AM', status: 'success' },
          ].map((log, i) => (
            <div key={i} className="bg-white p-4 rounded-3xl border border-slate-100 flex items-center justify-between active:bg-slate-50 transition-all shadow-sm ring-1 ring-black/5">
              <div className="flex items-center gap-4">
                <div className={cn(
                  "h-11 w-11 rounded-2xl flex items-center justify-center shadow-inner transition-colors",
                  log.status === 'success' ? "bg-green-50 text-green-600" : "bg-slate-50 text-slate-300"
                )}>
                  {log.status === 'success' ? <CheckCircle2 className="h-5 w-5" /> : <Clock className="h-5 w-5" />}
                </div>
                <div>
                  <p className="text-xs font-black text-slate-900 italic leading-none mb-1">{log.type} - {log.site}</p>
                  <p className="text-[9px] text-slate-400 font-bold uppercase italic tracking-tighter">{log.time}</p>
                </div>
              </div>
              <ChevronRight className="h-4 w-4 text-slate-200" />
            </div>
          ))}
        </div>
      </div>
    </motion.div>
  );
}

function ManagementView() {
  const [employees, setEmployees] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [showAddModal, setShowAddModal] = useState(false);
  const [formData, setFormData] = useState({ name: '', email: '', role: 'nhan_vien' });
  const [subView, setSubView] = useState<'list' | 'kpi'>('list');

  useEffect(() => {
    fetchEmployees();
  }, []);

  const fetchEmployees = async () => {
    try {
      setLoading(true);
      const data = await getEmployees();
      if (data) setEmployees(data);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handleAdd = async () => {
    try {
      await addEmployee({ displayName: formData.name, email: formData.email, role: formData.role, status: 'Active' });
      setShowAddModal(false);
      setFormData({ name: '', email: '', role: 'nhan_vien' });
      fetchEmployees();
    } catch (error) {
      console.error(error);
    }
  };

  if (subView === 'kpi') {
    return (
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="p-4 space-y-4">
        <KPIManagementView onBack={() => setSubView('list')} />
      </motion.div>
    );
  }

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="p-4 space-y-4">
      <div className="flex gap-2">
        <button onClick={() => setSubView('list')} className={cn("flex-1 py-1.5 rounded-xl text-[10px] font-black uppercase transition-all bg-green-600 text-white italic")}>Nhân sự</button>
        <button onClick={() => setSubView('kpi')} className={cn("flex-1 py-1.5 rounded-xl text-[10px] font-black uppercase transition-all bg-white text-slate-400 border border-slate-100 italic")}>KPI & Đào tạo</button>
      </div>

      <div className="bg-white p-4 rounded-2xl shadow-sm border border-slate-100 flex items-center justify-between">
        <div>
          <h3 className="text-xs font-black text-slate-900 uppercase italic">Danh sách nhân sự</h3>
          <p className="text-[10px] text-slate-400 font-bold italic">Quản lý vai trò và thông tin</p>
        </div>
        <button onClick={() => setShowAddModal(true)} className="h-10 w-10 bg-green-600 text-white rounded-xl flex items-center justify-center shadow-lg active:scale-90 transition-transform">
          <Plus className="h-5 w-5" />
        </button>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden divide-y divide-slate-50">
        {loading ? (
          <div className="p-10 flex justify-center"><Loader2 className="h-6 w-6 text-green-600 animate-spin" /></div>
        ) : employees.map((emp) => (
          <div key={emp.id} className="p-4 flex items-center justify-between active:bg-slate-50 transition-colors">
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 bg-slate-100 rounded-xl flex items-center justify-center text-slate-400 font-black text-xs uppercase overflow-hidden ring-1 ring-slate-50">
                {emp.photoURL && typeof emp.photoURL === 'string' && emp.photoURL.length > 5 ? (
                  <img 
                    src={emp.photoURL} 
                    className="h-full w-full object-cover" 
                    alt={emp.displayName || ''} 
                    referrerPolicy="no-referrer"
                  />
                ) : (
                  <span>{emp.displayName?.charAt(0) || 'U'}</span>
                )}
              </div>
              <div>
                <p className="text-xs font-black text-slate-900 italic">{emp.displayName || 'Unnamed'}</p>
                <p className="text-[10px] text-slate-400 font-bold leading-none mb-1">{emp.email}</p>
                <span className="text-[8px] font-black uppercase text-green-600 bg-green-50 px-1.5 py-0.5 rounded italic">{emp.role}</span>
              </div>
            </div>
            <ChevronRight className="h-4 w-4 text-slate-200" />
          </div>
        ))}
      </div>

      {showAddModal && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-sm">
          <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="bg-white w-full max-w-xs rounded-3xl p-6 shadow-2xl">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-xs font-black text-slate-900 uppercase italic">Thêm nhân viên</h3>
              <button onClick={() => setShowAddModal(false)} className="text-slate-400"><X className="h-5 w-5" /></button>
            </div>
            <div className="space-y-4">
              <input type="text" value={formData.name} onChange={(e) => setFormData({ ...formData, name: e.target.value })} className="w-full h-11 bg-slate-50 rounded-xl px-4 text-xs font-bold border border-slate-100 focus:border-green-600 outline-none transition-all" placeholder="Họ và tên..." />
              <input type="email" value={formData.email} onChange={(e) => setFormData({ ...formData, email: e.target.value })} className="w-full h-11 bg-slate-50 rounded-xl px-4 text-xs font-bold border border-slate-100 focus:border-green-600 outline-none transition-all" placeholder="Email..." />
              <select value={formData.role} onChange={(e) => setFormData({ ...formData, role: e.target.value })} className="w-full h-11 bg-slate-50 rounded-xl px-4 text-xs font-bold border border-slate-100 focus:border-green-600 outline-none transition-all">
                <option value="nhan_vien">Nhân viên</option>
                <option value="to_truong">Tổ trưởng</option>
                <option value="phong_kinh_doanh">P. Kinh doanh</option>
                <option value="phong_to_chuc_hanh_chinh">P. TCHC</option>
                <option value="giam_doc">Giám đốc</option>
              </select>
              <button onClick={handleAdd} className="w-full h-12 bg-green-600 text-white rounded-xl text-xs font-black uppercase tracking-widest shadow-xl shadow-green-100 mt-2">Xác nhận thêm</button>
            </div>
          </motion.div>
        </div>
      )}
    </motion.div>
  );
}

function KPIManagementView({ onBack }: { onBack: () => void }) {
  const [employeesKPI] = useState([
    { name: 'Nguyễn Văn An', dept: 'Sản xuất (Thực phẩm)', kpi: 92, status: 'Đã đánh giá', color: 'bg-green-600' },
    { name: 'Trần Thị Bình', dept: 'Kinh doanh', kpi: 78, status: 'Đang chờ', color: 'bg-orange-400' },
    { name: 'Phạm Hùng Cường', dept: 'Kỹ thuật - Bảo trì', kpi: 55, status: 'Cần đào tạo', color: 'bg-red-500' },
    { name: 'Lê Minh Đăng', dept: 'Vận tải & Kho vận', kpi: 85, status: 'Đã đánh giá', color: 'bg-green-600' },
  ]);

  return (
    <div className="space-y-4 pb-16 font-sans">
      <div className="flex gap-2">
        <button onClick={onBack} className={cn("flex-1 py-1.5 rounded-xl text-[10px] font-black uppercase transition-all bg-white text-slate-400 border border-slate-100 italic")}>Nhân sự</button>
        <button className={cn("flex-1 py-1.5 rounded-xl text-[10px] font-black uppercase transition-all bg-green-600 text-white shadow-lg shadow-green-100 italic")}>KPI & Đào tạo</button>
      </div>

      <div className="grid grid-cols-2 gap-3">
        <div className="bg-white p-3 rounded-2xl border border-slate-100 shadow-sm">
          <p className="text-[8px] font-black text-slate-400 uppercase italic leading-none mb-2">TỔNG NHÂN VIÊN</p>
          <div className="flex items-center gap-2">
            <div className="h-7 w-7 bg-green-50 rounded-lg flex items-center justify-center text-green-600">
              <Users className="h-4 w-4" />
            </div>
            <span className="text-xl font-black text-slate-900 tracking-tighter">1,248</span>
          </div>
        </div>
        <div className="bg-white p-3 rounded-2xl border border-slate-100 shadow-sm">
          <p className="text-[8px] font-black text-slate-400 uppercase italic leading-none mb-2">KPI TRUNG BÌNH</p>
          <div className="flex items-center gap-2">
            <div className="h-7 w-7 bg-blue-50 rounded-lg flex items-center justify-center text-blue-600">
              <BarChart3 className="h-4 w-4" />
            </div>
            <span className="text-xl font-black text-slate-900 tracking-tighter">84.5</span>
          </div>
        </div>
        <div className="bg-white p-3 rounded-2xl border border-slate-100 shadow-sm">
          <p className="text-[8px] font-black text-slate-400 uppercase italic leading-none mb-2">CHỨNG CHỈ MỚI</p>
          <div className="flex items-center gap-2">
            <div className="h-7 w-7 bg-orange-50 rounded-lg flex items-center justify-center text-orange-600">
              <Plus className="h-4 w-4" />
            </div>
            <span className="text-xl font-black text-slate-900 tracking-tighter">42</span>
          </div>
        </div>
        <div className="bg-red-50 p-3 rounded-2xl border border-red-100 shadow-sm">
          <p className="text-[8px] font-black text-red-400 uppercase italic leading-none mb-2">CẦN ĐÁNH GIÁ</p>
          <div className="flex items-center gap-2">
            <div className="h-7 w-7 bg-red-600 rounded-lg flex items-center justify-center text-white">
              <AlertCircle className="h-4 w-4" />
            </div>
            <span className="text-xl font-black text-red-600 tracking-tighter">15</span>
          </div>
        </div>
      </div>

      <div className="bg-white p-5 rounded-3xl border border-slate-100 shadow-sm">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h3 className="text-[10px] font-black text-slate-900 uppercase italic tracking-widest">Danh sách đánh giá</h3>
            <p className="text-[8px] text-slate-400 font-bold italic mt-0.5">Theo năng lực và hiệu quả định kỳ</p>
          </div>
          <button className="bg-green-600 text-white px-3 py-1.5 rounded-xl text-[8px] font-black uppercase tracking-widest shadow-lg shadow-green-100 active:scale-95 transition-all">Xuất báo cáo</button>
        </div>
        
        <div className="space-y-5">
          {employeesKPI.map((item, i) => (
            <div key={i} className="pb-5 border-b border-slate-50 last:border-0 last:pb-0">
              <div className="flex justify-between items-start mb-3">
                <div className="flex items-center gap-3">
                  <div className="h-10 w-10 bg-slate-100 rounded-xl overflow-hidden flex items-center justify-center text-slate-400 font-black text-xs">
                    {item.name.charAt(0)}
                  </div>
                  <div>
                    <h5 className="text-[11px] font-black text-slate-900 italic lowercase first-letter:uppercase">{item.name}</h5>
                    <p className="text-[8px] text-slate-400 font-bold italic">{item.dept}</p>
                  </div>
                </div>
                <div className={cn(
                  "px-2 py-0.5 rounded-full text-[7px] font-black uppercase italic tracking-widest",
                  item.status === 'Đã đánh giá' ? "bg-green-50 text-green-600" : item.status === 'Đang chờ' ? "bg-orange-50 text-orange-400" : "bg-red-50 text-red-500"
                )}>
                  {item.status}
                </div>
              </div>
              <div className="flex items-center gap-3 mt-2">
                <div className="flex-1 h-1.5 bg-slate-50 rounded-full overflow-hidden shadow-inner">
                  <div className={cn("h-full transition-all duration-1000", item.color)} style={{ width: `${item.kpi}%` }}></div>
                </div>
                <span className="text-[10px] font-black text-slate-900 italic">{item.kpi}</span>
              </div>
            </div>
          ))}
        </div>
        
        <button className="w-full mt-6 py-2.5 border-2 border-slate-50 text-slate-300 rounded-2xl text-[8px] font-black uppercase tracking-widest hover:bg-slate-50 transition-all">Xem tất cả 1,248 nhân sự</button>
      </div>
    </div>
  );
}

function PersonnelAllocationReportView({ onSelect }: { onSelect: (loc: any) => void }) {
  const [filterType, setFilterType] = useState<'week' | 'month' | 'year'>('month');
  const [locations, setLocations] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchLocs = async () => {
      try {
        setLoading(true);
        const data = await getLocations();
        if (data) setLocations(data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchLocs();
  }, []);

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="p-4 space-y-4 font-sans">
      <div className="bg-white p-4 rounded-2xl shadow-sm border border-slate-100 italic">
        <div className="flex gap-1 mb-4">
          {['Tuần', 'Tháng', 'Năm'].map((t, i) => (
            <button key={i} onClick={() => setFilterType(['week','month','year'][i] as any)} className={cn("flex-1 py-1.5 rounded-xl text-[9px] font-black uppercase tracking-widest transition-all", filterType === ['week','month','year'][i] ? "bg-green-600 text-white" : "bg-slate-50 text-slate-400")}>{t}</button>
          ))}
        </div>
        <div className="flex items-center justify-between">
          <div>
            <p className="text-[9px] font-black text-slate-400 uppercase italic leading-none mb-1">Khoảng thời gian</p>
            <p className="text-xs font-black text-slate-900 uppercase italic">Tháng 10/2023 <CalendarDays className="h-3 w-3 inline ml-1 text-green-600" /></p>
          </div>
          <button className="bg-green-700 text-white px-3 py-1.5 rounded-lg text-[8px] font-black uppercase tracking-widest shadow-lg">Thay đổi</button>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-3">
        <div className="bg-green-50 p-4 rounded-2xl border border-green-100 flex flex-col justify-between">
          <p className="text-[8px] font-black text-green-700 uppercase italic mb-1">TỔNG NHÂN SỰ</p>
          <div className="flex items-center gap-2">
            <Users className="h-3 w-3 text-green-600" />
            <p className="text-xl font-black text-green-800">142</p>
          </div>
        </div>
        <div className="bg-green-600 p-4 rounded-2xl shadow-lg shadow-green-100 text-white flex flex-col justify-between">
          <p className="text-[8px] font-black text-white/70 uppercase italic mb-1">TỔNG CA TRỰC</p>
          <div className="flex items-center gap-2">
            <Clock className="h-3 w-3 text-green-200" />
            <p className="text-xl font-black">3,840</p>
          </div>
        </div>
      </div>

      <div className="space-y-3">
        <div className="flex justify-between items-center px-1">
          <h3 className="text-[10px] font-black text-slate-900 uppercase tracking-widest italic">DANH SÁCH ĐIỂM BÁN (POS)</h3>
          <p className="text-[8px] text-slate-400 font-bold uppercase italic">{locations.length} ĐIỂM</p>
        </div>
        
        {loading ? (
          <div className="py-20 flex justify-center"><Loader2 className="h-6 w-6 text-green-600 animate-spin" /></div>
        ) : locations.map((item, i) => (
          <div key={item.id || i} onClick={() => onSelect(item)} className="bg-white p-4 rounded-3xl border border-slate-100 shadow-sm active:scale-[0.98] transition-all cursor-pointer group">
            <div className="flex items-start justify-between mb-3">
              <div className="flex gap-3">
                <div className="h-10 w-10 bg-slate-50 rounded-2xl flex items-center justify-center group-hover:bg-green-50 transition-colors">
                  <MapPin className="h-5 w-5 text-slate-300 group-hover:text-green-600 transition-colors" />
                </div>
                <div>
                  <h4 className="text-sm font-black text-slate-900 italic lowercase first-letter:uppercase leading-tight">{item.name}</h4>
                  <p className="text-[9px] text-slate-500 font-bold italic truncate max-w-[150px]">{item.address || item.location}</p>
                </div>
              </div>
              <ChevronRight className="h-4 w-4 text-slate-200" />
            </div>
            <div className="grid grid-cols-2 gap-2 pt-3 border-t border-slate-50">
              <div className="flex items-center gap-2">
                <Users className="h-3 w-3 text-slate-300" />
                <span className="text-[10px] font-black text-slate-900 tracking-tighter">{(item.personnel || 12)} <span className="text-[8px] text-slate-400 font-black italic">NS</span></span>
              </div>
              <div className="flex items-center gap-2">
                <Clock className="h-3 w-3 text-slate-300" />
                <span className="text-[10px] font-black text-slate-900 tracking-tighter">{(item.shifts || 360)} <span className="text-[8px] text-slate-400 font-black italic">CA</span></span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </motion.div>
  );
}

function LocationShiftDetailView({ location, onBack, isManagement }: { location: any, onBack: () => void, isManagement: boolean }) {
  const [shifts, setShifts] = useState<any[]>([]);
  const [assignments, setAssignments] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const fetchData = async () => {
    try {
      setLoading(true);
      const [shiftsData, assignmentsData] = await Promise.all([
        getShifts(),
        getAssignmentsByLocation(location.id, selectedDate)
      ]);
      setShifts(shiftsData || []);
      setAssignments(assignmentsData || []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [location.id, selectedDate]);

  const days = Array.from({ length: 7 }, (_, i) => {
    const d = new Date();
    d.setDate(d.getDate() + i - 1);
    return d.toISOString().split('T')[0];
  });

  return (
    <motion.div initial={{ opacity: 0, scale: 0.98 }} animate={{ opacity: 1, scale: 1 }} className="p-4 space-y-4 font-sans">
      <div className="flex items-center gap-3 mb-2">
        <button onClick={onBack} className="h-10 w-10 bg-white rounded-xl shadow-sm border border-slate-100 flex items-center justify-center text-slate-900 active:scale-95 transition-all"><ChevronLeft className="h-5 w-5" /></button>
        <div className="flex-1">
          <h3 className="text-xs font-black text-slate-900 uppercase italic leading-tight">{location.name}</h3>
          <p className="text-[9px] text-slate-500 font-bold italic lowercase">{location.address || location.location}</p>
        </div>
        <div className="bg-green-50 px-3 py-1 rounded-full text-[8px] font-black text-green-600 uppercase tracking-widest border border-green-100">Active</div>
      </div>

      <div className="flex gap-2 overflow-x-auto pb-4 scrollbar-hide">
        {days.map((date, i) => {
          const d = new Date(date);
          const isActive = date === selectedDate;
          return (
            <button 
              key={i} 
              onClick={() => setSelectedDate(date)}
              className={cn(
                "px-4 py-2 rounded-2xl text-[10px] font-black flex-shrink-0 transition-all shadow-sm border",
                isActive ? "bg-green-600 text-white border-green-600 shadow-green-100" : "bg-white text-slate-400 border-slate-50"
              )}
            >
              {d.toLocaleDateString('vi-VN', { weekday: 'short', day: 'numeric' })}
            </button>
          );
        })}
      </div>

      {loading ? (
        <div className="py-20 flex justify-center"><Loader2 className="h-6 w-6 text-green-600 animate-spin" /></div>
      ) : (
        <div className="space-y-8">
          {shifts.map((shift, i) => {
            const shiftAssignments = assignments.filter(a => a.shiftId === shift.id);
            const Icon = i === 0 ? Sun : i === 1 ? Waves : Moon;
            
            return (
              <div key={shift.id || i} className="space-y-4">
                <div className="flex items-center justify-between px-1">
                  <div className="flex items-center gap-2">
                    <div className={cn("p-1.5 rounded-lg", i === 0 ? "bg-orange-50 text-orange-400" : i === 1 ? "bg-blue-50 text-blue-400" : "bg-indigo-50 text-indigo-400")}>
                      <Icon className="h-3 w-3" />
                    </div>
                    <h4 className="text-[10px] font-black text-slate-900 uppercase tracking-widest italic">{shift.name}</h4>
                  </div>
                  <span className="text-[9px] font-bold text-slate-400 italic">{shift.startTime} - {shift.endTime}</span>
                </div>
                
                <div className="space-y-2">
                  {shiftAssignments.length > 0 ? (
                    shiftAssignments.map((p, j) => (
                      <div key={j} className="bg-white p-4 rounded-3xl shadow-sm border border-slate-100 flex items-center justify-between active:bg-slate-50 transition-all group ring-1 ring-black/5">
                        <div className="flex items-center gap-4">
                          <div className="h-11 w-11 bg-slate-50 rounded-2xl overflow-hidden flex items-center justify-center border border-slate-100 italic font-black text-slate-300 text-xs">
                            {p.employeePhoto ? <img src={p.employeePhoto} className="h-full w-full object-cover" alt="" /> : <span>{p.employeeName?.charAt(0) || 'U'}</span>}
                          </div>
                          <div>
                            <p className="text-xs font-black text-slate-900 italic leading-none mb-1">{p.employeeName}</p>
                            <p className="text-[9px] text-slate-500 font-bold italic uppercase tracking-tighter">{p.employeeRole || 'Nhân viên POS'}</p>
                          </div>
                        </div>
                        <div className="text-right">
                          <div className={cn(
                            "px-2 py-0.5 rounded-full text-[8px] font-black uppercase mb-1 tracking-tighter border", 
                            p.status === 'checked-in' ? "bg-green-50 text-green-600 border-green-100" : "bg-slate-50 text-slate-400 border-slate-100"
                          )}>
                            {p.status === 'checked-in' ? 'ĐÃ VÀO CA' : 'ĐÃ PHÂN LỊCH'}
                          </div>
                          {p.checkInTime && <p className="text-[8px] font-black text-slate-400 uppercase italic leading-none">{p.checkInTime}</p>}
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="bg-slate-50/50 border-2 border-dashed border-slate-100 rounded-3xl py-8 text-center">
                      <p className="text-[10px] font-black italic text-slate-300 uppercase tracking-widest">Chưa có nhân sự trực ca</p>
                    </div>
                  )}
                  
                  {isManagement && (
                    <button 
                      onClick={() => setIsModalOpen(true)}
                      className="w-full h-12 border-2 border-dashed border-green-100 rounded-2xl flex items-center justify-center gap-2 text-green-600/40 hover:text-green-600 hover:border-green-200 transition-all active:scale-98"
                    >
                      <Plus className="h-4 w-4" />
                      <span className="text-[8px] font-black uppercase tracking-widest italic">Điều động nhân sự</span>
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}

      <ShiftAssignmentModal 
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        location={location}
        date={selectedDate}
        onSuccess={fetchData}
      />
    </motion.div>
  );
}

function GPSAttendanceView({ userProfile, onConfirm }: { userProfile: any, onConfirm: () => void }) {
  const [now, setNow] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => setNow(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="pb-10">
      <div className="bg-slate-50 px-4 py-2 flex items-center justify-between border-b border-slate-100">
        <div>
          <p className="text-[8px] font-black text-slate-400 uppercase italic tracking-widest leading-none">GIỜ HIỆN TẠI</p>
          <p className="text-sm font-black text-green-600 mt-1">{now.toLocaleTimeString('vi-VN')}</p>
        </div>
        <div className="text-right">
          <p className="text-[8px] font-black text-slate-400 uppercase italic tracking-widest leading-none">ĐỘ CHÍNH XÁC GPS</p>
          <div className="flex items-center justify-end gap-1 text-green-600 mt-1">
            <Navigation className="h-3 w-3" />
            <span className="text-[10px] font-bold uppercase">+/- 3m</span>
          </div>
        </div>
      </div>

      <div className="relative h-[250px] bg-slate-200">
        <img 
          src="https://api.mapbox.com/styles/v1/mapbox/light-v10/static/106.7011,10.7758,15,0/400x250?access_token=pk.eyJ1IjoiZGVtbyIsImEiOiJjbDFpZ3R4ZmcwMWRpM2tsaHZiZ3J6ZzZtIn0.demo" 
          alt="Map" 
          className="w-full h-full object-cover grayscale opacity-80"
        />
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="relative">
            <div className="absolute inset-0 bg-green-500/20 rounded-full animate-ping"></div>
            <div className="relative h-12 w-12 bg-white rounded-full shadow-2xl flex items-center justify-center border-2 border-green-600">
              <MapPin className="h-7 w-7 text-green-600 fill-green-600/10" />
            </div>
          </div>
        </div>
      </div>

      <div className="px-4 -mt-8 relative z-10 space-y-4">
        <div className="bg-white p-4 rounded-3xl shadow-xl border border-slate-100 ring-1 ring-black/5">
          <div className="flex items-start justify-between mb-4">
            <div className="flex gap-3">
              <div className="h-10 w-10 bg-green-50 rounded-xl flex items-center justify-center text-green-600 flex-shrink-0 shadow-inner">
                <MapPin className="h-5 w-5" />
              </div>
              <div>
                <h4 className="text-xs font-black text-slate-900 uppercase italic leading-tight">Vincom Center Đồng Khởi</h4>
                <p className="text-[9px] text-slate-400 mt-0.5 italic lowercase">72 Lê Thánh Tôn, Bến Nghé, Quận 1</p>
              </div>
            </div>
            <div className="bg-green-50 px-2 py-1 rounded-full flex items-center gap-1">
              <div className="h-1.5 w-1.5 rounded-full bg-green-600 animate-pulse"></div>
              <span className="text-[9px] font-black text-green-700 uppercase">Trong vùng</span>
            </div>
          </div>
          
          <div className="grid grid-cols-2 gap-4 py-3 border-t border-slate-50 italic">
            <div>
              <p className="text-[8px] font-black text-slate-400 uppercase tracking-widest leading-none mb-1">Khoảng cách</p>
              <div className="flex items-center gap-1 text-slate-700">
                <Navigation className="h-3 w-3 -rotate-45" />
                <span className="text-[10px] font-black">15m</span>
              </div>
            </div>
            <div>
              <p className="text-[8px] font-black text-slate-400 uppercase tracking-widest leading-none mb-1">An toàn</p>
              <div className="flex items-center gap-1 text-slate-700">
                <Scale className="h-3 w-3" />
                <span className="text-[10px] font-black">100m chuẩn</span>
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <button onClick={onConfirm} className="flex flex-col items-center justify-center p-4 bg-green-600 text-white rounded-3xl shadow-xl shadow-green-100 active:scale-98 transition-all group overflow-hidden relative">
            <div className="absolute inset-0 bg-white/10 opacity-0 group-hover:opacity-100 transition-opacity"></div>
            <div className="h-10 w-10 bg-white/20 rounded-full flex items-center justify-center mb-2">
              <Fingerprint className="h-6 w-6" />
            </div>
            <span className="text-[9px] font-black uppercase tracking-widest leading-none text-center">Vân tay / GPS</span>
          </button>
          <button onClick={onConfirm} className="flex flex-col items-center justify-center p-4 bg-white border-2 border-green-600 text-green-600 rounded-3xl shadow-xl shadow-green-50 active:scale-98 transition-all group overflow-hidden relative">
            <div className="absolute inset-0 bg-green-50/50 opacity-0 group-hover:opacity-100 transition-opacity"></div>
            <div className="h-10 w-10 bg-green-50 rounded-full flex items-center justify-center mb-2">
              <Camera className="h-6 w-6" />
            </div>
            <span className="text-[9px] font-black uppercase tracking-widest leading-none text-center">Nhận diện khuôn mặt</span>
          </button>
        </div>
        <button className="w-full h-12 bg-white text-slate-400 border border-slate-100 rounded-2xl flex items-center justify-center gap-3 active:bg-slate-50 transition-all font-black text-[10px] uppercase tracking-widest italic mt-2">
          <History className="h-4 w-4" />
          <span>Xem lịch sử chấm công</span>
        </button>
      </div>
    </motion.div>
  );
}

function AttendanceConfirmView({ userProfile, onBack }: { userProfile: any, onBack: () => void }) {
  const [success, setSuccess] = useState(true);

  return (
    <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="p-4 space-y-6">
      <div className="bg-white rounded-3xl shadow-xl overflow-hidden border border-slate-100 ring-1 ring-black/5">
        <div className="p-6">
          <div className="flex justify-between items-start mb-8">
            <div>
              <p className="text-[9px] font-black text-slate-400 uppercase italic">Nhân viên</p>
              <h2 className="text-xl font-black text-slate-900 uppercase italic leading-none mt-1">{userProfile?.displayName || 'User Name'}</h2>
              <p className="text-[10px] text-slate-500 font-bold italic mt-1 lowercase">ID: {userProfile?.uid?.slice(-8).toUpperCase()}</p>
            </div>
            <span className="bg-green-100 text-green-600 px-3 py-1 rounded-lg text-[9px] font-black uppercase italic">Hôm nay</span>
          </div>

          <div className="flex justify-around items-center mb-10">
            <div className="flex flex-col items-center">
              <p className="text-[9px] font-black text-slate-400 uppercase italic mb-3">Giờ vào</p>
              <div className="relative h-20 w-20 flex items-center justify-center">
                <div className="absolute inset-0 border-[5px] border-green-50 rounded-full"></div>
                <div className="absolute inset-0 border-[5px] border-green-600 rounded-full" style={{ clipPath: 'polygon(50% 0, 100% 0, 100% 100%, 50% 100%)' }}></div>
                <div className="p-2 bg-green-50 rounded-full"><CheckCircle2 className="h-5 w-5 text-green-600" /></div>
              </div>
              <p className="mt-3 text-base font-black text-slate-900 uppercase italic">08:38:25</p>
              <p className="text-[8px] text-green-600 font-black italic">27/07/2025</p>
            </div>

            <div className="h-px w-6 bg-slate-100"></div>

            <div className="flex flex-col items-center opacity-40">
              <p className="text-[9px] font-black text-slate-400 uppercase italic mb-3">Giờ ra</p>
              <div className="relative h-20 w-20 flex items-center justify-center">
                <div className="absolute inset-0 border-[5px] border-slate-50 rounded-full"></div>
                <div className="p-2 bg-slate-50 rounded-full"><History className="h-5 w-5 text-slate-300" /></div>
              </div>
              <p className="mt-3 text-base font-black text-slate-300 italic tracking-tighter">-- : -- : --</p>
            </div>
          </div>

          <div className={cn("p-4 rounded-2xl flex items-center justify-between mb-6 transition-all border shadow-inner", success ? "bg-green-50 border-green-100" : "bg-red-50 border-red-100")}>
            <div className="flex items-center gap-3">
              <CheckCircle2 className={cn("h-5 w-5", success ? "text-green-600" : "text-red-500")} />
              <div>
                <p className="text-[10px] font-black text-slate-900 uppercase italic">{success ? "Hợp lệ" : "Lỗi ghi nhận"}</p>
                <p className="text-[8px] text-slate-500 italic lowercase font-bold">Xác nhận dữ liệu thành công</p>
              </div>
            </div>
            <div onClick={() => setSuccess(!success)} className={cn("h-6 w-11 rounded-full p-1 relative cursor-pointer transition-all", success ? "bg-green-600" : "bg-slate-300 shadow-inner")}>
              <div className={cn("h-4 w-4 bg-white rounded-full absolute transition-all", success ? "right-1" : "left-1")}></div>
            </div>
          </div>

          <div className="space-y-2">
            <p className="text-[9px] font-black text-slate-400 uppercase italic pl-1">Ghi chú hành chính</p>
            <textarea placeholder="Nhập ghi chú nếu có sai sót..." className="w-full h-24 p-4 bg-slate-50 border border-slate-100 rounded-3xl text-xs font-bold outline-none focus:border-green-600 transition-colors shadow-inner" />
          </div>
        </div>
        
        <div className="p-6 pt-0 space-y-3">
          <button onClick={onBack} className="w-full h-14 bg-green-600 text-white rounded-2xl text-xs font-black uppercase tracking-widest shadow-xl shadow-green-100 active:translate-y-0.5 transition-all">Lưu xác nhận</button>
          <button onClick={onBack} className="w-full h-12 border-2 border-slate-100 text-slate-300 rounded-2xl text-[10px] font-black uppercase tracking-widest active:bg-slate-50 transition-colors">Hủy bỏ</button>
        </div>
      </div>
    </motion.div>
  );
}

function ReportsView({ onLeaveRequest }: { onLeaveRequest: () => void }) {
  return (
    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="p-4 space-y-4 pb-20 font-sans">
      <div className="flex gap-1 mb-6 bg-slate-100 p-1 rounded-2xl">
        {['TT nhân viên', 'TT chấm công', 'TT tuân thủ'].map((t, i) => (
          <button key={i} className={cn(
            "flex-1 py-2 text-[9px] font-black uppercase tracking-widest rounded-xl transition-all",
            i === 1 ? "bg-white text-slate-900 shadow-sm" : "text-slate-400"
          )}>{t}</button>
        ))}
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="bg-white p-5 rounded-3xl shadow-sm border border-slate-100 ring-1 ring-black/5">
          <Calendar className="h-4 w-4 text-green-600 mb-6" />
          <p className="text-[9px] font-black text-slate-400 uppercase italic">Công tiêu chuẩn</p>
          <div className="flex items-baseline gap-1 mt-1 text-slate-900">
            <span className="text-2xl font-black">26.0</span>
          </div>
        </div>
        <div className="bg-white p-5 rounded-3xl shadow-sm border border-slate-100 ring-1 ring-black/5">
          <CheckCircle2 className="h-4 w-4 text-green-600 mb-6" />
          <p className="text-[9px] font-black text-slate-400 uppercase italic">Công thực tế</p>
          <div className="flex items-baseline gap-1 mt-1 text-green-600">
            <span className="text-2xl font-black">22.5</span>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-[2rem] shadow-sm border border-slate-100 p-6 ring-1 ring-black/5">
        <h3 className="text-[10px] font-black text-slate-900 uppercase tracking-widest mb-6 italic">Chi tiết nghỉ & phép</h3>
        <div className="space-y-5">
          {[
            { label: 'Số ngày phép được sử dụng', value: '12.0', icon: Calendar },
            { label: 'Số ngày phép đã sử dụng', value: '2.5', icon: History, color: 'text-red-500' },
            { label: 'Số ngày phép tồn (Tháng trước)', value: '1.5', icon: Gift },
            { label: 'Số ngày nghỉ KL', value: '0.0', icon: XCircle },
          ].map((item, i) => (
            <div key={i} className="flex items-center justify-between group">
              <div className="flex items-center gap-3">
                <div className="h-6 w-6 text-slate-300">
                  <item.icon className="h-4 w-4" />
                </div>
                <span className="text-[10px] font-bold text-slate-600 uppercase italic tracking-tighter">{item.label}</span>
              </div>
              <div className="flex items-center gap-2">
                <span className={cn("text-xs font-black", item.color || "text-slate-900")}>{item.value}</span>
              </div>
            </div>
          ))}
        </div>
        <button 
          onClick={onLeaveRequest}
          className="w-full mt-6 h-12 bg-green-600 text-white rounded-2xl flex items-center justify-center gap-2 text-[10px] font-black uppercase tracking-widest shadow-xl shadow-green-100 active:translate-y-0.5 transition-all"
        >
          <Plus className="h-4 w-4" />
          <span>Đăng ký nghỉ phép</span>
        </button>
      </div>

      <div className="rounded-3xl bg-green-700 p-6 shadow-xl shadow-green-100 text-white relative h-20 flex items-center justify-between ring-1 ring-black/10 overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(255,255,255,0.1),transparent)] pointer-events-none"></div>
        <div>
          <p className="text-[8px] font-black uppercase tracking-[0.2em] text-green-200 mb-1 leading-none">TỔNG CỘNG QUYẾT TOÁN</p>
          <h4 className="text-lg font-black leading-none italic">Số ngày công tính lương</h4>
        </div>
        <div className="flex items-baseline gap-1">
          <span className="text-3xl font-black">24.0</span>
          <span className="text-[7px] font-black uppercase italic opacity-60">Ngày công</span>
        </div>
      </div>

      <div className="space-y-4">
        <div className="flex justify-between items-center px-1">
          <h3 className="text-[10px] font-black text-slate-900 uppercase tracking-widest italic">Lịch sử gần đây</h3>
          <button className="text-[8px] font-black text-green-600 uppercase tracking-widest">Xem tất cả</button>
        </div>
        <div className="space-y-3">
          {[
            { date: 'TH2 15', title: 'Có mặt • 08:00 - 17:00', desc: 'Văn phòng chính', status: 'success' },
            { date: 'TH3 16', title: 'Nghỉ phép • Có lương', desc: 'Nghỉ việc riêng', status: 'info' }
          ].map((log, i) => (
            <div key={i} className="bg-white p-4 rounded-[2rem] border border-slate-100 flex items-center justify-between shadow-sm ring-1 ring-black/5 active:scale-[0.98] transition-all">
              <div className="flex items-center gap-4">
                <div className="h-12 w-12 bg-slate-50 rounded-2xl flex flex-col items-center justify-center text-slate-400">
                  <p className="text-[7px] font-black uppercase tracking-tighter opacity-50">{log.date.split(' ')[0]}</p>
                  <p className="text-sm font-black italic mt-0.5">{log.date.split(' ')[1]}</p>
                </div>
                <div>
                  <p className="text-xs font-black text-slate-900 leading-none mb-1">{log.title}</p>
                  <p className="text-[9px] text-slate-400 font-bold italic lowercase">{log.desc}</p>
                </div>
              </div>
              <div className={cn(
                "h-6 w-6 rounded-full flex items-center justify-center",
                log.status === 'success' ? "bg-green-50 text-green-600" : "bg-slate-50 text-slate-300"
              )}>
                {log.status === 'success' ? <CheckCircle2 className="h-4 w-4" /> : <AlertCircle className="h-4 w-4" />}
              </div>
            </div>
          ))}
        </div>
      </div>
    </motion.div>
  );
}

function ProfileView({ userProfile }: { userProfile: any }) {
  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="p-6 space-y-8">
      <div className="flex flex-col items-center">
        <div className="relative">
          <div className="h-28 w-28 rounded-full border-4 border-green-600 p-1.5 shadow-2xl ring-4 ring-green-50 animate-soft-pulse overflow-hidden">
            <img 
              src={userProfile?.photoURL || "https://images.unsplash.com/photo-1599566150163-29194dcaad36?auto=format&fit=crop&q=80&w=200"} 
              alt="Avatar" 
              className="h-full w-full object-cover rounded-full" 
              referrerPolicy="no-referrer"
            />
          </div>
          <button className="absolute bottom-1 right-1 h-9 w-9 bg-green-600 text-white rounded-full flex items-center justify-center border-4 border-slate-50 shadow-xl active:scale-90 transition-all">
            <Camera className="h-4 w-4" />
          </button>
        </div>
        <h2 className="mt-5 text-xl font-black text-slate-900 uppercase italic tracking-tight">{userProfile?.displayName || 'User Name'}</h2>
        <p className="text-[10px] font-black text-green-600 uppercase tracking-[0.2em] mt-1 italic">{userProfile?.role}</p>
        <p className="text-[9px] text-slate-400 font-bold mt-1 uppercase italic tracking-widest opacity-60">ID: {userProfile?.uid?.slice(-8).toUpperCase()}</p>
      </div>

      <div className="space-y-4">
        {[
          { label: 'Thông tin cá nhân', icon: User },
          { label: 'Cài đặt thông báo', icon: Bell },
          { label: 'Quy tắc công ty', icon: AlertCircle },
          { label: 'Đăng xuất', icon: History, color: 'text-red-500' }
        ].map((item, i) => (
          <div key={i} className="bg-white p-4 rounded-3xl border border-slate-100 flex items-center justify-between group active:bg-slate-50 transition-all shadow-sm ring-1 ring-black/5">
            <div className="flex items-center gap-4">
              <div className={cn("p-2.5 rounded-2xl", item.color ? "bg-red-50" : "bg-slate-50", item.color || "text-slate-500 shadow-inner")}>
                <item.icon className="h-5 w-5" />
              </div>
              <span className={cn("text-[11px] font-black uppercase italic tracking-tighter", item.color || "text-slate-700")}>{item.label}</span>
            </div>
            <ChevronRight className="h-4 w-4 text-slate-100" />
          </div>
        ))}
      </div>
    </motion.div>
  );
}

function NotificationsView({ notifications, onBack, onMarkAsRead }: { notifications: any[], onBack: () => void, onMarkAsRead: (id: string) => void }) {
  return (
    <motion.div initial={{ opacity: 0, scale: 0.98 }} animate={{ opacity: 1, scale: 1 }} className="p-4 space-y-4 min-h-screen bg-slate-50">
      <div className="flex items-center gap-3 mb-2">
        <button onClick={onBack} className="h-10 w-10 bg-white rounded-xl shadow-sm border border-slate-100 flex items-center justify-center text-slate-900 active:scale-95 transition-all">
          <ChevronLeft className="h-5 w-5" />
        </button>
        <h3 className="text-xs font-black text-slate-900 uppercase italic">Thông báo</h3>
      </div>

      <div className="space-y-3">
        {notifications.length > 0 ? (
          [...notifications].sort((a, b) => (b.createdAt?.seconds || 0) - (a.createdAt?.seconds || 0)).map((notif) => (
            <div 
              key={notif.id} 
              onClick={() => !notif.isRead && onMarkAsRead(notif.id)}
              className={cn(
                "bg-white p-4 rounded-3xl border transition-all flex items-start gap-4 ring-1 ring-black/5 cursor-pointer",
                !notif.isRead ? "border-green-100 bg-green-50/30" : "border-slate-100 shadow-sm"
              )}
            >
              <div className={cn(
                "h-10 w-10 rounded-2xl flex items-center justify-center flex-shrink-0 shadow-sm",
                notif.type === 'leave_request' ? "bg-orange-50 text-orange-400" : "bg-blue-50 text-blue-400"
              )}>
                {notif.type === 'leave_request' ? <Sun className="h-5 w-5" /> : <Bell className="h-5 w-5" />}
              </div>
              <div className="flex-1">
                <div className="flex justify-between items-start mb-1">
                  <p className="text-[10px] font-black text-slate-900 uppercase italic">{notif.title}</p>
                  {!notif.isRead && <div className="h-2 w-2 bg-red-500 rounded-full"></div>}
                </div>
                <p className="text-xs font-bold text-slate-600 leading-relaxed mb-2">{notif.message}</p>
                <div className="flex justify-between items-center">
                  <p className="text-[8px] font-black text-slate-400 uppercase italic">
                    {notif.createdAt?.toDate ? notif.createdAt.toDate().toLocaleString('vi-VN') : 'Mới đây'}
                  </p>
                  {notif.type === 'leave_request' && (
                    <span className="text-[7px] font-black text-green-600 border border-green-200 px-1 rounded uppercase italic bg-white">Xem yêu cầu</span>
                  )}
                </div>
              </div>
            </div>
          ))
        ) : (
          <div className="py-20 flex flex-col items-center justify-center text-slate-300">
            <Bell className="h-12 w-12 mb-4 opacity-20" />
            <p className="text-xs font-black uppercase italic tracking-widest">Không có thông báo mới</p>
          </div>
        )}
      </div>
    </motion.div>
  );
}

function SubmitLeaveRequestView({ userProfile, onBack }: { userProfile: any, onBack: () => void }) {
  const [loading, setLoading] = useState(false);
  const [type, setType] = useState('Việc gia đình');
  const [reason, setReason] = useState('');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');

  const handleSubmit = async () => {
    if (!reason || !startDate || !endDate) return;
    
    setLoading(true);
    try {
      await submitLeaveRequest({
        employeeId: userProfile.uid,
        employeeName: userProfile.displayName,
        employeePhoto: userProfile.photoURL,
        type,
        reason,
        startDate,
        endDate,
        timestamp: new Date().toISOString()
      });
      onBack();
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="p-4 space-y-6 pb-20 bg-slate-50 min-h-screen">
      <div className="flex items-center gap-3">
        <button onClick={onBack} className="h-10 w-10 bg-white rounded-xl shadow-sm border border-slate-100 flex items-center justify-center text-slate-900 active:scale-95 transition-all">
          <ChevronLeft className="h-5 w-5" />
        </button>
        <h3 className="text-xs font-black text-slate-900 uppercase italic">Đăng ký nghỉ phép</h3>
      </div>

      <div className="bg-white p-6 rounded-3xl shadow-sm border border-slate-100 space-y-6">
        <div className="space-y-2">
          <label className="text-[9px] font-black text-slate-400 uppercase italic px-1">Loại nghỉ</label>
          <select 
            value={type}
            onChange={(e) => setType(e.target.value)}
            className="w-full h-14 bg-white border border-slate-100 rounded-2xl px-5 text-xs font-black italic shadow-sm outline-none focus:border-green-600 appearance-none transition-all"
          >
            <option>Việc gia đình</option>
            <option>Nghỉ ốm</option>
            <option>Nghỉ phép năm</option>
            <option>Khác</option>
          </select>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <label className="text-[9px] font-black text-slate-400 uppercase italic px-1">Từ ngày</label>
            <input 
              type="date" 
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
              className="w-full h-14 bg-white border border-slate-100 rounded-2xl px-5 text-xs font-black italic shadow-sm outline-none focus:border-green-600 transition-all font-sans"
            />
          </div>
          <div className="space-y-2">
            <label className="text-[9px] font-black text-slate-400 uppercase italic px-1">Đến ngày</label>
            <input 
              type="date" 
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
              className="w-full h-14 bg-white border border-slate-100 rounded-2xl px-5 text-xs font-black italic shadow-sm outline-none focus:border-green-600 transition-all font-sans"
            />
          </div>
        </div>

        <div className="space-y-2">
          <label className="text-[9px] font-black text-slate-400 uppercase italic px-1">Lý do nghỉ</label>
          <textarea 
            value={reason}
            onChange={(e) => setReason(e.target.value)}
            placeholder="Nhập lý do chi tiết..."
            className="w-full h-32 bg-slate-50 border border-slate-100 rounded-3xl p-5 text-xs font-bold italic shadow-inner outline-none focus:border-green-600 transition-all"
          />
        </div>
      </div>

      <div className="pt-4 space-y-4">
        <button 
          onClick={handleSubmit}
          disabled={loading || !reason || !startDate || !endDate}
          className="w-full h-14 bg-green-600 disabled:bg-slate-300 text-white rounded-[1.5rem] text-xs font-black uppercase tracking-widest shadow-xl shadow-green-100 active:translate-y-0.5 transition-all flex items-center justify-center gap-2"
        >
          {loading ? <Loader2 className="h-5 w-5 animate-spin" /> : (
            <>
              <Check className="h-4 w-4" />
              <span>Gửi yêu cầu</span>
            </>
          )}
        </button>
        <div className="bg-green-50 p-4 rounded-2xl border border-green-100 flex items-start gap-3">
          <AlertCircle className="h-4 w-4 text-green-600 flex-shrink-0 mt-0.5" />
          <p className="text-[9px] text-green-700 font-bold italic leading-relaxed">Yêu cầu của bạn sẽ được gửi đến Tổ trưởng, P. Kinh doanh, P. TCHC và Giám đốc để phê duyệt theo quy trình.</p>
        </div>
      </div>
    </motion.div>
  );
}
