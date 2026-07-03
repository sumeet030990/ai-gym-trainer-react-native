import { View, ScrollView, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import ScreenHeader from '../../../src/components/common/ScreenHeader';
import AppText from '../../../src/components/common/AppText';
import ExerciseCard from '../../../src/components/cards/ExerciseCard';
import StatCard from '../../../src/components/cards/StatCard';
import { useTodayWorkout } from '../../../src/hooks/useWorkout';
import { useWorkoutSessionStore } from '../../../src/store/workoutSessionStore';
import { TODAY_WORKOUT_EXERCISE_IDS, getExerciseById } from '../../../src/utils/constants/exercises';
import { colors } from '../../../src/theme/colors';
import { spacing } from '../../../src/theme/spacing';

export default function WorkoutSummary() {
  const { data: workout } = useTodayWorkout();
  const completedSets = useWorkoutSessionStore((state) => state.completedSets);
  const exercises = TODAY_WORKOUT_EXERCISE_IDS.map(getExerciseById).filter(Boolean);

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
});
