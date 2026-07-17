# 占術の横断体系 — 西洋タロットの外側へ

リサーチ 01-05 は「西洋タロット＋西洋占星術＋数秘」の正統を固めた。
この文書は **その外側の占術体系** を調査し、Pythiel が取り込める「予言の時間構造」「相互作用ロジック」を抽出する。

---

## A. 西洋占星術の深層 — ハウス・アスペクト（既存の星座より深い）

リサーチ02 は「太陽星座」までだった。プロの占星術は **ハウス（人生領域）× アスペクト（惑星間の角度）** で読む。

### 12 ハウス（人生領域）
| ハウス | 領域 |
|---|---|
| 1 | アイデンティティ・身体・自己表現（Rising sign） |
| 2 | 物質・お金・自己価値・安心 |
| 3 | コミュニケーション・学び・近距離 |
| 4 | 家・ルーツ・基盤（チャートの底） |
| 5 | 創造・恋愛・遊び・自己表現 |
| 6 | 仕事・健康・日々の習慣・奉仕 |
| 7 | パートナーシップ・結婚・契約・対人 |
| 8 | 変容・性・他者の資源・死と再生 |
| 9 | 哲学・遠方・高等教育・意味 |
| 10 | キャリア・社会的地位・天命（Midheaven） |
| 11 | 友人・コミュニティ・未来のビジョン |
| 12 | 無意識・隠れたもの・霊性・終わり |

→ 1-6 = 個人的ハウス（自分について）、7-12 = 対人的ハウス（世界との関係）

### 5 大アスペクト（惑星間の角度＝関係性）
| アスペクト | 角度 | 意味 | Pythiel の element dignity との対応 |
|---|---|---|---|
| **Conjunction（合）** | 0° | エネルギー融合・増幅。良くも悪くも | 「同一エレメント＝共鳴」と同型 |
| **Sextile（六分）** | 60° | 機会・才能・楽な流れ | 「友好」と同型 |
| **Square（矩）** | 90° | 摩擦・葛藤・成長の圧力。無視できない | **「敵対＝緊張」と同型。だが Square は最も成長を生む** |
| **Trine（三分）** | 120° | 調和・自然な能力・楽 | 「友好（強い）」と同型 |
| **Opposition（衝）** | 180° | 緊張・両極・複数視点 | 「火⇄水・風⇄土の敵対」と同型 |

**決定的発見**: 我々の **element dignity（火⇄水＝敵対 等）は、アスペクトの Square/Opposition と同じ論理**。
そして占星術は「**Square は最も成長を生む**」と教える——敵対＝悪ではなく、摩擦＝動機。
→ weaver の「敵対」を「破壊」でなく「**最も成長を促す緊張**」として書くべき（既にその方向だが強化できる）。

**Sun-Moon Opposition の例**: 満月生まれ＝「意識の自分（太陽）と感情の必要（月）の間の根源的緊張」。
→ Pythiel は出生太陽と今日の月のサインで、この緊張を動的に検出できる（実装可能）。

---

## B. 予言の時間構造 — 4つの異なる「時間の刻み方」

占いの「いつ」を出す技術。Pythiel は今「月トランジット（2.5日周期）」だけ。もっと層を持てる。

### B-1. Personal Year（数秘の9年周期）★最も実装しやすい
- **計算**: 誕生月 + 誕生日 + 今年 を還元（例: 3/15生・2026年 → 3+6+10 = 19 → 1 = Personal Year 1）
- **9年サイクル**: Year 1（種まき・新始動）→ ... → Year 9（収穫・解放・手放し）
  - Year 1: 種・新方向 / Year 2-3: 育成・表現 / Year 4: 構築 / Year 5: 変化・動揺 / Year 6-7: 深化・理解 / Year 8: 結果 / Year 9: 終わりと解放
- **Pythiel への価値**: 生年月日だけで「**あなたは今、人生の9年サイクルのどこにいるか**」が出る。「今年がなぜ重いのか/軽いのか」のフレーム。決定論で完全実装可能。これは強力——日次でなく「年の文脈」を与える。

