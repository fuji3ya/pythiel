// ブラウザから engine を呼ぶエントリ。window.PythielEngine にAPIを公開。
import { assembleDailyReading } from '../../lib/divination/reading/assemble';
import { MoshierAstrologyProvider } from '../../lib/divination/astrology/ephemeris';
import { SynthesisEngine } from '../../lib/synthesis/engine';
import { weave, weaveWithMeta } from '../../lib/synthesis/weaver';
import { dailyTarot } from '../../lib/divination/tarot/draw';
import { lifePathNumber, expressionNumber } from '../../lib/divination/numerology';
import { eclipticLongitudeToZodiac } from '../../lib/divination/astrology/solar';
import { calculateLifeCycles } from '../../lib/synthesis/life-cycles';
import { computeCompatibility } from '../../lib/synthesis/compatibility';

(window as any).PythielEngine = {
  assembleDailyReading,
  MoshierAstrologyProvider,
  SynthesisEngine,
  weave,
  weaveWithMeta,
  dailyTarot,
  lifePathNumber,
  expressionNumber,
  eclipticLongitudeToZodiac,
  calculateLifeCycles,
  computeCompatibility,
};
