# From Feedback Chaos to Clarity in 30 Seconds: How I Built Pulse AI

*A product case study on turning unstructured user feedback into actionable insights — without waiting for a data team.*

---

## The Problem Nobody Talks About

Every product team collects feedback. Surveys, support tickets, user interviews, usability tests — the data pours in from everywhere. But here's the dirty secret: **most of it sits unread.**

Not because teams don't care. Because synthesizing qualitative data is brutal. You're staring at 50+ open-ended responses, trying to spot patterns, gauge severity, and figure out what to fix first. It takes hours. Sometimes days. By the time you've distilled it, the next sprint is already planned.

I wanted to build a tool that collapses that timeline from hours to seconds.

---

## What I Built

**Pulse AI** is a sentiment analysis and feedback synthesis dashboard. You feed it raw user feedback, and it gives you:

- **Detected themes** with confidence scores (e.g., "Navigation Friction" — 94% confidence, mentioned 3 times)
- **Per-entry sentiment scoring** on a -1 to +1 scale
- **A GitHub-style sentiment heatmap** showing daily sentiment averages over 12 weeks
- **Pivotable stat cards** — click "Negative Signals" and instantly see only the pain points, sorted by severity
- **Source channel breakdowns** — understand which feedback channels surface the most friction
- **One-click executive summaries** with PDF export

The core insight: **every AI-generated finding traces back to a source quote.** Click a theme, and the exact feedback entries light up. No black boxes.

---

## Design Decisions That Mattered

### 1. Traceability Over Magic

The biggest risk with AI-powered analysis tools is the "trust me" problem. Users see a summary and think: *"Where did this come from?"*

Every theme pill in Pulse AI is clickable. Select "Price Transparency" and the left panel immediately filters to show the 2 feedback entries that triggered it. The drilldown panel shows the exact quotes, sentiment breakdown, and suggested actions — all traceable.

### 2. Heatmap > Line Chart

I originally built a sparkline for sentiment trends. It worked, but it didn't *scan*. When I replaced it with a GitHub-style contribution heatmap, the pattern recognition became instant — you can spot a bad week at a glance without reading a single number.

I kept both views with a toggle, because different stakeholders prefer different visualizations.

### 3. Pivotable Stats

Static numbers are decoration. I made the "Themes Found" and "Negative Signals" stat cards interactive. Click either one and a detail panel expands below with the relevant data, sorted and filterable. This turned summary stats into navigation.

### 4. Collapsible Panels

Screen real estate is precious in a three-column layout. When you drill into a theme, the raw feedback panel auto-collapses to give the analysis more room. One click brings it back.

---

## The Technical Stack

- **React + TypeScript** — type-safe component architecture
- **Tailwind CSS** with a full semantic design token system (HSL-based, dark mode ready)
- **Framer Motion** — layout animations, panel transitions, counter animations
- **Recharts** — sparkline and area charts for sentiment trends
- **Supabase** — PostgreSQL backend with real-time sync for feedback storage
- **jsPDF** — client-side PDF generation for executive summary export
- **DM Sans** — typography that's clean without being generic

The design system uses semantic tokens throughout — `--sentiment-positive`, `--surface-sunken`, `--pill-bg` — so every component speaks the same visual language without hardcoded colors.

---

## What I Learned

**1. Qualitative data needs quantitative scaffolding.**
Sentiment scores, confidence percentages, and mention counts don't replace the quotes — they help you prioritize which quotes to read first.

**2. The best dashboards are navigable, not just readable.**
Every element should be a potential entry point. A stat card, a theme pill, a heatmap cell — they're all doors into the data.

**3. Mock data is a design tool.**
I built the entire UI against carefully crafted mock feedback before connecting the database. This let me iterate on the analysis UX without waiting for real data pipelines.

---

## What's Next

- **Real LLM integration** via Supabase Edge Functions for live theme extraction
- **CSV upload** for bulk feedback ingestion
- **Slack integration** for sharing summaries directly to channels
- **Historical trend comparison** across time periods
- **Multi-project support** for teams managing multiple products

---

## Try It

[Live Demo →](YOUR_PUBLISHED_URL)

If you're a PM or researcher drowning in unstructured feedback, I'd love to hear how you currently synthesize it. What takes the longest? What would you automate first?

---

*Built with React, TypeScript, Tailwind CSS, Framer Motion, Recharts, and Supabase.*
