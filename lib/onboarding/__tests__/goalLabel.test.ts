import { describe, it, expect } from 'vitest';
import { goalLabel, paywallHeadline, type PythielGoal } from '../goalLabel';

const FORBIDDEN_LABEL = /必ず|絶対|危険|警告|今すぐ/;
const FORBIDDEN_HEADLINE = /必ず|絶対|運命|当たる|的中/;

const GOALS: PythielGoal[] = ['love', 'work', 'self', 'future'];

describe('goalLabel', () => {
  it.each(GOALS)('returns a label for goal "%s"', (goal) => {
    const label = goalLabel(goal);
    expect(typeof label).toBe('string');
    expect(label.length).toBeGreaterThan(0);
  });

  it.each(GOALS)('label for "%s" contains no forbidden words', (goal) => {
    expect(goalLabel(goal)).not.toMatch(FORBIDDEN_LABEL);
  });
});

describe('paywallHeadline', () => {
  it.each(GOALS)('reflects goal "%s" in headline', (goal) => {
    const headline = paywallHeadline(goal);
    // PAYWALL_HEADLINES のラベル文字列を内包する
    const label = goalLabel(goal);
    // ラベルの先頭語(例: '恋愛')が見出しに含まれる
    expect(headline).toContain(label.slice(0, 2));
  });

  it('returns fallback when goal is undefined', () => {
    const headline = paywallHeadline(undefined);
    expect(headline).toBe('あなたの鑑定が完成しました');
  });

  it.each(GOALS)('headline for "%s" contains no forbidden words', (goal) => {
    expect(paywallHeadline(goal)).not.toMatch(FORBIDDEN_HEADLINE);
  });

  it('fallback headline contains no forbidden words', () => {
    expect(paywallHeadline(undefined)).not.toMatch(FORBIDDEN_HEADLINE);
  });
});
