import type { ReadingInput } from "../divination/reading/contract";
import type { SectionDraft } from "./types";
import tarotCorpusRaw from "./corpus/tarot.json";
import numerologyCorpusRaw from "./corpus/numerology.json";
import astrologyCorpusRaw from "./corpus/astrology.json";
import transitCorpusRaw from "./corpus/transit.json";

type CorpusEntry = { situation: string; message: string; action: string };

const tarotCorpus = tarotCorpusRaw as Record<string, CorpusEntry>;
const numerologyCorpus = numerologyCorpusRaw as Record<string, CorpusEntry>;
const astrologyCorpus = astrologyCorpusRaw as Record<string, CorpusEntry>;
const transitCorpus = transitCorpusRaw as Record<string, CorpusEntry>;

const FALLBACK_ENTRY: CorpusEntry = {
  situation: "今日も自分らしく過ごせる一日です。",
  message: "内なる声に耳を傾けてみましょう。",
  action: "今日は深呼吸を3回してから、最初の一歩を踏み出してみましょう。",
};

function lookup(corpus: Record<string, CorpusEntry>, key: string, fallbackKey: string): CorpusEntry {
  return corpus[key] ?? corpus[fallbackKey] ?? FALLBACK_ENTRY;
}

export class TemplateLayer {
  compose(input: ReadingInput): SectionDraft {
    const tarotKey = `${input.tarot.card.id}:${input.tarot.reversed}`;
    // minor arcana: fall back to suit default (e.g. "wands:false")
    const suitFallback = `${input.tarot.card.arcana}:${input.tarot.reversed}`;
    const numerologyKey = String(input.numerology.lifePath);
    const sunKey = input.astrology.natal.sun;
    const transitPlanet = input.astrology.transits[0]?.planet ?? "Sun";

    const tarotEntry = lookup(tarotCorpus, tarotKey, suitFallback);
    const numerologyEntry = lookup(numerologyCorpus, numerologyKey, "1");
    const astrologyEntry = lookup(astrologyCorpus, sunKey, "Aries");
    const transitEntry = lookup(transitCorpus, transitPlanet, "Sun");

    return {
      situation: `${astrologyEntry.situation} ${transitEntry.situation}`.trim(),
      message: `${tarotEntry.message}\n${numerologyEntry.message}`.trim(),
      action: tarotEntry.action,
    };
  }
}
