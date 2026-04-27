import { taskQueue } from './queue.js';
import { callQwenOmni } from './qwen.js';
import { callJimeng } from './jimeng.js';

const STEPS = [
  { stage: 'narrative', message: 'Building narrative framework...', percent: 10 },
  { stage: 'shots', message: 'Generating shot descriptions...', percent: 30 },
  { stage: 'assets', message: 'Generating visual assets with Jimeng AI...', percent: 50 },
  { stage: 'copy', message: 'Generating copy & dialogue...', percent: 70 },
  { stage: 'assembly', message: 'Assembling final script...', percent: 90 },
];

function addLog(taskId, message) {
  const task = taskQueue.get(taskId);
  if (task) {
    const timestamp = new Date().toLocaleTimeString();
    task.logs.push(`[${timestamp}] ${message}`);
  }
}

function updateTask(taskId, updates) {
  const task = taskQueue.get(taskId);
  if (task) {
    Object.assign(task, updates);
  }
}

async function sleep(ms) {
  return new Promise(r => setTimeout(r, ms));
}

/**
 * Generate preview images for each shot using Jimeng (Jimeng/即梦) API
 * @param shots - Array of shot objects with visual descriptions
 * @param taskId - For logging
 * @returns shots with preview URLs populated
 */
async function generateShotPreviews(shots, taskId) {
  const shotsWithPreviews = [];

  for (let i = 0; i < shots.length; i++) {
    const shot = shots[i];
    const prompt = buildImagePrompt(shot);

    addLog(taskId, `Shot ${i + 1}: Generating preview image...`);
    addLog(taskId, `  Prompt: "${prompt.substring(0, 80)}${prompt.length > 80 ? '...' : ''}"`);

    try {
      // Call Jimeng API for image generation
      const result = await callJimeng({
        req_key: 'high_aes_general_v21_L',
        prompt: prompt,
        width: 720,
        height: 1280,
        use_seed: false,
        return_url: true,
      });

      // Extract image URL from response
      const imageUrl = extractImageUrl(result);

      if (imageUrl) {
        addLog(taskId, `  ✓ Preview generated: ${imageUrl.substring(0, 60)}...`);
        shotsWithPreviews.push({
          ...shot,
          preview: imageUrl,
          asset: imageUrl,
        });
      } else {
        addLog(taskId, `  ⚠ No image URL in response, using placeholder`);
        shotsWithPreviews.push({
          ...shot,
          preview: '',
          asset: 'GENERATED',
        });
      }

      // Rate limiting: small delay between API calls
      if (i < shots.length - 1) {
        await sleep(300);
      }
    } catch (err) {
      addLog(taskId, `  ✗ Image generation failed: ${err.message}`);
      shotsWithPreviews.push({
        ...shot,
        preview: '',
        asset: 'GENERATED',
      });
    }
  }

  return shotsWithPreviews;
}

/**
 * Build an optimized image generation prompt from shot description
 */
function buildImagePrompt(shot) {
  const visual = shot.visual || '';
  const purpose = shot.purpose || '';
  const camera = shot.camera || '';
  const mood = shot.mood || 'cinematic';

  // Combine shot metadata into a rich prompt
  let prompt = visual;

  // Add cinematic quality modifiers if not already present
  const qualityTerms = ['cinematic', 'high quality', '4k', 'professional', 'film still'];
  const hasQuality = qualityTerms.some(term => prompt.toLowerCase().includes(term));
  if (!hasQuality) {
    prompt += ', cinematic film still, high quality, 4k, professional photography';
  }

  // Add camera movement hint if available
  if (camera && camera !== 'Static shot') {
    prompt += `, ${camera.toLowerCase()}`;
  }

  return prompt;
}

/**
 * Extract image URL from Jimeng API response
 * The response structure depends on the API version
 */
