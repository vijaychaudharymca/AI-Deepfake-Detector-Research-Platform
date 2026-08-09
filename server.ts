import express from 'express';
import path from 'path';
import { createServer as createViteServer } from 'vite';
import { db } from './src/server/dbSim';
import { runDeepfakeInference } from './src/server/modelEngine';
import { BENCHMARK_DATASETS, PYTHON_CODE_FILES } from './src/utils/mockData';

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json({ limit: '50mb' }));
  app.use(express.urlencoded({ extended: true, limit: '50mb' }));

  // Request logger middleware
  app.use((req, res, next) => {
    if (req.path.startsWith('/api')) {
      console.log(`[API ${req.method}] ${req.path}`);
    }
    next();
  });

  // -------------------------------------------------------------
  // API ROUTES
  // -------------------------------------------------------------

  // 1. Health check
  app.get('/api/health', (req, res) => {
    res.json({ status: 'ok', project: 'AI Deepfake Detection Research Platform' });
  });

  // 2. Authentication Login / Register
  app.post('/api/auth/login', (req, res) => {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({ message: 'Email and password required.' });
    }

    if (email === 'admin@deepfake-research.edu') {
      return res.json({
        token: 'mock-jwt-admin-token-2026',
        user: {
          id: '1',
          name: 'Prof. System Admin',
          email: 'admin@deepfake-research.edu',
          role: 'admin',
          institution: 'Department of Computer Applications',
          createdAt: '2026-01-15',
        },
      });
    }

    return res.json({
      token: 'mock-jwt-user-token-2026',
      user: {
        id: '2',
        name: 'MCA Research Scholar',
        email: email || 'researcher@mca.edu',
        role: 'researcher',
        institution: 'School of Artificial Intelligence',
        createdAt: '2026-02-01',
      },
    });
  });

  app.post('/api/auth/register', (req, res) => {
    const { name, email, role, institution } = req.body;
    db.addLog('INFO', `Registered new user account: ${email} (${role || 'researcher'})`);
    return res.json({
      token: `mock-jwt-registered-${Date.now()}`,
      user: {
        id: `usr-${Date.now()}`,
        name: name || 'New Scholar',
        email: email || 'user@mca.edu',
        role: role || 'researcher',
        institution: institution || 'MCA Department',
        createdAt: new Date().toISOString().substring(0, 10),
      },
    });
  });

  // 3. Deepfake Detection Endpoint
  app.post('/api/detect', async (req, res) => {
    try {
      const { fileName, mediaType, fileSize, previewUrl, modelUsed, datasetContext, userEmail } = req.body;

      if (!fileName || !mediaType) {
        return res.status(400).json({ message: 'Missing file metadata.' });
      }

      const result = await runDeepfakeInference({
        fileName,
        mediaType: mediaType || 'image',
        fileSize: fileSize || '3.5 MB',
        previewUrl: previewUrl || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=600&auto=format&fit=crop&q=80',
        modelUsed: modelUsed || 'vit',
        datasetContext: datasetContext || 'FaceForensics++',
        userEmail: userEmail || 'researcher@mca.edu',
      });

      db.addDetection(result);

      return res.json(result);
    } catch (err: any) {
      console.error('[Detection Error]', err);
      db.addLog('ERROR', `Detection failed: ${err.message || 'Unknown processing error'}`);
      return res.status(500).json({ message: 'Deepfake analysis failed.', error: err.message });
    }
  });

  // 4. Detection History Endpoint
  app.get('/api/detect/history', (req, res) => {
    const userEmail = req.query.email as string;
    const history = db.getDetections(userEmail);
    res.json(history);
  });

  app.delete('/api/detect/history/:id', (req, res) => {
    const { id } = req.params;
    db.deleteDetection(id);
    res.json({ success: true, message: `Record ${id} removed.` });
  });

  // 5. Research Metrics Endpoint
  app.get('/api/research/metrics', (req, res) => {
    const dataset = (req.query.dataset as string) || 'FaceForensics++';
    const metrics = db.getBenchmarkMetrics(dataset);
    res.json(metrics);
  });

  app.get('/api/research/datasets', (req, res) => {
    res.json(BENCHMARK_DATASETS);
  });

  // 6. Admin Stats & System Logs
  app.get('/api/admin/stats', (req, res) => {
    const stats = db.getStats();
    res.json(stats);
  });

  app.get('/api/admin/logs', (req, res) => {
    const stats = db.getStats();
    res.json(stats.recentLogs);
  });

  // 7. Python Source Code Export Bundle Endpoint
  app.get('/api/export/python-code', (req, res) => {
    res.json(PYTHON_CODE_FILES);
  });

  // 8. Simulated Email Report Dispatcher
  app.post('/api/report/email', (req, res) => {
    const { recipientEmail, reportId, reportSummary } = req.body;
    db.addLog('INFO', `Dispatched deepfake research report PDF to: ${recipientEmail} for record ID: ${reportId}`);
    res.json({
      success: true,
      message: `Deepfake research report #${reportId} successfully emailed to ${recipientEmail}.`,
    });
  });

  // -------------------------------------------------------------
  // VITE / STATIC MIDDLEWARE
  // -------------------------------------------------------------
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
    console.log(`[MCA Server] Running on http://localhost:${PORT}`);
  });
}

startServer();
