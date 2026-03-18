
import React, { useState, useEffect } from 'react';
import { ASSETS } from '../constants';

interface AnalyzingScreenProps {
  onCancel: () => void;
  isRecording?: boolean;
}

const AnalyzingScreen: React.FC<AnalyzingScreenProps> = ({ onCancel, isRecording = false }) => {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setProgress(prev => (prev < 90 ? prev + Math.random() * 15 : prev));
    }, 400);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="relative h-full w-full flex flex-col bg-background-dark text-white overflow-hidden p-6 pt-12">
      {/* Header Info */}
      <div className="flex justify-between items-center mb-8">
        <div className="flex flex-col">
          <span className="text-xs uppercase tracking-[0.2em] text-primary/70 font-bold">Wenti Niao</span>
          <span className="text-sm text-white/50">Listening to Nature</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="material-symbols-outlined text-primary text-xl animate-pulse">graphic_eq</span>
        </div>
      </div>

      {/* Main Visualization Area */}
      <div className="flex-grow flex flex-col items-center justify-center">
        {/* Spectrogram Container */}
        <div className="relative w-full aspect-[4/3] rounded-2xl overflow-hidden bg-black/40 border border-white/5 spectrogram-mask flex items-center justify-center">
          <div
            className="absolute inset-0 w-full h-full bg-center bg-cover opacity-80 mix-blend-screen"
            style={{ backgroundImage: `url('${ASSETS.SPECTROGRAM}')` }}
          />

          {/* Dynamic Waveform Overlay */}
          <div className="absolute inset-0 flex items-center justify-around px-8 opacity-40">
            {[32, 48, 24, 56, 40, 32, 48, 64, 40, 32].map((h, i) => (
              <div key={i} className="w-1.5 bg-primary/40 rounded-full animate-pulse" style={{ height: `${h * 1.5}px` }}></div>
            ))}
          </div>

          {/* Scanning Light Beam */}
          <div className="absolute left-0 top-0 bottom-0 w-[2px] bg-primary scanning-line z-10" />

          {/* Overlay Gradients */}
          <div className="absolute inset-0 bg-gradient-to-t from-background-dark/80 via-transparent to-background-dark/80 pointer-events-none" />
        </div>

        {/* Analysis Progress */}
        <div className="w-full max-w-[320px] mt-12 flex flex-col gap-8">
          <div className="flex flex-col gap-3">
            <h3 className="text-white tracking-wide text-2xl font-bold leading-tight text-center" data-testid="analysis-status">
              AI 正在分析中...
            </h3>
          </div>

          <div className="flex flex-col gap-4">
            <div className="flex justify-between items-end">
              <div className="flex items-center gap-2">
                <span className="material-symbols-outlined text-primary text-sm">neurology</span>
                <p className="text-white/80 text-sm font-medium leading-none">特征提取</p>
              </div>
              <p className="text-primary text-sm font-bold leading-none">{Math.round(progress)}%</p>
            </div>
            <div className="rounded-full bg-white/10 h-2 overflow-hidden">
              <div
                className="h-full rounded-full bg-primary transition-all duration-300"
                style={{ width: `${progress}%` }}
              />
            </div>
          </div>
        </div>
      </div>

      {/* Footer Actions */}
      <div className="pb-12 flex flex-col items-center gap-6">
        <button
          onClick={onCancel}
          className="flex min-w-[140px] cursor-pointer items-center justify-center rounded-full h-12 px-6 bg-white/5 border border-white/10 text-white/60 text-sm font-bold hover:bg-white/10 transition-all active:scale-95"
        >
          <span className="material-symbols-outlined mr-2 text-lg">close</span>
          <span className="truncate">取消分析</span>
        </button>
        <div className="flex items-center gap-2 opacity-20">
          <span className="w-1.5 h-1.5 rounded-full bg-white animate-bounce"></span>
          <span className="w-1.5 h-1.5 rounded-full bg-white animate-bounce delay-100"></span>
          <span className="w-1.5 h-1.5 rounded-full bg-white animate-bounce delay-200"></span>
        </div>
      </div>
    </div>
  );
};

export default AnalyzingScreen;
