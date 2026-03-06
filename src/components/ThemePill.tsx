import { motion } from "framer-motion";
import { Info } from "lucide-react";
import { cn } from "@/lib/utils";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";

interface ThemePillProps {
  label: string;
  count: number;
  confidence: number;
  isActive: boolean;
  sentiment: number;
  onClick: () => void;
}

export function ThemePill({
  label,
  count,
  confidence,
  isActive,
  sentiment,
  onClick,
}: ThemePillProps) {
  return (
    <motion.button
      whileHover={{ scale: 1.03 }}
      whileTap={{ scale: 0.97 }}
      onClick={onClick}
      className={cn(
        "inline-flex items-center gap-2 rounded-lg px-3.5 py-2 text-sm font-medium transition-colors border",
        isActive
          ? "bg-primary text-primary-foreground border-primary shadow-sm"
          : "bg-pill text-pill-foreground border-transparent hover:bg-pill-hover"
      )}
    >
      <span
        className={cn(
          "h-1.5 w-1.5 rounded-full",
          sentiment > 0.2
            ? "bg-sentiment-positive"
            : sentiment < -0.2
            ? "bg-sentiment-negative"
            : "bg-sentiment-neutral"
        )}
      />
      <span>{label}</span>
      <Tooltip>
        <TooltipTrigger asChild>
          <span
            className={cn(
              "text-xs px-1.5 py-0.5 rounded-md cursor-help",
              isActive
                ? "bg-primary-foreground/20 text-primary-foreground"
                : "bg-background text-muted-foreground"
            )}
          >
            {count} mentions
          </span>
        </TooltipTrigger>
        <TooltipContent side="top" className="text-xs">
          This theme was found in <span className="font-semibold">{count}</span> feedback {count !== 1 ? "entries" : "entry"}
        </TooltipContent>
      </Tooltip>
      <Tooltip>
        <TooltipTrigger asChild>
          <span className="ml-0.5 cursor-help">
            <Info
              size={13}
              className={cn(
                isActive
                  ? "text-primary-foreground/60"
                  : "text-muted-foreground/60"
              )}
            />
          </span>
        </TooltipTrigger>
        <TooltipContent side="top" className="text-xs">
          <span className="font-semibold">{confidence}%</span> confidence
          <span className="text-muted-foreground ml-1">
            · {count} mention{count !== 1 ? "s" : ""}
          </span>
        </TooltipContent>
      </Tooltip>
    </motion.button>
  );
}
