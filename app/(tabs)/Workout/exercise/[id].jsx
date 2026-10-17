import { useState } from 'react';
import { View, ScrollView, StyleSheet, Pressable } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router, useLocalSearchParams } from 'expo-router';
import { Snackbar } from 'react-native-paper';
import { Ionicons } from '@expo/vector-icons';
import ScreenHeader from '../../../../src/components/common/ScreenHeader';
import AppText from '../../../../src/components/common/AppText';
import BottomSheet from '../../../../src/components/common/BottomSheet';
import ExerciseAnimation from '../../../../src/components/cards/ExerciseAnimation';
import SetRow from '../../../../src/components/cards/SetRow';
import ErrorView from '../../../../src/components/common/ErrorView';
import Loader from '../../../../src/components/common/Loader';
import {
  useTodayWorkout,
  useLogWorkoutMutation,
  useWorkoutSessionSync,
  buildWorkoutLogPayload,
  canSyncExercise,
} from '../../../../src/hooks/useWorkout';
import { useUserProfile } from '../../../../src/hooks/useUserProfile';
import { useAttendanceStreak } from '../../../../src/hooks/useAttendanceStreak';
import { useSetSuggestion } from '../../../../src/hooks/useSetSuggestion';
import { useWorkoutSessionStore } from '../../../../src/store/workoutSessionStore';
import { getExerciseById } from '../../../../src/utils/constants/exercises';
import { colors } from '../../../../src/theme/colors';
import { spacing } from '../../../../src/theme/spacing';
import { radius } from '../../../../src/theme/radius';

