import { test, expect } from '@playwright/test';

test('Search Page loads and allows input', async ({ page }) => {
  await page.goto('http://localhost:3000/search?from=HYB&to=BZA&date=2025-11-10');
  await expect(page.locator('text=Select Tickets')).toBeVisible();
});

test('Trains list is displayed correctly', async ({ page }) => {
  await page.goto('http://localhost:3000/search?from=HYB&to=BZA&date=2025-11-10');
  await expect(page.locator('.card')).toHaveCountGreaterThan(0);
});
