---
name: Design Enforcer
description: A skill to enforce the project's design system and ensure high-quality aesthetics.
---

# Design Enforcer

This skill is designed to enforce the design system.

---
name: design-enforcer
description: Enforces the Theme Flow AI design system on all frontend changes to ensure visual consistency.
---

# Goal
Ensure every new component, page, or style edit adheres strictly to the rules defined in `DESIGN_SYSTEM.md`.

# Instructions
1. **Pre-Flight Check:** Whenever I am asked to create or edit UI, I must first read `DESIGN_SYSTEM.md` and `tailwind.config.ts`.
2. **Token-Only Styling:** - Prohibit the use of arbitrary values (e.g., `h-[42px]` or `bg-[#f3f3f3]`). 
   - I must use established design tokens (e.g., `h-10` or `bg-brand-primary`).
3. **Component Re-use:** If a component exists in `src/components/ui`, I must use it instead of building a new HTML element from scratch.
4. **Linting Pass:** After writing code, I will perform a "Visual Lint" to ensure the spacing and typography scales match the system's defined ratios.

# Examples
- **User:** "Add a new login button."
- **Agent Action:** Imports `Button` from `@/components/ui/button` and applies `variant="primary"`, rather than creating a `<button className="bg-blue-500...">`.

# Constraints
- NEVER introduce a new color hex code without first proposing an update to `tailwind.config.ts`.
- NEVER bypass Tailwind's spacing scale (use 1, 2, 4, 8, etc.).
