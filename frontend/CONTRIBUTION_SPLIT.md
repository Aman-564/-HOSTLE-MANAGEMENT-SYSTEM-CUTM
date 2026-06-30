# Frontend Contribution Split

Keep the Next.js source folders (`app`, `components`, and `lib`) in their current locations. These framework folders are required for the frontend to run correctly.

Use the three `part-*` folders as student ownership areas. Each folder contains the scope, real files to edit, and a checklist for that frontend contributor.

## Student 1: Auth and Landing UI

Folder: `part-1-auth-ui`

Owns the first screen, login flow, theme wrapper, and shared visual polish.

Main files:
- `app/page.jsx`
- `app/layout.jsx`
- `app/globals.css`
- `components/login-panel.jsx`
- `components/theme-provider.jsx`

## Student 2: Dashboard UI

Folder: `part-2-dashboard-ui`

Owns role dashboards, dashboard preview sections, charts, cards, tables, and user-facing dashboard interactions.

Main files:
- `app/dashboard/[role]/page.jsx`
- `components/dashboard-preview.jsx`
- `components/operations-dashboard.jsx`
- `components/ui.jsx`

## Student 3: API and Data Layer

Folder: `part-3-api-data`

Owns frontend API calls, mock data, environment variables, and integration between UI screens and backend endpoints.

Main files:
- `lib/api.js`
- `lib/mock-data.js`
- `.env.example`
- `.env.local`
- `next.config.mjs`

## Team Rule

Before final submission, run this from the `frontend` folder:

```powershell
npm run build
```
