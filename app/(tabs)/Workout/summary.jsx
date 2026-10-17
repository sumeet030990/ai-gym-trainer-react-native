import { useState } from 'react';
import { View, ScrollView, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import { Snackbar } from 'react-native-paper';
import ScreenHeader from '../../../src/components/common/ScreenHeader';
import AppText from '../../../src/components/common/AppText';
import PrimaryButton from '../../../src/components/common/PrimaryButton';
import Loader from '../../../src/components/common/Loader';
import ErrorView from '../../../src/components/common/ErrorView';
import ExerciseCard from '../../../src/components/cards/ExerciseCard';
import RestDayCard from '../../../src/components/cards/RestDayCard';
import StatCard from '../../../src/components/cards/StatCard';
import {
  useTodayWorkout,
  useHasLoggedWorkoutToday,
  useLogWorkoutMutation,
  useWorkoutSessionSync,
  buildWorkoutLogPayload,
} from '../../../src/hooks/useWorkout';
import { useUserProfile } from '../../../src/hooks/useUserProfile';
import { useAttendanceStreak, useLogAttendanceMutation } from '../../../src/hooks/useAttendanceStreak';
import { useWorkoutSessionStore } from '../../../src/store/workoutSessionStore';
import { colors } from '../../../src/theme/colors';
import { spacing } from '../../../src/theme/spacing';

export default function WorkoutSummary() {
  const { data: workout, isLoading, isError, refetch } = useTodayWorkout();
  const { data: profile } = useUserProfile();
  const { data: attendance, isLoading: attendanceLoading } = useAttendanceStreak(profile?.user?.id);
  const { data: hasLoggedToday, isLoading: loggedTodayLoading } = useHasLoggedWorkoutToday();
  const sessionSync = useWorkoutSessionSync(attendance?.todayAttendanceId, Boolean(attendance));
  const completedSets = useWorkoutSessionStore((state) => state.completedSets);
  const [snackbarMessage, setSnackbarMessage] = useState('');

  const logAttendance = useLogAttendanceMutation();
  const logWorkout = useLogWorkoutMutation();

  const exercises = workout?.exercises ?? [];
  const isComplete = (exercise) => (completedSets[exercise.id]?.length ?? 0) >= exercise.sets;
  const nextExercise = exercises.find((exercise) => !isComplete(exercise));
  const isStarting = logAttendance.isPending || logWorkout.isPending;
  const showFooter = Boolean(workout) && !workout.isRestDay && exercises.length > 0;

  // Checks in (unless already checked in today) and opens today's workout log,
  // carrying over any sets logged before starting; each set after that is saved
  // from the Exercise Details screen.
  const handleStartWorkout = async () => {
    try {
      let attendanceId = attendance?.todayAttendanceId;
      if (!attendanceId) {
        const record = await logAttendance.mutateAsync();
        attendanceId = record.id;
      }
      await logWorkout.mutateAsync(buildWorkoutLogPayload(exercises, completedSets, attendanceId));
      router.push(`/Workout/exercise/${(nextExercise ?? exercises[0]).id}`);
    } catch (error) {
      setSnackbarMessage(error.message ?? 'Could not start your workout. Please try again.');
    }
  };

  const renderFooterAction = () => {
    if (!hasLoggedToday) {
      return (
        <PrimaryButton
          icon="play"
          onPress={handleStartWorkout}
          loading={isStarting}
          disabled={isStarting || attendanceLoading || loggedTodayLoading || sessionSync.isSyncing}
        >
          Start Workout
        </PrimaryButton>
      );
    }

    if (!nextExercise) {
      return (
        <>
          <AppText variant="bodySmall" style={styles.footerNote}>
            Every set is logged. Great job!
          </AppText>
          <PrimaryButton icon="check" disabled>
            Workout Complete
          </PrimaryButton>
        </>
      );
    }

    return (
      <PrimaryButton
        icon="play"
        onPress={() => router.push(`/Workout/exercise/${nextExercise.id}`)}
        disabled={sessionSync.isSyncing}
      >
        Continue Workout
      </PrimaryButton>
    );
  };

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <View style={styles.header}>
        <ScreenHeader eyebrow="Workout Summary" title={workout?.title ?? 'Your Workout'} rightIcon="close" onRightPress={() => router.back()} />
      </View>

      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        {isLoading || sessionSync.isSyncing ? (
          <Loader height={260} />
        ) : isError || !workout ? (
          <ErrorView message="Couldn't load today's workout." onRetry={refetch} />
        ) : sessionSync.isError ? (
          <ErrorView message="Couldn't load the sets you've already logged." onRetry={sessionSync.refetch} />
        ) : workout.isRestDay ? (
          <RestDayCard />
        ) : (
          <>
            <View style={styles.statsRow}>
              <StatCard icon="barbell-outline" iconColor={colors.primary} iconBackground={colors.primaryContainer} value={exercises.length} label="Exercises" />
              <StatCard icon="flame-outline" iconColor={colors.tertiary} iconBackground={colors.tertiaryContainer} value={workout.calories ?? '—'} label="Est. Calories" />
              <StatCard icon="time-outline" iconColor={colors.secondary} iconBackground={colors.secondaryContainer} value={workout.duration ?? '—'} label="Duration" />
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
          </>
        )}
      </ScrollView>

      {showFooter && <View style={styles.footer}>{renderFooterAction()}</View>}

      <Snackbar visible={Boolean(snackbarMessage)} onDismiss={() => setSnackbarMessage('')} duration={4000}>
        {snackbarMessage}
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
  footerNote: {
    textAlign: 'center',
    color: colors.onSurfaceVariant,
    marginBottom: spacing.sm,
  },
});
