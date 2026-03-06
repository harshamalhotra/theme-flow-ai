import { useState, useCallback } from "react";
import { Upload, FileText, Send, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

interface FeedbackSubmitFormProps {
  onSuccess?: () => void;
}

function parseCSV(text: string): { text: string; source: string; date: string }[] {
  const lines = text.trim().split("\n");
  if (lines.length < 2) return [];

  const header = lines[0].toLowerCase();
  const hasHeader = header.includes("text") || header.includes("feedback") || header.includes("source");
  const dataLines = hasHeader ? lines.slice(1) : lines;

  return dataLines
    .map((line) => {
      // Simple CSV parse — handles comma-separated values with optional quotes
      const parts = line.match(/(".*?"|[^",\s]+)(?=\s*,|\s*$)/g)?.map((p) =>
        p.replace(/^"|"$/g, "").trim()
      ) || [line.trim()];

      return {
        text: parts[0] || "",
        source: parts[1] || "CSV Upload",
        date: parts[2] || new Date().toISOString().split("T")[0],
      };
    })
    .filter((row) => row.text.length > 0);
}

export function FeedbackSubmitForm({ onSuccess }: FeedbackSubmitFormProps) {
  const [pasteText, setPasteText] = useState("");
  const [source, setSource] = useState("");
  const [csvFile, setCsvFile] = useState<File | null>(null);
  const [csvPreview, setCsvPreview] = useState<{ text: string; source: string; date: string }[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleFileChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setCsvFile(file);

    const reader = new FileReader();
    reader.onload = (event) => {
      const content = event.target?.result as string;
      const parsed = parseCSV(content);
      setCsvPreview(parsed.slice(0, 5)); // Preview first 5
    };
    reader.readAsText(file);
  }, []);

  const submitPaste = async () => {
    if (!pasteText.trim()) {
      toast.error("Please enter some feedback text");
      return;
    }

    setIsSubmitting(true);
    try {
      const { error } = await supabase.from("feedback").insert({
        text: pasteText.trim(),
        source: source.trim() || "Manual Entry",
        date: new Date().toISOString().split("T")[0],
      });

      if (error) throw error;
      toast.success("Feedback submitted successfully");
      setPasteText("");
      setSource("");
      onSuccess?.();
    } catch (err: any) {
      toast.error(err.message || "Failed to submit feedback");
    } finally {
      setIsSubmitting(false);
    }
  };

  const submitCSV = async () => {
    if (!csvFile) {
      toast.error("Please select a CSV file");
      return;
    }

    setIsSubmitting(true);
    try {
      const content = await csvFile.text();
      const rows = parseCSV(content);

      if (rows.length === 0) {
        toast.error("No valid rows found in CSV");
        return;
      }

      const { error } = await supabase.from("feedback").insert(
        rows.map((row) => ({
          text: row.text,
          source: row.source,
          date: row.date,
        }))
      );

      if (error) throw error;
      toast.success(`${rows.length} feedback entries uploaded`);
      setCsvFile(null);
      setCsvPreview([]);
      onSuccess?.();
    } catch (err: any) {
      toast.error(err.message || "Failed to upload CSV");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Tabs defaultValue="paste" className="w-full">
      <TabsList className="grid w-full grid-cols-2">
        <TabsTrigger value="paste" className="gap-1.5">
          <FileText size={14} />
          Paste Text
        </TabsTrigger>
        <TabsTrigger value="csv" className="gap-1.5">
          <Upload size={14} />
          Upload CSV
        </TabsTrigger>
      </TabsList>

      <TabsContent value="paste" className="space-y-4 mt-4">
        <div className="space-y-2">
          <Label htmlFor="feedback-text" className="text-sm text-foreground">
            Feedback Text
          </Label>
          <Textarea
            id="feedback-text"
            placeholder="Paste customer feedback here..."
            value={pasteText}
            onChange={(e) => setPasteText(e.target.value)}
            className="min-h-[120px] resize-none"
            maxLength={5000}
          />
          <p className="text-[10px] text-muted-foreground text-right">
            {pasteText.length}/5000
          </p>
        </div>
        <div className="space-y-2">
          <Label htmlFor="source" className="text-sm text-foreground">
            Source <span className="text-muted-foreground">(optional)</span>
          </Label>
          <Input
            id="source"
            placeholder="e.g. User Interview #5, Survey, Support Ticket"
            value={source}
            onChange={(e) => setSource(e.target.value)}
            maxLength={200}
          />
        </div>
        <Button
          onClick={submitPaste}
          disabled={isSubmitting || !pasteText.trim()}
          className="w-full gap-2"
        >
          {isSubmitting ? <Loader2 size={14} className="animate-spin" /> : <Send size={14} />}
          Submit Feedback
        </Button>
      </TabsContent>

      <TabsContent value="csv" className="space-y-4 mt-4">
        <div className="space-y-2">
          <Label className="text-sm text-foreground">CSV File</Label>
          <div className="border-2 border-dashed rounded-lg p-6 text-center hover:border-primary/50 transition-colors">
            <Upload size={24} className="mx-auto text-muted-foreground mb-2" />
            <p className="text-xs text-muted-foreground mb-2">
              Upload a CSV with columns: <span className="font-mono text-foreground">text, source, date</span>
            </p>
            <Input
              type="file"
              accept=".csv,.txt"
              onChange={handleFileChange}
              className="max-w-[240px] mx-auto text-xs"
            />
          </div>
        </div>

        {csvPreview.length > 0 && (
          <div className="space-y-2">
            <Label className="text-xs text-muted-foreground">
              Preview ({csvPreview.length} of {csvFile ? "..." : "0"} rows)
            </Label>
            <div className="space-y-1.5 max-h-[160px] overflow-auto">
              {csvPreview.map((row, i) => (
                <div
                  key={i}
                  className="rounded-md border bg-muted/30 p-2 text-xs text-foreground"
                >
                  <p className="line-clamp-2">"{row.text}"</p>
                  <p className="text-[10px] text-muted-foreground mt-1">
                    {row.source} · {row.date}
                  </p>
                </div>
              ))}
            </div>
          </div>
        )}

        <Button
          onClick={submitCSV}
          disabled={isSubmitting || !csvFile}
          className="w-full gap-2"
        >
          {isSubmitting ? <Loader2 size={14} className="animate-spin" /> : <Upload size={14} />}
          Upload Feedback
        </Button>
      </TabsContent>
    </Tabs>
  );
}
