// react-native-purchases 10.2.2 (確認: 2026-06-19) — initPurchases/addCustomerInfoUpdateListener/getOfferings/purchasePackage/restorePurchases/getCustomerInfo 使用
/**
 * ════════════════════════════════════════════════════════════════════════════
 *  CANONICAL HARDENED IAP MODULE — Expo + RevenueCat (starving-effort 標準)
 * ════════════════════════════════════════════════════════════════════════════
 *
 *  これは「課金で二度と同じバグに当たらない」ための単一正本。新しい Expo アプリは
 *  このファイルを `lib/purchases.ts` にコピーし、下の CONFIG だけ埋める。ロジックは
 *  触らない。2026-06-09 の 5周監査で出た CRITICAL を全部この1ファイルに封じてある:
 *
 *    ✅ mock は __DEV__ 限定 → Release で鍵が無くても "全員無料Pro" 不可能
 *    ✅ addCustomerInfoUpdateListener → Ask-to-Buy / 遅延 / network 復帰の付与漏れ無し
 *    ✅ getEntitlementStatus は null-safe → 瞬断で課金者を締め出さない(reconcile 用)
 *    ✅ pro はアプリ側で専用キーに(下の README 参照)→ lost-update race 無し
 *    ✅ getAppUserId → サーバー側 entitlement 検証に使える
 *    ✅ 商品は識別子で選択 → 誤課金無し
 *
 *  ⚠️ ビルドが鍵を inline する責任はこの module の外(CI ワークフロー)。
 *      `.env.local` に EXPO_PUBLIC_RC_API_KEY_IOS を書き、Release で空なら CI が exit 1。
 *      テンプレ: apps/_shared/iap/ci-build-env-step.yml
 *
 *  出荷ゲート: ship-ready-audit Round I(実機 sandbox walkthrough)を通すまで
 *             「収益化できる/ship した」と書かない。CI green は「買える」の証明でない。
 * ════════════════════════════════════════════════════════════════════════════
 */
import Purchases, { LOG_LEVEL, type PurchasesOffering, type PurchasesPackage } from 'react-native-purchases';
import { Platform } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

// ─── CONFIG: アプリごとに ここだけ 埋める ───────────────────────────────────
const ENTITLEMENT_ID = 'pro'; // RC dashboard の entitlement lookup_key と一致させる
const MOCK_KEY = 'pythiel:mockEntitlement'; // dev-only mock 用の AsyncStorage キー(アプリ名で prefix 推奨)
// 課金プラン → ASC/RC の store product identifier。アプリの商品に合わせて。
const PRODUCTS: Record<string, string> = {
  monthly: 'pythiel_monthly',
  annual: 'pythiel_annual',
};
const FALLBACK_PRICES: Record<string, string> = {
  monthly: '¥680 / 月',
  annual: '¥4,800 / 年',
};
// ────────────────────────────────────────────────────────────────────────────

const RC_API_KEY_IOS = process.env.EXPO_PUBLIC_RC_API_KEY_IOS;
const RC_API_KEY_ANDROID = process.env.EXPO_PUBLIC_RC_API_KEY_ANDROID;
// 🔒 mock が pro を付与できるのは DEV だけ。Release では鍵が無くても mock は発火しない
//    → 鍵抜けビルドでも "全員無料Pro" が構造的に不可能。
const MOCK_OK = __DEV__;

let initialized = false;
let listenerAdded = false;
const hasKey = () => (Platform.OS === 'ios' ? !!RC_API_KEY_IOS : !!RC_API_KEY_ANDROID);

/** 起動時に1回呼ぶ。configure + 付与リスナー登録。鍵が無ければ何もしない(mock mode)。 */
export async function initPurchases(userId?: string): Promise<void> {
  if (initialized) return;
  const key = Platform.OS === 'ios' ? RC_API_KEY_IOS : RC_API_KEY_ANDROID;
  if (!key) {
    initialized = true; // dev mock mode（Release では mock は付与しない）
    return;
  }
  Purchases.setLogLevel(__DEV__ ? LOG_LEVEL.DEBUG : LOG_LEVEL.INFO);
  await Purchases.configure({ apiKey: key, appUserID: userId });
  // 付与の瞬間を捕まえる: Ask-to-Buy 親承認 / 遅延(SCA)/ network 切れの後の reconcile。
  if (!listenerAdded) {
    listenerAdded = true;
    try {
      Purchases.addCustomerInfoUpdateListener((info) => {
        if (info.entitlements.active[ENTITLEMENT_ID]?.isActive) onProActiveCb?.();
      });
    } catch {
      listenerAdded = false;
    }
  }
  initialized = true;
}

