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
    videoAsset: '/mock/backrooms/demo video.mp4',
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
          previewImage: '/mock/backrooms/分镜 01.png',
          scene: 'The camera turns on mid-walk. A hand briefly enters frame as the person adjusts the phone. Ahead is a yellow fluorescent hallway with repeating walls and stained carpet.',
          purpose: 'Establish that this is a real phone vlog and introduce the Backrooms-like space.',
          visualDirection: 'Yellow-beige fluorescent lighting, flat empty office walls, old carpet, slight digital noise.',
          camera: 'First-person phone camera, slightly tilted, slow walking movement.',
          audioOrVoice: 'Low fluorescent buzz, soft footsteps, faint breathing.',
          textOrCaption: '“Okay… I don’t think this is the same hallway.”',
        },
        {
          time: '3–6s',
          previewImage: '/mock/backrooms/分镜 02.png',
          scene: 'The person slowly pans left and right. Every direction looks nearly identical. A distant exit sign flickers once, then goes dark.',
          purpose: 'Create spatial confusion and show that the environment repeats unnaturally.',
          visualDirection: 'Repeating wall panels, long empty corridor, flickering sign in the distance.',
          camera: 'Slow handheld pan, small shake when the light flickers.',
          audioOrVoice: 'Buzzing light dips for half a second; footsteps stop.',
        },
        {
          time: '6–9s',
          previewImage: '/mock/backrooms/分镜 03.png',
          scene: 'The camera moves closer to a corner. On the wall, there is a fresh handprint-like mark that looks too recent. The person pauses.',
          purpose: 'Introduce one uncanny detail without showing a monster or direct threat.',
          visualDirection: 'Close wall texture, subtle shadow, handprint slightly darker than the wall.',
          camera: 'Slow push-in, hesitant framing, focus drifts briefly.',
          audioOrVoice: 'Breathing becomes more audible; distant low thud.',
          textOrCaption: '“Was that there before?”',
        },
        {
          time: '9–12s',
          previewImage: '/mock/backrooms/分镜 04.png',
          scene: 'The camera quickly turns back toward the hallway behind them. The hallway appears longer than before. A light at the far end clicks off.',
          purpose: 'Escalate tension and imply the space is changing.',
          visualDirection: 'Long vanishing hallway, fluorescent panels going dark one by one in the distance.',
          camera: 'Sudden handheld turn, slight motion blur, unstable framing.',
          audioOrVoice: 'Sharp fabric movement, faster breathing, one light click.',
        },
        {
          time: '12–15s',
          previewImage: '/mock/backrooms/分镜 05.png',
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
      '我想做一个安静、模糊、情绪化的梦境视频。可以参考 Image 1、Image 2、Image 3：我希望它们像记忆碎片一样慢慢连接起来，有柔和光影、轻微漂浮感和一点点难以解释的情绪，但还需要你帮我确认这些素材分别怎么用。',
    mockAssets: [
      { id: 'dream-image-1', name: 'Image 1', role: 'Main emotional subject reference' },
      { id: 'dream-image-2', name: 'Image 2', role: 'Spatial / environment memory reference' },
      { id: 'dream-image-3', name: 'Image 3', role: 'Mood, light, and atmosphere reference' },
    ],
    outputSpec: '9:16 vertical · 20-30 seconds · quiet dreamlike memory video',
    aiUnderstanding: {
      title: 'AI Understanding · Dreamlike Memory Montage',
      mainFeedback:
        'Your prompt is already clearer than a vague concept because it defines mood, pacing, and the role of three reference assets. The direction is not product-led or ad-led; it is emotional, memory-driven, and image-dependent. The strongest interpretation is a soft dream montage where each asset contributes a different layer: subject, space, and mood. What still needs confirmation is which image anchors the opening, how transitions should feel, how literal or abstract the memory should become, and what kind of emotional aftertaste the ending should leave.',
      detectedDirection: [
        'Core tone: quiet, hazy, intimate, and emotionally unresolved',
        'Structure type: asset-guided memory montage rather than narrative plot video',
        'Visual language: soft light, blur, breathing pace, and associative transitions',
        'Asset logic: three reference images feeding subject, environment, and mood layers',
      ],
      detectedAssets: ['Image 1', 'Image 2', 'Image 3'],
      missingDetails: [
        'Which asset should lead the opening emotional anchor',
        'Whether transitions should dissolve, match-cut, or drift like dream fragments',
        'How much narrative clarity versus ambiguity the final video should hold',
        'Whether the ending should feel calm, melancholic, or hauntingly unfinished',
      ],
      recommendedFlow: 'Asset-guided Confirmation',
      cta: 'Confirm the dream logic and asset roles before generating the fixed plan',
    },
    questions: [
      {
        id: 'dream-anchor-asset',
        stage: 'Asset Confirmation',
        question: 'Which asset should emotionally lead the opening moment?',
        helper: 'The first asset sets the memory tone that all later transitions inherit.',
        type: 'single',
        recommended: 'image_1',
        options: [
          {
            value: 'image_1',
            label: 'Image 1 as emotional anchor',
            description: 'Start with the most human or intimate image and let everything drift outward from it.',
          },
          {
            value: 'image_2',
            label: 'Image 2 as spatial anchor',
            description: 'Open with a place or environment first, then reveal feeling through context.',
          },
          {
            value: 'image_3',
            label: 'Image 3 as mood anchor',
            description: 'Begin with atmosphere and let subject and space emerge afterward like memory fragments.',
          },
        ],
      },
      {
        id: 'dream-transition-feel',
        stage: 'Asset Confirmation',
        question: 'How should the assets transition into one another?',
        helper: 'The transition style determines whether the dream feels gentle, uncanny, or poetic.',
        type: 'single',
        recommended: 'soft_dissolve',
        options: [
          {
            value: 'soft_dissolve',
            label: 'Soft dissolve',
            description: 'The images blend slowly, as if the memory is breathing and reforming.',
          },
          {
            value: 'match_cut',
            label: 'Visual match cuts',
            description: 'Shapes, lines, and light motifs connect the images with subtle precision.',
          },
          {
            value: 'fragment_jump',
            label: 'Dream fragments',
            description: 'The memory breaks slightly and reconnects in an emotionally suggestive way.',
          },
        ],
      },
      {
        id: 'dream-emotional-temperature',
        stage: 'Asset Confirmation',
        question: 'What emotional temperature should the dream leave behind?',
        helper: 'This helps position the piece as soothing, bittersweet, or quietly haunting.',
        type: 'single',
        recommended: 'bittersweet',
        options: [
          {
            value: 'calm',
            label: 'Calm and suspended',
            description: 'The dream feels gentle and weightless, like floating without urgency.',
          },
          {
            value: 'bittersweet',
            label: 'Bittersweet memory',
            description: 'There is tenderness, but also distance and a trace of loss.',
          },
          {
            value: 'haunting',
            label: 'Quietly haunting',
            description: 'The dream is beautiful but emotionally unresolved and difficult to explain.',
          },
        ],
      },
      {
        id: 'dream-ending-mode',
        stage: 'Asset Confirmation',
        question: 'How should the last beat resolve?',
        helper: 'The ending can release the viewer softly or leave a more lingering emotional echo.',
        type: 'single',
        recommended: 'fade_linger',
        options: [
          {
            value: 'fade_linger',
            label: 'Fade into lingering silence',
            description: 'The dream feels unfinished, as if it continues beyond the visible cut.',
          },
          {
            value: 'soft_release',
            label: 'Soft emotional release',
            description: 'The viewer feels a quiet closure and exhale at the end.',
          },
          {
            value: 'open_question',
            label: 'Leave an open emotional question',
            description: 'The ending invites interpretation rather than closure.',
          },
        ],
      },
    ],
    answerFeedback: {
      'dream-anchor-asset': 'This identifies which reference image should emotionally frame the whole memory flow.',
      'dream-transition-feel': 'The transition logic now supports a specific dream texture instead of generic montage.',
      'dream-emotional-temperature': 'The overall emotional aftertaste is clearer and easier to express consistently.',
      'dream-ending-mode': 'The final beat now knows whether to release gently or remain emotionally open.',
    },
    intentSummary: {
      title: 'Intent Summary · Locked Dream Video Direction',
      mainCopy:
        'The prompt now becomes a soft dream-memory montage built from three reference assets: one anchors emotional presence, one defines space, and one controls mood and light. The fixed direction prioritizes gentle transitions, blurred emotional continuity, and a lightly bittersweet aftertaste. Instead of becoming a plot-heavy narrative, the video remains image-driven and memory-led, allowing mood and association to guide the viewer through the full short.',
      confirmedDirection: [
        'The piece is driven by dream logic, not explicit narrative explanation.',
        'Three assets are treated as emotional subject, spatial context, and atmosphere layers.',
        'Transition rhythm is soft and associative so the memory feels connected rather than linear.',
        'The ending remains delicate and lingering rather than conclusive or ad-like.',
      ],
      generationNotes: [
        'Let the pacing breathe and avoid overloading the short with too many scene beats.',
        'Use light, texture, and framing echoes to connect the images rather than explicit storytelling.',
        'Keep the tone intimate and emotionally readable within a short mobile duration.',
        'Preserve a subtle ambiguity so the piece feels remembered rather than explained.',
      ],
      cta: 'Continue to fixed Script Plan',
    },
    scriptPlan: {
      title: 'Generated Script Plan · Dreamlike Asset-Led Video',
      projectSummary: [
        'Three-asset dream montage designed for an emotional and visually soft demo flow.',
        'The result stays non-commercial and non-product-led, focused on memory and atmosphere.',
        'Each asset has a stable role so the fixed output still feels intentional even without branching generation.',
      ],
      globalDirection:
        'Structure the short as a calm memory drift where subject, space, and atmosphere pass across one another through soft transitions, ending on a lingering emotional echo rather than a resolved story point.',
      productionNotes: [
        'Use image transitions that suggest breathing, drifting, and partial recall.',
        'Let the strongest contrast come from emotional distance, not dramatic action.',
        'Treat light and texture continuity as the main glue between assets.',
      ],
      rows: [
        {
          time: '0–3s',
          scene: 'The subject appears at the edge of a soft, undefined dream space. The background is blurred, as if the place is still forming.',
          purpose: 'Establish subject and dream atmosphere.',
          visualDirection: 'Soft haze, shallow focus, gentle color bleed, low contrast light.',
          camera: 'Slow forward push, almost floating.',
          assetSource: 'Image 1 as subject reference, Image 3 as mood/light reference.',
          textOrCaption: '“I think I’ve been here before.”',
        },
        {
          time: '3–6s',
          scene: 'The space begins to reveal itself: quiet walls, distant shapes, and light passing across surfaces like a fading memory.',
          purpose: 'Introduce the dream environment.',
          visualDirection: 'Memory-like space, soft architecture, diffused light, slight surreal distortion.',
          camera: 'Slow lateral drift.',
          assetSource: 'Image 2 as scene reference, Image 3 as lighting reference.',
        },
        {
          time: '6–9s',
          scene: 'The subject walks deeper into the space. The background subtly shifts, as if reacting to their movement.',
          purpose: 'Create emotional progression.',
          visualDirection: 'Gentle environmental transformation, soft motion blur, dreamlike depth.',
          camera: 'Handheld-smooth follow from behind or side.',
          assetSource: 'Image 1 + Image 2.',
          textOrCaption: '“It keeps changing when I get closer.”',
        },
        {
          time: '9–12s',
          scene: 'A warm light appears ahead. The subject reaches toward it, but the space stretches slightly farther away.',
          purpose: 'Build unresolved longing.',
          visualDirection: 'Light bloom, slow spatial expansion, soft white-gold highlights.',
          camera: 'Slow push-in, slight focus breathing.',
          assetSource: 'Image 2 + Image 3.',
        },
        {
          time: '12–15s',
          scene: 'Just before the subject reaches the light, the dream space fades into white haze. The subject becomes a faint silhouette.',
          purpose: 'End with emotional suspension.',
          visualDirection: 'White haze, fading silhouette, soft dissolve, minimal motion.',
          camera: 'Slow pull away or dissolve to stillness.',
          assetSource: 'Image 1 as silhouette reference, Image 3 as mood reference.',
          textOrCaption: '“I almost remembered it.”',
        },
      ],
      intentMappingSummary: [
        'The three uploaded references are mapped to stable roles so the fixed script still feels asset-aware.',
        '“Dreamlike” is expressed through pacing, transitions, and light continuity rather than fantasy spectacle.',
        'The prompt remains emotional and memory-led, avoiding both product logic and literal plot explanation.',
      ],
      validationNotes: [
        'The output clearly belongs to the dream scenario rather than the fragrance ad scenario.',
        'The fixed plan works as a consistent demo because asset roles stay readable across the whole short.',
        'The emotional ending is intentionally light and unresolved to preserve the dream quality.',
      ],
    },
    generation: {
      generatingTitle: 'Mock Video Generating · Dream Memory Assembly',
      progressSteps: [
        {
          progress: 15,
          title: 'Reading prompt and references',
          description: 'Understanding the dream concept and the three uploaded image roles.',
        },
        {
          progress: 35,
          title: 'Building visual direction',
          description: 'Mapping Image 1 to subject, Image 2 to dream space, and Image 3 to mood and lighting.',
        },
        {
          progress: 58,
          title: 'Creating segment prompts',
          description: 'Splitting the 15-second dream into five visual moments.',
        },
        {
          progress: 76,
          title: 'Applying dream motion',
          description: 'Adding soft focus, slow movement, haze, light bloom, and gentle spatial shifts.',
        },
        {
          progress: 100,
          title: 'Finalizing mock preview',
          description: 'Preparing the simulated dream video result and generation summary.',
        },
      ],
      resultTitle: 'Mock Video Result · Dreamlike Emotional Montage',
      resultInfo: [
        'Format: 9:16 vertical mood video',
        'Length: about 25 seconds',
        'Style: soft dreamlike memory montage with three reference assets',
      ],
      resultSummary: [
        'The final mock result feels quiet, emotionally coherent, and visually soft rather than narrative-heavy.',
        'Each asset has a visible role in the short, making the scenario read as asset-aware and intentionally structured.',
        'The ending preserves a bittersweet lingering mood instead of delivering literal closure.',
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
