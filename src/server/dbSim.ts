import { DetectionResult, AdminStats, UserProfile } from '../types';
import { BENCHMARK_DATASETS, INITIAL_DETECTIONS, INITIAL_ADMIN_STATS } from '../utils/mockData';

let detections: DetectionResult[] = [...INITIAL_DETECTIONS];
let adminStats: AdminStats = { ...INITIAL_ADMIN_STATS };

const users: UserProfile[] = [
  {
    id: '1',
    name: 'Prof. System Admin',
    email: 'admin@deepfake-research.edu',
    role: 'admin',
    institution: 'Department of Computer Applications',
    createdAt: '2026-01-15',
  },
  {
    id: '2',
    name: 'MCA Research Scholar',
    email: 'researcher@mca.edu',
    role: 'researcher',
    institution: 'School of Artificial Intelligence',
    createdAt: '2026-02-01',
  },
];

export const db = {
  getDetections: (userEmail?: string) => {
    if (userEmail && userEmail !== 'admin@deepfake-research.edu') {
      return detections.filter((d) => !d.userEmail || d.userEmail === userEmail);
    }
    return detections;
  },

  addDetection: (record: DetectionResult) => {
    detections.unshift(record);
    adminStats.totalDetections += 1;
    if (record.prediction === 'DEEPFAKE') {
      adminStats.fakeCount += 1;
    } else {
      adminStats.realCount += 1;
    }
    if (record.modelUsed in adminStats.modelUsage) {
      adminStats.modelUsage[record.modelUsed] += 1;
    }
    db.addLog('INFO', `Completed ${record.modelUsed.toUpperCase()} detection on ${record.fileName} (${record.prediction} - ${record.confidence}%).`);
    return record;
  },

  deleteDetection: (id: string) => {
    detections = detections.filter((d) => d.id !== id);
    db.addLog('INFO', `Deleted detection report record ID: ${id}`);
    return true;
  },

  getStats: () => {
    return {
      ...adminStats,
      totalDetections: detections.length,
      realCount: detections.filter((d) => d.prediction === 'REAL').length,
      fakeCount: detections.filter((d) => d.prediction === 'DEEPFAKE').length,
    };
  },

  addLog: (level: 'INFO' | 'WARN' | 'ERROR', message: string) => {
    const log = {
      id: `log-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
      level,
      message,
      timestamp: new Date().toISOString().replace('T', ' ').substring(0, 19),
    };
    adminStats.recentLogs.unshift(log);
    if (adminStats.recentLogs.length > 50) {
      adminStats.recentLogs.pop();
    }
  },

  getUsers: () => users,

  getBenchmarkMetrics: (datasetName: string) => {
    return BENCHMARK_DATASETS[datasetName] || BENCHMARK_DATASETS['FaceForensics++'];
  },
};
