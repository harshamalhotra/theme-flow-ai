import { useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Activity, MessageSquareText, Sparkles, FileOutput } from "lucide-react";
import { FeedbackCard } from "@/components/FeedbackCard";
import { ThemePill } from "@/components/ThemePill";
import { SentimentMeter } from "@/components/SentimentMeter";
import { DraftSummary } from "@/components/DraftSummary";
import { ThemeDrilldown } from "@/components/ThemeDrilldown";
import { mockFeedback, mockThemes, mockSummary } from "@/data/mockData";
import { ScrollArea } from "@/components/ui/scroll-area";

export default function Dashboard() {
  const [activeTheme, setActiveTheme] = useState<string | null>(null);

  const selectedTheme = mockThemes.find((t) => t.id === activeTheme);

  const highlightedFeedbackIds = selectedTheme?.feedbackIds || [];

  const overallSentiment = useMemo(() => {
    const total = mockFeedback.reduce((sum, f) => sum + f.sentiment, 0);
    return total / mockFeedback.length;
  }, []);

  const sortedFeedback = useMemo(() => {
    if (!highlightedFeedbackIds.length) return mockFeedback;
    return [
      ...mockFeedback.filter((f) => highlightedFeedbackIds.includes(f.id)),
      ...mockFeedback.filter((f) => !highlightedFeedbackIds.includes(f.id)),
    ];
  }, [highlightedFeedbackIds]);

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
          <div className="flex items-center gap-2 text-xs text-muted-foreground">
            <span className="h-2 w-2 rounded-full bg-sentiment-positive animate-pulse-glow" />
            <span>{mockFeedback.length} responses analyzed</span>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-[1600px] mx-auto p-6">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 h-[calc(100vh-120px)]">
          {/* Left Panel - Feedback Source */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.4 }}
            className="lg:col-span-4 flex flex-col rounded-xl border bg-card overflow-hidden"
          >
            <div className="px-4 py-3 border-b flex items-center gap-2">
              <MessageSquareText size={15} className="text-muted-foreground" />
              <h2 className="text-sm font-medium text-foreground">
                Raw Feedback
              </h2>
              <span className="ml-auto text-xs text-muted-foreground bg-muted px-2 py-0.5 rounded-md">
                {mockFeedback.length}
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

          {/* Center Panel - AI Insights */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.1 }}
            className="lg:col-span-5 flex flex-col gap-6"
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

            {/* Sentiment Meter */}
            <div className="rounded-xl border bg-card p-5">
              <h2 className="text-sm font-medium text-foreground mb-4">
                Sentiment Pulse
              </h2>
              <SentimentMeter value={overallSentiment} />
            </div>

            {/* Stats Row */}
            <div className="grid grid-cols-3 gap-3">
              {[
                { label: "Themes Found", value: mockThemes.length.toString(), color: "primary" },
                { label: "Avg. Confidence", value: `${Math.round(mockThemes.reduce((s, t) => s + t.confidence, 0) / mockThemes.length)}%`, color: "primary" },
                { label: "Negative Signals", value: mockFeedback.filter(f => f.sentiment < -0.2).length.toString(), color: "destructive" },
              ].map((stat) => (
                <div
                  key={stat.label}
                  className="rounded-xl border bg-card p-4 text-center"
                >
                  <p className="text-2xl font-semibold text-foreground">
                    {stat.value}
                  </p>
                  <p className="text-xs text-muted-foreground mt-1">
                    {stat.label}
                  </p>
                </div>
              ))}
            </div>
          </motion.div>

          {/* Right Panel - Draft Summary */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.4, delay: 0.2 }}
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
        </div>
      </main>
    </div>
  );
}
