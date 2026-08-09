import React, { useState } from 'react';
import { AuthState } from '../types';
import { User, Lock, Mail, Shield, CheckCircle, X } from 'lucide-react';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  onLoginSuccess: (user: any, token: string) => void;
}

export const AuthModal: React.FC<AuthModalProps> = ({
  isOpen,
  onClose,
  onLoginSuccess,
}) => {
  const [email, setEmail] = useState('researcher@ai-lab.edu');
  const [password, setPassword] = useState('user123');
  const [mode, setMode] = useState<'login' | 'register'>('login');
  const [name, setName] = useState('AI Scholar');
  const [role, setRole] = useState<'admin' | 'researcher'>('researcher');
  const [institution, setInstitution] = useState('AI & Computer Vision Research Lab');

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const endpoint = mode === 'login' ? '/api/auth/login' : '/api/auth/register';
      const body = mode === 'login' ? { email, password } : { name, email, role, institution, password };

      const res = await fetch(endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      });

      const data = await res.json();
      if (data.token && data.user) {
        onLoginSuccess(data.user, data.token);
        onClose();
      }
    } catch (err) {
      console.error('Auth error:', err);
    }
  };

  const setAdminPreset = () => {
    setEmail('admin@deepfake-research.edu');
    setPassword('admin123');
  };

  const setScholarPreset = () => {
    setEmail('researcher@ai-lab.edu');
    setPassword('user123');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-fadeIn">
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl w-full max-w-md p-6 shadow-2xl relative">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 text-slate-400 hover:text-slate-600 dark:hover:text-white"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="text-center mb-5">
          <div className="w-12 h-12 rounded-2xl bg-indigo-100 dark:bg-indigo-950 text-indigo-600 dark:text-indigo-400 flex items-center justify-center mx-auto mb-3">
            <Shield className="w-6 h-6" />
          </div>
          <h3 className="text-xl font-extrabold text-slate-900 dark:text-white">
            {mode === 'login' ? 'Researcher Portal Login' : 'Register Scholar Account'}
          </h3>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            JWT Authenticated Session for Deepfake Analysis & Audit Logs
          </p>
        </div>

        <div className="mb-5 bg-amber-500/10 border border-amber-500/20 rounded-2xl p-3 text-center">
          <p className="text-xs font-medium text-amber-700 dark:text-amber-300">
            🔒 <strong>Shared Link Notice:</strong> To protect session security, each new visitor is required to log in. Please select a 1-click demo account below or log in.
          </p>
        </div>

        {/* Preset Demo Credentials Panel */}
        <div className="space-y-2 mb-6">
          <div className="text-[11px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider text-center">
            Demo Credentials (1-Click Fill)
          </div>
          <div className="grid grid-cols-2 gap-2">
            <button
              type="button"
              onClick={setAdminPreset}
              className="p-2.5 rounded-xl text-left border border-purple-200 dark:border-purple-900/80 bg-purple-50/80 dark:bg-purple-950/40 hover:bg-purple-100 dark:hover:bg-purple-900/50 transition-colors group"
            >
              <div className="flex items-center justify-between">
                <span className="text-[11px] font-extrabold text-purple-700 dark:text-purple-300">Admin Account</span>
                <span className="text-[9px] px-1.5 py-0.5 rounded bg-purple-200 dark:bg-purple-900 text-purple-800 dark:text-purple-200 font-mono">Fill</span>
              </div>
              <div className="text-[10px] font-mono text-slate-600 dark:text-slate-300 mt-1 truncate">
                admin@deepfake-research.edu
              </div>
              <div className="text-[10px] font-mono text-purple-600 dark:text-purple-400 font-semibold mt-0.5">
                Pass: <code className="bg-purple-100 dark:bg-purple-900/80 px-1 py-0.5 rounded text-purple-900 dark:text-purple-200">admin123</code>
              </div>
            </button>

            <button
              type="button"
              onClick={setScholarPreset}
              className="p-2.5 rounded-xl text-left border border-indigo-200 dark:border-indigo-900/80 bg-indigo-50/80 dark:bg-indigo-950/40 hover:bg-indigo-100 dark:hover:bg-indigo-900/50 transition-colors group"
            >
              <div className="flex items-center justify-between">
                <span className="text-[11px] font-extrabold text-indigo-700 dark:text-indigo-300">Scholar Account</span>
                <span className="text-[9px] px-1.5 py-0.5 rounded bg-indigo-200 dark:bg-indigo-900 text-indigo-800 dark:text-indigo-200 font-mono">Fill</span>
              </div>
              <div className="text-[10px] font-mono text-slate-600 dark:text-slate-300 mt-1 truncate">
                researcher@ai-lab.edu
              </div>
              <div className="text-[10px] font-mono text-indigo-600 dark:text-indigo-400 font-semibold mt-0.5">
                Pass: <code className="bg-indigo-100 dark:bg-indigo-900/80 px-1 py-0.5 rounded text-indigo-900 dark:text-indigo-200">user123</code>
              </div>
            </button>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {mode === 'register' && (
            <div>
              <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block mb-1">Full Name</label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full p-3 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white text-xs outline-none focus:ring-2 focus:ring-indigo-500"
                required
              />
            </div>
          )}

          <div>
            <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block mb-1">Email Address</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full p-3 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white text-xs outline-none focus:ring-2 focus:ring-indigo-500"
              required
            />
          </div>

          <div>
            <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block mb-1">Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full p-3 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white text-xs outline-none focus:ring-2 focus:ring-indigo-500"
              required
            />
          </div>

          <button
            type="submit"
            className="w-full py-3.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-extrabold text-xs shadow-lg shadow-indigo-500/25 transition-all"
          >
            {mode === 'login' ? 'Authenticate & Sign In' : 'Create Scholar Account'}
          </button>
        </form>

        <div className="text-center mt-4">
          <button
            onClick={() => setMode(mode === 'login' ? 'register' : 'login')}
            className="text-xs text-indigo-600 dark:text-indigo-400 font-semibold hover:underline"
          >
            {mode === 'login' ? "Don't have an account? Register here" : 'Already registered? Sign in'}
          </button>
        </div>
      </div>
    </div>
  );
};
