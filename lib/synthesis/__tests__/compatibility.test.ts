import { describe, it, expect } from 'vitest';
import { computeCompatibility } from '../compatibility';
import { MoshierAstrologyProvider } from '../../divination/astrology/ephemeris';

const astrology = new MoshierAstrologyProvider();

const knownInput = {
  a: { birthDate: '1990-08-05' }, // Leo (fire)
  b: { birthDate: '1994-04-02' }, // Aries (fire)
  date: '2026-07-05',
};

describe('computeCompatibility', () => {
  it('is deterministic for the same input', () => {
    const r1 = computeCompatibility(knownInput, astrology);
    const r2 = computeCompatibility(knownInput, astrology);
    expect(r1.score).toBe(r2.score);
    expect(r1.band).toBe(r2.band);
  });

  it('is symmetric when a/b are swapped', () => {
    const forward = computeCompatibility(knownInput, astrology);
    const swapped = computeCompatibility(
      { a: knownInput.b, b: knownInput.a, date: knownInput.date },
      astrology
    );
    expect(swapped.score).toBe(forward.score);
    expect(swapped.elementPair).toBe(forward.elementPair);
  });

  it('matches the hand-computed known case: Leo x Aries -> fire-fire, trine', () => {
    const result = computeCompatibility(knownInput, astrology);

    expect(result.sunA).toBe('Leo');
    expect(result.sunB).toBe('Aries');
    expect(result.elementPair).toBe('fire-fire');
    expect(result.signAspect).toBe('trine');

    // lifePath(1990-08-05) = 5, lifePath(1994-04-02) = 11(master)
    // relation reduce: 5 -> 5, 11 -> 2, sum = 7 -> relationNumber = 7
    expect(result.relationNumber).toBe(7);

    // score = 50 + element(same=+20) + aspect(trine=+15) + relation(7=-5) = 80
    expect(result.score).toBe(80);
    expect(result.band).toBe(5);
  });

  it('does not crash when relation sum reduces to a master number (11)', () => {
    // lp5 + lp6 = 11: reduceToCore(11) はマスター保持 → 1-9 に必ず落とすこと（回帰）
    // 1970-05-01 = lp5, 1999-09-05 = lp6（sweep 実測で旧実装がクラッシュしたペア）
    const result = computeCompatibility(
      { a: { birthDate: '1970-05-01' }, b: { birthDate: '1999-09-05' }, date: '2026-06-24' },
      astrology
    );
    expect(result.relationNumber).toBe(2); // 11 -> 2
    expect(result.relationNumber).toBeGreaterThanOrEqual(1);
    expect(result.relationNumber).toBeLessThanOrEqual(9);
    expect(result.sections.advice.length).toBeGreaterThan(0);
  });

  it('clamps score into the 0-100 range', () => {
    // 生年月日を変えても score は常に 0-100 に収まる
    const inputs = [
      { a: { birthDate: '2000-01-01' }, b: { birthDate: '2000-01-01' }, date: '2026-07-05' },
      { a: { birthDate: '1985-03-21' }, b: { birthDate: '1962-11-30' }, date: '2026-07-05' },
      { a: { birthDate: '1999-12-31' }, b: { birthDate: '1975-06-15' }, date: '2026-07-05' },
    ];
    for (const input of inputs) {
      const result = computeCompatibility(input, astrology);
      expect(result.score).toBeGreaterThanOrEqual(0);
      expect(result.score).toBeLessThanOrEqual(100);
    }
  });
});
