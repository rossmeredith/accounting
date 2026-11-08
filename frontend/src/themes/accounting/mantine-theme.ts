import { createTheme } from '@mantine/core';
import { accountingBrand, accountingSlate } from './colors';

export function createAccountingMantineTheme() {
  return createTheme({
    primaryColor: 'brand',
    primaryShade: { light: 6, dark: 5 },
    defaultRadius: 0,
    autoContrast: true,
    fontFamily:
      '"Helvetica Neue", Helvetica, Arial, "IBM Plex Sans", sans-serif',
    fontFamilyMonospace:
      '"IBM Plex Mono", ui-monospace, SFMono-Regular, Menlo, monospace',
    headings: {
      fontFamily:
        '"Newsreader", "Iowan Old Style", Georgia, "Times New Roman", serif',
      fontWeight: '600',
      sizes: {
        h1: { fontSize: '2rem', lineHeight: '1.15', fontWeight: '600' },
        h2: { fontSize: '1.5rem', lineHeight: '1.2', fontWeight: '600' },
        h3: { fontSize: '1.25rem', lineHeight: '1.25', fontWeight: '600' },
        h4: { fontSize: '1.0625rem', lineHeight: '1.3', fontWeight: '600' },
      },
    },
    colors: {
      brand: accountingBrand,
      slate: accountingSlate,
    },
    shadows: {
      xs: '0 1px 2px 0 rgb(51 48 46 / 0.05)',
      sm: '0 1px 3px 0 rgb(51 48 46 / 0.08), 0 1px 2px -1px rgb(51 48 46 / 0.06)',
      md: '0 4px 6px -1px rgb(51 48 46 / 0.08), 0 2px 4px -2px rgb(51 48 46 / 0.06)',
    },
    components: {
      Paper: {
        defaultProps: {
          withBorder: true,
          shadow: 'none',
          radius: 0,
        },
      },
      Button: {
        defaultProps: {
          radius: 0,
          color: 'dark',
        },
      },
      TextInput: {
        defaultProps: {
          radius: 0,
        },
      },
      PasswordInput: {
        defaultProps: {
          radius: 0,
        },
      },
      Anchor: {
        defaultProps: {
          underline: 'hover',
          c: 'brand.6',
        },
      },
    },
  });
}
