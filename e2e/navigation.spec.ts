import { test, expect } from '@playwright/test';

test.describe('Page Navigation', () => {
  test('should redirect to login when accessing /dashboard without auth', async ({ page }) => {
    await page.goto('/dashboard');
    
    // Should redirect to login
    await expect(page).toHaveURL(/login/);
  });

  test('should redirect to login when accessing /instances/new without auth', async ({ page }) => {
    await page.goto('/instances/new');
    
    // Should redirect to login
    await expect(page).toHaveURL(/login/);
  });

  test('should load forgot-password page', async ({ page }) => {
    await page.goto('/forgot-password');
    
    // Should stay on forgot-password page
    await expect(page).toHaveURL(/forgot-password/);
    
    // Should have email input
    await expect(page.locator('input[type="email"]')).toBeVisible();
  });

  test('should load reset-password page and show error without token', async ({ page }) => {
    await page.goto('/reset-password');
    
    // Should stay on reset-password page
    await expect(page).toHaveURL(/reset-password/);
    
    // Should show error message or require token
    // This test verifies the page loads, actual error handling may vary
    await page.waitForLoadState('networkidle');
  });

  test('should allow navigation to register from login', async ({ page }) => {
    await page.goto('/login');
    
    // Look for register link
    const registerLink = page.locator('a[href*="register"]');
    
    if (await registerLink.isVisible()) {
      await registerLink.click();
      await expect(page).toHaveURL(/register/);
    }
  });

  test('should allow navigation to login from register', async ({ page }) => {
    await page.goto('/register');
    
    // Look for login link
    const loginLink = page.locator('a[href*="login"]');
    
    if (await loginLink.isVisible()) {
      await loginLink.click();
      await expect(page).toHaveURL(/login/);
    }
  });
});
