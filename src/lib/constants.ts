import { assetPath } from '@/lib/assetPath';
import type { Question, Script, CommunityItem, Project, ScriptVersion, Chapter } from '@/types';
import { BACKROOMS_MOCK_STILLS, BACKROOMS_MOCK_VIDEO } from '@/lib/mockBackroomsAssets';

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
  '1': assetPath('/assets/trending-5.jpg'),
  '2': assetPath('/assets/trending-3.jpg'),
  '3': assetPath('/assets/trending-7.jpg'),
  '4': assetPath('/assets/story-4.jpg'),
  '5': assetPath('/assets/story-2.jpg'),
  '6': assetPath('/assets/citywalk/morning.png'),
  '7': assetPath('/assets/citywalk/landmark.png'),
  '8': assetPath('/assets/trending-6.jpg'),
};

export const TRENDING_ITEMS = [
  {
    id: '1',
    title: 'Misty Pines Morning',
    creator: '@visual_storyteller',
    category: 'Recent',
    image: TRENDING_IMAGES['1'],
    description: 'Forest haze, soft morning light, and a slow walk into green atmosphere.',
    duration: '15s',
  },
  {
    id: '2',
    title: 'Neon Rain',
    creator: '@city_vibes',
    category: 'Popular',
    image: TRENDING_IMAGES['2'],
    description: 'Rain-soaked streets, reflected signage, and moody urban night energy.',
    duration: '18s',
  },
  {
    id: '3',
    title: 'Dream Corridor',
    creator: '@memory_loop',
    category: 'Dreamy',
    image: TRENDING_IMAGES['3'],
    description: 'A soft liminal passage where space feels half-remembered and unreal.',
    duration: '12s',
  },
  {
    id: '4',
    title: 'Glass Garden',
    creator: '@future.botanic',
    category: 'Experimental',
    image: TRENDING_IMAGES['4'],
    description: 'Glass reflections, suspended dust, and futuristic plant textures.',
    duration: '20s',
  },
  {
    id: '5',
    title: 'Product Nightfall',
    creator: '@quiet.lux',
    category: 'Popular',
    image: TRENDING_IMAGES['5'],
    description: 'Premium product framing with dark reflections, mist, and restrained light.',
    duration: '15s',
  },
  {
    id: '6',
    title: 'Quiet Apartment Loop',
    creator: '@stillframe.house',
    category: 'Lifestyle',
    image: TRENDING_IMAGES['6'],
    description: 'Warm interiors, window light, and a loop of everyday calm.',
    duration: '14s',
  },
  {
    id: '7',
    title: 'Urban Dawn',
    creator: '@metro_ai',
    category: 'Recent',
    image: TRENDING_IMAGES['7'],
    description: 'A city landmark caught in cool dawn light with a clean vertical rhythm.',
    duration: '16s',
  },
  {
    id: '8',
    title: 'Liquid Dreams',
    creator: '@abstract_ai',
    category: 'Dreamy',
    image: TRENDING_IMAGES['8'],
    description: 'Fluid color, soft silhouettes, and a dream state that never fully resolves.',
    duration: '11s',
  },
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
  '1': assetPath('/assets/trending-1.jpg'),
  '2': assetPath('/assets/trending-4.jpg'),
  '3': assetPath('/assets/trending-5.jpg'),
  '4': assetPath('/assets/trending-3.jpg'),
  '5': assetPath('/assets/trending-4.jpg'),
  '6': assetPath('/assets/trending-6.jpg'),
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
  videoAsset: BACKROOMS_MOCK_VIDEO,
  shots: [
    { id: 'br-1', timeRange: '0-8s', preview: BACKROOMS_MOCK_STILLS[0], visual: 'Wide shot: empty yellow corridor stretching to infinity. Flickering fluorescent lights. "No one around for miles."', purpose: 'SET THE MOOD', camera: 'Static wide, slow push-in', asset: 'GENERATED', copy: 'I remember the exact moment I noclipped. One second I was walking home. The next... I was here.' },
    { id: 'br-2', timeRange: '8-16s', preview: BACKROOMS_MOCK_STILLS[1], visual: 'POV walking down corridor. Wallpaper pattern repeats. Distant hum of fluorescent lights. Shadow flickers at the edge of frame.', purpose: 'BUILD TENSION', camera: 'POV handheld, subtle drift', asset: 'GENERATED', copy: 'The walls are damp. The carpet smells like wet cardboard. And the lights... they never stop buzzing.' },
    { id: 'br-3', timeRange: '16-24s', preview: BACKROOMS_MOCK_STILLS[2], visual: 'Turning a corner — identical corridor. A single wooden door with a rusted handle. Door slightly ajar.', purpose: 'INTRODUCE MYSTERY', camera: 'Slow pan right, reveal door', asset: 'GENERATED', copy: 'Every room looks the same. But this door... this door wasn\'t here before.' },
    { id: 'br-4', timeRange: '24-32s', preview: BACKROOMS_MOCK_STILLS[3], visual: 'Entering the door — darker room. Water on the floor. Reflections on the ceiling. Something moves in the water.', purpose: 'RAISE STAKES', camera: 'Low angle, follow the water', asset: 'GENERATED', copy: 'Level 2, they call it. The water is knee-deep. And something is swimming beneath my feet.' },
    { id: 'br-5', timeRange: '32-40s', preview: BACKROOMS_MOCK_STILLS[4], visual: 'Running now. Corridors blur. Breath visible in cold air. A figure stands at the end of the hall — back turned, motionless.', purpose: 'CLIMAX BUILD', camera: 'Shaky handheld, running POV', asset: 'GENERATED', copy: 'I\'m not alone anymore. I can hear it breathing. I can smell it — like copper and mold.' },
    { id: 'br-6', timeRange: '40-48s', preview: BACKROOMS_MOCK_STILLS[3], visual: 'The figure turns. Face obscured by shadow. Long limbs. Wrong proportions. It starts walking toward camera.', purpose: 'CONFRONTATION', camera: 'Rapid zoom out, then freeze frame', asset: 'GENERATED', copy: 'It doesn\'t run. It glides. Like it knows I have nowhere to go.' },
    { id: 'br-7', timeRange: '48-54s', preview: BACKROOMS_MOCK_STILLS[4], visual: 'Emergency exit sign glowing red. Sprint toward it. Hand reaches for the push bar. Static electricity builds.', purpose: 'ESCAPE ATTEMPT', camera: 'Over-the-shoulder, desperate motion', asset: 'GENERATED', copy: 'There\'s an exit. There\'s always an exit. Right? Please tell me there\'s an exit.' },
    { id: 'br-8', timeRange: '54-60s', preview: BACKROOMS_MOCK_STILLS[0], visual: 'Cut to black. A single fluorescent light flickers on. Same yellow corridor. Same buzzing. Different number on the wall: "Level 922."', purpose: 'UNSETTLING RESOLUTION', camera: 'Static wide. Hold for 3 seconds. Fade.', asset: 'GENERATED', copy: 'The door opened. But I didn\'t escape. I just went deeper. Welcome to Level 922.' },
  ],
};

