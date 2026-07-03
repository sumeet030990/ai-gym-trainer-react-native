import { useEffect, useState } from 'react';
import { View, StyleSheet, Pressable } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import AppText from '../common/AppText';
import AppInput from '../common/AppInput';
import { colors } from '../../theme/colors';
import { spacing } from '../../theme/spacing';
import { radius } from '../../theme/radius';

// A set row is either: pending (greyed placeholder), next-up (inline inputs
// prefilled with the AI suggestion, ready to confirm), or logged (plain
// summary that becomes editable again on tap).
export default function SetRow({
  index,
  set,
  isNext,
  weightUnit = 'kg',
  suggestedWeight,
  suggestedReps,
  onLogSet,
  onUpdateSet,
}) {
  const isComplete = Boolean(set);
  const [editing, setEditing] = useState(false);
  const [weight, setWeight] = useState('');
  const [reps, setReps] = useState('');
  const isEditable = isNext || editing;

  useEffect(() => {
    if (!isNext) return;
    setWeight(suggestedWeight != null ? String(suggestedWeight) : '');
    setReps(suggestedReps != null ? String(suggestedReps) : '');
  }, [isNext, suggestedWeight, suggestedReps]);

  const startEdit = () => {
    if (!isComplete) return;
    setWeight(set.weight != null ? String(set.weight) : '');
    setReps(String(set.reps));
    setEditing(true);
  };

  const confirm = () => {
    const payload = {
      weight: weight.trim() === '' ? null : Number(weight) || 0,
      reps: Number(reps) || 0,
    };
    if (editing) {
      onUpdateSet?.(index, payload);
      setEditing(false);
    } else {
      onLogSet?.(payload);
    }
  };

  return (
    <View style={[styles.row, isNext && styles.rowActive]}>
      <View style={[styles.badge, isComplete && !editing && styles.badgeComplete]}>
        {isComplete && !editing ? (
          <Ionicons name="checkmark" size={14} color={colors.white} />
        ) : (
          <AppText variant="labelMedium" color={colors.textSecondary}>
            {index + 1}
          </AppText>
        )}
      </View>

      {isEditable ? (
        <View style={styles.fields}>
          <AppInput
            dense
            value={weight}
            onChangeText={setWeight}
            keyboardType="decimal-pad"
            style={styles.input}
            contentStyle={styles.inputContent}
          />
          <AppText variant="labelMedium" color={colors.textSecondary}>
            {weightUnit}
          </AppText>
          <AppText variant="labelMedium" color={colors.textDisabled} style={styles.times}>
            ×
          </AppText>
          <AppInput
            dense
            value={reps}
            onChangeText={setReps}
            keyboardType="number-pad"
            style={[styles.input, styles.repsInput]}
            contentStyle={styles.inputContent}
          />
          <AppText variant="labelMedium" color={colors.textSecondary}>
            reps
          </AppText>
        </View>
      ) : (
        <Pressable style={styles.fields} onPress={startEdit} disabled={!isComplete}>
          <AppText variant="bodyMedium" color={isComplete ? colors.textPrimary : colors.textDisabled}>
            {isComplete ? `${set.weight != null ? `${set.weight} ${weightUnit} × ` : ''}${set.reps} reps` : 'Not started'}
          </AppText>
        </Pressable>
      )}

      {isEditable ? (
        <Pressable onPress={confirm} hitSlop={8}>
          <Ionicons name="checkmark-circle" size={26} color={colors.primary} />
        </Pressable>
      ) : isComplete ? (
        <Pressable onPress={startEdit} hitSlop={8}>
          <Ionicons name="pencil" size={16} color={colors.textSecondary} />
        </Pressable>
      ) : (
        <Ionicons name="ellipse-outline" size={20} color={colors.outline} />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
    paddingVertical: spacing.xs,
    paddingHorizontal: spacing.sm,
    borderRadius: radius.md,
  },
  rowActive: {
    backgroundColor: colors.primaryContainer,
  },
  badge: {
    width: 28,
    height: 28,
    borderRadius: radius.full,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.surfaceVariant,
  },
  badgeComplete: {
    backgroundColor: colors.success,
  },
  fields: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xxs,
  },
  input: {
    width: 60,
    height: 40,
  },
  repsInput: {
    width: 52,
  },
  inputContent: {
    textAlign: 'center',
    paddingHorizontal: 0,
  },
  times: {
    marginHorizontal: 2,
  },
});
