import { BACKROOMS_MOCK_STILLS, BACKROOMS_MOCK_VIDEO } from '@/lib/mockBackroomsAssets';

export type MockDemoScenarioId =
  | 'backrooms_vlog_fuzzy_no_asset'
  | 'dream_video_with_assets'
  | 'fragrance_ad_script_with_assets';

export type MockDemoScenario = {
  id: MockDemoScenarioId;
  label: string;
  homePrompt: string;
  videoAsset?: string;
  mockAssets: {
    id: string;
    name: string;
    role: string;
  }[];
  outputSpec: string;
  aiUnderstanding: {
    title: string;
    mainFeedback: string;
    detectedDirection: string[];
    detectedAssets?: string[];
    missingDetails: string[];
    recommendedFlow: string;
    cta: string;
  };
  questions: {
    id: string;
    stage: string;
    question: string;
    helper: string;
    type: 'single' | 'multi';
    recommended: string | string[];
    options: {
      value: string;
      label: string;
      description: string;
    }[];
  }[];
  answerFeedback: Record<string, string>;
  intentSummary: {
    title: string;
    mainCopy: string;
    confirmedDirection: string[];
    generationNotes: string[];
    cta: string;
  };
  scriptPlan: {
    title: string;
    projectSummary: string[];
    globalDirection: string;
    productionNotes: string[];
    rows: {
      time: string;
      scene: string;
      purpose: string;
      visualDirection: string;
      camera: string;
      previewImage?: string;
      assetSource?: string;
      audioOrVoice?: string;
      textOrCaption?: string;
    }[];
    intentMappingSummary: string[];
    validationNotes: string[];
  };
  generation: {
    generatingTitle: string;
    progressSteps: {
      progress: number;
      title: string;
      description: string;
    }[];
    resultTitle: string;
    resultInfo: string[];
    resultSummary: string[];
  };
};

