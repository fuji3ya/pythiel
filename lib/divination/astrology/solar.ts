import type { ZodiacSign } from "./types";

const SIGNS: ZodiacSign[] = [
  "Aries", "Taurus", "Gemini", "Cancer", "Leo", "Virgo",
  "Libra", "Scorpio", "Sagittarius", "Capricorn", "Aquarius", "Pisces",
];

export function eclipticLongitudeToZodiac(deg: number): ZodiacSign {
  const normalized = ((deg % 360) + 360) % 360;
  return SIGNS[Math.floor(normalized / 30)];
}
