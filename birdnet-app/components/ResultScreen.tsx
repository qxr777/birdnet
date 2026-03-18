
import React, { useEffect, useState, useRef } from 'react';
import { RecognitionResult } from '../types';
import { ASSETS } from '../constants';
import { getBirdFacts } from '../services/gemini';

interface ResultScreenProps {
  result: RecognitionResult;
  onBack: () => void;
}

const ResultScreen: React.FC<ResultScreenProps> = ({ result, onBack }) => {
  const [facts, setFacts] = useState<string[]>([]);
  const [loadingFacts, setLoadingFacts] = useState(true);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    const fetchFacts = async () => {
      const birdFacts = await getBirdFacts(result.primaryMatch.name);
      setFacts(birdFacts);
      setLoadingFacts(false);
    };
    fetchFacts();
  }, [result.primaryMatch.name]);

  // 音频播放逻辑
  const togglePlay = () => {
    if (!audioRef.current) return;
    if (isPlaying) {
      audioRef.current.pause();
    } else {
      audioRef.current.play();
    }
  };

  const onTimeUpdate = () => {
    if (audioRef.current) {
      setCurrentTime(audioRef.current.currentTime);
    }
  };

  const onLoadedMetadata = () => {
    if (audioRef.current) {
      setDuration(audioRef.current.duration);
    }
  };

  const onEnded = () => {
    setIsPlaying(false);
    setCurrentTime(0);
  };

  const formatTime = (time: number) => {
    const mins = Math.floor(time / 60);
    const secs = Math.floor(time % 60);
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const progress = duration > 0 ? (currentTime / duration) * 100 : 0;

  // 百科跳转链接
  const openWikipedia = () => {
    const query = encodeURIComponent(result.primaryMatch.name);
    window.open(`https://zh.wikipedia.org/wiki/${query}`, '_blank');
  };

  return (
    <div className="relative h-full w-full flex flex-col bg-white dark:bg-background-dark text-[#111813] dark:text-white overflow-y-auto scrollbar-hide pb-12">
      {/* Hidden Audio Element */}
      {result.audioUrl && (
        <audio
          ref={audioRef}
          src={result.audioUrl}
          onPlay={() => setIsPlaying(true)}
          onPause={() => setIsPlaying(false)}
          onTimeUpdate={onTimeUpdate}
          onLoadedMetadata={onLoadedMetadata}
          onEnded={onEnded}
        />
      )}

      {/* Top Bar */}
      <div className="sticky top-0 z-50 flex items-center bg-white/80 dark:bg-background-dark/80 backdrop-blur-md p-4 justify-between border-b border-gray-100 dark:border-gray-800">
        <button
          onClick={onBack}
          className="flex size-10 shrink-0 items-center justify-center cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-800 rounded-full transition-colors"
        >
          <span className="material-symbols-outlined !text-xl">arrow_back_ios</span>
        </button>
        <h2 className="text-lg font-bold flex-1 text-center pr-10">识别结果详情</h2>
      </div>

      {/* Media Player Player Section */}
      <div className="px-4 py-6">
        <div className="flex flex-col gap-4 rounded-2xl bg-gray-50 dark:bg-gray-900/50 border border-gray-100 dark:border-gray-800 p-5 shadow-sm">
          <div className="flex items-center gap-4">
            <div
              className="bg-center bg-cover rounded-xl size-16 shrink-0 shadow-sm border border-white/10 flex items-center justify-center bg-primary/10"
            >
              <span className="material-symbols-outlined text-primary text-3xl">waves</span>
            </div>
            <div className="flex-1">
              <p className="text-base font-bold leading-tight truncate">录音片段 {result.id}</p>
              <p className="text-[#61896f] dark:text-gray-400 text-sm font-normal mt-1">{result.timestamp} · {result.location}</p>
            </div>
            <button
              onClick={togglePlay}
              disabled={!result.audioUrl}
              className="flex shrink-0 items-center justify-center rounded-full size-12 bg-primary text-[#111813] hover:scale-105 active:scale-95 transition-all shadow-md disabled:opacity-50"
            >
              <span className="material-symbols-outlined !text-3xl" style={{ fontVariationSettings: "'FILL' 1" }}>
                {isPlaying ? 'pause' : 'play_arrow'}
              </span>
            </button>
          </div>
          <div className="pt-2">
            <div className="flex h-4 items-center justify-center relative mb-2">
              <div className="h-2 flex-1 rounded-full bg-primary/20">
                <div
                  className="h-full rounded-full bg-primary relative transition-all duration-100"
                  style={{ width: `${progress}%` }}
                >
                  <div className="absolute -right-2.5 -top-1.5 size-5 rounded-full bg-primary border-[3px] border-white dark:border-background-dark shadow-md"></div>
                </div>
              </div>
            </div>
            <div className="flex items-center justify-between">
              <p className="text-[#61896f] dark:text-gray-400 text-[10px] font-bold">{formatTime(currentTime)}</p>
              <p className="text-[#61896f] dark:text-gray-400 text-[10px] font-bold">{formatTime(duration) || result.duration}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Best Match Header */}
      <div className="px-4 pb-3 flex items-center justify-between">
        <h3 className="text-xl font-bold tracking-tight">最佳匹配</h3>
        <span className="bg-primary/20 text-green-700 dark:text-primary text-[10px] font-black px-3 py-1 rounded-full uppercase tracking-widest shadow-sm">High Confidence</span>
      </div>

      {/* Primary Bird Card */}
      <div className="px-4 pb-6">
        <div className="flex flex-col rounded-2xl overflow-hidden shadow-xl border-2 border-primary bg-white dark:bg-gray-900">
          <div className="w-full aspect-[16/10] bg-gray-200 dark:bg-gray-800 overflow-hidden">
            <img
              src={result.primaryMatch.imageUrl}
              alt={result.primaryMatch.name}
              className="w-full h-full object-cover"
              onError={(e) => {
                (e.target as HTMLImageElement).src = 'https://images.unsplash.com/photo-1444464666168-49d633b86747?q=80&w=400&h=300&auto=format&fit=crop';
              }}
            />
          </div>
          <div className="p-6">
            <div className="flex justify-between items-start mb-6">
              <div>
                <p className="text-2xl font-black leading-tight">{result.primaryMatch.name}</p>
                <p className="text-[#61896f] dark:text-gray-400 text-sm italic font-semibold">{result.primaryMatch.scientificName}</p>
              </div>
              <div className="text-right">
                <p className="text-primary text-4xl font-black leading-none">{result.primaryMatch.confidence}%</p>
                <p className="text-[#61896f] dark:text-gray-400 text-[10px] font-black uppercase mt-1 tracking-widest">置信度</p>
              </div>
            </div>

            {/* AI Insights (Gemini) */}
            <div className="mb-6">
              <h4 className="text-xs font-black uppercase text-primary/70 mb-3 tracking-widest flex items-center gap-2">
                <span className="material-symbols-outlined !text-sm">auto_awesome</span>
                AI 百科速览
              </h4>
              {loadingFacts ? (
                <div className="space-y-2 animate-pulse">
                  <div className="h-3 bg-gray-200 dark:bg-white/10 rounded-full w-full"></div>
                  <div className="h-3 bg-gray-200 dark:bg-white/10 rounded-full w-4/5"></div>
                  <div className="h-3 bg-gray-200 dark:bg-white/10 rounded-full w-2/3"></div>
                </div>
              ) : (
                <ul className="space-y-2.5">
                  {facts.map((fact, idx) => (
                    <li key={idx} className="text-sm text-gray-600 dark:text-gray-300 flex items-start gap-2 leading-relaxed">
                      <span className="size-1.5 rounded-full bg-primary shrink-0 mt-1.5"></span>
                      {fact}
                    </li>
                  ))}
                </ul>
              )}
            </div>

            <div className="flex gap-3">
              <button
                onClick={openWikipedia}
                className="flex-1 cursor-pointer items-center justify-center rounded-xl h-12 px-6 bg-primary text-[#111813] text-sm font-black shadow-lg hover:opacity-90 active:scale-95 transition-all"
              >
                <span>查看完整百科</span>
              </button>
              <button className="flex size-12 cursor-pointer items-center justify-center rounded-xl bg-gray-100 dark:bg-gray-800 text-[#111813] dark:text-white hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors">
                <span className="material-symbols-outlined">share</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Other Matches */}
      <div className="px-4 pb-2">
        <h3 className="text-lg font-bold">其他可能</h3>
      </div>
      <div className="px-4 flex flex-col gap-3 pb-12">
        {result.alternatives.map((bird, idx) => (
          <div key={idx} className="flex items-center gap-4 p-4 rounded-2xl bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800 shadow-sm hover:border-primary/30 transition-colors cursor-pointer group">
            <div className="size-16 rounded-xl shrink-0 border border-gray-100 dark:border-gray-800 bg-gray-200 overflow-hidden">
              <img
                src={bird.imageUrl}
                alt={bird.name}
                className="w-full h-full object-cover"
                onError={(e) => {
                  (e.target as HTMLImageElement).src = 'https://images.unsplash.com/photo-1444464666168-49d633b86747?q=80&w=400&h=300&auto=format&fit=crop';
                }}
              />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-base font-bold truncate group-hover:text-primary transition-colors">{bird.name}</p>
              <p className="text-[#61896f] dark:text-gray-400 text-xs truncate">{bird.scientificName}</p>
            </div>
            <div className="text-right shrink-0 pr-2">
              <p className="text-base font-black">{bird.confidence}%</p>
              <div className="w-16 h-1.5 bg-gray-100 dark:bg-gray-800 rounded-full mt-1.5 overflow-hidden">
                <div className="h-full bg-gray-400 rounded-full" style={{ width: `${bird.confidence}%` }}></div>
              </div>
            </div>
            <span className="material-symbols-outlined text-gray-400 !text-xl group-hover:translate-x-1 transition-transform">chevron_right</span>
          </div>
        ))}
      </div>

      {/* Footer Feedback */}
      <div className="mt-auto p-8 text-center bg-gray-50 dark:bg-gray-900/40 border-t border-gray-100 dark:border-gray-800">
        <p className="text-[#61896f] dark:text-gray-400 text-sm mb-4">识别结果不准确？</p>
        <button className="inline-flex items-center justify-center px-8 py-3 rounded-full border border-gray-300 dark:border-gray-700 text-[#111813] dark:text-white text-sm font-bold hover:bg-white dark:hover:bg-gray-800 transition-all active:scale-95">
          反馈给 AI 改进
        </button>
      </div>
    </div>
  );
};

export default ResultScreen;
