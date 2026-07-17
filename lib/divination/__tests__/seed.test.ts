import { describe, it, expect } from "vitest";
import { seededRandom, pickIndex } from "../seed";
describe("seededRandom", () => {
  it("same input -> same sequence", () => {
    const a = seededRandom("tarot","u1","2026-06-18"); const b = seededRandom("tarot","u1","2026-06-18");
    expect(a()).toBe(b()); expect(a()).toBe(b());
  });
  it("different input -> different", () => {
    expect(seededRandom("t","u1","2026-06-18")()).not.toBe(seededRandom("t","u1","2026-06-19")());
  });
  it("pickIndex in range", () => {
    for (let i=0;i<100;i++){ const idx=pickIndex(seededRandom("x",String(i)),78); expect(idx).toBeGreaterThanOrEqual(0); expect(idx).toBeLessThan(78);} });
});
