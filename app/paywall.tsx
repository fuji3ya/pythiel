import { Stack, useRouter } from 'expo-router';
import { useEffect, useState } from 'react';
import { Linking, Pressable, ScrollView, Text, View } from 'react-native';
import { C } from '../lib/theme';
import { persistPro, loadState } from '../store/progress';
import { getPlanPrices, purchasePlan, restorePurchases } from '../lib/purchases';
import { paywallHeadline } from '../lib/onboarding/goalLabel';
import { trialCtaLines, trialSubtext, pricingHeadline } from '../lib/onboarding/trialCopy';
import type { PythielGoal } from '../lib/onboarding/goalLabel';

// TODO: 出荷前に実URLへ差し替える（Plan 5 で legal ページ作成）。
// nani は nani-japanese-legal.pages.dev を使ってる = Pythiel も同様に Plan 5 で作成予定。
const TERMS_URL = 'https://example.com/terms'; // TODO: 出荷前に実URLへ
const PRIVACY_URL = 'https://example.com/privacy'; // TODO: 出荷前に実URLへ

const PRO_PERKS: [string, string, string][] = [
  ['✦', '4占術の統合鑑定', '数秘・タロット・ルーン・占星術をひとつに'],
  ['✦', '深い鑑定文', 'あなたへの具体的なメッセージ'],
  ['✦', '鑑定履歴・カレンダー', '日々の流れを振り返る'],
  ['✦', 'クイック質問（ルーン）', 'いつでも1問1答'],
];

