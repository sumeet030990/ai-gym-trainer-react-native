import { View, StyleSheet } from 'react-native';
import { colors } from '../../theme/colors';
import { radius } from '../../theme/radius';
import { spacing } from '../../theme/spacing';
import { elevation } from '../../theme/elevation';

export default function AppCard({ children, style, padded = true, backgroundColor = colors.surface }) {
  return (
    <View style={[styles.card, { backgroundColor }, padded && styles.padded, style]}>
      {children}
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    borderRadius: radius.lg,
    ...elevation.level1,
  },
  padded: {
    padding: spacing.md,
  },
});
