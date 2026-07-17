import { describe, it, expect } from 'vitest';
import { trialCtaLines, trialSubtext, pricingHeadline } from '../trialCopy';

const FORBIDDEN = /必ず|絶対|運命|当たる|的中/;

describe('trialCtaLines', () => {
  it('returns exactly 2 lines', () => {
    const lines = trialCtaLines();
    expect(lines).toHaveLength(2);
  });

  it('line 1 contains "無料"', () => {
    const [line1] = trialCtaLines();
    expect(line1).toContain('無料');
  });

  it('line 2 contains "自動更新" and "¥4,800"', () => {
    const [, line2] = trialCtaLines();
    expect(line2).toContain('自動更新');
    expect(line2).toContain('¥4,800');
  });
});

describe('trialSubtext', () => {
  it('contains "トライアル"', () => {
    expect(trialSubtext()).toContain('トライアル');
  });

  it('contains "自動"', () => {
    expect(trialSubtext()).toContain('自動');
  });

  it('contains "課金" or "更新" or "継続"', () => {
    const text = trialSubtext();
    const hasAny = text.includes('課金') || text.includes('更新') || text.includes('継続');
    expect(hasAny).toBe(true);
  });

  it('contains "解約"', () => {
    expect(trialSubtext()).toContain('解約');
  });
});

describe('pricingHeadline', () => {
  it('annual plan contains "¥4,800"', () => {
    expect(pricingHeadline('annual')).toContain('¥4,800');
  });

  it('monthly plan contains "¥680"', () => {
    expect(pricingHeadline('monthly')).toContain('¥680');
  });

  it('annual plan contains no forbidden words', () => {
    expect(pricingHeadline('annual')).not.toMatch(FORBIDDEN);
  });

  it('monthly plan contains no forbidden words', () => {
    expect(pricingHeadline('monthly')).not.toMatch(FORBIDDEN);
  });
});
