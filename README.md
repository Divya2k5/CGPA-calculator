# AU CGPA Calculator

Installable GPA and CGPA calculator for Anna University students, built with Vite, React, Tailwind CSS, and Firebase Authentication + Firestore.

## Stack

- Vite + React 19
- Tailwind CSS
- Firebase Auth
- Firestore
- Static subject catalog from `public/subjects-data.js`
- Progressive Web App with manifest + service worker

## Features

- Department and semester driven GPA calculator
- Manual CGPA mode
- Firebase-backed sign-in and semester history
- Install prompt for supported browsers
- Offline fallback page for degraded offline access

## Environment

Only safe public Firebase client variables belong in the frontend environment:

```env
VITE_API_KEY=
VITE_AUTH_DOMAIN=
VITE_PROJECT_ID=
VITE_STORAGE_BUCKET=
VITE_MESSAGING_SENDER_ID=
VITE_APP_ID=
```

Use [.env.example](/D:/projects/CGPA-calculator/.env.example) as the template.

Do not place server-side secrets such as OpenAI, Gemini, admin SDK credentials, or private API tokens in client env files.

## Local Development

```bash
npm install
npm run dev
```

Open the Vite URL shown in the terminal.

## Production Build

```bash
npm run build
npm run preview
```

The build output is generated in `dist/`.

## Deployment Notes

- The app is configured as an SPA and works with the existing [vercel.json](/D:/projects/CGPA-calculator/vercel.json).
- `public/sw.js` only caches static assets and the offline page. It does not cache authenticated API responses or private app data.
- `manifest.webmanifest` and the PNG app icons are ready for installable PWA builds.
- Keep Firebase configuration in deployment environment variables, not in committed source files.

## Security Notes

- Raw Firebase and backend errors are sanitized before being shown in the UI.
- The service worker avoids caching navigations, `/api/*`, authorization-bearing requests, and private responses.
- Security headers are configured in [vercel.json](/D:/projects/CGPA-calculator/vercel.json) for Vercel deployments.
- Firestore security rules are still a backend responsibility and must restrict access by authenticated user ID.

## Required Backend Follow-Up

These items cannot be fully enforced from the frontend alone:

1. Review and lock down Firebase Authentication providers and authorized domains.
2. Enforce Firestore security rules so users can only read and write their own semester documents.
3. Rotate any server-side secrets that were previously stored in local env files or shared outside secure secret storage.

## Key Files

- [src/data/syllabus.js](/D:/projects/CGPA-calculator/src/data/syllabus.js)
- [src/pages/CalculatorPage.jsx](/D:/projects/CGPA-calculator/src/pages/CalculatorPage.jsx)
- [src/components/PwaBanner.jsx](/D:/projects/CGPA-calculator/src/components/PwaBanner.jsx)
- [public/sw.js](/D:/projects/CGPA-calculator/public/sw.js)
- [public/manifest.webmanifest](/D:/projects/CGPA-calculator/public/manifest.webmanifest)
