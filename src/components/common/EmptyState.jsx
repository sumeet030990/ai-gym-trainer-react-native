import { View, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import AppText from './AppText';
import PrimaryButton from './PrimaryButton';
import { colors } from '../../theme/colors';
import { spacing } from '../../theme/spacing';

export default function EmptyState({ icon = 'file-tray-outline', title, message, actionLabel, onAction }) {
  return (
    <View style={styles.container}>
      <View style={styles.iconWrap}>
        <Ionicons name={icon} size={28} color={colors.textSecondary} />
      </View>
      {title ? <AppText variant="titleMedium">{title}</AppText> : null}
      {message ? (
        <AppText variant="bodyMedium" color={colors.textSecondary} style={styles.message}>
          {message}
        </AppText>
      ) : null}
      {actionLabel ? (
        <PrimaryButton onPress={onAction} style={styles.action}>
          {actionLabel}
        </PrimaryButton>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: spacing.xxl,
    gap: spacing.xxs,
  },
  iconWrap: {
    width: 64,
    height: 64,
    borderRadius: 32,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.surfaceVariant,
    marginBottom: spacing.sm,
  },
  message: {
    textAlign: 'center',
    maxWidth: 260,
  },
  action: {
    marginTop: spacing.md,
  },
});
