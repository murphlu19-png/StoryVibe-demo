/**
 * 生成"为什么问这个问题"的解释文本
 * 帮助用户理解AI的决策逻辑，建立信任
 */
export function getQuestionReasoning(
  questionId: string,
  answers: Record<string, string>,
  analysis: any
): string {
  const reasonings: Record<string, (answers: Record<string, string>, analysis: any) => string> = {
    'focus': (_answers, analysis) => {
      const hasTheme = analysis?.keyThemes?.length > 0;
      return hasTheme
        ? `I detected themes like "${analysis.keyThemes[0]}" in your input. This question helps me determine whether the story should revolve around a feeling, an image, a narrative arc, or the world itself — which fundamentally changes how I structure the script.`
        : `Your input didn't clearly indicate a central anchor. This is the most important decision — it determines whether the script is emotion-driven, image-driven, story-driven, or world-driven.`;
    },
    'story': (_answers) => {
      const focus = answers['focus'];
      if (focus === 'story') return `Since you prioritized narrative structure, I need to understand the journey type to determine the dramatic arc and conflict.`;
      if (focus === 'feeling') return `Even with a mood-first approach, a subtle narrative thread helps ground the emotions. This shapes how the atmosphere evolves.`;
      return `The narrative structure provides the backbone for everything else. This determines setup, confrontation, and resolution.`;
    },
    'visuals': (_answers) => {
      const focus = answers['focus'];
      if (focus === 'image') return `Since one key visual anchors everything, the visual language determines how every shot builds toward or echoes that defining moment.`;
      return `The dominant visual approach (light, space, body, texture) determines the aesthetic DNA of every frame.`;
    },
    'expression': (_answers) => {
      const focus = answers['focus'];
      if (focus === 'feeling') return `With emotions as the protagonist, the expression method determines how those feelings are communicated — visually, through voice, music, or text.`;
      return `This determines the narrative voice and how the audience receives the story.`;
    },
    'technical': () => `Platform constraints fundamentally shape creative decisions. A 15s social clip and a 90s cinematic piece have completely different pacing, shot counts, and hooks.`,
    'vibe': () => `The emotional tone is the color palette of the entire piece. This affects lighting, pacing, music, and even the choice of shots.`,
    'confirm-focus': (_answers) => `I want to confirm my understanding before generating. If this doesn't match your vision, tell me and I'll recalibrate.`,
    'asset-analysis': () => `Your uploaded materials tell a story. I'm trying to read their DNA — mood, visual rhythm, hidden narratives — to build around them.`,
  };

  const fn = reasonings[questionId];
  if (fn) return fn(answers, analysis);
  
  // 通用fallback
  const answeredCount = Object.keys(answers).length;
  if (answeredCount === 0) {
    return `This is where we start. Your answer here will shape every decision that follows.`;
  }
  return `Based on your previous answers, this question will help refine the direction. Each answer narrows the creative space.`;
}