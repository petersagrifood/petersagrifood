import React, { useState } from 'react';
import { 
  ShieldCheck, 
  AlertTriangle, 
  FileCheck, 
  Search, 
  Clock,
  Plus,
  Stethoscope,
  ChevronRight,
  Upload
} from 'lucide-react';
import { motion } from 'motion/react';
import { cn } from '@/src/lib/utils';

const complianceData = [
  { id: '1', name: 'Lê Văn Hùng', doc: 'Giấy khám sức khoẻ', issueDate: '2023-11-20', expiryDate: '2024-11-20', status: 'warning' },
  { id: '2', name: 'Trần Thị Mai', doc: 'Chứng chỉ ATTP', issueDate: '2024-01-15', expiryDate: '2025-01-15', status: 'valid' },
  { id: '3', name: 'Phạm Hoàng Nam', doc: 'Giấy khám sức khoẻ', issueDate: '2023-05-10', expiryDate: '2024-05-10', status: 'expired' },
  { id: '4', name: 'Nguyễn Thị Hoa', doc: 'Chứng chỉ ATTP', issueDate: '2024-06-20', expiryDate: '2025-06-20', status: 'valid' },
];

export default function Compliance() {
  const [filter, setFilter] = useState('all');

  return (
    <div className="p-8">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Tuân thủ & An toàn</h1>
          <p className="text-slate-500 text-sm mt-1">Quản lý sức khoẻ nhân sự và chứng chỉ an toàn thực phẩm</p>
        </div>
        
        <button className="flex items-center gap-2 px-6 py-2.5 bg-green-600 text-white rounded-xl font-bold text-sm shadow-lg shadow-green-100 hover:bg-green-700 transition-all">
          <Upload className="h-4 w-4" />
          Tải lên chứng chỉ mới
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        {[
          { label: 'Chứng chỉ hợp lệ', value: '85%', icon: FileCheck, color: 'text-green-600', bg: 'bg-green-50' },
          { label: 'Sắp hết hạn', value: '12', icon: Clock, color: 'text-amber-600', bg: 'bg-amber-50' },
          { label: 'Cảnh báo đỏ', value: '03', icon: AlertTriangle, color: 'text-red-600', bg: 'bg-red-50' },
        ].map((stat, i) => (
          <div key={i} className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm flex items-center gap-4">
            <div className={cn("p-3 rounded-xl", stat.bg)}>
              <stat.icon className={cn("h-6 w-6", stat.color)} />
            </div>
            <div>
              <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">{stat.label}</p>
              <p className="text-xl font-black text-slate-900 mt-1">{stat.value}</p>
            </div>
          </div>
        ))}
      </div>

      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="p-4 border-b border-slate-100 bg-slate-50 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <ShieldCheck className="h-4 w-4 text-slate-400" />
            <span className="text-xs font-bold text-slate-600 uppercase tracking-widest">Danh sách theo dõi</span>
          </div>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-slate-400" />
            <input type="text" placeholder="Tìm tên nhân viên..." className="pl-9 pr-4 py-1.5 bg-white border border-slate-200 rounded-lg text-xs outline-none focus:border-green-600 w-48" />
          </div>
        </div>
        
        <div className="divide-y divide-slate-100">
          {complianceData.map((data) => (
            <div key={data.id} className="p-4 flex items-center justify-between hover:bg-slate-50 transition-colors group">
              <div className="flex items-center gap-4">
                <div className={cn(
                  "h-10 w-10 rounded-xl flex items-center justify-center",
                  data.status === 'valid' ? "bg-green-50 text-green-600" :
                  data.status === 'warning' ? "bg-amber-50 text-amber-600" : "bg-red-50 text-red-600"
                )}>
                  <Stethoscope className="h-5 w-5" />
                </div>
                <div>
                  <h4 className="text-sm font-bold text-slate-900">{data.name}</h4>
                  <p className="text-[10px] text-slate-500 font-medium">{data.doc} • Hết hạn: {data.expiryDate}</p>
                </div>
              </div>
              
              <div className="flex items-center gap-4">
                <span className={cn(
                  "px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider",
                  data.status === 'valid' ? "bg-green-100 text-green-600" :
                  data.status === 'warning' ? "bg-amber-100 text-amber-600" : "bg-red-100 text-red-600"
                )}>
                  {data.status === 'valid' ? 'Hợp lệ' : data.status === 'warning' ? 'Sắp hết hạn' : 'Đã quá hạn'}
                </span>
                <button className="p-2 text-slate-300 group-hover:text-slate-600 transition-colors">
                  <ChevronRight className="h-4 w-4" />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="mt-6 p-4 bg-amber-50 border border-amber-100 rounded-xl flex items-start gap-3">
        <AlertTriangle className="h-5 w-5 text-amber-600 mt-0.5" />
        <div>
          <h4 className="text-sm font-bold text-amber-900">Thông báo tự động</h4>
          <p className="text-xs text-amber-700 leading-relaxed mt-1">
            Hệ thống sẽ tự động gửi thông báo đến nhân viên Lê Văn Hùng vào ngày mai (30 ngày trước khi hết hạn giấy khám sức khoẻ).
          </p>
        </div>
      </div>
    </div>
  );
}
