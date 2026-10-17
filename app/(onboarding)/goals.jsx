import { View, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { ActivityIndicator } from 'react-native-paper';
import ScreenHeader from '../../src/components/common/ScreenHeader';
import AppText from '../../src/components/common/AppText';
import GoalsEditor from '../../src/components/forms/goals/GoalsEditor';
import { useGeneratePlan } from '../../src/hooks/useWorkout';
import { useAuthStore } from '../../src/store/authStore';
import { colors } from '../../src/theme/colors';
import { spacing } from '../../src/theme/spacing';

// Shown by the root navigator while the user has no workout plan (current_plan_id is null).
// Saving generates the plan, which refreshes /users/me; the root guard then swaps in (tabs).
export default function OnboardingGoals() {
  const generatePlan = useGeneratePlan();
  const logout = useAuthStore((state) => state.logout);

  return (
    <SafeAreaView style={styles.container} edges={['top', 'bottom']}>
      <View style={styles.header}>
        <ScreenHeader eyebrow="Welcome" title="Set your goals" rightIcon="log-out-outline" onRightPress={logout} />
        <AppText variant="bodyMedium" color={colors.textSecondary} style={styles.intro}>
          Answer a few questions and we'll build your workout plan.
        </AppText>
      </View>

      <GoalsEditor onSaved={() => generatePlan.mutateAsync()} saveLabel="Build My Plan" />

      {generatePlan.isPending ? (
        <View style={styles.overlay}>
          <ActivityIndicator color={colors.primary} size="large" />
          <AppText variant="titleMedium" style={styles.overlayTitle}>
            Building your plan…
          </AppText>
          <AppText variant="bodyMedium" color={colors.textSecondary}>
            This can take a moment.
          </AppText>
        </View>
      ) : null}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  header: {
    paddingHorizontal: spacing.lg,
    paddingTop: spacing.xs,
    marginBottom: spacing.md,
  },
  intro: {
    marginTop: spacing.xxs,
  },
  overlay: {
    ...StyleSheet.absoluteFillObject,
    alignItems: 'center',
    justifyContent: 'center',
    gap: spacing.xs,
    backgroundColor: colors.background,
  },
  overlayTitle: {
    marginTop: spacing.sm,
  },
});
