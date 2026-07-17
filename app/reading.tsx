import { Stack, useRouter } from 'expo-router';
import { useEffect, useState } from 'react';
import { Pressable, ScrollView, Text, View } from 'react-native';
import { C } from '../lib/theme';
import { loadState } from '../store/progress';
import { assembleDailyReading } from '../lib/divination/reading/assemble';
import { MoshierAstrologyProvider } from '../lib/divination/astrology/ephemeris';
import { SynthesisEngine } from '../lib/synthesis/engine';
import type { Reading } from '../lib/synthesis/types';
import type { ReadingInput } from '../lib/divination/reading/contract';

// ローカル日付 "YYYY-MM-DD"（index.tsx と同じヘルパ。画面層で date を生成して引数注入）
function localDateString(): string {
  const d = new Date();
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${y}-${m}-${day}`;
}

export default function ReadingScreen() {
  const router = useRouter();
  const [reading, setReading] = useState<Reading | null>(null);
  const [input, setInput] = useState<ReadingInput | null>(null);
  const [error, setError] = useState<string | null>(null);
  const today = localDateString();

  useEffect(() => {
    let cancelled = false;
    (async () => {
      const state = await loadState();
      // Pro 限定: Free なら paywall に飛ばして fail-safe gate
      if (!state.pro) {
        router.replace('/paywall' as never);
        return;
      }
      if (!state.birthDate) {
        router.replace('/onboarding' as never);
        return;
      }
      try {
        const astro = new MoshierAstrologyProvider();
        const inp = assembleDailyReading({
          userId: 'local',
          date: today,
          birth: { date: state.birthDate!, time: state.birthTime },
          name: state.name,
          astrology: astro,
        });
        const r = await new SynthesisEngine().compose(inp);
        if (!cancelled) {
          setInput(inp);
          setReading(r);
        }
      } catch (e) {
        if (!cancelled) setError('鑑定の生成に失敗しました。');
        console.warn('[pythiel] reading screen', (e as Error)?.message);
      }
    })();
    return () => { cancelled = true; };
  }, []);

  return (
    <ScrollView style={{ flex: 1, backgroundColor: C.navy }} contentContainerStyle={{ padding: 24, paddingBottom: 48 }}>
      <Stack.Screen options={{ headerShown: false }} />

      {/* ヘッダー */}
      <Pressable onPress={() => router.back()} style={{ marginBottom: 20 }}>
        <Text style={{ color: C.gold, fontWeight: '800', fontSize: 14 }}>← 戻る</Text>
      </Pressable>
      <Text style={{ fontWeight: '900', fontSize: 22, color: C.gold, marginBottom: 4 }}>
        4占術の統合鑑定
      </Text>
      <Text style={{ fontWeight: '700', fontSize: 11, color: C.creamMute, letterSpacing: 1, marginBottom: 24 }}>
        {today}
      </Text>

      {error ? (
        <View style={card}>
          <Text style={{ color: C.creamMute, fontWeight: '700', fontSize: 14 }}>{error}</Text>
        </View>
      ) : !reading || !input ? (
        <View style={[card, { alignItems: 'center', paddingVertical: 48 }]}>
          <Text style={{ color: C.creamMute, fontWeight: '700', fontSize: 14 }}>鑑定を生成中…</Text>
        </View>
      ) : (
        <>
          {/* タロット */}
          <Section title="タロット">
            <Text style={bodyText}>
              {input.tarot.card.name}
              {input.tarot.reversed ? '（逆位置）' : '（正位置）'}
            </Text>
            <Text style={[bodyText, { marginTop: 8 }]}>{reading.sections.situation}</Text>
          </Section>

          {/* 数秘術 */}
          <Section title="数秘術">
            <Row label="ライフパス数" value={String(input.numerology.lifePath)} />
            {input.numerology.expression != null && (
              <Row label="表現数" value={String(input.numerology.expression)} />
            )}
          </Section>

          {/* 占星術 */}
          <Section title="西洋占星術">
            <Row label="太陽星座" value={input.astrology.natal.sun} />
            {input.astrology.natal.moon && (
              <Row label="月星座" value={input.astrology.natal.moon} />
            )}
            {input.astrology.transits.length > 0 && (
              <View style={{ marginTop: 10 }}>
                <Text style={label}>今日のトランジット</Text>
                {input.astrology.transits.map((t, i) => (
                  <Text key={i} style={[bodyText, { marginTop: 4 }]}>
                    {t.planet} in {t.sign}{t.aspectToNatal ? ` — ${t.aspectToNatal}` : ''}
                  </Text>
                ))}
              </View>
            )}
          </Section>

          {/* 統合メッセージ（全文） */}
          <Section title="統合メッセージ">
            <Text style={[bodyText, { lineHeight: 26, fontSize: 16 }]}>{reading.sections.message}</Text>
          </Section>

          {/* アクション */}
          <Section title="今日のアクション">
            <Text style={[bodyText, { lineHeight: 24 }]}>{reading.sections.action}</Text>
          </Section>
        </>
      )}
    </ScrollView>
  );
}

// ─── 内部コンポーネント ────────────────────────────────────────────────────────

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <View style={[card, { marginBottom: 14 }]}>
      <Text style={{ fontWeight: '900', fontSize: 10, color: C.gold, letterSpacing: 1.5, marginBottom: 10 }}>
        {title.toUpperCase()}
      </Text>
      {children}
    </View>
  );
}

function Row({ label: lbl, value }: { label: string; value: string }) {
  return (
    <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginVertical: 5 }}>
      <Text style={label}>{lbl}</Text>
      <Text style={{ fontWeight: '900', fontSize: 14, color: C.cream }}>{value}</Text>
    </View>
  );
}

// ─── 共通スタイル ──────────────────────────────────────────────────────────────

const card: object = {
  backgroundColor: C.navyDeep,
  borderWidth: 1,
  borderColor: C.line,
  borderRadius: 18,
  padding: 18,
};

const bodyText: object = {
  fontWeight: '600',
  fontSize: 15,
  color: C.cream,
  lineHeight: 22,
};

const label: object = {
  fontWeight: '700',
  fontSize: 13,
  color: C.creamMute,
};
