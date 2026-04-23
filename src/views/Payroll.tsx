import React, { useState } from 'react';
import { 
  Banknote, 
  Download, 
  FileText, 
  Filter, 
  Search, 
  TrendingUp,
  DollarSign,
  Calendar,
  ChevronRight
} from 'lucide-react';
import { motion } from 'motion/react';
import { cn } from '@/src/lib/utils';
import * as XLSX from 'xlsx';
import jsPDF from 'jspdf';
import 'jspdf-autotable';

// Extending jsPDF for autotable
declare module 'jspdf' {
  interface jsPDF {
    autoTable: (options: any) => jsPDF;
  }
}

const mockPayroll = [
  { id: '1', name: 'Lê Văn Hùng', role: 'Kỹ thuật viên', baseSalary: 12000000, allowance: 1500000, deductions: 500000, net: 13000000, status: 'paid' },
  { id: '2', name: 'Trần Thị Mai', role: 'Kiểm kho', baseSalary: 9500000, allowance: 800000, deductions: 200000, net: 10100000, status: 'pending' },
  { id: '3', name: 'Phạm Hoàng Nam', role: 'Trạm trưởng', baseSalary: 18000000, allowance: 3000000, deductions: 1000000, net: 20000000, status: 'paid' },
  { id: '4', name: 'Nguyễn Thị Hoa', role: 'Kế toán', baseSalary: 11000000, allowance: 1000000, deductions: 300000, net: 11700000, status: 'pending' },
];

export default function Payroll() {
  const [loading, setLoading] = useState(false);

  const exportExcel = () => {
    const ws = XLSX.utils.json_to_sheet(mockPayroll);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Payroll");
    XLSX.writeFile(wb, "Bảng_Lương_Sagrifood.xlsx");
  };

  const exportPDF = () => {
    const doc = new jsPDF();
    doc.text("BẢNG LƯƠNG NHÂN VIÊN SAGRIFOOD", 14, 15);
    (doc as any).autoTable({
      startY: 20,
      head: [['ID', 'Họ Tên', 'Chức vụ', 'Lương cơ bản', 'Phụ cấp', 'Khấu trừ', 'Thực lĩnh']],
      body: mockPayroll.map(p => [p.id, p.name, p.role, p.baseSalary.toLocaleString(), p.allowance.toLocaleString(), p.deductions.toLocaleString(), p.net.toLocaleString()]),
    });
    doc.save("Bang_Luong_Sagrifood.pdf");
  };

  return (
    <div className="p-8">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Quản lý Bảng lương</h1>
          <p className="text-slate-500 text-sm mt-1">Tự động tính lương dựa trên dữ liệu chấm công</p>
        </div>
        
        <div className="flex items-center gap-2">
          <button 
            onClick={exportExcel}
            className="flex items-center gap-2 px-4 py-2 bg-white border border-slate-200 rounded-xl text-sm font-bold text-slate-600 hover:bg-slate-50 transition-all"
          >
            <Download className="h-4 w-4" />
            Excel
          </button>
          <button 
            onClick={exportPDF}
            className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-xl text-sm font-bold hover:bg-green-700 transition-all shadow-lg shadow-green-100"
          >
            <FileText className="h-4 w-4" />
            Xuất PDF
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        {[
          { label: 'Tổng quỹ lương', value: '454,800,000 đ', icon: DollarSign, color: 'text-green-600', bg: 'bg-green-50' },
          { label: 'Đã chi trả', value: '320,000,000 đ', icon: TrendingUp, color: 'text-blue-600', bg: 'bg-blue-50' },
          { label: 'Kỳ lương hiện tại', value: 'Tháng 10/2024', icon: Calendar, color: 'text-purple-600', bg: 'bg-purple-50' },
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
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-slate-50 border-b border-slate-200">
              <th className="px-6 py-4 text-xs font-bold text-slate-400 uppercase tracking-widest">Nhân sự</th>
              <th className="px-6 py-4 text-xs font-bold text-slate-400 uppercase tracking-widest">Lương cơ bản</th>
              <th className="px-6 py-4 text-xs font-bold text-slate-400 uppercase tracking-widest">Phụ cấp</th>
              <th className="px-6 py-4 text-xs font-bold text-slate-400 uppercase tracking-widest">Khấu trừ</th>
              <th className="px-6 py-4 text-xs font-bold text-slate-400 uppercase tracking-widest text-right">Thực lĩnh</th>
              <th className="px-6 py-4 text-xs font-bold text-slate-400 uppercase tracking-widest">Trạng thái</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {mockPayroll.map((p) => (
              <tr key={p.id} className="hover:bg-slate-50 transition-colors group">
                <td className="px-6 py-4">
                  <div className="flex items-center gap-3">
                    <div className="h-10 w-10 rounded-full bg-slate-100 flex items-center justify-center font-bold text-slate-400">
                      {p.name.charAt(0)}
                    </div>
                    <div>
                      <p className="text-sm font-bold text-slate-900">{p.name}</p>
                      <p className="text-[10px] text-slate-400">{p.role}</p>
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4 text-sm font-medium text-slate-600">{p.baseSalary.toLocaleString()} đ</td>
                <td className="px-6 py-4 text-sm font-medium text-green-600">+{p.allowance.toLocaleString()} đ</td>
                <td className="px-6 py-4 text-sm font-medium text-red-600">-{p.deductions.toLocaleString()} đ</td>
                <td className="px-6 py-4 text-sm font-black text-slate-900 text-right">{p.net.toLocaleString()} đ</td>
                <td className="px-6 py-4">
                  <span className={cn(
                    "px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider",
                    p.status === 'paid' ? "bg-green-100 text-green-600" : "bg-amber-100 text-amber-600"
                  )}>
                    {p.status === 'paid' ? 'Đã chi' : 'Chờ duyệt'}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
