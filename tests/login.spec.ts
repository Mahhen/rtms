import { test, expect } from '@playwright/test';

test('Login Page loads correctly', async ({ page }) => {
  await page.goto('http://localhost:3000/login');
  await expect(page).toHaveTitle(/RailBuddy/);
  await expect(page.getByText('RailBuddy.com')).toBeVisible();
});

test('User can fill login form', async ({ page }) => {
  await page.goto('http://localhost:3000/login');
  await page.fill('input[name="email"]', 'testuser@example.com');
  await page.fill('input[name="password"]', 'testpassword');
  await expect(page.getByRole('button', { name: 'Login' })).toBeVisible();
});
