import { ScrollView, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import ScreenHeader from '../../../src/components/common/ScreenHeader';
import Loader from '../../../src/components/common/Loader';
import ErrorView from '../../../src/components/common/ErrorView';
import WorkoutCard from '../../../src/components/cards/WorkoutCard';
import RestDayCard from '../../../src/components/cards/RestDayCard';
import { useTodayWorkout } from '../../../src/hooks/useWorkout';
import { colors } from '../../../src/theme/colors';
import { spacing } from '../../../src/theme/spacing';

export default function WorkoutHome() {
  const { data: workout, isLoading, isError, refetch } = useTodayWorkout();

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        <ScreenHeader eyebrow="Workout" title="Today's Workout" />

        {isLoading ? (
          <Loader height={260} />
        ) : isError || !workout ? (
          <ErrorView message="Couldn't load today's workout." onRetry={refetch} />
        ) : workout.isRestDay ? (
          <RestDayCard />
        ) : (
          <WorkoutCard
            title={workout.title}
            subtitle={workout.subtitle}
            exerciseCount={workout.exerciseCount}
            calories={workout.calories}
            duration={workout.duration}
            aiReason={workout.aiReason}
            onStart={() => router.push('/Workout/summary')}
            onRegenerate={refetch}
          />
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  content: {
    padding: spacing.lg,
    paddingBottom: spacing.xxxl,
    gap: spacing.lg,
  },
});
