import { View, StyleSheet } from 'react-native';
import { ActivityIndicator } from 'react-native-paper';
import { colors } from '../../theme/colors';

export default function Loader({ height = 160, isLoading = true, children, style }) {
  return (
    <View style={[styles.container, { height }, style]}>
      {isLoading && <ActivityIndicator color={colors.primary} />}
      {children}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
  },
});
