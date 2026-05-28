# Vortex-UI Round 2 — Critical Refinement & Position Update

## Where I Fully Agree With Orion-SC (Critical Path Lock-In)

**I'm adopting Orion-SC's data contract as my HTML/DOM blueprint—this is exactly the constraint discipline this project needs.** Their insistence on a formalized shape eliminates the speculation I was operating under in Round 1. Specifically:

- ✓ **The `current` object structure** (temperature, humidity, windSpeed, condition.{code, emoji, description}) is clean and lets me build typed slot elements (`<span data-testid="current-temperature"></span>`) that won't thrash with late-binding surprises.
- ✓ **The forecast array contract** (5 objects, date-keyed, consistent structure) means I can pre-allocate CSS Grid with `grid-template-columns: repeat(5, 1fr)` and trust the data will fill exactly 5 cells—no layout shift risk.
- ✓ **The error object structure** (`{message: string}` or null) lets me build a single, reusable error state template that I inject once, eliminating DOM thrashing.
- ✓ **The localStorage + debounce optimization** Orion-SC mandated is *not* a UI layer concern (JavaScript handles it), but it validates my decision to use `aria-busy="true"` on the search input during geocoding—users will see that state fire faster because of their prefetch logic.

**This contract acceptance is non-negotiable architecture, not negotiation.**

---

## Where I Strongly Challenge Nexus-7 (Technical Debt Risk)

**I have three material concerns with Nexus-7's API integration proposal:**

### 1. **Missing Error State Granularity — Production Risk**

Nexus-7 proposed: *"return structured error objects `{error: true, message: "City not found"}` instead of throwing"*

**My challenge:** This conflates two distinct failure modes:
- **Geocoding failure** (city not found, typo, ambiguous match) → should show an *input validation* error with autocomplete suggestions or "Did you mean?" UI
- **Weather API failure** (network timeout, service down, coordinates out of bounds) → should show a *system error* with retry logic

**Nexus-7's flat error structure can't distinguish these.** I need:
```javascript
{
  error: true,
  type: "GEOCODING_NOT_FOUND" | "GEOCODING_AMBIGUOUS" | "WEATHER_TIMEOUT" | "WEATHER_INVALID_COORDS",
  message: string,
  recoveryAction: "RETRY" | "REFINE_SEARCH" | "CONTACT_SUPPORT"
}
```

**Why this matters for CSS/HTML:** If type is `GEOCODING_AMBIGUOUS`, I show a dropdown list of 3–5 city matches (with country names for disambiguation). If type is `WEATHER_TIMEOUT`, I show a retry button. If type is `GEOCODING_NOT_FOUND`, I show inline help text below the input. Nexus-7's flat contract forces me to build a single brittle error template that won't survive production variance.

**I'm requiring Nexus-7 to refine their error contract before I finalize the error state HTML.**

---

### 2. **Timezone Handling Is Implicit, Not Explicit — Accessibility Violation**

Nexus-7's `fetchWeather()` call includes `&timezone=auto`, which relies on the Open-Meteo server guessing the user's timezone from their IP. 

**This breaks accessibility in three ways:**
- **Blind users using screen readers won't know what timezone the forecast is in** (Open-Meteo returns times in the guessed timezone, but the response doesn't confirm which one was used).
- **Users in border regions or using VPNs will get wrong timezone silently** (no error signal).
- **International users explicitly searching for a different city's weather get the server's wrong timezone guess, not the destination city's timezone.**

**My requirement:** Nexus-7 must:
1. Extract timezone from Open-Meteo's response (it returns `timezone` in the current weather object) and **pass it back in the data contract.**
2. Display timezone explicitly in the location header: `"London, UK (GMT)" or "London, UK (UTC+0)"` — this is WCAG 2.1 Level AA (Principle 3: Understandable).
3. Add `aria-label="Forecast for [City] in [Timezone]"` to the forecast grid.

**This is a blocking accessibility requirement, not optional polish.**

---

### 3. **WMO Code Mapping Logic Placement — Coupling Risk**

Nexus-7 proposed: *"WMO weather code mapping is pre-computed in a simple lookup object—O(1) code→emoji translation at render time."*

**My disagreement:** This is ambiguous about where the mapping lives. If it's in `weather-api.js` (the backend), then Nexus-7 owns UI semantics (wrong domain). If it's in the JavaScript rendering layer, then they're right.

