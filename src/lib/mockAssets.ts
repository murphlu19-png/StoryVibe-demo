import type { Script } from '@/types';
import type { SavedAssetPackage } from '@/stores/useGenerateStore';

export type AssetOwner = 'my' | 'shared';
export type AssetKind = 'image' | 'video' | 'audio' | 'text' | 'pack' | 'preset' | 'style';
export type AssetFilterTab = 'ALL' | 'Video' | 'Picture' | 'Audio' | 'Others';

export type LibraryAsset = {
  id: string;
  owner: AssetOwner;
  kind: AssetKind;
  category: AssetFilterTab;
  name: string;
  description: string;
  thumbnail?: string;
  duration?: string;
  tags?: string[];
  source?: 'mock' | 'generated' | 'saved-idea' | 'local-import' | 'script-package';
  accent?: string;
};

export type MockGeneratedIdea = {
  id: string;
  title: string;
  description: string;
  suggestedStructure: string[];
  prompt: string;
};

export type MockSimilarResult = {
  asset: LibraryAsset;
  score: number;
};

export const ASSET_FILTER_TABS: AssetFilterTab[] = ['ALL', 'Video', 'Picture', 'Audio', 'Others'];

export const MOCK_MY_ASSETS: LibraryAsset[] = [
  {
    id: 'asset-dream-portrait-reference',
    owner: 'my',
    kind: 'image',
    category: 'Picture',
    name: 'Dream Portrait Reference',
    description: 'Soft portrait reference for dreamlike character framing.',
    thumbnail: '/assets/trending-7.jpg',
    tags: ['dream', 'portrait', 'soft', 'character'],
    source: 'mock',
  },
  {
    id: 'asset-memory-hallway-interior',
    owner: 'my',
    kind: 'image',
    category: 'Picture',
    name: 'Memory Hallway Interior',
    description: 'Quiet interior hallway for spatial reference.',
    thumbnail: '/assets/story-1.jpg',
    tags: ['memory', 'hallway', 'interior', 'space'],
    source: 'mock',
  },
  {
    id: 'asset-sunset-desert-light',
    owner: 'my',
    kind: 'image',
    category: 'Picture',
    name: 'Sunset Desert Light',
    description: 'Warm sunset mood and color reference.',
    thumbnail: '/assets/story-2.jpg',
    tags: ['sunset', 'warm', 'light', 'mood'],
    source: 'mock',
  },
  {
    id: 'asset-rain-window-mood',
    owner: 'my',
    kind: 'image',
    category: 'Picture',
    name: 'Rain Window Mood',
    description: 'Diffused light and reflective window texture.',
    thumbnail: '/assets/story-3.jpg',
    tags: ['rain', 'window', 'reflection', 'texture'],
    source: 'mock',
  },
  {
    id: 'asset-forest-morning-haze',
    owner: 'my',
    kind: 'image',
    category: 'Picture',
    name: 'Forest Morning Haze',
    description: 'Misty natural atmosphere reference.',
    thumbnail: '/assets/trending-5.jpg',
    tags: ['forest', 'mist', 'morning', 'atmosphere'],
    source: 'mock',
  },
  {
    id: 'asset-neon-street-color',
    owner: 'my',
    kind: 'image',
    category: 'Picture',
    name: 'Neon Street Color',
    description: 'Night city color and lighting reference.',
    thumbnail: '/assets/story-5.jpg',
    tags: ['neon', 'street', 'night', 'city'],
    source: 'mock',
  },
  {
    id: 'asset-corridor-walk-clip',
    owner: 'my',
    kind: 'video',
    category: 'Video',
    name: 'Corridor Walk Clip',
    description: 'Slow handheld walk through a narrow interior corridor.',
    thumbnail: '/mock/backrooms/分镜 01.png',
    duration: '12s',
    tags: ['corridor', 'walk', 'handheld', 'interior'],
    source: 'mock',
  },
  {
    id: 'asset-ocean-surface-loop',
    owner: 'my',
    kind: 'video',
    category: 'Video',
    name: 'Ocean Surface Loop',
    description: 'Calm surface motion and reflective water texture.',
    thumbnail: '/assets/story-4.jpg',
    duration: '18s',
    tags: ['ocean', 'water', 'surface', 'calm'],
    source: 'mock',
  },
  {
    id: 'asset-city-rain-broll',
    owner: 'my',
    kind: 'video',
    category: 'Video',
    name: 'City Rain B-roll',
    description: 'Neon rain street ambience and slow urban movement.',
    thumbnail: '/assets/trending-6.jpg',
    duration: '24s',
    tags: ['city', 'rain', 'neon', 'b-roll'],
    source: 'mock',
  },
  {
    id: 'asset-soft-bedroom-routine',
    owner: 'my',
    kind: 'video',
    category: 'Video',
    name: 'Soft Bedroom Routine',
    description: 'Quiet lifestyle motion reference.',
    thumbnail: '/assets/story-1.jpg',
    duration: '16s',
    tags: ['bedroom', 'routine', 'lifestyle', 'soft'],
    source: 'mock',
  },
  {
    id: 'asset-hallway-hum',
    owner: 'my',
    kind: 'audio',
    category: 'Audio',
    name: 'Hallway Hum',
    description: 'Low fluorescent hallway ambience.',
    duration: '00:28',
    tags: ['hallway', 'hum', 'ambience', 'liminal'],
    source: 'mock',
    accent: '#F59E0B',
  },
  {
    id: 'asset-soft-ambient-piano',
    owner: 'my',
    kind: 'audio',
    category: 'Audio',
    name: 'Soft Ambient Piano',
    description: 'Quiet emotional piano loop.',
    duration: '01:12',
    tags: ['piano', 'emotional', 'soft', 'ambient'],
    source: 'mock',
    accent: '#A78BFA',
  },
  {
    id: 'asset-ocean-reverb-bed',
    owner: 'my',
    kind: 'audio',
    category: 'Audio',
    name: 'Ocean Reverb Bed',
    description: 'Airy ocean ambience with soft reverb.',
    duration: '00:45',
    tags: ['ocean', 'reverb', 'airy', 'ambience'],
    source: 'mock',
    accent: '#38BDF8',
  },
  {
    id: 'asset-dream-drone-texture',
    owner: 'my',
    kind: 'audio',
    category: 'Audio',
    name: 'Dream Drone Texture',
    description: 'Low atmospheric drone for dream sequences.',
    duration: '00:36',
    tags: ['dream', 'drone', 'atmospheric', 'texture'],
    source: 'mock',
    accent: '#FB7185',
  },
  {
    id: 'asset-dream-sequence-prompt',
    owner: 'my',
    kind: 'text',
    category: 'Others',
    name: 'Dream Sequence Prompt',
    description: 'Prompt note for soft memory-space video.',
    tags: ['prompt', 'dream', 'memory', 'text'],
    source: 'mock',
  },
  {
    id: 'asset-backrooms-script-note',
    owner: 'my',
    kind: 'text',
    category: 'Others',
    name: 'Backrooms Script Note',
    description: 'Script note for first-person liminal suspense.',
    tags: ['script', 'backrooms', 'liminal', 'note'],
    source: 'mock',
  },
  {
    id: 'asset-product-mood-copy',
    owner: 'my',
    kind: 'text',
    category: 'Others',
    name: 'Product Mood Copy',
    description: 'Short copy direction for fragrance commercial.',
    tags: ['copy', 'product', 'fragrance', 'mood'],
    source: 'mock',
  },
  {
    id: 'asset-dream-moodboard-pack',
    owner: 'my',
    kind: 'pack',
    category: 'Others',
    name: 'Dream Moodboard Pack',
    description: 'A small collection of dreamlike references.',
    tags: ['pack', 'dream', 'moodboard', 'reference'],
    source: 'mock',
  },
  {
    id: 'asset-handheld-camera-preset',
    owner: 'my',
    kind: 'preset',
    category: 'Others',
    name: 'Handheld Camera Preset',
    description: 'Motion preset for handheld vlog style.',
    tags: ['preset', 'handheld', 'vlog', 'motion'],
    source: 'mock',
  },
  {
    id: 'asset-warm-glow-style-pack',
    owner: 'my',
    kind: 'style',
    category: 'Others',
    name: 'Warm Glow Style Pack',
    description: 'Color and light style pack for soft cinematic scenes.',
    tags: ['style', 'warm', 'glow', 'cinematic'],
    source: 'mock',
  },
];

