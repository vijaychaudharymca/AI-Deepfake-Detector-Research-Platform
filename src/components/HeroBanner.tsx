import React from 'react';
import { ShieldCheck, Cpu, Database, Eye, Flame, Layers, Github } from 'lucide-react';

export const HeroBanner: React.FC = () => {
  return (
    <div className="relative overflow-hidden bg-gradient-to-br from-slate-900 via-indigo-950 to-slate-900 text-white rounded-3xl p-6 sm:p-10 shadow-2xl border border-indigo-500/20 mb-8">
      {/* Background Glow Accents */}
      <div className="absolute top-0 right-0 -mt-12 -mr-12 w-96 h-96 rounded-full bg-indigo-500/10 blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 left-0 -mb-12 -ml-12 w-96 h-96 rounded-full bg-blue-500/10 blur-3xl pointer-events-none" />

      <div className="relative z-10 max-w-4xl">
        <div className="flex flex-wrap items-center gap-2 mb-4">
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-indigo-500/20 text-indigo-300 border border-indigo-500/30">
            <Cpu className="w-3.5 h-3.5 text-indigo-400" /> Deep Learning Research Paper
          </span>
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-purple-500/20 text-purple-300 border border-purple-500/30">
            <Flame className="w-3.5 h-3.5 text-purple-400" /> Grad-CAM Explainable AI (XAI)
          </span>
          <a
            href="https://github.com/vijaychaudharymca/deepfake-detection-ai"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-slate-800/90 text-slate-200 border border-slate-700 hover:bg-slate-700 transition-colors"
          >
            <Github className="w-3.5 h-3.5 text-white" /> Open GitHub Repository
          </a>
        </div>

        <h1 className="text-2xl sm:text-4xl font-extrabold tracking-tight mb-3 text-white leading-tight">
          AI-Powered Deepfake Image & Video Detection <br className="hidden sm:inline" />
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 via-purple-300 to-pink-400">
            Using Deep Learning Models
          </span>
        </h1>

        <p className="text-sm sm:text-base text-slate-300 mb-6 leading-relaxed max-w-3xl">
          Multi-architecture comparative research platform evaluating <strong className="text-indigo-300 font-semibold">Custom CNN</strong>,{' '}
          <strong className="text-indigo-300 font-semibold">ResNet50 Transfer Learning</strong>, and{' '}
          <strong className="text-indigo-300 font-semibold">Vision Transformer (ViT-Base/16)</strong> across standardized datasets (FaceForensics++, Celeb-DF, DFDC) with Grad-CAM region localization.
        </p>

        {/* Live System Capability Cards */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          <div className="bg-slate-800/60 backdrop-blur-md p-3.5 rounded-2xl border border-slate-700/60">
            <div className="flex items-center gap-2 text-indigo-400 text-xs font-medium mb-1">
              <Layers className="w-4 h-4" /> Best Accuracy
            </div>
            <div className="text-xl font-bold text-white">97.6%</div>
            <div className="text-[11px] text-slate-400">Vision Transformer (ViT)</div>
          </div>

          <div className="bg-slate-800/60 backdrop-blur-md p-3.5 rounded-2xl border border-slate-700/60">
            <div className="flex items-center gap-2 text-purple-400 text-xs font-medium mb-1">
              <Cpu className="w-4 h-4" /> Speed / Latency
            </div>
            <div className="text-xl font-bold text-white">14 ms</div>
            <div className="text-[11px] text-slate-400">Custom 6-Layer CNN</div>
          </div>

          <div className="bg-slate-800/60 backdrop-blur-md p-3.5 rounded-2xl border border-slate-700/60">
            <div className="flex items-center gap-2 text-emerald-400 text-xs font-medium mb-1">
              <Database className="w-4 h-4" /> Benchmark Datasets
            </div>
            <div className="text-xl font-bold text-white">3 Corpora</div>
            <div className="text-[11px] text-slate-400">FF++, Celeb-DF, DFDC</div>
          </div>

          <div className="bg-slate-800/60 backdrop-blur-md p-3.5 rounded-2xl border border-slate-700/60">
            <div className="flex items-center gap-2 text-pink-400 text-xs font-medium mb-1">
              <Eye className="w-4 h-4" /> Explainable AI
            </div>
            <div className="text-xl font-bold text-white">Grad-CAM</div>
            <div className="text-[11px] text-slate-400">Visual Heatmaps + XAI</div>
          </div>
        </div>
      </div>
    </div>
  );
};