export const PRESET_DREAMWALK_MEMORY_SCRIPT: Script = {
  id: 'preset-dreamwalk-memory-001',
  title: 'Dreamwalk Through a Memory Space',
  status: 'draft',
  duration: '15s',
  version: 'v1',
  category: 'Dreamlike / Atmospheric',
  coverImage: assetPath('/assets/trending-7.jpg'),
  outputSpec: '9:16 vertical · around 15 seconds · dreamlike atmospheric short video',
  shortDescription:
    'A quiet 15-second dreamlike short where a figure drifts through a remembered interior space shaped by soft light, blur, and emotional atmosphere.',
  narrativeArc:
    'This video unfolds as a drifting dream fragment: a solitary figure moves slowly through a remembered interior space, while the environment, light, and motion dissolve into one continuous emotional atmosphere. Rather than telling a clear story, the piece lingers in sensation, memory, and quiet transition.',
  emotionalGoal:
    'Create a quiet, immersive emotional state that feels calm, intimate, and slightly melancholic - like moving through a dream you almost remember after waking.',
  visualDirection:
    'Use a soft, dreamlike visual language built around diffused edges, gentle blur, floating camera movement, and a memory-space environment. The main figure should feel present but never sharply defined, as if seen through the softness of recollection.',
  rhythm:
    '5 gentle beats moving from arrival, drift, pause, and emotional deepening toward a soft unresolved fade. The pacing should remain slow and fluid throughout.',
  assetLogic:
    'Image 1 -> Main Character Reference\nImage 2 -> Dream Space Reference\nImage 3 -> Mood / Lighting Reference',
  shots: [
    {
      id: 'dw-1',
      timeRange: '0-3s',
      preview: assetPath('/assets/trending-7.jpg'),
      visual:
        'A soft opening into the dream space. The subject appears quietly within a remembered interior, moving slowly as if entering a fading memory.',
      purpose: 'SET THE TONE',
      camera: 'Slow floating push-in',
      asset: 'Image 1 · Main Character Reference · Image 2 · Dream Space Reference · Image 3 · Mood / Lighting Reference',
      copy: 'It feels like stepping into a place I almost remember.',
    },
    {
      id: 'dw-2',
      timeRange: '3-6s',
      preview: assetPath('/assets/trending-6.jpg'),
      visual:
        'The figure drifts deeper into the environment. The space feels calm and familiar, yet emotionally distant and unreal.',
      purpose: 'BUILD ATMOSPHERE',
      camera: 'Slow lateral drift',
      asset: 'Image 1 · Main Character Reference · Image 2 · Dream Space Reference',
      copy: 'Nothing here feels unfamiliar, but nothing feels fully real.',
    },
    {
      id: 'dw-3',
      timeRange: '6-9s',
      preview: assetPath('/assets/story-4.jpg'),
      visual:
        'Motion slows into near stillness. Light, shadow, and texture become the emotional center of the frame.',
      purpose: 'HOLD THE DREAM',
      camera: 'Near-static frame with subtle sway',
      asset: 'Image 2 · Dream Space Reference · Image 3 · Mood / Lighting Reference',
      copy: 'For a moment, the dream stops moving and simply breathes.',
    },
    {
      id: 'dw-4',
      timeRange: '9-12s',
      preview: assetPath('/assets/story-2.jpg'),
      visual:
        'The dream deepens. The space grows softer and more fluid, as if the memory is dissolving from within.',
      purpose: 'DEEPEN FEELING',
      camera: 'Slow inward drift',
      asset: 'Image 1 · Main Character Reference · Image 3 · Mood / Lighting Reference',
      copy: 'The space grows softer, as if it is remembering itself while I pass through it.',
    },
    {
      id: 'dw-5',
      timeRange: '12-15s',
      preview: assetPath('/assets/trending-5.jpg'),
      visual:
        'The subject and space gently fade, leaving behind only a soft emotional trace.',
      purpose: 'LEAVE AN AFTERGLOW',
      camera: 'Minimal motion hold',
      asset: 'Image 3 · Mood / Lighting Reference',
      copy: 'And then it begins to disappear, before I can understand where I was.',
    },
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
    { id: 'cw-1', timeRange: '0-6s', preview: assetPath('/assets/citywalk/morning.png'), visual: 'Soft morning light through blinds. Girl stretching on bed in silk pajamas. Sunlight catches her hair. Peaceful, luxurious start to the day.', purpose: 'SET THE MOOD', camera: 'Static medium, gentle morning glow', asset: 'UPLOADED', copy: 'Every great day starts with a slow morning. Coffee first. Everything else can wait.' },
    { id: 'cw-2', timeRange: '6-12s', preview: assetPath('/assets/citywalk/subway.png'), visual: 'Stepping onto the escalator in a sleek metro station. Gray blazer, designer bag, confident smile. City rhythm begins.', purpose: 'INTRODUCE JOURNEY', camera: 'Low angle tracking shot', asset: 'UPLOADED', copy: 'Shenzhen\'s metro is my runway. Platform shoes? Mandatory.' },
    { id: 'cw-3', timeRange: '12-18s', preview: assetPath('/assets/citywalk/landmark.png'), visual: 'Standing before a towering glass skyscraper. Low angle makes her look powerful. Hand shielding eyes from sun. Urban explorer energy.', purpose: 'ESTABLISH LOCATION', camera: 'Extreme low angle, upward gaze', asset: 'UPLOADED', copy: 'This city is always building higher. And honestly? So am I.' },
    { id: 'cw-4', timeRange: '18-24s', preview: assetPath('/assets/citywalk/shopping.png'), visual: 'Night shopping haul. Multiple bags from premium stores. Walking through mall gates, hair flowing. Pure joy and satisfaction.', purpose: 'BUILD ENERGY', camera: 'Follow shot, dynamic movement', asset: 'UPLOADED', copy: 'Retail therapy is real. And yes, I got matching sets.' },
    { id: 'cw-5', timeRange: '24-30s', preview: assetPath('/assets/citywalk/fashion.png'), visual: 'Inside a bright boutique. Trying on a jacket, pointing at the mirror with a cheeky grin. Shopping bags in hand. Fashion is play.', purpose: 'SHOW PERSONALITY', camera: 'Medium close-up, mirror reflection', asset: 'UPLOADED', copy: 'Rule #1: If it makes you smile, buy it. Rule #2: No regrets.' },
    { id: 'cw-6', timeRange: '30-36s', preview: assetPath('/assets/citywalk/spa.png'), visual: 'Luxury spa treatment. Steaming facial, eyes closed, complete relaxation. Golden leather recliner. Warm ambient lighting. The calm between city storms.', purpose: 'CREATE CONTRAST', camera: 'Close-up, shallow depth of field', asset: 'UPLOADED', copy: 'Even city girls need to pause. This is my reset button.' },
    { id: 'cw-7', timeRange: '36-45s', preview: assetPath('/assets/citywalk/dinner.png'), visual: 'Hotpot night with friends. Hands clinking beer glasses over a bubbling pot. Warm, communal, alive. The perfect end to a perfect day.', purpose: 'WARM RESOLUTION', camera: 'Overhead wide, capturing the group energy', asset: 'UPLOADED', copy: 'The best part of any day? Sharing it with people who get you. Cheers, Shenzhen.' },
  ],
};

