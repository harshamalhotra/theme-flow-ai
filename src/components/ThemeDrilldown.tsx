import { useMemo, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Quote, Lightbulb, TrendingDown, TrendingUp, Minus, FileOutput, ChevronDown, FileText } from "lucide-react";
import { cn } from "@/lib/utils";
import { Theme, Feedback } from "@/data/types";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { DraftSummary } from "@/components/DraftSummary";

interface ThemeDrilldownProps {
  theme: Theme;
  feedback: Feedback[];
  onClose: () => void;
}

function SentimentBar({ label, value, count }: { label: string; value: string; count: number }) {
  return (
    <div className="flex items-center gap-2">
      <span className="text-xs text-muted-foreground w-16">{label}</span>
      <div className="flex-1 h-2 rounded-full bg-muted overflow-hidden">
        <motion.div
          initial={{ width: 0 }}
          animate={{ width: value }}
          transition={{ duration: 0.5, ease: "easeOut" }}
          className={cn(
            "h-full rounded-full",
            label === "Positive" && "bg-sentiment-positive",
            label === "Negative" && "bg-sentiment-negative",
            label === "Neutral" && "bg-sentiment-neutral"
          )}
        />
      </div>
      <span className="text-xs font-medium text-foreground w-6 text-right">{count}</span>
    </div>
  );
}

