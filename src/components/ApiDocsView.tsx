import React, { useState } from 'react';
import {
  Code2,
  Terminal,
  Send,
  Copy,
  Check,
  Key,
  Download,
  Server,
  Zap,
  Globe,
  CheckCircle2,
  AlertCircle,
  Clock,
  Play,
  FileCode,
  ShieldAlert,
  Sparkles,
  RefreshCw,
} from 'lucide-react';

interface ApiEndpoint {
  id: string;
  method: 'GET' | 'POST' | 'DELETE';
  path: string;
  title: string;
  description: string;
  requiresAuth: boolean;
  defaultQueryParams?: Record<string, string>;
  defaultBodyParams?: Record<string, any>;
  sampleResponse: Record<string, any>;
}

const API_ENDPOINTS: ApiEndpoint[] = [
  {
    id: 'health',
    method: 'GET',
    path: '/api/health',
    title: 'System Health Check',
    description: 'Verify backend API operational status, database connectivity, and model engine readiness.',
    requiresAuth: false,
    sampleResponse: {
      status: 'ok',
      project: 'AI Deepfake Detection Research Platform',
      timestamp: '2026-08-08T23:40:00Z',
    },
  },
  {
    id: 'detect',
    method: 'POST',
    path: '/api/detect',
    title: 'Run Deepfake Detection Inference',
    description: 'Executes CNN, ResNet50, or Vision Transformer model inference on provided image or video frames, calculating confidence scores and Grad-CAM explainability heatmaps.',
    requiresAuth: true,
    defaultBodyParams: {
      fileName: 'actor_interview_manipulated.mp4',
      mediaType: 'video',
      fileSize: '14.2 MB',
      modelUsed: 'vit',
      datasetContext: 'FaceForensics++',
      userEmail: 'researcher@ai-lab.edu',
    },
    sampleResponse: {
      id: 'det-101',
      fileName: 'actor_interview_manipulated.mp4',
      mediaType: 'video',
      fileSize: '14.2 MB',
      prediction: 'DEEPFAKE',
      confidence: 98.4,
      modelUsed: 'vit',
      datasetContext: 'FaceForensics++',
      processingTimeMs: 1420,
      heatmap: {
        hotspots: [
          { x: 48, y: 38, radius: 24, intensity: 0.95, label: 'Orbital Blending Artifact' },
        ],
        spectralAnomalyScore: 0.88,
        facialSymmetryScore: 0.92,
        frequencyDiscrepancy: 0.81,
      },
      xaiExplanation: {
        summary: 'Vision Transformer detected severe spatial and temporal boundary artifacts near the eyes and jawline.',
        keyFeatures: ['Eye blinking frequency anomaly', 'Boundary warping around mouth'],
        manipulatedRegions: ['Facial identity swapping', 'Mouth texture blur'],
        technicalAnalysis: 'Attention weights in layers 9-12 highlighted phase discrepancies in high-frequency spatial bands.',
      },
      timestamp: '2026-08-08 23:40:12',
    },
  },
  {
    id: 'history',
    method: 'GET',
    path: '/api/detect/history',
    title: 'Retrieve Forensic Detection History',
    description: 'Fetches historical deepfake detection analysis logs filtered by user email or global scope.',
    requiresAuth: true,
    defaultQueryParams: {
      email: 'researcher@ai-lab.edu',
    },
    sampleResponse: [
      {
        id: 'det-101',
        fileName: 'actor_interview_manipulated.mp4',
        prediction: 'DEEPFAKE',
        confidence: 98.4,
        modelUsed: 'vit',
        timestamp: '2026-08-08 23:40:12',
      },
    ],
  },
  {
    id: 'metrics',
    method: 'GET',
    path: '/api/research/metrics',
    title: 'Fetch Benchmark Metrics',
    description: 'Returns accuracy, precision, recall, F1-score, and AUC benchmark data for CNN, ResNet50, and ViT across FaceForensics++, Celeb-DF, and DFDC datasets.',
    requiresAuth: false,
    defaultQueryParams: {
      dataset: 'FaceForensics++',
    },
    sampleResponse: {
      datasetName: 'FaceForensics++',
      sampleCount: 1000,
      realCount: 500,
      fakeCount: 500,
      models: {
        vit: {
          accuracy: 97.6,
          precision: 97.1,
          recall: 98.2,
          f1Score: 97.6,
          auc: 0.991,
        },
      },
    },
  },
  {
    id: 'auth_login',
    method: 'POST',
    path: '/api/auth/login',
    title: 'Authenticate & Issue JWT Token',
    description: 'Authenticates a researcher or administrator account, returning a Bearer JWT token for authorized API access.',
    requiresAuth: false,
    defaultBodyParams: {
      email: 'researcher@ai-lab.edu',
      password: 'password123',
    },
    sampleResponse: {
      token: 'mock-jwt-user-token-2026',
      user: {
        id: '2',
        name: 'AI Research Scholar',
        email: 'researcher@ai-lab.edu',
        role: 'researcher',
        institution: 'AI & Vision Research Lab',
      },
    },
  },
  {
    id: 'export_code',
    method: 'GET',
    path: '/api/export/python-code',
    title: 'Export PyTorch & Flask Backend Files',
    description: 'Downloads or retrieves full Python Flask REST server, PyTorch model definitions, Grad-CAM module, and MySQL database schema.',
    requiresAuth: false,
    sampleResponse: [
      {
        filename: 'app.py',
        purpose: 'Flask REST API entry point with JWT Auth & Inference Endpoints',
        path: 'Backend/app.py',
      },
      {
        filename: 'vit_model.py',
        purpose: 'PyTorch Vision Transformer (ViT) Architecture',
        path: 'Backend/models/vit_model.py',
      },
    ],
  },
];

