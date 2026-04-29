import { useEffect, useMemo, useRef, useState } from 'react';
import {
  ArrowLeft,
  ArrowRight,
  BookOpen,
  Flag,
  Image,
  LayoutGrid,
  Pencil,
  Plus,
  SlidersHorizontal,
  Table2,
  Trash2,
  Upload,
  X,
} from 'lucide-react';

export type EditableMockRow = {
  _localId?: string;
  previewImage?: string;
  time: string;
  scene: string;
  purpose: string;
  visualDirection: string;
  camera: string;
  assetSource?: string;
  audioOrVoice?: string;
  textOrCaption?: string;
  isMarked?: boolean;
};

export type ScriptPlanAssetItem = {
  id: string;
  name: string;
  role: string;
};

type EditableFieldKey = 'scene' | 'visualDirection' | 'purpose' | 'camera' | 'copy';
type StoryboardModalFieldKey =
  | 'scene'
  | 'visualDirection'
  | 'camera'
  | 'purpose'
  | 'assetSource'
  | 'copy'
  | 'audioOrVoice';

function getMockPreviewMeta(scenarioId: string, segmentIndex: number) {
  const scenarioPreviewSets: Record<string, { title: string; caption: string; background: string }[]> = {
    backrooms_vlog_fuzzy_no_asset: [
      {
        title: 'Corridor Opening',
        caption: 'Yellow fluorescent hallway',
        background: 'linear-gradient(135deg, rgba(111,92,33,0.92) 0%, rgba(59,54,24,0.96) 45%, rgba(17,16,12,1) 100%)',
      },
      {
        title: 'Repeated Space',
        caption: 'Flicker and spatial drift',
        background: 'linear-gradient(135deg, rgba(140,120,54,0.88) 0%, rgba(69,66,33,0.94) 42%, rgba(12,12,10,1) 100%)',
      },
      {
        title: 'Anomaly Detail',
        caption: 'Handprint and shadow detail',
        background: 'linear-gradient(135deg, rgba(106,92,48,0.92) 0%, rgba(46,40,30,0.94) 50%, rgba(11,11,11,1) 100%)',
      },
      {
        title: 'Sudden Turn',
        caption: 'Long vanishing hallway',
        background: 'linear-gradient(135deg, rgba(125,109,50,0.9) 0%, rgba(39,40,30,0.95) 50%, rgba(8,8,8,1) 100%)',
      },
      {
        title: 'Final Cut',
        caption: 'Glitch and blackout',
        background: 'linear-gradient(135deg, rgba(100,85,30,0.9) 0%, rgba(34,32,26,0.96) 45%, rgba(5,5,5,1) 100%)',
      },
    ],
    dream_video_with_assets: [
      {
        title: 'Arrival',
        caption: 'Soft opening into the dream',
        background: 'linear-gradient(135deg, rgba(73,82,145,0.86) 0%, rgba(141,113,168,0.7) 40%, rgba(18,18,31,1) 100%)',
      },
      {
        title: 'Drift',
        caption: 'Memory-space begins to breathe',
        background: 'linear-gradient(135deg, rgba(67,92,138,0.82) 0%, rgba(164,150,194,0.68) 48%, rgba(19,18,31,1) 100%)',
      },
      {
        title: 'Suspension',
        caption: 'Stillness, light, and hush',
        background: 'linear-gradient(135deg, rgba(82,99,152,0.84) 0%, rgba(122,147,193,0.64) 46%, rgba(17,19,30,1) 100%)',
      },
      {
        title: 'Deepening',
        caption: 'Emotional bloom and softness',
        background: 'linear-gradient(135deg, rgba(116,111,168,0.82) 0%, rgba(213,189,149,0.56) 45%, rgba(23,20,31,1) 100%)',
      },
      {
        title: 'Fade',
        caption: 'Afterglow and dissolution',
        background: 'linear-gradient(135deg, rgba(146,154,191,0.76) 0%, rgba(226,219,213,0.58) 40%, rgba(26,26,34,1) 100%)',
      },
    ],
    fragrance_ad_script_with_assets: [
      {
        title: 'Bottle Macro',
        caption: 'Glass texture and cool light',
        background: 'linear-gradient(135deg, rgba(34,57,95,0.96) 0%, rgba(68,93,144,0.74) 42%, rgba(9,12,20,1) 100%)',
      },
      {
        title: 'Night Reflection',
        caption: 'Urban storefront atmosphere',
        background: 'linear-gradient(135deg, rgba(18,42,86,0.96) 0%, rgba(58,88,138,0.7) 45%, rgba(8,10,18,1) 100%)',
      },
      {
        title: 'Mist Layer',
        caption: 'Soft luminous vapor',
        background: 'linear-gradient(135deg, rgba(28,53,91,0.94) 0%, rgba(83,103,149,0.72) 46%, rgba(11,13,22,1) 100%)',
      },
      {
        title: 'Product Return',
        caption: 'Reflective glass silhouette',
        background: 'linear-gradient(135deg, rgba(17,41,78,0.98) 0%, rgba(61,87,129,0.72) 44%, rgba(7,9,17,1) 100%)',
      },
      {
        title: 'Logo Reveal',
        caption: 'Hero frame and brand mark',
        background: 'linear-gradient(135deg, rgba(23,49,92,0.98) 0%, rgba(76,104,156,0.68) 40%, rgba(9,10,18,1) 100%)',
      },
    ],
  };

  const previews = scenarioPreviewSets[scenarioId] ?? scenarioPreviewSets.backrooms_vlog_fuzzy_no_asset;
  return previews[segmentIndex] ?? previews[previews.length - 1];
}

function truncateText(text: string, maxLength: number) {
  if (text.length <= maxLength) return text;
  return `${text.slice(0, maxLength).trimEnd()}...`;
}

function getAssetPills(assetSource?: string) {
  if (!assetSource) return [];
  const matches = assetSource.match(/Image\s*\d+/gi) ?? [];
  if (matches.length > 0) {
    return Array.from(new Set(matches.map((item) => item.replace(/\s+/g, ' ').trim())));
  }

  return assetSource
    .split(/,|·/)
    .map((item) => item.trim())
    .filter((item) => item && item !== '—' && item !== '-')
    .slice(0, 2);
}

function getPurposeTags(scenarioId: string, rowIndex: number, fallback: string) {
  const purposeTags: Record<string, string[][]> = {
    backrooms_vlog_fuzzy_no_asset: [
      ['ESTABLISH', 'PHONE VLOG'],
      ['SPATIAL CONFUSION'],
      ['ANOMALY', 'DETAIL'],
      ['ESCALATION'],
      ['CUT TO BLACK'],
    ],
    dream_video_with_assets: [
      ['ARRIVAL', 'DREAM OPENING'],
      ['DRIFT', 'ATMOSPHERIC'],
      ['SUSPENSION', 'QUIET'],
      ['BLOOM', 'EMOTIONAL SHIFT'],
      ['FADE', 'AFTERGLOW'],
    ],
    fragrance_ad_script_with_assets: [
      ['PRODUCT', 'TEXTURE'],
      ['HUMAN PRESENCE'],
      ['SENSORY MIST'],
      ['PRODUCT MEMORY'],
      ['BRAND REVEAL'],
    ],
  };

  return purposeTags[scenarioId]?.[rowIndex] ?? [truncateText(fallback.toUpperCase(), 24)];
}

function createEmptyRow() {
  return {
    _localId: `row-${Math.random().toString(36).slice(2, 10)}`,
    previewImage: '',
    time: '00–00s',
    scene: '',
    purpose: '',
    visualDirection: '',
    camera: '',
    assetSource: '',
    audioOrVoice: '',
    textOrCaption: '',
    isMarked: false,
  } satisfies EditableMockRow;
}

function StoryboardModalEditableField({
  label,
  value,
  isEditing,
  placeholder = 'No content yet',
  textarea = true,
  muted = false,
  quickOptions,
  onDoubleClick,
  onChange,
  onSave,
  onCancel,
}: {
  label: string;
  value: string;
  isEditing: boolean;
  placeholder?: string;
  textarea?: boolean;
  muted?: boolean;
  quickOptions?: string[];
  onDoubleClick: () => void;
  onChange: (value: string) => void;
  onSave: () => void;
  onCancel: () => void;
}) {
  return (
    <div className="space-y-1.5">
      <div className="text-[10px] font-semibold uppercase tracking-[0.16em] text-[#8E8E93]">{label}</div>
      {isEditing ? (
        <div className="space-y-2.5 rounded-[14px] border border-[rgba(255,132,61,0.28)] bg-[#101011] px-3 py-2.5 shadow-[0_0_0_1px_rgba(255,132,61,0.08)]">
          {textarea ? (
            <textarea
              value={value}
              onChange={(event) => onChange(event.target.value)}
              className="min-h-[84px] max-h-[160px] w-full resize-y overflow-y-auto rounded-[12px] border border-[#2A2A2C] bg-[#141415] px-3 py-2.5 text-[12px] leading-5 text-[#F3F3F5] outline-none transition-all focus:border-[#FF843D] focus:ring-2 focus:ring-[#FF843D]/20"
              placeholder={placeholder}
            />
          ) : (
            <input
              value={value}
              onChange={(event) => onChange(event.target.value)}
              className="h-10 w-full rounded-[12px] border border-[#2A2A2C] bg-[#141415] px-3 text-[12px] text-[#F3F3F5] outline-none transition-all focus:border-[#FF843D] focus:ring-2 focus:ring-[#FF843D]/20"
              placeholder={placeholder}
            />
          )}
          {quickOptions && quickOptions.length > 0 && (
            <div className="flex flex-wrap gap-1.5">
              {quickOptions.map((option) => (
                <button
                  key={`${label}-${option}`}
                  type="button"
                  onClick={() => onChange(option)}
                  className="rounded-full border border-[#2A2A2C] bg-[#141415] px-2.5 py-1 text-[10px] text-[#D4D4D8] transition-all hover:border-[#FF843D] hover:text-white"
                >
                  {option}
                </button>
              ))}
            </div>
          )}
          <div className="flex items-center gap-2">
            <button type="button" onClick={onSave} className="rounded-full bg-[#FF843D] px-3 py-1.5 text-[11px] font-medium text-white transition-all hover:bg-[#FFA465]">
              Save
            </button>
            <button type="button" onClick={onCancel} className="rounded-full border border-[#2A2A2C] px-3 py-1.5 text-[11px] text-[#8E8E93] transition-all hover:border-[#FF843D] hover:text-white">
              Cancel
            </button>
          </div>
        </div>
      ) : (
        <button
          type="button"
          onDoubleClick={onDoubleClick}
          className={`w-full rounded-[14px] border border-[rgba(255,255,255,0.06)] bg-[#101011] px-3 py-2.5 text-left transition-all hover:border-[rgba(255,132,61,0.18)] ${
            muted ? 'text-[#8E8E93]' : 'text-[#D4D4D8]'
          }`}
        >
          <div className="text-[12px] leading-5">{value || placeholder}</div>
        </button>
      )}
    </div>
  );
}

