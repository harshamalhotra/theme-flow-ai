import { useMemo } from "react";
import { motion } from "framer-motion";
import { Area, AreaChart, ResponsiveContainer, Tooltip, XAxis, YAxis, ReferenceLine } from "recharts";
import { Feedback } from "@/data/types";
import { TrendingUp, TrendingDown, Minus, Lightbulb } from "lucide-react";
import { Feedback } from "@/data/types";

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
    </div>
  );
}
