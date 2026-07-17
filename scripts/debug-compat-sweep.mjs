// 相性エンジン網羅デバッグ: 全星座ペア分布・コーパス到達性・クラッシュ検出
// 使い方: npx esbuild scripts/debug-compat-entry.ts --bundle --platform=node --format=esm \
//          --outfile=scripts/.compat-debug-bundle.mjs && node scripts/debug-compat-sweep.mjs
import { computeCompatibility, MoshierAstrologyProvider, lifePathNumber } from './.compat-debug-bundle.mjs';

const astro = new MoshierAstrologyProvider();
const DATE = '2026-06-24';

// 各星座の代表的な生年月日（中日近辺）— natal で実星座を確認して使う
const SIGN_DATES = {
  Aries: '04-01', Taurus: '05-01', Gemini: '06-05', Cancer: '07-05',
  Leo: '08-05', Virgo: '09-05', Libra: '10-08', Scorpio: '11-05',
  Sagittarius: '12-05', Capricorn: '01-05', Aquarius: '02-01', Pisces: '03-05',
};

let issues = 0;
const issue = (m) => { issues++; console.log('  ❌', m); };

// ── Sweep 1: 年×月日の広域走査でクラッシュ検出 + 分布収集 ──────────
console.log('━━━ Sweep 1: 広域走査 (クラッシュ + 分布) ━━━');
const years = [1970, 1975, 1980, 1985, 1988, 1990, 1992, 1994, 1996, 1999, 2001, 2004];
const dates = [];
for (const y of years) for (const md of Object.values(SIGN_DATES)) dates.push(`${y}-${md}`);

const bandCount = { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 };
const elementPairsSeen = new Set();
const aspectsSeen = new Set();
const relationsSeen = new Set();
const scores = [];
const crashes = [];
let runs = 0;

for (let i = 0; i < dates.length; i++) {
  for (let j = i; j < dates.length; j += 7) { // 全組合せは重いので刻み7で網羅性を確保
    const input = { a: { birthDate: dates[i] }, b: { birthDate: dates[j] }, date: DATE };
    runs++;
    try {
      const r = computeCompatibility(input, astro);
      bandCount[r.band]++;
      elementPairsSeen.add(r.elementPair);
      aspectsSeen.add(r.signAspect);
      relationsSeen.add(r.relationNumber);
      scores.push(r.score);
      // sections に undefined/null 混入チェック
      for (const [k, v] of Object.entries(r.sections)) {
        if (!v || typeof v !== 'string' || v.includes('undefined')) issue(`sections.${k} 異常 @ ${dates[i]} x ${dates[j]}: ${String(v).slice(0, 40)}`);
      }
    } catch (e) {
      crashes.push({ a: dates[i], b: dates[j], lpA: lifePathNumber(dates[i]), lpB: lifePathNumber(dates[j]), err: e.message.slice(0, 80) });
    }
  }
}
console.log(`  実行: ${runs} ペア`);
console.log(`  クラッシュ: ${crashes.length} 件`);
if (crashes.length) {
  issues += crashes.length;
  for (const c of crashes.slice(0, 5)) console.log(`  ❌ CRASH ${c.a}(lp${c.lpA}) x ${c.b}(lp${c.lpB}): ${c.err}`);
  if (crashes.length > 5) console.log(`  ... 他 ${crashes.length - 5} 件`);
}
console.log(`  band 分布: ${JSON.stringify(bandCount)}`);
console.log(`  score min/max: ${Math.min(...scores)} / ${Math.max(...scores)}`);

// ── Sweep 2: コーパス到達性（dead entry 検出） ──────────
console.log('\n━━━ Sweep 2: コーパス到達性 ━━━');
const allPairs = ['air-air','air-earth','air-fire','air-water','earth-earth','earth-fire','earth-water','fire-fire','fire-water','water-water'];
const allAspects = ['conjunct','semi','sextile','square','trine','quincunx','opposite'];
const missP = allPairs.filter(p => !elementPairsSeen.has(p));
const missA = allAspects.filter(a => !aspectsSeen.has(a));
const missR = [1,2,3,4,5,6,7,8,9].filter(r => !relationsSeen.has(r));
const missB = [1,2,3,4,5].filter(b => bandCount[b] === 0);
console.log(missP.length ? `  ⚠ 未到達 elementPair: ${missP}` : '  ✅ elementPair 10/10 到達');
console.log(missA.length ? `  ⚠ 未到達 aspect: ${missA}` : '  ✅ aspect 7/7 到達');
console.log(missR.length ? `  ⚠ 未到達 relation: ${missR}` : '  ✅ relation 9/9 到達');
console.log(missB.length ? `  ⚠ 未到達 band: ${missB}（このスコア設計では理論的に出ない可能性）` : '  ✅ band 5/5 到達');

// ── Sweep 3: 境界（自分×自分・マスター数持ち） ──────────
console.log('\n━━━ Sweep 3: 境界ケース ━━━');
try {
  const same = computeCompatibility({ a: { birthDate: '1993-11-08' }, b: { birthDate: '1993-11-08' }, date: DATE }, astro);
  console.log(`  ✅ 自分×自分: score=${same.score} band=${same.band} pair=${same.elementPair} aspect=${same.signAspect}`);
} catch (e) { issue(`自分×自分 CRASH: ${e.message.slice(0, 60)}`); }
// マスター lifePath 持ち: 1994-04-02 = 11
try {
  const master = computeCompatibility({ a: { birthDate: '1994-04-02' }, b: { birthDate: '1994-04-02' }, date: DATE }, astro);
  console.log(`  ✅ master(11)×master(11): relation=${master.relationNumber} score=${master.score}`);
} catch (e) { issue(`master×master CRASH: ${e.message.slice(0, 60)}`); }

// ── Sweep 4: 和=11/22 を狙い撃ち（reduceToCore マスター保持疑い） ──────────
console.log('\n━━━ Sweep 4: relation 和=11/22 狙い撃ち ━━━');
// lifePath 別の代表日を探す
const lpDates = {};
for (let y = 1960; y <= 2010; y++) {
  for (const md of ['01-15', '03-10', '06-20', '09-25', '11-30']) {
    const d = `${y}-${md}`;
    const lp = lifePathNumber(d);
    const core = lp === 11 ? 2 : lp === 22 ? 4 : lp === 33 ? 6 : lp;
    if (!lpDates[core]) lpDates[core] = d;
  }
}
const targetSums = [[2, 9], [3, 8], [4, 7], [5, 6]]; // 和=11
for (const [x, y2] of targetSums) {
  if (!lpDates[x] || !lpDates[y2]) { console.log(`  (lp${x}/lp${y2} の代表日なし、スキップ)`); continue; }
  try {
    const r = computeCompatibility({ a: { birthDate: lpDates[x] }, b: { birthDate: lpDates[y2] }, date: DATE }, astro);
    console.log(`  ✅ lp${x}+lp${y2}=11: relation=${r.relationNumber} score=${r.score} bond冒頭="${r.sections.advice.split('\n\n')[1]?.slice(0, 15)}..."`);
    if (r.relationNumber === 11) issue(`relation=11 が出た（コーパスは1-9のみ）`);
  } catch (e) {
    issue(`lp${x}+lp${y2}=11 CRASH: ${e.message.slice(0, 80)}`);
  }
}

console.log(`\n━━━ 合計 issues: ${issues} ━━━`);
process.exit(issues > 0 ? 1 : 0);
