import { View, StyleSheet } from 'react-native';
import { Chip } from 'react-native-paper';
import BottomSheet from '../common/BottomSheet';
import AppText from '../common/AppText';
import PrimaryButton from '../common/PrimaryButton';
import { colors } from '../../theme/colors';
import { spacing } from '../../theme/spacing';
import { radius } from '../../theme/radius';

export default function EquipmentFiltersSheet({ visible, options, selectedEquipmentId, onClose, onApply, onClear }) {
  return (
    <BottomSheet visible={visible} onClose={onClose}>
      <AppText variant="titleLarge" style={styles.title}>
        Equipment
      </AppText>
      {options?.length ? (
        <View style={styles.chipsRow}>
          {options.map((equipment) => (
            <Chip
              key={equipment.id}
              selected={selectedEquipmentId === equipment.id}
              onPress={() => onApply(selectedEquipmentId === equipment.id ? null : equipment.id)}
              style={[styles.chip, selectedEquipmentId === equipment.id && styles.chipSelected]}
              textStyle={selectedEquipmentId === equipment.id ? styles.chipTextSelected : undefined}
            >
              {equipment.name}
            </Chip>
          ))}
        </View>
      ) : (
        <AppText variant="bodyMedium" color={colors.textSecondary} style={styles.emptyText}>
          No equipment available yet.
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
