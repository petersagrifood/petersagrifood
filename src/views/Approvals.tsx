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

interface ApprovalsProps {
  userProfile?: any;
}

export default function Approvals({ userProfile }: ApprovalsProps) {
  const [filter, setFilter] = useState('all');
  const [selectedRequest, setSelectedRequest] = useState<any>(null);

  if (selectedRequest) {
    return (
      <div className="p-8">
        <button 
          onClick={() => setSelectedRequest(null)}
          className="flex items-center gap-2 text-slate-500 hover:text-slate-900 transition-colors mb-6 font-medium"
        >
          <ChevronRight className="h-4 w-4 rotate-180" />
          Quay lại danh sách
        </button>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-6">
            <div className="bg-white border border-slate-200 rounded-3xl p-8 shadow-sm">
              <div className="flex items-center gap-4 mb-8">
                <div className="h-16 w-16 rounded-2xl bg-slate-100 flex items-center justify-center text-xl font-bold text-slate-400">
                  {selectedRequest.userName.charAt(0)}
                </div>
                <div>
                  <h2 className="text-2xl font-bold text-slate-900">{selectedRequest.userName}</h2>
                  <p className="text-slate-500 font-medium">{selectedRequest.type} • {selectedRequest.category}</p>
                </div>
                <div className="ml-auto">
                  <span className={cn(
                    "px-4 py-1 rounded-full text-xs font-bold uppercase tracking-widest",
                    selectedRequest.status === 'pending' ? "bg-amber-100 text-amber-600" :
                    selectedRequest.status === 'approved' ? "bg-green-100 text-green-600" : "bg-red-100 text-red-600"
                  )}>
                    {selectedRequest.status === 'pending' ? 'Đang chờ' : selectedRequest.status === 'approved' ? 'Hoàn tất' : 'Huỷ'}
                  </span>
                </div>
              </div>

              <div className="space-y-6">
                <div>
                  <h4 className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-2">Chi tiết yêu cầu</h4>
                  <p className="text-slate-700 leading-relaxed bg-slate-50 p-4 rounded-2xl border border-slate-100">
                    {selectedRequest.desc}
                  </p>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-slate-50 p-4 rounded-2xl border border-slate-100">
                    <h4 className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">Ngày yêu cầu</h4>
                    <p className="text-slate-900 font-bold">{selectedRequest.date}</p>
                  </div>
                  <div className="bg-slate-50 p-4 rounded-2xl border border-slate-100">
                    <h4 className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">Danh mục</h4>
                    <p className="text-slate-900 font-bold">{selectedRequest.category}</p>
                  </div>
                </div>
              </div>
            </div>

            {selectedRequest.status === 'pending' && (
              <div className="flex gap-4">
                <button 
                  onClick={() => setSelectedRequest({...selectedRequest, status: 'approved'})}
                  className="flex-1 bg-green-600 text-white h-14 rounded-2xl font-bold hover:bg-green-700 transition-all shadow-lg shadow-green-100 flex items-center justify-center gap-2"
                >
                  <CheckCircle2 className="h-5 w-5" />
                  Phê duyệt yêu cầu
                </button>
                <button 
                  onClick={() => setSelectedRequest({...selectedRequest, status: 'rejected'})}
                  className="flex-1 bg-white border-2 border-red-100 text-red-600 h-14 rounded-2xl font-bold hover:bg-red-50 transition-all flex items-center justify-center gap-2"
                >
                  <XCircle className="h-5 w-5" />
                  Từ chối
                </button>
              </div>
            )}
          </div>

          <div className="space-y-6">
            <div className="bg-white border border-slate-200 rounded-3xl p-6 shadow-sm">
              <h3 className="font-bold text-slate-900 mb-4 flex items-center gap-2">
                <Clock className="h-4 w-4 text-green-600" />
                Lịch sử xử lý
              </h3>
              <div className="space-y-6 relative before:absolute before:left-3 before:top-2 before:bottom-2 before:w-px before:bg-slate-100">
                <div className="relative pl-8">
                  <div className="absolute left-1.5 top-1 h-3 w-3 bg-green-600 rounded-full ring-4 ring-green-50"></div>
                  <p className="text-xs font-bold text-slate-900 uppercase italic">Gửi yêu cầu</p>
                  <p className="text-[10px] text-slate-500 font-medium">Nhân viên • {selectedRequest.date}</p>
                </div>
                <div className="relative pl-8">
                  <div className="absolute left-1.5 top-1 h-3 w-3 bg-amber-500 rounded-full ring-4 ring-amber-50"></div>
                  <p className="text-xs font-bold text-slate-900 uppercase italic">Chờ phê duyệt</p>
                  <p className="text-[10px] text-slate-500 font-medium">Quản lý trực tiếp • Đang xử lý</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

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
        {mockRequests.filter(r => filter === 'all' || r.status === filter).map((req, idx) => (
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
                <button 
                  onClick={() => setSelectedRequest(req)}
                  className="px-4 py-2 text-slate-400 hover:text-slate-600 transition-colors flex items-center gap-2 text-sm font-medium"
                >
                  Xem chi tiết
                  <ChevronRight className="h-4 w-4" />
                </button>
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
