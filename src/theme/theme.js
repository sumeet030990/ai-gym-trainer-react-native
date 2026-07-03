import { MD3LightTheme } from 'react-native-paper';
import { colors } from './colors';

export const theme = {
  ...MD3LightTheme,
  roundness: 16,
  colors: {
    ...MD3LightTheme.colors,
    ...colors,
  },
};

export { colors } from './colors';
export { spacing } from './spacing';
export { radius } from './radius';
export { typography } from './typography';
export { elevation } from './elevation';
