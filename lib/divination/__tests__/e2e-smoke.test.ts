import { describe, it, expect } from "vitest";
import { assembleDailyReading } from "../reading/assemble";
import { MoshierAstrologyProvider } from "../astrology/ephemeris";
import { SynthesisEngine } from "../../synthesis/engine";

describe("E2E Smoke: Plan 1 + Plan 2", () => {
  const astro = new MoshierAstrologyProvider();
  const engine = new SynthesisEngine();

  it("full pipeline produces non-empty Reading", async () => {
    const readingInput = assembleDailyReading({
      userId: "smoke-test-user",
      date: "2026-06-18",
      birth: { date: "2000-01-01" },
      name: "Taro Yamada",
      astrology: astro,
    });
    const reading = await engine.compose(readingInput);
    expect(reading.date).toBe("2026-06-18");
    expect(reading.sections.situation.length).toBeGreaterThan(0);
    expect(reading.sections.message.length).toBeGreaterThan(0);
    expect(reading.sections.action.length).toBeGreaterThan(0);
    expect(["template", "foundation"]).toContain(reading.tier);
  });

  it("sun sign is correct for 2000-01-01", async () => {
    const readingInput = assembleDailyReading({
      userId: "smoke-test-user",
      date: "2026-06-18",
      birth: { date: "2000-01-01" },
      astrology: astro,
    });
    expect(readingInput.astrology.natal.sun).toBe("Capricorn");
  });
});
