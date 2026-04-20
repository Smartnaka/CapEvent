export const Colors = {
  background: '#F5F5F7',
  surface: '#FFFFFF',
  primary: '#007AFF',
  primaryLight: '#E8F2FF',
  text: '#1C1C1E',
  secondaryText: '#6E6E73',
  border: 'rgba(0,0,0,0.06)',
  destructive: '#FF3B30',
  destructiveLight: '#FFF0EF',
  success: '#34C759',
  successLight: '#F0FFF4',
  tintedBackground: '#F0F7FF',
} as const;

export const Spacing = {
  xs: 4,
  sm: 8,
  md: 16,
  lg: 24,
  xl: 32,
  xxl: 48,
} as const;

export const Radius = {
  sm: 8,
  md: 12,
  lg: 16,
  xl: 20,
  xxl: 24,
  full: 9999,
} as const;

export const Typography = {
  largeTitle: {
    fontSize: 32,
    fontWeight: '700' as const,
    letterSpacing: -0.5,
    color: Colors.text,
  },
  title: {
    fontSize: 28,
    fontWeight: '700' as const,
    letterSpacing: -0.3,
    color: Colors.text,
  },
  headline: {
    fontSize: 20,
    fontWeight: '600' as const,
    color: Colors.text,
  },
  body: {
    fontSize: 16,
    fontWeight: '400' as const,
    lineHeight: 24,
    color: Colors.text,
  },
  subheadline: {
    fontSize: 15,
    fontWeight: '500' as const,
    color: Colors.text,
  },
  caption: {
    fontSize: 13,
    fontWeight: '400' as const,
    color: Colors.secondaryText,
  },
  small: {
    fontSize: 12,
    fontWeight: '400' as const,
    color: Colors.secondaryText,
  },
} as const;

export const Shadow = {
  soft: {
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 12,
    elevation: 3,
  },
  medium: {
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.08,
    shadowRadius: 20,
    elevation: 6,
  },
} as const;
