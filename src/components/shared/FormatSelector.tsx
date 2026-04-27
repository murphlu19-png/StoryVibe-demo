import { useState } from 'react';
import { SlidersHorizontal, Monitor, Gauge, Aperture, Clock, X } from 'lucide-react';

interface FormatSelectorProps {
  settings: {
    aspectRatio: string;
    duration: string;
    quality: string;
    frameRate: string;
  };
  onChange: (settings: Partial<FormatSelectorProps['settings']>) => void;
}

const ASPECT_RATIOS = [
  { id: '9:16', label: '9:16', desc: 'Vertical · Social', icon: '📱' },
  { id: '16:9', label: '16:9', desc: 'Horizontal · Cinematic', icon: '🖥️' },
  { id: '1:1', label: '1:1', desc: 'Square · Gallery', icon: '⬜' },
  { id: '21:9', label: '21:9', desc: 'Ultra-wide · Film', icon: '🎬' },
];

const DURATIONS = ['5s', '15s', '30s', '60s', '90s', '120s'];
const QUALITIES = ['720p', '1080p', '2K', '4K'];
const FRAME_RATES = ['24fps', '30fps', '60fps'];

export function FormatSelector({ settings, onChange }: FormatSelectorProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [customDuration, setCustomDuration] = useState('');
  const [showCustomInput, setShowCustomInput] = useState(false);

  const handleDurationSelect = (d: string) => {
    onChange({ duration: d });
    setShowCustomInput(false);
  };

  const handleCustomDuration = () => {
    const val = parseInt(customDuration);
    if (val >= 1 && val <= 300) {
      onChange({ duration: `${val}s` });
      setShowCustomInput(false);
      setCustomDuration('');
    }
  };

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 px-4 py-2.5 rounded-xl border border-[#2A2A2C] bg-[#141415] text-[13px] text-[#9A9A9E] hover:border-[#FF843D] hover:text-[#FFFFFF] transition-all"
      >
        <SlidersHorizontal size={14} />
        <span className="font-medium">{settings.aspectRatio} · {settings.duration} · {settings.quality}</span>
      </button>

      {isOpen && (
        <>
          <div className="fixed inset-0 z-40" onClick={() => setIsOpen(false)} />
          <div className="absolute top-full left-0 mt-2 w-[380px] bg-[#141415] rounded-2xl shadow-[0_8px_40px_rgba(0,0,0,0.5)] border border-[#2A2A2C] z-50 p-5">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-[14px] font-semibold text-[#FFFFFF]">Format Settings</h3>
              <button onClick={() => setIsOpen(false)} className="w-6 h-6 rounded-full hover:bg-[#141415] flex items-center justify-center">
                <X size={14} />
              </button>
            </div>

            {/* Aspect Ratio */}
            <div className="mb-4">
              <div className="flex items-center gap-1.5 mb-2">
                <Monitor size={12} className="text-[#6B6B6F]" />
                <span className="text-[11px] uppercase tracking-wider text-[#6B6B6F] font-medium">Aspect Ratio</span>
              </div>
              <div className="grid grid-cols-4 gap-2">
                {ASPECT_RATIOS.map((ar) => (
                  <button key={ar.id} onClick={() => onChange({ aspectRatio: ar.id })}
                    className={`p-2 rounded-xl border text-center transition-all ${settings.aspectRatio === ar.id ? 'border-[#FF843D] bg-[#FF843D] text-white' : 'border-[#2A2A2C] hover:border-[#999999]'}`}>
                    <div className="text-[16px] mb-0.5">{ar.icon}</div>
                    <div className="text-[11px] font-semibold">{ar.label}</div>
                    <div className="text-[9px] opacity-70">{ar.desc}</div>
                  </button>
                ))}
              </div>
            </div>

            {/* Duration with custom slider */}
            <div className="mb-4">
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-1.5">
                  <Clock size={12} className="text-[#6B6B6F]" />
                  <span className="text-[11px] uppercase tracking-wider text-[#6B6B6F] font-medium">Duration</span>
                </div>
                <span className="text-[12px] font-semibold text-[#FFFFFF]">{settings.duration}</span>
              </div>
              
              {/* Slider for custom duration */}
              <div className="mb-3">
                <input
                  type="range"
                  min="1"
                  max="120"
                  step="1"
                  value={parseInt(settings.duration) || 5}
                  onChange={(e) => onChange({ duration: `${e.target.value}s` })}
                  className="w-full h-1.5 bg-[#2A2A2C] rounded-full appearance-none cursor-pointer accent-black"
                />
                <div className="flex justify-between text-[9px] text-[#6B6B6F] mt-1">
                  <span>1s</span>
                  <span>30s</span>
                  <span>60s</span>
                  <span>90s</span>
                  <span>120s</span>
                </div>
              </div>

              {/* Preset buttons */}
              <div className="flex gap-2 flex-wrap">
                {DURATIONS.map((d) => (
                  <button key={d} onClick={() => handleDurationSelect(d)}
                    className={`px-3 py-1.5 rounded-lg text-[12px] font-medium transition-all ${settings.duration === d ? 'bg-[#FF843D] text-white' : 'bg-[#141415] text-[#9A9A9E] hover:bg-[#2A2A2C]'}`}>
                    {d}
                  </button>
                ))}
                <button onClick={() => setShowCustomInput(!showCustomInput)}
                  className={`px-3 py-1.5 rounded-lg text-[12px] font-medium transition-all ${showCustomInput ? 'bg-[#FF843D] text-white' : 'bg-[#141415] text-[#9A9A9E] hover:bg-[#2A2A2C]'}`}>
                  Custom
                </button>
              </div>

              {/* Custom input */}
              {showCustomInput && (
                <div className="mt-2 flex gap-2">
                  <input
                    type="number"
                    min="1"
                    max="300"
                    value={customDuration}
                    onChange={(e) => setCustomDuration(e.target.value)}
                    placeholder="Enter seconds..."
                    className="flex-1 px-3 py-2 rounded-lg border border-[#2A2A2C] text-[13px] outline-none focus:border-[#FF843D]"
                  />
                  <button onClick={handleCustomDuration}
                    className="px-4 py-2 bg-[#FF843D] text-white rounded-lg text-[12px] font-medium">
                    Apply
                  </button>
                </div>
              )}
            </div>

            {/* Quality */}
            <div className="mb-4">
              <div className="flex items-center gap-1.5 mb-2">
                <Aperture size={12} className="text-[#6B6B6F]" />
                <span className="text-[11px] uppercase tracking-wider text-[#6B6B6F] font-medium">Quality</span>
              </div>
              <div className="flex gap-2">
                {QUALITIES.map((q) => (
                  <button key={q} onClick={() => onChange({ quality: q })}
                    className={`px-3 py-1.5 rounded-lg text-[12px] font-medium transition-all ${settings.quality === q ? 'bg-[#FF843D] text-white' : 'bg-[#141415] text-[#9A9A9E] hover:bg-[#2A2A2C]'}`}>
                    {q}
                  </button>
                ))}
              </div>
            </div>

            {/* Frame Rate */}
            <div>
              <div className="flex items-center gap-1.5 mb-2">
                <Gauge size={12} className="text-[#6B6B6F]" />
                <span className="text-[11px] uppercase tracking-wider text-[#6B6B6F] font-medium">Frame Rate</span>
              </div>
              <div className="flex gap-2">
                {FRAME_RATES.map((f) => (
                  <button key={f} onClick={() => onChange({ frameRate: f })}
                    className={`px-3 py-1.5 rounded-lg text-[12px] font-medium transition-all ${settings.frameRate === f ? 'bg-[#FF843D] text-white' : 'bg-[#141415] text-[#9A9A9E] hover:bg-[#2A2A2C]'}`}>
                    {f}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
