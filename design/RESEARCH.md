# Pythiel デザインリサーチ — Gilded Omen 北極星固定

- **Date**: 2026-06-19
- **目的**: プレミアム占いアプリの北極星を固定し、Gilded Omen（navy/gold/cream/wine）の方向を validate
- **手法**: web research（Lazyweb MCP 未接続のためフォールバック）— Co-Star / CHANI / The Pattern / Nebula / Sanctuary のデザイン分析 + タロット配色の伝統 + paywall ベストプラクティス

## TL;DR

**Gilded Omen の配色はクラシックなタロット/占星術の正統そのもの**だった（偶然でなく的を射ている）。北極星 = **「Co-Star の editorial クリアさ × CHANI のカード型モジュール × 箔押し parchment の高級質感」**。最大の差別化 = **完全端末内ゆえ sign-up 不要** → CHANI/Nebula が抱える「鑑定前に登録を強制する friction」を構造的に回避できる。

## 配色の validate（リサーチが Gilded Omen を裏付けた）

タロット/占星術デザインの伝統的パレット（複数ソース一致）:
- dark "night" base（near-black / indigo / **navy**）= 蝋燭の闇
- light "paper"（ivory / parchment / warm off-white）= 古い紙
- metallic **gold** accent = **foil stamping（箔押し）**
- warm **wine** red = candlelit

→ Gilded Omen の `navy #1a2233 / gold #c6a44a / cream #f4e7c4 / wine #7f2a3b` は**この4要素に1:1で対応**。配色は変更不要、validate 済み。

## 推奨（実装方針・優先順）

1. **editorial 巨大タイポ見出し**（Co-Star 流）— 1画面1主役・スキャナブル。見出しは serif 系で占星術の伝統 + 高級感、body は clean sans
2. **縦スタックのカード型モジュール**（CHANI 流）— 今日の鑑定 → 4占術統合 → 履歴 → クイックルーン を card で縦に。temporal/機能で区切る
3. **parchment grain + subtle gold foil の質感** — フラット単色を避け、紙テクスチャと箔の微発光で「物理的なタロットデッキ」の高級感をデジタルに
4. **オンボは thematic visual で誕生日を聞く** — quiz の exclusivity（「あなただけの鑑定」感）。**sign-up 無しを前面に出す**（差別化の核）
5. **paywall = benefit-driven・2プラン**（年trial primary / 月 secondary）— onboarding 直後が転換ピーク（~50%）

## パターン（table stakes・これは満たして当然）

- dark bg 1色 + lighter surface card 1色 + high-contrast text 1色
- stars / moons / zodiac glyph のモチーフ（控えめに）
- 誕生日・時刻を quiz で聞いて「あなただけ」感
- freemium: annual（discount/trial）+ monthly の2プラン

## アンチパターン（避ける）

- ❌ **鑑定前に sign-up / account verification を強制**（CHANI の最大 friction）→ Pythiel は端末内で構造的に回避（ここが勝ち筋）
- ❌ generic CTA「Subscribe」→ benefit-driven「鑑定を見る」
- ❌ Co-Star 的モノクロだけ = 冷たい印象 → gold/cream の温かみで高級 × 親密の両立
- ❌ フラット単色塗り（AI smell）→ 質感（grain/foil）で奥行き

## ユニーク角度（X100 ディテール）

- **CHANI**: thematic onboarding illustration（誕生日ケーキ、時計の上の猫）— データ入力を「儀式」に変える
- **Co-Star**: editorial で sharp な巨大タイポ・余白の効いたスキャナブルさ
- **箔押し / foil stamping**: タロットデッキの物理的高級感をデジタルの gold アクセントで再現

## Gilded Omen 北極星（確定仕様）

| 軸 | 確定方向 |
|---|---|
| 配色 | navy bg / navyDeep surface / gold accent / cream text / wine border（validate 済み・変更不要） |
| タイポ | 見出し = editorial serif（伝統 + 高級）/ body = clean sans。1画面1主役の巨大ディスプレイ見出し |
| 質感 | parchment grain + subtle gold foil の微発光（フラット禁止） |
| レイアウト | 縦スタックカード・呼吸する余白 |
| モチーフ | 控えめな zodiac glyph / 星 / タロットカードフレーム |
| 差別化 | sign-up 不要（端末内）を前面に + 4占術スタックカード |

## 次ステップ

1. **ChatGPT(gpt-image-2) でキービジュアル/ムードボード生成** — 上記北極星を元にしたプロンプト（箔押し・parchment・navy・占星術モチーフ）
2. **新しい Claude design で HTML-first 制作** — 床+天井ゲート通過 → RN parity（Plan 4 本体）

## ソース

- [The 7 Best Astrology Apps 2025 (emma.ca)](https://emma.ca/zodiac-signs/best-astrology-app)
- [CHANI UI/UX Case Study (Medium)](https://medium.com/@info_45537/tl-dr-14868841ed2c)
- [CHANI Showcase (screensdesign)](https://screensdesign.com/showcase/chani-your-astrology-guide)
- [Tarot Card Color Palette (media.io)](https://www.media.io/color-palette/tarot-card-color-palette.html)
- [Engaging Paywall Screens (funnelfox)](https://blog.funnelfox.com/effective-paywall-screen-designs-mobile-apps/)
- [Guide to Mobile Paywalls (RevenueCat)](https://www.revenuecat.com/blog/growth/guide-to-mobile-paywalls-subscription-apps/)
- [Nebula spiritual guidance (Wikipedia)](https://en.wikipedia.org/wiki/Nebula_(spiritual_guidance))
