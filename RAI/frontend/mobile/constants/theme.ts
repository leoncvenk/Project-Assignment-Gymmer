export const colors = {
  background: '#f2f2f2',
  sidebar: '#2b2b2b',
  card: '#413f4f',

  accent: '#00a97f',
  accentHover: '#008a68',

  text: '#2b2b2b',
  textOnDark: '#f2f2f2',
  muted: '#c5c5c5',
  white: '#ffffff',

  danger: '#ef4444',
  dangerSoft: '#fef2f2',
  dangerHover: '#dc2626',

  success: '#00a97f',
  successSoft: '#e6f7f2',

  warning: '#f59e0b',
  warningSoft: '#fff7ed',
} as const;

export const spacing = {
  xs: 4,
  sm: 8,
  md: 12,
  lg: 16,
  xl: 24,
  '2xl': 32,
} as const;

export const radius = {
  sm: 8,
  md: 12,
  lg: 16,
  xl: 24,
} as const;

export const layout = {
  floatingTabBarHeight: 84,
  floatingTabBarMarginBottom: 16,
  floatingTabBarSafePadding: 84,
} as const;
