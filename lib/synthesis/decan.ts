// 36デカン対応テーブル + シンクロニシティ検出。
// Golden Dawn 流派・Chaldean order の伝統に基づく。
// マイナー数札36枚（各スート2-10）が黄道36の10度区分に対応。
//
// シンクロニシティ = 引いたカードのデカンに、今日の天体が実際にいる状態。
// 「決定論的に検出される本物の宇宙的呼応」。

import type { ZodiacSign, Transit } from '../divination/astrology/types';

export type PlanetName = 'Mars' | 'Sun' | 'Venus' | 'Mercury' | 'Moon' | 'Saturn' | 'Jupiter';

export interface DecanInfo {
  sign: ZodiacSign;
  decanStart: number;  // 0, 10, 20
  decanEnd: number;    // 10, 20, 30
  rulerPlanet: PlanetName;
}

/**
 * マイナー数札 → デカン対応（黄金の夜明け団準拠 / Chaldean order）
 * カードキー: 'Wands_2' のような形式
 */
export const CARD_TO_DECAN: Record<string, DecanInfo> = {
  // Aries (Mars/Sun/Venus → Wands 2/3/4)
  'Wands_2':     { sign: 'Aries',       decanStart: 0,  decanEnd: 10, rulerPlanet: 'Mars'    },
  'Wands_3':     { sign: 'Aries',       decanStart: 10, decanEnd: 20, rulerPlanet: 'Sun'     },
  'Wands_4':     { sign: 'Aries',       decanStart: 20, decanEnd: 30, rulerPlanet: 'Venus'   },
  // Taurus (Mercury/Moon/Saturn → Pentacles 5/6/7)
  'Pentacles_5': { sign: 'Taurus',      decanStart: 0,  decanEnd: 10, rulerPlanet: 'Mercury' },
  'Pentacles_6': { sign: 'Taurus',      decanStart: 10, decanEnd: 20, rulerPlanet: 'Moon'    },
  'Pentacles_7': { sign: 'Taurus',      decanStart: 20, decanEnd: 30, rulerPlanet: 'Saturn'  },
  // Gemini (Jupiter/Mars/Sun → Swords 8/9/10)
  'Swords_8':    { sign: 'Gemini',      decanStart: 0,  decanEnd: 10, rulerPlanet: 'Jupiter' },
  'Swords_9':    { sign: 'Gemini',      decanStart: 10, decanEnd: 20, rulerPlanet: 'Mars'    },
  'Swords_10':   { sign: 'Gemini',      decanStart: 20, decanEnd: 30, rulerPlanet: 'Sun'     },
  // Cancer (Venus/Mercury/Moon → Cups 2/3/4)
  'Cups_2':      { sign: 'Cancer',      decanStart: 0,  decanEnd: 10, rulerPlanet: 'Venus'   },
  'Cups_3':      { sign: 'Cancer',      decanStart: 10, decanEnd: 20, rulerPlanet: 'Mercury' },
  'Cups_4':      { sign: 'Cancer',      decanStart: 20, decanEnd: 30, rulerPlanet: 'Moon'    },
  // Leo (Saturn/Jupiter/Mars → Wands 5/6/7)
  'Wands_5':     { sign: 'Leo',         decanStart: 0,  decanEnd: 10, rulerPlanet: 'Saturn'  },
  'Wands_6':     { sign: 'Leo',         decanStart: 10, decanEnd: 20, rulerPlanet: 'Jupiter' },
  'Wands_7':     { sign: 'Leo',         decanStart: 20, decanEnd: 30, rulerPlanet: 'Mars'    },
  // Virgo (Sun/Venus/Mercury → Pentacles 8/9/10)
  'Pentacles_8': { sign: 'Virgo',       decanStart: 0,  decanEnd: 10, rulerPlanet: 'Sun'     },
  'Pentacles_9': { sign: 'Virgo',       decanStart: 10, decanEnd: 20, rulerPlanet: 'Venus'   },
  'Pentacles_10':{ sign: 'Virgo',       decanStart: 20, decanEnd: 30, rulerPlanet: 'Mercury' },
  // Libra (Moon/Saturn/Jupiter → Swords 2/3/4)
  'Swords_2':    { sign: 'Libra',       decanStart: 0,  decanEnd: 10, rulerPlanet: 'Moon'    },
  'Swords_3':    { sign: 'Libra',       decanStart: 10, decanEnd: 20, rulerPlanet: 'Saturn'  },
  'Swords_4':    { sign: 'Libra',       decanStart: 20, decanEnd: 30, rulerPlanet: 'Jupiter' },
  // Scorpio (Mars/Sun/Venus → Cups 5/6/7)
  'Cups_5':      { sign: 'Scorpio',     decanStart: 0,  decanEnd: 10, rulerPlanet: 'Mars'    },
  'Cups_6':      { sign: 'Scorpio',     decanStart: 10, decanEnd: 20, rulerPlanet: 'Sun'     },
  'Cups_7':      { sign: 'Scorpio',     decanStart: 20, decanEnd: 30, rulerPlanet: 'Venus'   },
  // Sagittarius (Mercury/Moon/Saturn → Wands 8/9/10)
  'Wands_8':     { sign: 'Sagittarius', decanStart: 0,  decanEnd: 10, rulerPlanet: 'Mercury' },
  'Wands_9':     { sign: 'Sagittarius', decanStart: 10, decanEnd: 20, rulerPlanet: 'Moon'    },
  'Wands_10':    { sign: 'Sagittarius', decanStart: 20, decanEnd: 30, rulerPlanet: 'Saturn'  },
  // Capricorn (Jupiter/Mars/Sun → Pentacles 2/3/4)
  'Pentacles_2': { sign: 'Capricorn',   decanStart: 0,  decanEnd: 10, rulerPlanet: 'Jupiter' },
  'Pentacles_3': { sign: 'Capricorn',   decanStart: 10, decanEnd: 20, rulerPlanet: 'Mars'    },
  'Pentacles_4': { sign: 'Capricorn',   decanStart: 20, decanEnd: 30, rulerPlanet: 'Sun'     },
  // Aquarius (Venus/Mercury/Moon → Swords 5/6/7)
  'Swords_5':    { sign: 'Aquarius',    decanStart: 0,  decanEnd: 10, rulerPlanet: 'Venus'   },
  'Swords_6':    { sign: 'Aquarius',    decanStart: 10, decanEnd: 20, rulerPlanet: 'Mercury' },
  'Swords_7':    { sign: 'Aquarius',    decanStart: 20, decanEnd: 30, rulerPlanet: 'Moon'    },
  // Pisces (Saturn/Jupiter/Mars → Cups 8/9/10)
  'Cups_8':      { sign: 'Pisces',      decanStart: 0,  decanEnd: 10, rulerPlanet: 'Saturn'  },
  'Cups_9':      { sign: 'Pisces',      decanStart: 10, decanEnd: 20, rulerPlanet: 'Jupiter' },
  'Cups_10':     { sign: 'Pisces',      decanStart: 20, decanEnd: 30, rulerPlanet: 'Mars'    },
};

