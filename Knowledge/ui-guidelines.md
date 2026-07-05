# UI Guidelines

> Status: canonical (v0.1 seed) · Owner: uiux-lead · Consumed-by: frontend-lead, accessibility, animation, seo
> Cited as `per UI-NN`.

## Rules

- **UI-01** Design tokens are the single source of truth for color, spacing, type, radius, shadow. No hardcoded style values in components.
- **UI-02** Tailwind utilities map to tokens (theme config); arbitrary values (`[#f00]`) are a review failure.
- **UI-03** Every interactive surface has explicit **loading, empty, error, and success** states. No dead ends.
- **UI-04** Mobile-first and responsive by default; verified at mobile / tablet / desktop breakpoints.
- **UI-05** Accessibility is non-negotiable: WCAG 2.2 AA minimum — contrast, focus states, keyboard nav, semantic HTML, ARIA where needed (owned by `accessibility`).
- **UI-06** Touch targets ≥ 44×44px; visible focus ring on all focusable elements.
- **UI-07** Motion respects `prefers-reduced-motion`; micro-interactions 200–300ms; motion communicates, never decorates (owned by `animation`).
- **UI-08** Components are composable, prop-driven, and stateless where possible; no business logic in presentation components.
- **UI-09** Copy is clear, consistent, and action-oriented; error messages say what happened and what to do next.
- **UI-10** Consistency over novelty: reuse existing design-system components before creating new ones.

## Rationale
A token-driven, accessible, state-complete UI system is reusable across products and keeps FE,
a11y, animation, and SEO specialists working from one contract.

## Exceptions & how to request one
Propose to the UI/UX Lead with a rationale; approved patterns are added to the design system.
