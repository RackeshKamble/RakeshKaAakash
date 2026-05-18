# Tasks: Weather Intelligence Web App

**Input**: Design documents from `/specs/003-weather-intelligence-web-app/`

## Phase 1: Setup (Shared Infrastructure)

**Purpose**: Establish the frontend project, shared UI shell, and baseline style system.

- [ ] T001 Create or verify `package.json`, `vite.config.ts`, `tsconfig.json`, and `.gitignore` in the repository root
- [ ] T002 Create `src/main.tsx` and `src/App.tsx` with the React entrypoint and application shell
- [ ] T003 Create `src/index.css` with CSS variables, day/night theme tokens, and responsive base styles
- [ ] T004 Create `src/types.ts` for shared weather and UI data models
- [X] T005 Create `tests/` directory and add `README.md` describing validation steps for responsiveness and accessibility

---

## Phase 2: Foundational (Blocking Prerequisites)

**Purpose**: Build the core weather integration, caching, persistence, and shared hooks required by all stories.

- [ ] T006 [P] Implement `src/services/cache.ts` with TTL-based in-memory caching and expiry support
- [ ] T007 [P] Implement `src/hooks/useDebouncedValue.ts` for search input throttling and `src/hooks/useLocalStorage.ts` for browser persistence
- [ ] T008 [P] Implement `src/i18n/translations.ts` with UI text keys, English fallback, and language lookup helper
- [ ] T009 Implement `src/services/weatherApi.ts` with WeatherAPI.com integration, request deduplication, error handling, offline fallback, and mock/local snapshot fallback
- [ ] T010 Implement `src/services/cache.ts` localStorage fallback for `weather:{query}` and `search:{query}` payloads
- [ ] T011 Implement `src/App.tsx` global state for active view, selected city, weather payload, favorites, theme, language, loading, and error status
- [ ] T012 Create shared presentation patterns in `src/components/LoadingSkeleton.tsx` and `src/components/ErrorMessage.tsx`

---

## Phase 3: User Story 1 - Search and current weather overview (Priority: P1)

**Goal**: Deliver a search-driven current weather dashboard with AQI, humidity, recommendations, and non-blocking loading.

**Independent Test**: Enter a valid city and verify the dashboard displays current weather, humidity, AQI, recommendation text, and a responsive loading state.

- [ ] T013 Implement `src/components/SearchBar.tsx` with accessible text entry, `Enter` submission, and search suggestion selection
- [ ] T014 Implement city disambiguation results in `src/App.tsx` or a dedicated search results component with `City, Region/Country` labels
- [ ] T015 Implement current weather display in `src/components/CurrentWeatherCard.tsx` with condition icon, temperature, feels-like, humidity, AQI, and last-updated status
- [ ] T016 Implement weather-based recommendation logic in `src/utils/weatherUtils.ts` and expose recommendations in the dashboard
- [ ] T017 Add loading skeletons to the dashboard state in `src/App.tsx` and ensure the UI remains interactive while requests are pending
- [ ] T018 Add invalid city handling and retry flow in `src/App.tsx` using `src/components/ErrorMessage.tsx`

---

## Phase 4: User Story 2 - Forecast, map, and historical snapshot (Priority: P2)

**Goal**: Deliver the 5-day forecast, map preview, and cached snapshot support for offline review.

**Independent Test**: Search a city, switch to forecast and map views, and verify forecast cards, map preview, and cached snapshot display correctly.

- [ ] T019 Implement `src/components/ForecastCards.tsx` to render forecast days with icons, high/low temps, humidity, and rain chance
- [X] T020 Add local timezone handling for forecast labels in `src/services/weatherApi.ts` and when rendering dates in `src/components/ForecastCards.tsx`
- [ ] T021 Implement `src/components/MapView.tsx` with responsive embedded OpenStreetMap preview using selected city coordinates
- [X] T022 Implement historical snapshot storage in `src/services/weatherApi.ts` and expose snapshot notice in `src/App.tsx`
- [X] T023 Add offline snapshot UI text in `src/App.tsx` to indicate stale or cached weather data
- [ ] T024 Add graceful fallback for missing forecast fields in `src/components/ForecastCards.tsx`

---

## Phase 5: User Story 3 - Favorites, alerts, and settings (Priority: P3)

**Goal**: Deliver favorites persistence, accessible alerts, and theme/language settings.

