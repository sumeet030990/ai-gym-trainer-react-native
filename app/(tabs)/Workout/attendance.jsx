import { useMemo, useState } from 'react';
import { View, StyleSheet, FlatList } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import ScreenHeader from '../../../src/components/common/ScreenHeader';
import Loader from '../../../src/components/common/Loader';
import ErrorView from '../../../src/components/common/ErrorView';
import EmptyState from '../../../src/components/common/EmptyState';
import AppCard from '../../../src/components/cards/AppCard';
import AppText from '../../../src/components/common/AppText';
import AttendanceRecordCard from '../../../src/components/cards/AttendanceRecordCard';
import AttendanceFilterSheet from '../../../src/components/dialogs/AttendanceFilterSheet';
import { useUserProfile } from '../../../src/hooks/useUserProfile';
import { useAttendanceHistory } from '../../../src/hooks/useAttendanceHistory';
import { defaultAttendanceFilter, resolveAttendanceFilter } from '../../../src/utils/attendanceDateRanges';
import { colors } from '../../../src/theme/colors';
import { spacing } from '../../../src/theme/spacing';

export default function Attendance() {
  const { data: profile } = useUserProfile();
  const userId = profile?.user?.id;

  const [filter, setFilter] = useState(defaultAttendanceFilter);
  const [sheetVisible, setSheetVisible] = useState(false);

  const { startDate, endDate, label } = useMemo(() => resolveAttendanceFilter(filter), [filter]);
  const { data: records, isLoading, isError, refetch } = useAttendanceHistory(userId, { startDate, endDate });

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <View style={styles.header}>
        <ScreenHeader
          eyebrow="Workout"
          title="Attendance"
          rightIcon="options-outline"
          onRightPress={() => setSheetVisible(true)}
        />
      </View>

      <View style={styles.summaryWrap}>
        <AppCard style={styles.summaryCard}>
          <View>
            <AppText variant="labelMedium" color={colors.textSecondary}>
              {label}
            </AppText>
            <AppText variant="titleLarge">
              {records?.length ?? 0} {records?.length === 1 ? 'check-in' : 'check-ins'}
            </AppText>
          </View>
        </AppCard>
      </View>

      {isLoading ? (
        <Loader height={300} />
      ) : isError ? (
        <ErrorView message="Couldn't load your attendance history." onRetry={refetch} />
      ) : (
        <FlatList
          data={records}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.list}
          showsVerticalScrollIndicator={false}
          ItemSeparatorComponent={() => <View style={{ height: spacing.sm }} />}
          ListEmptyComponent={
            <EmptyState icon="calendar-outline" title="No check-ins" message="No attendance found for this period." />
          }
          renderItem={({ item }) => <AttendanceRecordCard record={item} />}
        />
      )}

      <AttendanceFilterSheet
        visible={sheetVisible}
        filter={filter}
        onClose={() => setSheetVisible(false)}
        onApply={(nextFilter) => {
          setFilter(nextFilter);
          setSheetVisible(false);
        }}
        onClear={() => {
          setFilter(defaultAttendanceFilter());
          setSheetVisible(false);
        }}
      />
    </SafeAreaView>
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
  summaryWrap: {
    paddingHorizontal: spacing.lg,
    marginBottom: spacing.sm,
  },
  summaryCard: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  list: {
    padding: spacing.lg,
    paddingTop: 0,
  },
});