export const ApiDocsView: React.FC = () => {
  const [selectedEndpoint, setSelectedEndpoint] = useState<ApiEndpoint>(API_ENDPOINTS[1]);
  const [activeLang, setActiveLang] = useState<'curl' | 'python' | 'javascript' | 'php'>('curl');
  
  // Interactive Tester States
  const [requestBodyText, setRequestBodyText] = useState<string>(
    JSON.stringify(API_ENDPOINTS[1].defaultBodyParams || {}, null, 2)
  );
  const [queryParamsText, setQueryParamsText] = useState<string>(
    API_ENDPOINTS[1].defaultQueryParams
      ? new URLSearchParams(API_ENDPOINTS[1].defaultQueryParams).toString()
      : ''
  );
  
  const [apiKey, setApiKey] = useState<string>('ds_live_8f9a2b71e3c901458a2d1f04b9c');
  const [apiKeyCopied, setApiKeyCopied] = useState<boolean>(false);
  const [snippetCopied, setSnippetCopied] = useState<boolean>(false);
  
  // Test execution state
  const [isExecuting, setIsExecuting] = useState<boolean>(false);
  const [testResponse, setTestResponse] = useState<{
    status: number;
    statusText: string;
    timeMs: number;
    data: any;
    error?: string;
  } | null>(null);

  const handleSelectEndpoint = (ep: ApiEndpoint) => {
    setSelectedEndpoint(ep);
    setRequestBodyText(JSON.stringify(ep.defaultBodyParams || {}, null, 2));
    setQueryParamsText(
      ep.defaultQueryParams
        ? new URLSearchParams(ep.defaultQueryParams).toString()
        : ''
    );
    setTestResponse(null);
  };

  const handleGenerateNewKey = () => {
    const randomHex = Array.from({ length: 24 }, () =>
      Math.floor(Math.random() * 16).toString(16)
    ).join('');
    setApiKey(`ds_live_${randomHex}`);
  };

  const handleCopyKey = () => {
    navigator.clipboard.writeText(apiKey);
    setApiKeyCopied(true);
    setTimeout(() => setApiKeyCopied(false), 2000);
  };

  const handleExecuteRequest = async () => {
    setIsExecuting(true);
    setTestResponse(null);
    const startTime = performance.now();

    try {
      let url = selectedEndpoint.path;
      if (selectedEndpoint.method === 'GET' && queryParamsText.trim()) {
        url += `?${queryParamsText.trim()}`;
      }

      const options: RequestInit = {
        method: selectedEndpoint.method,
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${apiKey}`,
        },
      };

      if (selectedEndpoint.method === 'POST') {
        try {
          const parsed = JSON.parse(requestBodyText);
          options.body = JSON.stringify(parsed);
        } catch (e: any) {
          setIsExecuting(false);
          setTestResponse({
            status: 400,
            statusText: 'Bad Request',
            timeMs: 0,
            data: { error: 'Invalid JSON request body format.' },
            error: e.message,
          });
          return;
        }
      }

      const res = await fetch(url, options);
      const endTime = performance.now();
      const timeMs = Math.round(endTime - startTime);

      const json = await res.json();
      setTestResponse({
        status: res.status,
        statusText: res.statusText || (res.ok ? 'OK' : 'Error'),
        timeMs,
        data: json,
      });
    } catch (err: any) {
      const endTime = performance.now();
      setTestResponse({
        status: 500,
        statusText: 'Internal Error / Offline',
        timeMs: Math.round(endTime - startTime),
        data: { error: err.message || 'Failed to reach backend API endpoint.' },
        error: err.message,
      });
    } finally {
      setIsExecuting(false);
    }
  };

  const getCodeSnippet = () => {
    const fullUrl = `https://deepfake-research.api.edu${selectedEndpoint.path}${
      selectedEndpoint.method === 'GET' && queryParamsText ? `?${queryParamsText}` : ''
    }`;

    if (activeLang === 'curl') {
      if (selectedEndpoint.method === 'GET') {
        return `curl -X GET "${fullUrl}" \\
  -H "Authorization: Bearer ${apiKey}" \\
  -H "Accept: application/json"`;
      }
      return `curl -X POST "${fullUrl}" \\
  -H "Authorization: Bearer ${apiKey}" \\
  -H "Content-Type: application/json" \\
  -d '${requestBodyText.replace(/\n/g, '')}'`;
    }

    if (activeLang === 'python') {
      if (selectedEndpoint.method === 'GET') {
        return `import requests

url = "${fullUrl}"
headers = {
    "Authorization": "Bearer ${apiKey}",
    "Accept": "application/json"
}

response = requests.get(url, headers=headers)
print("Status:", response.status_code)
print(response.json())`;
      }
      return `import requests

url = "${fullUrl}"
headers = {
    "Authorization": "Bearer ${apiKey}",
    "Content-Type": "application/json"
}
payload = ${requestBodyText}

response = requests.post(url, headers=headers, json=payload)
print("Status:", response.status_code)
print(response.json())`;
    }

    if (activeLang === 'javascript') {
      if (selectedEndpoint.method === 'GET') {
        return `const response = await fetch("${fullUrl}", {
  method: "GET",
  headers: {
    "Authorization": "Bearer ${apiKey}",
    "Accept": "application/json"
  }
});

const data = await response.json();
console.log(data);`;
      }
      return `const response = await fetch("${fullUrl}", {
  method: "POST",
  headers: {
    "Authorization": "Bearer ${apiKey}",
    "Content-Type": "application/json"
  },
  body: JSON.stringify(${requestBodyText.replace(/\n\s*/g, ' ')})
});

const data = await response.json();
console.log(data);`;
    }

    if (activeLang === 'php') {
      return `<?php
$ch = curl_init("${fullUrl}");
curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
curl_setopt($ch, CURLOPT_HTTPHEADER, [
    "Authorization: Bearer ${apiKey}",
    "Content-Type: application/json"
]);
${selectedEndpoint.method === 'POST' ? `curl_setopt($ch, CURLOPT_POST, true);\ncurl_setopt($ch, CURLOPT_POSTFIELDS, '${requestBodyText.replace(/\n/g, '')}');` : ''}

$response = curl_exec($ch);
curl_close($ch);
echo $response;
?>`;
    }

    return '';
  };

  const handleCopySnippet = () => {
    navigator.clipboard.writeText(getCodeSnippet());
    setSnippetCopied(true);
    setTimeout(() => setSnippetCopied(false), 2000);
  };

  const handleDownloadOpenApiSpec = () => {
    const spec = {
      openapi: '3.0.3',
      info: {
        title: 'DeepSentinel AI - Deepfake Detection REST API',
        version: '1.0.0-research',
        description: 'Forensic REST API for Deepfake Image & Video Analysis using CNN, ResNet50, and Vision Transformers with Grad-CAM XAI.',
      },
      servers: [
        { url: 'http://localhost:3000/api', description: 'Local Cloud Run Runtime' },
        { url: 'https://api.deepfake-sentinel.edu/v1', description: 'Production Forensic Cluster' },
      ],
      paths: {
        '/health': {
          get: {
            summary: 'System Health Check',
            responses: { '200': { description: 'System healthy' } },
          },
        },
        '/detect': {
          post: {
            summary: 'Run Deepfake Analysis',
            requestBody: {
              content: {
                'application/json': {
                  schema: {
                    type: 'object',
                    properties: {
                      fileName: { type: 'string' },
                      mediaType: { type: 'string', enum: ['image', 'video'] },
                      modelUsed: { type: 'string', enum: ['cnn', 'resnet50', 'vit'] },
                      datasetContext: { type: 'string' },
                    },
                  },
                },
              },
            },
            responses: { '200': { description: 'Inference completed successfully' } },
          },
        },
      },
    };

    const blob = new Blob([JSON.stringify(spec, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'deepsentinel-openapi-v1.json';
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-8 animate-fadeIn">
      {/* Top Banner & Header */}
      <div className="bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 dark:from-slate-900 dark:via-slate-900 dark:to-slate-950 p-6 sm:p-8 rounded-3xl border border-indigo-900/50 text-white shadow-xl relative overflow-hidden">
        <div className="absolute top-0 right-0 p-8 opacity-10 pointer-events-none">
          <Terminal className="w-64 h-64 text-indigo-400" />
        </div>

        <div className="relative z-10 max-w-4xl space-y-4">
          <div className="flex flex-wrap items-center gap-3">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-indigo-500/20 text-indigo-300 border border-indigo-500/30">
              <Globe className="w-3.5 h-3.5 text-indigo-400" /> REST API v1.0.0
            </span>
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" /> API Operational (200 OK)
            </span>
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-purple-500/20 text-purple-300 border border-purple-500/30">
              <Zap className="w-3.5 h-3.5 text-purple-400" /> Live Interactive Sandbox
            </span>
          </div>

          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
            Deepfake Forensic Detection REST API Explorer
          </h1>

          <p className="text-sm text-slate-300 leading-relaxed max-w-3xl">
            Integrate deepfake detection capabilities directly into digital forensics workflows, automated media verification pipelines, or security audit scripts. Test live endpoints, generate authentication tokens, and download OpenAPI 3.0 specs.
          </p>

          <div className="pt-2 flex flex-wrap items-center gap-3">
            <button
              onClick={handleDownloadOpenApiSpec}
              className="inline-flex items-center gap-2 px-4 py-2 text-xs font-bold rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white shadow-lg shadow-indigo-600/30 transition-all"
            >
              <Download className="w-4 h-4" /> Download OpenAPI 3.0 Spec
            </button>
            <div className="text-xs text-slate-400 font-mono bg-slate-950/80 px-3.5 py-2 rounded-xl border border-slate-800 flex items-center gap-2">
              <Server className="w-3.5 h-3.5 text-indigo-400" /> Base URL: <span className="text-indigo-300">/api</span>
            </div>
          </div>
        </div>
      </div>

      {/* API Key Management Box */}
      <div className="bg-white dark:bg-slate-900 rounded-2xl p-6 border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/20">
              <Key className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-slate-900 dark:text-white">Developer API Key</h3>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Include this key in the <code className="text-indigo-600 dark:text-indigo-400">Authorization: Bearer &lt;KEY&gt;</code> header for protected routes.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleGenerateNewKey}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-lg bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700 transition-colors"
            >
              <RefreshCw className="w-3.5 h-3.5" /> Generate Token
            </button>
            <button
              onClick={handleCopyKey}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white shadow-sm transition-colors"
            >
              {apiKeyCopied ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
              {apiKeyCopied ? 'Copied' : 'Copy Key'}
            </button>
          </div>
        </div>

        <div className="bg-slate-950 p-3 rounded-xl border border-slate-800 font-mono text-xs text-emerald-400 flex items-center justify-between overflow-x-auto">
          <span>{apiKey}</span>
          <span className="text-[10px] text-slate-500 font-sans">Active • 10,000 req/day quota</span>
        </div>
      </div>

      {/* Main Grid: Endpoints Navigation (Left) + Interactive Sandbox & Snippets (Right) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: List of API Endpoints */}
        <div className="lg:col-span-4 space-y-3">
          <h3 className="text-sm font-bold text-slate-900 dark:text-white flex items-center justify-between">
            <span>API Endpoints ({API_ENDPOINTS.length})</span>
            <span className="text-xs text-indigo-600 dark:text-indigo-400 font-normal">Select to test</span>
          </h3>

          <div className="space-y-2">
            {API_ENDPOINTS.map((ep) => {
              const isSelected = selectedEndpoint.id === ep.id;
              return (
                <button
                  key={ep.id}
                  onClick={() => handleSelectEndpoint(ep)}
                  className={`w-full text-left p-3.5 rounded-xl border transition-all flex flex-col gap-1.5 ${
                    isSelected
                      ? 'bg-indigo-50/80 dark:bg-indigo-950/60 border-indigo-300 dark:border-indigo-800 shadow-sm'
                      : 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800/50'
                  }`}
                >
                  <div className="flex items-center justify-between gap-2">
                    <span
                      className={`px-2 py-0.5 rounded text-[10px] font-black uppercase tracking-wider ${
                        ep.method === 'GET'
                          ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300'
                          : ep.method === 'POST'
                          ? 'bg-indigo-100 text-indigo-800 dark:bg-indigo-950 dark:text-indigo-300'
                          : 'bg-rose-100 text-rose-800 dark:bg-rose-950 dark:text-rose-300'
                      }`}
                    >
                      {ep.method}
                    </span>
                    <span className="font-mono text-xs font-semibold text-slate-800 dark:text-slate-200 truncate">
                      {ep.path}
                    </span>
                  </div>

                  <span className="text-xs font-bold text-slate-900 dark:text-white leading-snug">
                    {ep.title}
                  </span>

                  <p className="text-[11px] text-slate-500 dark:text-slate-400 line-clamp-2">
                    {ep.description}
                  </p>
                </button>
              );
            })}
          </div>
        </div>

        {/* Right Column: Endpoint Sandbox & Live Code Execution */}
        <div className="lg:col-span-8 space-y-6">
          {/* Selected Endpoint Card */}
          <div className="bg-white dark:bg-slate-900 rounded-2xl p-6 border border-slate-200 dark:border-slate-800 shadow-sm space-y-5">
            <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-200 dark:border-slate-800 pb-4">
              <div className="flex items-center gap-3">
                <span
                  className={`px-3 py-1 rounded-lg text-xs font-extrabold ${
                    selectedEndpoint.method === 'GET'
                      ? 'bg-emerald-500 text-white'
                      : selectedEndpoint.method === 'POST'
                      ? 'bg-indigo-600 text-white'
                      : 'bg-rose-600 text-white'
                  }`}
                >
                  {selectedEndpoint.method}
                </span>
                <span className="font-mono font-bold text-base text-slate-900 dark:text-white">
                  {selectedEndpoint.path}
                </span>
              </div>

              {selectedEndpoint.requiresAuth ? (
                <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-bold bg-amber-100 text-amber-800 dark:bg-amber-950/80 dark:text-amber-300 border border-amber-300 dark:border-amber-800">
                  <Key className="w-3 h-3" /> Auth Required
                </span>
              ) : (
                <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-bold bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300 border border-slate-200 dark:border-slate-700">
                  Public Endpoint
                </span>
              )}
            </div>

            <div>
              <h3 className="text-base font-bold text-slate-900 dark:text-white mb-1">
                {selectedEndpoint.title}
              </h3>
              <p className="text-xs text-slate-600 dark:text-slate-300">
                {selectedEndpoint.description}
              </p>
            </div>

            {/* Request Parameters Section */}
            {selectedEndpoint.method === 'GET' && selectedEndpoint.defaultQueryParams && (
              <div className="space-y-2">
                <label className="text-xs font-bold text-slate-700 dark:text-slate-300">
                  Query Parameters (e.g. key1=val1&key2=val2):
                </label>
                <input
                  type="text"
                  value={queryParamsText}
                  onChange={(e) => setQueryParamsText(e.target.value)}
                  className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl px-3.5 py-2 font-mono text-xs text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>
            )}

            {selectedEndpoint.method === 'POST' && (
              <div className="space-y-2">
                <label className="text-xs font-bold text-slate-700 dark:text-slate-300 flex items-center justify-between">
                  <span>JSON Request Body:</span>
                  <span className="text-[10px] text-slate-400 font-mono">application/json</span>
                </label>
                <textarea
                  value={requestBodyText}
                  onChange={(e) => setRequestBodyText(e.target.value)}
                  rows={6}
                  className="w-full bg-slate-950 text-emerald-400 font-mono text-xs p-3.5 rounded-xl border border-slate-800 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>
            )}

            {/* Execute Request Button */}
            <div className="pt-2 flex items-center justify-between">
              <button
                onClick={handleExecuteRequest}
                disabled={isExecuting}
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs shadow-md shadow-indigo-500/20 disabled:opacity-50 transition-all cursor-pointer"
              >
                {isExecuting ? (
                  <RefreshCw className="w-4 h-4 animate-spin" />
                ) : (
                  <Send className="w-4 h-4" />
                )}
                {isExecuting ? 'Executing Request...' : 'Send API Request'}
              </button>

              <span className="text-[11px] text-slate-400 italic">
                Executes live request against runtime Express backend
              </span>
            </div>

            {/* Live Response Box */}
            {testResponse && (
              <div className="pt-4 border-t border-slate-200 dark:border-slate-800 space-y-3 animate-fadeIn">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-slate-900 dark:text-white">
                    Response Output
                  </span>
                  <div className="flex items-center gap-2">
                    <span
                      className={`px-2.5 py-0.5 rounded-full text-[11px] font-black ${
                        testResponse.status < 300
                          ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300'
                          : 'bg-rose-100 text-rose-800 dark:bg-rose-950 dark:text-rose-300'
                      }`}
                    >
                      {testResponse.status} {testResponse.statusText}
                    </span>
                    <span className="text-xs text-slate-500 dark:text-slate-400 flex items-center gap-1 font-mono">
                      <Clock className="w-3.5 h-3.5" /> {testResponse.timeMs} ms
                    </span>
                  </div>
                </div>

                <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 font-mono text-xs text-indigo-300 max-h-80 overflow-y-auto">
                  <pre>{JSON.stringify(testResponse.data, null, 2)}</pre>
                </div>
              </div>
            )}
          </div>

          {/* Multi-Language Code Snippet Generator */}
          <div className="bg-white dark:bg-slate-900 rounded-2xl p-6 border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
            <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-200 dark:border-slate-800 pb-3">
              <h3 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
                <Code2 className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />
                Integration Code Snippet Generator
              </h3>

              {/* Language Switcher */}
              <div className="flex items-center gap-1 bg-slate-100 dark:bg-slate-800 p-1 rounded-xl">
                {(['curl', 'python', 'javascript', 'php'] as const).map((lang) => (
                  <button
                    key={lang}
                    onClick={() => setActiveLang(lang)}
                    className={`px-3 py-1 rounded-lg text-xs font-bold capitalize transition-all ${
                      activeLang === lang
                        ? 'bg-indigo-600 text-white shadow-sm'
                        : 'text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white'
                    }`}
                  >
                    {lang === 'javascript' ? 'Node / JS' : lang}
                  </button>
                ))}
              </div>
            </div>

            <div className="relative">
              <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 font-mono text-xs text-slate-200 overflow-x-auto">
                <pre>{getCodeSnippet()}</pre>
              </div>

              <button
                onClick={handleCopySnippet}
                className="absolute top-3 right-3 p-2 rounded-lg bg-slate-800/80 hover:bg-slate-700 text-slate-200 border border-slate-700 transition-colors"
                title="Copy Code Snippet"
              >
                {snippetCopied ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
