import type { Question, Script, CommunityItem, Project, ScriptVersion, Chapter } from '@/types';

export const NAV_ITEMS = [
  { id: 'home', label: 'Home', icon: 'Home' },
  { id: 'generate', label: 'Generate', icon: 'Sparkles' },
  { id: 'script', label: 'Script', icon: 'FileText' },
  { id: 'edit', label: 'Edit', icon: 'Pencil' },
  { id: 'assets', label: 'Assets', icon: 'Folder' },
  { id: 'community', label: 'Community', icon: 'Users' },
] as const;

export const QUICK_MODES = [
  {
    id: 'guided',
    title: 'Guided Script',
    description: 'Start with an idea and build a script through guided questions',
    icon: 'Sparkles',
  },
  {
    id: 'script-first',
    title: 'Script-first',
    description: 'Write or edit a script directly before generating the video',
    icon: 'FileEdit',
  },
  {
    id: 'direct',
    title: 'Direct Generation',
    description: 'Generate directly from text, frames, or existing assets',
    icon: 'Zap',
  },
  {
    id: 'split',
    title: 'Split View Assets',
    description: 'Create while browsing and inserting assets side by side',
    icon: 'Layout',
  },
];

// Trending images map to generated assets
const TRENDING_IMAGES: Record<string, string> = {
  '1': '/assets/trending-5.jpg',
  '2': '/assets/trending-3.jpg',
  '3': '/assets/trending-7.jpg',
  '4': '/assets/trending-1.jpg',
  '5': '/assets/trending-3.jpg',
  '6': '/assets/trending-4.jpg',
  '7': '/assets/trending-5.jpg',
  '8': '/assets/trending-6.jpg',
};

export const TRENDING_ITEMS = [
  { id: '1', title: 'Misty Pines Morning', creator: '@visual_storyteller', category: 'Recent', image: TRENDING_IMAGES['1'] },
  { id: '2', title: 'Cyberpunk Studio', creator: '@neon_flow', category: 'Popular', image: TRENDING_IMAGES['2'] },
  { id: '3', title: 'Liquid Dreams', creator: '@abstract_ai', category: 'Dreamy', image: TRENDING_IMAGES['3'] },
  { id: '4', title: 'Golden Canopy', creator: '@nature_lens', category: 'Lifestyle', image: TRENDING_IMAGES['4'] },
  { id: '5', title: 'Neon Rain', creator: '@city_vibes', category: 'Recent', image: TRENDING_IMAGES['5'] },
  { id: '6', title: 'Ocean Whisper', creator: '@sea_dreams', category: 'Popular', image: TRENDING_IMAGES['6'] },
  { id: '7', title: 'Forest Bath', creator: '@green_lens', category: 'Dreamy', image: TRENDING_IMAGES['7'] },
  { id: '8', title: 'Urban Dawn', creator: '@metro_ai', category: 'Lifestyle', image: TRENDING_IMAGES['8'] },
];

export const GUIDED_QUESTIONS: Question[] = [
  {
    id: 'q1',
    category: 'focus',
    question: 'What do you most want the audience to remember?',
    subtitle: 'Clarify the one takeaway the audience should remember after the video ends.',
    options: [
      { id: '1', text: "The main subject's feeling" },
      { id: '2', text: 'The space and atmosphere' },
      { id: '3', text: 'The emotional tone around them' },
      { id: '4', text: 'One striking visual moment' },
      { id: '5', text: "I'm not sure yet" },
    ],
    allowCustom: true,
  },
  {
    id: 'q2',
    category: 'story',
    question: 'Which kind of flow fits this video best?',
    subtitle: 'Set the narrative flow so the script can shape pacing and progression with more intent.',
    options: [
      { id: '1', text: 'A gradual emotional shift' },
      { id: '2', text: 'A series of fragments' },
      { id: '3', text: 'A symbolic visual loop' },
      { id: '4', text: 'A clear short story' },
      { id: '5', text: "I'm not sure yet" },
    ],
    allowCustom: true,
  },
  {
    id: 'q3',
    category: 'visuals',
    question: 'Which asset should lead the video?',
    subtitle: 'Choose the asset that should anchor the opening and guide the visual direction first.',
    options: [
      { id: '1', text: 'Image 1 - Scene Reference' },
      { id: '2', text: 'Image 2 - Style Reference' },
      { id: '3', text: 'Image 3 - Mood Reference' },
      { id: '4', text: 'Generate New' },
    ],
    allowCustom: true,
  },
  {
    id: 'q4',
    category: 'visuals',
    question: 'How should the video move?',
    subtitle: 'Choose how motion and camera energy should carry the viewer through the scene.',
    options: [
      { id: '1', text: 'Slow and lingering' },
      { id: '2', text: 'Steady and moving forward' },
      { id: '3', text: 'Fragmented and jumpy' },
      { id: '4', text: 'Soft at first, stronger later' },
    ],
    allowCustom: true,
  },
  {
    id: 'q5',
    category: 'expression',
    question: 'How should the emotion be expressed?',
    subtitle: 'Decide how emotion should come through in visuals, captions, or sound treatment.',
    options: [
      { id: '1', text: 'Visuals only' },
      { id: '2', text: 'Minimal captions' },
      { id: '3', text: 'A short inner thought' },
      { id: '4', text: 'Let music carry the feeling' },
      { id: '5', text: "Leave space, don't explain too much" },
    ],
    allowCustom: true,
  },
];

