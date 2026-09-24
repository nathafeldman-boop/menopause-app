"use client";

import { useState } from "react";

import { PhotoPicker } from "@/components/photo/photo-picker";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { CONFIDENCE_DISPLAY } from "@/lib/food-confidence";
import type { MealAnalysisResult } from "@/lib/ai/types";

export function LabFlow() {
  const [file, setFile] = useState<Blob | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<{ analysis: MealAnalysisResult; correctionHintsUsed: string[] } | null>(
    null
  );

  async function analyze() {
    if (!file) return;
    setLoading(true);
    setError(null);
    setResult(null);
    try {
      const formData = new FormData();
      formData.append("photo", file, "test.jpg");
      const res = await fetch("/api/lab/analyze", { method: "POST", body: formData });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error ?? "Erreur inconnue.");
        return;
      }
      setResult(data);
    } catch {
      setError("Erreur réseau.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="flex flex-col gap-6">
      <PhotoPicker label="Photo de test" onReady={(blob) => setFile(blob)} />
      <Button onClick={analyze} disabled={!file || loading} size="lg">
        {loading ? "Analyse…" : "Analyser"}
      </Button>
      {error && <p className="text-sm text-destructive">{error}</p>}

      {result && (
        <div className="flex flex-col gap-4">
          <Card>
            <CardContent className="p-4">
              <h2 className="mb-2 font-heading text-base font-medium">mealDetected / imageIssue</h2>
              <p className="font-mono text-xs">
                mealDetected: {String(result.analysis.mealDetected)}
                <br />
                imageIssue: {result.analysis.imageIssue || "(aucun)"}
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <h2 className="mb-2 font-heading text-base font-medium">visualInventory (pass 1)</h2>
              <ul className="flex flex-col gap-1 font-mono text-xs">
                {result.analysis.visualInventory.map((v, i) => (
                  <li key={i}>• {v}</li>
                ))}
              </ul>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <h2 className="mb-3 font-heading text-base font-medium">foods (pass 2)</h2>
              <div className="flex flex-col gap-3">
                {result.analysis.foods.map((food, i) => {
                  const conf = CONFIDENCE_DISPLAY[food.confidence];
                  return (
                    <div key={i} className="rounded-lg border border-border p-3 text-xs">
                      <div className="mb-1 flex items-center justify-between">
                        <span className="font-medium">{food.name}</span>
                        <Badge>
                          {conf.icon} {conf.label}
                        </Badge>
                      </div>
                      <p className="font-mono text-muted-foreground">
                        category: {food.category}
                        <br />
                        preparation: {food.preparation || "(?)"}
                        <br />
                        quantityEstimate: {food.quantityEstimate || "(non estimable)"}
                        <br />
                        evidence: {food.evidence}
                        {food.possibleAlternatives.length > 0 && (
                          <>
                            <br />
                            alternatives: {food.possibleAlternatives.join(", ")}
                          </>
                        )}
                      </p>
                    </div>
                  );
                })}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <h2 className="mb-2 font-heading text-base font-medium">Analyse finale</h2>
              <p className="text-sm">
                <span className="font-medium">score:</span> {result.analysis.score} —{" "}
                <span className="font-medium">mealName:</span> {result.analysis.mealName}
              </p>
              <p className="mt-2 text-sm">{result.analysis.summary}</p>
              <p className="mt-2 text-sm">
                <span className="font-medium">positives:</span>{" "}
                {result.analysis.positives.map((p) => p.title).join(", ") || "(aucun)"}
              </p>
              <p className="mt-1 text-sm">
                <span className="font-medium">improvements:</span>{" "}
                {result.analysis.improvements.map((p) => p.title).join(", ") || "(aucun)"}
              </p>
              <p className="mt-2 text-sm">
                <span className="font-medium">personalizedTip:</span> {result.analysis.personalizedTip}
              </p>
              <p className="mt-1 text-sm">
                <span className="font-medium">improvedVersion:</span> {result.analysis.improvedVersion}
              </p>
              <p className="mt-1 text-sm">
                <span className="font-medium">nextActionLabel:</span> {result.analysis.nextActionLabel}
              </p>
            </CardContent>
          </Card>

          {result.correctionHintsUsed.length > 0 && (
            <Card>
              <CardContent className="p-4">
                <h2 className="mb-2 font-heading text-base font-medium">Corrections passées injectées</h2>
                <p className="font-mono text-xs text-muted-foreground">
                  {result.correctionHintsUsed.join(" | ")}
                </p>
              </CardContent>
            </Card>
          )}
        </div>
      )}
    </div>
  );
}
