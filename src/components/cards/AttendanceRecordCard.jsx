import { View, StyleSheet, Pressable } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import AppCard from './AppCard';
import AppText from '../common/AppText';
import { colors } from '../../theme/colors';
import { spacing } from '../../theme/spacing';
import { radius } from '../../theme/radius';

export default function AttendanceRecordCard({ record, onPress, style }) {
  const date = new Date(record.attendance_date);
  const day = date.toLocaleDateString(undefined, { day: '2-digit' });
  const month = date.toLocaleDateString(undefined, { month: 'short' });
  const weekday = date.toLocaleDateString(undefined, { weekday: 'long' });
  const time = date.toLocaleTimeString(undefined, { hour: 'numeric', minute: '2-digit' });
  const musclesTrained = record.muscles_trained ?? [];

  // The muscles trained double as the session's title; a check-in with nothing logged falls back to the weekday.
  const title = musclesTrained.length > 0 ? musclesTrained.join(' · ') : weekday;

  return (
    <Pressable onPress={onPress} disabled={!onPress}>
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
          <AppText variant="titleMedium">{title}</AppText>
          <View style={styles.timeRow}>
            <Ionicons name="time-outline" size={12} color={colors.textSecondary} />
            <AppText variant="labelSmall" color={colors.textSecondary}>
              {musclesTrained.length > 0 ? `${weekday} · ` : ''}Checked in at {time}
            </AppText>
          </View>
        </View>

        {onPress ? (
          <Ionicons name="chevron-forward" size={18} color={colors.textSecondary} />
        ) : (
          <View style={styles.badge}>
            <Ionicons name="checkmark" size={14} color={colors.success} />
          </View>
        )}
      </AppCard>
    </Pressable>
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
  badge: {
    width: 28,
    height: 28,
    borderRadius: radius.full,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.successContainer,
  },
});