export const MOCK_SCRIPT: Script = {
  id: 'script-1',
  title: 'Dream Walk Video',
  status: 'draft',
  duration: '15s',
  version: 'v1',
  narrativeArc: 'A dreamlike walk unfolds through a quiet interior space, where the edges of reality soften and each moment feels half-remembered.',
  emotionalGoal: 'The audience should feel calm, distant, and slightly suspended \u2014 as if they are witnessing a memory rather than a present moment.',
  visualDirection: 'Soft light, muted tones, high-key exposure, and subtle atmospheric texture. The world should feel gentle, still, and slightly unreal.',
  rhythm: 'Slow entry, steady pace, brief pauses on detail, and a quiet emotional release at the end.',
  assetLogic: 'Image 1 \u2192 Main Subject\nImage 2 \u2192 Scene Reference\nImage 3 \u2192 Mood Reference',
  shots: [
    {
      id: 'shot-1',
      timeRange: '0-2s',
      preview: '',
      visual: 'A lone figure steps into a softly lit corridor, framed by a large window and surrounded by quiet space.',
      purpose: 'SET THE MOOD',
      camera: 'Slow push-in',
      asset: 'IMAGE2',
      copy: '"It feels like I\'m walking into something I almost remember."',
    },
    {
      id: 'shot-2',
      timeRange: '2-4.5s',
      preview: '',
      visual: 'Light drifts across the floor and walls, revealing a still room that feels untouched and suspended in time.',
      purpose: 'ESTABLISH THE SPACE',
      camera: 'Gentle pan',
      asset: 'IMAGE3',
      copy: '"The room is quiet enough to let the light speak first."',
    },
    {
      id: 'shot-3',
      timeRange: '4.5-7.5s',
      preview: '',
      visual: 'Close-up of a cup on the table as steam rises slowly, with small details holding the frame in silence.',
      purpose: 'BUILD ATMOSPHERE',
      camera: 'Macro / detail shot',
      asset: 'IMAGE1',
      copy: '"Everything becomes softer when I stop moving."',
    },
    {
      id: 'shot-4',
      timeRange: '7.5-10.5s',
      preview: '',
      visual: 'The subject pauses near the window, half-facing the light, as if caught between attention and memory.',
      purpose: 'SHIFT EMOTION',
      camera: 'Subjective close-up',
      asset: 'IMAGE1',
      copy: '"For a moment, it feels like time forgets to move."',
    },
    {
      id: 'shot-5',
      timeRange: '10.5-13s',
      preview: '',
      visual: 'The cup remains still while the light slowly shifts across the surface, turning the frame into a quiet pause.',
      purpose: 'DEEPEN FOCUS',
      camera: 'Static slow shot',
      asset: 'IMAGE3',
      copy: '"I want this feeling to stay a little longer."',
    },
    {
      id: 'shot-6',
      timeRange: '13-15s',
      preview: '',
      visual: 'A final close-up lingers before the frame gently pulls away, leaving the space calm and unresolved.',
      purpose: 'CLOSE THE SCENE',
      camera: 'Gentle pull-back',
      asset: 'IMAGE2',
      copy: '"Maybe I\'ll find my way back here again."',
    },
  ],
};

