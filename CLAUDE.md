# Top 10 Prom - Digital Showroom Constraints

## HARD CONSTRAINTS
- `'use cache'` directive MUST be first line of file (before all imports).
- `'use client'` pushed as deep as possible in the component tree.
- All animations: spring physics ONLY (no linear, no tween).
- All animations: MUST respect `prefers-reduced-motion` via `useReducedMotion()`.
- Tailwind custom tokens: onyx (#050505), gold (#D4AF37), platinum (#C0C0C0), ivory (#F5F5F5).
- TWO glass classes only: `glass-light` (bg-white/5 border border-white/10, NO blur), `glass-heavy` (bg-black/60 backdrop-blur-md border border-white/10).
- `backdrop-blur` is ONLY permitted on `glass-heavy` surfaces.
- No `src/` directory. App Router at project root.
- No Lenis. Use CSS `scroll-behavior: smooth` on `html` element.
- No custom cursor. Permanently removed.
- `useActionState` (NOT `useFormState` — deprecated in React 19 final).
- Mobile-first: BottomNav with 5 persistent tabs (Home, Catalog, Fitting Room, Book, Profile).
- Multi-tenant: ALL database queries scoped to active boutique context.
- Location-scoped RLS on ALL staff/admin operations.
- Skeleton components must use `min-h` (not fixed `h-`) to prevent layout shifts.
- Product images: minimum 4 per dress stored as JSONB array.
- Dual notifications: booking confirmations sent to BOTH customer AND parent/guardian.

## ERROR RECOVERY
- API rate limit: implement exponential backoff, do not fail silently.
- Missing env var: skip the dependent feature, log a clear warning, continue build.
- Type error: fix immediately, NEVER proceed with TypeScript errors.
- Build failure: run diagnostics, identify root cause, fix, re-run before continuing.
- Supabase migration error: check for existing tables/columns, use IF NOT EXISTS.
