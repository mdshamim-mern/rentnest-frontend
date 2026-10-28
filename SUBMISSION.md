# RentNest — Project submission

- Live website: https://rentnest-frontend-delta.vercel.app/
- Frontend: https://github.com/mdshamim-mern/rentnest-frontend
- Backend: https://github.com/mdshamim-mern/rentnest-backend

## Evaluation credentials

| Role | Email | Password | Access |
| --- | --- | --- | --- |
| User / Tenant | demo@rentnest.example | RentNestDemo2026! | Read-only tenant dashboard |
| Landlord | landlord.demo@rentnest.example | RentNestLandlordDemo2026! | Isolated read-only landlord dashboard with sample data |
| Admin | admin.demo@rentnest.example | RentNestAdminDemo2026! | Isolated read-only admin dashboard with sample data |

Open /login, select Tenant, Landlord or Admin demo to fill the credentials, then select Sign in. Log out before switching accounts.

Admin demo supports overview charts, users, properties, requests, messages, profile and saved-search views. All admin demo API requests are intercepted server-side; unlisted endpoints and writes are denied. No real administrator password or private production records are shared. Sample data is labelled in the workspace.

Tenant demo may have empty requests/payments because it does not create real transactions. Registration is available for ordinary tenant/landlord accounts. Google login requires provider configuration and is not part of these evaluation credentials.