export const mockDemoScenarios: MockDemoScenario[] = [
  {
    id: 'backrooms_vlog_fuzzy_no_asset',
    label: 'Backrooms POV Vlog',
    homePrompt:
      '我想做一个 15 秒左右的真人 vlog 第一视角视频，感觉像是误入后室空间，在空荡荡、重复、压抑的房间和走廊里探索。整体希望比较真实、紧张，但我现在只有一个模糊方向，没有素材，想先帮我把它梳理成能直接生成的视频方案。',
    videoAsset: BACKROOMS_MOCK_VIDEO,
    mockAssets: [],
    outputSpec: '16:9 landscape · around 15 seconds · realistic handheld tension vlog',
    aiUnderstanding: {
      title: 'AI Understanding · Backrooms First-Person Exploration',
      mainFeedback:
        'Your prompt already establishes a strong experiential core: a real-feeling first-person vlog trapped inside a Backrooms-like liminal environment. The concept is compelling because the realism, short duration, and tension all point toward an immersive widescreen suspense piece. What remains unclear is the exact threat level, the pacing of discovery, what environmental signals define the space, and whether the ending should reveal danger or preserve ambiguity. A full guided clarification flow is the best route before presenting a fixed script plan.',
      detectedDirection: [
        'Format direction: short 16:9 suspense clip with a cinematic widescreen frame',
        'Narrative perspective: handheld first-person POV / personal vlog recording logic',
        'Core tone: realistic, uneasy, tense, and grounded rather than stylized horror',
        'Story motion: enter → observe → notice anomaly → escalate → cut at tension peak',
      ],
      missingDetails: [
        'How dangerous the environment should feel: empty, implied threat, or active pursuit',
        'Whether the character speaks on camera, breathes silently, or reacts with whispered comments',
        'Which environmental clue should most strongly anchor the Backrooms identity',
        'How the final beat should land: abrupt cut, reveal, glitch, or unresolved turn',
      ],
      recommendedFlow: 'Full Guided Questions',
      cta: 'Answer the guided questions to lock a fixed suspense direction',
    },
    questions: [
      {
        id: 'backrooms-threat-level',
        stage: 'Guided Questions',
        question: 'How dangerous should the space feel to the viewer?',
        helper: 'This decides whether fear comes from atmosphere, implication, or direct danger.',
        type: 'single',
        recommended: 'implied_presence',
        options: [
          {
            value: 'empty_creepy',
            label: 'Creepy but empty',
            description: 'The fear comes from silence, repetition, and not knowing what is wrong.',
          },
          {
            value: 'implied_presence',
            label: 'Something may be nearby',
            description: 'The viewer senses a presence through sound, shadow, or movement without a full reveal.',
          },
          {
            value: 'active_threat',
            label: 'Immediate threat',
            description: 'The POV feels watched or chased and the escalation is more aggressive.',
          },
        ],
      },
      {
        id: 'backrooms-goal',
        stage: 'Guided Questions',
        question: 'What is the explorer trying to do inside the space?',
        helper: 'A clear objective makes the POV movement feel intentional instead of random wandering.',
        type: 'single',
        recommended: 'find_exit',
        options: [
          {
            value: 'find_exit',
            label: 'Find an exit',
            description: 'The camera movement is motivated by escape and survival.',
          },
          {
            value: 'document_space',
            label: 'Document the place',
            description: 'The character records like a nervous personal vlog or found footage journal.',
          },
          {
            value: 'follow_sound',
            label: 'Follow a strange cue',
            description: 'The viewer is pulled deeper by a sound, flicker, or movement ahead.',
          },
        ],
      },
      {
        id: 'backrooms-visual-anchor',
        stage: 'Guided Questions',
        question: 'Which detail should most strongly sell the Backrooms atmosphere?',
        helper: 'One strong visual anchor helps the entire short read instantly on mobile.',
        type: 'single',
        recommended: 'yellow_hallway',
        options: [
          {
            value: 'yellow_hallway',
            label: 'Yellow walls and endless hallways',
            description: 'Classic liminal office-like repetition with fluorescent unease.',
          },
          {
            value: 'damp_carpet',
            label: 'Damp carpet and stale air',
            description: 'The space feels physical, old, and uncomfortably real.',
          },
          {
            value: 'flicker_corners',
            label: 'Flickering corners and hidden depth',
            description: 'Lighting instability becomes the main tension device.',
          },
        ],
      },
      {
        id: 'backrooms-camera-rhythm',
        stage: 'Guided Questions',
        question: 'How should the camera move as tension rises?',
        helper: 'Camera rhythm defines whether the piece feels observational, nervous, or survival-driven.',
        type: 'single',
        recommended: 'careful_glance',
        options: [
          {
            value: 'careful_glance',
            label: 'Careful with frequent glances',
            description: 'The character inches forward and keeps checking behind or around corners.',
          },
          {
            value: 'steady_forward',
            label: 'Steady forward movement',
            description: 'The POV commits to moving deeper with subtle hesitation.',
          },
          {
            value: 'panic_break',
            label: 'Escalate into panic',
            description: 'The ending pushes into sharper movement and visible stress.',
          },
        ],
      },
      {
        id: 'backrooms-audio-focus',
        stage: 'Guided Questions',
        question: 'Which audio layer should carry the strongest emotion?',
        helper: 'Audio is crucial in a realistic POV short because it makes the space feel alive or threatening.',
        type: 'single',
        recommended: 'hum_footsteps',
        options: [
          {
            value: 'hum_footsteps',
            label: 'Hum + footsteps',
            description: 'The fluorescent buzz and footsteps build realism and dread.',
          },
          {
            value: 'breathing',
            label: 'Breathing and body sound',
            description: 'The viewer feels the character’s nervousness directly.',
          },
          {
            value: 'sting_end',
            label: 'Minimal ambience with sharp ending cue',
            description: 'Hold the tension quietly, then break it with one stronger final hit.',
          },
        ],
      },
      {
        id: 'backrooms-ending-shape',
        stage: 'Guided Questions',
        question: 'How should the final moment end?',
        helper: 'The ending decides whether the short feels mysterious, shocking, or replayable.',
        type: 'single',
        recommended: 'abrupt_cut',
        options: [
          {
            value: 'abrupt_cut',
            label: 'Abrupt cut at peak tension',
            description: 'The viewer never gets full closure and the unease lingers.',
          },
          {
            value: 'dark_turn',
            label: 'Turn into a darker corridor',
            description: 'The short ends right before entering something worse.',
          },
          {
            value: 'signal_glitch',
            label: 'Signal glitch or image break',
            description: 'The recording feels interrupted as if reality or the device failed.',
          },
        ],
      },
    ],
    answerFeedback: {
      'backrooms-threat-level': 'This helps lock whether fear is atmospheric or driven by implied presence.',
      'backrooms-goal': 'A clear objective gives the POV movement narrative purpose.',
      'backrooms-visual-anchor': 'A single recognizable liminal cue makes the world legible immediately.',
      'backrooms-camera-rhythm': 'Camera behavior now supports realism and escalation in a consistent way.',
      'backrooms-audio-focus': 'Audio focus clarifies how the viewer should feel inside the space.',
      'backrooms-ending-shape': 'The ending is now anchored as a memorable unresolved tension beat.',
    },
    intentSummary: {
      title: 'Intent Summary · Locked Backrooms POV Direction',
      mainCopy:
        'This prompt now resolves into a realistic 15-second first-person exploration short: the viewer enters a repetitive Backrooms environment, documents details that feel wrong, senses an implied nearby presence, and hits an unresolved final beat before full confirmation. The experience remains tense and believable, with realism and compact suspense prioritized over overt horror spectacle.',
      confirmedDirection: [
        '16:9 short-form POV vlog designed for cinematic spatial readability',
        'Realistic handheld exploration logic instead of abstract cinematic stylization',
        'Escalation structure: entry → observation → anomaly → tension spike → abrupt ending',
        'No explicit monster reveal required; uncertainty and pressure carry the effect',
      ],
      generationNotes: [
        'Keep the environment visually sparse so each clue lands clearly within 15 seconds.',
        'Avoid lore explanation and let the location remain unexplained but specific.',
        'Tie audio tension directly to camera hesitation for stronger immersion.',
        'Treat the ending as a cut-to-black suspense hook rather than a full narrative resolution.',
      ],
      cta: 'Continue to fixed Script Plan',
    },
    scriptPlan: {
      title: 'Generated Script Plan · Backrooms First-Person Vlog',
      projectSummary: [
        'Short suspense mock demo designed for original StoryVibe flow without real generation.',
        'No uploaded assets required; all visual logic comes from local scenario data.',
        'Built to feel like found-footage style social content with realistic tension.',
      ],
      globalDirection:
        'Use a compact escalating structure where the viewer quickly understands the liminal setting, senses growing danger through environmental clues, and gets cut off before receiving full narrative closure.',
      productionNotes: [
        'Lighting should feel fluorescent, practical, and slightly sickly rather than dramatic movie lighting.',
        'POV motion should stay handheld and human, with visible hesitation before the final turn.',
        'Sound design must carry realism: room hum, footsteps, breath, and one stronger final break.',
      ],
      rows: [
        {
          time: '0–3s',
          previewImage: BACKROOMS_MOCK_STILLS[0],
          scene: 'The camera turns on mid-walk. A hand briefly enters frame as the person adjusts the phone. Ahead is a yellow fluorescent hallway with repeating walls and stained carpet.',
          purpose: 'Establish that this is a real phone vlog and introduce the Backrooms-like space.',
          visualDirection: 'Yellow-beige fluorescent lighting, flat empty office walls, old carpet, slight digital noise.',
          camera: 'First-person phone camera, slightly tilted, slow walking movement.',
          audioOrVoice: 'Low fluorescent buzz, soft footsteps, faint breathing.',
          textOrCaption: '“Okay… I don’t think this is the same hallway.”',
        },
        {
          time: '3–6s',
          previewImage: BACKROOMS_MOCK_STILLS[1],
          scene: 'The person slowly pans left and right. Every direction looks nearly identical. A distant exit sign flickers once, then goes dark.',
          purpose: 'Create spatial confusion and show that the environment repeats unnaturally.',
          visualDirection: 'Repeating wall panels, long empty corridor, flickering sign in the distance.',
          camera: 'Slow handheld pan, small shake when the light flickers.',
          audioOrVoice: 'Buzzing light dips for half a second; footsteps stop.',
        },
        {
          time: '6–9s',
          previewImage: BACKROOMS_MOCK_STILLS[2],
          scene: 'The camera moves closer to a corner. On the wall, there is a fresh handprint-like mark that looks too recent. The person pauses.',
          purpose: 'Introduce one uncanny detail without showing a monster or direct threat.',
          visualDirection: 'Close wall texture, subtle shadow, handprint slightly darker than the wall.',
          camera: 'Slow push-in, hesitant framing, focus drifts briefly.',
          audioOrVoice: 'Breathing becomes more audible; distant low thud.',
          textOrCaption: '“Was that there before?”',
        },
        {
          time: '9–12s',
          previewImage: BACKROOMS_MOCK_STILLS[3],
          scene: 'The camera quickly turns back toward the hallway behind them. The hallway appears longer than before. A light at the far end clicks off.',
          purpose: 'Escalate tension and imply the space is changing.',
          visualDirection: 'Long vanishing hallway, fluorescent panels going dark one by one in the distance.',
          camera: 'Sudden handheld turn, slight motion blur, unstable framing.',
          audioOrVoice: 'Sharp fabric movement, faster breathing, one light click.',
        },
        {
          time: '12–15s',
          previewImage: BACKROOMS_MOCK_STILLS[4],
          scene: 'The person backs away. Just before the screen cuts, a faint sound comes from directly behind the camera. The person starts to say something, but the video glitches out.',
          purpose: 'End with a believable found-footage interruption and unresolved suspense.',
          visualDirection: 'Camera shake, overexposed fluorescent flicker, final compression glitch.',
          camera: 'Backward steps, quick half-turn, abrupt cut to black.',
          audioOrVoice: 'Whispered start of a sentence, audio crackle, hard cut.',
          textOrCaption: '“Wait—”',
        },
      ],
      intentMappingSummary: [
        'The originally fuzzy request is converted into a four-beat suspense structure with clear escalation.',
        '“Realistic” is interpreted through grounded camera behavior, practical light, and believable audio.',
        '“Backrooms” is represented through one strong liminal visual identity rather than overloading the frame.',
      ],
      validationNotes: [
        'The short reads clearly as a Backrooms POV demo without requiring lore explanation.',
        'It fits the mock workflow because it can be displayed as fixed content without real API output.',
        'The result remains tense and replayable even when all user answers map to one fixed script plan.',
      ],
    },
    generation: {
      generatingTitle: 'Mock Video Generating · Backrooms Tension Build',
      progressSteps: [
        {
          progress: 15,
          title: 'Reading guided answers',
          description: 'Converting the selected focus, mood, story, camera, and expression into a first-person video structure.',
        },
        {
          progress: 35,
          title: 'Building environment prompt',
          description: 'Creating a Backrooms-inspired yellow fluorescent office maze with repeating walls and empty corridors.',
        },
        {
          progress: 58,
          title: 'Creating segment prompts',
          description: 'Splitting the 15-second video into five suspense beats.',
        },
        {
          progress: 76,
          title: 'Adding handheld motion',
          description: 'Applying first-person phone-camera movement, slight shake, auto exposure shifts, and found-footage texture.',
        },
        {
          progress: 100,
          title: 'Finalizing mock preview',
          description: 'Preparing the simulated video result and generation summary.',
        },
      ],
      resultTitle: 'Mock Video Result · Backrooms POV Exploration',
      resultInfo: [
        'Format: 16:9 landscape suspense clip',
        'Length: 15 seconds',
        'Style: realistic handheld suspense / liminal horror vlog',
      ],
      resultSummary: [
        'The final mock output feels like a believable first-person exploration recording rather than a polished cinematic trailer.',
        'Tension comes from environment, hesitation, and implication instead of explicit monster imagery.',
        'The unresolved ending creates replay value and keeps the Backrooms mystery intact.',
      ],
    },
  },
  {
    id: 'dream_video_with_assets',
    label: 'Dream Video With Three Assets',
    homePrompt:
      '我想做一个描绘梦境的视频，大概 15 秒，整体感觉安静、模糊、像人在梦里慢慢走过一个记忆中的空间。我上传了三张图：Image 1 可以作为主体人物参考，Image 2 可以作为梦里的空间和场景参考，Image 3 可以作为情绪、光影和色彩参考。希望视频不要太叙事化，更像一段情绪流动的梦。',
    mockAssets: [
      { id: 'dream-image-1', name: 'Image 1 · Main Character Reference', role: 'main subject / character reference' },
      { id: 'dream-image-2', name: 'Image 2 · Dream Space Reference', role: 'environment / spatial reference' },
      { id: 'dream-image-3', name: 'Image 3 · Mood / Lighting Reference', role: 'mood / lighting / color reference' },
    ],
    outputSpec: '9:16 vertical · around 15 seconds · dreamlike atmospheric short video',
    aiUnderstanding: {
      title: 'Initial Creative Understanding',
      mainFeedback:
        'You want to generate a 15-second dreamlike video that feels quiet, soft, and emotionally immersive rather than plot-driven. The piece should follow a main figure moving slowly through a memory-like interior space, with an emphasis on blurred perception, suspended time, and gentle emotional transitions. The visual identity should draw from three references: Image 1 for the main subject, Image 2 for the dream environment, and Image 3 for the color, lighting, and emotional atmosphere.',
      detectedDirection: [
        'Creative Intent · Dream fragment · emotional flow · minimal narrative',
        'Visual Focus · Soft motion · hazy memory-space · atmospheric light',
        'Asset Logic · Image 1 guides the subject, Image 2 shapes the space, Image 3 defines mood and light',
        'Output Goal · A short poetic video that feels like drifting through a remembered dream',
      ],
      detectedAssets: [
        'Image 1 · Main Character Reference',
        'Image 2 · Dream Space Reference',
        'Image 3 · Mood / Lighting Reference',
      ],
      missingDetails: [
        'Keep the piece minimally narrative and focused on emotional flow rather than plot beats',
        'Maintain a quiet, intimate, slightly melancholic tone throughout the short',
        'Let the environment feel remembered rather than literally observed',
        'Preserve softness, low contrast, and diffused dream lighting across all five shots',
      ],
      recommendedFlow: 'Dream Flow Confirmation',
      cta: 'Confirm the dream tone and pacing before generating the fixed plan',
    },
    questions: [
      {
        id: 'dream-emotional-tone',
        stage: 'Guided Questions',
        question: 'What kind of emotional tone should the video leave behind?',
        helper: 'Suggested answer: A quiet, intimate feeling - calm but slightly melancholic, as if the viewer has just passed through a fading memory.',
        type: 'single',
        recommended: 'melancholic_soft',
        options: [
          {
            value: 'calm_intimate',
            label: 'Calm and intimate',
            description: 'A quiet emotional tone that stays close to the viewer without becoming dramatic.',
          },
          {
            value: 'melancholic_soft',
            label: 'Melancholic and soft',
            description: 'Slight sadness and tenderness linger beneath the calm dream surface.',
          },
          {
            value: 'mysterious_gentle',
            label: 'Mysterious but gentle',
            description: 'The dream feels slightly unreal without turning ominous or tense.',
          },
          {
            value: 'warm_nostalgic',
            label: 'Warm and nostalgic',
            description: 'The emotional trace feels fond, intimate, and softly remembered.',
          },
        ],
      },
      {
        id: 'dream-subject-motion',
        stage: 'Guided Questions',
        question: 'How should the main subject move through the scene?',
        helper: 'Suggested answer: Slowly and naturally, with soft walking or drifting movement, as if they are floating through the space without urgency.',
        type: 'single',
        recommended: 'floating_drift',
        options: [
          {
            value: 'slow_walking',
            label: 'Slow walking',
            description: 'The figure moves gently and continuously, like walking through a remembered space.',
          },
          {
            value: 'floating_drift',
            label: 'Floating drift',
            description: 'The subject feels almost weightless, with motion that softly glides forward.',
          },
          {
            value: 'almost_still',
            label: 'Almost still',
            description: 'Movement is minimal, making presence and atmosphere feel suspended in time.',
          },
          {
            value: 'turn_pause',
            label: 'Gentle turn and pause',
            description: 'Motion stays delicate and reflective, with small pauses that let the dream breathe.',
          },
        ],
      },
      {
        id: 'dream-environment',
        stage: 'Guided Questions',
        question: 'What kind of environment does this dream take place in?',
        helper: 'Suggested answer: A memory-like interior space inspired by Image 2 - soft, slightly unreal, quiet, and spacious, as if reconstructed from memory rather than observed directly.',
        type: 'single',
        recommended: 'memory_like_interior',
        options: [
          {
            value: 'memory_like_interior',
            label: 'Memory-like interior',
            description: 'A remembered interior that feels reconstructed from feeling rather than literal detail.',
          },
          {
            value: 'empty_hallway',
            label: 'Empty hallway',
            description: 'A sparse passage space that feels still, distant, and dream-soft.',
          },
          {
            value: 'soft_domestic_space',
            label: 'Soft domestic space',
            description: 'A calm room or home-like interior with emotional familiarity and softness.',
          },
          {
            value: 'abstract_dream_room',
            label: 'Abstract dream room',
            description: 'A more symbolic space where architecture feels emotional more than practical.',
          },
        ],
      },
      {
        id: 'dream-visual-clarity',
        stage: 'Guided Questions',
        question: 'How clear or abstract should the visuals feel?',
        helper: 'Suggested answer: Somewhere between recognizable and blurred. The viewer should understand there is a person and a space, but the imagery should feel softened, dreamy, and slightly indistinct.',
        type: 'single',
        recommended: 'soft_recognizable',
        options: [
          {
            value: 'soft_recognizable',
            label: 'Soft but recognizable',
            description: 'The figure and space remain readable while staying softened and dreamlike.',
          },
          {
            value: 'mostly_blurred',
            label: 'Mostly blurred',
            description: 'Forms and motion stay legible, but much of the frame feels diffused and softened.',
          },
          {
            value: 'abstract_atmospheric',
            label: 'Abstract and atmospheric',
            description: 'The piece leans further into emotion and visual drift than clear representation.',
          },
          {
            value: 'clear_subject_blurry_space',
            label: 'Clear subject, blurry space',
            description: 'The figure stays more readable while the environment remains hazy and memory-like.',
          },
        ],
      },
      {
        id: 'dream-structure',
        stage: 'Guided Questions',
        question: 'Should the video build toward a specific event or remain atmospheric?',
        helper: 'Suggested answer: It should remain atmospheric. The piece should feel like a continuous emotional drift rather than a sequence building to a dramatic event.',
        type: 'single',
        recommended: 'remain_atmospheric',
        options: [
          {
            value: 'remain_atmospheric',
            label: 'Remain atmospheric',
            description: 'The short stays focused on feeling, softness, and continuity instead of a dramatic turn.',
          },
          {
            value: 'slight_emotional_build',
            label: 'Slight emotional build',
            description: 'The feeling deepens across the shots, but without becoming overtly plot-driven.',
          },
          {
            value: 'quiet_unresolved_ending',
            label: 'Quiet unresolved ending',
            description: 'The short closes on a fading emotional trace instead of a clear conclusion.',
          },
          {
            value: 'dreamlike_loop',
            label: 'Dreamlike loop',
            description: 'The structure feels cyclical, as if the dream could continue beyond the last frame.',
          },
        ],
      },
      {
        id: 'dream-light-color',
        stage: 'Guided Questions',
        question: 'What should guide the style of light and color?',
        helper: 'Suggested answer: Image 3 should guide the light and color direction: soft glow, muted transitions, diffused highlights, and a gentle dreamlike palette.',
        type: 'single',
        recommended: 'soft_glow',
        options: [
          {
            value: 'soft_glow',
            label: 'Soft glow',
            description: 'Light blooms gently around surfaces and keeps the dream visually tender.',
          },
          {
            value: 'muted_dream_palette',
            label: 'Muted dream palette',
            description: 'Colors stay quiet, atmospheric, and emotionally blended rather than highly saturated.',
          },
          {
            value: 'diffused_highlights',
            label: 'Diffused highlights',
            description: 'Bright areas feel softened and suspended, as if wrapped in haze.',
          },
          {
            value: 'low_contrast_atmosphere',
            label: 'Low contrast atmosphere',
            description: 'The whole image remains soft and merged, avoiding hard visual separation.',
          },
        ],
      },
    ],
    answerFeedback: {
      'dream-emotional-tone': 'Great - I’ll keep the piece quiet, atmospheric, and minimally narrative. The structure will follow a slow emotional drift through a remembered space, using Image 1 for the subject, Image 2 for the environment, and Image 3 for mood, lighting, and color.',
      'dream-subject-motion': 'Great - I’ll keep the piece quiet, atmospheric, and minimally narrative. The structure will follow a slow emotional drift through a remembered space, using Image 1 for the subject, Image 2 for the environment, and Image 3 for mood, lighting, and color.',
      'dream-environment': 'Great - I’ll keep the piece quiet, atmospheric, and minimally narrative. The structure will follow a slow emotional drift through a remembered space, using Image 1 for the subject, Image 2 for the environment, and Image 3 for mood, lighting, and color.',
      'dream-visual-clarity': 'Great - I’ll keep the piece quiet, atmospheric, and minimally narrative. The structure will follow a slow emotional drift through a remembered space, using Image 1 for the subject, Image 2 for the environment, and Image 3 for mood, lighting, and color.',
      'dream-structure': 'Great - I’ll keep the piece quiet, atmospheric, and minimally narrative. The structure will follow a slow emotional drift through a remembered space, using Image 1 for the subject, Image 2 for the environment, and Image 3 for mood, lighting, and color.',
      'dream-light-color': 'Great - I’ll keep the piece quiet, atmospheric, and minimally narrative. The structure will follow a slow emotional drift through a remembered space, using Image 1 for the subject, Image 2 for the environment, and Image 3 for mood, lighting, and color.',
    },
    intentSummary: {
      title: 'Intent Summary · Locked Dream Video Direction',
      mainCopy:
        'A 15-second dreamlike atmospheric video where a main figure slowly moves through a soft memory-space. The final script should prioritize emotional flow, blurred perception, and quiet mood over a clear plot.',
      confirmedDirection: [
        'The piece should feel calm, intimate, and only slightly melancholic.',
        'Image 1 guides the subject, Image 2 defines the remembered interior, and Image 3 shapes mood and light.',
        'The pacing remains slow and fluid, moving through emotional drift rather than plot escalation.',
        'The ending should feel unresolved and fading, like a dream fragment slipping away.',
      ],
      generationNotes: [
        'Keep the structure image-led and avoid overt narrative exposition.',
        'Use softness, blur, and low-contrast motion to maintain dream continuity.',
        'Let pauses and stillness carry emotion as much as movement.',
        'Preserve the sense of a remembered place rather than a literal set or story world.',
      ],
      cta: 'Continue to fixed Script Plan',
    },
    scriptPlan: {
      title: 'Dreamwalk Through a Memory Space',
      projectSummary: [
        'Dreamlike 15-second mock demo built around three uploaded references for subject, space, and atmosphere.',
        'The piece stays poetic and minimally narrative, prioritizing emotional drift over plot clarity.',
        'The output remains mock-only and uses fixed local scenario content without real generation.',
      ],
      globalDirection:
        'Use a soft, dreamlike visual language built around diffused edges, gentle blur, floating camera movement, and a memory-space environment. The main figure should feel present but never sharply defined, as if seen through the softness of recollection.',
      productionNotes: [
        'Create a quiet, immersive emotional state that feels calm, intimate, and slightly melancholic - like moving through a dream you almost remember after waking.',
        '5 gentle beats moving from arrival, drift, pause, and emotional deepening toward a soft unresolved fade. The pacing should remain slow and fluid throughout.',
        'Image 1 guides the main subject, Image 2 shapes the dream environment, and Image 3 defines the mood, lighting, and color atmosphere.',
      ],
      rows: [
        {
          time: '0–3s',
          scene: 'A quiet opening shot of the dream space. The main figure appears softly within the frame, moving slowly as if entering a remembered interior. Edges remain diffused and the space feels calm, distant, and emotionally suspended.',
          purpose: 'SET THE TONE',
          visualDirection: 'Soft haze, muted spatial depth, gentle blur, low-contrast dream textures.',
          camera: 'Slow floating push-in with minimal handheld movement, almost weightless.',
          assetSource: 'Image 1 · Main Character Reference; Image 2 · Dream Space Reference; Image 3 · Mood / Lighting Reference',
          textOrCaption: 'It feels like stepping into a place I almost remember.',
          audioOrVoice: 'Soft room tone, distant air, nearly inaudible fabric movement.',
        },
        {
          time: '3–6s',
          scene: 'The subject continues moving through the space at a slow, dreamlike pace. The room begins to feel less physical and more emotional, as if memory and architecture are blending together.',
          purpose: 'BUILD ATMOSPHERE',
          visualDirection: 'Subtle motion blur, soft perspective drift, diffused highlights, dreamlike interior depth.',
          camera: 'Slow lateral drift or gentle forward movement, smooth and unhurried.',
          assetSource: 'Image 1 · Main Character Reference; Image 2 · Dream Space Reference',
          textOrCaption: 'Nothing here feels unfamiliar, but nothing feels fully real.',
          audioOrVoice: 'Soft footsteps, faint room hum, air-like reverb.',
        },
        {
          time: '6–9s',
          scene: 'The motion softens into a near pause. The focus shifts toward light, shadow, texture, and the emotional stillness of the environment. The subject remains present but not sharply defined.',
          purpose: 'HOLD THE DREAM',
          visualDirection: 'Lingering frame, diffused glow, suspended stillness, softened contours.',
          camera: 'Near-static frame with a very subtle floating sway.',
          assetSource: 'Image 2 · Dream Space Reference; Image 3 · Mood / Lighting Reference',
          textOrCaption: 'For a moment, the dream stops moving and simply breathes.',
          audioOrVoice: 'Low ambient hush, softened silence, barely perceptible resonance.',
        },
        {
          time: '9–12s',
          scene: 'The emotional tone deepens. Light and space become more fluid, as if the memory is beginning to dissolve and reform at the same time. The subject continues drifting through the scene with quiet intimacy.',
          purpose: 'DEEPEN FEELING',
          visualDirection: 'Soft luminous bloom, emotional color shift, dream density increasing.',
          camera: 'Slow inward drift with gentle reframing, still smooth and calm.',
          assetSource: 'Image 1 · Main Character Reference; Image 3 · Mood / Lighting Reference',
          textOrCaption: 'The space grows softer, as if it is remembering itself while I pass through it.',
          audioOrVoice: 'Airy tonal layer, soft resonance, subtle emotional swell.',
        },
        {
          time: '12–15s',
          scene: 'The image begins to fade or dissolve gently. The subject and space lose definition, leaving behind only a quiet emotional impression, as if the dream is slipping away before it can fully resolve.',
          purpose: 'LEAVE AN AFTERGLOW',
          visualDirection: 'Soft fade, lowered contrast, dissolving edges, lingering afterimage.',
          camera: 'Minimal motion, soft hold, fading into stillness.',
          assetSource: 'Image 3 · Mood / Lighting Reference',
          textOrCaption: 'And then it begins to disappear, before I can understand where I was.',
          audioOrVoice: 'Gentle fade-out of room tone and breath-like ambience.',
        },
      ],
      intentMappingSummary: [
        'The dream request is converted into five gentle beats built around arrival, drift, suspension, deepening, and fade.',
        'Image 1, Image 2, and Image 3 stay clearly mapped to subject, environment, and mood roles across the whole short.',
        'The piece remains emotional and atmospheric, avoiding product logic, horror escalation, or overt plot explanation.',
      ],
      validationNotes: [
        'This output belongs only to the dream scenario and should not overwrite Backrooms or fragrance content.',
        'The fixed rows, summary cards, and rhythm panel all stay aligned to the same dream-space concept.',
        'The ending remains unresolved to preserve the feeling of a drifting dream fragment rather than a finished story.',
      ],
    },
    generation: {
      generatingTitle: 'Generating Video',
      progressSteps: [
        {
          progress: 15,
          title: 'Analyzing subject, space, and mood references...',
          description: 'Reading Image 1, Image 2, and Image 3 as subject, environment, and dream atmosphere inputs.',
        },
        {
          progress: 35,
          title: 'Mapping emotional pacing across 5 shots...',
          description: 'Turning the dream concept into five gentle beats with slow emotional progression.',
        },
        {
          progress: 58,
          title: 'Building a soft atmospheric visual draft...',
          description: 'Applying haze, blur, low-contrast depth, and memory-space texture to the sequence.',
        },
        {
          progress: 76,
          title: 'Aligning dreamlike motion and soft camera rhythm...',
          description: 'Matching floating push-ins, gentle drifts, and near-still holds to the intended dream cadence.',
        },
        {
          progress: 100,
          title: 'Finalizing preview render...',
          description: 'Preparing the completed mock preview and summary without any real video generation API.',
        },
      ],
      resultTitle: 'Video Generated',
      resultInfo: [
        'Format: 9:16 vertical short video',
        'Length: around 15 seconds',
        'Style: dreamlike / soft-focus / atmospheric memory flow',
      ],
      resultSummary: [
        'The mock video draft captures a quiet, dreamlike passage through a remembered space, prioritizing emotional continuity over clear narrative progression.',
        'The main figure remains softly integrated into the environment, allowing the references for subject, space, and mood to merge into a single atmospheric experience.',
        'The ending preserves an unresolved, fading quality, helping the piece feel like a dream fragment rather than a complete story.',
      ],
    },
  },
  {
    id: 'fragrance_ad_script_with_assets',
    label: 'Fragrance Ad With Detailed Brief',
    homePrompt:
      '请根据产品图、品牌 logo、辅助情绪图和生活方式参考图，做一个 15 秒香水氛围广告。希望它像品牌短片，整体很精致、克制、有空气感。镜头要有明确节奏：先产品氛围建立，再人物或空间触感，再回到产品 hero shot 和 logo 收尾。这个视频未来会用于品牌投放，所以请按较完整 brief / 脚本思路理解。',
    mockAssets: [
      { id: 'fragrance-image-1', name: 'Image 1 · Product Reference', role: '香水瓶产品参考 / perfume bottle product reference' },
      { id: 'fragrance-image-2', name: 'Image 2 · Urban Night Scene', role: '城市夜晚街景与光线参考 / urban night scene and lighting reference' },
      { id: 'fragrance-image-3', name: 'Image 3 · Talent Mood Reference', role: '人物气质与镜头情绪参考 / talent mood and human presence reference' },
      { id: 'fragrance-image-4', name: 'Image 4 · Brand Logo', role: '结尾品牌 logo 露出 / final brand logo reference' },
    ],
    outputSpec: '15-second fragrance brand film · premium ad tone · multi-asset campaign short',
    aiUnderstanding: {
      title: 'AI Understanding · Fragrance Brand Film Brief',
      mainFeedback:
        'This prompt is clearly not a vague concept or dream montage. It already reads like a production-ready brand brief: there is a product, logo, supporting asset structure, target duration, desired emotional register, shot logic, and usage context for brand delivery. The strongest interpretation is a premium 15-second fragrance film where product presence, mood, and brand recognition are all carefully balanced. What still needs confirmation is how strongly the bottle should dominate, how much human/context material should appear, how explicit the ad language should be, and what final logo / end-card tone best fits the campaign feel.',
      detectedDirection: [
        'Category direction: fragrance / beauty / premium product advertising',
        'Creative format: short brand film with defined shot rhythm and end-card logic',
        'Asset structure: Image 1 product, Image 2 urban night scene, Image 3 talent mood, and Image 4 brand logo',
        'Commercial intent: polished, campaign-ready, and suitable for brand placement or paid distribution',
      ],
      detectedAssets: ['Image 1 · Product Reference', 'Image 2 · Urban Night Scene', 'Image 3 · Talent Mood Reference', 'Image 4 · Brand Logo'],
      missingDetails: [
        'How dominant the hero bottle should be relative to atmosphere and context shots',
        'Whether the human / lifestyle layer should feel narrative, sensual, or purely suggestive',
        'How strong the branding should land in the final seconds',
        'Whether the ad should prioritize elegance, memorability, or conversion clarity',
      ],
      recommendedFlow: 'Quick Confirmation',
      cta: 'Confirm the commercial priorities before locking the fixed ad plan',
    },
    questions: [
      {
        id: 'fragrance-hero-priority',
        stage: 'Quick Confirmation',
        question: 'What should lead the audience impression most strongly?',
        helper: 'This decides whether the film feels product-first, mood-first, or brand-world-first.',
        type: 'single',
        recommended: 'product_presence',
        options: [
          {
            value: 'product_presence',
            label: 'Hero product presence',
            description: 'The bottle and its design remain the clearest anchor from beginning to end.',
          },
          {
            value: 'sensory_mood',
            label: 'Sensory atmosphere',
            description: 'The emotional and material mood leads, while the product feels discovered within it.',
          },
          {
            value: 'brand_world',
            label: 'Brand world and image',
            description: 'The film sells a branded universe as much as the product itself.',
          },
        ],
      },
      {
        id: 'fragrance-context-balance',
        stage: 'Quick Confirmation',
        question: 'How much human or lifestyle context should appear?',
        helper: 'This shapes whether the ad feels abstract luxury, tactile intimacy, or campaign storytelling.',
        type: 'single',
        recommended: 'suggestive_context',
        options: [
          {
            value: 'minimal_context',
            label: 'Minimal context',
            description: 'Keep the film mostly product and texture-driven with only subtle human implication.',
          },
          {
            value: 'suggestive_context',
            label: 'Suggestive lifestyle context',
            description: 'Include glimpses of a world or body presence without turning it into a full narrative.',
          },
          {
            value: 'strong_context',
            label: 'Stronger contextual storytelling',
            description: 'The environment and human layer help sell a richer campaign lifestyle image.',
          },
        ],
      },
      {
        id: 'fragrance-ending-tone',
        stage: 'Quick Confirmation',
        question: 'How should the final brand moment land?',
        helper: 'The closing seconds determine whether the ad feels elegant, iconic, or performance-ready.',
        type: 'single',
        recommended: 'elegant_linger',
        options: [
          {
            value: 'elegant_linger',
            label: 'Elegant and lingering',
            description: 'The end card is refined, premium, and emotionally resonant.',
          },
          {
            value: 'iconic_stamp',
            label: 'Sharp iconic stamp',
            description: 'The logo and bottle hit with stronger memorability and shape recognition.',
          },
          {
            value: 'campaign_clear',
            label: 'Campaign clarity',
            description: 'The final seconds communicate brand and product directly for ad readiness.',
          },
        ],
      },
    ],
    answerFeedback: {
      'fragrance-hero-priority': 'This clarifies whether the ad is driven by packshot authority, sensory mood, or branded image world.',
      'fragrance-context-balance': 'The ratio between product and contextual imagery is now easier to control consistently.',
      'fragrance-ending-tone': 'The closing logo / bottle behavior now supports a specific campaign-style ending.',
    },
    intentSummary: {
      title: 'Intent Summary · Locked Fragrance Ad Direction',
      mainCopy:
        'This prompt resolves into a premium 15-second fragrance brand film built around controlled product presence, tactile atmosphere, and a refined commercial ending. The ad is not treated as a loose mood piece: it uses the product bottle, logo, texture imagery, and lifestyle support in a clearly sequenced way. The resulting fixed direction is elegant and campaign-ready, balancing sensory mood with recognizability so the film feels like a polished brand short rather than a generic beauty montage.',
      confirmedDirection: [
        'The video is interpreted as a brand film brief, not a general creative exploration.',
        'Product, logo, mood texture, and lifestyle references all receive stable functional roles.',
        'Shot rhythm is clear: atmosphere → sensory context → hero product → branded finish.',
        'The final result is premium, restrained, and suitable for brand-facing presentation.',
      ],
      generationNotes: [
        'Keep the product silhouette and material quality readable even when mood imagery dominates.',
        'Use the lifestyle layer only to enrich desire and atmosphere, not to overpower the bottle.',
        'The end-card should feel deliberate and polished, with logo integration that matches the premium tone.',
        'Maintain clean commercial pacing so the 15-second structure feels intentional and ad-ready.',
      ],
      cta: 'Continue to fixed Script Plan',
    },
    scriptPlan: {
      title: 'Generated Script Plan · 15s Fragrance Brand Film',
      projectSummary: [
        'Premium short-form fragrance ad using product, logo, mood, and lifestyle assets.',
        'Commercially structured to read as a polished brand film rather than an experimental mood piece.',
        'Designed to work as a fixed mock output without real API generation or dynamic branching.',
      ],
      globalDirection:
        'Create a highly controlled 15-second ad arc where atmosphere draws the viewer in, tactile context suggests the product’s emotional world, the bottle lands as the visual hero, and the logo closes with elegant brand authority.',
      productionNotes: [
        'Prioritize premium restraint: no cluttered motion, no noisy transitions, and no overexplained copy.',
        'Texture and lighting should reinforce luxury materiality: glass, reflection, mist, skin, fabric, or air.',
        'The bottle and logo should remain distinct and readable for brand usage.',
      ],
      rows: [
        {
          time: '0–3s',
          scene: 'Extreme close-up of the perfume bottle surface. Small water droplets catch cool city light on the glass.',
          purpose: 'Establish product texture and premium mood.',
          visualDirection: 'Macro glass detail, cool highlights, dark background, subtle reflections.',
          camera: 'Slow macro push-in.',
          assetSource: 'Image 1 as product reference, Image 2 for cool night light.',
        },
        {
          time: '3–6s',
          scene: 'Cut to a person passing a night storefront. Reflected light moves across their face and shoulder.',
          purpose: 'Introduce human presence and urban atmosphere.',
          visualDirection: 'Cool-toned street reflection, soft shadows, elegant movement.',
          camera: 'Slow side tracking shot.',
          assetSource: 'Image 2 as urban night scene reference, Image 3 as talent mood reference.',
        },
        {
          time: '6–9s',
          scene: 'Slow-motion mist sprays across frame. The light catches the vapor, creating a soft luminous layer.',
          purpose: 'Connect fragrance with sensation and atmosphere.',
          visualDirection: 'Fine mist, soft bloom, floating particles, dark blue-gray palette.',
          camera: 'Locked close-up with shallow depth.',
          assetSource: 'Image 1 product reference, Image 3 mood reference.',
          textOrCaption: '“A trace that stays after the night moves on.”',
        },
        {
          time: '9–12s',
          scene: 'The perfume bottle appears near glass. City reflections ripple across the bottle and surface.',
          purpose: 'Bring the focus back to the product.',
          visualDirection: 'Product silhouette, reflective glass, subtle motion, premium contrast.',
          camera: 'Slow orbit or slight parallax movement.',
          assetSource: 'Image 1 product reference, Image 2 urban night lighting reference.',
        },
        {
          time: '12–15s',
          scene: 'Final product hero shot. The logo fades in subtly over the image as the mist settles.',
          purpose: 'Complete the brand reveal elegantly.',
          visualDirection: 'Clean product frame, soft mist, restrained logo placement, cool light.',
          camera: 'Static hero frame with minimal motion.',
          assetSource: 'Image 1 product reference, Image 4 brand logo.',
          textOrCaption: 'Brand tagline optional.',
        },
      ],
      intentMappingSummary: [
        'The prompt’s brief-like structure is preserved through a clear commercial shot sequence.',
        'Each asset is given a distinct strategic role instead of being treated as generic reference material.',
        'The video remains premium and restrained, avoiding both over-stylized fantasy and generic product montage behavior.',
      ],
      validationNotes: [
        'The output clearly belongs to the fragrance ad scenario because it is product-led, branded, and commercially structured.',
        'The 15-second rhythm supports brand usage and short-form placement expectations.',
        'The fixed mock result is presentation-ready without relying on any live AI or generation backend.',
      ],
    },
    generation: {
      generatingTitle: 'Mock Video Generating · Fragrance Brand Film Build',
      progressSteps: [
        {
          progress: 15,
          title: 'Reading detailed brief',
          description: 'Converting the user’s script-like prompt and asset roles into a production plan.',
        },
        {
          progress: 35,
          title: 'Mapping product references',
          description: 'Using Image 1 for product shape, glass texture, and macro detail.',
        },
        {
          progress: 55,
          title: 'Building atmosphere',
          description: 'Applying cool urban night lighting from Image 2 and talent mood from Image 3.',
        },
        {
          progress: 75,
          title: 'Creating brand ending',
          description: 'Preparing the final hero product shot with subtle logo fade-in from Image 4.',
        },
        {
          progress: 100,
          title: 'Finalizing mock preview',
          description: 'Preparing the simulated fragrance film result and generation summary.',
        },
      ],
      resultTitle: 'Mock Video Result · Premium Fragrance Ad',
      resultInfo: [
        'Format: 15-second fragrance brand film',
        'Assets used: product, logo, mood texture, and lifestyle support',
        'Style: premium, restrained, campaign-ready luxury advertising',
      ],
      resultSummary: [
        'The final mock result reads as a polished fragrance ad rather than a generic aesthetic video.',
        'Product and brand recognition remain clear while atmosphere and tactility preserve desirability.',
        'The ending lands with enough elegance and clarity to feel suitable for brand presentation or paid placement.',
      ],
    },
  },
];

export function getMockDemoScenarioById(id: MockDemoScenarioId): MockDemoScenario {
  const scenario = mockDemoScenarios.find((item) => item.id === id);

  if (!scenario) {
    throw new Error(`Mock demo scenario not found: ${id}`);
  }

  return scenario;
}
