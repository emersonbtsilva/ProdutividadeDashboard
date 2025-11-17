import { extendTheme } from 'native-base';
import { colors as appColors, typography } from './global';

// NativeBase color scales require keys like 50..900; we map our brand to a usable scale
const primary = {
  50: '#f2e7fe',
  100: '#dbb2ff',
  200: '#bb86fc',
  300: '#985eff',
  400: '#7f39fb',
  500: appColors.primary, // base brand color
  600: '#3700b3',
  700: '#30009c',
  800: '#23036a',
  900: '#1a004b',
};

const accent = {
  50: '#e6fffb',
  100: '#b2fff1',
  200: '#7dfee7',
  300: '#47f8dd',
  400: '#1fe3cf',
  500: appColors.accent,
  600: '#02b3a0',
  700: '#028f81',
  800: '#016b62',
  900: '#004b46',
};

const success = {
  500: appColors.success,
};

const danger = {
  500: appColors.danger,
};

const config = {
  useSystemColorMode: true,
  initialColorMode: 'light',
};

export const theme = extendTheme({
  config,
  colors: {
    primary,
    secondary: accent,
    success,
    danger,
    background: {
      50: appColors.background,
    },
    surface: {
      50: appColors.surface,
    },
    text: {
      50: appColors.text,
      100: appColors.textSecondary,
    },
  },
  components: {
    Button: {
      defaultProps: {
        colorScheme: 'primary',
        rounded: 'md',
      },
    },
    Heading: {
      baseStyle: {
        fontWeight: typography.h1.fontWeight,
      },
      sizes: {
        lg: { fontSize: typography.h1.fontSize },
        md: { fontSize: typography.h2.fontSize },
      },
    },
    Input: {
      defaultProps: {
        size: 'md',
        variant: 'outline',
      },
    },
    Link: {
      defaultProps: {
        _text: { color: 'primary.500' },
      },
    },
  },
});

export type AppTheme = typeof theme;
