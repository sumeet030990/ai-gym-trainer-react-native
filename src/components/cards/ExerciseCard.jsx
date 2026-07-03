import { View, StyleSheet, Pressable } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import AppCard from './AppCard';
import AppText from '../common/AppText';
import { colors } from '../../theme/colors';
import { spacing } from '../../theme/spacing';
import { radius } from '../../theme/radius';

export default function ExerciseCard({ exercise, status, onPress, style }) {
  const weightLabel = exercise.suggestedWeight ? `${exercise.suggestedWeight} ${exercise.weightUnit}` : 'Bodyweight';

  return (
    <Pressable onPress={onPress} disabled={!onPress}>
      <AppCard style={[styles.card, style]}>
        <View style={styles.illustration}>
          <Ionicons name={exercise.illustration ?? 'body-outline'} size={26} color={colors.primary} />
        </View>

        <View style={styles.content}>
          <View style={styles.titleRow}>
            <AppText variant="titleMedium" numberOfLines={1} style={styles.title}>
              {exercise.name}
            </AppText>
            {status === 'complete' ? (
              <View style={[styles.statusPill, styles.statusPillComplete]}>
                <Ionicons name="checkmark-circle" size={14} color={colors.success} />
                <AppText variant="labelSmall" color={colors.success}>
                  Completed
                </AppText>
              </View>
            ) : status === 'pending' ? (
              <View style={styles.statusPill}>
                <Ionicons name="ellipse-outline" size={14} color={colors.textSecondary} />
                <AppText variant="labelSmall" color={colors.textSecondary}>
                  Pending
                </AppText>
              </View>
            ) : null}
          </View>

          <View style={styles.tagsRow}>
            <Tag icon="barbell-outline" label={exercise.equipment} />
            <Tag icon="body-outline" label={exercise.muscle} />
          </View>

          <View style={styles.statsRow}>
            <MiniStat label="Sets" value={exercise.sets} />
            <MiniStat label="Reps" value={exercise.reps} />
            <MiniStat label="Weight" value={weightLabel} />
            <MiniStat label="Kcal" value={exercise.calories} />
          </View>
        </View>

        {onPress ? <Ionicons name="chevron-forward" size={18} color={colors.textSecondary} /> : null}
      </AppCard>
    </Pressable>
  );
}

function Tag({ icon, label }) {
  return (
    <View style={styles.tag}>
      <Ionicons name={icon} size={12} color={colors.textSecondary} />
      <AppText variant="labelSmall" color={colors.textSecondary}>
        {label}
      </AppText>
    </View>
  );
}

function MiniStat({ label, value }) {
  return (
    <View style={styles.miniStat}>
      <AppText variant="labelMedium">{value}</AppText>
      <AppText variant="labelSmall" color={colors.textSecondary}>
        {label}
      </AppText>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
  },
  illustration: {
    width: 56,
    height: 56,
    borderRadius: radius.md,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.primaryContainer,
  },
  content: {
    flex: 1,
    gap: spacing.xxs,
  },
  titleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: spacing.xs,
  },
  title: {
    flex: 1,
  },
  statusPill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 3,
    paddingHorizontal: spacing.xs,
    paddingVertical: 2,
    borderRadius: radius.full,
    backgroundColor: colors.surfaceVariant,
  },
  statusPillComplete: {
    backgroundColor: colors.successContainer,
  },
  tagsRow: {
    flexDirection: 'row',
    gap: spacing.sm,
  },
  tag: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 3,
  },
  statsRow: {
    flexDirection: 'row',
    gap: spacing.md,
    marginTop: 2,
  },
  miniStat: {
    gap: 1,
  },
});
