# System Context: PocketCoach

_Last updated: 2026-11-10 by Sumeet Jadhav_

PocketCoach is an AI gym trainer. A React Native (Expo) mobile app lets gym-goers set goals, follow AI-generated workout plans, log workouts, meals and gym attendance, and track progress. A FastAPI + PostgreSQL backend handles auth (JWT), users, gyms, equipment, exercises, goals, attendance and workout logging, and uses LangChain/LangGraph with Groq or Ollama models to build personalised plans.

This file only references the components. Each component's stack, versions and conventions are in its own `PROJECT_CONTEXT.md` — read that before changing code in the component.

This file lives in the `reactNative-pocketCoach` repo. Locally, both repos sit side by side in one `PocketCoach/` folder.

## Components

| Component | Path / repo | Type | Role | Context file |
|---|---|---|---|---|
| be-pocketCoach | `../be-pocketCoach` (local) — git@github.com:sumeet030990/ai-gym-trainer-be.git | API | FastAPI + PostgreSQL backend: auth, users, gyms, equipment, exercises, goals, attendance, workout logging and AI workout plans | `claude-docs/PROJECT_CONTEXT.md` in that repo |
| reactNative-pocketCoach | This repo — git@github.com:sumeet030990/ai-gym-trainer-react-native.git | Mobile app | Expo / React Native client for gym-goers | `claude-docs/PROJECT_CONTEXT.md` |

## How they connect

| From | To | How | Contract |
|---|---|---|---|
| reactNative-pocketCoach | be-pocketCoach | REST over HTTP(S) (`fetch` + React Query), JWT bearer token | FastAPI auto-generated OpenAPI at `/openapi.json`; routes registered in `be-pocketCoach/routers/__init__.py` (no checked-in contract file) |

External services used only by be-pocketCoach (not components): PostgreSQL, Groq API, Ollama.

## Shared conventions

- **Auth:** the backend issues a JWT (PyJWT). The app sends it as a Bearer token and stores it in expo-secure-store. A 401 logs the user out.
- **Response format:** every endpoint returns `{ success, status_code, data, error: { detail } | null }`.
- **Branching:** `master` is the main branch in both repos.
- **Commits:** conventional prefixes (`feat:`, `fix:`).

## Change log

| Date | Provided by | Change |
|---|---|---|
| 2026-11-10 | Sumeet Jadhav | Initial system context created (be-pocketCoach, reactNative-pocketCoach) |
