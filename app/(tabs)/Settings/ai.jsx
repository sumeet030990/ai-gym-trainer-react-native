import { useEffect, useState } from 'react';
import { View, ScrollView, StyleSheet, Pressable } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { TextInput } from 'react-native-paper';
import { Ionicons } from '@expo/vector-icons';
import ScreenHeader from '../../../src/components/common/ScreenHeader';
import AppInput from '../../../src/components/common/AppInput';
import AppText from '../../../src/components/common/AppText';
import PrimaryButton from '../../../src/components/common/PrimaryButton';
import { useAIConfigStore } from '../../../src/store/aiConfigStore';
import { aiSettingsSchema, AI_PROVIDERS } from '../../../src/utils/schemas/settingsSchemas';
import { getSecureValue, SECURE_KEYS } from '../../../src/services/storage/secureStorage';
import { testGroqConnection } from '../../../src/services/api/ai.api';
import { colors } from '../../../src/theme/colors';
import { spacing } from '../../../src/theme/spacing';
import { radius } from '../../../src/theme/radius';

export default function AISettings() {
  const config = useAIConfigStore();
  const [keyHidden, setKeyHidden] = useState(true);
  const [testResult, setTestResult] = useState(null);
  const [testing, setTesting] = useState(false);

  const { control, handleSubmit, watch, setValue, formState: { errors, isSubmitting } } = useForm({
    resolver: zodResolver(aiSettingsSchema),
    defaultValues: {
      provider: config.provider,
      model: config.model,
      apiKey: '',
      temperature: String(config.temperature),
      maxTokens: String(config.maxTokens),
    },
  });

  useEffect(() => {
    getSecureValue(SECURE_KEYS.groqApiKey).then((existingKey) => {
      if (existingKey) setValue('apiKey', existingKey);
    });
  }, [setValue]);

  const handleTestConnection = async () => {
    setTesting(true);
    setTestResult(null);
    const result = await testGroqConnection(watch('apiKey'));
    setTestResult(result);
    setTesting(false);
  };

  const onSubmit = async ({ apiKey, ...rest }) => {
    config.updateConfig(rest);
    await config.saveApiKey(apiKey);
    router.back();
  };

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <View style={styles.header}>
        <ScreenHeader eyebrow="AI Coach" title="AI Settings" rightIcon="close" onRightPress={() => router.back()} />
      </View>

      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        <Field label="Provider">
          <Controller
            control={control}
            name="provider"
            render={({ field }) => (
              <View style={styles.grid}>
                {AI_PROVIDERS.map((option) => {
                  const selected = field.value === option.value;
                  return (
                    <Pressable
                      key={option.value}
                      onPress={() => field.onChange(option.value)}
                      style={[styles.chip, selected && styles.chipSelected]}
                    >
                      <AppText variant="labelLarge" color={selected ? colors.onPrimary : colors.textPrimary}>
                        {option.label}
                      </AppText>
                    </Pressable>
                  );
                })}
              </View>
            )}
          />
        </Field>

        <Field label="Model" error={errors.model?.message}>
          <Controller
            control={control}
            name="model"
            render={({ field }) => (
              <AppInput
                placeholder="llama-3.3-70b-versatile"
                autoCapitalize="none"
                value={field.value}
                onChangeText={field.onChange}
              />
            )}
          />
        </Field>

        <Field label="API Key" error={errors.apiKey?.message}>
          <Controller
            control={control}
            name="apiKey"
            render={({ field }) => (
              <AppInput
                placeholder="gsk_..."
                autoCapitalize="none"
                autoCorrect={false}
                secureTextEntry={keyHidden}
                value={field.value}
                onChangeText={(text) => {
                  field.onChange(text);
                  setTestResult(null);
                }}
                right={
                  <TextInput.Icon
                    icon={keyHidden ? 'eye-outline' : 'eye-off-outline'}
                    onPress={() => setKeyHidden((prev) => !prev)}
                  />
                }
              />
            )}
          />
          <AppText variant="bodySmall" color={colors.textSecondary} style={styles.hint}>
            Stored securely on this device. Never shared or logged.
          </AppText>
        </Field>

        <Pressable onPress={handleTestConnection} disabled={testing} style={styles.testButton}>
          <Ionicons name="pulse-outline" size={16} color={colors.primary} />
          <AppText variant="labelLarge" color={colors.primary}>
            {testing ? 'Testing…' : 'Test Connection'}
          </AppText>
        </Pressable>

        {testResult ? (
          <View style={[styles.resultBanner, { backgroundColor: testResult.ok ? colors.successContainer : colors.errorContainer }]}>
            <Ionicons
              name={testResult.ok ? 'checkmark-circle' : 'alert-circle'}
              size={16}
              color={testResult.ok ? colors.success : colors.error}
            />
            <AppText variant="bodySmall" color={testResult.ok ? colors.onSurface : colors.onErrorContainer} style={styles.resultText}>
              {testResult.message}
            </AppText>
          </View>
        ) : null}

        <View style={styles.row}>
          <Field label="Temperature" error={errors.temperature?.message} style={styles.half}>
            <Controller
              control={control}
              name="temperature"
              render={({ field }) => (
                <AppInput placeholder="0.7" keyboardType="numeric" value={field.value} onChangeText={field.onChange} />
              )}
            />
          </Field>
          <Field label="Max Tokens" error={errors.maxTokens?.message} style={styles.half}>
            <Controller
              control={control}
              name="maxTokens"
              render={({ field }) => (
                <AppInput placeholder="1024" keyboardType="numeric" value={field.value} onChangeText={field.onChange} />
              )}
            />
          </Field>
        </View>

        <PrimaryButton onPress={handleSubmit(onSubmit)} disabled={isSubmitting} style={styles.submit}>
          Save AI Settings
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
  field: {
    marginBottom: spacing.md,
  },
  fieldLabel: {
    marginBottom: spacing.xxs,
  },
  fieldError: {
    marginTop: spacing.xxs,
  },
  hint: {
    marginTop: spacing.xxs,
  },
  row: {
    flexDirection: 'row',
    gap: spacing.sm,
  },
  half: {
    flex: 1,
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.xs,
  },
  chip: {
    paddingVertical: spacing.xs,
    paddingHorizontal: spacing.sm,
    borderRadius: radius.full,
    backgroundColor: colors.surfaceVariant,
    borderWidth: 1,
    borderColor: colors.outline,
  },
  chipSelected: {
    backgroundColor: colors.primary,
    borderColor: colors.primary,
  },
  testButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: spacing.xxs,
    paddingVertical: spacing.sm,
    marginBottom: spacing.sm,
    borderRadius: radius.md,
    borderWidth: 1,
    borderColor: colors.primary,
  },
  resultBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs,
    padding: spacing.sm,
    borderRadius: radius.md,
    marginBottom: spacing.md,
  },
  resultText: {
    flex: 1,
  },
  submit: {
    marginTop: spacing.sm,
  },
});
