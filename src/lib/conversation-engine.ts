/**
 * Conversation Engine — 动态问题生成 + 对话式AI交互
 * 
 * 核心升级：
 * - 规则框架 + AI内容生成的混合动态问题引擎
 * - 用户输入状态分类（模糊/半清晰/清晰/素材驱动）
 * - 自适应问题路径（澄清路径/素材分析路径/快速确认路径）
 * - 完整度/置信度实时计算
 * - 选项叙事影响解释
 * - 可跳过/可回退/可打断
 */

import type { IntentAnalysis } from './ai-service';

export interface ConversationMessage {
  id: string;
  role: 'user' | 'ai';
  type: 'freeform' | 'question' | 'answer' | 'suggestion' | 'system';
  content: string;
  timestamp: number;
  metadata?: {
    questionId?: string;
    optionId?: string;
    impact?: string;
    scriptDelta?: string;
  };
}

export interface DynamicQuestion {
  id: string;
  question: string;
  subtitle: string;
  category: 'core' | 'visual' | 'audio' | 'technical' | 'style';
  options: { id: string; text: string; detail?: string }[];
  allowCustom: boolean;
  condition?: (answers: Record<string, string>) => boolean; // 动态显示条件
}

// 用户输入状态分类
export type UserInputState = 'vague' | 'semi-clear' | 'clear' | 'asset-driven' | 'reference-driven';

export interface ConversationState {
  messages: ConversationMessage[];
  currentQuestionIndex: number;
  answers: Record<string, string>;
  isThinking: boolean;
  isComplete: boolean;
  freeformMode: boolean;
  livePreview: string | null;
  userInputState: UserInputState;
  questionPath: string[]; // 记录用户走了哪些问题
  skippedQuestions: string[];
}

