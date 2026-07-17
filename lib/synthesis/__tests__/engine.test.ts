import { describe, it, expect } from "vitest";
import { SynthesisEngine } from "../engine";
import type { ReadingInput } from "../../divination/reading/contract";

const baseInput: ReadingInput = {
  date: "2026-06-18",
  numerology: { lifePath: 4 },
  astrology: { natal: { sun: "Capricorn" }, transits: [{ planet: "Venus", sign: "Pisces" }] },
  tarot: { card: { id: "major-0", name: "The Fool", arcana: "major", number: 0 }, reversed: false },
};

describe("SynthesisEngine", () => {
  const engine = new SynthesisEngine();

  it("compose returns Reading with date and sections", async () => {
    const reading = await engine.compose(baseInput);
    expect(reading.date).toBe("2026-06-18");
    expect(typeof reading.sections.situation).toBe("string");
    expect(typeof reading.sections.message).toBe("string");
    expect(typeof reading.sections.action).toBe("string");
  });

  it("tier is template in test environment", async () => {
    const reading = await engine.compose(baseInput);
    expect(reading.tier).toBe("template");
  });

  it("sections.action is non-empty", async () => {
    const reading = await engine.compose(baseInput);
    expect(reading.sections.action.length).toBeGreaterThan(0);
  });

  it("SectionDraft shape is correct", async () => {
    const reading = await engine.compose(baseInput);
    const keys = Object.keys(reading.sections).sort();
    expect(keys).toEqual(["action", "message", "situation"]);
  });

  it("deterministic in template tier", async () => {
    const a = await engine.compose(baseInput);
    const b = await engine.compose(baseInput);
    expect(a.sections).toEqual(b.sections);
    expect(a.tier).toEqual(b.tier);
  });
});
