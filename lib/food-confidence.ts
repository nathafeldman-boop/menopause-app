import type { FoodConfidence } from "./ai/types";

export const CONFIDENCE_DISPLAY: Record<FoodConfidence, { icon: string; label: string }> = {
  high: { icon: "✓", label: "Très probable" },
  medium: { icon: "~", label: "Probable" },
  low: { icon: "?", label: "Incertain" },
  unknown: { icon: "?", label: "Non identifié" },
};