**Independent Test**: Save a city to favorites, refresh the app, verify persistence, and verify alert fallback and settings changes.

- [ ] T025 Implement `src/components/FavoritesPanel.tsx` with add/remove favorite actions and duplicate prevention
- [ ] T026 Persist favorites in `localStorage` through `src/hooks/useLocalStorage.ts` and initialize from storage in `src/App.tsx`
- [ ] T027 Implement `src/components/AlertBanner.tsx` to display active alerts or a fallback notice when alerts are unavailable
- [ ] T028 Implement `src/components/ThemeToggle.tsx` and `src/components/LanguageSwitcher.tsx` with persisted theme and language settings
- [ ] T029 Ensure missing translation keys fall back to English in `src/i18n/translations.ts`
- [ ] T030 Ensure alert messages use icons plus text and do not rely solely on color

---

## Phase 6: Polish & QA

**Purpose**: Validate responsiveness, accessibility, error handling, caching behavior, and documentation.

- [ ] T031 [P] Improve mobile/tablet/desktop responsiveness in `src/index.css` and component layouts
- [X] T032 [P] Add reduced motion support using `prefers-reduced-motion` in `src/index.css` and component transitions
- [ ] T033 [P] Validate WCAG contrast for day/night theme colors in `src/index.css`
- [X] T034 [P] Add keyboard focus styles for all interactive elements in `src/index.css`
- [ ] T035 Document the WeatherAPI integration flow and fallback strategy in `specs/003-weather-intelligence-web-app/plan.md` or `README.md`
- [ ] T036 Document local persistence behavior for favorites, snapshots, theme, and language in `specs/003-weather-intelligence-web-app/spec.md`
- [X] T037 Create a manual acceptance checklist in `tests/README.md` for edge cases such as API rate limit, network failure, and invalid city input
- [ ] T038 Verify `npm run build` succeeds and there are no TypeScript errors in `src/`

---

## Dependencies & Execution Order

### Phase dependencies

- Phase 1 must complete before Phase 2 begins.
- Phase 2 is foundational and must complete before any user story phase begins.
- User Story phases may proceed in priority order once foundational work is done.
- Phase 6 is final polish after all stories are implemented.

### User story dependencies

- User Story 1 is the MVP and should be completed first.
- User Story 2 can be developed in parallel once foundation is ready.
- User Story 3 depends on the same foundation but is independently testable.

### Parallel opportunities

- `T006`, `T007`, and `T008` can run in parallel in Phase 2.
- `T013` and `T014` can run concurrently with `T015` in Phase 3.
- `T019` and `T021` can run in parallel in Phase 4.
- `T025`, `T026`, and `T028` can run in parallel in Phase 5.
- Phase 6 polish tasks labeled `[P]` can run in parallel.

---

## Implementation Strategy

### MVP first

1. Complete Phase 1 setup.
2. Complete Phase 2 foundational services and shared state.
3. Complete Phase 3 user story so the app can search and show current weather.
4. Validate the MVP with edge cases, accessibility, and build success.

### Incremental delivery

1. Deliver Search + Current Weather first.
2. Add Forecast, Map, and Snapshot next.
3. Add Favorites, Alerts, and Settings last.
4. Finish with Polish & QA for accessibility, responsiveness, and documentation.

---

## Definition of Done

- [ ] User can search for a valid city and see current weather details.
- [ ] Search input is debounced and prevents repeated API calls.
- [ ] Current weather dashboard shows temperature, icon, humidity, AQI, and recommendation.
- [ ] Forecast view displays 5-day weather with icons, temperatures, humidity, and rain chance.
- [ ] Map view shows the selected city location responsively.
- [ ] Favorites persist locally and reload after refresh.
- [ ] Alerts display or fallback gracefully when unavailable.
- [ ] Offline mode uses last-known cached data when API or network fails.
- [ ] Empty/missing forecast data is handled gracefully.
- [ ] Duplicate favorite cities are prevented.
- [ ] Same-name cities are disambiguated using region/country tags.
- [ ] Theme and language preferences persist in localStorage.
- [ ] UI supports keyboard navigation and visible focus states.
- [ ] Color contrast meets WCAG 2.1 AA in day/night mode.
- [ ] Motion respects reduced motion preferences.
- [ ] Documentation of API integration, caching, and fallback behavior is complete.
- [ ] `npm run build` passes with no TypeScript errors.
