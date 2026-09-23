"use client";

import { useEffect, useState, useTransition } from "react";
import { ArrowLeft, Check } from "lucide-react";

import { completeOnboardingAction, type OnboardingData } from "@/lib/actions/onboarding";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Progress } from "@/components/ui/progress";
import { ScoreGauge } from "@/components/meal/score-gauge";
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

type NumberStep = {
  key: keyof OnboardingData;
  kind: "number";
  question: string;
  helper?: string;
  placeholder: string;
  suffix: string;
  required: boolean;
};

// Pages animées entre les questions : témoignages/chiffres illustratifs pour l'instant
// (placeholder marketing — à remplacer par du contenu réel dès qu'on aura de vraies
// utilisatrices), mélangés à un vrai repère nutritionnel général.
type InterstitialStep = {
  kind: "interstitial";
  headline: string;
  body: string;
  visual: "quote" | "bars" | "gauge";
};

type Step = ChoiceStep | TextStep | NumberStep | InterstitialStep;

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
    kind: "interstitial",
    headline: "Vous n'êtes pas seule",
    body: "« Je ne culpabilise plus après un repas, je comprends enfin ce qui se passe dans mon assiette. » — Nadia, 49 ans",
    visual: "quote",
  },
  {
    key: "age",
    kind: "number",
    question: "Quel est votre âge ?",
    placeholder: "50",
    suffix: "ans",
    required: true,
  },
  {
    key: "height_cm",
    kind: "number",
    question: "Quelle est votre taille ?",
    placeholder: "165",
    suffix: "cm",
    required: true,
  },
  {
    key: "weight_kg",
    kind: "number",
    question: "Quel est votre poids ?",
    helper: "Facultatif si vous préférez ne pas répondre — utile pour affiner vos suggestions.",
    placeholder: "65",
    suffix: "kg",
    required: false,
  },
  {
    kind: "interstitial",
    headline: "Un repère utile",
    body: "Après 45 ans, les besoins en calcium et en protéines augmentent — l'alimentation devient un vrai levier au quotidien.",
    visual: "bars",
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
    kind: "interstitial",
    headline: "Ça fait la différence",
    body: "8 utilisatrices sur 10 se sentent plus sereines face à leurs repas après 2 semaines avec Alma.",
    visual: "gauge",
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
  {
    key: "todays_meals",
    kind: "text",
    question: "Qu'avez-vous déjà mangé aujourd'hui ?",
    helper: "Facultatif — ça nous aide à construire votre premier programme.",
    placeholder: "Ex : un café et une tartine ce matin…",
    required: false,
  },
];

const EMPTY_DATA: OnboardingData = {
  goal: "",
  age: "",
  height_cm: "",
  weight_kg: "",
  diet_type: "",
  allergies: "",
  disliked_foods: "",
  household_size: "",
  recipe_preference: "",
  important_note: "",
  todays_meals: "",
};

function AnimatedIn({ children }: { children: React.ReactNode }) {
  const [shown, setShown] = useState(false);

  useEffect(() => {
    const t = setTimeout(() => setShown(true), 30);
    return () => clearTimeout(t);
  }, []);

  return (
    <div
      className={cn(
        "transition-all duration-500 ease-out",
        shown ? "translate-y-0 opacity-100" : "translate-y-3 opacity-0"
      )}
    >
      {children}
    </div>
  );
}

function InterstitialVisual({ visual }: { visual: InterstitialStep["visual"] }) {
  const [animated, setAnimated] = useState(false);

  useEffect(() => {
    const t = setTimeout(() => setAnimated(true), 250);
    return () => clearTimeout(t);
  }, []);

  if (visual === "quote") {
    return (
      <div className="flex h-24 w-24 items-center justify-center rounded-full bg-primary/10 text-4xl text-primary">
        “
      </div>
    );
  }

  if (visual === "gauge") {
    return <ScoreGauge score={animated ? 80 : 0} size={96} />;
  }

  return (
    <div className="flex w-full max-w-[220px] flex-col gap-3">
      {[
        { label: "Avant 45 ans", target: 45 },
        { label: "Après 45 ans", target: 85 },
      ].map((bar) => (
        <div key={bar.label} className="flex flex-col gap-1">
          <span className="text-xs text-muted-foreground">{bar.label}</span>
          <div className="h-3 w-full overflow-hidden rounded-full bg-muted">
            <div
              className="h-full rounded-full bg-primary transition-all duration-700 ease-out"
              style={{ width: animated ? `${bar.target}%` : "0%" }}
            />
          </div>
        </div>
      ))}
    </div>
  );
}

export function OnboardingFlow() {
  const [stepIndex, setStepIndex] = useState(0);
  const [data, setData] = useState<OnboardingData>(EMPTY_DATA);
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);

  const step = STEPS[stepIndex];
  const isLast = stepIndex === STEPS.length - 1;
  const questionSteps = STEPS.filter((s) => s.kind !== "interstitial");
  const questionNumber = STEPS.slice(0, stepIndex + 1).filter((s) => s.kind !== "interstitial").length;

  const currentValue = step.kind !== "interstitial" ? data[step.key] : "";
  const canProceed = step.kind === "interstitial" || !step.required || currentValue.length > 0;

  function updateValue(value: string) {
    if (step.kind === "interstitial") return;
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
            aria-label="Étape précédente"
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

      {step.kind === "interstitial" ? (
        <AnimatedIn key={stepIndex}>
          <div className="flex flex-1 flex-col items-center justify-center gap-6 py-10 text-center">
            <InterstitialVisual visual={step.visual} />
            <div>
              <h1 className="font-heading text-2xl font-medium leading-snug">{step.headline}</h1>
              <p className="mt-3 text-muted-foreground">{step.body}</p>
            </div>
          </div>
        </AnimatedIn>
      ) : (
        <>
          <p className="mb-2 text-sm font-medium text-muted-foreground">
            Question {questionNumber} sur {questionSteps.length}
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
            ) : step.kind === "number" ? (
              <div className="relative">
                <Input
                  type="number"
                  inputMode="numeric"
                  value={currentValue}
                  onChange={(e) => updateValue(e.target.value)}
                  placeholder={step.placeholder}
                  className="pr-16"
                  autoFocus
                />
                <span className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 text-muted-foreground">
                  {step.suffix}
                </span>
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
        </>
      )}

      {error && <p className="mt-4 text-sm text-destructive">{error}</p>}

      <div className="mt-8 flex flex-col gap-2">
        <Button size="lg" onClick={goNext} disabled={!canProceed || isPending}>
          {isPending ? "Un instant…" : isLast ? "Commencer mon accompagnement" : "Continuer"}
        </Button>
        {step.kind !== "interstitial" &&
          !step.required &&
          !isLast &&
          currentValue.length === 0 && (
            <Button variant="ghost" onClick={goNext} disabled={isPending}>
              Passer cette question
            </Button>
          )}
      </div>
    </div>
  );
}
