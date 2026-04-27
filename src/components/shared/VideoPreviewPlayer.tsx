import { useState, useEffect, useCallback } from 'react';
import { Play, Pause, SkipBack, SkipForward, X } from 'lucide-react';

interface Shot {
  id: string;
  timeRange: string;
  visual: string;
  purpose: string;
  camera: string;
  asset: string;
  copy: string;
}

interface VideoPreviewPlayerProps {
  shots: Shot[];
  title: string;
  onClose: () => void;
}

export default function VideoPreviewPlayer({ shots, title, onClose }: VideoPreviewPlayerProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [progress, setProgress] = useState(0);
  
  const currentShot = shots[currentIndex];
  
  // 解析时间范围获取时长（秒）
  const getDuration = useCallback((timeRange: string): number => {
    const parts = timeRange.split('-');
    if (parts.length === 2) {
      const end = parseFloat(parts[1].replace('s', ''));
      const start = parseFloat(parts[0].replace('s', ''));
      return Math.max((end - start) * 1000, 2000); // 最少2秒
    }
    return 3000;
  }, []);

  // 播放控制
  useEffect(() => {
    if (!isPlaying) return;
    
    const duration = getDuration(currentShot.timeRange);
    const interval = 50; // 50ms更新
    let elapsed = 0;
    
    const timer = setInterval(() => {
      elapsed += interval;
      setProgress(Math.min((elapsed / duration) * 100, 100));
      
      if (elapsed >= duration) {
        // 切换到下一张
        if (currentIndex < shots.length - 1) {
          setCurrentIndex(prev => prev + 1);
          setProgress(0);
        } else {
          // 结束
          setIsPlaying(false);
          setCurrentIndex(0);
          setProgress(0);
        }
      }
    }, interval);
    
    return () => clearInterval(timer);
  }, [isPlaying, currentIndex, currentShot, shots.length, getDuration]);

  const handlePlayPause = () => {
    if (!isPlaying && currentIndex === shots.length - 1 && progress >= 100) {
      setCurrentIndex(0);
      setProgress(0);
    }
    setIsPlaying(!isPlaying);
  };

  const handlePrev = () => {
    setIsPlaying(false);
    setProgress(0);
    setCurrentIndex(Math.max(0, currentIndex - 1));
  };

  const handleNext = () => {
    setIsPlaying(false);
    setProgress(0);
    setCurrentIndex(Math.min(shots.length - 1, currentIndex + 1));
  };

  const handleSeek = (index: number) => {
    setIsPlaying(false);
    setProgress(0);
    setCurrentIndex(index);
  };

  return (
    <div className="fixed inset-0 z-[100] bg-[#FF843D] flex flex-col" onClick={onClose}>
      {/* 顶部信息 */}
      <div className="flex items-center justify-between px-4 md:px-6 py-3 z-10" onClick={(e) => e.stopPropagation()}>
        <div className="flex items-center gap-3">
          <span className="text-white/60 text-[12px]">PREVIEW</span>
          <span className="text-white text-[14px] font-medium">{title}</span>
          <span className="text-white/40 text-[12px]">Shot {currentIndex + 1} / {shots.length}</span>
        </div>
        <button onClick={onClose} className="w-8 h-8 rounded-full bg-[#141415]/10 flex items-center justify-center text-white hover:bg-[#141415]/20">
          <X size={16} />
        </button>
      </div>

      {/* 主播放器区域 */}
      <div className="flex-1 flex items-center justify-center px-4" onClick={(e) => e.stopPropagation()}>
        <div className="w-full max-w-4xl">
          {/* 预览画面 */}
          <div className="relative aspect-video bg-[#1A1A1A] rounded-xl overflow-hidden mb-4">
            {/* 模拟画面内容 */}
            <div className="absolute inset-0 flex flex-col items-center justify-center p-8">
              {/* 视觉描述文字（模拟画面） */}
              <div className="text-center max-w-xl">
                <p className="text-white/90 text-[16px] md:text-[20px] font-medium leading-relaxed mb-4">
                  {currentShot.visual}
                </p>
                <div className="flex items-center justify-center gap-3">
                  <span className="px-3 py-1 bg-[#141415]/10 rounded-full text-white/60 text-[11px] uppercase">
                    {currentShot.purpose}
                  </span>
                  <span className="text-white/40 text-[11px]">{currentShot.camera}</span>
                </div>
              </div>
              
              {/* Copy文字叠加 */}
              {currentShot.copy && (
                <div className="absolute bottom-8 left-8 right-8 text-center">
                  <p className="text-white/70 text-[14px] md:text-[16px] italic">
                    "{currentShot.copy}"
                  </p>
                </div>
              )}
            </div>
            
            {/* 进度条 */}
            <div className="absolute bottom-0 left-0 right-0 h-1 bg-[#141415]/10">
              <div 
                className="h-full bg-[#141415]/80 transition-all duration-100"
                style={{ width: `${progress}%` }}
              />
            </div>
            
            {/* 时间标记 */}
            <div className="absolute top-3 left-3 px-2 py-1 bg-[#FF843D]/50 rounded text-white/80 text-[11px]">
              {currentShot.timeRange}
            </div>
          </div>

          {/* 控制栏 */}
          <div className="flex items-center justify-center gap-6">
            <button onClick={handlePrev} className="w-10 h-10 rounded-full bg-[#141415]/10 flex items-center justify-center text-white hover:bg-[#141415]/20">
              <SkipBack size={18} />
            </button>
            <button 
              onClick={handlePlayPause}
              className="w-14 h-14 rounded-full bg-[#141415] flex items-center justify-center text-white hover:scale-105 transition-transform"
            >
              {isPlaying ? <Pause size={22} /> : <Play size={22} className="ml-0.5" />}
            </button>
            <button onClick={handleNext} className="w-10 h-10 rounded-full bg-[#141415]/10 flex items-center justify-center text-white hover:bg-[#141415]/20">
              <SkipForward size={18} />
            </button>
          </div>

          {/* Shot缩略图时间线 */}
          <div className="flex gap-2 mt-6 overflow-x-auto pb-2">
            {shots.map((shot, idx) => (
              <button
                key={shot.id}
                onClick={() => handleSeek(idx)}
                className={`flex-shrink-0 w-20 md:w-24 h-14 rounded-lg flex flex-col items-center justify-center gap-0.5 transition-all ${
                  idx === currentIndex 
                    ? 'bg-[#141415]/20 ring-2 ring-white' 
                    : 'bg-[#141415]/5 hover:bg-[#141415]/10'
                }`}
              >
                <span className="text-white/80 text-[9px]">{shot.timeRange}</span>
                <span className="text-white/40 text-[8px] uppercase">{shot.purpose.slice(0, 10)}</span>
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
