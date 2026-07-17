import { describe, it, expect } from "vitest";
import { TAROT_DECK } from "../tarot/deck";
import { dailyTarot } from "../tarot/draw";
describe("tarot", () => {
  it("78 cards", () => expect(TAROT_DECK.length).toBe(78));
  it("unique ids", () => expect(new Set(TAROT_DECK.map(c=>c.id)).size).toBe(78));
  it("22 major 56 minor", () => { expect(TAROT_DECK.filter(c=>c.arcana==="major").length).toBe(22); expect(TAROT_DECK.filter(c=>c.arcana!=="major").length).toBe(56); });
  it("daily deterministic", () => expect(dailyTarot("u1","2026-06-18")).toEqual(dailyTarot("u1","2026-06-18")));
  it("changes by day", () => { const a=dailyTarot("u1","2026-06-18"),b=dailyTarot("u1","2026-06-19"); expect(a.card.id===b.card.id&&a.reversed===b.reversed).toBe(false); });
  it("draws only cards that have face art (majors, until minors are produced)", () => {
    // 絵札の無いカードを引くと鑑定に裏面が出る(2026-07 founder 指摘)。プールは絵札ありのみ
    for (let i = 0; i < 200; i++) {
      const d = dailyTarot(`user-${i}`, "2026-06-24");
      expect(d.card.arcana).toBe("major");
    }
  });
});
