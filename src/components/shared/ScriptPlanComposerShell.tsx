import { useEffect, useMemo, useRef, useState } from 'react';
import {
  AtSign,
  FolderOpen,
  ImagePlus,
  Images,
  Loader2,
  Plus,
  Sparkles,
  Wand2,
  X,
} from 'lucide-react';
import { useGenerateStore } from '@/stores/useGenerateStore';

type MentionAsset = {
  id: string;
  name: string;
  role: string;
  thumbnailUrl?: string;
};

type ScriptShotOption = {
  id: string;
  label: string;
  time: string;
  title: string;
};

type PanelMode = null | 'revise' | 'generateImage' | 'ideation' | 'assets' | 'result';

type ScriptPlanComposerShellProps = {
  mentionAssets: MentionAsset[];
  resetKey: string;
  scriptShots: ScriptShotOption[];
  activeShotId?: string | null;
  actionLabel?: string;
  onAction?: (input: string) => void;
  footerNote?: string;
  onInputFocusChange?: (isFocused: boolean) => void;
  onPopoverStateChange?: (isOpen: boolean) => void;
  onInteractionLockChange?: (isLocked: boolean) => void;
};

type ComposerAsset = MentionAsset & {
  sourceType: 'context' | 'upload' | 'generated';
};

type GeneratedAssetCard = {
  id: string;
  name: string;
  thumbnailUrl: string;
  sourceShotLabel: string;
  purpose: string;
};

type IdeationSuggestion = {
  id: string;
  title: string;
  description: string;
  actionLabel: string;
};

function makeMockAssetThumbnail(title: string, accent: string) {
  const svg = `
    <svg xmlns="http://www.w3.org/2000/svg" width="240" height="160" viewBox="0 0 240 160" fill="none">
      <rect width="240" height="160" rx="24" fill="#121214"/>
      <rect x="10" y="10" width="220" height="140" rx="18" fill="url(#g)"/>
      <circle cx="66" cy="64" r="34" fill="rgba(255,255,255,0.08)"/>
      <rect x="116" y="42" width="74" height="12" rx="6" fill="rgba(255,255,255,0.16)"/>
      <rect x="116" y="64" width="58" height="10" rx="5" fill="rgba(255,255,255,0.1)"/>
      <rect x="116" y="84" width="44" height="10" rx="5" fill="rgba(255,255,255,0.1)"/>
      <text x="24" y="134" fill="#F6F6F8" font-size="14" font-family="Arial, sans-serif">${title.slice(0, 22)}</text>
      <defs>
        <linearGradient id="g" x1="18" y1="18" x2="218" y2="146" gradientUnits="userSpaceOnUse">
          <stop stop-color="${accent}"/>
          <stop offset="0.52" stop-color="#6C63FF"/>
          <stop offset="1" stop-color="#1A1A21"/>
        </linearGradient>
      </defs>
    </svg>
  `;
  return `data:image/svg+xml;charset=UTF-8,${encodeURIComponent(svg)}`;
}

function PanelHeader({
  title,
  description,
  onClose,
}: {
  title: string;
  description: string;
  onClose: () => void;
}) {
  return (
    <div className="flex items-start justify-between gap-4 border-b border-[rgba(255,255,255,0.08)] px-4 py-3">
      <div>
        <h3 className="text-[13px] font-semibold uppercase tracking-[0.18em] text-[#FFFFFF]">{title}</h3>
        <p className="mt-1 max-w-[720px] text-[12px] leading-6 text-[#8E8E93]">{description}</p>
      </div>
      <button
        type="button"
        onClick={onClose}
        className="inline-flex h-8 w-8 items-center justify-center rounded-full border border-[rgba(255,255,255,0.08)] bg-[#101011] text-[#8E8E93] transition-all hover:border-[rgba(255,132,61,0.36)] hover:text-[#FFFFFF]"
      >
        <X size={14} />
      </button>
    </div>
  );
}

