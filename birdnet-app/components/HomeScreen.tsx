
import React from 'react';
import { ASSETS } from '../constants';

interface HomeScreenProps {
  onStartRecording: () => void;
  onFileUpload?: (file: File) => void;
}

const HomeScreen: React.FC<HomeScreenProps> = ({ onStartRecording, onFileUpload }) => {
  const fileInputRef = React.useRef<HTMLInputElement>(null);

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file && onFileUpload) {
      onFileUpload(file);
    }
  };

  return (
    <div className="relative h-full w-full flex flex-col">
      {/* Background Image Container */}
      <div className="absolute inset-0 z-0">
        <div
          className="w-full h-full bg-cover bg-center transition-transform duration-1000 scale-105"
          style={{ backgroundImage: `url('${ASSETS.FOREST_BG}')` }}
        />
        <div className="absolute inset-0 bg-gradient-to-b from-black/20 via-transparent to-black/60 dark:to-black/80"></div>
      </div>

      {/* Content Layer */}
      <div className="relative z-10 flex flex-col h-full">
        {/* Top Navigation Bar */}
        <div className="flex items-center p-6 justify-between pt-12">
          <div className="glass-effect size-10 flex items-center justify-center rounded-full text-white cursor-pointer hover:bg-white/20 transition-all">
            <span className="material-symbols-outlined">person</span>
          </div>
          <div className="text-center">
            <h1 className="text-white text-xl font-bold tracking-widest">倾听自然</h1>
            <p className="text-white/70 text-[10px] font-light tracking-[0.2em] uppercase">Hearing Birds</p>
          </div>
          <div className="glass-effect size-10 flex items-center justify-center rounded-full text-white cursor-pointer hover:bg-white/20 transition-all">
            <span className="material-symbols-outlined">settings</span>
          </div>
        </div>

        {/* Header Section */}
        <div className="flex-1 flex flex-col items-center justify-start pt-12 px-8">
          <h2 className="text-white text-3xl font-bold tracking-tight mb-2">早安，聆听者</h2>
          <p className="text-white/80 text-base font-normal leading-relaxed text-center max-w-[280px]">
            森林里的朋友正在歌唱，点击下方按钮开始识别身边的鸟鸣。
          </p>
        </div>

        {/* Central Recording Area */}
        <div className="flex flex-col items-center justify-center mb-16">
          <div className="relative">
            {/* Outer Decorative Rings */}
            <div className="absolute inset-[-20px] rounded-full border border-primary/20 animate-pulse-slow"></div>
            <div className="absolute inset-[-40px] rounded-full border border-primary/10 animate-pulse-slow delay-700"></div>
            {/* Main Button */}
            <button
              onClick={onStartRecording}
              className="relative flex items-center justify-center size-32 bg-primary rounded-full animate-breathing group active:scale-95 transition-all shadow-xl"
            >
              <span className="material-symbols-outlined text-[#111813] !text-5xl group-hover:scale-110 transition-transform">mic</span>
            </button>
          </div>
          <p className="mt-16 text-white text-sm font-medium tracking-widest uppercase animate-pulse">
            点击开始录音
          </p>
        </div>

        {/* Bottom Panel */}
        <div className="px-6 pb-12">
          <div className="glass-effect rounded-2xl p-6 w-full flex flex-col items-center">
            <div className="flex items-end justify-center gap-1.5 h-12 w-full mb-6">
              {[4, 8, 6, 10, 5, 12, 7, 11, 4, 8, 5, 10, 6, 9].map((h, i) => (
                <div key={i} className="bg-primary/60 w-1.5 rounded-full" style={{ height: `${h * 4}px` }}></div>
              ))}
            </div>

            <div className="flex justify-between w-full border-t border-white/10 pt-6">
              <QuickNav icon="history" label="历史识别" />
              <QuickNav
                icon="upload_file"
                label="上传测试"
                onClick={() => fileInputRef.current?.click()}
              />
              <QuickNav icon="map" label="鸟类地图" />
            </div>
          </div>
        </div>
      </div>

      {/* Hidden File Input */}
      <input
        ref={fileInputRef}
        type="file"
        accept="audio/*"
        onChange={handleFileSelect}
        style={{ display: 'none' }}
      />
    </div>
  );
};

const QuickNav: React.FC<{ icon: string; label: string; onClick?: () => void }> = ({ icon, label, onClick }) => (
  <div
    className="flex flex-col items-center flex-1 cursor-pointer hover:bg-white/5 py-2 rounded-lg transition-all"
    onClick={onClick}
  >
    <span className="material-symbols-outlined text-white/70 mb-1">{icon}</span>
    <span className="text-white/60 text-[10px] font-bold">{label}</span>
  </div>
);

export default HomeScreen;
