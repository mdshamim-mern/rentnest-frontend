# UI and functionality audit — 29 October 2026

## Fixed in this review
- Google OAuth: the live public client ID contained four trailing spaces. The backend now normalizes and validates the same ID for the provider response and token audience. Frontend validates it defensively too.
- Google email-account conflicts and inactive-account failures now show actionable, allowlisted messages.
- Terms and Privacy pages had pale text on white backgrounds in dark mode. Added scoped dark surfaces and legible headings.
- Help content now describes actual tour/contact/payment flows; removed unsupported SSLCommerz and absolute security claims. WhatsApp support is named explicitly.
- Help and Terms cards stack until desktop width to avoid cramped tablet text.
- Decorative Help and dashboard icons use the existing teal family. Status/error colors and external social brand colors remain semantic exceptions.
- AI budget example uses the same dollar unit as the filters.
- Home neighborhood images are explicitly identified as interior inspiration rather than verified listing photographs.
- Registration account type has an accessible label; focused form controls have navbar scroll clearance.
- Admin users' no-match message describes search/filter results correctly.

## Browser evidence
Tested the live app with desktop 1280/1440px, tablet 768px and mobile 390px viewport samples, using light and dark themes.
- Home location form navigates to Banani-filtered listings.
- Listing advanced controls open; $100 maximum produces an empty state; Clear all restores 22 listings.
- Pagination at 8/page moves from records 1–8 to 9–16, page 2 of 3.
- Desktop listing cards measured equal 280 x 619px, four per row.
- Map view reports 21 of 22 listings with coordinates instead of inventing locations.
- Live AI search for a two-bedroom apartment in Banani below $800 applied four filters and returned one matching listing.
- Property details, photo modal, next image (1/4 to 2/4), and tour request dialog open.
- Mobile home, property details, registration, navigation and landlord add-property form remain within viewport width.
- Empty login and registration submissions display field validation. The restricted Tenant demo autofill and password visibility work.
- Real Landlord and Admin role flows are supplied privately for evaluation. Landlord rental/tour tabs show their correct data and dates; PENDING filter works.
- Admin user role filter returns only Sample Tenant; unmatched search gives an empty table. Admin rental table shows sample tenant, landlord and dates.
- Mobile dashboard navigation drawer opens and routes to Add Property.
- Contact empty submission is blocked by required field validation; no message was sent.
- Help AI guide returned an actual answer about listing properties and account requirements.
- Header, footer and detail links inspected for their destinations; mail/phone/WhatsApp actions were not sent.

## Verification limits / owner checks
- Browser OAuth button now uses the normalized client ID with no encoded spaces. The owner confirmed successful Google sign-in after the production fix.
- No real payment, new account, production listing edit, user ban, or rental/tour approval was completed. Those flows need an isolated test environment and test payment credentials for a complete transaction audit.
- Live listings and catalog totals come from the API, but ownership, factual descriptions and photo authenticity cannot be independently verified. One sampled apartment image contains a land advertisement; the owner should replace mismatched/advertising images with actual property photos.
- This is a documented representative flow audit, not a claim that every control on every route was exercised.

## Automated checks
- Backend build and 16 tests passed, including OAuth whitespace regression and demo access isolation.
- Frontend production build and 15 tests passed (AI validation/error paths, pagination, charts and theme restoration).

## Production follow-up
- Frontend f9e18e2 and backend b1e6698 deployments succeeded on Vercel.
- Rechecked deployed dark Terms on mobile and Help on tablet: readable surfaces and no mobile horizontal overflow.
- Restricted Tenant demo sign-in and saved-homes empty state also passed.