export default function ExerciseDetails() {
  const { id } = useLocalSearchParams();
  const { data: workout, isLoading: workoutLoading } = useTodayWorkout();
  // Today's plan comes first (that's what the Summary links to); the mock
  // library is a fallback for screens still routing by its ids.
  const exercise = workout?.exercises.find((item) => item.id === id) ?? getExerciseById(id);

  const completedSets = useWorkoutSessionStore((state) => state.completedSets);
  const logSet = useWorkoutSessionStore((state) => state.logSet);
  const updateSet = useWorkoutSessionStore((state) => state.updateSet);
  const sets = exercise ? completedSets[exercise.id] ?? [] : [];
  const { data: suggestion } = useSetSuggestion(exercise, sets.length, sets);
  const [howToVisible, setHowToVisible] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');

  const { data: profile } = useUserProfile();
  const { data: attendance } = useAttendanceStreak(profile?.user?.id);
  const logWorkout = useLogWorkoutMutation();
  const attendanceId = attendance?.todayAttendanceId;
  const canSync = canSyncExercise(exercise);
  // Sets can't be logged until the session's saved sets are loaded, since each save replaces them.
  const sessionSync = useWorkoutSessionSync(attendanceId, Boolean(attendance));

  // Sends this exercise's full set list (read after the store update) so the
  // server replaces what it had; sets stay in the store if the save fails,
  // and go up with the next one.
  const saveExerciseSets = () => {
    if (!canSync || !attendanceId) return;
    const { completedSets: latestSets } = useWorkoutSessionStore.getState();
    logWorkout.mutate(buildWorkoutLogPayload([exercise], latestSets, attendanceId), {
      onError: (error) => setSnackbarMessage(error.message ?? "Couldn't save this set. It'll retry with your next one."),
    });
  };

  const handleLogSet = (data) => {
    logSet(exercise.id, data);
    saveExerciseSets();
  };

  const handleUpdateSet = (setIndex, data) => {
    updateSet(exercise.id, setIndex, data);
    saveExerciseSets();
  };

  const syncNote = !canSync
    ? "This exercise isn't in the exercise library, so its sets are only kept on this device."
    : !attendanceId
      ? 'Start your workout from the summary to save your sets.'
      : null;

  if ((!exercise && workoutLoading) || sessionSync.isSyncing) {
    return (
      <SafeAreaView style={styles.container} edges={['top']}>
        <Loader height={260} />
      </SafeAreaView>
    );
  }

  if (sessionSync.isError) {
    return (
      <SafeAreaView style={styles.container} edges={['top']}>
        <View style={styles.header}>
          <ScreenHeader eyebrow="Exercise" title={exercise?.name ?? 'Exercise'} rightIcon="close" onRightPress={() => router.back()} />
        </View>
        <ErrorView message="Couldn't load the sets you've already logged." onRetry={sessionSync.refetch} />
      </SafeAreaView>
    );
  }

  if (!exercise) {
    return (
      <SafeAreaView style={styles.container} edges={['top']}>
        <View style={styles.header}>
          <ScreenHeader eyebrow="Exercise" title="Not Found" rightIcon="close" onRightPress={() => router.back()} />
        </View>
        <ErrorView message="This exercise couldn't be found." />
      </SafeAreaView>
    );
  }

  const isComplete = sets.length >= exercise.sets;

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <View style={styles.header}>
        <ScreenHeader eyebrow="Exercise" title={exercise.name} rightIcon="close" onRightPress={() => router.back()} />
      </View>

      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        <ExerciseAnimation icon={exercise.illustration} />

        <View style={styles.metaRow}>
          <View style={styles.tagsRow}>
            {exercise.equipment ? <Tag icon="barbell-outline" label={exercise.equipment} /> : null}
            {exercise.muscle ? <Tag icon="body-outline" label={exercise.muscle} /> : null}
          </View>
          <Pressable style={styles.howToButton} onPress={() => setHowToVisible(true)} hitSlop={8}>
            <Ionicons name="help-circle-outline" size={18} color={colors.primary} />
            <AppText variant="labelMedium" color={colors.primary}>
              How To
            </AppText>
          </Pressable>
        </View>

        <View style={styles.setsSection}>
          <View style={styles.setsHeader}>
            <AppText variant="titleMedium">Sets</AppText>
            {suggestion?.hint && !isComplete ? (
              <View style={styles.hint}>
                <Ionicons name="sparkles" size={12} color={colors.primary} />
                <AppText variant="labelSmall" color={colors.primary} numberOfLines={1}>
                  {suggestion.hint}
                </AppText>
              </View>
            ) : null}
          </View>
          {Array.from({ length: exercise.sets }).map((_, index) => {
            const set = sets[index];
            const isNext = !set && index === sets.length;
            return (
              <SetRow
                key={index}
                index={index}
                set={set}
                isNext={isNext}
                weightUnit={exercise.weightUnit}
                suggestedWeight={isNext ? suggestion?.weight ?? exercise.suggestedWeight : null}
                suggestedReps={isNext ? suggestion?.reps ?? (parseInt(exercise.reps, 10) || 10) : null}
                onLogSet={handleLogSet}
                onUpdateSet={handleUpdateSet}
              />
            );
          })}
          {syncNote ? (
            <AppText variant="bodySmall" color={colors.textSecondary} style={styles.syncNote}>
              {syncNote}
            </AppText>
          ) : null}
        </View>
      </ScrollView>

      <Snackbar visible={Boolean(snackbarMessage)} onDismiss={() => setSnackbarMessage('')} duration={4000}>
        {snackbarMessage}
      </Snackbar>

      <BottomSheet visible={howToVisible} onClose={() => setHowToVisible(false)}>
        <AppText variant="titleLarge" style={styles.sheetTitle}>
          How To Perform
        </AppText>
        <View style={styles.instructionsList}>
          {exercise.instructions.map((step, index) => (
            <View key={index} style={styles.instructionRow}>
              <View style={styles.instructionBadge}>
                <AppText variant="labelMedium" color={colors.primary}>
                  {index + 1}
                </AppText>
              </View>
              <AppText variant="bodyMedium" color={colors.textSecondary} style={styles.instructionText}>
                {step}
              </AppText>
            </View>
          ))}
        </View>
      </BottomSheet>
    </SafeAreaView>
  );
}

function Tag({ icon, label }) {
  return (
    <View style={styles.tag}>
      <Ionicons name={icon} size={14} color={colors.textSecondary} />
      <AppText variant="labelMedium" color={colors.textSecondary}>
        {label}
      </AppText>
    </View>
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
  metaRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  tagsRow: {
    flexDirection: 'row',
    gap: spacing.md,
  },
  tag: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  howToButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  setsSection: {
    gap: spacing.xxs,
  },
  setsHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: spacing.xs,
  },
  hint: {
    flexDirection: 'row',
    alignItems: 'center',
    flexShrink: 1,
    gap: spacing.xxs,
    backgroundColor: colors.primaryContainer,
    borderRadius: radius.full,
    paddingHorizontal: spacing.sm,
    paddingVertical: 4,
  },
  syncNote: {
    marginTop: spacing.xs,
  },
  sheetTitle: {
    marginBottom: spacing.sm,
  },
  instructionsList: {
    gap: spacing.sm,
  },
  instructionRow: {
    flexDirection: 'row',
    gap: spacing.sm,
  },
  instructionBadge: {
    width: 24,
    height: 24,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.primaryContainer,
  },
  instructionText: {
    flex: 1,
  },
});
