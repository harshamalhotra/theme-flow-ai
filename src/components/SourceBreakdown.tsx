import { useMemo, useState } from "react";
import { PieChart, Pie, Cell, ResponsiveContainer, Sector } from "recharts";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import { Feedback } from "@/data/types";

interface SourceBreakdownProps {
  feedback: Feedback[];
  onSourceFilter: (source: string | null) => void;
  activeSource: string | null;
}

const COLORS = [
  "hsl(var(--chart-1))",
  "hsl(var(--chart-2))",
  "hsl(var(--chart-3))",
  "hsl(var(--chart-4))",
  "hsl(var(--chart-5))",
];

// Custom active shape for hover effect
const renderActiveShape = (props: any) => {
  const { cx, cy, innerRadius, outerRadius, startAngle, endAngle, fill, payload, percent } = props;
  return (
    <g>
      <text x={cx} y={cy - 8} textAnchor="middle" className="fill-foreground text-sm font-semibold">
        {payload.name}
      </text>
      <text x={cx} y={cy + 12} textAnchor="middle" className="fill-muted-foreground text-xs">
        {`${(percent * 100).toFixed(0)}%`}
      </text>
      <Sector
        cx={cx}
        cy={cy}
        innerRadius={innerRadius}
        outerRadius={outerRadius + 6}
        startAngle={startAngle}
        endAngle={endAngle}
        fill={fill}
        strokeWidth={0}
      />
    </g>
  );
};

export function SourceBreakdown({ feedback, onSourceFilter, activeSource }: SourceBreakdownProps) {
  const [hoverIndex, setHoverIndex] = useState<number>(-1);

  const data = useMemo(() => {
    const counts: Record<string, number> = {};
    feedback.forEach((f) => {
      const source = f.source.replace(/ #\d+$/, ""); // normalize "User Interview #14" → "User Interview"
      counts[source] = (counts[source] || 0) + 1;
    });
    return Object.entries(counts)
      .map(([name, value]) => ({ name, value }))
      .sort((a, b) => b.value - a.value);
  }, [feedback]);

  const handleClick = (entry: { name: string }) => {
    onSourceFilter(activeSource === entry.name ? null : entry.name);
  };

  return (
    <div className="flex items-center gap-4">
      {/* Donut */}
      <div className="w-[140px] h-[140px] shrink-0">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={data}
              cx="50%"
              cy="50%"
              innerRadius={38}
              outerRadius={60}
              paddingAngle={3}
              dataKey="value"
              activeIndex={hoverIndex}
              activeShape={renderActiveShape}
              onMouseEnter={(_, index) => setHoverIndex(index)}
              onMouseLeave={() => setHoverIndex(-1)}
              onClick={(_, index) => handleClick(data[index])}
              className="cursor-pointer outline-none"
              stroke="none"
            >
              {data.map((entry, index) => (
                <Cell
                  key={entry.name}
                  fill={COLORS[index % COLORS.length]}
                  opacity={activeSource && activeSource !== entry.name ? 0.3 : 1}
                />
              ))}
            </Pie>
          </PieChart>
        </ResponsiveContainer>
      </div>

      {/* Legend */}
      <div className="flex flex-col gap-1.5 min-w-0 flex-1">
        {data.map((entry, index) => (
          <motion.button
            key={entry.name}
            initial={{ opacity: 0, x: 8 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: index * 0.05 }}
            onClick={() => handleClick(entry)}
            className={cn(
              "flex items-center gap-2 px-2 py-1 rounded-md text-left transition-all",
              "hover:bg-muted",
              activeSource === entry.name && "bg-accent ring-1 ring-primary/20",
              activeSource && activeSource !== entry.name && "opacity-40"
            )}
          >
            <span
              className="h-2.5 w-2.5 rounded-full shrink-0"
              style={{ backgroundColor: COLORS[index % COLORS.length] }}
            />
            <span className="text-xs text-foreground truncate flex-1">{entry.name}</span>
            <span className="text-[10px] text-muted-foreground font-medium">{entry.value}</span>
          </motion.button>
        ))}
        {activeSource && (
          <button
            onClick={() => onSourceFilter(null)}
            className="text-[10px] text-primary hover:underline mt-1 text-left px-2"
          >
            Clear filter
          </button>
        )}
      </div>
    </div>
  );
}