// Community cover images
const COMMUNITY_IMAGES: Record<string, string> = {
  '1': '/assets/trending-1.jpg',
  '2': '/assets/trending-4.jpg',
  '3': '/assets/trending-5.jpg',
  '4': '/assets/trending-3.jpg',
  '5': '/assets/trending-4.jpg',
  '6': '/assets/trending-6.jpg',
};

export const MOCK_COMMUNITY_ITEMS: CommunityItem[] = [
  { id: '1', title: 'Awakening', creator: 'Wukong AI', creatorAvatar: '', likes: 58439, duration: '06:09', description: 'AIGC sci-fi short with a bright industrial future tone.', category: 'Narrative', image: COMMUNITY_IMAGES['1'], whyItWorks: 'The opening uses slow reveal to build anticipation. The color grading shifts from cold blue to warm amber as the narrative turns from isolation to hope. Sound design layers industrial hum with melodic fragments to create emotional texture.', bestUsedFor: ['Mood-led concepting', 'Opening sequences', 'Brand manifestos'] },
  { id: '2', title: 'Heart Tracks', creator: 'Thirteen Lives', creatorAvatar: '', likes: 1889, duration: '03:18', description: 'An inner-dialogue visual poem with soft dramatic framing.', category: 'Product', image: COMMUNITY_IMAGES['2'], whyItWorks: 'Tight framing on hands and objects keeps the viewer intimate with the subject. The edit alternates between 3-second stillness and 1-second motion, creating a breathing rhythm that mirrors the inner dialogue.', bestUsedFor: ['Product storytelling', 'Emotional branding', 'Short-form social'] },
  { id: '3', title: 'Eight Hours Late', creator: 'Daydreamer', creatorAvatar: '', likes: 4210, duration: '04:55', description: 'Quiet walk anxiety and through a still glass town.', category: 'Lifestyle', image: COMMUNITY_IMAGES['3'], whyItWorks: 'Natural lighting at golden hour provides production value without equipment. The walking POV creates forward momentum without requiring a plot. Reflections in glass buildings double the visual density.', bestUsedFor: ['Travel content', 'Lifestyle reels', 'City documentaries'] },
  { id: '4', title: 'Neon Genesis', creator: 'CyberLabs', creatorAvatar: '', likes: 12345, duration: '02:30', description: 'A neon-soaked journey through a digital afterlife.', category: 'Experimental', image: COMMUNITY_IMAGES['4'], whyItWorks: 'Color as narrative: each neon hue signals a different emotional state. Fast cuts (under 1s) are anchored by recurring visual motifs. The soundtrack uses sub-bass drops as punctuation between scenes.', bestUsedFor: ['Music videos', 'Tech promos', 'Event openers'] },
  { id: '5', title: 'Morning Tide', creator: 'SeaFilm', creatorAvatar: '', likes: 8901, duration: '05:12', description: 'The rhythm of waves meets the rhythm of memory.', category: 'Narrative', image: COMMUNITY_IMAGES['5'], whyItWorks: 'Parallel cutting between waves and facial close-ups creates metaphor without dialogue. The pacing follows the tide: slow build, crest, retreat. This mimics how memory surfaces and recedes.', bestUsedFor: ['Documentary intros', 'Wellness content', 'Memorial pieces'] },
  { id: '6', title: 'Concrete Garden', creator: 'UrbanLens', creatorAvatar: '', likes: 3456, duration: '03:45', description: 'Finding nature in the cracks of a metropolis.', category: 'Environment', image: COMMUNITY_IMAGES['6'], whyItWorks: 'Macro photography turns mundane cracks into landscapes. The contrast between brutalist architecture and organic growth creates visual tension. No camera movement needed — the subjects themselves provide dynamism.', bestUsedFor: ['Environmental campaigns', 'Urban storytelling', 'Photography showcases'] },
];

// ─── Preset Script Templates ───