// ===== 问题模板库（按场景分类） =====
const QUESTION_TEMPLATES: Record<string, DynamicQuestion[]> = {
  // 模糊需求路径：更多开放性问题帮助用户澄清
  vague: [
    {
      id: 'vibe',
      question: 'What feeling do you want viewers to walk away with?',
      subtitle: 'Choose the dominant emotional tone',
      category: 'core',
      options: [
        { id: 'nostalgic', text: 'Nostalgic / Wistful', detail: 'A sense of time passing, memories, bittersweet beauty' },
        { id: 'mysterious', text: 'Mysterious / Intriguing', detail: 'Questions without answers, shadows, the unknown' },
        { id: 'hopeful', text: 'Hopeful / Uplifting', detail: 'Light emerging from darkness, growth, renewal' },
        { id: 'melancholic', text: 'Melancholic / Contemplative', detail: 'Quiet sadness, introspection, solitude' },
        { id: 'energetic', text: 'Energetic / Dynamic', detail: 'Movement, rhythm, high energy, excitement' },
        { id: 'surreal', text: 'Surreal / Dreamlike', detail: 'Logic suspended, impossible beauty, dream logic' },
      ],
      allowCustom: true,
    },
    {
      id: 'focus',
      question: 'What matters most in your story?',
      subtitle: 'Prioritize one element that anchors everything',
      category: 'core',
      options: [
        { id: 'feeling', text: 'Emotional Atmosphere', detail: 'The mood and feeling come first, plot is secondary' },
        { id: 'image', text: 'One Key Visual', detail: 'A single powerful image that everything builds toward' },
        { id: 'story', text: 'Clear Narrative Arc', detail: 'Beginning, middle, end — story structure matters most' },
        { id: 'world', text: 'World & Setting', detail: 'The environment and atmosphere are the main character' },
      ],
      allowCustom: true,
    },
    {
      id: 'visuals',
      question: 'What visual language speaks to you?',
      subtitle: 'Choose the dominant visual approach',
      category: 'visual',
      options: [
        { id: 'light', text: 'Light as Emotion', detail: 'Golden hour warmth, neon alienation, chiaroscuro drama' },
        { id: 'space', text: 'Architecture & Space', detail: 'Doors, corridors, windows — environment as metaphor' },
        { id: 'body', text: 'Body Language & Gesture', detail: 'A hand, a glance, a hesitation tells the story' },
        { id: 'texture', text: 'Tactile & Textural', detail: 'Surfaces you can almost feel through the screen' },
      ],
      allowCustom: true,
    },
    {
      id: 'expression',
      question: 'How should the story be told?',
      subtitle: 'Narrative expression method',
      category: 'core',
      options: [
        { id: 'visual-only', text: 'Pure Visual Cinema', detail: 'No words. Images speak entirely for themselves' },
        { id: 'voiceover', text: 'Voiceover Narration', detail: 'A guiding voice leads the viewer through the journey' },
        { id: 'captions', text: 'Text Overlays', detail: 'Minimal poetic text fragments on screen' },
        { id: 'score', text: 'Music-Driven', detail: 'The soundtrack is the narrator. Rhythm matches emotion' },
      ],
      allowCustom: true,
    },
    {
      id: 'technical',
      question: 'Where will this live?',
      subtitle: 'Platform and format constraints shape the approach',
      category: 'technical',
      options: [
        { id: 'social', text: 'Social Media (Vertical)', detail: '9:16, fast hook in 2s, high energy, under 30s' },
        { id: 'cinematic', text: 'Cinematic (Wide)', detail: '21:9, immersive, 60-90s, space to breathe and feel' },
        { id: 'looping', text: 'Ambient Loop', detail: 'Seamless, no beginning or end, background mood piece' },
        { id: 'gallery', text: 'Gallery / Exhibition', detail: '1:1 format, contemplative, viewer decides duration' },
      ],
      allowCustom: true,
    },
  ],
  // 半清晰需求路径：平衡开放性和具体性
  'semi-clear': [
    {
      id: 'focus',
      question: 'What is the heart of your story?',
      subtitle: 'Prioritize the element that everything revolves around',
      category: 'core',
      options: [
        { id: 'feeling', text: 'Emotional Atmosphere', detail: 'Mood and feeling are the main characters' },
        { id: 'image', text: 'One Defining Image', detail: 'A single powerful visual anchors everything' },
        { id: 'story', text: 'Narrative Structure', detail: 'Three-act arc with clear setup, conflict, resolution' },
        { id: 'world', text: 'World & Environment', detail: 'The setting itself tells the story' },
      ],
      allowCustom: true,
    },
    {
      id: 'story',
      question: 'What kind of journey is this?',
      subtitle: 'Choose the narrative structure',
      category: 'core',
      options: [
        { id: 'human-vs-tech', text: 'Man vs. Technology', detail: 'Protagonist navigating or resisting technological force' },
        { id: 'discovery', text: 'Journey of Discovery', detail: 'Mystery unfolds shot by shot, each frame reveals more' },
        { id: 'isolation', text: 'Solitude & Internal', detail: 'Character alone, the world amplifies inner state' },
        { id: 'transformation', text: 'Transformation', detail: 'Character visibly changes from beginning to end' },
      ],
      allowCustom: true,
      condition: (answers) => answers.focus === 'story',
    },
    {
      id: 'visuals',
      question: 'What visual approach defines this?',
      subtitle: 'The dominant visual language',
      category: 'visual',
      options: [
        { id: 'light', text: 'Lighting-Driven', detail: 'Light carries the emotional weight of each scene' },
        { id: 'space', text: 'Spatial Composition', detail: 'Architecture and environment frame every shot' },
        { id: 'body', text: 'Intimate & Physical', detail: 'Close-ups, gestures, the language of the body' },
        { id: 'texture', text: 'Material & Tactile', detail: 'Texture and surface quality dominate' },
      ],
      allowCustom: true,
    },
    {
      id: 'expression',
      question: 'How is the story expressed?',
      subtitle: 'Narrative voice and method',
      category: 'core',
      options: [
        { id: 'visual-only', text: 'Pure Cinema', detail: 'No dialogue, no text — images alone tell the story' },
        { id: 'voiceover', text: 'Guided Voice', detail: 'Narration leads the viewer through emotional beats' },
        { id: 'captions', text: 'Text Fragments', detail: 'Minimal poetic captions like scattered thoughts' },
        { id: 'score', text: 'Musical Narrative', detail: 'Soundtrack drives the emotional pacing' },
      ],
      allowCustom: true,
    },
    {
      id: 'technical',
      question: 'What is the output format?',
      subtitle: 'Platform constraints shape creative decisions',
      category: 'technical',
      options: [
        { id: 'social', text: 'Social / Mobile', detail: 'Vertical 9:16, under 30s, instant visual hook' },
        { id: 'cinematic', text: 'Cinematic Film', detail: 'Wide 21:9, 60-90s, immersive pacing' },
        { id: 'looping', text: 'Seamless Loop', detail: 'Ambient, no beginning or end, infinite play' },
        { id: 'gallery', text: 'Exhibition Piece', detail: 'Square format, contemplative, viewer-controlled timing' },
      ],
      allowCustom: true,
    },
  ],
  // 清晰需求路径：快速确认，问题更少
  clear: [
    {
      id: 'confirm-focus',
      question: 'Confirm: the core focus is on...',
      subtitle: 'Verify my understanding of your primary intent',
      category: 'core',
      options: [
        { id: 'feeling', text: 'Emotional Atmosphere', detail: 'Mood-first approach' },
        { id: 'image', text: 'Key Visual Moment', detail: 'One defining image anchors all' },
        { id: 'story', text: 'Narrative Arc', detail: 'Three-act structure' },
        { id: 'world', text: 'World Building', detail: 'Setting as protagonist' },
      ],
      allowCustom: true,
    },
    {
      id: 'confirm-visuals',
      question: 'The visual language should emphasize...',
      subtitle: 'Dominant visual approach',
      category: 'visual',
      options: [
        { id: 'light', text: 'Light & Color', detail: 'Emotional lighting design' },
        { id: 'space', text: 'Composition & Space', detail: 'Architectural framing' },
        { id: 'body', text: 'Close-up Intimacy', detail: 'Gestural storytelling' },
        { id: 'texture', text: 'Material Quality', detail: 'Tactile surfaces' },
      ],
      allowCustom: true,
    },
    {
      id: 'confirm-format',
      question: 'Output format and platform?',
      subtitle: 'Final technical specifications',
      category: 'technical',
      options: [
        { id: 'social', text: 'Social Vertical', detail: '9:16, <30s' },
        { id: 'cinematic', text: 'Cinematic Wide', detail: '21:9, 60-90s' },
        { id: 'looping', text: 'Ambient Loop', detail: 'Seamless' },
        { id: 'gallery', text: 'Gallery Square', detail: '1:1, contemplative' },
      ],
      allowCustom: false,
    },
  ],
  // 素材驱动路径：先分析素材，再围绕素材提问
  'asset-driven': [
    {
      id: 'asset-analysis',
      question: 'What do your materials suggest?',
      subtitle: 'Based on your uploaded assets, here is what I sense',
      category: 'core',
      options: [
        { id: 'assets-mood', text: 'Mood & Atmosphere', detail: 'Your assets share a strong tonal quality — let this lead' },
        { id: 'assets-narrative', text: 'Hidden Narrative', detail: 'There is a story connecting these images, let me find it' },
        { id: 'assets-visual', text: 'Visual Rhythm', detail: 'The composition and color create a visual beat' },
        { id: 'assets-contrast', text: 'Intentional Contrast', detail: 'The tension between different assets is the story' },
      ],
      allowCustom: true,
    },
    {
      id: 'focus',
      question: 'What do you want to build from these materials?',
      subtitle: 'Choose the creative direction',
      category: 'core',
      options: [
        { id: 'feeling', text: 'Emotional Piece', detail: 'Let the feeling of the assets guide the narrative' },
        { id: 'story', text: 'Story-Driven', detail: 'Construct a clear narrative arc from the materials' },
        { id: 'world', text: 'Immersive World', detail: 'Build an environment that pulls the viewer in' },
        { id: 'image', text: 'Visual Poem', detail: 'Abstract, non-linear, sensory-first' },
      ],
      allowCustom: true,
    },
    {
      id: 'expression',
      question: 'How should this be told?',
      subtitle: 'Narrative method',
      category: 'core',
      options: [
        { id: 'visual-only', text: 'Pure Visual', detail: 'Assets speak for themselves' },
        { id: 'voiceover', text: 'With Narration', detail: 'A voice guides through the imagery' },
        { id: 'score', text: 'Music-Driven', detail: 'Soundtrack carries the emotion' },
        { id: 'captions', text: 'Text Fragments', detail: 'Sparse poetic text overlays' },
      ],
      allowCustom: true,
    },
    {
      id: 'technical',
      question: 'Final output specifications?',
      subtitle: 'Platform and format',
      category: 'technical',
      options: [
        { id: 'social', text: 'Social', detail: '9:16, fast, vertical' },
        { id: 'cinematic', text: 'Cinematic', detail: '21:9, wide, immersive' },
        { id: 'looping', text: 'Loop', detail: 'Seamless ambient' },
        { id: 'gallery', text: 'Gallery', detail: '1:1, contemplative' },
      ],
      allowCustom: false,
    },
  ],
};

