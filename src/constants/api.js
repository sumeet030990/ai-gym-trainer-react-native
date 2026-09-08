import Constants from 'expo-constants';

// BACKEND_URL (.env) is threaded through app.config.js's `extra` block at
// build time, since Expo only auto-inlines EXPO_PUBLIC_-prefixed vars into
// the JS bundle directly.
export const API_BASE_URL = Constants.expoConfig?.extra?.backendUrl ?? 'http://localhost:8000';