export const PRESET_BACKROOMS_SCRIPT: Script = {
  id: 'preset-backrooms-001',
  title: 'Backrooms Adventure — The Liminal Space',
  status: 'draft',
  duration: '60s',
  version: 'v1',
  narrativeArc: 'A lone wanderer descends into the infinite yellow halls of the Backrooms, each room revealing deeper layers of liminal dread. The journey begins with curiosity, descends into paranoia, and ends with an ambiguous escape — or deeper entrapment.',
  emotionalGoal: 'Evoke creeping dread, claustrophobia, and the unsettling comfort of liminal spaces. The viewer should feel both fascinated and disturbed.',
  visualDirection: 'Warm fluorescent lighting against desaturated yellow walls. Long corridors with repeating patterns. Occasional glitches and VHS distortion. POV camera to immerse the viewer as the wanderer.',
  rhythm: 'Slow, deliberate pacing in opening. Accelerating heartbeat rhythm in middle sequence. Abrupt cut to black at climax.',
  assetLogic: 'AI-generated liminal space imagery as primary visual anchor. No human faces — only shadows and silhouettes to preserve mystery.',
  shots: [
    { id: 'br-1', timeRange: '0-8s', preview: '/assets/backrooms-1.jpg', visual: 'Wide shot: empty yellow corridor stretching to infinity. Flickering fluorescent lights. "No one around for miles."', purpose: 'SET THE MOOD', camera: 'Static wide, slow push-in', asset: 'GENERATED', copy: 'I remember the exact moment I noclipped. One second I was walking home. The next... I was here.' },
    { id: 'br-2', timeRange: '8-16s', preview: '/assets/backrooms-1.jpg', visual: 'POV walking down corridor. Wallpaper pattern repeats. Distant hum of fluorescent lights. Shadow flickers at the edge of frame.', purpose: 'BUILD TENSION', camera: 'POV handheld, subtle drift', asset: 'GENERATED', copy: 'The walls are damp. The carpet smells like wet cardboard. And the lights... they never stop buzzing.' },
    { id: 'br-3', timeRange: '16-24s', preview: '/assets/backrooms-2.jpg', visual: 'Turning a corner — identical corridor. A single wooden door with a rusted handle. Door slightly ajar.', purpose: 'INTRODUCE MYSTERY', camera: 'Slow pan right, reveal door', asset: 'GENERATED', copy: 'Every room looks the same. But this door... this door wasn\'t here before.' },
    { id: 'br-4', timeRange: '24-32s', preview: '/assets/backrooms-3.jpg', visual: 'Entering the door — darker room. Water on the floor. Reflections on the ceiling. Something moves in the water.', purpose: 'RAISE STAKES', camera: 'Low angle, follow the water', asset: 'GENERATED', copy: 'Level 2, they call it. The water is knee-deep. And something is swimming beneath my feet.' },
    { id: 'br-5', timeRange: '32-40s', preview: '/assets/backrooms-4.jpg', visual: 'Running now. Corridors blur. Breath visible in cold air. A figure stands at the end of the hall — back turned, motionless.', purpose: 'CLIMAX BUILD', camera: 'Shaky handheld, running POV', asset: 'GENERATED', copy: 'I\'m not alone anymore. I can hear it breathing. I can smell it — like copper and mold.' },
    { id: 'br-6', timeRange: '40-48s', preview: '/assets/backrooms-4.jpg', visual: 'The figure turns. Face obscured by shadow. Long limbs. Wrong proportions. It starts walking toward camera.', purpose: 'CONFRONTATION', camera: 'Rapid zoom out, then freeze frame', asset: 'GENERATED', copy: 'It doesn\'t run. It glides. Like it knows I have nowhere to go.' },
    { id: 'br-7', timeRange: '48-54s', preview: '/assets/backrooms-5.jpg', visual: 'Emergency exit sign glowing red. Sprint toward it. Hand reaches for the push bar. Static electricity builds.', purpose: 'ESCAPE ATTEMPT', camera: 'Over-the-shoulder, desperate motion', asset: 'GENERATED', copy: 'There\'s an exit. There\'s always an exit. Right? Please tell me there\'s an exit.' },
    { id: 'br-8', timeRange: '54-60s', preview: '/assets/backrooms-1.jpg', visual: 'Cut to black. A single fluorescent light flickers on. Same yellow corridor. Same buzzing. Different number on the wall: "Level 922."', purpose: 'UNSETTLING RESOLUTION', camera: 'Static wide. Hold for 3 seconds. Fade.', asset: 'GENERATED', copy: 'The door opened. But I didn\'t escape. I just went deeper. Welcome to Level 922.' },
  ],
};

