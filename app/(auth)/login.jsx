import { useState } from 'react';
import { View, StyleSheet, KeyboardAvoidingView, Platform, ScrollView, Pressable, Image } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { useFormik } from 'formik';
import { TextInput } from 'react-native-paper';
import AppInput from '../../src/components/common/AppInput';
import AppText from '../../src/components/common/AppText';
import PrimaryButton from '../../src/components/common/PrimaryButton';
import { useLoginMutation } from '../../src/hooks/useAuth';
import { loginSchema } from '../../src/utils/schemas/authSchemas';
import { validateWithZod } from '../../src/utils/validateWithZod';
import { colors } from '../../src/theme/colors';
import { spacing } from '../../src/theme/spacing';
import { radius } from '../../src/theme/radius';
import { elevation } from '../../src/theme/elevation';

export default function LoginScreen() {
  const loginMutation = useLoginMutation();
  const [showPassword, setShowPassword] = useState(false);
  const [serverError, setServerError] = useState(null);

  const { values, errors, isSubmitting, setFieldValue, handleSubmit } = useFormik({
    initialValues: { email: process.env.EXPO_PUBLIC_USER_NAME || '', password: process.env.EXPO_PUBLIC_PASSWORD || '' },
    validate: validateWithZod(loginSchema),
    onSubmit: async ({ email, password }, { setSubmitting }) => {
      setServerError(null);
      try {
        await loginMutation.mutateAsync({ email, password });
        router.replace('/');
      } catch (error) {
        setServerError(error.message);
      } finally {
        setSubmitting(false);
      }
    },
  });

  return (
    <View style={styles.container}>
      <LinearGradient colors={[colors.primary, '#3730D9']} style={StyleSheet.absoluteFill} />

      <Ionicons name="barbell-outline" size={220} color="rgba(255,255,255,0.08)" style={styles.bgIconTop} />
      <Ionicons name="flame-outline" size={160} color="rgba(255,255,255,0.08)" style={styles.bgIconBottom} />

      <KeyboardAvoidingView style={styles.flex} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
        <SafeAreaView style={styles.flex} edges={['top', 'bottom']}>
          <View style={styles.hero}>
            <Image source={require('../../assets/pocket_logo.png')} style={styles.logoImage} resizeMode="contain" />
            <AppText variant="headlineMedium" color={colors.white} style={styles.brand}>
              {process.env.EXPO_APP_NAME || 'Pocket Coach'}
            </AppText>
            <AppText variant="bodyMedium" color="rgba(255,255,255,0.8)">
              Train smarter, every single day.
            </AppText>
          </View>

          <ScrollView
            style={styles.sheet}
            contentContainerStyle={styles.sheetContent}
            keyboardShouldPersistTaps="handled"
            showsVerticalScrollIndicator={false}
          >
            <AppText variant="titleLarge" style={styles.welcome}>
              Welcome back
            </AppText>
            <AppText variant="bodyMedium" color={colors.textSecondary} style={styles.subtitle}>
              Log in to continue your program
            </AppText>

            {serverError ? (
              <View style={styles.errorBanner}>
                <Ionicons name="alert-circle" size={16} color={colors.error} />
                <AppText variant="bodySmall" color={colors.error} style={styles.errorBannerText}>
                  {serverError}
                </AppText>
              </View>
            ) : null}

            <Field label="Email" error={errors.email}>
              <AppInput
                placeholder="jane@example.com"
                keyboardType="email-address"
                autoCapitalize="none"
                autoComplete="email"
                left={<TextInput.Icon icon="email-outline" />}
                value={values.email}
                onChangeText={(text) => setFieldValue('email', text)}
              />
            </Field>

            <Field label="Password" error={errors.password}>
              <AppInput
                placeholder="Enter your password"
                secureTextEntry={!showPassword}
                autoCapitalize="none"
                autoComplete="password"
                left={<TextInput.Icon icon="lock-outline" />}
                right={
                  <TextInput.Icon
                    icon={showPassword ? 'eye-off-outline' : 'eye-outline'}
                    onPress={() => setShowPassword((prev) => !prev)}
                  />
                }
                value={values.password}
                onChangeText={(text) => setFieldValue('password', text)}
              />
            </Field>

            <Pressable onPress={() => router.push('/forgot-password')} hitSlop={8} style={styles.forgotLink}>
              <AppText variant="labelLarge" color={colors.primary}>
                Forgot password?
              </AppText>
            </Pressable>

            <PrimaryButton onPress={handleSubmit} disabled={isSubmitting} style={styles.submit}>
              {isSubmitting ? 'Logging in…' : 'Log In'}
            </PrimaryButton>

            <View style={styles.signupRow}>
              <AppText variant="bodyMedium" color={colors.textSecondary}>
                New here?
              </AppText>
              <Pressable onPress={() => router.push('/register')} hitSlop={8}>
                <AppText variant="labelLarge" color={colors.primary} style={styles.signupLink}>
                  Create an account
                </AppText>
              </Pressable>
            </View>
          </ScrollView>
        </SafeAreaView>
      </KeyboardAvoidingView>
    </View>
  );
}

function Field({ label, error, children }) {
  return (
    <View style={styles.field}>
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
    backgroundColor: colors.primary,
  },
  flex: {
    flex: 1,
  },
  bgIconTop: {
    position: 'absolute',
    top: -30,
    right: -50,
  },
  bgIconBottom: {
    position: 'absolute',
    bottom: 20,
    left: -40,
  },
  hero: {
    alignItems: 'center',
    paddingTop: spacing.xxl,
    paddingBottom: spacing.xl,
    paddingHorizontal: spacing.lg,
  },
  logoImage: {
    width: 150,
    height: 150,
  },
  brand: {
    marginBottom: spacing.xxs,
  },
  sheet: {
    flex: 1,
    backgroundColor: colors.surface,
    borderTopLeftRadius: radius.xl,
    borderTopRightRadius: radius.xl,
    ...elevation.level3,
  },
  sheetContent: {
    padding: spacing.lg,
    paddingTop: spacing.xl,
    paddingBottom: spacing.xxxl,
  },
  welcome: {
    marginBottom: spacing.xxs,
  },
  subtitle: {
    marginBottom: spacing.lg,
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
  field: {
    marginBottom: spacing.md,
  },
  fieldLabel: {
    marginBottom: spacing.xxs,
  },
  fieldError: {
    marginTop: spacing.xxs,
  },
  forgotLink: {
    alignSelf: 'flex-end',
    marginBottom: spacing.lg,
  },
  submit: {
    marginBottom: spacing.lg,
  },
  signupRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: spacing.xxs,
  },
  signupLink: {
    textDecorationLine: 'underline',
  },
});
