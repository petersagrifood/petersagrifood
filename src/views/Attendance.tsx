import React from 'react';
import { 
  Calendar, 
  MapPin, 
  ArrowRight,
  ChevronLeft,
  ChevronRight,
  Sun,
  Cloud,
  Moon,
  Info,
  ExternalLink,
  Users,
  Settings,
  Bell,
  Plus,
  ArrowRightLeft,
  Wand2
} from 'lucide-react';
import { cn } from '@/src/lib/utils';

const schedule = [
  { 
    id: 1, 
    name: 'Nguyễn Văn An', 
    dept: 'Sản xuất', 
    avatar: 'https://images.unsplash.com/photo-1599566150163-29194dcaad36?auto=format&fit=crop&q=80&w=100',
    shifts: [
      { day: 22, type: 'morning', label: 'Ca Sáng', time: '06:00 - 14:00' },
      { day: 23, type: 'afternoon', label: 'Ca Chiều', time: '14:00 - 22:00' },
      { day: 24, type: 'morning', label: 'Ca Sáng', time: '06:00 - 14:00' },
      { day: 25, type: 'off', label: 'OFF' },
      { day: 26, type: 'morning', label: 'Ca Sáng', time: '06:00 - 14:00' },
      { day: 27, type: 'morning', label: 'Ca Sáng', time: '06:00 - 14:00' },
      { day: 28, type: 'off', label: 'OFF' },
    ]
  },
  { 
    id: 2, 
    name: 'Trần Thị Bình', 
    dept: 'Logistics', 
    avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=80&w=100',
    shifts: [
      { day: 22, type: 'night', label: 'Ca Đêm', time: '22:00 - 06:00' },
      { day: 23, type: 'night', label: 'Ca Đêm', time: '22:00 - 06:00' },
      { day: 24, type: 'off', label: 'OFF' },
      { day: 25, type: 'afternoon', label: 'Ca Chiều', time: '14:00 - 22:00' },
      { day: 26, type: 'afternoon', label: 'Ca Chiều', time: '14:00 - 22:00' },
      { day: 27, type: 'afternoon', label: 'Ca Chiều', time: '14:00 - 22:00' },
      { day: 28, type: 'afternoon', label: 'Ca Chiều', time: '14:00 - 22:00' },
    ]
  },
  { 
    id: 3, 
    name: 'Lê Văn Cường', 
    dept: 'Kinh doanh', 
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=100',
    shifts: [
      { day: 22, type: 'afternoon', label: 'Ca Chiều', time: '14:00 - 22:00' },
      { day: 23, type: 'morning', label: 'Ca Sáng', time: '06:00 - 14:00' },
      { day: 24, type: 'morning', label: 'Ca Sáng', time: '06:00 - 14:00' },
      { day: 25, type: 'night', label: 'Ca Đêm', time: '22:00 - 06:00' },
      { day: 26, type: 'off', label: 'OFF' },
      { day: 27, type: 'night', label: 'Ca Đêm', time: '22:00 - 06:00' },
      { day: 28, type: 'night', label: 'Ca Đêm', time: '22:00 - 06:00' },
    ]
  },
];

const summaryStats = [
  { label: 'Tổng Ca Sáng', value: 124, icon: Sun, color: 'text-green-600', bg: 'bg-green-50' },
  { label: 'Tổng Ca Chiều', value: 86, icon: Cloud, color: 'text-blue-600', bg: 'bg-blue-50' },
  { label: 'Tổng Ca Đêm', value: 42, icon: Moon, color: 'text-indigo-600', bg: 'bg-indigo-50' },
];

