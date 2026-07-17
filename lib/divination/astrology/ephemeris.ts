import * as Astronomy from "astronomy-engine";
import type { AstrologyProvider, BirthInput, PlacementSet, Transit, ZodiacSign } from "./types";
import { eclipticLongitudeToZodiac } from "./solar";

function parseDateToUTC(dateStr: string, timeStr?: string): Date {
  const [y, m, d] = dateStr.split("-").map(Number);
  if (timeStr) {
    const [h, min] = timeStr.split(":").map(Number);
    return new Date(Date.UTC(y, m - 1, d, h, min));
  }
  return new Date(Date.UTC(y, m - 1, d, 12, 0, 0));
}

function getSunLongitude(date: Date): number {
  const t = Astronomy.MakeTime(date);
  const vec = Astronomy.GeoVector(Astronomy.Body.Sun, t, true);
  const ec = Astronomy.Ecliptic(vec);
  return ec.elon;
}

function getMoonLongitude(date: Date): number {
  const t = Astronomy.MakeTime(date);
  const ec = Astronomy.EclipticGeoMoon(t);
  return ec.lon;
}

function getPlanetLongitude(body: Astronomy.Body, date: Date): number {
  const t = Astronomy.MakeTime(date);
  return Astronomy.EclipticLongitude(body, t);
}

const TRANSIT_BODIES: { name: string; body: Astronomy.Body }[] = [
  { name: "Mercury", body: Astronomy.Body.Mercury },
  { name: "Venus",   body: Astronomy.Body.Venus   },
  { name: "Mars",    body: Astronomy.Body.Mars     },
  { name: "Jupiter", body: Astronomy.Body.Jupiter  },
  { name: "Saturn",  body: Astronomy.Body.Saturn   },
];

export class MoshierAstrologyProvider implements AstrologyProvider {
  natal(birth: BirthInput): PlacementSet {
    const date = parseDateToUTC(birth.date, birth.time);
    const sunLon = getSunLongitude(date);
    const sun: ZodiacSign = eclipticLongitudeToZodiac(sunLon);

    if (!birth.time) {
      return { sun };
    }

    const moonLon = getMoonLongitude(date);
    const moon: ZodiacSign = eclipticLongitudeToZodiac(moonLon);
    // Ascendant requires sidereal time + geographic lat/lon — deferred to Plan 3
    return { sun, moon, ascendant: undefined };
  }

  transitsFor(_birth: BirthInput, date: string): Transit[] {
    const d = parseDateToUTC(date);
    const transits: Transit[] = [];

    // Sun
    const sunLon = getSunLongitude(d);
    transits.push({ planet: "Sun", sign: eclipticLongitudeToZodiac(sunLon), degreeInSign: sunLon % 30 });

    // Moon
    const moonLon = getMoonLongitude(d);
    transits.push({ planet: "Moon", sign: eclipticLongitudeToZodiac(moonLon), degreeInSign: moonLon % 30 });

    // Planets
    for (const { name, body } of TRANSIT_BODIES) {
      const lon = getPlanetLongitude(body, d);
      transits.push({ planet: name, sign: eclipticLongitudeToZodiac(lon), degreeInSign: lon % 30 });
    }

    return transits;
  }
}
