import { View, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import AppText from './AppText';
import PrimaryButton from './PrimaryButton';
import { colors } from '../../theme/colors';
import { spacing } from '../../theme/spacing';

export default function ErrorView({ message = 'Something went wrong.', onRetry }) {
  return (
    <View style={styles.container}>
      <Ionicons name="cloud-offline-outline" size={32} color={colors.textSecondary} />
      <AppText variant="bodyMedium" color={colors.textSecondary} style={styles.message}>
        {message}
      </AppText>
      {onRetry ? (
        <PrimaryButton onPress={onRetry} style={styles.retry}>
          Retry
        </PrimaryButton>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: spacing.xl,
    gap: spacing.xs,
  },
  message: {
    textAlign: 'center',
  },
  retry: {
    marginTop: spacing.xs,
  },
});
