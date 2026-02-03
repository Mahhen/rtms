import { test, expect } from '@playwright/test';

test.describe('Search page tests', () => {
  test('Search page loads and trains list exists', async ({ page }) => {
    await page.goto('/search?from=HYB&to=BZA&date=2025-11-10');
    await page.waitForLoadState('networkidle');

    const showMap = page.locator('text=Show map').first();
    await expect(showMap).toBeVisible({ timeout: 30000 });

    await page.screenshot({ path: 'screenshots/search-results.png', fullPage: true });
  });

  test('Select Tickets button or login prompt present in bottom sticky', async ({ page }) => {
    await page.goto('/search?from=HYB&to=BZA&date=2025-11-10');
    await page.waitForLoadState('networkidle');

    const selectBtn = page.getByRole('button', { name: /select tickets/i }).first();
    const loginPrompt = page.locator('text=Please Login to Select your Seats').first();

    if (await selectBtn.count() > 0) {
      await expect(selectBtn).toBeVisible({ timeout: 20000 });
    } else {
      await expect(loginPrompt).toBeVisible({ timeout: 20000 });
    }

    await page.screenshot({ path: 'screenshots/search-bottom.png', fullPage: true });
  });
});
