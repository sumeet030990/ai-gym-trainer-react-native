import { View, StyleSheet } from 'react-native';
import { Chip } from 'react-native-paper';
import BottomSheet from '../common/BottomSheet';
import AppText from '../common/AppText';
import PrimaryButton from '../common/PrimaryButton';
import { colors } from '../../theme/colors';
import { spacing } from '../../theme/spacing';
import { radius } from '../../theme/radius';
import { EQUIPMENT_TYPES } from '../../utils/constants/exercises';

export default function EquipmentFiltersSheet({ visible, selectedEquipment, onClose, onApply, onClear }) {
  return (
    <BottomSheet visible={visible} onClose={onClose}>
      <AppText variant="titleLarge" style={styles.title}>
        Equipment
      </AppText>
      <View style={styles.chipsRow}>
        {EQUIPMENT_TYPES.map((equipment) => (
          <Chip
            key={equipment}
            selected={selectedEquipment === equipment}
            onPress={() => onApply(selectedEquipment === equipment ? null : equipment)}
            style={[styles.chip, selectedEquipment === equipment && styles.chipSelected]}
            textStyle={selectedEquipment === equipment ? styles.chipTextSelected : undefined}
          >
            {equipment}
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
