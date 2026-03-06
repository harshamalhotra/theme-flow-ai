import { useState, useMemo, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Activity, MessageSquareText, Sparkles, FileOutput, PanelLeftOpen, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { FeedbackSubmitForm } from "@/components/FeedbackSubmitForm";
import { FeedbackCard } from "@/components/FeedbackCard";
import { ThemePill } from "@/components/ThemePill";
import { SentimentSparkline } from "@/components/SentimentSparkline";
import { DraftSummary } from "@/components/DraftSummary";
import { ThemeDrilldown } from "@/components/ThemeDrilldown";
import { mockFeedback, mockThemes, mockSummary } from "@/data/mockData";
import { ScrollArea } from "@/components/ui/scroll-area";
import { supabase } from "@/integrations/supabase/client";
import { Feedback } from "@/data/types";

export default function Dashboard() {
  const [activeTheme, setActiveTheme] = useState<string | null>(null);
  const [leftPanelOpen, setLeftPanelOpen] = useState(true);
  const [supabaseFeedback, setSupabaseFeedback] = useState<Feedback[]>([]);
  const [dialogOpen, setDialogOpen] = useState(false);

  const fetchFeedback = useCallback(async () => {
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

  const overallSentiment = useMemo(() => {
    if (!allFeedback.length) return 0;
    const total = allFeedback.reduce((sum, f) => sum + f.sentiment, 0);
    return total / allFeedback.length;
  }, [allFeedback]);

  const sortedFeedback = useMemo(() => {
    if (!highlightedFeedbackIds.length) return allFeedback;
    return [
      ...allFeedback.filter((f) => highlightedFeedbackIds.includes(f.id)),
      ...allFeedback.filter((f) => !highlightedFeedbackIds.includes(f.id)),
    ];
  }, [highlightedFeedbackIds, allFeedback]);

  const handleSubmitSuccess = useCallback(() => {
    fetchFeedback();
    setDialogOpen(false);
  }, [fetchFeedback]);

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b bg-card px-6 py-4">
        <div className="flex items-center justify-between max-w-[1600px] mx-auto">
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
            <span>{allFeedback.length} responses analyzed</span>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-[1600px] mx-auto p-6">
        <div className={`grid grid-cols-1 gap-6 h-[calc(100vh-120px)] transition-all duration-500 ${
          leftPanelOpen 
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
                <ScrollArea className="h-[600px] p-3">
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

            {/* Sentiment Sparkline */}
            <div className="rounded-xl border bg-card p-5">
              <h2 className="text-sm font-medium text-foreground mb-4">
                Sentiment Trend
              </h2>
              <SentimentSparkline feedback={allFeedback} />
            </div>

            {/* Stats Row */}
            <div className="grid grid-cols-3 gap-3">
              {[
                { label: "Themes Found", value: mockThemes.length, suffix: "" },
                { label: "Avg. Confidence", value: Math.round(mockThemes.reduce((s, t) => s + t.confidence, 0) / mockThemes.length), suffix: "%" },
                { label: "Negative Signals", value: allFeedback.filter(f => f.sentiment < -0.2).length, suffix: "" },
              ].map((stat) => (
                <div
                  key={stat.label}
                  className="rounded-xl border bg-card p-4 text-center"
                >
                  <p className="text-2xl font-semibold text-foreground">
                    <AnimatedCounter value={stat.value} suffix={stat.suffix} />
                  </p>
                  <p className="text-xs text-muted-foreground mt-1">
                    {stat.label}
                  </p>
                </div>
              ))}
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
