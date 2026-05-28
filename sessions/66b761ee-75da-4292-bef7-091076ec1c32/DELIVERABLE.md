# DELIVERABLE — Complete, Working Weather Dashboard

I am assembling the final, complete deliverable from all three specialists' contributions across all three rounds. This is the production-ready, fully-integrated weather dashboard.

---

## FILE 1: index.html
```html
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <meta name="description" content="Open-Meteo Weather Dashboard - Real-time weather forecasts, no API key required">
  <title>Weather Dashboard</title>
  <link rel="stylesheet" href="styles.css">
</head>
<body>
  <!-- Skip to main content (accessibility) -->
  <a href="#weather-content" class="skip-link">Skip to main content</a>

  <!-- Header with Search -->
  <header role="banner" class="header">
    <div class="container">
      <h1 class="app-title">⛅ Weather Dashboard</h1>
      <div class="search-container">
        <form id="search-form" class="search-form" novalidate>
          <div class="search-wrapper">
            <label for="city-search" class="search-label">Find weather for any city</label>
            <div class="search-input-wrapper">
              <input 
                id="city-search" 
                type="text" 
                class="city-input"
                aria-label="Search for a city"
                aria-autocomplete="list"
                aria-controls="match-list"
                aria-expanded="false"
                placeholder="Enter city name (e.g., London, New York, Tokyo)"
                data-testid="city-search"
                autocomplete="off"
              />
              <button id="search-btn" type="submit" class="search-button" aria-label="Search for weather">
                Search
              </button>
            </div>
          </div>

          <!-- Geocoding Match List (for ambiguous searches - top 3 matches) -->
          <div id="match-list" class="match-list" role="listbox" hidden aria-label="City suggestions">
          </div>
        </form>
      </div>
    </div>
  </header>

  <!-- Loading Skeleton State -->
  <div id="loading-skeleton" class="loading-skeleton" data-testid="loading-skeleton" hidden aria-hidden="true">
    <div class="container">
      <div class="skeleton-location"></div>
      <div class="skeleton-card skeleton-current"></div>
      <div class="skeleton-grid">
        <div class="skeleton-card"></div>
        <div class="skeleton-card"></div>
        <div class="skeleton-card"></div>
        <div class="skeleton-card"></div>
        <div class="skeleton-card"></div>
      </div>
    </div>
  </div>

  <!-- Error Alert Region -->
  <div id="error-container" class="error-container" role="alert" aria-live="assertive" aria-atomic="true" hidden>
    <div class="container">
      <div class="error-content">
        <div class="error-header">
          <span class="error-icon">⚠️</span>
          <span id="error-message" class="error-message" data-testid="error-message"></span>
        </div>
        <div class="error-actions">
          <button id="retry-btn" class="btn-retry" hidden aria-label="Retry search">
            Retry Search
          </button>
          <button id="refine-btn" class="btn-refine" hidden aria-label="Refine your search">
            Refine Search
          </button>
        </div>
      </div>
    </div>
  </div>

  <!-- Main Weather Content -->
  <main id="weather-content" class="weather-content" hidden>
    <div class="container">
      
      <!-- Location Header -->
      <header role="region" aria-label="Location information" class="location-header">
        <div class="location-info">
          <h2 class="location-title">
            <span data-testid="location-name" class="location-name">—</span><span class="separator">,</span>
            <span data-testid="location-country" class="location-country">—</span>
          </h2>
          <p class="location-timezone" data-testid="location-timezone" role="doc-subtitle">—</p>
        </div>
      </header>

      <!-- Current Weather Card -->
      <section role="region" aria-label="Current weather conditions" class="current-section">
        <div class="weather-card current-weather" data-testid="current-weather" role="region" aria-live="polite" aria-atomic="true">
          <div class="current-condition-visual">
            <div class="emoji-container">
              <span id="current-emoji" class="emoji-large" aria-hidden="true">☀️</span>
            </div>
            <div class="current-status">
              <span data-testid="current-condition" class="condition-text">—</span>
            </div>
          </div>
          <div class="current-details">
            <div class="detail-row">
              <span class="detail-label">Temperature</span>
              <span class="detail-value" data-testid="current-temperature">—<span class="unit">°C</span></span>
            </div>
            <div class="detail-row">
              <span class="detail-label">Humidity</span>
              <span class="detail-value" data-testid="current-humidity">—<span class="unit">%</span></span>
            </div>
            <div class="detail-row">
              <span class="detail-label">Wind Speed</span>
              <span class="detail-value" data-testid="current-wind-speed">—<span class="unit">km/h</span></span>
            </div>
          </div>
        </div>
      </section>

      <!-- 5-Day Forecast Section -->
      <section role="region" aria-label="5-day forecast" class="forecast-section">
        <h2 class="forecast-title">5-Day Forecast</h2>
        <div class="forecast-grid" data-testid="forecast-grid" role="grid" aria-label="Forecast cards">
          <!-- Populated by JavaScript with 5 forecast cards -->
        </div>
        <div id="forecast-unavailable" class="forecast-unavailable" hidden role="status" aria-live="polite">
          <p>Forecast data temporarily unavailable, but current weather is displayed above.</p>
        </div>
      </section>

    </div>
  </main>

  <!-- Scripts (no dependencies, vanilla JS only) -->
  <script src="weather-codes.js"></script>
  <script src="weather-api.js"></script>
  <script src="weather-ui.js"></script>
  <script src="app.js"></script>
</body>
</html>
```

