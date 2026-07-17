// 深スキーマ V2.2 — 占術コーパスの本物の中身。1エントリ＝薄い1文ではなく、複層的データ。
// weaver.ts が組み合わせて物語アークに編む。
//
// V2.2 で追加された「価値を感じさせる」フィールド：
//   - resonance / unread_truth：「言葉にしてない本音」を突く（→ ドキッ感）
//   - prediction_arc / turning_point：未来の流れ（→ 占いの本体）
//   - hidden_drive：性格の深層（→ 言い当て感）

/** 占術エレメント。組み合わせ相互作用の判定に使う。 */
export type Element = "fire" | "water" | "air" | "earth";

/** 相談テーマ。毎日ユーザーが選ぶ「今日たずねたいこと」。 */
export type PythielTheme = "love" | "work" | "self" | "future";

/** テーマレンズ — 鑑定を「そのテーマの相談」として枠づける。 */
export interface DeepThemeLens {
  label: string;
  /** 相談の問い（ヘッダー） */
  question: string;
  /** {card} を差し込む枠づけ文 */
  opening: string;
  /** 正位置のときの一言 */
  whenUpright: string;
  /** 逆位置のときの一言 */
  whenShadow: string;
  /** 相談への答えの導入 */
  guidancePrefix: string;
  /** テーマ固有の締めの助言 */
  guidanceTail: string;
}

export interface DeepTarot {
  /** カードのエレメント（相互作用判定用） */
  element: Element;
  /** カードの本質（1行） */
  core: string;
  /** 正位置の意味（複層） — reversed=false で使う */
  upright?: string;
  /** 影/逆位置の意味 — reversed=true で使う */
  shadow?: string;
  /** 今、これが出た時の含意（読者への橋） */
  now_implies: string;
  /** 「言葉にしてない本音」— 読者がドキッとする指摘 */
  unread_truth: string;
  /** 48時間〜数週間で起きること（未来予言） */
  prediction_arc: string;
  /** 具体的な節目（曜日・タイミング感） */
  turning_point: string;
  /** なぜそう読めるのか — 占術的根拠（権威） */
  occult_basis: string;
  /** 行動原理（具体助言） */
  advice_principle: string;
  /** 注意点（盲点） */
  caveat?: string;
}

export interface DeepNumerology {
  /** この数が最も共鳴するエレメント（複数可） */
  resonates_with: Element[];
  /** この数の本質 */
  core: string;
  /** 強み */
  strength: string;
  /** 影の側面 */
  shadow: string;
  /** 言葉にしない苦しみ（性格の深層・言い当て） */
  unspoken_struggle: string;
  /** 人生のテーマ */
  life_theme: string;
  /** この数の人が今日特に見るべき視点 */
  today_lens: string;
}

export interface DeepZodiacSun {
  /** 星座のエレメント（相互作用判定用） */
  element: Element;
  /** 鋭い一撃。鑑定冒頭に大きく置く "scary accurate" の punch（短く・具体・少し痛い） */
  headline?: string;
  /** 「言葉にしてない本音」の punch。今あなたが言えていないことを鋭く一撃で */
  unspoken?: string;
  /** 太陽星座の本質 */
  core: string;
  /** 何があなたを動かしているか */
  drive: string;
  /** 表からは見えない深層動機（言い当て） */
  hidden_drive: string;
  /** 影 */
  shadow: string;
  /** 今のあなたが立っている季節（背景の風景） */
  current_season: string;
  /** 今この時期にこの星座が課されていること */
  current_assignment: string;
  /** タロット/数秘とどう響きあうかの一言（編む時のヒント） */
  works_with: string;
}

export interface DeepTransit {
  /** 今日のあなたに何が起きているか（natal は問わない汎用） */
  influence: string;
  /** 出生太陽との絡み方の素材（weaver が任意で使う） */
  weave_with_natal?: string;
}

/** Personal Year（数秘9年周期）— 「今年のテーマ」 */
export interface DeepPersonalYear {
  /** 1-9 */
  number: number;
  /** 年のテーマ（1行） */
  theme: string;
  /** 「今年のあなたは○○の年のように見えます」 */
  voice: string;
  /** 「○○することが今年のテーマかもしれません」 */
  invitation: string;
  /** 注意点（任意） */
  caveat?: string;
}

/** Annual Profections（ヘレニズム12ハウス）— 「今年の主役の領域」 */
export interface DeepProfection {
  /** 1-12 */
  house: number;
  /** ハウスの領域名（自己、お金、コミュニケーション等） */
  domain: string;
  /** ハウスの伝統的支配星 */
  ruler: string;
  /** 「今年は○○のハウスが照らされている」 */
  voice: string;
  /** 「○○に注意を向けるといいかもしれません」 */
  invitation: string;
}

/** Saturn Return — 29歳前後の人生節目 */
export interface DeepSaturnReturn {
  ordinal: 'first' | 'second' | 'third';
  ageRange: string;
  theme: string;
  voice: string;
  invitation: string;
}

/** Jupiter Return — 12年周期の拡大期 */
export interface DeepJupiterReturn {
  theme: string;
  voice: string;
  invitation: string;
}

/** 今日の月のサイン別データ。月＝感情の天気。「今日固有」感の核。 */
export interface DeepMoonTransit {
  /** 空の状態の描写（空→読者の橋） */
  mood: string;
  /** 月の影響が読者の中でどう現れるか */
  in_you: string;
  /** 月の動きから引き出せる近未来予言 */
  predicts: string;
}
