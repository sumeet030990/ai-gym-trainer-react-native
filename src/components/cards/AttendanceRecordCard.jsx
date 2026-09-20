import { View, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import AppCard from './AppCard';
import AppText from '../common/AppText';
import { colors } from '../../theme/colors';
import { spacing } from '../../theme/spacing';
import { radius } from '../../theme/radius';

export default function AttendanceRecordCard({ record, style }) {
  const date = new Date(record.attendance_date);
  const day = date.toLocaleDateString(undefined, { day: '2-digit' });
  const month = date.toLocaleDateString(undefined, { month: 'short' });
  const weekday = date.toLocaleDateString(undefined, { weekday: 'long' });
  const time = date.toLocaleTimeString(undefined, { hour: 'numeric', minute: '2-digit' });
  const musclesTrained = record.muscles_trained ?? [];

  return (
    <AppCard style={[styles.card, style]}>
      <View style={styles.dateBlock}>
        <AppText variant="titleLarge" color={colors.primary}>
          {day}
        </AppText>
        <AppText variant="labelSmall" color={colors.textSecondary}>
          {month.toUpperCase()}
        </AppText>
      </View>

      <View style={styles.divider} />

      <View style={styles.content}>
        <AppText variant="titleMedium">{weekday}</AppText>
        <View style={styles.timeRow}>
          <Ionicons name="time-outline" size={12} color={colors.textSecondary} />
          <AppText variant="labelSmall" color={colors.textSecondary}>
            Checked in at {time}
          </AppText>
        </View>

        {musclesTrained.length > 0 ? (
          <View style={styles.musclesRow}>
            {musclesTrained.map((muscle) => (
              <View key={muscle} style={styles.muscleTag}>
                <AppText variant="labelSmall" color={colors.textSecondary}>
                  {muscle}
                </AppText>
              </View>
            ))}
          </View>
        ) : null}
      </View>

      <View style={styles.badge}>
        <Ionicons name="checkmark" size={14} color={colors.success} />
      </View>
    </AppCard>
  );
}

const styles = StyleSheet.create({
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
  },
  dateBlock: {
    alignItems: 'center',
    width: 44,
  },
  divider: {
    width: StyleSheet.hairlineWidth,
    height: '80%',
    backgroundColor: colors.outline,
  },
  content: {
    flex: 1,
    gap: spacing.xxs,
  },
  timeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 3,
  },
  musclesRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.xxs,
    marginTop: 2,
  },
  muscleTag: {
    paddingHorizontal: spacing.xs,
    paddingVertical: 2,
    borderRadius: radius.full,
    backgroundColor: colors.surfaceVariant,
  },
  badge: {
    width: 28,
    height: 28,
    borderRadius: radius.full,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.successContainer,
  },
});
