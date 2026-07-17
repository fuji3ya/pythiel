export type Arcana = "major" | "wands" | "cups" | "swords" | "pentacles";
export interface TarotCard { id: string; name: string; arcana: Arcana; number: number; }
const MAJORS = ["The Fool","The Magician","The High Priestess","The Empress","The Emperor","The Hierophant","The Lovers","The Chariot","Strength","The Hermit","Wheel of Fortune","Justice","The Hanged Man","Death","Temperance","The Devil","The Tower","The Star","The Moon","The Sun","Judgement","The World"];
const SUITS: Exclude<Arcana,"major">[] = ["wands","cups","swords","pentacles"];
const RANKS = ["Ace","Two","Three","Four","Five","Six","Seven","Eight","Nine","Ten","Page","Knight","Queen","King"];
function buildDeck(): TarotCard[] {
  const deck: TarotCard[] = MAJORS.map((name,i)=>({id:`major-${i}`,name,arcana:"major" as const,number:i}));
  for (const suit of SUITS) RANKS.forEach((rank,i)=>deck.push({id:`${suit}-${i+1}`,name:`${rank} of ${suit[0].toUpperCase()}${suit.slice(1)}`,arcana:suit,number:i+1}));
  return deck;
}
export const TAROT_DECK: TarotCard[] = buildDeck();
