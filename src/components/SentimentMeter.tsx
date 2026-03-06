import { motion } from "framer-motion";

interface SentimentMeterProps {
  value: number; // -1 to 1
}

export function SentimentMeter({ value }: SentimentMeterProps) {
  // Normalize -1..1 to 0..100
  const percent = ((value + 1) / 2) * 100;

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between text-xs text-muted-foreground">
        <span>Negative</span>
        <span className="font-medium text-foreground">
          {value > 0.1 ? "Leaning Positive" : value < -0.1 ? "Leaning Negative" : "Neutral"}
        </span>
        <span>Positive</span>
      </div>
      <div className="relative h-2.5 rounded-full overflow-hidden bg-muted">
        {/* Gradient background */}
        <div
          className="absolute inset-0 rounded-full"
          style={{
            background:
              "linear-gradient(to right, hsl(var(--sentiment-negative)), hsl(var(--sentiment-neutral)), hsl(var(--sentiment-positive)))",
            opacity: 0.25,
          }}
        />
        {/* Indicator */}
        <motion.div
          initial={{ left: "50%" }}
          animate={{ left: `${percent}%` }}
          transition={{ type: "spring", stiffness: 120, damping: 20 }}
          className="absolute top-1/2 -translate-y-1/2 -translate-x-1/2 h-4 w-4 rounded-full border-2 border-card shadow-md"
          style={{
            background:
              value > 0.1
                ? "hsl(var(--sentiment-positive))"
                : value < -0.1
                ? "hsl(var(--sentiment-negative))"
                : "hsl(var(--sentiment-neutral))",
          }}
        />
      </div>
      <div className="text-center">
        <span className="text-lg font-semibold text-foreground">
          {(value * 100).toFixed(0)}
        </span>
        <span className="text-xs text-muted-foreground ml-1">/ 100</span>
      </div>
    </div>
  );
}
