import type { Script } from '@/types';
import {
  PRESET_BACKROOMS_SCRIPT,
  PRESET_COZY_BEDROOM_SCRIPT,
  PRESET_DREAMWALK_MEMORY_SCRIPT,
} from '@/lib/constants';

export type GenerateHistorySingleItem = {
  id: string;
  type: 'single';
  title: string;
  updatedAt: string;
  statusTag: 'Draft' | 'Completed' | 'Generated';
  duration: string;
  version: string;
  outputSpec: string;
  description: string;
  summary: string;
  assetLogic: string;
  script: Script;
  videoMeta: {
    title: string;
    subtitle: string;
    createdAt: string;
    format: string;
    resolution: string;
  };
};

export type GenerateHistoryProjectSequence = {
  id: string;
  title: string;
  duration: string;
  status: 'Draft' | 'Ready' | 'Generated';
  thumbnail: string;
  summary: string;
  script: Script;
};

export type GenerateHistoryProjectItem = {
  id: string;
  type: 'project';
  title: string;
  updatedAt: string;
  statusTag: 'Draft' | 'Completed' | 'Generated';
  duration: string;
  sequenceCount: number;
  cover: string;
  narrativeDirection: string;
  aspectRatio: string;
  frameRate: string;
  renderMode: string;
  collaborationMode: string;
  sequences: GenerateHistoryProjectSequence[];
};

function buildFragranceHistoryScript(): Script {
  return {
    id: 'generate-history-fragrance-001',
    title: 'Fragrance Memory Ad',
    status: 'draft',
    duration: '20s',
    version: 'v1',
    category: 'Product / Sensory',
    coverImage: '/assets/trending-5.jpg',
    outputSpec: '9:16 vertical · around 20 seconds · sensory product commercial',
    shortDescription:
      'A quiet luxury fragrance study built around soft reflections, tactile glass, and a restrained emotional cadence.',
    narrativeArc:
      'A sensory product film unfolds through reflected light, glass detail, and intimate touch cues, presenting the fragrance as a memory object rather than a literal ad demonstration.',
    emotionalGoal:
      'Make the viewer feel the product as something collectible, tactile, and emotionally elevated.',
    visualDirection:
      'Use cool reflections, softened night highlights, and precise macro framing to make the bottle feel sculptural and premium.',
    rhythm:
      'Open on texture, move into environment, add human presence, and end on a clean hero reveal.',
    assetLogic:
      'Product silhouette drives composition, urban reflections shape atmosphere, and model texture cues introduce emotional intimacy.',
    shots: [
      {
        id: 'fr-1',
        timeRange: '0-5s',
        preview: '/assets/trending-5.jpg',
        visual: 'A bottle silhouette emerges inside cool reflected light with a soft halo of glass texture.',
        purpose: 'PRODUCT INTRO',
        camera: 'Macro push-in',
        asset: 'PRODUCT',
        copy: 'The first note should feel like memory catching light.',
      },
      {
        id: 'fr-2',
        timeRange: '5-10s',
        preview: '/assets/story-2.jpg',
        visual: 'City reflections and subtle vapor drift around the bottle as the scene turns more atmospheric.',
        purpose: 'ENVIRONMENT',
        camera: 'Slow lateral glide',
        asset: 'ENVIRONMENT',
        copy: 'Let the setting feel polished, nocturnal, and quietly expensive.',
      },
      {
        id: 'fr-3',
        timeRange: '10-15s',
        preview: '/assets/story-4.jpg',
        visual: 'Hands and skin texture enter briefly, suggesting touch, ritual, and premium tactility.',
        purpose: 'HUMAN PRESENCE',
        camera: 'Close portrait detail',
        asset: 'TALENT',
        copy: 'The human touch should be intimate, not demonstrative.',
      },
      {
        id: 'fr-4',
        timeRange: '15-20s',
        preview: '/assets/trending-6.jpg',
        visual: 'The bottle settles into a hero frame with brand-space negative space and a final glow pass.',
        purpose: 'HERO FRAME',
        camera: 'Static hero hold',
        asset: 'PRODUCT',
        copy: 'End in stillness so the finish feels premium and remembered.',
      },
    ],
  };
}

