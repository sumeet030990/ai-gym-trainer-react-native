import { View, StyleSheet, Pressable } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import AppCard from './AppCard';
import AppText from '../common/AppText';
import { colors } from '../../theme/colors';
import { spacing } from '../../theme/spacing';
import { radius } from '../../theme/radius';

export default function HistoryCard({ workout, onPress, style }) {
  const date = new Date(workout.date);
  const day = date.toLocaleDateString(undefined, { day: '2-digit' });
  const month = date.toLocaleDateString(undefined, { month: 'short' });

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
          <AppText variant="titleMedium">{workout.title}</AppText>
          <View style={styles.statsRow}>
            <Stat icon="time-outline" value={workout.duration} />
            <Stat icon="flame-outline" value={`${workout.calories} kcal`} />
            <Stat icon="barbell-outline" value={`${workout.exerciseCount} exercises`} />
          </View>
        </View>

        {onPress ? <Ionicons name="chevron-forward" size={18} color={colors.textSecondary} /> : null}
      </AppCard>
    </Pressable>
  );
}

function Stat({ icon, value }) {
  return (
    <View style={styles.stat}>
      <Ionicons name={icon} size={12} color={colors.textSecondary} />
      <AppText variant="labelSmall" color={colors.textSecondary}>
        {value}
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
  statsRow: {
    flexDirection: 'row',
    gap: spacing.sm,
    flexWrap: 'wrap',
  },
  stat: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 3,
  },
});
