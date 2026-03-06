import { useState, useMemo, useEffect } from "react";
import { Search, X, SlidersHorizontal } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Slider } from "@/components/ui/slider";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Feedback } from "@/data/types";

interface FeedbackFiltersProps {
  feedback: Feedback[];
  onFilteredChange: (filtered: Feedback[]) => void;
}

export function FeedbackFilters({ feedback, onFilteredChange }: FeedbackFiltersProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [sourceFilter, setSourceFilter] = useState<string>("all");
  const [sentimentRange, setSentimentRange] = useState<[number, number]>([-100, 100]);
  const [filtersOpen, setFiltersOpen] = useState(false);

  const sources = useMemo(() => {
    const unique = [...new Set(feedback.map((f) => f.source))];
    return unique.sort();
  }, [feedback]);

  const activeFilterCount = useMemo(() => {
    let count = 0;
    if (searchQuery) count++;
    if (sourceFilter !== "all") count++;
    if (sentimentRange[0] !== -100 || sentimentRange[1] !== 100) count++;
    return count;
  }, [searchQuery, sourceFilter, sentimentRange]);

  const filtered = useMemo(() => {
    let result = feedback;

    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      result = result.filter(
        (f) =>
          f.text.toLowerCase().includes(q) ||
          f.source.toLowerCase().includes(q) ||
          f.themes.some((t) => t.toLowerCase().includes(q))
      );
    }

    if (sourceFilter !== "all") {
      result = result.filter((f) => f.source === sourceFilter);
    }

    result = result.filter((f) => {
      const score = f.sentiment * 100;
      return score >= sentimentRange[0] && score <= sentimentRange[1];
    });

    return result;
  }, [feedback, searchQuery, sourceFilter, sentimentRange]);

  useEffect(() => {
    onFilteredChange(filtered);
  }, [filtered]);

  const clearFilters = () => {
    setSearchQuery("");
    setSourceFilter("all");
    setSentimentRange([-100, 100]);
  };

  return (
    <div className="space-y-2">
      {/* Search bar */}
      <div className="relative">
        <Search size={13} className="absolute left-2.5 top-1/2 -translate-y-1/2 text-muted-foreground" />
        <Input
          placeholder="Search feedback..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="h-8 pl-8 pr-8 text-xs"
        />
        {searchQuery && (
          <button
            onClick={() => setSearchQuery("")}
            className="absolute right-2.5 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
          >
            <X size={13} />
          </button>
        )}
      </div>

      {/* Filter row */}
      <div className="flex items-center gap-2">
        <Popover open={filtersOpen} onOpenChange={setFiltersOpen}>
          <PopoverTrigger asChild>
            <Button variant="outline" size="sm" className="h-7 text-[11px] gap-1.5">
              <SlidersHorizontal size={12} />
              Filters
              {activeFilterCount > 0 && (
                <Badge variant="secondary" className="h-4 w-4 p-0 flex items-center justify-center text-[9px]">
                  {activeFilterCount}
                </Badge>
              )}
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-[260px] p-3 space-y-4" align="start">
            {/* Source filter */}
            <div className="space-y-1.5">
              <Label className="text-[11px] text-muted-foreground">Source</Label>
              <Select value={sourceFilter} onValueChange={setSourceFilter}>
                <SelectTrigger className="h-7 text-xs">
                  <SelectValue placeholder="All sources" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All sources</SelectItem>
                  {sources.map((s) => (
                    <SelectItem key={s} value={s}>
                      {s}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Sentiment range */}
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label className="text-[11px] text-muted-foreground">Sentiment Range</Label>
                <span className="text-[10px] text-muted-foreground">
                  {sentimentRange[0]} to {sentimentRange[1]}
                </span>
              </div>
              <Slider
                min={-100}
                max={100}
                step={5}
                value={sentimentRange}
                onValueChange={(v) => setSentimentRange(v as [number, number])}
                className="py-1"
              />
              <div className="flex justify-between text-[9px] text-muted-foreground">
                <span>Negative</span>
                <span>Positive</span>
              </div>
            </div>
          </PopoverContent>
        </Popover>

        {activeFilterCount > 0 && (
          <Button
            variant="ghost"
            size="sm"
            onClick={clearFilters}
            className="h-7 text-[11px] text-muted-foreground hover:text-foreground gap-1"
          >
            <X size={12} />
            Clear
          </Button>
        )}

        <span className="ml-auto text-[10px] text-muted-foreground">
          {filtered.length} of {feedback.length}
        </span>
      </div>
    </div>
  );
}
