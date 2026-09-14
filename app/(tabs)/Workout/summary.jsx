import { useState } from 'react';
import { View, ScrollView, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import { Snackbar } from 'react-native-paper';
import ScreenHeader from '../../../src/components/common/ScreenHeader';
import AppText from '../../../src/components/common/AppText';
import PrimaryButton from '../../../src/components/common/PrimaryButton';
import ExerciseCard from '../../../src/components/cards/ExerciseCard';
import StatCard from '../../../src/components/cards/StatCard';
import { useTodayWorkout } from '../../../src/hooks/useWorkout';
import { useUserProfile } from '../../../src/hooks/useUserProfile';
import { useAttendanceStreak, useLogAttendanceMutation } from '../../../src/hooks/useAttendanceStreak';
import { useWorkoutSessionStore } from '../../../src/store/workoutSessionStore';
import { TODAY_WORKOUT_EXERCISE_IDS, getExerciseById } from '../../../src/utils/constants/exercises';
import { colors } from '../../../src/theme/colors';
import { spacing } from '../../../src/theme/spacing';

export default function WorkoutSummary() {
  const { data: workout } = useTodayWorkout();
  const { data: profile } = useUserProfile();
  const { data: attendance } = useAttendanceStreak(profile?.user?.id);
  const completedSets = useWorkoutSessionStore((state) => state.completedSets);
  const exercises = TODAY_WORKOUT_EXERCISE_IDS.map(getExerciseById).filter(Boolean);
  const [errorMessage, setErrorMessage] = useState('');

  const logAttendance = useLogAttendanceMutation();
  const alreadyCheckedInToday = Boolean(attendance?.hasCheckedInToday);

  const handleStartWorkout = () => {
    logAttendance.mutate(undefined, {
      onSuccess: () => {
        if (exercises[0]) router.push(`/Workout/exercise/${exercises[0].id}`);
      },
      onError: (error) => setErrorMessage(error.message ?? 'Could not log attendance. Please try again.'),
    });
  };

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <View style={styles.header}>
        <ScreenHeader eyebrow="Workout Summary" title={workout?.title ?? 'Your Workout'} rightIcon="close" onRightPress={() => router.back()} />
      </View>

      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        <View style={styles.statsRow}>
          <StatCard icon="barbell-outline" iconColor={colors.primary} iconBackground={colors.primaryContainer} value={exercises.length} label="Exercises" />
          <StatCard icon="flame-outline" iconColor={colors.tertiary} iconBackground={colors.tertiaryContainer} value={`${workout?.calories ?? 0}`} label="Est. Calories" />
          <StatCard icon="time-outline" iconColor={colors.secondary} iconBackground={colors.secondaryContainer} value={workout?.duration ?? '—'} label="Duration" />
        </View>

        <AppText variant="titleLarge" style={styles.sectionTitle}>
          Exercises
        </AppText>
        <View style={styles.list}>
          {exercises.map((exercise) => {
            const doneSets = completedSets[exercise.id]?.length ?? 0;
            const status = doneSets >= exercise.sets ? 'complete' : 'pending';
            return (
              <ExerciseCard
                key={exercise.id}
                exercise={exercise}
                status={status}
                onPress={() => router.push(`/Workout/exercise/${exercise.id}`)}
              />
            );
          })}
        </View>
      </ScrollView>

      <View style={styles.footer}>
        {alreadyCheckedInToday && (
          <AppText variant="bodySmall" style={styles.checkedInNote}>
            You've already checked in today
          </AppText>
        )}
        <PrimaryButton
          icon="play"
          onPress={handleStartWorkout}
          loading={logAttendance.isPending}
          disabled={logAttendance.isPending || alreadyCheckedInToday}
        >
          Start Workout
        </PrimaryButton>
      </View>

      <Snackbar visible={Boolean(errorMessage)} onDismiss={() => setErrorMessage('')} duration={4000}>
        {errorMessage}
      </Snackbar>
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
  },
  content: {
    padding: spacing.lg,
    paddingBottom: spacing.xxxl,
    gap: spacing.lg,
  },
  statsRow: {
    flexDirection: 'row',
    gap: spacing.sm,
  },
  sectionTitle: {
    marginBottom: -spacing.xs,
  },
  list: {
    gap: spacing.sm,
  },
  footer: {
    padding: spacing.lg,
  },
  checkedInNote: {
    textAlign: 'center',
    color: colors.onSurfaceVariant,
    marginBottom: spacing.sm,
  },
});
