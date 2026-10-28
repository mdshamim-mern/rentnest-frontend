# Provider setup

## Google sign-in
Create a Google Auth Platform Web application client. Add https://rentnest-frontend-delta.vercel.app as an authorized JavaScript origin. Configure branding/audience and test users as required. Set GOOGLE_CLIENT_ID on the backend Vercel project's Production environment and redeploy that project. This application uses the GIS JavaScript popup callback, not a redirect-code flow; a client secret is not used.

Verify /api/auth/providers returns the configured public client ID, then sign in with a test Google account. Existing password accounts are not silently linked by email; use a fresh test identity or the existing password login.

## Gemini
Set GEMINI_API_KEY in the frontend Vercel project's Production environment. Do not use a NEXT_PUBLIC prefix or commit the key. Optional GEMINI_MODEL selects a supported text model; default gemini-2.5-flash. Redeploy after environment changes.

POST /api/ai-search with {"text":"2 bed apartment in Banani under 800"}. A successful response must have success:true, source:ai and validated filters. POST /api/ai-assistant with {"text":"How do I request a tour?"} for the second AI feature, also available on /help.

Missing config returns 503; provider failure 502; timeout 504; quota 429; unrecognized search 422; invalid input 400. No keyword fallback is presented as AI. On failure existing filters and input remain unchanged. Provider output is validated, not executed or rendered as HTML. Configure provider quota/budget controls for the public endpoints.

A deployed route and passing mocked tests do not prove provider configuration. Complete the live tests above after setting credentials.
