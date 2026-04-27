/**
 * StoryVibe — AI Service (真实API版本)
 *
 * 主力模型: 通义千问 Qwen-OMNI (多模态)
 * API Key: 用户已提供
 * BaseURL: https://dashscope.aliyuncs.com/compatible-mode/v1 (OpenAI兼容)
 */

import type { Script } from '@/types';

// ========== 配置 ==========
const CONFIG = {
  // Qwen-OMNI (主力)
  qwenKey: 'sk-16708778b6774db68345c9b00d22e8cf',
  qwenBaseURL: 'https://dashscope.aliyuncs.com/compatible-mode/v1',
  qwenModel: 'qwen-omni-turbo', // 多模态：支持文本+图片+音频输入

  // 超时设置
  timeout: 60000, // 60秒
};

// ========== 通用API调用函数 ==========

async function callQwenAPI(messages: any[], maxTokens = 2000): Promise<string> {
  const res = await fetch(`${CONFIG.qwenBaseURL}/chat/completions`, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${CONFIG.qwenKey}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      model: CONFIG.qwenModel,
      messages,
      temperature: 0.75,
      max_tokens: maxTokens,
    }),
  });

  if (!res.ok) {
    const error = await res.text();
    throw new Error(`Qwen API Error: ${res.status} - ${error}`);
  }

  const data = await res.json();
  return data.choices?.[0]?.message?.content || '';
}

// 多模态API调用（文本+图片）
async function callQwenMultimodal(text: string, imageBase64?: string, maxTokens = 2000): Promise<string> {
  const messages: any[] = [
    { role: 'system', content: 'You are a professional film scriptwriting and visual storytelling AI assistant. Analyze user input deeply and provide creative, structured script guidance. Always respond in the same language as the user.' },
  ];

  if (imageBase64) {
    messages.push({
      role: 'user',
      content: [
        { type: 'image_url', image_url: { url: `data:image/jpeg;base64,${imageBase64}` } },
        { type: 'text', text },
      ],
    });
  } else {
    messages.push({ role: 'user', content: text });
  }

  return callQwenAPI(messages, maxTokens);
}

// ========== 类型定义 ==========

export interface MultimodalInput {
  text: string;
  assets: UploadedAsset[];
}

export interface UploadedAsset {
  id: string;
  type: 'image' | 'video' | 'text' | 'document';
  name: string;
  content?: string;
  size: number;
}

export interface IntentAnalysis {
  primaryIntent: string;
  genre: string;
  mood: string;
  visualStyle: string;
  targetAudience: string;
  estimatedDuration: string;
  keyThemes: string[];
  narrativeArc: string;
  technicalNotes: string;
  confidence: number;
}

export interface AISynthesis {
  narrativeArc: string;
  technicalMapping: {
    topic: string;
    style: string;
    goal: string;
    constraint: string;
  };
}

export interface GuidedQuestion {
  id: string;
  category: 'mood' | 'focus' | 'story' | 'visuals' | 'expression' | 'technical';
  question: string;
  subtitle: string;
  options: { id: string; text: string; detail?: string }[];
  allowCustom: boolean;
}

// ========== 核心AI服务 ==========

export class AgentService {

  /**
   * 多模态意图分析 — 真实AI调用
   */
  static async analyzeMultimodal(input: MultimodalInput): Promise<{ analysis: IntentAnalysis; synthesis: AISynthesis }> {
    const assetDesc = input.assets.map(a => `- ${a.name} (${a.type})`).join('\n');

    const prompt = `Analyze the following creative brief for a short video/film project and provide a structured analysis.

## User's Creative Input
${input.text}

## Uploaded Assets
${assetDesc || 'No assets uploaded'}

## Required Output Format
Respond ONLY in this JSON format (no markdown, no extra text):

{
  "primaryIntent": "One sentence describing the core creative intent",
  "genre": "e.g., Sci-Fi Short, Romantic Drama, Experimental, Documentary",
  "mood": "e.g., Melancholic, Futuristic, Warm, Tense",
  "visualStyle": "e.g., Soft light muted tones, Neon high-contrast",
  "targetAudience": "Who this content is for",
  "estimatedDuration": "e.g., 15s, 30s, 60s",
  "keyThemes": ["Theme 1", "Theme 2", "Theme 3"],
  "narrativeArc": "2-3 sentences describing the suggested story arc",
  "technicalNotes": "Notes about assets or technical constraints",
  "confidence": 0.85
}`;

    const response = await callQwenMultimodal(prompt);

    // 尝试解析JSON
    let parsed: any;
    try {
      // 清理可能的markdown格式
      const cleaned = response.replace(/```json\n?/g, '').replace(/```\n?/g, '').trim();
      parsed = JSON.parse(cleaned);
    } catch {
      // 如果JSON解析失败，从文本中提取信息
      parsed = extractFromText(response, input.text);
    }

    const analysis: IntentAnalysis = {
      primaryIntent: parsed.primaryIntent || `Create a video based on: ${input.text.slice(0, 100)}`,
      genre: parsed.genre || detectGenre(input.text),
      mood: parsed.mood || 'Atmospheric',
      visualStyle: parsed.visualStyle || 'Soft cinematic lighting',
      targetAudience: parsed.targetAudience || 'General audience',
      estimatedDuration: parsed.estimatedDuration || '30s',
      keyThemes: Array.isArray(parsed.keyThemes) ? parsed.keyThemes : ['Visual Storytelling'],
      narrativeArc: parsed.narrativeArc || `A story exploring ${input.text.slice(0, 80)}...`,
      technicalNotes: parsed.technicalNotes || '',
      confidence: typeof parsed.confidence === 'number' ? parsed.confidence : 0.8,
    };

    const synthesis: AISynthesis = {
      narrativeArc: analysis.narrativeArc,
      technicalMapping: {
        topic: analysis.keyThemes.join(' / '),
        style: analysis.visualStyle,
        goal: `${analysis.genre} — ${analysis.estimatedDuration}`,
        constraint: analysis.technicalNotes || 'Creative direction to be refined through guided questions',
      },
    };

    return { analysis, synthesis };
  }