function MockPreviewCell({
  scenarioId,
  previewImage,
  rowIndex,
  onOpen,
  className = 'h-[92px] w-[140px] rounded-[14px]',
}: {
  scenarioId: string;
  previewImage?: string;
  rowIndex: number;
  onOpen: (payload: { scenarioId: string; rowIndex: number }) => void;
  className?: string;
}) {
  const previewMeta = getMockPreviewMeta(scenarioId, rowIndex);

  return (
    <button
      type="button"
      onClick={() => onOpen({ scenarioId, rowIndex })}
      className={`group relative overflow-hidden border border-[rgba(255,255,255,0.08)] bg-[#0E0E0F] transition-all duration-200 ease-out hover:border-[rgba(255,132,61,0.42)] hover:shadow-[0_10px_24px_rgba(0,0,0,0.28)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#FF843D]/35 ${className}`}
      style={!previewImage ? { background: previewMeta.background } : undefined}
    >
      {previewImage ? (
        <img
          src={previewImage}
          alt={previewMeta.title}
          className="absolute inset-0 h-full w-full object-cover transition-transform duration-200 ease-out group-hover:scale-[1.03]"
        />
      ) : (
        <div className="absolute inset-0 transition-transform duration-200 ease-out group-hover:scale-[1.03]" />
      )}
      <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(255,255,255,0.03)_0%,rgba(0,0,0,0.14)_100%)]" />
    </button>
  );
}

