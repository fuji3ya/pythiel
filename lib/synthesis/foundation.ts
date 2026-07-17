import type { SectionDraft } from "./types";
import type { ReadingInput } from "../divination/reading/contract";

export type DeviceTier = "foundation" | "template-only";

export function getDeviceTier(): DeviceTier {
  return "template-only";
}

export class FoundationLayer {
  private tier: DeviceTier;

  constructor(tier: DeviceTier = getDeviceTier()) {
    this.tier = tier;
  }

  async enhance(draft: SectionDraft, _input: ReadingInput): Promise<SectionDraft> {
    if (this.tier === "template-only") {
      return draft;
    }
    try {
      return await this.callFoundationModel(draft, _input);
    } catch {
      return draft;
    }
  }

  private async callFoundationModel(_draft: SectionDraft, _input: ReadingInput): Promise<SectionDraft> {
    throw new Error("Foundation Models: not implemented in Plan 2");
  }
}
