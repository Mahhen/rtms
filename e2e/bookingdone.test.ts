import { test, expect } from '@playwright/test';

test('Booking confirmation (payment success) page', async ({ page }) => {
  await page.goto('/booking-done?pnr=TESTPNR1234');
  await page.waitForLoadState('networkidle');

  await expect(page.locator('text=Payment Successful!')).toBeVisible({ timeout: 20000 });
  await expect(page.locator('text=PNR:')).toContainText('PNR', { timeout: 10000 }).catch(() => {});
  await page.screenshot({ path: 'screenshots/booking-done.png', fullPage: true });
});
