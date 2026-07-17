// 第2ラウンド：より深い別観点での多角デバッグ
import { readFileSync } from 'fs';

const tarot = JSON.parse(readFileSync('lib/synthesis/corpus/tarot.v2.json', 'utf-8'));
const astro = JSON.parse(readFileSync('lib/synthesis/corpus/astrology.v2.json', 'utf-8'));
const num = JSON.parse(readFileSync('lib/synthesis/corpus/numerology.v2.json', 'utf-8'));
const moon = JSON.parse(readFileSync('lib/synthesis/corpus/transit-moon.v2.json', 'utf-8'));
const weaverSrc = readFileSync('lib/synthesis/weaver.ts', 'utf-8');

console.log('━━━━━━━━━━ Debug 20: 占星12星座の声一貫性 ━━━━━━━━━━');
const softMarkers = ['かもしれません', 'のように見えます', 'のではないでしょうか', 'ように思います', 'と思います', 'てください', 'てあげてください', 'ところがあります', 'のかもしれません'];
const softFields = { astro: ['drive', 'hidden_drive', 'shadow', 'current_season', 'current_assignment', 'works_with'], num: ['strength', 'shadow', 'unspoken_struggle', 'life_theme', 'today_lens'] };
function softRatio(entry, fields) {
  let total = 0, soft = 0;
  for (const f of fields) {
    if (!entry[f]) continue;
    total++;
    if (softMarkers.some(m => entry[f].includes(m))) soft++;
  }
  return { ratio: total > 0 ? soft / total : 0, total };
}
const aResults = {};
for (const [k, v] of Object.entries(astro)) {
  aResults[k] = softRatio(v, softFields.astro);
}
const existing3 = ['Pisces', 'Capricorn', 'Gemini'];
const new9 = Object.keys(astro).filter(k => !existing3.includes(k));
const avgExist = existing3.reduce((s, k) => s + aResults[k].ratio, 0) / existing3.length;
const avgNew = new9.reduce((s, k) => s + aResults[k].ratio, 0) / new9.length;
console.log(`既存3星座 (Pisces/Capricorn/Gemini) 寄り添い率: ${(avgExist * 100).toFixed(1)}%`);
console.log(`新9星座 (worker) 寄り添い率: ${(avgNew * 100).toFixed(1)}%`);
console.log(`差: ${((avgNew - avgExist) * 100).toFixed(1)} pt`);
if (avgNew - avgExist > 0.3) console.log('  ⚠️ 占星もメジャー同様の声不一致あり');

console.log('\n━━━━━━━━━━ Debug 21: 数秘12数字の声一貫性 ━━━━━━━━━━');
const nResults = {};
for (const [k, v] of Object.entries(num)) {
  nResults[k] = softRatio(v, softFields.num);
}
const existingN = ['3', '4', '11'];
const newN = Object.keys(num).filter(k => !existingN.includes(k));
const avgExistN = existingN.reduce((s, k) => s + nResults[k].ratio, 0) / existingN.length;
const avgNewN = newN.reduce((s, k) => s + nResults[k].ratio, 0) / newN.length;
console.log(`既存3数字 (3/4/11) 寄り添い率: ${(avgExistN * 100).toFixed(1)}%`);
console.log(`新9数字 (worker) 寄り添い率: ${(avgNewN * 100).toFixed(1)}%`);
console.log(`差: ${((avgNewN - avgExistN) * 100).toFixed(1)} pt`);
if (avgNewN - avgExistN > 0.3) console.log('  ⚠️ 数秘も既存3に声の古さあり');

console.log('\n━━━━━━━━━━ Debug 22: 月トランジット corpus の声 ━━━━━━━━━━');
const mFields = ['mood', 'in_you', 'predicts'];
const mResults = {};
for (const [k, v] of Object.entries(moon)) {
  mResults[k] = softRatio(v, mFields);
}
const avgM = Object.values(mResults).reduce((s, r) => s + r.ratio, 0) / 12;
console.log(`月トランジット12星座 寄り添い率: ${(avgM * 100).toFixed(1)}%`);
if (avgM < 0.3) console.log('  ⚠️ 月トランジットも古い断定声');
// サンプル
console.log(`サンプル (Aries): "${moon.Aries.mood.slice(0, 80)}..."`);

