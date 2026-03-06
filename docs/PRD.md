# Product Requirements Document: Pulse AI

## 1. Overview

**Pulse AI** is a sentiment analysis and feedback synthesis dashboard that helps product teams quickly understand user sentiment, identify recurring themes, and generate actionable summaries from raw customer feedback.

**Target Users:** Product managers, UX researchers, customer success teams, and founders who need to process qualitative feedback at scale.

**Problem Statement:** Teams collect feedback from multiple channels (surveys, support tickets, social media, interviews) but lack a fast, visual way to identify patterns, gauge sentiment, and share synthesized insights with stakeholders.

---

## 2. Core Value Proposition

- **Speed:** Go from raw feedback → actionable themes in seconds, not hours
- **Traceability:** Every AI-generated insight links back to source quotes
- **Handoff-ready:** Generate draft summaries ready for Slack, docs, or presentations

---

## 3. Features & Requirements

### 3.1 Raw Feedback Panel (P0)
| Requirement | Status |
|---|---|
| Display all ingested feedback entries with source, date, sentiment | ✅ Built |
| Highlight feedback related to a selected theme | ✅ Built |
| Collapsible panel to maximize analysis space | ✅ Built |
| Search & filter by source, date, sentiment range | 🔲 Planned |
| CSV/text file upload for data ingestion | 🔲 Planned |

### 3.2 Theme Detection & Visualization (P0)
| Requirement | Status |
|---|---|
| Display AI-detected themes as interactive pills | ✅ Built |
| Show count, confidence score, and sentiment per theme | ✅ Built |
| Click-to-trace: selecting a theme highlights related feedback | ✅ Built |
| Theme drill-down panel with sentiment breakdown, quotes, suggested actions | ✅ Built |

### 3.3 Sentiment Analysis (P0)
| Requirement | Status |
|---|---|
| Overall sentiment meter (-1 to +1 scale) | ✅ Built |
| Per-feedback sentiment scoring | ✅ Built |
| Per-theme sentiment breakdown (positive/neutral/negative bar) | ✅ Built |
| Historical sentiment trend (sparkline over time) | 🔲 Planned |

### 3.4 Draft Summary / Handoff (P1)
| Requirement | Status |
|---|---|
| AI-generated executive summary of feedback | ✅ Built (mock) |
| Key takeaways and bullet points | ✅ Built |
| Copy-to-clipboard / export | 🔲 Planned |
| Slack integration for sharing | 🔲 Planned |
| PDF export | 🔲 Planned |

### 3.5 Data & Backend (P1)
| Requirement | Status |
|---|---|
| Supabase project connected | ✅ Done |
| Feedback storage table with RLS | 🔲 Planned |
| Real LLM-powered theme extraction (Edge Function) | 🔲 Planned |
| Real-time sync across sessions | 🔲 Planned |

### 3.6 UX Enhancements (P2)
| Requirement | Status |
|---|---|
| Dark mode toggle | 🔲 Planned |
| Animated stat counters | 🔲 Planned |
| Skeleton loaders / empty states | 🔲 Planned |
| Mobile-responsive layout | 🔲 Planned |

---

## 4. Information Architecture

```
┌─────────────────────────────────────────────────────┐
│  Header: Logo · Status indicator                    │
├──────────┬────────────────────┬─────────────────────┤
│ Raw      │ AI Insights        │ Contextual Panel    │
│ Feedback │  • Theme Pills     │  • Theme Drilldown  │
│ (collaps │  • Sentiment Meter │    OR               │
│  ible)   │  • Stats Cards     │  • Draft Summary    │
└──────────┴────────────────────┴─────────────────────┘
```

## 5. Success Metrics

| Metric | Target |
|---|---|
| Time from upload → insight | < 30 seconds |
| Theme detection accuracy | > 80% relevance |
| User engagement (drill-down clicks / session) | > 3 |
| Summary export rate | > 50% of sessions |

## 6. Technical Stack

- **Frontend:** React + TypeScript, Vite, Tailwind CSS, Framer Motion, Recharts
- **Backend:** Supabase (Postgres + Auth + Edge Functions)
- **AI:** LLM via Edge Functions for theme extraction & summarization

## 7. Roadmap

| Phase | Scope |
|---|---|
| **Phase 1 (Current)** | Mock data dashboard with theme drill-down, sentiment analysis, collapsible panels |
| **Phase 2** | Supabase tables, CSV upload, real data persistence |
| **Phase 3** | LLM integration for live theme extraction & summary generation |
| **Phase 4** | Export/share features, Slack integration, historical trends |
| **Phase 5** | Multi-project support, team collaboration, alerting |
