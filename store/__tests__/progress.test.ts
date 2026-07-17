import { describe, it, expect, vi, beforeEach } from 'vitest';
import {
  loadState,
  saveState,
  persistPro,
  completeOnboarding,
  resetState,
  EMPTY,
  type PythielState,
} from '../progress';

// AsyncStorage を vi.mock で差し替える。
// react-native / @react-native-async-storage/async-storage は Node で動かないため。
const store: Record<string, string> = {};

vi.mock('@react-native-async-storage/async-storage', () => ({
  default: {
    getItem: vi.fn((key: string) => Promise.resolve(store[key] ?? null)),
    setItem: vi.fn((key: string, value: string) => {
      store[key] = value;
      return Promise.resolve();
    }),
    removeItem: vi.fn((key: string) => {
      delete store[key];
      return Promise.resolve();
    }),
  },
}));

beforeEach(() => {
  // ストアをリセット
  for (const k of Object.keys(store)) delete store[k];
  vi.clearAllMocks();
});

describe('initial state', () => {
  it('loadState returns pro=false when nothing persisted', async () => {
    const s = await loadState();
    expect(s.pro).toBe(false);
    expect(s.onboarded).toBe(false);
  });
});

describe('persistPro', () => {
  it('persistPro(true) → loadState().pro === true', async () => {
    await persistPro(true);
    const s = await loadState();
    expect(s.pro).toBe(true);
  });

  it('persistPro(false) → loadState().pro === false', async () => {
    await persistPro(true);
    await persistPro(false);
    const s = await loadState();
    expect(s.pro).toBe(false);
  });
});

describe('PRO_KEY wins over blob', () => {
  it('saveState with pro:false does NOT downgrade when PRO_KEY is "1"', async () => {
    // PRO_KEY を先に true に
    await persistPro(true);
    // blob には pro:false を書く
    const p: PythielState = { ...EMPTY, pro: false, onboarded: true };
    await saveState(p);
    // loadState は PRO_KEY を優先するので pro===true のはず
    const s = await loadState();
    expect(s.pro).toBe(true);
  });
});

describe('completeOnboarding', () => {
  it('sets onboarded=true and saves birthDate/goal', async () => {
    const base: PythielState = { ...EMPTY };
    const updated = completeOnboarding(base, {
      birthDate: '1990-04-01',
      goal: 'love',
    });
    expect(updated.onboarded).toBe(true);
    expect(updated.birthDate).toBe('1990-04-01');
    expect(updated.goal).toBe('love');
  });

  it('saves optional fields when provided', () => {
    const base: PythielState = { ...EMPTY };
    const updated = completeOnboarding(base, {
      birthDate: '1990-04-01',
      birthTime: '14:30',
      birthPlace: 'Tokyo',
      goal: 'work',
      name: 'Taro',
    });
    expect(updated.birthTime).toBe('14:30');
    expect(updated.birthPlace).toBe('Tokyo');
    expect(updated.name).toBe('Taro');
  });
});

describe('resetState', () => {
  it('wipes lastReadingDate but preserves pro, onboarded, birthDate, goal', async () => {
    await persistPro(true);
    const initial: PythielState = {
      pro: true,
      onboarded: true,
      birthDate: '1990-04-01',
      goal: 'self',
      lastReadingDate: '2026-06-19',
    };
    await saveState(initial);
    const cleared = await resetState();
    expect(cleared.pro).toBe(true);          // pro はデバイス購入履歴 — 保持
    expect(cleared.onboarded).toBe(true);    // オンボーディング完了 — 保持
    expect(cleared.birthDate).toBe('1990-04-01');
    expect(cleared.goal).toBe('self');
    expect(cleared.lastReadingDate).toBeUndefined(); // 学習/履歴データは wipe
  });
});
