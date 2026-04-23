import React from 'react';
import { 
  Users, 
  Briefcase, 
  Palmtree as BeachAccess, 
  UserMinus, 
  ChevronRight,
  TrendingUp,
  TrendingDown,
  Clock,
  AlertTriangle,
  Verified,
  Zap,
  Map as MapIcon,
  Navigation
} from 'lucide-react';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  Cell
} from 'recharts';
import { motion } from 'motion/react';
import { cn } from '@/src/lib/utils';

const stats = [
  { label: 'Tổng nhân sự', value: '1,248', icon: Users, color: 'text-green-600', bg: 'bg-green-50', trend: '+12%', trendColor: 'text-green-600' },
  { label: 'Server Status', value: 'ONLINE', icon: Zap, color: 'text-blue-600', bg: 'bg-blue-50', trend: 'Node.js v20+', trendColor: 'text-blue-600' },
  { label: 'Yêu cầu chờ duyệt', value: '24', icon: Clock, color: 'text-amber-600', bg: 'bg-amber-50', trend: 'Gấp', trendColor: 'text-amber-600' },
  { label: 'Vi phạm chấm công', value: '08', icon: AlertTriangle, color: 'text-red-600', bg: 'bg-red-50', trend: '-5%', trendColor: 'text-red-600' },
];

const chartData = [
  { name: 'Trạm 1 (Củ Chi)', value: 85 },
  { name: 'Trạm 2 (Hóc Môn)', value: 65 },
  { name: 'Kho lạnh', value: 95 },
  { name: 'Chế biến', value: 45 },
  { name: 'Văn phòng', value: 75 },
];

