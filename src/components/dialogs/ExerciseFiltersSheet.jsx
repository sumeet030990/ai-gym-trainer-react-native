import { View, StyleSheet } from 'react-native';
import { Chip } from 'react-native-paper';
import BottomSheet from '../common/BottomSheet';
import AppText from '../common/AppText';
import PrimaryButton from '../common/PrimaryButton';
import { colors } from '../../theme/colors';
import { spacing } from '../../theme/spacing';
import { radius } from '../../theme/radius';
import { MUSCLE_GROUPS } from '../../utils/constants/exercises';

export default function ExerciseFiltersSheet({ visible, selectedMuscle, onClose, onApply, onClear }) {
  return (
    <BottomSheet visible={visible} onClose={onClose}>
      <AppText variant="titleLarge" style={styles.title}>
        Target Muscle
      </AppText>
      <View style={styles.chipsRow}>
        {MUSCLE_GROUPS.map((muscle) => (
          <Chip
            key={muscle}
            selected={selectedMuscle === muscle}
            onPress={() => onApply(selectedMuscle === muscle ? null : muscle)}
            style={[styles.chip, selectedMuscle === muscle && styles.chipSelected]}
            textStyle={selectedMuscle === muscle ? styles.chipTextSelected : undefined}
          >
            {muscle}
          </Chip>
        ))}
      </View>

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
  actions: {
    flexDirection: 'row',
    gap: spacing.sm,
  },
  actionButton: {
    flex: 1,
  },
});
