import { describe, it, expect } from "vitest";
import { MoshierAstrologyProvider } from "../ephemeris";

const provider = new MoshierAstrologyProvider();

describe("MoshierAstrologyProvider - natal", () => {
  it("sun is Capricorn on 2000-01-01", () => {
    const result = provider.natal({ date: "2000-01-01" });
    expect(result.sun).toBe("Capricorn");
  });

  it("sun is Cancer on 2026-07-01", () => {
    const result = provider.natal({ date: "2026-07-01" });
    expect(result.sun).toBe("Cancer");
  });

  it("no time -> moon and ascendant are undefined", () => {
    const result = provider.natal({ date: "2000-01-01" });
    expect(result.moon).toBeUndefined();
    expect(result.ascendant).toBeUndefined();
  });

  it("with time -> moon is defined", () => {
    const result = provider.natal({ date: "2000-01-01", time: "12:00", lat: 35.6762, lon: 139.6503 });
    expect(result.moon).not.toBeUndefined();
  });
});

describe("MoshierAstrologyProvider - transitsFor", () => {
  it("returns array of transits", () => {
    const transits = provider.transitsFor({ date: "2000-01-01" }, "2026-06-18");
    expect(Array.isArray(transits)).toBe(true);
    expect(transits.length).toBeGreaterThan(0);
  });

  it("each transit has planet and sign", () => {
    const transits = provider.transitsFor({ date: "2000-01-01" }, "2026-06-18");
    for (const t of transits) {
      expect(typeof t.planet).toBe("string");
      expect(t.planet.length).toBeGreaterThan(0);
      expect(typeof t.sign).toBe("string");
    }
  });

  it("deterministic", () => {
    const a = provider.transitsFor({ date: "2000-01-01" }, "2026-06-18");
    const b = provider.transitsFor({ date: "2000-01-01" }, "2026-06-18");
    expect(a).toEqual(b);
  });
});
