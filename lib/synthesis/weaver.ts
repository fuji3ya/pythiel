// Weaver V3.5 — 4占術を「連結」でなく「編む」決定論的織機。
// V2 深コーパスが揃っているケースだけ起動する。欠ければ null を返し、SynthesisEngine が
// 旧 TemplateLayer にフォールバックする（既存テスト破壊防止）。
//
// V3.5 の核：
//   - element 相互作用：カード×星座×数のエレメント組み合わせ固有の読みを動的生成
//   - 月のトランジット：「今日の空」を独立セクションで
//   - 賢者の声：石井ゆかり水準（「〜かもしれません」「〜のように見えます」）。寄り添いと余白
//   - シャドウ深化：unread_truth に投影と防衛機制の指摘

import type { ReadingInput } from '../divination/reading/contract';
import type { SectionDraft } from './types';
import type {
  DeepTarot,
  DeepNumerology,
  DeepZodiacSun,
  DeepMoonTransit,
  DeepPersonalYear,
  DeepProfection,
  DeepSaturnReturn,
  DeepJupiterReturn,
  DeepThemeLens,
  Element,
} from './types.v2';
import { calculateLifeCycles } from './life-cycles';
import { detectSynchronicity, describeSynchronicity } from './decan';

import tarotDeepRaw from './corpus/tarot.v2.json';
import numerologyDeepRaw from './corpus/numerology.v2.json';
import astrologyDeepRaw from './corpus/astrology.v2.json';
import moonTransitRaw from './corpus/transit-moon.v2.json';
import personalYearRaw from './corpus/personal-year.v2.json';
import profectionRaw from './corpus/profection.v2.json';
import saturnReturnRaw from './corpus/saturn-return.v2.json';
import jupiterReturnRaw from './corpus/jupiter-return.v2.json';
import themeLensRaw from './corpus/theme-lens.v2.json';
import themeCardLensRaw from './corpus/theme-card-lens.v2.json';
import moonSignRaw from './corpus/moon-sign.v2.json';
import expressionRaw from './corpus/expression-number.v2.json';

const tarotDeep = tarotDeepRaw as Record<string, DeepTarot>;
const numerologyDeep = numerologyDeepRaw as Record<string, DeepNumerology>;
const astrologyDeep = astrologyDeepRaw as Record<string, DeepZodiacSun>;
const moonTransitDeep = moonTransitRaw as Record<string, DeepMoonTransit>;
const personalYearDeep = personalYearRaw as Record<string, DeepPersonalYear>;
const profectionDeep = profectionRaw as Record<string, DeepProfection>;
const saturnReturnDeep = saturnReturnRaw as Record<string, DeepSaturnReturn>;
const jupiterReturnDeep = jupiterReturnRaw as Record<string, DeepJupiterReturn>;
const themeLensDeep = themeLensRaw as Record<string, DeepThemeLens>;
// テーマ × エレメント × 正逆 のカード解釈（テーマ別にカードの中身をアレンジ）
const themeCardLensDeep = themeCardLensRaw as Record<string, Record<Element, { upright: string; shadow: string }>>;
// natal の月星座 → 感情の核（"scary accurate" の最重要次元）
const moonSignDeep = moonSignRaw as Record<string, string>;
// 名前の表現数 → 持って生まれた才能/表現の形（生年月日のライフパスとは別角度）
const expressionDeep = expressionRaw as Record<string, string>;

// メジャーアルカナ（番号 0-21）→ エレメント（Golden Dawn 対応）
const MAJOR_ELEMENT: Element[] = [
  'air',   // 0 The Fool
  'air',   // 1 The Magician (Mercury)
  'water', // 2 The High Priestess (Moon)
  'earth', // 3 The Empress (Venus)
  'fire',  // 4 The Emperor (Aries)
  'earth', // 5 The Hierophant (Taurus)
  'air',   // 6 The Lovers (Gemini)
  'water', // 7 The Chariot (Cancer)
  'fire',  // 8 Strength (Leo)
  'earth', // 9 The Hermit (Virgo)
  'fire',  // 10 Wheel of Fortune (Jupiter)
  'air',   // 11 Justice (Libra)
  'water', // 12 The Hanged Man (Water)
  'water', // 13 Death (Scorpio)
  'fire',  // 14 Temperance (Sagittarius)
  'earth', // 15 The Devil (Capricorn)
  'fire',  // 16 The Tower (Mars)
  'air',   // 17 The Star (Aquarius)
  'water', // 18 The Moon (Pisces)
  'fire',  // 19 The Sun (Sun)
  'fire',  // 20 Judgement (Fire)
  'earth', // 21 The World (Saturn)
];

