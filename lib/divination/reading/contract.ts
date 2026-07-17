import { PlacementSet, Transit } from "../astrology/types";
import { TarotDraw } from "../tarot/draw";
export interface ReadingInput {
  date: string;
  /** V4: 年齢サイクル計算用に保持 */
  birthDate?: string;
  /** V5: 今日の相談テーマ（love/work/self/future）。鑑定の枠づけに使う */
  theme?: string;
  numerology: { lifePath: number; expression?: number };
  astrology: { natal: PlacementSet; transits: Transit[] };
  tarot: TarotDraw;
}
