import { Stack, useRouter } from 'expo-router';
import { useEffect, useState } from 'react';
import { Pressable, ScrollView, Text, TextInput, View } from 'react-native';
import { C } from '../lib/theme';
import { PythielGoal, goalLabel } from '../lib/onboarding/goalLabel';
import { loadState, saveState, completeOnboarding, PythielState } from '../store/progress';

const GOALS: PythielGoal[] = ['love', 'work', 'self', 'future'];
const PACE_OPTIONS = ['ゆっくり・自分のペースで', 'コツコツ・毎日少しずつ', 'がっつり・深く知りたい'];
const TOTAL = 5; // steps 0–4 inclusive

const BIRTH_DATE_RE = /^\d{4}-\d{2}-\d{2}$/;
const BIRTH_TIME_RE = /^\d{2}:\d{2}$/;

export default function Onboarding() {
  const router = useRouter();
  const [base, setBase] = useState<PythielState | null>(null);
  const [step, setStep] = useState(0);

  // ステップ別入力
  const [goal, setGoal] = useState<PythielGoal | undefined>(undefined);
  const [birthDate, setBirthDate] = useState('');
  const [birthTime, setBirthTime] = useState('');
  const [name, setName] = useState('');

  useEffect(() => {
    loadState().then(setBase);
  }, []);

  const next = () => setStep((s) => s + 1);
  const canNextBirth = BIRTH_DATE_RE.test(birthDate);

  const finish = async () => {
    if (!base || !goal || !birthDate) return;
    const np = completeOnboarding(base, {
      birthDate,
      birthTime: BIRTH_TIME_RE.test(birthTime) ? birthTime : undefined,
      goal,
      name: name.trim() || undefined,
    });
    await saveState(np);
    router.replace('/');
  };

  return (
    <ScrollView
      style={{ flex: 1, backgroundColor: C.navy }}
      contentContainerStyle={{ padding: 24, paddingBottom: 48, minHeight: '100%' }}
      keyboardShouldPersistTaps="handled"
    >
      <Stack.Screen options={{ headerShown: false }} />

      {/* progress dots */}
      <View style={{ flexDirection: 'row', gap: 6, marginTop: 20, marginBottom: 28 }}>
        {Array.from({ length: TOTAL }).map((_, i) => (
          <View
            key={i}
            style={{
              flex: 1,
              height: 4,
              borderRadius: 999,
              backgroundColor: i <= step ? C.gold : C.line,
            }}
          />
        ))}
      </View>

      {/* step 0: 約束見出し */}
      {step === 0 && (
        <IntroStep
          title="4つの占術が、あなたの内側を映し出す"
          sub="数秘術・タロット・ルーン・西洋占星術。すべて端末の中で。ネットに何も送りません。"
          cta="はじめる →"
          onCta={next}
        />
      )}

      {/* step 1: 目標選択 */}
      {step === 1 && (
        <View>
          <Text style={styles.question}>今、何を知りたいですか？</Text>
          {GOALS.map((g) => (
            <Pressable
              key={g}
              onPress={() => {
                setGoal(g);
                next();
              }}
              style={[styles.option, goal === g && styles.optionSelected]}
            >
              <Text style={[styles.optionText, goal === g && styles.optionTextSelected]}>
                {goalLabel(g)}
              </Text>
            </Pressable>
          ))}
        </View>
      )}

      {/* step 2: 生年月日入力 */}
      {step === 2 && (
        <View>
          <Text style={styles.question}>生年月日を教えてください</Text>
          <TextInput
            placeholder="YYYY-MM-DD（例: 1995-04-23）"
            placeholderTextColor={C.creamMute}
            value={birthDate}
            onChangeText={setBirthDate}
            keyboardType="numeric"
            style={styles.input}
            maxLength={10}
          />
          <Text style={[styles.subLabel, { marginTop: 16 }]}>
            時刻（任意 · 天宮図の精度を上げます）
          </Text>
          <TextInput
            placeholder="HH:MM（例: 08:30）"
            placeholderTextColor={C.creamMute}
            value={birthTime}
            onChangeText={setBirthTime}
            keyboardType="numeric"
            style={[styles.input, { marginTop: 8 }]}
            maxLength={5}
          />
          <Text style={[styles.subLabel, { marginTop: 16 }]}>
            お名前（任意 · ローマ字 · 数秘術に使います）
          </Text>
          <TextInput
            placeholder="例: TARO YAMADA"
            placeholderTextColor={C.creamMute}
            value={name}
            onChangeText={setName}
            autoCapitalize="characters"
            style={[styles.input, { marginTop: 8 }]}
          />
          <Text style={[styles.subLabel, { marginTop: 12, color: C.creamMute, fontSize: 11, lineHeight: 16 }]}>
            これらの情報は端末内にのみ保存されます。外部サーバーには送信されません。
          </Text>
          <Pressable
            onPress={next}
            disabled={!canNextBirth}
            style={[styles.cta, !canNextBirth && { opacity: 0.4 }]}
          >
            <Text style={styles.ctaText}>次へ →</Text>
          </Pressable>
        </View>
      )}

      {/* step 3: ミニ質問（投資感演出・dead field 回避のため保存しない） */}
      {step === 3 && (
        <View>
          <Text style={styles.question}>今の自分のペースは？</Text>
          {PACE_OPTIONS.map((o) => (
            <Pressable
              key={o}
              onPress={next}
              style={styles.option}
            >
              <Text style={styles.optionText}>{o}</Text>
            </Pressable>
          ))}
        </View>
      )}

      {/* step 4: 完了 */}
      {step === 4 && (
        <View>
          <Text style={[styles.question, { fontSize: 22 }]}>準備ができました</Text>
          <View style={{ marginTop: 16, backgroundColor: C.navyDeep, borderWidth: 1, borderColor: C.gold, borderRadius: 18, padding: 18 }}>
            <Recap label="テーマ" value={goal ? goalLabel(goal) : '—'} />
            <Recap label="生年月日" value={birthDate || '—'} />
            {birthTime ? <Recap label="時刻" value={birthTime} /> : null}
            {name.trim() ? <Recap label="名前" value={name.trim()} /> : null}
          </View>
          <Pressable
            onPress={finish}
            disabled={!goal || !birthDate}
            style={[styles.cta, { marginTop: 28 }, (!goal || !birthDate) && { opacity: 0.4 }]}
          >
            <Text style={styles.ctaText}>鑑定を見る →</Text>
          </Pressable>
        </View>
      )}
    </ScrollView>
  );
}

