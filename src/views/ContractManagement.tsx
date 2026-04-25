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
  X,
  Check,
  Calendar
} from 'lucide-react';
import { cn } from '@/src/lib/utils';
import { getContracts, getEmployees, addContract, updateContract } from '@/src/services/dbService';
import { motion, AnimatePresence } from 'motion/react';

interface ContractManagementProps {
  userProfile?: any;
}

export default function ContractManagement({ userProfile }: ContractManagementProps) {
  const [contracts, setContracts] = useState<any[]>([]);
  const [employees, setEmployees] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingContract, setEditingContract] = useState<any>(null);
  const [searchTerm, setSearchTerm] = useState('');

  const [formData, setFormData] = useState({
    employeeId: '',
    contractNumber: '',
    type: 'probation',
    startDate: '',
    endDate: '',
    status: 'active'
  });

  const fetchData = async () => {
    try {
      setLoading(true);
      const [contractsData, employeesData] = await Promise.all([
        getContracts(),
        getEmployees()
      ]);
      setContracts(contractsData || []);
      setEmployees(employeesData || []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleOpenModal = (contract: any = null) => {
    if (contract) {
      setEditingContract(contract);
      setFormData({
        employeeId: contract.employeeId,
        contractNumber: contract.contractNumber,
        type: contract.type,
        startDate: contract.startDate,
        endDate: contract.endDate || '',
        status: contract.status
      });
    } else {
      setEditingContract(null);
      setFormData({
        employeeId: '',
        contractNumber: `HĐ-${Math.floor(1000 + Math.random() * 9000)}-${new Date().getFullYear()}`,
        type: 'probation',
        startDate: new Date().toISOString().split('T')[0],
        endDate: '',
        status: 'active'
      });
    }
    setIsModalOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (editingContract) {
        await updateContract(editingContract.id, formData);
      } else {
        await addContract(formData);
      }
      setIsModalOpen(false);
      fetchData();
    } catch (err) {
      console.error(err);
    }
  };

  const getEmployeeName = (id: string) => {
    const emp = employees.find(e => e.id === id || e.employeeId === id);
    return emp ? (emp.displayName || emp.name) : 'N/A';
  };

  const filteredContracts = contracts.filter(c => 
    c.contractNumber?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    getEmployeeName(c.employeeId).toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-slate-50/50 p-8 pt-6">
      {/* Breadcrumbs */}
      <div className="mb-4 flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-slate-400 italic">
        <span>NHÂN SỰ</span>
        <ChevronRight className="h-3 w-3" />
        <span className="text-green-600">QUẢN LÝ HỢP ĐỒNG</span>
      </div>

      <div className="mb-8 flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black italic tracking-tight text-slate-900 uppercase">Danh sách Hợp đồng Lao động</h1>
          <p className="text-slate-500 text-sm font-medium mt-1">Quản lý các loại hợp đồng, thời hạn và trạng thái pháp lý</p>
        </div>
        <div className="flex gap-3">
          <button className="flex items-center gap-2 rounded-2xl border border-slate-200 bg-white px-5 py-2.5 text-xs font-black italic text-slate-700 shadow-sm transition-all hover:bg-slate-50">
            <Download className="h-4 w-4" />
            Xuất file
          </button>
          <button 
            onClick={() => handleOpenModal()}
            className="flex items-center gap-2 rounded-2xl bg-green-900 px-5 py-2.5 text-xs font-black italic text-white shadow-xl shadow-green-100 transition-all hover:bg-green-950"
          >
            <Plus className="h-4 w-4" />
            Tạo hợp đồng mới
          </button>
        </div>
      </div>

      {/* Filters & Search */}
      <div className="mb-8 grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="md:col-span-2 rounded-3xl border border-slate-100 bg-white p-4 shadow-sm ring-1 ring-black/5">
          <p className="mb-2 text-[9px] font-black uppercase italic tracking-widest text-slate-400">TÌM KIẾM THEO SỐ HĐ / TÊN NV</p>
          <div className="relative">
            <Search className="absolute left-0 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-slate-400" />
            <input 
              type="text" 
              placeholder="Nhập thông tin cần tìm..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-6 bg-transparent text-sm font-black italic text-slate-900 outline-none"
            />
          </div>
        </div>

        <div className="rounded-3xl border border-slate-100 bg-white p-4 shadow-sm ring-1 ring-black/5">
          <p className="mb-2 text-[9px] font-black uppercase italic tracking-widest text-slate-400">LOẠI HỢP ĐỒNG</p>
          <div className="relative">
            <select className="w-full appearance-none bg-transparent text-sm font-black italic text-slate-900 outline-none">
              <option>Tất cả loại</option>
              <option>Thử việc</option>
              <option>Chính thức</option>
              <option>Thời vụ</option>
            </select>
            <Filter className="pointer-events-none absolute right-0 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-slate-400" />
          </div>
        </div>

        <div className="rounded-3xl bg-green-50 p-4 shadow-inner ring-1 ring-green-100">
          <p className="mb-1 text-[9px] font-black uppercase italic tracking-widest text-green-700">Tổng hợp đồng</p>
          <span className="text-2xl font-black tracking-tighter text-green-800">{contracts.length}</span>
        </div>
      </div>

      {/* Contracts Table */}
      <div className="rounded-[2.5rem] border border-slate-100 bg-white shadow-xl shadow-slate-200/50 ring-1 ring-black/5 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full border-collapse text-left">
            <thead>
              <tr className="border-b border-slate-50">
                <th className="px-8 py-6 text-[10px] font-black uppercase italic tracking-widest text-slate-400">SỐ HỢP ĐỒNG</th>
                <th className="px-8 py-6 text-[10px] font-black uppercase italic tracking-widest text-slate-400">NHÂN VIÊN</th>
                <th className="px-8 py-6 text-[10px] font-black uppercase italic tracking-widest text-slate-400">LOẠI HĐ</th>
                <th className="px-8 py-6 text-[10px] font-black uppercase italic tracking-widest text-slate-400">NGÀY BẮT ĐẦU</th>
                <th className="px-8 py-6 text-[10px] font-black uppercase italic tracking-widest text-slate-400">NGÀY KẾT THÚC</th>
                <th className="px-8 py-6 text-[10px] font-black uppercase italic tracking-widest text-slate-400">TRẠNG THÁI</th>
                <th className="px-8 py-6 text-[10px] font-black uppercase italic tracking-widest text-slate-400 text-right">THAO TÁC</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {loading ? (
                <tr>
                  <td colSpan={7} className="py-20 text-center">
                    <Loader2 className="mx-auto h-8 w-8 animate-spin text-green-600" />
                  </td>
                </tr>
              ) : filteredContracts.length === 0 ? (
                <tr>
                  <td colSpan={7} className="py-20 text-center text-slate-400 font-bold italic uppercase tracking-widest text-xs">
                    Không tìm thấy dữ liệu hợp đồng
                  </td>
                </tr>
              ) : (
                filteredContracts.map((contract) => (
                  <tr key={contract.id} className="group transition-all hover:bg-green-50/30 text-sm">
                    <td className="px-8 py-6 font-black text-green-600 italic">
                      {contract.contractNumber}
                    </td>
                    <td className="px-8 py-6">
                      <div className="flex items-center gap-3">
                        <div className="h-8 w-8 rounded-xl bg-slate-100 flex items-center justify-center font-black text-slate-300 text-xs italic">
                          {getEmployeeName(contract.employeeId).charAt(0)}
                        </div>
                        <p className="font-black italic text-slate-900">{getEmployeeName(contract.employeeId)}</p>
                      </div>
                    </td>
                    <td className="px-8 py-6">
                      <span className={cn(
                        "inline-flex items-center rounded-lg px-2 py-1 text-[9px] font-black uppercase italic tracking-widest shadow-sm ring-1 ring-inset",
                        contract.type === 'probation' ? "bg-amber-50 text-amber-600 ring-amber-100" :
                        contract.type === 'official' ? "bg-blue-50 text-blue-600 ring-blue-100" : "bg-purple-50 text-purple-600 ring-purple-100"
                      )}>
                        {contract.type === 'probation' ? 'Thử việc' : contract.type === 'official' ? 'Chính thức' : 'Thời vụ'}
                      </span>
                    </td>
                    <td className="px-8 py-6 font-bold text-slate-600 italic">
                      {contract.startDate}
                    </td>
                    <td className="px-8 py-6 font-bold text-slate-600 italic">
                      {contract.endDate || '---'}
                    </td>
                    <td className="px-8 py-6">
                      <span className={cn(
                        "inline-flex items-center rounded-full px-3 py-1 text-[8px] font-black uppercase italic tracking-widest",
                        contract.status === 'active' ? "bg-green-50 text-green-600" : 
                        contract.status === 'expired' ? "bg-red-50 text-red-500" : "bg-slate-50 text-slate-400"
                      )}>
                        {contract.status === 'active' ? 'Đang thực hiện' : 
                         contract.status === 'expired' ? 'Đã hết hạn' : 'Đã chấm dứt'}
                      </span>
                    </td>
                    <td className="px-8 py-6">
                      <div className="flex items-center justify-end gap-2 opacity-20 transition-all group-hover:opacity-100">
                        <button 
                          onClick={() => handleOpenModal(contract)}
                          className="h-8 w-8 rounded-xl bg-white text-slate-400 shadow-sm transition-all hover:bg-slate-50 hover:text-green-600 ring-1 ring-slate-100"
                        >
                          <Edit2 className="m-auto h-4 w-4" />
                        </button>
                        <button className="h-8 w-8 rounded-xl bg-white text-slate-400 shadow-sm transition-all hover:bg-red-50 hover:text-red-600 ring-1 ring-slate-100">
                          <Trash2 className="m-auto h-4 w-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal Tool */}
      <AnimatePresence>
        {isModalOpen && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 md:p-6">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsModalOpen(false)}
              className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm"
            />
            <motion.div 
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="relative w-full max-w-lg overflow-hidden rounded-[2.5rem] bg-white shadow-2xl ring-1 ring-black/5"
            >
              <div className="p-8">
                <div className="flex items-center justify-between mb-8">
                  <div className="flex items-center gap-3">
                    <div className="h-12 w-12 rounded-2xl bg-green-50 flex items-center justify-center text-green-600 shadow-inner">
                      <FileText className="h-6 w-6" />
                    </div>
                    <div>
                      <h2 className="text-xl font-black italic text-slate-900 uppercase">
                        {editingContract ? 'Cập nhật Hợp đồng' : 'Tạo Hợp đồng Mới'}
                      </h2>
                      <p className="text-[10px] font-bold text-slate-400 uppercase italic tracking-widest italic">Hệ thống AgriCore HRM</p>
                    </div>
                  </div>
                  <button 
                    onClick={() => setIsModalOpen(false)}
                    className="p-2 text-slate-400 hover:text-slate-900 transition-colors"
                  >
                    <X className="h-6 w-6" />
                  </button>
                </div>

                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <label className="text-[10px] font-black text-slate-400 uppercase italic pl-1 tracking-widest">Nhân viên thụ hưởng</label>
                      <select 
                        required
                        value={formData.employeeId}
                        onChange={(e) => setFormData({...formData, employeeId: e.target.value})}
                        className="w-full h-12 bg-slate-50 border border-slate-100 rounded-2xl px-4 text-xs font-black italic text-slate-900 outline-none focus:border-green-600 transition-all font-sans"
                      >
                        <option value="">Chọn nhân viên...</option>
                        {employees.map(emp => (
                          <option key={emp.id} value={emp.id}>{emp.displayName || emp.name}</option>
                        ))}
                      </select>
                    </div>
                    <div className="space-y-2">
                      <label className="text-[10px] font-black text-slate-400 uppercase italic pl-1 tracking-widest">Số hợp đồng</label>
                      <input 
                        required
                        type="text"
                        value={formData.contractNumber}
                        onChange={(e) => setFormData({...formData, contractNumber: e.target.value})}
                        className="w-full h-12 bg-slate-50 border border-slate-100 rounded-2xl px-4 text-xs font-black italic text-slate-900 outline-none focus:border-green-600 transition-all font-sans"
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label className="text-[10px] font-black text-slate-400 uppercase italic pl-1 tracking-widest">Loại hợp đồng</label>
                    <div className="grid grid-cols-3 gap-3">
                      {['probation', 'official', 'seasonal'].map(type => (
                        <button
                          key={type}
                          type="button"
                          onClick={() => setFormData({...formData, type})}
                          className={cn(
                            "py-3 rounded-2xl text-[10px] font-black uppercase italic tracking-widest transition-all ring-1",
                            formData.type === type 
                              ? "bg-green-600 text-white ring-green-600 shadow-lg shadow-green-100" 
                              : "bg-white text-slate-400 ring-slate-100 hover:bg-slate-50"
                          )}
                        >
                          {type === 'probation' ? 'Thử việc' : type === 'official' ? 'Chính thức' : 'Thời vụ'}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <label className="text-[10px] font-black text-slate-400 uppercase italic pl-1 tracking-widest">Ngày bắt đầu</label>
                      <div className="relative">
                        <Calendar className="absolute left-4 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-slate-400" />
                        <input 
                          required
                          type="date"
                          value={formData.startDate}
                          onChange={(e) => setFormData({...formData, startDate: e.target.value})}
                          className="w-full h-12 bg-slate-50 border border-slate-100 rounded-2xl pl-11 pr-4 text-xs font-black italic text-slate-900 outline-none focus:border-green-600 transition-all font-sans"
                        />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <label className="text-[10px] font-black text-slate-400 uppercase italic pl-1 tracking-widest">
                        Ngày kết thúc {['official', 'seasonal'].includes(formData.type) && <span className="text-red-500">*</span>}
                      </label>
                      <div className="relative">
                        <Calendar className="absolute left-4 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-slate-400" />
                        <input 
                          type="date"
                          required={['official', 'seasonal'].includes(formData.type)}
                          value={formData.endDate}
                          onChange={(e) => setFormData({...formData, endDate: e.target.value})}
                          className="w-full h-12 bg-slate-50 border border-slate-100 rounded-2xl pl-11 pr-4 text-xs font-black italic text-slate-900 outline-none focus:border-green-600 transition-all font-sans"
                        />
                      </div>
                    </div>
                  </div>

                  <div className="pt-4 flex gap-3">
                    <button 
                      type="button"
                      onClick={() => setIsModalOpen(false)}
                      className="flex-1 h-14 rounded-2xl border-2 border-slate-100 text-[10px] font-black uppercase italic tracking-widest text-slate-400 hover:bg-slate-50 transition-all"
                    >
                      Huỷ bỏ
                    </button>
                    <button 
                      type="submit"
                      className="flex-[2] h-14 rounded-2xl bg-green-900 text-[10px] font-black uppercase italic tracking-widest text-white shadow-xl shadow-green-100 hover:bg-green-950 transition-all flex items-center justify-center gap-2"
                    >
                      <Check className="h-4 w-4" />
                      {editingContract ? 'Cập nhật hợp đồng' : 'Xác nhận tạo mới'}
                    </button>
                  </div>
                </form>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
