import { useEffect, useRef, useState } from 'react';
import { useScriptStore } from '@/stores/useScriptStore';
import { useEditorStore } from '@/stores/useEditorStore';
import { useAppStore } from '@/stores/useAppStore';
import { useMockDemoStore } from '@/stores/useMockDemoStore';
import { useGenerateStore } from '@/stores/useGenerateStore';
import { getMockDemoScenarioById } from '@/lib/mockDemoScenarios';
import { ScriptPlanComposerShell } from '@/components/shared/ScriptPlanComposerShell';
import { FlowChatboxDock } from '@/components/shared/FlowChatboxDock';
import { EmotionStructurePanel, MiddleContentTabs, type MiddleContentView } from '@/components/shared/ScriptPlanMiddlePanels';
import { ScriptPlanViews } from '@/components/shared/ScriptPlanViews';
import {
  Table2, LayoutGrid, List, Image, X, BookOpen, Search, Plus,
  TrendingUp, LayoutTemplate, GripVertical, Trash2, Save,
  Film, ArrowLeft, Upload, FileText, FileSpreadsheet, Send,
  Sparkles, Loader2
} from 'lucide-react';
import { AmbientGlow } from '@/components/AmbientGlow';
import { FakeAIScriptPanel } from '@/components/fake-demo/FakeAIScriptPanel';
import type { Script } from '@/types';

type ProjectSequence = {
  id: string;
  scriptKey: string;
  number: string;
  duration: string;
  status: 'Draft' | 'Ready';
  title: string;
  description: string;
  tags: string[];
  preview: string;
  previewLabel?: string;
  technicalIntent: {
    motion: string;
    lighting: string;
    lens: string;
    sound: string;
  };
};

type ProjectScript = {
  id: string;
  title: string;
  status: 'Drafting' | 'Ready';
  duration: string;
  description: string;
  cover: string;
  sequenceCount: number;
  aspectRatio: string;
  frameRate: string;
  renderMode: string;
  collaborationMode: {
    summary: string;
    contributors: number;
    syncStatus: string;
    tags: string[];
  };
  narrativeDirection: string;
  lastEdited: string;
  collaborators: string[];
  sequences: ProjectSequence[];
};

type SequenceLibraryItem = {
  key: string;
  title: string;
  duration: string;
  summary: string;
  preview: string;
  tags: string[];
  status: 'Draft' | 'Ready';
  technicalIntent: {
    motion: string;
    lighting: string;
    lens: string;
    sound: string;
  };
  script: Script;
};

const SEQUENCE_LIBRARY: SequenceLibraryItem[] = [
  {
    key: 'misty_hallway',
    title: 'Misty Hallway',
    duration: '15s',
    summary: 'Dreamlike corridor sequence with slow-floating motion and emotional drift.',
    preview: '/assets/trending-7.jpg',
    tags: ['OPENING', 'DRIFT', 'ATMOSPHERIC'],
    status: 'Draft',
    technicalIntent: {
      motion: 'Slow Dolly In',
      lighting: 'Volumetric / High Contrast',
      lens: 'Wide / intimate',
      sound: 'Low ambient hum',
    },
    script: {
      id: 'seq-script-misty-hallway',
      title: 'Misty Hallway',
      status: 'draft',
      duration: '15s',
      version: 'v1',
      category: 'Dreamlike / Atmospheric',
      shortDescription: 'A softened hallway drifts from stillness into a low echo of memory and motion.',
      coverImage: '/assets/trending-7.jpg',
      outputSpec: '21:9 widescreen · 15s · atmospheric sequence',
      narrativeArc: 'Opening into a softened corridor, drifting through suspended space, catching a quiet echo, then fading before the tension fully resolves.',
      emotionalGoal: 'Create a floating, wistful sensation that feels intimate, suspended, and slightly unreal.',
      visualDirection: 'Diffused haze, reflective highlights, softened silhouettes, and restrained movement with a slow cinematic glide.',
      rhythm: 'Opening → Drift → Echo → Fade',
      assetLogic: 'Environment-first references with selective texture inserts and minimal subject presence.',
      shots: [
        { id: 'mh-1', timeRange: '0-4s', preview: '/assets/trending-7.jpg', visual: 'A misty hallway comes into view with softened fluorescent bloom and slow forward movement.', purpose: 'OPENING', camera: 'Slow dolly in', asset: 'GENERATED', copy: 'The hallway opens like a memory you almost remember.' },
        { id: 'mh-2', timeRange: '4-8s', preview: '/assets/story-4.jpg', visual: 'The frame drifts left toward a half-lit doorway where fog hangs in the air.', purpose: 'DRIFT', camera: 'Floating lateral move', asset: 'GENERATED', copy: 'Nothing moves, but the air still feels disturbed.' },
        { id: 'mh-3', timeRange: '8-12s', preview: '/assets/story-2.jpg', visual: 'A reflected glint appears on the wall before dissolving back into haze.', purpose: 'ECHO', camera: 'Gentle push and hold', asset: 'GENERATED', copy: 'A glimmer catches, then slips away before it can become a sign.' },
        { id: 'mh-4', timeRange: '12-15s', preview: '/assets/story-3.jpg', visual: 'The corridor recedes into darkness as the glow softens toward black.', purpose: 'FADE', camera: 'Locked frame', asset: 'GENERATED', copy: 'The image fades before the space gives up its meaning.' },
      ],
    },
  },
  {
    key: 'neon_rooftop',
    title: 'Neon Rooftop',
    duration: '18s',
    summary: 'A nocturnal rooftop beat balancing velocity, skyline texture, and fashion-forward movement.',
    preview: '/assets/story-5.jpg',
    tags: ['CITY GLOW', 'MOTION', 'STYLE'],
    status: 'Draft',
    technicalIntent: {
      motion: 'Orbit + push',
      lighting: 'Neon edge / sodium haze',
      lens: 'Wide / stylized',
      sound: 'Wind + distant traffic',
    },
    script: {
      id: 'seq-script-neon-rooftop',
      title: 'Neon Rooftop',
      status: 'in_progress',
      duration: '18s',
      version: 'v1',
      category: 'Stylized / Urban',
      shortDescription: 'A rooftop sequence where neon spill and skyline reflections keep the frame in motion.',
      coverImage: '/assets/story-5.jpg',
      outputSpec: '16:9 landscape · 18s · stylized rooftop beat',
      narrativeArc: 'Begin with skyline reveal, pivot into motion around the subject, then peak on a held rooftop silhouette before release.',
      emotionalGoal: 'Feel kinetic, aspirational, and slightly dangerous while staying clean and cinematic.',
      visualDirection: 'Neon accents, reflective surfaces, wet rooftop texture, layered skyline bokeh, and dark contrast.',
      rhythm: 'Reveal → Orbit → Lift → Hold',
      assetLogic: 'Hero rooftop plates, skyline inserts, and one clean silhouette performance reference.',
      shots: [
        { id: 'nr-1', timeRange: '0-5s', preview: '/assets/story-5.jpg', visual: 'The skyline blooms behind a rooftop ledge as neon reflections cut across the frame.', purpose: 'REVEAL', camera: 'Wide reveal push', asset: 'GENERATED', copy: 'The city hums below before the motion starts.' },
        { id: 'nr-2', timeRange: '5-10s', preview: '/assets/trending-6.jpg', visual: 'A subtle orbit wraps around the subject while wind catches fabric and neon spill hits the face.', purpose: 'ORBIT', camera: 'Controlled orbit', asset: 'GENERATED', copy: 'Movement turns the rooftop into a stage.' },
        { id: 'nr-3', timeRange: '10-14s', preview: '/assets/story-4.jpg', visual: 'The camera rises slightly as the skyline expands and reflections sharpen underfoot.', purpose: 'LIFT', camera: 'Rise and slide', asset: 'GENERATED', copy: 'The skyline widens as the beat lifts.' },
        { id: 'nr-4', timeRange: '14-18s', preview: '/assets/story-2.jpg', visual: 'A final silhouette hold against neon haze closes the sequence with clean tension.', purpose: 'HOLD', camera: 'Static hold', asset: 'GENERATED', copy: 'Then everything settles into a single frame.' },
      ],
    },
  },
  {
    key: 'backrooms_entrance',
    title: 'Backrooms Entrance',
    duration: '15s',
    summary: 'A liminal suspense opener where the environment destabilizes the viewer frame by frame.',
    preview: '/mock/backrooms/分镜 01.png',
    tags: ['OPENING', 'SUSPENSE', 'LIMINAL'],
    status: 'Ready',
    technicalIntent: {
      motion: 'POV forward drift',
      lighting: 'Yellow fluorescent spill',
      lens: 'Wide / found footage',
      sound: 'Buzz + distant scrape',
    },
    script: {
      id: 'seq-script-backrooms-entrance',
      title: 'Backrooms Entrance',
      status: 'complete',
      duration: '15s',
      version: 'v1',
      category: 'Liminal / Suspense',
      shortDescription: 'A found-footage style first-person sequence that opens into a fluorescent maze and ends on a glitch.',
      coverImage: '/mock/backrooms/分镜 01.png',
      outputSpec: '16:9 landscape · 15s · realistic handheld suspense vlog',
      narrativeArc: 'Opening → Spatial Confusion → Anomaly → Escalation → Blackout',
      emotionalGoal: 'Build unease through repetition, uncertainty, and one final interruption that implies immediate danger.',
      visualDirection: 'Fluorescent yellow rooms, stained carpet, repeating walls, handheld motion, and subtle glitch artifacts.',
      rhythm: 'Opening → Spatial Confusion → Anomaly → Escalation → Blackout',
      assetLogic: 'Use found-footage POV plates and real environment stills to keep the sequence grounded.',
      videoAsset: '/mock/backrooms/demo video.mp4',
      shots: [
        { id: 'be-1', timeRange: '0-3s', preview: '/mock/backrooms/分镜 01.png', visual: 'A hand adjusts the phone while a yellow hallway stretches forward under humming lights.', purpose: 'OPENING', camera: 'Handheld POV', asset: 'GENERATED', copy: 'I thought this was just another office hallway.' },
        { id: 'be-2', timeRange: '3-6s', preview: '/mock/backrooms/分镜 02.png', visual: 'The camera pans left and right, but every corridor repeats with impossible sameness.', purpose: 'SPATIAL CONFUSION', camera: 'Slow pan and hold', asset: 'GENERATED', copy: 'No matter where I turn, it looks the same.' },
        { id: 'be-3', timeRange: '6-9s', preview: '/mock/backrooms/分镜 03.png', visual: 'A handprint-like mark interrupts the blank wall, too fresh for the dead space around it.', purpose: 'ANOMALY', camera: 'Cautious step-in', asset: 'GENERATED', copy: 'That mark was not there a second ago.' },
        { id: 'be-4', timeRange: '9-12s', preview: '/mock/backrooms/分镜 04.png', visual: 'The hallway behind the viewer feels longer than before as one distant light cuts out.', purpose: 'ESCALATION', camera: 'Fast turn back', asset: 'GENERATED', copy: 'The room changed while I was looking away.' },
        { id: 'be-5', timeRange: '12-15s', preview: '/mock/backrooms/分镜 05.png', visual: 'A sound lands directly behind the camera and the feed distorts into black.', purpose: 'BLACKOUT', camera: 'Backpedal and glitch', asset: 'GENERATED', copy: 'Wait... there is something behind me.' },
      ],
    },
  },
  {
    key: 'city_walk_intro',
    title: 'City Walk Intro',
    duration: '20s',
    summary: 'A lifestyle-forward opener that establishes movement, observation, and city-scale texture.',
    preview: '/assets/citywalk/landmark.png',
    tags: ['LIFESTYLE', 'VLOG', 'FORWARD MOTION'],
    status: 'Draft',
    technicalIntent: {
      motion: 'Steady walk-in',
      lighting: 'Soft daylight',
      lens: 'Wide / observational',
      sound: 'Street ambience',
    },
    script: {
      id: 'seq-script-city-walk-intro',
      title: 'City Walk Intro',
      status: 'draft',
      duration: '20s',
      version: 'v1',
      category: 'Lifestyle / Vlog',
      shortDescription: 'A clean city opener alternating landmark scale with tactile street-level moments.',
      coverImage: '/assets/citywalk/landmark.png',
      outputSpec: '16:9 landscape · 20s · lifestyle city intro',
      narrativeArc: 'Street Intro → Movement → Observation → Close-up → Outro',
      emotionalGoal: 'Feel fresh, curious, and socially legible while staying cinematic and relaxed.',
      visualDirection: 'Natural daylight, street reflections, soft highlights, and a balanced mix of wide public space with intimate cut-ins.',
      rhythm: 'Street Intro → Movement → Observation → Close-up → Outro',
      assetLogic: 'Landmark plates, crosswalk details, storefront textures, and one close-up insert for rhythm change.',
      shots: [
        { id: 'cw-1', timeRange: '0-4s', preview: '/assets/citywalk/landmark.png', visual: 'A clean landmark reveal opens the city identity with a steady forward move.', purpose: 'STREET INTRO', camera: 'Steady wide push', asset: 'GENERATED', copy: 'Morning starts wide, before the walk narrows into detail.' },
        { id: 'cw-2', timeRange: '4-8s', preview: '/assets/citywalk/morning.png', visual: 'The camera joins the street flow at eye level, carrying the viewer into motion.', purpose: 'MOVEMENT', camera: 'Handheld walk-through', asset: 'GENERATED', copy: 'The city rhythm becomes the pacing engine.' },
        { id: 'cw-3', timeRange: '8-12s', preview: '/assets/story-1.jpg', visual: 'A pause on signage and reflective glass gives the route its observational tone.', purpose: 'OBSERVATION', camera: 'Slow pan hold', asset: 'GENERATED', copy: 'Details ground the walk without stopping its momentum.' },
        { id: 'cw-4', timeRange: '12-16s', preview: '/assets/story-3.jpg', visual: 'A close-up cut catches passing texture before the lens lifts back to the street.', purpose: 'CLOSE-UP', camera: 'Quick detail insert', asset: 'GENERATED', copy: 'The close-up gives the route a tactile beat.' },
        { id: 'cw-5', timeRange: '16-20s', preview: '/assets/story-4.jpg', visual: 'The shot opens back into public space for a light, forward-looking outro.', purpose: 'OUTRO', camera: 'Wide exit frame', asset: 'GENERATED', copy: 'Then the walk keeps going beyond the frame.' },
      ],
    },
  },
  {
    key: 'fragrance_closeup_scene',
    title: 'Fragrance Close-up Scene',
    duration: '12s',
    summary: 'A clean commercial insert built around premium close-up texture and controlled motion.',
    preview: '/assets/fragrance/closeup.png',
    tags: ['COMMERCIAL', 'PRODUCT', 'DETAIL'],
    status: 'Ready',
    technicalIntent: {
      motion: 'Macro slide',
      lighting: 'Soft specular highlights',
      lens: 'Macro / premium',
      sound: 'Glass touch + airy pad',
    },
    script: {
      id: 'seq-script-fragrance-closeup',
      title: 'Fragrance Close-up Scene',
      status: 'complete',
      duration: '12s',
      version: 'v1',
      category: 'Clean / Commercial',
      shortDescription: 'A premium product micro-sequence focused on materiality, reflection, and brand calm.',
      coverImage: '/assets/fragrance/closeup.png',
      outputSpec: '16:9 landscape · 12s · clean commercial insert',
      narrativeArc: 'Reveal → Detail Sweep → Hold → Signature',
      emotionalGoal: 'Feel premium, precise, and controlled with a polished commercial finish.',
      visualDirection: 'Soft light wraps, crisp reflections, precise macro texture, and restrained product staging.',
      rhythm: 'Reveal → Detail Sweep → Hold → Signature',
      assetLogic: 'Product hero plates, glass macro passes, and one typographic end card.',
      shots: [
        { id: 'fc-1', timeRange: '0-3s', preview: '/assets/fragrance/closeup.png', visual: 'The bottle emerges from shadow with a precise line of highlight.', purpose: 'REVEAL', camera: 'Macro push', asset: 'PRODUCT', copy: 'The object arrives before the brand speaks.' },
        { id: 'fc-2', timeRange: '3-6s', preview: '/assets/fragrance/detail.png', visual: 'A lateral slide traces glass edges and liquid tone through soft reflection.', purpose: 'DETAIL SWEEP', camera: 'Macro slide', asset: 'PRODUCT', copy: 'Texture and light carry the premium signal.' },
        { id: 'fc-3', timeRange: '6-9s', preview: '/assets/story-3.jpg', visual: 'The frame settles on a centered hold for a clean product read.', purpose: 'HOLD', camera: 'Locked macro hold', asset: 'PRODUCT', copy: 'The product sits in stillness with full clarity.' },
        { id: 'fc-4', timeRange: '9-12s', preview: '/assets/story-2.jpg', visual: 'The sequence closes on a signature end card with one final reflective accent.', purpose: 'SIGNATURE', camera: 'Static end card', asset: 'BRAND', copy: 'A final polished note completes the scene.' },
      ],
    },
  },
];

const SEQUENCE_LIBRARY_MAP = Object.fromEntries(SEQUENCE_LIBRARY.map((item) => [item.key, item])) as Record<string, SequenceLibraryItem>;

function createProjectSequenceFromLibrary(key: string, number: number, idPrefix = 'seq'): ProjectSequence {
  const source = SEQUENCE_LIBRARY_MAP[key];
  return {
    id: `${idPrefix}-${key}-${number}`,
    scriptKey: source.key,
    number: String(number).padStart(2, '0'),
    duration: source.duration,
    status: source.status,
    title: source.title,
    description: source.summary,
    tags: source.tags,
    preview: source.preview,
    previewLabel: number === 1 ? 'Main Preview' : undefined,
    technicalIntent: source.technicalIntent,
  };
}

function createEmptyProjectDraft(): ProjectScript {
  return {
    id: `draft-project-${Date.now()}`,
    title: '',
    status: 'Drafting',
    duration: '00:00',
    description: '',
    cover: '/assets/story-1.jpg',
    sequenceCount: 0,
    aspectRatio: '16:9 Landscape',
    frameRate: '24fps Cinematic',
    renderMode: 'Dreamlike / Atmospheric',
    collaborationMode: {
      summary: 'Shared editing',
      contributors: 3,
      syncStatus: 'Version synced',
      tags: ['Shared editing', '3 contributors', 'Version synced'],
    },
    narrativeDirection: '',
    lastEdited: 'Not saved yet',
    collaborators: ['AM', 'JL', 'YK'],
    sequences: [],
  };
}

const MOCK_PROJECT_SCRIPTS: ProjectScript[] = [
  {
    id: 'dream_walk_video_v1',
    title: 'Dream Walk Video, v1',
    status: 'Drafting',
    duration: '01:24',
    description: 'A dreamlike passage through softened interior spaces, unfolding as a sequence of memory fragments.',
    cover: '/assets/trending-7.jpg',
    sequenceCount: 3,
    aspectRatio: '21:9 Wide Screen',
    frameRate: '24fps Cinematic',
    renderMode: 'Dreamlike / Atmospheric',
    collaborationMode: {
      summary: 'Shared editing',
      contributors: 3,
      syncStatus: 'Version synced',
      tags: ['Shared editing', '3 contributors', 'Version synced'],
    },
    narrativeDirection:
      'A dreamlike passage through softened interior spaces, where each sequence feels like a fragment of memory unfolding in slow motion.',
    lastEdited: 'Edited 14 minutes ago',
    collaborators: ['AM', 'JL', 'YK'],
    sequences: [
      createProjectSequenceFromLibrary('misty_hallway', 1, 'dream'),
      createProjectSequenceFromLibrary('neon_rooftop', 2, 'dream'),
      createProjectSequenceFromLibrary('fragrance_closeup_scene', 3, 'dream'),
    ],
  },
  {
    id: 'backrooms_adventure_liminal_space',
    title: 'Backrooms Adventure — The Liminal Space',
    status: 'Ready',
    duration: '01:06',
    description: 'A found-footage project stitched from escalating liminal sequences and controlled POV drift.',
    cover: '/assets/trending-5.jpg',
    sequenceCount: 2,
    aspectRatio: '16:9 Landscape',
    frameRate: '24fps Cinematic',
    renderMode: 'Atmospheric / Found Footage',
    collaborationMode: {
      summary: 'Locked review pass',
      contributors: 2,
      syncStatus: 'Version synced',
      tags: ['Shared notes', '2 contributors', 'Version synced'],
    },
    narrativeDirection:
      'A first-person descent through fluorescent corridors where the camera slowly realizes the environment is watching back.',
    lastEdited: 'Edited 1 hour ago',
    collaborators: ['SV', 'MK'],
    sequences: [
      createProjectSequenceFromLibrary('backrooms_entrance', 1, 'backrooms'),
      {
        ...createProjectSequenceFromLibrary('neon_rooftop', 2, 'backrooms'),
        scriptKey: 'backrooms_entrance',
        title: 'Corner Anomaly',
        description: 'Use a hesitant camera turn to reveal spatial inconsistency and rising dread.',
        tags: ['ANOMALY', 'SPATIAL DRIFT', 'SUSPENSE'],
        preview: '/assets/trending-3.jpg',
        technicalIntent: {
          motion: 'Quick turn and pause',
          lighting: 'Yellow overhead spill',
          lens: 'Wide / tense',
          sound: 'Vent hum + footstep tail',
        },
      },
    ],
  },
  {
    id: 'shenzhen_city_walk_vlog',
    title: 'Shenzhen City Walk Vlog',
    status: 'Drafting',
    duration: '01:32',
    description: 'A paced urban walkthrough combining multiple script plans into a single premium lifestyle reel.',
    cover: '/assets/citywalk/landmark.png',
    sequenceCount: 2,
    aspectRatio: '16:9 Landscape',
    frameRate: '30fps Social',
    renderMode: 'Lifestyle / Documentary',
    collaborationMode: {
      summary: 'Shared editing',
      contributors: 3,
      syncStatus: 'Comment threads synced',
      tags: ['Shared editing', '3 contributors', 'Comment threads synced'],
    },
    narrativeDirection:
      'A layered city walk that alternates between landmark scale and intimate texture, building a calm but forward-moving rhythm.',
    lastEdited: 'Edited yesterday',
    collaborators: ['ST', 'HN', 'QX'],
    sequences: [
      createProjectSequenceFromLibrary('city_walk_intro', 1, 'citywalk'),
      {
        ...createProjectSequenceFromLibrary('misty_hallway', 2, 'citywalk'),
        scriptKey: 'city_walk_intro',
        title: 'Crosswalk Texture',
        description: 'Move into human-scale rhythm and tactile city details before the next landmark beat.',
        tags: ['DETAIL CUT', 'URBAN RHYTHM', 'TEXTURE'],
        preview: '/assets/citywalk/morning.png',
        technicalIntent: {
          motion: 'Walk-by lateral move',
          lighting: 'Soft skylight',
          lens: 'Mid / observational',
          sound: 'Traffic wash',
        },
      },
    ],
  },
];

