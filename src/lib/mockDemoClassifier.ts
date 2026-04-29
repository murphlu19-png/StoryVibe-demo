import type { MockDemoScenarioId } from '@/lib/mockDemoScenarios';

type MockDemoClassificationDetail = {
  scenarioId: MockDemoScenarioId;
  confidence: number;
  matchedSignals: string[];
  reason: string;
};

const fragranceKeywords = ['香水', 'perfume', 'fragrance', '产品', 'product', 'brand', 'logo', '广告', '投放', '品牌短片'];
const fragranceDetailKeywords = ['产品图', 'logo', '镜头', 'brief', '脚本', '品牌', 'hero shot', 'end-card', 'campaign'];
const dreamKeywords = [
  '梦',
  '梦境',
  'dream',
  'dreamlike',
  'memory',
  'memory space',
  '记忆',
  '记忆中的空间',
  '情绪',
  '情绪流动',
  'emotional flow',
  '光影',
  '模糊',
  'blurry',
  '柔和',
  '安静',
  'quiet',
  'less narrative',
  '不要太叙事化',
  'three images',
  '三张图',
];
const backroomsKeywords = ['后室', 'backrooms', '第一视角', 'pov', 'vlog', '探索', '15秒', '15 秒', '真实', '紧张'];
const vagueKeywords = ['模糊', '感觉', '想做', '想先', '帮我梳理', '大概', '一个方向'];

function normalizeInput(inputText: string): string {
  return inputText.trim().toLowerCase();
}

function collectMatches(text: string, keywords: string[]): string[] {
  return keywords.filter((keyword) => text.includes(keyword.toLowerCase()));
}

function includesAll(text: string, signals: string[]): boolean {
  return signals.every((signal) => text.includes(signal.toLowerCase()));
}

function countImageReferences(text: string): number {
  const matches = text.match(/image\s*[1-4]/gi);
  return matches ? matches.length : 0;
}

function looksLikeDetailedBrief(text: string): boolean {
  const clauses = text.split(/[。；;.!?\n]/).filter((part) => part.trim().length > 0);
  return text.length >= 90 || clauses.length >= 4;
}

function clampConfidence(value: number): number {
  return Math.max(0.2, Math.min(0.98, Number(value.toFixed(2))));
}