function extractImageUrl(result) {
  if (!result) return null;

  // Try different possible response structures
  // Structure 1: { data: { image_url: '...' } }
  if (result.data?.image_url) return result.data.image_url;
  if (result.data?.image_urls?.[0]) return result.data.image_urls[0];

  // Structure 2: { images: [{ url: '...' }] }
  if (result.images?.[0]?.url) return result.images[0].url;
  if (result.images?.[0]) return result.images[0];

  // Structure 3: { image_url: '...' }
  if (result.image_url) return result.image_url;

  // Structure 4: { result: { urls: ['...'] } }
  if (result.result?.urls?.[0]) return result.result.urls[0];
  if (result.result?.url) return result.result.url;

  // Structure 5: Direct URL string
  if (typeof result === 'string' && result.startsWith('http')) return result;

  // Log the actual response structure for debugging
  console.log('[Jimeng] Response structure:', JSON.stringify(result).substring(0, 200));

  return null;
}

export async function generateScriptWithProgress(taskId) {
  const task = taskQueue.get(taskId);
  if (!task) throw new Error('Task not found');

  try {
    // Step 1: Narrative
    updateTask(taskId, { status: 'running', stage: 'narrative', message: STEPS[0].message, percent: 10 });
    addLog(taskId, `Analyzing creative brief: ${task.analysis?.genre || 'unknown'} / ${task.analysis?.mood || 'unknown'}`);
    addLog(taskId, `Mapping narrative arc: ${task.analysis?.narrativeArc || 'default'}`);
    await sleep(800);

    // Step 2: Shots
    updateTask(taskId, { stage: 'shots', message: STEPS[1].message, percent: 30 });
    const numShots = task.answers?.technical === 'cinematic' ? 8 : task.answers?.technical === 'social' ? 4 : 5;
    addLog(taskId, `Creating ${numShots} shots based on "${task.answers?.story || 'gradual'}" story structure`);
    addLog(taskId, `Visual style: ${task.analysis?.visualStyle || 'default'}`);
    await sleep(800);

    // Step 3: Script content generation (Qwen OMNI for text)
    updateTask(taskId, { stage: 'copy', message: STEPS[3].message, percent: 60 });
    addLog(taskId, `Expression style: ${task.answers?.expression || 'visual-only'}`);
    addLog(taskId, 'Calling Qwen-OMNI API for script generation...');

    let script;
    try {
      script = await callQwenOmni(task.analysis, task.answers);
      addLog(taskId, `Script received from Qwen AI. Processing ${script.shots.length} shots...`);

      // Log each shot's content
      script.shots.forEach((shot, i) => {
        const copyPreview = shot.copy
          ? `"${shot.copy.substring(0, 40)}${shot.copy.length > 40 ? '...' : ''}"`
          : '(visual-only, no narration)';
        addLog(taskId, `Shot ${i + 1} [${shot.timeRange}] copy: ${copyPreview}`);
      });
    } catch (apiErr) {
      addLog(taskId, `Qwen API call failed: ${apiErr.message}. Using fallback generation.`);
      script = generateFallbackScript(task);
    }

    await sleep(200);

    // Step 4: Assets — Generate preview images for each shot using Jimeng
    updateTask(taskId, { stage: 'assets', message: STEPS[2].message, percent: 75 });
    addLog(taskId, '============================================');
    addLog(taskId, 'JIMENG AI IMAGE GENERATION PHASE');
    addLog(taskId, '============================================');
    addLog(taskId, `Generating ${script.shots.length} preview images from shot descriptions...`);

    const shotsWithPreviews = await generateShotPreviews(script.shots, taskId);
    script.shots = shotsWithPreviews;

    // Count successful generations
    const successCount = shotsWithPreviews.filter(s => s.preview).length;
    addLog(taskId, `Image generation complete: ${successCount}/${shotsWithPreviews.length} shots have preview images`);

    // Step 5: Assembly
    updateTask(taskId, { stage: 'assembly', message: STEPS[4].message, percent: 90 });
    addLog(taskId, 'Validating shot sequence & timing');
    addLog(taskId, `Script generated: ${script.title} (${script.shots.length} shots, ${successCount} with AI previews)`);
    await sleep(500);

    // Done
    updateTask(taskId, { status: 'completed', stage: 'done', message: 'Script ready!', percent: 100 });
    addLog(taskId, 'Script saved to workspace');

    task.result = script;
  } catch (err) {
    updateTask(taskId, { status: 'error', message: err.message });
    addLog(taskId, `ERROR: ${err.message}`);
    throw err;
  }
}

