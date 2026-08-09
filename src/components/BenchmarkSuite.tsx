import React, { useState } from 'react';
import { BENCHMARK_DATASETS } from '../utils/mockData';
import { DatasetName, ModelType } from '../types';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Legend, LineChart, Line, CartesianGrid } from 'recharts';
import { BarChart3, Database, Award, Zap, Activity, Clock, HardDrive, CheckCircle2, AlertCircle } from 'lucide-react';

export const BenchmarkSuite: React.FC = () => {
  const [selectedDataset, setSelectedDataset] = useState<DatasetName>('FaceForensics++');
  const [activeModelTab, setActiveModelTab] = useState<ModelType>('vit');

  const datasetData = BENCHMARK_DATASETS[selectedDataset] || BENCHMARK_DATASETS['FaceForensics++'];
  const models = datasetData.models;

  // Transform model data for Recharts Bar Chart
  const chartMetrics = [
    {
      metric: 'Accuracy (%)',
      CNN: models.cnn.accuracy,
      ResNet50: models.resnet50.accuracy,
      'Vision Transformer (ViT)': models.vit.accuracy,
    },
    {
      metric: 'Precision (%)',
      CNN: models.cnn.precision,
      ResNet50: models.resnet50.precision,
      'Vision Transformer (ViT)': models.vit.precision,
    },
    {
      metric: 'Recall (%)',
      CNN: models.cnn.recall,
      ResNet50: models.resnet50.recall,
      'Vision Transformer (ViT)': models.vit.recall,
    },
    {
      metric: 'F1-Score (%)',
      CNN: models.cnn.f1Score,
      ResNet50: models.resnet50.f1Score,
      'Vision Transformer (ViT)': models.vit.f1Score,
    },
  ];

  // Selected Model's Confusion Matrix
  const activeModelMetrics = models[activeModelTab];
  const cm = activeModelMetrics.confusionMatrix;

  return (
    <div className="space-y-8 animate-fadeIn">
      {/* Header & Dataset Filter */}
      <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 border border-slate-200 dark:border-slate-800 shadow-xl flex flex-col md:flex-row items-center justify-between gap-6">
        <div>
          <div className="flex items-center gap-2">
            <BarChart3 className="w-6 h-6 text-indigo-600 dark:text-indigo-400" />
            <h2 className="text-2xl font-extrabold text-slate-900 dark:text-white">
              Model Benchmark & Comparative Evaluation
            </h2>
          </div>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1">
            Empirical comparative analysis of CNN, ResNet50, and Vision Transformer (ViT) on standard deepfake benchmarks
          </p>
        </div>

        <div className="flex items-center gap-3 bg-slate-50 dark:bg-slate-800/80 p-2 rounded-2xl border border-slate-200 dark:border-slate-700">
          <Database className="w-4 h-4 text-indigo-500 ml-2" />
          <span className="text-xs font-bold text-slate-700 dark:text-slate-300">Dataset:</span>
          <select
            value={selectedDataset}
            onChange={(e) => setSelectedDataset(e.target.value as DatasetName)}
            className="bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 text-slate-900 dark:text-white text-xs font-bold py-2 px-3 rounded-xl outline-none focus:ring-2 focus:ring-indigo-500"
          >
            <option value="FaceForensics++">FaceForensics++ (5,000 samples)</option>
            <option value="Celeb-DF">Celeb-DF v2 (5,639 samples)</option>
            <option value="DFDC">DeepFake Detection Challenge (10,000 samples)</option>
          </select>
        </div>
      </div>

      {/* Top 3 Comparative Model Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* CNN Card */}
        <div
          onClick={() => setActiveModelTab('cnn')}
          className={`cursor-pointer rounded-3xl p-6 border transition-all ${
            activeModelTab === 'cnn'
              ? 'bg-gradient-to-br from-indigo-50 to-white dark:from-indigo-950/40 dark:to-slate-900 border-indigo-500 shadow-xl ring-2 ring-indigo-500/30'
              : 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 hover:border-slate-300'
          }`}
        >
          <div className="flex justify-between items-start mb-4">
            <div>
              <span className="text-[10px] font-bold uppercase tracking-wider text-indigo-600 dark:text-indigo-400 bg-indigo-100 dark:bg-indigo-950 px-2.5 py-1 rounded-full">
                Baseline
              </span>
              <h3 className="text-lg font-extrabold text-slate-900 dark:text-white mt-1">
                Custom 6-Layer CNN
              </h3>
            </div>
            <div className="text-right">
              <span className="text-2xl font-black text-indigo-600 dark:text-indigo-400 font-mono">
                {models.cnn.accuracy}%
              </span>
              <div className="text-[10px] text-slate-400">Accuracy</div>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-2 text-xs text-slate-600 dark:text-slate-300 pt-3 border-t border-slate-200 dark:border-slate-800">
            <div>Precision: <strong className="text-slate-900 dark:text-white">{models.cnn.precision}%</strong></div>
            <div>Recall: <strong className="text-slate-900 dark:text-white">{models.cnn.recall}%</strong></div>
            <div>AUC: <strong className="text-slate-900 dark:text-white">{models.cnn.auc}</strong></div>
            <div>Testing: <strong className="text-slate-900 dark:text-white">{models.cnn.testingTimeMsPerFrame} ms</strong></div>
          </div>
        </div>

        {/* ResNet50 Card */}
        <div
          onClick={() => setActiveModelTab('resnet50')}
          className={`cursor-pointer rounded-3xl p-6 border transition-all ${
            activeModelTab === 'resnet50'
              ? 'bg-gradient-to-br from-purple-50 to-white dark:from-purple-950/40 dark:to-slate-900 border-purple-500 shadow-xl ring-2 ring-purple-500/30'
              : 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 hover:border-slate-300'
          }`}
        >
          <div className="flex justify-between items-start mb-4">
            <div>
              <span className="text-[10px] font-bold uppercase tracking-wider text-purple-600 dark:text-purple-400 bg-purple-100 dark:bg-purple-950 px-2.5 py-1 rounded-full">
                Transfer Learning
              </span>
              <h3 className="text-lg font-extrabold text-slate-900 dark:text-white mt-1">
                ResNet50 Deep Residual
              </h3>
            </div>
            <div className="text-right">
              <span className="text-2xl font-black text-purple-600 dark:text-purple-400 font-mono">
                {models.resnet50.accuracy}%
              </span>
              <div className="text-[10px] text-slate-400">Accuracy</div>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-2 text-xs text-slate-600 dark:text-slate-300 pt-3 border-t border-slate-200 dark:border-slate-800">
            <div>Precision: <strong className="text-slate-900 dark:text-white">{models.resnet50.precision}%</strong></div>
            <div>Recall: <strong className="text-slate-900 dark:text-white">{models.resnet50.recall}%</strong></div>
            <div>AUC: <strong className="text-slate-900 dark:text-white">{models.resnet50.auc}</strong></div>
            <div>Testing: <strong className="text-slate-900 dark:text-white">{models.resnet50.testingTimeMsPerFrame} ms</strong></div>
          </div>
        </div>

        {/* ViT Card */}
        <div
          onClick={() => setActiveModelTab('vit')}
          className={`cursor-pointer rounded-3xl p-6 border transition-all ${
            activeModelTab === 'vit'
              ? 'bg-gradient-to-br from-emerald-50 to-white dark:from-emerald-950/40 dark:to-slate-900 border-emerald-500 shadow-xl ring-2 ring-emerald-500/30'
              : 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 hover:border-slate-300'
          }`}
        >
          <div className="flex justify-between items-start mb-4">
            <div>
              <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-600 dark:text-emerald-400 bg-emerald-100 dark:bg-emerald-950 px-2.5 py-1 rounded-full flex items-center gap-1">
                <Award className="w-3 h-3" /> State of the Art
              </span>
              <h3 className="text-lg font-extrabold text-slate-900 dark:text-white mt-1">
                Vision Transformer (ViT)
              </h3>
            </div>
            <div className="text-right">
              <span className="text-2xl font-black text-emerald-600 dark:text-emerald-400 font-mono">
                {models.vit.accuracy}%
              </span>
              <div className="text-[10px] text-slate-400">Accuracy</div>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-2 text-xs text-slate-600 dark:text-slate-300 pt-3 border-t border-slate-200 dark:border-slate-800">
            <div>Precision: <strong className="text-slate-900 dark:text-white">{models.vit.precision}%</strong></div>
            <div>Recall: <strong className="text-slate-900 dark:text-white">{models.vit.recall}%</strong></div>
            <div>AUC: <strong className="text-slate-900 dark:text-white">{models.vit.auc}</strong></div>
            <div>Testing: <strong className="text-slate-900 dark:text-white">{models.vit.testingTimeMsPerFrame} ms</strong></div>
          </div>
        </div>
      </div>

      {/* Main Metric Bar Chart */}
      <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 border border-slate-200 dark:border-slate-800 shadow-xl space-y-4">
        <h3 className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
          <BarChart3 className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />
          Multi-Model Comparative Classification Metrics ({selectedDataset})
        </h3>

        <div className="h-80 w-full pt-4">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={chartMetrics}>
              <CartesianGrid strokeDasharray="3 3" opacity={0.15} />
              <XAxis dataKey="metric" stroke="#94a3b8" />
              <YAxis domain={[75, 100]} stroke="#94a3b8" />
              <Tooltip
                contentStyle={{
                  backgroundColor: '#0f172a',
                  borderColor: '#334155',
                  borderRadius: '12px',
                  color: '#fff',
                }}
              />
              <Legend />
              <Bar dataKey="CNN" fill="#6366f1" radius={[6, 6, 0, 0]} />
              <Bar dataKey="ResNet50" fill="#a855f7" radius={[6, 6, 0, 0]} />
              <Bar dataKey="Vision Transformer (ViT)" fill="#10b981" radius={[6, 6, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Grid: Confusion Matrix & ROC Curves */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left Column (6 cols): Confusion Matrix Visualizer */}
        <div className="lg:col-span-6 bg-white dark:bg-slate-900 rounded-3xl p-6 border border-slate-200 dark:border-slate-800 shadow-xl space-y-4">
          <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-800 pb-3">
            <div>
              <h3 className="text-base font-bold text-slate-900 dark:text-white">
                Confusion Matrix: {activeModelMetrics.modelName}
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Evaluation on {selectedDataset} test set ({datasetData.sampleCount} total samples)
              </p>
            </div>
            <span className="text-xs font-mono font-bold px-2.5 py-1 rounded-lg bg-indigo-100 dark:bg-indigo-950 text-indigo-600 dark:text-indigo-300">
              AUC: {activeModelMetrics.auc}
            </span>
          </div>

          {/* 2x2 Matrix Grid */}
          <div className="grid grid-cols-2 gap-3 pt-2">
            {/* True Positive */}
            <div className="bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800/60 p-4 rounded-2xl text-center">
              <div className="text-xs text-emerald-700 dark:text-emerald-400 font-bold uppercase">
                True Positive (TP)
              </div>
              <div className="text-2xl font-black text-emerald-950 dark:text-white font-mono mt-1">
                {cm.truePositive}
              </div>
              <div className="text-[10px] text-emerald-600 dark:text-emerald-400 mt-0.5">
                Correctly Identified Deepfakes
              </div>
            </div>

            {/* False Positive */}
            <div className="bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-800/60 p-4 rounded-2xl text-center">
              <div className="text-xs text-amber-700 dark:text-amber-400 font-bold uppercase">
                False Positive (FP)
              </div>
              <div className="text-2xl font-black text-amber-950 dark:text-white font-mono mt-1">
                {cm.falsePositive}
              </div>
              <div className="text-[10px] text-amber-600 dark:text-amber-400 mt-0.5">
                Real Media Misclassified as Deepfake
              </div>
            </div>

            {/* False Negative */}
            <div className="bg-red-50 dark:bg-red-950/40 border border-red-200 dark:border-red-800/60 p-4 rounded-2xl text-center">
              <div className="text-xs text-red-700 dark:text-red-400 font-bold uppercase">
                False Negative (FN)
              </div>
              <div className="text-2xl font-black text-red-950 dark:text-white font-mono mt-1">
                {cm.falseNegative}
              </div>
              <div className="text-[10px] text-red-600 dark:text-red-400 mt-0.5">
                Missed Deepfakes (Security Risk)
              </div>
            </div>

            {/* True Negative */}
            <div className="bg-indigo-50 dark:bg-indigo-950/40 border border-indigo-200 dark:border-indigo-800/60 p-4 rounded-2xl text-center">
              <div className="text-xs text-indigo-700 dark:text-indigo-400 font-bold uppercase">
                True Negative (TN)
              </div>
              <div className="text-2xl font-black text-indigo-950 dark:text-white font-mono mt-1">
                {cm.trueNegative}
              </div>
              <div className="text-[10px] text-indigo-600 dark:text-indigo-400 mt-0.5">
                Correctly Verified Authentic Media
              </div>
            </div>
          </div>
        </div>

        {/* Right Column (6 cols): ROC Curves Graph */}
        <div className="lg:col-span-6 bg-white dark:bg-slate-900 rounded-3xl p-6 border border-slate-200 dark:border-slate-800 shadow-xl space-y-4">
          <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-800 pb-3">
            <div>
              <h3 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
                <Activity className="w-4 h-4 text-emerald-500" />
                Receiver Operating Characteristic (ROC) Curves
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                True Positive Rate (Sensitivity) vs. False Positive Rate (1 - Specificity)
              </p>
            </div>
          </div>

          <div className="h-64 w-full pt-2">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={models.vit.rocCurve}>
                <CartesianGrid strokeDasharray="3 3" opacity={0.15} />
                <XAxis dataKey="fpr" stroke="#94a3b8" label={{ value: 'FPR', position: 'insideBottomRight', offset: -5 }} />
                <YAxis dataKey="tpr" stroke="#94a3b8" label={{ value: 'TPR', angle: -90, position: 'insideLeft' }} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#0f172a',
                    borderColor: '#334155',
                    borderRadius: '12px',
                    color: '#fff',
                  }}
                />
                <Line type="monotone" dataKey="tpr" name="ViT ROC (AUC=0.991)" stroke="#10b981" strokeWidth={3} dot={{ r: 4 }} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Model Technical Resource Comparison Table */}
      <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 border border-slate-200 dark:border-slate-800 shadow-xl space-y-4">
        <h3 className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
          <HardDrive className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />
          Technical Trade-off & Computational Complexity Table
        </h3>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-slate-600 dark:text-slate-300">
            <thead className="bg-slate-100 dark:bg-slate-800/80 text-slate-900 dark:text-white uppercase font-bold text-[11px]">
              <tr>
                <th className="p-3.5 rounded-l-xl">Model Architecture</th>
                <th className="p-3.5">Accuracy</th>
                <th className="p-3.5">F1-Score</th>
                <th className="p-3.5">AUC</th>
                <th className="p-3.5">Training Time</th>
                <th className="p-3.5">Inference / Frame</th>
                <th className="p-3.5 rounded-r-xl">Model Size</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200 dark:divide-slate-800">
              <tr className="hover:bg-slate-50 dark:hover:bg-slate-800/40">
                <td className="p-3.5 font-bold text-slate-900 dark:text-white flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-indigo-500" /> Custom 6-Layer CNN
                </td>
                <td className="p-3.5 font-mono">{models.cnn.accuracy}%</td>
                <td className="p-3.5 font-mono">{models.cnn.f1Score}%</td>
                <td className="p-3.5 font-mono">{models.cnn.auc}</td>
                <td className="p-3.5 font-mono">{models.cnn.trainingTimeMin} min</td>
                <td className="p-3.5 font-mono text-emerald-500 font-bold">{models.cnn.testingTimeMsPerFrame} ms (Fastest)</td>
                <td className="p-3.5 font-mono">{models.cnn.modelSizeFormatted}</td>
              </tr>

              <tr className="hover:bg-slate-50 dark:hover:bg-slate-800/40">
                <td className="p-3.5 font-bold text-slate-900 dark:text-white flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-purple-500" /> ResNet50 Transfer Learning
                </td>
                <td className="p-3.5 font-mono">{models.resnet50.accuracy}%</td>
                <td className="p-3.5 font-mono">{models.resnet50.f1Score}%</td>
                <td className="p-3.5 font-mono">{models.resnet50.auc}</td>
                <td className="p-3.5 font-mono">{models.resnet50.trainingTimeMin} min</td>
                <td className="p-3.5 font-mono">{models.resnet50.testingTimeMsPerFrame} ms</td>
                <td className="p-3.5 font-mono">{models.resnet50.modelSizeFormatted}</td>
              </tr>

              <tr className="hover:bg-slate-50 dark:hover:bg-slate-800/40">
                <td className="p-3.5 font-bold text-slate-900 dark:text-white flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-emerald-500" /> Vision Transformer (ViT-Base/16)
                </td>
                <td className="p-3.5 font-mono text-emerald-500 font-bold">{models.vit.accuracy}% (Best)</td>
                <td className="p-3.5 font-mono">{models.vit.f1Score}%</td>
                <td className="p-3.5 font-mono text-emerald-500 font-bold">{models.vit.auc}</td>
                <td className="p-3.5 font-mono">{models.vit.trainingTimeMin} min</td>
                <td className="p-3.5 font-mono">{models.vit.testingTimeMsPerFrame} ms</td>
                <td className="p-3.5 font-mono">{models.vit.modelSizeFormatted}</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