console.log('\n━━━━━━━━━━ Debug 23: weaver の出力総ボリュームシミュレーション ━━━━━━━━━━');
// 8セクション全部の文字数を計算
function simulateOutput(tarotKey, astroKey, numKey, moonKey) {
  const t = tarot[tarotKey], a = astro[astroKey], n = num[numKey], m = moonKey ? moon[moonKey] : null;
  if (!t || !a || !n) return null;
  const profile = ['まず、あなたという人のことを、少しだけ。', a.hidden_drive, n.unspoken_struggle, m && m.in_you].filter(Boolean).join('\n\n');
  const sky = m ? `${m.mood}\n\n${m.predicts}` : '';
  const situation = [a.current_season, t.now_implies].join('\n\n');
  const interaction = '[動的生成 ~200文字 x 2 = 約400]';
  const unread = ['ここからは、少し触れにくいことかもしれません。でも、そっとお伝えしておきたいのです。', t.unread_truth, `——${a.current_assignment}`, m ? '...月との呼応...' : ''].filter(Boolean).join('\n\n');
  const essence = t.upright || t.shadow;
  const message = [essence, n.today_lens, a.works_with, `——${t.occult_basis}`].filter(Boolean).join('\n\n');
  const prediction = ['これから先のことを、占いの見立てとして少しだけ。', t.prediction_arc, `そのきざしが訪れるとしたら——${t.turning_point}`, m && `今日の月の動きも、こんなふうにささやいています——${m.predicts}`].filter(Boolean).join('\n\n');
  const action = `${t.advice_principle}${t.caveat ? ' ただし、' + t.caveat : ''}`;
  return { profile: profile.length, sky: sky.length, situation: situation.length, interaction: 400, unread: unread.length, message: message.length, prediction: prediction.length, action: action.length };
}
const cases = [
  { name: '魚座×3×Knight of Pentacles逆', t: 'pentacles-12:true', a: 'Pisces', n: '3', m: 'Virgo' },
  { name: '牡羊座×1×Ten of Swords逆', t: 'swords-10:true', a: 'Aries', n: '1', m: 'Virgo' },
  { name: '蟹座×9×Page of Cups正', t: 'cups-11:false', a: 'Cancer', n: '9', m: 'Virgo' },
  { name: '射手座×8×Three of Wands正', t: 'wands-3:false', a: 'Sagittarius', n: '8', m: 'Virgo' }
];
console.log('セクションごとの文字数（4ケース）:');
console.log('  ' + ['name'.padEnd(35), 'profile', 'sky', 'situation', 'interaction', 'unread', 'message', 'prediction', 'action', 'TOTAL'].join('\t'));
for (const c of cases) {
  const sim = simulateOutput(c.t, c.a, c.n, c.m);
  if (!sim) { console.log(`  ${c.name}: 不能`); continue; }
  const total = Object.values(sim).reduce((s, v) => s + v, 0);
  console.log(`  ${c.name.padEnd(35)}\t${sim.profile}\t${sim.sky}\t${sim.situation}\t${sim.interaction}\t${sim.unread}\t${sim.message}\t${sim.prediction}\t${sim.action}\t${total}`);
}
console.log('→ 読者は1日の鑑定で全部読むかは別問題。長い場合はセクション分割UIに');

console.log('\n━━━━━━━━━━ Debug 24: 表現の重複・パターン化チェック ━━━━━━━━━━');
// 「のかもしれません」が頻出しすぎてないか
const phrases = { 'のかもしれません': 0, 'のように見えます': 0, 'のではないでしょうか': 0, 'ように思います': 0 };
let totalSentences = 0;
for (const [k, v] of Object.entries(tarot)) {
  for (const f of ['now_implies', 'unread_truth', 'prediction_arc']) {
    const txt = v[f] || '';
    totalSentences += (txt.match(/[。]/g) || []).length;
    for (const p of Object.keys(phrases)) {
      if (txt.includes(p)) phrases[p]++;
    }
  }
}
console.log('表現の頻度（タロット156エントリ × 主要3フィールド）:');
for (const [p, c] of Object.entries(phrases)) {
  console.log(`  "${p}": ${c}回 / ${(c / (156 * 3) * 100).toFixed(0)}%`);
}
console.log(`総文(。)数: ${totalSentences}`);

