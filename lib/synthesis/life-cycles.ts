// Life Cycles — 生年月日から「あなたは今、人生のサイクルのどこにいるか」を計算する。
// 全て決定論的。リサーチ06/09に基づく。

/** 年齢計算（誕生日が今年すでに来てるかで補正） */
export function calculateAge(birthDate: string, today: string): number {
  const [by, bm, bd] = birthDate.split('-').map(Number);
  const [ty, tm, td] = today.split('-').map(Number);
  let age = ty - by;
  // 今年の誕生日がまだ来ていなければ -1
  if (tm < bm || (tm === bm && td < bd)) age--;
  return age;
}

/**
 * Personal Year（数秘 9年周期）
 * 計算: 誕生月 + 誕生日 + 今年 の各桁を還元
 * 例: 3/15 + 2026 → 3 + 6 + 10 → 19 → 10 → 1
 */
export function calculatePersonalYear(birthDate: string, today: string): number {
  const [, bm, bd] = birthDate.split('-').map(Number);
  const [ty] = today.split('-').map(Number);
  function reduce(n: number): number {
    while (n > 9) {
      n = String(n).split('').reduce((s, c) => s + Number(c), 0);
    }
    return n;
  }
  const m = reduce(bm);
  const d = reduce(bd);
  const y = reduce(ty);
  return reduce(m + d + y);
}

/**
 * Annual Profections（ヘレニズム）
 * 年齢 mod 12 + 1 → アクティブなハウス（1-12）
 * 0歳 → 1ハウス, 1歳 → 2ハウス, ..., 11歳 → 12ハウス, 12歳 → また1ハウス
 */
export function calculateProfectionHouse(age: number): number {
  return (age % 12) + 1;
}

/**
 * Saturn Return: 約29.5年周期で出生位置に戻る
 * 1st: 28-31歳 / 2nd: 57-60歳 / 3rd: 86-89歳
 */
export type SaturnReturnPhase = {
  active: boolean;
  ordinal: 'first' | 'second' | 'third' | null;
  phase: 'approaching' | 'exact' | 'departing' | null;
};
export function calculateSaturnReturn(age: number): SaturnReturnPhase {
  const centers = [29, 58, 87];
  for (let i = 0; i < centers.length; i++) {
    const c = centers[i];
    if (age >= c - 1 && age <= c + 1) {
      const ordinal = (['first', 'second', 'third'] as const)[i];
      const phase = age === c ? 'exact' : age < c ? 'approaching' : 'departing';
      return { active: true, ordinal, phase };
    }
  }
  return { active: false, ordinal: null, phase: null };
}

/**
 * Jupiter Return: 約12年周期
 * 12, 24, 36, 48, 60, 72, 84, 96 歳前後
 */
export type JupiterReturnPhase = {
  active: boolean;
  cycleNumber: number | null; // 1st = 12歳, 2nd = 24歳, ...
};
export function calculateJupiterReturn(age: number): JupiterReturnPhase {
  for (let n = 1; n * 12 <= 100; n++) {
    const center = n * 12;
    if (age === center) {
      return { active: true, cycleNumber: n };
    }
  }
  return { active: false, cycleNumber: null };
}

/**
 * 統合：すべての年齢サイクル情報を1度に返す
 */
export interface LifeCycles {
  age: number;
  personalYear: number;
  profectionHouse: number;
  saturnReturn: SaturnReturnPhase;
  jupiterReturn: JupiterReturnPhase;
}
export function calculateLifeCycles(birthDate: string, today: string): LifeCycles {
  const age = calculateAge(birthDate, today);
  return {
    age,
    personalYear: calculatePersonalYear(birthDate, today),
    profectionHouse: calculateProfectionHouse(age),
    saturnReturn: calculateSaturnReturn(age),
    jupiterReturn: calculateJupiterReturn(age),
  };
}