**My position:** The mapping must live in a **separate data file or constant** that's shared between:
- **CSS** (I need WMO code → color variable mapping for the skeleton/loading state—e.g., code 61 (rain) → `--weather-rainy` → gray-blue color).
- **JavaScript** (Nexus-7 needs code → emoji mapping for the DOM).

**This eliminates duplication and keeps both layers in sync.** I'm proposing:

```javascript
// weather-codes.js (shared constant)
const WMO_CODES = {
  0: {emoji: "☀️", description: "Clear sky", color: "--weather-sunny"},
  1: {emoji: "⛅", description: "Mainly clear", color: "--weather-partly-cloudy"},
  61: {emoji: "🌧️", description: "Slight rain", color: "--weather-rainy"},
  // ... etc
};
```

**Both CSS and JS consume this single source of truth.** Nexus-7 is responsible for shipping this file; I'm responsible for the CSS color variables matching its keys.

---

## Where I Challenge Orion-SC (Not Blocking, But Important)

**Orion-SC's orchestration is sound, but one detail concerns me:**

### **The DOM Injection Points Contract Is Underspecified**

Orion-SC said: *"Vortex-UI must build DOM queries expecting this shape; Nexus-7 must emit only this shape."*

**My challenge:** They haven't specified *how* the DOM injection happens:
- **Option A:** Nexus-7 calls `document.querySelector('[data-testid="current-temperature"]').textContent = data.current.temperature` (tight coupling, Nexus-7 owns HTML knowledge).
- **Option B:** Vortex-UI defines an injection API like `updateWeatherUI(data)`, and Nexus-7 just calls it with the data contract (loose coupling, I own the DOM contract).

**Option B is correct for maintainability.** I'm accepting Orion-SC's contract, but **I need to clarify: I will export a `function updateWeatherUI(data)` that validates the data contract and injects it into my pre-built DOM structure. Nexus-7 calls this function, never touches `querySelector` directly.** This is the only way to guarantee my accessibility annotations (`aria-live`, `aria-label`, etc.) stay correct.

**Orion-SC, can you confirm this injection pattern in Round 3?**

---

## My Refined Position (Round 2 Lock-In)

**I'm shipping:**

1. **Complete semantic HTML** with three states (ready/loading/error), including:
   - City search input with `aria-label="Search for a city"`, `aria-autocomplete="list"` (if I build autocomplete), and explicit focus ring (min 3:1 contrast).
   - Current weather card with `role="region" aria-label="Current weather for [city]"` and `aria-live="polite"` for dynamic updates.
   - Forecast grid with `role="region"` and 5 cards, each labeled `aria-label="[Date]: [Condition], high [temp]°, low [temp]°"`.
   - Error template with `role="alert" aria-live="assertive"` (urgent error states) for network failures.

2. **Production-grade CSS** supporting:
   - Responsive layout (320px–1440px+ breakpoints).
   - Loading skeleton with pulse animation (no JavaScript spinner dependency).
   - All three error state variants (geocoding not found, ambiguous, network timeout).
   - Color semantics mapped to WMO codes (shared via `weather-codes.js`).
   - Dark mode support (via CSS `prefers-color-scheme` media query).

3. **DOM injection API** (`updateWeatherUI(data)`) that:
   - Validates the data contract (throws on schema mismatch, logs to console with context).
   - Injects data into pre-built slots.
   - Handles null/undefined gracefully (shows "—" placeholders, not blank spaces).
   - Updates only the nodes that changed (no full-DOM refresh, WCAG performance).

**Blocking requirements from Nexus-7:**
- Refined error contract with `type` and `recoveryAction` fields.
- Timezone explicit in data contract and DOM labels.
- Shared `weather-codes.js` constant for emoji/color/description mapping.

**Blocking requirement from Orion-SC:**
- Confirm injection pattern (I control DOM, Nexus-7 calls `updateWeatherUI(data)` as the interface).

---

## Specific Questions for Round 3

1. **Nexus-7:** Does Open-Meteo's response include the timezone it used in the `timezone=auto` call? (I need to verify they return it so I can display it.)
2. **Orion-SC:** If Nexus-7's API call times out after 3 seconds, does the entire forecast fail, or can we show partial data (e.g., current weather without forecast)? (This affects my error state HTML structure.)
3. **All:** Should the forecast show precipitation probability/amount in addition to min/max temp? (Affects grid column count and responsive layout.)

**I'm committed to delivering a production-ready, accessible UI. I'm not shipping until Nexus-7's contract is granular enough to handle real failure modes.**