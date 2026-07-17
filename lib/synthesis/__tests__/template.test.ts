import { describe, it, expect } from "vitest";
import { TemplateLayer } from "../template";
import type { ReadingInput } from "../../divination/reading/contract";

const baseInput: ReadingInput = {
  date: "2026-06-18",
  numerology: { lifePath: 4, expression: 6 },
  astrology: { natal: { sun: "Capricorn" }, transits: [{ planet: "Venus", sign: "Pisces" }] },
  tarot: { card: { id: "major-0", name: "The Fool", arcana: "major", number: 0 }, reversed: false },
};

describe("TemplateLayer", () => {
  const layer = new TemplateLayer();

  it("returns SectionDraft with situation, message, action", () => {
    const draft = layer.compose(baseInput);
    expect(typeof draft.situation).toBe("string");
    expect(typeof draft.message).toBe("string");
    expect(typeof draft.action).toBe("string");
    expect(draft.situation.length).toBeGreaterThan(0);
    expect(draft.message.length).toBeGreaterThan(0);
    expect(draft.action.length).toBeGreaterThan(0);
  });

  it("deterministic", () => {
    expect(layer.compose(baseInput)).toEqual(layer.compose(baseInput));
  });

  it("reversed tarot still produces content", () => {
    const reversed = { ...baseInput, tarot: { ...baseInput.tarot, reversed: true } };
    const draft = layer.compose(reversed);
    expect(draft.situation.length).toBeGreaterThan(0);
    expect(draft.message.length).toBeGreaterThan(0);
  });

  it("no forbidden phrases in action/message", () => {
    const draft = layer.compose(baseInput);
    const forbidden = ["必ず", "絶対", "運命", "不安", "警告", "危険"];
    for (const word of forbidden) {
      expect(draft.action).not.toContain(word);
      expect(draft.message).not.toContain(word);
    }
  });

  it("action contains actionable verb", () => {
    const draft = layer.compose(baseInput);
    expect(/しましょう|てみましょう|てみて|みては|てみる|してみ/.test(draft.action)).toBe(true);
  });
});
