import type { ThemePackage } from '../types';
import './install';
import { createAccountingMantineTheme } from './mantine-theme';

export const accountingThemePackage: ThemePackage = {
  id: 'accounting',
  mantineTheme: createAccountingMantineTheme(),
  install() {
    document.documentElement.dataset.appTheme = 'accounting';
  },
};
