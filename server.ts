import express from 'express';
import { createServer as createViteServer } from 'vite';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json());

  // --- MOCK DATABASE ---
  const employees = [
    { id: 'SG-2401', name: 'Lê Văn Hùng', role: 'Quản lý Sản xuất', location: 'Nhà máy Bình Dương', status: 'working' },
    { id: 'SG-2405', name: 'Trần Thị Mai', role: 'Kế toán trưởng', location: 'Trụ sở chính (Quận 1)', status: 'leave' },
    { id: 'SG-2389', name: 'Phạm Hoàng Nam', role: 'Kỹ thuật viên', location: 'Cửa hàng số 15', status: 'working' },
  ];

  // --- API ROUTES ---
  app.get('/api/employees', (req, res) => {
    res.json(employees);
  });

  app.get('/api/stats', (req, res) => {
    res.json({
      total: employees.length,
      working: employees.filter(e => e.status === 'working').length,
      onLeave: employees.filter(e => e.status === 'leave').length,
      attendanceRate: '96.5%'
    });
  });

  app.post('/api/attendance/check-in', (req, res) => {
    const { userId, location } = req.body;
    console.log(`[Check-in] User ${userId} at ${location.lat}, ${location.lng}`);
    res.json({ success: true, message: 'Chấm công thành công!', time: new Date().toISOString() });
  });

  // --- VITE MIDDLEWARE ---
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`[HRM System] Server running at http://localhost:${PORT}`);
  });
}

startServer();
