// 多角的デバッグスクリプト
import { readFileSync } from 'fs';

const tarot = JSON.parse(readFileSync('lib/synthesis/corpus/tarot.v2.json', 'utf-8'));
const astro = JSON.parse(readFileSync('lib/synthesis/corpus/astrology.v2.json', 'utf-8'));
const num = JSON.parse(readFileSync('lib/synthesis/corpus/numerology.v2.json', 'utf-8'));
const moon = JSON.parse(readFileSync('lib/synthesis/corpus/transit-moon.v2.json', 'utf-8'));

let totalIssues = 0;
const issue = (msg) => { totalIssues++; console.log('  ❌', msg); };

console.log('━━━━━━━━━━ Debug 1: エントリ数 ━━━━━━━━━━');
const counts = { tarot: 156, astrology: 12, numerology: 12, moon: 12 };
for (const [name, expected] of Object.entries(counts)) {
  const data = { tarot, astrology: astro, numerology: num, moon }[name];
  const actual = Object.keys(data).length;
  if (actual !== expected) issue(`${name}: ${actual} (expected ${expected})`);
  else console.log(`  ✅ ${name}: ${actual}`);
}

console.log('\n━━━━━━━━━━ Debug 2: タロット element 整合性 ━━━━━━━━━━');
const tarotEl = { wands: 'fire', cups: 'water', swords: 'air', pentacles: 'earth' };
let tarotElIssues = 0;
for (const [key, val] of Object.entries(tarot)) {
  const suit = key.split('-')[0];
  if (tarotEl[suit] && val.element !== tarotEl[suit]) {
    issue(`${key}: element=${val.element} (expected ${tarotEl[suit]})`);
    tarotElIssues++;
  }
  if (!val.element) { issue(`${key}: no element`); tarotElIssues++; }
}
if (tarotElIssues === 0) console.log('  ✅ 156エントリ全部 element 正しい');

console.log('\n━━━━━━━━━━ Debug 3: タロット必須フィールド ━━━━━━━━━━');
const req = ['element', 'core', 'now_implies', 'unread_truth', 'prediction_arc', 'turning_point', 'occult_basis', 'advice_principle'];
let fieldIssues = 0;
for (const [key, val] of Object.entries(tarot)) {
  for (const f of req) if (val[f] === undefined) { issue(`${key} missing ${f}`); fieldIssues++; }
  if (key.endsWith(':false') && !val.upright) { issue(`${key} missing upright`); fieldIssues++; }
  if (key.endsWith(':true') && !val.shadow) { issue(`${key} missing shadow`); fieldIssues++; }
}
if (fieldIssues === 0) console.log('  ✅ 必須フィールド全部揃ってる');

console.log('\n━━━━━━━━━━ Debug 4: 占星 element 整合性 ━━━━━━━━━━');
const zodiacEl = { Aries: 'fire', Leo: 'fire', Sagittarius: 'fire', Taurus: 'earth', Virgo: 'earth', Capricorn: 'earth', Gemini: 'air', Libra: 'air', Aquarius: 'air', Cancer: 'water', Scorpio: 'water', Pisces: 'water' };
let aIssues = 0;
for (const [key, val] of Object.entries(astro)) {
  if (val.element !== zodiacEl[key]) { issue(`${key}: ${val.element} vs ${zodiacEl[key]}`); aIssues++; }
}
if (aIssues === 0) console.log('  ✅ 12星座全部 element 正しい');

console.log('\n━━━━━━━━━━ Debug 5: 占星 必須フィールド ━━━━━━━━━━');
const aReq = ['element', 'core', 'drive', 'hidden_drive', 'shadow', 'current_season', 'current_assignment', 'works_with'];
let aFieldIssues = 0;
for (const [key, val] of Object.entries(astro)) {
  for (const f of aReq) if (val[f] === undefined) { issue(`${key} missing ${f}`); aFieldIssues++; }
}
if (aFieldIssues === 0) console.log('  ✅ 12星座全部フィールド揃ってる');