### B-2. 月相（Moon Phase）
- 新月（種まき）/ 上弦（行動）/ 満月（結実・解放）/ 下弦（手放し）
- 約29.5日周期。astronomy-engine で計算可能（既に月の位置は取れている → 太陽との角度で月相が出る）
- **Pythiel への価値**: 「今日は新月だから始める日」「満月だから手放す日」のタイミング精度。

### B-3. 惑星逆行（Retrograde）
- **水星逆行**（年3-4回・各3週間）: コミュニケーション・契約・移動の見直し期。「終わったはずのことが戻る」
- **金星逆行**（18ヶ月ごと・40日）: 関係・お金・価値の見直し
- **火星逆行**（2年ごと・60-80日）: 行動・エネルギー・対立の見直し
- 共通原理: 逆行＝「新規行動でなく**レビュー**の時期。古いパターンが浮上する」
- **Pythiel への価値**: astronomy-engine で逆行は計算可能。「今、水星が逆行中だから、今日のこの停滞は意味がある」と動的に。

### B-4. ヴェーダのダーシャ（Vimshottari Dasha）★最も精密だが最も複雑
- 出生時の月のナクシャトラ（27分割の月宿）から、人生を惑星期間に分割
- Mahadasha（6-20年）→ Antardasha（数ヶ月-数年）→ Pratyantardasha（微調整）
- 西洋占星術に直接対応物がない、**最も精密な予言時間体系**
- **Pythiel への価値**: 上級機能。まず Personal Year（B-1）で「年の文脈」を出してから、将来ダーシャを検討。

---

## C. 相互作用ロジックの他系統 — 我々の weaver を強化する

### C-1. BaZi（四柱推命）の Day Master 原理 ★weaver 哲学の確証
- 中国占術（漢代起源）。生年月日時から「八字（8文字）」。
- **Day Master（日主）= あなたの核**。チャートの全要素は Day Master との関係で解釈される
- 「各文字を孤立で読まず、**8つがどう支え合う/衝突する/変容するか**で全体像を読む」
- **決定的**: これは我々の weaver の「ReadingInput の全要素を相互作用で読む」哲学の、**別文化からの完全な裏付け**。BaZi も Celtic Cross も「孤立読み禁止・相互作用で読む」で一致。
- 五行（木火土金水）の相生相剋＝我々の element dignity の5元素版。

### C-2. 易経（I Ching）の boolean 構造 ★決定論エンジンと完全に同型
- 64卦 = 6本の陰陽線（broken/solid）の全組み合わせ = **2^6 = 64**
- **各卦は6変数のブール関数**。変爻（changing lines）はブール演算で別の卦へ変換
- King Wen 配列 = 相補ペア（28ペアは180度回転で対）
- **決定的**: 易経は「**数学的・決定論的な占術**」。ランダム（コイン投げ）→ 決定論的な卦 → 解釈。
  これは Pythiel の「seed → 決定論的ドロー → 解釈」と**構造的に同一**。
- **Pythiel への価値**: 易経は「変化そのもの」を扱う唯一の占術。「今が変化のどの局面か」を6線で表せる。将来の占術追加候補として最有力（boolean なので実装が綺麗）。

---

## D. カバラ対応 — タロットの深層構造（権威の最終層）

### Tree of Life × Major Arcana（Golden Dawn 正統）
- 1854年 Eliphas Levi が「22のヘブライ文字 = 22の大アルカナ」を提唱
- Golden Dawn が体系化: 各大アルカナ = 生命の木の22の小径 + ヘブライ文字 + 占星対応 + 色階
- RWS も Thoth も全てこの体系の上に立つ