function ProjectScriptCard({
  project,
  onOpen,
}: {
  project: ProjectScript;
  onOpen: () => void;
}) {
  return (
    <div
      onClick={onOpen}
      className="group cursor-pointer overflow-hidden rounded-xl border border-[#2A2A2C] bg-[#141415] transition-all hover:border-[#FF843D] hover:shadow-[0_12px_32px_rgba(0,0,0,0.22)]"
    >
      <div className="relative aspect-video overflow-hidden bg-[#1A1A1C]">
        <img src={project.cover} alt={project.title} className="h-full w-full object-cover opacity-80 transition-all group-hover:scale-[1.02] group-hover:opacity-100" />
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/10 to-transparent" />
        <div className="absolute left-3 top-3 flex items-center gap-2">
          <span className="rounded-full border border-[#2A2A2C] bg-[#101011]/90 px-2.5 py-1 text-[10px] font-medium text-[#E7E7EA]">{project.duration}</span>
          <span className={`rounded-full px-2.5 py-1 text-[10px] font-medium ${
            project.status === 'Ready' ? 'bg-[rgba(76,217,100,0.16)] text-[#A7F3C0]' : 'bg-[rgba(255,132,61,0.12)] text-[#FFD2B4]'
          }`}>
            {project.status}
          </span>
        </div>
        <div className="absolute bottom-3 left-3 right-3 flex items-end justify-between gap-3">
          <div>
            <div className="text-[11px] uppercase tracking-[0.16em] text-[#A1A1AA]">Project Script</div>
            <div className="mt-1 text-[16px] font-semibold text-white">{project.title}</div>
          </div>
          <span className="rounded-full bg-[#FF843D] px-3 py-1.5 text-[11px] font-medium text-white">Open Project</span>
        </div>
      </div>
      <div className="space-y-3 p-4">
        <p className="line-clamp-2 text-[12px] leading-5 text-[#9A9A9E]">{project.description}</p>
        <div className="flex items-center justify-between text-[11px] text-[#6B6B6F]">
          <span>{`${project.sequenceCount} sequences`}</span>
          <span>{project.aspectRatio}</span>
        </div>
      </div>
    </div>
  );
}

function ScriptListRow({
  script,
  onOpen,
  onDelete,
}: {
  script: Script;
  onOpen: () => void;
  onDelete: () => void;
}) {
  return (
    <div
      onClick={onOpen}
      className="grid cursor-pointer gap-4 rounded-[20px] border border-[#2A2A2C] bg-[#141415] p-4 transition-all hover:border-[#FF843D] hover:bg-[#171718] md:grid-cols-[120px_minmax(0,1fr)_auto] md:items-center"
    >
      <div className="overflow-hidden rounded-[16px] border border-[rgba(255,255,255,0.06)] bg-[#101011]">
        <img src={script.coverImage || script.shots[0]?.preview || '/assets/story-1.jpg'} alt={script.title} className="aspect-[16/10] h-full w-full object-cover" />
      </div>
      <div className="min-w-0">
        <div className="flex flex-wrap items-center gap-2">
          <h3 className="text-[15px] font-semibold text-white">{script.title}</h3>
          {script.category && <span className="rounded-full border border-[#2A2A2C] bg-[#101011] px-2.5 py-1 text-[9px] font-medium uppercase tracking-[0.12em] text-[#F3F3F5]">{script.category}</span>}
        </div>
        <p className="mt-2 line-clamp-2 text-[12px] leading-5 text-[#9A9A9E]">{script.shortDescription || script.narrativeArc}</p>
        <div className="mt-3 flex flex-wrap items-center gap-3 text-[11px] text-[#6B6B6F]">
          <span>{script.duration}</span>
          <span>{`${script.shots.length} shots`}</span>
          <span>{`Version ${script.version}`}</span>
        </div>
      </div>
      <div className="flex items-center gap-2">
        <button
          type="button"
          onClick={(event) => {
            event.stopPropagation();
            onDelete();
          }}
          className="inline-flex h-8 w-8 items-center justify-center rounded-full border border-[#2A2A2C] text-[#9A9A9E] transition-all hover:border-[#EF4444] hover:text-[#EF4444]"
        >
          <Trash2 size={13} />
        </button>
        <button
          type="button"
          onClick={(event) => {
            event.stopPropagation();
            onOpen();
          }}
          className="rounded-full bg-[#FF843D] px-3.5 py-2 text-[11px] font-medium text-white transition-all hover:bg-[#FFA465]"
        >
          Edit
        </button>
      </div>
    </div>
  );
}

function ProjectScriptListRow({
  project,
  onOpen,
}: {
  project: ProjectScript;
  onOpen: () => void;
}) {
  return (
    <div
      onClick={onOpen}
      className="grid cursor-pointer gap-4 rounded-[20px] border border-[#2A2A2C] bg-[#141415] p-4 transition-all hover:border-[#FF843D] hover:bg-[#171718] md:grid-cols-[140px_minmax(0,1fr)_auto] md:items-center"
    >
      <div className="overflow-hidden rounded-[16px] border border-[rgba(255,255,255,0.06)] bg-[#101011]">
        <img src={project.cover} alt={project.title} className="aspect-[16/10] h-full w-full object-cover" />
      </div>
      <div className="min-w-0">
        <div className="flex flex-wrap items-center gap-2">
          <h3 className="text-[15px] font-semibold text-white">{project.title}</h3>
          <span className={`rounded-full px-2.5 py-1 text-[9px] font-medium uppercase tracking-[0.12em] ${
            project.status === 'Ready' ? 'bg-[rgba(76,217,100,0.16)] text-[#A7F3C0]' : 'bg-[rgba(255,132,61,0.12)] text-[#FFD2B4]'
          }`}>
            {project.status}
          </span>
        </div>
        <p className="mt-2 line-clamp-2 text-[12px] leading-5 text-[#9A9A9E]">{project.description}</p>
        <div className="mt-3 flex flex-wrap items-center gap-3 text-[11px] text-[#6B6B6F]">
          <span>{project.duration}</span>
          <span>{`${project.sequenceCount} sequences`}</span>
          <span>{project.renderMode}</span>
        </div>
      </div>
      <button
        type="button"
        onClick={(event) => {
          event.stopPropagation();
          onOpen();
        }}
        className="rounded-full bg-[#FF843D] px-3.5 py-2 text-[11px] font-medium text-white transition-all hover:bg-[#FFA465]"
      >
        Open Project
      </button>
    </div>
  );
}

function ProjectSettingsPanel({
  project,
  editable = false,
  onChange,
}: {
  project: ProjectScript;
  editable?: boolean;
  onChange?: (patch: Partial<ProjectScript>) => void;
}) {
  const aspectOptions = ['21:9 Wide Screen', '16:9 Landscape', '9:16 Vertical'];
  const frameRateOptions = ['24fps Cinematic', '30fps Social', '60fps Smooth'];
  const renderStyleOptions = ['Dreamlike / Atmospheric', 'Realistic / Suspense', 'Clean / Commercial', 'Lifestyle / Documentary'];

  const FieldCard = ({
    label,
    value,
    options,
    onSelect,
  }: {
    label: string;
    value: string;
    options?: string[];
    onSelect?: (value: string) => void;
  }) => (
    <div className="rounded-[18px] border border-[rgba(255,255,255,0.05)] bg-[#0E0E0F] px-3.5 py-3">
      <div className="text-[10px] font-semibold uppercase tracking-[0.14em] text-[#6F6F77]">{label}</div>
      {!editable || !options ? (
        <div className="mt-1.5 text-[13px] font-medium text-[#F3F3F5]">{value}</div>
      ) : (
        <div className="mt-2 flex flex-wrap gap-2">
          {options.map((option) => (
            <button
              key={`${label}-${option}`}
              type="button"
              onClick={() => onSelect?.(option)}
              className={`rounded-full border px-3 py-1.5 text-[11px] transition-all ${
                option === value
                  ? 'border-[rgba(255,132,61,0.28)] bg-[rgba(255,132,61,0.14)] text-[#FFD2B4]'
                  : 'border-[#2A2A2C] bg-[#101011] text-[#A1A1AA] hover:border-[#FF843D] hover:text-white'
              }`}
            >
              {option}
            </button>
          ))}
        </div>
      )}
    </div>
  );

  return (
    <div className="rounded-[28px] border border-[rgba(255,255,255,0.08)] bg-[rgba(20,20,21,0.92)] p-5 shadow-[0_1px_3px_rgba(0,0,0,0.3)]">
      <div className="text-[10px] font-semibold uppercase tracking-[0.16em] text-[#8E8E93]">Project Settings</div>
      <div className="mt-4 grid gap-4">
        <FieldCard
          label="Aspect Ratio"
          value={project.aspectRatio}
          options={aspectOptions}
          onSelect={(value) => onChange?.({ aspectRatio: value })}
        />
        <FieldCard
          label="Frame Rate"
          value={project.frameRate}
          options={frameRateOptions}
          onSelect={(value) => onChange?.({ frameRate: value })}
        />
        <FieldCard
          label="Render Style"
          value={project.renderMode}
          options={renderStyleOptions}
          onSelect={(value) => onChange?.({ renderMode: value })}
        />
        <div className="rounded-[18px] border border-[rgba(255,255,255,0.05)] bg-[#0E0E0F] px-3.5 py-3">
          <div className="text-[10px] font-semibold uppercase tracking-[0.14em] text-[#6F6F77]">Collaboration Mode</div>
          <div className="mt-1.5 text-[13px] font-medium text-[#F3F3F5]">{project.collaborationMode.summary}</div>
          <div className="mt-2 flex flex-wrap gap-1.5">
            {project.collaborationMode.tags.map((tag) => (
              <span key={`${project.id}-${tag}`} className="inline-flex h-[28px] items-center rounded-full border border-[#2A2A2C] bg-[#101011] px-[10px] text-[9px] font-medium uppercase tracking-[0.12em] text-[#F3F3F5] whitespace-nowrap">
                {tag}
              </span>
            ))}
          </div>
          <div className="mt-3 text-[12px] leading-5 text-[#A1A1AA]">
            {`${project.collaborationMode.contributors} contributors · ${project.collaborationMode.syncStatus}`}
          </div>
        </div>
      </div>
    </div>
  );
}

