import type { AnalysisDetails, PredictionLabel } from "../types/index.js";

/** ResNet-based DR severity model: returns severity grade (No DR → Proliferative DR) and findings. */
const PREDICTIONS: PredictionLabel[] = [
  "No DR",
  "Mild NPDR",
  "Moderate NPDR",
  "Severe NPDR",
  "Proliferative DR",
];

export function runAnalysis(): {
  severityScore: number;
  prediction: PredictionLabel;
  confidence: number;
  details: AnalysisDetails;
} {
  const severityScore = Math.floor(Math.random() * 5);
  const prediction = PREDICTIONS[severityScore];
  const confidence = 85 + Math.floor(Math.random() * 14);

  return {
    severityScore,
    prediction,
    confidence,
    details: {
      microaneurysms: severityScore > 0,
      hemorrhages: severityScore > 1,
      exudates: severityScore > 1,
      cottonWoolSpots: severityScore > 2,
      neovascularization: severityScore > 3,
    },
  };
}

export function delay(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}
