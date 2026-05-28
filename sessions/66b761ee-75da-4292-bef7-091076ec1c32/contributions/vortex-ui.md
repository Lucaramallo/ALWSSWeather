# Vortex-UI — Round 1 Contribution: CSS Architecture & Accessibility-First Design

## Expert Analysis

**My position: This project demands a mobile-first, accessible-by-default CSS system that treats the Open-Meteo API contract as a hard constraint—meaning our grid, typography, and color semantics must survive both API latency states (loading skeletons) and edge cases (missing weather icons, extreme temperature ranges).**

### Critical Design Decisions I'm Locking In:

1. **Semantic HTML + WCAG AA Compliance First**  
   — I'm rejecting any CSS that doesn't support keyboard navigation (focus rings on city input), screen reader labels for weather conditions, and ARIA live regions for forecast updates. The city search *must* have a visual focus indicator (min 3:1 contrast ratio) and the current weather card needs `aria-live="polite"` for dynamic updates. This isn't nice-to-have—it's non-negotiable for production.

2. **Responsive Grid System (Mobile→Desktop)**  
   — I'm structuring the layout as: **city search (full-width input + button) → current weather card (1 col mobile, fixed aspect ratio) → 5-day forecast (1-column mobile, 5-column desktop via CSS Grid with `auto-fit` fallback for older browsers).** The forecast grid uses CSS variables for spacing so Nexus-7's API response (which might include null conditions) doesn't break layout. Card heights are locked to prevent cumulative layout shift (CLS < 0.1).

3. **Weather Condition Visual Indicators (Icon-Safe Design)**  
   — Since we're zero-dependency, I'm using **CSS-only pseudo-element weather icons** (colored circles + Unicode symbols: ☀️ ⛅ ☁️ 🌧️ ❄️) mapped to Open-Meteo's WMO condition codes. The color semantic system uses `--weather-sunny`, `--weather-rainy`, etc., so the design survives both light/dark mode AND colorblind users (pattern + text fallback, not color alone).

4. **Loading State & Error Resilience**  
   — I'm building CSS for three DOM states: **ready (full content visible), loading (skeleton pulse animation), error (red border on input + aria-alert message).** The skeleton uses a repeating linear-gradient animation (no JavaScript-dependent spinners)—production-grade resilience.

### Open Question for Nexus-7 (Blocker for CSS Validation):
- **What's the exact JSON shape of Open-Meteo's hourly/daily forecast response?** I need to know if we're wrapping condition codes or timestamps so I can pre-size the grid correctly and avoid layout thrashing when JS injects the data.

**Deliverable this round:** Complete, semantically-valid HTML structure + production-ready CSS file with all three states (ready/loading/error), responsive breakpoints (320px, 768px, 1024px), and accessibility annotations. No JavaScript styling—that's the domain separation I'm enforcing.