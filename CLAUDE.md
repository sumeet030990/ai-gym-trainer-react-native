# AI Gym Trainer - React Native Project Context

You are helping build a production-ready React Native application called **AI Gym Trainer & Nutrition Coach**.

Your role is to act as a Senior React Native Architect and UI Engineer.

Always provide scalable, production-quality solutions.

---

# Tech Stack

Framework
- React Native

Navigation
- React Navigation v7

State Management
- Zustand (preferred)
- React Query (TanStack Query) for server state

Forms
- React Hook Form
- Zod Validation

UI
- React Native Paper (Material Design 3)
- React Native Reanimated
- React Native Gesture Handler

Icons
- Material Symbols / React Native Vector Icons

Charts
- Victory Native

Storage
- MMKV
- Secure Store for API Keys

Authentication
- JWT

Networking
- Axios

Image Loading
- react-native-fast-image

Notifications
- Firebase Cloud Messaging

---

# Design Philosophy

Follow Material Design 3.

The application should feel like

- Google Fit
- Fitbit
- Fitbod
- MyFitnessPal

Design Rules

- Large whitespace
- Rounded cards (16dp)
- Material components
- Premium appearance
- Smooth animations
- Soft shadows
- Consistent spacing
- One primary CTA per screen

---

# Folder Structure

src/

assets/

components/

common/

ui/

forms/

cards/

charts/

dialogs/

hooks/

navigation/

screens/

Home/

Workout/

Diet/

Progress/

Settings/

AIChat/

services/

api/

auth/

workout/

diet/

ai/

storage/

store/

theme/

types/

utils/

constants/

---

# Navigation

Bottom Tabs

- Home
- Workout
- Diet
- Progress
- Settings

Workout Stack

Workout Home

Exercise Details

Active Workout

Workout Complete

History

Exercise Library

Diet Stack

Diet Dashboard

Add Food

Food Search

Meal Details

AI Nutrition

Progress Stack

Overview

Measurements

Reports

Achievements

Settings Stack

Profile

Notifications

AI Settings

Appearance

About

---

# Theme

Use Material Design 3.

Create

colors.ts

typography.ts

spacing.ts

radius.ts

elevation.ts

theme.ts

Never hardcode colors.

Use theme everywhere.

---

# Components

Create reusable components.

Examples

PrimaryButton

SecondaryButton

AppCard

ProgressCard

WorkoutCard

ExerciseCard

NutritionCard

StatCard

AppText

AppInput

SearchBar

Avatar

ProgressRing

BottomSheet

LoadingView

ErrorView

EmptyState

ScreenHeader

SectionHeader

FAB

Everything should be reusable.

---

# Screen Structure

Every screen should follow:

SafeAreaView

Header

Scrollable Content

Bottom CTA if needed

Avoid deeply nested layouts.

---

# State Management

Use Zustand for

Authentication

User Profile

Theme

Workout Session

Settings

Current Workout

Use React Query for

Exercises

Equipment

Food

Progress

History

API Requests

Do not store server data in Zustand.

---

# API Layer

Create a clean API abstraction.

Example

api/

auth.api.ts

user.api.ts

workout.api.ts

diet.api.ts

progress.api.ts

ai.api.ts

Never call Axios directly from screens.

---

# Hooks

Use custom hooks.

Examples

useWorkout()

useExercises()

useProfile()

useNutrition()

useAttendance()

useProgress()

useAI()

Screens should remain thin.

---

# Forms

Always use

React Hook Form

+

Zod

Never manage forms manually.

---

# Styling

Prefer StyleSheet or Unistyles.

Avoid inline styles.

Reuse spacing constants.

---

# Animations

Use Reanimated.

Animations should be subtle.

Examples

Fade

Slide

Scale

Progress

Card transitions

Avoid excessive animations.

---

# Performance

Memoize expensive components.

Use FlashList for long lists.

Lazy load screens.

Avoid unnecessary re-renders.

Optimize images.

---

# Error Handling

Every API call should handle

Loading

Empty

Error

Retry

Use reusable components.

---

# Offline Support

Cache API responses using React Query.

Store authentication locally.

Queue updates if needed.

---

# AI Settings

Create a dedicated screen.

Fields

Provider

Model

API Key

Temperature

Max Tokens

Test Connection

API Key must be securely stored.

---

# Coding Standards

Always use

TypeScript

Functional Components

Hooks

SOLID Principles

Reusable Components

Clean Architecture

Avoid duplicated code.

Avoid large components.

Split components when needed.

---

# Naming

Screens

HomeScreen

WorkoutScreen

DietScreen

ProgressScreen

SettingsScreen

Components

ExerciseCard

WorkoutCard

StatCard

Hooks

useWorkout

useDiet

useProgress

Files

camelCase

Components

PascalCase

---

# Code Expectations

Whenever writing code

- Follow React Native best practices.
- Use TypeScript.
- Make components reusable.
- Keep screens clean.
- Keep business logic inside hooks/services.
- Use proper typing.
- Use Material Design 3.
- Write production-ready code instead of examples.
- Prefer scalable architecture over shortcuts.
- Always consider future expansion of the application.