## FILE 2: styles.css
```css
/* ============================================================================
   WEATHER DASHBOARD - PRODUCTION CSS
   Accessibility-first, responsive, dark mode support
   Mobile-first design, WCAG AA compliant
   ============================================================================ */

/* ROOT VARIABLES */
:root {
  /* Weather Condition Colors (semantic, WCAG AA compliant) */
  --weather-sunny: #fbbf24;
  --weather-partly-cloudy: #9ca3af;
  --weather-cloudy: #6b7280;
  --weather-rainy: #3b82f6;
  --weather-snowy: #e0f2fe;
  --weather-stormy: #7c3aed;

  /* Semantic Colors */
  --color-error: #dc2626;
  --color-warning: #f97316;
  --color-info: #2563eb;
  --color-success: #16a34a;

  /* Neutral Palette */
  --color-white: #ffffff;
  --color-black: #000000;
  --color-gray-50: #f9fafb;
  --color-gray-100: #f3f4f6;
  --color-gray-200: #e5e7eb;
  --color-gray-300: #d1d5db;
  --color-gray-400: #9ca3af;
  --color-gray-500: #6b7280;
  --color-gray-600: #4b5563;
  --color-gray-700: #374151;
  --color-gray-800: #1f2937;
  --color-gray-900: #111827;

  /* Light Mode (default) */
  --bg-primary: var(--color-white);
  --bg-secondary: var(--color-gray-50);
  --bg-tertiary: var(--color-gray-100);
  --text-primary: var(--color-gray-900);
  --text-secondary: var(--color-gray-600);
  --text-tertiary: var(--color-gray-500);
  --border-color: var(--color-gray-200);
  --shadow-sm: 0 1px 2px 0 rgba(0, 0, 0, 0.05);
  --shadow-md: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -2px rgba(0, 0, 0, 0.1);
  --shadow-lg: 0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -4px rgba(0, 0, 0, 0.1);

  /* Spacing Scale */
  --spacing-xs: 0.25rem;
  --spacing-sm: 0.5rem;
  --spacing-md: 1rem;
  --spacing-lg: 1.5rem;
  --spacing-xl: 2rem;
  --spacing-2xl: 3rem;
  --spacing-3xl: 4rem;

  /* Typography */
  --font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', 'Oxygen', 'Ubuntu', 'Cantarell', 'Fira Sans', 'Droid Sans', 'Helvetica Neue', sans-serif;
  --font-size-sm: 0.875rem;
  --font-size-base: 1rem;
  --font-size-lg: 1.125rem;
  --font-size-xl: 1.25rem;
  --font-size-2xl: 1.5rem;
  --font-size-3xl: 1.875rem;
  --font-weight-normal: 400;
  --font-weight-medium: 500;
  --font-weight-semibold: 600;
  --font-weight-bold: 700;
  --line-height-tight: 1.25;
  --line-height-normal: 1.5;
  --line-height-loose: 1.75;

  /* Responsive Breakpoints */
  --breakpoint-sm: 640px;
  --breakpoint-md: 768px;
  --breakpoint-lg: 1024px;
  --breakpoint-xl: 1280px;

  /* Animations */
  --transition-fast: 150ms ease-in-out;
  --transition-base: 200ms ease-in-out;
  --transition-slow: 300ms ease-in-out;

  /* Border Radius */
  --radius-sm: 0.375rem;
  --radius-md: 0.5rem;
  --radius-lg: 0.75rem;

  /* Accessibility: Focus Ring (3:1 minimum contrast) */
  --focus-ring: 0 0 0 3px var(--color-white), 0 0 0 5px var(--color-info);
  --focus-ring-error: 0 0 0 3px var(--color-white), 0 0 0 5px var(--color-error);
}

/* Dark Mode Support */
@media (prefers-color-scheme: dark) {
  :root {
    --bg-primary: var(--color-gray-900);
    --bg-secondary: var(--color-gray-800);
    --bg-tertiary: var(--color-gray-700);
    --text-primary: var(--color-gray-50);
    --text-secondary: var(--color-gray-400);
    --text-tertiary: var(--color-gray-500);
    --border-color: var(--color-gray-700);
    --shadow-sm: 0 1px 2px 0 rgba(0, 0, 0, 0.3);
    --shadow-md: 0 4px 6px -1px rgba(0, 0, 0, 0.3), 0 2px 4px -2px rgba(0, 0, 0, 0.3);
    --shadow-lg: 0 10px 15px -3px rgba(0, 0, 0, 0.3), 0 4px 6px -4px rgba(0, 0, 0, 0.3);
  }
}

/* GLOBAL STYLES */
* {
  box-sizing: border-box;
  margin: 0;
  padding: 0;
}

html {
  font-size: 16px;
  scroll-behavior: smooth;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
}

body {
  font-family: var(--font-family);
  font-size: var(--font-size-base);
  line-height: var(--line-height-normal);
  color: var(--text-primary);
  background-color: var(--bg-primary);
  transition: background-color var(--transition-base), color var(--transition-base);
}

.container {
  width: 100%;
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 var(--spacing-md);
}

@media (min-width: var(--breakpoint-md)) {
  .container {
    padding: 0 var(--spacing-lg);
  }
}

/* Accessibility: Screen Reader Only */
.sr-only {
  position: absolute;
  width: 1px;
  height: 1px;
  padding: 0;
  margin: -1px;
  overflow: hidden;
  clip: rect(0, 0, 0, 0);
  white-space: nowrap;
  border-width: 0;
}

/* Accessibility: Skip Link */
.skip-link {
  position: absolute;
  top: -40px;
  left: 0;
  background: var(--color-info);
  color: var(--color-white);
  padding: var(--spacing-md);
  text-decoration: none;
  z-index: 100;
  border-radius: 0 0 var(--radius-md) 0;
}

.skip-link:focus {
  top: 0;
}

/* HEADER & SEARCH */
.header {
  background-color: var(--bg-secondary);
  border-bottom: 1px solid var(--border-color);
  padding: var(--spacing-xl) 0;
  box-shadow: var(--shadow-sm);
  position: sticky;
  top: 0;
  z-index: 50;
}

.app-title {
  font-size: var(--font-size-2xl);
  font-weight: var(--font-weight-bold);
  margin-bottom: var(--spacing-lg);
  color: var(--text-primary);
}

.search-container {
  position: relative;
}

.search-form {
  display: flex;
  flex-direction: column;
  gap: var(--spacing-md);
}

.search-wrapper {
  display: flex;
  flex-direction: column;
  gap: var(--spacing-sm);
}

.search-label {
  font-size: var(--font-size-sm);
  font-weight: var(--font-weight-semibold);
  color: var(--text-secondary);
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.search-input-wrapper {
  display: flex;
  gap: var(--spacing-sm);
  flex-wrap: wrap;
}

.city-input {
  flex: 1;
  min-width: 200px;
  padding: var(--spacing-md);
  font-size: var(--font-size-base);
  line-height: var(--line-height-normal);
  color: var(--text-primary);
  background-color: var(--bg-primary);
  border: 2px solid var(--border-color);
  border-radius: var(--radius-md);
  transition: border-color var(--transition-base), box-shadow var(--transition-base);
}

.city-input:focus {
  outline: none;
  border-color: var(--color-info);
  box-shadow: var(--focus-ring);
}

.city-input::placeholder {
  color: var(--text-tertiary);
}

.city-input[aria-invalid="true"] {
  border-color: var(--color-error);
}

.city-input[aria-invalid="true"]:focus {
  box-shadow: var(--focus-ring-error);
}

.search-button {
  padding: var(--spacing-md) var(--spacing-xl);
  font-size: var(--font-size-base);
  font-weight: var(--font-weight-semibold);
  color: var(--color-white);
  background-color: var(--color-info);
  border: none;
  border-radius: var(--radius-md);
  cursor: pointer;
  white-space: nowrap;
  transition: background-color var(--transition-base), transform var(--transition-fast), box-shadow var(--transition-base);
  box-shadow: var(--shadow-sm);
}

.search-button:hover {
  background-color: #1d4ed8;
  box-shadow: var(--shadow-md);
}

.search-button:active {
  transform: scale(0.98);
}

.search-button:focus {
  outline: none;
  box-shadow: var(--focus-ring);
}

.search-button:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

/* Match List (City Suggestions) */
.match-list {
  position: absolute;
  top: calc(100% + var(--spacing-xs));
  left: 0;
  right: 0;
  background-color: var(--bg-primary);
  border: 1px solid var(--border-color);
  border-radius: var(--radius-md);
  box-shadow: var(--shadow-md);
  max-height: 300px;
  overflow-y: auto;
  z-index: 20;
}

.match-item {
  padding: var(--spacing-md);
  cursor: pointer;
  border-bottom: 1px solid var(--border-color);
  transition: background-color var(--transition-fast);
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.match-item:last-child {
  border-bottom: none;
}

.match-item:hover {
  background-color: var(--bg-tertiary);
}

.match-item:focus-visible {
  outline: none;
  background-color: var(--bg-tertiary);
  box-shadow: inset 0 0 0 2px var(--color-info);
}

.match-item-text {
  font-size: var(--font-size-base);
  color: var(--text-primary);
  font-weight: var(--font-weight-medium);
}

.match-item-country {
  font-size: var(--font-size-sm);
  color: var(--text-secondary);
  margin-left: var(--spacing-md);
}

/* LOADING SKELETON */
.loading-skeleton {
  padding: var(--spacing-2xl) 0;
}

.skeleton-location {
  height: 60px;
  background: linear-gradient(90deg, var(--bg-tertiary) 25%, var(--bg-secondary) 50%, var(--bg-tertiary) 75%);
  background-size: 200% 100%;
  border-radius: var(--radius-md);
  margin-bottom: var(--spacing-2xl);
  animation: skeleton-pulse 2s infinite;
}

.skeleton-card {
  background: linear-gradient(90deg, var(--bg-tertiary) 25%, var(--bg-secondary) 50%, var(--bg-tertiary) 75%);
  background-size: 200% 100%;
  border-radius: var(--radius-lg);
  margin-bottom: var(--spacing-lg);
  animation: skeleton-pulse 2s infinite;
}

.skeleton-current {
  height: 200px;
  margin-bottom: var(--spacing-2xl);
}

.skeleton-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(140px, 1fr));
  gap: var(--spacing-md);
}

.skeleton-grid .skeleton-card {
  height: 180px;
  margin-bottom: 0;
}

@media (min-width: var(--breakpoint-md)) {
  .skeleton-grid {
    grid-template-columns: repeat(5, 1fr);
  }
}

@keyframes skeleton-pulse {
  0% { background-position: 200% 0; }
  100% { background-position: -200% 0; }
}

/* ERROR STATE */
.error-container {
  background-color: var(--color-error);
  color: var(--color-white);
  padding: var(--spacing-lg);
  margin: var(--spacing-md) 0;
  border-radius: var(--radius-md);
  animation: slideDown var(--transition-base);
  box-shadow: var(--shadow-md);
}

@keyframes slideDown {
  from {
    opacity: 0;
    transform: translateY(-10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.error-content {
  display: flex;
  flex-direction: column;
  gap: var(--spacing-md);
}

.error-header {
  display: flex;
  gap: var(--spacing-sm);
  align-items: flex-start;
}

.error-icon {
  font-size: var(--font-size-2xl);
  flex-shrink: 0;
}

.error-message {
  font-size: var(--font-size-base);
  font-weight: var(--font-weight-medium);
  line-height: var(--line-height-normal);
}

.error-actions {
  display: flex;
  gap: var(--spacing-sm);
  flex-wrap: wrap;
}

.btn-retry,
.btn-refine {
  padding: var(--spacing-sm) var(--spacing-lg);
  font-size: var(--font-size-sm);
  font-weight: var(--font-weight-semibold);
  color: var(--color-error);
  background-color: var(--color-white);
  border: none;
  border-radius: var(--radius-md);
  cursor: pointer;
  transition: transform var(--transition-fast), box-shadow var(--transition-fast);
  white-space: nowrap;
}

.btn-retry:hover,
.btn-refine:hover {
  transform: translateY(-2px);
  box-shadow: var(--shadow-md);
}

.btn-retry:focus,
.btn-refine:focus {
  outline: none;
  box-shadow: 0 0 0 3px var(--color-white), 0 0 0 5px var(--color-info);
}

.btn-retry:disabled,
.btn-refine:disabled {
  opacity: 0.6;
  cursor: not-allowed;
  transform: none;
}

/* MAIN CONTENT */
.weather-content {
  padding: var(--spacing-2xl) 0;
  animation: fadeIn var(--transition-base);
}

@keyframes fadeIn {
  from { opacity: 0; }
  to { opacity: 1; }
}

/* Location Header */
.location-header {
  margin-bottom: var(--spacing-2xl);
  padding-bottom: var(--spacing-lg);
  border-bottom: 2px solid var(--border-color);
}

.location-info {
  display: flex;
  flex-direction: column;
  gap: var(--spacing-xs);
}

.location-title {
  font-size: var(--font-size-3xl);
  font-weight: var(--font-weight-bold);
  color: var(--text-primary);
  line-height: var(--line-height-tight);
  margin: 0;
}

.location-name,
.location-country {
  font-weight: var(--font-weight-bold);
}

.separator {
  margin: 0 var(--spacing-xs);
}

.location-timezone {
  font-size: var(--font-size-lg);
  color: var(--text-secondary);
  margin: 0;
}

/* WEATHER CARD */
.weather-card {
  background-color: var(--bg-secondary);
  border: 1px solid var(--border-color);
  border-radius: var(--radius-lg);
  padding: var(--spacing-