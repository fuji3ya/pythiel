import { describe, it, expect } from "vitest";
import { lifePathNumber, expressionNumber, reduceToCore } from "../numerology";
describe("numerology", () => {
  it("master numbers kept", () => { expect(reduceToCore(29)).toBe(11); expect(reduceToCore(9)).toBe(9); });
  it("lifePath 2000-01-01 -> 4", () => expect(lifePathNumber("2000-01-01")).toBe(4));
  it("lifePath 1990-12-31 -> 8", () => expect(lifePathNumber("1990-12-31")).toBe(8));
  it("expression ABC -> 6", () => expect(expressionNumber("ABC")).toBe(6));
  it("ignores non-letters", () => expect(expressionNumber("A b!c")).toBe(6));
});
