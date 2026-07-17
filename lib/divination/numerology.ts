const MASTER = new Set([11, 22, 33]);
export function reduceToCore(n: number): number {
  while (n > 9 && !MASTER.has(n)) n = String(n).split("").reduce((s, d) => s + Number(d), 0);
  return n;
}
export function lifePathNumber(birthDate: string): number {
  const sum = birthDate.replace(/\D/g, "").split("").reduce((s, d) => s + Number(d), 0);
  return reduceToCore(sum);
}
function letterValue(ch: string): number {
  const code = ch.toUpperCase().charCodeAt(0);
  return code < 65 || code > 90 ? 0 : ((code - 65) % 9) + 1;
}
export function expressionNumber(romanizedName: string): number {
  return reduceToCore(romanizedName.split("").reduce((s, ch) => s + letterValue(ch), 0));
}