export default function Paywall() {
  const router = useRouter();
  const [goal, setGoal] = useState<PythielGoal | undefined>(undefined);
  const [prices, setPrices] = useState<Record<string, string>>({
    monthly: pricingHeadline('monthly'),
    annual: pricingHeadline('annual'),
  });
  const [busy, setBusy] = useState(false);
  const [note, setNote] = useState<string | null>(null);

  useEffect(() => {
    let on = true;
    loadState().then((s) => {
      if (on) setGoal(s.goal);
    });
    getPlanPrices().then((v) => { if (on) setPrices(v); }).catch(() => {});
    return () => { on = false; };
  }, []);

  const [trialLine1, trialLine2] = trialCtaLines();

  const finishPro = async () => {
    await persistPro(true);
    router.back();
  };

  const buy = async (plan: 'monthly' | 'annual') => {
    if (busy) return;
    setBusy(true);
    setNote(null);
    try {
      const ok = await purchasePlan(plan);
      if (ok) await finishPro();
      else setNote('購入が完了しませんでした。');
    } finally {
      setBusy(false);
    }
  };

  const doRestore = async () => {
    if (busy) return;
    setBusy(true);
    setNote(null);
    try {
      const ok = await restorePurchases();
      if (ok) await finishPro();
      else setNote('以前の購入が見つかりませんでした。');
    } finally {
      setBusy(false);
    }
  };

  return (
    <ScrollView
      style={{ flex: 1, backgroundColor: C.navy }}
      contentContainerStyle={{ padding: 24, paddingBottom: 48 }}
    >
      <Stack.Screen options={{ headerShown: false }} />

      {/* 見出し: goal に応じたパーソナライズコピー */}
      <Text style={{ fontSize: 36, textAlign: 'center', marginTop: 8 }}>✦</Text>
      <Text style={{ fontWeight: '900', fontSize: 22, color: C.gold, textAlign: 'center', marginTop: 10, lineHeight: 30 }}>
        {paywallHeadline(goal)}
      </Text>
      <Text style={{ fontWeight: '700', fontSize: 13, color: C.creamMute, textAlign: 'center', marginTop: 6 }}>
        Pro にアップグレードして、4占術の力を解放してください。
      </Text>

      {/* Free で今できること */}
      <View style={{ marginTop: 20, backgroundColor: C.navyDeep, borderWidth: 1, borderColor: C.line, borderRadius: 16, padding: 14 }}>
        <Text style={{ fontWeight: '900', fontSize: 10, color: C.creamMute, letterSpacing: 1 }}>
          無料プランのまま
        </Text>
        <Text style={{ fontWeight: '700', fontSize: 14, color: C.cream, marginTop: 5 }}>
          ✓ 今日のタロット1枚　✓ 今日のアクション
        </Text>
        <Text style={{ fontWeight: '600', fontSize: 13, color: C.creamMute, marginTop: 4 }}>
          無料は無料のまま。Pro は上限を外すだけ ↓
        </Text>
      </View>

      {/* Pro 特典カード */}
      <View style={{ marginTop: 16, backgroundColor: C.navyDeep, borderWidth: 1.5, borderColor: C.gold, borderRadius: 20, padding: 18 }}>
        <Text style={{ fontWeight: '900', fontSize: 16, color: C.gold, marginBottom: 10 }}>Pro でできること</Text>
        {PRO_PERKS.map(([icon, title, sub]) => (
          <View key={title} style={{ flexDirection: 'row', alignItems: 'flex-start', marginVertical: 6 }}>
            <Text style={{ fontSize: 14, color: C.gold, width: 24 }}>{icon}</Text>
            <View style={{ flex: 1 }}>
              <Text style={{ fontWeight: '800', fontSize: 15, color: C.cream }}>{title}</Text>
              <Text style={{ fontWeight: '600', fontSize: 12, color: C.creamMute, marginTop: 1 }}>{sub}</Text>
            </View>
          </View>
        ))}
      </View>

      {/* Annual primary（3日トライアル） */}
      <Pressable
        onPress={() => buy('annual')}
        disabled={busy}
        accessibilityRole="button"
        accessibilityLabel={`年額プランで購入 ${prices.annual}`}
        accessibilityState={{ disabled: busy, busy }}
        style={{
          marginTop: 24,
          backgroundColor: C.gold,
          borderRadius: 16,
          padding: 16,
          alignItems: 'center',
          opacity: busy ? 0.6 : 1,
        }}
      >
        <Text style={{ color: C.navy, fontWeight: '900', fontSize: 18 }}>
          {busy ? '処理中…' : trialLine1}
        </Text>
        <Text style={{ color: C.navy, fontWeight: '700', fontSize: 12, marginTop: 3, opacity: 0.85 }}>
          {trialLine2}
        </Text>
      </Pressable>

      {/* Monthly secondary */}
      <Pressable
        onPress={() => buy('monthly')}
        disabled={busy}
        accessibilityRole="button"
        accessibilityLabel={`月額プランで購入 ${prices.monthly}`}
        accessibilityState={{ disabled: busy, busy }}
        style={{
          marginTop: 10,
          backgroundColor: C.navyDeep,
          borderWidth: 1,
          borderColor: C.line,
          borderRadius: 16,
          padding: 14,
          alignItems: 'center',
          opacity: busy ? 0.6 : 1,
        }}
      >
        <Text style={{ color: C.cream, fontWeight: '900', fontSize: 15 }}>
          {pricingHeadline('monthly')}
        </Text>
      </Pressable>

      {!!note && (
        <Text style={{ textAlign: 'center', color: '#b3261e', fontWeight: '700', fontSize: 13, marginTop: 12 }}>
          {note}
        </Text>
      )}

      <Pressable
        onPress={doRestore}
        disabled={busy}
        accessibilityRole="button"
        accessibilityLabel="購入を復元"
        accessibilityState={{ disabled: busy, busy }}
        style={{ marginTop: 14, alignItems: 'center', padding: 8 }}
      >
        <Text style={{ fontWeight: '800', fontSize: 14, color: C.cream }}>購入を復元</Text>
      </Pressable>
      <Pressable
        onPress={() => router.back()}
        disabled={busy}
        style={{ marginTop: 2, alignItems: 'center', padding: 8 }}
      >
        <Text style={{ fontWeight: '800', fontSize: 14, color: C.creamMute }}>無料のまま使う</Text>
      </Pressable>

      {/* Apple 3.1.2(c) トライアル自動課金明示 */}
      <Text style={{ fontSize: 11, color: C.creamMute, textAlign: 'center', marginTop: 14, lineHeight: 16 }}>
        {trialSubtext()}
      </Text>

      {/* Apple 3.1.2(a) サブスク開示文 — 製品名+両期間+auto-renew+解約方法 */}
      <Text style={{ fontSize: 11, color: C.creamMute, textAlign: 'center', marginTop: 8, lineHeight: 16 }}>
        Pythiel Pro は自動更新サブスクリプションです（月額¥680 または 年額¥4,800）。料金は Apple ID
        に請求され、解約するまで毎期間更新されます。期間終了の24時間前までに Apple ID 設定からいつでも解約できます。
      </Text>

      {/* Terms / Privacy リンク */}
      <View style={{ flexDirection: 'row', justifyContent: 'center', gap: 18, marginTop: 10 }}>
        <Pressable onPress={() => Linking.openURL(TERMS_URL).catch(() => {})}>
          <Text style={{ fontSize: 12, color: C.creamMute, fontWeight: '700', textDecorationLine: 'underline' }}>
            Terms
          </Text>
        </Pressable>
        <Pressable onPress={() => Linking.openURL(PRIVACY_URL).catch(() => {})}>
          <Text style={{ fontSize: 12, color: C.creamMute, fontWeight: '700', textDecorationLine: 'underline' }}>
            Privacy
          </Text>
        </Pressable>
      </View>
    </ScrollView>
  );
}
