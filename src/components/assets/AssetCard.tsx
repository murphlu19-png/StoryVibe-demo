import { assetPath } from '@/lib/assetPath';
import {
  Check,
  FileAudio2,
  FileText,
  FolderOpen,
  Image as ImageIcon,
  Play,
  Settings2,
  Sparkles,
  SwatchBook,
} from 'lucide-react';
import type { LibraryAsset } from '@/lib/mockAssets';

const kindMeta = {
  image: { label: 'IMAGE', Icon: ImageIcon },
  video: { label: 'VIDEO', Icon: Play },
  audio: { label: 'AUDIO', Icon: FileAudio2 },
  text: { label: 'TEXT', Icon: FileText },
  pack: { label: 'PACK', Icon: FolderOpen },
  preset: { label: 'PRESET', Icon: Settings2 },
  style: { label: 'STYLE', Icon: SwatchBook },
} as const;

function AudioBars({ accent = '#FF843D' }: { accent?: string }) {
  const bars = [28, 40, 22, 48, 18, 34, 26, 42, 20];
  return (
    <div className="flex h-[88px] items-end gap-1">
      {bars.map((height, index) => (
        <span
          key={`${accent}-${index}`}
          className="w-2 rounded-full"
          style={{
            height,
            background: `linear-gradient(180deg, ${accent} 0%, rgba(255,255,255,0.12) 100%)`,
          }}
        />
      ))}
    </div>
  );
}

function TextCardVisual({ asset }: { asset: LibraryAsset }) {
  return (
    <div className="flex h-full flex-col justify-between rounded-[20px] border border-[rgba(255,255,255,0.08)] bg-[linear-gradient(180deg,#17171A_0%,#111113_100%)] p-4">
      <div className="inline-flex w-fit items-center gap-2 rounded-full border border-[rgba(255,255,255,0.08)] bg-[#101011] px-2.5 py-1 text-[10px] uppercase tracking-[0.18em] text-[#AFAFB5]">
        <FileText size={12} />
        Note
      </div>
      <div className="space-y-2">
        <div className="text-[16px] font-semibold text-white">{asset.name}</div>
        <div className="space-y-1.5 text-[11px] text-[#8E8E93]">
          <div className="h-2 w-full rounded-full bg-[#232327]" />
          <div className="h-2 w-5/6 rounded-full bg-[#232327]" />
          <div className="h-2 w-2/3 rounded-full bg-[#232327]" />
        </div>
      </div>
    </div>
  );
}

function StructuredPackVisual({ asset }: { asset: LibraryAsset }) {
  const Icon = kindMeta[asset.kind].Icon;
  return (
    <div className="relative flex h-full items-center justify-center overflow-hidden rounded-[20px] border border-[rgba(255,255,255,0.08)] bg-[radial-gradient(circle_at_top_left,#2A1B14_0%,#171719_48%,#101011_100%)]">
      <div className="absolute left-5 top-5 h-20 w-24 rounded-[18px] border border-[rgba(255,255,255,0.08)] bg-[rgba(255,255,255,0.04)]" />
      <div className="absolute left-10 top-8 h-20 w-24 rounded-[18px] border border-[rgba(255,132,61,0.28)] bg-[rgba(255,132,61,0.08)]" />
      <div className="relative z-10 flex flex-col items-center gap-3 text-center">
        <div className="inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-[rgba(255,132,61,0.14)] text-[#FFB07E]">
          <Icon size={22} />
        </div>
        <div className="text-[13px] font-medium text-white">{asset.kind === 'style' ? 'Style Bundle' : 'Library Pack'}</div>
      </div>
    </div>
  );
}

