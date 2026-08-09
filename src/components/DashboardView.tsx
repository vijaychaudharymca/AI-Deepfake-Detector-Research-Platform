import React, { useState, useEffect } from 'react';
import { DetectionResult, AdminStats } from '../types';
import { LayoutDashboard, ShieldCheck, AlertTriangle, Users, FileText, Download, Mail, Trash2, Activity, Terminal, CheckCircle2 } from 'lucide-react';

interface DashboardViewProps {
  onOpenReportModal: (result: DetectionResult) => void;
  onOpenEmailModal: (result: DetectionResult) => void;
}

export const DashboardView: React.FC<DashboardViewProps> = ({
  onOpenReportModal,
  onOpenEmailModal,
}) => {
  const [dashboardTab, setDashboardTab] = useState<'user' | 'admin'>('user');
  const [history, setHistory] = useState<DetectionResult[]>([]);
  const [adminStats, setAdminStats] = useState<AdminStats | null>(null);
  const [searchQuery, setSearchQuery] = useState<string>('');

  useEffect(() => {
    fetchHistory();
    fetchAdminStats();
  }, []);

  const fetchHistory = async () => {
    try {
      const res = await fetch('/api/detect/history');
      const data = await res.json();
      setHistory(data);
    } catch (err) {
      console.error('Failed to fetch history:', err);
    }
  };

  const fetchAdminStats = async () => {
    try {
      const res = await fetch('/api/admin/stats');
      const data = await res.json();
      setAdminStats(data);
    } catch (err) {
      console.error('Failed to fetch admin stats:', err);
    }
  };

  const handleDeleteHistory = async (id: string) => {
    try {
      await fetch(`/api/detect/history/${id}`, { method: 'DELETE' });
      setHistory((prev) => prev.filter((item) => item.id !== id));
    } catch (err) {
      console.error('Failed to delete history item:', err);
    }
  };

  const filteredHistory = history.filter((item) =>
    item.fileName.toLowerCase().includes(searchQuery.toLowerCase()) ||
    item.modelUsed.toLowerCase().includes(searchQuery.toLowerCase()) ||
    item.prediction.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="space-y-8 animate-fadeIn">
      {/* Header & Role Switcher */}
      <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 border border-slate-200 dark:border-slate-800 shadow-xl flex flex-col md:flex-row items-center justify-between gap-6">
        <div>
          <div className="flex items-center gap-2">
            <LayoutDashboard className="w-6 h-6 text-indigo-600 dark:text-indigo-400" />
            <h2 className="text-2xl font-extrabold text-slate-900 dark:text-white">
              Research & Platform Dashboards
            </h2>
          </div>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1">
            Personal detection audit trails, report generation, and system administration telemetry
          </p>
        </div>

        <div className="flex items-center gap-1.5 bg-slate-100 dark:bg-slate-800 p-1.5 rounded-2xl border border-slate-200 dark:border-slate-700">
          <button
            onClick={() => setDashboardTab('user')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
              dashboardTab === 'user'
                ? 'bg-indigo-600 text-white shadow-md'
                : 'text-slate-600 dark:text-slate-300 hover:text-slate-900'
            }`}
          >
            User Dashboard
          </button>
          <button
            onClick={() => setDashboardTab('admin')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
              dashboardTab === 'admin'
                ? 'bg-indigo-600 text-white shadow-md'
                : 'text-slate-600 dark:text-slate-300 hover:text-slate-900'
            }`}
          >
            Admin Dashboard
          </button>
        </div>
      </div>

      {/* USER DASHBOARD VIEW */}
      {dashboardTab === 'user' && (
        <div className="space-y-6">
          {/* User Telemetry Summary Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
            <div className="bg-white dark:bg-slate-900 p-6 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-xl">
              <div className="text-xs font-bold uppercase tracking-wider text-slate-400">Total Analyzed Files</div>
              <div className="text-3xl font-black text-slate-900 dark:text-white font-mono mt-2">
                {history.length}
              </div>
              <div className="text-[11px] text-indigo-600 dark:text-indigo-400 font-medium mt-1">
                Images & Videos Processed
              </div>
            </div>

            <div className="bg-white dark:bg-slate-900 p-6 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-xl">
              <div className="text-xs font-bold uppercase tracking-wider text-slate-400">Deepfakes Flagged</div>
              <div className="text-3xl font-black text-red-600 dark:text-red-400 font-mono mt-2">
                {history.filter((h) => h.prediction === 'DEEPFAKE').length}
              </div>
              <div className="text-[11px] text-red-500 font-medium mt-1">Synthetic Manipulations Detected</div>
            </div>

            <div className="bg-white dark:bg-slate-900 p-6 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-xl">
              <div className="text-xs font-bold uppercase tracking-wider text-slate-400">Authentic Verified</div>
              <div className="text-3xl font-black text-emerald-600 dark:text-emerald-400 font-mono mt-2">
                {history.filter((h) => h.prediction === 'REAL').length}
              </div>
              <div className="text-[11px] text-emerald-500 font-medium mt-1">Organic Unaltered Imagery</div>
            </div>
          </div>

          {/* User Detection History Table */}
          <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 border border-slate-200 dark:border-slate-800 shadow-xl space-y-4">
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4 border-b border-slate-200 dark:border-slate-800 pb-4">
              <h3 className="text-base font-bold text-slate-900 dark:text-white">
                Detection History & Forensic Reports ({filteredHistory.length})
              </h3>

              <input
                type="text"
                placeholder="Search file, model, or status..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full sm:w-64 px-3.5 py-2 text-xs rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs text-slate-600 dark:text-slate-300">
                <thead className="bg-slate-100 dark:bg-slate-800/80 text-slate-900 dark:text-white uppercase font-bold text-[11px]">
                  <tr>
                    <th className="p-3.5 rounded-l-xl">File Name</th>
                    <th className="p-3.5">Type</th>
                    <th className="p-3.5">Prediction</th>
                    <th className="p-3.5">Confidence</th>
                    <th className="p-3.5">Model</th>
                    <th className="p-3.5">Date</th>
                    <th className="p-3.5 text-right rounded-r-xl">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-200 dark:divide-slate-800">
                  {filteredHistory.map((item) => (
                    <tr key={item.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/40 transition-colors">
                      <td className="p-3.5 font-bold text-slate-900 dark:text-white flex items-center gap-2">
                        <img src={item.previewUrl} alt="" className="w-8 h-8 rounded-lg object-cover" />
                        <span className="truncate max-w-xs">{item.fileName}</span>
                      </td>
                      <td className="p-3.5 uppercase text-[10px] font-bold text-slate-500">{item.mediaType}</td>
                      <td className="p-3.5">
                        <span
                          className={`px-2.5 py-1 rounded-full text-[10px] font-extrabold uppercase ${
                            item.prediction === 'DEEPFAKE'
                              ? 'bg-red-100 dark:bg-red-950/80 text-red-600 dark:text-red-300 border border-red-200 dark:border-red-800'
                              : 'bg-emerald-100 dark:bg-emerald-950/80 text-emerald-600 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800'
                          }`}
                        >
                          {item.prediction}
                        </span>
                      </td>
                      <td className="p-3.5 font-mono font-bold text-slate-900 dark:text-white">{item.confidence}%</td>
                      <td className="p-3.5 font-mono uppercase">{item.modelUsed}</td>
                      <td className="p-3.5 text-slate-400">{item.timestamp}</td>
                      <td className="p-3.5 text-right space-x-2">
                        <button
                          onClick={() => onOpenReportModal(item)}
                          className="p-1.5 rounded-lg text-indigo-600 dark:text-indigo-400 hover:bg-indigo-50 dark:hover:bg-indigo-950"
                          title="View PDF Report"
                        >
                          <Download className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => onOpenEmailModal(item)}
                          className="p-1.5 rounded-lg text-purple-600 dark:text-purple-400 hover:bg-purple-50 dark:hover:bg-purple-950"
                          title="Email Report"
                        >
                          <Mail className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleDeleteHistory(item.id)}
                          className="p-1.5 rounded-lg text-slate-400 hover:text-red-500 hover:bg-slate-100 dark:hover:bg-slate-800"
                          title="Delete Record"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* ADMIN DASHBOARD VIEW */}
      {dashboardTab === 'admin' && adminStats && (
        <div className="space-y-6">
          {/* Admin Stats Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-4 gap-6">
            <div className="bg-white dark:bg-slate-900 p-6 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-xl">
              <div className="text-xs font-bold uppercase text-slate-400">Total System Users</div>
              <div className="text-3xl font-black text-slate-900 dark:text-white font-mono mt-2">
                {adminStats.totalUsers}
              </div>
              <div className="text-[11px] text-indigo-600 dark:text-indigo-400 font-medium mt-1">Active Researchers</div>
            </div>

            <div className="bg-white dark:bg-slate-900 p-6 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-xl">
              <div className="text-xs font-bold uppercase text-slate-400">Total System Detections</div>
              <div className="text-3xl font-black text-slate-900 dark:text-white font-mono mt-2">
                {adminStats.totalDetections}
              </div>
              <div className="text-[11px] text-slate-500 mt-1">Inferences Executed</div>
            </div>

            <div className="bg-white dark:bg-slate-900 p-6 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-xl">
              <div className="text-xs font-bold uppercase text-slate-400">Deepfakes Identified</div>
              <div className="text-3xl font-black text-red-600 dark:text-red-400 font-mono mt-2">
                {adminStats.fakeCount}
              </div>
              <div className="text-[11px] text-red-500 font-medium mt-1">
                {((adminStats.fakeCount / (adminStats.totalDetections || 1)) * 100).toFixed(1)}% Flag Ratio
              </div>
            </div>

            <div className="bg-white dark:bg-slate-900 p-6 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-xl">
              <div className="text-xs font-bold uppercase text-slate-400">Average Confidence</div>
              <div className="text-3xl font-black text-emerald-600 dark:text-emerald-400 font-mono mt-2">
                {adminStats.avgConfidence}%
              </div>
              <div className="text-[11px] text-emerald-500 font-medium mt-1">Cross-Model Certainty</div>
            </div>
          </div>

          {/* Model Usage Distribution & System Telemetry */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            <div className="lg:col-span-6 bg-white dark:bg-slate-900 p-6 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-xl space-y-4">
              <h3 className="text-base font-bold text-slate-900 dark:text-white">
                Model Utilization Distribution
              </h3>

              <div className="space-y-4 pt-2">
                <div>
                  <div className="flex justify-between text-xs font-bold mb-1">
                    <span className="text-indigo-600 dark:text-indigo-400">Vision Transformer (ViT-Base)</span>
                    <span>{adminStats.modelUsage.vit} calls</span>
                  </div>
                  <div className="w-full bg-slate-100 dark:bg-slate-800 h-3 rounded-full overflow-hidden">
                    <div className="bg-indigo-600 h-full rounded-full" style={{ width: '45%' }} />
                  </div>
                </div>

                <div>
                  <div className="flex justify-between text-xs font-bold mb-1">
                    <span className="text-purple-600 dark:text-purple-400">ResNet50 Transfer Learning</span>
                    <span>{adminStats.modelUsage.resnet50} calls</span>
                  </div>
                  <div className="w-full bg-slate-100 dark:bg-slate-800 h-3 rounded-full overflow-hidden">
                    <div className="bg-purple-600 h-full rounded-full" style={{ width: '35%' }} />
                  </div>
                </div>

                <div>
                  <div className="flex justify-between text-xs font-bold mb-1">
                    <span className="text-slate-600 dark:text-slate-300">Custom 6-Layer CNN</span>
                    <span>{adminStats.modelUsage.cnn} calls</span>
                  </div>
                  <div className="w-full bg-slate-100 dark:bg-slate-800 h-3 rounded-full overflow-hidden">
                    <div className="bg-slate-500 h-full rounded-full" style={{ width: '20%' }} />
                  </div>
                </div>
              </div>
            </div>

            {/* System Logs Stream */}
            <div className="lg:col-span-6 bg-slate-950 text-slate-200 p-6 rounded-3xl border border-slate-800 shadow-xl space-y-4">
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                <Terminal className="w-5 h-5 text-emerald-400" />
                Live Audit & Telemetry Stream
              </h3>

              <div className="space-y-2 max-h-56 overflow-y-auto font-mono text-xs pr-2">
                {adminStats.recentLogs.map((log) => (
                  <div key={log.id} className="p-2 rounded-lg bg-slate-900 border border-slate-800 flex items-start gap-2">
                    <span
                      className={`px-1.5 py-0.5 rounded text-[9px] font-bold ${
                        log.level === 'ERROR'
                          ? 'bg-red-950 text-red-400 border border-red-800'
                          : log.level === 'WARN'
                          ? 'bg-amber-950 text-amber-400 border border-amber-800'
                          : 'bg-emerald-950 text-emerald-400 border border-emerald-800'
                      }`}
                    >
                      {log.level}
                    </span>
                    <div className="flex-1">
                      <span className="text-slate-400 text-[10px] block">{log.timestamp}</span>
                      <span className="text-slate-200">{log.message}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
