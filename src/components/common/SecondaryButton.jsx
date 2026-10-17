import { Button } from 'react-native-paper';
import { colors } from '../../theme/colors';
import { radius } from '../../theme/radius';

export default function SecondaryButton({ children, icon, onPress, style, ...rest }) {
  return (
    <Button
      mode="outlined"
      icon={icon}
      onPress={onPress}
      textColor={colors.primary}
      style={[{ borderRadius: radius.full, borderColor: colors.outline }, style]}
      contentStyle={{ height: 48 }}
      labelStyle={{ fontWeight: '600' }}
      {...rest}
    >
      {children}
    </Button>
  );
}
