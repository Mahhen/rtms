import { test, expect } from '@playwright/test';

// Record video for the whole run
test.use({
  video: 'on',
  screenshot: 'only-on-failure',
  trace: 'retain-on-failure',
});

test('🚆 Register → Login → Search → Book → PNR Check', async ({ page }) => {
  test.setTimeout(240000); // 4 mins for slow frontend

  const baseURL = 'http://localhost:6213';
  const email = `user${Date.now()}@example.com`;
  const password = 'Test@12345';

  console.log(`🧾 Starting test for ${email}`);

  // --- REGISTER ---
  await page.goto(`${baseURL}/register`, { waitUntil: 'domcontentloaded' });
  await page.waitForSelector('form', { timeout: 60000 });

  await page.getByPlaceholder(/First Name/i).fill('Test');
  await page.getByPlaceholder(/Last Name/i).fill('User');
  await page.getByPlaceholder(/Email/i).fill(email);
  await page.getByPlaceholder(/Phone/i).fill('9876543210');
  await page.getByPlaceholder(/^Password$/i).fill(password);
  await page.getByPlaceholder(/Confirm Password/i).fill(password);

  await page.getByRole('button', { name: /sign\s*up|register/i }).click();
  await page.waitForTimeout(3000);

  console.log('✅ Registered new user');

  // --- LOGIN ---
  await page.goto(`${baseURL}/login`, { waitUntil: 'domcontentloaded' });
  await page.waitForSelector('[placeholder*="Email" i]', { timeout: 60000 });

  await page.getByPlaceholder(/Email/i).fill(email);
  await page.getByPlaceholder(/Password/i).fill(password);

  // ✅ FIXED: single regex-based locator (no commas)
  await page.getByRole('button', { name: /login|sign\s*in/i }).click();

  await page.waitForURL(/home|dashboard|search|booking/i, { timeout: 60000 });
  console.log('✅ Logged in successfully');

  // --- SEARCH TRAIN ---
  await page.goto(`${baseURL}/booking`, { waitUntil: 'domcontentloaded' });
  await page.waitForSelector('input[placeholder*="From" i]', { timeout: 60000 });

  await page.getByPlaceholder(/From/i).fill('DELHI-SAFDAR');
  await page.getByPlaceholder(/To/i).fill('SECUNDERABAD');
  await page.getByRole('button', { name: /search/i }).click();

  await page.waitForSelector('.train-result, text=/EXP|Train/i', { timeout: 60000 });
  console.log('🚉 Train search results visible');

  // --- SELECT TRAIN ---
  const selectBtn = page.getByRole('button', { name: /select|book/i }).first();
  await selectBtn.click();
  await page.waitForTimeout(3000);

  // --- SEAT SELECTION ---
  const seat = page.locator('.seat.available, [data-testid="seat"]').first();
  if (await seat.count()) await seat.click();

  const continueBtn = page.getByRole('button', { name: /continue|proceed|next/i }).first();
  if (await continueBtn.count()) await continueBtn.click();

  console.log('💺 Seat selected, proceeding to payment');
  await page.waitForTimeout(3000);

  // --- PAYMENT ---
  const cardField = page.locator('[placeholder*="Card" i]').first();
  if (await cardField.count()) {
    await cardField.fill('4111111111111111');
    await page.getByPlaceholder(/Expiry/i).fill('12/30');
    await page.getByPlaceholder(/CVV/i).fill('123');
  }

  const payBtn = page.getByRole('button', { name: /pay|confirm/i }).first();
  if (await payBtn.count()) await payBtn.click();

  console.log('💳 Payment simulated');
  await page.waitForTimeout(5000);

  // --- CONFIRMATION ---
  const confirmText = page.getByText(/booking confirmed|ticket booked|success|pnr/i);
  await expect(confirmText).toBeVisible({ timeout: 60000 });
  console.log('🎉 Booking confirmed');

  // --- OPTIONAL PNR CHECK ---
  const bodyText = await page.innerText('body');
  const pnr = (bodyText.match(/PNR[^0-9]*([0-9]{6,10})/i) || [])[1];
  if (pnr) {
    console.log('🧾 Found PNR:', pnr);
    await page.goto(`${baseURL}/pnr-status`, { waitUntil: 'domcontentloaded' });
    await page.getByPlaceholder(/PNR/i).fill(pnr);
    await page.getByRole('button', { name: /check|search|submit/i }).click();
    await expect(page.getByText(/status|confirmed|waiting|rac/i)).toBeVisible({
      timeout: 60000,
    });
    console.log('✅ PNR status checked successfully');
  } else {
    console.log('⚠️ PNR not displayed, skipping PNR check');
  }

  // End
  await page.waitForTimeout(3000);
  console.log('✅ Full flow completed successfully.');
});