console.log('\n━━━━━━━━━━ Debug 25: 痛いカード×繊細な星座の組合せ品質 ━━━━━━━━━━');
// 3 of Swords (心の痛み) × 魚座 (繊細) → 脅し過剰でないか
const painfulCards = ['swords-3:false', 'swords-9:false', 'swords-10:false', 'major-13:false', 'major-15:false', 'major-16:false'];
const fragileSigns = ['Pisces', 'Cancer', 'Scorpio'];
console.log('痛いカード × 繊細星座の組合せ → unread_truth と caveat の存在チェック:');
for (const ck of painfulCards.slice(0, 3)) {
  const c = tarot[ck];
  const hasCaveat = !!c.caveat;
  const hasRescue = (c.unread_truth || '').match(/救い|赦|大丈夫|あなたは消えない|戻ってきます/);
  console.log(`  ${ck}: caveat=${hasCaveat ? '○' : '×'} 救いの種=${hasRescue ? '○' : '微妙'}`);
}

console.log('\n━━━━━━━━━━ Debug 26: weaver の Pythia 残存チェック ━━━━━━━━━━');
const pythiaCount = (weaverSrc.match(/Pythia/g) || []).length;
console.log(`weaver.ts 内の "Pythia" 言及: ${pythiaCount}回`);
if (pythiaCount > 0) {
  // 文脈チェック
  weaverSrc.split('\n').forEach((line, i) => {
    if (line.includes('Pythia')) console.log(`  L${i + 1}: ${line.trim().slice(0, 100)}`);
  });
}

console.log('\n━━━━━━━━━━ Debug 27: expression number 利用状況 ━━━━━━━━━━');
const usesExp = weaverSrc.includes('expression');
console.log(`weaver で expression number 利用: ${usesExp ? '○' : '× 未使用（拡張余地）'}`);
console.log('  → engine は名前から expression number を計算してるが、weaver の鑑定に反映されていない');

console.log('\n━━━━━━━━━━ Debug 28: occult_basis のデカン情報組み込み率 ━━━━━━━━━━');
// マイナー数札（2-10）はデカン対応がある。occult_basis にデカン情報が入ってるか
const minorNumbered = Object.keys(tarot).filter(k => {
  const [card] = k.split(':');
  const [suit, num] = card.split('-');
  return ['wands', 'cups', 'swords', 'pentacles'].includes(suit) && parseInt(num) >= 2 && parseInt(num) <= 10;
});
let hasDecanInfo = 0;
const decanKeywords = ['座 0-10°', '座 10-20°', '座 20-30°', '座0-10°', '座10-20°', '座20-30°', 'デカン'];
for (const k of minorNumbered) {
  const occult = tarot[k].occult_basis || '';
  if (decanKeywords.some(d => occult.includes(d))) hasDecanInfo++;
}
console.log(`マイナー数札 ${minorNumbered.length}枚中、デカン情報が occult_basis にあるもの: ${hasDecanInfo} (${(hasDecanInfo / minorNumbered.length * 100).toFixed(0)}%)`);

console.log('\n━━━━━━━━━━ Debug 29: 占星 12星座 hidden_drive と shadow が「断定読者語り」になってないか ━━━━━━━━━━');
// 既存3 (Pisces/Capricorn/Gemini) は研究 02 のサンプル素材で断定的だった
// 新9 (Worker) は石井ゆかり水準を期待
function checkAssertion(field, text) {
  // 「あなたは○○だ」「○○の人は○○する」型の断定パターン
  const assertive = ['だから', 'のは○○である', 'を体現する', '体現'];
  // 断定終わり
  const endsAssert = /[だ。]$/.test(text.trim()) || text.includes('だから');
  return endsAssert;
}
let assertiveAstro = [];
for (const [k, v] of Object.entries(astro)) {
  for (const f of ['hidden_drive', 'shadow', 'current_season', 'current_assignment']) {
    const txt = v[f] || '';
    if (existing3.includes(k) && txt.length > 50 && !softMarkers.some(m => txt.includes(m))) {
      assertiveAstro.push(`${k}.${f}`);
    }
  }
}
console.log(`既存3星座で寄り添い語のないフィールド: ${assertiveAstro.length}個`);
if (assertiveAstro.length > 0) {
  assertiveAstro.slice(0, 5).forEach(s => console.log(`  ${s}`));
  console.log('  → 既存3星座も声のaudit対象');
}

