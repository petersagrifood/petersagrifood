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
  FileText,
  Search,
  Mail,
  MapPin,
  Phone,
  Briefcase,
  User,
  Calendar,
  Shield,
  CreditCard
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
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
  const [searchTerm, setSearchTerm] = useState('');
  const [locationFilter, setLocationFilter] = useState('all');
  const [contractFilter, setContractFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');
  const [expandedEmployeeId, setExpandedEmployeeId] = useState<string | null>(null);
  
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
      contractType: 'official',
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
      contractType: 'official',
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
      contractType: 'seasonal',
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

  const filteredEmployees = employees.filter(emp => {
    const searchString = searchTerm.toLowerCase();
    const nameMatch = (emp.displayName || emp.name || '').toLowerCase().includes(searchString);
    const idMatch = (emp.employeeId || '').toLowerCase().includes(searchString);
    const locationMatch = (emp.location || emp.department || '').toLowerCase().includes(searchString);
    const positionMatch = (emp.position || emp.role || '').toLowerCase().includes(searchString);
    const statusText = (emp.status === 'active' || emp.status === 'Active' ? 'Đang làm việc' : 
                      emp.status === 'leave' || emp.status === 'Leave' ? 'Nghỉ phép' : 'Nghỉ việc').toLowerCase();
    const statusMatch = statusText.includes(searchString);

    const matchesSearch = nameMatch || idMatch || locationMatch || positionMatch || statusMatch;
    
    // Additional filters
    const matchesLocation = locationFilter === 'all' || (emp.location || emp.department) === locationFilter;
    
    const matchesContract = contractFilter === 'all' || emp.contractType === contractFilter;

    const matchesStatus = statusFilter === 'all' || 
                         (statusFilter === 'active' && (emp.status === 'active' || emp.status === 'Active')) ||
                         (statusFilter === 'leave' && (emp.status === 'leave' || emp.status === 'Leave')) ||
                         (statusFilter === 'inactive' && (emp.status === 'inactive' || emp.status === 'Inactive'));

    return matchesSearch && matchesLocation && matchesContract && matchesStatus;
  });

  const handleUpdateStatus = (id: string, newStatus: string) => {
    setEmployees(prev => prev.map(emp => emp.id === id ? { ...emp, status: newStatus } : emp));
  };

  const handleExportCSV = () => {
    const headers = [
      'Mã NV',
      'Họ và Tên',
      'Số BHXH',
      'Địa điểm',
      'Chức vụ',
      'Lương đóng BH',
      'Trách nhiệm',
      'Độc hại',
      'Thâm niên',
      'Trạng thái'
    ];

    const rows = filteredEmployees.map(emp => [
      emp.employeeId || '',
      emp.displayName || emp.name || '',
      emp.insuranceId || '',
      emp.location || emp.department || '',
      emp.position || emp.role || '',
      emp.salary || '',
      emp.allowances?.responsibility || '0',
      emp.allowances?.toxic || '0',
      emp.allowances?.seniority || '0',
      emp.status === 'active' ? 'Đang làm việc' : emp.status === 'leave' ? 'Nghỉ phép' : 'Nghỉ việc'
    ]);

    const csvContent = [
      headers.join(','),
      ...rows.map(row => row.map(val => `"${String(val).replace(/"/g, '""')}"`).join(','))
    ].join('\n');

    const blob = new Blob(['\ufeff' + csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `danh_sach_nhan_su_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

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
          <button 
            onClick={handleExportCSV}
            className="flex items-center gap-2 rounded-2xl border border-slate-200 bg-white px-5 py-2.5 text-xs font-black italic text-slate-700 shadow-sm transition-all hover:bg-slate-50"
          >
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
        <div className="flex-[2] min-w-[300px] rounded-3xl border border-slate-100 bg-white p-4 shadow-sm ring-1 ring-black/5">
          <p className="mb-2 text-[9px] font-black uppercase italic tracking-widest text-slate-400">TÌM KIẾM NHÂN VIÊN</p>
          <div className="relative">
            <input 
              type="text"
              placeholder="Nhập tên hoặc mã nhân viên..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full bg-transparent text-sm font-black italic text-slate-900 outline-none placeholder:text-slate-300"
            />
            <Search className="pointer-events-none absolute right-0 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
          </div>
        </div>

        <div className="flex-1 min-w-[200px] rounded-3xl border border-slate-100 bg-white p-4 shadow-sm ring-1 ring-black/5">
          <p className="mb-2 text-[9px] font-black uppercase italic tracking-widest text-slate-400">ĐỊA ĐIỂM LÀM VIỆC</p>
          <div className="relative">
            <select 
              value={locationFilter}
              onChange={(e) => setLocationFilter(e.target.value)}
              className="w-full appearance-none bg-transparent text-sm font-black italic text-slate-900 outline-none cursor-pointer"
            >
              <option value="all">Tất cả địa điểm</option>
              <option value="Vincom Shop">Vincom Shop</option>
              <option value="Nhà máy BD">Nhà máy BD</option>
              <option value="Shop B">Shop B</option>
            </select>
            <Filter className="pointer-events-none absolute right-0 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-slate-400" />
          </div>
        </div>

        <div className="flex-1 min-w-[200px] rounded-3xl border border-slate-100 bg-white p-4 shadow-sm ring-1 ring-black/5">
          <p className="mb-2 text-[9px] font-black uppercase italic tracking-widest text-slate-400">LOẠI HỢP ĐỒNG</p>
          <div className="relative">
            <select 
              value={contractFilter}
              onChange={(e) => setContractFilter(e.target.value)}
              className="w-full appearance-none bg-transparent text-sm font-black italic text-slate-900 outline-none cursor-pointer"
            >
              <option value="all">Tất cả loại</option>
              <option value="official">Chính thức</option>
              <option value="probation">Thử việc</option>
              <option value="seasonal">Thời vụ</option>
            </select>
            <Filter className="pointer-events-none absolute right-0 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-slate-400" />
          </div>
        </div>

        <div className="flex-1 min-w-[200px] rounded-3xl border border-slate-100 bg-white p-4 shadow-sm ring-1 ring-black/5">
          <p className="mb-2 text-[9px] font-black uppercase italic tracking-widest text-slate-400">TRẠNG THÁI NHÂN SỰ</p>
          <div className="relative">
            <select 
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="w-full appearance-none bg-transparent text-sm font-black italic text-slate-900 outline-none cursor-pointer"
            >
              <option value="all">Tất cả trạng thái</option>
              <option value="active">Đang làm việc</option>
              <option value="leave">Nghỉ phép</option>
              <option value="inactive">Đã nghỉ việc</option>
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
              ) : filteredEmployees.length > 0 ? (
                filteredEmployees.map((emp) => (
                  <React.Fragment key={emp.id}>
                    <tr 
                      onClick={() => {
                        setExpandedEmployeeId(expandedEmployeeId === emp.id ? null : emp.id);
                      }}
                      className={cn(
                        "group transition-all cursor-pointer",
                        expandedEmployeeId === emp.id ? "bg-green-50/50" : "hover:bg-green-50/30"
                      )}
                    >
                      <td className="px-8 py-6 text-xs font-black text-green-600 italic">
                        {emp.employeeId || `SG-${Math.floor(Math.random() * 9000 + 1000)}`}
                      </td>
                      <td className="px-8 py-6">
                        <div className="flex items-center gap-3">
                          <div className={cn(
                            "h-10 w-10 overflow-hidden rounded-2xl flex items-center justify-center font-black text-xs italic shadow-inner transition-all",
                            expandedEmployeeId === emp.id ? "ring-2 ring-green-600 ring-offset-2" : "bg-slate-100 text-slate-300"
                          )}>
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
                        {canManage ? (
                          <div className="relative inline-block" onClick={(e) => e.stopPropagation()}>
                            <select 
                              value={emp.status?.toLowerCase() || 'active'}
                              onChange={(e) => handleUpdateStatus(emp.id, e.target.value)}
                              className={cn(
                                "appearance-none rounded-full px-3 py-1 pr-8 text-[8px] font-black uppercase italic tracking-widest outline-none transition-all cursor-pointer",
                                emp.status === 'active' || emp.status === 'Active' ? "bg-green-50 text-green-600 border-green-100" : 
                                emp.status === 'leave' || emp.status === 'Leave' ? "bg-slate-50 text-slate-400 border-slate-200" : "bg-red-50 text-red-500 border-red-100",
                                "border ring-0 focus:ring-2 focus:ring-offset-1 focus:ring-green-500"
                              )}
                            >
                              <option value="active">Đang làm việc</option>
                              <option value="leave">Nghỉ phép</option>
                              <option value="inactive">Nghỉ việc</option>
                            </select>
                            <Filter className="pointer-events-none absolute right-2 top-1/2 h-2.5 w-2.5 -translate-y-1/2 opacity-40" />
                          </div>
                        ) : (
                          <span className={cn(
                            "inline-flex items-center rounded-full px-3 py-1 text-[8px] font-black uppercase italic tracking-widest",
                            emp.status === 'active' || emp.status === 'Active' ? "bg-green-50 text-green-600" : 
                            emp.status === 'leave' || emp.status === 'Leave' ? "bg-slate-50 text-slate-400" : "bg-red-50 text-red-500"
                          )}>
                            {emp.status === 'active' || emp.status === 'Active' ? 'Đang làm việc' : 
                            emp.status === 'leave' || emp.status === 'Leave' ? 'Nghỉ phép' : 'Nghỉ việc'}
                          </span>
                        )}
                      </td>
                      <td className="px-8 py-6">
                        <div className="flex items-center justify-end gap-2">
                          <button 
                            onClick={(e) => {
                              e.stopPropagation();
                              setSelectedEmployee(emp);
                              setIsDetailModalOpen(true);
                            }}
                            className="h-8 w-8 rounded-xl bg-white text-slate-400 shadow-sm transition-all hover:bg-slate-50 hover:text-green-600 ring-1 ring-slate-100"
                            title="Xem chi tiết"
                          >
                            <FileText className="m-auto h-4 w-4" />
                          </button>
                          {canManage && (
                            <>
                              <button className="h-8 w-8 rounded-xl bg-white text-slate-400 shadow-sm transition-all hover:bg-slate-50 hover:text-green-600 ring-1 ring-slate-100">
                                <Edit2 className="m-auto h-4 w-4" />
                              </button>
                              <button className="h-8 w-8 rounded-xl bg-white text-slate-400 shadow-sm transition-all hover:bg-red-50 hover:text-red-600 ring-1 ring-slate-100">
                                <Trash2 className="m-auto h-4 w-4" />
                              </button>
                            </>
                          )}
                        </div>
                      </td>
                    </tr>
                    
                    <AnimatePresence>
                      {expandedEmployeeId === emp.id && (
                        <tr>
                          <td colSpan={8} className="p-0 border-none bg-slate-50/50">
                            <motion.div 
                              initial={{ height: 0, opacity: 0 }}
                              animate={{ height: 'auto', opacity: 1 }}
                              exit={{ height: 0, opacity: 0 }}
                              className="overflow-hidden"
                            >
                              <div className="px-8 py-8 border-t border-slate-100 grid grid-cols-1 lg:grid-cols-3 gap-8">
                                {/* Contact Info */}
                                <div className="space-y-4">
                                  <h4 className="text-[10px] font-black uppercase italic tracking-widest text-slate-400 mb-4 flex items-center gap-2">
                                    <Phone className="h-3 w-3" />
                                    LIÊN HỆ & ĐỊA CHỈ
                                  </h4>
                                  <div className="space-y-3">
                                    <div className="flex items-center gap-4 bg-white p-3 rounded-2xl border border-slate-100 shadow-sm transition-all hover:border-green-200">
                                      <div className="h-8 w-8 rounded-xl bg-slate-50 flex items-center justify-center text-slate-400">
                                        <Mail className="h-4 w-4" />
                                      </div>
                                      <div className="flex-1">
                                        <p className="text-[8px] font-bold text-slate-400 uppercase italic">Email</p>
                                        <p className="text-[11px] font-black italic text-slate-700 truncate">{emp.email || 'N/A'}</p>
                                      </div>
                                    </div>
                                    <div className="flex items-center gap-4 bg-white p-3 rounded-2xl border border-slate-100 shadow-sm transition-all hover:border-green-200">
                                      <div className="h-8 w-8 rounded-xl bg-slate-50 flex items-center justify-center text-slate-400">
                                        <Phone className="h-4 w-4" />
                                      </div>
                                      <div className="flex-1">
                                        <p className="text-[8px] font-bold text-slate-400 uppercase italic">Điện thoại</p>
                                        <p className="text-[11px] font-black italic text-slate-700">{emp.phone || '090 123 4567'}</p>
                                      </div>
                                    </div>
                                    <div className="flex items-start gap-4 bg-white p-3 rounded-2xl border border-slate-100 shadow-sm transition-all hover:border-green-200">
                                      <div className="h-8 w-8 rounded-xl bg-slate-50 flex items-center justify-center text-slate-400 mt-0.5">
                                        <MapPin className="h-4 w-4" />
                                      </div>
                                      <div className="flex-1">
                                        <p className="text-[8px] font-bold text-slate-400 uppercase italic">Thường trú</p>
                                        <p className="text-[11px] font-black italic text-slate-700 leading-tight">189 Điện Biên Phủ, Phường 15, Quận Bình Thạnh, TP.HCM</p>
                                      </div>
                                    </div>
                                  </div>
                                </div>

                                {/* Employment details */}
                                <div className="space-y-4 text-slate-600">
                                  <h4 className="text-[10px] font-black uppercase italic tracking-widest text-slate-400 mb-4 flex items-center gap-2">
                                    <Shield className="h-3 w-3" />
                                    THÔNG TIN CÔNG VIỆC
                                  </h4>
                                  <div className="grid grid-cols-2 gap-4">
                                    <div className="bg-white p-4 rounded-2xl border border-slate-100 shadow-sm">
                                      <p className="text-[8px] font-bold text-slate-400 uppercase italic mb-1">Mã nhân sự</p>
                                      <p className="text-xs font-black italic text-slate-900">{emp.employeeId || 'SG-9999'}</p>
                                    </div>
                                    <div className="bg-white p-4 rounded-2xl border border-slate-100 shadow-sm">
                                      <p className="text-[8px] font-bold text-slate-400 uppercase italic mb-1">Ngày vào làm</p>
                                      <p className="text-xs font-black italic text-slate-900">15/03/2021</p>
                                    </div>
                                    <div className="bg-white p-4 rounded-2xl border border-slate-100 shadow-sm">
                                      <p className="text-[8px] font-bold text-slate-400 uppercase italic mb-1">Loại HĐ</p>
                                      <p className="text-xs font-black italic text-slate-900">Vô thời hạn</p>
                                    </div>
                                    <div className="bg-white p-4 rounded-2xl border border-slate-100 shadow-sm">
                                      <p className="text-[8px] font-bold text-slate-400 uppercase italic mb-1">Chức vụ cấp</p>
                                      <p className="text-xs font-black italic text-slate-900 uppercase">Cấp {Math.floor(Math.random() * 5 + 1)}</p>
                                    </div>
                                  </div>
                                </div>

                                {/* Financial summary */}
                                <div className="space-y-4">
                                  <h4 className="text-[10px] font-black uppercase italic tracking-widest text-slate-400 mb-4 flex items-center gap-2">
                                    <CreditCard className="h-3 w-3" />
                                    TỔNG HỢP THU NHẬP
                                  </h4>
                                  <div className="bg-green-900 rounded-3xl p-6 text-white shadow-xl shadow-green-100 relative overflow-hidden">
                                     <CreditCard className="absolute -bottom-4 -right-4 h-24 w-24 opacity-10" />
                                     <p className="text-[9px] font-black uppercase italic tracking-widest text-green-300/60 mb-1">Thu nhập cơ bản</p>
                                     <p className="text-2xl font-black italic mb-6 leading-none">{emp.salary || '9,800,000₫'}</p>
                                     
                                     <div className="space-y-2">
                                       <div className="flex justify-between items-center text-[10px] italic">
                                         <span className="font-bold text-green-300">Tổng phụ cấp</span>
                                         <span className="font-black text-white">2.300.000₫</span>
                                       </div>
                                       <div className="h-px bg-white/10" />
                                       <div className="flex justify-between items-center text-[10px] italic">
                                         <span className="font-bold text-green-300">Tổng thu nhập</span>
                                         <span className="font-black text-white text-sm">12.100.000₫</span>
                                       </div>
                                     </div>
                                  </div>
                                </div>
                              </div>
                            </motion.div>
                          </td>
                        </tr>
                      )}
                    </AnimatePresence>
                  </React.Fragment>
                ))
              ) : (
                <tr>
                  <td colSpan={8} className="py-20 text-center">
                    <div className="flex flex-col items-center justify-center text-slate-300">
                      <Search className="h-10 w-10 mb-4 opacity-20" />
                      <p className="text-xs font-black uppercase italic tracking-widest">Không tìm thấy nhân viên nào</p>
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Footer / Pagination */}
        <div className="flex items-center justify-between border-t border-slate-50 bg-slate-50/30 px-8 py-6">
          <p className="text-[10px] font-bold italic text-slate-400">
            Hiển thị <span className="font-black text-slate-900">
              {filteredEmployees.length > 0 ? 1 : 0}-
              {filteredEmployees.length}
            </span> trong số <span className="font-black text-slate-900">{filteredEmployees.length}</span> nhân sự
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