function buildNeonRainCityWalkScript(): Script {
  return {
    id: 'generate-history-neon-rain-001',
    title: 'Neon Rain City Walk',
    status: 'complete',
    duration: '30s',
    version: 'v2',
    category: 'Lifestyle / City Vlog',
    coverImage: '/assets/trending-3.jpg',
    outputSpec: '9:16 vertical · around 30 seconds · neon rain city walk vlog',
    shortDescription:
      'A rain-soaked urban walk that balances lifestyle pacing with moody reflected neon textures.',
    narrativeArc:
      'The sequence follows a city walk from first rain reflection through movement, observation, and a calm urban close, capturing nightlife as atmosphere rather than spectacle.',
    emotionalGoal:
      'Create a confident but introspective city feeling that feels personal, current, and cinematic.',
    visualDirection:
      'Use puddle reflections, saturated signage, soft handheld movement, and layered street depth.',
    rhythm:
      'Street intro → motion → observation → detail pause → glide → outro.',
    assetLogic:
      'Street textures, wardrobe styling, and reflected signage define the visual identity more than dialogue.',
    videoAsset: '/mock/backrooms/demo video.mp4',
    shots: [
      { id: 'nr-1', timeRange: '0-5s', preview: '/assets/trending-3.jpg', visual: 'Rain gathers on the pavement as city signage flickers into the first frame.', purpose: 'STREET INTRO', camera: 'Low-angle walk-in', asset: 'UPLOADED', copy: 'The whole street lights up when it rains.' },
      { id: 'nr-2', timeRange: '5-10s', preview: '/assets/trending-4.jpg', visual: 'The subject moves through a crosswalk while headlights smear across wet asphalt.', purpose: 'MOVEMENT', camera: 'Handheld follow', asset: 'UPLOADED', copy: 'It never feels faster than when the pavement starts reflecting back.' },
      { id: 'nr-3', timeRange: '10-15s', preview: '/assets/trending-5.jpg', visual: 'A side glance catches storefront color, umbrellas, and a layered street crowd behind.', purpose: 'OBSERVATION', camera: 'Medium street pan', asset: 'UPLOADED', copy: 'The city is loud, but the mood stays strangely private.' },
      { id: 'nr-4', timeRange: '15-20s', preview: '/assets/trending-6.jpg', visual: 'A detail cut lingers on shoes, puddles, and neon fragments breaking apart in water.', purpose: 'DETAIL PAUSE', camera: 'Macro tilt down', asset: 'UPLOADED', copy: 'Sometimes the reflections are better than the skyline itself.' },
      { id: 'nr-5', timeRange: '20-25s', preview: '/assets/story-2.jpg', visual: 'The walk opens onto a wider avenue as rain softens into haze and the pace evens out.', purpose: 'CITY GLIDE', camera: 'Steady forward drift', asset: 'UPLOADED', copy: 'The rush settles into rhythm if you keep moving with it.' },
      { id: 'nr-6', timeRange: '25-30s', preview: '/assets/story-4.jpg', visual: 'A final look across the street closes on a calm neon afterglow and a distant train pass.', purpose: 'OUTRO', camera: 'Static hold', asset: 'UPLOADED', copy: 'By the end, the rain feels less like weather and more like color.' },
    ],
  };
}

function buildSoftBedroomRoutineScript(): Script {
  return {
    ...PRESET_COZY_BEDROOM_SCRIPT,
    id: 'generate-history-bedroom-001',
    title: 'Soft Bedroom Routine',
    duration: '45s',
    version: 'v2',
    shortDescription:
      'An intimate lifestyle routine built from warm light, domestic details, and a calm morning progression.',
    shots: [
      ...PRESET_COZY_BEDROOM_SCRIPT.shots,
      {
        id: 'sbr-7',
        timeRange: '30-38s',
        preview: '/assets/story-1.jpg',
        visual: 'A closet detail sequence shows wardrobe textures, jewelry, and a final quiet mirror check.',
        purpose: 'STYLE MOMENT',
        camera: 'Detail sequence',
        asset: 'UPLOADED',
        copy: 'Even the smallest choices help the morning feel intentional.',
      },
      {
        id: 'sbr-8',
        timeRange: '38-45s',
        preview: '/assets/trending-6.jpg',
        visual: 'The subject leaves the room as light rests on the now-still bed and curtain edge.',
        purpose: 'CLOSE CALMLY',
        camera: 'Soft pull back',
        asset: 'UPLOADED',
        copy: 'A quiet room can hold the whole tone of the day.',
      },
    ],
  };
}

