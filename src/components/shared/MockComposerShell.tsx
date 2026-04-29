import { useEffect, useRef, useState } from 'react';
import { AtSign, CheckCircle2, ChevronDown, ChevronRight, FolderOpen, Plus } from 'lucide-react';

type MentionAsset = {
  id: string;
  name: string;
  role?: string;
  thumbnail?: string;
};

type ComposerAttachedAsset = {
  id: string;
  file: File;
  previewUrl: string | null;
};

type MockComposerShellProps = {
  mentionAssets: MentionAsset[];
  resetKey: string;
  initialInput?: string;
  ctaLabel?: string;
  onCta?: (input: string, context: { attachedAssets: File[] }) => void;
  ctaDisabled?: boolean;
  placeholder?: string;
  footerNote?: string;
  autoFocusSignal?: number;
  mentionDisplayMode?: 'detailed' | 'compact';
  disableMentionWhenEmpty?: boolean;
  onInputFocusChange?: (isFocused: boolean) => void;
  onPopoverStateChange?: (isOpen: boolean) => void;
};

export function MockComposerShell({
  mentionAssets,
  resetKey,
  initialInput = '',
  ctaLabel,
  onCta,
  ctaDisabled = false,
  placeholder = 'Add more context, attach references, or continue with guided questions...',
  footerNote = 'Composer notes and output settings stay local to this mock flow.',
  autoFocusSignal,
  mentionDisplayMode = 'detailed',
  disableMentionWhenEmpty = false,
  onInputFocusChange,
  onPopoverStateChange,
}: MockComposerShellProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const flowMenuRef = useRef<HTMLDivElement>(null);
  const outputMenuRef = useRef<HTMLDivElement>(null);
  const qualityMenuRef = useRef<HTMLDivElement>(null);
  const mentionMenuRef = useRef<HTMLDivElement>(null);
  const attachedAssetsRef = useRef<ComposerAttachedAsset[]>([]);

  const [chatInput, setChatInput] = useState('');
  const [attachedAssets, setAttachedAssets] = useState<ComposerAttachedAsset[]>([]);
  const [showAssetHint, setShowAssetHint] = useState(false);
  const [isFlowMenuOpen, setIsFlowMenuOpen] = useState(false);
  const [isOutputMenuOpen, setIsOutputMenuOpen] = useState(false);
  const [isQualityMenuOpen, setIsQualityMenuOpen] = useState(false);
  const [isMentionMenuOpen, setIsMentionMenuOpen] = useState(false);
  const [selectedFlow, setSelectedFlow] = useState('Guided Script Flow');
  const [outputMode, setOutputMode] = useState<'customize' | 'auto'>('customize');
  const [outputSettings, setOutputSettings] = useState({
    aspectRatio: '9:16',
    duration: '15s',
    resolution: '720p',
  });
  const [selectedQuality, setSelectedQuality] = useState('Standard');

  const clearAttachedAssets = () => {
    attachedAssetsRef.current.forEach((asset) => {
      if (asset.previewUrl) {
        URL.revokeObjectURL(asset.previewUrl);
      }
    });
    attachedAssetsRef.current = [];
    setAttachedAssets([]);
  };

  useEffect(() => {
    setChatInput(initialInput);
    clearAttachedAssets();
    setShowAssetHint(false);
    setIsFlowMenuOpen(false);
    setIsOutputMenuOpen(false);
    setIsQualityMenuOpen(false);
    setIsMentionMenuOpen(false);
    setSelectedFlow('Guided Script Flow');
    setOutputMode('customize');
    setOutputSettings({
      aspectRatio: '9:16',
      duration: '15s',
      resolution: '720p',
    });
    setSelectedQuality('Standard');
  }, [initialInput, resetKey]);

  useEffect(() => {
    attachedAssetsRef.current = attachedAssets;
  }, [attachedAssets]);

  useEffect(() => {
    return () => {
      attachedAssetsRef.current.forEach((asset) => {
        if (asset.previewUrl) {
          URL.revokeObjectURL(asset.previewUrl);
        }
      });
    };
  }, []);

  useEffect(() => {
    if (typeof autoFocusSignal !== 'number') return;
    window.setTimeout(() => {
      textareaRef.current?.focus();
    }, 0);
  }, [autoFocusSignal]);

  useEffect(() => {
    const closeMenus = () => {
      setIsFlowMenuOpen(false);
      setIsOutputMenuOpen(false);
      setIsQualityMenuOpen(false);
      setIsMentionMenuOpen(false);
    };

    const handlePointerDown = (event: MouseEvent) => {
      const target = event.target as Node;

      if (flowMenuRef.current && !flowMenuRef.current.contains(target)) {
        setIsFlowMenuOpen(false);
      }

      if (outputMenuRef.current && !outputMenuRef.current.contains(target)) {
        setIsOutputMenuOpen(false);
      }

      if (qualityMenuRef.current && !qualityMenuRef.current.contains(target)) {
        setIsQualityMenuOpen(false);
      }

      if (mentionMenuRef.current && !mentionMenuRef.current.contains(target)) {
        setIsMentionMenuOpen(false);
      }
    };

    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        closeMenus();
      }
    };

    document.addEventListener('mousedown', handlePointerDown);
    document.addEventListener('keydown', handleEscape);

    return () => {
      document.removeEventListener('mousedown', handlePointerDown);
      document.removeEventListener('keydown', handleEscape);
    };
  }, []);

  useEffect(() => {
    onPopoverStateChange?.(isFlowMenuOpen || isOutputMenuOpen || isQualityMenuOpen || isMentionMenuOpen);
  }, [isFlowMenuOpen, isMentionMenuOpen, isOutputMenuOpen, isQualityMenuOpen, onPopoverStateChange]);

  const outputSpecLabel = outputMode === 'auto'
    ? 'Auto'
    : `${outputSettings.aspectRatio} · ${outputSettings.duration} · ${outputSettings.resolution}`;

  const pillButtonClassName =
    'inline-flex items-center gap-2 rounded-full border border-[#2A2A2C] bg-[#101011] px-3 py-1.5 text-[12px] text-[#D4D4D8] transition-all hover:border-[#FF843D] hover:text-[#FFFFFF] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#FF843D]/40';

  const closeComposerMenus = () => {
    setIsFlowMenuOpen(false);
    setIsOutputMenuOpen(false);
    setIsQualityMenuOpen(false);
    setIsMentionMenuOpen(false);
  };

  const handleMockAssetSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(event.target.files || []);
    if (files.length > 0) {
      setAttachedAssets((prev) => [
        ...prev,
        ...files.map((file) => ({
          id: `${file.name}-${file.size}-${file.lastModified}-${Math.random().toString(36).slice(2, 7)}`,
          file,
          previewUrl: file.type.startsWith('image/') ? URL.createObjectURL(file) : null,
        })),
      ]);
      setShowAssetHint(false);
    }

    event.target.value = '';
  };

  const triggerAssetPicker = () => {
    setShowAssetHint(true);
    fileInputRef.current?.click();
  };

  const appendMention = (assetName: string) => {
    const mention = `@${assetName.split(' · ')[0]}`;
    setChatInput((prev) => {
      const normalized = prev.trimEnd();
      return normalized ? `${normalized} ${mention} ` : `${mention} `;
    });
    setIsMentionMenuOpen(false);
  };

  const showCta = Boolean(ctaLabel && onCta);
  const isCtaDisabled = ctaDisabled || !chatInput.trim();
  const resolvedMentionAssets: MentionAsset[] = [
    ...attachedAssets.map((asset) => ({
      id: asset.id,
      name: asset.file.name,
      role: asset.file.type || 'Attached asset',
      thumbnail: asset.previewUrl || undefined,
    })),
    ...mentionAssets,
  ];
  const hasMentionAssets = resolvedMentionAssets.length > 0;
  const isMentionDisabled = disableMentionWhenEmpty && !hasMentionAssets;

  return (
    <div className="rounded-[30px] border border-[rgba(255,255,255,0.08)] bg-[rgba(18,18,19,0.92)] p-4 md:p-5 shadow-[0_1px_3px_rgba(0,0,0,0.3)] backdrop-blur-sm">
      <input
        ref={fileInputRef}
        type="file"
        multiple
        accept="image/*,video/*,text/plain,.txt,.md,.doc,.docx,.pdf,.csv,.xlsx,.xls"
        onChange={handleMockAssetSelect}
        className="hidden"
      />
      <div className="flex flex-col gap-4">
        {attachedAssets.length > 0 && (
          <div className="flex flex-wrap gap-2">
            {attachedAssets.map((asset, index) => (
              <span
                  key={`${asset.file.name}-${index}`}
                className="inline-flex items-center gap-2 rounded-full border border-[#2A2A2C] bg-[#101011] px-3 py-1.5 text-[12px] text-[#E7E7EA]"
              >
                <span className="h-1.5 w-1.5 rounded-full bg-[#FF843D]" />
                  {asset.file.name}
              </span>
            ))}
          </div>
        )}

        <div className="flex gap-4">
          <button
            type="button"
            onClick={triggerAssetPicker}
            className="flex h-[72px] w-[72px] shrink-0 items-center justify-center rounded-[22px] border border-dashed border-[#3A3A3E] bg-[#101011] text-[#A1A1AA] transition-all hover:border-[#FF843D] hover:text-[#FFFFFF] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#FF843D]/40"
            aria-label="Add assets"
          >
            <Plus size={22} />
          </button>
          <textarea
            ref={textareaRef}
            value={chatInput}
            onChange={(event) => setChatInput(event.target.value)}
            onFocus={() => onInputFocusChange?.(true)}
            onBlur={() => onInputFocusChange?.(false)}
            placeholder={placeholder}
            className="min-h-[72px] flex-1 resize-none rounded-[22px] bg-[#101011] px-4 py-4 text-[14px] leading-7 text-[#F3F3F5] placeholder:text-[#6F6F77] outline-none transition-all focus:ring-2 focus:ring-[#FF843D]/20"
          />
        </div>

        {showAssetHint && (
          <div className="rounded-[18px] border border-[rgba(255,255,255,0.08)] bg-[#101011] px-4 py-3 text-[12px] leading-6 text-[#A1A1AA]">
            Mock assets can be attached in the full flow.
          </div>
        )}

        <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
          <div className="flex flex-wrap items-center gap-2">
            <button
              type="button"
              onClick={triggerAssetPicker}
              className={pillButtonClassName}
            >
              <FolderOpen size={14} />
              Add Assets
              {attachedAssets.length > 0 && (
                <span className="rounded-full bg-[#FF843D] px-1.5 py-0.5 text-[10px] text-white">
                  {attachedAssets.length}
                </span>
              )}
            </button>

            <div className="relative" ref={flowMenuRef}>
              <button
                type="button"
                onClick={() => {
                  setIsFlowMenuOpen((prev) => !prev);
                  setIsOutputMenuOpen(false);
                  setIsQualityMenuOpen(false);
                  setIsMentionMenuOpen(false);
                }}
                className={pillButtonClassName}
              >
                {selectedFlow}
                <ChevronDown size={14} className={isFlowMenuOpen ? 'rotate-180 transition-transform' : 'transition-transform'} />
              </button>
              {isFlowMenuOpen && (
                <div className="absolute left-0 top-full z-20 mt-2 w-[220px] rounded-[18px] border border-[#2A2A2C] bg-[#141415] p-2 shadow-[0_8px_40px_rgba(0,0,0,0.45)]">
                  {['Guided Script Flow', 'Script-first', 'Direct Generation', 'Split View Assets'].map((item) => (
                    <button
                      key={item}
                      type="button"
                      onClick={() => {
                        setSelectedFlow(item);
                        setIsFlowMenuOpen(false);
                      }}
                      className={`flex w-full items-center justify-between rounded-xl px-3 py-2 text-left text-[12px] transition-all ${
                        selectedFlow === item
                          ? 'bg-[#1E1E20] text-[#FFFFFF]'
                          : 'text-[#B0B0B6] hover:bg-[#1A1A1C] hover:text-[#FFFFFF]'
                      }`}
                    >
                      <span>{item}</span>
                      {selectedFlow === item ? <CheckCircle2 size={14} className="text-[#FF843D]" /> : null}
                    </button>
                  ))}
                </div>
              )}
            </div>

            <div className="relative" ref={outputMenuRef}>
              <button
                type="button"
                onClick={() => {
                  setIsOutputMenuOpen((prev) => !prev);
                  setIsFlowMenuOpen(false);
                  setIsQualityMenuOpen(false);
                  setIsMentionMenuOpen(false);
                }}
                className={pillButtonClassName}
              >
                {outputSpecLabel}
                <ChevronDown size={14} className={isOutputMenuOpen ? 'rotate-180 transition-transform' : 'transition-transform'} />
              </button>
              {isOutputMenuOpen && (
                <div className="absolute left-0 top-full z-20 mt-2 w-[280px] rounded-[18px] border border-[#2A2A2C] bg-[#141415] p-4 shadow-[0_8px_40px_rgba(0,0,0,0.45)]">
                  <div className="space-y-4">
                    <div>
                      <div className="mb-2 text-[11px] font-semibold uppercase tracking-[0.18em] text-[#8E8E93]">
                        Aspect Mode
                      </div>
                      <div className="inline-flex rounded-full border border-[#2A2A2C] bg-[#101011] p-1">
                        {[
                          { label: 'Customize', value: 'customize' as const },
                          { label: 'Auto', value: 'auto' as const },
                        ].map((mode) => (
                          <button
                            key={mode.value}
                            type="button"
                            onClick={() => setOutputMode(mode.value)}
                            className={`rounded-full px-4 py-1.5 text-[12px] font-medium transition-all ${
                              outputMode === mode.value
                                ? 'bg-[#FF843D] text-white'
                                : 'text-[#B0B0B6] hover:text-[#FFFFFF]'
                            }`}
                          >
                            {mode.label}
                          </button>
                        ))}
                      </div>
                      {outputMode === 'auto' && (
                        <div className="mt-2 text-[11px] leading-5 text-[#8E8E93]">
                          Auto selected. Output settings stay visible but are not editable.
                        </div>
                      )}
                    </div>
                    <div>
                      <div className="mb-2 text-[11px] font-semibold uppercase tracking-[0.18em] text-[#8E8E93]">
                        Aspect Ratio
                      </div>
                      <div className="flex gap-2">
                        {['9:16', '16:9', '1:1'].map((ratio) => (
                          <button
                            key={ratio}
                            type="button"
                            disabled={outputMode === 'auto'}
                            onClick={() => setOutputSettings((prev) => ({ ...prev, aspectRatio: ratio }))}
                            className={`rounded-lg px-3 py-1.5 text-[12px] transition-all ${
                              outputSettings.aspectRatio === ratio
                                ? 'bg-[#FF843D] text-white'
                                : 'bg-[#101011] text-[#B0B0B6] hover:text-[#FFFFFF]'
                            } ${outputMode === 'auto' ? 'cursor-not-allowed opacity-45' : ''}`}
                          >
                            {ratio}
                          </button>
                        ))}
                      </div>
                    </div>
                    <div>
                      <div className="mb-2 text-[11px] font-semibold uppercase tracking-[0.18em] text-[#8E8E93]">
                        Duration
                      </div>
                      <div className="flex gap-2">
                        {['10s', '15s', '30s'].map((duration) => (
                          <button
                            key={duration}
                            type="button"
                            disabled={outputMode === 'auto'}
                            onClick={() => setOutputSettings((prev) => ({ ...prev, duration }))}
                            className={`rounded-lg px-3 py-1.5 text-[12px] transition-all ${
                              outputSettings.duration === duration
                                ? 'bg-[#FF843D] text-white'
                                : 'bg-[#101011] text-[#B0B0B6] hover:text-[#FFFFFF]'
                            } ${outputMode === 'auto' ? 'cursor-not-allowed opacity-45' : ''}`}
                          >
                            {duration}
                          </button>
                        ))}
                      </div>
                    </div>
                    <div>
                      <div className="mb-2 text-[11px] font-semibold uppercase tracking-[0.18em] text-[#8E8E93]">
                        Resolution
                      </div>
                      <div className="flex gap-2">
                        {['720p', '1080p'].map((resolution) => (
                          <button
                            key={resolution}
                            type="button"
                            disabled={outputMode === 'auto'}
                            onClick={() => setOutputSettings((prev) => ({ ...prev, resolution }))}
                            className={`rounded-lg px-3 py-1.5 text-[12px] transition-all ${
                              outputSettings.resolution === resolution
                                ? 'bg-[#FF843D] text-white'
                                : 'bg-[#101011] text-[#B0B0B6] hover:text-[#FFFFFF]'
                            } ${outputMode === 'auto' ? 'cursor-not-allowed opacity-45' : ''}`}
                          >
                            {resolution}
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>

            <div className="relative" ref={mentionMenuRef}>
              <button
                type="button"
                disabled={isMentionDisabled}
                onClick={() => {
                  if (isMentionDisabled) return;
                  setIsMentionMenuOpen((prev) => !prev);
                  setIsFlowMenuOpen(false);
                  setIsOutputMenuOpen(false);
                  setIsQualityMenuOpen(false);
                }}
                className={`${pillButtonClassName} ${isMentionDisabled ? 'cursor-not-allowed opacity-45 hover:border-[#2A2A2C] hover:text-[#D4D4D8]' : ''}`}
              >
                <AtSign size={14} />
              </button>
              {isMentionMenuOpen && (
                <div className="absolute left-0 top-full z-20 mt-2 w-[300px] rounded-[18px] border border-[#2A2A2C] bg-[#141415] p-2 shadow-[0_8px_40px_rgba(0,0,0,0.45)]">
                  <div className="px-3 py-2 text-[11px] font-semibold uppercase tracking-[0.18em] text-[#8E8E93]">
                    Asset Mentions
                  </div>
                  {resolvedMentionAssets.map((asset) => (
                    <button
                      key={asset.id}
                      type="button"
                      onClick={() => appendMention(asset.name)}
                      className={`flex w-full items-center gap-3 rounded-xl px-3 py-3 text-left text-[#B0B0B6] transition-all hover:bg-[#1A1A1C] hover:text-[#FFFFFF] ${
                        mentionDisplayMode === 'compact' ? 'items-center' : ''
                      }`}
                    >
                      {asset.thumbnail ? (
                        <img
                          src={asset.thumbnail}
                          alt={asset.name}
                          className="h-9 w-9 shrink-0 rounded-[12px] border border-[#2A2A2C] object-cover"
                        />
                      ) : (
                        <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-[12px] border border-[#2A2A2C] bg-[#101011] text-[#FF843D]">
                          <FolderOpen size={15} />
                        </div>
                      )}
                      <div className="min-w-0">
                        <div className="text-[12px] font-medium text-[#FFFFFF]">{asset.name}</div>
                        {mentionDisplayMode === 'detailed' && asset.role && (
                          <div className="mt-1 text-[11px] leading-5 text-[#8E8E93]">{asset.role}</div>
                        )}
                      </div>
                    </button>
                  ))}
                </div>
              )}
            </div>

            <div className="relative" ref={qualityMenuRef}>
              <button
                type="button"
                onClick={() => {
                  setIsQualityMenuOpen((prev) => !prev);
                  setIsFlowMenuOpen(false);
                  setIsOutputMenuOpen(false);
                  setIsMentionMenuOpen(false);
                }}
                className={pillButtonClassName}
              >
                {selectedQuality}
                <ChevronDown size={14} className={isQualityMenuOpen ? 'rotate-180 transition-transform' : 'transition-transform'} />
              </button>
              {isQualityMenuOpen && (
                <div className="absolute left-0 top-full z-20 mt-2 w-[180px] rounded-[18px] border border-[#2A2A2C] bg-[#141415] p-2 shadow-[0_8px_40px_rgba(0,0,0,0.45)]">
                  {['Standard', 'High Quality', 'Fast Draft'].map((quality) => (
                    <button
                      key={quality}
                      type="button"
                      onClick={() => {
                        setSelectedQuality(quality);
                        setIsQualityMenuOpen(false);
                      }}
                      className={`flex w-full items-center justify-between rounded-xl px-3 py-2 text-left text-[12px] transition-all ${
                        selectedQuality === quality
                          ? 'bg-[#1E1E20] text-[#FFFFFF]'
                          : 'text-[#B0B0B6] hover:bg-[#1A1A1C] hover:text-[#FFFFFF]'
                      }`}
                    >
                      <span>{quality}</span>
                      {selectedQuality === quality ? <CheckCircle2 size={14} className="text-[#FF843D]" /> : null}
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>

          {showCta ? (
            <button
              onClick={() => {
                closeComposerMenus();
                onCta?.(chatInput.trim(), {
                  attachedAssets: attachedAssets.map((asset) => asset.file),
                });
                setChatInput('');
              }}
              disabled={isCtaDisabled}
              className="inline-flex w-full items-center justify-center gap-2 rounded-full bg-[#FF843D] px-5 py-3 text-[13px] font-medium text-white transition-all hover:bg-[#FFA465] disabled:cursor-not-allowed disabled:opacity-45 md:w-auto"
            >
              {ctaLabel} <ChevronRight size={14} />
            </button>
          ) : (
            <div className="text-[12px] leading-6 text-[#8E8E93] md:text-right">
              {footerNote}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
