import { describe, it, expect } from "vitest";
import { FoundationLayer, getDeviceTier } from "../foundation";
import type { SectionDraft } from "../types";
import type { ReadingInput } from "../../divination/reading/contract";

const dummyDraft: SectionDraft = {
  situation: "テスト状況です。",
  message: "テストメッセージです。",
  action: "テスト行動を試してみましょう。",
};
const dummyInput: ReadingInput = {
  date: "2026-06-18",
  numerology: { lifePath: 4 },
  astrology: { natal: { sun: "Capricorn" }, transits: [] },
  tarot: { card: { id: "major-0", name: "The Fool", arcana: "major", number: 0 }, reversed: false },
};

describe("getDeviceTier", () => {
  it("returns template-only in test environment", () => {
    expect(getDeviceTier()).toBe("template-only");
  });
});

describe("FoundationLayer - template-only tier", () => {
  const layer = new FoundationLayer("template-only");

  it("returns draft unchanged", async () => {
    const result = await layer.enhance(dummyDraft, dummyInput);
    expect(result).toEqual(dummyDraft);
  });

  it("idempotent", async () => {
    const a = await layer.enhance(dummyDraft, dummyInput);
    const b = await layer.enhance(dummyDraft, dummyInput);
    expect(a).toEqual(b);
  });
});

describe("FoundationLayer - foundation tier fallback", () => {
  it("falls back to draft when LLM throws", async () => {
    const layer = new FoundationLayer("foundation");
    const result = await layer.enhance(dummyDraft, dummyInput);
    expect(result).toEqual(dummyDraft);
  });
});
