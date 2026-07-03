import { useState } from 'react';
import { View, StyleSheet, FlatList, Pressable } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import { Chip } from 'react-native-paper';
import { Ionicons } from '@expo/vector-icons';
import ScreenHeader from '../../../src/components/common/ScreenHeader';
import SearchBar from '../../../src/components/common/SearchBar';
import Loader from '../../../src/components/common/Loader';
import ErrorView from '../../../src/components/common/ErrorView';
import EmptyState from '../../../src/components/common/EmptyState';
import AppText from '../../../src/components/common/AppText';
import ExerciseCard from '../../../src/components/cards/ExerciseCard';
import ExerciseFiltersSheet from '../../../src/components/dialogs/ExerciseFiltersSheet';
import EquipmentFiltersSheet from '../../../src/components/dialogs/EquipmentFiltersSheet';
import { useExerciseLibrary, useExerciseFilters } from '../../../src/hooks/useExerciseLibrary';
import { colors } from '../../../src/theme/colors';
import { spacing } from '../../../src/theme/spacing';
import { radius } from '../../../src/theme/radius';

export default function ExerciseLibrary() {
  const { data: exercises, isLoading, isError, refetch } = useExerciseLibrary();
  const [query, setQuery] = useState('');
  const [muscle, setMuscle] = useState(null);
  const [equipment, setEquipment] = useState(null);
  const [muscleSheetVisible, setMuscleSheetVisible] = useState(false);
  const [equipmentSheetVisible, setEquipmentSheetVisible] = useState(false);

  const filtered = useExerciseFilters(exercises, { query, muscle, equipment });

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <View style={styles.header}>
        <ScreenHeader eyebrow="Workout" title="Exercise Library" rightIcon="close" onRightPress={() => router.back()} />
        <SearchBar value={query} onChangeText={setQuery} placeholder="Search exercises" />
        <View style={styles.filterRow}>
          <Chip
            icon={() => <Ionicons name="body-outline" size={14} color={muscle ? colors.onPrimaryContainer : colors.textSecondary} />}
            selected={Boolean(muscle)}
            onPress={() => setMuscleSheetVisible(true)}
            style={[styles.chip, muscle && styles.chipSelected]}
          >
            {muscle ?? 'Muscle'}
          </Chip>
          <Chip
            icon={() => <Ionicons name="barbell-outline" size={14} color={equipment ? colors.onPrimaryContainer : colors.textSecondary} />}
            selected={Boolean(equipment)}
            onPress={() => setEquipmentSheetVisible(true)}
            style={[styles.chip, equipment && styles.chipSelected]}
          >
            {equipment ?? 'Equipment'}
          </Chip>
        </View>
      </View>

      {isLoading ? (
        <Loader height={300} />
      ) : isError ? (
        <ErrorView message="Couldn't load the exercise library." onRetry={refetch} />
      ) : (
        <FlatList
          data={filtered}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.list}
          showsVerticalScrollIndicator={false}
          ItemSeparatorComponent={() => <View style={{ height: spacing.sm }} />}
          ListEmptyComponent={
            <EmptyState
              icon="search-outline"
              title="No exercises found"
              message="Try adjusting your search or filters."
            />
          }
          renderItem={({ item }) => (
            <ExerciseCard exercise={item} onPress={() => router.push(`/Workout/exercise/${item.id}`)} />
          )}
        />
      )}

      <ExerciseFiltersSheet
        visible={muscleSheetVisible}
        selectedMuscle={muscle}
        onApply={setMuscle}
        onClear={() => setMuscle(null)}
        onClose={() => setMuscleSheetVisible(false)}
      />
      <EquipmentFiltersSheet
        visible={equipmentSheetVisible}
        selectedEquipment={equipment}
        onApply={setEquipment}
        onClear={() => setEquipment(null)}
        onClose={() => setEquipmentSheetVisible(false)}
      />
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
    gap: spacing.sm,
  },
  filterRow: {
    flexDirection: 'row',
    gap: spacing.xs,
  },
  chip: {
    backgroundColor: colors.surfaceVariant,
    borderRadius: radius.full,
  },
  chipSelected: {
    backgroundColor: colors.primaryContainer,
  },
  list: {
    padding: spacing.lg,
    paddingTop: spacing.md,
  },
});
