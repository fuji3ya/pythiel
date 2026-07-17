// weaver 全数走査: 全156タロットキー × 星座 × 数秘 × テーマ × 月 × 年齢
// 使い方: npx esbuild scripts/debug-compat-entry.ts --bundle --platform=node --format=esm \
//          --outfile=scripts/.compat-debug-bundle.mjs && node scripts/debug-weaver-sweep.mjs
import { weaveWithMeta, calculateLifeCycles, TAROT_DECK } from './.compat-debug-bundle.mjs';

let issues = 0;
const issue = (m) => { issues++; if (issues <= 30) console.log('  ❌', m); };

const SIGNS = ['Aries','Taurus','Gemini','Cancer','Leo','Virgo','Libra','Scorpio','Sagittarius','Capricorn','Aquarius','Pisces'];
const LPS = [1,2,3,4,5,6,7,8,9,11,22,33];
const THEMES = ['love','work','self','future', undefined];
const DATE = '2026-06-24';

function mkInput(card, reversed, sun, lp, opts = {}) {
  return {
    date: DATE,
    birthDate: opts.birthDate,
    theme: opts.theme,
    numerology: { lifePath: lp, expression: opts.expression },
    astrology: { natal: { sun, moon: opts.moon }, transits: opts.transits || [] },
    tarot: { card, reversed },
  };
}

function checkExtras(w, ctx, expectConsult, expectMoonLayer, expectLife) {
  if (!w) { issue(`weave null @ ${ctx}`); return; }
  const req = ['profile_headline','profile','sky_today','interaction','unread_headline','unread_truth','prediction'];
  for (const k of req) {
    const v = w.extras[k];
    if (typeof v !== 'string') issue(`extras.${k} 非文字列 @ ${ctx}`);
    else if (v.includes('undefined') || v.includes('[object')) issue(`extras.${k} undefined混入 @ ${ctx}`);
  }
  // profile/unread は必ず非空
  for (const k of ['profile','unread_truth','prediction']) {
    if (!w.extras[k] || !w.extras[k].trim()) issue(`extras.${k} 空 @ ${ctx}`);
  }
  for (const k of ['situation','message','action']) {
    const v = w.sections[k];
    if (!v || !v.trim() || v.includes('undefined')) issue(`sections.${k} 異常 @ ${ctx}`);
  }
  if (expectConsult) {
    for (const k of ['consult_question','consult_opening','consult_answer']) {
      if (!w.extras[k] || !w.extras[k].trim()) issue(`テーマありなのに extras.${k} 空 @ ${ctx}`);
      if ((w.extras[k]||'').includes('undefined')) issue(`extras.${k} undefined @ ${ctx}`);
    }
  } else {
    if (w.extras.consult_question) issue(`テーマ無しなのに consult_question あり @ ${ctx}`);
  }
  if (expectMoonLayer && !w.extras.profile.includes('にあるあなた')) issue(`natal.moon ありなのに月層なし @ ${ctx}`);
  if (expectLife && (!w.extras.life_context || !w.extras.life_context.trim())) issue(`birthDate ありなのに life_context 空 @ ${ctx}`);
}

// ── Sweep A1: 全156タロットキー（正逆×78枚）×テーマ4+無し ──────────
console.log('━━━ A1: 全156タロットキー × テーマ5種 ━━━');
let runs = 0;
for (const card of TAROT_DECK) {
  for (const reversed of [false, true]) {
    for (const theme of THEMES) {
      const inp = mkInput(card, reversed, 'Leo', 5, { theme, birthDate: '1990-08-05' });
      runs++;
      try {
        const w = weaveWithMeta(inp);
        checkExtras(w, `${card.id}:${reversed}:${theme||'-'}`, !!theme, false, true);
      } catch (e) { issue(`CRASH ${card.id}:${reversed}:${theme||'-'}: ${e.message.slice(0,60)}`); }
    }
  }
}
console.log(`  実行: ${runs}`);

// ── Sweep A2: 全星座 × 全ライフパス（マスター含む）× natal.moon 全種 ──────────
console.log('━━━ A2: 12星座 × 12LP × natal.moon ━━━');
runs = 0;
const card0 = TAROT_DECK[0];
for (const sun of SIGNS) {
  for (const lp of LPS) {
    const moon = SIGNS[(SIGNS.indexOf(sun) + 5) % 12];
    const inp = mkInput(card0, false, sun, lp, { moon, expression: lp, birthDate: '1995-03-15' });
    runs++;
    try {
      const w = weaveWithMeta(inp);
      checkExtras(w, `${sun}:lp${lp}`, false, true, true);
      // 表現数の消費（名前層）
      if (!w.extras.profile.includes('名前')) issue(`expression=${lp} 未消費 @ ${sun}`);
    } catch (e) { issue(`CRASH ${sun}:lp${lp}: ${e.message.slice(0,60)}`); }
  }
}
console.log(`  実行: ${runs}`);