function ChoiceButton({
  label,
  active,
  onClick,
}: {
  label: string;
  active: boolean;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`rounded-full border px-3 py-1.5 text-[12px] transition-all ${
        active
          ? 'border-[rgba(255,132,61,0.42)] bg-[rgba(255,132,61,0.12)] text-[#FFFFFF]'
          : 'border-[#2A2A2C] bg-[#101011] text-[#A9A9AF] hover:border-[rgba(255,132,61,0.28)] hover:text-[#FFFFFF]'
      }`}
    >
      {label}
    </button>
  );
}

export function ScriptPlanComposerShell({
  mentionAssets,
  resetKey,
  scriptShots,
  activeShotId,
  actionLabel,
  onAction,
  footerNote = 'Composer interactions stay local and do not change the current script plan.',
  onInputFocusChange,
  onPopoverStateChange,
  onInteractionLockChange,
}: ScriptPlanComposerShellProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const addFiles = useGenerateStore((state) => state.addFiles);
  const addMockPreview = useGenerateStore((state) => state.addMockPreview);

  const [chatInput, setChatInput] = useState('');
  const [panelMode, setPanelMode] = useState<PanelMode>(null);
  const [localUploads, setLocalUploads] = useState<ComposerAsset[]>([]);
  const [generatedAssets, setGeneratedAssets] = useState<GeneratedAssetCard[]>([]);
  const [resultTitle, setResultTitle] = useState('Action Complete');
  const [resultMessage, setResultMessage] = useState('');

  const [reviseTarget, setReviseTarget] = useState('All Shots');
  const [selectedShotIds, setSelectedShotIds] = useState<string[]>(() => scriptShots.map((shot) => shot.id));
  const [revisionPrompt, setRevisionPrompt] = useState('');
  const [isApplyingRevision, setIsApplyingRevision] = useState(false);

  const [imageSource, setImageSource] = useState('Current Shot');
  const [imagePurpose, setImagePurpose] = useState('Storyboard Frame');
  const [selectedImageShotId, setSelectedImageShotId] = useState(activeShotId || scriptShots[0]?.id || '');
  const [imagePrompt, setImagePrompt] = useState('');
  const [isGeneratingImage, setIsGeneratingImage] = useState(false);

  const [ideationMode, setIdeationMode] = useState('Extend the Script');
  const [ideationPrompt, setIdeationPrompt] = useState('');
  const [ideationSuggestions, setIdeationSuggestions] = useState<IdeationSuggestion[]>([]);
  const [isRunningIdeation, setIsRunningIdeation] = useState(false);

  useEffect(() => {
    setChatInput('');
    setPanelMode(null);
    setLocalUploads([]);
    setGeneratedAssets([]);
    setResultTitle('Action Complete');
    setResultMessage('');
    setReviseTarget('All Shots');
    setSelectedShotIds(scriptShots.map((shot) => shot.id));
    setRevisionPrompt('');
    setImageSource('Current Shot');
    setImagePurpose('Storyboard Frame');
    setSelectedImageShotId(activeShotId || scriptShots[0]?.id || '');
    setImagePrompt('');
    setIdeationMode('Extend the Script');
    setIdeationPrompt('');
    setIdeationSuggestions([]);
    setIsApplyingRevision(false);
    setIsGeneratingImage(false);
    setIsRunningIdeation(false);
  }, [activeShotId, resetKey, scriptShots]);

  useEffect(() => {
    onPopoverStateChange?.(false);
  }, [onPopoverStateChange]);

  const availableAssets = useMemo(() => {
    const dedupe = new Map<string, ComposerAsset>();
    [
      ...mentionAssets.map((asset) => ({ ...asset, sourceType: 'context' as const })),
      ...localUploads,
      ...generatedAssets.map((asset) => ({
        id: asset.id,
        name: asset.name,
        role: asset.sourceShotLabel,
        thumbnailUrl: asset.thumbnailUrl,
        sourceType: 'generated' as const,
      })),
    ].forEach((asset) => {
      dedupe.set(asset.id, asset);
    });
    return Array.from(dedupe.values());
  }, [generatedAssets, localUploads, mentionAssets]);

  const isInteractionLocked =
    panelMode !== null || isApplyingRevision || isGeneratingImage || isRunningIdeation;

  useEffect(() => {
    onInteractionLockChange?.(isInteractionLocked);
  }, [isInteractionLocked, onInteractionLockChange]);

  const setPanelResult = (title: string, message: string) => {
    setResultTitle(title);
    setResultMessage(message);
    setPanelMode('result');
  };

  const openPanel = (mode: Exclude<PanelMode, null>) => {
    setPanelMode(mode);
  };

  const handlePrimaryAction = () => {
    const input = chatInput.trim();
    if (!input) return;

    if (onAction) {
      onAction(input);
    } else {
      setPanelResult('Generate Queued', `Prepared a local mock generation request from your latest prompt: "${input}".`);
    }

    setChatInput('');
    window.setTimeout(() => {
      textareaRef.current?.focus();
    }, 0);
  };

  const appendMention = (assetName: string) => {
    const mention = `@${assetName.split(' · ')[0]}`;
    setChatInput((prev) => {
      const normalized = prev.trimEnd();
      return normalized ? `${normalized} ${mention} ` : `${mention} `;
    });
    setPanelMode(null);
    window.setTimeout(() => {
      textareaRef.current?.focus();
      const value = textareaRef.current?.value ?? '';
      textareaRef.current?.setSelectionRange(value.length, value.length);
    }, 0);
  };

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(event.target.files || []);
    if (!files.length) return;

    addFiles(files);

    const nextUploads = files.map((file, index) => ({
      id: `local-upload-${Date.now()}-${index}`,
      name: file.name,
      role: file.type.startsWith('image/') ? 'Uploaded visual asset' : 'Uploaded asset',
      thumbnailUrl: file.type.startsWith('image/') ? URL.createObjectURL(file) : undefined,
      sourceType: 'upload' as const,
    }));

    setLocalUploads((prev) => [...nextUploads, ...prev]);
    setPanelMode('assets');
    event.target.value = '';
  };

  const handleApplyRevision = () => {
    setIsApplyingRevision(true);
    window.setTimeout(() => {
      setIsApplyingRevision(false);
      setPanelResult(
        'Revision Applied',
        reviseTarget === 'All Shots'
          ? 'Revision applied to all selected shots. Updated pacing and softened the selected visual language.'
          : 'Revision applied to the selected script section. Updated pacing and softened the selected visual language.',
      );
    }, 900);
  };

  const handleGenerateImage = () => {
    setIsGeneratingImage(true);
    window.setTimeout(() => {
      const sourceShot =
        scriptShots.find((shot) => shot.id === selectedImageShotId) ||
        scriptShots.find((shot) => shot.id === activeShotId) ||
        scriptShots[0];
      const assetName = `${imagePurpose} · ${sourceShot?.title || 'Dream Shot'}`;
      const thumbnailUrl = makeMockAssetThumbnail(assetName, '#FF843D');
      const nextAsset: GeneratedAssetCard = {
        id: `generated-${Date.now()}`,
        name: assetName,
        thumbnailUrl,
        sourceShotLabel: sourceShot ? `${sourceShot.label} · ${sourceShot.time}` : 'Current Shot',
        purpose: imagePurpose,
      };
      setGeneratedAssets((prev) => [nextAsset, ...prev]);
      addMockPreview({
        id: nextAsset.id,
        url: nextAsset.thumbnailUrl,
        type: 'image',
        name: nextAsset.name,
      });
      setIsGeneratingImage(false);
      setPanelMode('generateImage');
    }, 1100);
  };

  const handleRunIdeation = () => {
    setIsRunningIdeation(true);
    window.setTimeout(() => {
      setIdeationSuggestions([
        {
          id: 'idea-1',
          title: 'Make the space feel remembered, not designed',
          description: 'Reduce literal room details and emphasize partial textures, soft thresholds, and light falling across surfaces.',
          actionLabel: 'Apply to Visual Direction',
        },
        {
          id: 'idea-2',
          title: 'Let the subject drift instead of perform',
          description: 'Keep movement slow, almost weightless, and avoid overtly intentional gestures so the sequence remains dreamlike.',
          actionLabel: 'Apply to Motion',
        },
        {
          id: 'idea-3',
          title: 'Strengthen emotional bloom before the fade',
          description: 'Add one gentle rise in warmth or luminance around shot 04 so the final fade leaves a stronger afterimage.',
          actionLabel: 'Apply to Rhythm',
        },
        {
          id: 'idea-4',
          title: 'Use the generated image as a mood bridge',
          description: 'Turn one soft-focus frame into a reference asset and reuse its palette to connect multiple shots more tightly.',
          actionLabel: 'Use as Reference',
        },
      ]);
      setIsRunningIdeation(false);
    }, 900);
  };

  const renderPanel = () => {
    if (!panelMode) return null;

    if (panelMode === 'revise') {
      return (
        <>
          <PanelHeader
            title="Revise Script"
            description="Select which part of the script you want to revise, then describe the adjustment."
            onClose={() => setPanelMode(null)}
          />
          <div className="space-y-4 px-4 py-4">
            <div>
              <div className="mb-2 text-[11px] font-semibold uppercase tracking-[0.18em] text-[#8E8E93]">Target Range</div>
              <div className="flex flex-wrap gap-2">
                {['All Shots', 'Current Shot', 'Selected Shots', 'Script Summary', 'Rhythm / Structure', 'Copy Only', 'Camera / Visual Direction'].map((item) => (
                  <ChoiceButton
                    key={item}
                    label={item}
                    active={reviseTarget === item}
                    onClick={() => {
                      setReviseTarget(item);
                      if (item === 'All Shots') {
                        setSelectedShotIds(scriptShots.map((shot) => shot.id));
                      }
                      if (item === 'Current Shot' && activeShotId) {
                        setSelectedShotIds([activeShotId]);
                      }
                    }}
                  />
                ))}
              </div>
            </div>

            <div>
              <div className="mb-2 text-[11px] font-semibold uppercase tracking-[0.18em] text-[#8E8E93]">Shot Selector</div>
              <div className="grid gap-2 md:grid-cols-2">
                {scriptShots.map((shot) => {
                  const active = selectedShotIds.includes(shot.id);
                  return (
                    <button
                      key={shot.id}
                      type="button"
                      onClick={() => {
                        setReviseTarget('Selected Shots');
                        setSelectedShotIds((prev) => (active ? prev.filter((item) => item !== shot.id) : [...prev, shot.id]));
                      }}
                      className={`rounded-[16px] border px-3 py-3 text-left transition-all ${
                        active
                          ? 'border-[rgba(255,132,61,0.4)] bg-[rgba(255,132,61,0.1)]'
                          : 'border-[#2A2A2C] bg-[#101011] hover:border-[rgba(255,132,61,0.25)]'
                      }`}
                    >
                      <div className="text-[12px] font-medium text-[#FFFFFF]">{shot.label} · {shot.time} · {shot.title}</div>
                    </button>
                  );
                })}
              </div>
            </div>

            <textarea
              value={revisionPrompt}
              onChange={(event) => setRevisionPrompt(event.target.value)}
              placeholder="Describe how you want to revise the selected script section..."
              className="min-h-[96px] w-full resize-none rounded-[18px] border border-[#2A2A2C] bg-[#101011] px-4 py-3 text-[13px] leading-6 text-[#F3F3F5] placeholder:text-[#6F6F77] outline-none transition-all focus:border-[rgba(255,132,61,0.34)]"
            />

            <div className="flex justify-end">
              <button
                type="button"
                onClick={handleApplyRevision}
                disabled={isApplyingRevision || !revisionPrompt.trim()}
                className="inline-flex items-center gap-2 rounded-full bg-[#FF843D] px-5 py-2.5 text-[13px] font-medium text-white transition-all hover:bg-[#FFA465] disabled:cursor-not-allowed disabled:opacity-45"
              >
                {isApplyingRevision ? <Loader2 size={14} className="animate-spin" /> : null}
                Apply Revision
              </button>
            </div>
          </div>
        </>
      );
    }

    if (panelMode === 'generateImage') {
      return (
        <>
          <PanelHeader
            title="Generate Image"
            description="Create a visual asset from a selected shot or a custom prompt. Generated images will be saved to Assets."
            onClose={() => setPanelMode(null)}
          />
          <div className="space-y-4 px-4 py-4">
            <div>
              <div className="mb-2 text-[11px] font-semibold uppercase tracking-[0.18em] text-[#8E8E93]">Source</div>
              <div className="flex flex-wrap gap-2">
                {['Current Shot', 'Selected Shot', 'Full Script Mood', 'Custom Prompt'].map((item) => (
                  <ChoiceButton key={item} label={item} active={imageSource === item} onClick={() => setImageSource(item)} />
                ))}
              </div>
            </div>

            <div>
              <div className="mb-2 text-[11px] font-semibold uppercase tracking-[0.18em] text-[#8E8E93]">Image Purpose</div>
              <div className="flex flex-wrap gap-2">
                {['Storyboard Frame', 'Character Reference', 'Environment Reference', 'Mood / Lighting Reference', 'Asset Variation'].map((item) => (
                  <ChoiceButton key={item} label={item} active={imagePurpose === item} onClick={() => setImagePurpose(item)} />
                ))}
              </div>
            </div>

            <div>
              <div className="mb-2 text-[11px] font-semibold uppercase tracking-[0.18em] text-[#8E8E93]">Shot</div>
              <div className="flex flex-wrap gap-2">
                {scriptShots.map((shot) => (
                  <ChoiceButton
                    key={shot.id}
                    label={`${shot.label} · ${shot.title}`}
                    active={selectedImageShotId === shot.id}
                    onClick={() => setSelectedImageShotId(shot.id)}
                  />
                ))}
              </div>
            </div>

            <textarea
              value={imagePrompt}
              onChange={(event) => setImagePrompt(event.target.value)}
              placeholder="Describe the image or visual asset you want to generate..."
              className="min-h-[96px] w-full resize-none rounded-[18px] border border-[#2A2A2C] bg-[#101011] px-4 py-3 text-[13px] leading-6 text-[#F3F3F5] placeholder:text-[#6F6F77] outline-none transition-all focus:border-[rgba(255,132,61,0.34)]"
            />

            <div className="flex items-center justify-between gap-4">
              <div className="text-[12px] text-[#8E8E93]">
                {isGeneratingImage ? 'Generating visual asset...' : 'Generated images stay local and are added to Assets as mock results.'}
              </div>
              <button
                type="button"
                onClick={handleGenerateImage}
                disabled={isGeneratingImage}
                className="inline-flex items-center gap-2 rounded-full bg-[#FF843D] px-5 py-2.5 text-[13px] font-medium text-white transition-all hover:bg-[#FFA465] disabled:cursor-not-allowed disabled:opacity-45"
              >
                {isGeneratingImage ? <Loader2 size={14} className="animate-spin" /> : <ImagePlus size={14} />}
                Generate Image
              </button>
            </div>

            {generatedAssets.length > 0 && (
              <div className="grid gap-3 md:grid-cols-2">
                {generatedAssets.map((asset) => (
                  <div key={asset.id} className="rounded-[18px] border border-[#2A2A2C] bg-[#101011] p-3">
                    <img src={asset.thumbnailUrl} alt={asset.name} className="h-[140px] w-full rounded-[14px] object-cover" />
                    <div className="mt-3 text-[13px] font-medium text-[#FFFFFF]">{asset.name}</div>
                    <div className="mt-1 text-[11px] text-[#8E8E93]">{asset.sourceShotLabel}</div>
                    <div className="mt-3 flex gap-2">
                      <button
                        type="button"
                        onClick={() => setPanelResult('Attached to Shot', `${asset.name} is now attached to the selected shot as a local mock asset.`)}
                        className="rounded-full border border-[#2A2A2C] px-3 py-1.5 text-[11px] text-[#D9D9DE] transition-all hover:border-[rgba(255,132,61,0.28)] hover:text-[#FFFFFF]"
                      >
                        Attach to Shot
                      </button>
                      <button
                        type="button"
                        onClick={() => setPanelResult('Saved to Assets', `${asset.name} was added to Assets and is available from the asset quick panel.`)}
                        className="rounded-full border border-[#2A2A2C] px-3 py-1.5 text-[11px] text-[#D9D9DE] transition-all hover:border-[rgba(255,132,61,0.28)] hover:text-[#FFFFFF]"
                      >
                        View in Assets
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </>
      );
    }

    if (panelMode === 'ideation') {
      return (
        <>
          <PanelHeader
            title="Ideation"
            description="Explore new directions, references, or extensions for the current script."
            onClose={() => setPanelMode(null)}
          />
          <div className="space-y-4 px-4 py-4">
            <div>
              <div className="mb-2 text-[11px] font-semibold uppercase tracking-[0.18em] text-[#8E8E93]">Ideation Mode</div>
              <div className="flex flex-wrap gap-2">
                {['Extend the Script', 'Explore Alternatives', 'Find Visual References', 'Strengthen Emotion', 'Improve Pacing', 'Add Scene Ideas'].map((item) => (
                  <ChoiceButton key={item} label={item} active={ideationMode === item} onClick={() => setIdeationMode(item)} />
                ))}
              </div>
            </div>

            <textarea
              value={ideationPrompt}
              onChange={(event) => setIdeationPrompt(event.target.value)}
              placeholder="Ask for creative directions, references, or script expansion ideas..."
              className="min-h-[96px] w-full resize-none rounded-[18px] border border-[#2A2A2C] bg-[#101011] px-4 py-3 text-[13px] leading-6 text-[#F3F3F5] placeholder:text-[#6F6F77] outline-none transition-all focus:border-[rgba(255,132,61,0.34)]"
            />

            <div className="flex justify-end">
              <button
                type="button"
                onClick={handleRunIdeation}
                disabled={isRunningIdeation}
                className="inline-flex items-center gap-2 rounded-full bg-[#FF843D] px-5 py-2.5 text-[13px] font-medium text-white transition-all hover:bg-[#FFA465] disabled:cursor-not-allowed disabled:opacity-45"
              >
                {isRunningIdeation ? <Loader2 size={14} className="animate-spin" /> : <Sparkles size={14} />}
                Run Ideation
              </button>
            </div>

            {ideationSuggestions.length > 0 && (
              <div className="grid gap-3">
                {ideationSuggestions.map((suggestion) => (
                  <div key={suggestion.id} className="rounded-[18px] border border-[#2A2A2C] bg-[#101011] p-4">
                    <div className="text-[13px] font-medium text-[#FFFFFF]">{suggestion.title}</div>
                    <p className="mt-2 text-[12px] leading-6 text-[#B0B0B6]">{suggestion.description}</p>
                    <button
                      type="button"
                      onClick={() => setPanelResult('Suggestion Applied', `${suggestion.actionLabel} is now reflected as a local mock direction for the current script.`)}
                      className="mt-3 rounded-full border border-[#2A2A2C] px-3 py-1.5 text-[11px] text-[#D9D9DE] transition-all hover:border-[rgba(255,132,61,0.28)] hover:text-[#FFFFFF]"
                    >
                      {suggestion.actionLabel}
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        </>
      );
    }

    if (panelMode === 'assets') {
      return (
        <>
          <PanelHeader
            title="Assets"
            description="Browse current references, uploads, and generated images for this script. Click an item to insert it as an @ mention."
            onClose={() => setPanelMode(null)}
          />
          <div className="space-y-4 px-4 py-4">
            <div className="flex flex-wrap gap-2">
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="inline-flex items-center gap-2 rounded-full border border-[#2A2A2C] bg-[#101011] px-3 py-2 text-[12px] text-[#D9D9DE] transition-all hover:border-[rgba(255,132,61,0.28)] hover:text-[#FFFFFF]"
              >
                <Plus size={14} />
                Upload Asset
              </button>
              <button
                type="button"
                onClick={() => setPanelResult('Asset Library Ready', 'Recent uploads and generated assets are available in the quick asset panel for this mock script workspace.')}
                className="inline-flex items-center gap-2 rounded-full border border-[#2A2A2C] bg-[#101011] px-3 py-2 text-[12px] text-[#D9D9DE] transition-all hover:border-[rgba(255,132,61,0.28)] hover:text-[#FFFFFF]"
              >
                <FolderOpen size={14} />
                Asset Library
              </button>
            </div>

            {availableAssets.length > 0 ? (
              <div className="grid gap-2">
                {availableAssets.map((asset) => (
                  <button
                    key={asset.id}
                    type="button"
                    onClick={() => appendMention(asset.name)}
                    className="flex items-center gap-3 rounded-[16px] border border-[#2A2A2C] bg-[#101011] px-3 py-3 text-left transition-all hover:border-[rgba(255,132,61,0.28)] hover:bg-[#161618]"
                  >
                    {asset.thumbnailUrl ? (
                      <img src={asset.thumbnailUrl} alt={asset.name} className="h-10 w-10 rounded-[12px] object-cover" />
                    ) : (
                      <div className="flex h-10 w-10 items-center justify-center rounded-[12px] border border-[#2A2A2C] bg-[#161618] text-[#FF843D]">
                        <Images size={15} />
                      </div>
                    )}
                    <div className="min-w-0 text-[12px] font-medium text-[#FFFFFF]">{asset.name}</div>
                  </button>
                ))}
              </div>
            ) : (
              <div className="rounded-[18px] border border-dashed border-[#2A2A2C] bg-[#101011] px-4 py-5 text-[12px] text-[#8E8E93]">
                No assets available in this script context yet.
              </div>
            )}
          </div>
        </>
      );
    }

    return (
      <>
        <PanelHeader
          title={resultTitle}
          description="Latest mock action result from the script workspace."
          onClose={() => setPanelMode(null)}
        />
        <div className="px-4 py-5">
          <div className="rounded-[18px] border border-[rgba(255,255,255,0.08)] bg-[#101011] px-4 py-4 text-[13px] leading-6 text-[#D9D9DE]">
            {resultMessage}
          </div>
        </div>
      </>
    );
  };

  const showActionButton = Boolean(actionLabel);
  const isPrimaryActionDisabled = !chatInput.trim();

  return (
    <div className="w-full">
      <input
        ref={fileInputRef}
        type="file"
        multiple
        accept="image/*,video/*,text/plain,.txt,.md,.doc,.docx,.pdf,.csv,.xlsx,.xls"
        onChange={handleFileSelect}
        className="hidden"
      />

      <div
        className={`mb-3 overflow-hidden rounded-[26px] border border-[rgba(255,255,255,0.08)] bg-[rgba(18,18,19,0.96)] shadow-[0_18px_48px_rgba(0,0,0,0.36)] backdrop-blur-md transition-all duration-200 ease-out ${
          panelMode ? 'pointer-events-auto max-h-[420px] translate-y-0 opacity-100 scale-100' : 'pointer-events-none max-h-0 translate-y-3 opacity-0 scale-[0.985]'
        }`}
      >
        {renderPanel()}
      </div>

      <div className="rounded-[30px] border border-[rgba(255,255,255,0.08)] bg-[rgba(18,18,19,0.92)] p-4 md:p-5 shadow-[0_1px_3px_rgba(0,0,0,0.3)] backdrop-blur-sm">
        <div className="flex flex-col gap-4">
          <div className="flex gap-4">
            <button
              type="button"
              onClick={() => {
                openPanel('assets');
                fileInputRef.current?.click();
              }}
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
              placeholder="Refine the script, request a new image, reference assets, or explore fresh ideas..."
              className="min-h-[72px] flex-1 resize-none rounded-[22px] bg-[#101011] px-4 py-4 text-[14px] leading-7 text-[#F3F3F5] placeholder:text-[#6F6F77] outline-none transition-all focus:ring-2 focus:ring-[#FF843D]/20"
            />
          </div>

          <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
            <div className="flex flex-wrap items-center gap-2">
              <button type="button" onClick={() => openPanel('revise')} className="inline-flex items-center gap-2 rounded-full border border-[#2A2A2C] bg-[#101011] px-3 py-1.5 text-[12px] text-[#D4D4D8] transition-all hover:border-[#FF843D] hover:text-[#FFFFFF]">
                <Wand2 size={14} />
                Revise
              </button>
              <button type="button" onClick={() => openPanel('generateImage')} className="inline-flex items-center gap-2 rounded-full border border-[#2A2A2C] bg-[#101011] px-3 py-1.5 text-[12px] text-[#D4D4D8] transition-all hover:border-[#FF843D] hover:text-[#FFFFFF]">
                <ImagePlus size={14} />
                Generate Image
              </button>
              <button type="button" onClick={() => openPanel('ideation')} className="inline-flex items-center gap-2 rounded-full border border-[#2A2A2C] bg-[#101011] px-3 py-1.5 text-[12px] text-[#D4D4D8] transition-all hover:border-[#FF843D] hover:text-[#FFFFFF]">
                <Sparkles size={14} />
                Ideation
              </button>
              <button type="button" onClick={() => openPanel('assets')} className="inline-flex items-center gap-2 rounded-full border border-[#2A2A2C] bg-[#101011] px-3 py-1.5 text-[12px] text-[#D4D4D8] transition-all hover:border-[#FF843D] hover:text-[#FFFFFF]">
                <FolderOpen size={14} />
                Asset Library
              </button>
              <button
                type="button"
                disabled={availableAssets.length === 0}
                onClick={() => {
                  if (!availableAssets.length) return;
                  openPanel('assets');
                }}
                className={`inline-flex items-center gap-2 rounded-full border px-3 py-1.5 text-[12px] transition-all ${
                  availableAssets.length === 0
                    ? 'cursor-not-allowed border-[#242426] bg-[#101011] text-[#5B5B62] opacity-50'
                    : 'border-[#2A2A2C] bg-[#101011] text-[#D4D4D8] hover:border-[#FF843D] hover:text-[#FFFFFF]'
                }`}
              >
                <AtSign size={14} />
              </button>
            </div>

            {showActionButton ? (
              <button
                type="button"
                onClick={handlePrimaryAction}
                disabled={isPrimaryActionDisabled}
                className="inline-flex items-center justify-center gap-2 rounded-full bg-[#FF843D] px-5 py-3 text-[13px] font-medium text-white transition-all hover:bg-[#FFA465] disabled:cursor-not-allowed disabled:opacity-45"
              >
                {actionLabel}
              </button>
            ) : (
              <div className="text-[12px] leading-6 text-[#8E8E93] md:text-right">{footerNote}</div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
