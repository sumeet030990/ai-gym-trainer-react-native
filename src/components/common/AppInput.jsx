import { TextInput } from 'react-native-paper';
import { colors } from '../../theme/colors';
import { radius } from '../../theme/radius';

export default function AppInput({ style, ...rest }) {
  return (
    <TextInput
      mode="outlined"
      outlineColor={colors.outline}
      activeOutlineColor={colors.primary}
      style={[{ backgroundColor: colors.surface }, style]}
      outlineStyle={{ borderRadius: radius.md }}
      {...rest}
    />
  );
}
