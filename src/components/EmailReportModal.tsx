import React, { useState } from 'react';
import { DetectionResult } from '../types';
import { Mail, Send, CheckCircle, X } from 'lucide-react';

interface EmailReportModalProps {
  result: DetectionResult | null;
  isOpen: boolean;
  onClose: () => void;
}

export const EmailReportModal: React.FC<EmailReportModalProps> = ({
  result,
  isOpen,
  onClose,
}) => {
  const [recipientEmail, setRecipientEmail] = useState('guide@mca.edu');
  const [isSending, setIsSending] = useState(false);
  const [sentSuccess, setSentSuccess] = useState(false);

  if (!isOpen || !result) return null;

  const handleSendEmail = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSending(true);

    try {
      const res = await fetch('/api/report/email', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          recipientEmail,
          reportId: result.id,
          reportSummary: result.xaiExplanation.summary,
        }),
      });

      const data = await res.json();
      if (data.success) {
        setSentSuccess(true);
        setTimeout(() => {
          setSentSuccess(false);
          onClose();
        }, 2000);
      }
    } catch (err) {
      console.error('Email send failed:', err);
    } finally {
      setIsSending(false);
    }
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

        <div className="flex items-center gap-3 mb-4">
          <div className="p-3 rounded-2xl bg-purple-100 dark:bg-purple-950 text-purple-600 dark:text-purple-400">
            <Mail className="w-6 h-6" />
          </div>
          <div>
            <h3 className="text-lg font-bold text-slate-900 dark:text-white">Email Research Report</h3>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Send PDF forensic report for #{result.id} ({result.fileName})
            </p>
          </div>
        </div>

        {sentSuccess ? (
          <div className="py-8 text-center space-y-2">
            <CheckCircle className="w-12 h-12 text-emerald-500 mx-auto animate-bounce" />
            <div className="text-sm font-bold text-slate-900 dark:text-white">
              Report Dispatched Successfully!
            </div>
            <p className="text-xs text-slate-400">Emailed to {recipientEmail}</p>
          </div>
        ) : (
          <form onSubmit={handleSendEmail} className="space-y-4">
            <div>
              <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block mb-1">
                Recipient Email Address (e.g. Project Guide / Lab)
              </label>
              <input
                type="email"
                value={recipientEmail}
                onChange={(e) => setRecipientEmail(e.target.value)}
                className="w-full p-3 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white text-xs outline-none focus:ring-2 focus:ring-indigo-500"
                required
              />
            </div>

            <div className="bg-slate-50 dark:bg-slate-800/50 p-3 rounded-xl border border-slate-200 dark:border-slate-700 text-xs text-slate-600 dark:text-slate-300 space-y-1">
              <div>Prediction: <strong>{result.prediction} ({result.confidence}%)</strong></div>
              <div>Model: <strong>{result.modelUsed.toUpperCase()}</strong></div>
              <div className="truncate">File: {result.fileName}</div>
            </div>

            <button
              type="submit"
              disabled={isSending}
              className="w-full py-3.5 rounded-xl bg-purple-600 hover:bg-purple-700 text-white font-extrabold text-xs shadow-lg shadow-purple-500/25 transition-all flex items-center justify-center gap-2"
            >
              <Send className="w-4 h-4" />
              {isSending ? 'Sending PDF Report...' : 'Email Report Now'}
            </button>
          </form>
        )}
      </div>
    </div>
  );
};
