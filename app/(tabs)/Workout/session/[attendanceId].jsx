import { useMemo } from 'react';
import { View, StyleSheet, FlatList } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router, useLocalSearchParams } from 'expo-router';
import ScreenHeader from '../../../../src/components/common/ScreenHeader';
import Loader from '../../../../src/components/common/Loader';
import ErrorView from '../../../../src/components/common/ErrorView';
import EmptyState from '../../../../src/components/common/EmptyState';
import AppCard from '../../../../src/components/cards/AppCard';
import AppText from '../../../../src/components/common/AppText';
import { useWorkoutSessionDetail } from '../../../../src/hooks/useWorkout';
import { useExerciseLibrary } from '../../../../src/hooks/useExerciseLibrary';
import { colors } from '../../../../src/theme/colors';
import { spacing } from '../../../../src/theme/spacing';

export default function WorkoutSession() {
  const { attendanceId, date } = useLocalSearchParams();
  const { data: sessionLog, isLoading, isError, refetch } = useWorkoutSessionDetail(attendanceId);
  // The session log only carries ids; names come from the exercise library.
  const { data: library, isLoading: libraryLoading } = useExerciseLibrary();

  const exercises = useMemo(() => {
    const byId = new Map((library ?? []).map((exercise) => [exercise.id, exercise]));
    return (sessionLog?.exercises ?? []).map((logged) => {
      const exercise = byId.get(logged.exercise_id);
      return {
        id: logged.exercise_id,
        name: exercise?.name ?? 'Exercise',
        muscle: exercise?.muscle?.name,
        sets: logged.sets,
      };
    });
  }, [sessionLog, library]);

  const title = date
    ? new Date(date).toLocaleDateString(undefined, { weekday: 'long', day: 'numeric', month: 'short' })
    : 'Workout';

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <View style={styles.header}>
        <ScreenHeader eyebrow="History" title={title} rightIcon="close" onRightPress={() => router.back()} />
      </View>

      {isLoading || libraryLoading ? (
        <Loader height={300} />
      ) : isError ? (
        <ErrorView message="Couldn't load this workout." onRetry={refetch} />
      ) : (
        <FlatList
          data={exercises}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.list}
          showsVerticalScrollIndicator={false}
          ItemSeparatorComponent={() => <View style={{ height: spacing.sm }} />}
          ListEmptyComponent={
            <EmptyState icon="barbell-outline" title="Nothing logged" message="You checked in, but no sets were logged." />
          }
          renderItem={({ item }) => <ExerciseLogCard exercise={item} />}
        />
      )}
    </SafeAreaView>
  );
}

function ExerciseLogCard({ exercise }) {
  return (
    <AppCard style={styles.card}>
      <View>
        <AppText variant="titleMedium">{exercise.name}</AppText>
        {exercise.muscle ? (
          <AppText variant="labelSmall" color={colors.textSecondary}>
            {exercise.muscle}
          </AppText>
        ) : null}
      </View>

      {exercise.sets.map((set) => (
        <View key={set.set_number} style={styles.setRow}>
          <AppText variant="labelMedium" color={colors.textSecondary}>
            Set {set.set_number}
          </AppText>
          <AppText variant="labelMedium">
            {set.weight_kg > 0 ? `${set.weight_kg} kg × ${set.reps}` : `${set.reps} reps`}
          </AppText>
        </View>
      ))}
    </AppCard>
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
    marginBottom: spacing.sm,
  },
  list: {
    padding: spacing.lg,
    paddingTop: 0,
  },
  card: {
    gap: spacing.xs,
  },
  setRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
});