export const MOCK_SHARED_ASSETS: LibraryAsset[] = [
  {
    id: 'shared-editorial-silhouette',
    owner: 'shared',
    kind: 'image',
    category: 'Picture',
    name: 'Editorial Silhouette Frame',
    description: 'Shared fashion silhouette reference from the team library.',
    thumbnail: '/assets/trending-2.jpg',
    tags: ['fashion', 'silhouette', 'editorial'],
    source: 'mock',
  },
  {
    id: 'shared-city-motion-loop',
    owner: 'shared',
    kind: 'video',
    category: 'Video',
    name: 'City Motion Loop',
    description: 'Shared slow pan over moving city lights.',
    thumbnail: '/assets/citywalk/morning.png',
    duration: '14s',
    tags: ['city', 'motion', 'lights'],
    source: 'mock',
  },
  {
    id: 'shared-soft-keys-bed',
    owner: 'shared',
    kind: 'audio',
    category: 'Audio',
    name: 'Soft Keys Bed',
    description: 'Shared piano and pad bed for reflective scenes.',
    duration: '00:52',
    tags: ['keys', 'pad', 'reflective'],
    source: 'mock',
    accent: '#60A5FA',
  },
  {
    id: 'shared-campaign-look-pack',
    owner: 'shared',
    kind: 'pack',
    category: 'Others',
    name: 'Campaign Look Pack',
    description: 'Shared art-direction pack for premium product launches.',
    tags: ['pack', 'campaign', 'premium'],
    source: 'mock',
  },
];

