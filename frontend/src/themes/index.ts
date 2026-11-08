import { accountingThemePackage } from './accounting';
import type { ThemeId, ThemePackage } from './types';

const themePackages = {
  accounting: accountingThemePackage,
} as const satisfies Record<ThemeId, ThemePackage>;

export type { ThemeId, ThemePackage } from './types';

export const defaultThemeId: ThemeId = 'accounting';

export function getThemePackage(id: ThemeId = defaultThemeId): ThemePackage {
  return themePackages[id];
}

export function listThemeIds(): ThemeId[] {
  return Object.keys(themePackages) as ThemeId[];
}