const requests = [
  { name: 'Nguyễn Văn Bình', type: 'Đổi ca', time: '2 giờ trước', avatar: 'https://images.unsplash.com/photo-1599566150163-29194dcaad36?auto=format&fit=crop&q=80&w=100' },
  { name: 'Lê Thị Mai', type: 'Nghỉ phép', time: '3 giờ trước', avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=80&w=100', highlight: true },
  { name: 'Phạm Minh Tuấn', type: 'Đổi ca', time: '5 giờ trước', avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=100' },
  { name: 'Hoàng Quốc Huy', type: 'Nghỉ phép', time: '6 giờ trước', avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&q=80&w=100' },
  { name: 'Trần Thu Hà', type: 'Đổi ca', time: '8 giờ trước', avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?auto=format&fit=crop&q=80&w=100' },
];

export default function Dashboard() {
  return (
    <div className="space-y-8 p-8">
      <div className="flex flex-col gap-1">
        <h1 className="font-sans text-3xl font-bold tracking-tight text-slate-900">Dashboard Tổng Quan</h1>
        <p className="text-sm font-medium text-slate-500">Chào buổi sáng, An. Đây là tình hình nhân sự hôm nay tại các trạm Sagrifood.</p>
      </div>

      <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat, idx) => (
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: idx * 0.1 }}
            key={stat.label} 
            className="flex flex-col gap-4 rounded-xl border border-slate-100 bg-white p-6 shadow-[0px_4px_12px_rgba(0,0,0,0.05)]"
          >
            <div className="flex items-start justify-between">
              <div className={`rounded-lg ${stat.bg} p-3`}>
                <stat.icon className={`h-6 w-6 ${stat.color}`} />
              </div>
              <span className={`text-xs font-bold ${stat.trendColor} rounded-full px-2 py-1`}>
                {stat.label === 'Đang làm việc' ? <span className="mr-1 inline-block h-2 w-2 rounded-full bg-green-500"></span> : null}
                {stat.trend}
              </span>
            </div>
            <div>
              <p className="text-[10px] font-bold uppercase tracking-widest text-slate-500">{stat.label}</p>
              <p className="mt-1 text-3xl font-black text-slate-900">{stat.value}</p>
            </div>
          </motion.div>
        ))}
      </div>

      <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
        <div className="flex flex-col rounded-xl border border-slate-100 bg-white p-6 shadow-[0px_4px_12px_rgba(0,0,0,0.05)] lg:col-span-2">
          <div className="mb-8 flex items-center justify-between">
            <div>
              <h3 className="text-lg font-bold text-slate-900">So sánh quân số địa điểm</h3>
              <p className="text-xs text-slate-400">Dữ liệu cập nhật theo thời gian thực (Giây)</p>
            </div>
            <select className="cursor-pointer rounded-lg border-none bg-slate-50 px-4 py-2 text-sm font-semibold focus:ring-2 focus:ring-green-500">
              <option>Tuần này</option>
              <option>Tháng này</option>
            </select>
          </div>
          <div className="h-[300px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={chartData} margin={{ top: 20, right: 30, left: 0, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis 
                  dataKey="name" 
                  axisLine={false} 
                  tickLine={false} 
                  tick={{ fontSize: 10, fontWeight: 600, fill: '#64748b' }} 
                  dy={10}
                />
                <YAxis hide />
                <Tooltip 
                  cursor={{ fill: '#f8fafc' }}
                  contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }}
                />
                <Bar dataKey="value" radius={[8, 8, 0, 0]} barSize={48}>
                  {chartData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={index === 2 ? '#006e22' : '#28b446'} fillOpacity={0.8} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="flex flex-col rounded-xl border border-slate-100 bg-white p-6 shadow-[0px_4px_12px_rgba(0,0,0,0.05)]">
          <div className="mb-6 flex items-center justify-between">
            <h3 className="text-lg font-bold text-slate-900">Yêu cầu mới nhất</h3>
            <button className="text-xs font-bold text-green-600 hover:underline">Tất cả</button>
          </div>
          <div className="flex-1 space-y-4">
            {requests.map((req, idx) => (
              <div 
                key={idx} 
                className={cn(
                  "group flex cursor-pointer items-center gap-3 rounded-xl p-3 transition-colors hover:bg-slate-50",
                  req.highlight && "border-l-4 border-amber-400 bg-amber-50/30"
                )}
              >
                <img src={req.avatar} alt={req.name} className="h-10 w-10 rounded-full" />
                <div className="flex-1 min-w-0">
                  <p className="truncate text-sm font-bold text-slate-900">{req.name}</p>
                  <p className="text-[11px] text-slate-500">{req.type} • {req.time}</p>
                </div>
                <ChevronRight className="h-4 w-4 text-slate-300 group-hover:text-green-500 transition-colors" />
              </div>
            ))}
          </div>
          <button className="mt-6 w-full rounded-xl border-2 border-green-600 py-3 font-bold text-green-600 transition-colors hover:bg-green-50">
            Xử lý nhanh hàng loạt
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-8 md:grid-cols-2">
        <div className="relative h-64 overflow-hidden rounded-xl border border-slate-200 bg-slate-100 shadow-sm">
          <img 
            src="https://images.unsplash.com/photo-1524661135-423995f22d0b?auto=format&fit=crop&q=80&w=800" 
            alt="Map"
            className="absolute inset-0 h-full w-full object-cover opacity-50 grayscale"
          />
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="flex flex-col items-center gap-2">
              <MapIcon className="h-12 w-12 text-slate-400" />
              <p className="rounded-lg bg-white px-3 py-1.5 text-xs font-bold text-slate-700 shadow-sm flex items-center gap-2">
                <Navigation className="h-4 w-4 fill-red-500 text-red-500" />
                Bản đồ trực quân số các trạm
              </p>
            </div>
          </div>
        </div>

        <div className="flex flex-col justify-center gap-6 p-4">
          <div className="flex gap-4 items-start">
            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl border border-slate-100 bg-white shadow-sm">
              <Verified className="h-6 w-6 text-green-600" />
            </div>
            <div>
              <h4 className="text-xs font-bold uppercase text-slate-900">Hệ thống đồng bộ 100%</h4>
              <p className="text-sm text-slate-500">Tất cả dữ liệu chấm công từ máy vân tay đã được đồng bộ với hệ thống HRM trung tâm Sagrifood.</p>
            </div>
          </div>
          <div className="flex gap-4 items-start">
            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl border border-slate-100 bg-white shadow-sm">
              <Zap className="h-6 w-6 text-green-600" />
            </div>
            <div>
              <h4 className="text-xs font-bold uppercase text-slate-900">Phản hồi nhanh chóng</h4>
              <p className="text-sm text-slate-500">Thời gian phê duyệt yêu cầu trung bình hiện tại là 45 phút, nhanh hơn 20% so với tuần trước.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
