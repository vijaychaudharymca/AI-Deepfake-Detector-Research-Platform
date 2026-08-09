import React, { useState } from 'react';
import { ModelType, DatasetName, MediaType, DetectionResult } from '../types';
import { GradCamViewer } from './GradCamViewer';
import { Upload, FileVideo, Image as ImageIcon, Play, Cpu, CheckCircle2, AlertTriangle, Sparkles, Download, Mail, RefreshCw, Layers, ShieldCheck } from 'lucide-react';

interface DetectorViewProps {
  onDetectionComplete: (result: DetectionResult) => void;
  onOpenReportModal: (result: DetectionResult) => void;
  onOpenEmailModal: (result: DetectionResult) => void;
}

const SAMPLE_MEDIA = [
  {
    name: 'actor_interview_manipulated.mp4',
    type: 'video' as MediaType,
    url: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=800&auto=format&fit=crop&q=80',
    size: '14.2 MB',
    desc: 'DeepFaceLab neural face swap sequence with lip sync drift.',
  },
  {
    name: 'news_anchor_live_feed.png',
    type: 'image' as MediaType,
    url: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=800&auto=format&fit=crop&q=80',
    size: '2.8 MB',
    desc: 'Authentic high-resolution studio broadcasting portrait.',
  },
  {
    name: 'politician_statement_fake.mp4',
    type: 'video' as MediaType,
    url: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=800&auto=format&fit=crop&q=80',
    size: '28.5 MB',
    desc: 'Celeb-DF high-fidelity facial reenactment synthesis.',
  },
];

