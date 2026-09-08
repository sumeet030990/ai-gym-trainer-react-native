import { useEffect } from 'react';
import { View, ScrollView, StyleSheet, Pressable } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import ScreenHeader from '../../../src/components/common/ScreenHeader';
import SectionHeader from '../../../src/components/common/SectionHeader';
import SettingsRow from '../../../src/components/common/SettingsRow';
import Avatar from '../../../src/components/common/Avatar';
import AppText from '../../../src/components/common/AppText';
import AppCard from '../../../src/components/cards/AppCard';
import { useProfileStore } from '../../../src/store/profileStore';
import { useGoalsStore } from '../../../src/store/goalsStore';
import { useAIConfigStore } from '../../../src/store/aiConfigStore';
import { useAuthStore } from '../../../src/store/authStore';
import { GOAL_TYPES, AI_PROVIDERS } from '../../../src/utils/schemas/settingsSchemas';
import { colors } from '../../../src/theme/colors';
import { spacing } from '../../../src/theme/spacing';

export default function SettingsHome() {
  const { name, email, avatarUri } = useProfileStore();
  const goalType = useGoalsStore((state) => state.goalType);
  const { provider, hasApiKey, hydrateApiKeyStatus } = useAIConfigStore();
  const logout = useAuthStore((state) => state.logout);

  useEffect(() => {
    hydrateApiKeyStatus();
  }, [hydrateApiKeyStatus]);

  const goalLabel = GOAL_TYPES.find((g) => g.value === goalType)?.label ?? 'Not set';
  const providerLabel = AI_PROVIDERS.find((p) => p.value === provider)?.label ?? provider;

  const handleLogout = async () => {
    await logout();
    router.replace('/login');
  };

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        <ScreenHeader title="Settings" />

        <Pressable onPress={() => router.push('/Settings/profile')}>
          <AppCard style={styles.profileCard}>
            <View style={styles.profileRow}>
              <Avatar uri={avatarUri} name={name} size={56} />
              <View style={styles.profileText}>
                <AppText variant="titleMedium">{name || 'Add your name'}</AppText>
                <AppText variant="bodySmall" color={colors.textSecondary}>
                  {email || 'Add your email'}
                </AppText>
              </View>
              <Ionicons name="chevron-forward" size={18} color={colors.textDisabled} />
            </View>
          </AppCard>
        </Pressable>

        <View style={styles.section}>
          <SectionHeader title="Account" />
          <AppCard>
            <SettingsRow
              icon="person-outline"
              label="Profile"
              subtitle="Name, email, body stats"
              onPress={() => router.push('/Settings/profile')}
            />
            <SettingsRow
              icon="flag-outline"
              iconColor={colors.success}
              iconBackground={colors.successContainer}
              label="Goals"
              subtitle={goalLabel}
              isLast
              onPress={() => router.push('/Settings/goals')}
            />
          </AppCard>
        </View>

        <View style={styles.section}>
          <SectionHeader title="AI Coach" />
          <AppCard>
            <SettingsRow
              icon="sparkles-outline"
              label="AI Settings"
              subtitle={hasApiKey ? `${providerLabel} · Connected` : `${providerLabel} · Not configured`}
              isLast
              onPress={() => router.push('/Settings/ai')}
            />
          </AppCard>
        </View>

        <View style={styles.section}>
          <SectionHeader title="Support" />
          <AppCard>
            <SettingsRow icon="information-circle-outline" label="About" isLast onPress={() => router.push('/Settings/about')} />
          </AppCard>
        </View>

        <View style={styles.section}>
          <AppCard>
            <SettingsRow
              icon="log-out-outline"
              label="Log Out"
              right={null}
              destructive
              isLast
              onPress={handleLogout}
            />
          </AppCard>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  content: {
    padding: spacing.lg,
    paddingBottom: spacing.xxxl,
    gap: spacing.lg,
  },
  profileCard: {
    padding: spacing.md,
  },
  profileRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
  },
  profileText: {
    flex: 1,
  },
  section: {
    gap: 0,
  },
});
