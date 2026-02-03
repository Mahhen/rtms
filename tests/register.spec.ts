import { test, expect } from '@playwright/test';

test('Register Page renders correctly', async ({ page }) => {
  await page.goto('http://localhost:3000/register');
  await expect(page.getByText('RailBuddy.com')).toBeVisible();
});

test('User can fill registration form', async ({ page }) => {
  await page.goto('http://localhost:3000/register');
  await page.fill('input[name="name"]', 'New User');
  await page.fill('input[name="email"]', 'newuser@example.com');
  await page.fill('input[name="password"]', 'securepass');
  await expect(page.getByRole('button', { name: /Register/i })).toBeVisible();
});