export const DetectorView: React.FC<DetectorViewProps> = ({
  onDetectionComplete,
  onOpenReportModal,
  onOpenEmailModal,
}) => {
  const [selectedFile, setSelectedFile] = useState<{
    name: string;
    type: MediaType;
    url: string;
    size: string;
  } | null>(SAMPLE_MEDIA[0]);

  const [selectedModel, setSelectedModel] = useState<ModelType>('vit');
  const [selectedDataset, setSelectedDataset] = useState<DatasetName>('FaceForensics++');
  const [isAnalyzing, setIsAnalyzing] = useState<boolean>(false);
  const [analysisStep, setAnalysisStep] = useState<string>('');
  const [progressPercent, setProgressPercent] = useState<number>(0);
  const [activeResult, setActiveResult] = useState<DetectionResult | null>(null);
  const [dragActive, setDragActive] = useState<boolean>(false);

  // Custom File Upload Handler
  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      const isVideo = file.type.startsWith('video/') || file.name.endsWith('.mp4') || file.name.endsWith('.avi');
      const url = URL.createObjectURL(file);
      const sizeMB = (file.size / (1024 * 1024)).toFixed(1) + ' MB';

      setSelectedFile({
        name: file.name,
        type: isVideo ? 'video' : 'image',
        url,
        size: sizeMB,
      });
      setActiveResult(null);
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setDragActive(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setDragActive(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      const file = e.dataTransfer.files[0];
      const isVideo = file.type.startsWith('video/') || file.name.endsWith('.mp4') || file.name.endsWith('.avi');
      const url = URL.createObjectURL(file);
      const sizeMB = (file.size / (1024 * 1024)).toFixed(1) + ' MB';

      setSelectedFile({
        name: file.name,
        type: isVideo ? 'video' : 'image',
        url,
        size: sizeMB,
      });
      setActiveResult(null);
    }
  };

  // Run AI Detection Pipeline
  const runDetection = async () => {
    if (!selectedFile) return;

    setIsAnalyzing(true);
    setActiveResult(null);
    setProgressPercent(10);
    setAnalysisStep('Stage 1: Initializing PyTorch Tensor Pipeline & Frame Extraction...');

    try {
      await new Promise((r) => setTimeout(r, 400));
      setProgressPercent(35);
      setAnalysisStep('Stage 2: OpenCV Face Extraction & High-Frequency Noise Residual Map...');

      await new Promise((r) => setTimeout(r, 400));
      setProgressPercent(65);
      setAnalysisStep(`Stage 3: Executing ${selectedModel.toUpperCase()} Deep Learning Model Evaluation...`);

      await new Promise((r) => setTimeout(r, 400));
      setProgressPercent(85);
      setAnalysisStep('Stage 4: Generating Grad-CAM Heatmap & Synthesizing Gemini XAI Analysis...');

      const response = await fetch('/api/detect', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          fileName: selectedFile.name,
          mediaType: selectedFile.type,
          fileSize: selectedFile.size,
          previewUrl: selectedFile.url,
          modelUsed: selectedModel,
          datasetContext: selectedDataset,
          userEmail: 'researcher@mca.edu',
        }),
      });

      const data: DetectionResult = await response.json();

      await new Promise((r) => setTimeout(r, 300));
      setProgressPercent(100);

      setActiveResult(data);
      onDetectionComplete(data);
    } catch (err) {
      console.error('Detection execution failed:', err);
    } finally {
      setIsAnalyzing(false);
    }
  };

  return (
    <div className="space-y-8">
      {/* Upper Grid: Upload & Controls | Model & Dataset Selectors */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left Column (7 cols): File Upload & Preview */}
        <div className="lg:col-span-7 bg-white dark:bg-slate-900 rounded-3xl p-6 border border-slate-200 dark:border-slate-800 shadow-xl space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <Upload className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />
              Upload Image or Video Media
            </h2>
            <span className="text-xs text-slate-500 dark:text-slate-400">
              Supported: JPG, PNG, MP4, AVI, MOV (Max 50MB)
            </span>
          </div>

          {/* Upload Drop Zone */}
          <div
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
            className={`relative rounded-2xl border-2 border-dashed p-6 text-center transition-all ${
              dragActive
                ? 'border-indigo-500 bg-indigo-50/50 dark:bg-indigo-950/40'
                : 'border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/40 hover:border-indigo-400'
            }`}
          >
            <input
              type="file"
              accept="image/png, image/jpeg, image/jpg, video/mp4, video/avi, video/quicktime"
              onChange={handleFileUpload}
              className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
            />

            {selectedFile ? (
              <div className="space-y-3">
                <div className="relative mx-auto max-w-sm rounded-xl overflow-hidden border border-slate-300 dark:border-slate-700 shadow-md aspect-video bg-black flex items-center justify-center">
                  <img src={selectedFile.url} alt="Media Preview" className="w-full h-full object-cover" />
                  <span className="absolute top-2 left-2 bg-slate-900/90 text-white text-[10px] font-bold px-2 py-0.5 rounded-md uppercase">
                    {selectedFile.type}
                  </span>
                </div>

                <div>
                  <div className="text-sm font-bold text-slate-900 dark:text-white truncate max-w-xs mx-auto">
                    {selectedFile.name}
                  </div>
                  <div className="text-xs text-slate-500 dark:text-slate-400">
                    Size: {selectedFile.size}
                  </div>
                </div>

                <div className="text-xs text-indigo-600 dark:text-indigo-400 font-medium">
                  Click or drag another file to replace
                </div>
              </div>
            ) : (
              <div className="py-6 space-y-3">
                <div className="w-12 h-12 rounded-2xl bg-indigo-100 dark:bg-indigo-950 text-indigo-600 dark:text-indigo-400 flex items-center justify-center mx-auto">
                  <Upload className="w-6 h-6" />
                </div>
                <div>
                  <p className="text-sm font-semibold text-slate-800 dark:text-slate-200">
                    Drag and drop your media file here, or <span className="text-indigo-600 dark:text-indigo-400 underline">browse</span>
                  </p>
                  <p className="text-xs text-slate-400 mt-1">Automatic face extraction & frame sampling applied</p>
                </div>
              </div>
            )}
          </div>

          {/* Quick Preset Sample Selection */}
          <div>
            <span className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider block mb-2">
              Or Choose Sample Test Files:
            </span>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
              {SAMPLE_MEDIA.map((sample, idx) => (
                <button
                  key={idx}
                  onClick={() => {
                    setSelectedFile(sample);
                    setActiveResult(null);
                  }}
                  className={`p-2.5 rounded-xl text-left border text-xs transition-all ${
                    selectedFile?.name === sample.name
                      ? 'border-indigo-500 bg-indigo-50 dark:bg-indigo-950/60 font-semibold text-indigo-900 dark:text-indigo-200 ring-1 ring-indigo-500'
                      : 'border-slate-200 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800/50 text-slate-700 dark:text-slate-300'
                  }`}
                >
                  <div className="flex items-center gap-1.5 font-bold truncate">
                    {sample.type === 'video' ? <FileVideo className="w-3.5 h-3.5 text-purple-500" /> : <ImageIcon className="w-3.5 h-3.5 text-blue-500" />}
                    <span className="truncate">{sample.name}</span>
                  </div>
                  <div className="text-[10px] text-slate-400 mt-1 line-clamp-1">{sample.desc}</div>
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Right Column (5 cols): Model Selection & Execution Panel */}
        <div className="lg:col-span-5 bg-white dark:bg-slate-900 rounded-3xl p-6 border border-slate-200 dark:border-slate-800 shadow-xl flex flex-col justify-between space-y-6">
          <div>
            <h3 className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2 mb-4">
              <Cpu className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />
              AI Model & Dataset Configuration
            </h3>

            {/* AI Model Selector */}
            <div className="space-y-3 mb-6">
              <label className="text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider block">
                Select Deep Learning Model:
              </label>

              <div className="space-y-2">
                <button
                  onClick={() => setSelectedModel('vit')}
                  className={`w-full p-3.5 rounded-2xl border text-left flex items-start justify-between transition-all ${
                    selectedModel === 'vit'
                      ? 'border-indigo-500 bg-indigo-50/80 dark:bg-indigo-950/60 ring-2 ring-indigo-500/30'
                      : 'border-slate-200 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800/40'
                  }`}
                >
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-sm text-slate-900 dark:text-white">Vision Transformer (ViT-Base/16)</span>
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-indigo-600 text-white">Recommended</span>
                    </div>
                    <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                      Self-attention patch modeling for subtle frequency artifacts. Accuracy: <strong>97.6%</strong>
                    </p>
                  </div>
                </button>

                <button
                  onClick={() => setSelectedModel('resnet50')}
                  className={`w-full p-3.5 rounded-2xl border text-left flex items-start justify-between transition-all ${
                    selectedModel === 'resnet50'
                      ? 'border-indigo-500 bg-indigo-50/80 dark:bg-indigo-950/60 ring-2 ring-indigo-500/30'
                      : 'border-slate-200 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800/40'
                  }`}
                >
                  <div>
                    <div className="font-bold text-sm text-slate-900 dark:text-white">ResNet50 Transfer Learning</div>
                    <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                      Deep residual identity mappings fine-tuned on Celeb-DF. Accuracy: <strong>94.2%</strong>
                    </p>
                  </div>
                </button>

                <button
                  onClick={() => setSelectedModel('cnn')}
                  className={`w-full p-3.5 rounded-2xl border text-left flex items-start justify-between transition-all ${
                    selectedModel === 'cnn'
                      ? 'border-indigo-500 bg-indigo-50/80 dark:bg-indigo-950/60 ring-2 ring-indigo-500/30'
                      : 'border-slate-200 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800/40'
                  }`}
                >
                  <div>
                    <div className="font-bold text-sm text-slate-900 dark:text-white">Custom 6-Layer CNN</div>
                    <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                      Lightweight spatial convolution baseline network. Accuracy: <strong>88.4%</strong>
                    </p>
                  </div>
                </button>
              </div>
            </div>

            {/* Dataset Context Selector */}
            <div className="space-y-2">
              <label className="text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider block">
                Target Benchmark Dataset Context:
              </label>
              <select
                value={selectedDataset}
                onChange={(e) => setSelectedDataset(e.target.value as DatasetName)}
                className="w-full p-3 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white text-sm font-medium focus:ring-2 focus:ring-indigo-500 outline-none"
              >
                <option value="FaceForensics++">FaceForensics++ (5,000 Samples)</option>
                <option value="Celeb-DF">Celeb-DF v2 (5,639 Samples)</option>
                <option value="DFDC">DeepFake Detection Challenge (10,000 Samples)</option>
              </select>
            </div>
          </div>

          {/* Execution Action Button & Progress */}
          <div className="space-y-4">
            {isAnalyzing && (
              <div className="space-y-2 bg-slate-50 dark:bg-slate-800/60 p-4 rounded-2xl border border-slate-200 dark:border-slate-700">
                <div className="flex justify-between text-xs font-semibold text-indigo-600 dark:text-indigo-400">
                  <span>{analysisStep}</span>
                  <span>{progressPercent}%</span>
                </div>
                <div className="w-full bg-slate-200 dark:bg-slate-700 h-2.5 rounded-full overflow-hidden">
                  <div
                    style={{ width: `${progressPercent}%` }}
                    className="bg-gradient-to-r from-indigo-500 to-purple-500 h-full transition-all duration-300"
                  />
                </div>
              </div>
            )}

            <button
              onClick={runDetection}
              disabled={isAnalyzing || !selectedFile}
              className={`w-full py-4 rounded-2xl text-base font-extrabold text-white flex items-center justify-center gap-2 shadow-lg transition-all ${
                isAnalyzing || !selectedFile
                  ? 'bg-slate-400 cursor-not-allowed'
                  : 'bg-indigo-600 hover:bg-indigo-700 shadow-indigo-500/25 active:scale-[0.99]'
              }`}
            >
              {isAnalyzing ? (
                <>
                  <RefreshCw className="w-5 h-5 animate-spin" />
                  Running Neural Network Analysis...
                </>
              ) : (
                <>
                  <Play className="w-5 h-5 fill-current" />
                  Detect Deepfake Manipulation
                </>
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Lower Section: Result Presentation, Grad-CAM & Explainable AI */}
      {activeResult && (
        <div className="space-y-8 animate-fadeIn">
          {/* Main Prediction Status Banner */}
          <div
            className={`p-6 sm:p-8 rounded-3xl border shadow-2xl flex flex-col md:flex-row items-center justify-between gap-6 ${
              activeResult.prediction === 'DEEPFAKE'
                ? 'bg-gradient-to-r from-red-950 via-slate-900 to-red-950 border-red-800 text-white'
                : 'bg-gradient-to-r from-emerald-950 via-slate-900 to-emerald-950 border-emerald-800 text-white'
            }`}
          >
            <div className="flex items-center gap-5">
              <div
                className={`p-4 rounded-2xl border ${
                  activeResult.prediction === 'DEEPFAKE'
                    ? 'bg-red-500/20 border-red-500/40 text-red-400'
                    : 'bg-emerald-500/20 border-emerald-500/40 text-emerald-400'
                }`}
              >
                {activeResult.prediction === 'DEEPFAKE' ? (
                  <AlertTriangle className="w-10 h-10 animate-pulse" />
                ) : (
                  <ShieldCheck className="w-10 h-10" />
                )}
              </div>

              <div>
                <div className="flex items-center gap-2">
                  <span
                    className={`text-xs font-black uppercase tracking-wider px-3 py-1 rounded-full border ${
                      activeResult.prediction === 'DEEPFAKE'
                        ? 'bg-red-500/30 text-red-200 border-red-500/40'
                        : 'bg-emerald-500/30 text-emerald-200 border-emerald-500/40'
                    }`}
                  >
                    Classification Result
                  </span>
                  <span className="text-xs text-slate-400">Processed in {activeResult.processingTimeMs} ms</span>
                </div>

                <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight mt-1">
                  MEDIA IS {activeResult.prediction}
                </h2>
                <p className="text-xs sm:text-sm text-slate-300 mt-1">
                  Model: <strong className="text-indigo-300">{activeResult.modelUsed.toUpperCase()}</strong> | Dataset:{' '}
                  <strong className="text-indigo-300">{activeResult.datasetContext}</strong>
                </p>
              </div>
            </div>

            {/* Confidence Score Gauge */}
            <div className="flex items-center gap-4 bg-slate-900/80 p-4 rounded-2xl border border-slate-700/80">
              <div className="text-right">
                <div className="text-xs text-slate-400 uppercase font-bold">Confidence Score</div>
                <div className="text-3xl font-extrabold font-mono text-white">
                  {activeResult.confidence}%
                </div>
              </div>

              <div className="w-16 h-16 rounded-full border-4 border-indigo-500 flex items-center justify-center font-bold text-xs bg-indigo-950/50">
                {activeResult.confidence}%
              </div>
            </div>
          </div>

          {/* Explainable AI (XAI) Gemini Report Section */}
          <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 sm:p-8 border border-slate-200 dark:border-slate-800 shadow-xl space-y-6">
            <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-800 pb-4">
              <div className="flex items-center gap-3">
                <div className="p-2.5 rounded-xl bg-purple-100 dark:bg-purple-950/80 text-purple-600 dark:text-purple-400">
                  <Sparkles className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-slate-900 dark:text-white">
                    Explainable AI (XAI) Forensic Analysis Report
                  </h3>
                  <p className="text-xs text-slate-500 dark:text-slate-400">
                    Natural language deep learning feature breakdown powered by Gemini 3.6 Flash
                  </p>
                </div>
              </div>

              {/* Action Buttons: PDF & Email */}
              <div className="flex items-center gap-2">
                <button
                  onClick={() => onOpenReportModal(activeResult)}
                  className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-bold bg-indigo-600 hover:bg-indigo-700 text-white shadow-md transition-all"
                >
                  <Download className="w-4 h-4" /> Download PDF Report
                </button>
                <button
                  onClick={() => onOpenEmailModal(activeResult)}
                  className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-bold bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-200 border border-slate-200 dark:border-slate-700 transition-all"
                >
                  <Mail className="w-4 h-4 text-purple-500" /> Email Report
                </button>
              </div>
            </div>

            {/* Summary Box */}
            <div className="bg-indigo-50/50 dark:bg-indigo-950/40 p-4 rounded-2xl border border-indigo-100 dark:border-indigo-900/60 text-sm text-indigo-950 dark:text-indigo-200 leading-relaxed font-medium">
              <strong>Executive Summary:</strong> {activeResult.xaiExplanation.summary}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Key Features Detected */}
              <div className="bg-slate-50 dark:bg-slate-800/50 p-5 rounded-2xl border border-slate-200 dark:border-slate-700/60 space-y-3">
                <h4 className="text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-indigo-500" /> Key Anomaly Indicators:
                </h4>
                <ul className="space-y-2">
                  {activeResult.xaiExplanation.keyFeatures.map((feat, i) => (
                    <li key={i} className="text-xs text-slate-600 dark:text-slate-300 flex items-start gap-2">
                      <span className="w-1.5 h-1.5 rounded-full bg-indigo-500 mt-1.5 shrink-0" />
                      <span>{feat}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Technical Analysis */}
              <div className="bg-slate-50 dark:bg-slate-800/50 p-5 rounded-2xl border border-slate-200 dark:border-slate-700/60 space-y-3">
                <h4 className="text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 flex items-center gap-2">
                  <Layers className="w-4 h-4 text-purple-500" /> Technical Layer Attribution:
                </h4>
                <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
                  {activeResult.xaiExplanation.technicalAnalysis}
                </p>
              </div>
            </div>
          </div>

          {/* Grad-CAM Heatmap Viewer Component */}
          <GradCamViewer
            previewUrl={activeResult.previewUrl}
            heatmap={activeResult.heatmap}
            prediction={activeResult.prediction}
            confidence={activeResult.confidence}
          />
        </div>
      )}
    </div>
  );
};
