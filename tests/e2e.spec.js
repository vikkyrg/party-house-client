import { test, expect } from '@playwright/test';

test.describe('CS Cinemas Frontend', () => {
  test('homepage loads correctly', async ({ page }) => {
    // Vite defaults to 5173
    await page.goto('http://localhost:5173');
    
    // Check hero title
    await expect(page.locator('h1')).toContainText('Celebrate the Extraordinary');
    
    // Check navigation links
    await expect(page.locator('text=Explore Cities')).toBeVisible();
    await expect(page.locator('text=Book a Theater')).toBeVisible();
  });

  test('can navigate to cities and theaters', async ({ page }) => {
    await page.goto('http://localhost:5173');
    
    // Navigate to cities
    await page.click('text=Cities');
    await expect(page.locator('h1')).toContainText('Explore Cities');
    
    // Navigate to theaters
    await page.click('text=Theaters');
    await expect(page.locator('h1')).toContainText('Available Theaters');
  });

  test('can open login page', async ({ page }) => {
    await page.goto('http://localhost:5173/login');
    await expect(page.locator('h1')).toContainText('Welcome Back');
    await expect(page.locator('button[type="submit"]')).toBeVisible();
  });
});
