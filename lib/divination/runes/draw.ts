import { seededRandom, pickIndex } from "../seed";
import { ELDER_FUTHARK, Rune } from "./set";
export interface RuneDraw { rune: Rune; merkstave: boolean; }
export function quickRune(question: string, nonce: number): RuneDraw {
  const rng = seededRandom("rune", question, String(nonce));
  const rune = ELDER_FUTHARK[pickIndex(rng, ELDER_FUTHARK.length)];
  return { rune, merkstave: rune.invertible ? rng() < 0.5 : false };
}
