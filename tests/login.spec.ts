import { test, expect } from '@playwright/test';

test('shows validation messages for an empty login form', async ({ page }) => {
  await page.goto('/auth/login');

  await page.getByRole('button', { name: 'Sign in' }).click();

  await expect(page.getByText('Enter a valid email address.')).toBeVisible();
  await expect(page.getByText('Enter your password.')).toBeVisible();
});

test('logging in and logging out', async ({ page }) => {
  await page.goto('/auth/login');

  await page.getByLabel('Work email').fill('john.doe@example.com');
  await page.getByLabel('Password').fill('password123');
  await page.getByRole('button', { name: 'Sign in' }).click();
  await expect(page).toHaveURL('/app/dashboard');

  await page.getByRole('button', { name: 'Sign out' }).click();
  await expect(page).toHaveURL('/auth/login');
});
