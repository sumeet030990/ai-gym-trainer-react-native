import { Text } from 'react-native';
import { colors } from '../../theme/colors';
import { typography } from '../../theme/typography';

export default function AppText({ variant = 'bodyMedium', color = colors.textPrimary, style, ...rest }) {
  return <Text style={[typography[variant], { color }, style]} {...rest} />;
}
