// Pro ゲートの単一集約（純関数・決定的）。全 paid 入口はここを通す。
// Free/Pro 境界（nani 型 freemium ソフトゲート）:
// - Free: 今日の鑑定1件（タロット1枚+一言）/ 基本の振り返り
// - Pro : 4占術統合鑑定 / 鑑定履歴・カレンダー / 深い鑑定文 / クイック質問(ルーン)

/** 今日の無料鑑定を既に見たか（Free=1日1件）。lastReadingDate と today を比較。 */
export function canViewDailyReading(args: {
  isPro: boolean;
  lastReadingDate?: string;
  today: string;
}): boolean {
  if (args.isPro) return true;
  return args.lastReadingDate !== args.today; // 今日まだ見てなければ Free で1件OK
}

/** 4占術の統合鑑定（全占術）を見られるか（Pro 機能）。 */
export function canViewFullReading(isPro: boolean): boolean {
  return isPro;
}

/** 鑑定履歴・カレンダーを見られるか（Pro 機能）。 */
export function canViewHistory(isPro: boolean): boolean {
  return isPro;
}

/** クイック質問（ルーン）を使えるか（Pro 機能）。 */
export function canUseQuickRune(isPro: boolean): boolean {
  return isPro;
}