export const PRESET_COZY_BEDROOM_SCRIPT: Script = {
  id: 'preset-cozy-bedroom-001',
  title: 'Cozy Bedroom Morning Routine',
  status: 'draft',
  duration: '30s',
  version: 'v1',
  category: 'Lifestyle / Soft Daily',
  coverImage: assetPath('/assets/citywalk/morning.png'),
  outputSpec: '9:16 vertical · around 30 seconds · warm morning routine film',
  shortDescription: 'A soft domestic morning with warm light, gentle pacing, and intimate everyday details.',
  narrativeArc: 'A gentle bedroom morning unfolds from first light to the moment the subject is ready to step into the day, emphasizing comfort, slowness, and ritual.',
  emotionalGoal: 'The audience should feel soothed, safe, and quietly inspired by the intimacy of small morning gestures.',
  visualDirection: 'Warm natural light, cream textiles, subtle steam, close domestic textures, and a soft handheld camera that never feels intrusive.',
  rhythm: 'Start slow with light and fabric details, then move into a steady sequence of actions before resolving on a calm final frame.',
  assetLogic: 'Bedroom textures, window light, and close-up routine details carry the story more than dialogue.',
  shots: [
    { id: 'cb-1', timeRange: '0-5s', preview: assetPath('/assets/citywalk/morning.png'), visual: 'Sunlight slips across rumpled bedding as the subject opens one eye and stretches into the frame.', purpose: 'OPEN SOFTLY', camera: 'Static close wide', asset: 'UPLOADED', copy: 'The room wakes up before I do.' },
    { id: 'cb-2', timeRange: '5-10s', preview: assetPath('/assets/story-1.jpg'), visual: 'Hands pull back linen curtains, letting warmer light flood the room and brighten the bedside table.', purpose: 'LET IN LIGHT', camera: 'Gentle side pan', asset: 'UPLOADED', copy: 'Every morning starts with this exact glow.' },
    { id: 'cb-3', timeRange: '10-15s', preview: assetPath('/assets/story-2.jpg'), visual: 'Steam rises from a ceramic mug while a notebook, glasses, and phone sit untouched nearby.', purpose: 'SET ROUTINE', camera: 'Macro detail hold', asset: 'UPLOADED', copy: 'No rush. Just one quiet ritual at a time.' },
    { id: 'cb-4', timeRange: '15-20s', preview: assetPath('/assets/story-4.jpg'), visual: 'The subject ties back their hair in the mirror, framed by soft bathroom reflections and pastel tones.', purpose: 'BUILD PRESENCE', camera: 'Mirror medium shot', asset: 'UPLOADED', copy: 'It feels easier to face the day when the space feels kind.' },
    { id: 'cb-5', timeRange: '20-25s', preview: assetPath('/assets/trending-7.jpg'), visual: 'A quick sequence of skincare, folded sleeves, and a tidy made bed suggests calm order.', purpose: 'COMPLETE RITUAL', camera: 'Detail montage', asset: 'UPLOADED', copy: 'Little actions add up to a better pace.' },
    { id: 'cb-6', timeRange: '25-30s', preview: assetPath('/assets/trending-6.jpg'), visual: 'The subject pauses by the window with coffee in hand before stepping out of frame.', purpose: 'QUIET RESOLVE', camera: 'Slow pull back', asset: 'UPLOADED', copy: 'For one second, the whole morning feels perfectly enough.' },
  ],
};

