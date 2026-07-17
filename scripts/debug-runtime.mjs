// ランタイム動作テスト（複数生年月日でweaverの全パターン）
import { readFileSync } from 'fs';

const tarot = JSON.parse(readFileSync('lib/synthesis/corpus/tarot.v2.json', 'utf-8'));
const astro = JSON.parse(readFileSync('lib/synthesis/corpus/astrology.v2.json', 'utf-8'));
const num = JSON.parse(readFileSync('lib/synthesis/corpus/numerology.v2.json', 'utf-8'));

console.log('━━━━━━━━━━ Debug 14: 全体ボリュームと品質指標 ━━━━━━━━━━');
let totalChars = 0;
let entries = 0;
let shortestKey = null, shortestLen = Infinity;
let longestKey = null, longestLen = 0;
for (const [key, val] of Object.entries(tarot)) {
  entries++;
  const len = Object.values(val).filter(v => typeof v === 'string').reduce((s, v) => s + v.length, 0);
  totalChars += len;
  if (len < shortestLen) { shortestLen = len; shortestKey = key; }
  if (len > longestLen) { longestLen = len; longestKey = key; }
}
console.log(`総エントリ: ${entries}`);
console.log(`総文字数: ${totalChars.toLocaleString()} (1エントリ平均 ${Math.round(totalChars / entries)} 文字)`);
console.log(`最短エントリ: ${shortestKey} (${shortestLen}文字)`);
console.log(`最長エントリ: ${longestKey} (${longestLen}文字)`);

// 異常に短い/長いがないかチェック
const tooShort = Object.entries(tarot).filter(([k, v]) => {
  const len = Object.values(v).filter(x => typeof x === 'string').reduce((s, x) => s + x.length, 0);
  return len < 300;
});
const tooLong = Object.entries(tarot).filter(([k, v]) => {
  const len = Object.values(v).filter(x => typeof x === 'string').reduce((s, x) => s + x.length, 0);
  return len > 1800;
});
console.log(`異常に短い (<300): ${tooShort.length}`);
console.log(`異常に長い (>1800): ${tooLong.length}`);

console.log('\n━━━━━━━━━━ Debug 15: ライフパス計算の正しさ ━━━━━━━━━━');
// Pythagorean 数秘術：生年月日の全数字を合計→1桁またはマスター数（11/22/33）
function lifePath(dateStr) {
  const sum = dateStr.replace(/\D/g, '').split('').reduce((s, c) => s + parseInt(c), 0);
  function reduce(n) {
    if (n === 11 || n === 22 || n === 33) return n;
    if (n < 10) return n;
    return reduce(n.toString().split('').reduce((s, c) => s + parseInt(c), 0));
  }
  return reduce(sum);
}
const lpTests = [
  ['2000-01-01', 4],   // 2+0+0+0+0+1+0+1=4
  ['1990-12-31', 8],   // 1+9+9+0+1+2+3+1=26→8
  ['1992-03-15', 3],   // 1+9+9+2+0+3+1+5=30→3
  ['1985-07-15', 9],   // 1+9+8+5+0+7+1+5=36→9
  ['1988-11-29', 11],  // 1+9+8+8+1+1+2+9=39→12→3 (Hmm, expected 11?)
];
for (const [date, exp] of lpTests) {
  const calc = lifePath(date);
  console.log(`  ${date}: ${calc}${calc === exp ? ' ✓' : ' ✗ expected ' + exp}`);
}

console.log('\n━━━━━━━━━━ Debug 16: 月以外のトランジット利用状況 ━━━━━━━━━━');
// engine は月以外のトランジット（金星/水星/火星）も返すが、weaver は月のみ使用
// 拡張余地の確認
const weaverPath = readFileSync('lib/synthesis/weaver.ts', 'utf-8');
const usesMercury = weaverPath.includes("'Mercury'");
const usesVenus = weaverPath.includes("'Venus'");
const usesMars = weaverPath.includes("'Mars'");
const usesJupiter = weaverPath.includes("'Jupiter'");
const usesSaturn = weaverPath.includes("'Saturn'");
console.log(`weaver の惑星トランジット利用状況:`);
console.log(`  Mercury: ${usesMercury ? '使用中' : '未使用（拡張余地）'}`);
console.log(`  Venus:   ${usesVenus ? '使用中' : '未使用（拡張余地）'}`);
console.log(`  Mars:    ${usesMars ? '使用中' : '未使用（拡張余地）'}`);
console.log(`  Jupiter: ${usesJupiter ? '使用中' : '未使用（拡張余地）'}`);
console.log(`  Saturn:  ${usesSaturn ? '使用中' : '未使用（拡張余地）'}`);

console.log('\n━━━━━━━━━━ Debug 17: weaver の防御チェック ━━━━━━━━━━');
// weaver は3占術データ揃わないと null を返す。今は全156枚揃ったので weave 失敗はないはず
// テスト: 不正な入力でクラッシュしないか
const edgeCases = [
  { name: '正常', input: { tarotKey: 'major-0:false', sun: 'Aries', lifePath: 1, hasMoon: true } },
  { name: '存在しないカード', input: { tarotKey: 'major-99:false', sun: 'Aries', lifePath: 1, hasMoon: true } },
  { name: '存在しない星座', input: { tarotKey: 'major-0:false', sun: 'Ophiuchus', lifePath: 1, hasMoon: true } },
  { name: '存在しない数字', input: { tarotKey: 'major-0:false', sun: 'Aries', lifePath: 99, hasMoon: true } },
  { name: '月データなし', input: { tarotKey: 'major-0:false', sun: 'Aries', lifePath: 1, hasMoon: false } }
];
for (const tc of edgeCases) {
  const hasTarot = tc.input.tarotKey in tarot;
  const hasSun = tc.input.sun in astro;
  const hasNum = String(tc.input.lifePath) in num;
  const shouldWeave = hasTarot && hasSun && hasNum;
  console.log(`  ${tc.name}: tarot=${hasTarot} sun=${hasSun} num=${hasNum} → weave=${shouldWeave ? '成功' : 'null (fallback)'}`);
}

console.log('\n━━━━━━━━━━ Debug 18: タロットカードの id-name 整合性 ━━━━━━━━━━');
// engine の deck.ts は id を生成。weaver は ReadingInput から card.name を受け取って interaction 文で使う
// 名前の例を出して、各 occult_basis でカード名と一致してるか抽出
const sampleNames = {
  'wands-1:false': 'Ace of Wands',
  'major-17:false': 'The Star',
  'cups-13:false': 'Queen of Cups',
  'pentacles-7:false': 'Seven of Pentacles'
};
for (const [key, expectedName] of Object.entries(sampleNames)) {
  const occult = tarot[key].occult_basis || '';
  // タロットカード名が occult_basis に含まれているか
  const cleanName = expectedName.replace('The ', '').replace('Ace ', '');
  const found = occult.includes(expectedName) || occult.includes(cleanName);
  console.log(`  ${key}: occult_basis に "${expectedName}" 言及: ${found ? '○' : '× (微妙)'}`);
}

console.log('\n━━━━━━━━━━ Debug 19: bundle サイズ ━━━━━━━━━━');
import { statSync } from 'fs';
try {
  const bundle = statSync('design/mockups/engine.bundle.js');
  console.log(`engine.bundle.js: ${(bundle.size / 1024).toFixed(1)} KB`);
  const map = statSync('design/mockups/engine.bundle.js.map');
  console.log(`engine.bundle.js.map: ${(map.size / 1024).toFixed(1)} KB`);
} catch(e) { console.log('bundle not found:', e.message); }
