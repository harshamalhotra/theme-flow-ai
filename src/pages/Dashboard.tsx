import { useState, useMemo, useEffect, useCallback } from "react";
import { cn } from "@/lib/utils";
import { motion, AnimatePresence } from "framer-motion";
import { Activity, MessageSquareText, Sparkles, FileOutput, PanelLeftOpen, Plus, BarChart3, TrendingUp, CalendarDays } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { FeedbackSubmitForm } from "@/components/FeedbackSubmitForm";
import { FeedbackCard } from "@/components/FeedbackCard";
import { FeedbackFilters } from "@/components/FeedbackFilters";
import {
  FeedbackListSkeleton,
  ThemePillSkeleton,
  SparklineSkeleton,
  StatCardSkeleton,
  NoFeedbackEmpty,
  NoResultsEmpty,
  NoChartDataEmpty,
} from "@/components/EmptyStates";
import { ThemePill } from "@/components/ThemePill";
import { SentimentSparkline } from "@/components/SentimentSparkline";
import { SentimentHeatmap } from "@/components/SentimentHeatmap";
import { DraftSummary } from "@/components/DraftSummary";
import { SourceBreakdown } from "@/components/SourceBreakdown";
import { ThemeDrilldown } from "@/components/ThemeDrilldown";
import { mockFeedback, mockThemes, mockSummary } from "@/data/mockData";
import { ScrollArea } from "@/components/ui/scroll-area";
import { supabase } from "@/integrations/supabase/client";
import { Feedback } from "@/data/types";
import { AnimatedCounter } from "@/components/AnimatedCounter";

function SentimentTrendPanel({ isLoading, feedback }: { isLoading: boolean; feedback: Feedback[] }) {
  const [view, setView] = useState<"sparkline" | "heatmap">("heatmap");

  return (
    <div className="rounded-xl border bg-card p-5">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-sm font-medium text-foreground">Sentiment Trend</h2>
        <div className="flex items-center rounded-lg border bg-muted/50 p-0.5">
          <button
            onClick={() => setView("sparkline")}
            className={cn(
              "flex items-center gap-1 px-2 py-1 rounded-md text-[10px] font-medium transition-all",
              view === "sparkline"
                ? "bg-card text-foreground shadow-sm"
                : "text-muted-foreground hover:text-foreground"
            )}
          >
            <TrendingUp size={11} />
            Line
          </button>
          <button
            onClick={() => setView("heatmap")}
            className={cn(
              "flex items-center gap-1 px-2 py-1 rounded-md text-[10px] font-medium transition-all",
              view === "heatmap"
                ? "bg-card text-foreground shadow-sm"
                : "text-muted-foreground hover:text-foreground"
            )}
          >
            <CalendarDays size={11} />
            Heatmap
          </button>
        </div>
      </div>
      {isLoading ? (
        <SparklineSkeleton />
      ) : feedback.length === 0 ? (
        <NoChartDataEmpty />
      ) : (
        <AnimatePresence mode="wait">
          {view === "sparkline" ? (
            <motion.div key="sparkline" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.2 }}>
              <SentimentSparkline feedback={feedback} />
            </motion.div>
          ) : (
            <motion.div key="heatmap" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.2 }}>
              <SentimentHeatmap feedback={feedback} />
            </motion.div>
          )}
        </AnimatePresence>
      )}
    </div>
  );
}