export const PRESET_CYBERPUNK_ALLEY_SCRIPT: Script = {
  id: 'preset-cyberpunk-alley-001',
  title: 'Cyberpunk Alley Chase',
  status: 'draft',
  duration: '20s',
  version: 'v1',
  category: 'Action / Sci-Fi',
  coverImage: assetPath('/assets/trending-3.jpg'),
  outputSpec: '16:9 widescreen · around 20 seconds · neon kinetic chase film',
  shortDescription: 'A neon-lit pursuit through wet alleyways with rising speed and synthetic tension.',
  narrativeArc: 'A stolen data drive triggers a chase through a rain-slick alley network, escalating from stealth to full-speed pursuit in under twenty seconds.',
  emotionalGoal: 'The audience should feel adrenaline, urgency, and escalating risk with no room to breathe.',
  visualDirection: 'Neon magenta and cyan reflections, wet pavement, fast handheld motion, LED flicker, and dense atmospheric haze.',
  rhythm: 'Minimal setup, immediate acceleration, peak intensity around the middle, then a sharp unresolved exit.',
  assetLogic: 'Environment, reflections, and velocity cues define the chase more than dialogue or character exposition.',
  shots: [
    { id: 'cp-1', timeRange: '0-3s', preview: assetPath('/assets/trending-3.jpg'), visual: 'A runner slips through a narrow neon alley, glancing back as police drones enter the frame behind.', purpose: 'THROW INTO ACTION', camera: 'Fast shoulder-level tracking', asset: 'GENERATED', copy: 'Don’t stop. Don’t look back.' },
    { id: 'cp-2', timeRange: '3-6s', preview: assetPath('/assets/trending-4.jpg'), visual: 'Boots splash through puddles while holographic signage flickers across walls and face.', purpose: 'INCREASE VELOCITY', camera: 'Low-angle sprint cam', asset: 'GENERATED', copy: 'The whole alley feels wired to expose me.' },
    { id: 'cp-3', timeRange: '6-10s', preview: assetPath('/assets/trending-5.jpg'), visual: 'A drone scans the corner ahead as the subject slides under a closing security gate.', purpose: 'RAISE STAKES', camera: 'Whip pan into crouch', asset: 'GENERATED', copy: 'Too close. Way too close.' },
    { id: 'cp-4', timeRange: '10-14s', preview: assetPath('/assets/trending-6.jpg'), visual: 'The chase erupts onto a wider service lane with glowing cables overhead and traffic haze beyond.', purpose: 'PEAK TENSION', camera: 'Handheld push with shake', asset: 'GENERATED', copy: 'Every light is a warning now.' },
    { id: 'cp-5', timeRange: '14-17s', preview: assetPath('/assets/trending-7.jpg'), visual: 'A hard pivot into darkness reveals a brief hiding place lit only by a blinking vending panel.', purpose: 'FALSE SAFETY', camera: 'Fast pivot then hold', asset: 'GENERATED', copy: 'If I stay still, maybe the city forgets me.' },
    { id: 'cp-6', timeRange: '17-20s', preview: assetPath('/assets/trending-2.jpg'), visual: 'A final sprint launches into a rain curtain as the image tears with digital interference.', purpose: 'CUT ON ESCAPE', camera: 'Rear follow, rapid blur', asset: 'GENERATED', copy: 'Run first. Decode later.' },
  ],
};

