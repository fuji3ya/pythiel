import AsyncStorage from '@react-native-async-storage/async-storage';

const KEY = 'pythiel:state:v1';
// `pro` lives in its OWN key, NOT inside the state blob. Two independent
// writers touch entitlement (RC reconcile on launch/foreground) and user
// data (onboarding / reading screens). Sharing one serialized blob causes a
// last-writer-wins lost-update; separate keys mean neither writer can
// clobber the other. (nani?! / jp-kotoba 踏襲)
const PRO_KEY = 'pythiel:pro';

export interface PythielState {
  pro: boolean;
  onboarded: boolean;
  birthDate?: string;   // "YYYY-MM-DD" — 鑑定生成で消費
  birthTime?: string;   // "HH:MM" 任意 — 天宮図精度向上
  birthPlace?: string;  // 任意 — 天宮図精度向上
  goal?: 'love' | 'work' | 'self' | 'future'; // 鑑定テーマ — paywall/鑑定文で消費
  name?: string;        // ローマ字名 — 数秘術で消費
  lastReadingDate?: string; // 今日の無料鑑定を最後に見た日 "YYYY-MM-DD" — freemium gate で消費
}

export const EMPTY: PythielState = {
  pro: false,
  onboarded: false,
};

export function completeOnboarding(
  p: PythielState,
  a: {
    birthDate: string;
    birthTime?: string;
    birthPlace?: string;
    goal: 'love' | 'work' | 'self' | 'future';
    name?: string;
  },
): PythielState {
  // フィールドは全て鑑定生成で消費される(dead field なし)。
  // birthTime / birthPlace / name は任意で消費先あり(天宮図 / 数秘術)。
  return {
    ...p,
    onboarded: true,
    birthDate: a.birthDate,
    birthTime: a.birthTime,
    birthPlace: a.birthPlace,
    goal: a.goal,
    name: a.name,
  };
}

/** Persist the entitlement flag to its OWN key (source of truth, separate from the state blob). */
export async function persistPro(pro: boolean): Promise<void> {
  await AsyncStorage.setItem(PRO_KEY, pro ? '1' : '0');
}

export async function loadState(): Promise<PythielState> {
  // `pro` is read from its own key and always overrides whatever a stale blob holds.
  // (PRO_KEY wins — nani?! 踏襲)
  const pro = (await AsyncStorage.getItem(PRO_KEY)) === '1';
  const raw = await AsyncStorage.getItem(KEY);
  if (!raw) return { ...EMPTY, pro };
  try {
    const parsed = JSON.parse(raw);
    return {
      ...EMPTY,
      ...parsed,
      pro, // PRO_KEY wins over the blob's (ignored) pro field
    };
  } catch {
    return { ...EMPTY, pro };
  }
}

/** Persist user data. Never the source of truth for `pro` (see persistPro). */
export async function saveState(p: PythielState): Promise<void> {
  await AsyncStorage.setItem(KEY, JSON.stringify(p));
}

/**
 * User-initiated data control (App Store 5.1.1(v)): wipe reading history and
 * transient data while preserving unlock state (`pro`, reconciled from
 * RevenueCat anyway), onboarding completion, and birth data.
 */
export async function resetState(): Promise<PythielState> {
  const p = await loadState();
  const cleared: PythielState = {
    ...EMPTY,
    pro: p.pro,
    onboarded: p.onboarded,
    birthDate: p.birthDate,
    birthTime: p.birthTime,
    birthPlace: p.birthPlace,
    goal: p.goal,
    name: p.name,
    // lastReadingDate は wipe: 学習/履歴データに相当
  };
  await saveState(cleared);
  return cleared;
}