  /**
   * 生成个性化引导问题 — 真实AI调用
   */
  static async generateQuestions(analysis: IntentAnalysis): Promise<GuidedQuestion[]> {
    const prompt = `Based on this project analysis, generate 5 personalized guiding questions to help shape a video script.

## Project Analysis
- Genre: ${analysis.genre}
- Mood: ${analysis.mood}
- Visual Style: ${analysis.visualStyle}
- Themes: ${analysis.keyThemes.join(', ')}
- Narrative Arc: ${analysis.narrativeArc}

## Required Output
Respond ONLY in this JSON array format:

[
  {
    "id": "focus",
    "category": "focus",
    "question": "What should the audience remember most?",
    "subtitle": "Helps define the core takeaway",
    "options": [
      {"id": "feeling", "text": "The emotional feeling", "detail": "Mood over plot"},
      {"id": "image", "text": "One striking visual", "detail": "Single memorable frame"},
      {"id": "story", "text": "The story/transformation", "detail": "Clear narrative arc"},
      {"id": "atmosphere", "text": "The world/atmosphere", "detail": "Environment drives narrative"}
    ],
    "allowCustom": true
  }
]`;

    const response = await callQwenAPI([
      { role: 'system', content: 'You are a creative scriptwriting guide. Generate thoughtful questions that help creators discover their vision.' },
      { role: 'user', content: prompt },
    ], 3000);

    let questions: GuidedQuestion[];
    try {
      const cleaned = response.replace(/```json\n?/g, '').replace(/```\n?/g, '').trim();
      questions = JSON.parse(cleaned);
    } catch {
      // Fallback to default questions
      questions = getDefaultQuestions(analysis);
    }

    // 确保有additional问题
    if (!questions.some(q => q.id === 'additional')) {
      questions.push({
        id: 'additional',
        category: 'mood',
        question: 'Anything else needed for implementation?',
        subtitle: 'Specific references, constraints, or details to incorporate',
        options: [
          { id: 'none', text: 'Nothing else — ready to generate', detail: 'Proceed with what we have' },
          { id: 'reference', text: 'I have specific visual references', detail: 'Mood boards, film refs, style guides' },
          { id: 'constraint', text: 'There are technical constraints', detail: 'Budget, location, equipment, time' },
          { id: 'more', text: 'I want to add more details', detail: 'Additional narrative or emotional notes' },
        ],
        allowCustom: true,
      });
    }

    return questions;
  }