export const PRESET_DREAMY_FASHION_SCRIPT: Script = {
  id: 'preset-dreamy-fashion-001',
  title: 'Dreamy Fashion Street Shoot',
  status: 'draft',
  duration: '25s',
  version: 'v1',
  category: 'Fashion / Dreamlike',
  coverImage: assetPath('/assets/trending-7.jpg'),
  outputSpec: '4:5 portrait · around 25 seconds · airy cinematic fashion film',
  shortDescription: 'An airy fashion portrait sequence drifting through city light, fabric motion, and stylized pauses.',
  narrativeArc: 'A fashion muse moves through a city block as if through a dream, turning everyday sidewalks into a soft editorial progression.',
  emotionalGoal: 'The audience should feel elegance, lightness, and a sense of aspirational calm.',
  visualDirection: 'Airy highlights, pastel palette, reflective storefronts, shallow depth of field, and fabric movement that feels weightless.',
  rhythm: 'Measured editorial beats with pauses on silhouette, motion accents, and one final hero look.',
  assetLogic: 'Wardrobe, gesture, and reflected city light carry the concept; dialogue stays sparse and impressionistic.',
  shots: [
    { id: 'df-1', timeRange: '0-5s', preview: assetPath('/assets/trending-7.jpg'), visual: 'The subject steps out from a glass facade in a flowing coat, backlit by pale afternoon haze.', purpose: 'HERO ENTRANCE', camera: 'Editorial medium follow', asset: 'UPLOADED', copy: 'The city softens when the look lands right.' },
    { id: 'df-2', timeRange: '5-9s', preview: assetPath('/assets/story-4.jpg'), visual: 'Fabric catches wind near a crosswalk while reflections double the silhouette in nearby windows.', purpose: 'SHOW TEXTURE', camera: 'Slow side track', asset: 'UPLOADED', copy: 'Every movement leaves a little afterimage.' },
    { id: 'df-3', timeRange: '9-14s', preview: assetPath('/assets/trending-6.jpg'), visual: 'Close-up on jewelry, fingertips, and a soft turn of the chin under diffused street light.', purpose: 'DETAIL PAUSE', camera: 'Close portrait cut-in', asset: 'UPLOADED', copy: 'It’s less about posing and more about drifting.' },
    { id: 'df-4', timeRange: '14-19s', preview: assetPath('/assets/story-2.jpg'), visual: 'The subject moves through a quiet side street as the pace slows and the styling becomes the environment.', purpose: 'SUSTAIN MOOD', camera: 'Long-lens glide', asset: 'UPLOADED', copy: 'For a second, the whole block feels curated.' },
    { id: 'df-5', timeRange: '19-25s', preview: assetPath('/assets/trending-5.jpg'), visual: 'A final stop under warm reflected light turns into a clean editorial hero frame.', purpose: 'FINAL LOOK', camera: 'Static hero frame', asset: 'UPLOADED', copy: 'Leave the frame before the spell breaks.' },
  ],
};