export function filterAssetsByTab(assets: LibraryAsset[], tab: AssetFilterTab) {
  if (tab === 'ALL') return assets;
  return assets.filter((asset) => asset.category === tab);
}

export function mapSavedAssetPackageToAsset(asset: SavedAssetPackage): LibraryAsset {
  return {
    id: `saved-package-${asset.id}`,
    owner: 'my',
    kind: 'pack',
    category: 'Others',
    name: asset.title,
    description: asset.summary,
    thumbnail: asset.thumbnail,
    tags: ['generated', 'script-package'],
    source: 'script-package',
  };
}

export function mapFilePreviewToAsset(preview: {
  id: string;
  url: string;
  type: string;
  name: string;
}): LibraryAsset {
  const kind: AssetKind =
    preview.type === 'video'
      ? 'video'
      : preview.type === 'audio'
        ? 'audio'
        : preview.type === 'text'
          ? 'text'
          : 'image';

  const category: AssetFilterTab =
    kind === 'video' ? 'Video' : kind === 'audio' ? 'Audio' : kind === 'image' ? 'Picture' : 'Others';

  return {
    id: `preview-${preview.id}`,
    owner: 'my',
    kind,
    category,
    name: preview.name,
    description: `Local mock ${kind} imported into the current asset library.`,
    thumbnail: preview.url || undefined,
    tags: ['local', kind, 'mock-import'],
    source: 'local-import',
  };
}

function tokenize(value: string) {
  return value
    .toLowerCase()
    .split(/[^a-z0-9\u4e00-\u9fa5]+/i)
    .filter(Boolean);
}

export function buildIdeaFromAssets(selectedAssets: LibraryAsset[], prompt: string): MockGeneratedIdea {
  const combined = `${selectedAssets.map((asset) => `${asset.name} ${asset.tags?.join(' ') ?? ''}`).join(' ')} ${prompt}`.toLowerCase();

  if (/(dream|memory|hallway|rain|soft|mood)/.test(combined)) {
    return {
      id: `idea-${Date.now()}`,
      title: 'Dreamlike Memory Walk',
      description:
        'Use the selected hallway image, soft ambient audio, and muted light reference to create a 15-second emotional video about someone walking through a half-remembered interior space.',
      suggestedStructure: [
        '0-3s: Soft arrival into the space',
        '3-8s: Slow drifting movement',
        '8-12s: Light and texture become abstract',
        '12-15s: Fade into a quiet emotional afterimage',
      ],
      prompt:
        '做一个15秒的梦境感视频，人物缓慢走过被记忆化处理的室内空间，光线柔和，情绪安静，空间像半记得的走廊，整体更偏氛围和感受。',
    };
  }

  if (/(neon|city|street|rain)/.test(combined)) {
    return {
      id: `idea-${Date.now()}`,
      title: 'Neon Rain Passage',
      description:
        'Turn the selected urban lights, rain texture, and moving street footage into a short city-night mood piece driven by reflected color and restrained motion.',
      suggestedStructure: [
        '0-4s: Establish neon reflections and street tone',
        '4-8s: Introduce slow moving subject or camera drift',
        '8-12s: Push into color, rain, and texture detail',
        '12-15s: Hold on a final luminous city afterimage',
      ],
      prompt:
        'Create a short neon rain city video with reflective streets, slow movement, and a premium atmospheric tone. Keep it cinematic and concise.',
    };
  }

  return {
    id: `idea-${Date.now()}`,
    title: 'Mood-Led Asset Concept',
    description:
      'Combine the selected references into a short concept driven by atmosphere, a clear visual anchor, and one concise emotional arc.',
    suggestedStructure: [
      '0-3s: Establish the strongest visual cue',
      '3-7s: Introduce movement or texture contrast',
      '7-11s: Build the emotional focus',
      '11-15s: Resolve with one clean final image',
    ],
    prompt: prompt.trim() || 'Create a 15-second visual idea using the selected assets as the main mood and reference anchors.',
  };
}

