# Project Context: Pocket Coach

_Last updated: 2026-11-10 by Sumeet Jadhav_

## Overview

Pocket Coach is a React Native (Expo) mobile app for workout tracking, nutrition logging and AI-assisted coaching, built with Material Design 3. It covers onboarding with goal setup and plan generation, workout sessions and history, an exercise library, attendance streaks, diet tracking, progress, and an in-app AI Settings screen. It talks to the be-pocketCoach backend over REST.

- **Type:** Mobile app (Expo / React Native — iOS, Android; web build also available)
- **Stage:** In development
- **Repository:** git@github.com:sumeet030990/ai-gym-trainer-react-native.git
- **Project root:** `/Users/sumeetjadhav/Documents/Projects/PocketCoach/reactNative-pocketCoach`

## System

- **Part of:** PocketCoach — system map in `SYSTEM_CONTEXT.md` (repo root)
- **Exposes:** Nothing (end-user mobile client).
- **Consumes:** be-pocketCoach FastAPI REST API (auth, users, goals/questions, workout, exercise, equipment, attendance, gyms, AI).
  - Called with `fetch` from `src/services/api/*.api.js` (shared client: `src/services/api/client.js`).
  - Base URL comes from `EXPO_PUBLIC_BACKEND_URL` via `app.config.js` `extra.backendUrl`.
  - JWT bearer auth; response envelope `{ success, status_code, data, error }`.
  - Contract: FastAPI auto-generated OpenAPI (`/openapi.json`) from `../be-pocketCoach/routers`.

## Goal

Give gym-goers a personal coach in their pocket: a guided workout plan based on their goals, easy logging of workouts and meals, progress tracking, and AI suggestions (e.g. next set weight/reps) — with a premium feel like Google Fit, Fitbod and MyFitnessPal.

## Tech stack

| Layer | Choice | Version |
|---|---|---|
| Full-stack preset | Custom (Expo mobile app + FastAPI backend in a separate repo) | — |
| Language(s) | JavaScript (`.js` / `.jsx`; no TypeScript set up) | — |
| Framework | Expo SDK / React Native / React | `~56.0.12` / `0.85.3` / `19.2.3` |
| Routing | Expo Router (file-based, `app/`) | `~56.2.11` |
| UI | React Native Paper (Material Design 3), Reanimated, Gesture Handler, `@expo/vector-icons` | `^5.15.3`, `4.3.1`, `~2.31.1`, `^15.0.2` |
| Client state | Zustand | `^5.0.14` |
| Server state / networking | TanStack React Query over a `fetch`-based API layer (no Axios) | `^5.102.8` |
| Forms | Formik + Zod | `^2.4.9`, `^4.4.3` |
| Storage | react-native-mmkv, expo-secure-store | `^3.3.3`, `~56.0.4` |
| Auth | Backend-issued JWT, stored in expo-secure-store; a 401 logs the user out | — |
| Backend | be-pocketCoach (FastAPI) — separate repo | see its own context file |
| Hosting / build / CI | To be decided (local `expo run:android` / `expo run:ios` for now) | — |
| Testing | Jest + React Native Testing Library — planned, not installed yet | latest stable when added |
| Package manager | npm | Node v20+ (per README) |

## Dependency manifest files

These files are the source of truth for package versions. Paths are relative to the project root.

| File | Purpose |
|---|---|
| `package.json` | App dependencies and npm scripts |
| `package-lock.json` | Exact installed versions (lock file) |

## Commands

Run from the project root unless noted.

| Purpose | Command | Source |
|---|---|---|
| Install | `npm install` | `README.md` |
| Run locally | `npm start` (Expo dev server); platform: `npm run android`, `npm run ios`, `npm run web`; clear cache: `npx expo start -c` | `package.json`, `README.md` |
| Test | To be decided (add once Jest is installed) | — |
| Lint / format | To be decided | — |
| Build | `npm run android` / `npm run ios` (native dev build via `expo run`); dependency check: `npx expo install --check` | `package.json`, `README.md` |

Required environment variables (names only): `EXPO_PUBLIC_BACKEND_URL`.

## Dependency & version policy

When writing or changing code for this project:

1. **Read the manifest files listed above first** and use exactly the package and runtime versions they declare. Write code against those versions' APIs — do not use features from newer versions, and do not upgrade or downgrade a package unless asked.
2. **Prefer the lock file** (when one is listed) for the exact installed version; use the manifest's range otherwise.
3. **Adding a new package:** add it to the matching manifest using the project's package manager, and pick the latest stable version that is compatible with the versions already in use. For Expo-managed packages, use `npx expo install` so the version matches SDK 56.
4. **No manifest provided, or a package not listed in any manifest:** use the **latest stable release** of that package (no alpha, beta, RC, preview or nightly builds). Check the package registry for the current version at the time the code is written, rather than relying on memory, and record the chosen version in a manifest file once one exists.
5. If a listed manifest file is missing or moved, stop and ask the user before assuming versions.
6. **Shared packages:** if the system context lists a package under **Shared dependencies**, the manifest it names there wins over this repo's manifest. Ask before changing that package's version here.

## Conventions

- Follow `CLAUDE.md` for folder structure, theming and architecture:
  - Use theme tokens from `src/theme/` — never hardcode colors.
  - Zustand for client state only; React Query for server data.
  - Call the backend only through `src/services/api/` — never from screens.
  - Keep screens thin; put logic in hooks (`src/hooks/`).
- Expo SDK 56: check the versioned Expo docs before writing code (see `AGENTS.md`).
- Commit messages use conventional prefixes (e.g. `feat:`).
- **Where the code and CLAUDE.md differ, follow the code for new work:** JavaScript (not TypeScript), Formik + Zod (not React Hook Form), React Query + `fetch` API layer (not Axios).

## Notes

- `CLAUDE.md` and `README.md` still mention TypeScript, React Hook Form and Axios; they are out of date on these points.

## Change log

Who provided or changed these details, so they can be verified later. Add a row on every create or update; never remove old rows.

| Date | Provided by | Change |
|---|---|---|
| 2026-11-10 | Sumeet Jadhav | Initial context created |
| 2026-11-10 | Sumeet Jadhav | System section: SYSTEM_CONTEXT.md now created |