const SUIT_FROM_NAME: Record<string, string> = {
  Wands: 'Wands', Cups: 'Cups', Swords: 'Swords', Pentacles: 'Pentacles',
  ワンド: 'Wands', カップ: 'Cups', ソード: 'Swords', ペンタクル: 'Pentacles',
};

const NUM_WORDS: Record<string, number> = {
  Two:2, Three:3, Four:4, Five:5, Six:6, Seven:7, Eight:8, Nine:9, Ten:10,
  '2':2,'3':3,'4':4,'5':5,'6':6,'7':7,'8':8,'9':9,'10':10,
};

/** カード名から DecanInfo を取得（マイナー数札のみ。コートカードと大アルカナは null） */
export function getDecanForCard(cardName: string, cardId?: string): DecanInfo | null {
  // id が "wands-2" 形式なら最優先で使う
  if (cardId) {
    const m = cardId.match(/^(wands|cups|swords|pentacles)-(\d{1,2})$/i);
    if (m) {
      const key = `${m[1].charAt(0).toUpperCase() + m[1].slice(1).toLowerCase()}_${m[2]}`;
      if (CARD_TO_DECAN[key]) return CARD_TO_DECAN[key];
    }
  }
  // 英語名 "Three of Wands" → "Wands_3"
  const en = cardName.match(/(\w+) of (Wands|Cups|Swords|Pentacles)/i);
  if (en) {
    const num = NUM_WORDS[en[1]] ?? NUM_WORDS[en[1].charAt(0).toUpperCase() + en[1].slice(1).toLowerCase()];
    if (num && num >= 2 && num <= 10) {
      const suit = en[2].charAt(0).toUpperCase() + en[2].slice(1).toLowerCase();
      return CARD_TO_DECAN[`${suit}_${num}`] || null;
    }
  }
  return null;
}

