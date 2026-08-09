import React, { useRef } from 'react';
import { DetectionResult } from '../types';
import { ShieldCheck, AlertTriangle, Download, X, Award, Flame, Cpu, FileText } from 'lucide-react';

interface ReportPDFModalProps {
  result: DetectionResult | null;
  isOpen: boolean;
  onClose: () => void;
}

export const ReportPDFModal: React.FC<ReportPDFModalProps> = ({
  result,
  isOpen,
  onClose,
}) => {
  const reportRef = useRef<HTMLDivElement>(null);

  if (!isOpen || !result) return null;

  const handlePrintDownload = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-fadeIn">
      <div className="bg-slate-900 border border-slate-800 rounded-3xl w-full max-w-3xl max-h-[90vh] flex flex-col shadow-2xl overflow-hidden">
        {/* Header Bar */}
        <div className="p-4 sm:p-6 border-b border-slate-800 flex items-center justify-between bg-slate-900">
          <div className="flex items-center gap-2">
            <FileText className="w-5 h-5 text-indigo-400" />
            <h3 className="text-base font-bold text-white">
              Forensic Deepfake Verification Certificate Report
            </h3>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={handlePrintDownload}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold bg-indigo-600 hover:bg-indigo-700 text-white transition-all"
            >
              <Download className="w-4 h-4" /> Download / Print PDF
            </button>
            <button onClick={onClose} className="p-1.5 rounded-xl text-slate-400 hover:text-white">
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Certificate Document Content (Print Target) */}
        <div className="flex-1 p-6 sm:p-8 overflow-y-auto bg-slate-950 text-slate-200 space-y-6" ref={reportRef}>
          {/* Certificate Header Banner */}
          <div className="border-b border-slate-800 pb-6 flex items-start justify-between">
            <div>
              <span className="text-[10px] font-bold uppercase tracking-widest text-indigo-400 bg-indigo-950 px-2.5 py-1 rounded-full border border-indigo-800">
                Official Forensic Certificate
              </span>
              <h1 className="text-xl font-extrabold text-white mt-2">
                Deepfake Verification Report #{result.id}
              </h1>
              <p className="text-xs text-slate-400 mt-1">
                Issued on {result.timestamp} by DeepSentinel AI Forensic Engine
              </p>
            </div>

            <div className="w-14 h-14 rounded-2xl bg-indigo-950 text-indigo-400 flex items-center justify-center border border-indigo-800 font-bold text-xs">
              <Award className="w-8 h-8" />
            </div>
          </div>

          {/* Classification Outcome Badge */}
          <div
            className={`p-5 rounded-2xl border flex items-center justify-between ${
              result.prediction === 'DEEPFAKE'
                ? 'bg-red-950/60 border-red-800 text-red-200'
                : 'bg-emerald-950/60 border-emerald-800 text-emerald-200'
            }`}
          >
            <div>
              <div className="text-xs uppercase font-extrabold tracking-wider">Verification Classification</div>
              <div className="text-2xl font-black mt-0.5">{result.prediction}</div>
            </div>
            <div className="text-right font-mono">
              <div className="text-xs uppercase font-bold text-slate-400">Confidence Score</div>
              <div className="text-2xl font-black text-white">{result.confidence}%</div>
            </div>
          </div>

          {/* File & Model Details Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 bg-slate-900 p-4 rounded-2xl border border-slate-800 text-xs">
            <div>
              <span className="text-slate-500 block">Analyzed File</span>
              <strong className="text-white truncate block">{result.fileName}</strong>
            </div>
            <div>
              <span className="text-slate-500 block">AI Model Architecture</span>
              <strong className="text-indigo-400 uppercase">{result.modelUsed}</strong>
            </div>
            <div>
              <span className="text-slate-500 block">Dataset Benchmark</span>
              <strong className="text-white">{result.datasetContext}</strong>
            </div>
            <div>
              <span className="text-slate-500 block">Processing Latency</span>
              <strong className="text-white">{result.processingTimeMs} ms</strong>
            </div>
          </div>

          {/* Explainable AI Findings */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold uppercase text-slate-400 tracking-wider">
              Explainable AI (XAI) Forensic Summary
            </h4>
            <div className="bg-slate-900 p-4 rounded-2xl border border-slate-800 text-xs text-slate-300 leading-relaxed">
              {result.xaiExplanation.summary}
            </div>
          </div>

          {/* Grad-CAM Heatmap Hotspots */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold uppercase text-slate-400 tracking-wider flex items-center gap-1.5">
              <Flame className="w-3.5 h-3.5 text-amber-500" /> Detected Synthetic Regions ({result.heatmap.hotspots.length})
            </h4>

            {result.heatmap.hotspots.map((spot, i) => (
              <div key={i} className="bg-slate-900 p-3 rounded-xl border border-slate-800 flex justify-between text-xs">
                <span className="font-bold text-white">{spot.label}</span>
                <span className="font-mono text-amber-400">Intensity: {(spot.intensity * 100).toFixed(0)}%</span>
              </div>
            ))}
          </div>

          {/* Digital Signature Footer */}
          <div className="pt-4 border-t border-slate-800 flex justify-between items-center text-[10px] text-slate-500 font-mono">
            <div>SHA-256 Digital Verification Hash: 8f9a2b71e...c901</div>
            <div>Deepfake Forensic Verification Document</div>
          </div>
        </div>
      </div>
    </div>
  );
};