export default function Attendance() {
  return (
    <div className="flex flex-col gap-6 p-8">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <h2 className="text-2xl font-bold text-slate-800">Lịch làm việc tuần</h2>
          <div className="flex items-center gap-2 rounded-full border border-slate-200 bg-white px-4 py-2 font-bold text-slate-600 transition-all shadow-sm">
            <Calendar className="h-4 w-4 text-slate-400" />
            <span className="text-xs">22 May - 28 May, 2024</span>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <button className="flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-2 text-xs font-bold text-slate-700 transition-colors hover:bg-slate-50">
            <ArrowRightLeft className="h-4 w-4" />
            Đổi ca nhanh
          </button>
          <button className="flex items-center gap-2 rounded-xl bg-green-600 px-4 py-2 text-xs font-bold text-white shadow-sm transition-all hover:bg-green-700 active:scale-[0.98]">
            <Wand2 className="h-4 w-4" />
            Sắp xếp ca tự động
          </button>
        </div>
      </div>

      <div className="flex flex-wrap items-center gap-3">
        <div className="relative flex items-center gap-2 rounded-xl border border-slate-100 bg-white px-4 py-2 shadow-sm transition-all focus-within:border-green-300">
          <MapPin className="h-4 w-4 text-slate-400" />
          <select className="cursor-pointer border-none bg-transparent p-0 pr-8 font-sans text-xs font-semibold text-slate-600 focus:ring-0">
            <option>Tất cả địa điểm</option>
            <option>Nhà máy Hóc Môn</option>
            <option>Kho Củ Chi</option>
            <option>Cửa hàng Quận 1</option>
          </select>
        </div>
        <div className="relative flex items-center gap-2 rounded-xl border border-slate-100 bg-white px-4 py-2 shadow-sm transition-all focus-within:border-green-300">
          <Users className="h-4 w-4 text-slate-400" />
          <select className="cursor-pointer border-none bg-transparent p-0 pr-8 font-sans text-xs font-semibold text-slate-600 focus:ring-0">
            <option>Tất cả bộ phận</option>
            <option>Sản xuất</option>
            <option>Logistics</option>
            <option>Kinh doanh</option>
          </select>
        </div>
      </div>

      <div className="overflow-hidden rounded-2xl border border-slate-100 bg-white shadow-sm">
        <div className="overflow-x-auto">
          <div className="min-w-[1000px]">
            {/* Header */}
            <div className="grid grid-cols-[240px_repeat(7,1fr)] bg-slate-50/50">
              <div className="border-b border-r border-slate-100 p-4 font-bold text-[10px] uppercase tracking-widest text-slate-400">NHÂN VIÊN</div>
              {['Mon 22', 'Tue 23', 'Wed 24', 'Thu 25', 'Fri 26', 'Sat 27', 'Sun 28'].map((day, idx) => (
                <div key={idx} className={cn(
                  "border-b border-slate-100 p-4 text-center transition-colors",
                  idx === 2 ? "bg-green-50/50" : "",
                  idx === 6 ? "text-red-500" : "text-slate-800"
                )}>
                  <div className={cn("text-[10px] font-bold uppercase", idx === 2 ? "text-green-600" : "text-slate-400")}>
                    {day.split(' ')[0]}
                  </div>
                  <div className={cn("mt-1 text-xl font-black", idx === 2 ? "text-green-600" : "")}>{day.split(' ')[1]}</div>
                </div>
              ))}
            </div>

            {/* Rows */}
            {schedule.map((emp) => (
              <div key={emp.id} className="grid grid-cols-[240px_repeat(7,1fr)] items-stretch">
                <div className="flex items-center gap-3 border-b border-r border-slate-100 p-4 group cursor-pointer transition-colors hover:bg-slate-50">
                  <img src={emp.avatar} alt={emp.name} className="h-10 w-10 shrink-0 rounded-full border-2 border-white shadow-sm transition-transform group-hover:scale-105" />
                  <div className="min-w-0">
                    <div className="truncate text-sm font-bold text-slate-900 transition-colors group-hover:text-green-600">{emp.name}</div>
                    <div className="text-[10px] font-bold uppercase tracking-wider text-slate-400">{emp.dept}</div>
                  </div>
                </div>
                {emp.shifts.map((shift, idx) => (
                  <div key={idx} className={cn(
                    "border-b border-slate-100 p-2 transition-all duration-300",
                    idx === 2 ? "bg-green-50/20" : ""
                  )}>
                    <div className={cn(
                      "flex h-full flex-col justify-center rounded-xl p-2.5 transition-all hover:shadow-sm active:scale-95",
                      shift.type === 'morning' ? "bg-green-50 text-green-700 border border-green-100/50" : 
                      shift.type === 'afternoon' ? "bg-blue-50 text-blue-700 border border-blue-100/50" : 
                      shift.type === 'night' ? "bg-indigo-50 text-indigo-700 border border-indigo-100/50" : 
                      "bg-slate-50 text-slate-400 border border-dashed border-slate-200"
                    )}>
                      <div className="text-[9px] font-black uppercase tracking-tight">{shift.label}</div>
                      {shift.time && <div className="mt-1 text-[10px] font-medium leading-none opacity-80">{shift.time}</div>}
                    </div>
                  </div>
                ))}
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
        {summaryStats.map((item) => (
          <div key={item.label} className="flex items-center gap-4 rounded-2xl border border-slate-100 bg-white p-6 shadow-sm transition-transform hover:-translate-y-1">
            <div className={cn("flex h-12 w-12 items-center justify-center rounded-xl shadow-inner", item.bg, item.color)}>
              <item.icon className="h-6 w-6" />
            </div>
            <div>
              <div className="text-[10px] font-bold uppercase tracking-widest text-slate-400">{item.label}</div>
              <div className="text-3xl font-black text-slate-800">{item.value}</div>
            </div>
          </div>
        ))}
      </div>

      <div className="rounded-2xl border border-slate-100 bg-white p-6 shadow-sm">
        <div className="mb-6 flex items-center justify-between">
          <h3 className="text-base font-bold text-slate-800">Chú thích & Thống kê nhanh</h3>
          <button className="flex items-center gap-1 text-xs font-bold text-green-600 hover:underline">
            Xem chi tiết báo cáo
            <ArrowRight className="h-3 w-3" />
          </button>
        </div>
        <div className="flex flex-wrap gap-x-8 gap-y-4">
          {[
            { label: 'Ca Sáng (06:00 - 14:00)', color: 'bg-green-500' },
            { label: 'Ca Chiều (14:00 - 22:00)', color: 'bg-blue-500' },
            { label: 'Ca Đêm (22:00 - 06:00)', color: 'bg-indigo-500' },
            { label: 'Ngày Nghỉ (OFF)', color: 'bg-slate-300' },
          ].map((legend) => (
            <div key={legend.label} className="flex items-center gap-2">
              <div className={cn("h-3 w-3 rounded-full", legend.color)} />
              <span className="text-xs font-medium text-slate-600">{legend.label}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
