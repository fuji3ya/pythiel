import { Stack } from 'expo-router';
import { useEffect } from 'react';
import { AppState, AppStateStatus, StatusBar } from 'react-native';
import { initPurchases, getEntitlementStatus } from '../lib/purchases';
import { persistPro } from '../store/progress';
import { C } from '../lib/theme';

// Reconcile the entitlement with the live RC status.
// `null` (offline / error) keeps the cached value, so a network blip never
// downgrades a paying user; a refund/expiry is dropped as soon as one online
// check succeeds. Writes ONLY the dedicated pro key — never the state blob,
// so it can't clobber an in-flight save. (nani?! 踏襲)
let reconciling = false;
async function reconcilePro() {
  if (reconciling) return; // in-flight guard: AppState 'active' can fire repeatedly
  reconciling = true;
  try {
    const status = await getEntitlementStatus();
    if (status !== null) await persistPro(status); // null = indeterminate → keep cache
  } catch (e) {
    console.warn('[pythiel] reconcilePro', (e as Error)?.message);
  } finally {
    reconciling = false;
  }
}

export default function RootLayout() {
  // Font load は Plan 4 で決める。今は system font で skeleton を繋ぐ。
  // Init RevenueCat once, reconcile on launch, then re-reconcile every time the
  // app returns to the foreground (so an expired/refunded sub drops within one
  // foreground cycle, not only on a cold launch).
  useEffect(() => {
    let mounted = true;
    (async () => {
      try {
        await initPurchases();
        if (mounted) await reconcilePro();
      } catch (e) {
        console.warn('[pythiel] purchases init', (e as Error)?.message);
      }
    })();
    const sub = AppState.addEventListener('change', (s: AppStateStatus) => {
      if (s === 'active') reconcilePro();
    });
    return () => {
      mounted = false;
      sub.remove();
    };
  }, []);

  // No phantom screens listed: expo-router discovers app/ files automatically.
  // Listing them here would create "does this route exist?" drift (nani?! コメント踏襲).
  return (
    <>
      <StatusBar barStyle="light-content" backgroundColor={C.navy} />
      <Stack
        screenOptions={{
          headerShown: false,
          contentStyle: { backgroundColor: C.navy },
        }}
      />
    </>
  );
}
