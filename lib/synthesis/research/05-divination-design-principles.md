# 占いの設計原理 — なぜ当たるのか / どう精度を出すのか

これは Pythiel エンジンの **魂** の文書。占術データ（01-04）が「素材」なら、これは「料理法」。
プロの占い師が何百年かけて確立した「精度の出し方」を、決定論アルゴリズムに翻訳する。

---

## 原理 1: Elemental Dignities（元素の品位）— weaver の伝統的裏付け

**出典**: Golden Dawn（黄金の夜明け団）の体系。Anthony Louis / Corax / Labyrinthos。

我々が weaver で実装した「カード×星座の element 相互作用」には、**実は数百年の伝統的体系があった**。

### 規則（Golden Dawn 正統）
| 組み合わせ | 関係 | 効果 |
|---|---|---|
| **同一エレメント**（火×火 等） | 強い共鳴 | 互いを大きく強化（良くも悪くも） |
| **火 ⇄ 水** | 敵対（contrary/enemies） | 互いを大きく弱める・ill-dignify |
| **風 ⇄ 土** | 敵対（contrary/enemies） | 互いを大きく弱める・ill-dignify |
| **火 ⇄ 風** | 友好（friendly active） | 創造性を燃やす・新しいアイデア |
| **水 ⇄ 土** | 友好（friendly passive） | 感情の深さ＋現実の安定 |
| **水 ⇄ 風** | 友好だが要注意 | 「思考過多 × 強い感情」は危険な混合になりうる |

### Active / Passive（陰陽）
- **火・風 = active / masculine / yang / positive**（外向のエネルギー）
- **水・土 = passive / feminine / yin / negative**（内向のエネルギー）

### Pythiel への反映
我々の `weaver.ts` の `tarotZodiacInteraction()` は既にこの方向で実装済みだが、**Golden Dawn 正統に整合させて精度を上げる**：
- 火⇄水・風⇄土 を「敵対＝緊張・湯気・動揺」として書く（既に方向は正しい）
- 火⇄風・水⇄土 を「友好＝強化・育み」（既に正しい）
- **水⇄風 は「友好だが諸刃」**として書き分ける（現状は一律 friendly。要改善）
- **active/passive の軸**を新しく追加できる：火・風のカードが水・土の星座に出ると「外の力が内に向かう」等

---

## 原理 2: Synthesis over Isolation（統合 ＞ 孤立読み）— Celtic Cross の核心

**出典**: Brigit Esselmont (Biddy Tarot) — 「カードを個別に読むのをやめろ。**ポジション間の dynamics を読め。そこで魔法が起きる**」。

### プロが実際にやっていること
ケルト十字（10枚）でプロは、各カードを順番に説明しない。**ポジション同士を比較して矛盾と物語を見つける**：

| 比較 | 何を読むか |
|---|---|
| **意識の目標（5）vs 潜在の動機（6）** | 「望んでいること」と「本当に動かしているもの」のズレ |
| **目標（5）vs 結末（10）** | 望みと現実の軌道は一致するか。本人が助けてるか妨げてるか |
| **近未来（4）vs 結末（10）** | 直近の出来事が最終結果をどう形作るか |
| **潜在動機（6）vs 希望と恐れ（9）** | 無意識のパターンが希望/恐れを説明するか |
| **助言（7）vs 結末（10）** | 結末が不満なら、助言のどの行動が変えるか |

### プロの鉄則（精度を保つ技）
1. **10枚全部を均等に語らない** — 最初は 3-4枚の key card に集中し、徐々に広げる。「analysis paralysis」を防ぐ
2. **対立ポジションを比較して内的葛藤を特定** → 助言ポジションを解決の道筋として参照
3. **直近の出来事（管理が必要なもの）を常に意識**