// ─── 内部コンポーネント ────────────────────────────────────────────────────────

function IntroStep({ title, sub, cta, onCta }: { title: string; sub: string; cta: string; onCta: () => void }) {
  return (
    <View>
      <Text style={{ fontSize: 48, marginBottom: 8 }}>✦</Text>
      <Text style={{ fontWeight: '900', fontSize: 24, color: C.gold, marginTop: 8, lineHeight: 32 }}>
        {title}
      </Text>
      <Text style={{ fontWeight: '600', fontSize: 15, color: C.creamMute, marginTop: 14, lineHeight: 23 }}>
        {sub}
      </Text>
      <Pressable onPress={onCta} style={styles.cta}>
        <Text style={styles.ctaText}>{cta}</Text>
      </Pressable>
    </View>
  );
}

function Recap({ label, value }: { label: string; value: string }) {
  return (
    <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginVertical: 7 }}>
      <Text style={{ fontWeight: '700', fontSize: 13, color: C.creamMute }}>{label}</Text>
      <Text style={{ fontWeight: '900', fontSize: 13, color: C.cream }}>{value}</Text>
    </View>
  );
}

// ─── 共通スタイル（Gilded Omen トークン） ─────────────────────────────────────

const styles = {
  question: {
    fontWeight: '900' as const,
    fontSize: 22,
    color: C.cream,
    marginBottom: 18,
    lineHeight: 30,
  },
  option: {
    padding: 16,
    borderRadius: 14,
    borderWidth: 1.5,
    borderColor: C.line,
    backgroundColor: C.navyDeep,
    marginBottom: 12,
  },
  optionSelected: {
    borderColor: C.gold,
    backgroundColor: C.navyDeep,
  },
  optionText: {
    fontWeight: '800' as const,
    fontSize: 16,
    color: C.cream,
  },
  optionTextSelected: {
    color: C.gold,
  },
  input: {
    borderWidth: 1.5,
    borderColor: C.line,
    borderRadius: 12,
    padding: 14,
    fontSize: 16,
    color: C.cream,
    backgroundColor: C.navyDeep,
  },
  subLabel: {
    fontWeight: '700' as const,
    fontSize: 13,
    color: C.creamMute,
  },
  cta: {
    marginTop: 28,
    backgroundColor: C.gold,
    borderRadius: 16,
    padding: 16,
    alignItems: 'center' as const,
  },
  ctaText: {
    color: C.navy,
    fontWeight: '900' as const,
    fontSize: 18,
  },
};
