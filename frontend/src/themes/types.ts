import type { MantineThemeOverride } from '@mantine/core';

export type ThemeId = 'accounting';

/** Branded Mantine theme bundle (fonts, global CSS, `createTheme` output). */
export type ThemePackage = {
  id: ThemeId;
  mantineTheme: MantineThemeOverride;
  install: () => void;
};
