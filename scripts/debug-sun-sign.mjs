// sun sign 実測検証: 実誕生日 → 星座がエフェメリス計算で正しいか。
// 使い方: npx esbuild scripts/debug-sun-entry.ts --bundle --platform=node --format=esm \
//          --outfile=scripts/.sun-debug-bundle.mjs && node scripts/debug-sun-sign.mjs
import { MoshierAstrologyProvider, assembleDailyReading } from './.sun-debug-bundle.mjs';

const CASES = [
  ['1983-02-04', 'Aquarius'],   // 実機バグ報告: みずがめ座なのにうお座が出た
  ['1992-03-15', 'Pisces'],
  ['1990-01-19', 'Capricorn'],  // 境界: 山羊の最終日近辺
  ['1990-01-21', 'Aquarius'],
  ['1995-02-18', 'Aquarius'],   // 境界: 水瓶の最終日近辺
  ['1995-02-20', 'Pisces'],
  ['2000-12-22', 'Capricorn'],
  ['1988-08-22', 'Leo'],        // 境界: 獅子/乙女 (1988年の乙女座入りは 8/23 00:54 UTC)
  ['1988-08-23', 'Virgo'],
  ['1988-08-24', 'Virgo'],
];

const astro = new MoshierAstrologyProvider();
let fail = 0;
for (const [birth, expect] of CASES) {
  const input = assembleDailyReading({
    userId: 'debug', date: '2026-07-18',
    birth: { date: birth }, theme: 'self', astrology: astro,
  });
  const sun = input.astrology.natal.sun;
  const ok = sun === expect;
  if (!ok) fail++;
  console.log(`${ok ? 'OK ' : 'NG '} ${birth} -> ${sun} (expect ${expect})`);
}
console.log(fail === 0 ? 'ALL PASS' : `${fail} FAILURES`);
process.exit(fail === 0 ? 0 : 1);