const SUIT_ELEMENT: Record<string, Element> = {
  wands: 'fire', cups: 'water', swords: 'air', pentacles: 'earth',
};

/** カードのエレメントを返す（スート→直引き、メジャー→対応表）。 */
function cardElement(card: { arcana?: string; number?: number }): Element | null {
  if (!card) return null;
  if (card.arcana && SUIT_ELEMENT[card.arcana]) return SUIT_ELEMENT[card.arcana];
  if (card.arcana === 'major' && typeof card.number === 'number' && MAJOR_ELEMENT[card.number]) {
    return MAJOR_ELEMENT[card.number];
  }
  return null;
}

/** SectionDraft の3フィールドに収まらない分は extras で持つ。 */
export interface WeaveResult {
  sections: SectionDraft;
  extras: {
    profile_headline: string;  // V6: 鑑定冒頭の鋭い一撃（scary accurate の punch）
    profile: string;
    consult_question: string; // V5: 今日の相談テーマの問い（テーマ選択時のみ）
    consult_opening: string;  // V5: 相談の枠づけ（引いたカード＋テーマ）
    consult_answer: string;   // V5: 相談への答え（カードの助言＋テーマ固有の締め）
    life_context: string;     // V4: 人生の文脈（Personal Year + Profection + Saturn/Jupiter Return）
    sky_today: string;        // 今日の空（月のトランジット）
    synchronicity: string;    // V4: デカン同期検出（カードのデカンに今天体がいるか）
    interaction: string;      // V3.5: タロット×星座×数の組み合わせ固有の読み
    unread_headline: string;  // V6: 本音セクションの鋭い一撃
    unread_truth: string;
    prediction: string;
  };
}

// ── 日本語星座名（重複を消すヘルパ） ────────────────────
const SIGN_JP: Record<string, string> = {
  Aries: '牡羊座', Taurus: '牡牛座', Gemini: '双子座', Cancer: '蟹座',
  Leo: '獅子座', Virgo: '乙女座', Libra: '天秤座', Scorpio: '蠍座',
  Sagittarius: '射手座', Capricorn: '山羊座', Aquarius: '水瓶座', Pisces: '魚座',
};

const ELEMENT_JP: Record<Element, string> = {
  fire: '火', water: '水', air: '風', earth: '土',
};

const ELEMENT_BODY: Record<Element, string> = {
  fire: '炎', water: '海', air: '空気', earth: '大地',
};

