import { 
  collection, 
  addDoc, 
  getDocs, 
  doc, 
  updateDoc, 
  deleteDoc, 
  query, 
  where, 
  serverTimestamp,
  setDoc,
  getDoc
} from 'firebase/firestore';
import { db, handleFirestoreError, auth } from '@/src/lib/firebase';

// --- EMPLOYEE OPERATIONS ---

export const ensureUserExists = async (user: any) => {
  try {
    const docRef = doc(db, 'employees', user.uid);
    const docSnap = await getDoc(docRef);
    
    if (!docSnap.exists()) {
      // Role hierarchy: admin, giam_doc, phong_tchc, phong_kinh_doanh, to_truong, nhan_vien
      let role = 'nhan_vien';
      if (user.email === 'toquan09051995@gmail.com') {
        role = 'admin';
      }
      
      const employeeData = {
        employeeId: user.uid,
        email: user.email,
        displayName: user.displayName || user.email.split('@')[0],
        photoURL: user.photoURL,
        role: role,
        status: 'active',
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp()
      };
      
      await setDoc(docRef, employeeData);
      
      if (role === 'admin') {
        await setDoc(doc(db, 'admins', user.uid), {
          email: user.email,
          createdAt: serverTimestamp()
        });
      }
    }
  } catch (error) {
    handleFirestoreError(error, 'get', `employees/${user.uid}`);
  }
};

export const getUserProfile = async (uid: string) => {
  try {
    const docRef = doc(db, 'employees', uid);
    const docSnap = await getDoc(docRef);
    if (docSnap.exists()) {
      return { id: docSnap.id, ...docSnap.data() };
    }
    return null;
  } catch (error) {
    handleFirestoreError(error, 'get', `employees/${uid}`);
  }
};

export const updateUserRole = async (uid: string, role: string) => {
  try {
    const docRef = doc(db, 'employees', uid);
    await updateDoc(docRef, { role, updatedAt: serverTimestamp() });
  } catch (error) {
    handleFirestoreError(error, 'update', `employees/${uid}`);
  }
};

export const getEmployees = async () => {
  try {
    const q = query(collection(db, 'employees'));
    const snapshot = await getDocs(q);
    return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
  } catch (error) {
    handleFirestoreError(error, 'list', 'employees');
  }
};

export const addEmployee = async (employeeData: any) => {
  try {
    const docRef = doc(db, 'employees', employeeData.employeeId);
    await setDoc(docRef, {
      ...employeeData,
      status: 'active',
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp()
    });
    return employeeData.employeeId;
  } catch (error) {
    handleFirestoreError(error, 'create', 'employees');
  }
};

export const updateEmployee = async (id: string, data: any) => {
  try {
    const docRef = doc(db, 'employees', id);
    await updateDoc(docRef, { ...data, updatedAt: serverTimestamp() });
  } catch (error) {
    handleFirestoreError(error, 'update', `employees/${id}`);
  }
};

export const deleteEmployee = async (id: string) => {
  try {
    await deleteDoc(doc(db, 'employees', id));
  } catch (error) {
    handleFirestoreError(error, 'delete', `employees/${id}`);
  }
};

// --- LOCATION OPERATIONS ---

export const getLocations = async () => {
  try {
    const snapshot = await getDocs(collection(db, 'locations'));
    const locations = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    
    // If empty, return some defaults for demo/initial use
    if (locations.length === 0) {
      return [
        { id: 'loc-1', name: 'Co.op Mart Cống Quỳnh', address: 'Quận 1, TP.HCM', type: 'Supermarket' },
        { id: 'loc-2', name: 'Emart Gò Vấp', address: 'Gò Vấp, TP.HCM', type: 'Hypermarket' },
        { id: 'loc-3', name: 'GO! An Lạc', address: 'Bình Tân, TP.HCM', type: 'Hypermarket' },
        { id: 'loc-4', name: 'Lotte Mart Quận 7', address: 'Quận 7, TP.HCM', type: 'Supermarket' }
      ];
    }
    return locations;
  } catch (error) {
    handleFirestoreError(error, 'list', 'locations');
  }
};

// --- SHIFT & ASSIGNMENT OPERATIONS ---

export const getShifts = async () => {
  try {
    const snapshot = await getDocs(collection(db, 'shifts'));
    const shifts = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    if (shifts.length === 0) {
      return [
        { id: 'shift-1', name: 'Ca Sáng (A)', startTime: '06:00', endTime: '14:00', color: 'green' },
        { id: 'shift-2', name: 'Ca Chiều (B)', startTime: '14:00', endTime: '22:00', color: 'orange' },
        { id: 'shift-3', name: 'Ca Đêm (C)', startTime: '22:00', endTime: '06:00', color: 'indigo' }
      ];
    }
    return shifts;
  } catch (error) {
    handleFirestoreError(error, 'list', 'shifts');
  }
};

export const getAssignmentsByLocation = async (locationId: string, date: string) => {
  try {
    const q = query(
      collection(db, 'assignments'),
      where('locationId', '==', locationId),
      where('date', '==', date)
    );
    const snapshot = await getDocs(q);
    return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
  } catch (error) {
    handleFirestoreError(error, 'list', 'assignments');
  }
};

export const getAssignmentsByEmployee = async (employeeId: string, date: string) => {
  try {
    const q = query(
      collection(db, 'assignments'),
      where('employeeId', '==', employeeId),
      where('date', '==', date)
    );
    const snapshot = await getDocs(q);
    return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
  } catch (error) {
    handleFirestoreError(error, 'list', 'assignments');
  }
};

