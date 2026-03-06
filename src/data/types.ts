export interface Feedback {
  id: string;
  text: string;
  source: string;
  date: string;
  sentiment: number; // -1 to 1
  themes: string[];
}

export interface Theme {
  id: string;
  label: string;
  count: number;
  confidence: number; // 0-100
  sentiment: number; // -1 to 1
  feedbackIds: string[];
}
