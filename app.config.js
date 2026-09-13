// app.config.js (not app.json) so BACKEND_URL from .env can be read at config
// time and exposed to the app via `extra` — Expo only auto-inlines
// EXPO_PUBLIC_-prefixed vars into the JS bundle, so anything else has to be
// threaded through here and read back with expo-constants.
module.exports = {
  expo: {
    name: 'aiGymTrainer',
    slug: 'aiGymTrainer',
    scheme: 'aigymtrainer',
    version: '1.0.0',
    orientation: 'portrait',
    icon: './assets/icon.png',
    userInterfaceStyle: 'light',
    ios: {
      supportsTablet: true,
    },
    android: {
      adaptiveIcon: {
        backgroundColor: '#E6F4FE',
        foregroundImage: './assets/android-icon-foreground.png',
        backgroundImage: './assets/android-icon-background.png',
        monochromeImage: './assets/android-icon-monochrome.png',
      },
      package: 'com.anonymous.aiGymTrainer',
    },
    web: {
      favicon: './assets/favicon.png',
    },
    plugins: ['expo-router', 'expo-status-bar'],
    extra: {
      backendUrl: process.env.EXPO_PUBLIC_BACKEND_URL,
    },
  },
};
