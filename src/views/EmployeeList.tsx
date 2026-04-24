import React, { useState, useEffect } from 'react';
import { 
  ChevronRight,
  Download,
  Plus,
  ChevronLeft,
  Edit2,
  Trash2,
  Filter,
  Loader2,
  FileText
} from 'lucide-react';
import { cn } from '@/src/lib/utils';
import { getEmployees } from '@/src/services/dbService';
import EmployeeDetailModal from '@/src/components/EmployeeDetailModal';

interface EmployeeListProps {
  userProfile?: any;
}

export default function EmployeeList({ userProfile }: EmployeeListProps) {
  const [employees, setEmployees] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedEmployee, setSelectedEmployee] = useState<any>(null);
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
  
  const canManage = ['admin', 'phong_tchc', 'giam_doc'].includes(userProfile?.role);
  
  // Mock data for the table as requested in the image
  const mockEmployees = [
    { 
      id: '1', 
      employeeId: 'SG-4029', 
      name: 'Trần Anh Tuấn', 
      insuranceId: '0123984722', 
      location: 'Vincom Shop', 
      position: 'Cửa hàng trưởng',
      salary: '12,500,000₫',
      allowances: {
        responsibility: '2,000,000',
        toxic: '500,000',
        seniority: '1,200,000'
      },
      status: 'active'
    },
    { 
      id: '2', 
      employeeId: 'SG-3912', 
      name: 'Nguyễn Hương Ly', 
      insuranceId: '0382910332', 
      location: 'Nhà máy BD', 
      position: 'Kỹ thuật viên',
      salary: '9,800,000₫',
      allowances: {
        responsibility: '0',
        toxic: '1,500,000',
        seniority: '800,000'
      },
      status: 'leave'
    },
    { 
      id: '3', 
      employeeId: 'SG-5103', 
      name: 'Lê Minh Quân', 
      insuranceId: '0772819384', 
      location: 'Shop B', 
      position: 'Nhân viên bán hàng',
      salary: '7,200,000₫',
      allowances: {
        responsibility: '0',
        toxic: '0',
        seniority: '300,000'
      },
      status: 'active'
    }
  ];

  const fetchData = async () => {
    try {
      setLoading(true);
      const data = await getEmployees();
      // Combine with mock data if needed or just use real data
      setEmployees(data.length > 0 ? data : mockEmployees);
    } catch (err: any) {
      console.error(err);
      setEmployees(mockEmployees);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  return (
    <div className="min-h-screen bg-slate-50/50 p-8 pt-6">
      {/* Breadcrumbs */}
      <div className="mb-4 flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-slate-400 italic">
        <span>NHÂN SỰ</span>
        <ChevronRight className="h-3 w-3" />
        <span className="text-green-600">QUẢN LÝ HỒ SƠ TỔNG THỂ</span>
      </div>

      <div className="mb-8 flex items-end justify-between">
        <div>
          <h1 className="text-2xl font-black italic tracking-tight text-slate-900 uppercase">Quản lý Hồ sơ Nhân sự Tổng thể</h1>
        </div>
        <div className="flex gap-4">
          <button className="flex items-center gap-2 rounded-2xl border border-slate-200 bg-white px-5 py-2.5 text-xs font-black italic text-slate-700 shadow-sm transition-all hover:bg-slate-50">
            <Download className="h-4 w-4" />
            Xuất file báo cáo tổng hợp
          </button>
          {canManage && (
            <button className="flex items-center gap-2 rounded-2xl bg-green-900 px-5 py-2.5 text-xs font-black italic text-white shadow-xl shadow-green-100 transition-all hover:bg-green-950">
              <Plus className="h-4 w-4" />
              Nhập dữ liệu
            </button>
          )}
        </div>
      </div>

      {/* Filters Row */}
      <div className="mb-8 flex flex-wrap items-center gap-4">
        <div className="flex-1 min-w-[200px] rounded-3xl border border-slate-100 bg-white p-4 shadow-sm ring-1 ring-black/5">
          <p className="mb-2 text-[9px] font-black uppercase italic tracking-widest text-slate-400">ĐỊA ĐIỂM LÀM VIỆC</p>
          <div className="relative">
            <select className="w-full appearance-none bg-transparent text-sm font-black italic text-slate-900 outline-none">
              <option>Tất cả địa điểm</option>
              <option>Vincom Shop</option>
              <option>Nhà máy BD</option>
              <option>Shop B</option>
            </select>
            <Filter className="pointer-events-none absolute right-0 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-slate-400" />
          </div>
        </div>

        <div className="flex-1 min-w-[200px] rounded-3xl border border-slate-100 bg-white p-4 shadow-sm ring-1 ring-black/5">
          <p className="mb-2 text-[9px] font-black uppercase italic tracking-widest text-slate-400">LOẠI HỢP ĐỒNG</p>
          <div className="relative">
            <select className="w-full appearance-none bg-transparent text-sm font-black italic text-slate-900 outline-none">
              <option>Tất cả loại</option>
              <option>Chính thức</option>
              <option>Thử việc</option>
              <option>Thời vụ</option>
            </select>
            <Filter className="pointer-events-none absolute right-0 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-slate-400" />
          </div>
        </div>

        <div className="flex-1 min-w-[200px] rounded-3xl border border-slate-100 bg-white p-4 shadow-sm ring-1 ring-black/5">
          <p className="mb-2 text-[9px] font-black uppercase italic tracking-widest text-slate-400">TRẠNG THÁI NHÂN SỰ</p>
          <div className="relative">
            <select className="w-full appearance-none bg-transparent text-sm font-black italic text-slate-900 outline-none">
              <option>Tất cả trạng thái</option>
              <option>Đang làm việc</option>
              <option>Nghỉ phép</option>
              <option>Đã nghỉ việc</option>
            </select>
            <Filter className="pointer-events-none absolute right-0 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-slate-400" />
          </div>
        </div>

        <div className="rounded-3xl bg-green-50 p-4 shadow-inner min-w-[150px] ring-1 ring-green-100">
          <p className="mb-1 text-[9px] font-black uppercase italic tracking-widest text-green-700">Tổng nhân sự</p>
          <span className="text-2xl font-black tracking-tighter text-green-800">1,284</span>
        </div>
      </div>

      {/* Main Table */}
      <div className="rounded-[2.5rem] border border-slate-100 bg-white shadow-xl shadow-slate-200/50 ring-1 ring-black/5 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full border-collapse text-left">
            <thead>
              <tr className="border-b border-slate-50">
                <th className="px-8 py-6 text-[10px] font-black uppercase italic tracking-widest text-slate-400">MÃ NV</th>
                <th className="px-8 py-6 text-[10px] font-black uppercase italic tracking-widest text-slate-400">HỌ VÀ TÊN</th>
                <th className="px-8 py-6 text-[10px] font-black uppercase italic tracking-widest text-slate-400">SỐ BHXH</th>
                <th className="px-8 py-6 text-[10px] font-black uppercase italic tracking-widest text-slate-400">ĐỊA ĐIỂM / CHỨC VỤ</th>
                <th className="px-8 py-6 text-[10px] font-black uppercase italic tracking-widest text-slate-400">LƯƠNG ĐÓNG BH</th>
                <th className="px-8 py-6 text-[10px] font-black uppercase italic tracking-widest text-slate-400">PHỤ CẤP CHI TIẾT</th>
                <th className="px-8 py-6 text-[10px] font-black uppercase italic tracking-widest text-slate-400">TRẠNG THÁI</th>
                <th className="px-8 py-6 text-[10px] font-black uppercase italic tracking-widest text-slate-400 text-right">THAO TÁC</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {loading ? (
                <tr>
                  <td colSpan={8} className="py-20 text-center">
                    <Loader2 className="mx-auto h-8 w-8 animate-spin text-green-600" />
                  </td>
                </tr>
              ) : (
                employees.map((emp) => (
                  <tr 
                    key={emp.id} 
                    onClick={() => {
                      setSelectedEmployee(emp);
                      setIsDetailModalOpen(true);
                    }}
                    className="group transition-all hover:bg-green-50/30 cursor-pointer"
                  >
                    <td className="px-8 py-6 text-xs font-black text-green-600 italic">
                      {emp.employeeId || `SG-${Math.floor(Math.random() * 9000 + 1000)}`}
                    </td>
                    <td className="px-8 py-6">
                      <div className="flex items-center gap-3">
                        <div className="h-10 w-10 overflow-hidden rounded-2xl bg-slate-100 flex items-center justify-center font-black text-slate-300 text-xs italic shadow-inner">
                          {emp.photoURL && typeof emp.photoURL === 'string' && emp.photoURL.length > 5 ? (
                            <img 
                              src={emp.photoURL} 
                              className="h-full w-full object-cover" 
                              alt={emp.displayName || emp.name || ''} 
                              referrerPolicy="no-referrer"
                            />
                          ) : (
                            <span>{emp.displayName?.charAt(0) || emp.name?.charAt(0) || 'U'}</span>
                          )}
                        </div>
                        <div>
                          <p className="text-sm font-black italic text-slate-900">{emp.displayName || emp.name}</p>
                          <p className="text-[10px] font-bold text-slate-400 italic">Nhân viên chính thức</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-8 py-6 text-xs font-bold text-slate-600 italic">
                      {emp.insuranceId || '0382910332'}
                    </td>
                    <td className="px-8 py-6">
                      <p className="text-xs font-black italic text-slate-900">{emp.location || emp.department || 'Nhà máy BD'}</p>
                      <p className="text-[10px] font-bold text-slate-400 italic lowercase">{emp.position || emp.role || 'Kỹ thuật viên'}</p>
                    </td>
                    <td className="px-8 py-6 text-sm font-black italic text-slate-900">
                      {emp.salary || '9,800,000₫'}
                    </td>
                    <td className="px-8 py-6">
                      <div className="space-y-1 min-w-[140px]">
                        <div className="flex items-center justify-between gap-4 text-[9px] italic">
                          <span className="font-bold text-slate-400 uppercase">Trách nhiệm:</span>
                          <span className="font-black text-green-600">{emp.allowances?.responsibility || '0'}</span>
                        </div>
                        <div className="flex items-center justify-between gap-4 text-[9px] italic">
                          <span className="font-bold text-slate-400 uppercase">Độc hại:</span>
                          <span className="font-black text-green-600">{emp.allowances?.toxic || '1,500,000'}</span>
                        </div>
                        <div className="flex items-center justify-between gap-4 text-[9px] italic">
                          <span className="font-bold text-slate-400 uppercase">Thâm niên:</span>
                          <span className="font-black text-green-600">{emp.allowances?.seniority || '800,000'}</span>
                        </div>
                      </div>
                    </td>
                    <td className="px-8 py-6">
                      <span className={cn(
                        "inline-flex items-center rounded-full px-3 py-1 text-[8px] font-black uppercase italic tracking-widest",
                        emp.status === 'active' || emp.status === 'Active' ? "bg-green-50 text-green-600" : 
                        emp.status === 'leave' || emp.status === 'Leave' ? "bg-slate-50 text-slate-400" : "bg-red-50 text-red-500"
                      )}>
                        {emp.status === 'active' || emp.status === 'Active' ? 'Đang làm việc' : 
                         emp.status === 'leave' || emp.status === 'Leave' ? 'Nghỉ phép' : 'Nghỉ việc'}
                      </span>
                    </td>
                    <td className="px-8 py-6">
                      {canManage && (
                        <div className="flex items-center justify-end gap-2 opacity-20 transition-all group-hover:opacity-100">
                          <button className="h-8 w-8 rounded-xl bg-white text-slate-400 shadow-sm transition-all hover:bg-slate-50 hover:text-green-600 ring-1 ring-slate-100">
                            <Edit2 className="m-auto h-4 w-4" />
                          </button>
                          <button className="h-8 w-8 rounded-xl bg-white text-slate-400 shadow-sm transition-all hover:bg-red-50 hover:text-red-600 ring-1 ring-slate-100">
                            <Trash2 className="m-auto h-4 w-4" />
                          </button>
                        </div>
                      )}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Footer / Pagination */}
        <div className="flex items-center justify-between border-t border-slate-50 bg-slate-50/30 px-8 py-6">
          <p className="text-[10px] font-bold italic text-slate-400">
            Hiển thị <span className="font-black text-slate-900">1-10</span> trong số <span className="font-black text-slate-900">1,284</span> nhân sự
          </p>
          <div className="flex items-center gap-1">
            <button className="h-8 w-8 rounded-xl bg-white text-slate-400 transition-all hover:bg-slate-50">
              <ChevronLeft className="m-auto h-4 w-4" />
            </button>
            <button className="h-8 w-8 rounded-xl bg-green-900 text-[10px] font-black italic text-white shadow-lg shadow-green-100">1</button>
            <button className="h-8 w-8 rounded-xl bg-white text-[10px] font-black italic text-slate-400 hover:bg-slate-50">2</button>
            <button className="h-8 w-8 rounded-xl bg-white text-[10px] font-black italic text-slate-400 hover:bg-slate-50">3</button>
            <span className="px-2 text-slate-300">...</span>
            <button className="h-8 w-8 rounded-xl bg-white text-[10px] font-black italic text-slate-400 hover:bg-slate-50">129</button>
            <button className="h-8 w-8 rounded-xl bg-white text-slate-400 transition-all hover:bg-slate-50">
              <ChevronRight className="m-auto h-4 w-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Floating Action Button */}
      {canManage && (
        <button className="fixed bottom-10 right-10 flex h-16 w-16 items-center justify-center rounded-full bg-green-900 text-white shadow-2xl transition-all hover:scale-110 active:scale-95 group overflow-hidden">
          <Plus className="h-7 w-7 transition-transform group-hover:rotate-90" />
          <div className="absolute inset-0 bg-white/10 opacity-0 group-hover:opacity-100 transition-opacity"></div>
        </button>
      )}

      <EmployeeDetailModal 
        isOpen={isDetailModalOpen}
        onClose={() => setIsDetailModalOpen(false)}
        employee={selectedEmployee}
      />
    </div>
  );
}
