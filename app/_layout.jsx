import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { PaperProvider } from 'react-native-paper';
import { theme } from '../src/theme/theme';

export default function RootLayout() {
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <PaperProvider theme={theme}>
        <StatusBar style="dark" />
        <Stack screenOptions={{ headerShown: false }} />
      </PaperProvider>
    </GestureHandlerRootView>
  );
}
