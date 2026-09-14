import { useMemo, useState } from 'react';
import { View, StyleSheet, FlatList } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import { Chip } from 'react-native-paper';
import { Ionicons } from '@expo/vector-icons';
import ScreenHeader from '../../../src/components/common/ScreenHeader';
import SearchBar from '../../../src/components/common/SearchBar';
import Loader from '../../../src/components/common/Loader';
import ErrorView from '../../../src/components/common/ErrorView';
import EmptyState from '../../../src/components/common/EmptyState';
import ExerciseCard from '../../../src/components/cards/ExerciseCard';
import ExerciseFiltersSheet from '../../../src/components/dialogs/ExerciseFiltersSheet';
import EquipmentFiltersSheet from '../../../src/components/dialogs/EquipmentFiltersSheet';
import { useExerciseLibrary, useEquipments, useExerciseFilters, useExerciseFilterOptions } from '../../../src/hooks/useExerciseLibrary';
import { colors } from '../../../src/theme/colors';
import { spacing } from '../../../src/theme/spacing';
import { radius } from '../../../src/theme/radius';

export default function ExerciseLibrary() {
  const { data: exercises, isLoading: exercisesLoading, isError: exercisesError, refetch: refetchExercises } = useExerciseLibrary();
  const { data: equipments, isLoading: equipmentsLoading, isError: equipmentsError, refetch: refetchEquipments } = useEquipments();
  const [query, setQuery] = useState('');
  const [muscleId, setMuscleId] = useState(null);
  const [equipmentId, setEquipmentId] = useState(null);
  const [muscleSheetVisible, setMuscleSheetVisible] = useState(false);
  const [equipmentSheetVisible, setEquipmentSheetVisible] = useState(false);

  const filterOptions = useExerciseFilterOptions(exercises, equipments);
  const filtered = useExerciseFilters(exercises, { query, muscleId, equipmentId });

  const equipmentNameById = useMemo(() => {
    const map = new Map();
    (equipments ?? []).forEach((item) => map.set(item.id, item.name));
    return map;
  }, [equipments]);

  const selectedMuscleName = filterOptions.muscles.find((m) => m.id === muscleId)?.name;
  const selectedEquipmentName = filterOptions.equipments.find((e) => e.id === equipmentId)?.name;

  const isLoading = exercisesLoading || equipmentsLoading;
  const isError = exercisesError || equipmentsError;

  const handleRetry = () => {
    refetchExercises();
    refetchEquipments();
  };

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <View style={styles.header}>
        <ScreenHeader eyebrow="Workout" title="Exercise Library" rightIcon="close" onRightPress={() => router.back()} />
        <SearchBar value={query} onChangeText={setQuery} placeholder="Search exercises" />
        <View style={styles.filterRow}>
          <Chip
            icon={() => (
              <Ionicons
                name="body-outline"
                size={14}
                color={muscleId ? colors.onPrimaryContainer : colors.textSecondary}
              />
            )}
            selected={Boolean(muscleId)}
            onPress={() => setMuscleSheetVisible(true)}
            style={[styles.chip, muscleId && styles.chipSelected]}
          >
            {selectedMuscleName ?? 'Muscle'}
          </Chip>
          <Chip
            icon={() => (
              <Ionicons
                name="barbell-outline"
                size={14}
                color={equipmentId ? colors.onPrimaryContainer : colors.textSecondary}
              />
            )}
            selected={Boolean(equipmentId)}
            onPress={() => setEquipmentSheetVisible(true)}
            style={[styles.chip, equipmentId && styles.chipSelected]}
          >
            {selectedEquipmentName ?? 'Equipment'}
          </Chip>
        </View>
      </View>

      {isLoading ? (
        <Loader height={300} />
      ) : isError ? (
        <ErrorView message="Couldn't load the exercise library." onRetry={handleRetry} />
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
            <ExerciseCard
              exercise={{
                ...item,
                muscle: item.muscle?.name ?? null,
                equipment: equipmentNameById.get(item.equipment_id) ?? null,
              }}
              onPress={() => router.push(`/Workout/exercise/${item.id}`)}
            />
          )}
        />
      )}

      <ExerciseFiltersSheet
        visible={muscleSheetVisible}
        options={filterOptions.muscles}
        selectedMuscleId={muscleId}
        onApply={setMuscleId}
        onClear={() => setMuscleId(null)}
        onClose={() => setMuscleSheetVisible(false)}
      />
      <EquipmentFiltersSheet
        visible={equipmentSheetVisible}
        options={filterOptions.equipments}
        selectedEquipmentId={equipmentId}
        onApply={setEquipmentId}
        onClear={() => setEquipmentId(null)}
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
