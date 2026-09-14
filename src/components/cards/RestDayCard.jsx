import { View, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import AppCard from './AppCard';
import AppText from '../common/AppText';
import { colors } from '../../theme/colors';
import { spacing } from '../../theme/spacing';
import { radius } from '../../theme/radius';

export default function RestDayCard({ message = 'Recharge today — your next workout is on the way.', style }) {
  return (
    <AppCard style={[styles.card, style]}>
      <View style={styles.iconWrap}>
        <Ionicons name="moon" size={24} color={colors.secondary} />
      </View>
      <View style={styles.textWrap}>
        <AppText variant="titleMedium">Rest Day</AppText>
        <AppText variant="bodyMedium" color={colors.textSecondary}>
          {message}
        </AppText>
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
  iconWrap: {
    width: 48,
    height: 48,
    borderRadius: radius.md,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.secondaryContainer,
  },
  textWrap: {
    flex: 1,
    gap: 2,
  },
});
