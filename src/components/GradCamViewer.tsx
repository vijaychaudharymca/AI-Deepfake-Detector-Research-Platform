import React, { useState } from 'react';
import { HeatmapData, PredictionLabel } from '../types';
import { Eye, Flame, Sliders, Layers, Sparkles, AlertTriangle } from 'lucide-react';

interface GradCamViewerProps {
  previewUrl: string;
  heatmap: HeatmapData;
  prediction: PredictionLabel;
  confidence: number;
}

export const GradCamViewer: React.FC<GradCamViewerProps> = ({
  previewUrl,
  heatmap,
  prediction,
  confidence,
}) => {
  const [viewMode, setViewMode] = useState<'blended' | 'split' | 'heatmapOnly'>('blended');
  const [heatmapOpacity, setHeatmapOpacity] = useState<number>(0.75);
  const [activeHotspot, setActiveHotspot] = useState<number | null>(null);

  const isDeepfake = prediction === 'DEEPFAKE';

  return (
    <div className="bg-slate-900 text-white rounded-3xl p-6 border border-slate-800 shadow-xl">
      <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
        <div>
          <div className="flex items-center gap-2">
            <Flame className="w-5 h-5 text-amber-500 animate-pulse" />
            <h3 className="text-lg font-bold text-white">Grad-CAM Visual Attribution & Artifact Heatmap</h3>
          </div>
          <p className="text-xs text-slate-400 mt-0.5">
            Gradient-weighted Class Activation Mapping highlighting deep learning visual anomaly locations
          </p>
        </div>

        {/* View Controls */}
        <div className="flex items-center gap-2 bg-slate-800/80 p-1 rounded-xl border border-slate-700">
          <button
            onClick={() => setViewMode('blended')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
              viewMode === 'blended'
                ? 'bg-indigo-600 text-white shadow-sm'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            Heatmap Overlay
          </button>
          <button
            onClick={() => setViewMode('split')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
              viewMode === 'split'
                ? 'bg-indigo-600 text-white shadow-sm'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            Side-by-Side
          </button>
        </div>
      </div>

      {/* Main Canvas / Image Render Area */}
      {viewMode === 'split' ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
          {/* Original Image */}
          <div className="relative rounded-2xl overflow-hidden bg-slate-950 border border-slate-800 aspect-square sm:aspect-video flex items-center justify-center">
            <img src={previewUrl} alt="Original Media" className="w-full h-full object-cover" />
            <span className="absolute top-3 left-3 bg-slate-900/90 text-slate-300 text-xs font-medium px-2.5 py-1 rounded-lg border border-slate-700">
              Original Frame
            </span>
          </div>

          {/* Heatmap Marked Frame */}
          <div className="relative rounded-2xl overflow-hidden bg-slate-950 border border-slate-800 aspect-square sm:aspect-video flex items-center justify-center">
            <img src={previewUrl} alt="GradCAM Frame" className="w-full h-full object-cover" />

            {/* Simulated GradCAM Heatmap Overlay Canvas */}
            <div className="absolute inset-0 bg-gradient-to-tr from-indigo-900/30 via-red-600/40 to-amber-500/30 mix-blend-color-dodge pointer-events-none" />

            {heatmap.hotspots.map((spot, idx) => (
              <div
                key={idx}
                style={{
                  top: `${spot.y}%`,
                  left: `${spot.x}%`,
                  width: `${spot.radius * 2.5}px`,
                  height: `${spot.radius * 2.5}px`,
                  transform: 'translate(-50%, -50%)',
                }}
                className={`absolute rounded-full border-2 border-red-500/80 bg-red-500/40 animate-ping pointer-events-none`}
              />
            ))}

            <span className="absolute top-3 left-3 bg-red-950/90 text-red-300 text-xs font-medium px-2.5 py-1 rounded-lg border border-red-800 flex items-center gap-1.5">
              <Flame className="w-3.5 h-3.5 text-amber-400" /> Manipulated Region Hotspots
            </span>
          </div>
        </div>
      ) : (
        /* Blended Interactive Overlay Mode */
        <div className="relative rounded-2xl overflow-hidden bg-slate-950 border border-slate-800 aspect-square sm:aspect-video flex items-center justify-center mb-6">
          <img src={previewUrl} alt="Analyzed Media" className="w-full h-full object-cover" />

          {/* GradCAM Heatmap Gradient Layer */}
          {isDeepfake && (
            <div
              style={{ opacity: heatmapOpacity }}
              className="absolute inset-0 bg-gradient-to-tr from-indigo-900/30 via-red-600/50 to-amber-400/40 mix-blend-color-dodge transition-opacity pointer-events-none"
            />
          )}

          {/* Interactive Hotspot Targets */}
          {heatmap.hotspots.map((spot, idx) => (
            <div
              key={idx}
              onMouseEnter={() => setActiveHotspot(idx)}
              onMouseLeave={() => setActiveHotspot(null)}
              style={{
                top: `${spot.y}%`,
                left: `${spot.x}%`,
                width: `${spot.radius * 2.2}px`,
                height: `${spot.radius * 2.2}px`,
                transform: 'translate(-50%, -50%)',
              }}
              className="absolute rounded-full border-2 border-red-400 bg-red-600/30 backdrop-blur-[1px] cursor-pointer hover:scale-110 transition-transform flex items-center justify-center group"
            >
              <span className="w-3 h-3 rounded-full bg-red-500 animate-pulse" />
              <div className="absolute top-full mt-2 hidden group-hover:flex flex-col bg-slate-900 text-white text-xs p-2.5 rounded-xl border border-slate-700 w-52 shadow-2xl z-30 pointer-events-none">
                <span className="font-bold text-amber-400">{spot.label}</span>
                <span className="text-[11px] text-slate-300 mt-1">
                  Gradient Activation Intensity: {(spot.intensity * 100).toFixed(0)}%
                </span>
              </div>
            </div>
          ))}

          {/* Legend Badge */}
          <div className="absolute top-3 right-3 bg-slate-900/90 backdrop-blur-md px-3 py-1.5 rounded-xl border border-slate-700 text-xs text-slate-300 flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-500" /> Authentic
            <span className="w-2.5 h-2.5 rounded-full bg-amber-500" /> Minor Residual
            <span className="w-2.5 h-2.5 rounded-full bg-red-500" /> High Anomaly (Deepfake)
          </div>
        </div>
      )}

      {/* Opacity Slider Control */}
      <div className="flex flex-wrap items-center justify-between gap-4 bg-slate-800/60 p-4 rounded-2xl border border-slate-700/60 mb-6">
        <div className="flex items-center gap-3 w-full sm:w-auto">
          <Sliders className="w-4 h-4 text-indigo-400" />
          <span className="text-xs font-semibold text-slate-300">Heatmap Mask Opacity</span>
          <input
            type="range"
            min="0"
            max="1"
            step="0.05"
            value={heatmapOpacity}
            onChange={(e) => setHeatmapOpacity(parseFloat(e.target.value))}
            className="w-32 accent-indigo-500 cursor-pointer"
          />
          <span className="text-xs font-mono text-indigo-300">{(heatmapOpacity * 100).toFixed(0)}%</span>
        </div>

        {/* Spectral Indicators */}
        <div className="flex items-center gap-4 text-xs">
          <div>
            <span className="text-slate-400">Spectral Anomaly:</span>{' '}
            <strong className="text-amber-400 font-mono">{(heatmap.spectralAnomalyScore * 100).toFixed(1)}%</strong>
          </div>
          <div>
            <span className="text-slate-400">Facial Symmetry:</span>{' '}
            <strong className="text-emerald-400 font-mono">{(heatmap.facialSymmetryScore * 100).toFixed(1)}%</strong>
          </div>
        </div>
      </div>

      {/* Hotspots Breakdown List */}
      <div>
        <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-3 flex items-center gap-1.5">
          <AlertTriangle className="w-3.5 h-3.5 text-amber-400" /> Detected Synthetic Artifact Regions ({heatmap.hotspots.length})
        </h4>

        {heatmap.hotspots.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {heatmap.hotspots.map((spot, i) => (
              <div
                key={i}
                className="bg-slate-800/80 p-3 rounded-xl border border-slate-700 flex items-center justify-between hover:border-indigo-500 transition-colors"
              >
                <div className="flex items-center gap-2.5">
                  <div className="w-7 h-7 rounded-lg bg-red-950 text-red-400 flex items-center justify-center font-bold text-xs border border-red-800">
                    #{i + 1}
                  </div>
                  <div>
                    <div className="text-xs font-bold text-white">{spot.label}</div>
                    <div className="text-[10px] text-slate-400">
                      Coords: ({spot.x}%, {spot.y}%)
                    </div>
                  </div>
                </div>

                <div className="text-right">
                  <div className="text-xs font-mono font-bold text-amber-400">
                    {(spot.intensity * 100).toFixed(0)}%
                  </div>
                  <div className="text-[9px] text-slate-400">Gradient Weight</div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="bg-slate-800/40 p-4 rounded-xl text-center text-xs text-slate-400 border border-slate-700/50">
            No synthetic artifact regions identified. The facial imagery demonstrates uniform continuous spectral energy consistent with organic human photography.
          </div>
        )}
      </div>
    </div>
  );
};
