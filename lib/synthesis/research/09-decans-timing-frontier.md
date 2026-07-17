# デカン体系・年齢タイミング・占術の辺境

第4波リサーチ。タロットと占星術を**計算可能に統合する架け橋（デカン）**、年齢ベースの予言（profection / Saturn return）、
そしてタロット史の真実・周辺占術（手相/夢/チャクラ）。

---

## A. ★最重要：デカン体系 — タロットと占星術の計算可能な架け橋

**出典**: Golden Dawn / T. Susan Chang "36 Secrets" / [Kerykeion](https://kerykeion.net/content/learn-tarots/guides/minor-arcana-decans)

### これが何を解決するか
今まで Pythiel の weaver は「タロットの element」と「星座の element」を**ざっくり**対応させていた。
だが **Golden Dawn のデカン体系**は、36枚のマイナーアルカナ（各スートの2-10）を、**黄道の36の10度区分に厳密に対応**させる。
これにより「**今日引いたカード**」と「**今日の実際の天体配置**」が、伝統的かつ計算可能に結びつく。

### スート ↔ 三区分（triplicity）
| スート | 元素 | 対応する3星座 |
|---|---|---|
| Wands | 火 | Aries, Leo, Sagittarius |
| Cups | 水 | Cancer, Scorpio, Pisces |
| Swords | 風 | Libra, Aquarius, Gemini |
| Pentacles | 土 | Capricorn, Taurus, Virgo |

### 36デカン完全対応表（カルデア順の惑星支配）
| カード | デカン | 支配惑星 |
|---|---|---|
| **Wands** | | |
| 2 of Wands | 牡羊座 0-10° | Mars |
| 3 of Wands | 牡羊座 10-20° | Sun |
| 4 of Wands | 牡羊座 20-30° | Venus |
| 5 of Wands | 獅子座 0-10° | Saturn |
| 6 of Wands | 獅子座 10-20° | Jupiter |
| 7 of Wands | 獅子座 20-30° | Mars |
| 8 of Wands | 射手座 0-10° | Mercury |
| 9 of Wands | 射手座 10-20° | Moon |
| 10 of Wands | 射手座 20-30° | Saturn |
| **Cups** | | |
| 2 of Cups | 蟹座 0-10° | Venus |
| 3 of Cups | 蟹座 10-20° | Mercury |
| 4 of Cups | 蟹座 20-30° | Moon |
| 5 of Cups | 蠍座 0-10° | Mars |
| 6 of Cups | 蠍座 10-20° | Sun |
| 7 of Cups | 蠍座 20-30° | Venus |
| 8 of Cups | 魚座 0-10° | Saturn |
| 9 of Cups | 魚座 10-20° | Jupiter |
| 10 of Cups | 魚座 20-30° | Mars |
| **Swords** | | |
| 2 of Swords | 天秤座 0-10° | Moon |
| 3 of Swords | 天秤座 10-20° | Saturn |
| 4 of Swords | 天秤座 20-30° | Jupiter |
| 5 of Swords | 水瓶座 0-10° | Venus |
| 6 of Swords | 水瓶座 10-20° | Mercury |
| 7 of Swords | 水瓶座 20-30° | Moon |
| 8 of Swords | 双子座 0-10° | Jupiter |
| 9 of Swords | 双子座 10-20° | Mars |
| 10 of Swords | 双子座 20-30° | Sun |
| **Pentacles** | | |
| 2 of Pentacles | 山羊座 0-10° | Jupiter |
| 3 of Pentacles | 山羊座 10-20° | Mars |
| 4 of Pentacles | 山羊座 20-30° | Sun |
| 5 of Pentacles | 牡牛座 0-10° | Mercury |
| 6 of Pentacles | 牡牛座 10-20° | Moon |
| 7 of Pentacles | 牡牛座 20-30° | Saturn |
| 8 of Pentacles | 乙女座 0-10° | Sun |
| 9 of Pentacles | 乙女座 10-20° | Venus |
| 10 of Pentacles | 乙女座 20-30° | Mercury |

### Pythiel への決定的価値
1. **occult_basis フィールドの精度激増**: 「9 of Swords ＝ 双子座10-20°・火星のデカン＝思考の中の暴力性」と**厳密な天文学的根拠**を書ける
2. **動的な「今日の同期」検出**: astronomy-engine で**今日の太陽/月/惑星が、引いたカードのデカンにいるか**を計算できる。「今日引いた5 of Cups（蠍座0-10°）に、実際に今日 火星が蠍座を運行中——これは強い共鳴」という**本物のシンクロニシティ**を動的生成できる（実装可能・決定論）
3. これは「タロットと占星術が偶然でなく繋がっている」を**計算で証明**する。Pythiel 独自の強み

---

## B. 年齢ベースの予言 — 「人生のどこにいるか」

数秘の Personal Year（リサーチ06）に加え、占星術の年齢タイミングが手に入った。**全部生年月日だけで計算可能＝決定論。**

### B-1. Annual Profections（年間プロフェクション）★Hellenistic の精密技法
- **計算**: `年齢 mod 12` → アクティブなハウス（1-12）
  - 年齢 mod 12 = 1 → 1ハウス年（自己・身体・新章）
  - = 2 → 2ハウス年（お金・価値）... = 0 → 12ハウス年（無意識・終わり・手放し）
- 1ハウス年は 0,12,24,36,48,60歳... に巡る
- そのハウスの支配星が「**タイムロード（その年の主役の惑星）**」になる
- **Pythiel への価値**: 生年月日だけで「あなたは今、人生の○ハウス年——○○がテーマの年」が出る。Personal Year（数秘）と二重の「年の文脈」。決定論で実装可能

### B-2. Saturn Return（土星回帰）— 人生の構造点
- 約29.5年周期。**約29歳・58歳・87歳**で土星が出生位置に戻る
- 「20代に借り物の足場（親の前提・学校のデフォルト・初期キャリア）で建てたものが、圧力テストされる」
- 成熟・再構築・責任の節目。キャリア転換・関係の決断・自己権威の確立
- **Pythiel への価値**: 28-31歳のユーザーに「今あなたは土星回帰の只中——人生の土台を建て直す時期」と出せる。年齢だけで判定可能

### B-3. Jupiter Return（木星回帰）— 拡大の節目
- 12年周期。**12,24,36,48,60歳...** で木星回帰
- 学び・成長・拡大・与えることへエネルギーが向かう年
- **Pythiel への価値**: 12の倍数±1歳に「拡大の年」を出せる

### 統合：Pythiel が出せる「年齢の文脈」（全て生年月日だけ）
```
- Personal Year（数秘9年周期）：今年が種まきか収穫か
- Profection House（12年周期）：今年のテーマ領域と主役の惑星
- Saturn Return（29歳前後）：人生の構造的転換点
- Jupiter Return（12の倍数）：拡大の節目
```
→ 「今日の鑑定」に「今年という大きな文脈」を与える。日次の点が、人生の線の上に置かれる。

---

## C. タロット史の真実 — 権威の正しい使い方

**出典**: [WOPC](https://www.wopc.co.uk/the-history-of-playing-cards/history-of-tarot-and-playing-cards-complete-timeline) / Artsy / History Facts

### 事実（神話を排す）
- タロットは **1425-1442年、北イタリアの貴族（Visconti/Sforza/d'Este）** がカードゲーム「タロッキ」用に作った
- 現存最古は **Visconti-Sforza タロット（約1450年）**
- **最初の300年以上、タロットは賭けゲームのデッキだった**——占いではない
- 「**古代エジプト起源**」は**偽**（テンプル騎士団は1312年解散、タロット発明の129年前）
- 占いへの転換は18世紀後半：**Court de Gébelin** がエジプト神話を投影、**Jean-Baptiste Alliette（Etteilla）** が1789年に占い専用デッキ
- **Éliphas Lévi** が1856年『高等魔術の教理と祭儀』でタロット⇄カバラを接続（22トランプ⇄22ヘブライ文字）
- **Golden Dawn（1888年ロンドン設立）** が全体系を統合 → RWS も Thoth もこの上に立つ

### Pythiel への指針
- **エジプト起源神話を語らない**（権威を偽らない）。代わりに「ルネサンス期イタリアの芸術」「Golden Dawn の象徴体系」という**本物の歴史**を occult_basis に
- 「数百年の伝統」は正しい——ただし**ゲーム→占いの変遷**を知った上で、19世紀以降の象徴体系（Lévi/Golden Dawn/Waite）に根拠を置く
- これは Pythiel の**誠実さ**でもある（日本市場の「信じすぎない」層に、嘘くさくない権威を提供）

---

## D. 周辺占術（将来の拡張候補・今は語彙源）

### D-1. 手相（Palmistry）
- 主要4線: 生命線（活力）・感情線（愛/情緒）・頭脳線（思考/決断）・運命線（人生の道/天命）
- 手の形も4元素（地/風/水/火）で分類
- **Pythiel での扱い**: カメラ不使用が Pythiel の方針なので**実装しない**。ただし「線が示すもの」の語彙は使える

### D-2. ユング派 夢分析
- 中心元型: **Persona（仮面）・Shadow（影）・Anima/Animus（内なる異性）・Self（自己）**
- 手法: **amplification（神話・宗教・異文化と比較）** / **active imagination（夢の登場人物と対話）**
- 夢＝意識と無意識の対話、individuation（自己実現）の道
- **Pythiel への価値**: タロットの元型解釈を深める語彙源。「このカードはあなたの Shadow を映している」等

### D-3. チャクラ・色彩象徴
- 7チャクラ＝虹の7色: 赤(ルート/生存)・橙(仙骨/創造)・黄(太陽神経叢/意志)・緑(ハート/愛)・青(喉/表現)・藍(第三の目/直感)・紫(クラウン/霊性)
- **Pythiel への価値**: 「今日のラッキーカラー」的な軽い要素、または鑑定に色の象徴を添える（日本市場のエンタメ性とも相性良い）

---

## まとめ：第4波で Pythiel が獲得した実装可能機能

### ★今すぐ強力（決定論・伝統的根拠あり）
1. **デカン対応**: 36マイナーカードに厳密な「星座10度＋支配惑星」を付与 → occult_basis 激増
2. **デカン同期検出**: 今日の天体が引いたカードのデカンにいるか動的計算 → 本物のシンクロ
3. **Profection**: 年齢から「今年のハウス・タイムロード」
4. **Saturn/Jupiter Return**: 年齢から人生の構造的節目

### 中期（語彙・象徴の拡充）
5. ユング元型（Shadow/Anima/Self）を心理深層フィールドに
6. チャクラ・色彩を「今日の色」的エンタメ要素に
7. タロット史を occult_basis の正しい権威に（エジプト神話を排す）

---

## 出典

- [Kerykeion: Minor Arcana and the 36 Decans](https://kerykeion.net/content/learn-tarots/guides/minor-arcana-decans)
- [Astrologer's Coop: Introduction to the 36 Decans](https://astrologerscoop.substack.com/p/an-introduction-to-the-thirty-six)
- [T. Susan Chang: Reading the Decans](https://www.tsusanchang.com/blog/2019/3/23/reading-the-decans-seeds-of-dominion-aries-i)
- [Two Wander: Annual Profections](https://www.twowander.com/blog/annual-profections-how-to-calculate)
- [CHANI: The Astrological Timeline of Your Life](https://www.chani.com/blogs/the-astrological-timeline-of-your-life)
- [WOPC: History of Tarot Complete Timeline](https://www.wopc.co.uk/the-history-of-playing-cards/history-of-tarot-and-playing-cards-complete-timeline)
- [Jungian Center: Jung on Dreams](https://jungiancenter.org/jung-on-dreams-part-i/)
- [Mindvalley: 7 Chakra Colors](https://blog.mindvalley.com/chakra-colors/)
