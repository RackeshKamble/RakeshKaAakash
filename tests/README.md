# Weather Intelligence App Validation

This file documents manual validation steps for responsiveness, accessibility, error states, and cache behavior.

## Validation Scenarios

### 1. Search and current weather
- Enter a valid city (e.g. London, UK).
- Confirm current weather appears with temperature, condition icon, humidity, AQI, and recommendation.
- Confirm the UI remains responsive while loading.

### 2. Debounce behavior
- Type a city name quickly.
- Verify the app does not make a request for every keystroke.

### 3. Invalid city handling
- Enter a nonsense city name.
- Confirm the app shows "City not found" and offers retry.

### 4. Forecast and map view
- Select a valid city, switch to Forecast, and verify 5-day forecast cards render.
- Switch to Map view and verify the selected city is shown on the embedded map.

### 5. Favorites persistence
- Save a city to favorites.
- Refresh the browser and confirm the favorite remains available.
- Attempt to add the same favorite again and verify duplicate prevention feedback.

### 6. Offline / fallback behavior
- Disable network access or remove the API key.
- Reload a previously viewed city and confirm cached data loads with an offline notice.

### 7. Accessibility and keyboard navigation
- Tab through the search field, buttons, and tabs.
- Confirm focus rings are visible and interactive elements are reachable.
- Verify loading/error status messages are announced in the status region.

### 8. Internationalization and theming
- Switch language and confirm labels update.
- Switch theme between day and night and confirm color changes preserve contrast.

### 9. Reduced motion
- Enable reduced motion in the operating system.
- Confirm the interface avoids non-essential animation.

## Notes
- Use browser dev tools to inspect console errors.
- Verify `npm run build` passes before marking implementation complete.
