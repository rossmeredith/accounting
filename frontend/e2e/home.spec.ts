import { expect, test } from '@playwright/test';

test('shows app shell and live API health', async ({ page }) => {
  await page.goto('/');

  await expect(page.getByRole('heading', { name: 'Accounting' })).toBeVisible();
  await expect(page.getByText('Backend health: ok')).toBeVisible();
  await expect(page.getByRole('button', { name: 'Mantine button' })).toBeVisible();
});
