import { useEffect } from 'react';
import { StyleSheet, View } from 'react-native';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { PaperProvider } from 'react-native-paper';
import { QueryClientProvider } from '@tanstack/react-query';
import { queryClient } from '../src/services/api/queryClient';
import { useAuthStore } from '../src/store/authStore';
import Loader from '../src/components/common/Loader';
import ErrorView from '../src/components/common/ErrorView';
import { useUserProfile } from '../src/hooks/useUserProfile';
import { theme } from '../src/theme/theme';

// Reads the JWT out of SecureStore once on launch, then gates the top-level
// route groups on it so a signed-out user can never deep-link into (tabs) and
// a signed-in user never lands back on (auth). A signed-in user without a
// workout plan yet (current_plan_id is null, i.e. new accounts) is held in
// (onboarding) until one is generated.
function RootNavigator() {
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
  const isHydrating = useAuthStore((state) => state.isHydrating);
  const hydrate = useAuthStore((state) => state.hydrate);
  const profileQuery = useUserProfile({ enabled: isAuthenticated });

  useEffect(() => {
    hydrate();
  }, [hydrate]);

  if (isHydrating || (isAuthenticated && profileQuery.isPending)) {
    return <Loader style={styles.loader} />;
  }

  // Only when /users/me has never loaded; a failed background refetch keeps
  // the cached data, so the user stays where they are.
  if (isAuthenticated && profileQuery.isError && !profileQuery.data) {
    return (
      <View style={styles.loader}>
        <ErrorView message={profileQuery.error.message} onRetry={() => profileQuery.refetch()} />
      </View>
    );
  }

  const hasPlan = Boolean(profileQuery.data?.user?.current_plan_id);

  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Protected guard={isAuthenticated && hasPlan}>
        <Stack.Screen name="(tabs)" />
      </Stack.Protected>
      <Stack.Protected guard={isAuthenticated && !hasPlan}>
        <Stack.Screen name="(onboarding)" />
      </Stack.Protected>
      <Stack.Protected guard={!isAuthenticated}>
        <Stack.Screen name="(auth)" />
      </Stack.Protected>
    </Stack>
  );
}

export default function RootLayout() {
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <QueryClientProvider client={queryClient}>
        <PaperProvider theme={theme}>
          <StatusBar style="dark" />
          <RootNavigator />
        </PaperProvider>
      </QueryClientProvider>
    </GestureHandlerRootView>
  );
}

const styles = StyleSheet.create({
  loader: {
    flex: 1,
    justifyContent: 'center',
  },
});
