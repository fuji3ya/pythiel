# Pythiel — ChatGPT (gpt-image-2) イメージ生成プロンプト

リサーチ（`RESEARCH.md`）で固めた Gilded Omen 北極星を元にした生成プロンプト。
各プロンプトに **天井アンカー（top 1% / Apple Design Award）** + **焦点階層**（第一焦点 / 視線の休み場 / 色の集中）を組み込み済み。
ChatGPT に貼って 1:1（アイコンは正方）で生成 → 良いものを Claude design の UI 制作に使う。

---

## A. ムードボード / 世界観キービジュアル（トーン確定用・最初に生成）

```
A premium mystical divination app key visual in a "Gilded Omen" aesthetic.
Deep midnight-navy background (#1a2233) like candlelit darkness. At the optical
center, a single ornate tarot-card frame rendered in gold foil (#c6a44a) with a
real embossed / letterpress texture catching warm light. Aged parchment-cream
(#f4e7c4) accents like antique paper. One small deep wine-red (#7f2a3b) detail.
Faint constellation glyphs and a few stars scattered with restraint — not
cluttered. Editorial, luxurious, intimate, like a rare antique tarot deck
photographed by candlelight. Generous dark negative space that breathes.
Focal hierarchy: the gold card frame is the single hero; everything else recedes
softly into navy. No text, no UI, no logos. Top 1% Apple Design Award visual craft.
```

## B. アプリアイコン（iOS icon・正方）

```
iOS app icon for "Pythiel", a premium divination app. A single minimal emblem in
gold foil (#c6a44a) on a deep midnight-navy (#1a2233) field — an abstract oracle
mark blending a crescent moon, an eye, and a constellation point. Real embossed /
foil-stamped texture with a subtle warm glow, not flat. A faint parchment-cream
inner light. Refined, mysterious, instantly readable at very small sizes. One
centered symbol with generous padding. No text. Apple Design Award icon craft.
```

## C. 画面背景テクスチャ（オンボ/ホームの下地・UI が上に乗る前提で控えめ）

```
A subtle background texture for a mystical app screen. Deep midnight-navy
(#1a2233) base with a faint parchment grain. A few scattered gold (#c6a44a)
constellation dots and very thin zodiac line-work, kept faint so overlaid text
stays readable. One soft warm glow near the center like distant candlelight.
Wine-red (#7f2a3b) used only in tiny accents. Calm, premium, editorial, with lots
of dark negative space reserved for UI on top. Not busy. Top 1% craft. No text.
```

---

## 使い方メモ
- まず **A** を生成してトーン（箔押し・parchment・navy の質感）を確定 → ふじ OK 後に B/C
- 生成画像は `apps/pythiel/design/references/` に保存 → Claude design の HTML-first 制作で参照
- 配色 hex はプロンプトに固定済み（ブレ防止）。質感ワード = foil / embossed / letterpress / parchment / candlelight が効く
- アンチパターン（RESEARCH.md）: フラット単色・絵文字・generic グラデは生成段階から禁止