const DREAM_SCRIPT = PRESET_DREAMWALK_MEMORY_SCRIPT;
const BACKROOMS_SCRIPT: Script = {
  ...PRESET_BACKROOMS_SCRIPT,
  id: 'generate-history-backrooms-001',
  title: 'Backrooms POV Vlog',
  duration: '15s',
  outputSpec: '9:16 vertical · around 15 seconds · realistic handheld tension vlog',
  shots: PRESET_BACKROOMS_SCRIPT.shots.slice(0, 5).map((shot, index) => ({
    ...shot,
    id: `gb-${index + 1}`,
    timeRange: `${index * 3}-${(index + 1) * 3}s`,
  })),
};
const FRAGRANCE_SCRIPT = buildFragranceHistoryScript();
const NEON_RAIN_SCRIPT = buildNeonRainCityWalkScript();
const BEDROOM_SCRIPT = buildSoftBedroomRoutineScript();

export const MOCK_GENERATE_SINGLE_HISTORY: GenerateHistorySingleItem[] = [
  {
    id: 'history-single-dream',
    type: 'single',
    title: 'Dream Walk Video v1',
    updatedAt: 'Updated 2m ago',
    statusTag: 'Draft',
    duration: '15s',
    version: 'v1',
    outputSpec: DREAM_SCRIPT.outputSpec || '9:16 vertical',
    description: DREAM_SCRIPT.shortDescription || '',
    summary: DREAM_SCRIPT.narrativeArc,
    assetLogic: DREAM_SCRIPT.assetLogic,
    script: DREAM_SCRIPT,
    videoMeta: {
      title: 'Dreamwalk Through a Memory Space',
      subtitle: 'Draft preview pending final render',
      createdAt: 'Updated 2m ago',
      format: '9:16 vertical',
      resolution: '1080 × 1920',
    },
  },
  {
    id: 'history-single-backrooms',
    type: 'single',
    title: 'Backrooms POV Vlog',
    updatedAt: 'Updated 1h ago',
    statusTag: 'Completed',
    duration: '15s',
    version: 'v1',
    outputSpec: BACKROOMS_SCRIPT.outputSpec || '16:9 landscape',
    description: 'A realistic handheld exploration short that escalates from quiet liminal drift into rising tension.',
    summary: BACKROOMS_SCRIPT.narrativeArc,
    assetLogic: BACKROOMS_SCRIPT.assetLogic,
    script: BACKROOMS_SCRIPT,
    videoMeta: {
      title: 'Backrooms POV Vlog',
      subtitle: 'Handheld suspense render ready for review',
      createdAt: 'Updated 1h ago',
      format: '16:9 landscape',
      resolution: '1920 × 1080',
    },
  },
  {
    id: 'history-single-fragrance',
    type: 'single',
    title: 'Fragrance Memory Ad',
    updatedAt: 'Yesterday, 18:20',
    statusTag: 'Draft',
    duration: '20s',
    version: 'v1',
    outputSpec: FRAGRANCE_SCRIPT.outputSpec || '9:16 vertical',
    description: FRAGRANCE_SCRIPT.shortDescription || '',
    summary: FRAGRANCE_SCRIPT.narrativeArc,
    assetLogic: FRAGRANCE_SCRIPT.assetLogic,
    script: FRAGRANCE_SCRIPT,
    videoMeta: {
      title: 'Fragrance Memory Ad',
      subtitle: 'Sensory product draft with soft-night reflections',
      createdAt: 'Yesterday, 18:20',
      format: '9:16 vertical',
      resolution: '1080 × 1920',
    },
  },
  {
    id: 'history-single-neon',
    type: 'single',
    title: 'Neon Rain City Walk',
    updatedAt: 'Yesterday, 14:30',
    statusTag: 'Generated',
    duration: '30s',
    version: 'v2',
    outputSpec: NEON_RAIN_SCRIPT.outputSpec || '9:16 vertical',
    description: NEON_RAIN_SCRIPT.shortDescription || '',
    summary: NEON_RAIN_SCRIPT.narrativeArc,
    assetLogic: NEON_RAIN_SCRIPT.assetLogic,
    script: NEON_RAIN_SCRIPT,
    videoMeta: {
      title: 'Neon Rain City Walk',
      subtitle: 'Generated city lifestyle preview',
      createdAt: 'Yesterday, 14:30',
      format: '9:16 vertical',
      resolution: '1080 × 1920',
    },
  },
  {
    id: 'history-single-bedroom',
    type: 'single',
    title: 'Soft Bedroom Routine',
    updatedAt: 'Apr 26, 2026',
    statusTag: 'Draft',
    duration: '45s',
    version: 'v2',
    outputSpec: BEDROOM_SCRIPT.outputSpec || '9:16 vertical',
    description: BEDROOM_SCRIPT.shortDescription || '',
    summary: BEDROOM_SCRIPT.narrativeArc,
    assetLogic: BEDROOM_SCRIPT.assetLogic,
    script: BEDROOM_SCRIPT,
    videoMeta: {
      title: 'Soft Bedroom Routine',
      subtitle: 'Lifestyle routine draft preview',
      createdAt: 'Apr 26, 2026',
      format: '9:16 vertical',
      resolution: '1080 × 1920',
    },
  },
];

