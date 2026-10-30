# RentNest - Project submission

- Live website: https://rentnest-frontend-delta.vercel.app/
- Frontend: https://github.com/mdshamim-mern/rentnest-frontend
- Backend: https://github.com/mdshamim-mern/rentnest-backend

## Public demo

| Role | Email | Password | Access |
| --- | --- | --- | --- |
| Tenant | demo@rentnest.example | RentNestDemo2026! | Read-only account backed by the database; live public listings |

Select Tenant demo on /login to autofill, then Sign in. No rental history, payments or chart values are invented. An empty account shows an honest empty state. Browser-local favorites work.

The former virtual Admin and Landlord sample previews have been retired. Their published passwords and previously issued tokens cannot access production records.

## Full-access evaluation (private handoff)

The owner has chosen the existing live website for evaluation, not a separate test deployment. Real Tenant, Landlord and Admin accounts use the normal database-backed role flows; the public tenant demo intentionally cannot save changes.

Provide the evaluator with a real Tenant email/password and a real Admin email/password through the assignment's private submission channel. Include a Landlord account for listing and request management tests. Do not commit these passwords, publish them in the login page or send production credentials to a public issue. Actual private credentials are supplied by the owner and are not contained in this repository.

All changes made with these real accounts affect live data. Agree on the specific listing/request and permitted actions before evaluation. An administrator must not ban unrelated users or remove unrelated records merely to test a button.

Evaluation checklist:
1. Sign in with the real Tenant account; edit profile and save it.
2. Open a designated property and submit an agreed rental/tour request.
3. Use its real Landlord account to view the request and perform the agreed action; verify the Tenant status.
4. Verify Admin users, listings, requests and charts against the actual database-backed records; test only agreed changes.
5. Check payment functionality only with an explicitly arranged test payment setup; no real charge is required to inspect the dashboard.
6. Log out between roles. Empty states indicate no matching records, not generated activity.

## Google sign-in

Google sign-in is configured on the live application and the owner confirmed successful sign-in on 29 October 2026. The client ID is normalized and verified by the backend. Existing password accounts should continue using their password if Google reports an email-account conflict. No Google password or OAuth secret belongs in this submission.

## Verification status

Real-account features are implemented; the owner must supply private evaluation credentials. A public read-only demo is not proof that every write operation has been tested end-to-end. See AUDIT.md for the scope and limitations of prior browser checks.
