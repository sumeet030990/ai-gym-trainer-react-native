import { View, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import AppCard from './AppCard';
import AppText from '../common/AppText';
import { colors } from '../../theme/colors';
import { spacing } from '../../theme/spacing';
import { radius } from '../../theme/radius';

export default function StatCard({ icon, iconColor = colors.primary, iconBackground = colors.primaryContainer, value, label, style }) {
  return (
    <AppCard style={[styles.card, style]}>
      <View style={[styles.iconWrap, { backgroundColor: iconBackground }]}>
        <Ionicons name={icon} size={18} color={iconColor} />
      </View>
      <AppText variant="titleLarge" style={styles.value}>
        {value}
      </AppText>
      <AppText variant="bodySmall" color={colors.textSecondary} numberOfLines={2}>
        {label}
      </AppText>
    </AppCard>
  );
}

const styles = StyleSheet.create({
  card: {
    flexGrow: 1,
    flexBasis: '47%',
  },
  iconWrap: {
    width: 32,
    height: 32,
    borderRadius: radius.md,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: spacing.xs,
  },
  value: {
    marginBottom: 2,
  },
});
