export type AppRole = 'nhan_vien' | 'to_truong' | 'phong_kinh_doanh' | 'phong_to_chuc_hanh_chinh' | 'giam_doc' | 'admin';

export interface Employee {
  id: string;
  name: string;
  role: AppRole;
  department: string;
  location: string;
  status: 'working' | 'leave' | 'absent';
  avatar?: string;
  joinDate?: string;
  email?: string;
  phone?: string;
}

export interface StatCard {
  label: string;
  value: string | number;
  icon: string;
  color: string;
  trend?: string;
}

export interface AttendanceRecord {
  id: string;
  employeeId: string;
  date: string;
  checkIn: string;
  checkOut?: string;
  status: 'on-time' | 'late' | 'early-leave' | 'absent';
  location: string;
}

export interface ShiftRequest {
  id: string;
  employeeName: string;
  type: 'shift-change' | 'leave';
  currentShift: string;
  targetShift?: string;
  date: string;
  reason: string;
  status: 'pending' | 'approved' | 'rejected';
  timestamp: string;
}
