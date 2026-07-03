import { View, StyleSheet, Pressable } from 'react-native';
import AppText from './AppText';
import { colors } from '../../theme/colors';
import { spacing } from '../../theme/spacing';

export default function SectionHeader({ title, actionLabel, onActionPress }) {
  return (
    <View style={styles.container}>
      <AppText variant="titleLarge">{title}</AppText>
      {actionLabel ? (
        <Pressable onPress={onActionPress} hitSlop={8}>
          <AppText variant="labelLarge" color={colors.primary}>
            {actionLabel}
          </AppText>
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
    marginBottom: spacing.sm,
  },
});
