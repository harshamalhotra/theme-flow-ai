import { useMemo, useState } from "react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import { Feedback } from "@/data/types";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { TrendingUp, TrendingDown, Minus, Lightbulb } from "lucide-react";

interface SentimentHeatmapProps {
  feedback: Feedback[];
}

const WEEKS_TO_SHOW = 12;
const DAY_LABELS = ["", "Mon", "", "Wed", "", "Fri", ""];
const MONTH_NAMES = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

function getSentimentColor(sentiment: number | null): string {
  if (sentiment === null) return "bg-muted/40";
  if (sentiment > 40) return "bg-sentiment-positive";
  if (sentiment > 15) return "bg-sentiment-positive/60";
  if (sentiment > -15) return "bg-sentiment-neutral/70";
  if (sentiment > -40) return "bg-sentiment-negative/60";
  return "bg-sentiment-negative";
}

function getSentimentLabel(sentiment: number | null): string {
  if (sentiment === null) return "No data";
  if (sentiment > 40) return "Very Positive";
  if (sentiment > 15) return "Positive";
  if (sentiment > -15) return "Neutral";
  if (sentiment > -40) return "Negative";
  return "Very Negative";
}

interface DayData {
  date: string;
  sentiment: number | null;
  count: number;
  dayOfWeek: number;
  weekIndex: number;
}

