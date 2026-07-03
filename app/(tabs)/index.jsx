import { View, ScrollView, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import ScreenHeader from '../../src/components/common/ScreenHeader';
import SectionHeader from '../../src/components/common/SectionHeader';
import Loader from '../../src/components/common/Loader';
import ErrorView from '../../src/components/common/ErrorView';
import WorkoutCard from '../../src/components/cards/WorkoutCard';
import StatCard from '../../src/components/cards/StatCard';
import NutritionCard from '../../src/components/cards/NutritionCard';
import { useTodayWorkout } from '../../src/hooks/useWorkout';
import { useDailyStats } from '../../src/hooks/useDailyStats';
import { useNutrition } from '../../src/hooks/useNutrition';
import { colors } from '../../src/theme/colors';
import { spacing } from '../../src/theme/spacing';

export default function Home() {
  const { data: workout, isLoading: workoutLoading, isError: workoutError, refetch } = useTodayWorkout();
  const { data: stats, isLoading: statsLoading } = useDailyStats();
  const {
    data: nutrition,
    isLoading: nutritionLoading,
    isError: nutritionError,
    refetch: refetchNutrition,
  } = useNutrition();

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        <ScreenHeader eyebrow="Good Morning" title="Sumeet" rightIcon="notifications-outline" onRightPress={() => {}} />

        <View style={styles.section}>
          <Loader height={100} isLoading={statsLoading} style={styles.statsRow}>
            <StatCard
              icon="flame-outline"
              iconColor={colors.tertiary}
              iconBackground={colors.tertiaryContainer}
              value={`${stats?.streak} days`}
              label="Current Streak"
            />
            <StatCard
              icon="stopwatch-outline"
              iconColor={colors.secondary}
              iconBackground={colors.secondaryContainer}
              value={`${stats?.activeMinutes} min`}
              label="Active Minutes"
            />
          </Loader>
        </View>

        {workoutLoading ? (
          <Loader height={220} />
        ) : workoutError ? (
          <ErrorView message="Couldn't load today's workout." onRetry={refetch} />
        ) : (
          <WorkoutCard
            title={workout.title}
            subtitle={workout.subtitle}
            exerciseCount={workout.exerciseCount}
            calories={workout.calories}
            duration={workout.duration}
            aiReason={workout.aiReason}
            onStart={() => router.push('/Workout')}
            onRegenerate={refetch}
          />
        )}

        <View style={styles.section}>
          <SectionHeader title="Nutrition Today" actionLabel="Details" onActionPress={() => router.push('/Diet')} />
          {nutritionLoading ? (
            <Loader height={180} />
          ) : nutritionError ? (
            <ErrorView message="Couldn't load today's nutrition." onRetry={refetchNutrition} />
          ) : (
            <NutritionCard
              calories={nutrition.calories}
              protein={nutrition.protein}
              carbs={nutrition.carbs}
              fat={nutrition.fat}
            />
          )}
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
  content: {
    padding: spacing.lg,
    paddingBottom: spacing.xxxl,
    gap: spacing.lg,
  },
  section: {
    gap: 0,
  },
  statsRow: {
    flexDirection: 'row',
    gap: spacing.sm,
  },
});
