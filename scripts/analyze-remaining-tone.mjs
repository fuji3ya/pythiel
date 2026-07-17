// 既存48エントリの残ってる断定パターンを分析して、対象エントリを特定
import { readFileSync } from 'fs';

const t = JSON.parse(readFileSync('lib/synthesis/corpus/tarot.v2.json', 'utf-8'));
const targetKeys = [];
for (let i = 0; i <= 21; i++) targetKeys.push(`major-${i}:false`, `major-${i}:true`);
targetKeys.push('pentacles-12:false', 'pentacles-12:true', 'swords-12:false', 'swords-12:true');

const softFields = ['now_implies', 'unread_truth', 'prediction_arc', 'turning_point', 'advice_principle', 'caveat'];
const softMarkers = ['かもしれません', 'のように見えます', 'のではないでしょうか', 'ように思います', 'と思います', 'てください', 'てあげてください', 'ところがあります', 'のだと思います'];

// 各エントリの寄り添い率を出す
const ratios = [];
for (const k of targetKeys) {
  if (!t[k]) continue;
  let soft = 0, total = 0;
  for (const f of softFields) {
    if (!t[k][f]) continue;
    total++;
    if (softMarkers.some(m => t[k][f].includes(m))) soft++;
  }
  ratios.push({ key: k, ratio: total ? soft / total : 0, soft, total });
}

// 寄り添い率の低い順
ratios.sort((a, b) => a.ratio - b.ratio);

console.log('━━━━━━━━━━ 既存48エントリの寄り添い率分布 ━━━━━━━━━━');
const bands = { 0: 0, 25: 0, 50: 0, 75: 0, 100: 0 };
for (const r of ratios) {
  if (r.ratio < 0.25) bands[0]++;
  else if (r.ratio < 0.5) bands[25]++;
  else if (r.ratio < 0.75) bands[50]++;
  else if (r.ratio < 1.0) bands[75]++;
  else bands[100]++;
}
console.log(`0-25%: ${bands[0]}件 (要書き換え)`);
console.log(`25-50%: ${bands[25]}件 (要書き換え)`);
console.log(`50-75%: ${bands[50]}件 (要部分改修)`);
console.log(`75-100%: ${bands[75]}件 (微調整)`);
console.log(`100%: ${bands[100]}件 (OK)`);

console.log('\n━━━━━━━━━━ 0-50% (要書き換え) ━━━━━━━━━━');
ratios.filter(r => r.ratio < 0.5).forEach(r => console.log(`  ${r.key}: ${r.soft}/${r.total} (${(r.ratio*100).toFixed(0)}%)`));

console.log('\n━━━━━━━━━━ 断定的な末尾の頻出パターン ━━━━━━━━━━');
// すべてのsoftFieldsの末尾文を集計
const endings = {};
for (const k of targetKeys) {
  for (const f of softFields) {
    const txt = t[k]?.[f] || '';
    // 各文を「。」で分割し、末尾の20字を抽出
    const sentences = txt.split('。').filter(s => s.trim());
    for (const s of sentences) {
      const ending = s.slice(-15).trim();
      if (!softMarkers.some(m => ending.includes(m))) {
        endings[ending] = (endings[ending] || 0) + 1;
      }
    }
  }
}
const sortedEndings = Object.entries(endings).sort((a, b) => b[1] - a[1]).slice(0, 20);
console.log('断定的な文末トップ20:');
for (const [end, count] of sortedEndings) {
  if (count >= 2) console.log(`  "${end}" × ${count}`);
}
