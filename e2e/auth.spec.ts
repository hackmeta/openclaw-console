import { test, expect } from '@playwright/test';

test.describe('Authentication Flow', () => {
  test('should load register page', async ({ page }) => {
    await page.goto('/register');
    await expect(page).toHaveTitle(/Register|Sign Up|OpenClaw/i);
    await expect(page.locator('input[type="email"]')).toBeVisible();
    await expect(page.locator('input[type="password"]')).toBeVisible();
  });

  test('should show validation errors for empty fields', async ({ page }) => {
    await page.goto('/register');
    
    // Try to submit empty form
    const submitButton = page.locator('button[type="submit"]');
    await submitButton.click();
    
    // Should show validation errors or stay on page
    await expect(page).toHaveURL(/register/);
  });

  test('should show validation error for weak password', async ({ page }) => {
    await page.goto('/register');
    
    const emailInput = page.locator('input[type="email"]');
    const passwordInput = page.locator('input[type="password"]').first();
    
    await emailInput.fill('test@example.com');
    await passwordInput.fill('weak'); // Less than 8 chars, no numbers
    
    const submitButton = page.locator('button[type="submit"]');
    await submitButton.click();
    
    // Should show error or stay on page
    await expect(page).toHaveURL(/register/);
  });

  test('should register successfully with valid credentials', async ({ page }) => {
    await page.goto('/register');
    
    const timestamp = Date.now();
    const email = `e2e-${timestamp}@test.com`;
    const password = 'Test1234'; // 8+ chars with letters and numbers
    const name = `E2E User ${timestamp}`;
    
    const emailInput = page.locator('input[type="email"]');
    const passwordInput = page.locator('input[type="password"]').first();
    const nameInput = page.locator('input[name="name"], input[placeholder*="name" i]').first();
    
    await emailInput.fill(email);
    await passwordInput.fill(password);
    
    if (await nameInput.isVisible()) {
      await nameInput.fill(name);
    }
    
    const submitButton = page.locator('button[type="submit"]');
    await submitButton.click();
    
    // Should redirect to login or dashboard after successful registration
    await page.waitForURL(/\/(login|dashboard)/, { timeout: 10000 });
  });

  test('should load login page', async ({ page }) => {
    await page.goto('/login');
    await expect(page).toHaveTitle(/Login|Sign In|OpenClaw/i);
    await expect(page.locator('input[type="email"]')).toBeVisible();
    await expect(page.locator('input[type="password"]')).toBeVisible();
  });

  test('should show error for invalid credentials', async ({ page }) => {
    await page.goto('/login');
    
    const emailInput = page.locator('input[type="email"]');
    const passwordInput = page.locator('input[type="password"]');
    
    await emailInput.fill('wrong@example.com');
    await passwordInput.fill('WrongPassword123');
    
    const submitButton = page.locator('button[type="submit"]');
    await submitButton.click();
    
    // Should show error message or stay on login page
    await expect(page).toHaveURL(/login/);
    
    // Wait for error message to appear
    await page.waitForTimeout(1000);
  });

  test('should load forgot password page', async ({ page }) => {
    await page.goto('/forgot-password');
    await expect(page).toHaveTitle(/Forgot Password|Reset Password|OpenClaw/i);
    await expect(page.locator('input[type="email"]')).toBeVisible();
  });
});
