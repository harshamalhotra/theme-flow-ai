# Pulse AI — Portfolio Entry

## Project Title
**Pulse AI: Sentiment Analysis & Feedback Synthesis Dashboard**

---

## One-Liner
Turn raw user feedback into actionable themes, sentiment trends, and stakeholder-ready summaries — in seconds, not hours.

---

## Role
Solo Designer & Developer — UI/UX design, frontend architecture, data visualization, design system

---

## Problem
Product teams collect qualitative feedback from surveys, interviews, support tickets, and usability tests — but lack a fast, visual way to identify patterns, gauge sentiment severity, and share synthesized insights. Manual synthesis takes hours and delays decision-making.

---

## Solution
A real-time dashboard that ingests feedback entries, automatically detects recurring themes with confidence scores, visualizes sentiment across time and channels, and generates exportable executive summaries — all with full traceability back to source quotes.

---

## Key Features

### Theme Detection & Traceability
- AI-detected themes displayed as interactive pills with count, confidence %, and sentiment
- Click-to-trace: selecting a theme highlights the exact feedback entries that triggered it
- Drilldown panel with sentiment breakdown, source quotes, and suggested product actions

### Sentiment Visualization
- **Heatmap Calendar** — GitHub-style 12-week grid showing daily sentiment averages with trend summaries
- **Sparkline Chart** — Time-series area chart with day-over-day comparison
- Toggleable views for different stakeholder preferences

### Pivotable Statistics
- Interactive stat cards ("Themes Found", "Negative Signals") that expand into filterable detail panels
- Negative signals sorted by severity for rapid triage

### Source Channel Analysis
- Breakdown of feedback by channel (surveys, interviews, support tickets, usability tests)
- Click-to-filter: select a channel to scope all dashboard views

### Executive Summary & Export
- One-click draft report generation from analyzed feedback
- Copy-to-clipboard, PDF export with branded layout, Slack posting (planned)

### Responsive Panel System
- Three-column layout with auto-collapsing panels
- Theme selection collapses the feedback list to maximize analysis space
- Smooth Framer Motion transitions throughout

---

## Tech Stack

| Layer | Technology |
|---|---|
| Framework | React 18 + TypeScript |
| Styling | Tailwind CSS with semantic HSL design tokens |
| Animation | Framer Motion (layout, presence, counters) |
| Charts | Recharts (area, sparkline) |
| Backend | Supabase (PostgreSQL, real-time, RLS) |
| PDF Export | jsPDF with branded template |
| Typography | DM Sans |
| Build | Vite |

---

## Design System Highlights

- **Full semantic token architecture** — `--sentiment-positive`, `--surface-sunken`, `--pill-bg`, etc.
- **Dark mode ready** — complete HSL token set for both themes
- **No hardcoded colors** in components — everything references design tokens
- **Custom component variants** — design-system Button, Card, and Input wrappers

---

## Process

1. **Problem framing** — Identified the synthesis bottleneck from personal experience in product teams
2. **Information architecture** — Designed a three-panel layout (Source → Analysis → Detail) that mirrors the analyst's mental model
3. **Mock data design** — Crafted realistic feedback entries spanning multiple sources, sentiments, and themes to stress-test the UI
4. **Iterative visualization** — Started with sparklines, added heatmap after testing scannability, kept both with a toggle
5. **Interaction design** — Made every stat, theme, and chart element interactive to support exploratory analysis

---

## Outcomes & Impact

| Metric | Target |
|---|---|
| Time from feedback → insight | < 30 seconds |
| Theme detection relevance | > 80% accuracy |
| Drill-down interactions per session | > 3 |
| Summary export rate | > 50% of sessions |

---

## Screenshots

> *Add 3-4 screenshots here:*
> 1. Full dashboard with heatmap view
> 2. Theme drilldown panel with sentiment breakdown
> 3. Negative signals pivot expanded
> 4. PDF export preview

---

## Live Demo
[→ View Live Demo](YOUR_PUBLISHED_URL)

---

## Source Code
[→ GitHub Repository](YOUR_GITHUB_URL)

---

## What I'd Do Differently

- **Real LLM integration** — Replace mock theme detection with actual NLP via Supabase Edge Functions
- **CSV/file upload** — Let users bring their own data instead of relying on manual entry
- **Collaborative features** — Comments, annotations, and shared views for team synthesis sessions
- **Mobile-first redesign** — Current layout is desktop-optimized; a tab-based mobile layout would expand reach
