// メジャー48エントリ（major-* + pentacles-12 + swords-12）の声を石井ゆかり水準に書き換える
// occult_basis（事実）は触らない。読者語り部分のみ。
import { readFileSync, writeFileSync } from 'fs';

const t = JSON.parse(readFileSync('lib/synthesis/corpus/tarot.v2.json', 'utf-8'));

// 対象キー（既存古い声）
const targetKeys = [];
for (let i = 0; i <= 21; i++) {
  targetKeys.push(`major-${i}:false`, `major-${i}:true`);
}
targetKeys.push('pentacles-12:false', 'pentacles-12:true', 'swords-12:false', 'swords-12:true');

// 読者語り部分のフィールド（occult_basis は事実なので触らない）
// core/upright/shadow も touchするとカード解説の正確性が損なわれるので、文末だけ柔らかく
const softFields = ['now_implies', 'unread_truth', 'prediction_arc', 'turning_point', 'advice_principle', 'caveat'];
const factualFields = ['core', 'upright', 'shadow', 'occult_basis']; // タロット解説部分は断定でOK

// 置換ルール（順序重要：長いものから）
const rules = [
  // 文末の断定 → 柔らかい
  [/。本当は、/g, '。本当は、'],  // すでにOK
  // 「〜になる。」 → 「〜になるように見えます。」
  [/([^。]{4,})になる。/g, '$1になるように見えます。'],
  // 「〜である。」「〜だ。」 → 「〜なのかもしれません。」  ※短い断定のみ
  [/([^「」。]{6,})だと知っておく。/g, '$1だと知っておくといいのかもしれません。'],
  [/([^「」。]{5,})はずだ。/g, '$1のように思います。'],
  [/逃さない。/g, '逃さないでいてください。'],
  [/従う——/g, '従ってみてください——'],
  [/保つ。/g, '保ってください。'],
  [/書き留める。/g, '書き留めておくといいのかもしれません。'],
  [/書き留めない/g, '書き留めずにいる'],
  [/逃さず/g, '逃さずに'],
  // 「〜と」のあとの命令
  [/と知っておく/g, 'と知っておくといいのかもしれません'],
  // 「〜こと。」 → 「〜こと、なのかもしれません。」
  [/しないこと。/g, 'しないでいたいところです。'],
  [/しないでいる/g, 'しないでいる'],  // 既存
  // 命令形
  [/させる。/g, 'させてみてください。'],
  [/させない。/g, 'させずにいたいところです。'],
  [/与える。/g, '与えてみてください。'],
  [/問う。/g, '問うてみてください。'],
  [/数える。/g, '数えてみてください。'],
  [/置く。/g, '置いてみてください。'],
  [/触れる。/g, '触れてみてください。'],
  [/作る。/g, '作ってみてください。'],
  [/決める。/g, '決めてみてください。'],
  [/書く。/g, '書いてみてください。'],
  [/書き出す。/g, '書き出してみてください。'],
  [/言う。/g, '言ってみてください。'],
  [/承認する。/g, '承認してあげてください。'],
  [/受け取る、/g, '受け取る、'],  // 既存
  [/休む」と決める。/g, '休む」と決めてみてください。'],
  // 「〜ではない。」 → 「〜ではないのだと思います。」
  [/ではない。/g, 'ではないのだと思います。'],
  [/でない。/g, 'ではないのかもしれません。'],
  // 「〜できる。」 → 「〜できるように見えます。」
  [/きる。/g, 'きるように見えます。'],
  // 「来る。」 → 「来ます。」
  [/瞬間が来る。/g, '瞬間が訪れるかもしれません。'],
  [/出来事がある。/g, '出来事が訪れることがあるかもしれません。'],
  [/出来事が来る。/g, '出来事が訪れるかもしれません。'],
  [/出会いがある。/g, '出会いがあるかもしれません。'],
  [/兆しが出る。/g, '兆しが見えてくるかもしれません。'],
  // 「〜する。」 → 「〜してみてください。」（advice/turning限定で文末）
  // これは複雑なので個別フィールドで処理
];

let totalChanges = 0;
const changes = {};

for (const k of targetKeys) {
  if (!t[k]) continue;
  changes[k] = 0;
  for (const f of softFields) {
    if (!t[k][f]) continue;
    const before = t[k][f];
    let after = before;
    for (const [pat, rep] of rules) {
      after = after.replace(pat, rep);
    }
    if (before !== after) {
      t[k][f] = after;
      const diff = after.length - before.length;
      changes[k]++;
      totalChanges++;
    }
  }
}

writeFileSync('lib/synthesis/corpus/tarot.v2.json', JSON.stringify(t, null, 2), 'utf-8');

console.log(`総変更フィールド数: ${totalChanges}`);
console.log('エントリごとの変更フィールド数:');
const sorted = Object.entries(changes).sort((a, b) => b[1] - a[1]);
for (const [k, c] of sorted.slice(0, 10)) console.log(`  ${k}: ${c} fields`);
console.log(`...残り ${sorted.length - 10} 件`);

// ノータッチエントリ
const untouched = Object.keys(changes).filter(k => changes[k] === 0);
if (untouched.length > 0) console.log(`変更なし: ${untouched.length}件 (${untouched.slice(0,5).join(',')})`);
