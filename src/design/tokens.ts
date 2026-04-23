export const Colors = {
  background: '#F8F6F4',
  surface: '#FFFFFF',
  surfaceElevated: '#F5F1FB',
  text: '#1F2852',
  textMuted: '#68708A',
  textFaint: '#9AA1B6',
  secondaryText: '#7A8198',
  stroke: '#E8E1F2',
  border: '#ECE6F5',
  accent: '#9D7BEA',
  primary: '#9D7BEA',
  primaryLight: '#EEE5FF',
  secondary: '#76C08E',
  success: '#56B58A',
  danger: '#E26D7A',
  destructive: '#E26D7A',
  destructiveLight: 'rgba(226,109,122,0.12)',
  successLight: 'rgba(86,181,138,0.14)',
  tintedBackground: '#F4EEFF',
  black: '#000000',
} as const;

export const Spacing = { xs: 6, sm: 10, md: 16, lg: 24, xl: 32, xxl: 44 } as const;

export const Radius = { sm: 8, md: 12, lg: 16, xl: 20, xxl: 24, full: 999 } as const;

export const Typography = {
  hero: { fontSize: 34, fontWeight: '700' as const, letterSpacing: -0.5, color: Colors.text },
  largeTitle: { fontSize: 30, fontWeight: '700' as const, letterSpacing: -0.4, color: Colors.text },
  title: { fontSize: 24, fontWeight: '700' as const, letterSpacing: -0.2, color: Colors.text },
  heading: { fontSize: 18, fontWeight: '600' as const, color: Colors.text },
  headline: { fontSize: 18, fontWeight: '600' as const, color: Colors.text },
  body: { fontSize: 16, lineHeight: 24, fontWeight: '400' as const, color: Colors.text },
  subheadline: { fontSize: 14, fontWeight: '600' as const, color: Colors.textMuted },
  label: { fontSize: 13, fontWeight: '600' as const, color: Colors.textMuted },
  caption: { fontSize: 12, fontWeight: '500' as const, color: Colors.textFaint },
  small: { fontSize: 12, fontWeight: '400' as const, color: Colors.textFaint },
} as const;

export const Shadow = {
  glow: { shadowColor: '#7E64C3', shadowOpacity: 0.16, shadowRadius: 16, shadowOffset: { width: 0, height: 8 }, elevation: 8 },
  card: { shadowColor: '#1C123B', shadowOpacity: 0.08, shadowRadius: 14, shadowOffset: { width: 0, height: 6 }, elevation: 4 },
  soft: { shadowColor: '#1C123B', shadowOpacity: 0.08, shadowRadius: 10, shadowOffset: { width: 0, height: 4 }, elevation: 2 },
  medium: { shadowColor: '#1C123B', shadowOpacity: 0.12, shadowRadius: 12, shadowOffset: { width: 0, height: 6 }, elevation: 4 },
} as const;