export const PRESET_RAINY_CAFE_SCRIPT: Script = {
  id: 'preset-rainy-cafe-001',
  title: 'Rainy Night Cafe Story',
  status: 'draft',
  duration: '35s',
  version: 'v1',
  category: 'Mood Film / Narrative',
  coverImage: assetPath('/assets/trending-5.jpg'),
  outputSpec: '16:9 landscape · around 35 seconds · moody narrative cafe film',
  shortDescription: 'An intimate rainy-night cafe scene built on reflection, silence, and unresolved emotion.',
  narrativeArc: 'A rainy evening cafe visit becomes a quiet internal turning point, moving from solitude to a fragile sense of emotional release.',
  emotionalGoal: 'The audience should feel intimate, reflective, and emotionally suspended in a bittersweet pause.',
  visualDirection: 'Rain on glass, warm tungsten interiors, reflective tables, soft practicals, and controlled low-key contrast.',
  rhythm: 'Gentle opening, reflective middle, one emotional crest, then a restrained close that leaves room for interpretation.',
  assetLogic: 'Window reflections, table details, and body language carry most of the narrative. Dialogue stays minimal and interior.',
  shots: [
    { id: 'rn-1', timeRange: '0-6s', preview: assetPath('/assets/trending-5.jpg'), visual: 'Rain tracks down the cafe window while the subject sits alone, half-lit by warm practical light.', purpose: 'SET MOOD', camera: 'Static interior wide', asset: 'UPLOADED', copy: 'The rain makes everything feel farther away.' },
    { id: 'rn-2', timeRange: '6-12s', preview: assetPath('/assets/story-2.jpg'), visual: 'A spoon stirs a dark coffee slowly as outside headlights smear into abstract color.', purpose: 'DETAIL EMOTION', camera: 'Macro tabletop', asset: 'UPLOADED', copy: 'I keep circling the same thought without saying it.' },
    { id: 'rn-3', timeRange: '12-18s', preview: assetPath('/assets/story-4.jpg'), visual: 'The subject watches the door as if expecting someone, then looks back down with a small breath.', purpose: 'SUGGEST LONGING', camera: 'Portrait medium hold', asset: 'UPLOADED', copy: 'Maybe waiting is just another way of remembering.' },
    { id: 'rn-4', timeRange: '18-24s', preview: assetPath('/assets/trending-6.jpg'), visual: 'Hands wrap tighter around the mug while reflections on the table double the gesture.', purpose: 'RAISE FEELING', camera: 'Close hand detail', asset: 'UPLOADED', copy: 'Some nights are quieter than silence.' },
    { id: 'rn-5', timeRange: '24-30s', preview: assetPath('/assets/trending-7.jpg'), visual: 'A distant smile appears as a memory surfaces, caught in the glow of the window.', purpose: 'SOFT TURN', camera: 'Slow push in', asset: 'UPLOADED', copy: 'I thought the feeling was gone. It wasn’t.' },
    { id: 'rn-6', timeRange: '30-35s', preview: assetPath('/assets/trending-3.jpg'), visual: 'The camera lingers on the empty chair across the table as rain continues outside.', purpose: 'OPEN ENDING', camera: 'Static closing frame', asset: 'UPLOADED', copy: 'Some stories end by simply not ending yet.' },
  ],
};