console.log('\n━━━━━━━━━━ Debug 30: 月 corpus の星座一致 ━━━━━━━━━━');
const expectedSigns = ['Aries', 'Taurus', 'Gemini', 'Cancer', 'Leo', 'Virgo', 'Libra', 'Scorpio', 'Sagittarius', 'Capricorn', 'Aquarius', 'Pisces'];
const moonKeys = Object.keys(moon);
const missingMoonSigns = expectedSigns.filter(s => !moonKeys.includes(s));
const extraMoonSigns = moonKeys.filter(s => !expectedSigns.includes(s));
console.log(`月 corpus: ${moonKeys.length}サイン`);
console.log(`欠けてる: ${missingMoonSigns.length === 0 ? 'なし ✅' : missingMoonSigns.join(',')}`);
console.log(`余分: ${extraMoonSigns.length === 0 ? 'なし ✅' : extraMoonSigns.join(',')}`);

console.log('\n━━━━━━━━━━ Debug 31: 既存3星座の Greene 引用残存 ━━━━━━━━━━');
// research/02 で Greene の引用 (guilt-trip-power trip, irresponsible-child syndrome) があった
// 既存3星座にそのまま残ってないか確認
const greeneSamples = { 'Pisces': ['guilt-trip', 'deadly passivity'], 'Gemini': ['irresponsible-child'], 'Capricorn': ['sculpted into form'] };
for (const [sign, samples] of Object.entries(greeneSamples)) {
  for (const s of samples) {
    const allFields = JSON.stringify(astro[sign]);
    if (allFields.includes(s)) console.log(`  ⚠️ ${sign} に未翻訳の Greene 引用 "${s}" が残ってる`);
  }
}
console.log('Greene 引用の残存チェック完了（残ってないことが望ましい）');

console.log('\n━━━━━━━━━━ Debug 32: タロット upright/shadow の長さバランス ━━━━━━━━━━');
let urLengths = [], shLengths = [];
for (const [k, v] of Object.entries(tarot)) {
  if (v.upright) urLengths.push(v.upright.length);
  if (v.shadow) shLengths.push(v.shadow.length);
}
const avg = arr => arr.reduce((s, v) => s + v, 0) / arr.length;
console.log(`upright (正位置) 平均: ${Math.round(avg(urLengths))}文字 / 件数: ${urLengths.length}`);
console.log(`shadow (逆位置) 平均: ${Math.round(avg(shLengths))}文字 / 件数: ${shLengths.length}`);
console.log(`合計: ${urLengths.length + shLengths.length} (期待 156)`);
if (urLengths.length + shLengths.length !== 156) console.log('  ⚠️ upright/shadow のフィールド漏れあり');

console.log('\n━━━━━━━━━━ Debug 33: weaver が使う各フィールドの利用率 ━━━━━━━━━━');
// weaver は core を直接使ってない。core が無駄ではないか確認
const usedByWeaver = ['element', 'upright', 'shadow', 'now_implies', 'unread_truth', 'prediction_arc', 'turning_point', 'occult_basis', 'advice_principle', 'caveat'];
const notUsedByWeaver = ['core']; // weaver は core を直接読まない
console.log(`weaver が直接利用するフィールド: ${usedByWeaver.length}個`);
console.log(`未利用フィールド: ${notUsedByWeaver.join(', ')}`);
console.log('  → core はメタ情報（カードの本質1行）として保持。将来UI（カード詳細）で利用可');

console.log('\n━━━━━━━━━━ Debug 34: weaver の interaction 文字数推定 ━━━━━━━━━━');
// element 16通りに各 2-3文の interaction → 約200-400文字
const interactionFnSize = (weaverSrc.match(/function tarotZodiacInteraction[\s\S]+?\n\}/) || [''])[0].length;
console.log(`interaction 関数のサイズ: ${interactionFnSize}文字`);

console.log('\n━━━━━━━━━━ Debug 35: 占星 works_with の正確性 ━━━━━━━━━━');
// works_with は「タロットのどのスートと共鳴するか」を述べる。星座element と一致するスートを言及してるか
const expectedSuit = { fire: 'ワンド', earth: 'ペンタクル', air: 'ソード', water: 'カップ' };
let worksWithIssues = [];
for (const [sign, v] of Object.entries(astro)) {
  const txt = v.works_with || '';
  const expected = expectedSuit[v.element];
  if (!txt.includes(expected)) worksWithIssues.push(`${sign} (${v.element}): works_with に "${expected}" 言及無し`);
}
console.log(`works_with の整合性: ${worksWithIssues.length === 0 ? '✅ 12星座全部 OK' : worksWithIssues.length + '件不整合'}`);
if (worksWithIssues.length > 0) worksWithIssues.forEach(i => console.log('  ' + i));

