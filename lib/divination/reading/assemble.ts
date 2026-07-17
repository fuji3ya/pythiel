import { lifePathNumber, expressionNumber } from "../numerology";
import { dailyTarot } from "../tarot/draw";
import { AstrologyProvider, BirthInput } from "../astrology/types";
import { ReadingInput } from "./contract";
export function assembleDailyReading(opts: { userId: string; date: string; birth: BirthInput; name?: string; theme?: string; astrology: AstrologyProvider; }): ReadingInput {
  const { userId, date, birth, name, theme, astrology } = opts;
  return {
    date,
    birthDate: birth.date,
    theme,
    numerology: { lifePath: lifePathNumber(birth.date), expression: name ? expressionNumber(name) : undefined },
    astrology: { natal: astrology.natal(birth), transits: astrology.transitsFor(birth, date) },
    tarot: dailyTarot(userId, date),
  };
}