export const PRESET_CITYWALK_SCRIPT: Script = {
  id: 'preset-citywalk-001',
  title: 'Shenzhen City Walk — A Day in the Life',
  status: 'draft',
  duration: '45s',
  version: 'v1',
  narrativeArc: 'A young woman\'s vibrant day in Shenzhen: from a sunlit morning stretch to late-night hotpot with friends. A celebration of urban energy, fashion, friendship, and the small luxuries of city life.',
  emotionalGoal: 'Make the viewer feel energized, aspirational, and warmly connected. A "I want her life" vibe that\'s relatable, not unattainable.',
  visualDirection: 'Bright, saturated colors for daytime. Golden hour warmth for evening. Clean compositions with strong leading lines. Fashion-forward framing with confident body language.',
  rhythm: 'Upbeat tempo matching city energy. Quick cuts during shopping and transit. Longer holds during spa and dinner to create contrast and breathing room.',
  assetLogic: 'User-uploaded lifestyle photos as primary visuals. Real locations in Shenzhen for authenticity. Natural light priority.',
  shots: [
    { id: 'cw-1', timeRange: '0-6s', preview: '/assets/citywalk/morning.png', visual: 'Soft morning light through blinds. Girl stretching on bed in silk pajamas. Sunlight catches her hair. Peaceful, luxurious start to the day.', purpose: 'SET THE MOOD', camera: 'Static medium, gentle morning glow', asset: 'UPLOADED', copy: 'Every great day starts with a slow morning. Coffee first. Everything else can wait.' },
    { id: 'cw-2', timeRange: '6-12s', preview: '/assets/citywalk/subway.png', visual: 'Stepping onto the escalator in a sleek metro station. Gray blazer, designer bag, confident smile. City rhythm begins.', purpose: 'INTRODUCE JOURNEY', camera: 'Low angle tracking shot', asset: 'UPLOADED', copy: 'Shenzhen\'s metro is my runway. Platform shoes? Mandatory.' },
    { id: 'cw-3', timeRange: '12-18s', preview: '/assets/citywalk/landmark.png', visual: 'Standing before a towering glass skyscraper. Low angle makes her look powerful. Hand shielding eyes from sun. Urban explorer energy.', purpose: 'ESTABLISH LOCATION', camera: 'Extreme low angle, upward gaze', asset: 'UPLOADED', copy: 'This city is always building higher. And honestly? So am I.' },
    { id: 'cw-4', timeRange: '18-24s', preview: '/assets/citywalk/shopping.png', visual: 'Night shopping haul. Multiple bags from premium stores. Walking through mall gates, hair flowing. Pure joy and satisfaction.', purpose: 'BUILD ENERGY', camera: 'Follow shot, dynamic movement', asset: 'UPLOADED', copy: 'Retail therapy is real. And yes, I got matching sets.' },
    { id: 'cw-5', timeRange: '24-30s', preview: '/assets/citywalk/fashion.png', visual: 'Inside a bright boutique. Trying on a jacket, pointing at the mirror with a cheeky grin. Shopping bags in hand. Fashion is play.', purpose: 'SHOW PERSONALITY', camera: 'Medium close-up, mirror reflection', asset: 'UPLOADED', copy: 'Rule #1: If it makes you smile, buy it. Rule #2: No regrets.' },
    { id: 'cw-6', timeRange: '30-36s', preview: '/assets/citywalk/spa.png', visual: 'Luxury spa treatment. Steaming facial, eyes closed, complete relaxation. Golden leather recliner. Warm ambient lighting. The calm between city storms.', purpose: 'CREATE CONTRAST', camera: 'Close-up, shallow depth of field', asset: 'UPLOADED', copy: 'Even city girls need to pause. This is my reset button.' },
    { id: 'cw-7', timeRange: '36-45s', preview: '/assets/citywalk/dinner.png', visual: 'Hotpot night with friends. Hands clinking beer glasses over a bubbling pot. Warm, communal, alive. The perfect end to a perfect day.', purpose: 'WARM RESOLUTION', camera: 'Overhead wide, capturing the group energy', asset: 'UPLOADED', copy: 'The best part of any day? Sharing it with people who get you. Cheers, Shenzhen.' },
  ],
};

export const PRESET_TEMPLATES = [
  {
    id: 'backrooms',
    title: 'Backrooms Adventure',
    description: 'Suspense horror in liminal spaces. 8 shots, 60s.',
    thumbnail: '/assets/backrooms-1.jpg',
    script: PRESET_BACKROOMS_SCRIPT,
    genre: 'Horror / Suspense',
    shots: 8,
    duration: '60s',
  },
  {
    id: 'citywalk',
    title: 'Shenzhen City Walk Vlog',
    description: 'A day in the life of a city girl. 7 shots, 45s.',
    thumbnail: '/assets/citywalk/landmark.png',
    script: PRESET_CITYWALK_SCRIPT,
    genre: 'Lifestyle / Vlog',
    shots: 7,
    duration: '45s',
  },
];

