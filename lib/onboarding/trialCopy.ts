// Apple 3.1.2(c) 準拠（3日トライアル付き年額）の文言集中管理。コピー規律: 恐怖・断定禁止

export function trialCtaLines(): [string, string] {
  return ['3日間無料で試す', '以降 年額 ¥4,800 · 自動更新'];
}

export function trialSubtext(): string {
  return '3日間の無料トライアル終了後、年額 ¥4,800 が自動課金されます。解約するまで毎年更新されます。いつでも Apple ID 設定から解約できます。';
}

export function pricingHeadline(plan: 'annual' | 'monthly'): string {
  if (plan === 'annual') return '¥4,800 / 年';
  return '¥680 / 月';
}
