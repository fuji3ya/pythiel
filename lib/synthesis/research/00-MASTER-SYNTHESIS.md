# Pythiel 占術エンジン — マスター統合設計書

> 9本のリサーチ（01-09）を1枚に統合。「何を調べたか」を「何を作るか」に変換する設計の正本。
> **これを読めば Pythiel の占術的中身の全体像と実装ロードマップが分かる。**

---

## 0. 一行で言うと

**Pythiel = 世界の主要占術の正統（Waite/Golden Dawn/心理占星術/Pythagorean数秘/Elder Futhark）を、
ユング心理学と日本最高峰の占い文体（石井ゆかり）で語り、
生年月日＋名前＋実天体配置から一意の鑑定を決定論的に織る、完全端末内エンジン。**

---

## 1. リサーチ9本の地図

| # | 文書 | 役割 | 一言 |
|---|---|---|---|
| 01 | tarot-waite-1911 | タロット一次資料 | Waite原典・大アルカナ22枚正逆 |
| 02 | astrology-psychological | 星座深層 | Greene/Arroyo・12星座の影と隠れた動機 |
| 03 | numerology-pythagorean | 数字 | Pythagorean・1-9+11/22/33 |
| 04 | runes-elder-futhark | ルーン | Elder Futhark 24・3アエット |
| 05 | divination-design-principles | **エンジン哲学** | なぜ当たる・Barnum回避・統合の技法 |
| 06 | cross-tradition-systems | **横断ロードマップ** | 易経/ヴェーダ/BaZi/カバラ・機能候補 |
| 07 | minor-arcana-full | タロット完成 | マイナー56枚正逆・数×スートの論理 |
| 08 | japanese-market-and-voice | **文体・声の確定** | 日本市場・石井ゆかり・鏡リュウジ・エニアグラム |
| 09 | decans-timing-frontier | **精密統合技法** | デカン36対応・年齢予言・タロット史 |

---

## 2. Pythiel の「精度」の正体（リサーチ05+09より）

占いが「当たる気がする」のではなく「本当に当たる」ための6原理：

1. **固有性（Barnum 撲滅）**: 生年月日 × 名前 × 今日の天体 → 一意の組み合わせ。手書き星座占い（全魚座に同じ）に対する構造的優位
2. **統合（Synthesis）**: カードを孤立で読まず、element dignity（Golden Dawn）で関係を読む
3. **矛盾検出**: 占術が反対を示す時「内的葛藤」として明示（Celtic Cross プロ技）
4. **鏡のトーン（Jung）**: 断定でなく「あなたの中にこれがある」。読者の心が参加して完成
5. **時間の予言**: ネイタル（不変）× トランジット（今）× 年齢サイクル
6. **元型（Jung）**: 普遍的人類パターンに触れて「既にある」感

**確証**: この「核を中心に・相互作用で・決定論的に読む」設計は、西洋（Celtic Cross）・中国（BaZi 日干）・易経が
**独立して到達した普遍原理**。Pythiel の weaver はこれと一致＝占いの本質を掴んでいる。

---

## 3. Pythiel の「声」の確定仕様（リサーチ08より）★最重要

### 日本市場の真実
占い ＝「未来を決めるもの」でなく **「心を整える時間」「背中を押す存在」**。
「当たる」より **「心の準備をくれた」** が満足の核。断定は引かれる。

### 文体の北極星 = 石井ゆかり（日本一売れる占い師・累計520万部）
1. **否定的状況の再フレーム**（停滞→土台が深まる時間）
2. **優しい二人称**（隣で一緒に星を見る距離感）
3. **断定でなく余白**（〜かもしれません、で解釈を委ねる）
4. **時間への眼差し**（今は〜の季節）
5. **救済より気づき**（答えより気づくきっかけ）

### 哲学の系譜 = ユング → 鏡リュウジ → Pythiel
占い ＝ **自己理解ツール・内面と向き合う鏡**（Apple 4.3 対策とも完全一致）

### Pythia の声の再調整（必須の改修）
現在の Pythia は神託的で断定的すぎる。日本市場には**優しく余白のある声**を：
- ❌ 「Pythia は告げなければなりません」（神託・断定）
- ✅ 「これは、そっとお伝えしたいことです」（寄り添い・余白）
- Pythia = 厳格な神託者でなく **隣に座って一緒に星を読む賢者**

---

## 4. コーパスの完成形（何を書くか）

