import { test, expect } from '@playwright/test';

test('filters dispatch jobs by customer or neighborhood', async ({ page }) => {
  await page.goto('/auth/login');

  await page.getByLabel('Work email').fill('john.doe@example.com');
  await page.getByLabel('Password').fill('password123');
  await page.getByRole('button', { name: 'Sign in' }).click();

  await page.getByRole('link', { name: 'Dispatch Board' }).click();
  await page.getByTestId('dispatch-search').fill('Harbor');

  const rows = page.getByTestId('dispatch-job');
  await expect(rows.filter({ hasText: 'WellFit Gym' })).toBeVisible();
  await expect(rows.filter({ hasText: 'Harbor Logistics' })).toBeVisible();
  await expect(rows.filter({ hasText: 'Riverside Cafe' })).toHaveCount(0);
});

test('shows empty state when search has no matches', async ({ page }) => {
  await page.goto('/auth/login');

  await page.getByLabel('Work email').fill('john.doe@example.com');
  await page.getByLabel('Password').fill('password123');
  await page.getByRole('button', { name: 'Sign in' }).click();

  await page.getByRole('link', { name: 'Dispatch Board' }).click();
  await page.getByTestId('dispatch-search').fill('Nonexistent');

  const rows = page.getByTestId('dispatch-job');
  await expect(rows).toHaveCount(0);
  await expect(page.getByTestId('dispatch-empty-state')).toBeVisible();
});