export const assignShift = async (assignmentData: any) => {
  try {
    const docRef = await addDoc(collection(db, 'assignments'), {
      ...assignmentData,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp()
    });
    return docRef.id;
  } catch (error) {
    handleFirestoreError(error, 'create', 'assignments');
  }
};

// --- ATTENDANCE OPERATIONS ---

export const logAttendance = async (data: any) => {
  try {
    const docRef = await addDoc(collection(db, 'attendance'), {
      ...data,
      timestamp: serverTimestamp()
    });
    return docRef.id;
  } catch (error) {
    handleFirestoreError(error, 'create', 'attendance');
  }
};

export const getAttendanceByEmployee = async (employeeId: string) => {
  try {
    const q = query(
      collection(db, 'attendance'),
      where('employeeId', '==', employeeId)
    );
    const snapshot = await getDocs(q);
    return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
  } catch (error) {
    handleFirestoreError(error, 'list', 'attendance');
  }
};

// --- CONTRACT OPERATIONS ---

export const getContracts = async () => {
  try {
    const q = query(collection(db, 'contracts'));
    const snapshot = await getDocs(q);
    return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
  } catch (error) {
    handleFirestoreError(error, 'list', 'contracts');
  }
};

export const getContractByEmployee = async (employeeId: string) => {
  try {
    const q = query(
      collection(db, 'contracts'),
      where('employeeId', '==', employeeId)
    );
    const snapshot = await getDocs(q);
    if (!snapshot.empty) {
      return { id: snapshot.docs[0].id, ...snapshot.docs[0].data() };
    }
    return null;
  } catch (error) {
    handleFirestoreError(error, 'list', 'contracts');
  }
};

export const addContract = async (contractData: any) => {
  try {
    const docRef = await addDoc(collection(db, 'contracts'), {
      ...contractData,
      status: contractData.status || 'active',
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp()
    });
    return docRef.id;
  } catch (error) {
    handleFirestoreError(error, 'create', 'contracts');
  }
};

export const updateContract = async (id: string, data: any) => {
  try {
    const docRef = doc(db, 'contracts', id);
    await updateDoc(docRef, { ...data, updatedAt: serverTimestamp() });
  } catch (error) {
    handleFirestoreError(error, 'update', `contracts/${id}`);
  }
};

// --- ALLOWANCE OPERATIONS ---

export const getAllowanceByEmployee = async (employeeId: string) => {
  try {
    const q = query(
      collection(db, 'allowances'),
      where('employeeId', '==', employeeId)
    );
    const snapshot = await getDocs(q);
    if (!snapshot.empty) {
      return { id: snapshot.docs[0].id, ...snapshot.docs[0].data() };
    }
    return null;
  } catch (error) {
    handleFirestoreError(error, 'list', 'allowances');
  }
};

// --- NOTIFICATION OPERATIONS ---

export const createNotification = async (notifData: any) => {
  try {
    const docRef = await addDoc(collection(db, 'notifications'), {
      ...notifData,
      isRead: false,
      createdAt: serverTimestamp()
    });
    return docRef.id;
  } catch (error) {
    handleFirestoreError(error, 'create', 'notifications');
  }
};

export const getNotifications = async (userId: string) => {
  try {
    const q = query(
      collection(db, 'notifications'),
      where('receiverId', '==', userId)
    );
    const snapshot = await getDocs(q);
    return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
  } catch (error) {
    handleFirestoreError(error, 'list', 'notifications');
  }
};

export const markNotificationRead = async (notificationId: string) => {
  try {
    const docRef = doc(db, 'notifications', notificationId);
    await updateDoc(docRef, { isRead: true });
  } catch (error) {
    handleFirestoreError(error, 'update', `notifications/${notificationId}`);
  }
};

// --- LEAVE REQUEST OPERATIONS ---

export const submitLeaveRequest = async (data: any) => {
  try {
    const docRef = await addDoc(collection(db, 'leave_requests'), {
      ...data,
      status: 'pending',
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp()
    });
    
    // Notify relevant roles (Tổ trưởng, P. Kinh doanh, P. TCHC, Giám đốc)
    // For demo/simplicity, we lookup employees with these roles and notify them
    const managersQuery = query(
      collection(db, 'employees'),
      where('role', 'in', ['to_truong', 'phong_kinh_doanh', 'phong_tchc', 'giam_doc', 'admin'])
    );
    const managersSnapshot = await getDocs(managersQuery);
    
    const notifications = managersSnapshot.docs.map(mDoc => ({
      receiverId: mDoc.id,
      title: 'Yêu cầu nghỉ phép mới',
      message: `${data.employeeName} đã gửi yêu cầu nghỉ phép: ${data.reason}`,
      type: 'leave_request',
      requestId: docRef.id,
      senderId: data.employeeId,
      senderName: data.employeeName,
      senderPhoto: data.employeePhoto
    }));

    await Promise.all(notifications.map(n => createNotification(n)));

    return docRef.id;
  } catch (error) {
    handleFirestoreError(error, 'create', 'leave_requests');
  }
};

export const getLeaveRequests = async () => {
  try {
    const q = query(collection(db, 'leave_requests'));
    const snapshot = await getDocs(q);
    return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
  } catch (error) {
    handleFirestoreError(error, 'list', 'leave_requests');
  }
};

export const approveLeaveRequest = async (requestId: string, approverId: string, approverRole: string) => {
  try {
    const docRef = doc(db, 'leave_requests', requestId);
    // In a real system, you'd track multi-level approvals. 
    // Here we just mark as approved for simplicity.
    await updateDoc(docRef, { 
      status: 'approved', 
      approvedBy: approverId,
      approvedRole: approverRole,
      updatedAt: serverTimestamp() 
    });
  } catch (error) {
    handleFirestoreError(error, 'update', `leave_requests/${requestId}`);
  }
};