console.log('\n━━━━━━━━━━ Debug 36: 占星 hidden_drive の固有性チェック ━━━━━━━━━━');
// 固有名詞（その星座名）が hidden_drive に含まれてるか＝バーナム回避
let withSignName = 0;
for (const [sign, v] of Object.entries(astro)) {
  const signJp = { Aries: '牡羊座', Taurus: '牡牛座', Gemini: '双子座', Cancer: '蟹座', Leo: '獅子座', Virgo: '乙女座', Libra: '天秤座', Scorpio: '蠍座', Sagittarius: '射手座', Capricorn: '山羊座', Aquarius: '水瓶座', Pisces: '魚座' }[sign];
  const txt = v.hidden_drive || '';
  if (txt.includes(signJp) || txt.includes(sign)) withSignName++;
}
console.log(`hidden_drive に星座名言及: ${withSignName}/12 (${(withSignName / 12 * 100).toFixed(0)}%)`);

console.log('\n━━━━━━━━━━ Debug 37: 数秘 today_lens に数字言及 ━━━━━━━━━━');
let withNumber = 0;
for (const [k, v] of Object.entries(num)) {
  const txt = v.today_lens || '';
  if (txt.includes(k + 'の') || txt.includes(`ライフパス${k}`)) withNumber++;
}
console.log(`today_lens に数字言及: ${withNumber}/12 (${(withNumber / 12 * 100).toFixed(0)}%)`);

console.log('\n━━━━━━━━━━ Debug 38: タロット数札5/9/10の痛さ→救いバランス ━━━━━━━━━━');
const painCards = ['cups-5', 'swords-5', 'swords-9', 'swords-10', 'pentacles-5'];
console.log('痛みカード5枚 × 正逆 = 10エントリ:');
for (const c of painCards) {
  for (const rev of [':false', ':true']) {
    const k = c + rev;
    const v = tarot[k];
    if (!v) continue;
    const hasRescue = !!(v.caveat || (v.advice_principle || '').includes('優しく') || (v.advice_principle || '').includes('小さく'));
    console.log(`  ${k}: caveat=${v.caveat ? '○' : '×'} 優しい advice=${hasRescue ? '○' : '微妙'}`);
  }
}

console.log('\n━━━━━━━━━━ Debug 39: 重複言い回し（マイナーで頻出パターン） ━━━━━━━━━━');
// 同じカード/異なるエントリで似た言い回しが頻出してないか
const stockPhrases = ['そんな状態かもしれません', 'を促しています', 'のかもしれません', '今日のカードは'];
const counts = {};
for (const p of stockPhrases) {
  counts[p] = 0;
  for (const v of Object.values(tarot)) {
    for (const txt of Object.values(v).filter(x => typeof x === 'string')) {
      counts[p] += (txt.match(new RegExp(p, 'g')) || []).length;
    }
  }
}
console.log('頻出パターン使用回数:');
for (const [p, c] of Object.entries(counts)) console.log(`  "${p}": ${c}回`);
if (counts['今日のカードは'] > 100) console.log('  ⚠️ "今日のカードは" 使いすぎ');

console.log('\n━━━━━━━━━━ Debug 40: prediction_arc の時間範囲分布 ━━━━━━━━━━');
// 「日数」表現の分布。多様性があるか
const timeExpr = { '1〜2週': 0, '2〜3週': 0, '3〜4週': 0, '48時間': 0, '3日': 0, '5日': 0, '7日': 0, '10日': 0, '14日': 0, '21日': 0, '1ヶ月': 0 };
for (const v of Object.values(tarot)) {
  const txt = v.prediction_arc || '';
  for (const t of Object.keys(timeExpr)) if (txt.includes(t)) timeExpr[t]++;
}
console.log('時間表現の分布（prediction_arc）:');
for (const [t, c] of Object.entries(timeExpr)) console.log(`  "${t}": ${c}回`);

console.log('\n========== 第2ラウンドデバッグ完了 ==========');
