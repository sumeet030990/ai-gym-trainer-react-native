# AI Gym Trainer & Nutrition Coach

A production-quality React Native (Expo) app for workout tracking, nutrition logging, and AI-assisted coaching — built with Material Design 3.

## Tech Stack

- **Framework:** React Native + Expo (SDK 56), Expo Router
- **UI:** React Native Paper (Material Design 3), Reanimated, Gesture Handler
- **State:** Zustand (client state), MMKV / Secure Store (persistence)
- **Forms:** React Hook Form + Zod
- **Language:** TypeScript / JavaScript (functional components, hooks)

## Prerequisites

- [Node.js](https://nodejs.org/) v20 or later (tested with v24)
- npm v10+
- [Expo CLI](https://docs.expo.dev/more/expo-cli/) (installed automatically via `npx`)
- For native builds:
  - **iOS:** macOS with Xcode + CocoaPods
  - **Android:** Android Studio with an emulator or a physical device, JDK 17

## Getting Started

1. **Install dependencies**

   ```bash
   npm install
   ```

2. **Start the development server**

   ```bash
   npm start
   ```

   This launches the Expo dev server. From there you can:
   - Press `i` to open the iOS simulator
   - Press `a` to open the Android emulator
   - Scan the QR code with the **Expo Go** app on a physical device

3. **Run on a specific platform directly**

   ```bash
   npm run android   # Build & run on Android
   npm run ios       # Build & run on iOS
   npm run web       # Run in a web browser
   ```

## Available Scripts

| Script            | Description                              |
| ----------------- | ----------------------------------------- |
| `npm start`        | Start the Expo dev server                |
| `npm run android`  | Build and run the app on Android          |
| `npm run ios`      | Build and run the app on iOS              |
| `npm run web`      | Run the app in a web browser              |

## AI Configuration

The app includes an in-app **AI Settings** screen (Settings → AI) where you configure:

- Provider
- Model
- API Key
- Temperature
- Max Tokens

API keys are stored securely on-device via `expo-secure-store` — no `.env` file or manual configuration is required to run the app itself.

## Project Structure

```
app/                        # Expo Router file-based routes
  (tabs)/
    index.jsx               # Home
    Diet.jsx                # Diet tab
    Workout/                # Workout stack (list, exercise details, history, library, summary)
    Settings/                # Settings stack (profile, goals, AI, about)

src/
  components/
    cards/                 # WorkoutCard, ExerciseCard, StatCard, NutritionCard, etc.
    common/                # AppText, AppInput, PrimaryButton, BottomSheet, etc.
    dialogs/               # Filter bottom sheets
  hooks/                   # useWorkout, useNutrition, useExerciseLibrary, etc.
  services/
    api/                   # API abstraction (e.g. ai.api.js)
    storage/               # MMKV + Secure Store wrappers
  store/                   # Zustand stores (goals, profile, AI config, workout session)
  theme/                   # colors, typography, spacing, radius, elevation, theme
  utils/
    constants/             # App-wide constants (e.g. exercises list)
    schemas/               # Zod validation schemas
```

## Development Notes

- This project targets **Expo SDK 56** — see [AGENTS.md](AGENTS.md) for a note on checking versioned Expo docs before making changes, since APIs have shifted from earlier SDKs.
- Follow the architecture and conventions documented in [CLAUDE.md](CLAUDE.md) (folder structure, state management rules, theming, coding standards) when contributing.

## Troubleshooting

- **Metro bundler cache issues:** `npx expo start -c`
- **Native module issues (Android/iOS):** delete `android`/`ios` build artifacts and re-run `npx expo prebuild --clean` if using a custom dev client
- **Dependency version mismatches:** `npx expo install --check`

## License

See [LICENSE](LICENSE).