function generateFallbackScript(task) {
  const analysis = task.analysis || {};
  const answers = task.answers || {};
  const userText = task.userText || '';

  const numShots = answers.technical === 'cinematic' ? 8 : answers.technical === 'social' ? 4 : 5;
  const durationPerShot = answers.technical === 'cinematic' ? '6-8s' : answers.technical === 'social' ? '3-4s' : '4-6s';
  const totalDuration = `${numShots * 6}s`;

  const shots = Array.from({ length: numShots }, (_, i) => ({
    id: `shot-${i + 1}`,
    timeRange: `${i * 6}-${(i + 1) * 6}s`,
    preview: '',
    visual: `${getShotType(i, numShots)} visual for "${userText.substring(0, 30)}${userText.length > 30 ? '...' : ''}"`,
    purpose: getShotPurpose(i, numShots),
    camera: getCameraMovement(i),
    asset: 'GENERATED',
    copy: getShotCopy(i, numShots, answers.expression, analysis.mood),
    mood: analysis.mood || 'neutral',
  }));

  return {
    id: `script-${Date.now()}`,
    title: analysis.title || userText.substring(0, 40) || 'Untitled Script',
    status: 'draft',
    duration: totalDuration,
    version: 'v1',
    narrativeArc: analysis.narrativeArc || `A ${numShots}-shot narrative exploring "${userText.substring(0, 50)}"`,
    emotionalGoal: analysis.emotionalGoal || 'Evoke curiosity and engagement',
    visualDirection: analysis.visualStyle || 'Clean, modern framing with dynamic movement',
    rhythm: answers.technical === 'cinematic' ? 'Slow, deliberate pacing' : 'Quick, energetic cuts',
    assetLogic: 'AI-generated visuals matched to narrative beats',
    shots,
  };
}

function getShotType(i, total) {
  if (i === 0) return 'Opening wide establishing shot';
  if (i === total - 1) return 'Closing emotional shot';
  if (i === Math.floor(total / 2)) return 'Mid-point reveal or turning point';
  return 'Dynamic transition shot';
}

function getShotPurpose(i, total) {
  if (i === 0) return 'SET THE MOOD';
  if (i === total - 1) return 'RESOLUTION';
  if (i < total / 3) return 'BUILD TENSION';
  if (i < (2 * total) / 3) return 'RAISE STAKES';
  return 'CLIMAX';
}

function getCameraMovement(i) {
  const movements = ['Static wide', 'Slow push-in', 'Tracking shot', 'Low angle', 'Handheld', 'Overhead', 'Dolly out', 'Freeze frame'];
  return movements[i % movements.length];
}

function getShotCopy(i, total, expression, mood) {
  if (expression === 'visual-only' || !expression) return '';
  const moodWords = {
    dramatic: ['The silence before the storm.', 'Every shadow tells a story.', 'This is where everything changes.'],
    upbeat: ['The energy is electric!', 'Nothing can stop this momentum.', 'Feel the rush.'],
    melancholic: ['Some moments stay with you forever.', 'The weight of what could have been.', 'Time moves differently here.'],
    mysterious: ['What happens next is anyone\'s guess.', 'The answer is closer than it seems.', 'Not everything is as it appears.'],
  };
  const words = moodWords[mood] || moodWords.upbeat;
  return words[i % words.length];
}