export class ConversationEngine {
  
  // 判断用户输入状态
  static detectInputState(text: string, hasAssets: boolean): UserInputState {
    const lower = text.toLowerCase().trim();
    const wordCount = lower.split(/\s+/).length;
    
    if (hasAssets && wordCount < 5) return 'asset-driven';
    if (lower.includes('like') || lower.includes('similar to') || lower.includes('reference')) return 'reference-driven';
    if (wordCount < 10) return 'vague';
    if (wordCount < 30) return 'semi-clear';
    return 'clear';
  }

  // 根据用户状态获取问题列表
  static getQuestionsForState(state: UserInputState, _analysis: IntentAnalysis): DynamicQuestion[] {
    const key = state === 'reference-driven' ? 'semi-clear' : state;
    return QUESTION_TEMPLATES[key] || QUESTION_TEMPLATES['semi-clear'];
  }

  // 动态过滤：根据已回答问题决定显示哪些问题
  static filterQuestions(questions: DynamicQuestion[], answers: Record<string, string>): DynamicQuestion[] {
    return questions.filter(q => {
      if (q.condition) return q.condition(answers);
      return true;
    });
  }

  // 计算完整度分数
  static calculateCompleteness(answers: Record<string, string>): { score: number; filled: string[]; missing: string[] } {
    const allDimensions = ['focus', 'story', 'visuals', 'expression', 'technical', 'vibe', 'mood', 'audience'];
    const filled = allDimensions.filter(k => answers[k]);
    const missing = allDimensions.filter(k => !answers[k]);
    return { score: Math.round((filled.length / allDimensions.length) * 100), filled, missing };
  }

