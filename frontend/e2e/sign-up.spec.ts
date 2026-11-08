// Paired with backend/tests/test_sign_up.py
import { expect, test } from '@playwright/test';
import { installAppApiMocks } from './fixtures/mock-api';
import { signUpFixtures } from './fixtures/sign-up-fixtures';

test.describe('sign up', () => {
  test('sign up success', async ({ page }) => {
    const payload = signUpFixtures.success;
    let captured: { email: string; password: string } | null = null;

    await installAppApiMocks(page, {
      onRegister: (body) => {
        captured = body;
      },
    });

    await page.goto('/register');
    await page.getByLabel('Email').fill(payload.email);
    await page
      .getByRole('textbox', { name: 'Password' })
      .fill(payload.password);
    await page.getByRole('button', { name: 'Create account' }).click();

    await expect(page).toHaveURL('/');
    await expect(page.getByText(`Signed in as ${payload.email}`)).toBeVisible();

    expect(captured).toEqual({
      email: payload.email,
      password: payload.password,
    });
  });

  test('sign up shows error when email is taken', async ({ page }) => {
    const payload = signUpFixtures.duplicate_email;

    await installAppApiMocks(page, {
      registerStatus: 400,
      registerBody: { detail: 'A user with that email already exists.' },
    });

    await page.goto('/register');
    await page.getByLabel('Email').fill(payload.email);
    await page
      .getByRole('textbox', { name: 'Password' })
      .fill(payload.password);
    await page.getByRole('button', { name: 'Create account' }).click();

    await expect(page).toHaveURL('/register');
    await expect(
      page.getByText('A user with that email already exists.'),
    ).toBeVisible();
  });
});
