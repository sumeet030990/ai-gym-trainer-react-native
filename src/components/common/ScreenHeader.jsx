import { View, StyleSheet, Pressable } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import AppText from './AppText';
import { colors } from '../../theme/colors';
import { spacing } from '../../theme/spacing';
import { radius } from '../../theme/radius';

export default function ScreenHeader({ eyebrow, title, rightIcon, onRightPress }) {
  return (
    <View style={styles.container}>
      <View>
        {eyebrow ? (
          <AppText variant="bodyMedium" color={colors.textSecondary}>
            {eyebrow}
          </AppText>
        ) : null}
        <AppText variant="headlineSmall" style={styles.title}>
          {title}
        </AppText>
      </View>
      {rightIcon ? (
        <Pressable
          onPress={onRightPress}
          hitSlop={8}
          style={({ pressed }) => [styles.iconButton, pressed && styles.iconButtonPressed]}
        >
          <Ionicons name={rightIcon} size={22} color={colors.textPrimary} />
        </Pressable>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  title: {
    marginTop: 2,
  },
  iconButton: {
    width: 44,
    height: 44,
    borderRadius: radius.full,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.surfaceVariant,
  },
  iconButtonPressed: {
    opacity: 0.7,
  },
});
