import React from 'react';
import { ShieldAlert, Github, Code2 } from 'lucide-react';

export const Footer: React.FC = () => {
  return (
    <footer className="w-full border-t border-slate-200 dark:border-slate-800 bg-white/50 dark:bg-slate-900/50 backdrop-blur-md py-8 mt-12 transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500 dark:text-slate-400">
        <div className="flex items-center gap-2">
          <ShieldAlert className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />
          <span className="font-semibold text-slate-900 dark:text-white">
            DeepSentinel AI — Deepfake Detection & Research Platform
          </span>
        </div>

        <div>
          Comparative Deep Learning Evaluation: CNN, ResNet50 & Vision Transformer (ViT)
        </div>

        <div className="flex items-center gap-4">
          <a
            href="https://github.com/vijaychaudharymca/deepfake-detection-ai"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-1.5 text-slate-700 dark:text-slate-300 hover:text-indigo-600 dark:hover:text-indigo-400 font-semibold transition-colors"
          >
            <Github className="w-4 h-4" />
            <span>GitHub Repository</span>
          </a>
          <span>•</span>
          <span className="hover:text-slate-900 dark:hover:text-white transition-colors">FaceForensics++ / Celeb-DF</span>
        </div>
      </div>
    </footer>
  );
};
