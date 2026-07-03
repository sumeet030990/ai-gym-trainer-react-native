import { View, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import AppCard from './AppCard';
import AppText from '../common/AppText';
import ProgressRing from '../common/ProgressRing';
import { colors } from '../../theme/colors';
import { spacing } from '../../theme/spacing';

const METRICS = [
  { key: 'calories', icon: 'flame', color: colors.tertiary, track: colors.tertiaryContainer, unit: 'kcal' },
];

export default function ActivityRingsCard({ stats }) {
  return (
    <AppCard style={styles.card}>
      {METRICS.map(({ key, icon, color, track, unit }) => {
        const metric = stats[key];
        const progress = metric.current / metric.goal;
        return (
          <View key={key} style={styles.ring}>
            <ProgressRing size={72} strokeWidth={7} progress={progress} color={color} trackColor={track}>
              <Ionicons name={icon} size={18} color={color} />
            </ProgressRing>
            <AppText variant="titleSmall" style={styles.value}>
              {metric.current}
              <AppText variant="bodySmall" color={colors.textSecondary}>
                /{metric.goal}
              </AppText>
            </AppText>
            <AppText variant="bodySmall" color={colors.textSecondary}>
              {unit}
            </AppText>
          </View>
        );
      })}
    </AppCard>
  );
}

const styles = StyleSheet.create({
  card: {
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  ring: {
    alignItems: 'center',
    gap: 2,
  },
  value: {
    marginTop: spacing.xs,
  },
});
