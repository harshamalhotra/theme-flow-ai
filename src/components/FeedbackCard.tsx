import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

interface FeedbackCardProps {
  text: string;
  source: string;
  date: string;
  sentiment: number;
  isHighlighted: boolean;
  highlightedTheme?: string;
  themes: string[];
}

function getSentimentDot(sentiment: number) {
  if (sentiment > 0.2) return "bg-sentiment-positive";
  if (sentiment < -0.2) return "bg-sentiment-negative";
  return "bg-sentiment-neutral";
}

export function FeedbackCard({
  text,
  source,
  date,
  sentiment,
  isHighlighted,
  highlightedTheme,
  themes,
}: FeedbackCardProps) {
  return (
    <motion.div
      layout
      animate={{
        scale: isHighlighted ? 1.02 : 1,
        boxShadow: isHighlighted
          ? "0 0 0 2px hsl(174 62% 40%), 0 4px 20px -4px hsl(174 62% 40% / 0.2)"
          : "0 1px 3px 0 rgb(0 0 0 / 0.04)",
      }}
      transition={{ duration: 0.2 }}
      className={cn(
        "rounded-lg bg-card p-4 border transition-colors",
        isHighlighted && "border-primary/40 bg-accent/30"
      )}
    >
      <p className="text-sm text-card-foreground leading-relaxed">
        {isHighlighted && highlightedTheme
          ? renderHighlightedText(text, highlightedTheme)
          : text}
      </p>
      <div className="mt-3 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className={cn("h-2 w-2 rounded-full", getSentimentDot(sentiment))} />
          <span className="text-xs text-muted-foreground">{source}</span>
        </div>
        <span className="text-xs text-muted-foreground">{date}</span>
      </div>
      {isHighlighted && (
        <div className="mt-2 flex flex-wrap gap-1">
          {themes.map((t) => (
            <span
              key={t}
              className={cn(
                "text-[10px] px-1.5 py-0.5 rounded-sm",
                t === highlightedTheme
                  ? "bg-primary/15 text-primary font-medium"
                  : "bg-muted text-muted-foreground"
              )}
            >
              {t}
            </span>
          ))}
        </div>
      )}
    </motion.div>
  );
}

function renderHighlightedText(text: string, _theme: string) {
  // Simple keyword-based highlighting for demo
  const keywords: Record<string, string[]> = {
    "Navigation Friction": ["navigation", "lost", "back button", "couldn't figure out", "locate", "blends"],
    "Price Transparency": ["pricing", "hidden fees", "charged more", "listed price", "service fees"],
    "Trust Issues": ["dishonest", "hidden fees", "charged more", "trust", "weren't mentioned"],
    "Checkout Flow": ["checkout", "cart icon", "shipping address", "progress bar"],
    "Onboarding Quality": ["onboarding", "tutorial", "understand"],
    "Mobile Experience": ["mobile", "loads fast", "gestures"],
    "Search Quality": ["search", "irrelevant results", "keywords"],
  };

  const words = keywords[_theme] || [];
  if (!words.length) return text;

  const pattern = new RegExp(`(${words.map(w => w.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')).join("|")})`, "gi");
  const parts = text.split(pattern);

  return parts.map((part, i) =>
    pattern.test(part) ? (
      <mark key={i} className="bg-highlight rounded-sm px-0.5 text-foreground">
        {part}
      </mark>
    ) : (
      part
    )
  );
}
