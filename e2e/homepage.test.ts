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

test.describe('Homepage', () => {
  test('should display hero section and navigation', async ({ page }) => {
    try {
      await page.goto('http://localhost:6213');
      await takeScreenshot(page, 'homepage-loaded');

      await expect(page).toHaveTitle(/RailBuddy/i);

      const nav = page.getByRole('navigation', { name: 'Main' });
      await expect(nav).toBeVisible();
      await takeScreenshot(page, 'navigation-visible');

      const hero = page.getByRole('heading', { name: /Book Railway Tickets/i });
      await expect(hero).toBeVisible();
      await takeScreenshot(page, 'hero-visible');

      const loginLink = page.getByRole('link', { name: /Login/i });
      const loginButton = page.getByRole('button', { name: /Login/i });

      if (await loginLink.count()) {
        await expect(loginLink).toBeVisible();
        await takeScreenshot(page, 'login-link-visible');
      } else if (await loginButton.count()) {
        await expect(loginButton).toBeVisible();
        await takeScreenshot(page, 'login-button-visible');
      } else {
        console.warn('No Login button/link found — skipping this check.');
        await takeScreenshot(page, 'no-login-found');
      }
    } catch (error) {
      console.error('Test failed:', error);
      await takeScreenshot(page, 'error');
      throw error;
    }
  });
});
