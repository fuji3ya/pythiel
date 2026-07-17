// weaver の全パターン動作テスト
import { readFileSync, writeFileSync } from 'fs';

const tarot = JSON.parse(readFileSync('lib/synthesis/corpus/tarot.v2.json', 'utf-8'));
const astro = JSON.parse(readFileSync('lib/synthesis/corpus/astrology.v2.json', 'utf-8'));

console.log('━━━━━━━━━━ Debug 11: element dignity 全組合せ ━━━━━━━━━━');
// 16通り（カード4元素 × 星座4元素）の組合せが weaver で正しく分岐するか確認
const cardElByExample = { fire: 'wands-1:false', water: 'cups-1:false', air: 'swords-1:false', earth: 'pentacles-1:false' };
const signByElement = { fire: 'Aries', water: 'Pisces', air: 'Gemini', earth: 'Capricorn' };

console.log('期待される dignity 関係:');
console.log('  同一: 共鳴 / 火⇄水: 敵対 / 風⇄土: 敵対 / 火⇄風: 友和(active) / 水⇄土: 友和(passive)');
console.log('  風⇄水: friendly / 火⇄土: friendly\n');

const combinations = [];
for (const [cardEl, cardKey] of Object.entries(cardElByExample)) {
  for (const [sunEl, sunKey] of Object.entries(signByElement)) {
    let relation;
    if (cardEl === sunEl) relation = '共鳴(same)';
    else if ((cardEl === 'fire' && sunEl === 'water') || (cardEl === 'water' && sunEl === 'fire')) relation = '敵対(火↔水)';
    else if ((cardEl === 'air' && sunEl === 'earth') || (cardEl === 'earth' && sunEl === 'air')) relation = '敵対(風↔土)';
    else if ((cardEl === 'fire' && sunEl === 'air') || (cardEl === 'air' && sunEl === 'fire')) relation = '友和(active)';
    else relation = '友和(passive)';
    combinations.push({ cardEl, sunEl, sun: sunKey, cardKey, relation });
  }
}

console.log('16通りの組合せ:');
combinations.forEach(c => {
  console.log(`  ${c.cardEl.padEnd(5)} card × ${c.sunEl.padEnd(5)} sun (${c.sun}) → ${c.relation}`);
});

console.log('\n━━━━━━━━━━ Debug 12: 既存48 vs 新54 の声整合性 ━━━━━━━━━━');
// 寄り添い語（〜かもしれません等）が含まれる比率を測る
const softMarkers = ['かもしれません', 'のように見えます', 'のではないでしょうか', 'ように思います', 'と思います', 'てください', 'てあげてください'];
const softFields = ['now_implies', 'unread_truth', 'prediction_arc', 'turning_point', 'advice_principle', 'caveat'];

function softRatio(entry) {
  let total = 0, soft = 0;
  for (const f of softFields) {
    if (!entry[f]) continue;
    total++;
    if (softMarkers.some(m => entry[f].includes(m))) soft++;
  }
  return total > 0 ? soft / total : 0;
}

const oldEntries = [];  // 既存: major-all + pentacles-12 + swords-12
const newEntries = [];  // 新: マイナーの大半

for (const [key, val] of Object.entries(tarot)) {
  const r = softRatio(val);
  if (key.startsWith('major-') || key === 'pentacles-12:false' || key === 'pentacles-12:true' || key === 'swords-12:false' || key === 'swords-12:true') {
    oldEntries.push({ key, ratio: r });
  } else {
    newEntries.push({ key, ratio: r });
  }
}

const avg = arr => arr.reduce((s, e) => s + e.ratio, 0) / arr.length;
console.log(`既存エントリ (${oldEntries.length}枚) の softMarker 比率: ${(avg(oldEntries)*100).toFixed(1)}%`);
console.log(`新エントリ (${newEntries.length}枚) の softMarker 比率: ${(avg(newEntries)*100).toFixed(1)}%`);
console.log(`→ 差: ${((avg(newEntries) - avg(oldEntries)) * 100).toFixed(1)} ポイント`);

// 既存で低い（古い声強い）トップ10
console.log('\n既存で「寄り添い度」が低いトップ10（古い声が残ってる候補）:');
oldEntries.sort((a, b) => a.ratio - b.ratio).slice(0, 10).forEach(e => {
  console.log(`  ${e.key}: ${(e.ratio * 100).toFixed(0)}%`);
});

console.log('\n━━━━━━━━━━ Debug 13: 既存サンプル全文（声の古さ確認） ━━━━━━━━━━');
// 既存 major-0:false（Fool 正位置）の全フィールドを出力して声を確認
const sample = tarot['major-0:false'];
console.log('既存 major-0:false (Fool 正位置):');
console.log('  now_implies:', sample.now_implies);
console.log('  unread_truth:', sample.unread_truth);
console.log('  advice_principle:', sample.advice_principle);
console.log('  caveat:', sample.caveat);