let onProActiveCb: (() => void) | null = null;
/** pro が有効化された瞬間に呼ばれる callback を登録(_layout で setPro(true) を渡す)。 */
export function onProActive(cb: () => void): void {
  onProActiveCb = cb;
}

/** RC app-user-id。サーバー側 entitlement 検証に送る。鍵が無ければ ''。 */
export async function getAppUserId(): Promise<string> {
  if (!hasKey()) return '';
  try {
    return await Purchases.getAppUserID();
  } catch {
    return '';
  }
}

async function currentOffering(): Promise<PurchasesOffering | null> {
  if (!hasKey()) return null;
  try {
    return (await Purchases.getOfferings()).current ?? null;
  } catch {
    return null;
  }
}

function pkgFor(offering: PurchasesOffering | null, plan: string): PurchasesPackage | undefined {
  const id = PRODUCTS[plan];
  // 識別子で選択(index 決め打ちは誤課金源)。
  return offering?.availablePackages.find((p) => p.product.identifier === id);
}

/** paywall 表示用の localized 価格。鍵/offering 失敗時は FALLBACK。 */
export async function getPlanPrices(): Promise<Record<string, string>> {
  const out: Record<string, string> = { ...FALLBACK_PRICES };
  const offering = await currentOffering();
  if (!offering) return out;
  for (const plan of Object.keys(PRODUCTS)) {
    const ps = pkgFor(offering, plan)?.product.priceString;
    if (ps) out[plan] = ps;
  }
  return out;
}

/** 購入。成功で true。Release で鍵が無ければ何も付与せず false(偽購入しない)。 */
export async function purchasePlan(plan: string): Promise<boolean> {
  if (!hasKey()) {
    if (!MOCK_OK) return false; // Release without key: never fake a purchase
    await AsyncStorage.setItem(MOCK_KEY, '1');
    return true;
  }
  try {
    const pkg = pkgFor(await currentOffering(), plan);
    if (!pkg) throw new Error(`package_${plan}_not_found`);
    const { customerInfo } = await Purchases.purchasePackage(pkg);
    return customerInfo.entitlements.active[ENTITLEMENT_ID]?.isActive ?? false;
  } catch (e: any) {
    if (e?.userCancelled) return false;
    console.warn('[iap] purchase failed', e?.message);
    return false;
  }
}

/** いま pro か(gate 用)。Release で鍵が無ければ false(無料Pro にしない)。 */
export async function isPro(): Promise<boolean> {
  if (!hasKey()) return MOCK_OK && (await AsyncStorage.getItem(MOCK_KEY)) === '1';
  try {
    const info = await Purchases.getCustomerInfo();
    return info.entitlements.active[ENTITLEMENT_ID]?.isActive ?? false;
  } catch {
    return false;
  }
}

/**
 * reconcile 用の安全な entitlement 取得:
 *   true  → 有効(付与)/ false → RC が確定的に無効(失効/返金で drop)
 *   null  → 判定不能(オフライン/エラー)→ 呼び出し側はキャッシュ維持(課金者を瞬断で締め出さない)
 */
export async function getEntitlementStatus(): Promise<boolean | null> {
  if (!hasKey()) return MOCK_OK ? (await AsyncStorage.getItem(MOCK_KEY)) === '1' : false;
  try {
    const info = await Purchases.getCustomerInfo();
    return info.entitlements.active[ENTITLEMENT_ID]?.isActive ?? false;
  } catch {
    return null; // 判定不能 → downgrade しない
  }
}

/** 復元。非消耗型は特に必須(再DL/機種変)。 */
export async function restorePurchases(): Promise<boolean> {
  if (!hasKey()) return MOCK_OK ? isPro() : false;
  try {
    const info = await Purchases.restorePurchases();
    return info.entitlements.active[ENTITLEMENT_ID]?.isActive ?? false;
  } catch {
    return false;
  }
}