export default function Dashboard() {
  const [activeTheme, setActiveTheme] = useState<string | null>(null);
  const [leftPanelOpen, setLeftPanelOpen] = useState(true);
  const [filteredFeedback, setFilteredFeedback] = useState<Feedback[]>([]);
  const [hasInitFilters, setHasInitFilters] = useState(false);
  const [supabaseFeedback, setSupabaseFeedback] = useState<Feedback[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [activeSourceFilter, setActiveSourceFilter] = useState<string | null>(null);
  const [activePivot, setActivePivot] = useState<"themes" | "negative" | null>(null);

  const fetchFeedback = useCallback(async () => {
    setIsLoading(true);
    const { data, error } = await supabase
      .from("feedback")
      .select("*")
      .order("created_at", { ascending: false });

    if (!error && data) {
      setSupabaseFeedback(
        data.map((row) => ({
          id: row.id,
          text: row.text,
          source: row.source,
          date: row.date,
          sentiment: Number(row.sentiment) || 0,
          themes: row.themes || [],
        }))
      );
    }
    setIsLoading(false);
  }, []);

  useEffect(() => {
    fetchFeedback();
  }, [fetchFeedback]);

  // Merge Supabase feedback with mock data
  const allFeedback = useMemo(
    () => [...supabaseFeedback, ...mockFeedback],
    [supabaseFeedback]
  );

  // Auto-collapse left panel when a theme is selected
  useEffect(() => {
    if (activeTheme) {
      setLeftPanelOpen(false);
    } else {
      setLeftPanelOpen(true);
    }
  }, [activeTheme]);

  const selectedTheme = mockThemes.find((t) => t.id === activeTheme);
  const highlightedFeedbackIds = selectedTheme?.feedbackIds || [];

  // The active dataset is filteredFeedback once filters have initialized, plus source filter
  const baseFeedback = hasInitFilters ? filteredFeedback : allFeedback;
  const activeFeedback = useMemo(() => {
    if (!activeSourceFilter) return baseFeedback;
    return baseFeedback.filter((f) => f.source.replace(/ #\d+$/, "") === activeSourceFilter);
  }, [baseFeedback, activeSourceFilter]);

  const handleFilteredChange = useCallback((filtered: Feedback[]) => {
    setFilteredFeedback(filtered);
    if (!hasInitFilters) setHasInitFilters(true);
  }, [hasInitFilters]);

  const overallSentiment = useMemo(() => {
    if (!activeFeedback.length) return 0;
    const total = activeFeedback.reduce((sum, f) => sum + f.sentiment, 0);
    return total / activeFeedback.length;
  }, [activeFeedback]);

  const sortedFeedback = useMemo(() => {
    if (!highlightedFeedbackIds.length) return activeFeedback;
    return [
      ...activeFeedback.filter((f) => highlightedFeedbackIds.includes(f.id)),
      ...activeFeedback.filter((f) => !highlightedFeedbackIds.includes(f.id)),
    ];
  }, [highlightedFeedbackIds, activeFeedback]);
  const handleSubmitSuccess = useCallback(() => {
    fetchFeedback();
    setDialogOpen(false);
  }, [fetchFeedback]);

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b bg-card px-6 py-4">
        <div className="flex items-center justify-between max-w-layout mx-auto">
          <div className="flex items-center gap-3">
            <div className="h-8 w-8 rounded-lg bg-primary flex items-center justify-center">
              <Activity size={16} className="text-primary-foreground" />
            </div>
            <div>
              <h1 className="text-base font-semibold text-foreground tracking-tight">
                Pulse AI
              </h1>
              <p className="text-xs text-muted-foreground">
                Sentiment & Synthesis Dashboard
              </p>
            </div>
          </div>
          <div className="flex items-center gap-3 text-xs text-muted-foreground">
            <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
              <DialogTrigger asChild>
                <Button size="sm" className="gap-1.5 text-xs">
                  <Plus size={14} />
                  Add Feedback
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-[480px]">
                <DialogHeader>
                  <DialogTitle>Submit Feedback</DialogTitle>
                </DialogHeader>
                <FeedbackSubmitForm onSuccess={handleSubmitSuccess} />
              </DialogContent>
            </Dialog>
            <span className="h-2 w-2 rounded-full bg-sentiment-positive animate-pulse-glow" />
            <span>{activeFeedback.length} responses analyzed</span>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-layout mx-auto p-6">
        <div className={`grid grid-cols-1 gap-6 h-[calc(100vh-120px)] transition-all duration-500 ${leftPanelOpen
            ? 'lg:grid-cols-[1fr_40%_1fr]'
            : 'lg:grid-cols-[auto_40%_1fr]'
          }`}>
          {/* Left Panel - Feedback Source */}
          <AnimatePresence initial={false}>
            {leftPanelOpen ? (
              <motion.div
                key="left-panel"
                initial={{ width: 0, opacity: 0 }}
                animate={{ width: "auto", opacity: 1 }}
                exit={{ width: 0, opacity: 0 }}
                transition={{ duration: 0.35, ease: "easeInOut" }}
                className="flex flex-col rounded-xl border bg-card overflow-hidden min-w-0"
              >
                <div className="px-4 py-3 border-b flex items-center gap-2">
                  <MessageSquareText size={15} className="text-muted-foreground" />
                  <h2 className="text-sm font-medium text-foreground">
                    Raw Feedback
                  </h2>
                  <span className="ml-auto text-xs text-muted-foreground bg-muted px-2 py-0.5 rounded-md">
                    {allFeedback.length}
                  </span>
                </div>
                <div className="px-3 pt-3">
                  <FeedbackFilters feedback={allFeedback} onFilteredChange={handleFilteredChange} />
                </div>
                <ScrollArea className="h-dashboard-scroll p-3">
                  {isLoading ? (
                    <FeedbackListSkeleton />
                  ) : sortedFeedback.length === 0 ? (
                    hasInitFilters ? <NoResultsEmpty /> : <NoFeedbackEmpty />
                  ) : (
                    <div className="space-y-2.5">
                      {sortedFeedback.map((fb) => (
                        <FeedbackCard
                          key={fb.id}
                          text={fb.text}
                          source={fb.source}
                          date={fb.date}
                          sentiment={fb.sentiment}
                          themes={fb.themes}
                          isHighlighted={highlightedFeedbackIds.includes(fb.id)}
                          highlightedTheme={selectedTheme?.label}
                        />
                      ))}
                    </div>
                  )}
                </ScrollArea>
              </motion.div>
            ) : (
              <motion.div
                key="left-panel-collapsed"
                initial={{ width: 0, opacity: 0 }}
                animate={{ width: "auto", opacity: 1 }}
                exit={{ width: 0, opacity: 0 }}
                transition={{ duration: 0.35, ease: "easeInOut" }}
                className="flex flex-col items-center"
              >
                <Button
                  variant="outline"
                  size="icon"
                  onClick={() => setLeftPanelOpen(true)}
                  className="h-9 w-9 rounded-xl border bg-card shadow-sm"
                  title="Show Raw Feedback"
                >
                  <PanelLeftOpen size={16} className="text-muted-foreground" />
                </Button>
                <span className="text-[10px] text-muted-foreground mt-2 [writing-mode:vertical-lr] rotate-180 tracking-widest uppercase">
                  Feedback
                </span>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Center Panel - AI Insights */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.1 }}
            className="flex flex-col gap-6"
          >
            {/* Top Themes */}
            <div className="rounded-xl border bg-card p-5">
              <div className="flex items-center gap-2 mb-4">
                <Sparkles size={15} className="text-primary" />
                <h2 className="text-sm font-medium text-foreground">
                  Top Themes
                </h2>
                <span className="text-[10px] text-muted-foreground ml-auto">
                  Click to trace
                </span>
              </div>
              <div className="flex flex-wrap gap-2">
                {mockThemes.map((theme) => (
                  <ThemePill
                    key={theme.id}
                    label={theme.label}
                    count={theme.count}
                    confidence={theme.confidence}
                    sentiment={theme.sentiment}
                    isActive={activeTheme === theme.id}
                    onClick={() =>
                      setActiveTheme(activeTheme === theme.id ? null : theme.id)
                    }
                  />
                ))}
              </div>
              {selectedTheme && (
                <motion.p
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  className="mt-4 text-xs text-muted-foreground border-t pt-3"
                >
                  Showing <span className="font-medium text-foreground">{selectedTheme.feedbackIds.length}</span> related
                  feedback items for "{selectedTheme.label}"
                </motion.p>
              )}
            </div>

            {/* Sentiment Trend — Sparkline + Heatmap toggle */}
            <SentimentTrendPanel isLoading={isLoading} feedback={activeFeedback} />

            {/* Stats Row — Clickable Pivots */}
            <div className="grid grid-cols-3 gap-3">
              {isLoading ? (
                <>
                  <StatCardSkeleton />
                  <StatCardSkeleton />
                  <StatCardSkeleton />
                </>
              ) : (
                [{
                  label: "Themes Found" as const, value: mockThemes.length, suffix: "", pivot: "themes" as const,
                }, {
                  label: "Avg. Confidence" as const, value: Math.round(mockThemes.reduce((s, t) => s + t.confidence, 0) / mockThemes.length), suffix: "%", pivot: null,
                }, {
                  label: "Negative Signals" as const, value: activeFeedback.filter(f => f.sentiment < -0.2).length, suffix: "", pivot: "negative" as const,
                }].map((stat) => (
                  <button
                    key={stat.label}
                    onClick={() => stat.pivot && setActivePivot(activePivot === stat.pivot ? null : stat.pivot)}
                    className={cn(
                      "rounded-xl border bg-card p-4 text-center transition-all",
                      stat.pivot && "cursor-pointer hover:border-primary/40 hover:shadow-sm",
                      !stat.pivot && "cursor-default",
                      activePivot === stat.pivot && stat.pivot && "border-primary ring-1 ring-primary/20 bg-accent/30"
                    )}
                  >
                    <p className="text-2xl font-semibold text-foreground">
                      <AnimatedCounter value={stat.value} suffix={stat.suffix} />
                    </p>
                    <p className="text-xs text-muted-foreground mt-1">
                      {stat.label}
                    </p>
                  </button>
                ))
              )}
            </div>

            {/* Pivot Detail Panel */}
            <AnimatePresence>
              {activePivot === "themes" && (
                <motion.div
                  key="pivot-themes"
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  exit={{ opacity: 0, height: 0 }}
                  transition={{ duration: 0.25 }}
                  className="rounded-xl border bg-card p-4 overflow-hidden"
                >
                  <div className="flex items-center justify-between mb-3">
                    <h3 className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
                      All Themes ({mockThemes.length})
                    </h3>
                    <button onClick={() => setActivePivot(null)} className="text-[10px] text-primary hover:underline">
                      Close
                    </button>
                  </div>
                  <div className="space-y-2">
                    {mockThemes.map((theme) => (
                      <button
                        key={theme.id}
                        onClick={() => { setActiveTheme(theme.id); setActivePivot(null); }}
                        className="flex items-center gap-3 w-full rounded-lg border bg-surface-sunken p-3 hover:border-primary/30 transition-colors text-left"
                      >
                        <span className={cn(
                          "h-2 w-2 rounded-full shrink-0",
                          theme.sentiment > 0.2 ? "bg-sentiment-positive" : theme.sentiment < -0.2 ? "bg-sentiment-negative" : "bg-sentiment-neutral"
                        )} />
                        <span className="text-xs font-medium text-foreground flex-1">{theme.label}</span>
                        <span className="text-[10px] text-muted-foreground">{theme.count} mentions</span>
                        <span className="text-[10px] text-muted-foreground">{theme.confidence}%</span>
                      </button>
                    ))}
                  </div>
                </motion.div>
              )}
              {activePivot === "negative" && (
                <motion.div
                  key="pivot-negative"
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  exit={{ opacity: 0, height: 0 }}
                  transition={{ duration: 0.25 }}
                  className="rounded-xl border bg-card p-4 overflow-hidden"
                >
                  <div className="flex items-center justify-between mb-3">
                    <h3 className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
                      Negative Signals ({activeFeedback.filter(f => f.sentiment < -0.2).length})
                    </h3>
                    <button onClick={() => setActivePivot(null)} className="text-[10px] text-primary hover:underline">
                      Close
                    </button>
                  </div>
                  <ScrollArea className="max-h-[240px]">
                    <div className="space-y-2">
                      {activeFeedback.filter(f => f.sentiment < -0.2).sort((a, b) => a.sentiment - b.sentiment).map((fb) => (
                        <div key={fb.id} className="rounded-lg border bg-surface-sunken p-3">
                          <p className="text-xs text-card-foreground leading-relaxed">"{fb.text}"</p>
                          <div className="mt-2 flex items-center justify-between">
                            <span className="text-[10px] text-muted-foreground">{fb.source} · {fb.date}</span>
                            <span className="text-[10px] font-medium px-1.5 py-0.5 rounded bg-sentiment-negative/15 text-sentiment-negative">
                              {(fb.sentiment * 100).toFixed(0)}
                            </span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </ScrollArea>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Source Channel Breakdown */}
            <div className="rounded-xl border bg-card p-5">
              <div className="flex items-center gap-2 mb-4">
                <BarChart3 size={15} className="text-muted-foreground" />
                <h2 className="text-sm font-medium text-foreground">
                  Source Channels
                </h2>
                {activeSourceFilter && (
                  <span className="ml-auto text-[10px] text-primary bg-accent px-2 py-0.5 rounded-md">
                    Filtered
                  </span>
                )}
              </div>
              <SourceBreakdown
                feedback={baseFeedback}
                onSourceFilter={setActiveSourceFilter}
                activeSource={activeSourceFilter}
              />
            </div>
          </motion.div>

          {/* Right Panel - Drill-down or Draft Summary */}
          <AnimatePresence mode="wait">
            {selectedTheme ? (
              <motion.div
                key="drilldown"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
                transition={{ duration: 0.3 }}
                className="flex flex-col"
              >
                <ThemeDrilldown
                  theme={selectedTheme}
                  feedback={mockFeedback}
                  onClose={() => setActiveTheme(null)}
                />
              </motion.div>
            ) : (
              <motion.div
                key="summary"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
                transition={{ duration: 0.3 }}
                className="lg:col-span-3 rounded-xl border bg-card overflow-hidden flex flex-col"
              >
                <div className="px-4 py-3 border-b flex items-center gap-2">
                  <FileOutput size={15} className="text-muted-foreground" />
                  <h2 className="text-sm font-medium text-foreground">
                    Draft Summary
                  </h2>
                </div>
                <div className="flex-1 p-4">
                  <DraftSummary summary={mockSummary} />
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </main>
    </div>
  );
}