  /**
   * 生成完整脚本 — 真实AI调用
   */
  static async generateScript(analysis: IntentAnalysis, answers: Record<string, string>): Promise<Script> {
    const focus = answers['focus'] || 'feeling';
    const story = answers['story'] || 'gradual';
    const visuals = answers['visuals'] || 'light';
    const expression = answers['expression'] || 'visual-only';
    const technical = answers['technical'] || 'cinematic';

    const duration = technical === 'social' ? '15s' : technical === 'cinematic' ? '60s' : '30s';
    const numShots = technical === 'social' ? 4 : technical === 'cinematic' ? 8 : 5;

    const prompt = `Generate a detailed video script based on the following creative brief. Write in the same language as the creative brief.

## Creative Brief
- Genre: ${analysis.genre}
- Mood: ${analysis.mood}
- Visual Style: ${analysis.visualStyle}
- Themes: ${analysis.keyThemes.join(', ')}
- Narrative Arc: ${analysis.narrativeArc}

## User's Choices
- Focus: ${focus}
- Story Structure: ${story}
- Visual Priority: ${visuals}
- Expression Style: ${expression}
- Format: ${technical}
- Duration: ${duration}
- Number of Shots: ${numShots}

## Required Output
Respond ONLY in this JSON format:

{
  "title": "Script Title",
  "duration": "${duration}",
  "narrativeArc": "Brief narrative arc description",
  "emotionalGoal": "What the audience should feel",
  "visualDirection": "Overall visual approach",
  "rhythm": "Pacing description",
  "assetLogic": "How assets are used",
  "shots": [
    {
      "id": "shot-1",
      "timeRange": "0-5s",
      "visual": "Detailed visual description of what appears on screen",
      "purpose": "SET THE MOOD",
      "camera": "Camera movement description",
      "asset": "UPLOADED or GENERATED",
      "copy": "Dialogue or narration text (optional)"
    }
  ]
}`;

    const response = await callQwenAPI([
      { role: 'system', content: 'You are an expert screenwriter specializing in short-form visual storytelling. Create vivid, cinematic shot descriptions that directors can immediately visualize. Each shot must have a clear purpose and emotional beat.' },
      { role: 'user', content: prompt },
    ], 4000);

    let parsed: any;
    try {
      const cleaned = response.replace(/```json\n?/g, '').replace(/```\n?/g, '').trim();
      parsed = JSON.parse(cleaned);
    } catch {
      // 如果解析失败，生成一个基础脚本
      parsed = generateFallbackScript(analysis, duration, numShots);
    }

    return {
      id: `script-${Date.now()}`,
      title: parsed.title || `${analysis.genre} — ${analysis.mood}`,
      status: 'draft',
      duration: parsed.duration || duration,
      version: 'v1',
      narrativeArc: parsed.narrativeArc || analysis.narrativeArc,
      emotionalGoal: parsed.emotionalGoal || `Evoke ${analysis.mood.toLowerCase()} feelings`,
      visualDirection: parsed.visualDirection || analysis.visualStyle,
      rhythm: parsed.rhythm || 'Steady progression with intentional pauses',
      assetLogic: parsed.assetLogic || 'User assets as primary references',
      shots: (parsed.shots || []).map((s: any, i: number) => ({
        id: s.id || `shot-${i + 1}`,
        timeRange: s.timeRange || `${i * 5}-${(i + 1) * 5}s`,
        preview: '',
        visual: s.visual || 'Visual description pending',
        purpose: s.purpose || 'BUILD ATMOSPHERE',
        camera: s.camera || 'Static shot',
        asset: s.asset || 'UPLOADED',
        copy: s.copy || '',
      })),
    };
  }

  /**
   * AI对话自由输入 — 真实AI调用
   */
  static async chatFreeform(userInput: string, context: string): Promise<string> {
    const prompt = `You are a creative AI assistant helping a filmmaker develop their script. Context of our current session:\n${context}\n\nUser's message: ${userInput}\n\nRespond helpfully and concisely. If they ask about options, explain the creative implications. If they want to skip or adjust, accommodate them.`;

    return callQwenMultimodal(prompt, undefined, 800);
  }
}

// ========== 辅助函数 ==========

function detectGenre(text: string): string {
  const t = text.toLowerCase();
  if (t.includes('sci-fi') || t.includes('cyber') || t.includes('future') || t.includes('space') || t.includes('robot')) return 'Sci-Fi Short';
  if (t.includes('love') || t.includes('romance') || t.includes('relationship') || t.includes('couple')) return 'Romantic Drama';
  if (t.includes('horror') || t.includes('scary') || t.includes('ghost') || t.includes('dark')) return 'Horror/Thriller';
  if (t.includes('documentary') || t.includes('real') || t.includes('interview')) return 'Documentary';
  if (t.includes('comedy') || t.includes('funny') || t.includes('humor')) return 'Comedy';
  if (t.includes('dream') || t.includes('memory') || t.includes('abstract')) return 'Experimental Short';
  return 'Narrative Short';
}

function extractFromText(_text: string, originalInput: string): any {
  return {
    primaryIntent: `Create a video based on: ${originalInput.slice(0, 100)}`,
    genre: detectGenre(originalInput),
    mood: 'Atmospheric',
    visualStyle: 'Soft cinematic lighting',
    keyThemes: ['Visual Storytelling', 'Emotional Journey'],
    narrativeArc: `A story exploring ${originalInput.slice(0, 80)}...`,
    confidence: 0.75,
  };
}

