import React, { useState, useEffect } from 'react';
import { Navbar } from './components/Navbar';
import { HeroBanner } from './components/HeroBanner';
import { DetectorView } from './components/DetectorView';
import { BenchmarkSuite } from './components/BenchmarkSuite';
import { DashboardView } from './components/DashboardView';
import { ResearchPaperView } from './components/ResearchPaperView';
import { ApiDocsView } from './components/ApiDocsView';
import { PythonCodeExportModal } from './components/PythonCodeExportModal';
import { AuthModal } from './components/AuthModal';
import { ReportPDFModal } from './components/ReportPDFModal';
import { EmailReportModal } from './components/EmailReportModal';
import { Footer } from './components/Footer';
import { AuthState, DetectionResult } from './types';

const getInitialAuth = (): AuthState => {
  try {
    const saved = localStorage.getItem('deepsentinel_auth');
    if (saved) {
      const parsed = JSON.parse(saved);
      if (parsed && parsed.isAuthenticated && parsed.token) {
        return parsed;
      }
    }
  } catch (e) {
    console.error('Failed to parse saved auth:', e);
  }
  return {
    token: null,
    user: null,
    isAuthenticated: false,
  };
};

export default function App() {
  const [activeTab, setActiveTab] = useState<'detector' | 'benchmark' | 'dashboard' | 'research' | 'code' | 'api'>('detector');
  const [darkMode, setDarkMode] = useState<boolean>(true);
  
  const [auth, setAuth] = useState<AuthState>(getInitialAuth);

  const [isAuthModalOpen, setIsAuthModalOpen] = useState<boolean>(() => !auth.isAuthenticated);
  const [isCodeModalOpen, setIsCodeModalOpen] = useState<boolean>(false);
  
  const [selectedReportResult, setSelectedReportResult] = useState<DetectionResult | null>(null);
  const [isReportModalOpen, setIsReportModalOpen] = useState<boolean>(false);

  const [selectedEmailResult, setSelectedEmailResult] = useState<DetectionResult | null>(null);
  const [isEmailModalOpen, setIsEmailModalOpen] = useState<boolean>(false);

  // Sync dark mode class on <html>
  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [darkMode]);

  const handleOpenReportModal = (result: DetectionResult) => {
    setSelectedReportResult(result);
    setIsReportModalOpen(true);
  };

  const handleOpenEmailModal = (result: DetectionResult) => {
    setSelectedEmailResult(result);
    setIsEmailModalOpen(true);
  };

  const handleLoginSuccess = (user: any, token: string) => {
    const newAuth: AuthState = {
      token,
      user,
      isAuthenticated: true,
    };
    setAuth(newAuth);
    try {
      localStorage.setItem('deepsentinel_auth', JSON.stringify(newAuth));
    } catch (e) {
      console.error('Failed to save auth to localStorage:', e);
    }
  };

  const handleLogout = () => {
    const emptyAuth: AuthState = {
      token: null,
      user: null,
      isAuthenticated: false,
    };
    setAuth(emptyAuth);
    try {
      localStorage.removeItem('deepsentinel_auth');
    } catch (e) {
      console.error('Failed to clear auth from localStorage:', e);
    }
    setIsAuthModalOpen(true);
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 font-sans transition-colors flex flex-col justify-between">
      <div>
        <Navbar
          activeTab={activeTab}
          setActiveTab={(tab) => {
            if (tab === 'code') {
              setIsCodeModalOpen(true);
            } else {
              setActiveTab(tab);
            }
          }}
          darkMode={darkMode}
          setDarkMode={setDarkMode}
          auth={auth}
          onOpenAuth={() => setIsAuthModalOpen(true)}
          onLogout={handleLogout}
        />

        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
          <HeroBanner />

          {activeTab === 'detector' && (
            <DetectorView
              onDetectionComplete={(res) => console.log('Detection ready:', res.id)}
              onOpenReportModal={handleOpenReportModal}
              onOpenEmailModal={handleOpenEmailModal}
            />
          )}

          {activeTab === 'benchmark' && <BenchmarkSuite />}

          {activeTab === 'dashboard' && (
            <DashboardView
              onOpenReportModal={handleOpenReportModal}
              onOpenEmailModal={handleOpenEmailModal}
            />
          )}

          {activeTab === 'research' && <ResearchPaperView />}

          {activeTab === 'api' && <ApiDocsView />}
        </main>
      </div>

      <Footer />

      {/* Modals */}
      <AuthModal
        isOpen={isAuthModalOpen}
        onClose={() => setIsAuthModalOpen(false)}
        onLoginSuccess={handleLoginSuccess}
      />

      <PythonCodeExportModal
        isOpen={isCodeModalOpen}
        onClose={() => setIsCodeModalOpen(false)}
      />

      <ReportPDFModal
        result={selectedReportResult}
        isOpen={isReportModalOpen}
        onClose={() => setIsReportModalOpen(false)}
      />

      <EmailReportModal
        result={selectedEmailResult}
        isOpen={isEmailModalOpen}
        onClose={() => setIsEmailModalOpen(false)}
      />
    </div>
  );
}