  // 判断是否已有足够信息生成脚本
  static hasEnoughInfo(answers: Record<string, string>): boolean {
    const { score } = this.calculateCompleteness(answers);
    return score >= 50; // 50%即可生成基础脚本
  }

  static createInitialMessages(analysis: IntentAnalysis, inputState?: UserInputState): ConversationMessage[] {
    const stateLabels: Record<string, string> = {
      'vague': 'I sense you have a feeling but need help shaping it. Let me guide you.',
      'semi-clear': 'You have a solid direction. Let me refine it with a few questions.',
      'clear': 'Clear vision! I will quickly confirm my understanding and generate.',
      'asset-driven': 'Your materials tell a story. Let me read them and build around them.',
      'reference-driven': 'I understand the reference. Let me adapt that approach for you.',
    };

    return [
      {
        id: 'sys-1',
        role: 'ai',
        type: 'system',
        content: `**Analysis Complete**

Genre: ${analysis.genre}  |  Mood: ${analysis.mood}  |  Style: ${analysis.visualStyle}
Themes: ${analysis.keyThemes.join(', ')}

${inputState ? stateLabels[inputState] || '' : ''}

You can answer my questions, type freely, or **skip all** to generate instantly.`,
        timestamp: Date.now(),
      },
    ];
  }

