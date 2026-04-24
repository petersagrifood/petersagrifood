import React from 'react';
import { 
  FileBadge, 
  Wallet, 
  MapPin, 
  ArrowRight,
  TrendingUp,
  Download,
  Send,
  Calendar,
  MoreHorizontal
} from 'lucide-react';
import { cn } from '@/src/lib/utils';

const reportCards = [
  { id: 'monthly', title: 'Báo cáo công tháng', desc: 'Dữ liệu chấm công và giờ làm việc chi tiết của toàn bộ nhân viên tháng 10.', icon: Calendar, color: 'text-green-600', bg: 'bg-green-50', active: true },
  { id: 'payroll', title: 'Báo cáo chi phí lương dự kiến', desc: 'Dự toán ngân sách lương, thưởng và bảo hiểm cho kỳ kế tiếp.', icon: Wallet, color: 'text-blue-600', bg: 'bg-blue-50' },
  { id: 'location', title: 'Báo cáo hiệu suất địa điểm', desc: 'Đánh giá năng suất giữa các cửa hàng và nhà máy khu vực.', icon: MapPin, color: 'text-purple-600', bg: 'bg-purple-50' },
];

const tableData = [
  { name: 'Nguyễn Văn An', id: 'SGR-0122', workDays: '26/26', overtime: 12.5, status: 'complete', avatar: 'https://images.unsplash.com/photo-1599566150163-29194dcaad36?auto=format&fit=crop&q=80&w=100' },
  { name: 'Trần Thị Bình', id: 'SGR-0145', workDays: '24/26', overtime: 4.0, status: 'pending', avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=80&w=100' },
  { name: 'Lê Hoàng Nam', id: 'SGR-0098', workDays: '26/26', overtime: 18.0, status: 'complete', avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=100' },
  { name: 'Phạm Minh Tuấn', id: 'SGR-0211', workDays: '22/26', overtime: 0.0, status: 'missing', avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&q=80&w=100' },
];

const distribution = [
  { label: 'Sản xuất', value: '65%', color: 'border-green-600' },
  { label: 'Kinh doanh', value: '25%', color: 'border-green-300' },
  { label: 'Khác', value: '10%', color: 'border-slate-500' },
];

interface ReportsProps {
  userProfile?: any;
}

export default function Reports({ userProfile }: ReportsProps) {
  return (
    <div className="max-w-7xl mx-auto space-y-8 p-8">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-slate-900">Trung tâm Báo cáo HRM</h1>
          <p className="mt-1 text-sm font-medium text-slate-500">Phân tích dữ liệu nhân sự và chi phí hệ thống Sagrifood</p>
        </div>
        <div className="flex gap-3">
          <button className="flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-xs font-bold text-slate-700 shadow-sm transition-all hover:bg-slate-50 active:scale-95">
            <Download className="h-4 w-4" />
            Xuất Excel
          </button>
          <button className="flex items-center gap-2 rounded-xl bg-green-600 px-6 py-2.5 text-xs font-bold text-white shadow-md transition-all hover:bg-green-700 active:scale-95">
            <Send className="h-4 w-4" />
            Gửi báo cáo cho Giám đốc
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
        {reportCards.map((report) => (
          <div 
            key={report.id} 
            className={cn(
              "cursor-pointer rounded-2xl border border-slate-100 bg-white p-6 shadow-sm transition-all hover:shadow-md",
              report.active && "ring-2 ring-green-600 ring-offset-2"
            )}
          >
            <div className="mb-4 flex items-start justify-between">
              <div className={cn("rounded-xl p-3 shadow-inner", report.bg, report.color)}>
                <report.icon className="h-6 w-6" />
              </div>
              {report.active && (
                <span className="rounded-full bg-green-100 px-2 py-0.5 text-[10px] font-bold text-green-700 uppercase tracking-wider">Đang xem</span>
              )}
            </div>
            <h3 className="text-lg font-bold text-slate-900">{report.title}</h3>
            <p className="mt-1 text-xs text-slate-500 leading-relaxed">{report.desc}</p>
            <div className={cn(
              "mt-4 flex items-center gap-1 text-[10px] font-black uppercase tracking-widest",
              report.active ? "text-green-600" : "text-slate-400"
            )}>
              Xem chi tiết <ArrowRight className="h-3 w-3" />
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-12 gap-8">
        <div className="col-span-12 lg:col-span-8 space-y-6">
          <div className="rounded-2xl border border-slate-100 bg-white p-6 shadow-sm">
            <div className="mb-6 flex items-center justify-between">
              <h2 className="text-xl font-bold text-slate-900">Dữ liệu chi tiết</h2>
              <div className="flex divide-x divide-slate-100 rounded-lg border border-slate-100">
                <button className="px-4 py-1.5 text-xs font-bold text-slate-600 bg-slate-50">Tháng 10, 2023</button>
                <button className="px-2 py-1.5 transition-colors hover:bg-slate-50">
                  <MoreHorizontal className="h-4 w-4 text-slate-400" />
                </button>
              </div>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead>
                  <tr className="bg-slate-50/80 text-[10px] font-bold uppercase tracking-widest text-slate-400">
                    <th className="px-4 py-3 rounded-l-lg">Họ và tên</th>
                    <th className="px-4 py-3">Mã NV</th>
                    <th className="px-4 py-3">Số ngày công</th>
                    <th className="px-4 py-3">Tăng ca (H)</th>
                    <th className="px-4 py-3 rounded-r-lg">Trạng thái</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-50">
                  {tableData.map((row, idx) => (
                    <tr key={idx} className="group transition-colors hover:bg-slate-50/50">
                      <td className="px-4 py-4">
                        <div className="flex items-center gap-3">
                          <img src={row.avatar} alt={row.name} className="h-8 w-8 rounded-full object-cover transition-transform group-hover:scale-110" />
                          <span className="text-sm font-semibold text-slate-700 group-hover:text-green-600 transition-colors">{row.name}</span>
                        </div>
                      </td>
                      <td className="px-4 py-4 text-xs font-bold text-slate-400">{row.id}</td>
                      <td className="px-4 py-4 text-sm font-bold text-slate-600">{row.workDays}</td>
                      <td className="px-4 py-4 text-sm font-bold text-slate-600">{row.overtime.toFixed(1)}</td>
                      <td className="px-4 py-4 text-right sm:text-left">
                        <span className={cn(
                          "rounded-full px-2 py-0.5 text-[9px] font-black uppercase tracking-wider",
                          row.status === 'complete' ? "bg-green-100 text-green-700" : 
                          row.status === 'pending' ? "bg-amber-100 text-amber-700" : 
                          "bg-red-100 text-red-700"
                        )}>
                          {row.status === 'complete' ? 'Hoàn tất' : 
                           row.status === 'pending' ? 'Đang duyệt' : 'Thiếu giờ'}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            {[
              { label: 'Tổng nhân sự', value: '1,284', highlight: '+2.4% so với tháng trước', icon: TrendingUp, color: 'text-green-600' },
              { label: 'Tỷ lệ đi làm', value: '96.8%', highlight: 'Ổn định so với kỳ trước', color: 'text-slate-500' },
              { label: 'Số giờ tăng ca TB', value: '14.2h', highlight: 'Tăng nhẹ do mùa cao điểm', icon: TrendingUp, color: 'text-red-500' },
              { label: 'Báo cáo hoàn thành', value: '88%', progress: 88 }
            ].map((stat, idx) => (
              <div key={idx} className="rounded-2xl border border-slate-100 bg-slate-50/50 p-4 shadow-sm hover:shadow-inner transition-all group">
                <p className="text-[9px] font-bold uppercase tracking-widest text-slate-400">{stat.label}</p>
                <p className="mt-1 text-2xl font-black text-slate-800">{stat.value}</p>
                {stat.highlight && (
                  <p className={cn("mt-1 flex items-center gap-1 text-[9px] font-bold", stat.color)}>
                    {stat.icon && <stat.icon className="h-3 w-3" />}
                    {stat.highlight}
                  </p>
                )}
                {stat.progress && (
                  <div className="mt-2 h-1.5 w-full rounded-full bg-slate-200 overflow-hidden">
                    <div className="h-full bg-green-600 transition-all duration-1000 group-hover:bg-green-500" style={{ width: `${stat.progress}%` }} />
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        <div className="col-span-12 lg:col-span-4 rounded-2xl border border-slate-100 bg-white p-6 shadow-sm">
          <h2 className="text-xl font-bold text-slate-900 mb-8">Phân bổ theo bộ phận</h2>
          <div className="flex flex-col items-center">
            <div className="relative mb-10 h-56 w-56">
              <svg className="h-full w-full -rotate-90 transform" viewBox="0 0 100 100">
                <circle cx="50" cy="50" r="42" fill="transparent" stroke="#f1f5f9" strokeWidth="12" />
                <circle cx="50" cy="50" r="42" fill="transparent" stroke="#28b446" strokeWidth="12" strokeDasharray="171 263.8" strokeLinecap="round" />
                <circle cx="50" cy="50" r="42" fill="transparent" stroke="#86efac" strokeWidth="12" strokeDasharray="66 263.8" strokeDashoffset="-171" strokeLinecap="round" />
                <circle cx="50" cy="50" r="42" fill="transparent" stroke="#64748b" strokeWidth="12" strokeDasharray="26.4 263.8" strokeDashoffset="-237" strokeLinecap="round" />
              </svg>
              <div className="absolute inset-0 flex flex-col items-center justify-center">
                <p className="text-4xl font-black text-slate-900">1,284</p>
                <p className="text-[10px] font-bold uppercase tracking-widest text-slate-400">Nhân viên</p>
              </div>
            </div>
            
            <div className="w-full space-y-4">
              {distribution.map((item) => (
                <div key={item.label} className="flex items-center justify-between group cursor-default">
                  <div className="flex items-center gap-3">
                    <div className={cn("h-3 w-3 rounded-full border-2", item.color)} />
                    <span className="text-sm font-semibold text-slate-600 transition-colors group-hover:text-slate-900">{item.label}</span>
                  </div>
                  <span className="text-sm font-black text-slate-900">{item.value}</span>
                </div>
              ))}
            </div>
            
            <button className="mt-8 w-full rounded-xl border-2 border-slate-100 py-3 text-xs font-bold text-slate-500 transition-all hover:border-green-600 hover:text-green-600 active:scale-95">
              Cập nhật dữ liệu từ HRM-Core
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
