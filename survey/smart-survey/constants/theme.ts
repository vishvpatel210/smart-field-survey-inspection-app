import { Platform } from 'react-native';

const tintColorLight = '#4F46E5'; // Electric Indigo
const tintColorDark = '#818CF8'; // Light Indigo

export const AppColors = {
  primary: '#2E2A72', // Premium Deep Midnight Navy/Indigo
  primaryLight: '#4F46E5', // Electric Indigo
  primaryDark: '#1E1B4B', // Rich Midnight
  secondary: '#8B5CF6', // Royal Violet
  secondaryLight: '#A78BFA',
  accent: '#F59E0B', // Amber Gold
  danger: '#F43F5E', // Warm Crimson Rose
  dangerLight: '#FECDD3',
  warning: '#EA580C',
  success: '#10B981', // Emerald Success
  white: '#FFFFFF',
  black: '#090D1A', // Slate Black
  gray50: '#F8FAFC',
  gray100: '#F1F5F9',
  gray200: '#E2E8F0',
  gray300: '#CBD5E1',
  gray400: '#94A3B8',
  gray500: '#64748B',
  gray600: '#475569',
  gray700: '#334155',
  gray800: '#1E293B',
  gray900: '#0F172A',
  priorityHigh: '#F43F5E',
  priorityMedium: '#F59E0B',
  priorityLow: '#10B981',
};

export const AppShadows = {
  sm: {
    shadowColor: AppColors.gray900,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.03,
    shadowRadius: 6,
    elevation: 2,
  },
  md: {
    shadowColor: AppColors.gray900,
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.05,
    shadowRadius: 16,
    elevation: 4,
  },
  lg: {
    shadowColor: AppColors.primaryLight,
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.08,
    shadowRadius: 24,
    elevation: 8,
  },
};

export const Colors = {
  light: {
    text: '#0F172A',
    background: '#F8FAFC',
    tint: tintColorLight,
    icon: '#64748B',
    tabIconDefault: '#94A3B8',
    tabIconSelected: tintColorLight,
    card: '#FFFFFF',
    cardBorder: '#E2E8F0',
    textSecondary: '#475569',
    textMuted: '#94A3B8',
  },
  dark: {
    text: '#F8FAFC',
    background: '#0F172A',
    tint: tintColorDark,
    icon: '#94A3B8',
    tabIconDefault: '#64748B',
    tabIconSelected: tintColorDark,
    card: '#1E293B',
    cardBorder: '#334155',
    textSecondary: '#94A3B8',
    textMuted: '#64748B',
  },
};

export const Fonts = Platform.select({
  ios: {
    sans: 'system-ui',
    serif: 'ui-serif',
    rounded: 'ui-rounded',
    mono: 'ui-monospace',
  },
  default: {
    sans: 'normal',
    serif: 'serif',
    rounded: 'normal',
    mono: 'monospace',
  },
  web: {
    sans: "system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif",
    serif: "Georgia, 'Times New Roman', serif",
    rounded: "'SF Pro Rounded', 'Hiragino Maru Gothic ProN', Meiryo, 'MS PGothic', sans-serif",
    mono: "SFMono-Regular, Menlo, Monaco, Consolas, 'Liberation Mono', 'Courier New', monospace",
  },
});
