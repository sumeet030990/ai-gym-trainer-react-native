import { View, StyleSheet, Pressable } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Switch } from 'react-native-paper';
import AppText from './AppText';
import { colors } from '../../theme/colors';
import { spacing } from '../../theme/spacing';
import { radius } from '../../theme/radius';

export default function SettingsRow({
  icon,
  iconColor = colors.primary,
  iconBackground = colors.primaryContainer,
  label,
  subtitle,
  value,
  right = 'chevron',
  switchValue,
  onToggle,
  onPress,
  destructive = false,
  isLast = false,
}) {
  const content = (
    <View style={[styles.row, !isLast && styles.divider]}>
      {icon ? (
        <View style={[styles.iconWrap, { backgroundColor: destructive ? colors.errorContainer : iconBackground }]}>
          <Ionicons name={icon} size={18} color={destructive ? colors.error : iconColor} />
        </View>
      ) : null}
      <View style={styles.textWrap}>
        <AppText variant="bodyLarge" color={destructive ? colors.error : colors.textPrimary}>
          {label}
        </AppText>
        {subtitle ? (
          <AppText variant="bodySmall" color={colors.textSecondary} style={styles.subtitle}>
            {subtitle}
          </AppText>
        ) : null}
      </View>

      {right === 'switch' ? (
        <Switch value={switchValue} onValueChange={onToggle} color={colors.primary} />
      ) : right === 'chevron' ? (
        <View style={styles.trailing}>
          {value ? (
            <AppText variant="bodyMedium" color={colors.textSecondary}>
              {value}
            </AppText>
          ) : null}
          <Ionicons name="chevron-forward" size={18} color={colors.textDisabled} />
        </View>
      ) : right === 'value' ? (
        <AppText variant="bodyMedium" color={colors.textSecondary}>
          {value}
        </AppText>
      ) : null}
    </View>
  );

  if (!onPress) return content;

  return (
    <Pressable onPress={onPress} android_ripple={{ color: colors.outlineVariant }}>
      {content}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: spacing.sm,
    gap: spacing.sm,
    borderBottomWidth: 1,
    borderBottomColor: 'transparent',
  },
  divider: {
    borderBottomColor: colors.outlineVariant,
  },
  iconWrap: {
    width: 36,
    height: 36,
    borderRadius: radius.md,
    alignItems: 'center',
    justifyContent: 'center',
  },
  textWrap: {
    flex: 1,
  },
  subtitle: {
    marginTop: 2,
  },
  trailing: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xxs,
  },
});
