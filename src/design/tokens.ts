export const Colors = {
  background: '#040407',
  surface: 'rgba(18, 19, 30, 0.7)',
  surfaceElevated: 'rgba(24, 26, 40, 0.82)',
  text: '#F4F7FF',
  textMuted: 'rgba(216, 222, 255, 0.66)',
  textFaint: 'rgba(216, 222, 255, 0.46)',
  secondaryText: 'rgba(216, 222, 255, 0.66)',
  stroke: 'rgba(164, 177, 255, 0.2)',
  border: 'rgba(164, 177, 255, 0.2)',
  primary: '#7A7DFF',
  primaryLight: 'rgba(122,125,255,0.2)',
  secondary: '#2ED2FF',
  accent: '#C36BFF',
  success: '#38E2A5',
  danger: '#FF6C8C',
  destructive: '#FF6C8C',
  destructiveLight: 'rgba(255,108,140,0.16)',
  successLight: 'rgba(56,226,165,0.16)',
  tintedBackground: 'rgba(122,125,255,0.14)',
  black: '#000000',
} as const;

export const Spacing = { xs: 6, sm: 10, md: 16, lg: 24, xl: 32, xxl: 44 } as const;

export const Radius = { sm: 12, md: 16, lg: 20, xl: 24, xxl: 28, full: 999 } as const;

export const Typography = {
  hero: { fontSize: 38, fontWeight: '700' as const, letterSpacing: -1, color: Colors.text },
  largeTitle: { fontSize: 32, fontWeight: '700' as const, letterSpacing: -0.8, color: Colors.text },
  title: { fontSize: 28, fontWeight: '700' as const, letterSpacing: -0.5, color: Colors.text },
  heading: { fontSize: 20, fontWeight: '600' as const, letterSpacing: -0.25, color: Colors.text },
  headline: { fontSize: 20, fontWeight: '600' as const, letterSpacing: -0.25, color: Colors.text },
  body: { fontSize: 16, lineHeight: 24, fontWeight: '400' as const, color: Colors.text },
  subheadline: { fontSize: 15, fontWeight: '500' as const, color: Colors.textMuted },
  label: { fontSize: 13, fontWeight: '500' as const, color: Colors.textMuted },
  caption: { fontSize: 12, fontWeight: '500' as const, color: Colors.textFaint },
  small: { fontSize: 12, fontWeight: '400' as const, color: Colors.textFaint },
} as const;

export const Shadow = {
  glow: { shadowColor: '#5D7CFF', shadowOpacity: 0.45, shadowRadius: 24, shadowOffset: { width: 0, height: 10 }, elevation: 12 },
  card: { shadowColor: '#000', shadowOpacity: 0.45, shadowRadius: 18, shadowOffset: { width: 0, height: 12 }, elevation: 10 },
  soft: { shadowColor: '#000', shadowOpacity: 0.2, shadowRadius: 12, shadowOffset: { width: 0, height: 6 }, elevation: 6 },
  medium: { shadowColor: '#000', shadowOpacity: 0.35, shadowRadius: 18, shadowOffset: { width: 0, height: 10 }, elevation: 10 },
} as const;
