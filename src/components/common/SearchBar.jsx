import { View, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { TextInput } from 'react-native-paper';
import { colors } from '../../theme/colors';
import { radius } from '../../theme/radius';
import { spacing } from '../../theme/spacing';

export default function SearchBar({ value, onChangeText, placeholder = 'Search', onFilterPress, showFilter = false }) {
  return (
    <View style={styles.row}>
      <TextInput
        mode="flat"
        value={value}
        onChangeText={onChangeText}
        placeholder={placeholder}
        left={<TextInput.Icon icon={() => <Ionicons name="search" size={18} color={colors.textSecondary} />} />}
        style={styles.input}
        underlineStyle={{ display: 'none' }}
        contentStyle={styles.inputContent}
      />
      {showFilter ? (
        <View style={styles.filterButton}>
          <Ionicons
            name="options-outline"
            size={20}
            color={colors.primary}
            onPress={onFilterPress}
            suppressHighlighting
          />
        </View>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
  },
  input: {
    flex: 1,
    height: 48,
    backgroundColor: colors.surfaceVariant,
    borderRadius: radius.md,
  },
  inputContent: {
    paddingTop: 0,
  },
  filterButton: {
    width: 48,
    height: 48,
    borderRadius: radius.md,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.primaryContainer,
  },
});