  static createQuestionMessage(
    questionId: string,
    question: string,
    _subtitle: string,
    _options: { id: string; text: string; detail?: string }[],
    questionNumber: number,
    total: number
  ): ConversationMessage {
    return {
      id: `q-${questionId}`,
      role: 'ai',
      type: 'question',
      content: total > 0 ? `[${questionNumber}/${total}] ${question}` : question,
      timestamp: Date.now(),
      metadata: { questionId },
    };
  }

  static createAnswerMessage(
    questionId: string,
    optionId: string,
    answerText: string,
    impact: string
  ): ConversationMessage {
    return {
      id: `a-${questionId}-${optionId}`,
      role: 'user',
      type: 'answer',
      content: answerText,
      timestamp: Date.now(),
      metadata: { questionId, optionId, impact },
    };
  }

  static createFreeformResponse(userInput: string, _analysis: IntentAnalysis, context: string): ConversationMessage {
    const lower = userInput.toLowerCase();
    let response = '';
    let type: 'freeform' | 'suggestion' = 'freeform';

    if (lower.includes('why') || lower.includes('explain')) {
      response = `Great question. This choice shapes the **emotional pacing** of your script. A different option would shift the story structure. Want me to preview both paths?`;
      type = 'suggestion';
    } else if (lower.includes('skip') || lower.includes('next') || lower.includes('hurry') || lower.includes('fast')) {
      response = `Understood! I'll use my best judgment based on what you have told me. You can always adjust later in the Script Workspace.`;
      type = 'suggestion';
    } else if (lower.includes('back') || lower.includes('previous') || lower.includes('change')) {
      response = `Absolutely. I will take you back. Your previous answers are saved, and I will recalculate based on any changes.`;
      type = 'suggestion';
    } else if (lower.includes('shorter') || lower.includes('longer') || lower.includes('duration')) {
      response = `I can adjust duration. Want me to show a 15-second and 60-second version side by side?`;
      type = 'suggestion';
    } else if (lower.includes('example') || lower.includes('show me') || lower.includes('preview')) {
      response = `Here is how your script looks so far:\n\n${context}\n\nEach answer refines this. Keep going or say "generate now".`;
      type = 'suggestion';
    } else {
      response = `Noted. I will weave that into the script direction. Keep answering questions, ask me anything, or say "skip" to jump ahead.`;
    }

    return {
      id: `free-${Date.now()}`,
      role: 'ai',
      type,
      content: response,
      timestamp: Date.now(),
    };
  }

