"use client";

import { useState, useTransition } from "react";
import { ArrowLeft, Check } from "lucide-react";

import { completeOnboardingAction, type OnboardingData } from "@/lib/actions/onboarding";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Progress } from "@/components/ui/progress";
import { cn } from "@/lib/utils";

type ChoiceStep = {
  key: keyof OnboardingData;
  kind: "choice";
  question: string;
  helper?: string;
  options: { value: string; label: string }[];
  required: true;
};

type TextStep = {
  key: keyof OnboardingData;
  kind: "text";
  question: string;
  helper?: string;
  placeholder: string;
  required: false;
};

type Step = ChoiceStep | TextStep;

const STEPS: Step[] = [
  {
    key: "goal",
    kind: "choice",
    question: "Quel est votre objectif principal ?",
    required: true,
    options: [
      { value: "eat_better", label: "Mieux manger" },
      { value: "lose_weight", label: "Perdre du poids progressivement" },
      { value: "reduce_snacking", label: "Réduire le grignotage" },
      { value: "structure_meals", label: "Mieux structurer mes repas" },
      { value: "stay_fit", label: "Maintenir ma forme" },
    ],
  },
  {
    key: "diet_type",
    kind: "choice",
    question: "Quel type d'alimentation suivez-vous ?",
    required: true,
    options: [
      { value: "omnivore", label: "Omnivore" },
      { value: "vegetarian", label: "Végétarienne" },
      { value: "other", label: "Autre" },
    ],
  },
  {
    key: "allergies",
    kind: "text",
    question: "Avez-vous des allergies ou intolérances ?",
    helper: "Facultatif — laissez vide si aucune.",
    placeholder: "Ex : lactose, gluten, fruits à coque…",
    required: false,
  },
  {
    key: "disliked_foods",
    kind: "text",
    question: "Y a-t-il des aliments que vous n'aimez pas ?",
    helper: "Facultatif — nous éviterons de vous les proposer.",
    placeholder: "Ex : champignons, poisson…",
    required: false,
  },
  {
    key: "household_size",
    kind: "choice",
    question: "Pour combien de personnes cuisinez-vous habituellement ?",
    required: true,
    options: [
      { value: "1", label: "1 personne" },
      { value: "2", label: "2 personnes" },
      { value: "3+", label: "3 personnes ou plus" },
    ],
  },
  {
    key: "recipe_preference",
    kind: "choice",
    question: "Vous préférez plutôt :",
    required: true,
    options: [
      { value: "quick", label: "Des recettes rapides" },
      { value: "family", label: "Des recettes familiales" },
      { value: "no_preference", label: "Peu importe" },
    ],
  },
  {
    key: "important_note",
    kind: "text",
    question: "Une information importante à prendre en compte ?",
    helper: "Facultatif. Par exemple un rythme de vie particulier ou une contrainte.",
    placeholder: "Écrivez ici si vous le souhaitez…",
    required: false,
  },
];

const EMPTY_DATA: OnboardingData = {
  goal: "",
  diet_type: "",
  allergies: "",
  disliked_foods: "",
  household_size: "",
  recipe_preference: "",
  important_note: "",
};

export function OnboardingFlow() {
  const [stepIndex, setStepIndex] = useState(0);
  const [data, setData] = useState<OnboardingData>(EMPTY_DATA);
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);

  const step = STEPS[stepIndex];
  const isLast = stepIndex === STEPS.length - 1;
  const currentValue = data[step.key];
  const canProceed = !step.required || currentValue.length > 0;

  function updateValue(value: string) {
    setData((prev) => ({ ...prev, [step.key]: value }));
  }

  function goNext() {
    if (!canProceed) return;
    if (!isLast) {
      setStepIndex((i) => i + 1);
      return;
    }
    setError(null);
    startTransition(async () => {
      try {
        await completeOnboardingAction(data);
      } catch {
        setError("Une erreur est survenue. Merci de réessayer.");
      }
    });
  }

  function goBack() {
    if (stepIndex === 0) return;
    setStepIndex((i) => i - 1);
  }

  return (
    <div className="mx-auto flex min-h-screen max-w-md flex-col px-5 py-8">
      <div className="mb-8 flex items-center gap-3">
        {stepIndex > 0 ? (
          <button
            onClick={goBack}
            aria-label="Question précédente"
            className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full hover:bg-muted"
          >
            <ArrowLeft className="h-5 w-5" />
          </button>
        ) : (
          <div className="h-10 w-10 shrink-0" />
        )}
        <div className="flex-1">
          <Progress value={((stepIndex + 1) / STEPS.length) * 100} />
        </div>
      </div>

      <p className="mb-2 text-sm font-medium text-muted-foreground">
        Question {stepIndex + 1} sur {STEPS.length}
      </p>
      <h1 className="font-heading text-2xl font-medium leading-snug">{step.question}</h1>
      {step.helper && <p className="mt-2 text-sm text-muted-foreground">{step.helper}</p>}

      <div className="mt-6 flex-1">
        {step.kind === "choice" ? (
          <div className="flex flex-col gap-3">
            {step.options.map((opt) => {
              const selected = currentValue === opt.value;
              return (
                <button
                  key={opt.value}
                  type="button"
                  onClick={() => updateValue(opt.value)}
                  className={cn(
                    "flex min-h-14 items-center justify-between rounded-xl border-2 px-4 py-3 text-left text-base font-medium transition-colors",
                    selected
                      ? "border-primary bg-primary/5 text-foreground"
                      : "border-border bg-card text-foreground hover:border-primary/40"
                  )}
                >
                  {opt.label}
                  {selected ? (
                    <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-primary text-primary-foreground">
                      <Check className="h-4 w-4" />
                    </span>
                  ) : (
                    <span className="h-6 w-6 shrink-0 rounded-full border-2 border-border" />
                  )}
                </button>
              );
            })}
          </div>
        ) : (
          <Textarea
            value={currentValue}
            onChange={(e) => updateValue(e.target.value)}
            placeholder={step.placeholder}
            rows={4}
            autoFocus
          />
        )}
      </div>

      {error && <p className="mt-4 text-sm text-destructive">{error}</p>}

      <div className="mt-8 flex flex-col gap-2">
        <Button size="lg" onClick={goNext} disabled={!canProceed || isPending}>
          {isPending ? "Un instant…" : isLast ? "Commencer mon accompagnement" : "Continuer"}
        </Button>
        {!step.required && !isLast && currentValue.length === 0 && (
          <Button variant="ghost" onClick={goNext} disabled={isPending}>
            Passer cette question
          </Button>
        )}
      </div>
    </div>
  );
}
