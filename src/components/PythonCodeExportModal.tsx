import React, { useState } from 'react';
import { PYTHON_CODE_FILES } from '../utils/mockData';
import { Code2, X, Copy, Check, Download, FileCode, Database, Terminal } from 'lucide-react';

interface PythonCodeExportModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const PythonCodeExportModal: React.FC<PythonCodeExportModalProps> = ({
  isOpen,
  onClose,
}) => {
  const [activeFileIndex, setActiveFileIndex] = useState<number>(0);
  const [copied, setCopied] = useState<boolean>(false);

  if (!isOpen) return null;

  const activeFile = PYTHON_CODE_FILES[activeFileIndex];

  const handleCopyCode = () => {
    navigator.clipboard.writeText(activeFile.code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownloadFile = () => {
    const blob = new Blob([activeFile.code], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = activeFile.filename;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-fadeIn">
      <div className="bg-slate-900 border border-slate-800 rounded-3xl w-full max-w-5xl h-[85vh] flex flex-col shadow-2xl overflow-hidden">
        {/* Modal Header */}
        <div className="p-6 border-b border-slate-800 flex items-center justify-between bg-slate-900/90">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-indigo-600/20 text-indigo-400 border border-indigo-500/30">
              <Code2 className="w-6 h-6" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-white">
                Python Flask REST API & PyTorch AI Code Exporter
              </h3>
              <p className="text-xs text-slate-400">
                Complete Deliverable Package: Backend server, PyTorch Models, Grad-CAM, and MySQL Schema
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Main Content Body */}
        <div className="flex-1 flex flex-col md:flex-row overflow-hidden">
          {/* File Selector Sidebar */}
          <div className="w-full md:w-64 border-r border-slate-800 bg-slate-950 p-4 space-y-2 overflow-y-auto shrink-0">
            <div className="text-[10px] font-bold uppercase tracking-wider text-slate-500 px-2 mb-2">
              Project Deliverable Files ({PYTHON_CODE_FILES.length})
            </div>

            {PYTHON_CODE_FILES.map((file, idx) => (
              <button
                key={idx}
                onClick={() => setActiveFileIndex(idx)}
                className={`w-full text-left p-3 rounded-xl border text-xs transition-all flex items-center gap-2.5 ${
                  activeFileIndex === idx
                    ? 'bg-indigo-950/80 border-indigo-500 text-white font-bold'
                    : 'border-slate-800/80 text-slate-400 hover:text-slate-200 hover:bg-slate-900'
                }`}
              >
                {file.filename.endsWith('.sql') ? (
                  <Database className="w-4 h-4 text-amber-400 shrink-0" />
                ) : (
                  <FileCode className="w-4 h-4 text-indigo-400 shrink-0" />
                )}
                <div className="truncate">
                  <div className="truncate font-mono">{file.filename}</div>
                  <div className="text-[10px] text-slate-500 truncate font-sans">{file.path}</div>
                </div>
              </button>
            ))}
          </div>

          {/* Code Viewer Panel */}
          <div className="flex-1 flex flex-col bg-slate-950 overflow-hidden">
            {/* Action Bar */}
            <div className="p-4 border-b border-slate-800/80 bg-slate-900/50 flex flex-wrap items-center justify-between gap-4">
              <div>
                <span className="text-xs font-bold text-indigo-400 font-mono">{activeFile.path}</span>
                <p className="text-xs text-slate-400">{activeFile.purpose}</p>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={handleCopyCode}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 transition-all"
                >
                  {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                  {copied ? 'Copied' : 'Copy Code'}
                </button>
                <button
                  onClick={handleDownloadFile}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold bg-indigo-600 hover:bg-indigo-700 text-white shadow-md transition-all"
                >
                  <Download className="w-3.5 h-3.5" /> Download File
                </button>
              </div>
            </div>

            {/* Code Text Area */}
            <div className="flex-1 p-4 overflow-auto font-mono text-xs text-slate-200 leading-relaxed bg-slate-950">
              <pre>{activeFile.code}</pre>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