function ProjectSequenceRow({
  sequence,
  onOpen,
  onDelete,
  onPointerDown,
  onPointerUp,
  onPointerLeave,
  onDragStart,
  onDragEnd,
  onDragOver,
  onDrop,
  isDragReady,
  isDragging,
  isDropTarget,
}: {
  sequence: ProjectSequence;
  onOpen: () => void;
  onDelete: () => void;
  onPointerDown: (event: React.MouseEvent<HTMLDivElement>) => void;
  onPointerUp: () => void;
  onPointerLeave: () => void;
  onDragStart: () => void;
  onDragEnd: () => void;
  onDragOver: (event: React.DragEvent<HTMLDivElement>) => void;
  onDrop: () => void;
  isDragReady: boolean;
  isDragging: boolean;
  isDropTarget: boolean;
}) {
  return (
    <div
      draggable={isDragReady}
      onMouseDown={onPointerDown}
      onMouseUp={onPointerUp}
      onMouseLeave={onPointerLeave}
      onDragStart={onDragStart}
      onDragEnd={onDragEnd}
      onDragOver={onDragOver}
      onDrop={onDrop}
      onClick={onOpen}
      className={`grid gap-4 rounded-[24px] border bg-[rgba(20,20,21,0.92)] p-4 shadow-[0_1px_3px_rgba(0,0,0,0.3)] transition-all md:grid-cols-[60px_220px_minmax(0,1fr)_220px] md:items-start ${
        isDragging
          ? 'scale-[1.01] border-[rgba(255,132,61,0.46)] shadow-[0_18px_36px_rgba(0,0,0,0.34)]'
          : isDropTarget
            ? 'border-[rgba(255,132,61,0.42)] shadow-[0_0_0_1px_rgba(255,132,61,0.14)]'
            : isDragReady
              ? 'border-[rgba(255,132,61,0.24)] shadow-[0_10px_24px_rgba(0,0,0,0.24)]'
              : 'border-[rgba(255,255,255,0.06)] hover:border-[rgba(255,132,61,0.24)]'
      }`}
    >
      <div className="flex items-start justify-between gap-2">
        <div className="text-[24px] font-semibold tracking-[-0.02em] text-[#404046]">{sequence.number}</div>
        <GripVertical size={14} className={`mt-1 shrink-0 ${isDragReady || isDragging ? 'text-[#FFB07A]' : 'text-[#3F3F45]'}`} />
      </div>

      <div className="overflow-hidden rounded-[18px] border border-[rgba(255,255,255,0.06)] bg-[#101011]">
        <div className="relative aspect-[16/10] overflow-hidden">
          <img src={sequence.preview} alt={sequence.title} className="h-full w-full object-cover" />
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
          <div className="absolute left-3 top-3 flex flex-wrap gap-2">
            <span className="rounded-full border border-[#2A2A2C] bg-[#101011]/90 px-2.5 py-1 text-[10px] font-medium text-[#E7E7EA]">{sequence.duration}</span>
            <span className={`rounded-full px-2.5 py-1 text-[10px] font-medium ${
              sequence.status === 'Ready' ? 'bg-[rgba(76,217,100,0.16)] text-[#A7F3C0]' : 'bg-[rgba(255,132,61,0.12)] text-[#FFD2B4]'
            }`}>
              {sequence.status}
            </span>
            {sequence.previewLabel && (
              <span className="rounded-full border border-[rgba(255,132,61,0.22)] bg-[rgba(255,132,61,0.08)] px-2.5 py-1 text-[10px] font-medium text-[#FFD2B4]">
                {sequence.previewLabel}
              </span>
            )}
          </div>
        </div>
      </div>

      <div className="min-w-0">
        <div className="flex items-start justify-between gap-3">
          <div className="text-[10px] font-semibold uppercase tracking-[0.16em] text-[#8E8E93]">Narrative Detail</div>
          <button
            type="button"
            onClick={(event) => {
              event.stopPropagation();
              onDelete();
            }}
            className="inline-flex h-8 w-8 items-center justify-center rounded-full border border-[#2A2A2C] bg-[#101011] text-[#8E8E93] transition-all hover:border-[#EF4444] hover:text-[#EF4444]"
          >
            <Trash2 size={13} />
          </button>
        </div>
        <div className="mt-2 text-[16px] font-semibold text-white">{sequence.title}</div>
        <p className="mt-2 text-[12px] leading-5 text-[#A1A1AA]">{sequence.description}</p>
        <div className="mt-3 flex flex-wrap gap-1.5">
          {sequence.tags.map((tag) => (
            <span key={`${sequence.id}-${tag}`} className="inline-flex h-[28px] items-center rounded-full border border-[#2A2A2C] bg-[#101011] px-[10px] text-[9px] font-medium uppercase tracking-[0.12em] text-[#F3F3F5] whitespace-nowrap">
              {tag}
            </span>
          ))}
        </div>
        <div className="mt-4 inline-flex items-center gap-2 rounded-full border border-[#2A2A2C] bg-[#101011] px-3 py-1.5 text-[11px] text-[#D4D4D8]">
          <BookOpen size={12} /> Open Sequence
        </div>
      </div>

      <div className="rounded-[18px] border border-[rgba(255,255,255,0.05)] bg-[#0E0E0F] p-3.5">
        <div className="text-[10px] font-semibold uppercase tracking-[0.16em] text-[#8E8E93]">Technical Intent</div>
        <div className="mt-3 space-y-2.5">
          {[
            ['Motion', sequence.technicalIntent.motion],
            ['Lighting', sequence.technicalIntent.lighting],
            ['Lens', sequence.technicalIntent.lens],
            ['Sound', sequence.technicalIntent.sound],
          ].map(([label, value]) => (
            <div key={`${sequence.id}-${label}`} className="grid grid-cols-[76px_minmax(0,1fr)] gap-2">
              <div className="text-[10px] font-semibold uppercase tracking-[0.12em] text-[#6F6F77]">{label}</div>
              <div className="text-[12px] leading-5 text-[#E7E7EA]">{value}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function AddSequenceModal({
  isOpen,
  onClose,
  onSelect,
}: {
  isOpen: boolean;
  onClose: () => void;
  onSelect: (key: string) => void;
}) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[300] flex items-center justify-center bg-black/55 p-4" onClick={onClose}>
      <div
        className="w-full max-w-[920px] rounded-[28px] border border-[rgba(255,255,255,0.08)] bg-[#141415] p-5 shadow-[0_24px_80px_rgba(0,0,0,0.45)]"
        onClick={(event) => event.stopPropagation()}
      >
        <div className="flex items-start justify-between gap-4">
          <div>
            <div className="text-[10px] font-semibold uppercase tracking-[0.16em] text-[#8E8E93]">Add New Shot</div>
            <h3 className="mt-2 text-[20px] font-semibold text-white">Select a sequence to add</h3>
            <p className="mt-1 text-[13px] text-[#9A9A9E]">Choose a single script sequence and append it to the current team project.</p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="inline-flex h-9 w-9 items-center justify-center rounded-full border border-[#2A2A2C] bg-[#101011] text-[#9A9A9E] transition-all hover:border-[#FF843D] hover:text-white"
          >
            <X size={15} />
          </button>
        </div>

        <div className="mt-5 grid gap-4 md:grid-cols-2">
          {SEQUENCE_LIBRARY.map((item) => (
            <button
              key={item.key}
              type="button"
              onClick={() => onSelect(item.key)}
              className="group grid w-full gap-4 rounded-[22px] border border-[rgba(255,255,255,0.06)] bg-[rgba(20,20,21,0.92)] p-4 text-left transition-all hover:border-[rgba(255,132,61,0.28)] hover:shadow-[0_12px_32px_rgba(0,0,0,0.22)] md:grid-cols-[160px_minmax(0,1fr)]"
            >
              <div className="overflow-hidden rounded-[18px] border border-[rgba(255,255,255,0.06)] bg-[#101011]">
                <img src={item.preview} alt={item.title} className="aspect-[16/10] h-full w-full object-cover transition-transform group-hover:scale-[1.02]" />
              </div>
              <div className="min-w-0">
                <div className="flex flex-wrap items-center gap-2">
                  <div className="text-[15px] font-semibold text-white">{item.title}</div>
                  <span className="rounded-full border border-[#2A2A2C] bg-[#101011] px-2.5 py-1 text-[10px] font-medium text-[#E7E7EA]">{item.duration}</span>
                  <span className={`rounded-full px-2.5 py-1 text-[10px] font-medium ${
                    item.status === 'Ready' ? 'bg-[rgba(76,217,100,0.16)] text-[#A7F3C0]' : 'bg-[rgba(255,132,61,0.12)] text-[#FFD2B4]'
                  }`}>
                    {item.status}
                  </span>
                </div>
                <p className="mt-2 text-[12px] leading-5 text-[#A1A1AA]">{item.summary}</p>
                <div className="mt-3 flex flex-wrap gap-1.5">
                  {item.tags.map((tag) => (
                    <span key={`${item.key}-${tag}`} className="inline-flex h-[28px] items-center rounded-full border border-[#2A2A2C] bg-[#101011] px-[10px] text-[9px] font-medium uppercase tracking-[0.12em] text-[#F3F3F5] whitespace-nowrap">
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}

function ProjectDetailView({
  project,
  onBack,
  onAddSequence,
  onOpenSequence,
  onDeleteSequence,
  onSequencePointerDown,
  onSequencePointerUp,
  onSequencePointerLeave,
  onSequenceDragStart,
  onSequenceDragEnd,
  onSequenceDragOver,
  onSequenceDrop,
  draggedSequenceId,
  dragReadySequenceId,
  dragOverSequenceId,
  onGenerateVideo,
}: {
  project: ProjectScript;
  onBack: () => void;
  onAddSequence: () => void;
  onOpenSequence: (sequence: ProjectSequence) => void;
  onDeleteSequence: (sequenceId: string) => void;
  onSequencePointerDown: (sequenceId: string, event: React.MouseEvent<HTMLDivElement>) => void;
  onSequencePointerUp: () => void;
  onSequencePointerLeave: () => void;
  onSequenceDragStart: (sequenceId: string) => void;
  onSequenceDragEnd: () => void;
  onSequenceDragOver: (sequenceId: string, event: React.DragEvent<HTMLDivElement>) => void;
  onSequenceDrop: (sequenceId: string) => void;
  draggedSequenceId: string | null;
  dragReadySequenceId: string | null;
  dragOverSequenceId: string | null;
  onGenerateVideo: () => void;
}) {
  return (
    <div className="pb-24">
      <div className="mb-4">
        <PageTopBackStrip label="Back to Scripts" onBack={onBack} maxWidthClass="max-w-none" />
      </div>
      <div className="mb-6 flex flex-col gap-4 rounded-[28px] border border-[rgba(255,255,255,0.08)] bg-[rgba(20,20,21,0.92)] p-5 shadow-[0_1px_3px_rgba(0,0,0,0.3)] md:flex-row md:items-end md:justify-between">
        <div>
          <div className="text-[10px] font-semibold uppercase tracking-[0.18em] text-[#8E8E93]">Current Project</div>
          <h1 className="mt-3 text-[24px] font-bold text-white md:text-[28px]">{project.title}</h1>
        </div>
        <div className="flex flex-wrap items-center gap-3 text-[12px] text-[#A1A1AA]">
          <span className={`rounded-full px-3 py-1 text-[11px] font-medium ${
            project.status === 'Ready' ? 'bg-[rgba(76,217,100,0.16)] text-[#A7F3C0]' : 'bg-[rgba(255,132,61,0.12)] text-[#FFD2B4]'
          }`}>
            {`Status: ${project.status}`}
          </span>
          <span>{`Duration: ${project.duration}`}</span>
        </div>
      </div>

      <div className="mb-6 grid gap-5 xl:grid-cols-[1.1fr_0.9fr]">
        <div className="rounded-[28px] border border-[rgba(255,255,255,0.08)] bg-[rgba(20,20,21,0.92)] p-5 shadow-[0_1px_3px_rgba(0,0,0,0.3)]">
          <div className="text-[10px] font-semibold uppercase tracking-[0.16em] text-[#8E8E93]">Narrative Direction</div>
          <p className="mt-3 max-w-[720px] text-[14px] leading-7 text-[#F3F3F5]">{project.narrativeDirection}</p>
          <div className="mt-5 flex flex-wrap items-center gap-3 text-[11px] text-[#8E8E93]">
            <span>{project.lastEdited}</span>
            <div className="flex -space-x-2">
              {project.collaborators.map((person) => (
                <span
                  key={`${project.id}-${person}`}
                  className="inline-flex h-8 w-8 items-center justify-center rounded-full border border-[#2A2A2C] bg-[#101011] text-[10px] font-medium text-[#E7E7EA]"
                >
                  {person}
                </span>
              ))}
            </div>
          </div>
        </div>

        <ProjectSettingsPanel project={project} />
      </div>

      <div className="mb-6">
        <div className="mb-4 flex items-center justify-between gap-4">
          <div>
            <div className="text-[10px] font-semibold uppercase tracking-[0.16em] text-[#8E8E93]">Project Sequences</div>
            <div className="mt-1 text-[13px] text-[#9A9A9E]">{`${project.sequences.length} sequences arranged for the full video project`}</div>
          </div>
          <button
            type="button"
            onClick={onAddSequence}
            className="inline-flex items-center gap-2 rounded-full border border-[#2A2A2C] bg-[#101011] px-4 py-2 text-[12px] font-medium text-[#D4D4D8] transition-all hover:border-[#FF843D] hover:text-white"
          >
            <Plus size={14} /> Add New Shot
          </button>
        </div>
        <div className="space-y-4">
          {project.sequences.map((sequence) => (
            <ProjectSequenceRow
              key={sequence.id}
              sequence={sequence}
              onOpen={() => onOpenSequence(sequence)}
              onDelete={() => onDeleteSequence(sequence.id)}
              onPointerDown={(event) => onSequencePointerDown(sequence.id, event)}
              onPointerUp={onSequencePointerUp}
              onPointerLeave={onSequencePointerLeave}
              onDragStart={() => onSequenceDragStart(sequence.id)}
              onDragEnd={onSequenceDragEnd}
              onDragOver={(event) => onSequenceDragOver(sequence.id, event)}
              onDrop={() => onSequenceDrop(sequence.id)}
              isDragReady={dragReadySequenceId === sequence.id}
              isDragging={draggedSequenceId === sequence.id}
              isDropTarget={dragOverSequenceId === sequence.id}
            />
          ))}
        </div>
      </div>

      <div className="flex justify-center pt-2">
        <button
          type="button"
          onClick={onGenerateVideo}
          className="inline-flex items-center gap-3 rounded-full bg-[#FF843D] px-5 py-3 text-left text-white shadow-[0_16px_34px_rgba(255,132,61,0.22)] transition-all hover:bg-[#FFA465]"
        >
          <div>
            <div className="text-[9px] font-semibold uppercase tracking-[0.16em] text-[#FFE7D5]">Ready For Render</div>
            <div className="mt-0.5 text-[14px] font-medium">Generate Video</div>
          </div>
          <Film size={16} />
        </button>
      </div>
    </div>
  );
}

function formatProjectDuration(totalSeconds: number) {
  const minutes = Math.floor(totalSeconds / 60);
  const seconds = totalSeconds % 60;
  return `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
}

function parseSequenceDuration(duration: string) {
  const match = duration.match(/(\d+)/);
  return match ? Number(match[1]) : 0;
}

function normalizeProjectSequences(sequences: ProjectSequence[]) {
  return sequences.map((sequence, index) => ({
    ...sequence,
    number: String(index + 1).padStart(2, '0'),
    previewLabel: index === 0 ? 'Main Preview' : undefined,
  }));
}

function hydrateProject(project: ProjectScript): ProjectScript {
  const sequences = normalizeProjectSequences(project.sequences);
  const totalSeconds = sequences.reduce((sum, sequence) => sum + parseSequenceDuration(sequence.duration), 0);
  return {
    ...project,
    sequenceCount: sequences.length,
    duration: formatProjectDuration(totalSeconds),
    cover: sequences[0]?.preview || project.cover,
    sequences,
  };
}

function buildCombinedProjectScript(project: ProjectScript): Script {
  const shots = project.sequences.flatMap((sequence) => {
    const source = SEQUENCE_LIBRARY_MAP[sequence.scriptKey]?.script;
    const baseShots = source?.shots.length ? source.shots : [
      {
        id: `${sequence.id}-single`,
        timeRange: sequence.duration,
        preview: sequence.preview,
        visual: sequence.description,
        purpose: sequence.tags[0] || 'SEQUENCE',
        camera: sequence.technicalIntent.motion,
        asset: 'GENERATED',
        copy: sequence.description,
      },
    ];

    return baseShots.map((shot, shotIndex) => ({
      ...shot,
      id: `${project.id}-${sequence.id}-${shotIndex + 1}`,
      preview: shot.preview || sequence.preview,
      purpose: shot.purpose || sequence.tags[0] || 'SEQUENCE',
    }));
  });

  return {
    id: `${project.id}-video-${Date.now()}`,
    title: project.title || 'Untitled Team Script',
    status: 'in_progress',
    duration: project.duration,
    version: 'v1',
    category: 'Project Script',
    shortDescription: project.description,
    coverImage: project.cover,
    outputSpec: `${project.aspectRatio} · ${project.frameRate} · ${project.renderMode}`,
    narrativeArc: project.narrativeDirection || 'A collaborative sequence build for a multi-shot video plan.',
    emotionalGoal: 'Preserve sequence continuity while keeping the team project cohesive.',
    visualDirection: project.renderMode,
    rhythm: project.sequences.map((sequence) => sequence.title).join(' → ') || 'Sequence order pending',
    assetLogic: `Collaboration Mode · ${project.collaborationMode.summary}`,
    shots,
  };
}

function CreateProjectView({
  project,
  onBack,
  onChange,
  onAddSequence,
  onOpenSequence,
  onDeleteSequence,
  onSequencePointerDown,
  onSequencePointerUp,
  onSequencePointerLeave,
  onSequenceDragStart,
  onSequenceDragEnd,
  onSequenceDragOver,
  onSequenceDrop,
  draggedSequenceId,
  dragReadySequenceId,
  dragOverSequenceId,
  onSaveDraft,
  onGenerateVideo,
}: {
  project: ProjectScript;
  onBack: () => void;
  onChange: (patch: Partial<ProjectScript>) => void;
  onAddSequence: () => void;
  onOpenSequence: (sequence: ProjectSequence) => void;
  onDeleteSequence: (sequenceId: string) => void;
  onSequencePointerDown: (sequenceId: string, event: React.MouseEvent<HTMLDivElement>) => void;
  onSequencePointerUp: () => void;
  onSequencePointerLeave: () => void;
  onSequenceDragStart: (sequenceId: string) => void;
  onSequenceDragEnd: () => void;
  onSequenceDragOver: (sequenceId: string, event: React.DragEvent<HTMLDivElement>) => void;
  onSequenceDrop: (sequenceId: string) => void;
  draggedSequenceId: string | null;
  dragReadySequenceId: string | null;
  dragOverSequenceId: string | null;
  onSaveDraft: () => void;
  onGenerateVideo: () => void;
}) {
  return (
    <div className="pb-24">
      <div className="mb-4">
        <PageTopBackStrip label="Back to Scripts" onBack={onBack} maxWidthClass="max-w-none" />
      </div>

      <div className="mb-6 rounded-[28px] border border-[rgba(255,255,255,0.08)] bg-[rgba(20,20,21,0.92)] p-5 shadow-[0_1px_3px_rgba(0,0,0,0.3)]">
        <div className="text-[10px] font-semibold uppercase tracking-[0.18em] text-[#8E8E93]">Create Team Script</div>
        <h1 className="mt-3 text-[24px] font-bold text-white md:text-[28px]">Create Team Script</h1>
        <p className="mt-2 max-w-[760px] text-[13px] leading-6 text-[#9A9A9E]">
          Build a multi-shot collaborative video plan from existing script sequences.
        </p>
      </div>

      <div className="mb-6 grid gap-5 xl:grid-cols-[1.1fr_0.9fr]">
        <div className="rounded-[28px] border border-[rgba(255,255,255,0.08)] bg-[rgba(20,20,21,0.92)] p-5 shadow-[0_1px_3px_rgba(0,0,0,0.3)]">
          <div className="text-[10px] font-semibold uppercase tracking-[0.16em] text-[#8E8E93]">Project Basics</div>
          <div className="mt-4 grid gap-4">
            <div>
              <div className="mb-2 text-[10px] font-semibold uppercase tracking-[0.14em] text-[#6F6F77]">Project Title</div>
              <input
                value={project.title}
                onChange={(event) => onChange({ title: event.target.value })}
                placeholder="Untitled Team Script"
                className="w-full rounded-[18px] border border-[rgba(255,255,255,0.06)] bg-[#0E0E0F] px-4 py-3 text-[14px] text-white outline-none transition-all focus:border-[rgba(255,132,61,0.28)]"
              />
            </div>
            <div className="grid gap-4 md:grid-cols-2">
              <div className="rounded-[18px] border border-[rgba(255,255,255,0.05)] bg-[#0E0E0F] px-3.5 py-3">
                <div className="text-[10px] font-semibold uppercase tracking-[0.14em] text-[#6F6F77]">Status</div>
                <div className="mt-1.5 text-[13px] font-medium text-[#F3F3F5]">Draft</div>
              </div>
              <div className="rounded-[18px] border border-[rgba(255,255,255,0.05)] bg-[#0E0E0F] px-3.5 py-3">
                <div className="text-[10px] font-semibold uppercase tracking-[0.14em] text-[#6F6F77]">Estimated Duration</div>
                <div className="mt-1.5 text-[13px] font-medium text-[#F3F3F5]">{project.duration}</div>
              </div>
            </div>
            <div>
              <div className="mb-2 text-[10px] font-semibold uppercase tracking-[0.14em] text-[#6F6F77]">Short Description / Narrative Direction</div>
              <textarea
                value={project.description}
                onChange={(event) => onChange({ description: event.target.value, narrativeDirection: event.target.value })}
                placeholder="Describe the collaborative direction, sequence rhythm, and how the full video should unfold."
                rows={6}
                className="w-full rounded-[18px] border border-[rgba(255,255,255,0.06)] bg-[#0E0E0F] px-4 py-3 text-[13px] leading-6 text-white outline-none transition-all focus:border-[rgba(255,132,61,0.28)]"
              />
            </div>
          </div>
        </div>

        <ProjectSettingsPanel project={project} editable onChange={onChange} />
      </div>

      <div className="mb-6">
        <div className="mb-4 flex items-center justify-between gap-4">
          <div>
            <div className="text-[10px] font-semibold uppercase tracking-[0.16em] text-[#8E8E93]">Project Sequences</div>
            <div className="mt-1 text-[13px] text-[#9A9A9E]">Arrange and refine the single-script sequences that make up this team project.</div>
          </div>
          <button
            type="button"
            onClick={onAddSequence}
            className="inline-flex items-center gap-2 rounded-full border border-[#2A2A2C] bg-[#101011] px-4 py-2 text-[12px] font-medium text-[#D4D4D8] transition-all hover:border-[#FF843D] hover:text-white"
          >
            <Plus size={14} /> Add New Shot
          </button>
        </div>

        {project.sequences.length === 0 ? (
          <div className="rounded-[24px] border border-dashed border-[#3A3A3C] bg-[rgba(20,20,21,0.72)] px-6 py-12 text-center">
            <div className="text-[15px] font-medium text-white">No sequences added yet.</div>
            <div className="mt-2 text-[13px] text-[#8E8E93]">Use Add New Shot to start building your team script.</div>
          </div>
        ) : (
          <div className="space-y-4">
            {project.sequences.map((sequence) => (
              <ProjectSequenceRow
                key={sequence.id}
                sequence={sequence}
                onOpen={() => onOpenSequence(sequence)}
                onDelete={() => onDeleteSequence(sequence.id)}
                onPointerDown={(event) => onSequencePointerDown(sequence.id, event)}
                onPointerUp={onSequencePointerUp}
                onPointerLeave={onSequencePointerLeave}
                onDragStart={() => onSequenceDragStart(sequence.id)}
                onDragEnd={onSequenceDragEnd}
                onDragOver={(event) => onSequenceDragOver(sequence.id, event)}
                onDrop={() => onSequenceDrop(sequence.id)}
                isDragReady={dragReadySequenceId === sequence.id}
                isDragging={draggedSequenceId === sequence.id}
                isDropTarget={dragOverSequenceId === sequence.id}
              />
            ))}
          </div>
        )}
      </div>

      <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
        <button
          type="button"
          onClick={onBack}
          className="rounded-full border border-[#2A2A2C] px-4 py-2 text-[13px] text-[#9A9A9E] transition-all hover:border-[#FF843D] hover:text-[#FFFFFF]"
        >
          Cancel
        </button>
        <button
          type="button"
          onClick={onSaveDraft}
          className="rounded-full border border-[#2A2A2C] px-4 py-2 text-[13px] text-[#9A9A9E] transition-all hover:border-[#FF843D] hover:text-[#FFFFFF]"
        >
          Save Draft
        </button>
        <button
          type="button"
          onClick={onGenerateVideo}
          className="inline-flex items-center gap-2 rounded-full bg-[#FF843D] px-5 py-2.5 text-[13px] font-medium text-white transition-all hover:bg-[#FFA465]"
        >
          <Film size={14} /> Generate Video
        </button>
      </div>
    </div>
  );
}

/* ─── Upload Document Modal ─── */
function UploadDocumentModal({ onClose, onScriptCreated }: { onClose: () => void; onScriptCreated: (script: any) => void }) {
  const [isDragging, setIsDragging] = useState(false);
  const [parsedData, setParsedData] = useState<any>(null);

  const handleFile = (file: File) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      const text = e.target?.result as string;
      const lines = text.split('\n').filter(l => l.trim());
      if (lines.length > 1) {
        const headers = lines[0].split(',').map(h => h.trim());
        const rows = lines.slice(1).map(line => {
          const values = line.split(',').map(v => v.trim());
          const row: Record<string, string> = {};
          headers.forEach((h, i) => { row[h] = values[i] || ''; });
          return row;
        });
        setParsedData({ headers, rows, fileName: file.name });
      } else {
        const paragraphs = text.split('\n\n').filter(p => p.trim());
        setParsedData({ type: 'text', paragraphs, fileName: file.name });
      }
    };
    reader.readAsText(file);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files[0];
    if (file) handleFile(file);
  };

  const handleConvertToScript = () => {
    if (!parsedData) return;
    const shots = parsedData.rows
      ? parsedData.rows.slice(0, 10).map((row: any, i: number) => ({
          id: `import-${i + 1}`,
          timeRange: row['Time'] || row['time'] || `${i * 5}-${(i + 1) * 5}s`,
          preview: '',
          visual: row['Visual'] || row['visual'] || row['Description'] || row['description'] || `Scene ${i + 1}`,
          purpose: row['Purpose'] || row['purpose'] || 'SET THE MOOD',
          camera: row['Camera'] || row['camera'] || 'Static shot',
          asset: row['Asset'] || row['asset'] || 'GENERATED',
          copy: row['Copy'] || row['copy'] || row['Dialogue'] || row['dialogue'] || '',
        }))
      : parsedData.paragraphs
        ? parsedData.paragraphs.slice(0, 8).map((p: string, i: number) => ({
            id: `import-${i + 1}`,
            timeRange: `${i * 5}-${(i + 1) * 5}s`,
            preview: '',
            visual: p.substring(0, 100),
            purpose: 'SET THE MOOD',
            camera: 'Static shot',
            asset: 'GENERATED',
            copy: '',
          }))
        : [];

    const newScript = {
      id: `import-${Date.now()}`,
      title: parsedData.fileName.replace(/\.[^/.]+$/, '') + ' (Imported)',
      status: 'draft' as const,
      duration: `${shots.length * 5}s`,
      version: 'v1',
      narrativeArc: 'Auto-generated from uploaded document',
      emotionalGoal: 'Explore the narrative within the imported content',
      visualDirection: 'Based on document content analysis',
      rhythm: 'Even pacing across imported scenes',
      assetLogic: 'Assets to be assigned based on scene descriptions',
      shots,
    };
    onScriptCreated(newScript);
  };

  return (
    <div className="fixed inset-0 z-[300] flex items-center justify-center bg-[#FF843D]/40 p-4" onClick={onClose}>
      <div className="bg-[#141415] rounded-2xl w-full max-w-[520px] max-h-[80vh] overflow-auto" onClick={e => e.stopPropagation()}>
        <div className="p-5 border-b border-[#2A2A2C] flex items-center justify-between">
          <h3 className="text-[16px] font-semibold text-[#FFFFFF]">Import Document as Script</h3>
          <button onClick={onClose} className="w-8 h-8 rounded-full hover:bg-[#141415] flex items-center justify-center">
            <X size={16} className="text-[#9A9A9E]" />
          </button>
        </div>
        <div className="p-5">
          {!parsedData ? (
            <>
              <div
                onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }}
                onDragLeave={() => setIsDragging(false)}
                onDrop={handleDrop}
                className={`border-2 border-dashed rounded-xl p-8 text-center transition-all ${isDragging ? 'border-[#FF843D] bg-[#141415]' : 'border-[#2A2A2C]'}`}
              >
                <div className="w-12 h-12 rounded-full bg-[#141415] flex items-center justify-center mx-auto mb-3">
                  <Upload size={20} className="text-[#9A9A9E]" />
                </div>
                <p className="text-[14px] font-medium text-[#FFFFFF] mb-1">Drop your file here</p>
                <p className="text-[12px] text-[#6B6B6F] mb-3">Or click to browse</p>
                <input type="file" accept=".csv,.txt,.md,.doc,.docx" onChange={(e) => e.target.files?.[0] && handleFile(e.target.files[0])} className="hidden" id="script-upload" />
                <label htmlFor="script-upload" className="inline-flex items-center gap-2 px-4 py-2 bg-[#FF843D] text-white text-[13px] font-medium rounded-full cursor-pointer hover:bg-[#FFA465]">
                  <FileText size={14} /> Choose File
                </label>
              </div>
              <div className="mt-4 space-y-2">
                <p className="text-[11px] text-[#6B6B6F] uppercase tracking-wider font-medium">Supported formats</p>
                <div className="flex gap-2 flex-wrap">
                  {['CSV (table)', 'TXT (text)', 'Markdown', 'Word Doc'].map(fmt => (
                    <span key={fmt} className="px-2 py-1 bg-[#141415] rounded text-[11px] text-[#9A9A9E]">{fmt}</span>
                  ))}
                </div>
              </div>
              <div className="mt-4 p-3 bg-[#0A0A0B] rounded-xl">
                <p className="text-[11px] text-[#6B6B6F] leading-relaxed">
                  <strong className="text-[#9A9A9E]">CSV format example:</strong><br/>
                  Time,Visual,Purpose,Camera,Copy<br/>
                  0-5s,Wide shot of city skyline,SET THE MOOD,Static wide,Opening narration...
                </p>
              </div>
            </>
          ) : (
            <>
              <div className="flex items-center gap-2 mb-4 p-3 bg-[rgba(34,197,94,0.15)] rounded-xl">
                <FileSpreadsheet size={16} className="text-[#22C55E]" />
                <span className="text-[13px] text-[#22C55E] font-medium">{parsedData.fileName} — {parsedData.rows?.length || parsedData.paragraphs?.length || 0} scenes detected</span>
              </div>
              {parsedData.rows && (
                <div className="overflow-x-auto mb-4">
                  <table className="w-full text-[11px]">
                    <thead><tr className="bg-[#141415]">{parsedData.headers.map((h: string) => <th key={h} className="px-2 py-1.5 text-left text-[#9A9A9E] font-medium">{h}</th>)}</tr></thead>
                    <tbody>
                      {parsedData.rows.slice(0, 5).map((row: any, i: number) => (
                        <tr key={i} className="border-b border-[#F5F5F5]">
                          {parsedData.headers.map((h: string) => <td key={h} className="px-2 py-1.5 text-[#D4D4D8] truncate max-w-[120px]">{row[h]}</td>)}
                        </tr>
                      ))}
                    </tbody>
                  </table>
                  {parsedData.rows.length > 5 && <p className="text-[11px] text-[#6B6B6F] mt-1">...and {parsedData.rows.length - 5} more rows</p>}
                </div>
              )}
              {parsedData.paragraphs && (
                <div className="space-y-2 mb-4 max-h-[200px] overflow-y-auto">
                  {parsedData.paragraphs.slice(0, 5).map((p: string, i: number) => (
                    <p key={i} className="text-[12px] text-[#D4D4D8] p-2 bg-[#141415] rounded">{p.substring(0, 100)}{p.length > 100 ? '...' : ''}</p>
                  ))}
                </div>
              )}
              <div className="flex gap-3">
                <button onClick={() => setParsedData(null)} className="flex-1 px-4 py-2.5 border border-[#2A2A2C] rounded-full text-[13px] font-medium text-[#9A9A9E] hover:border-[#FF843D]">Choose Another File</button>
                <button onClick={handleConvertToScript} className="flex-1 px-4 py-2.5 bg-[#FF843D] text-white rounded-full text-[13px] font-medium hover:bg-[#FFA465]">Convert to Script</button>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}

/* ─── Story Structure Visualizer ─── */
function StoryStructureMap({ shots }: { shots: any[] }) {
  return (
    <div className="bg-[#141415] rounded-xl shadow-[0_1px_3px_rgba(0,0,0,0.3)] p-5 mb-4">
      <div className="flex items-center gap-2 mb-3">
        <LayoutTemplate size={16} className="text-[#9A9A9E]" />
        <span className="text-[11px] uppercase tracking-wider text-[#9A9A9E] font-medium">Story Structure</span>
      </div>
      <div className="flex gap-2 overflow-x-auto">
        {shots.map((shot, _i) => (
          <div key={shot.id} className="flex-shrink-0 px-3 py-2 bg-[#141415] rounded-lg text-center min-w-[80px]">
            <div className="text-[10px] text-[#9A9A9E] mb-1">{shot.timeRange}</div>
            <div className="text-[10px] font-medium text-[#FFFFFF] uppercase">{shot.purpose.substring(0, 8)}</div>
          </div>
        ))}
      </div>
    </div>
  );
}

/* ─── Emotion Curve Visualizer ─── */
function EmotionCurve({ shots }: { shots: any[] }) {
  return (
    <div className="bg-[#141415] rounded-xl shadow-[0_1px_3px_rgba(0,0,0,0.3)] p-5 mb-4">
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <TrendingUp size={16} className="text-[#9A9A9E]" />
          <span className="text-[11px] uppercase tracking-wider text-[#9A9A9E] font-medium">Emotion Curve</span>
        </div>
        <span className="text-[10px] text-[#6B6B6F]">Drag points to adjust intensity</span>
      </div>
      <div className="flex items-end gap-1 h-[60px]">
        {shots.map((_, i) => {
          const heights = [30, 45, 60, 80, 55, 40, 65, 35];
          return (
            <div key={i} className="flex-1 flex flex-col items-center gap-1">
              <div 
                className="w-full bg-gradient-to-t from-[#111111] to-[#666666] rounded-t transition-all hover:opacity-80 cursor-pointer"
                style={{ height: `${heights[i % heights.length]}px` }}
              />
              <span className="text-[9px] text-[#6B6B6F]">{_.timeRange}</span>
            </div>
          );
        })}
      </div>
    </div>
  );
}

/* ─── Storyboard Shot Card ─── */
function DraggableShotCard({ shot, index, isSelected, onSelect }: {
  shot: any; index: number; isSelected: boolean; onSelect: () => void;
}) {
  return (
    <div 
      onClick={onSelect}
      className={`bg-[#141415] rounded-xl shadow-[0_1px_3px_rgba(0,0,0,0.3)] overflow-hidden cursor-pointer transition-all ${
        isSelected ? 'ring-2 ring-[#111111]' : 'hover:shadow-[0_4px_12px_rgba(0,0,0,0.3)]'
      }`}
    >
      <div className="flex items-center justify-between px-3 py-2 border-b border-[#F5F5F5]">
        <span className="text-[10px] font-medium text-[#9A9A9E]">SHOT {index + 1}</span>
        <GripVertical size={12} className="text-[#3A3A3C]" />
      </div>
      <div className="aspect-video relative overflow-hidden bg-[#2A2A2C]">
        {shot.preview ? (
          <img src={shot.preview} alt={shot.visual} className="w-full h-full object-cover" />
        ) : (
          <div className="w-full h-full flex items-center justify-center">
            <Image size={24} className="text-[#3A3A3C]" />
          </div>
        )}
        <div className="absolute bottom-2 left-2">
          <span className="px-1.5 py-0.5 bg-[#FF843D]/50 rounded text-[9px] text-white">{shot.timeRange}</span>
        </div>
      </div>
      <div className="p-3">
        <p className="text-[11px] text-[#FFFFFF] line-clamp-2 mb-1">{shot.visual}</p>
        <p className="text-[10px] text-[#6B6B6F] italic line-clamp-1">{shot.copy || 'No copy'}</p>
      </div>
    </div>
  );
}

/* ─── Bottom AI Chat Input ─── */
function ScriptEditorChat({ script, onUpdate }: { script: any; onUpdate: (updated: any) => void }) {
  const [input, setInput] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [history, setHistory] = useState<{role: string; content: string}[]>([]);

  const handleSend = async () => {
    if (!input.trim()) return;
    const userMsg = input.trim();
    setInput('');
    setHistory(prev => [...prev, { role: 'user', content: userMsg }]);
    setIsProcessing(true);

    // Simulate AI processing
    await new Promise(r => setTimeout(r, 1500));

    // Simple rule-based modification for demo
    let aiResponse = '';
    let updatedScript = { ...script };

    if (userMsg.toLowerCase().includes('shorter') || userMsg.toLowerCase().includes('shorten')) {
      aiResponse = `I've shortened the copy for all shots. Total script reduced from ${script.duration} to a tighter pace.`;
      updatedScript.shots = script.shots.map((s: any) => ({
        ...s,
        copy: s.copy ? s.copy.split('.')[0] + '.' : s.copy,
        visual: s.visual.length > 60 ? s.visual.substring(0, 60) + '...' : s.visual,
      }));
    } else if (userMsg.toLowerCase().includes('dramatic') || userMsg.toLowerCase().includes('intense')) {
      aiResponse = 'Enhanced dramatic tension: added stronger visual language and heightened emotional copy.';
      updatedScript.shots = script.shots.map((s: any, i: number) => ({
        ...s,
        copy: s.copy ? s.copy.replace(/\./g, '!') : s.copy,
        visual: i % 2 === 0 ? 'Dramatic ' + s.visual : s.visual,
      }));
      updatedScript.emotionalGoal = 'Heightened drama and emotional intensity throughout';
    } else if (userMsg.toLowerCase().includes('replace') && userMsg.toLowerCase().includes('shot')) {
      aiResponse = 'Regenerated shot descriptions based on your new direction. Updated visual and copy for affected shots.';
      updatedScript.shots = script.shots.map((s: any) => ({
        ...s,
        visual: s.visual + ' [Revised per your request]',
      }));
    } else {
      aiResponse = `Analyzed your request: "${userMsg}". I've updated the script's emotional goal and refined copy to match your intent.`;
      updatedScript.emotionalGoal = userMsg;
      updatedScript.shots = script.shots.map((s: any) => ({
        ...s,
        copy: s.copy ? `[Aligned to: ${userMsg.substring(0, 20)}] ${s.copy}` : s.copy,
      }));
    }

    onUpdate(updatedScript);
    setHistory(prev => [...prev, { role: 'assistant', content: aiResponse }]);
    setIsProcessing(false);
  };

  return (
    <div className="border-t border-[#2A2A2C] bg-[#141415] mt-4">
      {/* Chat history */}
      {history.length > 0 && (
        <div className="max-h-[160px] overflow-y-auto px-4 pt-3 space-y-2">
          {history.map((msg, i) => (
            <div key={i} className={`flex gap-2 ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
              {msg.role === 'assistant' && (
                <div className="w-5 h-5 rounded-full bg-[#FF843D] flex items-center justify-center shrink-0 mt-0.5">
                  <Sparkles size={10} className="text-white" />
                </div>
              )}
              <div className={`px-3 py-2 rounded-xl text-[12px] max-w-[80%] ${
                msg.role === 'user' ? 'bg-[#FF843D] text-white' : 'bg-[#141415] text-[#FFFFFF]'
              }`}>
                {msg.content}
              </div>
            </div>
          ))}
          {isProcessing && (
            <div className="flex gap-2 items-center">
              <div className="w-5 h-5 rounded-full bg-[#FF843D] flex items-center justify-center">
                <Loader2 size={10} className="text-white animate-spin" />
              </div>
              <span className="text-[11px] text-[#6B6B6F]">Agent is analyzing your script...</span>
            </div>
          )}
        </div>
      )}

      {/* Input */}
      <div className="flex items-center gap-2 p-3">
        <div className="flex-1 flex items-center gap-2 px-4 py-2.5 bg-[#141415] rounded-full border border-[#2A2A2C] focus-within:border-[#FF843D] transition-all">
          <input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && !e.shiftKey && handleSend()}
            placeholder="Ask AI to modify script: 'Make it more dramatic' / 'Shorten shot 3' / 'Replace all copy with Chinese'..."
            className="flex-1 bg-transparent text-[13px] outline-none text-[#FFFFFF] placeholder:text-[#6B6B6F]"
          />
        </div>
        <button
          onClick={handleSend}
          disabled={!input.trim() || isProcessing}
          className="w-9 h-9 rounded-full bg-[#FF843D] text-white flex items-center justify-center hover:bg-[#FFA465] disabled:opacity-30 transition-all shrink-0"
        >
          {isProcessing ? <Loader2 size={14} className="animate-spin" /> : <Send size={14} />}
        </button>
      </div>
      <p className="px-4 pb-2 text-[10px] text-[#6B6B6F]">
        AI will analyze your script + assets and apply changes. Each change creates a new version in History.
      </p>
    </div>
  );
}

type EditableMockRow = {
  previewImage?: string;
  time: string;
  scene: string;
  purpose: string;
  visualDirection: string;
  camera: string;
  assetSource?: string;
  audioOrVoice?: string;
  textOrCaption?: string;
};

type EditableFieldKey = 'scene' | 'visualDirection' | 'camera' | 'copy';
type StoryboardModalFieldKey = 'scene' | 'visualDirection' | 'camera' | 'purpose' | 'assetSource' | 'copy' | 'audioOrVoice';

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
    <div className="space-y-2">
      <div className="text-[11px] font-semibold uppercase tracking-[0.18em] text-[#8E8E93]">{label}</div>
      {isEditing ? (
        <div className="space-y-3 rounded-[16px] border border-[rgba(255,132,61,0.28)] bg-[#101011] px-4 py-3 shadow-[0_0_0_1px_rgba(255,132,61,0.08)]">
          {textarea ? (
            <textarea
              value={value}
              onChange={(event) => onChange(event.target.value)}
              className="min-h-[96px] max-h-[180px] w-full resize-y overflow-y-auto rounded-[12px] border border-[#2A2A2C] bg-[#141415] px-3 py-3 text-[13px] leading-6 text-[#F3F3F5] outline-none transition-all focus:border-[#FF843D] focus:ring-2 focus:ring-[#FF843D]/20"
              placeholder={placeholder}
            />
          ) : (
            <input
              value={value}
              onChange={(event) => onChange(event.target.value)}
              className="h-11 w-full rounded-[12px] border border-[#2A2A2C] bg-[#141415] px-3 text-[13px] text-[#F3F3F5] outline-none transition-all focus:border-[#FF843D] focus:ring-2 focus:ring-[#FF843D]/20"
              placeholder={placeholder}
            />
          )}
          {quickOptions && quickOptions.length > 0 && (
            <div className="flex flex-wrap gap-2">
              {quickOptions.map((option) => (
                <button
                  key={`${label}-${option}`}
                  type="button"
                  onClick={() => onChange(option)}
                  className="rounded-full border border-[#2A2A2C] bg-[#141415] px-3 py-1.5 text-[11px] text-[#D4D4D8] transition-all hover:border-[#FF843D] hover:text-white"
                >
                  {option}
                </button>
              ))}
            </div>
          )}
          <div className="flex items-center gap-2">
            <button type="button" onClick={onSave} className="rounded-full bg-[#FF843D] px-3.5 py-2 text-[12px] font-medium text-white transition-all hover:bg-[#FFA465]">Save</button>
            <button type="button" onClick={onCancel} className="rounded-full border border-[#2A2A2C] px-3.5 py-2 text-[12px] text-[#8E8E93] transition-all hover:border-[#FF843D] hover:text-white">Cancel</button>
          </div>
        </div>
      ) : (
        <button
          type="button"
          onDoubleClick={onDoubleClick}
          className={`w-full rounded-[16px] border border-[rgba(255,255,255,0.06)] bg-[#101011] px-4 py-3 text-left transition-all hover:border-[rgba(255,132,61,0.18)] ${
            muted ? 'text-[#8E8E93]' : 'text-[#D4D4D8]'
          }`}
        >
          <div className="text-[13px] leading-6">{value || placeholder}</div>
        </button>
      )}
    </div>
  );
}

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

function getDurationLabel(outputSpec: string, rows: EditableMockRow[]) {
  const secondsMatch = outputSpec.match(/(\d+\s*s|\d+\s*seconds|around\s+\d+\s*seconds)/i);
  if (secondsMatch) {
    return secondsMatch[0].replace(/\s*seconds/i, 's').replace(/\s+/g, ' ').trim();
  }

  const lastTime = rows[rows.length - 1]?.time ?? '';
  const timeEndMatch = lastTime.match(/(\d+(?:\.\d+)?)s?$/i);
  return timeEndMatch ? `${timeEndMatch[1]}s` : '15s';
}

function getScriptThemeId(script: Script) {
  const id = `${script.id} ${script.title} ${script.category ?? ''}`.toLowerCase();
  if (id.includes('backrooms')) return 'backrooms_vlog_fuzzy_no_asset';
  if (id.includes('cyberpunk') || id.includes('fragrance')) return 'fragrance_ad_script_with_assets';
  return 'dream_video_with_assets';
}

function mapScriptToEditableRows(script: Script): EditableMockRow[] {
  return script.shots.map((shot, index) => ({
    _localId: shot.id ?? `${script.id}-row-${index + 1}`,
    previewImage: shot.preview,
    time: shot.timeRange,
    scene: shot.visual,
    purpose: shot.purpose,
    visualDirection: script.visualDirection,
    camera: shot.camera,
    assetSource: shot.asset,
    textOrCaption: shot.copy,
  }));
}

function mapEditableRowsToShots(rows: EditableMockRow[], currentScript: Script) {
  return rows.map((row, index) => ({
    id: currentScript.shots[index]?.id ?? `${currentScript.id}-shot-${index + 1}`,
    timeRange: row.time,
    preview: row.previewImage ?? currentScript.shots[index]?.preview ?? currentScript.coverImage ?? '/assets/story-1.jpg',
    visual: row.scene,
    purpose: row.purpose,
    camera: row.camera,
    asset: row.assetSource ?? 'ADD ASSET',
    copy: row.textOrCaption ?? row.audioOrVoice ?? '',
    status: currentScript.shots[index]?.status,
  }));
}

function getScriptMentionAssets(script: Script) {
  const assetNames = Array.from(new Set(script.shots.map((shot) => shot.asset).filter(Boolean))).slice(0, 3);
  return (assetNames.length ? assetNames : ['Scene Reference', 'Style Reference', 'Mood Reference']).map((name, index) => ({
    id: `${script.id}-asset-${index + 1}`,
    name: `${name}${name.includes('Image') ? '' : ` · Reference ${index + 1}`}`,
    role: index === 0 ? 'Primary visual anchor' : index === 1 ? 'Supporting camera and lighting cue' : 'Mood and finishing reference',
  }));
}

function truncateText(text: string, maxLength: number) {
  if (text.length <= maxLength) return text;
  return `${text.slice(0, maxLength).trimEnd()}...`;
}

function getNarrativeArcText(mockScenario: ReturnType<typeof getMockDemoScenarioById>) {
  return mockScenario.intentSummary.mainCopy || mockScenario.scriptPlan.projectSummary[0] || mockScenario.scriptPlan.globalDirection;
}

function getEmotionalGoalText(mockScenario: ReturnType<typeof getMockDemoScenarioById>) {
  const emotionalLine = mockScenario.intentSummary.confirmedDirection.find((item) =>
    /feel|mood|emotion|calm|tense|quiet|suspense|dream|luxury|memory|atmosphere/i.test(item),
  );

  return emotionalLine || mockScenario.scriptPlan.productionNotes[0] || mockScenario.intentSummary.confirmedDirection[0] || mockScenario.scriptPlan.globalDirection;
}

function getRhythmText(mockScenario: ReturnType<typeof getMockDemoScenarioById>, rows: EditableMockRow[]) {
  const rhythmNote = mockScenario.scriptPlan.productionNotes.find((item) =>
    /pace|rhythm|slow|steady|beat|flow|escalat|release|build/i.test(item),
  );

  if (rhythmNote) {
    return rhythmNote;
  }

  const firstBeat = rows[0]?.purpose ?? 'opening beat';
  const lastBeat = rows[rows.length - 1]?.purpose ?? 'final beat';
  return `${rows.length} beats moving from ${firstBeat.toLowerCase()} to ${lastBeat.toLowerCase()}.`;
}

function getAssetLogicText(mockScenario: ReturnType<typeof getMockDemoScenarioById>) {
  if (!mockScenario.mockAssets.length) {
    return 'No external assets · generated from prompt only';
  }

  return mockScenario.mockAssets
    .slice(0, 2)
    .map((asset) => `${asset.name.split(' · ')[0]} -> ${asset.role}`)
    .join(' · ');
}

function getAssetPills(assetSource?: string) {
  if (!assetSource) return [];
  const matches = assetSource.match(/Image\s*\d+/gi) ?? [];
  if (matches.length > 0) {
    return Array.from(new Set(matches.map((item) => item.replace(/\s+/g, ' ').trim())));
  }

  return assetSource
    .split(/,|\u00b7/)
    .map((item) => item.trim())
    .filter((item) => item && item !== '—' && item !== '-')
    .slice(0, 2);
}
void getAssetPills;

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
void getPurposeTags;

function InfoSummaryCard({
  infoKey,
  title,
  summary,
  fullText,
  isActive,
  align = 'left',
  cardClassName = '',
  summaryClassName = '',
  popoverClassName = '',
  onHoverStart,
  onHoverEnd,
  onToggle,
}: {
  infoKey: string;
  title: string;
  summary: string;
  fullText: string;
  isActive: boolean;
  align?: 'left' | 'right';
  cardClassName?: string;
  summaryClassName?: string;
  popoverClassName?: string;
  onHoverStart: (key: string) => void;
  onHoverEnd: () => void;
  onToggle: (key: string) => void;
}) {
  return (
    <div
      data-info-popover-root
      className="relative"
      onMouseEnter={() => onHoverStart(infoKey)}
      onMouseLeave={onHoverEnd}
    >
      <button
        type="button"
        onClick={() => onToggle(infoKey)}
        className={`flex min-h-[76px] w-full flex-col rounded-[16px] border border-[rgba(255,255,255,0.04)] bg-[#0C0C0D] px-3.5 py-2.5 text-left transition-all duration-200 ease-out hover:border-[rgba(255,132,61,0.18)] hover:bg-[#101012] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#FF843D]/30 ${cardClassName}`}
      >
        <div className="mb-1.5 text-[10px] font-semibold uppercase tracking-[0.16em] text-[#8E8E93]">{title}</div>
        <p className={`line-clamp-2 text-[12px] leading-[1.55] text-[#F3F3F5] ${summaryClassName}`}>{summary}</p>
      </button>

      <div
        className={`absolute top-[calc(100%+8px)] z-40 w-[320px] max-w-[calc(100vw-48px)] rounded-[12px] border border-[rgba(255,255,255,0.08)] bg-[rgba(16,16,17,0.92)] p-3.5 shadow-[0_18px_50px_rgba(0,0,0,0.38)] backdrop-blur-xl transition-all duration-200 ease-out ${
          align === 'right' ? 'right-0' : 'left-0'
        } ${
          isActive
            ? 'visible translate-y-0 opacity-100 pointer-events-auto'
            : 'invisible translate-y-1 opacity-0 pointer-events-none'
        } ${popoverClassName}`}
      >
        <div className="mb-1.5 text-[11px] font-semibold uppercase tracking-[0.15em] text-[#FFFFFF]">{title}</div>
        <div className="text-[12px] leading-[1.65] text-[#D9D9DE]">{fullText}</div>
      </div>
    </div>
  );
}

function PageTopBackStrip({
  label,
  onBack,
  maxWidthClass = 'max-w-[1080px]',
}: {
  label: string;
  onBack: () => void;
  maxWidthClass?: string;
}) {
  return (
    <div className={`mx-auto flex w-full ${maxWidthClass}`}>
      <button
        type="button"
        onClick={onBack}
        className="inline-flex items-center gap-2 rounded-full border border-[#2A2A2C] bg-[#101011] px-3 py-1.5 text-[11px] font-medium text-[#9A9A9E] transition-all hover:border-[#FF843D] hover:text-white"
      >
        <ArrowLeft size={14} /> {label}
      </button>
    </div>
  );
}

function ScriptVideoPanel({
  outputSpec,
  scenarioLabel,
  onGenerate,
}: {
  outputSpec: string;
  scenarioLabel: string;
  onGenerate: () => void;
}) {
  return (
    <div className="rounded-[28px] border border-[rgba(255,255,255,0.08)] bg-[rgba(20,20,21,0.92)] p-4 shadow-[0_1px_3px_rgba(0,0,0,0.3)] backdrop-blur-sm md:px-5 md:py-4">
      <div className="rounded-[18px] border border-[rgba(255,255,255,0.04)] bg-[#0C0C0D] p-4">
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div className="max-w-[640px]">
            <div className="text-[10px] font-semibold uppercase tracking-[0.16em] text-[#8E8E93]">Video</div>
            <div className="mt-2 text-[16px] font-medium text-white">Generate the current script plan as a mock video draft</div>
            <div className="mt-2 text-[12px] leading-[1.6] text-[#A1A1AA]">
              Review the summary or emotion pacing first, then generate a preview aligned to {scenarioLabel} using the current output spec.
            </div>
          </div>
          <div className="flex flex-col items-start gap-2 md:items-end">
            <span className="rounded-full border border-[#2A2A2C] bg-[#101011] px-3 py-1 text-[10px] font-semibold uppercase tracking-[0.14em] text-[#E7E7EA]">
              {outputSpec}
            </span>
            <button
              type="button"
              onClick={onGenerate}
              className="inline-flex items-center gap-2 rounded-full bg-[#FF843D] px-4 py-2 text-[12px] font-medium text-white transition-all hover:bg-[#FFA465]"
            >
              <Film size={14} />
              Generate Video
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

type DetailInfoCardItem = {
  key: string;
  title: string;
  summary: string;
  fullText: string;
  align: 'left' | 'right';
};

function ScriptPlanWorkspaceShell({
  title,
  statusLabel,
  durationLabel,
  versionLabel,
  summaryCards,
  activeInfoPopover,
  openInfoPopover,
  scheduleInfoPopoverClose,
  toggleInfoPopover,
  middleView,
  setMiddleView,
  rows,
  middleScenarioId,
  viewMode,
  onPlanViewChange,
  focusedShotIndex,
  setFocusedShotIndex,
  onRowsChange,
  onRhythmReorderRows,
  mentionAssets,
  outputSpec,
  videoScenarioLabel,
  onSaveDraft,
  onGenerateVideo,
  backLabel,
  onBack,
}: {
  title: string;
  statusLabel: string;
  durationLabel: string;
  versionLabel: string;
  summaryCards: Record<string, DetailInfoCardItem>;
  activeInfoPopover: string | null;
  openInfoPopover: (key: string) => void;
  scheduleInfoPopoverClose: () => void;
  toggleInfoPopover: (key: string) => void;
  middleView: MiddleContentView;
  setMiddleView: (view: MiddleContentView) => void;
  rows: EditableMockRow[];
  middleScenarioId: string;
  viewMode: 'table' | 'storyboard';
  onPlanViewChange: (mode: 'table' | 'storyboard') => void;
  focusedShotIndex: number;
  setFocusedShotIndex: (index: number) => void;
  onRowsChange: (rows: EditableMockRow[]) => void;
  onRhythmReorderRows: (rows: EditableMockRow[], nextActiveIndex: number) => void;
  mentionAssets: { id: string; name: string; role: string }[];
  outputSpec: string;
  videoScenarioLabel: string;
  onSaveDraft: () => void;
  onGenerateVideo: () => void;
  backLabel: string;
  onBack: () => void;
}) {
  return (
    <div className="relative min-h-[calc(100vh-120px)]">
      <AmbientGlow variant="subtle" fixed={false} />
      <div className="mx-auto max-w-[1080px] space-y-6">
        <PageTopBackStrip label={backLabel} onBack={onBack} />

        <div className="rounded-[32px] border border-[rgba(255,255,255,0.08)] bg-[rgba(20,20,21,0.92)] p-5 shadow-[0_1px_3px_rgba(0,0,0,0.3)] backdrop-blur-sm md:px-6 md:py-5">
          <div className="flex items-center justify-between gap-4">
            <div className="min-w-0">
              <h1 className="text-[24px] font-bold text-[#FFFFFF] md:text-[28px]">{title}</h1>
              <div className="mt-3 flex flex-wrap items-center gap-3 text-[13px] text-[#A1A1AA]">
                <span className="rounded-full border border-[#2A2A2C] bg-[#101011] px-3 py-1 text-[11px] font-medium uppercase tracking-[0.18em] text-[#E7E7EA]">
                  {statusLabel}
                </span>
                <span>{`Duration: ${durationLabel}`}</span>
                <span className="text-[#6F6F77]">{versionLabel}</span>
              </div>
            </div>
            <div className="flex shrink-0 flex-row items-center gap-3 whitespace-nowrap">
              <button type="button" onClick={onSaveDraft} className="rounded-full border border-[#2A2A2C] px-3.5 py-2 text-[13px] text-[#9A9A9E] transition-all hover:border-[#FF843D] hover:text-[#FFFFFF]">
                Save Draft
              </button>
              <button className="rounded-full border border-[#2A2A2C] px-3.5 py-2 text-[13px] text-[#9A9A9E] transition-all hover:border-[#FF843D] hover:text-[#FFFFFF]">
                Revise Plan
              </button>
              <button onClick={onGenerateVideo} className="inline-flex items-center gap-2 rounded-full bg-[#FF843D] px-4 py-2.5 text-[13px] font-medium text-white transition-all hover:bg-[#FFA465]">
                <Film size={14} /> Generate Video
              </button>
            </div>
          </div>
        </div>

        <div className="space-y-4">
          <MiddleContentTabs activeView={middleView} onChange={setMiddleView} />

          {middleView === 'summary' ? (
            <div className="rounded-[28px] border border-[rgba(255,255,255,0.08)] bg-[rgba(20,20,21,0.92)] p-4 shadow-[0_1px_3px_rgba(0,0,0,0.3)] backdrop-blur-sm md:px-5 md:py-4">
              <div className="grid gap-4 xl:grid-cols-[1.02fr_0.98fr]">
                <div className="grid gap-4">
                  <InfoSummaryCard
                    infoKey={summaryCards.narrative.key}
                    title={summaryCards.narrative.title}
                    summary={summaryCards.narrative.summary}
                    fullText={summaryCards.narrative.fullText}
                    isActive={activeInfoPopover === summaryCards.narrative.key}
                    align="left"
                    cardClassName="min-h-[60px] rounded-[14px] border-[rgba(255,255,255,0.03)] bg-[rgba(12,12,13,0.42)] px-3 py-2.5"
                    summaryClassName="line-clamp-2 text-[11px] font-light leading-[1.55] text-[#E8E8EA]"
                    popoverClassName="left-0"
                    onHoverStart={openInfoPopover}
                    onHoverEnd={scheduleInfoPopoverClose}
                    onToggle={toggleInfoPopover}
                  />
                  <InfoSummaryCard
                    infoKey={summaryCards.emotion.key}
                    title={summaryCards.emotion.title}
                    summary={summaryCards.emotion.summary}
                    fullText={summaryCards.emotion.fullText}
                    isActive={activeInfoPopover === summaryCards.emotion.key}
                    align="left"
                    cardClassName="min-h-[60px] rounded-[14px] border-[rgba(255,255,255,0.03)] bg-[rgba(12,12,13,0.42)] px-3 py-2.5"
                    summaryClassName="line-clamp-2 text-[11px] font-light leading-[1.55] text-[#D9D9DE]"
                    popoverClassName="left-0"
                    onHoverStart={openInfoPopover}
                    onHoverEnd={scheduleInfoPopoverClose}
                    onToggle={toggleInfoPopover}
                  />
                </div>

                <div className="grid gap-4">
                  <InfoSummaryCard
                    infoKey={summaryCards.visual.key}
                    title={summaryCards.visual.title}
                    summary={summaryCards.visual.summary}
                    fullText={summaryCards.visual.fullText}
                    isActive={activeInfoPopover === summaryCards.visual.key}
                    align="right"
                    cardClassName="min-h-[66px] rounded-[14px] border-[rgba(255,255,255,0.03)] bg-[rgba(12,12,13,0.42)] px-3 py-2.5"
                    summaryClassName="line-clamp-2 text-[11px] leading-[1.5] text-[#E8E8EA]"
                    popoverClassName="right-0"
                    onHoverStart={openInfoPopover}
                    onHoverEnd={scheduleInfoPopoverClose}
                    onToggle={toggleInfoPopover}
                  />
                  <div className="grid gap-4 md:grid-cols-2">
                    <InfoSummaryCard
                      infoKey={summaryCards.rhythm.key}
                      title={summaryCards.rhythm.title}
                      summary={summaryCards.rhythm.summary}
                      fullText={summaryCards.rhythm.fullText}
                      isActive={activeInfoPopover === summaryCards.rhythm.key}
                      align="left"
                      cardClassName="min-h-[60px] rounded-[14px] border-[rgba(255,255,255,0.03)] bg-[rgba(12,12,13,0.42)] px-3 py-2.5"
                      summaryClassName="line-clamp-2 text-[11px] leading-[1.45] text-[#D9D9DE]"
                      popoverClassName="left-0"
                      onHoverStart={openInfoPopover}
                      onHoverEnd={scheduleInfoPopoverClose}
                      onToggle={toggleInfoPopover}
                    />
                    <InfoSummaryCard
                      infoKey={summaryCards.asset.key}
                      title={summaryCards.asset.title}
                      summary={summaryCards.asset.summary}
                      fullText={summaryCards.asset.fullText}
                      isActive={activeInfoPopover === summaryCards.asset.key}
                      align="right"
                      cardClassName="min-h-[60px] rounded-[14px] border-[rgba(255,255,255,0.03)] bg-[rgba(12,12,13,0.42)] px-3 py-2.5"
                      summaryClassName="line-clamp-2 text-[11px] leading-[1.45] text-[#D9D9DE]"
                      popoverClassName="right-0"
                      onHoverStart={openInfoPopover}
                      onHoverEnd={scheduleInfoPopoverClose}
                      onToggle={toggleInfoPopover}
                    />
                  </div>
                </div>
              </div>

              <div className="mt-4 border-t border-[rgba(255,255,255,0.08)] pt-4">
                <div className="grid gap-3 md:grid-cols-[140px_minmax(0,1fr)] md:items-start">
                  <div className="text-[10px] font-extrabold uppercase tracking-[0.1em] text-[#8E8E93]">Output Spec</div>
                  <InfoSummaryCard
                    infoKey={summaryCards.output.key}
                    title={summaryCards.output.title}
                    summary={summaryCards.output.summary}
                    fullText={summaryCards.output.fullText}
                    isActive={activeInfoPopover === summaryCards.output.key}
                    align="left"
                    cardClassName="min-h-0 rounded-[14px] border-[rgba(255,255,255,0.03)] bg-[rgba(12,12,13,0.35)] px-3 py-2.5"
                    summaryClassName="line-clamp-2 text-[11px] leading-[1.45] text-[#D9D9DE]"
                    popoverClassName="left-0"
                    onHoverStart={openInfoPopover}
                    onHoverEnd={scheduleInfoPopoverClose}
                    onToggle={toggleInfoPopover}
                  />
                </div>
              </div>
            </div>
          ) : middleView === 'emotion' ? (
            <EmotionStructurePanel
              scenarioId={middleScenarioId}
              rows={rows}
              activeShotIndex={focusedShotIndex}
              activePlanView={viewMode}
              onSelectShot={setFocusedShotIndex}
              onReorderRows={onRhythmReorderRows}
            />
          ) : (
            <ScriptVideoPanel outputSpec={outputSpec} scenarioLabel={videoScenarioLabel} onGenerate={onGenerateVideo} />
          )}
        </div>

        <ScriptPlanViews
          scenarioId={middleScenarioId}
          rows={rows}
          onRowsChange={onRowsChange}
          mentionAssets={mentionAssets}
          focusedShotIndex={focusedShotIndex}
          onFocusedShotChange={setFocusedShotIndex}
          onPlanViewChange={onPlanViewChange}
        />

        <div className="flex justify-end border-t border-[#2A2A2C] pt-1">
          <div className="flex flex-wrap items-center gap-2">
            <button className="rounded-full border border-[#2A2A2C] px-4 py-2 text-[13px] text-[#9A9A9E] transition-all hover:border-[#FF843D] hover:text-[#FFFFFF]">
              Revise Plan
            </button>
            <button type="button" onClick={onSaveDraft} className="rounded-full border border-[#2A2A2C] px-4 py-2 text-[13px] text-[#9A9A9E] transition-all hover:border-[#FF843D] hover:text-[#FFFFFF]">
              Save Draft
            </button>
            <button onClick={onGenerateVideo} className="inline-flex items-center gap-2 rounded-full bg-[#FF843D] px-5 py-2.5 text-[13px] font-medium text-white transition-all hover:bg-[#FFA465]">
              <Film size={14} /> Generate Video
            </button>
          </div>
        </div>

        <FlowChatboxDock>
          {({ onInputFocusChange, onPopoverStateChange, onInteractionLockChange }) => (
            <ScriptPlanComposerShell
              mentionAssets={mentionAssets}
              resetKey={`${title}-script`}
              scriptShots={rows.map((row, index) => ({
                id: `${row.time}-${index}`,
                label: `Shot ${String(index + 1).padStart(2, '0')}`,
                time: row.time,
                title: row.purpose || `Beat ${index + 1}`,
              }))}
              activeShotId={rows[focusedShotIndex] ? `${rows[focusedShotIndex].time}-${focusedShotIndex}` : `shot-${focusedShotIndex}`}
              actionLabel="Generate"
              onInputFocusChange={onInputFocusChange}
              onPopoverStateChange={onPopoverStateChange}
              onInteractionLockChange={onInteractionLockChange}
            />
          )}
        </FlowChatboxDock>
      </div>
    </div>
  );
}

function MockPreviewCell({
  scenarioId,
  rowIndex,
  onOpen,
  className = 'h-[92px] w-[140px] rounded-[14px]',
}: {
  scenarioId: string;
  rowIndex: number;
  onOpen: (payload: { scenarioId: string; rowIndex: number }) => void;
  className?: string;
}) {
  const previewMeta = getMockPreviewMeta(scenarioId, rowIndex);

  return (
    <button
      type="button"
      onClick={() => onOpen({ scenarioId, rowIndex })}
      className={`group relative overflow-hidden border border-[rgba(255,255,255,0.08)] transition-all duration-200 ease-out hover:border-[rgba(255,132,61,0.42)] hover:shadow-[0_10px_24px_rgba(0,0,0,0.28)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#FF843D]/35 ${className}`}
      style={{ background: previewMeta.background }}
    >
      <div className="absolute inset-0 transition-transform duration-200 ease-out group-hover:scale-[1.03]" />
      <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(255,255,255,0.03)_0%,rgba(0,0,0,0.14)_100%)]" />
    </button>
  );
}
void MockPreviewCell;

function StoryboardShotRow({
  scenarioId,
  row,
  rowIndex,
  purposeTags,
  onOpenDetails,
}: {
  scenarioId: string;
  row: EditableMockRow;
  rowIndex: number;
  purposeTags: string[];
  onOpenDetails: () => void;
}) {
  const previewMeta = getMockPreviewMeta(scenarioId, rowIndex);

  return (
    <div
      onClick={onOpenDetails}
      className="group flex h-[440px] w-[340px] cursor-pointer flex-col overflow-hidden rounded-[28px] border border-[rgba(255,255,255,0.08)] bg-[rgba(20,20,21,0.92)] p-5 shadow-[0_1px_3px_rgba(0,0,0,0.3)] transition-all duration-200 ease-out hover:border-[rgba(255,132,61,0.28)] hover:bg-[rgba(22,22,24,0.96)] hover:shadow-[0_16px_36px_rgba(0,0,0,0.26)]"
    >
      <div className="flex items-center justify-between gap-3">
        <span className="rounded-full border border-[rgba(255,132,61,0.22)] bg-[rgba(255,132,61,0.08)] px-3 py-1 text-[10px] font-semibold uppercase tracking-[0.18em] text-[#FFD2B4]">
          {`Shot ${String(rowIndex + 1).padStart(2, '0')}`}
        </span>
        <span className="rounded-full border border-[#2A2A2C] bg-[#101011] px-3 py-1 text-[11px] font-medium text-[#D9D9DE]">
          {row.time}
        </span>
      </div>

      <button
        type="button"
        onClick={(event) => {
          event.stopPropagation();
          onOpenDetails();
        }}
        className="group/preview relative mt-3 aspect-[16/9] overflow-hidden rounded-[22px] border border-[rgba(255,255,255,0.08)] bg-[#0E0E0F] text-left transition-all duration-200 ease-out hover:border-[rgba(255,132,61,0.35)]"
        style={{ background: previewMeta.background }}
      >
        <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(255,255,255,0.03)_0%,rgba(0,0,0,0.22)_100%)] transition-transform duration-200 ease-out group-hover/preview:scale-[1.02]" />
      </button>

      <div className="mt-4 flex min-h-0 flex-1 flex-col">
        <div className="space-y-2">
          <div className="text-[11px] font-semibold uppercase tracking-[0.18em] text-[#8E8E93]">Visual</div>
          <div className="line-clamp-3 min-h-[72px] text-[14px] leading-6 text-[#F3F3F5]">{row.scene}</div>
        </div>

        <div className="mt-4 min-h-[72px]">
          <div className="flex max-h-[72px] flex-wrap content-start gap-2 overflow-hidden">
            {purposeTags.map((tag) => (
              <span key={`${row.time}-${tag}`} className="inline-flex h-[32px] items-center rounded-full border border-[#2A2A2C] bg-[#101011] px-[12px] text-[10px] font-medium uppercase tracking-[0.12em] text-[#F3F3F5] whitespace-nowrap">
                {tag}
              </span>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
void StoryboardShotRow;

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
        className={`relative flex max-h-[82vh] w-full max-w-[680px] flex-col overflow-hidden rounded-[28px] border border-[rgba(255,255,255,0.08)] bg-[rgba(16,16,17,0.96)] p-4 shadow-[0_24px_64px_rgba(0,0,0,0.42)] backdrop-blur-xl transition-all duration-200 ease-out md:p-5 ${
          isVisible ? 'translate-y-0 scale-100 opacity-100' : 'translate-y-2 scale-[0.96] opacity-0'
        }`}
      >
        <div className="flex items-start justify-between gap-4">
          <div className="flex flex-wrap items-center gap-2">
            <span className="rounded-[12px] border border-[rgba(255,132,61,0.18)] bg-[rgba(255,132,61,0.08)] px-3 py-1 text-[11px] font-medium uppercase tracking-[0.16em] text-[#FFD2B4]">
              {`Shot ${rowIndex + 1} (${row.time})`}
            </span>
            {purposeTags[0] && (
              <span className="rounded-[12px] border border-[#2A2A2C] bg-[#101011] px-3 py-1 text-[11px] font-medium uppercase tracking-[0.16em] text-[#D4D4D8]">
                {purposeTags[0]}
              </span>
            )}
          </div>

          <button
            type="button"
            onClick={onClose}
            className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-[#2A2A2C] bg-[#101011] text-[#D4D4D8] transition-all hover:border-[#FF843D] hover:text-white"
          >
            <X size={16} />
          </button>
        </div>

        <div className="mt-4 overflow-hidden rounded-[24px] border border-[rgba(255,255,255,0.06)] bg-[#0E0E0F]">
          <div className="h-[200px] w-full bg-cover bg-center md:h-[220px]" style={{ background: previewMeta.background }} />
        </div>

        <div className="mt-4 flex-1 overflow-y-auto pr-1">
          <div className="grid gap-4 md:grid-cols-2">
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
              placeholder="No asset"
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

        <div className="mt-4 flex shrink-0 flex-col gap-3 border-t border-[rgba(255,255,255,0.08)] pt-4 md:flex-row md:items-center md:justify-between">
          <p className="text-[11px] leading-5 text-[#8E8E93]">
            Double-click any field to edit in place. Save applies the shot update locally. Regenerate updates only the selected shot in mock mode.
          </p>
          <div className="flex flex-wrap items-center gap-2">
            <button type="button" onClick={onRegenerateShot} className="rounded-full border border-[#2A2A2C] px-4 py-2 text-[12px] text-[#D4D4D8] transition-all hover:border-[#FF843D] hover:text-white">
              {isRegenerating ? 'Regenerating...' : 'Regenerate Shot'}
            </button>
            <button type="button" onClick={onEditShot} className="rounded-full border border-[#2A2A2C] px-4 py-2 text-[12px] text-[#D4D4D8] transition-all hover:border-[#FF843D] hover:text-white">
              Edit Shot
            </button>
            <button type="button" onClick={onClose} className="rounded-full bg-[#FF843D] px-4 py-2 text-[12px] font-medium text-white transition-all hover:bg-[#FFA465]">
              Done
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
void ShotDetailModal;

function SaveDraftChoiceModal({
  isOpen,
  onClose,
  onSaveToMyScripts,
  onSaveToAssetLibrary,
}: {
  isOpen: boolean;
  onClose: () => void;
  onSaveToMyScripts: () => void;
  onSaveToAssetLibrary: () => void;
}) {
  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-[320] flex items-center justify-center bg-[#FF843D]/20 p-4 backdrop-blur-[2px]"
      onClick={onClose}
    >
      <div
        className="w-full max-w-[560px] rounded-[28px] border border-[rgba(255,255,255,0.08)] bg-[#141415] p-6 shadow-[0_16px_48px_rgba(0,0,0,0.42)]"
        onClick={(event) => event.stopPropagation()}
      >
        <div className="mb-5">
          <div className="text-[11px] font-semibold uppercase tracking-[0.18em] text-[#8E8E93]">
            Save Draft
          </div>
          <h3 className="mt-2 text-[22px] font-semibold text-white">Save Draft</h3>
          <p className="mt-2 text-[13px] leading-6 text-[#9A9A9E]">
            Choose where you want to save this generated script plan.
          </p>
        </div>

        <div className="space-y-3">
          <button
            type="button"
            onClick={onSaveToMyScripts}
            className="w-full rounded-[22px] border border-[rgba(255,255,255,0.08)] bg-[rgba(18,18,19,0.88)] p-5 text-left transition-all hover:border-[rgba(255,132,61,0.28)] hover:bg-[rgba(24,24,25,0.96)]"
          >
            <div className="text-[15px] font-medium text-white">Save to My Scripts</div>
            <div className="mt-2 text-[12px] leading-6 text-[#9A9A9E]">
              Save this script plan as an editable script card in My Scripts.
            </div>
          </button>

          <button
            type="button"
            onClick={onSaveToAssetLibrary}
            className="w-full rounded-[22px] border border-[rgba(255,255,255,0.08)] bg-[rgba(18,18,19,0.88)] p-5 text-left transition-all hover:border-[rgba(255,132,61,0.28)] hover:bg-[rgba(24,24,25,0.96)]"
          >
            <div className="text-[15px] font-medium text-white">Save to Asset Library</div>
            <div className="mt-2 text-[12px] leading-6 text-[#9A9A9E]">
              Save this generated plan as a reusable asset package.
            </div>
          </button>
        </div>

        <div className="mt-5 flex justify-end">
          <button
            type="button"
            onClick={onClose}
            className="rounded-full border border-[#2A2A2C] px-4 py-2 text-[12px] font-medium text-[#9A9A9E] transition-all hover:border-[#FF843D] hover:text-white"
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
}

/* ─── Main ScriptPage ─── */
export default function ScriptPage() {
  const {
    historyOpen,
    scripts,
    activeScript,
    updateShotInActive,
    setActiveScript,
    setVideoScriptId,
    addScript,
    deleteScript,
    highlightedScriptId,
    setHighlightedScriptId,
  } = useScriptStore();
  const {
    setActiveNav,
    setPageTitleOverride,
    scriptPageIntent,
    clearScriptPageIntent,
    scriptPageRoute,
    setScriptPageRoute,
  } = useAppStore();
  const { pushUndo } = useEditorStore();
  const { activeScenarioId, scriptPlanReady, startVideoGeneration } = useMockDemoStore();
  const { addSavedAssetPackage } = useGenerateStore();
  const [pageMode, setPageMode] = useState<'preview' | 'project' | 'project_create' | 'editor'>('preview');
  const [viewMode, setViewMode] = useState<'table' | 'storyboard'>('table');
  const [editingShot, setEditingShot] = useState<any | null>(null);
  const [selectedShots, setSelectedShots] = useState<Set<string>>(new Set());
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [scriptToDelete, setScriptToDelete] = useState<string | null>(null);
  const [aiPanelOpen, setAiPanelOpen] = useState(false);
  const [scriptsSearch, setScriptsSearch] = useState('');
  const [scriptsViewMode, setScriptsViewMode] = useState<'grid' | 'list'>('grid');
  const [projectScripts, setProjectScripts] = useState<ProjectScript[]>(MOCK_PROJECT_SCRIPTS);
  const [activeProjectId, setActiveProjectId] = useState<string | null>(null);
  const [draftProject, setDraftProject] = useState<ProjectScript | null>(null);
  const [showSequenceModal, setShowSequenceModal] = useState(false);
  const [editorReturnMode, setEditorReturnMode] = useState<'preview' | 'project' | 'project_create'>('preview');
  const [middleView, setMiddleView] = useState<MiddleContentView>('summary');
  const [focusedShotIndex, setFocusedShotIndex] = useState(0);
  const [mockRows, setMockRows] = useState<EditableMockRow[]>([]);
  const [savedScriptRows, setSavedScriptRows] = useState<EditableMockRow[]>([]);
  const [activeInfoPopover, setActiveInfoPopover] = useState<string | null>(null);
  const [pinnedInfoPopover, setPinnedInfoPopover] = useState<string | null>(null);
  const [previewModal, setPreviewModal] = useState<{ scenarioId: string; rowIndex: number; time: string } | null>(null);
  const [previewModalVisible, setPreviewModalVisible] = useState(false);
  const [storyboardModalRowIndex, setStoryboardModalRowIndex] = useState<number | null>(null);
  const [storyboardModalVisible, setStoryboardModalVisible] = useState(false);
  const [storyboardModalDraft, setStoryboardModalDraft] = useState<EditableMockRow | null>(null);
  const [storyboardModalEditingField, setStoryboardModalEditingField] = useState<StoryboardModalFieldKey | null>(null);
  const [editingRowIndex, setEditingRowIndex] = useState<number | null>(null);
  const [editingRowDraft, setEditingRowDraft] = useState<EditableMockRow | null>(null);
  const [editingField, setEditingField] = useState<EditableFieldKey | null>(null);
  const [assetPopoverRowIndex, setAssetPopoverRowIndex] = useState<number | null>(null);
  const [assetPopoverMode, setAssetPopoverMode] = useState<'menu' | 'library'>('menu');
  const [isRegeneratingRow, setIsRegeneratingRow] = useState<number | null>(null);
  const hoverCloseTimerRef = useRef<number | null>(null);
  const previewCloseTimerRef = useRef<number | null>(null);
  const projectSequenceHoldTimerRef = useRef<number | null>(null);
  const assetInputRef = useRef<HTMLInputElement>(null);
  const tableWrapperRef = useRef<HTMLDivElement>(null);
  const storyboardScrollRef = useRef<HTMLDivElement>(null);
  const rowInlineScrollRef = useRef<HTMLDivElement>(null);
  const [rowInlineScrollLeft, setRowInlineScrollLeft] = useState(0);
  const [rowInlineScrollMax, setRowInlineScrollMax] = useState(0);
  const [tableViewportWidth, setTableViewportWidth] = useState(0);
  const [tableScrollLeft, setTableScrollLeft] = useState(0);
  const [tableScrollMax, setTableScrollMax] = useState(0);
  const [storyboardScrollLeft, setStoryboardScrollLeft] = useState(0);
  const [storyboardScrollMax, setStoryboardScrollMax] = useState(0);
  const [activeStoryboardShot, setActiveStoryboardShot] = useState(0);
  const [draggedRowIndex, setDraggedRowIndex] = useState<number | null>(null);
  const [dragOverRowIndex, setDragOverRowIndex] = useState<number | null>(null);
  const [draggedSequenceId, setDraggedSequenceId] = useState<string | null>(null);
  const [dragOverSequenceId, setDragOverSequenceId] = useState<string | null>(null);
  const [dragReadySequenceId, setDragReadySequenceId] = useState<string | null>(null);
  const [showSaveDraftModal, setShowSaveDraftModal] = useState(false);
  const [saveToastMessage, setSaveToastMessage] = useState<string | null>(null);
  void storyboardModalDraft;
  void setStoryboardModalDraft;
  void storyboardModalEditingField;
  void setStoryboardModalEditingField;
  void editingRowDraft;
  void assetPopoverRowIndex;
  void assetPopoverMode;
  void setAssetPopoverMode;
  void isRegeneratingRow;
  void setIsRegeneratingRow;
  void assetInputRef;
  void rowInlineScrollLeft;
  void rowInlineScrollMax;
  void tableViewportWidth;
  void tableScrollLeft;
  void tableScrollMax;
  void storyboardScrollLeft;
  void storyboardScrollMax;
  void activeStoryboardShot;
  void draggedRowIndex;
  void setDraggedRowIndex;
  void dragOverRowIndex;
  void setDragOverRowIndex;

  const mockScenario = activeScenarioId ? getMockDemoScenarioById(activeScenarioId) : null;
  const mockScriptPlanActive = Boolean(mockScenario && scriptPlanReady);
  const script = activeScript || null;
  const activeProject = projectScripts.find((project) => project.id === activeProjectId) ?? null;

  const navigateBackOr = (fallbackNav: string) => {
    if (window.history.length > 1 && document.referrer.includes(window.location.origin)) {
      window.history.back();
      return;
    }
    setActiveNav(fallbackNav);
  };

  useEffect(() => {
    if (pageMode === 'project' || pageMode === 'project_create') {
      setPageTitleOverride('Scripts / Project Script');
      return () => setPageTitleOverride(null);
    }
    if (pageMode === 'editor' || (scriptPageRoute === 'current_generation' && mockScriptPlanActive)) {
      setPageTitleOverride('Scripts / Script Detail');
      return () => setPageTitleOverride(null);
    }
    setPageTitleOverride('Scripts');
    return () => setPageTitleOverride(null);
  }, [mockScriptPlanActive, pageMode, scriptPageRoute, setPageTitleOverride]);

  useEffect(() => {
    if (scriptPageRoute !== 'overview') return;
    if (pageMode === 'preview') return;

    setActiveProjectId(null);
    setDraftProject(null);
    setPageMode('preview');
  }, [pageMode, scriptPageRoute]);

  useEffect(() => {
    if (!saveToastMessage) return;

    const timer = window.setTimeout(() => {
      setSaveToastMessage(null);
    }, 2400);

    return () => window.clearTimeout(timer);
  }, [saveToastMessage]);

  useEffect(() => {
    if (!scriptPageIntent) return;

    if (scriptPageIntent.type === 'script_editor' && activeScript) {
      setScriptPageRoute('overview');
      setVideoScriptId(null);
      setActiveProjectId(null);
      setEditorReturnMode('preview');
      setFocusedShotIndex(0);
      setMiddleView('summary');
      setViewMode('table');
      setPageMode('editor');
      clearScriptPageIntent();
      return;
    }

    if (scriptPageIntent.type === 'project_detail') {
      setScriptPageRoute('overview');
      const externalProject = hydrateProject(scriptPageIntent.project);
      setProjectScripts((prev) => {
        const hasExisting = prev.some((project) => project.id === externalProject.id);
        if (hasExisting) {
          return prev.map((project) => (project.id === externalProject.id ? externalProject : project));
        }

        return [externalProject, ...prev];
      });
      setActiveProjectId(externalProject.id);
      setDraftProject(null);
      setPageMode('project');
      clearScriptPageIntent();
    }
  }, [
    activeScript,
    clearScriptPageIntent,
    scriptPageIntent,
    setVideoScriptId,
  ]);

  const clearProjectSequenceHold = () => {
    if (projectSequenceHoldTimerRef.current) {
      window.clearTimeout(projectSequenceHoldTimerRef.current);
      projectSequenceHoldTimerRef.current = null;
    }
    setDragReadySequenceId(null);
  };

  const updateProjectById = (projectId: string, updater: (project: ProjectScript) => ProjectScript) => {
    setProjectScripts((prev) => prev.map((project) => (project.id === projectId ? hydrateProject(updater(project)) : project)));
  };

  const updateDraftProject = (updater: (project: ProjectScript) => ProjectScript) => {
    setDraftProject((prev) => (prev ? hydrateProject(updater(prev)) : prev));
  };

  useEffect(() => {
    if (!mockScenario) {
      setMockRows([]);
      setEditingRowIndex(null);
      setEditingRowDraft(null);
      setAssetPopoverRowIndex(null);
      return;
    }

    setMockRows(mockScenario.scriptPlan.rows.map((row) => ({ ...row })));
    setEditingRowIndex(null);
    setEditingRowDraft(null);
    setAssetPopoverRowIndex(null);
  }, [mockScenario?.id]);

  useEffect(() => {
    if (!script) {
      setSavedScriptRows([]);
      return;
    }
    setSavedScriptRows(mapScriptToEditableRows(script));
    setFocusedShotIndex(0);
    setMiddleView('summary');
  }, [script?.id]);

  useEffect(() => {
    const handlePointerDown = (event: MouseEvent) => {
      const target = event.target as HTMLElement;
      if (!target.closest('[data-info-popover-root]')) {
        setActiveInfoPopover(null);
        setPinnedInfoPopover(null);
      }

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
      if (event.key === 'Escape') {
        setActiveInfoPopover(null);
        setPinnedInfoPopover(null);
        setPreviewModalVisible(false);
        setStoryboardModalVisible(false);
        setAssetPopoverRowIndex(null);
        setEditingRowIndex(null);
        setEditingRowDraft(null);
        setEditingField(null);
      }
    };

    document.addEventListener('mousedown', handlePointerDown);
    document.addEventListener('keydown', handleEscape);

    return () => {
      document.removeEventListener('mousedown', handlePointerDown);
      document.removeEventListener('keydown', handleEscape);
    };
  }, [previewModal, storyboardModalRowIndex]);

  const globalOpenInfoPopover = (key: string) => {
    if (hoverCloseTimerRef.current) {
      window.clearTimeout(hoverCloseTimerRef.current);
    }
    setActiveInfoPopover(key);
    if (pinnedInfoPopover && pinnedInfoPopover !== key) {
      setPinnedInfoPopover(null);
    }
  };

  const globalScheduleInfoPopoverClose = () => {
    if (pinnedInfoPopover) return;
    if (hoverCloseTimerRef.current) {
      window.clearTimeout(hoverCloseTimerRef.current);
    }
    hoverCloseTimerRef.current = window.setTimeout(() => {
      setActiveInfoPopover(null);
    }, 180);
  };

  const globalToggleInfoPopover = (key: string) => {
    if (pinnedInfoPopover === key) {
      setPinnedInfoPopover(null);
      setActiveInfoPopover(null);
      return;
    }

    if (hoverCloseTimerRef.current) {
      window.clearTimeout(hoverCloseTimerRef.current);
    }

    setPinnedInfoPopover(key);
    setActiveInfoPopover(key);
  };

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
      setTableScrollLeft(wrapper.scrollLeft);
      setTableScrollMax(Math.max(0, wrapper.scrollWidth - wrapper.clientWidth));
    };

    syncViewportWidth();
    wrapper.addEventListener('scroll', syncViewportWidth);
    window.addEventListener('resize', syncViewportWidth);

    return () => {
      wrapper.removeEventListener('scroll', syncViewportWidth);
      window.removeEventListener('resize', syncViewportWidth);
    };
  }, [viewMode, mockRows.length, editingRowIndex]);

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
      setActiveStoryboardShot(Math.min(Math.max(Math.round(left / cardWidth), 0), Math.max(mockRows.length - 1, 0)));
    };

    syncStoryboardMetrics();
    wrapper.addEventListener('scroll', syncStoryboardMetrics);
    window.addEventListener('resize', syncStoryboardMetrics);

    return () => {
      wrapper.removeEventListener('scroll', syncStoryboardMetrics);
      window.removeEventListener('resize', syncStoryboardMetrics);
    };
  }, [viewMode, mockRows.length]);

  useEffect(() => {
    const rowScroller = rowInlineScrollRef.current;
    if (!rowScroller || editingRowIndex === null) {
      setRowInlineScrollLeft(0);
      setRowInlineScrollMax(0);
      return;
    }

    const syncScrollMetrics = () => {
      const max = Math.max(0, rowScroller.scrollWidth - rowScroller.clientWidth);
      setRowInlineScrollLeft(rowScroller.scrollLeft);
      setRowInlineScrollMax(max);
    };

    syncScrollMetrics();
    rowScroller.addEventListener('scroll', syncScrollMetrics);
    window.addEventListener('resize', syncScrollMetrics);

    return () => {
      rowScroller.removeEventListener('scroll', syncScrollMetrics);
      window.removeEventListener('resize', syncScrollMetrics);
    };
  }, [editingRowIndex, editingField, mockRows]);

  if (scriptPageRoute === 'current_generation' && pageMode !== 'editor' && mockScriptPlanActive && mockScenario) {
    const rows = mockRows.length > 0 ? mockRows : mockScenario.scriptPlan.rows;
    const durationLabel = getDurationLabel(mockScenario.outputSpec, rows);
    const narrativeArc = truncateText(getNarrativeArcText(mockScenario), 132);
    const emotionalGoal = truncateText(getEmotionalGoalText(mockScenario), 92);
    const visualDirection = truncateText(mockScenario.scriptPlan.globalDirection, 112);
    const rhythmText = truncateText(getRhythmText(mockScenario, rows), 92);
    const assetLogicText = truncateText(getAssetLogicText(mockScenario), 92);
    const outputSpecText = truncateText(mockScenario.outputSpec, 92);
    const infoCardItems = [
      { key: 'narrative', title: 'Narrative Arc', summary: narrativeArc, fullText: getNarrativeArcText(mockScenario), align: 'left' as const },
      { key: 'emotion', title: 'Emotional Goal', summary: emotionalGoal, fullText: getEmotionalGoalText(mockScenario), align: 'right' as const },
      { key: 'visual', title: 'Visual Direction', summary: visualDirection, fullText: mockScenario.scriptPlan.globalDirection, align: 'left' as const },
      { key: 'rhythm', title: 'Rhythm', summary: rhythmText, fullText: getRhythmText(mockScenario, rows), align: 'right' as const },
      { key: 'asset', title: 'Asset Logic', summary: assetLogicText, fullText: getAssetLogicText(mockScenario), align: 'left' as const },
      { key: 'output', title: 'Output Spec', summary: outputSpecText, fullText: mockScenario.outputSpec, align: 'left' as const },
    ];
    const summaryCards = Object.fromEntries(infoCardItems.map((item) => [item.key, item])) as Record<string, (typeof infoCardItems)[number]>;
    const composerMentionAssets = mockScenario.mockAssets.length
      ? mockScenario.mockAssets
      : [
          { id: 'default-1', name: 'Image 1 · Subject Reference', role: 'Primary subject and silhouette guidance' },
          { id: 'default-2', name: 'Image 2 · Scene Reference', role: 'Space, environment, and framing direction' },
          { id: 'default-3', name: 'Image 3 · Mood Reference', role: 'Lighting, palette, and emotional tone' },
        ];

    return (
      <>
        <ScriptPlanWorkspaceShell
          title={`Generated Script Plan · ${mockScenario.scriptPlan.title || mockScenario.label}`}
          statusLabel="Draft"
          durationLabel={durationLabel}
          versionLabel="v1"
          summaryCards={summaryCards}
          activeInfoPopover={activeInfoPopover}
          openInfoPopover={globalOpenInfoPopover}
          scheduleInfoPopoverClose={globalScheduleInfoPopoverClose}
          toggleInfoPopover={globalToggleInfoPopover}
          middleView={middleView}
          setMiddleView={setMiddleView}
          rows={rows}
          middleScenarioId={mockScenario.id}
          viewMode={viewMode}
          onPlanViewChange={setViewMode}
          focusedShotIndex={focusedShotIndex}
          setFocusedShotIndex={setFocusedShotIndex}
          onRowsChange={setMockRows}
          onRhythmReorderRows={(nextRows, nextActiveIndex) => {
            setMockRows(nextRows);
            setFocusedShotIndex(nextActiveIndex);
          }}
          mentionAssets={composerMentionAssets}
          outputSpec={mockScenario.outputSpec}
          videoScenarioLabel={mockScenario.label}
          onSaveDraft={handleSaveCurrentDraft}
          onGenerateVideo={() => {
            setVideoScriptId(null);
            startVideoGeneration();
            setActiveNav('edit');
          }}
          backLabel="Back to Questions"
          onBack={() => navigateBackOr('generate')}
        />
        {renderSaveDraftOverlays()}
      </>
    );
  }

  function createScriptDraftFromRows(title: string, rowsToSave: EditableMockRow[]): Script {
    const nowLabel = 'Updated just now';
    const normalizedShots = rowsToSave.map((row, index) => ({
      id: `shot-${Date.now()}-${index + 1}`,
      timeRange: row.time || `${index * 3}-${(index + 1) * 3}s`,
      preview: row.previewImage || '',
      visual: row.scene || 'Pending visual direction',
      purpose: row.purpose || 'DRAFT',
      camera: row.camera || 'To be defined',
      asset: row.assetSource || 'ADD ASSET',
      copy: row.textOrCaption || row.audioOrVoice || '',
    }));

    return {
      id: `draft-${Date.now()}`,
      title,
      status: 'draft',
      duration: `${normalizedShots.length * 3}s`,
      version: 'v1',
      createdAt: nowLabel,
      updatedAt: nowLabel,
      source: 'generated-flow',
      shortDescription: mockScenario
        ? truncateText(getNarrativeArcText(mockScenario), 168)
        : 'Saved from the current script plan flow.',
      category: mockScenario?.label || 'Generated Script',
      coverImage: rowsToSave[0]?.previewImage || normalizedShots[0]?.preview || '/assets/story-1.jpg',
      outputSpec: mockScenario?.outputSpec || `${normalizedShots.length * 3}s · generated draft`,
      narrativeArc: mockScenario ? getNarrativeArcText(mockScenario) : 'Saved from script plan workspace',
      emotionalGoal: mockScenario ? getEmotionalGoalText(mockScenario) : 'Refine the pacing and emotional arc',
      visualDirection: mockScenario ? mockScenario.scriptPlan.globalDirection : 'Local draft visual direction',
      rhythm: mockScenario ? getRhythmText(mockScenario, rowsToSave) : 'Steady scripted pacing',
      assetLogic: mockScenario ? getAssetLogicText(mockScenario) : 'Assets attached locally in draft mode',
      shots: normalizedShots,
    };
  }

  function buildCurrentDraftScript(): Script | null {
    if (mockScenario && mockRows.length > 0) {
      return createScriptDraftFromRows(mockScenario.scriptPlan.title || mockScenario.label, mockRows);
    }

    if (script) {
      const rowsToSave = savedScriptRows.length > 0 ? savedScriptRows : mapScriptToEditableRows(script);
      return {
        ...script,
        id: `${script.id}-${Date.now()}`,
        version: 'v1',
        createdAt: script.createdAt || 'Updated just now',
        updatedAt: 'Updated just now',
        source: script.source || 'saved-script',
        coverImage: rowsToSave[0]?.previewImage || script.coverImage || script.shots[0]?.preview || '/assets/story-1.jpg',
        shots: mapEditableRowsToShots(rowsToSave, script),
      };
    }

    return null;
  }

  function buildAssetPackageFromScript(nextDraft: Script) {
    return {
      id: `asset-script-${Date.now()}`,
      type: 'script-package' as const,
      title: nextDraft.title,
      summary: nextDraft.shortDescription || truncateText(nextDraft.narrativeArc, 168),
      outputSpec: nextDraft.outputSpec || `${nextDraft.duration} · ${nextDraft.shots.length} shots`,
      thumbnail: nextDraft.coverImage || nextDraft.shots[0]?.preview || '/assets/story-1.jpg',
      thumbnails: nextDraft.shots
        .map((shot) => shot.preview)
        .filter((value): value is string => Boolean(value))
        .slice(0, 6),
      createdAt: 'Saved just now',
      script: nextDraft,
    };
  }

  function handleSaveCurrentDraft() {
    setShowSaveDraftModal(true);
  }

  function handleSaveDraftToMyScripts() {
    const nextDraft = buildCurrentDraftScript();
    if (!nextDraft) return;

    addScript(nextDraft);
    setHighlightedScriptId(nextDraft.id);
    setActiveScript(null);
    setScriptPageRoute('overview');
    setShowSaveDraftModal(false);
    setPageMode('preview');
    setSaveToastMessage('Saved to My Scripts.');
    setActiveNav('script');
  }

  function handleSaveDraftToAssetLibrary() {
    const nextDraft = buildCurrentDraftScript();
    if (!nextDraft) return;

    addSavedAssetPackage(buildAssetPackageFromScript(nextDraft));
    setShowSaveDraftModal(false);
    setSaveToastMessage('Saved to Asset Library.');
    setActiveNav('assets');
  }

  function renderSaveDraftOverlays() {
    return (
      <>
        <SaveDraftChoiceModal
          isOpen={showSaveDraftModal}
          onClose={() => setShowSaveDraftModal(false)}
          onSaveToMyScripts={handleSaveDraftToMyScripts}
          onSaveToAssetLibrary={handleSaveDraftToAssetLibrary}
        />
        {saveToastMessage ? (
          <div className="fixed bottom-6 right-6 z-[340] rounded-full border border-[rgba(255,255,255,0.08)] bg-[rgba(20,20,21,0.94)] px-4 py-2 text-[12px] font-medium text-white shadow-[0_10px_30px_rgba(0,0,0,0.3)]">
            {saveToastMessage}
          </div>
        ) : null}
      </>
    );
  }

  const handleOpenScriptDetail = (nextScript: Script) => {
    setScriptPageRoute('overview');
    setHighlightedScriptId(null);
    setActiveScript(nextScript);
    setVideoScriptId(null);
    setActiveProjectId(null);
    setEditorReturnMode('preview');
    setFocusedShotIndex(0);
    setMiddleView('summary');
    setViewMode('table');
    setPageMode('editor');
  };

  const handleOpenProject = (projectId: string) => {
    setScriptPageRoute('overview');
    setHighlightedScriptId(null);
    setActiveProjectId(projectId);
    setDraftProject(null);
    setPageMode('project');
  };

  const handleStartCreateProject = () => {
    setActiveProjectId(null);
    setDraftProject(createEmptyProjectDraft());
    setPageMode('project_create');
  };

  const handleOpenProjectSequence = (sequence: ProjectSequence, returnMode: 'project' | 'project_create') => {
    const sourceScript = SEQUENCE_LIBRARY_MAP[sequence.scriptKey]?.script;
    if (!sourceScript) return;

    const nextScript: Script = {
      ...sourceScript,
      id: `${sourceScript.id}-${sequence.id}`,
      title: sequence.title,
      duration: sequence.duration,
      shortDescription: sequence.description,
      coverImage: sequence.preview,
      shots: sourceScript.shots.map((shot) => ({
        ...shot,
        preview: shot.preview || sequence.preview,
      })),
    };

    setScriptPageRoute('overview');
    setHighlightedScriptId(null);
    setActiveScript(nextScript);
    setVideoScriptId(null);
    setEditorReturnMode(returnMode);
    setFocusedShotIndex(0);
    setMiddleView('summary');
    setViewMode('table');
    setPageMode('editor');
  };

  const handleAddProjectSequence = () => {
    setShowSequenceModal(true);
  };

  const handleSelectSequenceTemplate = (sequenceKey: string) => {
    const source = SEQUENCE_LIBRARY_MAP[sequenceKey];
    if (!source) return;

    if (pageMode === 'project' && activeProject) {
      updateProjectById(activeProject.id, (project) => ({
        ...project,
        sequences: [
          ...project.sequences,
          createProjectSequenceFromLibrary(sequenceKey, project.sequences.length + 1, project.id),
        ],
      }));
      setShowSequenceModal(false);
      return;
    }

    if (pageMode === 'project_create' && draftProject) {
      updateDraftProject((project) => ({
        ...project,
        cover: project.cover === '/assets/story-1.jpg' ? source.preview : project.cover,
        sequences: [
          ...project.sequences,
          createProjectSequenceFromLibrary(sequenceKey, project.sequences.length + 1, 'draft'),
        ],
      }));
    }

    setShowSequenceModal(false);
  };

  const handleDeleteProjectSequence = (sequenceId: string) => {
    if (pageMode === 'project' && activeProject) {
      updateProjectById(activeProject.id, (project) => ({
        ...project,
        sequences: project.sequences.filter((sequence) => sequence.id !== sequenceId),
      }));
      return;
    }

    if (pageMode === 'project_create') {
      updateDraftProject((project) => ({
        ...project,
        sequences: project.sequences.filter((sequence) => sequence.id !== sequenceId),
      }));
    }
  };

  const reorderProjectSequenceList = (sequences: ProjectSequence[], draggedId: string, targetId: string) => {
    if (draggedId === targetId) return sequences;
    const fromIndex = sequences.findIndex((sequence) => sequence.id === draggedId);
    const toIndex = sequences.findIndex((sequence) => sequence.id === targetId);
    if (fromIndex === -1 || toIndex === -1) return sequences;

    const nextSequences = [...sequences];
    const [moved] = nextSequences.splice(fromIndex, 1);
    nextSequences.splice(toIndex, 0, moved);
    return normalizeProjectSequences(nextSequences);
  };

  const handleProjectSequencePointerDown = (sequenceId: string, event: React.MouseEvent<HTMLDivElement>) => {
    const target = event.target as HTMLElement;
    if (target.closest('button, input, textarea')) {
      return;
    }
    clearProjectSequenceHold();
    projectSequenceHoldTimerRef.current = window.setTimeout(() => {
      setDragReadySequenceId(sequenceId);
    }, 220);
  };

  const handleProjectSequencePointerUp = () => {
    if (!draggedSequenceId) {
      clearProjectSequenceHold();
    }
  };

  const handleProjectSequencePointerLeave = () => {
    if (!draggedSequenceId) {
      clearProjectSequenceHold();
    }
  };

  const handleProjectSequenceDragStart = (sequenceId: string) => {
    setDraggedSequenceId(sequenceId);
    setDragOverSequenceId(sequenceId);
  };

  const handleProjectSequenceDragEnd = () => {
    setDraggedSequenceId(null);
    setDragOverSequenceId(null);
    clearProjectSequenceHold();
  };

  const handleProjectSequenceDragOver = (sequenceId: string, event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    if (draggedSequenceId !== sequenceId) {
      setDragOverSequenceId(sequenceId);
    }
  };

  const handleProjectSequenceDrop = (sequenceId: string) => {
    if (!draggedSequenceId) return;

    if (pageMode === 'project' && activeProject) {
      updateProjectById(activeProject.id, (project) => ({
        ...project,
        sequences: reorderProjectSequenceList(project.sequences, draggedSequenceId, sequenceId),
      }));
    } else if (pageMode === 'project_create') {
      updateDraftProject((project) => ({
        ...project,
        sequences: reorderProjectSequenceList(project.sequences, draggedSequenceId, sequenceId),
      }));
    }

    setDraggedSequenceId(null);
    setDragOverSequenceId(null);
    clearProjectSequenceHold();
  };

  const handleProjectDraftChange = (patch: Partial<ProjectScript>) => {
    updateDraftProject((project) => ({
      ...project,
      ...patch,
    }));
  };

  const handleSaveProjectDraft = () => {
    if (!draftProject) return;
    const nextProject = hydrateProject({
      ...draftProject,
      id: `project-${Date.now()}`,
      title: draftProject.title || 'Untitled Team Script',
      description: draftProject.description || 'Collaborative multi-shot team script.',
      narrativeDirection: draftProject.narrativeDirection || draftProject.description || 'Collaborative multi-shot team script.',
      lastEdited: 'Edited just now',
    });

    setProjectScripts((prev) => [nextProject, ...prev]);
    setActiveProjectId(nextProject.id);
    setDraftProject(null);
    setPageMode('project');
  };

  const handleGenerateProjectVideo = (project: ProjectScript) => {
    const combinedScript = buildCombinedProjectScript(project);
    setActiveScript(combinedScript);
    setVideoScriptId(combinedScript.id);
    startVideoGeneration();
    setActiveNav('edit');
  };

  const handleDeleteClick = (scriptId: string) => {
    setScriptToDelete(scriptId);
    setShowDeleteModal(true);
  };

  const handleConfirmDelete = () => {
    if (scriptToDelete) {
      deleteScript(scriptToDelete);
      setScriptToDelete(null);
      setShowDeleteModal(false);
    }
  };

  const handleScriptUpdateFromChat = (updatedScript: any) => {
    pushUndo({ type: 'full', data: JSON.parse(JSON.stringify(script)), label: 'AI modification', timestamp: Date.now() });
    setActiveScript(updatedScript);
  };

  const filteredScripts = scripts.filter((item) => {
    const query = scriptsSearch.trim().toLowerCase();
    if (!query) return true;
    return `${item.title} ${item.narrativeArc} ${item.duration}`.toLowerCase().includes(query);
  });

  const filteredProjectScripts = projectScripts.filter((item) => {
    const query = scriptsSearch.trim().toLowerCase();
    if (!query) return true;
    return `${item.title} ${item.description} ${item.renderMode}`.toLowerCase().includes(query);
  });

  if (pageMode === 'project' && activeProject) {
    return (
      <>
        <ProjectDetailView
          project={activeProject}
          onBack={() => {
            if (window.history.length > 1 && document.referrer.includes(window.location.origin)) {
              window.history.back();
              return;
            }
            setPageMode('preview');
          }}
          onAddSequence={handleAddProjectSequence}
          onOpenSequence={(sequence) => handleOpenProjectSequence(sequence, 'project')}
          onDeleteSequence={handleDeleteProjectSequence}
          onSequencePointerDown={handleProjectSequencePointerDown}
          onSequencePointerUp={handleProjectSequencePointerUp}
          onSequencePointerLeave={handleProjectSequencePointerLeave}
          onSequenceDragStart={handleProjectSequenceDragStart}
          onSequenceDragEnd={handleProjectSequenceDragEnd}
          onSequenceDragOver={handleProjectSequenceDragOver}
          onSequenceDrop={handleProjectSequenceDrop}
          draggedSequenceId={draggedSequenceId}
          dragReadySequenceId={dragReadySequenceId}
          dragOverSequenceId={dragOverSequenceId}
          onGenerateVideo={() => handleGenerateProjectVideo(activeProject)}
        />
        <AddSequenceModal isOpen={showSequenceModal} onClose={() => setShowSequenceModal(false)} onSelect={handleSelectSequenceTemplate} />
      </>
    );
  }

  if (pageMode === 'project_create' && draftProject) {
    return (
      <>
        <CreateProjectView
          project={draftProject}
          onBack={() => {
            setDraftProject(null);
            setPageMode('preview');
          }}
          onChange={handleProjectDraftChange}
          onAddSequence={handleAddProjectSequence}
          onOpenSequence={(sequence) => handleOpenProjectSequence(sequence, 'project_create')}
          onDeleteSequence={handleDeleteProjectSequence}
          onSequencePointerDown={handleProjectSequencePointerDown}
          onSequencePointerUp={handleProjectSequencePointerUp}
          onSequencePointerLeave={handleProjectSequencePointerLeave}
          onSequenceDragStart={handleProjectSequenceDragStart}
          onSequenceDragEnd={handleProjectSequenceDragEnd}
          onSequenceDragOver={handleProjectSequenceDragOver}
          onSequenceDrop={handleProjectSequenceDrop}
          draggedSequenceId={draggedSequenceId}
          dragReadySequenceId={dragReadySequenceId}
          dragOverSequenceId={dragOverSequenceId}
          onSaveDraft={handleSaveProjectDraft}
          onGenerateVideo={() => handleGenerateProjectVideo(draftProject)}
        />
        <AddSequenceModal isOpen={showSequenceModal} onClose={() => setShowSequenceModal(false)} onSelect={handleSelectSequenceTemplate} />
      </>
    );
  }

  if (pageMode === 'editor' && script) {
    const rows = savedScriptRows.length > 0 ? savedScriptRows : mapScriptToEditableRows(script);
    const outputSpec = script.outputSpec || `${script.duration} · ${script.category || 'script draft'}`;
    const durationLabel = getDurationLabel(outputSpec, rows);
    const narrativeArc = truncateText(script.narrativeArc, 132);
    const emotionalGoal = truncateText(script.emotionalGoal, 92);
    const visualDirection = truncateText(script.visualDirection, 112);
    const rhythmText = truncateText(script.rhythm, 92);
    const assetLogicText = truncateText(script.assetLogic, 92);
    const outputSpecText = truncateText(outputSpec, 92);
    const infoCardItems = [
      { key: 'narrative', title: 'Narrative Arc', summary: narrativeArc, fullText: script.narrativeArc, align: 'left' as const },
      { key: 'emotion', title: 'Emotional Goal', summary: emotionalGoal, fullText: script.emotionalGoal, align: 'right' as const },
      { key: 'visual', title: 'Visual Direction', summary: visualDirection, fullText: script.visualDirection, align: 'left' as const },
      { key: 'rhythm', title: 'Rhythm', summary: rhythmText, fullText: script.rhythm, align: 'right' as const },
      { key: 'asset', title: 'Asset Logic', summary: assetLogicText, fullText: script.assetLogic, align: 'left' as const },
      { key: 'output', title: 'Output Spec', summary: outputSpecText, fullText: outputSpec, align: 'left' as const },
    ];
    const summaryCards = Object.fromEntries(infoCardItems.map((item) => [item.key, item])) as Record<string, DetailInfoCardItem>;
    const mentionAssets = getScriptMentionAssets(script);

    return (
      <>
        <ScriptPlanWorkspaceShell
          title={`Generated Script Plan · ${script.title}`}
          statusLabel={script.status === 'complete' ? 'Ready' : script.status === 'in_progress' ? 'In Progress' : 'Draft'}
          durationLabel={durationLabel}
          versionLabel={script.version}
          summaryCards={summaryCards}
          activeInfoPopover={activeInfoPopover}
          openInfoPopover={globalOpenInfoPopover}
          scheduleInfoPopoverClose={globalScheduleInfoPopoverClose}
          toggleInfoPopover={globalToggleInfoPopover}
          middleView={middleView}
          setMiddleView={setMiddleView}
          rows={rows}
          middleScenarioId={getScriptThemeId(script)}
          viewMode={viewMode}
          onPlanViewChange={setViewMode}
          focusedShotIndex={focusedShotIndex}
          setFocusedShotIndex={setFocusedShotIndex}
          onRowsChange={(nextRows) => {
            setSavedScriptRows(nextRows);
            setActiveScript({
              ...script,
              shots: mapEditableRowsToShots(nextRows, script),
            });
          }}
          onRhythmReorderRows={(nextRows, nextActiveIndex) => {
            setFocusedShotIndex(nextActiveIndex);
            setSavedScriptRows(nextRows);
            setActiveScript({
              ...script,
              shots: mapEditableRowsToShots(nextRows, script),
            });
          }}
          mentionAssets={mentionAssets}
          outputSpec={outputSpec}
          videoScenarioLabel={script.title}
          onSaveDraft={handleSaveCurrentDraft}
          onGenerateVideo={() => {
            setVideoScriptId(script.id);
            startVideoGeneration();
            setActiveNav('edit');
          }}
          backLabel={editorReturnMode === 'preview' ? 'Back to Scripts' : 'Back to Project'}
          onBack={() => {
            if (window.history.length > 1 && document.referrer.includes(window.location.origin)) {
              window.history.back();
              return;
            }
            setPageMode(editorReturnMode);
          }}
        />
        {renderSaveDraftOverlays()}
      </>
    );
  }

  // ========== PREVIEW MODE ==========
  if (pageMode === 'preview') {
    return (
      <div className="pb-24">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-[24px] font-bold text-[#FFFFFF]">Scripts</h2>
            <p className="text-[13px] text-[#9A9A9E] mt-1">{scripts.length} scripts in your workspace</p>
          </div>
          <div className="flex gap-3">
            <div className="inline-flex items-center rounded-xl border border-[#2A2A2C] bg-[#141415] p-1">
              <button
                type="button"
                onClick={() => setScriptsViewMode('grid')}
                className={`inline-flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-[12px] transition-all ${
                  scriptsViewMode === 'grid' ? 'bg-[#101011] text-white' : 'text-[#8E8E93] hover:text-white'
                }`}
              >
                <LayoutGrid size={13} /> Grid
              </button>
              <button
                type="button"
                onClick={() => setScriptsViewMode('list')}
                className={`inline-flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-[12px] transition-all ${
                  scriptsViewMode === 'list' ? 'bg-[#101011] text-white' : 'text-[#8E8E93] hover:text-white'
                }`}
              >
                <List size={13} /> List
              </button>
            </div>
            <div className="flex items-center gap-2 px-3 py-2 rounded-xl border border-[#2A2A2C] bg-[#141415]">
              <Search size={14} className="text-[#6B6B6F]" />
              <input
                type="text"
                value={scriptsSearch}
                onChange={(event) => setScriptsSearch(event.target.value)}
                placeholder="Search scripts..."
                className="w-[150px] bg-transparent text-[13px] outline-none placeholder:text-[#6B6B6F]"
              />
            </div>
            <button
              onClick={() => setShowUploadModal(true)}
              className="flex items-center gap-2 px-4 py-2 rounded-xl border border-[#2A2A2C] text-[13px] font-medium text-[#9A9A9E] hover:border-[#FF843D] hover:text-[#FFFFFF] transition-all"
            >
              <Upload size={14} /> Import
            </button>
            <button
              onClick={() => useAppStore.getState().setActiveNav('generate')}
              className="flex items-center gap-2 px-4 py-2 bg-[#FF843D] text-white text-[13px] font-medium rounded-full hover:bg-[#FFA465] transition-all"
            >
              <Plus size={14} /> New Script
            </button>
          </div>
        </div>

        {/* My Scripts */}
        {filteredScripts.length > 0 && (
          <div className="mb-8">
            <div className="flex items-center gap-2 mb-4">
              <span className="text-[11px] font-semibold uppercase tracking-wider text-[#9A9A9E]">My Scripts</span>
              <div className="flex-1 h-px bg-[#2A2A2C]" />
            </div>
            {scriptsViewMode === 'grid' ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {filteredScripts.map((s) => (
                  <div
                    key={s.id}
                    onClick={() => handleOpenScriptDetail(s)}
                    className={`bg-[#141415] rounded-xl border overflow-hidden cursor-pointer hover:border-[#FF843D] hover:shadow-[0_4px_20px_rgba(0,0,0,0.1)] transition-all group ${
                      highlightedScriptId === s.id ? 'border-[#FF843D] shadow-[0_0_0_1px_rgba(255,132,61,0.35)]' : 'border-[#2A2A2C]'
                    }`}
                  >
                    <div className="aspect-video relative overflow-hidden bg-[#FF843D]">
                      <img src={s.coverImage || s.shots[0]?.preview || '/assets/story-1.jpg'} alt={s.title} className="w-full h-full object-cover opacity-80 group-hover:opacity-100 transition-all" />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
                      <div className="absolute bottom-3 left-3 right-3">
                        <span className="px-2 py-1 bg-[#141415]/90 rounded text-[10px] font-medium text-[#FFFFFF]">{s.duration}</span>
                        <span className="ml-2 px-2 py-1 bg-[#FF843D]/50 rounded text-[10px] font-medium text-white">{s.shots.length} shots</span>
                      </div>
                      {s.category && (
                        <div className="absolute top-3 left-3">
                          <span className="px-2 py-1 bg-[#FF6B00] rounded text-[10px] font-medium text-white">{s.category}</span>
                        </div>
                      )}
                    </div>
                    <div className="p-4">
                      <h3 className="text-[16px] font-semibold text-[#FFFFFF] mb-1">{s.title}</h3>
                      <p className="text-[12px] text-[#9A9A9E] line-clamp-2 mb-3">{s.shortDescription || s.narrativeArc}</p>
                      <div className="flex items-center justify-between">
                        <span className="text-[11px] text-[#6B6B6F]">Version {s.version}</span>
                        <div className="flex gap-2">
                          <button
                            onClick={(e) => { e.stopPropagation(); handleDeleteClick(s.id); }}
                            className="px-2 py-1 text-[11px] text-[#6B6B6F] hover:text-[#EF4444] transition-colors"
                          >
                            <Trash2 size={12} />
                          </button>
                          <button
                            onClick={(e) => { e.stopPropagation(); handleOpenScriptDetail(s); }}
                            className="px-3 py-1.5 bg-[#FF843D] text-white text-[11px] font-medium rounded-full"
                          >
                            Edit
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="space-y-3">
                {filteredScripts.map((s) => (
                  <ScriptListRow key={s.id} script={s} onOpen={() => handleOpenScriptDetail(s)} onDelete={() => handleDeleteClick(s.id)} />
                ))}
              </div>
            )}
          </div>
        )}

        {/* Project Scripts */}
        <div className="mb-8">
          <div className="flex items-center gap-2 mb-4">
            <span className="text-[11px] font-semibold uppercase tracking-wider text-[#9A9A9E]">Project Scripts</span>
            <div className="flex-1 h-px bg-[#2A2A2C]" />
          </div>
          <div className="mb-4 max-w-[720px] text-[13px] leading-6 text-[#8E8E93]">
            Combine multiple script plans into a complete video project.
          </div>
          {scriptsViewMode === 'grid' ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {filteredProjectScripts.map((project) => (
                <ProjectScriptCard key={project.id} project={project} onOpen={() => handleOpenProject(project.id)} />
              ))}
              <div
                onClick={handleStartCreateProject}
                className="bg-[#141415] rounded-xl border border-dashed border-[#3A3A3C] overflow-hidden cursor-pointer hover:border-[#FF843D] transition-all flex flex-col items-center justify-center min-h-[240px]"
              >
                <div className="w-12 h-12 rounded-full bg-[#141415] flex items-center justify-center mb-3">
                  <Plus size={20} className="text-[#9A9A9E]" />
                </div>
                <span className="text-[14px] font-medium text-[#9A9A9E]">Create New Project</span>
                <span className="text-[11px] text-[#6B6B6F] mt-1">Start from scratch with AI</span>
              </div>
            </div>
          ) : (
            <div className="space-y-3">
              {filteredProjectScripts.map((project) => (
                <ProjectScriptListRow key={project.id} project={project} onOpen={() => handleOpenProject(project.id)} />
              ))}
              <div
                onClick={handleStartCreateProject}
                className="flex min-h-[92px] cursor-pointer items-center justify-center rounded-[20px] border border-dashed border-[#3A3A3C] bg-[#141415] text-[13px] text-[#9A9A9E] transition-all hover:border-[#FF843D] hover:text-white"
              >
                <span className="inline-flex items-center gap-2"><Plus size={16} /> Create New Project</span>
              </div>
            </div>
          )}
        </div>

        {showUploadModal && <UploadDocumentModal onClose={() => setShowUploadModal(false)} onScriptCreated={(s) => { addScript(s); handleOpenScriptDetail(s); setShowUploadModal(false); }} />}
        {renderSaveDraftOverlays()}
        {showDeleteModal && (
          <div className="fixed inset-0 z-[300] flex items-center justify-center bg-[#FF843D]/40 p-4" onClick={() => setShowDeleteModal(false)}>
            <div className="bg-[#141415] rounded-2xl w-full max-w-[400px] p-6" onClick={e => e.stopPropagation()}>
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 rounded-full bg-[rgba(239,68,68,0.15)] flex items-center justify-center">
                  <Trash2 size={20} className="text-[#EF4444]" />
                </div>
                <div>
                  <h3 className="text-[16px] font-semibold text-[#FFFFFF]">Delete Script?</h3>
                  <p className="text-[13px] text-[#9A9A9E]">This action cannot be undone</p>
                </div>
              </div>
              <p className="text-[13px] text-[#9A9A9E] leading-relaxed mb-6">是否确认删除，删除后则无法找回脚本工程</p>
              <div className="flex gap-3">
                <button onClick={() => setShowDeleteModal(false)} className="flex-1 px-4 py-2.5 rounded-full border border-[#2A2A2C] text-[13px] font-medium text-[#9A9A9E] hover:border-[#FF843D] transition-all">Cancel</button>
                <button onClick={handleConfirmDelete} className="flex-1 px-4 py-2.5 rounded-full bg-[rgba(239,68,68,0.15)]0 text-white text-[13px] font-medium hover:bg-red-600 transition-all">Delete</button>
              </div>
            </div>
          </div>
        )}
      </div>
    );
  }

  // ========== EDITOR MODE ==========
  if (!script) {
    return (
      <div className="flex flex-col items-center justify-center py-20">
        <div className="w-16 h-16 rounded-2xl bg-[#141415] flex items-center justify-center mb-4">
          <Image size={28} className="text-[#3A3A3C]" />
        </div>
        <h3 className="text-[18px] font-semibold text-[#FFFFFF] mb-2">No Script Active</h3>
        <p className="text-[13px] text-[#9A9A9E] mb-4">Generate a script first, or create one manually.</p>
      </div>
    );
  }

  const toggleSelect = (id: string) => {
    const next = new Set(selectedShots);
    if (next.has(id)) next.delete(id); else next.add(id);
    setSelectedShots(next);
  };

  const handleBatchDelete = () => {
    pushUndo({ type: 'full', data: JSON.parse(JSON.stringify(script)), label: 'Batch delete shots', timestamp: Date.now() });
    const newShots = script.shots.filter((s: any) => !selectedShots.has(s.id));
    setActiveScript({ ...script, shots: newShots });
    setSelectedShots(new Set());
  };

  return (
    <div className="relative">
      {/* Ambient Lighting */}
      <AmbientGlow variant="subtle" fixed={false} />
      {/* Editor Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-4">
          <button onClick={() => setPageMode('preview')} className="flex items-center gap-2 text-[13px] text-[#9A9A9E] hover:text-[#FFFFFF] transition-colors">
            <BookOpen size={14} /> Back to Scripts
          </button>
          <span className="text-[#D4D4D8]">|</span>
          <span className="text-[14px] font-semibold text-[#FFFFFF]">{script.title}</span>
          <span className="px-2 py-0.5 bg-[#141415] rounded text-[10px] text-[#9A9A9E]">{script.duration}</span>
        </div>
        <div className="flex items-center gap-2">
          <button className="px-3 py-1.5 rounded-lg border border-[#2A2A2C] text-[12px] text-[#9A9A9E] hover:bg-[#141415] flex items-center gap-1.5">
            <Film size={12} /> Replace Assets
          </button>
          <button className="px-3 py-1.5 bg-[#FF843D] text-white rounded-lg text-[12px] font-medium hover:bg-[#FFA465] flex items-center gap-1.5">
            <Save size={12} /> Save
          </button>
        </div>
      </div>

      <div className="flex gap-6 pb-24 -mx-4 md:-mx-8 -mt-8 pt-8 px-4 md:px-8 min-h-[calc(100vh-48px)]">
        {/* History Sidebar */}
        <aside className={`${historyOpen ? 'w-[240px]' : 'w-0'} bg-[#141415] border-r border-[#2A2A2C] transition-all overflow-hidden shrink-0 hidden md:block`}>
          <div className="p-4">
            <div className="flex items-center justify-between mb-4">
              <span className="text-[10px] font-semibold uppercase tracking-wider text-[#6B6B6F]">History</span>
            </div>
            <div className="space-y-1">
              <div className="px-3 py-2 bg-[#141415] rounded-lg cursor-pointer">
                <div className="text-[13px] font-medium text-[#FFFFFF]">{script.title} v1</div>
                <div className="text-[11px] text-[#6B6B6F]">Current</div>
              </div>
            </div>
          </div>
        </aside>

        {/* Main Content */}
        <div className="flex-1 min-w-0">
          {/* Title + Top Actions */}
          <div className="flex flex-col md:flex-row md:items-start justify-between mb-6 gap-4">
            <div>
              <h1 className="text-[24px] md:text-[28px] font-bold text-[#FFFFFF]">{script.title}, {script.version}</h1>
              <div className="flex items-center gap-3 mt-2 flex-wrap">
                <span className="px-2.5 py-0.5 bg-[#141415] rounded-full text-[11px] font-medium text-[#9A9A9E] uppercase">{script.status}</span>
                <span className="text-[13px] text-[#9A9A9E]">Duration: {script.duration}</span>
                <span className="text-[13px] text-[#6B6B6F]">{script.version}</span>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <button onClick={handleSaveCurrentDraft} className="px-4 py-2 rounded-full border border-[#2A2A2C] text-[13px] text-[#9A9A9E] hover:border-[#FF843D] hover:text-[#FFFFFF] transition-all">Save Draft</button>
              <button onClick={() => alert('Revise Plan: This would open an AI revision dialog')} className="px-4 py-2 rounded-full border border-[#2A2A2C] text-[13px] text-[#9A9A9E] hover:border-[#FF843D] hover:text-[#FFFFFF] transition-all">Revise Plan</button>
              <button onClick={() => alert('Video generation queued')} className="px-5 py-2.5 rounded-full bg-[#FF843D] text-white text-[13px] font-medium hover:bg-[#FFA465] transition-all flex items-center gap-2">
                <Film size={14} /> Generate Video
              </button>
            </div>
          </div>

          {/* Story Structure + Emotion Curve */}
          <StoryStructureMap shots={script.shots} />
          <EmotionCurve shots={script.shots} />

          {/* View Toggle */}
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-1 bg-[#141415] rounded-full p-1">
              <button onClick={() => setViewMode('table')} className={`px-4 py-2 rounded-full text-[13px] font-medium transition-all ${viewMode === 'table' ? 'bg-[#141415] text-[#FFFFFF] shadow-sm' : 'text-[#9A9A9E]'}`}>
                <Table2 size={14} /> Table View
              </button>
              <button onClick={() => setViewMode('storyboard')} className={`px-4 py-2 rounded-full text-[13px] font-medium transition-all ${viewMode === 'storyboard' ? 'bg-[#141415] text-[#FFFFFF] shadow-sm' : 'text-[#9A9A9E]'}`}>
                <LayoutGrid size={14} /> Storyboard View
              </button>
            </div>
            {selectedShots.size > 0 && (
              <div className="flex items-center gap-2">
                <span className="text-[12px] text-[#9A9A9E]">{selectedShots.size} selected</span>
                <button onClick={handleBatchDelete} className="flex items-center gap-1 px-3 py-1.5 bg-[rgba(239,68,68,0.15)] text-[#EF4444] rounded-full text-[12px] hover:bg-red-100">
                  <Trash2 size={12} /> Delete
                </button>
              </div>
            )}
          </div>

          {/* ========== TABLE VIEW ========== */}
          {viewMode === 'table' && (
            <div className="bg-[#141415] rounded-xl shadow-[0_1px_3px_rgba(0,0,0,0.3)] overflow-hidden mb-6">
              <div className="grid grid-cols-[60px_70px_1fr_110px_100px_70px_1fr] gap-2 px-3 py-3 bg-[#141415] border-b border-[#2A2A2C]">
                {['Time', 'Preview', 'Visual', 'Purpose', 'Camera', 'Asset', 'Copy'].map(h => (
                  <span key={h} className="text-[10px] font-medium uppercase tracking-wider text-[#9A9A9E]">{h}</span>
                ))}
              </div>
              {script.shots.map((shot: any) => (
                <div
                  key={shot.id}
                  onClick={() => setEditingShot(shot)}
                  className="grid grid-cols-[60px_70px_1fr_110px_100px_70px_1fr] gap-2 px-3 py-2.5 border-b border-[#F5F5F5] hover:bg-[#0A0A0B] transition-colors items-center cursor-pointer"
                >
                  <span className="text-[12px] text-[#FFFFFF] font-medium">{shot.timeRange}</span>
                  <div className="w-14 h-10 rounded-lg overflow-hidden bg-[#2A2A2C]">
                    {shot.preview ? (
                      <img src={shot.preview} alt="" className="w-full h-full object-cover" />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center">
                        <Image size={14} className="text-[#3A3A3C]" />
                      </div>
                    )}
                  </div>
                  <span className="text-[12px] text-[#FFFFFF] line-clamp-2">{shot.visual}</span>
                  <span className="px-2 py-0.5 bg-[#141415] rounded text-[10px] font-medium text-[#9A9A9E] uppercase text-center">{shot.purpose}</span>
                  <span className="text-[11px] text-[#9A9A9E]">{shot.camera}</span>
                  <span className="px-2 py-0.5 bg-[#1E1E20] rounded text-[10px] font-medium text-[#FFFFFF] text-center">{shot.asset}</span>
                  <span className="text-[11px] text-[#9A9A9E] italic line-clamp-2">{shot.copy || '—'}</span>
                </div>
              ))}
            </div>
          )}

          {/* ========== STORYBOARD VIEW ========== */}
          {viewMode === 'storyboard' && (
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-6">
              {script.shots.map((shot: any, _idx: number) => (
                <DraggableShotCard key={shot.id} shot={shot} index={_idx} isSelected={selectedShots.has(shot.id)} onSelect={() => toggleSelect(shot.id)} />
              ))}
            </div>
          )}

          {/* Edit Modal */}
          {editingShot && (
            <div className="fixed inset-0 z-[100] flex items-center justify-center" onClick={() => setEditingShot(null)}>
              <div className="absolute inset-0 bg-[#FF843D]/40" />
              <div className="relative bg-[#141415] rounded-2xl shadow-[0_8px_40px_rgba(0,0,0,0.5)] max-w-[600px] w-full m-4 p-6" onClick={(e) => e.stopPropagation()}>
                <div className="flex items-center justify-between mb-4">
                  <span className="text-[14px] font-semibold">Edit Shot ({editingShot.timeRange})</span>
                  <button onClick={() => setEditingShot(null)} className="w-8 h-8 rounded-full hover:bg-[#141415] flex items-center justify-center"><X size={16} /></button>
                </div>
                <div className="space-y-3">
                  <div>
                    <label className="text-[11px] uppercase tracking-wider text-[#9A9A9E] block mb-1">Visual</label>
                    <textarea defaultValue={editingShot.visual} onBlur={(e) => updateShotInActive(editingShot.id, { visual: e.target.value })} className="w-full p-3 bg-[#141415] rounded-xl text-[13px] outline-none resize-none" rows={3} />
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="text-[11px] uppercase tracking-wider text-[#9A9A9E] block mb-1">Purpose</label>
                      <input defaultValue={editingShot.purpose} onBlur={(e) => updateShotInActive(editingShot.id, { purpose: e.target.value })} className="w-full p-3 bg-[#141415] rounded-xl text-[13px] outline-none" />
                    </div>
                    <div>
                      <label className="text-[11px] uppercase tracking-wider text-[#9A9A9E] block mb-1">Camera</label>
                      <input defaultValue={editingShot.camera} onBlur={(e) => updateShotInActive(editingShot.id, { camera: e.target.value })} className="w-full p-3 bg-[#141415] rounded-xl text-[13px] outline-none" />
                    </div>
                  </div>
                  <div>
                    <label className="text-[11px] uppercase tracking-wider text-[#9A9A9E] block mb-1">Copy / Dialogue</label>
                    <textarea defaultValue={editingShot.copy} onBlur={(e) => updateShotInActive(editingShot.id, { copy: e.target.value })} className="w-full p-3 bg-[#141415] rounded-xl text-[13px] outline-none resize-none" rows={2} />
                  </div>
                  <button onClick={() => setEditingShot(null)} className="w-full py-2.5 bg-[#FF843D] text-white rounded-full text-[13px]">Done Editing</button>
                </div>
              </div>
            </div>
          )}

          {/* Bottom Actions Bar */}
          <div className="flex items-center justify-between mt-2 pt-4 border-t border-[#2A2A2C]">
              <button onClick={() => setActiveNav('generate')} className="flex items-center gap-2 text-[13px] text-[#9A9A9E] hover:text-[#FFFFFF] transition-colors">
              <ArrowLeft size={14} /> Back to Questions
            </button>
            <div className="flex items-center gap-3">
              <button onClick={() => alert('Revise Plan: This would open an AI revision dialog')} className="px-4 py-2 rounded-full border border-[#2A2A2C] text-[13px] text-[#9A9A9E] hover:border-[#FF843D] hover:text-[#FFFFFF] transition-all">Revise Plan</button>
              <button onClick={handleSaveCurrentDraft} className="px-4 py-2 rounded-full border border-[#2A2A2C] text-[13px] text-[#9A9A9E] hover:border-[#FF843D] hover:text-[#FFFFFF] transition-all">Save Draft</button>
              <button onClick={() => { setVideoScriptId(null); startVideoGeneration(); setActiveNav('edit'); }} className="px-5 py-2.5 rounded-full bg-[#FF843D] text-white text-[13px] font-medium hover:bg-[#FFA465] transition-all flex items-center gap-2">
                <Film size={14} /> Generate Video
              </button>
            </div>
          </div>

          {/* AI Chat Input — Modify Script */}
          <ScriptEditorChat script={script} onUpdate={handleScriptUpdateFromChat} />

          {/* ══════ SCRIPT EDITOR AI PANEL ══════ */}
          <FakeAIScriptPanel isOpen={aiPanelOpen} onClose={() => setAiPanelOpen(false)} />

          {/* AI Panel Toggle */}
          {!aiPanelOpen && (
            <button
              onClick={() => setAiPanelOpen(true)}
              className="fixed right-4 bottom-20 md:bottom-24 z-50 w-10 h-10 rounded-full bg-[#FF843D] text-white flex items-center justify-center shadow-lg hover:bg-[#FFA465] transition-all"
              title="Script Editor AI"
            >
              <Sparkles size={18} />
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
