import { Button } from 'react-native-paper';
import { colors } from '../../theme/colors';
import { radius } from '../../theme/radius';

export default function PrimaryButton({ children, icon, onPress, style, ...rest }) {
  return (
    <Button
      mode="contained"
      icon={icon}
      onPress={onPress}
      buttonColor={colors.primary}
      textColor={colors.onPrimary}
      style={[{ borderRadius: radius.full }, style]}
      contentStyle={{ height: 48 }}
      labelStyle={{ fontWeight: '600' }}
      {...rest}
    >
      {children}
    </Button>
  );
}
