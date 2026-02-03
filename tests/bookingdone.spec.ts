import { test, expect } from '@playwright/test';

test('Booking Confirmation page shows success message', async ({ page }) => {
  await page.goto('http://localhost:3000/booking-done?pnr=1234567890');
  await expect(page.getByText('Payment Successful!')).toBeVisible();
  await expect(page.getByText('PNR: 1234567890')).toBeVisible();
});
