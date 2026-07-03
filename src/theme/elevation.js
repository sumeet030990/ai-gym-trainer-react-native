import { Platform } from 'react-native';

// Soft-shadow presets shared by cards/surfaces so elevation stays consistent app-wide.
const shadow = (opacity, radius, height, elevation) =>
  Platform.select({
    ios: {
      shadowColor: '#1C1B1F',
      shadowOpacity: opacity,
      shadowRadius: radius,
      shadowOffset: { width: 0, height },
    },
    android: { elevation },
    default: {},
  });

export const elevation = {
  level0: shadow(0, 0, 0, 0),
  level1: shadow(0.06, 6, 2, 2),
  level2: shadow(0.08, 10, 4, 4),
  level3: shadow(0.1, 16, 6, 8),
};
