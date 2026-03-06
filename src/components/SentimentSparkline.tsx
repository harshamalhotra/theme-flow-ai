import { useMemo } from "react";
import { motion } from "framer-motion";
import { Area, AreaChart, ResponsiveContainer, Tooltip, XAxis, YAxis, ReferenceLine } from "recharts";
import { Feedback } from "@/data/types";
import { TrendingUp, TrendingDown, Minus, Lightbulb } from "lucide-react";

interface SentimentSparklineProps {
  feedback: Feedback[];
}

export function SentimentSparkline({ feedback }: SentimentSparklineProps) {
  const chartData = useMemo(() => {
    // Group feedback by date and compute daily average sentiment
    const byDate: Record<string, { sum: number; count: number }> = {};

    feedback.forEach((fb) => {
      const date = fb.date;
      if (!byDate[date]) byDate[date] = { sum: 0, count: 0 };
      byDate[date].sum += fb.sentiment;
      byDate[date].count += 1;
    });

    return Object.entries(byDate)
      .map(([date, { sum, count }]) => ({
        date,
        sentiment: Math.round((sum / count) * 100),
        count,
      }))
      .sort((a, b) => a.date.localeCompare(b.date));
  }, [feedback]);

  const currentSentiment = chartData.length
    ? chartData[chartData.length - 1].sentiment
    : 0;

  const trend = chartData.length >= 2
    ? chartData[chartData.length - 1].sentiment - chartData[chartData.length - 2].sentiment
    : 0;

  // Compute overall trend across all days
  const overallTrend = chartData.length >= 2
    ? chartData[chartData.length - 1].sentiment - chartData[0].sentiment
    : 0;

  const volatility = useMemo(() => {
    if (chartData.length < 2) return 0;
    let swings = 0;
    for (let i = 1; i < chartData.length; i++) {
      swings += Math.abs(chartData[i].sentiment - chartData[i - 1].sentiment);
    }
    return Math.round(swings / (chartData.length - 1));
  }, [chartData]);

  const trendSummary = useMemo(() => {
    if (chartData.length < 2) return { text: "Not enough data to determine trend.", reasons: [] };

    const isImproving = overallTrend > 5;
    const isDeclining = overallTrend < -5;
    const isVolatile = volatility > 20;
    const mostNegDay = chartData.reduce((min, d) => d.sentiment < min.sentiment ? d : min, chartData[0]);
    const mostPosDay = chartData.reduce((max, d) => d.sentiment > max.sentiment ? d : max, chartData[0]);

    let text = "";
    const reasons: string[] = [];

    if (isImproving) {
      text = `Sentiment improved by ${overallTrend} pts over ${chartData.length} days, ending at ${currentSentiment > 0 ? "+" : ""}${currentSentiment}.`;
      reasons.push("Recent feedback may reflect improvements in product experience or resolved pain points.");
      if (isVolatile) reasons.push("High day-to-day swings suggest mixed reactions — some users are happy while others still face issues.");
    } else if (isDeclining) {
      text = `Sentiment dropped by ${Math.abs(overallTrend)} pts over ${chartData.length} days, ending at ${currentSentiment > 0 ? "+" : ""}${currentSentiment}.`;
      reasons.push("Increasing negative feedback could indicate a regression, confusing UX change, or unmet expectations.");
      if (mostNegDay.count > 1) reasons.push(`Worst day (${mostNegDay.date.split("-").slice(1).join("/")}) had ${mostNegDay.count} responses — possible incident or release impact.`);
    } else {
      text = `Sentiment is relatively stable around ${currentSentiment > 0 ? "+" : ""}${currentSentiment} over ${chartData.length} days.`;
      reasons.push("Consistent sentiment suggests no major changes in user perception.");
      if (isVolatile) reasons.push("Despite stability overall, daily fluctuations suggest polarized feedback from different user segments.");
    }

    if (mostPosDay.sentiment > 30 && mostNegDay.sentiment < -30) {
      reasons.push("Wide sentiment range across days may indicate feature-specific reactions worth investigating per theme.");
    }

    return { text, reasons };
  }, [chartData, overallTrend, volatility, currentSentiment]);

  return (
    <div className="space-y-3">
      {/* Summary row */}
      <div className="flex items-center justify-between">
        <div>
          <motion.span
            key={currentSentiment}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-2xl font-bold text-foreground"
          >
            {currentSentiment > 0 ? "+" : ""}{currentSentiment}
          </motion.span>
          <span className="text-xs text-muted-foreground ml-1.5">/ 100</span>
        </div>
        <div className="text-right">
          <span className={`text-xs font-medium px-2 py-0.5 rounded-md ${
            trend > 0
              ? "bg-sentiment-positive/15 text-sentiment-positive"
              : trend < 0
              ? "bg-sentiment-negative/15 text-sentiment-negative"
              : "bg-sentiment-neutral/15 text-sentiment-neutral"
          }`}>
            {trend > 0 ? "↑" : trend < 0 ? "↓" : "→"} {Math.abs(trend)} pts
          </span>
          <p className="text-[10px] text-muted-foreground mt-1">vs previous day</p>
        </div>
      </div>

      {/* Sparkline chart */}
      <div className="h-[100px] w-full">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={chartData} margin={{ top: 4, right: 4, bottom: 0, left: -20 }}>
            <defs>
              <linearGradient id="sentimentGradient" x1="0" y1="0" x2="0" y2="1">
                <stop
                  offset="0%"
                  stopColor={currentSentiment >= 0 ? "hsl(var(--sentiment-positive))" : "hsl(var(--sentiment-negative))"}
                  stopOpacity={0.3}
                />
                <stop
                  offset="100%"
                  stopColor={currentSentiment >= 0 ? "hsl(var(--sentiment-positive))" : "hsl(var(--sentiment-negative))"}
                  stopOpacity={0.02}
                />
              </linearGradient>
            </defs>
            <XAxis
              dataKey="date"
              tick={{ fontSize: 10, fill: "hsl(var(--muted-foreground))" }}
              tickLine={false}
              axisLine={false}
              tickFormatter={(d: string) => {
                const parts = d.split("-");
                return `${parts[1]}/${parts[2]}`;
              }}
            />
            <YAxis
              domain={[-100, 100]}
              tick={{ fontSize: 10, fill: "hsl(var(--muted-foreground))" }}
              tickLine={false}
              axisLine={false}
              tickCount={3}
            />
            <ReferenceLine y={0} stroke="hsl(var(--border))" strokeDasharray="3 3" />
            <Tooltip
              contentStyle={{
                backgroundColor: "hsl(var(--card))",
                border: "1px solid hsl(var(--border))",
                borderRadius: "8px",
                fontSize: "12px",
                color: "hsl(var(--foreground))",
              }}
              formatter={(value: number) => [`${value > 0 ? "+" : ""}${value}`, "Sentiment"]}
              labelFormatter={(label: string) => {
                const parts = label.split("-");
                return `${parts[1]}/${parts[2]}/${parts[0]}`;
              }}
            />
            <Area
              type="monotone"
              dataKey="sentiment"
              stroke={currentSentiment >= 0 ? "hsl(var(--sentiment-positive))" : "hsl(var(--sentiment-negative))"}
              strokeWidth={2}
              fill="url(#sentimentGradient)"
              dot={{ r: 3, fill: "hsl(var(--card))", strokeWidth: 2 }}
              activeDot={{ r: 5, strokeWidth: 2 }}
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>

      {/* Legend */}
      <div className="flex items-center justify-between text-[10px] text-muted-foreground">
        <span>{chartData.length} day{chartData.length !== 1 ? "s" : ""} of data</span>
        <span>
          {currentSentiment > 10
            ? "Leaning Positive"
            : currentSentiment < -10
            ? "Leaning Negative"
            : "Neutral"}
        </span>
      </div>

      {/* Trend Summary */}
      <motion.div
        initial={{ opacity: 0, y: 6 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="mt-1 rounded-lg border bg-muted/30 p-3 space-y-2"
      >
        <div className="flex items-start gap-2">
          {overallTrend > 5 ? (
            <TrendingUp size={14} className="text-sentiment-positive mt-0.5 shrink-0" />
          ) : overallTrend < -5 ? (
            <TrendingDown size={14} className="text-sentiment-negative mt-0.5 shrink-0" />
          ) : (
            <Minus size={14} className="text-sentiment-neutral mt-0.5 shrink-0" />
          )}
          <p className="text-xs text-foreground leading-relaxed">{trendSummary.text}</p>
        </div>
        {trendSummary.reasons.length > 0 && (
          <div className="space-y-1.5 pl-1">
            {trendSummary.reasons.map((reason, i) => (
              <div key={i} className="flex items-start gap-2">
                <Lightbulb size={11} className="text-primary mt-0.5 shrink-0" />
                <p className="text-[11px] text-muted-foreground leading-relaxed">{reason}</p>
              </div>
            ))}
          </div>
        )}
      </motion.div>
    </div>
  );
}