  static getImpactDescription(
    questionId: string,
    optionId: string,
    _analysis: IntentAnalysis
  ): string {
    const impacts: Record<string, Record<string, string>> = {
      focus: {
        feeling: 'Script prioritizes emotional atmosphere. Expect lyrical shots, slower pacing, sensory details over plot exposition.',
        image: 'One key visual anchors everything. Every shot builds toward or echoes this defining image. Minimalist and powerful.',
        story: 'Three-act structure with clear setup, confrontation, resolution. Narrative beats drive shot selection.',
        world: 'Environment is the protagonist. Wide establishing shots, atmospheric details, immersive world-building.',
        atmosphere: 'Mood-first approach. Color grading and sound design carry more weight than dialogue or action.',
      },
      story: {
        'human-vs-tech': 'Conflict-driven narrative. Protagonist navigating or resisting technology. Dramatic tension in every frame.',
        discovery: 'Mystery structure. Each shot reveals new information. Viewer as detective. Slow unraveling.',
        isolation: 'Internal journey. Character alone against overwhelming environment. Introspective, quiet, vast.',
        transformation: 'Visible change arc. Character at point A vs point B. Contrast shots emphasize growth.',
        gradual: 'Slow-burn development. Subtle shifts accumulate. Patience rewarded with emotional payoff.',
      },
      visuals: {
        light: 'Lighting carries emotion. Golden hour = warmth, neon = alienation, chiaroscuro = drama. Every light choice is intentional.',
        space: 'Architecture frames meaning. Doorways = transitions, corridors = journey, windows = perspective.',
        body: 'Micro-gestures tell story. A hand, a glance, a hesitation. Intimate close-ups dominate.',
        texture: 'Tactile quality. You should almost feel surfaces through screen. Materiality as emotional language.',
      },
      expression: {
        'visual-only': 'Pure cinema. Zero words. Every frame must communicate without text. Most challenging, most rewarding.',
        captions: 'Minimal text overlays like poetry fragments. Words support, never explain. Sparse and precise.',
        voiceover: 'Guiding voice leads viewer. Intimate diary-like tone. Voice and image create dual narrative layers.',
        score: 'Soundtrack is narrator. Musical beats match emotional arc. Rhythm of cuts follows rhythm of music.',
        music: 'Same as score-driven. Music dictates pacing and emotional color of each sequence.',
      },
      technical: {
        social: 'Vertical 9:16. Hook in first 2 seconds. High energy. Fast cuts. Under 30 seconds. Mobile-first design.',
        cinematic: 'Wide 21:9. Immersive pacing. Space to breathe. 60-90 seconds. Film language, not video language.',
        looping: 'Seamless infinite loop. No beginning or end. Ambient mood piece. Perfect for installations.',
        gallery: 'Square 1:1 format. Contemplative pacing. Viewer controls duration. Exhibition-ready composition.',
        square: 'Same as gallery. Balanced frame, symmetrical composition, meditative viewing experience.',
      },
      vibe: {
        nostalgic: 'Warm color grade, film grain, soft focus. Objects from the past. Time as a palpable presence.',
        mysterious: 'Shadows, negative space, partial reveals. Questions more powerful than answers.',
        hopeful: 'Light emerging from darkness. Upward movement. Growth metaphors. Dawn and spring imagery.',
        melancholic: 'Blue tones, rain, empty spaces. Quiet moments. Solitude as beauty. Acceptance.',
        energetic: 'Fast motion, bold colors, rhythmic editing. Forward momentum. Celebration of movement.',
        surreal: 'Logic suspended. Impossible juxtapositions. Dream logic. Uncanny beauty. Reality as clay.',
      },
      'confirm-focus': {
        feeling: 'Confirmed: emotion-first approach. Mood drives every decision.',
        image: 'Confirmed: visual anchor strategy. One image to rule them all.',
        story: 'Confirmed: three-act narrative structure. Clear dramatic arc.',
        world: 'Confirmed: environment as protagonist. Immersive world-building.',
      },
      'asset-analysis': {
        'assets-mood': 'Assets share tonal DNA. Mood continuity will be the narrative thread.',
        'assets-narrative': 'Finding hidden connections between your materials. Story emerges from juxtaposition.',
        'assets-visual': 'Color palette and composition create visual rhythm. Musical editing approach.',
        'assets-contrast': 'Tension between assets is the engine. Conflict creates meaning.',
      },
    };

    return impacts[questionId]?.[optionId] || `This choice shapes your script's ${questionId} direction. Each option creates a different emotional and structural outcome.`;
  }

  // 生成路径可视化数据
  static getPathDescription(path: string[], answers: Record<string, string>): string {
    if (path.length === 0) return 'Start by answering the first question below.';
    const segments = path.map(qid => {
      const answer = answers[qid];
      return `${qid}: ${answer || '?'}`;
    });
    return `Your path so far: ${segments.join(' → ')}`;
  }
}