export function buildSimilarResults(
  availableAssets: LibraryAsset[],
  selectedAssets: LibraryAsset[],
  prompt: string,
): MockSimilarResult[] {
  const sourceTokens = tokenize(
    `${selectedAssets[0]?.name ?? ''} ${selectedAssets[0]?.tags?.join(' ') ?? ''} ${prompt}`,
  );
  const sourceId = selectedAssets[0]?.id;

  return availableAssets
    .filter((asset) => asset.id !== sourceId && (asset.kind === 'image' || asset.kind === 'video'))
    .map((asset) => {
      const haystackTokens = tokenize(`${asset.name} ${asset.description} ${asset.tags?.join(' ') ?? ''}`);
      const overlap = sourceTokens.filter((token) => haystackTokens.includes(token)).length;
      const score = Math.min(96, 68 + overlap * 9 + (asset.kind === 'image' ? 5 : 0));
      return { asset, score };
    })
    .sort((a, b) => b.score - a.score)
    .slice(0, 4);
}

export function createSavedIdeaAsset(
  idea: MockGeneratedIdea,
  selectedAssets: LibraryAsset[],
): LibraryAsset {
  return {
    id: `saved-idea-${Date.now()}`,
    owner: 'my',
    kind: 'text',
    category: 'Others',
    name: `${idea.title} Note`,
    description: `${idea.description}${selectedAssets.length ? ` Based on ${selectedAssets.length} selected assets.` : ''}`,
    tags: ['idea', 'text', 'saved'],
    source: 'saved-idea',
  };
}

export function buildScriptFromIdea(idea: MockGeneratedIdea, selectedAssets: LibraryAsset[]): Script {
  const coverImage =
    selectedAssets.find((asset) => asset.thumbnail)?.thumbnail ||
    '/assets/story-1.jpg';
  const assetSummary =
    selectedAssets.length > 0
      ? selectedAssets.map((asset) => asset.name).join(' · ')
      : 'Selected asset references from library';

  return {
    id: `idea-script-${Date.now()}`,
    title: idea.title,
    status: 'draft',
    duration: '15s',
    version: 'v1',
    source: 'generated-flow',
    createdAt: 'Created just now',
    updatedAt: 'Updated just now',
    shortDescription: idea.description,
    category: 'Asset-Led Concept',
    coverImage,
    outputSpec: '9:16 vertical · 15s · asset-led concept draft',
    narrativeArc: idea.description,
    emotionalGoal: 'Translate the selected assets into one concise emotional direction with clear visual cohesion.',
    visualDirection: 'Use the selected assets as the primary guide for framing, atmosphere, lighting, and rhythm.',
    rhythm: idea.suggestedStructure.join(' / '),
    assetLogic: assetSummary,
    shots: idea.suggestedStructure.map((step, index) => ({
      id: `idea-shot-${index + 1}`,
      timeRange: index === 0 ? '0-3s' : index === 1 ? '3-8s' : index === 2 ? '8-12s' : '12-15s',
      preview: coverImage,
      visual: step.replace(/^\d+\-\d+s:\s*/, ''),
      purpose: index === 0 ? 'OPEN' : index === idea.suggestedStructure.length - 1 ? 'RESOLVE' : 'DEVELOP',
      camera: index === 0 ? 'Slow establish' : index === 1 ? 'Drift forward' : index === 2 ? 'Texture close-up' : 'Soft hold',
      asset: assetSummary,
      copy: index === 0 ? idea.title : idea.description,
    })),
  };
}
