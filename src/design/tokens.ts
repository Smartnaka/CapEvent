// Dark-mode-first premium design tokens
export const Colors = {
  // Backgrounds — rich blacks, not grays
  background: '#09090F',
  backgroundSecondary: '#0D0D1A',
  backgroundTertiary: '#111122',

  // Glass surfaces
  surface: 'rgba(255,255,255,0.05)',
  surfaceElevated: 'rgba(255,255,255,0.08)',
  surfaceHighlight: 'rgba(255,255,255,0.12)',
  surfaceSolid: '#141428',

  // Primary — electric indigo
  primary: '#6366F1',
  primaryLight: 'rgba(99,102,241,0.18)',
  primaryGlow: 'rgba(99,102,241,0.35)',

  // Accents — purple / blue neon
  accent: '#A78BFA',
  accentBlue: '#60A5FA',
  accentGlow: 'rgba(167,139,250,0.25)',
  neon: '#8B5CF6',

  // Text
  text: '#F0F0FF',
  secondaryText: '#8B8BA7',
  mutedText: '#4B4B6B',

  // Borders
  border: 'rgba(255,255,255,0.08)',
  borderLight: 'rgba(255,255,255,0.14)',
  borderGlow: 'rgba(99,102,241,0.4)',

  // Semantic
  destructive: '#FF4D6D',
  destructiveLight: 'rgba(255,77,109,0.15)',
  success: '#34D399',
  successLight: 'rgba(52,211,153,0.15)',

  // Legacy aliases for backwards compat
  tintedBackground: 'rgba(99,102,241,0.1)',
} as const;

// Gradient stops used throughout the app
export const Gradients = {
  primary: ['#6366F1', '#8B5CF6'] as const,
  primarySubtle: ['rgba(99,102,241,0.2)', 'rgba(139,92,246,0.1)'] as const,
  hero: ['#0D0D1A', '#12122A'] as const,
  card: ['rgba(255,255,255,0.06)', 'rgba(255,255,255,0.02)'] as const,
  accent: ['#60A5FA', '#6366F1'] as const,
  dark: ['#09090F', '#0D0D1A'] as const,
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
    fontSize: 34,
    fontWeight: '700' as const,
    letterSpacing: -0.8,
    color: Colors.text,
  },
  title: {
    fontSize: 28,
    fontWeight: '700' as const,
    letterSpacing: -0.5,
    color: Colors.text,
  },
  headline: {
    fontSize: 20,
    fontWeight: '600' as const,
    letterSpacing: -0.2,
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
    shadowColor: '#6366F1',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.12,
    shadowRadius: 12,
    elevation: 4,
  },
  medium: {
    shadowColor: '#6366F1',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.2,
    shadowRadius: 24,
    elevation: 8,
  },
  glow: {
    shadowColor: '#8B5CF6',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.6,
    shadowRadius: 20,
    elevation: 10,
  },
} as const;
