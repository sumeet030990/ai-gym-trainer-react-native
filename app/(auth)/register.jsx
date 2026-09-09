import { useState } from 'react';
import { View, ScrollView, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import { useFormik } from 'formik';
import { Ionicons } from '@expo/vector-icons';
import ScreenHeader from '../../src/components/common/ScreenHeader';
import AppInput from '../../src/components/common/AppInput';
import AppText from '../../src/components/common/AppText';
import PrimaryButton from '../../src/components/common/PrimaryButton';
import { useRegisterMutation } from '../../src/hooks/useAuth';
import { registerSchema } from '../../src/utils/schemas/authSchemas';
import { validateWithZod } from '../../src/utils/validateWithZod';
import { colors } from '../../src/theme/colors';
import { spacing } from '../../src/theme/spacing';
import { radius } from '../../src/theme/radius';

export default function RegisterScreen() {
  const registerMutation = useRegisterMutation();
  const [serverError, setServerError] = useState(null);
  const [registered, setRegistered] = useState(false);

  const { values, errors, isSubmitting, setFieldValue, handleSubmit } = useFormik({
    initialValues: { firstName: '', lastName: '', mobileNo: '', email: '', password: '', confirmPassword: '' },
    validate: validateWithZod(registerSchema),
    onSubmit: async (formValues, { setSubmitting }) => {
      setServerError(null);
      try {
        await registerMutation.mutateAsync(formValues);
        setRegistered(true);
      } catch (error) {
        setServerError(error.message);
      } finally {
        setSubmitting(false);
      }
    },
  });

  if (registered) {
    return (
      <SafeAreaView style={styles.container} edges={['top', 'bottom']}>
        <View style={styles.successWrap}>
          <View style={styles.successBadge}>
            <Ionicons name="checkmark" size={32} color={colors.white} />
          </View>
          <AppText variant="titleLarge" style={styles.successTitle}>
            Account created
          </AppText>
          <AppText variant="bodyMedium" color={colors.textSecondary} style={styles.successBody}>
            You can now log in with your mobile number or email.
          </AppText>
          <PrimaryButton onPress={() => router.replace('/login')} style={styles.successCta}>
            Go to Login
          </PrimaryButton>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container} edges={['top', 'bottom']}>
      <View style={styles.header}>
        <ScreenHeader eyebrow="Get started" title="Create account" rightIcon="close" onRightPress={() => router.back()} />
      </View>

      <ScrollView contentContainerStyle={styles.content} keyboardShouldPersistTaps="handled" showsVerticalScrollIndicator={false}>
        {serverError ? (
          <View style={styles.errorBanner}>
            <Ionicons name="alert-circle" size={16} color={colors.error} />
            <AppText variant="bodySmall" color={colors.error} style={styles.errorBannerText}>
              {serverError}
            </AppText>
          </View>
        ) : null}

        <View style={styles.row}>
          <Field label="First Name" error={errors.firstName} style={styles.half}>
            <AppInput placeholder="Jane" value={values.firstName} onChangeText={(text) => setFieldValue('firstName', text)} />
          </Field>
          <Field label="Last Name" error={errors.lastName} style={styles.half}>
            <AppInput placeholder="Doe" value={values.lastName} onChangeText={(text) => setFieldValue('lastName', text)} />
          </Field>
        </View>

        <Field label="Mobile Number" error={errors.mobileNo}>
          <AppInput
            placeholder="+14155552671"
            keyboardType="phone-pad"
            value={values.mobileNo}
            onChangeText={(text) => setFieldValue('mobileNo', text)}
          />
        </Field>

        <Field label="Email (optional)" error={errors.email}>
          <AppInput
            placeholder="jane@example.com"
            keyboardType="email-address"
            autoCapitalize="none"
            value={values.email}
            onChangeText={(text) => setFieldValue('email', text)}
          />
        </Field>

        <Field label="Password" error={errors.password}>
          <AppInput
            placeholder="At least 8 characters"
            secureTextEntry
            autoCapitalize="none"
            value={values.password}
            onChangeText={(text) => setFieldValue('password', text)}
          />
        </Field>

        <Field label="Confirm Password" error={errors.confirmPassword}>
          <AppInput
            placeholder="Re-enter your password"
            secureTextEntry
            autoCapitalize="none"
            value={values.confirmPassword}
            onChangeText={(text) => setFieldValue('confirmPassword', text)}
          />
        </Field>

        <PrimaryButton onPress={handleSubmit} disabled={isSubmitting} style={styles.submit}>
          {isSubmitting ? 'Creating account…' : 'Create Account'}
        </PrimaryButton>
      </ScrollView>
    </SafeAreaView>
  );
}

function Field({ label, error, children, style }) {
  return (
    <View style={[styles.field, style]}>
      <AppText variant="labelLarge" color={colors.textSecondary} style={styles.fieldLabel}>
        {label}
      </AppText>
      {children}
      {error ? (
        <AppText variant="bodySmall" color={colors.error} style={styles.fieldError}>
          {error}
        </AppText>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  header: {
    paddingHorizontal: spacing.lg,
    paddingTop: spacing.xs,
    marginBottom: spacing.sm,
  },
  content: {
    padding: spacing.lg,
    paddingTop: 0,
    paddingBottom: spacing.xxxl,
  },
  errorBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xxs,
    backgroundColor: colors.errorContainer,
    borderRadius: radius.md,
    padding: spacing.sm,
    marginBottom: spacing.md,
  },
  errorBannerText: {
    flex: 1,
  },
  row: {
    flexDirection: 'row',
    gap: spacing.sm,
  },
  half: {
    flex: 1,
  },
  field: {
    marginBottom: spacing.md,
  },
  fieldLabel: {
    marginBottom: spacing.xxs,
  },
  fieldError: {
    marginTop: spacing.xxs,
  },
  submit: {
    marginTop: spacing.sm,
  },
  successWrap: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: spacing.xl,
  },
  successBadge: {
    width: 72,
    height: 72,
    borderRadius: radius.full,
    backgroundColor: colors.success,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: spacing.lg,
  },
  successTitle: {
    marginBottom: spacing.xs,
  },
  successBody: {
    textAlign: 'center',
    marginBottom: spacing.xl,
  },
  successCta: {
    alignSelf: 'stretch',
  },
});
