# Theme Flow AI - Design System

This document outlines the lightweight design system extracted from the Theme Flow AI codebase. It codifies the core visual primitives ensuring a consistent, "Antigravity-ready" vibe.

## Typography

**Primary Font:** `DM Sans`
**Fallback:** `system-ui, -apple-system, sans-serif`

Our interfaces prioritize modern, clean legibility using DM Sans across all font weights.

## Color Palette

The codebase uses a semantic, CSS-variable driven color palette.

### Base Colors
- **Background:** `--background` (Light: `220 16% 96%` | Dark: `220 20% 8%`) - Main app background.
- **Foreground:** `--foreground` (Light: `220 20% 12%` | Dark: `220 14% 92%`) - Primary text color.
- **Primary:** `--primary` (Turquoise/Teal: `174 62% 40%`) - Primary actions, buttons, and active states.
- **Secondary:** `--secondary` (Light Gray/Blue-ish: `220 14% 92%`) - Secondary elements.
- **Muted:** `--muted` - Subtle backgrounds.
- **Accent:** `--accent` - Accents, often a much lighter hue of primary.

### Surfaces & Elevation
- **Card:** `--card` - Default background for contained items.
- **Popover:** `--popover` - Background for floating elements (dropdowns, menus).
- **Surface Elevated:** `--surface-elevated` (Light: `0 0% 100%` | Dark: `220 18% 14%`) - For cards or modals visually lifted above the background.
- **Surface Sunken:** `--surface-sunken` (Light: `220 16% 94%` | Dark: `220 20% 6%`) - For inset areas or grouped content backgrounds.

### Semantic / Status Colors
- **Negative / Destructive:** `--sentiment-negative` or `--destructive` (Red: `0 72% 56%`) - For errors or destructive actions.
- **Neutral:** `--sentiment-neutral` (Yellow/Orange) - For warnings or pending states.
- **Positive:** `--sentiment-positive` (Green: `152 60% 44%`) - For success states.

### Specialties
- **Pill:** Background (`--pill-bg`), Foreground (`--pill-fg`), Hover (`--pill-hover`). Used for badges and tags.
- **Highlight:** `--highlight` for highlighting text or selections.
- **Border & Ring:** `--border`, `--ring`, `--input` for input fields, dividers, and focus rings.

## Borders & Radii

The application primarily relies on a base radius token.
- **Base `lg` (Default):** `0.625rem` (`10px`)
- **Medium `md`:** `calc(var(--radius) - 2px)` (`8px`)
- **Small `sm`:** `calc(var(--radius) - 4px)` (`6px`)

*Rule:* Use standard `rounded-lg`, `rounded-md`, or `rounded-sm`. Avoid hardcoding arbitrary pixel border radii.

## Spacing & Layout

Spacing follows standard Tailwind scales (e.g., `p-4`, `m-2`, `gap-6`). 
Custom layout constraints have been abstracted:
- **Layout Max Width:** `max-w-layout` (`1600px`) for the main dashboard constraint.
- **Menu/Popover Min Widths:** `min-w-menu` (`8rem`) and `min-w-menu-lg` (`12rem`).

## Base Atoms (Components)

Three foundational atoms exist in `src/components/design-system/`:

1.  **Button**: Uses `--primary`, `--secondary`, `--destructive`, or `--ghost` variants.
    *Usage:* For all trigger actions.
    ```tsx
    <Button variant="primary" size="md">Click Me</Button>
    ```

2.  **Input**: Uses `bg-background` or `bg-surface-elevated` with `--border` and `--ring`.
    *Usage:* Standardized text, email, or password capture.

3.  **Card**: Structural container using `bg-card` and `rounded-lg`.
    *Usage:* Wrap grouped information or modules.
    ```tsx
    <Card>
      <CardHeader>Title</CardHeader>
      <CardContent>Description text...</CardContent>
    </Card>
    ```

## Vibe Check

- **Glass & Elevation:** Use `surface-elevated` with subtle shadows for popouts.
- **Clean Interactions:** Focus states should utilize `ring-ring` with `ring-offset-2`.
- **Consistency:** Never use magic arbitrary values (e.g., `p-[13px]`) for margins or paddings. Stick to the 4px grid (e.g., `p-3`, `p-4`) or defined layout tokens.
