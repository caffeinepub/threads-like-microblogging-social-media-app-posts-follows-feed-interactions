# Specification

## Summary
**Goal:** Rebrand the app to “Josh” (UI text, document title, header branding/logo) and update the production subdomain to `josh`.

**Planned changes:**
- Replace all user-visible “Threads” branding text in the frontend UI with “Josh”, including the sticky top header brand text.
- Update the HTML document/tab title to use “Josh” (remove “Threads”).
- Update the header branding to use a Josh logo asset and appropriate alt text, replacing the previous header logo reference.
- Change deployment configuration so the active production subdomain is exactly `josh` (not `josh-ulx`).

**User-visible outcome:** The app displays “Josh” throughout the UI (including the browser tab title and header branding/logo) and is reachable at the `josh` subdomain.
