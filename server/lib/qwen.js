import fetch from 'node-fetch';

const QWEN_API_URL = 'https://dashscope.aliyuncs.com/api/v1/services/aigc/multimodal-generation/generation';
const DEFAULT_API_KEY = 'sk-16708778b6774db68345c9b00d22e8cf';

export async function callQwenOmni(analysis, answers) {
  const apiKey = process.env.QWEN_API_KEY || DEFAULT_API_KEY;

  const prompt = buildPrompt(analysis, answers);

  const response = await fetch(QWEN_API_URL, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${apiKey}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      model: 'qwen-omni-turbo',
      input: {
        messages: [
          {
            role: 'system',
            content: [
              { type: 'text', text: 'You are a professional video script writer. Generate shot-level scripts with time ranges, visual descriptions, camera movements, purposes, and copy/dialogue. Output in structured JSON format.' }
            ]
          },
          {
            role: 'user',
            content: [
              { type: 'text', text: prompt }
            ]
          }
        ]
      },
      parameters: {
        sample_steps: 1,
        seed: 42,
      }
    }),
  });

  if (!response.ok) {
    const errText = await response.text();
    throw new Error(`Qwen API error ${response.status}: ${errText.substring(0, 200)}`);
  }

  const data = await response.json();
  const output = data.output?.choices?.[0]?.message?.content || '';

  // Try to parse JSON from output
  try {
    const parsed = JSON.parse(output);
    return normalizeScript(parsed);
  } catch {
    // If not JSON, return fallback with the text as narrative
    return generateFallbackScriptFromText(output, analysis);
  }
}

function buildPrompt(analysis, answers) {
  return `Generate a video script based on the following brief:

Genre: ${analysis?.genre || 'General'}
Mood: ${analysis?.mood || 'Neutral'}
Narrative Arc: ${analysis?.narrativeArc || 'Linear progression'}
Visual Style: ${analysis?.visualStyle || 'Modern'}
Key Themes: ${(analysis?.keyThemes || []).join(', ')}

User preferences:
Story Structure: ${answers?.story || 'gradual'}
Technical Style: ${answers?.technical || 'balanced'}
Visual Priority: ${answers?.visuals || 'light'}
Expression Style: ${answers?.expression || 'visual-only'}

Return ONLY a JSON object with this exact structure:
{
  "title": "Script Title",
  "duration": "30s",
  "shots": [
    {
      "id": "shot-1",
      "timeRange": "0-6s",
      "visual": "Visual description",
      "purpose": "SET THE MOOD",
      "camera": "Static wide",
      "asset": "GENERATED",
      "copy": "Narration or dialogue text"
    }
  ]
}`;
}

function normalizeScript(parsed) {
  const shots = (parsed.shots || []).map((s, i) => ({
    id: s.id || `shot-${i + 1}`,
    timeRange: s.timeRange || `${i * 5}-${(i + 1) * 5}s`,
    preview: s.preview || '',
    visual: s.visual || `Scene ${i + 1}`,
    purpose: s.purpose || 'SET THE MOOD',
    camera: s.camera || 'Static shot',
    asset: s.asset || 'GENERATED',
    copy: s.copy || s.dialogue || '',
  }));

  return {
    id: parsed.id || `script-${Date.now()}`,
    title: parsed.title || 'Untitled Script',
    status: 'draft',
    duration: parsed.duration || `${shots.length * 5}s`,
    version: 'v1',
    narrativeArc: parsed.narrativeArc || 'Auto-generated narrative',
    emotionalGoal: parsed.emotionalGoal || 'Engage the viewer',
    visualDirection: parsed.visualDirection || 'Modern cinematic',
    rhythm: parsed.rhythm || 'Even pacing',
    assetLogic: parsed.assetLogic || 'AI-generated assets',
    shots,
  };
}

function generateFallbackScriptFromText(text, analysis) {
  const numShots = 5;
  return {
    id: `script-${Date.now()}`,
    title: analysis?.title || 'Generated Script',
    status: 'draft',
    duration: `${numShots * 5}s`,
    version: 'v1',
    narrativeArc: text.substring(0, 200),
    emotionalGoal: analysis?.emotionalGoal || 'Engagement',
    visualDirection: analysis?.visualStyle || 'Cinematic',
    rhythm: 'Dynamic',
    assetLogic: 'AI-generated',
    shots: Array.from({ length: numShots }, (_, i) => ({
      id: `shot-${i + 1}`,
      timeRange: `${i * 5}-${(i + 1) * 5}s`,
      preview: '',
      visual: `Scene ${i + 1}: ${text.substring(i * 40, (i + 1) * 40) || 'Visual moment'}`,
      purpose: i === 0 ? 'SET THE MOOD' : i === numShots - 1 ? 'RESOLUTION' : 'BUILD',
      camera: 'Static',
      asset: 'GENERATED',
      copy: i === 0 ? text.substring(0, 60) : '',
    })),
  };
}
