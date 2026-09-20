import { useEffect, useState } from 'react';
import { View, StyleSheet, Pressable, Platform } from 'react-native';
import { SegmentedButtons } from 'react-native-paper';
import DateTimePicker from '@react-native-community/datetimepicker';
import { Ionicons } from '@expo/vector-icons';
import BottomSheet from '../common/BottomSheet';
import AppText from '../common/AppText';
import PrimaryButton from '../common/PrimaryButton';
import { colors } from '../../theme/colors';
import { spacing } from '../../theme/spacing';
import { radius } from '../../theme/radius';

const MODE_OPTIONS = [
  { value: 'last15', label: '15 Days' },
  { value: 'month', label: 'Month' },
  { value: 'year', label: 'Year' },
  { value: 'custom', label: 'Custom' },
];

export default function AttendanceFilterSheet({ visible, filter, onClose, onApply, onClear }) {
  const [mode, setMode] = useState(filter.mode);
  const [monthDate, setMonthDate] = useState(filter.monthDate);
  const [yearValue, setYearValue] = useState(filter.yearValue);
  const [customStart, setCustomStart] = useState(filter.customStart);
  const [customEnd, setCustomEnd] = useState(filter.customEnd);
  const [activePicker, setActivePicker] = useState(null);

  useEffect(() => {
    if (visible) {
      setMode(filter.mode);
      setMonthDate(filter.monthDate);
      setYearValue(filter.yearValue);
      setCustomStart(filter.customStart);
      setCustomEnd(filter.customEnd);
      setActivePicker(null);
    }
  }, [visible, filter]);

  const today = new Date();
  const isCurrentMonth = monthDate.getFullYear() === today.getFullYear() && monthDate.getMonth() === today.getMonth();
  const isCurrentYear = yearValue === today.getFullYear();
  const canApply = mode !== 'custom' || Boolean(customStart && customEnd && customStart <= customEnd);

  const shiftMonth = (delta) => {
    setMonthDate((prev) => {
      const next = new Date(prev.getFullYear(), prev.getMonth() + delta, 1);
      return next > today ? prev : next;
    });
  };

  const shiftYear = (delta) => {
    setYearValue((prev) => Math.min(today.getFullYear(), prev + delta));
  };

  const handlePickerChange = (event, selectedDate) => {
    if (Platform.OS !== 'ios') setActivePicker(null);
    if (event.type === 'dismissed' || !selectedDate) return;
    if (activePicker === 'start') setCustomStart(selectedDate);
    else setCustomEnd(selectedDate);
  };

  return (
    <BottomSheet visible={visible} onClose={onClose}>
      <AppText variant="titleLarge" style={styles.title}>
        Filter Attendance
      </AppText>

      <SegmentedButtons value={mode} onValueChange={setMode} buttons={MODE_OPTIONS} style={styles.segmented} />

      {mode === 'month' ? (
        <View style={styles.stepperRow}>
          <Pressable onPress={() => shiftMonth(-1)} hitSlop={8} style={styles.stepperButton}>
            <Ionicons name="chevron-back" size={20} color={colors.textPrimary} />
          </Pressable>
          <AppText variant="titleMedium">
            {monthDate.toLocaleDateString(undefined, { month: 'long', year: 'numeric' })}
          </AppText>
          <Pressable
            onPress={() => shiftMonth(1)}
            hitSlop={8}
            disabled={isCurrentMonth}
            style={[styles.stepperButton, isCurrentMonth && styles.stepperButtonDisabled]}
          >
            <Ionicons name="chevron-forward" size={20} color={isCurrentMonth ? colors.textDisabled : colors.textPrimary} />
          </Pressable>
        </View>
      ) : null}

      {mode === 'year' ? (
        <View style={styles.stepperRow}>
          <Pressable onPress={() => shiftYear(-1)} hitSlop={8} style={styles.stepperButton}>
            <Ionicons name="chevron-back" size={20} color={colors.textPrimary} />
          </Pressable>
          <AppText variant="titleMedium">{yearValue}</AppText>
          <Pressable
            onPress={() => shiftYear(1)}
            hitSlop={8}
            disabled={isCurrentYear}
            style={[styles.stepperButton, isCurrentYear && styles.stepperButtonDisabled]}
          >
            <Ionicons name="chevron-forward" size={20} color={isCurrentYear ? colors.textDisabled : colors.textPrimary} />
          </Pressable>
        </View>
      ) : null}

      {mode === 'custom' ? (
        <View style={styles.customRow}>
          <Pressable style={styles.dateField} onPress={() => setActivePicker('start')}>
            <AppText variant="labelSmall" color={colors.textSecondary}>
              From
            </AppText>
            <AppText variant="bodyMedium">{customStart ? customStart.toLocaleDateString() : 'Select date'}</AppText>
          </Pressable>
          <Pressable style={styles.dateField} onPress={() => setActivePicker('end')}>
            <AppText variant="labelSmall" color={colors.textSecondary}>
              To
            </AppText>
            <AppText variant="bodyMedium">{customEnd ? customEnd.toLocaleDateString() : 'Select date'}</AppText>
          </Pressable>
        </View>
      ) : null}

      {activePicker ? (
        <View style={styles.pickerWrap}>
          <DateTimePicker
            value={(activePicker === 'start' ? customStart : customEnd) ?? today}
            mode="date"
            display={Platform.OS === 'ios' ? 'inline' : 'default'}
            maximumDate={today}
            onChange={handlePickerChange}
          />
          {Platform.OS === 'ios' ? (
            <Pressable onPress={() => setActivePicker(null)} style={styles.pickerDone}>
              <AppText variant="labelLarge" color={colors.primary}>
                Done
              </AppText>
            </Pressable>
          ) : null}
        </View>
      ) : null}

      <View style={styles.actions}>
        <PrimaryButton
          onPress={onClear}
          buttonColor={colors.surfaceVariant}
          textColor={colors.textPrimary}
          style={styles.actionButton}
        >
          Reset
        </PrimaryButton>
        <PrimaryButton
          onPress={() => onApply({ mode, monthDate, yearValue, customStart, customEnd })}
          disabled={!canApply}
          style={styles.actionButton}
        >
          Apply
        </PrimaryButton>
      </View>
    </BottomSheet>
  );
}

const styles = StyleSheet.create({
  title: {
    marginBottom: spacing.md,
  },
  segmented: {
    marginBottom: spacing.lg,
  },
  stepperRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: spacing.lg,
    marginBottom: spacing.lg,
  },
  stepperButton: {
    width: 36,
    height: 36,
    borderRadius: radius.full,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.surfaceVariant,
  },
  stepperButtonDisabled: {
    opacity: 0.5,
  },
  customRow: {
    flexDirection: 'row',
    gap: spacing.sm,
    marginBottom: spacing.md,
  },
  dateField: {
    flex: 1,
    borderRadius: radius.md,
    borderWidth: 1,
    borderColor: colors.outline,
    padding: spacing.sm,
    gap: spacing.xxs,
  },
  pickerWrap: {
    marginBottom: spacing.md,
    alignItems: 'center',
  },
  pickerDone: {
    alignSelf: 'flex-end',
    paddingVertical: spacing.xs,
    paddingHorizontal: spacing.sm,
  },
  actions: {
    flexDirection: 'row',
    gap: spacing.sm,
  },
  actionButton: {
    flex: 1,
  },
});