export function AssetCard({
  asset,
  selected,
  onToggle,
}: {
  asset: LibraryAsset;
  selected: boolean;
  onToggle: () => void;
}) {
  const meta = kindMeta[asset.kind];
  const Icon = meta.Icon;

  return (
    <button
      type="button"
      onClick={onToggle}
      className={`group flex h-full flex-col overflow-hidden rounded-[24px] border text-left transition-all ${
        selected
          ? 'border-[#FF843D] bg-[#121214] shadow-[0_0_0_1px_rgba(255,132,61,0.28)]'
          : 'border-[#232326] bg-[#121214] hover:border-[rgba(255,132,61,0.28)] hover:bg-[#151518]'
      }`}
    >
      <div className="relative aspect-[4/3] overflow-hidden bg-[#101011] p-3">
        {asset.kind === 'audio' ? (
          <div className="flex h-full items-center justify-center rounded-[20px] bg-[linear-gradient(180deg,#111113_0%,#16161B_100%)]">
            <AudioBars accent={asset.accent} />
          </div>
        ) : asset.kind === 'text' ? (
          <TextCardVisual asset={asset} />
        ) : asset.kind === 'pack' || asset.kind === 'preset' || asset.kind === 'style' ? (
          <StructuredPackVisual asset={asset} />
        ) : (
          <>
            <img
              src={asset.thumbnail || assetPath('/assets/story-1.jpg')}
              alt={asset.name}
              className="h-full w-full rounded-[20px] object-cover transition-all duration-300 group-hover:scale-[1.03] group-hover:brightness-110"
            />
            <div className="absolute inset-3 rounded-[20px] bg-gradient-to-t from-black/55 via-black/10 to-transparent" />
            {asset.kind === 'video' ? (
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="inline-flex h-12 w-12 items-center justify-center rounded-full bg-[rgba(0,0,0,0.45)] text-white backdrop-blur-sm">
                  <Play size={18} fill="currentColor" />
                </div>
              </div>
            ) : null}
          </>
        )}

        <div className="absolute left-5 top-5 inline-flex items-center gap-1.5 rounded-full border border-[rgba(255,255,255,0.08)] bg-[rgba(12,12,13,0.84)] px-2.5 py-1 text-[10px] uppercase tracking-[0.18em] text-[#F3F3F5] backdrop-blur-sm">
          <Icon size={12} />
          {meta.label}
        </div>

        {asset.duration ? (
          <div className="absolute right-5 top-5 rounded-full bg-[rgba(12,12,13,0.84)] px-2.5 py-1 text-[10px] font-medium text-[#F3F3F5] backdrop-blur-sm">
            {asset.duration}
          </div>
        ) : null}

        {selected ? (
          <div className="absolute right-5 bottom-5 inline-flex h-7 w-7 items-center justify-center rounded-full bg-[#FF843D] text-white shadow-[0_6px_20px_rgba(255,132,61,0.28)]">
            <Check size={14} />
          </div>
        ) : null}
      </div>

      <div className="flex flex-1 flex-col gap-2 px-4 pb-4 pt-3">
        <div className="flex items-start justify-between gap-3">
          <div className="min-w-0">
            <div className="truncate text-[14px] font-semibold text-white">{asset.name}</div>
            <div className="mt-1 line-clamp-2 text-[12px] leading-5 text-[#8E8E93]">{asset.description}</div>
          </div>
          {asset.source === 'generated' || asset.source === 'saved-idea' || asset.source === 'script-package' ? (
            <span className="inline-flex items-center gap-1 rounded-full bg-[rgba(255,132,61,0.12)] px-2 py-1 text-[10px] uppercase tracking-[0.16em] text-[#FFB07E]">
              <Sparkles size={10} />
              New
            </span>
          ) : null}
        </div>

        {asset.tags && asset.tags.length > 0 ? (
          <div className="flex flex-wrap gap-1.5 pt-1">
            {asset.tags.slice(0, 2).map((tag) => (
              <span
                key={`${asset.id}-${tag}`}
                className="rounded-full border border-[#232326] bg-[#101011] px-2 py-1 text-[10px] uppercase tracking-[0.12em] text-[#8E8E93]"
              >
                {tag}
              </span>
            ))}
          </div>
        ) : null}
      </div>
    </button>
  );
}