function getDefaultQuestions(analysis: IntentAnalysis): GuidedQuestion[] {
  return [
    {
      id: 'focus',
      category: 'focus',
      question: 'What do you most want the audience to remember after watching?',
      subtitle: `Your "${analysis.genre}" direction suggests a strong emotional core. Let's define the core takeaway.`,
      options: [
        { id: 'feeling', text: 'The emotional feeling', detail: 'Leave them with a mood, not a message' },
        { id: 'image', text: 'One striking visual image', detail: 'A single unforgettable frame' },
        { id: 'story', text: 'The story or transformation', detail: 'A clear narrative arc with change' },
        { id: 'atmosphere', text: 'The world and atmosphere', detail: 'The space, texture, and environment' },
      ],
      allowCustom: true,
    },
    {
      id: 'story',
      category: 'story',
      question: 'Which narrative flow fits your vision?',
      subtitle: 'The structure determines how the viewer experiences time and emotion.',
      options: [
        { id: 'gradual', text: 'A gradual emotional shift', detail: 'Slowly building feeling across scenes' },
        { id: 'fragments', text: 'A series of memory fragments', detail: 'Non-linear, collage-like structure' },
        { id: 'journey', text: 'A clear beginning-to-end journey', detail: 'Linear progression with a destination' },
        { id: 'loop', text: 'A symbolic visual loop', detail: 'Cyclical imagery that rewards rewatching' },
      ],
      allowCustom: true,
    },
    {
      id: 'visuals',
      category: 'visuals',
      question: 'What visual element should dominate?',
      subtitle: 'This determines the primary visual language of each shot.',
      options: [
        { id: 'light', text: 'Light and its movement', detail: 'Golden hour, neon glow, shadows dancing' },
        { id: 'space', text: 'Architecture and space', detail: 'Corridors, rooms, vast landscapes' },
        { id: 'body', text: 'Body language and gesture', detail: 'Small movements, posture, hands' },
        { id: 'texture', text: 'Texture and material', detail: 'Fabric, water, glass, smoke' },
      ],
      allowCustom: true,
    },
    {
      id: 'expression',
      category: 'expression',
      question: 'How should the emotion be expressed?',
      subtitle: 'Different expressions create vastly different viewing experiences.',
      options: [
        { id: 'visual-only', text: 'Purely through visuals', detail: 'No words, let images speak' },
        { id: 'captions', text: 'Minimal text captions', detail: 'Short phrases, poetic fragments' },
        { id: 'voiceover', text: 'Voiceover / Inner monologue', detail: 'A voice guiding the viewer through' },
        { id: 'music', text: 'Let the music carry it', detail: 'Score-driven emotional arc' },
      ],
      allowCustom: true,
    },
    {
      id: 'technical',
      category: 'technical',
      question: 'What is the intended viewing experience?',
      subtitle: 'This affects pacing, aspect ratio, and overall production approach.',
      options: [
        { id: 'social', text: 'Social media vertical short', detail: '9:16, fast hook, under 30s' },
        { id: 'cinematic', text: 'Cinematic wide experience', detail: '21:9 or 16:9, immersive, 60-90s' },
        { id: 'looping', text: 'Seamless looping background', detail: 'Perfect loop, ambient, no narrative' },
        { id: 'square', text: 'Gallery / Exhibition piece', detail: '1:1, contemplative, any duration' },
      ],
      allowCustom: true,
    },
  ];
}

function generateFallbackScript(analysis: IntentAnalysis, duration: string, numShots: number): any {
  const shots: any[] = [];
  for (let i = 0; i < numShots; i++) {
    const start = i * 5;
    const end = (i + 1) * 5;
    shots.push({
      id: `shot-${i + 1}`,
      timeRange: `${start}-${end}s`,
      visual: `${analysis.mood} scene depicting ${analysis.keyThemes[i % analysis.keyThemes.length]}`,
      purpose: ['SET THE MOOD', 'BUILD ATMOSPHERE', 'SHIFT EMOTION', 'DEEPEN FOCUS', 'CLOSE THE SCENE'][i % 5],
      camera: 'Gentle pan',
      asset: 'UPLOADED',
      copy: '',
    });
  }
  return {
    title: `${analysis.mood} ${analysis.genre}`,
    duration,
    narrativeArc: analysis.narrativeArc,
    emotionalGoal: `Feel ${analysis.mood.toLowerCase()}`,
    visualDirection: analysis.visualStyle,
    rhythm: 'Steady',
    assetLogic: 'User-uploaded assets',
    shots,
  };
}

// 导出配置（调试用）
export { CONFIG as AI_CONFIG };