console.log('\n━━━━━━━━━━ Debug 6: 数秘 resonates_with ━━━━━━━━━━');
const expRes = { '1': ['fire'], '2': ['water'], '3': ['air', 'fire'], '4': ['earth'], '5': ['air', 'fire'], '6': ['water', 'earth'], '7': ['water', 'air'], '8': ['earth', 'fire'], '9': ['fire', 'water'], '11': ['water', 'air'], '22': ['earth', 'air'], '33': ['water', 'fire'] };
let nIssues = 0;
for (const [key, val] of Object.entries(num)) {
  const exp = expRes[key];
  if (!exp) continue;
  const actual = (val.resonates_with || []).slice().sort().join(',');
  const expected = exp.slice().sort().join(',');
  if (actual !== expected) { issue(`${key}: ${actual} vs ${expected}`); nIssues++; }
}
if (nIssues === 0) console.log('  ✅ 12数字全部 resonates_with 正しい');

console.log('\n━━━━━━━━━━ Debug 7: 数秘 必須フィールド ━━━━━━━━━━');
const nReq = ['resonates_with', 'core', 'strength', 'shadow', 'unspoken_struggle', 'life_theme', 'today_lens'];
let nFieldIssues = 0;
for (const [key, val] of Object.entries(num)) {
  for (const f of nReq) if (val[f] === undefined) { issue(`${key} missing ${f}`); nFieldIssues++; }
}
if (nFieldIssues === 0) console.log('  ✅ 12数字全部フィールド揃ってる');

console.log('\n━━━━━━━━━━ Debug 8: 月トランジット 必須フィールド ━━━━━━━━━━');
const mReq = ['mood', 'in_you', 'predicts'];
let mIssues = 0;
for (const [key, val] of Object.entries(moon)) {
  for (const f of mReq) if (val[f] === undefined) { issue(`${key} missing ${f}`); mIssues++; }
  if (!zodiacEl[key]) { issue(`unknown sign: ${key}`); mIssues++; }
}
if (mIssues === 0) console.log('  ✅ 12星座全部の月データ揃ってる');

console.log('\n━━━━━━━━━━ Debug 9: 声基準（断定語チェック） ━━━━━━━━━━');
// 「絶対」「必ず」など。occult_basis は事実なので除外
const forbiddenInSoft = ['絶対', '必ず', 'しなさい', 'いけません', '違いない', 'はずだ'];
const softFields = ['now_implies', 'unread_truth', 'prediction_arc', 'turning_point', 'advice_principle', 'caveat'];
let toneIssues = 0;
const toneFailures = [];
for (const [key, val] of Object.entries(tarot)) {
  for (const f of softFields) {
    const txt = val[f] || '';
    for (const w of forbiddenInSoft) {
      if (txt.includes(w)) toneFailures.push(`${key}.${f}: contains "${w}"`);
    }
  }
}
if (toneFailures.length === 0) console.log('  ✅ 全156エントリ・読者語り部分に断定語なし');
else { console.log(`  ⚠️ ${toneFailures.length} potential issues:`); toneFailures.slice(0, 10).forEach(t => console.log('    ', t)); toneIssues = toneFailures.length; }

console.log('\n━━━━━━━━━━ Debug 10: 既存48 vs 新54 の声差異 ━━━━━━━━━━');
// 既存（major 22*2 + pentacles-12 + swords-12 = 46 + 2）は古い声「〜だ」「〜してくれる」が残る
// 新追加（マイナーの大半）は石井ゆかり水準「〜かもしれません」
// 比較: 各エントリの now_implies 末尾を見る
const oldKeys = ['major-0:false','major-16:false','major-17:false','pentacles-12:false','swords-12:false'];
const newKeys = ['wands-1:false','cups-5:false','swords-3:false','pentacles-5:false'];
console.log('  [既存声サンプル]');
for (const k of oldKeys) console.log(`    ${k}: "${(tarot[k].now_implies || '').slice(-40)}"`);
console.log('  [新声サンプル]');
for (const k of newKeys) console.log(`    ${k}: "${(tarot[k].now_implies || '').slice(-40)}"`);

console.log(`\n━━━━━━━━━━ サマリー ━━━━━━━━━━`);
console.log(`合計 issues: ${totalIssues}`);
if (totalIssues === 0) console.log('✅ 構造的問題なし');
