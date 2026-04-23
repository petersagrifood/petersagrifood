import React from 'react';
import { 
  BadgeCheck, 
  Briefcase, 
  Palmtree as BeachAccess, 
  UserMinus, 
  ChevronRight,
  MoreHorizontal,
  Download,
  Plus,
  Search,
  ChevronLeft,
  UserCircle,
  Edit2,
  Trash2,
  Filter
} from 'lucide-react';
import { cn } from '@/src/lib/utils';

const stats = [
  { label: 'Tổng nhân sự', value: '1,248', icon: BadgeCheck, color: 'text-green-600', bg: 'bg-green-50' },
  { label: 'Đang làm việc', value: '1,180', icon: Briefcase, color: 'text-blue-600', bg: 'bg-blue-50' },
  { label: 'Nghỉ phép', value: '42', icon: BeachAccess, color: 'text-orange-600', bg: 'bg-orange-50' },
  { label: 'Vắng mặt', value: '26', icon: UserMinus, color: 'text-red-600', bg: 'bg-red-50' },
];

const employees = [
  { id: 'SG-2401', name: 'Lê Văn Hùng', role: 'Quản lý Sản xuất', location: 'Nhà máy Bình Dương', status: 'working', avatar: 'https://images.unsplash.com/photo-1599566150163-29194dcaad36?auto=format&fit=crop&q=80&w=100' },
  { id: 'SG-2405', name: 'Trần Thị Mai', role: 'Kế toán trưởng', location: 'Trụ sở chính (Quận 1)', status: 'leave', avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=80&w=100' },
  { id: 'SG-2389', name: 'Phạm Hoàng Nam', role: 'Kỹ thuật viên', location: 'Cửa hàng số 15', status: 'working', avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=100' },
  { id: 'SG-2410', name: 'Đỗ Mỹ Linh', role: 'Nhân viên Marketing', location: 'Trụ sở chính (Quận 1)', status: 'working', avatar: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&q=80&w=100' },
  { id: 'SG-2395', name: 'Bùi Anh Tuấn', role: 'Lái xe giao hàng', location: 'Trung tâm Logistics', status: 'working', avatar: 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?auto=format&fit=crop&q=80&w=100' },
];

export default function EmployeeList() {
  return (
    <div className="space-y-6 p-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold tracking-tight text-slate-900">Danh sách nhân viên</h2>
          <p className="text-sm text-slate-500">Quản lý và theo dõi thông tin nhân sự toàn hệ thống</p>
        </div>
        <div className="flex gap-3">
          <button className="flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-2 text-xs font-bold text-slate-700 transition-colors hover:bg-slate-50">
            <Download className="h-4 w-4" />
            Xuất báo cáo
          </button>
          <button className="flex items-center gap-2 rounded-xl bg-green-600 px-4 py-2 text-xs font-bold text-white shadow-sm transition-all hover:bg-green-700 active:scale-[0.98]">
            <Plus className="h-4 w-4" />
            Thêm nhân sự mới
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-4 md:grid-cols-4">
        {stats.map((stat) => (
          <div key={stat.label} className="flex items-center gap-4 rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
            <div className={cn("flex h-12 w-12 items-center justify-center rounded-full", stat.bg)}>
              <stat.icon className={cn("h-6 w-6", stat.color)} />
            </div>
            <div>
              <p className="text-[10px] font-bold uppercase tracking-tight text-slate-500">{stat.label}</p>
              <p className="text-2xl font-black text-slate-900">{stat.value}</p>
            </div>
          </div>
        ))}
      </div>

      <div className="rounded-2xl border border-slate-200 bg-white shadow-sm overflow-hidden">
        <div className="flex flex-wrap items-center justify-between gap-4 border-b border-slate-100 p-4">
          <div className="flex items-center gap-3">
            <div className="relative">
              <select className="appearance-none rounded-xl border border-slate-200 bg-slate-50 py-2 pl-4 pr-10 text-sm focus:border-green-500 focus:ring-green-500 transition-all">
                <option>Tất cả phòng ban</option>
                <option>Sản xuất</option>
                <option>Kinh doanh</option>
                <option>Hành chính</option>
              </select>
              <Filter className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
            </div>
            <div className="relative">
              <select className="appearance-none rounded-xl border border-slate-200 bg-slate-50 py-2 pl-4 pr-10 text-sm focus:border-green-500 focus:ring-green-500 transition-all">
                <option>Trạng thái</option>
                <option>Đang làm</option>
                <option>Nghỉ phép</option>
              </select>
              <Filter className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
            </div>
          </div>
          <div className="text-sm text-slate-500">
            Hiển thị <b>1-10</b> trên <b>1,248</b> kết quả
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50/50">
                <th className="px-6 py-4 text-[10px] font-bold uppercase tracking-wider text-slate-500">Mã NV</th>
                <th className="px-6 py-4 text-[10px] font-bold uppercase tracking-wider text-slate-500">Họ tên</th>
                <th className="px-6 py-4 text-[10px] font-bold uppercase tracking-wider text-slate-500">Vị trí</th>
                <th className="px-6 py-4 text-[10px] font-bold uppercase tracking-wider text-slate-500">Địa điểm làm việc</th>
                <th className="px-6 py-4 text-[10px] font-bold uppercase tracking-wider text-slate-500">Trạng thái</th>
                <th className="px-6 py-4 text-[10px] font-bold uppercase tracking-wider text-slate-500 text-right">Thao tác</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {employees.map((emp) => (
                <tr key={emp.id} className="group transition-colors hover:bg-slate-50">
                  <td className="px-6 py-4 text-xs font-bold text-green-600">{emp.id}</td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <img src={emp.avatar} alt={emp.name} className="h-8 w-8 rounded-full object-cover" />
                      <span className="text-sm font-semibold text-slate-900">{emp.name}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-sm text-slate-600">{emp.role}</td>
                  <td className="px-6 py-4 text-sm text-slate-600">{emp.location}</td>
                  <td className="px-6 py-4">
                    <span className={cn(
                      "inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-bold",
                      emp.status === 'working' ? "bg-green-100 text-green-700" : "bg-orange-100 text-orange-700"
                    )}>
                      {emp.status === 'working' ? 'Đang làm' : 'Nghỉ phép'}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <div className="flex justify-end gap-1 opacity-60 transition-opacity group-hover:opacity-100">
                      <button className="rounded-lg p-2 transition-colors hover:bg-blue-50 hover:text-blue-600" title="Xem hồ sơ">
                        <UserCircle className="h-5 w-5" />
                      </button>
                      <button className="rounded-lg p-2 transition-colors hover:bg-green-50 hover:text-green-600" title="Sửa">
                        <Edit2 className="h-5 w-5" />
                      </button>
                      <button className="rounded-lg p-2 transition-colors hover:bg-red-50 hover:text-red-600" title="Xóa">
                        <Trash2 className="h-5 w-5" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="flex items-center justify-between bg-slate-50/50 border-t border-slate-100 px-6 py-4">
          <button className="flex items-center gap-1 text-sm font-semibold text-slate-500 transition-colors hover:text-green-600 disabled:opacity-30" disabled>
            <ChevronLeft className="h-4 w-4" />
            Trước
          </button>
          <div className="flex items-center gap-1">
            <button className="h-8 w-8 rounded-lg bg-green-600 text-xs font-bold text-white">1</button>
            <button className="h-8 w-8 rounded-lg hover:bg-slate-100 text-xs font-semibold text-slate-600">2</button>
            <button className="h-8 w-8 rounded-lg hover:bg-slate-100 text-xs font-semibold text-slate-600">3</button>
            <span className="px-2 text-slate-400">...</span>
            <button className="h-8 w-8 rounded-lg hover:bg-slate-100 text-xs font-semibold text-slate-600">125</button>
          </div>
          <button className="flex items-center gap-1 text-sm font-semibold text-slate-500 transition-colors hover:text-green-600">
            Tiếp
            <ChevronRight className="h-4 w-4" />
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
        <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
          <div className="mb-4 flex items-center justify-between">
            <h3 className="text-base font-bold text-slate-900">Phân bổ nhân lực</h3>
            <MoreHorizontal className="h-5 w-5 text-slate-400" />
          </div>
          <div className="space-y-4">
            {[
              { label: 'Khối sản xuất', value: '65%', color: 'bg-green-600' },
              { label: 'Khối văn phòng', value: '20%', color: 'bg-blue-500' },
              { label: 'Khối logistics', value: '15%', color: 'bg-orange-500' },
            ].map((item) => (
              <div key={item.label}>
                <div className="mb-1 flex justify-between text-[10px] font-bold">
                  <span className="text-slate-500">{item.label}</span>
                  <span className="text-slate-900">{item.value}</span>
                </div>
                <div className="h-2 w-full overflow-hidden rounded-full bg-slate-100">
                  <div className={cn("h-full rounded-full transition-all", item.color)} style={{ width: item.value }} />
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="relative overflow-hidden rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
          <div className="relative z-10">
            <h3 className="mb-4 text-base font-bold text-slate-900">Thông báo mới nhất</h3>
            <div className="space-y-3">
              {[
                { title: 'Cập nhật chính sách nghỉ phép 2024', meta: 'Người gửi: Ban Giám Đốc • 2 giờ trước', color: 'bg-green-600 shadow-green-100' },
                { title: 'Lịch khám sức khỏe định kỳ đợt 1', meta: 'Người gửi: Phòng HC-NS • Hôm qua', color: 'bg-blue-500 shadow-blue-100' },
              ].map((note, idx) => (
                <div key={idx} className="flex gap-3 rounded-xl p-2 transition-colors hover:bg-slate-50">
                  <div className={cn("mt-2 h-2 w-2 shrink-0 rounded-full shadow-lg", note.color)} />
                  <div>
                    <p className="text-sm font-semibold text-slate-900">{note.title}</p>
                    <p className="text-[10px] text-slate-500">{note.meta}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
          <UserMinus className="absolute -bottom-8 -right-8 h-32 w-32 rotate-12 text-slate-50 opacity-5 shadow-inner" />
        </div>
      </div>
    </div>
  );
}
