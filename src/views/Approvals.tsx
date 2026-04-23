import React, { useState } from 'react';
import { 
  CheckCircle2, 
  XCircle, 
  Clock, 
  Filter, 
  Search,
  ExternalLink,
  ChevronRight,
  MoreHorizontal
} from 'lucide-react';
import { motion } from 'motion/react';
import { cn } from '@/src/lib/utils';

const mockRequests = [
  { id: '1', userName: 'Lê Văn Hùng', type: 'Nghỉ phép', category: 'Nghỉ ốm', date: '2024-10-24', status: 'pending', desc: 'Tôi xin nghỉ phép đi khám bệnh định kỳ.' },
  { id: '2', userName: 'Trần Thị Mai', type: 'Đổi ca', category: 'Ca sáng -> Ca chiều', date: '2024-10-25', status: 'pending', desc: 'Có việc gia đình đột xuất.' },
  { id: '3', userName: 'Phạm Hoàng Nam', type: 'Hỗ trợ', category: 'Thiết bị hỏng', date: '2024-10-23', status: 'approved', desc: 'Máy in tại trạm không hoạt động.' },
];

export default function Approvals() {
  const [filter, setFilter] = useState('all');

  return (
    <div className="p-8">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="text-2xl font-bold bg-gradient-to-r from-slate-900 to-slate-600 bg-clip-text text-transparent">
            Phê duyệt yêu cầu
          </h1>
          <p className="text-slate-500 text-sm mt-1">Quản lý và xét duyệt các đơn từ của nhân viên</p>
        </div>
        
        <div className="flex items-center gap-3">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
            <input 
              type="text" 
              placeholder="Tìm kiếm nhân viên..." 
              className="pl-10 pr-4 py-2 bg-white border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-green-500/20 focus:border-green-500 transition-all w-64"
            />
          </div>
          <button className="p-2 bg-white border border-slate-200 rounded-lg text-slate-600 hover:bg-slate-50 transition-colors">
            <Filter className="h-4 w-4" />
          </button>
        </div>
      </div>

      <div className="flex gap-2 p-1 bg-white border border-slate-200 rounded-xl mb-6 w-fit">
        {['all', 'pending', 'approved', 'rejected'].map((f) => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            className={cn(
              "px-4 py-1.5 rounded-lg text-sm font-medium transition-all capitalize",
              filter === f ? "bg-green-600 text-white shadow-sm" : "text-slate-500 hover:text-slate-900"
            )}
          >
            {f === 'all' ? 'Tất cả' : f === 'pending' ? 'Đang chờ' : f === 'approved' ? 'Đã duyệt' : 'Đã từ chối'}
          </button>
        ))}
      </div>

      <div className="grid gap-4">
        {mockRequests.map((req, idx) => (
          <motion.div
            key={req.id}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: idx * 0.05 }}
            className="group bg-white border border-slate-200 rounded-2xl p-5 hover:shadow-xl hover:shadow-slate-200/50 hover:border-green-200 transition-all"
          >
            <div className="flex flex-col md:flex-row gap-4">
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-2">
                  <span className={cn(
                    "px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider",
                    req.status === 'pending' ? "bg-amber-100 text-amber-600" :
                    req.status === 'approved' ? "bg-green-100 text-green-600" : "bg-red-100 text-red-600"
                  )}>
                    {req.status === 'pending' ? 'Đang chờ' : req.status === 'approved' ? 'Hoàn tất' : 'Huỷ'}
                  </span>
                  <span className="text-xs text-slate-400 font-medium">{req.date}</span>
                </div>
                <h3 className="font-bold text-slate-900 flex items-center gap-2">
                  {req.userName}
                  <span className="h-1 w-1 rounded-full bg-slate-300"></span>
                  <span className="text-green-600">{req.type}</span>
                </h3>
                <p className="text-sm text-slate-500 mt-1 line-clamp-1">{req.desc}</p>
                <div className="mt-3 flex items-center gap-2">
                  <div className="text-[10px] bg-slate-100 text-slate-500 px-2 py-0.5 rounded border border-slate-200 font-mono">
                    {req.category}
                  </div>
                </div>
              </div>
              
              <div className="flex items-center gap-2 md:border-l md:pl-6 border-slate-100">
                {req.status === 'pending' ? (
                  <>
                    <button className="flex-1 md:flex-none px-4 py-2 bg-green-600 text-white rounded-xl text-sm font-bold hover:bg-green-700 transition-colors flex items-center justify-center gap-2">
                      <CheckCircle2 className="h-4 w-4" />
                      Duyệt
                    </button>
                    <button className="flex-1 md:flex-none px-4 py-2 bg-white border border-red-200 text-red-600 rounded-xl text-sm font-bold hover:bg-red-50 transition-colors flex items-center justify-center gap-2">
                      <XCircle className="h-4 w-4" />
                      Từ chối
                    </button>
                  </>
                ) : (
                  <button className="px-4 py-2 text-slate-400 hover:text-slate-600 transition-colors flex items-center gap-2 text-sm font-medium">
                    Xem chi tiết
                    <ChevronRight className="h-4 w-4" />
                  </button>
                )}
                <button className="p-2 text-slate-400 hover:bg-slate-50 rounded-lg transition-colors">
                  <MoreHorizontal className="h-5 w-5" />
                </button>
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
