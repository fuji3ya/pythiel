import { describe, it, expect } from "vitest";
import { ELDER_FUTHARK } from "../runes/set";
import { quickRune } from "../runes/draw";
describe("runes", () => {
  it("24 runes", () => expect(ELDER_FUTHARK.length).toBe(24));
  it("unique ids", () => expect(new Set(ELDER_FUTHARK.map(r=>r.id)).size).toBe(24));
  it("deterministic by question+nonce", () => expect(quickRune("worry",0)).toEqual(quickRune("worry",0)));
  it("redraw by nonce", () => { const a=quickRune("q",0),b=quickRune("q",1); expect(a.rune.id===b.rune.id&&a.merkstave===b.merkstave).toBe(false); });
  it("non-invertible never merkstave", () => { for(let n=0;n<200;n++){const d=quickRune("q",n); if(!d.rune.invertible) expect(d.merkstave).toBe(false);} });
});
