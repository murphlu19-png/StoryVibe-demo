import type { MockDemoScenarioId } from '@/lib/mockDemoScenarios';

export type GuidedStageKey = 'MOOD' | 'FOCUS' | 'STORY' | 'VISUALS' | 'EXPRESSION';
export type GuidedStageStatus = 'completed' | 'active' | 'upcoming';

export type GuidedStageItem = {
  key: GuidedStageKey;
  label: GuidedStageKey;
  status: GuidedStageStatus;
};

type ScenarioStageConfig = {
  questionStages: GuidedStageKey[];
  lockedCompleted: GuidedStageKey[];
};

export const FIXED_GUIDED_STAGES: GuidedStageKey[] = ['MOOD', 'FOCUS', 'STORY', 'VISUALS', 'EXPRESSION'];

const SCENARIO_STAGE_CONFIG: Record<MockDemoScenarioId, ScenarioStageConfig> = {
  backrooms_vlog_fuzzy_no_asset: {
    questionStages: ['MOOD', 'FOCUS', 'STORY', 'VISUALS', 'EXPRESSION', 'EXPRESSION'],
    lockedCompleted: [],
  },
  dream_video_with_assets: {
    questionStages: ['MOOD', 'STORY', 'VISUALS', 'EXPRESSION'],
    lockedCompleted: ['FOCUS'],
  },
  fragrance_ad_script_with_assets: {
    questionStages: ['FOCUS', 'VISUALS', 'EXPRESSION'],
    lockedCompleted: ['MOOD', 'STORY'],
  },
};

export function getScenarioStageMapping(scenarioId: MockDemoScenarioId): ScenarioStageConfig {
  return SCENARIO_STAGE_CONFIG[scenarioId];
}

export function getQuestionStageKey(
  scenarioId: MockDemoScenarioId,
  questionIndex: number,
): GuidedStageKey {
  const mapping = getScenarioStageMapping(scenarioId).questionStages;
  return mapping[Math.max(0, Math.min(questionIndex, mapping.length - 1))];
}

export function getGuidedStageItems(
  scenarioId: MockDemoScenarioId,
  questionIndex: number,
): GuidedStageItem[] {
  const { questionStages, lockedCompleted } = getScenarioStageMapping(scenarioId);
  const activeStage = getQuestionStageKey(scenarioId, questionIndex);
  const completedStages = new Set<GuidedStageKey>(lockedCompleted);

  questionStages.slice(0, questionIndex).forEach((stageKey) => {
    completedStages.add(stageKey);
  });
  completedStages.delete(activeStage);

  return FIXED_GUIDED_STAGES.map((stageKey) => ({
    key: stageKey,
    label: stageKey,
    status: completedStages.has(stageKey)
      ? 'completed'
      : stageKey === activeStage
        ? 'active'
        : 'upcoming',
  }));
}
