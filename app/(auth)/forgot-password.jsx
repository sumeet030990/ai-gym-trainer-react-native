import { View, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import AppText from '../../src/components/common/AppText';
import PrimaryButton from '../../src/components/common/PrimaryButton';
import { colors } from '../../src/theme/colors';
import { spacing } from '../../src/theme/spacing';
import { radius } from '../../src/theme/radius';

// No password-reset endpoint exists on the backend yet — this is a placeholder
// so the "Forgot password?" link on the login screen has somewhere to go.
export default function ForgotPasswordScreen() {
  return (
    <SafeAreaView style={styles.container} edges={['top', 'bottom']}>
      <View style={styles.content}>
        <View style={styles.badge}>
          <Ionicons name="mail-unread-outline" size={32} color={colors.primary} />
        </View>
        <AppText variant="titleLarge" style={styles.title}>
          Reset your password
        </AppText>
        <AppText variant="bodyMedium" color={colors.textSecondary} style={styles.body}>
          Password reset isn't available yet. Please contact support to regain access to your account.
        </AppText>
        <PrimaryButton onPress={() => router.back()} style={styles.cta}>
          Back to Login
        </PrimaryButton>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  content: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: spacing.xl,
  },
  badge: {
    width: 72,
    height: 72,
    borderRadius: radius.full,
    backgroundColor: colors.primaryContainer,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: spacing.lg,
  },
  title: {
    marginBottom: spacing.xs,
  },
  body: {
    textAlign: 'center',
    marginBottom: spacing.xl,
  },
  cta: {
    alignSelf: 'stretch',
  },
});
