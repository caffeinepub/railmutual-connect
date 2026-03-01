# Specification

## Summary
**Goal:** Fix the Internet Identity authentication flow, account initialization, and profile save permissions so the full login-to-dashboard flow works correctly.

**Planned changes:**
- Fix `registerOrLogin` in the backend so it reliably creates a new user record for first-time principals and returns the existing record on subsequent logins without errors
- Fix backend `saveProfile` permissions so an authenticated user can create and update their own profile, with data persisted to stable storage
- Ensure the frontend `AuthPage` correctly handles the `registerOrLogin` response and routes to profile setup or dashboard as appropriate
- Ensure the `ProfilePage` successfully submits profile updates and redirects to the dashboard
- Ensure the dashboard correctly loads and displays the authenticated user's profile stats and match count

**User-visible outcome:** A user can log in via Internet Identity, have their account initialized automatically, save their profile without errors, and be redirected to the dashboard where their data is displayed correctly.
