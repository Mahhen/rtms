import { test, expect } from '@playwright/test'
 
test('should navigate to the about page', async ({ page }) => {
  // Start from the index page (the baseURL is set via the webServer in the playwright.config.ts)
  await page.goto('http://localhost:6213/')
  // Find an element with the text 'About' and click on it
  await page.click('text=Log Out')
  // The new URL should be "/about" (baseURL is used there)
  await expect(page).toHaveURL('http://localhost:6213/')
  await page.click('text=Login')
  await expect(page).toHaveURL('http://localhost:6213/login')
 
})