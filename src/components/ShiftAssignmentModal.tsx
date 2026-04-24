import React, { useState, useEffect } from 'react';
import { X, Search, User, Loader2, Calendar } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { cn } from '@/src/lib/utils';
import { getEmployees, getShifts, assignShift } from '@/src/services/dbService';

interface ShiftAssignmentModalProps {
  isOpen: boolean;
  onClose: () => void;
  location: any;
  date: string;
  onSuccess: () => void;
}

export default function ShiftAssignmentModal({ isOpen, onClose, location, date, onSuccess }: ShiftAssignmentModalProps) {
  const [employees, setEmployees] = useState<any[]>([]);
  const [shifts, setShifts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedEmployee, setSelectedEmployee] = useState<any>(null);
  const [selectedShift, setSelectedShift] = useState<any>(null);
  const [submitting, setSubmitting] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    if (isOpen) {
      const fetchData = async () => {
        setLoading(true);
        try {
          const [empData, shiftData] = await Promise.all([
            getEmployees(),
            getShifts()
          ]);
          setEmployees(empData || []);
          setShifts(shiftData || []);
        } catch (err) {
          console.error(err);
        } finally {
          setLoading(false);
        }
      };
      fetchData();
    }
  }, [isOpen]);

  const handleAssign = async () => {
    if (!selectedEmployee || !selectedShift) return;
    
    setSubmitting(true);
    try {
      await assignShift({
        employeeId: selectedEmployee.id,
        employeeName: selectedEmployee.displayName,
        employeePhoto: selectedEmployee.photoURL || '',
        employeeRole: selectedEmployee.role || 'Nhân viên',
        locationId: location.id,
        locationName: location.name,
        shiftId: selectedShift.id,
        shiftName: selectedShift.name,
        shiftTime: `${selectedShift.startTime} - ${selectedShift.endTime}`,
        date: date,
        status: 'scheduled'
      });
      onSuccess();
      onClose();
    } catch (err) {
      console.error(err);
    } finally {
      setSubmitting(false);
    }
  };

  const filteredEmployees = employees.filter(e => 
    e.displayName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    e.email?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm"
          />
          <motion.div 
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            className="relative w-full max-w-sm bg-white rounded-[2.5rem] shadow-2xl overflow-hidden flex flex-col max-h-[85vh] font-sans"
          >
            <div className="p-6 border-b border-slate-50 flex items-center justify-between">
              <div>
                <h3 className="text-sm font-black text-slate-900 uppercase italic">Điều động nhân sự</h3>
                <p className="text-[10px] text-slate-500 font-bold italic truncate max-w-[200px]">{location?.name} • {date}</p>
              </div>
              <button onClick={onClose} className="h-10 w-10 bg-slate-50 rounded-xl flex items-center justify-center text-slate-400"><X className="h-5 w-5" /></button>
            </div>

            <div className="p-6 flex-1 overflow-y-auto space-y-6">
              {loading ? (
                <div className="py-20 flex justify-center"><Loader2 className="h-8 w-8 text-green-600 animate-spin" /></div>
              ) : (
                <>
                  <div className="space-y-3">
                    <label className="text-[9px] font-black text-slate-400 uppercase italic px-1">1. Chọn ca làm việc</label>
                    <div className="grid grid-cols-1 gap-2">
                      {shifts.map((s) => (
                        <button 
                          key={s.id}
                          onClick={() => setSelectedShift(s)}
                          className={cn(
                            "p-3 rounded-2xl border text-left transition-all flex items-center justify-between",
                            selectedShift?.id === s.id ? "bg-green-600 border-green-600 text-white shadow-lg shadow-green-100" : "bg-white border-slate-100 text-slate-900"
                          )}
                        >
                          <div>
                            <p className="text-[10px] font-black italic uppercase leading-none mb-1">{s.name}</p>
                            <p className={cn("text-[9px] font-bold italic", selectedShift?.id === s.id ? "text-white/70" : "text-slate-400")}>{s.startTime} - {s.endTime}</p>
                          </div>
                          {selectedShift?.id === s.id && <div className="h-4 w-4 bg-white rounded-full flex items-center justify-center"><div className="h-2 w-2 bg-green-600 rounded-full" /></div>}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div className="space-y-3">
                    <label className="text-[9px] font-black text-slate-400 uppercase italic px-1">2. Chọn nhân viên ({filteredEmployees.length})</label>
                    <div className="relative">
                      <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-200" />
                      <input 
                        type="text" 
                        placeholder="Tìm nhân viên..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full h-11 bg-slate-50 rounded-2xl pl-11 pr-4 text-xs font-bold outline-none border border-slate-100 focus:border-green-600 transition-all shadow-inner"
                      />
                    </div>
                    <div className="space-y-2 max-h-48 overflow-y-auto pr-1">
                      {filteredEmployees.map((e) => (
                        <button 
                          key={e.id}
                          onClick={() => setSelectedEmployee(e)}
                          className={cn(
                            "w-full p-3 rounded-2xl border text-left transition-all flex items-center gap-3",
                            selectedEmployee?.id === e.id ? "bg-slate-900 border-slate-900 text-white" : "bg-white border-slate-50 text-slate-900"
                          )}
                        >
                          <div className="h-8 w-8 bg-slate-100 rounded-xl overflow-hidden flex items-center justify-center text-[10px] font-black italic">
                            {e.photoURL ? <img src={e.photoURL} className="h-full w-full object-cover" alt="" /> : e.displayName?.charAt(0) || 'U'}
                          </div>
                          <div className="flex-1">
                            <p className="text-[10px] font-black italic leading-none truncate">{e.displayName}</p>
                            <p className={cn("text-[8px] font-bold italic", selectedEmployee?.id === e.id ? "text-white/50" : "text-slate-400")}>{e.role || 'Nhân viên'}</p>
                          </div>
                        </button>
                      ))}
                    </div>
                  </div>
                </>
              )}
            </div>

            <div className="p-6 pt-0">
              <button 
                onClick={handleAssign}
                disabled={!selectedEmployee || !selectedShift || submitting}
                className={cn(
                  "w-full h-14 rounded-2xl flex items-center justify-center gap-2 text-xs font-black uppercase tracking-widest transition-all",
                  !selectedEmployee || !selectedShift ? "bg-slate-100 text-slate-300" : "bg-green-600 text-white shadow-xl shadow-green-100 active:translate-y-0.5"
                )}
              >
                {submitting ? <Loader2 className="h-5 w-5 animate-spin" /> : "Xác nhận điều động"}
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