/** 日本語の星座→英語変換 */
const SIGN_JP: Record<ZodiacSign, string> = {
  Aries: '牡羊座', Taurus: '牡牛座', Gemini: '双子座', Cancer: '蟹座',
  Leo: '獅子座', Virgo: '乙女座', Libra: '天秤座', Scorpio: '蠍座',
  Sagittarius: '射手座', Capricorn: '山羊座', Aquarius: '水瓶座', Pisces: '魚座',
};

const PLANET_JP: Record<PlanetName, string> = {
  Sun: '太陽', Moon: '月', Mercury: '水星', Venus: '金星',
  Mars: '火星', Jupiter: '木星', Saturn: '土星',
};

export interface Synchronicity {
  cardDecan: DecanInfo;
  /** カードのデカン領域に、今いる天体（複数あり得る） */
  planetsInDecan: { planet: string; degreeInSign: number }[];
  /** カードの支配星が、別のサインにいたとしても、その配置 */
  rulerCurrentSign: ZodiacSign | null;
}

/**
 * シンクロニシティ検出。
 * 引いたカードのデカンに今天体がいるか + そのカードの支配星が今どこにいるか。
 */
export function detectSynchronicity(
  cardName: string,
  cardId: string | undefined,
  transits: Transit[]
): Synchronicity | null {
  const decan = getDecanForCard(cardName, cardId);
  if (!decan) return null;

  const planetsInDecan = transits
    .filter((t) =>
      t.sign === decan.sign &&
      typeof t.degreeInSign === 'number' &&
      t.degreeInSign >= decan.decanStart &&
      t.degreeInSign < decan.decanEnd
    )
    .map((t) => ({ planet: t.planet, degreeInSign: t.degreeInSign! }));

  // 支配星の現在位置（同じ名前のトランジットを探す）
  const rulerTransit = transits.find((t) => t.planet === decan.rulerPlanet);
  const rulerCurrentSign = rulerTransit?.sign ?? null;

  return { cardDecan: decan, planetsInDecan, rulerCurrentSign };
}

/** 自然言語による「シンクロニシティ説明文」を生成（賢者の声・石井ゆかり水準） */
export function describeSynchronicity(sync: Synchronicity, cardName: string): string {
  const signJp = SIGN_JP[sync.cardDecan.sign];
  const rulerJp = PLANET_JP[sync.cardDecan.rulerPlanet];
  const parts: string[] = [];

  // ハイライト1: カードのデカンに今天体が実在する場合
  if (sync.planetsInDecan.length > 0) {
    const planetNames = sync.planetsInDecan
      .map((p) => PLANET_JP[p.planet as PlanetName] || p.planet)
      .join('と');
    parts.push(
      `これは少し珍しいことかもしれません——今日、空では実際に${planetNames}が、` +
      `この「${cardName}」が司る${signJp}の${sync.cardDecan.decanStart}〜${sync.cardDecan.decanEnd}度の領域を通っているように見えます。`
    );
    parts.push(
      `黄道の36区分のうち、今日この瞬間に該当するのは10度分だけ——その小さな窓に、あなたが引いたカードと、空にある天体が、静かに重なっています。偶然と呼ぶには、少し意味のある重なりかもしれません。`
    );
  } else if (sync.rulerCurrentSign) {
    // ハイライト2: デカンに天体はいないが、支配星の現在位置を報告
    const rulerSignJp = SIGN_JP[sync.rulerCurrentSign];
    if (sync.rulerCurrentSign === sync.cardDecan.sign) {
      parts.push(
        `このカードを支配する${rulerJp}は、今日、ちょうど${rulerSignJp}を運行しているように見えます。カードの司る星座に、そのカード自身の守護星が滞在している——これは、占星術的にカードのエネルギーがふだんより強く響く配置と言われています。`
      );
    } else {
      parts.push(
        `このカードの守護星である${rulerJp}は、今日、${rulerSignJp}の領域を歩んでいます。${rulerSignJp}の質——${rulerSignJp}らしい色合いが、今回のメッセージに少し混ざるのかもしれません。`
      );
    }
  } else {
    // フォールバック：占星対応だけ伝える
    parts.push(
      `占星術の伝統では、この「${cardName}」は${signJp}の${sync.cardDecan.decanStart}〜${sync.cardDecan.decanEnd}度の領域、${rulerJp}が支配するデカンに対応しているとされます。`
    );
  }

  return parts.join('\n\n');
}
