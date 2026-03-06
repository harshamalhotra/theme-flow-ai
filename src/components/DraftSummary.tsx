import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FileText, Copy, Check } from "lucide-react";
import { Button } from "@/components/ui/button";

interface DraftSummaryProps {
  summary: string;
}

export function DraftSummary({ summary }: DraftSummaryProps) {
  const [isGenerated, setIsGenerated] = useState(false);
  const [copied, setCopied] = useState(false);

  const handleGenerate = () => {
    setIsGenerated(true);
  };

  const handleCopy = async () => {
    await navigator.clipboard.writeText(summary);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="space-y-3">
      {!isGenerated ? (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="flex flex-col items-center justify-center py-8 text-center"
        >
          <div className="h-12 w-12 rounded-xl bg-accent flex items-center justify-center mb-3">
            <FileText size={20} className="text-accent-foreground" />
          </div>
          <p className="text-sm text-muted-foreground mb-4 max-w-[200px]">
            Generate an executive summary from all analyzed feedback
          </p>
          <Button onClick={handleGenerate} size="sm">
            Draft Report
          </Button>
        </motion.div>
      ) : (
        <AnimatePresence>
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
            className="space-y-3"
          >
            <div className="rounded-lg bg-surface-sunken p-4 text-sm leading-relaxed text-card-foreground whitespace-pre-line">
              {summary}
            </div>
            <div className="flex gap-2">
              <Button
                variant="outline"
                size="sm"
                className="flex-1 text-xs"
                onClick={handleCopy}
              >
                {copied ? (
                  <>
                    <Check size={14} className="mr-1" /> Copied
                  </>
                ) : (
                  <>
                    <Copy size={14} className="mr-1" /> Copy to Clipboard
                  </>
                )}
              </Button>
            </div>
            <p className="text-[10px] text-muted-foreground text-center">
              Slack-ready · Generated from {8} feedback items
            </p>
          </motion.div>
        </AnimatePresence>
      )}
    </div>
  );
}
