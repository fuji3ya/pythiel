// 相性鑑定エンジン — 2人の生年月日(+任意で出生時刻)から決定論的にスコア/バンド/文章を出す。
// 太陽星座は AstrologyProvider.natal、数秘はライフパス数を使う（既存 divination レイヤーを再利用）。

import type { AstrologyProvider } from '../divination/astrology/types';
import { lifePathNumber, reduceToCore } from '../divination/numerology';
import compatRaw from './corpus/compatibility.v2.json';

export interface CompatPerson {
  birthDate: string;
  birthTime?: string;
  name?: string;
}

export interface CompatibilityInput {
  a: CompatPerson;
  b: CompatPerson;
  date: string;
}

export type SignAspect = 'conjunct' | 'semi' | 'sextile' | 'square' | 'trine' | 'quincunx' | 'opposite';

export interface CompatibilityResult {
  score: number; // 0-100 決定論
  band: 1 | 2 | 3 | 4 | 5;
  bandLabel: string; // コーパス bands から
  elementPair: string; // 例 "fire-water"（アルファベット順 sort で正規化）
  signAspect: SignAspect;
  relationNumber: number; // 1-9
  sunA: string;
  sunB: string;
  sections: {
    essence: string;
    strength: string;
    friction: string;
    advice: string;
    flow30: string;
  };
}

type Element = 'fire' | 'earth' | 'air' | 'water';

interface ElementPairEntry {
  essence: string;
  strength: string;
  friction: string;
}

interface SignAspectEntry {
  dynamics: string;
}

interface RelationNumberEntry {
  bond: string;
}

interface BandEntry {
  label: string;
  flow30: string;
}

interface CompatibilityCorpus {
  elementPairs: Record<string, ElementPairEntry>;
  signAspects: Record<SignAspect, SignAspectEntry>;
  relationNumbers: Record<string, RelationNumberEntry>;
  bands: Record<string, BandEntry>;
}

const compat = compatRaw as CompatibilityCorpus;

// 星座 index: Aries=0 ... Pisces=11
const SIGN_ORDER: string[] = [
  'Aries', 'Taurus', 'Gemini', 'Cancer', 'Leo', 'Virgo',
  'Libra', 'Scorpio', 'Sagittarius', 'Capricorn', 'Aquarius', 'Pisces',
];

const ASPECT_BY_DISTANCE: SignAspect[] = [
  'conjunct', 'semi', 'sextile', 'square', 'trine', 'quincunx', 'opposite',
];

const ELEMENT_BY_SIGN: Record<string, Element> = {
  Aries: 'fire', Leo: 'fire', Sagittarius: 'fire',
  Taurus: 'earth', Virgo: 'earth', Capricorn: 'earth',
  Gemini: 'air', Libra: 'air', Aquarius: 'air',
  Cancer: 'water', Scorpio: 'water', Pisces: 'water',
};

const ELEMENT_SCORE: Record<string, number> = {
  'fire-fire': 20, 'earth-earth': 20, 'air-air': 20, 'water-water': 20,
  'air-fire': 15, 'earth-water': 15,
  'earth-fire': 5, 'air-water': 5,
  'fire-water': -10, 'air-earth': -10,
};

const ASPECT_SCORE: Record<SignAspect, number> = {
  trine: 15,
  sextile: 10,
  conjunct: 10,
  opposite: 5,
  semi: 0,
  quincunx: -5,
  square: -10,
};

const RELATION_SCORE: Record<number, number> = {
  1: 5, 2: 10, 3: 5, 4: 0, 5: 0, 6: 10, 7: -5, 8: 0, 9: 5,
};

/** 関係数用のマスター数リダクション: 11->2, 22->4, 33->6 */
function reduceForRelation(n: number): number {
  if (n === 11) return 2;
  if (n === 22) return 4;
  if (n === 33) return 6;
  return n;
}

function clamp(n: number, min: number, max: number): number {
  return Math.max(min, Math.min(max, n));
}

export function computeCompatibility(
  input: CompatibilityInput,
  astrology: AstrologyProvider
): CompatibilityResult {
  const sunA = astrology.natal({ date: input.a.birthDate, time: input.a.birthTime }).sun;
  const sunB = astrology.natal({ date: input.b.birthDate, time: input.b.birthTime }).sun;

  const ia = SIGN_ORDER.indexOf(sunA);
  const ib = SIGN_ORDER.indexOf(sunB);
  const distance = Math.min(((ia - ib + 12) % 12), ((ib - ia + 12) % 12));
  const signAspect = ASPECT_BY_DISTANCE[distance];

  const elemA = ELEMENT_BY_SIGN[sunA];
  const elemB = ELEMENT_BY_SIGN[sunB];
  const elementPair = [elemA, elemB].sort().join('-');

  const lpA = lifePathNumber(input.a.birthDate);
  const lpB = lifePathNumber(input.b.birthDate);
  // reduceToCore はマスター数(11/22/33)を保持するため、和が 11 になると
  // relationNumbers["11"] 不在でクラッシュする（実測: 全ペアの約9%）。
  // 関係数は必ず 1-9 に落とす — 和のリダクション後にもマスター落としを通す。
  const relationNumber = reduceForRelation(
    reduceToCore(reduceForRelation(lpA) + reduceForRelation(lpB))
  );

  let score = 50;
  score += ELEMENT_SCORE[elementPair] ?? 0;
  score += ASPECT_SCORE[signAspect];
  score += RELATION_SCORE[relationNumber] ?? 0;
  score = clamp(score, 0, 100);

  let band: 1 | 2 | 3 | 4 | 5;
  if (score < 35) band = 1;
  else if (score < 50) band = 2;
  else if (score < 65) band = 3;
  else if (score < 80) band = 4;
  else band = 5;

  const elementEntry = compat.elementPairs[elementPair];
  const aspectEntry = compat.signAspects[signAspect];
  const relationEntry = compat.relationNumbers[String(relationNumber)];
  const bandEntry = compat.bands[String(band)];

  const advice = `${aspectEntry.dynamics}\n\n${relationEntry.bond}`;

  return {
    score,
    band,
    bandLabel: bandEntry.label,
    elementPair,
    signAspect,
    relationNumber,
    sunA,
    sunB,
    sections: {
      essence: elementEntry.essence,
      strength: elementEntry.strength,
      friction: elementEntry.friction,
      advice,
      flow30: bandEntry.flow30,
    },
  };
}
