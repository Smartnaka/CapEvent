export const Colors = {
  background: '#0A0A0A',
  surface: '#111111',
  surfaceElevated: '#161616',
  text: '#FFFFFF',
  textMuted: '#9CA3AF',
  textFaint: '#6B7280',
  secondaryText: '#9CA3AF',
  stroke: '#1F2937',
  border: '#1F2937',
  accent: '#D4AF37',
  primary: '#D4AF37',
  primaryLight: 'rgba(212,175,55,0.15)',
  secondary: '#D4AF37',
  success: '#10B981',
  danger: '#EF4444',
  destructive: '#EF4444',
  destructiveLight: 'rgba(239,68,68,0.12)',
  successLight: 'rgba(16,185,129,0.12)',
  tintedBackground: 'rgba(212,175,55,0.08)',
  black: '#000000',
} as const;

export const Spacing = { xs: 6, sm: 10, md: 16, lg: 24, xl: 32, xxl: 44 } as const;

export const Radius = { sm: 4, md: 6, lg: 8, xl: 10, xxl: 10, full: 999 } as const;

export const Typography = {
  hero: { fontSize: 32, fontWeight: '700' as const, letterSpacing: -0.5, color: Colors.text },
  largeTitle: { fontSize: 28, fontWeight: '700' as const, letterSpacing: -0.5, color: Colors.text },
  title: { fontSize: 24, fontWeight: '700' as const, letterSpacing: -0.3, color: Colors.text },
  heading: { fontSize: 18, fontWeight: '600' as const, color: Colors.text },
  headline: { fontSize: 18, fontWeight: '600' as const, color: Colors.text },
  body: { fontSize: 15, lineHeight: 22, fontWeight: '400' as const, color: Colors.text },
  subheadline: { fontSize: 14, fontWeight: '500' as const, color: Colors.textMuted },
  label: { fontSize: 13, fontWeight: '500' as const, color: Colors.textMuted },
  caption: { fontSize: 12, fontWeight: '500' as const, color: Colors.textFaint },
  small: { fontSize: 12, fontWeight: '400' as const, color: Colors.textFaint },
} as const;

export const Shadow = {
  glow: { shadowColor: '#000', shadowOpacity: 0.4, shadowRadius: 8, shadowOffset: { width: 0, height: 4 }, elevation: 6 },
  card: { shadowColor: '#000', shadowOpacity: 0.4, shadowRadius: 8, shadowOffset: { width: 0, height: 4 }, elevation: 6 },
  soft: { shadowColor: '#000', shadowOpacity: 0.2, shadowRadius: 4, shadowOffset: { width: 0, height: 2 }, elevation: 3 },
  medium: { shadowColor: '#000', shadowOpacity: 0.3, shadowRadius: 6, shadowOffset: { width: 0, height: 3 }, elevation: 5 },
} as const;
