import React, { useState, useEffect } from 'react';
import { 
  X, 
  Mail, 
  MapPin, 
  Phone, 
  Shield, 
  FileText, 
  Calendar, 
  Clock, 
  CreditCard,
  Briefcase,
  History,
  Loader2,
  CheckCircle2,
  AlertCircle
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { cn } from '@/src/lib/utils';
import { getAttendanceByEmployee, getContractByEmployee, getAllowanceByEmployee } from '@/src/services/dbService';

interface EmployeeDetailModalProps {
  employee: any;
  isOpen: boolean;
  onClose: () => void;
}

export default function EmployeeDetailModal({ employee, isOpen, onClose }: EmployeeDetailModalProps) {
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'info' | 'contract' | 'attendance'>('info');
  const [data, setData] = useState<{
    contract: any;
    attendance: any[];
    allowance: any;
  }>({
    contract: null,
    attendance: [],
    allowance: null
  });

  useEffect(() => {
    if (isOpen && employee?.id) {
      const fetchData = async () => {
        setLoading(true);
        try {
          const empId = employee.id || employee.employeeId;
          const [contract, attendance, allowance] = await Promise.all([
            getContractByEmployee(empId),
            getAttendanceByEmployee(empId),
            getAllowanceByEmployee(empId)
          ]);
          setData({ contract, attendance, allowance });
        } catch (err) {
          console.error('Error fetching employee details:', err);
        } finally {
          setLoading(false);
        }
      };
      fetchData();
    }
  }, [isOpen, employee]);

  if (!employee) return null;

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 md:p-6 lg:p-8">
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm"
          />
          
          <motion.div 
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            className="relative h-full max-h-[90vh] w-full max-w-5xl overflow-hidden rounded-[3rem] bg-slate-50 shadow-2xl ring-1 ring-black/5"
          >
            {/* Header / Sidebar within modal */}
            <div className="flex h-full flex-col md:flex-row">
              {/* Profile Sidebar */}
              <div className="w-full md:w-80 bg-white border-r border-slate-100 p-8 flex flex-col items-center text-center">
                <div className="relative mb-6">
                  <div className="h-32 w-32 rounded-[2.5rem] bg-gradient-to-br from-green-50 to-green-100 p-1.5 shadow-xl shadow-green-900/10 ring-1 ring-green-200 overflow-hidden">
                    {employee.photoURL ? (
                      <img src={employee.photoURL} className="h-full w-full object-cover rounded-[2rem]" alt="" referrerPolicy="no-referrer" />
                    ) : (
                      <div className="h-full w-full flex items-center justify-center text-3xl font-black text-green-300 italic">
                        {employee.displayName?.charAt(0) || employee.name?.charAt(0) || 'U'}
                      </div>
                    )}
                  </div>
                  <div className={cn(
                    "absolute -bottom-1 -right-1 h-8 w-8 rounded-2xl border-4 border-white flex items-center justify-center shadow-lg",
                    employee.status === 'active' ? "bg-green-500" : "bg-slate-300"
                  )}>
                    <div className="h-2 w-2 rounded-full bg-white animate-pulse" />
                  </div>
                </div>

                <h2 className="text-xl font-black italic text-slate-900 uppercase leading-none mb-2">
                  {employee.displayName || employee.name}
                </h2>
                <p className="text-[10px] font-black uppercase italic tracking-widest text-green-600 mb-8">
                  {employee.position || employee.role || 'Nhân viên'}
                </p>

                <div className="w-full space-y-4">
                  <div className="flex items-center gap-3 p-4 rounded-2xl bg-slate-50 border border-slate-100 italic transition-all hover:bg-white hover:shadow-sm">
                    <Mail className="h-4 w-4 text-slate-400" />
                    <span className="text-[10px] font-bold text-slate-600 truncate">{employee.email || 'N/A'}</span>
                  </div>
                  <div className="flex items-center gap-3 p-4 rounded-2xl bg-slate-50 border border-slate-100 italic transition-all hover:bg-white hover:shadow-sm">
                    <MapPin className="h-4 w-4 text-slate-400" />
                    <span className="text-[10px] font-bold text-slate-600">{employee.location || 'Sagrifood HQ'}</span>
                  </div>
                  <div className="flex items-center gap-3 p-4 rounded-2xl bg-slate-50 border border-slate-100 italic transition-all hover:bg-white hover:shadow-sm">
                    <Briefcase className="h-4 w-4 text-slate-400" />
                    <span className="text-[10px] font-bold text-slate-600 uppercase tracking-widest">{employee.employeeId || 'SG-9999'}</span>
                  </div>
                </div>

                <div className="mt-auto pt-8 flex gap-2 w-full">
                  <button 
                    onClick={() => setActiveTab('info')}
                    className={cn(
                      "flex-1 h-12 rounded-xl text-[10px] font-black uppercase italic tracking-widest transition-all",
                      activeTab === 'info' ? "bg-green-900 text-white shadow-xl shadow-green-100" : "bg-slate-100 text-slate-400 hover:bg-slate-200"
                    )}
                  >
                    Hồ sơ
                  </button>
                  <button 
                    onClick={() => setActiveTab('contract')}
                    className={cn(
                      "flex-1 h-12 rounded-xl text-[10px] font-black uppercase italic tracking-widest transition-all",
                      activeTab === 'contract' ? "bg-green-900 text-white shadow-xl shadow-green-100" : "bg-slate-100 text-slate-400 hover:bg-slate-200"
                    )}
                  >
                    Hợp đồng
                  </button>
                  <button 
                    onClick={() => setActiveTab('attendance')}
                    className={cn(
                      "flex-1 h-12 rounded-xl text-[10px] font-black uppercase italic tracking-widest transition-all",
                      activeTab === 'attendance' ? "bg-green-900 text-white shadow-xl shadow-green-100" : "bg-slate-100 text-slate-400 hover:bg-slate-200"
                    )}
                  >
                    Lịch sử
                  </button>
                </div>
              </div>

              {/* Main Content Area */}
              <div className="flex-1 flex flex-col overflow-hidden">
                <div className="flex items-center justify-between p-8 pb-4">
                  <div className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-slate-400 italic">
                    <Shield className="h-3 w-3" />
                    <span>XÁC THỰC BỞI AGRICORE HRM</span>
                  </div>
                  <button 
                    onClick={onClose}
                    className="h-10 w-10 flex items-center justify-center rounded-xl bg-white border border-slate-200 text-slate-400 hover:text-slate-900 transition-colors"
                  >
                    <X className="h-5 w-5" />
                  </button>
                </div>

                <div className="flex-1 overflow-y-auto p-8 pt-4">
                  {loading ? (
                    <div className="h-full flex flex-col items-center justify-center text-slate-400 gap-4 italic font-bold">
                      <Loader2 className="h-10 w-10 animate-spin text-green-600" />
                      <p className="uppercase tracking-widest text-xs">Đang tải dữ liệu hồ sơ...</p>
                    </div>
                  ) : (
                    <div className="space-y-8 pb-8">
                      {activeTab === 'info' && (
                        <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="space-y-6">
                          {/* Financial Summary card */}
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="bg-white p-6 rounded-[2rem] border border-slate-100 shadow-sm ring-1 ring-black/5">
                              <div className="flex items-center gap-3 mb-4">
                                <CreditCard className="h-5 w-5 text-green-600" />
                                <h3 className="text-xs font-black italic uppercase tracking-widest text-slate-900">Thông tin lương & BH</h3>
                              </div>
                              <div className="space-y-4">
                                <div>
                                  <p className="text-[9px] font-bold text-slate-400 uppercase italic">Lương đóng BHXH</p>
                                  <p className="text-lg font-black text-slate-900 italic">{employee.salary || '9,800,000₫'}</p>
                                </div>
                                <div className="pt-2 border-t border-slate-50 flex items-center justify-between">
                                  <span className="text-[9px] font-bold text-slate-400 uppercase italic">Số sổ BHXH</span>
                                  <span className="text-[10px] font-black text-slate-900 italic">{employee.insuranceId || '0382910332'}</span>
                                </div>
                              </div>
                            </div>

                            <div className="bg-white p-6 rounded-[2rem] border border-slate-100 shadow-sm ring-1 ring-black/5">
                              <div className="flex items-center gap-3 mb-4">
                                <AlertCircle className="h-5 w-5 text-green-600" />
                                <h3 className="text-xs font-black italic uppercase tracking-widest text-slate-900">Phụ cấp định kỳ</h3>
                              </div>
                              <div className="space-y-2">
                                {Object.entries(employee.allowances || { responsibility: '0', toxic: '1,500,000', seniority: '800,000' }).map(([key, val]) => (
                                  <div key={key} className="flex items-center justify-between p-2 rounded-xl bg-slate-50/50">
                                    <span className="text-[8px] font-bold text-slate-400 uppercase">{key === 'responsibility' ? 'Trách nhiệm' : key === 'toxic' ? 'Độc hại' : 'Thâm niên'}</span>
                                    <span className="text-[10px] font-black text-green-600">{val as string}</span>
                                  </div>
                                ))}
                              </div>
                            </div>
                          </div>

                          {/* Contact and address details */}
                          <div className="bg-white p-8 rounded-[2rem] border border-slate-100 shadow-sm ring-1 ring-black/5">
                            <h3 className="text-xs font-black italic uppercase tracking-widest text-slate-900 mb-6 flex items-center gap-3">
                              <CheckCircle2 className="h-5 w-5 text-green-600" />
                              Thông tin liên hệ chi tiết
                            </h3>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                              <div>
                                <label className="text-[9px] font-bold text-slate-400 uppercase italic mb-1 block">Email nội bộ</label>
                                <p className="text-xs font-black text-slate-900 italic">{employee.email || 'Chưa cập nhật'}</p>
                              </div>
                              <div>
                                <label className="text-[9px] font-bold text-slate-400 uppercase italic mb-1 block">Số điện thoại</label>
                                <p className="text-xs font-black text-slate-900 italic">090 123 4567</p>
                              </div>
                              <div className="md:col-span-2">
                                <label className="text-[9px] font-bold text-slate-400 uppercase italic mb-1 block">Địa chỉ thường trú</label>
                                <p className="text-xs font-black text-slate-900 italic">189 Điện Biên Phủ, Phường 15, Quận Bình Thạnh, TP.HCM</p>
                              </div>
                            </div>
                          </div>
                        </motion.div>
                      )}

                      {activeTab === 'contract' && (
                        <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="space-y-6">
                          {data.contract ? (
                            <div className="bg-white p-8 rounded-[2rem] border border-green-100 ring-1 ring-green-100 shadow-xl shadow-green-900/5 relative overflow-hidden">
                              <div className="absolute top-0 right-0 p-8">
                                <FileText className="h-20 w-20 text-green-50 opacity-10" />
                              </div>
                              <div className="flex items-center gap-4 mb-8">
                                <div className="h-14 w-14 rounded-2xl bg-green-50 flex items-center justify-center text-green-600">
                                  <FileText className="h-8 w-8" />
                                </div>
                                <div>
                                  <h3 className="text-lg font-black italic text-slate-900 uppercase">HỢP ĐỒNG LAO ĐỘNG</h3>
                                  <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{data.contract.contractNumber}</p>
                                </div>
                              </div>

                              <div className="grid grid-cols-2 md:grid-cols-3 gap-8">
                                <div>
                                  <p className="text-[9px] font-bold text-slate-400 uppercase mb-1">Loại HĐ</p>
                                  <span className="inline-flex rounded-lg bg-green-50 px-3 py-1 text-[10px] font-black uppercase italic tracking-widest text-green-600">
                                    {data.contract.type === 'official' ? 'Chính thức' : data.contract.type === 'probation' ? 'Thử việc' : 'Thời vụ'}
                                  </span>
                                </div>
                                <div>
                                  <p className="text-[9px] font-bold text-slate-400 uppercase mb-1">Ngày ký</p>
                                  <p className="text-xs font-black text-slate-900 italic">{data.contract.startDate}</p>
                                </div>
                                <div>
                                  <p className="text-[9px] font-bold text-slate-400 uppercase mb-1">Hết hạn</p>
                                  <p className="text-xs font-black text-slate-900 italic">{data.contract.endDate || 'Vô thời hạn'}</p>
                                </div>
                                <div>
                                  <p className="text-[9px] font-bold text-slate-400 uppercase mb-1">Trạng thái</p>
                                  <span className="flex items-center gap-2 text-[10px] font-black uppercase italic text-green-600">
                                    <div className="h-1.5 w-1.5 rounded-full bg-green-600 animate-pulse" />
                                    {data.contract.status === 'active' ? 'ĐANG HIỆU LỰC' : 'ĐÃ KẾT THÚC'}
                                  </span>
                                </div>
                              </div>
                            </div>
                          ) : (
                            <div className="py-20 text-center bg-white rounded-[2rem] border-2 border-dashed border-slate-200">
                              <FileText className="mx-auto h-12 w-12 text-slate-200 mb-4" />
                              <p className="text-xs font-black italic text-slate-400 uppercase tracking-widest">Chưa có thông tin hợp đồng được cập nhật</p>
                            </div>
                          )}
                        </motion.div>
                      )}

                      {activeTab === 'attendance' && (
                        <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="space-y-6">
                           <div className="bg-white rounded-[2rem] border border-slate-100 overflow-hidden shadow-xl shadow-slate-200/50">
                            <div className="p-6 border-b border-slate-50 bg-slate-50/50 flex items-center justify-between">
                              <div className="flex items-center gap-3">
                                <History className="h-5 w-5 text-green-600" />
                                <h3 className="text-xs font-black italic uppercase tracking-widest text-slate-900">Nhật ký chấm công gần đây</h3>
                              </div>
                              <button className="flex items-center gap-2 text-[9px] font-black uppercase italic text-green-600 hover:bg-white px-3 py-1.5 rounded-lg transition-all">
                                <Calendar className="h-3 w-3" />
                                Theo tháng
                              </button>
                            </div>
                            <div className="overflow-x-auto">
                              <table className="w-full text-left">
                                <thead>
                                  <tr className="border-b border-slate-50 uppercase text-[9px] font-black text-slate-400 italic">
                                    <th className="px-6 py-4">Ngày</th>
                                    <th className="px-6 py-4">Giờ vào</th>
                                    <th className="px-6 py-4">Giờ ra</th>
                                    <th className="px-6 py-4">Địa điểm</th>
                                    <th className="px-6 py-4 text-right">Trạng thái</th>
                                  </tr>
                                </thead>
                                <tbody className="divide-y divide-slate-50">
                                  {data.attendance.length > 0 ? (
                                    data.attendance.slice(0, 7).map((log) => (
                                      <tr key={log.id} className="text-xs italic hover:bg-slate-50/50 transition-all">
                                        <td className="px-6 py-4 font-black text-slate-900">{log.date || '24/04/2026'}</td>
                                        <td className="px-6 py-4 font-bold text-green-600">{log.checkIn || '07:58'}</td>
                                        <td className="px-6 py-4 font-bold text-red-500">{log.checkOut || '17:05'}</td>
                                        <td className="px-6 py-4 text-slate-500">{log.locationName || 'Nhà máy BD'}</td>
                                        <td className="px-6 py-4 text-right">
                                          <span className="inline-flex rounded-full bg-green-50 px-2 py-0.5 text-[8px] font-black uppercase text-green-600 tracking-tighter shadow-sm">Hợp lệ</span>
                                        </td>
                                      </tr>
                                    ))
                                  ) : (
                                    // Mock rows for demo if no real data
                                    [1,2,3,4,5].map(i => (
                                      <tr key={i} className="text-xs italic hover:bg-slate-50/50 transition-all">
                                        <td className="px-6 py-4 font-black text-slate-900">{`${24-i}/04/2026`}</td>
                                        <td className="px-6 py-4 font-bold text-green-600">07:5{i}</td>
                                        <td className="px-6 py-4 font-bold text-red-500">17:0{i}</td>
                                        <td className="px-6 py-4 text-slate-500">Nhà máy BD</td>
                                        <td className="px-6 py-4 text-right">
                                          <span className="inline-flex rounded-full bg-green-50 px-2 py-0.5 text-[8px] font-black uppercase text-green-600 tracking-tighter shadow-sm">Hợp lệ</span>
                                        </td>
                                      </tr>
                                    ))
                                  )}
                                </tbody>
                              </table>
                            </div>
                           </div>
                        </motion.div>
                      )}
                    </div>
                  )}
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
