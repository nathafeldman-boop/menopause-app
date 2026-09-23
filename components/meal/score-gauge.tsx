import { Progress } from "@/components/ui/progress";

export function ScoreGauge({ score, label = "Équilibre général" }: { score: number; label?: string }) {
  const colorClass = score >= 70 ? "bg-secondary" : score >= 40 ? "bg-accent" : "bg-primary";

  return (
    <div className="flex flex-col gap-2">
      <div className="flex items-baseline justify-between">
        <span className="text-sm font-medium text-muted-foreground">{label}</span>
        <span className="font-heading text-3xl font-medium">
          {score}
          <span className="text-base font-normal text-muted-foreground">/100</span>
        </span>
      </div>
      <Progress value={score} indicatorClassName={colorClass} />
    </div>
  );
}
