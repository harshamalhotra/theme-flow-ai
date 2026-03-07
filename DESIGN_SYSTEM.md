# Theme Flow AI - Design System

This document outlines the lightweight design system extracted from the Theme Flow AI codebase. It codifies the core visual primitives ensuring a consistent, "Antigravity-ready" vibe.

## Typography

**Primary Font:** `DM Sans` (`font-sans`)
**Fallback:** `system-ui, -apple-system, sans-serif`

Our interfaces prioritize modern, clean legibility using DM Sans across all font weights.

Text styling utilities: `text-xs`, `text-sm`, `text-base`, `text-lg`, `text-xl`, `text-2xl`.
Font weights: `font-normal`, `font-medium`, `font-semibold`, `font-bold`.

## Color Palette

The codebase uses a semantic, CSS-variable driven color palette. Every token maps directly to a Tailwind utility class for ease of use.

### Base Colors
- **Background:** `--background` -> `bg-background` | `text-background` (Light: `220 16% 96%` | Dark: `220 20% 8%`) - Main app background.
- **Foreground:** `--foreground` -> `bg-foreground` | `text-foreground` (Light: `220 20% 12%` | Dark: `220 14% 92%`) - Primary text color.
- **Primary:** `--primary` -> `bg-primary` | `text-primary` (Turquoise/Teal: `174 62% 40%`) - Primary actions, buttons, and active states.
- **Secondary:** `--secondary` -> `bg-secondary` | `text-secondary` (Light Gray/Blue-ish: `220 14% 92%`) - Secondary elements.
- **Muted:** `--muted` -> `bg-muted` | `text-muted` - Subtle backgrounds.
- **Accent:** `--accent` -> `bg-accent` | `text-accent` - Accents, often a much lighter hue of primary.

### Surfaces & Elevation
- **Card:** `--card` -> `bg-card` | `text-card` - Default background for contained items.
- **Popover:** `--popover` -> `bg-popover` | `text-popover` - Background for floating elements (dropdowns, menus).
- **Surface Elevated:** `--surface-elevated` -> `bg-surface-elevated` (Light: `0 0% 100%` | Dark: `220 18% 14%`) - For cards or modals visually lifted above the background.
- **Surface Sunken:** `--surface-sunken` -> `bg-surface-sunken` (Light: `220 16% 94%` | Dark: `220 20% 6%`) - For inset areas or grouped content backgrounds.

### Semantic / Status Colors
- **Negative / Destructive:** `--sentiment-negative` -> `bg-sentiment-negative` | `text-sentiment-negative` (Red: `0 72% 56%`) - For errors or destructive actions.
- **Neutral:** `--sentiment-neutral` -> `bg-sentiment-neutral` | `text-sentiment-neutral` (Yellow/Orange) - For warnings or pending states.
- **Positive:** `--sentiment-positive` -> `bg-sentiment-positive` | `text-sentiment-positive` (Green: `152 60% 44%`) - For success states.

### Chart Colors
- **Charts 1-5:** `--chart-1` through `--chart-5` (e.g., `fill-[var(--chart-1)]`) - Categorical colors used for data visualization (sparklines, heatmaps).

### Specialties
- **Pill:** Background (`bg-pill`), Foreground (`text-pill-foreground`), Hover (`hover:bg-pill-hover`). Used for badges and tags.
- **Highlight:** `bg-highlight` for highlighting text or selections.
- **Border & Ring:** `border-border`, `ring-ring`, `bg-input` for input fields, dividers, and focus rings.

## Borders & Radii

The application primarily relies on a base radius token.
- **Base `lg` (Default):** `.rounded-lg` (`0.625rem` / `10px`)
- **Medium `md`:** `.rounded-md` (`calc(var(--radius) - 2px)` / `8px`)
- **Small `sm`:** `.rounded-sm` (`calc(var(--radius) - 4px)` / `6px`)

*Rule:* Use standard `rounded-lg`, `rounded-md`, or `rounded-sm`. Avoid hardcoding arbitrary pixel border radii.

## Spacing & Layout

Spacing follows standard Tailwind scales (e.g., `p-4`, `p-6`, `m-2`, `gap-3`, `gap-6`). 
Custom layout constraints have been abstracted:
- **Layout Max Width:** `max-w-layout` (`1600px`) for the main dashboard constraint.
- **Menu/Popover Min Widths:** `min-w-menu` (`8rem`) and `min-w-menu-lg` (`12rem`).
- **Dashboard Heights:** `h-dashboard-scroll` (`600px`).

## Shadows

- **Soft Default:** `shadow-sm` for standard cards or inputs.
- **Card Hover:** Custom box shadows in Framer Motion for interactive elevation.

## Base Atoms (Components)

Three foundational atoms exist in `src/components/design-system/`. These serve as the fundamental unstyled-to-styled building blocks.

### Component Registry

#### 1. Button (`<Button />`)
Uses `--primary`, `--secondary`, `--destructive`, or `--ghost` variants.
*Usage:* For all click-triggered actions.

**Accepted Props:**
- Standard `React.ButtonHTMLAttributes<HTMLButtonElement>`
- `variant` (optional): `"primary"` | `"secondary"` | `"destructive"` | `"outline"` | `"ghost"` | `"link"` (Provides predefined Tailwind class clusters).
- `size` (optional): `"sm"` | `"md"` | `"lg"` | `"icon"` (Dictates padding and height).

```tsx
<Button variant="primary" size="md">Click Me</Button>
```

#### 2. Input (`<Input />`)
Standardized text, email, or password capture using `bg-background` or `bg-surface-elevated` with `--border` and `--ring`.

**Accepted Props:**
- Standard `React.InputHTMLAttributes<HTMLInputElement>`
- `elevated` (optional, boolean, default: `false`): Applies `bg-surface-elevated` and `shadow-sm` for a floating appearance instead of the flat `bg-background`.

```tsx
<Input type="email" placeholder="Enter email..." elevated />
```

#### 3. Card (`<Card />` family)
Structural container utilizing `bg-card`, `rounded-lg`, and `border`. Groups related data harmoniously.

**Family Exports & Props:**
*All accept standard `React.HTMLAttributes<HTMLDivElement/HTMLHeadingElement>` including `className` for further refinement.*
- `<Card />`: The outer wrapper layout.
- `<CardHeader />`: Padding, layout setup for titles/context.
- `<CardTitle />`: Standardized semantic heading (`text-xl font-semibold`).
- `<CardContent />`: Main padded body block.
- `<CardFooter />`: Aligned footer area.

```tsx
<Card>
  <CardHeader>
    <CardTitle>Title</CardTitle>
  </CardHeader>
  <CardContent>Description text...</CardContent>
</Card>
```

## Vibe Check

- **Glass & Elevation:** Use `surface-elevated` with subtle shadows (`shadow-sm` or custom Framer Motion variants) for popouts and highlights.
- **Clean Interactions:** Focus states should utilize `ring-ring` with `ring-offset-2`.
- **Consistency:** Never use magic arbitrary values (e.g., `p-[13px]`) for margins or paddings. Stick to the 4px grid (e.g., `p-3`, `p-4`) or defined layout tokens.