// ── Sweep A3: transit Moon 全12サイン（sky_today/月呼応）＋デカン強シンクロ ──────────
console.log('━━━ A3: transit Moon 12種 + デカン同期 ━━━');
runs = 0;
for (const msign of SIGNS) {
  const inp = mkInput(card0, false, 'Virgo', 3, {
    birthDate: '1992-09-10',
    transits: [{ planet: 'Moon', sign: msign, degreeInSign: 12 }],
  });
  runs++;
  try {
    const w = weaveWithMeta(inp);
    if (!w.extras.sky_today || !w.extras.sky_today.trim()) issue(`sky_today 空 @ Moon=${msign}`);
  } catch (e) { issue(`CRASH Moon=${msign}: ${e.message.slice(0,60)}`); }
}
// デカン: 全36マイナー数札で強シンクロ（デカン内に天体を置く）
const minors = TAROT_DECK.filter(c => c.arcana !== 'major' && c.number >= 2 && c.number <= 10);
const DECAN_MID = { 2: 5, 3: 15, 4: 25, 5: 5, 6: 15, 7: 25, 8: 5, 9: 15, 10: 25 };
const SUIT_SIGNS = { wands: ['Aries','Leo','Sagittarius'], cups: ['Cancer','Scorpio','Pisces'], swords: ['Libra','Aquarius','Gemini'], pentacles: ['Taurus','Virgo','Capricorn'] };
let strongSync = 0;
for (const c of minors) {
  runs++;
  // カードのデカンサインに Moon を置く（decan.ts の表から: number 2-4=1組目,5-7=2組目,8-10=3組目 …スートごとに割当が違うので総当たりで3サイン試す）
  for (const s of SUIT_SIGNS[c.arcana]) {
    const inp = mkInput(c, false, 'Leo', 5, {
      transits: [{ planet: 'Moon', sign: s, degreeInSign: DECAN_MID[c.number] }],
    });
    try {
      const w = weaveWithMeta(inp);
      if (w.extras.synchronicity.includes('珍しいこと')) { strongSync++; break; }
    } catch (e) { issue(`CRASH decan ${c.id}: ${e.message.slice(0,50)}`); break; }
  }
}
console.log(`  実行: ${runs} / 強シンクロ検出: ${strongSync}/36 (36なら全デカン生存)`);
if (strongSync < 36) issue(`強シンクロ未到達のマイナー数札あり: ${36 - strongSync} 枚`);

// ── Sweep A4: life-cycles 年齢 0-100 全走査 ──────────
console.log('━━━ A4: life-cycles 年齢0-100 ━━━');
const pySeen = new Set(), phSeen = new Set();
let srCount = 0, jrCount = 0;
for (let age = 0; age <= 100; age++) {
  const by = 2026 - age;
  try {
    const c = calculateLifeCycles(`${by}-06-01`, DATE); // 誕生日は 6/24 より前 = age ぴったり
    if (c.age !== age) issue(`age 計算ズレ: birth=${by} expected=${age} got=${c.age}`);
    if (c.personalYear < 1 || c.personalYear > 9) issue(`personalYear 範囲外: ${c.personalYear}`);
    if (c.profectionHouse < 1 || c.profectionHouse > 12) issue(`profection 範囲外: ${c.profectionHouse}`);
    phSeen.add(c.profectionHouse);
    if (c.saturnReturn.active) srCount++;
    if (c.jupiterReturn.active) jrCount++;
  } catch (e) { issue(`CRASH age=${age}: ${e.message.slice(0,50)}`); }
}
// PY は誕生月日の関数 — 月日を回して 9 種すべて到達するか（別走査）
for (let m = 1; m <= 12; m++) {
  for (let d = 1; d <= 28; d += 3) {
    try {
      const c = calculateLifeCycles(`1990-${String(m).padStart(2,'0')}-${String(d).padStart(2,'0')}`, DATE);
      pySeen.add(c.personalYear);
    } catch (e) { issue(`CRASH PY走査 ${m}-${d}: ${e.message.slice(0,40)}`); }
  }
}
console.log(`  PY 到達: ${pySeen.size}/9, PH 到達: ${phSeen.size}/12, SaturnReturn年齢数: ${srCount}, JupiterReturn年齢数: ${jrCount}`);
if (pySeen.size < 9) issue('PersonalYear 未到達あり');
if (phSeen.size < 12) issue('Profection 未到達あり');

console.log(`\n━━━ 合計 issues: ${issues} ━━━`);
process.exit(issues > 0 ? 1 : 0);