export const MOCK_GENERATE_PROJECT_HISTORY: GenerateHistoryProjectItem[] = [
  {
    id: 'history-project-dream',
    type: 'project',
    title: 'Dream Walk Video Project',
    updatedAt: 'Updated 4h ago',
    statusTag: 'Draft',
    duration: '00:45',
    sequenceCount: 3,
    cover: '/assets/trending-7.jpg',
    narrativeDirection:
      'A dreamlike passage through softened interior spaces, where each sequence feels like a fading fragment of memory unfolding in slow motion.',
    aspectRatio: '9:16 Vertical',
    frameRate: '24fps Cinematic',
    renderMode: 'Dreamlike / Atmospheric',
    collaborationMode: 'Shared editing · 3 contributors · Version synced',
    sequences: [
      { id: 'dream-seq-1', title: 'Soft Arrival', duration: '15s', status: 'Draft', thumbnail: '/assets/trending-7.jpg', summary: 'Introduce the figure and the dream-space with a gentle floating entrance.', script: DREAM_SCRIPT },
      { id: 'dream-seq-2', title: 'Memory Drift', duration: '15s', status: 'Draft', thumbnail: '/assets/story-4.jpg', summary: 'Let the environment become more emotional than literal as the subject continues moving.', script: DREAM_SCRIPT },
      { id: 'dream-seq-3', title: 'Fading Afterimage', duration: '15s', status: 'Ready', thumbnail: '/assets/trending-5.jpg', summary: 'Resolve through suspension and a gradual dissolve into emotional stillness.', script: DREAM_SCRIPT },
    ],
  },
  {
    id: 'history-project-backrooms',
    type: 'project',
    title: 'Backrooms Adventure Project',
    updatedAt: 'Yesterday, 10:12',
    statusTag: 'Completed',
    duration: '01:06',
    sequenceCount: 5,
    cover: '/assets/trending-5.jpg',
    narrativeDirection:
      'A found-footage descent through fluorescent corridors where each sequence increases spatial dread and handheld instability.',
    aspectRatio: '16:9 Landscape',
    frameRate: '24fps Cinematic',
    renderMode: 'Realistic / Suspense',
    collaborationMode: 'Locked review pass · 2 contributors · Version synced',
    sequences: [
      { id: 'back-seq-1', title: 'Entrance Hall', duration: '12s', status: 'Generated', thumbnail: '/mock/backrooms/分镜 01.png', summary: 'Open with a quiet liminal corridor and low fluorescent hum.', script: BACKROOMS_SCRIPT },
      { id: 'back-seq-2', title: 'Repeated Corners', duration: '15s', status: 'Ready', thumbnail: '/mock/backrooms/分镜 02.png', summary: 'Push the maze logic and repeated geometry forward.', script: BACKROOMS_SCRIPT },
      { id: 'back-seq-3', title: 'Anomaly Detail', duration: '10s', status: 'Generated', thumbnail: '/mock/backrooms/分镜 03.png', summary: 'Use a specific shadow or mark to imply presence without revealing it.', script: BACKROOMS_SCRIPT },
      { id: 'back-seq-4', title: 'Hallway Pursuit', duration: '14s', status: 'Ready', thumbnail: '/mock/backrooms/分镜 04.png', summary: 'Escalate to faster handheld motion and breath-led panic.', script: BACKROOMS_SCRIPT },
      { id: 'back-seq-5', title: 'Blackout Cut', duration: '15s', status: 'Generated', thumbnail: '/mock/backrooms/分镜 05.png', summary: 'End on a cut-to-black transition that preserves ambiguity.', script: BACKROOMS_SCRIPT },
    ],
  },
  {
    id: 'history-project-city',
    type: 'project',
    title: 'City Life Vlog Collection',
    updatedAt: 'Apr 25, 2026',
    statusTag: 'Draft',
    duration: '01:28',
    sequenceCount: 7,
    cover: '/assets/citywalk/landmark.png',
    narrativeDirection:
      'A city-lifestyle collection that moves from atmosphere to movement, detail, and social rhythm across multiple neighborhood beats.',
    aspectRatio: '9:16 Vertical',
    frameRate: '30fps Social',
    renderMode: 'Lifestyle / Documentary',
    collaborationMode: 'Shared editing · 4 contributors · Comment threads synced',
    sequences: [
      { id: 'city-seq-1', title: 'Rain Intro', duration: '12s', status: 'Draft', thumbnail: '/assets/trending-3.jpg', summary: 'Open with wet pavement, signage, and a slow city reveal.', script: NEON_RAIN_SCRIPT },
      { id: 'city-seq-2', title: 'Street Motion', duration: '14s', status: 'Ready', thumbnail: '/assets/trending-4.jpg', summary: 'Bring in walking cadence and wardrobe rhythm.', script: NEON_RAIN_SCRIPT },
      { id: 'city-seq-3', title: 'Cafe Pause', duration: '10s', status: 'Draft', thumbnail: '/assets/trending-6.jpg', summary: 'Add a quiet stop to rebalance the city pacing.', script: BEDROOM_SCRIPT },
      { id: 'city-seq-4', title: 'Night Crosswalk', duration: '11s', status: 'Draft', thumbnail: '/assets/story-2.jpg', summary: 'Let crosswalk light and traffic create visual punctuation.', script: NEON_RAIN_SCRIPT },
    ],
  },
  {
    id: 'history-project-product',
    type: 'project',
    title: 'Product Campaign Series',
    updatedAt: 'Apr 23, 2026',
    statusTag: 'Generated',
    duration: '00:52',
    sequenceCount: 4,
    cover: '/assets/trending-5.jpg',
    narrativeDirection:
      'A multi-film product campaign balancing tactile glass, premium restraint, and memory-led emotional language across several short sequences.',
    aspectRatio: '9:16 Vertical',
    frameRate: '24fps Cinematic',
    renderMode: 'Clean / Commercial',
    collaborationMode: 'Campaign review · 3 contributors · Brand sync approved',
    sequences: [
      { id: 'prod-seq-1', title: 'Bottle Macro', duration: '12s', status: 'Generated', thumbnail: '/assets/trending-5.jpg', summary: 'Lead with tactile glass and reflected edge light.', script: FRAGRANCE_SCRIPT },
      { id: 'prod-seq-2', title: 'Mood Nightfall', duration: '10s', status: 'Generated', thumbnail: '/assets/story-2.jpg', summary: 'Build environment and premium nocturnal tone.', script: FRAGRANCE_SCRIPT },
      { id: 'prod-seq-3', title: 'Human Touch', duration: '14s', status: 'Ready', thumbnail: '/assets/story-4.jpg', summary: 'Introduce human presence through gesture and texture.', script: FRAGRANCE_SCRIPT },
      { id: 'prod-seq-4', title: 'Hero Finish', duration: '16s', status: 'Generated', thumbnail: '/assets/trending-6.jpg', summary: 'Resolve on a controlled product hero frame.', script: FRAGRANCE_SCRIPT },
    ],
  },
];
