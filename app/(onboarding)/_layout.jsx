import { Stack } from 'expo-router';

// The group has no index route, so name the screen the root guard should land on.
export const unstable_settings = {
  initialRouteName: 'goals',
};

export default function OnboardingLayout() {
  return <Stack screenOptions={{ headerShown: false }} />;
}
