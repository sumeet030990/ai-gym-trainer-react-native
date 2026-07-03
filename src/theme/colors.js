// MD3 color roles. Never hardcode colors in screens/components — import from here.

export const brand = {
  indigo: '#4F46E5',
  indigoDark: '#3730D9',
  indigoLight: '#EEF0FF',
  mint: '#12B76A',
  mintLight: '#E7F9F0',
  amber: '#F59E0B',
  amberLight: '#FEF3E2',
  coral: '#F04438',
  coralLight: '#FDECEA',
  sky: '#0BA5EC',
  skyLight: '#E7F6FE',
};

export const colors = {
  primary: brand.indigo,
  onPrimary: '#FFFFFF',
  primaryContainer: brand.indigoLight,
  onPrimaryContainer: brand.indigoDark,

  secondary: brand.sky,
  onSecondary: '#FFFFFF',
  secondaryContainer: brand.skyLight,
  onSecondaryContainer: '#075985',

  tertiary: brand.amber,
  onTertiary: '#FFFFFF',
  tertiaryContainer: brand.amberLight,
  onTertiaryContainer: '#8A5A05',

  success: brand.mint,
  successContainer: brand.mintLight,
  error: brand.coral,
  onError: '#FFFFFF',
  errorContainer: brand.coralLight,
  onErrorContainer: '#912018',

  background: '#F7F7FB',
  surface: '#FFFFFF',
  surfaceVariant: '#F1F1F6',
  onSurface: '#1C1B1F',
  onSurfaceVariant: '#6B6A75',

  outline: '#E4E3EA',
  outlineVariant: '#EFEEF4',

  textPrimary: '#1C1B1F',
  textSecondary: '#6B6A75',
  textDisabled: '#A8A7B3',

  overlay: 'rgba(28, 27, 31, 0.5)',
  white: '#FFFFFF',
};