export function ThemeDrilldown({ theme, feedback, onClose }: ThemeDrilldownProps) {
  const [summaryOpen, setSummaryOpen] = useState(false);

  const relatedFeedback = useMemo(
    () => feedback.filter((f) => theme.feedbackIds.includes(f.id)),
    [theme, feedback]
  );

  const themeSummary = useMemo(() => {
    const quotes = relatedFeedback.map((f) => `"${f.text}"`).join("\n");
    return `Theme: ${theme.label}\nConfidence: ${theme.confidence}%\nFeedback count: ${relatedFeedback.length}\n\nKey quotes:\n${quotes}${
      theme.suggestedActions?.length
        ? `\n\nSuggested actions:\n${theme.suggestedActions.map((a, i) => `${i + 1}. ${a}`).join("\n")}`
        : ""
    }`;
  }, [theme, relatedFeedback]);

  const sentimentBreakdown = useMemo(() => {
    const pos = relatedFeedback.filter((f) => f.sentiment > 0.2).length;
    const neg = relatedFeedback.filter((f) => f.sentiment < -0.2).length;
    const neu = relatedFeedback.length - pos - neg;
    const total = relatedFeedback.length || 1;
    return { pos, neg, neu, total };
  }, [relatedFeedback]);

  const avgSentiment = useMemo(() => {
    const sum = relatedFeedback.reduce((s, f) => s + f.sentiment, 0);
    return relatedFeedback.length ? sum / relatedFeedback.length : 0;
  }, [relatedFeedback]);

  const SentimentIcon = avgSentiment > 0.2 ? TrendingUp : avgSentiment < -0.2 ? TrendingDown : Minus;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0, x: 30 }}
        animate={{ opacity: 1, x: 0 }}
        exit={{ opacity: 0, x: 30 }}
        transition={{ duration: 0.3 }}
        className="rounded-xl border bg-card overflow-hidden flex flex-col h-full"
      >
        {/* Header */}
        <div className="px-4 py-3 border-b flex items-center gap-2">
          <span
            className={cn(
              "h-2.5 w-2.5 rounded-full",
              theme.sentiment > 0.2
                ? "bg-sentiment-positive"
                : theme.sentiment < -0.2
                ? "bg-sentiment-negative"
                : "bg-sentiment-neutral"
            )}
          />
          <h2 className="text-sm font-semibold text-foreground flex-1 truncate">
            {theme.label}
          </h2>
          <button
            onClick={() => setSummaryOpen(!summaryOpen)}
            className={cn(
              "h-7 px-2 rounded-md flex items-center gap-1.5 text-[10px] font-medium transition-colors",
              summaryOpen
                ? "bg-primary/10 text-primary"
                : "hover:bg-muted text-muted-foreground"
            )}
            title="Draft Report"
          >
            <FileText size={12} />
            Draft Report
          </button>
          <button
            onClick={onClose}
            className="h-6 w-6 rounded-md flex items-center justify-center hover:bg-muted transition-colors"
          >
            <X size={14} className="text-muted-foreground" />
          </button>
        </div>

        <ScrollArea className="flex-1 p-4">
          <div className="space-y-5">
            {/* Sentiment Breakdown */}
            <div>
              <div className="flex items-center gap-2 mb-3">
                <SentimentIcon size={14} className="text-muted-foreground" />
                <h3 className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
                  Sentiment Breakdown
                </h3>
              </div>
              <div className="space-y-2">
                <SentimentBar
                  label="Positive"
                  value={`${(sentimentBreakdown.pos / sentimentBreakdown.total) * 100}%`}
                  count={sentimentBreakdown.pos}
                />
                <SentimentBar
                  label="Neutral"
                  value={`${(sentimentBreakdown.neu / sentimentBreakdown.total) * 100}%`}
                  count={sentimentBreakdown.neu}
                />
                <SentimentBar
                  label="Negative"
                  value={`${(sentimentBreakdown.neg / sentimentBreakdown.total) * 100}%`}
                  count={sentimentBreakdown.neg}
                />
              </div>
              <div className="mt-3 flex items-center justify-between text-xs">
                <span className="text-muted-foreground">
                  Avg. sentiment: <span className="font-medium text-foreground">{(avgSentiment * 100).toFixed(0)}</span>/100
                </span>
                <span className="text-muted-foreground">
                  Confidence: <span className="font-medium text-foreground">{theme.confidence}%</span>
                </span>
              </div>
            </div>

            {/* Suggested Actions */}
            {theme.suggestedActions && theme.suggestedActions.length > 0 && (
              <div>
                <div className="flex items-center gap-2 mb-3">
                  <Lightbulb size={14} className="text-primary" />
                  <h3 className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
                    Suggested Actions
                  </h3>
                </div>
                <div className="space-y-2">
                  {theme.suggestedActions.map((action, i) => (
                    <motion.div
                      key={i}
                      initial={{ opacity: 0, y: 8 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.1 + i * 0.08 }}
                      className="flex items-start gap-2.5 rounded-lg bg-accent/40 border border-accent p-3"
                    >
                      <span className="text-[10px] font-semibold text-primary bg-primary/10 rounded px-1.5 py-0.5 mt-0.5 shrink-0">
                        {i + 1}
                      </span>
                      <p className="text-xs text-foreground leading-relaxed">{action}</p>
                    </motion.div>
                  ))}
                </div>
              </div>
            )}

            {/* Related Quotes */}
            <div>
              <div className="flex items-center gap-2 mb-3">
                <Quote size={14} className="text-muted-foreground" />
                <h3 className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
                  Related Quotes
                </h3>
                <span className="ml-auto text-[10px] text-muted-foreground bg-muted px-1.5 py-0.5 rounded">
                  {relatedFeedback.length}
                </span>
              </div>
              <div className="space-y-2">
                {relatedFeedback.map((fb, i) => (
                  <motion.div
                    key={fb.id}
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.15 + i * 0.06 }}
                    className="rounded-lg border bg-surface-sunken p-3"
                  >
                    <p className="text-xs text-card-foreground leading-relaxed italic">
                      "{fb.text}"
                    </p>
                    <div className="mt-2 flex items-center justify-between">
                      <span className="text-[10px] text-muted-foreground">{fb.source}</span>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <span
                            className={cn(
                              "text-[10px] font-medium px-1.5 py-0.5 rounded cursor-help",
                              fb.sentiment > 0.2
                                ? "bg-sentiment-positive/15 text-sentiment-positive"
                                : fb.sentiment < -0.2
                                ? "bg-sentiment-negative/15 text-sentiment-negative"
                                : "bg-sentiment-neutral/15 text-sentiment-neutral"
                            )}
                          >
                            Sentiment: {fb.sentiment > 0 ? "+" : ""}{(fb.sentiment * 100).toFixed(0)}
                          </span>
                        </TooltipTrigger>
                        <TooltipContent side="top" className="text-xs max-w-[200px]">
                          Sentiment score from <span className="font-semibold">-100</span> (very negative) to <span className="font-semibold">+100</span> (very positive)
                        </TooltipContent>
                      </Tooltip>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
            {/* Draft Summary */}
            <div>
              <button
                onClick={() => setSummaryOpen(!summaryOpen)}
                className="flex items-center gap-2 mb-3 w-full group"
              >
                <FileOutput size={14} className="text-muted-foreground" />
                <h3 className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
                  Draft Summary
                </h3>
                <ChevronDown
                  size={14}
                  className={cn(
                    "ml-auto text-muted-foreground transition-transform duration-200",
                    summaryOpen && "rotate-180"
                  )}
                />
              </button>
              <AnimatePresence>
                {summaryOpen && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    exit={{ opacity: 0, height: 0 }}
                    transition={{ duration: 0.2 }}
                    className="overflow-hidden"
                  >
                    <DraftSummary summary={themeSummary} />
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>
        </ScrollArea>
      </motion.div>
    </AnimatePresence>
  );
}