function StoryboardShotRow({
  scenarioId,
  row,
  rowIndex,
  purposeTags,
  onOpenDetails,
  isLinkedActive = false,
}: {
  scenarioId: string;
  row: EditableMockRow;
  rowIndex: number;
  purposeTags: string[];
  onOpenDetails: () => void;
  isLinkedActive?: boolean;
}) {
  const previewMeta = getMockPreviewMeta(scenarioId, rowIndex);

  return (
    <div
      onClick={onOpenDetails}
      className={`group flex h-[408px] w-[320px] cursor-pointer flex-col overflow-hidden rounded-[24px] border bg-[rgba(20,20,21,0.92)] p-4 shadow-[0_1px_3px_rgba(0,0,0,0.3)] transition-all duration-200 ease-out hover:border-[rgba(255,132,61,0.28)] hover:bg-[rgba(22,22,24,0.96)] hover:shadow-[0_16px_36px_rgba(0,0,0,0.26)] ${
        isLinkedActive
          ? 'border-[rgba(255,132,61,0.30)] shadow-[0_0_0_1px_rgba(255,132,61,0.08),0_16px_36px_rgba(0,0,0,0.26)]'
          : 'border-[rgba(255,255,255,0.08)]'
      }`}
    >
      <div className="flex items-center justify-between gap-3">
        <span className="rounded-full border border-[rgba(255,132,61,0.22)] bg-[rgba(255,132,61,0.08)] px-2.5 py-1 text-[9px] font-semibold uppercase tracking-[0.16em] text-[#FFD2B4]">
          {`Shot ${String(rowIndex + 1).padStart(2, '0')}`}
        </span>
        <span className="rounded-full border border-[#2A2A2C] bg-[#101011] px-2.5 py-1 text-[10px] font-medium text-[#D9D9DE]">
          {row.time}
        </span>
      </div>

      <button
        type="button"
        onClick={(event) => {
          event.stopPropagation();
          onOpenDetails();
        }}
        className="group/preview relative mt-3 aspect-[16/9] overflow-hidden rounded-[18px] border border-[rgba(255,255,255,0.08)] bg-[#0E0E0F] text-left transition-all duration-200 ease-out hover:border-[rgba(255,132,61,0.35)]"
        style={!row.previewImage ? { background: previewMeta.background } : undefined}
      >
        {row.previewImage && (
          <img
            src={row.previewImage}
            alt={previewMeta.title}
            className="absolute inset-0 h-full w-full object-cover transition-transform duration-200 ease-out group-hover/preview:scale-[1.02]"
          />
        )}
        <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(255,255,255,0.03)_0%,rgba(0,0,0,0.22)_100%)] transition-transform duration-200 ease-out group-hover/preview:scale-[1.02]" />
      </button>

      <div className="mt-3.5 flex min-h-0 flex-1 flex-col">
        <div className="space-y-1.5">
          <div className="text-[10px] font-semibold uppercase tracking-[0.16em] text-[#8E8E93]">Visual</div>
          <div className="line-clamp-3 min-h-[60px] text-[12px] leading-5 text-[#F3F3F5]">{row.scene}</div>
        </div>

        <div className="mt-3 min-h-[60px]">
          <div className="flex max-h-[60px] flex-wrap content-start gap-1.5 overflow-hidden">
            {purposeTags.map((tag) => (
              <span key={`${row.time}-${tag}`} className="inline-flex h-[28px] items-center rounded-full border border-[#2A2A2C] bg-[#101011] px-[10px] text-[9px] font-medium uppercase tracking-[0.12em] text-[#F3F3F5] whitespace-nowrap">
                {tag}
              </span>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

function ShotDetailModal({
  scenarioId,
  row,
  rowIndex,
  purposeTags,
  assetPills,
  isVisible,
  isRegenerating,
  draft,
  editingField,
  assetLibraryItems,
  onClose,
  onEditShot,
  onRegenerateShot,
  onBeginFieldEditing,
  onChangeField,
  onSaveField,
  onCancelField,
}: {
  scenarioId: string;
  row: EditableMockRow;
  rowIndex: number;
  purposeTags: string[];
  assetPills: string[];
  isVisible: boolean;
  isRegenerating: boolean;
  draft: EditableMockRow;
  editingField: StoryboardModalFieldKey | null;
  assetLibraryItems: string[];
  onClose: () => void;
  onEditShot: () => void;
  onRegenerateShot: () => void;
  onBeginFieldEditing: (field: StoryboardModalFieldKey) => void;
  onChangeField: (field: StoryboardModalFieldKey, value: string) => void;
  onSaveField: (field: StoryboardModalFieldKey) => void;
  onCancelField: (field: StoryboardModalFieldKey) => void;
}) {
  const previewMeta = getMockPreviewMeta(scenarioId, rowIndex);
  const displayRow = draft ?? row;
  const copyText = displayRow.textOrCaption ?? displayRow.audioOrVoice ?? '—';

  return (
    <div className={`fixed inset-0 z-[70] flex items-center justify-center p-6 transition-opacity duration-200 ease-out ${
      isVisible ? 'opacity-100' : 'pointer-events-none opacity-0'
    }`}>
      <button type="button" aria-label="Close storyboard detail" className="absolute inset-0 bg-[rgba(7,7,8,0.72)] backdrop-blur-[2px]" onClick={onClose} />
      <div
        data-storyboard-modal-panel
        className={`relative flex max-h-[82vh] w-full max-w-[640px] flex-col overflow-hidden rounded-[24px] border border-[rgba(255,255,255,0.08)] bg-[rgba(16,16,17,0.96)] p-4 shadow-[0_24px_64px_rgba(0,0,0,0.42)] backdrop-blur-xl transition-all duration-200 ease-out ${
          isVisible ? 'translate-y-0 scale-100 opacity-100' : 'translate-y-2 scale-[0.96] opacity-0'
        }`}
      >
        <div className="flex items-start justify-between gap-4">
          <div className="flex flex-wrap items-center gap-2">
            <span className="rounded-[12px] border border-[rgba(255,132,61,0.18)] bg-[rgba(255,132,61,0.08)] px-2.5 py-1 text-[10px] font-medium uppercase tracking-[0.16em] text-[#FFD2B4]">
              {`Shot ${rowIndex + 1} (${row.time})`}
            </span>
            {purposeTags[0] && (
              <span className="rounded-[12px] border border-[#2A2A2C] bg-[#101011] px-2.5 py-1 text-[10px] font-medium uppercase tracking-[0.16em] text-[#D4D4D8]">
                {purposeTags[0]}
              </span>
            )}
          </div>

          <button
            type="button"
            onClick={onClose}
            className="inline-flex h-9 w-9 items-center justify-center rounded-full border border-[#2A2A2C] bg-[#101011] text-[#D4D4D8] transition-all hover:border-[#FF843D] hover:text-white"
          >
            <X size={16} />
          </button>
        </div>

        <div className="mt-3 overflow-hidden rounded-[20px] border border-[rgba(255,255,255,0.06)] bg-[#0E0E0F]">
          {displayRow.previewImage ? (
            <img src={displayRow.previewImage} alt={previewMeta.title} className="h-[184px] w-full object-cover" />
          ) : (
            <div className="h-[184px] w-full bg-cover bg-center" style={{ background: previewMeta.background }} />
          )}
        </div>

        <div className="mt-3 flex-1 overflow-y-auto pr-1">
          <div className="grid gap-3 md:grid-cols-2">
            <StoryboardModalEditableField
              label="Visual"
              value={displayRow.scene}
              isEditing={editingField === 'scene'}
              onDoubleClick={() => onBeginFieldEditing('scene')}
              onChange={(value) => onChangeField('scene', value)}
              onSave={() => onSaveField('scene')}
              onCancel={() => onCancelField('scene')}
            />
            <StoryboardModalEditableField
              label="Copy"
              value={copyText}
              isEditing={editingField === 'copy'}
              onDoubleClick={() => onBeginFieldEditing('copy')}
              onChange={(value) => onChangeField('copy', value)}
              onSave={() => onSaveField('copy')}
              onCancel={() => onCancelField('copy')}
            />
            <StoryboardModalEditableField
              label="Purpose"
              value={displayRow.purpose}
              isEditing={editingField === 'purpose'}
              textarea={false}
              onDoubleClick={() => onBeginFieldEditing('purpose')}
              onChange={(value) => onChangeField('purpose', value)}
              onSave={() => onSaveField('purpose')}
              onCancel={() => onCancelField('purpose')}
            />
            <StoryboardModalEditableField
              label="Camera"
              value={displayRow.camera}
              isEditing={editingField === 'camera'}
              onDoubleClick={() => onBeginFieldEditing('camera')}
              onChange={(value) => onChangeField('camera', value)}
              onSave={() => onSaveField('camera')}
              onCancel={() => onCancelField('camera')}
            />
            <StoryboardModalEditableField
              label="Asset"
              value={displayRow.assetSource ?? assetPills.join(' · ') ?? ''}
              isEditing={editingField === 'assetSource'}
              textarea={false}
              quickOptions={assetLibraryItems}
              placeholder="Add or reference assets..."
              onDoubleClick={() => onBeginFieldEditing('assetSource')}
              onChange={(value) => onChangeField('assetSource', value)}
              onSave={() => onSaveField('assetSource')}
              onCancel={() => onCancelField('assetSource')}
            />
            <StoryboardModalEditableField
              label="Visual Direction"
              value={displayRow.visualDirection}
              isEditing={editingField === 'visualDirection'}
              muted
              onDoubleClick={() => onBeginFieldEditing('visualDirection')}
              onChange={(value) => onChangeField('visualDirection', value)}
              onSave={() => onSaveField('visualDirection')}
              onCancel={() => onCancelField('visualDirection')}
            />
            <div className="md:col-span-2">
              <StoryboardModalEditableField
                label="Audio / Voice"
                value={displayRow.audioOrVoice ?? ''}
                isEditing={editingField === 'audioOrVoice'}
                muted
                placeholder="No audio or voice note"
                onDoubleClick={() => onBeginFieldEditing('audioOrVoice')}
                onChange={(value) => onChangeField('audioOrVoice', value)}
                onSave={() => onSaveField('audioOrVoice')}
                onCancel={() => onCancelField('audioOrVoice')}
              />
            </div>
          </div>
        </div>

        <div className="mt-3 flex shrink-0 flex-col gap-2.5 border-t border-[rgba(255,255,255,0.08)] pt-3 md:flex-row md:items-center md:justify-between">
          <p className="text-[10px] leading-4 text-[#8E8E93]">
            Double-click any field to edit in place. Save applies the shot update locally. Regenerate updates only the selected shot in mock mode.
          </p>
          <div className="flex flex-wrap items-center gap-2">
            <button type="button" onClick={onRegenerateShot} className="rounded-full border border-[#2A2A2C] px-3 py-1.5 text-[11px] text-[#D4D4D8] transition-all hover:border-[#FF843D] hover:text-white">
              {isRegenerating ? 'Regenerating...' : 'Regenerate Shot'}
            </button>
            <button type="button" onClick={onEditShot} className="rounded-full border border-[#2A2A2C] px-3 py-1.5 text-[11px] text-[#D4D4D8] transition-all hover:border-[#FF843D] hover:text-white">
              Edit Shot
            </button>
            <button type="button" onClick={onClose} className="rounded-full bg-[#FF843D] px-3 py-1.5 text-[11px] font-medium text-white transition-all hover:bg-[#FFA465]">
              Done
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export function ScriptPlanViews({
  scenarioId,
  rows,
  onRowsChange,
  mentionAssets,
  initialViewMode = 'table',
  focusedShotIndex,
  onFocusedShotChange,
  onPlanViewChange,
}: {
  scenarioId: string;
  rows: EditableMockRow[];
  onRowsChange: (rows: EditableMockRow[]) => void;
  mentionAssets: ScriptPlanAssetItem[];
  initialViewMode?: 'table' | 'storyboard';
  focusedShotIndex?: number | null;
  onFocusedShotChange?: (index: number) => void;
  onPlanViewChange?: (mode: 'table' | 'storyboard') => void;
}) {
  const normalizedRows = useMemo(
    () =>
      rows.map((row, index) => ({
        ...row,
        _localId: row._localId ?? `row-${scenarioId}-${index}`,
        isMarked: row.isMarked ?? false,
      })),
    [rows, scenarioId],
  );
  const [viewMode, setViewMode] = useState<'table' | 'storyboard'>(initialViewMode);
  const [previewModal, setPreviewModal] = useState<{ scenarioId: string; rowIndex: number; time: string } | null>(null);
  const [previewModalVisible, setPreviewModalVisible] = useState(false);
  const [storyboardModalRowIndex, setStoryboardModalRowIndex] = useState<number | null>(null);
  const [storyboardModalVisible, setStoryboardModalVisible] = useState(false);
  const [storyboardModalDraft, setStoryboardModalDraft] = useState<EditableMockRow | null>(null);
  const [storyboardModalEditingField, setStoryboardModalEditingField] = useState<StoryboardModalFieldKey | null>(null);
  const [editingRowIndex, setEditingRowIndex] = useState<number | null>(null);
  const [editingRowDraft, setEditingRowDraft] = useState<EditableMockRow | null>(null);
  const [assetPopoverRowIndex, setAssetPopoverRowIndex] = useState<number | null>(null);
  const [assetPopoverMode, setAssetPopoverMode] = useState<'menu' | 'library'>('menu');
  const [isRegeneratingRow, setIsRegeneratingRow] = useState<number | null>(null);
  const [tableViewportWidth, setTableViewportWidth] = useState(0);
  const [storyboardScrollLeft, setStoryboardScrollLeft] = useState(0);
  const [storyboardScrollMax, setStoryboardScrollMax] = useState(0);
  const [activeStoryboardShot, setActiveStoryboardShot] = useState(0);
  const [draggedRowIndex, setDraggedRowIndex] = useState<number | null>(null);
  const [dragOverRowIndex, setDragOverRowIndex] = useState<number | null>(null);
  const [rowActionIndex, setRowActionIndex] = useState<number | null>(null);
  const [deleteConfirmRowIndex, setDeleteConfirmRowIndex] = useState<number | null>(null);
  const [pendingDragRowIndex, setPendingDragRowIndex] = useState<number | null>(null);
  const [dragReadyRowIndex, setDragReadyRowIndex] = useState<number | null>(null);

  const previewCloseTimerRef = useRef<number | null>(null);
  const dragHoldTimerRef = useRef<number | null>(null);
  const assetInputRef = useRef<HTMLInputElement>(null);
  const tableWrapperRef = useRef<HTMLDivElement>(null);
  const storyboardScrollRef = useRef<HTMLDivElement>(null);
  const tableRowRefs = useRef<Array<HTMLTableSectionElement | null>>([]);
  const storyboardCardRefs = useRef<Array<HTMLDivElement | null>>([]);

  const assetLibraryItems = useMemo(() => mentionAssets.map((asset) => asset.name.split(' · ')[0]), [mentionAssets]);

  useEffect(() => {
    setViewMode(initialViewMode);
    setPreviewModal(null);
    setPreviewModalVisible(false);
    setStoryboardModalRowIndex(null);
    setStoryboardModalVisible(false);
    setStoryboardModalDraft(null);
    setStoryboardModalEditingField(null);
    setEditingRowIndex(null);
    setEditingRowDraft(null);
    setAssetPopoverRowIndex(null);
    setAssetPopoverMode('menu');
    setDraggedRowIndex(null);
    setDragOverRowIndex(null);
    setRowActionIndex(null);
    setDeleteConfirmRowIndex(null);
    setPendingDragRowIndex(null);
    setDragReadyRowIndex(null);
  }, [initialViewMode, scenarioId]);

  useEffect(() => {
    onPlanViewChange?.(viewMode);
  }, [onPlanViewChange, viewMode]);

  useEffect(() => {
    const handlePointerDown = (event: MouseEvent) => {
      const target = event.target as HTMLElement;
      if (!target.closest('[data-asset-popover-root]')) {
        setAssetPopoverRowIndex(null);
      }
      if (previewModal && !target.closest('[data-preview-modal-panel]')) {
        setPreviewModalVisible(false);
      }
      if (storyboardModalRowIndex !== null && !target.closest('[data-storyboard-modal-panel]')) {
        setStoryboardModalVisible(false);
      }
    };

    const handleEscape = (event: KeyboardEvent) => {
      if (event.key !== 'Escape') return;
      setPreviewModalVisible(false);
      setStoryboardModalVisible(false);
      setAssetPopoverRowIndex(null);
      setEditingRowIndex(null);
      setEditingRowDraft(null);
    };

    document.addEventListener('mousedown', handlePointerDown);
    document.addEventListener('keydown', handleEscape);

    return () => {
      document.removeEventListener('mousedown', handlePointerDown);
      document.removeEventListener('keydown', handleEscape);
    };
  }, [previewModal, storyboardModalRowIndex]);

  useEffect(() => {
    if (!previewModalVisible && previewModal) {
      if (previewCloseTimerRef.current) {
        window.clearTimeout(previewCloseTimerRef.current);
      }
      previewCloseTimerRef.current = window.setTimeout(() => {
        setPreviewModal(null);
      }, 200);
    }

    return () => {
      if (previewCloseTimerRef.current) {
        window.clearTimeout(previewCloseTimerRef.current);
      }
    };
  }, [previewModalVisible, previewModal]);

  useEffect(() => {
    if (!storyboardModalVisible && storyboardModalRowIndex !== null) {
      const timer = window.setTimeout(() => {
        setStoryboardModalRowIndex(null);
      }, 200);
      return () => window.clearTimeout(timer);
    }
  }, [storyboardModalVisible, storyboardModalRowIndex]);

  useEffect(() => {
    const wrapper = tableWrapperRef.current;
    if (viewMode !== 'table' || !wrapper) {
      return;
    }

    const syncViewportWidth = () => {
      setTableViewportWidth(wrapper.clientWidth);
    };

    syncViewportWidth();
    wrapper.addEventListener('scroll', syncViewportWidth);
    window.addEventListener('resize', syncViewportWidth);

    return () => {
      wrapper.removeEventListener('scroll', syncViewportWidth);
      window.removeEventListener('resize', syncViewportWidth);
    };
  }, [viewMode, rows.length, editingRowIndex]);

  useEffect(() => {
    const wrapper = storyboardScrollRef.current;
    if (!wrapper) {
      setStoryboardScrollLeft(0);
      setStoryboardScrollMax(0);
      setActiveStoryboardShot(0);
      return;
    }

    const cardWidth = 360;
    const syncStoryboardMetrics = () => {
      const max = Math.max(0, wrapper.scrollWidth - wrapper.clientWidth);
      const left = wrapper.scrollLeft;
      setStoryboardScrollLeft(left);
      setStoryboardScrollMax(max);
      setActiveStoryboardShot(Math.min(Math.max(Math.round(left / cardWidth), 0), Math.max(rows.length - 1, 0)));
    };

    syncStoryboardMetrics();
    wrapper.addEventListener('scroll', syncStoryboardMetrics);
    window.addEventListener('resize', syncStoryboardMetrics);

    return () => {
      wrapper.removeEventListener('scroll', syncStoryboardMetrics);
      window.removeEventListener('resize', syncStoryboardMetrics);
    };
  }, [viewMode, rows.length]);

  useEffect(() => {
    if (viewMode === 'storyboard') {
      onFocusedShotChange?.(activeStoryboardShot);
    }
  }, [activeStoryboardShot, onFocusedShotChange, viewMode]);

  useEffect(() => {
    if (focusedShotIndex === null || focusedShotIndex === undefined) return;
    const clampedIndex = Math.min(Math.max(focusedShotIndex, 0), Math.max(normalizedRows.length - 1, 0));
    if (viewMode === 'table') {
      tableRowRefs.current[clampedIndex]?.scrollIntoView({ behavior: 'smooth', block: 'center' });
    } else {
      storyboardCardRefs.current[clampedIndex]?.scrollIntoView({ behavior: 'smooth', inline: 'center', block: 'nearest' });
      setActiveStoryboardShot(clampedIndex);
    }
  }, [focusedShotIndex, normalizedRows.length, viewMode]);

  useEffect(() => {
    return () => {
      if (dragHoldTimerRef.current) {
        window.clearTimeout(dragHoldTimerRef.current);
      }
    };
  }, []);

  const commitRowDraft = (rowIndex: number, draft: EditableMockRow) => {
    onRowsChange(normalizedRows.map((row, idx) => (idx === rowIndex ? { ...draft, _localId: row._localId } : row)));
  };

  const reorderRows = (fromIndex: number, toIndex: number) => {
    if (fromIndex === toIndex) return;

    const next = [...normalizedRows];
    const [moved] = next.splice(fromIndex, 1);
    next.splice(toIndex, 0, moved);
    onRowsChange(next);

    setDraggedRowIndex(null);
    setDragOverRowIndex(null);

    if (storyboardModalRowIndex !== null || previewModal) {
      setStoryboardModalVisible(false);
      setPreviewModalVisible(false);
    }
  };

  const beginRowEditing = (rowIndex: number, field: EditableFieldKey | null = null) => {
    void field;
    if (editingRowIndex !== null && editingRowDraft && editingRowIndex !== rowIndex) {
      commitRowDraft(editingRowIndex, editingRowDraft);
    }

    if (editingRowIndex === rowIndex && editingRowDraft) {
      return;
    }

    setEditingRowIndex(rowIndex);
    setEditingRowDraft({ ...normalizedRows[rowIndex] });
    setAssetPopoverRowIndex(null);
    setDeleteConfirmRowIndex(null);
  };

  const updateEditingDraft = (updates: Partial<EditableMockRow>) => {
    setEditingRowDraft((prev) => (prev ? { ...prev, ...updates } : prev));
  };

  const getCopyDraftValue = (row: EditableMockRow) => row.textOrCaption ?? row.audioOrVoice ?? '';

  const updateCopyDraftValue = (value: string) => {
    setEditingRowDraft((prev) => {
      if (!prev) return prev;
      if (prev.textOrCaption !== undefined || prev.audioOrVoice === undefined) {
        return { ...prev, textOrCaption: value };
      }
      return { ...prev, audioOrVoice: value };
    });
  };

  const doneEditingRow = () => {
    if (editingRowIndex !== null && editingRowDraft) {
      commitRowDraft(editingRowIndex, editingRowDraft);
    }
    setEditingRowIndex(null);
    setEditingRowDraft(null);
    setAssetPopoverRowIndex(null);
  };

  const cancelEditingRow = () => {
    setEditingRowIndex(null);
    setEditingRowDraft(null);
    setAssetPopoverRowIndex(null);
  };

  const updateAssetForRow = (rowIndex: number, assetValue: string) => {
    beginRowEditing(rowIndex, null);
    setEditingRowDraft((prev) => {
      const baseRow = prev ?? { ...normalizedRows[rowIndex] };
      return { ...baseRow, assetSource: assetValue };
    });
    setAssetPopoverRowIndex(null);
    setAssetPopoverMode('menu');
  };

  const triggerLocalAssetSelect = (rowIndex: number) => {
    beginRowEditing(rowIndex, null);
    setAssetPopoverRowIndex(rowIndex);
    assetInputRef.current?.click();
  };

  const handleAssetFileSelected = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file && assetPopoverRowIndex !== null) {
      updateAssetForRow(assetPopoverRowIndex, file.name);
    }
    event.target.value = '';
  };

  const handleRegenerateShot = (rowIndex: number) => {
    setIsRegeneratingRow(rowIndex);
    window.setTimeout(() => {
      setIsRegeneratingRow((current) => (current === rowIndex ? null : current));
    }, 900);
  };

  const openPreviewModal = ({ scenarioId: previewScenarioId, rowIndex }: { scenarioId: string; rowIndex: number }) => {
    setPreviewModal({ scenarioId: previewScenarioId, rowIndex, time: normalizedRows[rowIndex]?.time ?? '' });
    setPreviewModalVisible(true);
  };

  const openStoryboardModal = (rowIndex: number) => {
    if (editingRowIndex !== null && editingRowDraft) {
      commitRowDraft(editingRowIndex, editingRowDraft);
      setEditingRowIndex(null);
      setEditingRowDraft(null);
    }
    setStoryboardModalDraft({ ...normalizedRows[rowIndex] });
    setStoryboardModalEditingField(null);
    setStoryboardModalRowIndex(rowIndex);
    setStoryboardModalVisible(true);
  };

  const closeStoryboardModal = () => {
    setStoryboardModalVisible(false);
    setStoryboardModalEditingField(null);
  };

  const updateStoryboardModalField = (field: StoryboardModalFieldKey, value: string) => {
    setStoryboardModalDraft((prev) => {
      if (!prev) return prev;
      if (field === 'copy') {
        if (prev.textOrCaption !== undefined || prev.audioOrVoice === undefined) {
          return { ...prev, textOrCaption: value };
        }
        return { ...prev, audioOrVoice: value };
      }
      if (field === 'audioOrVoice') {
        return { ...prev, audioOrVoice: value };
      }
      return { ...prev, [field]: value };
    });
  };

  const beginStoryboardFieldEditing = (field: StoryboardModalFieldKey) => {
    if (!storyboardModalDraft && storyboardModalRowIndex !== null) {
        setStoryboardModalDraft({ ...normalizedRows[storyboardModalRowIndex] });
    }
    setStoryboardModalEditingField(field);
  };

  const saveStoryboardField = (_field: StoryboardModalFieldKey) => {
    if (storyboardModalRowIndex === null || !storyboardModalDraft) return;
    commitRowDraft(storyboardModalRowIndex, storyboardModalDraft);
    setStoryboardModalEditingField(null);
  };

  const cancelStoryboardField = (field: StoryboardModalFieldKey) => {
    if (storyboardModalRowIndex === null) {
      setStoryboardModalEditingField(null);
      return;
    }

    const originalRow = normalizedRows[storyboardModalRowIndex];
    setStoryboardModalDraft((prev) => {
      if (!prev) return prev;
      if (field === 'copy') {
        return { ...prev, textOrCaption: originalRow.textOrCaption, audioOrVoice: originalRow.audioOrVoice };
      }
      if (field === 'audioOrVoice') {
        return { ...prev, audioOrVoice: originalRow.audioOrVoice };
      }
      return { ...prev, [field]: originalRow[field as keyof EditableMockRow] as string | undefined };
    });
    setStoryboardModalEditingField(null);
  };

  const scrollStoryboardBy = (delta: number) => {
    storyboardScrollRef.current?.scrollBy({ left: delta, behavior: 'smooth' });
  };

  const scrollStoryboardToIndex = (index: number) => {
    storyboardScrollRef.current?.scrollTo({ left: index * 360, behavior: 'smooth' });
  };

  const switchViewMode = (nextMode: 'table' | 'storyboard') => {
    if (nextMode === viewMode) return;
    if (editingRowIndex !== null && editingRowDraft) {
      commitRowDraft(editingRowIndex, editingRowDraft);
      setEditingRowIndex(null);
      setEditingRowDraft(null);
    }
    setAssetPopoverRowIndex(null);
    setStoryboardModalEditingField(null);
    setViewMode(nextMode);
  };

  const setFocusedShot = (index: number) => {
    onFocusedShotChange?.(index);
  };

  const toggleMarkRow = (rowIndex: number) => {
    onRowsChange(
      normalizedRows.map((row, idx) => (idx === rowIndex ? { ...row, isMarked: !row.isMarked } : row)),
    );
  };

  const requestDeleteRow = (rowIndex: number) => {
    setDeleteConfirmRowIndex(rowIndex);
    setRowActionIndex(rowIndex);
  };

  const confirmDeleteRow = (rowIndex: number) => {
    const nextRows = normalizedRows.filter((_, idx) => idx !== rowIndex);
    onRowsChange(nextRows);
    setDeleteConfirmRowIndex(null);
    setRowActionIndex(null);
    if (editingRowIndex === rowIndex) {
      setEditingRowIndex(null);
      setEditingRowDraft(null);
    }
  };

  const addNewRow = () => {
    const nextRow = createEmptyRow();
    const nextRows = [...normalizedRows, nextRow];
    onRowsChange(nextRows);
    const newIndex = nextRows.length - 1;
    setViewMode('table');
    setEditingRowIndex(newIndex);
    setEditingRowDraft({ ...nextRow });
    setRowActionIndex(newIndex);
  };

  const clearPendingDrag = () => {
    if (dragHoldTimerRef.current) {
      window.clearTimeout(dragHoldTimerRef.current);
      dragHoldTimerRef.current = null;
    }
    setPendingDragRowIndex(null);
    setDragReadyRowIndex(null);
  };

  const beginRowPressDrag = (rowIndex: number, event: React.MouseEvent<HTMLTableRowElement>) => {
    if (editingRowIndex !== null || event.button !== 0) return;
    const target = event.target as HTMLElement;
    if (target.closest('button, input, textarea, [data-asset-popover-root]')) return;
    clearPendingDrag();
    setPendingDragRowIndex(rowIndex);
    dragHoldTimerRef.current = window.setTimeout(() => {
      setDragReadyRowIndex(rowIndex);
      setDraggedRowIndex(rowIndex);
      setDragOverRowIndex(rowIndex);
    }, 220);
  };

  return (
    <div className="space-y-4">
      <input ref={assetInputRef} type="file" className="hidden" accept="image/*,video/*" onChange={handleAssetFileSelected} />

      <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
        <div className="inline-flex items-center gap-1 rounded-full border border-[#2A2A2C] bg-[#101011] p-1">
          <button
            type="button"
            onClick={() => switchViewMode('table')}
            className={`inline-flex items-center gap-2 rounded-full px-4 py-2 text-[13px] font-medium transition-all ${
              viewMode === 'table' ? 'bg-[#1A1A1C] text-[#FFFFFF]' : 'text-[#8E8E93] hover:text-[#FFFFFF]'
            }`}
          >
            <Table2 size={14} /> Table View
          </button>
          <button
            type="button"
            onClick={() => switchViewMode('storyboard')}
            className={`inline-flex items-center gap-2 rounded-full px-4 py-2 text-[13px] font-medium transition-all ${
              viewMode === 'storyboard' ? 'bg-[#1A1A1C] text-[#FFFFFF]' : 'text-[#8E8E93] hover:text-[#FFFFFF]'
            }`}
          >
            <LayoutGrid size={14} /> Storyboard View
          </button>
        </div>
        <button className="inline-flex items-center gap-2 rounded-full border border-[#2A2A2C] bg-[#101011] px-4 py-2 text-[13px] text-[#C7C7CC] transition-all hover:border-[#FF843D] hover:text-[#FFFFFF]">
          <SlidersHorizontal size={14} /> Display Options
        </button>
      </div>

      {viewMode === 'table' && (
        <div className="relative overflow-hidden rounded-[32px] border border-[rgba(255,255,255,0.08)] bg-[rgba(20,20,21,0.92)] shadow-[0_1px_3px_rgba(0,0,0,0.3)] transition-all duration-200 ease-out">
          <div
            ref={tableWrapperRef}
            className="overflow-x-auto [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
          >
            <table className="w-full min-w-[1016px] table-fixed">
                    <thead>
                      <tr className="bg-[#0C0C0D]">
                        {[
                          ['Time', 'w-[66px]'],
                          ['Preview', 'w-[98px]'],
                          ['Visual', 'w-[27%]'],
                          ['Purpose', 'w-[124px]'],
                          ['Camera', 'w-[15%]'],
                          ['Asset', 'w-[92px]'],
                          ['Copy', 'w-[15%]'],
                        ].map(([header, width]) => (
                    <th
                      key={`${header}-${width}`}
                            className={`border-b border-[#2A2A2C] px-3 py-3 text-left text-[9px] font-semibold uppercase tracking-[0.18em] text-[#8E8E93] ${width}`}
                    >
                      {header}
                    </th>
                  ))}
                </tr>
              </thead>
              {normalizedRows.map((row, index) => {
                const purposeTags = getPurposeTags(scenarioId, index, row.purpose);
                const isEditingRow = editingRowIndex === index && editingRowDraft;
                const displayRow = isEditingRow ? editingRowDraft : row;
                const assetPills = getAssetPills(displayRow?.assetSource);
                const currentCopyValue = displayRow ? getCopyDraftValue(displayRow) : row.textOrCaption || row.audioOrVoice || '—';
                const hasAssetValue = assetPills.length > 0;
                const isDragTarget = dragOverRowIndex === index && draggedRowIndex !== null && draggedRowIndex !== index;
                const isPendingDrag = pendingDragRowIndex === index;
                const isMarked = Boolean(displayRow?.isMarked ?? row.isMarked);

                if (isEditingRow && displayRow) {
                  return (
                    <tbody
                      key={`${row.time}-${index}`}
                      ref={(node) => {
                        tableRowRefs.current[index] = node;
                      }}
                    >
                      <tr className="align-top">
                        <td colSpan={7} className="p-0">
                          <div
                            className="sticky left-0 z-10 px-3 py-3"
                            style={{ width: tableViewportWidth > 0 ? `${tableViewportWidth}px` : '100%' }}
                          >
                            <div className="relative overflow-hidden rounded-[22px] border border-[rgba(255,132,61,0.45)] bg-[rgba(255,132,61,0.06)] shadow-[0_0_0_1px_rgba(255,132,61,0.12)]">
                              <div className="overflow-x-auto overflow-y-visible pb-[60px] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
                                <div className="grid min-w-[1016px] grid-cols-[66px_98px_minmax(240px,27%)_124px_minmax(128px,15%)_92px_minmax(128px,15%)] gap-x-2">
                                  <div className="px-3 py-3.5 whitespace-nowrap">
                                    <div className="mb-1.5 text-[9px] font-semibold uppercase tracking-[0.14em] text-[#8E8E93]">Time</div>
                                    <span className="text-[11px] font-medium text-[#FFFFFF] whitespace-nowrap">{row.time}</span>
                                  </div>
                                  <div className="px-3 py-3.5">
                                    <div className="mb-1.5 text-[9px] font-semibold uppercase tracking-[0.14em] text-[#8E8E93]">Preview</div>
                                    <MockPreviewCell
                                      scenarioId={scenarioId}
                                      rowIndex={index}
                                      onOpen={openPreviewModal}
                                      className="h-[60px] w-[86px] rounded-[12px]"
                                    />
                                  </div>
                                  <div className="px-4 py-3.5">
                                    <div className="space-y-2.5">
                                      <div>
                                        <div className="mb-1.5 text-[9px] font-semibold uppercase tracking-[0.14em] text-[#8E8E93]">Visual</div>
                                        <textarea
                                          value={editingRowDraft.scene}
                                          onChange={(event) => updateEditingDraft({ scene: event.target.value })}
                                          placeholder="Describe the visual moment for this shot..."
                                          className="min-h-[84px] max-h-[176px] w-full resize-y overflow-y-auto rounded-[12px] border border-[#2A2A2C] bg-[#141415] px-3 py-2.5 text-[12px] leading-5 text-[#F3F3F5] outline-none transition-all placeholder:text-[#6F6F77] focus:border-[#FF843D] focus:ring-2 focus:ring-[#FF843D]/20"
                                        />
                                      </div>
                                      <div>
                                        <div className="mb-1.5 text-[9px] font-semibold uppercase tracking-[0.14em] text-[#8E8E93]">Visual Direction</div>
                                        <textarea
                                          value={editingRowDraft.visualDirection}
                                          onChange={(event) => updateEditingDraft({ visualDirection: event.target.value })}
                                          placeholder="Add visual texture, atmosphere, or lighting notes..."
                                          className="min-h-[68px] max-h-[144px] w-full resize-y overflow-y-auto rounded-[12px] border border-[#2A2A2C] bg-[#141415] px-3 py-2.5 text-[12px] leading-5 text-[#D4D4D8] outline-none transition-all placeholder:text-[#6F6F77] focus:border-[#FF843D] focus:ring-2 focus:ring-[#FF843D]/20"
                                        />
                                      </div>
                                    </div>
                                  </div>
                                  <div className="px-3 py-3.5">
                                    <div className="mb-1.5 text-[9px] font-semibold uppercase tracking-[0.14em] text-[#8E8E93]">Purpose</div>
                                    <div className="flex min-h-[40px] flex-wrap content-start gap-1.5">
                                      {(purposeTags.length > 0 ? purposeTags : ['No tag yet']).map((tag) => (
                                        <span key={`${row.time}-${tag}`} className="inline-flex h-[28px] items-center rounded-full border border-[#2A2A2C] bg-[#101011] px-[10px] text-[9px] font-medium uppercase tracking-[0.12em] text-[#F3F3F5] whitespace-nowrap">
                                          {tag}
                                        </span>
                                      ))}
                                    </div>
                                  </div>
                                  <div className="px-3 py-3.5 text-[12px] leading-5 text-[#D4D4D8]">
                                    <div className="mb-1.5 text-[9px] font-semibold uppercase tracking-[0.14em] text-[#8E8E93]">Camera</div>
                                    <textarea
                                      value={editingRowDraft.camera}
                                      onChange={(event) => updateEditingDraft({ camera: event.target.value })}
                                      placeholder="Describe the camera movement or framing..."
                                      className="min-h-[84px] max-h-[176px] w-full resize-y overflow-y-auto rounded-[12px] border border-[#2A2A2C] bg-[#141415] px-3 py-2.5 text-[12px] leading-5 text-[#F3F3F5] outline-none transition-all placeholder:text-[#6F6F77] focus:border-[#FF843D] focus:ring-2 focus:ring-[#FF843D]/20"
                                    />
                                  </div>
                                  <div className="px-3 py-3.5">
                                    <div className="mb-1.5 text-[9px] font-semibold uppercase tracking-[0.14em] text-[#8E8E93]">Asset</div>
                                    <div data-asset-popover-root className="relative">
                                      <button
                                        type="button"
                                        onClick={() => {
                                          beginRowEditing(index, null);
                                          setAssetPopoverMode('menu');
                                          setAssetPopoverRowIndex(assetPopoverRowIndex === index ? null : index);
                                        }}
                                        className="min-h-9 text-left"
                                      >
                                        {hasAssetValue ? (
                                          <div className="flex flex-wrap gap-2">
                                            {assetPills.map((asset) => (
                                              <span key={`${row.time}-${asset}`} className="inline-flex rounded-full border border-[rgba(255,132,61,0.28)] bg-[rgba(255,132,61,0.10)] px-2.5 py-1 text-[10px] font-medium text-[#FFD2B4]">
                                                {asset}
                                              </span>
                                            ))}
                                          </div>
                                        ) : (
                                          <span className="inline-flex items-center gap-1 rounded-full border border-[#2A2A2C] bg-[#101011] px-2.5 py-1.5 text-[10px] font-medium text-[#D4D4D8] transition-all hover:border-[#FF843D] hover:text-white whitespace-nowrap">
                                            <Plus size={11} /> Add Asset
                                          </span>
                                        )}
                                      </button>
                                      <div className="mt-1.5 text-[10px] leading-4 text-[#7C7C82]">
                                        {displayRow.assetSource ? displayRow.assetSource : 'Add or reference assets...'}
                                      </div>
                                      <div className={`absolute left-0 top-[calc(100%+10px)] z-40 w-[280px] rounded-[16px] border border-[rgba(255,255,255,0.08)] bg-[rgba(16,16,17,0.96)] p-3 shadow-[0_18px_50px_rgba(0,0,0,0.38)] backdrop-blur-xl transition-all duration-200 ease-out ${
                                        assetPopoverRowIndex === index ? 'visible translate-y-0 opacity-100 pointer-events-auto' : 'invisible translate-y-1 opacity-0 pointer-events-none'
                                      }`}>
                                        <div className="mb-2 text-[12px] font-semibold text-[#FFFFFF]">Replace / Attach Asset</div>
                                        {assetPopoverMode === 'menu' ? (
                                          <div className="space-y-1">
                                            <button type="button" onClick={() => triggerLocalAssetSelect(index)} className="flex w-full items-center gap-2 rounded-xl px-3 py-2.5 text-left text-[12px] text-[#D9D9DE] transition-all hover:bg-[#1A1A1C] hover:text-white">
                                              <Upload size={14} /> Upload from Local
                                            </button>
                                            <button type="button" onClick={() => setAssetPopoverMode('library')} className="flex w-full items-center gap-2 rounded-xl px-3 py-2.5 text-left text-[12px] text-[#D9D9DE] transition-all hover:bg-[#1A1A1C] hover:text-white">
                                              <BookOpen size={14} /> Choose from Asset Library
                                            </button>
                                            {assetLibraryItems.length > 0 && (
                                              <button type="button" onClick={() => updateAssetForRow(index, assetLibraryItems[0])} className="flex w-full items-center gap-2 rounded-xl px-3 py-2.5 text-left text-[12px] text-[#D9D9DE] transition-all hover:bg-[#1A1A1C] hover:text-white">
                                                <Image size={14} /> Use Current Mock Asset
                                              </button>
                                            )}
                                          </div>
                                        ) : (
                                          <div className="space-y-1">
                                            {assetLibraryItems.map((asset) => (
                                              <button key={`${index}-${asset}`} type="button" onClick={() => updateAssetForRow(index, asset)} className="flex w-full items-center justify-between rounded-xl px-3 py-2.5 text-left text-[12px] text-[#D9D9DE] transition-all hover:bg-[#1A1A1C] hover:text-white">
                                                <span>{asset}</span>
                                                <Plus size={12} />
                                              </button>
                                            ))}
                                            <button type="button" onClick={() => setAssetPopoverMode('menu')} className="mt-2 rounded-full border border-[#2A2A2C] px-3 py-1.5 text-[11px] text-[#9A9A9E] transition-all hover:border-[#FF843D] hover:text-white">
                                              Back
                                            </button>
                                          </div>
                                        )}
                                      </div>
                                    </div>
                                  </div>
                                  <div className="px-3 py-3.5 text-[12px] leading-5 text-[#D4D4D8]">
                                    <div className="mb-1.5 text-[9px] font-semibold uppercase tracking-[0.14em] text-[#8E8E93]">Copy</div>
                                    <textarea
                                      value={currentCopyValue}
                                      onChange={(event) => updateCopyDraftValue(event.target.value)}
                                      placeholder="Add optional voiceover, inner thought, or spoken line..."
                                      className="min-h-[84px] max-h-[176px] w-full resize-y overflow-y-auto rounded-[12px] border border-[#2A2A2C] bg-[#141415] px-3 py-2.5 text-[12px] leading-5 text-[#F3F3F5] outline-none transition-all placeholder:text-[#6F6F77] focus:border-[#FF843D] focus:ring-2 focus:ring-[#FF843D]/20"
                                    />
                                    <div className="mt-1.5 text-[10px] leading-4 text-[#7C7C82]">
                                      {(displayRow.audioOrVoice || '').trim() || 'Add optional voiceover, inner thought, or spoken line...'}
                                    </div>
                                  </div>
                                </div>
                              </div>

                              <div className="pointer-events-none absolute inset-x-0 bottom-0 px-6 pb-4">
                                <div className="relative h-[40px]">
                                  <div className="pointer-events-auto absolute right-0 bottom-0 flex items-center gap-2 whitespace-nowrap">
                                    <button
                                      type="button"
                                      onClick={() => handleRegenerateShot(index)}
                                      className="inline-flex min-w-fit items-center justify-center whitespace-nowrap rounded-full border border-[#2A2A2C] px-3 py-1.5 text-[11px] text-[#D4D4D8] transition-all hover:border-[#FF843D] hover:text-white"
                                    >
                                      {isRegeneratingRow === index ? 'Regenerating...' : 'Regenerate Shot'}
                                    </button>
                                    <button
                                      type="button"
                                      onClick={cancelEditingRow}
                                      className="inline-flex min-w-fit items-center justify-center whitespace-nowrap rounded-full border border-[#2A2A2C] px-3 py-1.5 text-[11px] text-[#D4D4D8] transition-all hover:border-[#FF843D] hover:text-white"
                                    >
                                      Cancel
                                    </button>
                                    <button
                                      type="button"
                                      onClick={doneEditingRow}
                                      className="inline-flex min-w-fit items-center justify-center whitespace-nowrap rounded-full bg-[#FF843D] px-3 py-1.5 text-[11px] font-medium text-white transition-all hover:bg-[#FFA465]"
                                    >
                                      Done Editing
                                    </button>
                                  </div>
                                </div>
                              </div>
                            </div>
                          </div>
                        </td>
                      </tr>
                    </tbody>
                  );
                }

                return (
                    <tbody
                      key={row._localId ?? `${row.time}-${index}`}
                      className={`group ${draggedRowIndex === index ? 'opacity-70' : ''}`}
                      ref={(node) => {
                        tableRowRefs.current[index] = node;
                      }}
                    onDragOver={(event) => {
                      if (draggedRowIndex === null || editingRowIndex !== null) return;
                      event.preventDefault();
                      if (dragOverRowIndex !== index) {
                        setDragOverRowIndex(index);
                      }
                    }}
                    onDrop={(event) => {
                      if (draggedRowIndex === null || editingRowIndex !== null) return;
                      event.preventDefault();
                      reorderRows(draggedRowIndex, index);
                    }}
                    onDragEnd={() => {
                      setDraggedRowIndex(null);
                      setDragOverRowIndex(null);
                        setDragReadyRowIndex(null);
                    }}
                  >
                      <tr
                        draggable={dragReadyRowIndex === index && editingRowIndex === null}
                        onMouseEnter={() => setRowActionIndex(index)}
                        onMouseLeave={() => {
                          setRowActionIndex((current) => (current === index ? null : current));
                          clearPendingDrag();
                        }}
                        onMouseDown={(event) => beginRowPressDrag(index, event)}
                        onMouseUp={clearPendingDrag}
                        onDragStart={(event) => {
                          if (editingRowIndex !== null || dragReadyRowIndex !== index) {
                            event.preventDefault();
                            return;
                          }
                          setDraggedRowIndex(index);
                          setDragOverRowIndex(index);
                          event.dataTransfer.effectAllowed = 'move';
                          event.dataTransfer.setData('text/plain', String(index));
                        }}
                        className={`relative align-top transition-all duration-200 ease-out ${
                          isDragTarget
                            ? 'bg-[rgba(255,132,61,0.08)]'
                            : 'group-hover:bg-[rgba(255,255,255,0.03)]'
                        } ${draggedRowIndex === index ? 'scale-[0.995] shadow-[0_18px_30px_rgba(0,0,0,0.24)]' : ''} ${isPendingDrag ? 'ring-1 ring-[rgba(255,132,61,0.22)]' : ''} ${focusedShotIndex === index ? 'bg-[rgba(255,132,61,0.05)] ring-1 ring-inset ring-[rgba(255,132,61,0.22)]' : ''}`}
                      >
                      <td className={`h-[116px] border-b px-3 py-3.5 align-top whitespace-nowrap text-[11px] font-medium text-[#FFFFFF] transition-all duration-200 ease-out group-hover:h-[198px] ${
                        isDragTarget || draggedRowIndex === index ? 'border-[rgba(255,132,61,0.28)]' : 'border-[#222225]'
                      }`}>
                        {row.time}
                      </td>
                      <td className={`h-[116px] border-b px-3 py-3.5 align-top transition-all duration-200 ease-out group-hover:h-[198px] ${
                        isDragTarget || draggedRowIndex === index ? 'border-[rgba(255,132,61,0.28)]' : 'border-[#222225]'
                      }`}>
                        <MockPreviewCell
                          scenarioId={scenarioId}
                          previewImage={row.previewImage}
                          rowIndex={index}
                          onOpen={openPreviewModal}
                          className="h-[60px] w-[86px] rounded-[12px]"
                        />
                      </td>
                      <td className={`h-[116px] border-b px-4 py-3.5 align-top transition-all duration-200 ease-out group-hover:h-[198px] ${
                        isDragTarget || draggedRowIndex === index ? 'border-[rgba(255,132,61,0.28)]' : 'border-[#222225]'
                      }`}>
                        <div className="space-y-1.5">
                          <div onDoubleClick={() => {
                            setFocusedShot(index);
                            beginRowEditing(index, 'scene');
                          }}>
                            <div className="line-clamp-2 text-[11px] leading-5 text-[#F3F3F5] transition-all duration-200 group-hover:line-clamp-none">
                              {displayRow?.scene ?? row.scene}
                            </div>
                          </div>
                          <div onDoubleClick={() => {
                            setFocusedShot(index);
                            beginRowEditing(index, 'visualDirection');
                          }}>
                            <div className="line-clamp-1 text-[10px] leading-4 text-[#8E8E93] transition-all duration-200 group-hover:line-clamp-4">
                              {displayRow?.visualDirection ?? row.visualDirection}
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className={`h-[116px] border-b px-3 py-3.5 align-top transition-all duration-200 ease-out group-hover:h-[198px] ${
                        isDragTarget || draggedRowIndex === index ? 'border-[rgba(255,132,61,0.28)]' : 'border-[#222225]'
                      }`}>
                        <div className="flex max-h-[58px] flex-wrap gap-1.5 overflow-hidden transition-all duration-200 group-hover:max-h-[120px]">
                          {purposeTags.map((tag) => (
                            <span key={`${row.time}-${tag}`} className="inline-flex h-[28px] items-center rounded-full border border-[#2A2A2C] bg-[#101011] px-[10px] text-[9px] font-medium uppercase tracking-[0.12em] text-[#F3F3F5] whitespace-nowrap">
                              {tag}
                            </span>
                          ))}
                        </div>
                      </td>
                      <td className={`h-[116px] border-b px-3 py-3.5 align-top text-[10px] leading-5 text-[#D4D4D8] transition-all duration-200 ease-out group-hover:h-[198px] ${
                        isDragTarget || draggedRowIndex === index ? 'border-[rgba(255,132,61,0.28)]' : 'border-[#222225]'
                      }`} onDoubleClick={() => {
                        setFocusedShot(index);
                        beginRowEditing(index, 'camera');
                      }}>
                        <div className="line-clamp-2 transition-all duration-200 group-hover:line-clamp-none">{displayRow?.camera ?? row.camera}</div>
                      </td>
                      <td className={`h-[116px] border-b px-3 py-3.5 align-top transition-all duration-200 ease-out group-hover:h-[198px] ${
                        isDragTarget || draggedRowIndex === index ? 'border-[rgba(255,132,61,0.28)]' : 'border-[#222225]'
                      }`}>
                        <div data-asset-popover-root className="relative">
                          <button
                            type="button"
                            onClick={() => {
                              setFocusedShot(index);
                              beginRowEditing(index, null);
                              setAssetPopoverMode('menu');
                              setAssetPopoverRowIndex(assetPopoverRowIndex === index ? null : index);
                            }}
                            className="min-h-10 text-left"
                          >
                            {hasAssetValue ? (
                              <div className="flex flex-wrap gap-1.5">
                                {assetPills.slice(0, 1).map((asset) => (
                                  <span key={`${row.time}-${asset}`} className="inline-flex rounded-full border border-[rgba(255,132,61,0.28)] bg-[rgba(255,132,61,0.10)] px-2.5 py-1 text-[10px] font-medium text-[#FFD2B4]">
                                    {asset}
                                  </span>
                                ))}
                              </div>
                            ) : (
                              <span className="inline-flex items-center gap-1 rounded-full border border-[#2A2A2C] bg-[#101011] px-2.5 py-1.5 text-[10px] font-medium text-[#D4D4D8] transition-all hover:border-[#FF843D] hover:text-white whitespace-nowrap">
                                <Plus size={10} /> Add
                              </span>
                            )}
                          </button>
                          {hasAssetValue && (
                            <div className="mt-2 line-clamp-1 text-[10px] leading-4 text-[#8E8E93] transition-all duration-200 group-hover:line-clamp-3">
                              {displayRow?.assetSource}
                            </div>
                          )}

                          <div className={`absolute left-0 top-[calc(100%+10px)] z-40 w-[280px] rounded-[16px] border border-[rgba(255,255,255,0.08)] bg-[rgba(16,16,17,0.96)] p-3 shadow-[0_18px_50px_rgba(0,0,0,0.38)] backdrop-blur-xl transition-all duration-200 ease-out ${
                            assetPopoverRowIndex === index ? 'visible translate-y-0 opacity-100 pointer-events-auto' : 'invisible translate-y-1 opacity-0 pointer-events-none'
                          }`}>
                            <div className="mb-2 text-[12px] font-semibold text-[#FFFFFF]">Replace / Attach Asset</div>
                            {assetPopoverMode === 'menu' ? (
                              <div className="space-y-1">
                                <button type="button" onClick={() => triggerLocalAssetSelect(index)} className="flex w-full items-center gap-2 rounded-xl px-3 py-2.5 text-left text-[12px] text-[#D9D9DE] transition-all hover:bg-[#1A1A1C] hover:text-white">
                                  <Upload size={14} /> Upload from Local
                                </button>
                                <button type="button" onClick={() => setAssetPopoverMode('library')} className="flex w-full items-center gap-2 rounded-xl px-3 py-2.5 text-left text-[12px] text-[#D9D9DE] transition-all hover:bg-[#1A1A1C] hover:text-white">
                                  <BookOpen size={14} /> Choose from Asset Library
                                </button>
                                {assetLibraryItems.length > 0 && (
                                  <button type="button" onClick={() => updateAssetForRow(index, assetLibraryItems[0])} className="flex w-full items-center gap-2 rounded-xl px-3 py-2.5 text-left text-[12px] text-[#D9D9DE] transition-all hover:bg-[#1A1A1C] hover:text-white">
                                    <Image size={14} /> Use Current Mock Asset
                                  </button>
                                )}
                              </div>
                            ) : (
                              <div className="space-y-1">
                                {assetLibraryItems.map((asset) => (
                                  <button key={`${index}-${asset}`} type="button" onClick={() => updateAssetForRow(index, asset)} className="flex w-full items-center justify-between rounded-xl px-3 py-2.5 text-left text-[12px] text-[#D9D9DE] transition-all hover:bg-[#1A1A1C] hover:text-white">
                                    <span>{asset}</span>
                                    <Plus size={12} />
                                  </button>
                                ))}
                                <button type="button" onClick={() => setAssetPopoverMode('menu')} className="mt-2 rounded-full border border-[#2A2A2C] px-3 py-1.5 text-[11px] text-[#9A9A9E] transition-all hover:border-[#FF843D] hover:text-white">
                                  Back
                                </button>
                              </div>
                            )}
                          </div>
                        </div>
                      </td>
                      <td className={`relative h-[116px] border-b px-3 py-3.5 align-top text-[10px] leading-5 text-[#D4D4D8] transition-all duration-200 ease-out group-hover:h-[198px] ${
                        isDragTarget || draggedRowIndex === index ? 'border-[rgba(255,132,61,0.28)]' : 'border-[#222225]'
                      }`}>
                        <div onDoubleClick={() => {
                          setFocusedShot(index);
                          beginRowEditing(index, 'copy');
                        }} className="line-clamp-2 transition-all duration-200 group-hover:line-clamp-none">
                          {currentCopyValue || '—'}
                        </div>
                        {(displayRow?.audioOrVoice ?? row.audioOrVoice) && (
                          <div className="mt-2 line-clamp-1 text-[10px] leading-4 text-[#8E8E93] transition-all duration-200 group-hover:line-clamp-3">
                            {displayRow?.audioOrVoice ?? row.audioOrVoice}
                          </div>
                        )}
                        <div className={`absolute bottom-3 right-3 flex items-center gap-1.5 transition-all duration-200 ${
                          rowActionIndex === index ? 'opacity-100 translate-y-0' : 'pointer-events-none opacity-0 translate-y-1'
                        }`}>
                          <button
                            type="button"
                            onClick={(event) => {
                              event.stopPropagation();
                              setFocusedShot(index);
                              beginRowEditing(index, 'scene');
                            }}
                            className="inline-flex h-8 items-center gap-1 rounded-full border border-[#2A2A2C] bg-[rgba(16,16,17,0.96)] px-3 text-[10px] font-medium text-[#D4D4D8] transition-all hover:border-[#FF843D] hover:text-white"
                          >
                            <Pencil size={12} /> Edit
                          </button>
                          <button
                            type="button"
                            onClick={(event) => {
                              event.stopPropagation();
                              requestDeleteRow(index);
                            }}
                            className="inline-flex h-8 items-center gap-1 rounded-full border border-[#2A2A2C] bg-[rgba(16,16,17,0.96)] px-3 text-[10px] font-medium text-[#D4D4D8] transition-all hover:border-[#FF843D] hover:text-white"
                          >
                            <Trash2 size={12} /> Delete
                          </button>
                          <button
                            type="button"
                            onClick={(event) => {
                              event.stopPropagation();
                              toggleMarkRow(index);
                            }}
                            className={`inline-flex h-8 items-center gap-1 rounded-full border px-3 text-[10px] font-medium transition-all ${
                              isMarked
                                ? 'border-[rgba(255,132,61,0.35)] bg-[rgba(255,132,61,0.12)] text-[#FFD2B4]'
                                : 'border-[#2A2A2C] bg-[rgba(16,16,17,0.96)] text-[#D4D4D8] hover:border-[#FF843D] hover:text-white'
                            }`}
                          >
                            <Flag size={12} /> Mark
                          </button>
                        </div>
                        {deleteConfirmRowIndex === index && (
                          <div className="absolute bottom-14 right-3 z-40 w-[240px] rounded-[16px] border border-[rgba(255,255,255,0.08)] bg-[rgba(16,16,17,0.98)] p-3 shadow-[0_18px_50px_rgba(0,0,0,0.38)] backdrop-blur-xl">
                            <div className="text-[12px] font-semibold text-white">Delete this shot?</div>
                            <div className="mt-1 text-[11px] leading-5 text-[#8E8E93]">This action cannot be undone.</div>
                            <div className="mt-3 flex items-center justify-end gap-2">
                              <button
                                type="button"
                                onClick={() => setDeleteConfirmRowIndex(null)}
                                className="rounded-full border border-[#2A2A2C] px-3 py-1.5 text-[11px] text-[#8E8E93] transition-all hover:border-[#FF843D] hover:text-white"
                              >
                                Cancel
                              </button>
                              <button
                                type="button"
                                onClick={() => confirmDeleteRow(index)}
                                className="rounded-full bg-[#FF843D] px-3 py-1.5 text-[11px] font-medium text-white transition-all hover:bg-[#FFA465]"
                              >
                                Delete
                              </button>
                            </div>
                          </div>
                        )}
                      </td>
                    </tr>
                  </tbody>
                );
              })}
              <tbody>
                <tr>
                  <td colSpan={7} className="px-4 py-4">
                    <div className="rounded-[22px] border border-dashed border-[rgba(255,255,255,0.12)] bg-[rgba(12,12,13,0.24)] px-4 py-6">
                      <div className="flex items-center justify-center">
                        <button
                          type="button"
                          onClick={addNewRow}
                          className="inline-flex h-10 items-center gap-2 rounded-full border border-[#2A2A2C] bg-[#101011] px-4 text-[12px] font-medium text-[#D4D4D8] transition-all hover:border-[#FF843D] hover:text-white"
                        >
                          <Plus size={14} /> Add Row
                        </button>
                      </div>
                    </div>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      )}

      {viewMode === 'storyboard' && (
        <div className="rounded-[32px] border border-[rgba(255,255,255,0.08)] bg-[rgba(20,20,21,0.92)] p-5 shadow-[0_1px_3px_rgba(0,0,0,0.3)] transition-all duration-200 ease-out md:p-6">
          <div className="flex flex-col gap-3 border-b border-[rgba(255,255,255,0.06)] pb-5 md:flex-row md:items-start md:justify-between">
            <div className="space-y-1">
              <div className="text-[15px] font-semibold text-[#FFFFFF]">Storyboard View</div>
              <div className="text-[13px] text-[#8E8E93]">
                Review each shot as a horizontal visual sequence before generating video.
              </div>
            </div>
            <div className="shrink-0 text-[12px] text-[#8E8E93]">
              {`${normalizedRows.length} Shots · Fixed mock plan`}
            </div>
          </div>

          <div className="mt-5 space-y-4">
            <div className="space-y-2">
              <div className="flex items-center justify-between text-[11px] font-medium text-[#8E8E93]">
                <span>{`Current shot: ${String(activeStoryboardShot + 1).padStart(2, '0')}`}</span>
                <span>{normalizedRows[activeStoryboardShot]?.time ?? normalizedRows[0]?.time}</span>
              </div>
              <div className="grid gap-2" style={{ gridTemplateColumns: `repeat(${Math.max(normalizedRows.length, 1)}, minmax(0, 1fr))` }}>
                {normalizedRows.map((row, index) => {
                  const isActive = index === activeStoryboardShot;
                  const isVisited = index < activeStoryboardShot;
                  return (
                    <button
                      key={`story-progress-${row.time}-${index}`}
                      type="button"
                      onClick={() => {
                        setFocusedShot(index);
                        scrollStoryboardToIndex(index);
                      }}
                      className="text-left"
                    >
                      <div className={`h-2 rounded-full transition-all ${
                        isActive ? 'bg-[#FF843D]' : isVisited ? 'bg-[rgba(255,132,61,0.42)]' : 'bg-[rgba(255,255,255,0.08)]'
                      }`} />
                      <div className={`mt-1 text-[10px] transition-colors ${
                        isActive ? 'text-[#F3F3F5]' : 'text-[#7C7C82]'
                      }`}>
                        {`Shot ${index + 1}`}
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>

            <div className="relative">
              <div className="pointer-events-none absolute inset-y-0 left-0 z-10 w-8 bg-[linear-gradient(90deg,rgba(20,20,21,0.92)_0%,rgba(20,20,21,0)_100%)]" />
              <div className="pointer-events-none absolute inset-y-0 right-0 z-10 w-8 bg-[linear-gradient(270deg,rgba(20,20,21,0.92)_0%,rgba(20,20,21,0)_100%)]" />
              <button
                type="button"
                onClick={() => scrollStoryboardBy(-360)}
                disabled={storyboardScrollLeft <= 4}
                className={`absolute left-3 top-[42%] z-20 hidden h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full border border-[rgba(255,255,255,0.08)] bg-[rgba(12,12,13,0.86)] text-[#D4D4D8] shadow-[0_10px_24px_rgba(0,0,0,0.28)] backdrop-blur-xl transition-all md:inline-flex ${
                  storyboardScrollLeft <= 4 ? 'pointer-events-none opacity-35' : 'hover:border-[#FF843D] hover:text-white'
                }`}
              >
                <ArrowLeft size={16} />
              </button>
              <button
                type="button"
                onClick={() => scrollStoryboardBy(360)}
                disabled={storyboardScrollLeft >= storyboardScrollMax - 4}
                className={`absolute right-3 top-[42%] z-20 hidden h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full border border-[rgba(255,255,255,0.08)] bg-[rgba(12,12,13,0.86)] text-[#D4D4D8] shadow-[0_10px_24px_rgba(0,0,0,0.28)] backdrop-blur-xl transition-all md:inline-flex ${
                  storyboardScrollLeft >= storyboardScrollMax - 4 ? 'pointer-events-none opacity-35' : 'hover:border-[#FF843D] hover:text-white'
                }`}
              >
                <ArrowRight size={16} />
              </button>
              <div ref={storyboardScrollRef} className="overflow-x-auto overflow-y-hidden pb-2 [scrollbar-color:rgba(255,255,255,0.22)_rgba(255,255,255,0.06)] [scrollbar-width:thin] [&::-webkit-scrollbar]:h-[6px] [&::-webkit-scrollbar-track]:rounded-full [&::-webkit-scrollbar-track]:bg-[rgba(255,255,255,0.06)] [&::-webkit-scrollbar-thumb]:rounded-full [&::-webkit-scrollbar-thumb]:bg-[rgba(255,255,255,0.22)]">
                <div className="flex w-max flex-nowrap gap-5 pr-6">
                  {normalizedRows.map((row, index) => (
                    <div
                      key={`storyboard-${row.time}-${index}`}
                      ref={(node) => {
                        storyboardCardRefs.current[index] = node;
                      }}
                    >
                      <StoryboardShotRow
                        scenarioId={scenarioId}
                        row={row}
                        rowIndex={index}
                        purposeTags={getPurposeTags(scenarioId, index, row.purpose)}
                        onOpenDetails={() => {
                          setFocusedShot(index);
                          openStoryboardModal(index);
                        }}
                        isLinkedActive={focusedShotIndex === index}
                      />
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {storyboardModalRowIndex !== null && normalizedRows[storyboardModalRowIndex] && (
        <ShotDetailModal
          scenarioId={scenarioId}
          row={normalizedRows[storyboardModalRowIndex]}
          rowIndex={storyboardModalRowIndex}
          purposeTags={getPurposeTags(scenarioId, storyboardModalRowIndex, normalizedRows[storyboardModalRowIndex].purpose)}
          assetPills={getAssetPills(normalizedRows[storyboardModalRowIndex].assetSource)}
          isVisible={storyboardModalVisible}
          isRegenerating={isRegeneratingRow === storyboardModalRowIndex}
          draft={storyboardModalDraft ?? normalizedRows[storyboardModalRowIndex]}
          editingField={storyboardModalEditingField}
          assetLibraryItems={assetLibraryItems}
          onClose={closeStoryboardModal}
          onEditShot={() => {
            closeStoryboardModal();
            switchViewMode('table');
            beginRowEditing(storyboardModalRowIndex, 'scene');
          }}
          onRegenerateShot={() => handleRegenerateShot(storyboardModalRowIndex)}
          onBeginFieldEditing={beginStoryboardFieldEditing}
          onChangeField={updateStoryboardModalField}
          onSaveField={saveStoryboardField}
          onCancelField={cancelStoryboardField}
        />
      )}

      {previewModal && (
        <div
          className={`fixed inset-0 z-50 flex items-center justify-center p-6 transition-opacity duration-200 ease-out ${
            previewModalVisible ? 'opacity-100' : 'pointer-events-none opacity-0'
          }`}
        >
          <button
            type="button"
            aria-label="Close preview"
            className="absolute inset-0 bg-[rgba(7,7,8,0.72)] backdrop-blur-[2px]"
            onClick={() => setPreviewModalVisible(false)}
          />
          <div
            data-preview-modal-panel
            className={`relative w-full max-w-[640px] rounded-[20px] border border-[rgba(255,255,255,0.08)] bg-[rgba(16,16,17,0.96)] p-4 shadow-[0_24px_64px_rgba(0,0,0,0.42)] backdrop-blur-xl transition-all duration-200 ease-out ${
              previewModalVisible ? 'translate-y-0 scale-100 opacity-100' : 'translate-y-2 scale-[0.96] opacity-0'
            }`}
          >
            <button
              type="button"
              onClick={() => setPreviewModalVisible(false)}
              className="absolute right-3 top-3 inline-flex h-9 w-9 items-center justify-center rounded-full border border-[#2A2A2C] bg-[#101011] text-[#D4D4D8] transition-all hover:border-[#FF843D] hover:text-white"
            >
              <X size={16} />
            </button>
            <div
              className="h-[min(72vh,520px)] w-full rounded-[16px] border border-[rgba(255,255,255,0.06)] bg-cover bg-center"
              style={!normalizedRows[previewModal.rowIndex]?.previewImage ? { background: getMockPreviewMeta(previewModal.scenarioId, previewModal.rowIndex).background } : undefined}
            >
              {normalizedRows[previewModal.rowIndex]?.previewImage && (
                <img
                  src={normalizedRows[previewModal.rowIndex]?.previewImage}
                  alt={getMockPreviewMeta(previewModal.scenarioId, previewModal.rowIndex).title}
                  className="h-full w-full rounded-[16px] object-contain"
                />
              )}
            </div>
            <div className="mt-3 text-[12px] text-[#A1A1AA]">{previewModal.time}</div>
          </div>
        </div>
      )}
    </div>
  );
}
