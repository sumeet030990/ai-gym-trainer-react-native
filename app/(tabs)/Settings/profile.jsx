import { View, ScrollView, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { SegmentedButtons } from 'react-native-paper';
import ScreenHeader from '../../../src/components/common/ScreenHeader';
import AppInput from '../../../src/components/common/AppInput';
import AppText from '../../../src/components/common/AppText';
import PrimaryButton from '../../../src/components/common/PrimaryButton';
import Avatar from '../../../src/components/common/Avatar';
import { useProfileStore } from '../../../src/store/profileStore';
import { profileSchema } from '../../../src/utils/schemas/settingsSchemas';
import { colors } from '../../../src/theme/colors';
import { spacing } from '../../../src/theme/spacing';

export default function ProfileSettings() {
  const profile = useProfileStore();

  const { control, handleSubmit, formState: { errors, isSubmitting } } = useForm({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      name: profile.name,
      email: profile.email,
      phone: profile.phone,
      heightCm: profile.heightCm ? String(profile.heightCm) : '',
      weightKg: profile.weightKg ? String(profile.weightKg) : '',
      fitnessLevel: profile.fitnessLevel,
    },
  });

  const onSubmit = (values) => {
    profile.updateProfile(values);
    router.back();
  };

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <View style={styles.header}>
        <ScreenHeader eyebrow="Account" title="Profile" rightIcon="close" onRightPress={() => router.back()} />
      </View>

      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        <View style={styles.avatarWrap}>
          <Avatar uri={profile.avatarUri} name={profile.name} size={88} />
        </View>

        <Field label="Full Name" error={errors.name?.message}>
          <Controller
            control={control}
            name="name"
            render={({ field }) => (
              <AppInput placeholder="Jane Doe" value={field.value} onChangeText={field.onChange} />
            )}
          />
        </Field>

        <Field label="Email" error={errors.email?.message}>
          <Controller
            control={control}
            name="email"
            render={({ field }) => (
              <AppInput
                placeholder="jane@example.com"
                keyboardType="email-address"
                autoCapitalize="none"
                value={field.value}
                onChangeText={field.onChange}
              />
            )}
          />
        </Field>

        <Field label="Mobile Number" error={errors.phone?.message}>
          <Controller
            control={control}
            name="phone"
            render={({ field }) => (
              <AppInput
                placeholder="+1 555 123 4567"
                keyboardType="phone-pad"
                value={field.value}
                onChangeText={field.onChange}
              />
            )}
          />
        </Field>

        <View style={styles.row}>
          <Field label="Height (cm)" error={errors.heightCm?.message} style={styles.half}>
            <Controller
              control={control}
              name="heightCm"
              render={({ field }) => (
                <AppInput placeholder="175" keyboardType="numeric" value={field.value} onChangeText={field.onChange} />
              )}
            />
          </Field>
          <Field label="Weight (kg)" error={errors.weightKg?.message} style={styles.half}>
            <Controller
              control={control}
              name="weightKg"
              render={({ field }) => (
                <AppInput placeholder="72" keyboardType="numeric" value={field.value} onChangeText={field.onChange} />
              )}
            />
          </Field>
        </View>

        <Field label="Fitness Level">
          <Controller
            control={control}
            name="fitnessLevel"
            render={({ field }) => (
              <SegmentedButtons
                value={field.value}
                onValueChange={field.onChange}
                buttons={[
                  { value: 'beginner', label: 'Beginner' },
                  { value: 'intermediate', label: 'Intermediate' },
                  { value: 'advanced', label: 'Advanced' },
                ]}
              />
            )}
          />
        </Field>

        <PrimaryButton onPress={handleSubmit(onSubmit)} disabled={isSubmitting} style={styles.submit}>
          Save Changes
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
  avatarWrap: {
    alignItems: 'center',
    marginBottom: spacing.lg,
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
  row: {
    flexDirection: 'row',
    gap: spacing.sm,
  },
  half: {
    flex: 1,
  },
  submit: {
    marginTop: spacing.sm,
  },
});