/** カード×星座のエレメント相互作用の読みを動的生成。 */
function tarotZodiacInteraction(
  tarot: DeepTarot,
  sun: DeepZodiacSun,
  cardName: string,
  signKey: string,
): string {
  const signJp = SIGN_JP[signKey] || signKey;
  const cardEl = tarot.element;
  const sunEl = sun.element;
  const cardElBody = ELEMENT_BODY[cardEl];
  const sunElBody = ELEMENT_BODY[sunEl];

  // 声(research/08): 断定でなく余白。Golden Dawn の元素品位(research/05,09)を下敷きに。

  // 同一エレメント：共鳴（dignity: 強い強化）
  if (cardEl === sunEl) {
    return `${signJp}のあなたに、同じ${ELEMENT_JP[sunEl]}の質を持つ${cardName}が訪れました。占いの言葉でいう「共鳴」です。あなたの中にもともとある${sunElBody}と、カードが運んできた${cardElBody}が、そっと同じ調子で響き合う。だから今日は、ふだんなら見過ごしてしまう小さなことが、いつもより少し鮮やかに感じられるのかもしれません。`;
  }

  // 火↔水・風↔土：対極（dignity: 敵対＝最も成長を生む緊張。Square と同型）
  if (
    (cardEl === 'fire' && sunEl === 'water') || (cardEl === 'water' && sunEl === 'fire') ||
    (cardEl === 'air' && sunEl === 'earth') || (cardEl === 'earth' && sunEl === 'air')
  ) {
    return `${signJp}のあなたのところへ、性質の異なる${cardName}が届きました。${ELEMENT_JP[sunEl]}と${ELEMENT_JP[cardEl]}——古い占星術ではこれを、最も緊張をはらむ取り合わせとしてきました。けれど、それは壊し合うためではないのだと思います。あなたの${sunElBody}に異質な${cardElBody}が触れることで、立ちのぼる湯気のように、何かが形を変えて見えてくる。引っかかりを感じる日ほど、いちばん深く育つ日でもあるのです。`;
  }

  // 火⇄風（友和・active）：拡張
  if ((cardEl === 'fire' && sunEl === 'air') || (cardEl === 'air' && sunEl === 'fire')) {
    return `${signJp}のあなたに、${cardName}が風を送るように広がっていきます。${ELEMENT_JP[cardEl]}と${ELEMENT_JP[sunEl]}は、互いを大きくしてくれる相性。今日はあなたの中の何かが、ふだんより少し大きく膨らむかもしれません。それはきっと心強いこと。ただ、勢いに乗りすぎないよう、ときどき足元を見るくらいでちょうどいいのだと思います。`;
  }

  // 水⇄土（友和・passive）：育み
  return `${signJp}のあなたのもとへ、${cardName}が静かに染み込んでいきます。${ELEMENT_JP[cardEl]}と${ELEMENT_JP[sunEl]}は、互いを育て合う相性。今まで形にならなかった気持ちが、今日そっと輪郭を持ちはじめるのかもしれません。あるいは、固くなりすぎていた何かが、ようやくほどけていく——そんな日のように見えます。`;
}

/** カード×数秘のエレメント相互作用：共鳴/不協和を読む。 */
function tarotNumerologyInteraction(
  tarot: DeepTarot,
  numerology: DeepNumerology,
  lifePath: number,
): string {
  const cardEl = tarot.element;
  const resonant = numerology.resonates_with.includes(cardEl);
  if (resonant) {
    return `そして、あなたのライフパス${lifePath}は、${ELEMENT_JP[cardEl]}のカードと最も響きやすい数字でもあります。今日のカードは、あなたの数字がふだんから静かに探していたものを、そっと持ってきてくれたのかもしれません。だからこそ、見て見ぬふりはしないであげてください。`;
  }
  return `ライフパス${lifePath}のあなたは、${ELEMENT_JP[cardEl]}のエネルギーを、どちらかといえば少し不得意としているところがあります。だからこそ、今日このカードが訪れたことには意味があるのだと思います。苦手な領域と向き合うだけの力は、もう、あなたの中にちゃんと育っているのですから。`;
}

/**
 * 4占術の深コーパスが揃っていれば物語アークを編む。
 * 1つでも欠ければ null を返す（呼び出し側がテンプレ層にフォールバック）。
 */
