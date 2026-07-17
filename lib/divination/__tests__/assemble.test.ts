import { describe, it, expect } from "vitest";
import { assembleDailyReading } from "../reading/assemble";
import { AstrologyProvider } from "../astrology/types";
const fakeAstro: AstrologyProvider = { natal: () => ({ sun: "Capricorn" }), transitsFor: () => [{ planet: "Venus", sign: "Pisces" }] };
describe("assembleDailyReading", () => {
  it("bundles four systems", () => {
    const r = assembleDailyReading({ userId:"u1", date:"2026-06-18", birth:{date:"2000-01-01"}, name:"Taro Yamada", astrology: fakeAstro });
    expect(r.date).toBe("2026-06-18"); expect(r.numerology.lifePath).toBe(4);
    expect(r.numerology.expression).toBeGreaterThan(0);
    expect(r.astrology.natal.sun).toBe("Capricorn"); expect(r.astrology.transits[0].planet).toBe("Venus");
    expect(r.tarot.card.id).toBeTruthy();
  });
  it("no name -> expression undefined", () => {
    const r = assembleDailyReading({ userId:"u1", date:"2026-06-18", birth:{date:"2000-01-01"}, astrology: fakeAstro });
    expect(r.numerology.expression).toBeUndefined();
  });
  it("deterministic", () => { const a={userId:"u1",date:"2026-06-18",birth:{date:"2000-01-01"},astrology:fakeAstro}; expect(assembleDailyReading(a)).toEqual(assembleDailyReading(a)); });
});