### Pythiel への反映（決定的）
我々の weaver の物語アーク（背景→核心→本音→予言→助言）は、**まさにこの「ポジション間 dynamics」を固定構造化したもの**。
- profile（あなたという人）＝ 潜在動機（6）
- situation（今日の風景）＝ 現在（1）＋近過去（3）
- unread_truth（本音）＝ 潜在動機（6）vs 希望恐れ（9）のズレ
- prediction（未来）＝ 近未来（4）→ 結末（10）
- action（一歩）＝ 助言（7）

**改善余地**: weaver に「**矛盾の検出**」を入れる。例：タロットが前進を示すのに星座が停滞を示す時、「あなたの中で2つの力が引っ張り合っている」と明示する。これがプロの「内的葛藤の特定」。これは決定論で実装可能。

---

## 原理 3: なぜ当たるのか — Jung のシンクロニシティ

**出典**: Carl Jung — synchronicity, archetypes, collective unconscious。

### メカニズム
1. **シンクロニシティ**: カードを引く「外的行為」と、引いた人の「内的状態」が、因果でなく**意味**で繋がる
2. **アーキタイプ**: タロットの図像（特に大アルカナ）は人類普遍の元型（Fool の無垢〜Emperor の権威）。誰の心にも「既にある」パターンを刺激する
3. **投影と参加**: タロットは「鏡」。引いた人自身の心が、象徴を自分の状況に重ねて意味を作る。**読み手だけでなく、聞き手の心が読みを完成させる**

### 「ランディング（刺さる）」の条件
- **受容性**: 開かれた心はシンクロニシティを活性化、懐疑は遮断する
- **想像力**: 元型イメージが個人の洞察のアンカーになる
- Jung 自身は占いを「未来予知」でなく「**今の心理状態を象徴的に映す鏡**」として使った

### Pythiel への反映
- **断定でなく「鏡」として書く** — 「あなたはこうなる」より「あなたの中にこれがある」。読者の心が参加する余地を残す（Pythia の声はこのトーン）
- **元型に触れる** — 各カードの普遍的元型（無垢/権威/崩壊/再生）を必ず文に含める → 誰の心にも「既にある」感
- **受容性を作る UX** — 占いの前の「一呼吸」（リサーチ02 で確認した間）は、Jung の「受容性」を作る装置だった。儀式性に意味があった

---

## 原理 4: Barnum 効果の回避 — 精度の定義

**出典**: Forer / Barnum Effect 研究。

### 危険：占いが「当たる気がする」偽の精度
- **Barnum statement** = 誰にでも当てはまる一般的記述（「あなたは時々自分を疑う」）
- 人は「自分を理解したい」欲求から、曖昧な記述を「私のことだ」と受け取る
- **Cold reading** = 一般的記述から始め、反応を見て調整していく技法

### 精度の定義（決定的基準）
> **「この記述は、他の誰に、どのくらいの確率で当てはまるか？」**
> 当てはまる人が多いほど Barnum（偽の精度）。少ないほど本物の洞察。

### Pythiel への反映（コーパス品質ゲートの核）
これが我々の WRITING-GUIDE の「バーナム禁止」の科学的裏付け。
- ❌ 「あなたは変化を恐れている」（80% の人に当てはまる）
- ✅ 「あなたが本当に守っているのは『ちゃんとやってきた自分』という物語。それを変えると過去の頑張りが報われない気がする」（特定の心理構造に踏み込む = 当てはまる人が絞られる）

**ただし逆説**: Pythiel は **入力（生年月日・名前・今日の月）で固有性を作っている**ので、Barnum を構造的に回避している。
- 同じ文でも「魚座の water × 土のカード × ライフパス3」という**固有の組み合わせ**から生成される
- だから「他の人には別の組み合わせ＝別の文」が出る → Barnum でない
- **これが Pythiel の最大の強み**：手書き horoscope（全魚座に同じ）と違い、生年月日＋名前＋日付で**一意の鑑定**になる

---

## 原理 5: 時間と予言（predictive astrology）

**出典**: Robert Hand "Planets in Transit"（予言占星術の標準書）/ Void-of-Course Moon。