export function SentimentHeatmap({ feedback }: SentimentHeatmapProps) {
  const [hoveredDay, setHoveredDay] = useState<DayData | null>(null);

  const { grid, monthLabels, stats } = useMemo(() => {
    // Build daily sentiment map
    const byDate: Record<string, { sum: number; count: number }> = {};
    feedback.forEach((fb) => {
      if (!byDate[fb.date]) byDate[fb.date] = { sum: 0, count: 0 };
      byDate[fb.date].sum += fb.sentiment;
      byDate[fb.date].count += 1;
    });

    // Generate grid for the last N weeks
    const today = new Date();
    const todayDow = today.getDay(); // 0=Sun
    // Start from the beginning of the week, WEEKS_TO_SHOW weeks ago
    const startDate = new Date(today);
    startDate.setDate(today.getDate() - todayDow - (WEEKS_TO_SHOW - 1) * 7);

    const days: DayData[] = [];
    const months: { label: string; weekIndex: number }[] = [];
    let lastMonth = -1;

    for (let w = 0; w < WEEKS_TO_SHOW; w++) {
      for (let d = 0; d < 7; d++) {
        const current = new Date(startDate);
        current.setDate(startDate.getDate() + w * 7 + d);

        if (current > today) {
          days.push({ date: "", sentiment: null, count: 0, dayOfWeek: d, weekIndex: w });
          continue;
        }

        const dateStr = current.toISOString().split("T")[0];
        const entry = byDate[dateStr];
        const sentiment = entry ? Math.round((entry.sum / entry.count) * 100) : null;

        days.push({
          date: dateStr,
          sentiment,
          count: entry?.count || 0,
          dayOfWeek: d,
          weekIndex: w,
        });

        // Track month transitions
        const month = current.getMonth();
        if (month !== lastMonth) {
          months.push({ label: MONTH_NAMES[month], weekIndex: w });
          lastMonth = month;
        }
      }
    }

    // Stats
    const activeDays = days.filter((d) => d.sentiment !== null);
    const positiveDays = activeDays.filter((d) => d.sentiment! > 15).length;
    const negativeDays = activeDays.filter((d) => d.sentiment! < -15).length;
    const avgSentiment = activeDays.length
      ? Math.round(activeDays.reduce((s, d) => s + d.sentiment!, 0) / activeDays.length)
      : 0;

    // Trend analysis
    const sortedActive = [...activeDays].sort((a, b) => a.date.localeCompare(b.date));
    const recentHalf = sortedActive.slice(Math.floor(sortedActive.length / 2));
    const olderHalf = sortedActive.slice(0, Math.floor(sortedActive.length / 2));
    const recentAvg = recentHalf.length
      ? Math.round(recentHalf.reduce((s, d) => s + d.sentiment!, 0) / recentHalf.length)
      : 0;
    const olderAvg = olderHalf.length
      ? Math.round(olderHalf.reduce((s, d) => s + d.sentiment!, 0) / olderHalf.length)
      : 0;
    const trendDelta = recentAvg - olderAvg;

    const worstDay = activeDays.length
      ? activeDays.reduce((min, d) => (d.sentiment! < min.sentiment! ? d : min), activeDays[0])
      : null;
    const bestDay = activeDays.length
      ? activeDays.reduce((max, d) => (d.sentiment! > max.sentiment! ? d : max), activeDays[0])
      : null;

    // Streaks
    let currentStreak = 0;
    let streakType: "positive" | "negative" | null = null;
    for (let i = sortedActive.length - 1; i >= 0; i--) {
      const s = sortedActive[i].sentiment!;
      const type = s > 15 ? "positive" : s < -15 ? "negative" : null;
      if (i === sortedActive.length - 1) {
        if (type) { streakType = type; currentStreak = 1; } else break;
      } else if (type === streakType) {
        currentStreak++;
      } else break;
    }

    return {
      grid: days,
      monthLabels: months,
      stats: {
        positiveDays, negativeDays, totalDays: activeDays.length, avgSentiment,
        trendDelta, recentAvg, olderAvg, worstDay, bestDay, currentStreak, streakType,
      },
    };
  }, [feedback]);

  // Group into weeks for rendering
  const weeks = useMemo(() => {
    const w: DayData[][] = [];
    for (let i = 0; i < WEEKS_TO_SHOW; i++) {
      w.push(grid.filter((d) => d.weekIndex === i));
    }
    return w;
  }, [grid]);

  return (
    <div className="space-y-3">
      {/* Stats summary */}
      <div className="flex items-center justify-between">
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <span className="text-2xl font-bold text-foreground">
            {stats.avgSentiment > 0 ? "+" : ""}{stats.avgSentiment}
          </span>
          <span className="text-xs text-muted-foreground ml-1.5">avg / 100</span>
        </motion.div>
        <div className="flex items-center gap-3 text-[10px] text-muted-foreground">
          <span className="flex items-center gap-1">
            <span className="h-2 w-2 rounded-sm bg-sentiment-positive" />
            {stats.positiveDays} positive
          </span>
          <span className="flex items-center gap-1">
            <span className="h-2 w-2 rounded-sm bg-sentiment-negative" />
            {stats.negativeDays} negative
          </span>
        </div>
      </div>

      {/* Heatmap grid */}
      <div className="overflow-x-auto">
        <div className="inline-flex flex-col gap-0.5 min-w-fit">
          {/* Month labels */}
          <div className="flex ml-7 mb-1">
            {monthLabels.map((m, i) => (
              <span
                key={`${m.label}-${i}`}
                className="text-[9px] text-muted-foreground"
                style={{
                  position: "relative",
                  left: `${m.weekIndex * 14}px`,
                  marginRight: i < monthLabels.length - 1
                    ? `${(monthLabels[i + 1].weekIndex - m.weekIndex) * 14 - 24}px`
                    : 0,
                }}
              >
                {m.label}
              </span>
            ))}
          </div>

          {/* Grid rows (days of week) */}
          {[0, 1, 2, 3, 4, 5, 6].map((dayIndex) => (
            <div key={dayIndex} className="flex items-center gap-0.5">
              <span className="text-[9px] text-muted-foreground w-6 text-right pr-1 shrink-0">
                {DAY_LABELS[dayIndex]}
              </span>
              {weeks.map((week, weekIndex) => {
                const day = week.find((d) => d.dayOfWeek === dayIndex);
                if (!day || !day.date) {
                  return (
                    <div
                      key={`empty-${weekIndex}`}
                      className="h-[12px] w-[12px] rounded-[2px] bg-transparent"
                    />
                  );
                }

                return (
                  <Tooltip key={day.date}>
                    <TooltipTrigger asChild>
                      <motion.div
                        initial={{ opacity: 0, scale: 0.5 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: weekIndex * 0.02 + dayIndex * 0.01 }}
                        className={cn(
                          "h-[12px] w-[12px] rounded-[2px] cursor-pointer transition-all duration-150",
                          getSentimentColor(day.sentiment),
                          hoveredDay?.date === day.date && "ring-1 ring-foreground/30 scale-125"
                        )}
                        onMouseEnter={() => setHoveredDay(day)}
                        onMouseLeave={() => setHoveredDay(null)}
                      />
                    </TooltipTrigger>
                    <TooltipContent
                      side="top"
                      className="text-xs p-2 space-y-0.5"
                    >
                      <p className="font-medium text-foreground">
                        {day.sentiment !== null
                          ? `${day.sentiment > 0 ? "+" : ""}${day.sentiment} — ${getSentimentLabel(day.sentiment)}`
                          : "No feedback"}
                      </p>
                      <p className="text-muted-foreground">
                        {new Date(day.date + "T12:00:00").toLocaleDateString("en-US", {
                          weekday: "short",
                          month: "short",
                          day: "numeric",
                        })}
                        {day.count > 0 && ` · ${day.count} response${day.count > 1 ? "s" : ""}`}
                      </p>
                    </TooltipContent>
                  </Tooltip>
                );
              })}
            </div>
          ))}
        </div>
      </div>

      {/* Legend */}
      <div className="flex items-center justify-between text-[10px] text-muted-foreground">
        <span>{stats.totalDays} day{stats.totalDays !== 1 ? "s" : ""} with data</span>
        <div className="flex items-center gap-1">
          <span>Negative</span>
          <div className="flex gap-0.5">
            <span className="h-[10px] w-[10px] rounded-[2px] bg-sentiment-negative" />
            <span className="h-[10px] w-[10px] rounded-[2px] bg-sentiment-negative/60" />
            <span className="h-[10px] w-[10px] rounded-[2px] bg-sentiment-neutral/70" />
            <span className="h-[10px] w-[10px] rounded-[2px] bg-sentiment-positive/60" />
            <span className="h-[10px] w-[10px] rounded-[2px] bg-sentiment-positive" />
          </div>
          <span>Positive</span>
        </div>
      </div>
    </div>
  );
}
