import { useState } from 'react';
import { Image, Video, Music, FileText, Download, CheckCircle2 } from 'lucide-react';
import { useAppStore } from '@/stores/useAppStore';
import { useMockDemoStore } from '@/stores/useMockDemoStore';
import { getMockDemoScenarioById } from '@/lib/mockDemoScenarios';

export default function EditPage() {
  const { setActiveNav } = useAppStore();
  const {
    activeScenarioId,
    currentStage,
    videoProgressIndex,
    startVideoGeneration,
    nextVideoProgress,
    completeVideoGeneration,
  } = useMockDemoStore();
  const [downloadMessage, setDownloadMessage] = useState('');

  const scenario = activeScenarioId ? getMockDemoScenarioById(activeScenarioId) : null;
  const progressSteps = scenario?.generation.progressSteps ?? [];
  const activeProgressStep = progressSteps[Math.min(videoProgressIndex, Math.max(progressSteps.length - 1, 0))];

  const handleDownloadMock = () => {
    setDownloadMessage('Mock download completed successfully. No real file was generated.');
  };

  if (!scenario) {
    return (
      <div className="pb-24 flex items-center justify-center min-h-[calc(100vh-160px)]">
        <div className="text-center max-w-[520px] px-6">
          <h2 className="text-[22px] font-semibold text-[#FFFFFF] mb-3">No Mock Video Session</h2>
          <p className="text-[14px] text-[#9A9A9E] leading-7 mb-6">Start from Home and complete the mock demo flow through Generate and Script before opening Edit.</p>
          <button onClick={() => setActiveNav('home')} className="px-5 py-2.5 rounded-full bg-[#FF843D] text-white text-[13px] font-medium hover:bg-[#FFA465] transition-all">Back to Home</button>
        </div>
      </div>
    );
  }

  return (
    <div className="pb-24">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h2 className="text-[18px] font-bold text-[#FFFFFF] tracking-wide">EDIT</h2>
          <p className="text-[12px] text-[#9A9A9E] mt-1">{scenario.generation.generatingTitle}</p>
        </div>
        <div className="flex items-center gap-2">
          <button onClick={() => setActiveNav('script')} className="px-4 py-2 border border-[#2A2A2C] rounded-full text-[13px] text-[#9A9A9E] hover:bg-[#141415]">
            Back to Script Plan
          </button>
          <button onClick={() => { startVideoGeneration(); setDownloadMessage(''); }} className="px-4 py-2 bg-[#FF843D] text-white text-[13px] font-medium rounded-full hover:bg-[#FFA465]">
            Regenerate
          </button>
        </div>
      </div>

      {/* Toolbar */}
      <div className="bg-[#141415] rounded-xl shadow-[0_1px_3px_rgba(0,0,0,0.3)] p-4 mb-6 flex items-center gap-3">
        <button className="w-10 h-10 rounded-lg bg-[#141415] flex items-center justify-center text-[#9A9A9E] hover:bg-[#1E1E20]">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polygon points="5,3 19,12 5,21 5,3"/></svg>
        </button>
        <button className="w-10 h-10 rounded-lg bg-[#141415] flex items-center justify-center text-[#9A9A9E] hover:bg-[#1E1E20]">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="6" y="4" width="4" height="16"/><rect x="14" y="4" width="4" height="16"/></svg>
        </button>
        <div className="w-px h-8 bg-[#2A2A2C] mx-1" />
        <button className="w-10 h-10 rounded-lg bg-[#141415] flex items-center justify-center text-[#9A9A9E] hover:bg-[#1E1E20]">
          <Image size={16} />
        </button>
        <button className="w-10 h-10 rounded-lg bg-[#141415] flex items-center justify-center text-[#9A9A9E] hover:bg-[#1E1E20]">
          <Video size={16} />
        </button>
        <button className="w-10 h-10 rounded-lg bg-[#141415] flex items-center justify-center text-[#9A9A9E] hover:bg-[#1E1E20]">
          <Music size={16} />
        </button>
        <button className="w-10 h-10 rounded-lg bg-[#141415] flex items-center justify-center text-[#9A9A9E] hover:bg-[#1E1E20]">
          <FileText size={16} />
        </button>
        <div className="w-px h-8 bg-[#2A2A2C] mx-1" />
        <span className="text-[12px] text-[#6B6B6F]">00:00 / 00:15</span>
      </div>

      {/* Timeline Canvas */}
      <div className="bg-[#1A1A1A] rounded-xl aspect-[21/9] flex items-center justify-center mb-6">
        <div className="text-center">
          <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="#444" strokeWidth="1" className="mx-auto mb-3"><rect x="2" y="2" width="20" height="20" rx="2"/><path d="M2 12h20M12 2v20"/></svg>
          <p className="text-[14px] text-[#9A9A9E]">{currentStage === 'video_result' ? scenario.generation.resultTitle : 'Video Preview Canvas'}</p>
          <p className="text-[11px] text-[#D4D4D8] mt-1">{scenario.generation.resultInfo[0] ?? '21:9 Wide Screen / 24fps Cinematic'}</p>
        </div>
      </div>

      {currentStage === 'video_generating' && activeProgressStep && (
        <div className="bg-[#141415] rounded-xl shadow-[0_1px_3px_rgba(0,0,0,0.3)] p-5 mb-6">
          <div className="flex items-center justify-between gap-4 flex-wrap mb-4">
            <div>
              <h3 className="text-[16px] font-semibold text-[#FFFFFF]">{activeProgressStep.title}</h3>
              <p className="text-[13px] text-[#9A9A9E] mt-1">{activeProgressStep.description}</p>
            </div>
            <div className="text-[22px] font-semibold text-[#FF843D]">{activeProgressStep.progress}%</div>
          </div>
          <div className="w-full h-2 bg-[#0A0A0B] rounded-full overflow-hidden mb-4">
            <div className="h-full bg-[#FF843D] rounded-full transition-all" style={{ width: `${activeProgressStep.progress}%` }} />
          </div>
          <div className="space-y-3 mb-5">
            {progressSteps.map((step, index) => (
              <div key={step.title} className="flex items-start gap-3">
                <div className={`mt-0.5 w-5 h-5 rounded-full flex items-center justify-center text-[10px] ${index <= videoProgressIndex ? 'bg-[#FF843D] text-white' : 'bg-[#0A0A0B] text-[#6B6B6F]'}`}>
                  {index + 1}
                </div>
                <div>
                  <div className="text-[13px] font-medium text-[#FFFFFF]">{step.title}</div>
                  <div className="text-[12px] text-[#9A9A9E] mt-1">{step.description}</div>
                </div>
              </div>
            ))}
          </div>
          <div className="flex items-center gap-3 flex-wrap">
            <button onClick={nextVideoProgress} className="px-4 py-2 rounded-full bg-[#FF843D] text-white text-[13px] font-medium hover:bg-[#FFA465]">Simulate Next Step</button>
            <button onClick={completeVideoGeneration} className="px-4 py-2 rounded-full border border-[#2A2A2C] text-[13px] text-[#9A9A9E] hover:border-[#FF843D] hover:text-[#FFFFFF]">Simulate Complete</button>
          </div>
        </div>
      )}

      {currentStage === 'video_result' && (
        <div className="bg-[#141415] rounded-xl shadow-[0_1px_3px_rgba(0,0,0,0.3)] p-5 mb-6">
          <div className="flex items-center gap-2 mb-4 text-[#FFFFFF]">
            <CheckCircle2 size={18} className="text-[#22C55E]" />
            <h3 className="text-[16px] font-semibold text-[#FFFFFF]">{scenario.generation.resultTitle}</h3>
          </div>
          <div className="grid gap-4 md:grid-cols-2">
            <div className="bg-[#0A0A0B] rounded-xl p-4">
              <h4 className="text-[12px] font-semibold uppercase tracking-wider text-[#9A9A9E] mb-3">Result Info</h4>
              <div className="space-y-2">
                {scenario.generation.resultInfo.map((item) => (
                  <div key={item} className="text-[13px] text-[#FFFFFF]">• {item}</div>
                ))}
              </div>
            </div>
            <div className="bg-[#0A0A0B] rounded-xl p-4">
              <h4 className="text-[12px] font-semibold uppercase tracking-wider text-[#9A9A9E] mb-3">Result Summary</h4>
              <div className="space-y-2">
                {scenario.generation.resultSummary.map((item) => (
                  <div key={item} className="text-[13px] text-[#FFFFFF]">• {item}</div>
                ))}
              </div>
            </div>
          </div>
          <div className="flex items-center gap-3 flex-wrap mt-5">
            <button onClick={() => setActiveNav('script')} className="px-4 py-2 rounded-full border border-[#2A2A2C] text-[13px] text-[#9A9A9E] hover:border-[#FF843D] hover:text-[#FFFFFF]">Back to Script Plan</button>
            <button onClick={() => { startVideoGeneration(); setDownloadMessage(''); }} className="px-4 py-2 rounded-full bg-[#FF843D] text-white text-[13px] font-medium hover:bg-[#FFA465]">Regenerate</button>
            <button onClick={handleDownloadMock} className="px-4 py-2 rounded-full border border-[#2A2A2C] text-[13px] text-[#9A9A9E] hover:border-[#FF843D] hover:text-[#FFFFFF] inline-flex items-center gap-2">
              <Download size={14} /> Download Mock Video
            </button>
          </div>
          {downloadMessage && <div className="mt-4 text-[12px] text-[#22C55E]">{downloadMessage}</div>}
        </div>
      )}

      {/* Timeline Tracks */}
      <div className="bg-[#141415] rounded-xl shadow-[0_1px_3px_rgba(0,0,0,0.3)] p-4">
        <div className="space-y-3">
          {/* Video Track */}
          <div className="flex items-center gap-3">
            <span className="text-[11px] text-[#9A9A9E] w-16 text-right">VIDEO</span>
            <div className="flex-1 h-10 bg-[#141415] rounded-lg relative overflow-hidden">
              <div className="absolute inset-y-1 left-1 right-1/2 bg-[#2A2A2C] rounded" />
              <div className="absolute top-1/2 left-1/2 w-px h-full bg-[#FF843D]/20 -translate-y-1/2" />
            </div>
          </div>
          {/* Audio Track */}
          <div className="flex items-center gap-3">
            <span className="text-[11px] text-[#9A9A9E] w-16 text-right">AUDIO</span>
            <div className="flex-1 h-8 bg-[#141415] rounded-lg relative overflow-hidden">
              <div className="absolute inset-y-1 left-1 right-1/3 bg-[#1E1E20] rounded" />
            </div>
          </div>
          {/* Text Track */}
          <div className="flex items-center gap-3">
            <span className="text-[11px] text-[#9A9A9E] w-16 text-right">TEXT</span>
            <div className="flex-1 h-8 bg-[#141415] rounded-lg relative overflow-hidden">
              <div className="absolute inset-y-1 left-[20%] right-[40%] bg-[#1E1E20] rounded" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