### タロット 78枚 × 正逆 = 156エントリ
- **大アルカナ22**: Waite原典（01）+ カバラのヘブライ文字（06）を occult_basis に
- **マイナー56**: キーワード基盤（07）+ 「数×スート」論理 + **デカン対応（09）で厳密な天文根拠**
- 各エントリ: element / core / upright|shadow / now_implies / unread_truth / prediction_arc / turning_point / occult_basis / advice_principle / caveat / **decan（新）/ hebrew_letter（大のみ・新）/ archetype（新）**

### 占星術 12星座
- Greene/Arroyo（02）: core / drive / hidden_drive / shadow / current_season / current_assignment / works_with / element

### 数秘 12数字（1-9, 11, 22, 33）
- Pythagorean（03）: core / strength / shadow / unspoken_struggle / life_theme / today_lens / resonates_with

### ルーン 24
- Elder Futhark（04）: core / voice / applied_today / invertible（既存）

### 月トランジット 12サイン（既存）+ 拡張
- 金星/水星/火星のトランジット（06）

---

## 5. weaver の進化ロードマップ（どう織るか）

### 現状（V3.5）
profile → sky_today → situation → interaction → unread_truth → message → prediction → action
の8セクション物語アーク。element 相互作用＋Pythia の声＋月トランジット実装済み。

### 次の進化（リサーチ反映）
| 改修 | 出典 | 効果 |
|---|---|---|
| **Pythia の声を石井ゆかり水準に** | 08 | 日本市場で刺さる文体（最優先） |
| **element dignity を Golden Dawn 正統に** | 05/06 | 火⇄水＝「成長の緊張」、水⇄風＝諸刃 |
| **デカン同期検出** | 09 | 今日の天体が引いたカードのデカンにいるか→本物のシンクロ |
| **矛盾検出** | 05 | 占術が反対方向→「内的葛藤」セクション動的生成 |
| **年齢の文脈** | 06/09 | Personal Year + Profection + Saturn/Jupiter Return |
| **元型の織り込み** | 09 | Shadow/Anima/Self をunread_truthの深層に |

---

## 6. 実装ロードマップ（優先順）

### Phase A：声とコーパスの質（今すぐ・最大の価値）
1. **Pythia の声を石井ゆかり水準に再調整**（weaver の語り口）← 日本市場で最も効く
2. **既存48タロットエントリを Waite原典＋デカンで audit・改訂**（特に Star/Fool の古典整合）
3. **占星3→12星座、数秘3→12 に拡張**（worker投入・WRITING-GUIDE基準）

### Phase B：統合精度（中期・決定論で実装可能）
4. **element dignity を Golden Dawn 正統化**（weaver ロジック）
5. **年齢の文脈**（Personal Year/Profection/Saturn Return）を新セクションに
6. **デカン同期検出**（astronomy-engine ＋ デカン表）

### Phase C：マイナー全56枚 + ルーン拡充（量産・worker）
7. マイナー56枚を「キーワード×数論理×デカン」で執筆
8. ルーン24を Elder Futhark 正統で

### Phase D：将来の占術追加（長期）
9. 易経（boolean構造・決定論と相性最高）
10. ヴェーダのダーシャ / BaZi五行

---

## 7. Pythiel が「ChatGPT占い」と決定的に違う理由（営業の核）

| | 手書き星座占い | ChatGPT占い | **Pythiel** |
|---|---|---|---|
| 固有性 | 全魚座に同じ（Barnum） | 毎回ランダムで再現性なし | **生年月日×名前×天体で一意・決定論** |
| 占術的根拠 | 曖昧 | それっぽいが出典なし | **Waite原典/Golden Dawn/デカンに整合** |
| 天体の実配置 | 使わない | 使えない | **astronomy-engine で実計算** |
| プライバシー | — | サーバー送信 | **完全端末内** |
| コスト | — | API毎回課金 | **端末内＝限界費用0** |
| 文体 | バラバラ | AIっぽい | **石井ゆかり水準の日本語** |

**Pythiel の堀**: 「正統な占術知識 × 実天体計算 × 一意性 × 端末内 × 日本語の文体」を**同時に**満たすものは他にない。

---

## 8. 次のアクション

リサーチは完了（9本＋本統合書）。実装フェーズへ。
推奨スタート：**Phase A-1（Pythia の声を石井ゆかり水準に）** — 最小の変更で最大の体感差。
weaver の語り口だけ変えて、preview で before/after を見れば「日本市場の声」が一発で分かる。
