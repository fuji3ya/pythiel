import { seededRandom, pickIndex } from "../seed";
import { TAROT_DECK, TarotCard } from "./deck";
export interface TarotDraw { card: TarotCard; reversed: boolean; }

// 引きの対象プール: 絵札(カード表面画像)が存在するカードのみ。
// 現状は大アルカナ22枚のみ絵札あり(assets/cards/major-*.jpg)。
// マイナー56枚の絵札が揃ったら TAROT_DECK 全体に戻す(1行)。
// ※ 日運を大アルカナのみで引くのはタロットの正統な流儀でもある。
const DRAW_POOL: TarotCard[] = TAROT_DECK.filter((c) => c.arcana === "major");

export function dailyTarot(userId: string, date: string): TarotDraw {
  const rng = seededRandom("tarot", userId, date);
  return { card: DRAW_POOL[pickIndex(rng, DRAW_POOL.length)], reversed: rng() < 0.5 };
}
