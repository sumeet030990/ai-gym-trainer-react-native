import { View, StyleSheet, FlatList } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import ScreenHeader from '../../../src/components/common/ScreenHeader';
import Loader from '../../../src/components/common/Loader';
import ErrorView from '../../../src/components/common/ErrorView';
import EmptyState from '../../../src/components/common/EmptyState';
import HistoryCard from '../../../src/components/cards/HistoryCard';
import { useWorkoutHistory } from '../../../src/hooks/useWorkoutHistory';
import { colors } from '../../../src/theme/colors';
import { spacing } from '../../../src/theme/spacing';

export default function WorkoutHistory() {
  const { data: history, isLoading, isError, refetch } = useWorkoutHistory();

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <View style={styles.header}>
        <ScreenHeader eyebrow="Workout" title="History" rightIcon="close" onRightPress={() => router.back()} />
      </View>

      {isLoading ? (
        <Loader height={300} />
      ) : isError ? (
        <ErrorView message="Couldn't load your workout history." onRetry={refetch} />
      ) : (
        <FlatList
          data={history}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.list}
          showsVerticalScrollIndicator={false}
          ItemSeparatorComponent={() => <View style={{ height: spacing.sm }} />}
          ListEmptyComponent={
            <EmptyState icon="time-outline" title="No workouts yet" message="Complete a workout to see it here." />
          }
          renderItem={({ item }) => <HistoryCard workout={item} />}
        />
      )}
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
    marginBottom: spacing.sm,
  },
  list: {
    padding: spacing.lg,
    paddingTop: 0,
  },
});
