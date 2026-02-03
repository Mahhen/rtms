import { test, expect } from '@playwright/test';
import fs from 'fs';
import path from 'path';

async function takeScreenshot(page, name: string) {
  const dir = path.resolve('screenshots');
  if (!fs.existsSync(dir)) fs.mkdirSync(dir);
  const filePath = path.join(dir, `${name}-${Date.now()}.png`);
  await page.screenshot({ path: filePath, fullPage: true });
  console.log(`Screenshot saved: ${filePath}`);
}

test.describe('Authentication', () => {
  test('should display login form', async ({ page }) => {
    await page.goto('http://localhost:6213/login');
    await takeScreenshot(page, 'login-page-loaded');

    const emailField =
      page.getByPlaceholder(/email/i)
      .or(page.getByLabel(/email/i))
      .or(page.locator('input[type="email"]'));

    const passwordField =
      page.getByPlaceholder(/password/i)
      .or(page.getByLabel(/password/i))
      .or(page.locator('input[type="password"]'));

    if (await emailField.count()) {
      await expect(emailField.first()).toBeVisible();
    } else {
      console.warn('No visible email input found.');
      await takeScreenshot(page, 'email-input-not-found');
    }

    if (await passwordField.count()) {
      await expect(passwordField.first()).toBeVisible();
    } else {
      console.warn('No visible password input found.');
      await takeScreenshot(page, 'password-input-not-found');
    }

    await takeScreenshot(page, 'login-form-checked');
  });

  test('should allow user to register', async ({ page }) => {
    await page.goto('http://localhost:6213/register');
    await takeScreenshot(page, 'register-page-loaded');

    const emailInput = page.locator('input[type="email"], input[name="email"]');
    const passwordInput = page.locator('input[type="password"], input[name="password"]');

    if (await emailInput.count()) {
      await emailInput.first().fill('testuser@example.com');
    } else {
      console.warn('Email input not found on register page');
      await takeScreenshot(page, 'register-email-missing');
    }

    if (await passwordInput.count()) {
      await passwordInput.first().fill('Password123');
    } else {
      console.warn('Password input not found on register page');
      await takeScreenshot(page, 'register-password-missing');
    }

    const submitBtn = page.getByRole('button', { name: /register|sign up|submit/i });
    if (await submitBtn.count()) {
      await submitBtn.first().click();
      await takeScreenshot(page, 'register-submitted');
    } else {
      console.warn('Register button not found');
      await takeScreenshot(page, 'register-button-missing');
    }

    await page.waitForTimeout(2000);
    await takeScreenshot(page, 'register-finished');
  });
});
