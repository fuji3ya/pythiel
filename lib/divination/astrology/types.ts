export type ZodiacSign = "Aries"|"Taurus"|"Gemini"|"Cancer"|"Leo"|"Virgo"|"Libra"|"Scorpio"|"Sagittarius"|"Capricorn"|"Aquarius"|"Pisces";
export interface BirthInput { date: string; time?: string; lat?: number; lon?: number; }
export interface PlacementSet { sun: ZodiacSign; moon?: ZodiacSign; ascendant?: ZodiacSign; }
export interface Transit { planet: string; sign: ZodiacSign; /** サイン内の度数 0-30（V4: デカン判定用） */ degreeInSign?: number; aspectToNatal?: string; }
export interface AstrologyProvider {
  natal(birth: BirthInput): PlacementSet;
  transitsFor(birth: BirthInput, date: string): Transit[];
}
