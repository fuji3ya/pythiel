export type SynthesisTier = "template" | "foundation";

export interface SectionDraft {
  situation: string;
  message: string;
  action: string;
}

export interface Reading {
  date: string;
  sections: SectionDraft;
  tier: SynthesisTier;
}