### 大アルカナ × ヘブライ文字（象徴の最深層）
| カード | ヘブライ文字 | 象徴的意味 |
|---|---|---|
| Fool | Aleph (א) | 原初のエネルギー |
| Magician | Beth (ב) | 神殿・注意 |
| High Priestess | Gimel (ג) | 引き上げ・無意識 |
| Empress | Daleth (ד) | 道・養い |
| Emperor | He (ה) | ヴィジョン・理性 |
| Hierophant | Vau (ו) | 繋がり・安定 |
| Lovers | Zayin (ז) | 識別・切断 |
| Chariot | Chet (ח) | 分離・囲い |
| Strength | Tet (ט) | 包囲 |
| Hermit | Yod (י) | 行い・仕事 |
| Wheel | Kaph (כ) | 覆い・掴む |
| Justice | Lamed (ל) | 突く・舌 |
| Hanged Man | Mem (מ) | 水・反転 |
| Death | Nun (נ) | 発芽・活動・生命 |
| Temperance | Samech (ס) | 支え・教義 |
| Devil | Ayin (ע) | 経験・知識 |
| Tower | Phe (פ) | 言葉・口 |
| Star | Tzaddi (צ) | 誠実・収穫 |
| Moon | Quoph (ק) | 隠された・背後 |
| Sun | Resh (ר) | 贖い・最高 |
| Judgement | Shin (ש) | 焼き尽くす・破壊 |
| World | Tav (ת) | 契約・封・真実 |

**Pythiel への価値**: occult_basis フィールドに「ヘブライ文字＝○○」を加えると、権威の最深層が宿る。
（既存コーパスの Hanged Man で「ヘブライ文字メム＝水」を使ったのは正しかった——全カードに拡張可能）

---

## まとめ：Pythiel の機能ロードマップ（リサーチから導かれる）

### 今すぐ効く（決定論・実装容易・価値大）
1. **Personal Year（数秘9年周期）** ← 生年月日だけで「年の文脈」。今日の鑑定に「あなたは今 Year N」を追加
2. **月相**（新月/満月/上弦/下弦）← astronomy-engine で計算可。タイミング精度
3. **element dignity を「Square＝成長の緊張」に整合** ← 既存 weaver の強化
4. **ヘブライ文字を occult_basis に** ← 全タロットエントリの権威強化

### 中期（実装中程度）
5. **惑星逆行**（水星/金星/火星）← astronomy-engine で計算可。「今の停滞には意味がある」
6. **Sun-Moon の緊張検出**（満月生まれ等）← 出生太陽 × 今日の月
7. **矛盾検出**（占術が反対を向く時「内的葛藤」）← Celtic Cross プロ技

### 長期（占術の追加・上級）
8. **易経**（boolean 構造・変化局面）← 決定論と相性最高
9. **ヴェーダのダーシャ**（人生の惑星期間）← 最精密だが複雑
10. **BaZi 五行**（相生相剋の5元素版）

---

## 哲学的確証：3つの異なる文化が同じ原理に到達していた

| 原理 | 西洋（Celtic Cross） | 中国（BaZi） | 易経 |
|---|---|---|---|
| **孤立読み禁止・相互作用で読む** | ✅ ポジション間 dynamics | ✅ Day Master との関係 | ✅ 変爻の boolean 変換 |
| **核（self）を中心に全部を解釈** | querent | Day Master（日主） | 本卦 |
| **決定論的プロセス** | — | 生年月日時 | コイン→卦（数学的） |

**Pythiel の weaver 設計（入力の全要素を、核を中心に、相互作用で、決定論的に読む）は、3つの独立した占術文化が数千年かけて到達した普遍原理と一致している。** これは偶然ではなく、占いの本質。

---

## 出典

- [Labyrinthos: 12 Houses of Astrology](https://labyrinthos.co/blogs/astrology-horoscope-zodiac-signs/the-12-houses-of-astrology-the-astrological-houses-and-your-natal-chart)
- [Advanced Astrology: Aspects (Conjunction/Trine/Square/Opposition)](https://advanced-astrology.com/aspects-conjunction-trine-sextile-square-opposition)
- [Numerologist: Personal Year Calculator](https://numerologist.com/calculators/personal-year-calculator)
- [Cafe Astrology: Retrogrades](https://cafeastrology.com/retrogrades.html)
- [Way Fengshui: BaZi Four Pillars](https://www.wayfengshui.com/bazi-chart-must-know-four-pillars-yin-yang-the-five-elements/)
- [Wikipedia: King Wen sequence (I Ching)](https://en.wikipedia.org/wiki/King_Wen_sequence)
- [Labyrinthos: Tarot and Tree of Life Correspondences](https://labyrinthos.co/blogs/learn-tarot-with-labyrinthos-academy/the-tarot-and-the-tree-of-life-correspondences)
- [Dashaclub: Vedic vs Western Astrology](https://dashaclub.com/vedic-vs-western-astrology)