export const MY_SCRIPTS_LIBRARY: Script[] = [
  PRESET_DREAMWALK_MEMORY_SCRIPT,
  {
    ...PRESET_BACKROOMS_SCRIPT,
    id: 'my-backrooms-vlog-001',
    title: 'Backrooms First-Person Vlog',
    duration: '15s',
    category: 'Liminal Horror / POV Vlog',
    coverImage: BACKROOMS_MOCK_STILLS[0],
    outputSpec: '16:9 landscape · around 15 seconds · realistic handheld tension vlog',
    shortDescription: 'A liminal first-person exploration short where fluorescent repetition turns into dread.',
    shots: PRESET_BACKROOMS_SCRIPT.shots.slice(0, 5).map((shot, index) => ({
      ...shot,
      id: `mb-${index + 1}`,
      timeRange: `${index * 3}-${(index + 1) * 3}s`,
    })),
  },
  {
    ...PRESET_CITYWALK_SCRIPT,
    id: 'my-citywalk-001',
    title: 'Shenzhen City Walk Vlog',
    category: 'Lifestyle / City Vlog',
    coverImage: assetPath('/assets/citywalk/landmark.png'),
    outputSpec: '16:9 landscape · around 45 seconds · vibrant city walk story',
    shortDescription: 'A day-to-night Shenzhen lifestyle reel with movement, fashion, and city rhythm.',
  },
  PRESET_COZY_BEDROOM_SCRIPT,
  PRESET_CYBERPUNK_ALLEY_SCRIPT,
  PRESET_DREAMY_FASHION_SCRIPT,
  PRESET_RAINY_CAFE_SCRIPT,
];

export const PRESET_TEMPLATES = [
  {
    id: 'backrooms',
    title: 'Backrooms Adventure',
    description: 'Suspense horror in liminal spaces. 8 shots, 60s.',
    thumbnail: BACKROOMS_MOCK_STILLS[0],
    script: PRESET_BACKROOMS_SCRIPT,
    genre: 'Horror / Suspense',
    shots: 8,
    duration: '60s',
  },
  {
    id: 'citywalk',
    title: 'Shenzhen City Walk Vlog',
    description: 'A day in the life of a city girl. 7 shots, 45s.',
    thumbnail: assetPath('/assets/citywalk/landmark.png'),
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
