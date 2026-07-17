export type PythielGoal = 'love' | 'work' | 'self' | 'future';

const GOAL_LABELS: Record<PythielGoal, string> = {
  love: '恋愛・人間関係',
  work: '仕事・キャリア',
  self: '自己理解・内省',
  future: 'これからの方向性',
};

const PAYWALL_HEADLINES: Record<PythielGoal, string> = {
  love: 'あなたの「恋愛・人間関係」の鑑定が完成しました',
  work: 'あなたの「仕事・キャリア」の鑑定が完成しました',
  self: 'あなたの「自己理解」の鑑定が完成しました',
  future: 'あなたの「これからの方向性」の鑑定が完成しました',
};

const FALLBACK_HEADLINE = 'あなたの鑑定が完成しました';

export function goalLabel(goal: PythielGoal): string {
  return GOAL_LABELS[goal];
}

export function paywallHeadline(goal: PythielGoal | undefined): string {
  if (!goal) return FALLBACK_HEADLINE;
  return PAYWALL_HEADLINES[goal];
}
