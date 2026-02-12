# Specification

## Summary
**Goal:** Serve the production app at `https://josh.caffeine.xyz` instead of `https://josh-ulx.caffeine.xyz`, while keeping existing links working via redirect.

**Planned changes:**
- Update production deployment configuration to use `josh.caffeine.xyz` as the primary/canonical app URL.
- Configure a redirect (or equivalent) from `josh-ulx.caffeine.xyz` to `josh.caffeine.xyz` that preserves full path and query/hash routes.
- Verify that Internet Identity sign-in and authenticated actions still function correctly after the redirect.

**User-visible outcome:** Users can access the app at `https://josh.caffeine.xyz`, and any existing `https://josh-ulx.caffeine.xyz/...` links continue to work by redirecting to the new subdomain without breaking routes or sign-in.
