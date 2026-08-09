export type ModelType = 'cnn' | 'resnet50' | 'vit';
export type DatasetName = 'FaceForensics++' | 'Celeb-DF' | 'DFDC';
export type MediaType = 'image' | 'video';
export type PredictionLabel = 'REAL' | 'DEEPFAKE';
export type UserRole = 'admin' | 'researcher' | 'user';

export interface UserProfile {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  institution?: string;
  createdAt: string;
}

export interface AuthState {
  token: string | null;
  user: UserProfile | null;
  isAuthenticated: boolean;
}

export interface GradCamRegion {
  x: number; // percentage 0-100
  y: number; // percentage 0-100
  radius: number;
  intensity: number; // 0-1
  label: string; // e.g. "Orbital Blending Artifact", "Mouth Boundary Discontinuity"
}

export interface HeatmapData {
  hotspots: GradCamRegion[];
  focusMapUrl?: string;
  spectralAnomalyScore: number; // 0-1
  facialSymmetryScore: number; // 0-1
  frequencyDiscrepancy: number; // 0-1
}

export interface DetectionResult {
  id: string;
  fileName: string;
  mediaType: MediaType;
  fileSize: string;
  previewUrl: string;
  prediction: PredictionLabel;
  confidence: number; // percentage 0-100
  modelUsed: ModelType;
  datasetContext: DatasetName;
  heatmap: HeatmapData;
  xaiExplanation: {
    summary: string;
    keyFeatures: string[];
    manipulatedRegions: string[];
    technicalAnalysis: string;
  };
  processingTimeMs: number;
  timestamp: string;
  userId?: string;
  userEmail?: string;
}

export interface ModelMetrics {
  modelName: string;
  modelKey: ModelType;
  accuracy: number;
  precision: number;
  recall: number;
  f1Score: number;
  auc: number;
  trainingTimeMin: number;
  testingTimeMsPerFrame: number;
  modelSizeBytes: number;
  modelSizeFormatted: string;
  confusionMatrix: {
    truePositive: number;
    falsePositive: number;
    trueNegative: number;
    falseNegative: number;
  };
  rocCurve: Array<{ fpr: number; tpr: number }>;
}

export interface DatasetMetrics {
  datasetName: DatasetName;
  sampleCount: number;
  realCount: number;
  fakeCount: number;
  models: Record<ModelType, ModelMetrics>;
}

export interface AdminStats {
  totalDetections: number;
  totalUsers: number;
  realCount: number;
  fakeCount: number;
  avgConfidence: number;
  modelUsage: {
    cnn: number;
    resnet50: number;
    vit: number;
  };
  recentLogs: Array<{
    id: string;
    level: 'INFO' | 'WARN' | 'ERROR';
    message: string;
    timestamp: string;
  }>;
}

export interface PythonSourceFile {
  filename: string;
  path: string;
  purpose: string;
  code: string;
}