### トランジット（運行）の予言原理
- ネイタル（出生図）= 変わらない性質
- トランジット（今の天体の位置）= 今この瞬間に何が活性化しているか
- **予言 = ネイタル × トランジットの相互作用**を読む
- Robert Hand は「各惑星が各ハウスを通過する時の意味」を体系化 = 我々の月トランジットの拡張先

### Void-of-Course Moon（ボイドの月）
- 月が「あるサインで最後のアスペクトを作ってから、次のサインに入るまで」の期間
- 伝統的に「この時間に始めたことは実を結ばない」→ 新しいことを始めない時間
- **2-2.5日ごとに月がサインを移る** → 我々の「今日の月」が毎日変わる根拠
- Pythiel の拡張余地：VOC の時間帯に「今日は種まきでなく、観察の日」と出せる（実装可能）

### Pythiel への反映
- 月トランジット（実装済み）= 最も速く動く「今日の天気」。正しい選択だった
- 拡張：金星（関係・愛）、水星（思考・コミュニケーション）、火星（行動・衝突）のトランジット
- さらに：月相（新月/満月/上弦/下弦）を「タイミング」に使う（既にコーパスに片鱗あり）

---

## まとめ：Pythiel の「精度」の正体

```
1. 固有性（Barnum 回避）
   = 生年月日 × 名前 × 今日の月 で一意の組み合わせ → 他人には別の鑑定
2. 統合（Synthesis）
   = カードを孤立で語らず、element dignity で関係を読む（Golden Dawn 正統）
3. 矛盾の検出
   = 占術同士が引っ張り合う時「内的葛藤」として明示（Celtic Cross プロ技）
4. 鏡のトーン（Jung）
   = 断定でなく「あなたの中にこれがある」。読者の心が参加して完成
5. 時間の予言（Robert Hand）
   = ネイタル（不変）× トランジット（今）で「これから起きること」
6. 元型（Jung）
   = 普遍的人類パターンに触れて「既にある」感を作る
```

**この6つを weaver に実装しきれば、「ChatGPTで作った薄い占い」とは別次元の、伝統占術の正統を継ぐ端末内エンジンになる。**

---

## 次の weaver 改善 TODO（この文書から導かれる具体策）

1. **element dignity を Golden Dawn 正統に整合**（水⇄風の諸刃、active/passive 軸）
2. **矛盾検出ロジック**：占術が反対方向を示す時「内的葛藤」セクションを動的生成
3. **元型タグ**：各カードに「元型キーワード」を持たせ、普遍性を必ず1文含める
4. **トランジット拡張**：金星/水星/火星（関係・思考・行動の今日）
5. **月相**：新月/満月でタイミングの精度を上げる
6. **VOC**：観察日 vs 行動日の出し分け（上級）

---

## 出典

- [Anthony Louis: Elemental Dignities in Tarot](https://tonylouis.wordpress.com/2022/01/08/elemental-dignities-in-tarot-readings/)
- [Corax: Elemental Dignities (Golden Dawn)](https://www.corax.com/tarot/elemental-dignities.html)
- [Biddy Tarot: How to Read the Celtic Cross](https://biddytarot.com/blog/how-to-read-the-celtic-cross-tarot-spread/)
- [Ess Sea Tea Tarot: Synchronicity, Tarot, Jung](https://www.essseateatarot.com/synchronicity-the-tarot-and-jungs-collective-unconscious/)
- [Spirit of Change: Jung, Synchronicity, Tarot](https://www.spiritofchange.org/carl-jung-synchronicity-and-the-meaning-of-tarot-cards/)
- [Choice Hacking: The Barnum Effect](https://www.choicehacking.com/2024/03/19/what-is-the-barnum-effect/)
- [Robert Hand: Planets in Transit (Goodreads)](https://www.goodreads.com/book/show/766070.Planets_in_Transit)
- [Cafe Astrology: Void of Course Moon](https://cafeastrology.com/void-of-course-moon-times.html)
