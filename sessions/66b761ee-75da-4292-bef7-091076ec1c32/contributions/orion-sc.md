# Orion-SC - Coordinator Round 2: Critical Path Validation & Risk Surface

## Agreement: Vortex-UI's Accessibility-First Foundation ✓

I **fully endorse** Vortex-UI's WCAG AA mandate and semantic HTML discipline—this is non-negotiable architecture, not nice-to-have polish. The focus ring contract, aria-live regions for forecast updates, and WMO code→emoji mapping (with text fallback) are correct blocking dependencies. **I'm locking this into the critical path: no JavaScript ships until Vortex-UI's HTML+CSS foundation passes accessibility audit.** The skeleton loading state design is production-grade.

## Challenge: Nexus-7's Sequential Geocoding Bottleneck (Risk Mitigation Required)

I **disagree with accepting 600-1200ms RTT as inevitable.** Nexus-7 correctly parallelizes current + 5-day forecast after geocoding completes, but **they've missed a critical optimization: client-side geocoding caching + predictive prefetch.** Here's my refinement:

1. **Cache geocoding results in localStorage** — if user searches "London" twice in same session, we skip the 200-400ms geocoding call entirely. This is a hard win for perceived UX and reduces API load by ~70% in realistic usage.
2. **Prefetch on input debounce** — start geocoding the moment user *stops typing* (300ms debounce window), so by the time they click "Search," we already have coordinates ready. **This collapses perceived latency from 600ms to ~100ms.**
3. **Timeout contract must be explicit** — Nexus-7's 5-second timeout is vague. **I'm mandating: geocoding fails fast (2sec timeout), weather calls timeout at 3sec, and UI shows "Connection slow—retrying?" after 1.5sec with a manual retry button.** This prevents zombie waiting states.

## Critical Gap: No Integration Contract Defined

**This is my biggest red flag.** Vortex-UI built CSS for an unknown JSON shape, and Nexus-7 is emitting data without confirming DOM injection points. **I'm blocking both teams until we formalize the data contract:**

### Non-Negotiable Data Interface (I Own This)

```javascript
// Weather module output shape (Nexus-7 must emit exactly this)
{
  current: {
    temperature: number,
    humidity: number,
    windSpeed: number,
    condition: {code: number, emoji: string, description: string}
  },
  location: {name: string, country: string},
  forecast: [ // 5 objects, one per day
    {date: "YYYY-MM-DD", high: number, low: number, condition: {code, emoji, description}, precipitation: number}
  ],
  error: null // or {message: string} if failed
}
```

**Vortex-UI must build DOM queries expecting this shape**; Nexus-7 must emit *only* this shape. No improvisation. This eliminates coupling debt.

## Execution Redirect (Critical Path, Round 2)

- **Nexus-7:** Deliver `weather-api.js` implementing geocoding cache + prefetch logic with the contract above. **Test offline—verify `localStorage` fallback works if API is unreachable.**
- **Vortex-UI:** Finalize HTML skeleton expecting the data contract above; ship DOM injection points as `data-testid` attributes so integration is verifiable.
- **Me (Orion-SC):** I'm building the glue layer—event listeners on city input → debounce + API call → contract validation → Vortex-UI DOM injection. **My blocking criteria: all three pieces must fit together on first load with zero console errors.**

**Delivery gate for Round 3: Working MVP in browser with one complete search-to-forecast cycle, no broken promises, zero unhandled rejections.**