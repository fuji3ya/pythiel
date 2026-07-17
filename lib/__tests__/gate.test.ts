import { describe, it, expect } from 'vitest';
import {
  canViewDailyReading,
  canViewFullReading,
  canViewHistory,
  canUseQuickRune,
} from '../gate';

describe('canViewDailyReading', () => {
  it('Pro always returns true', () => {
    expect(canViewDailyReading({ isPro: true, lastReadingDate: '2026-06-19', today: '2026-06-19' })).toBe(true);
    expect(canViewDailyReading({ isPro: true, lastReadingDate: undefined, today: '2026-06-19' })).toBe(true);
  });

  it('Free returns true when lastReadingDate !== today', () => {
    expect(canViewDailyReading({ isPro: false, lastReadingDate: '2026-06-18', today: '2026-06-19' })).toBe(true);
  });

  it('Free returns true when lastReadingDate is undefined', () => {
    expect(canViewDailyReading({ isPro: false, lastReadingDate: undefined, today: '2026-06-19' })).toBe(true);
  });

  it('Free returns false when lastReadingDate === today', () => {
    expect(canViewDailyReading({ isPro: false, lastReadingDate: '2026-06-19', today: '2026-06-19' })).toBe(false);
  });
});

describe('canViewFullReading', () => {
  it('returns true for Pro', () => {
    expect(canViewFullReading(true)).toBe(true);
  });

  it('returns false for Free', () => {
    expect(canViewFullReading(false)).toBe(false);
  });
});

describe('canViewHistory', () => {
  it('returns true for Pro', () => {
    expect(canViewHistory(true)).toBe(true);
  });

  it('returns false for Free', () => {
    expect(canViewHistory(false)).toBe(false);
  });
});

describe('canUseQuickRune', () => {
  it('returns true for Pro', () => {
    expect(canUseQuickRune(true)).toBe(true);
  });

  it('returns false for Free', () => {
    expect(canUseQuickRune(false)).toBe(false);
  });
});
