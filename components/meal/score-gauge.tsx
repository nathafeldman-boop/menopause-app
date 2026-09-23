import { getScoreColorVar } from "@/lib/score";

export function ScoreGauge({ score, size = 76 }: { score: number; size?: number }) {
  const clamped = Math.max(0, Math.min(100, score));
  const strokeWidth = Math.round(size * 0.11);
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference * (1 - clamped / 100);
  const color = getScoreColorVar(clamped);
  const center = size / 2;

  return (
    <div
      className="relative shrink-0"
      style={{ width: size, height: size }}
      role="img"
      aria-label={`Score : ${clamped} sur 100`}
    >
      <svg width={size} height={size} className="-rotate-90">
        <circle
          cx={center}
          cy={center}
          r={radius}
          fill="none"
          stroke="var(--muted)"
          strokeWidth={strokeWidth}
        />
        <circle
          cx={center}
          cy={center}
          r={radius}
          fill="none"
          stroke={color}
          strokeWidth={strokeWidth}
          strokeLinecap="round"
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          style={{ transition: "stroke-dashoffset 0.5s ease" }}
        />
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <span className="font-heading text-xl font-medium leading-none">{clamped}</span>
        <span className="text-[10px] leading-none text-muted-foreground">/100</span>
      </div>
    </div>
  );
}