export function getMockDemoClassificationDetail(inputText: string, assets: unknown[] = []): MockDemoClassificationDetail {
  const text = normalizeInput(inputText);
  const assetCount = Array.isArray(assets) ? assets.length : 0;
  const imageReferenceCount = countImageReferences(text);

  const matchesExactDreamPrompt =
    includesAll(text, ['梦境', '15 秒']) &&
    includesAll(text, ['安静', '模糊', '记忆中的空间']) &&
    includesAll(text, ['image 1', 'image 2', 'image 3']) &&
    includesAll(text, ['不要太叙事化', '情绪流动']);

  const matchesExactBackroomsPrompt =
    includesAll(text, ['真人', 'vlog', '第一视角']) &&
    includesAll(text, ['后室', '探索']) &&
    includesAll(text, ['15 秒', '没有素材']) &&
    includesAll(text, ['真实', '紧张', '手机']);

  if (matchesExactDreamPrompt || (assetCount >= 3 && includesAll(text, ['梦境', 'image 1', 'image 2', 'image 3']))) {
    return {
      scenarioId: 'dream_video_with_assets',
      confidence: matchesExactDreamPrompt ? 0.97 : 0.92,
      matchedSignals: [
        'matched dream prompt pattern',
        'matched Image 1 / Image 2 / Image 3 reference structure',
        ...(assetCount >= 3 ? [`asset count >= 3 (${assetCount})`] : []),
      ],
      reason: 'Matched the dedicated dream-memory mock flow with three-image asset references and emotional-flow wording.',
    };
  }

  if (matchesExactBackroomsPrompt) {
    return {
      scenarioId: 'backrooms_vlog_fuzzy_no_asset',
      confidence: 0.96,
      matchedSignals: [
        'matched backrooms POV vlog prompt pattern',
        'matched no-asset suspense exploration structure',
      ],
      reason: 'Matched the dedicated Backrooms mock flow with first-person vlog, no-asset, and handheld suspense language.',
    };
  }

  const fragranceMatches = collectMatches(text, fragranceKeywords);
  const fragranceDetailMatches = collectMatches(text, fragranceDetailKeywords);
  const dreamMatches = collectMatches(text, dreamKeywords);
  const backroomsMatches = collectMatches(text, backroomsKeywords);
  const vagueMatches = collectMatches(text, vagueKeywords);

  const fragranceSignals: string[] = [];
  if (fragranceMatches.length > 0) {
    fragranceSignals.push(`matched fragrance keywords: ${fragranceMatches.join(', ')}`);
  }
  if (fragranceDetailMatches.length > 0) {
    fragranceSignals.push(`matched product/brief signals: ${fragranceDetailMatches.join(', ')}`);
  }
  if (assetCount >= 4) {
    fragranceSignals.push(`asset count >= 4 (${assetCount})`);
  }
  if (looksLikeDetailedBrief(text)) {
    fragranceSignals.push('prompt reads like a detailed brief or script');
  }

  if ((fragranceMatches.length >= 2 && looksLikeDetailedBrief(text)) || assetCount >= 4) {
    return {
      scenarioId: 'fragrance_ad_script_with_assets',
      confidence: clampConfidence(0.72 + fragranceMatches.length * 0.04 + fragranceDetailMatches.length * 0.03),
      matchedSignals: fragranceSignals,
      reason: 'Matched fragrance/product/brand signals with detailed brief-like commercial structure or high asset count.',
    };
  }

  const dreamSignals: string[] = [];
  if (dreamMatches.length > 0) {
    dreamSignals.push(`matched dream keywords: ${dreamMatches.join(', ')}`);
  }
  if (imageReferenceCount >= 3) {
    dreamSignals.push(`text references ${imageReferenceCount} image assets`);
  }
  if (assetCount >= 3) {
    dreamSignals.push(`asset count >= 3 (${assetCount})`);
  }
  if (fragranceMatches.length === 0) {
    dreamSignals.push('theme is not product-ad driven');
  }

  if (
    dreamMatches.length >= 2 &&
    (imageReferenceCount >= 3 || assetCount >= 3) &&
    fragranceMatches.length === 0 &&
    backroomsMatches.length === 0
  ) {
    return {
      scenarioId: 'dream_video_with_assets',
      confidence: clampConfidence(0.66 + dreamMatches.length * 0.04 + Math.min(assetCount, 4) * 0.03),
      matchedSignals: dreamSignals,
      reason: 'Matched dream / memory / emotional-flow language with three-image references while remaining clearly non-commercial and non-Backrooms.',
    };
  }

  const backroomsSignals: string[] = [];
  if (assetCount === 0) {
    backroomsSignals.push('asset count is 0');
  }
  if (backroomsMatches.length > 0) {
    backroomsSignals.push(`matched backrooms keywords: ${backroomsMatches.join(', ')}`);
  }
  if (vagueMatches.length > 0) {
    backroomsSignals.push(`matched vague prompt signals: ${vagueMatches.join(', ')}`);
  }
  if (text.length > 0 && text.length < 120) {
    backroomsSignals.push('prompt is relatively short or open-ended');
  }

  if ((assetCount === 0 && backroomsMatches.length > 0) || (assetCount === 0 && vagueMatches.length > 0)) {
    return {
      scenarioId: 'backrooms_vlog_fuzzy_no_asset',
      confidence: clampConfidence(0.58 + backroomsMatches.length * 0.05 + vagueMatches.length * 0.04),
      matchedSignals: backroomsSignals,
      reason: 'Matched a no-asset fuzzy suspense prompt with Backrooms / POV / vlog exploration signals.',
    };
  }

  return {
    scenarioId: 'backrooms_vlog_fuzzy_no_asset',
    confidence: 0.35,
    matchedSignals: ['fallback to default backrooms scenario'],
    reason: 'No stronger local rule matched, so the default mock demo scenario is returned.',
  };
}

export function classifyMockDemoScenario(inputText: string, assets: unknown[] = []): MockDemoScenarioId {
  return getMockDemoClassificationDetail(inputText, assets).scenarioId;
}
