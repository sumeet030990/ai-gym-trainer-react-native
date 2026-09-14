import { View, StyleSheet } from 'react-native';
import { Chip } from 'react-native-paper';
import BottomSheet from '../common/BottomSheet';
import AppText from '../common/AppText';
import PrimaryButton from '../common/PrimaryButton';
import { colors } from '../../theme/colors';
import { spacing } from '../../theme/spacing';
import { radius } from '../../theme/radius';

export default function ExerciseFiltersSheet({ visible, options, selectedMuscleId, onClose, onApply, onClear }) {
  return (
    <BottomSheet visible={visible} onClose={onClose}>
      <AppText variant="titleLarge" style={styles.title}>
        Target Muscle
      </AppText>
      {options?.length ? (
        <View style={styles.chipsRow}>
          {options.map((muscle) => (
            <Chip
              key={muscle.id}
              selected={selectedMuscleId === muscle.id}
              onPress={() => onApply(selectedMuscleId === muscle.id ? null : muscle.id)}
              style={[styles.chip, selectedMuscleId === muscle.id && styles.chipSelected]}
              textStyle={selectedMuscleId === muscle.id ? styles.chipTextSelected : undefined}
            >
              {muscle.name}
            </Chip>
          ))}
        </View>
      ) : (
        <AppText variant="bodyMedium" color={colors.textSecondary} style={styles.emptyText}>
          No muscle groups available yet.
        </AppText>
      )}

      <View style={styles.actions}>
        <PrimaryButton onPress={onClear} buttonColor={colors.surfaceVariant} textColor={colors.textPrimary} style={styles.actionButton}>
          Clear
        </PrimaryButton>
        <PrimaryButton onPress={onClose} style={styles.actionButton}>
          Done
        </PrimaryButton>
      </View>
    </BottomSheet>
  );
}

const styles = StyleSheet.create({
  title: {
    marginBottom: spacing.sm,
  },
  chipsRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.xs,
    marginBottom: spacing.lg,
  },
  chip: {
    backgroundColor: colors.surfaceVariant,
    borderRadius: radius.full,
  },
  chipSelected: {
    backgroundColor: colors.primaryContainer,
  },
  chipTextSelected: {
    color: colors.onPrimaryContainer,
  },
  emptyText: {
    marginBottom: spacing.lg,
  },
  actions: {
    flexDirection: 'row',
    gap: spacing.sm,
  },
  actionButton: {
    flex: 1,
  },
});
