import { test, expect } from '@playwright/test';

test('smoke: app loads login page', async ({ page }) => {
  await page.goto('/login');
  await expect(page).toHaveURL(/\/login/);
  await expect(page.getByText(/вход/i)).toBeVisible();
});

