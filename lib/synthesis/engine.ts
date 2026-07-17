import type { ReadingInput } from "../divination/reading/contract";
import type { Reading } from "./types";
import { TemplateLayer } from "./template";
import { FoundationLayer } from "./foundation";
import { weave } from "./weaver";

export class SynthesisEngine {
  private templateLayer = new TemplateLayer();
  private foundationLayer = new FoundationLayer();

  async compose(input: ReadingInput): Promise<Reading> {
    // V2: 4占術の深コーパスが揃っていれば weaver で物語アークを織る。
    // 揃わなければ旧 TemplateLayer にフォールバック（既存テスト維持）。
    const woven = weave(input);
    const baseDraft = woven ? woven.sections : this.templateLayer.compose(input);

    // Foundation Layer（iOS 26+ で動的肉付け、それ以外はそのまま返す）
    const finalDraft = await this.foundationLayer.enhance(baseDraft, input);
    const tier: Reading["tier"] = finalDraft !== baseDraft ? "foundation" : "template";

    return { date: input.date, sections: finalDraft, tier };
  }
}