export function weave(input: ReadingInput): WeaveResult | null {
  const tarotKey = `${input.tarot.card.id}:${input.tarot.reversed}`;
  const tarot = tarotDeep[tarotKey];
  const numKey = String(input.numerology.lifePath);
  const numerology = numerologyDeep[numKey];
  const sunKey = input.astrology.natal.sun;
  const sun = astrologyDeep[sunKey];

  if (!tarot || !numerology || !sun) return null;

  // タロットの正/逆で「本質的意味」のフィールドが変わる
  const tarotEssence = input.tarot.reversed ? tarot.shadow : tarot.upright;
  const cardName = input.tarot.card.name;

  // ── 今日の月のトランジット ──────────────────────────────
  const moonTransit = input.astrology.transits.find((t) => t.planet === 'Moon');
  const moonData = moonTransit ? moonTransitDeep[moonTransit.sign] : undefined;
  const moonSignJp = moonTransit ? (SIGN_JP[moonTransit.sign] || moonTransit.sign) : '';

  // ── 1. profile：オープニング＋言い当て＋月の影響（賢者の声） ───────
  // 声の方針（research/08）: 神託でなく「隣で一緒に星を読む賢者」。断定でなく余白。
  // 鋭い一撃（scary accurate の punch）。冒頭に大きく置く。
  const profile_headline = sun.headline || '';

  const profileParts: string[] = [];
  profileParts.push('まず、あなたという人のことを、少しだけ。');
  profileParts.push(sun.hidden_drive);
  // natal の月星座＝感情の核（出生時刻があるユーザーのみ。"scary accurate" の最重要次元）
  const natalMoon = input.astrology.natal.moon;
  if (natalMoon && moonSignDeep[natalMoon]) {
    profileParts.push(moonSignDeep[natalMoon]);
  }
  profileParts.push(numerology.unspoken_struggle);
  // 名前の表現数＝持って生まれた才能の形（名前を入れたユーザーのみ。captured を consume）
  const expr = input.numerology.expression;
  if (typeof expr === 'number' && expressionDeep[String(expr)]) {
    profileParts.push(expressionDeep[String(expr)]);
  }
  if (moonData) profileParts.push(moonData.in_you);
  const profile = profileParts.join('\n\n');

  // ── 2. sky_today：今日の空 ─────────────────────────────
  const sky_today = moonData
    ? `${moonData.mood}\n\n${moonData.predicts}`
    : '';

  // ── 3. situation：今日の風景 ───────────────────────────
  const situation = [
    sun.current_season,
    tarot.now_implies,
  ].join('\n\n');

  // ── 4. interaction：V3.5 新セクション・組み合わせ固有の読み ─────
  const interactionParts: string[] = [
    tarotZodiacInteraction(tarot, sun, cardName, sunKey),
    tarotNumerologyInteraction(tarot, numerology, input.numerology.lifePath),
  ];
  const interaction = interactionParts.join('\n\n');

  // ── 5. unread_truth：本音の punch を先頭に → カードの本音 → 課題 → 月の呼応 ──
  // 長い前置きを撤去し、鋭い一撃(unspoken)を先頭へ。ドキッを遅らせない。
  const unread_headline = sun.unspoken || '';
  const unread_parts: string[] = [
    tarot.unread_truth,
    `——${sun.current_assignment}`,
  ];
  if (moonData && moonTransit) {
    unread_parts.push(
      `この感覚が今日少し強く出ているとしたら、それは偶然ではないのかもしれません。今、空では月が${moonSignJp}を通っていて、ふだんは奥にしまっている気持ちを、そっと表に運んできているように見えます。`
    );
  }
  const unread_truth = unread_parts.join('\n\n');

  // ── 6. message：本質×数秘×占星×占術根拠 ──────────────────
  const messageParts: string[] = [];
  if (tarotEssence) messageParts.push(tarotEssence);
  messageParts.push(numerology.today_lens);
  messageParts.push(sun.works_with);
  messageParts.push(`——${tarot.occult_basis}`);
  const message = messageParts.join('\n\n');

  // ── 7. prediction：未来の流れ＋タイミング＋月の動き ─────────────
  const predictionParts: string[] = [
    'これから先のことを、占いの見立てとして少しだけ。',
    tarot.prediction_arc,
    `そのきざしが訪れるとしたら——${tarot.turning_point}`,
  ];
  if (moonData) {
    predictionParts.push(`今日の月の動きも、こんなふうにささやいています——${moonData.predicts}`);
  }
  const prediction = predictionParts.join('\n\n');

  // ── 8. action：行動原理＋注意点 ────────────────────────
  const actionParts: string[] = [tarot.advice_principle];
  if (tarot.caveat) actionParts.push(`ただし、${tarot.caveat}`);
  const action = actionParts.join(' ');

  // ── 10. synchronicity: V4 デカン同期検出 ─────────────────
  // 引いたカードのデカンに、今日の天体が実際にいるか。決定論的だが「本物のシンクロ」。
  let synchronicity = '';
  const cardIdRaw = (input.tarot.card as any).id as string | undefined;
  const sync = detectSynchronicity(cardName, cardIdRaw, input.astrology.transits);
  if (sync) {
    synchronicity = describeSynchronicity(sync, cardName);
  }

  // ── 11. consultation: V5 今日の相談テーマ ─────────────────
  // ユーザーが選んだテーマ（love/work/self/future）で鑑定全体を枠づける。
  // テーマ固有の枠 ＋ 実際に引いたカードの助言 ＝「そのテーマの相談への答え」。
  let consult_question = '';
  let consult_opening = '';
  let consult_answer = '';
  const themeKey = input.theme || '';
  const lens = themeKey ? themeLensDeep[themeKey] : undefined;
  if (lens) {
    consult_question = lens.question;
    const nuance = input.tarot.reversed ? lens.whenShadow : lens.whenUpright;
    consult_opening = lens.opening.replace('{card}', cardName) + '\n\n' + nuance;

    // 相談への答え＝テーマ導入 ＋【テーマ×カードのエレメント×正逆 でアレンジした解釈】＋ テーマ締め。
    // ここがテーマ別にカードの中身を変える肝。エレメント不明時のみ generic 助言にフォールバック。
    const elem = cardElement(input.tarot.card as any);
    const themeCard = themeCardLensDeep[themeKey];
    const tcLens = elem && themeCard ? themeCard[elem] : undefined;
    const arranged = tcLens
      ? (input.tarot.reversed ? tcLens.shadow : tcLens.upright)
      : tarot.advice_principle;
    // カード固有の本質(core)を織り込んで「このカードだから」感を出す（per-card）。
    // core は各カードでユニーク → 同テーマ・同エレメントでも別カードなら別の答えになる。
    const cardCoreLine = tarot.core
      ? `今日の『${cardName}』が映すのは——${tarot.core}。`
      : '';
    consult_answer = [
      lens.guidancePrefix,
      cardCoreLine,
      arranged,
      lens.guidanceTail,
    ].filter(Boolean).join('\n\n');
  }

  // ── 9. life_context: V4 人生のサイクル位置（生年月日があるときだけ） ─
  // Personal Year + Profection House + Saturn/Jupiter Return を編む。
  // 「今日の鑑定」を「人生の長い線」の上に置く——日次の点が、線になる。
  let life_context = '';
  if (input.birthDate) {
    const cycles = calculateLifeCycles(input.birthDate, input.date);
    const py = personalYearDeep[String(cycles.personalYear)];
    const ph = profectionDeep[String(cycles.profectionHouse)];
    const parts: string[] = [];
    parts.push('そして、今年というもう少し長い時間のことも、少しだけ。');
    if (py) parts.push(py.voice);
    if (ph) parts.push(ph.voice);
    if (py) parts.push(py.invitation);
    if (ph) parts.push(ph.invitation);
    // Saturn Return（該当年齢のみ）
    if (cycles.saturnReturn.active && cycles.saturnReturn.ordinal) {
      const sr = saturnReturnDeep[cycles.saturnReturn.ordinal];
      if (sr) {
        parts.push(`そしてもう一つ、人生の大きな節目について——`);
        parts.push(sr.voice);
        parts.push(sr.invitation);
      }
    }
    // Jupiter Return（該当年齢のみ）
    if (cycles.jupiterReturn.active) {
      const jr = jupiterReturnDeep['default'];
      if (jr) {
        parts.push(jr.voice);
        parts.push(jr.invitation);
      }
    }
    life_context = parts.join('\n\n');
  }

  return {
    sections: { situation, message, action },
    extras: { profile_headline, profile, consult_question, consult_opening, consult_answer, life_context, sky_today, synchronicity, interaction, unread_headline, unread_truth, prediction },
  };
}

/** デバッグ/HTML 表示用：weaver が触ったコーパスの生データも返す。 */
export function weaveWithMeta(input: ReadingInput): (WeaveResult & {
  meta: { tarot: DeepTarot; numerology: DeepNumerology; sun: DeepZodiacSun };
}) | null {
  const tarotKey = `${input.tarot.card.id}:${input.tarot.reversed}`;
  const tarot = tarotDeep[tarotKey];
  const numerology = numerologyDeep[String(input.numerology.lifePath)];
  const sun = astrologyDeep[input.astrology.natal.sun];
  if (!tarot || !numerology || !sun) return null;
  const woven = weave(input);
  if (!woven) return null;
  return { ...woven, meta: { tarot, numerology, sun } };
}