export const MOCK_PROJECTS: Project[] = [
  { id: 'p1', name: 'DreamCore Adventure', assetCount: 24 },
  { id: 'p2', name: 'STARWARS Universe', assetCount: 18 },
  { id: 'p3', name: 'MEME vs superman', assetCount: 12 },
];

export const MOCK_SCRIPT_VERSIONS: ScriptVersion[] = [
  { id: 'v1', name: 'Dream Walk Video v1', updatedAt: 'Updated 2m ago', type: 'draft' },
  { id: 'v2.3', name: 'v2.3 Draft', updatedAt: 'Updated 4h ago', type: 'draft' },
  { id: 'v2.2', name: 'v2.2 Autosave', updatedAt: 'Yesterday, 14:30', type: 'autosave' },
  { id: 'v2.1', name: 'v2.1 Archive', updatedAt: 'Oct 12, 2023', type: 'archive' },
];

export const MOCK_CHAPTERS: Chapter[] = [
  {
    id: 'ch1',
    title: 'Chapter 1',
    duration: '30secs',
    boardCount: 3,
    description: 'He fell into the digital world. And then...',
    boards: [
      { id: 'b1', title: 'Wandering in city', number: '1.1', duration: '15S', status: 'DRAFT', previewStatus: 'MAIN PREVIEW', preview: '', description: 'A lone figure moves through a dim corridor as light and dust slowly shape the atmosphere into something half remembered.' },
      { id: 'b2', title: 'Discover Entry Door', number: '1.2', duration: '5S', status: 'IN PROGRESS', previewStatus: 'SECONDARY PREVIEW', preview: '', description: 'The whispers of history resonate in the air, intertwining with the shadows cast by flickering candlelight, revealing stories long forgotten.' },
      { id: 'b3', title: 'Dive into digital world', number: '1.3', duration: '10S', status: 'COMPLETE', previewStatus: 'FINAL PREVIEW', preview: '', description: 'In a surreal landscape where reality blurs, fleeting images dance before the eyes, evoking emotions that linger like a haunting melody.' },
    ],
  },
  {
    id: 'ch2',
    title: 'Chapter 2',
    duration: '50secs',
    boardCount: 8,
    description: 'Looking for exit...',
    boards: [
      { id: 'b4', title: 'Wandering in city', number: '2.1', duration: '15S', status: 'DRAFT', previewStatus: 'MAIN PREVIEW', preview: '', description: 'A lone figure moves through a dim corridor as light and dust slowly shape the atmosphere into something half remembered.' },
      { id: 'b5', title: 'Discover Entry Door', number: '2.2', duration: '20S', status: 'IN PROGRESS', previewStatus: 'SECONDARY PREVIEW', preview: '', description: 'The whispers of history resonate in the air, intertwining with the shadows cast by flickering candlelight.' },
      { id: 'b6', title: 'Dive into digital world', number: '2.3', duration: '5S', status: 'COMPLETE', previewStatus: 'FINAL PREVIEW', preview: '', description: 'In a surreal landscape where reality blurs, fleeting images dance before the eyes.' },
    ],
  },
  {
    id: 'ch3',
    title: 'Chapter 3',
    duration: '12secs',
    boardCount: 2,
    description: 'Find an exit, but fall into Level 999, never escape from the world.',
    boards: [
      { id: 'b7', title: 'Wandering in city', number: '3.1', duration: '5S', status: 'DRAFT', previewStatus: 'MAIN PREVIEW', preview: '', description: 'A lone figure moves through a dim corridor as light and dust slowly shape the atmosphere.' },
      { id: 'b8', title: 'Discover Entry Door', number: '3.2', duration: '5S', status: 'IN PROGRESS', previewStatus: 'SECONDARY PREVIEW', preview: '', description: 'The whispers of history resonate in the air.' },
    ],
  },
];

export const CATEGORY_TABS = ['All', 'Narrative', 'Product', 'Lifestyle', 'Environment', 'Abstract', 'Experimental'];
export const TRENDING_TABS = ['Recent', 'Popular', 'Dreamy', 'Lifestyle', 'Experimental'];
