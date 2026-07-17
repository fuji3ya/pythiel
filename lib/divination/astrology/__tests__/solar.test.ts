import { describe, it, expect } from "vitest";
import { eclipticLongitudeToZodiac } from "../solar";

describe("eclipticLongitudeToZodiac", () => {
  it("0 deg -> Aries", () => expect(eclipticLongitudeToZodiac(0)).toBe("Aries"));
  it("30 deg -> Taurus", () => expect(eclipticLongitudeToZodiac(30)).toBe("Taurus"));
  it("359 deg -> Pisces", () => expect(eclipticLongitudeToZodiac(359)).toBe("Pisces"));
  it("270 deg -> Capricorn", () => expect(eclipticLongitudeToZodiac(270)).toBe("Capricorn"));
  it("all 12 signs covered", () => {
    const signs = Array.from({ length: 12 }, (_, i) => eclipticLongitudeToZodiac(i * 30));
    expect(new Set(signs).size).toBe(12);
  });
});
