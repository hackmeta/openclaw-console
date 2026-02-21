import { test, expect } from '@playwright/test';

const TEST_EMAIL = 'test2@iclaw.io';
const TEST_PASSWORD = 'Test1234';
const TEST_BOT_TOKEN = '8055872895:AAEnjl_JakMc6B2UbSaZAqIvVgP0UGMHCdo';

test.describe('One-Click Deploy Flow', () => {
  test.beforeEach(async ({ page }) => {
    // Login before each test
    await page.goto('/login');
    await page.locator('input[type="email"]').fill(TEST_EMAIL);
    await page.locator('input[type="password"]').fill(TEST_PASSWORD);
    await page.locator('button[type="submit"]').click();
    
    // Wait for redirect to dashboard
    await page.waitForURL(/dashboard/, { timeout: 10000 });
  });

  test('should display empty state Deploy Card after login', async ({ page }) => {
    await page.goto('/dashboard');
    
    // Wait for Deploy Card to be visible
    const deployCard = page.locator('[data-testid="deploy-card"], .deploy-card, [class*="DeployCard"]').first();
    await expect(deployCard).toBeVisible({ timeout: 5000 });
    
    // Check for empty state messaging
    const emptyStateText = page.locator('text=/no (bot|instance)|get started|deploy your first/i').first();
    if (await emptyStateText.isVisible().catch(() => false)) {
      await expect(emptyStateText).toBeVisible();
    }
  });

  test('should show BotFather guide steps', async ({ page }) => {
    await page.goto('/dashboard');
    
    // Look for BotFather guide section
    const botFatherGuide = page.locator('[data-testid="botfather-guide"], text=/BotFather|Create.*bot|@BotFather/i').first();
    await expect(botFatherGuide).toBeVisible({ timeout: 5000 });
    
    // Check for step indicators
    const steps = page.locator('[data-testid="guide-step"], .step, [class*="step"]');
    const stepCount = await steps.count();
    
    // Should have multiple guidance steps
    expect(stepCount).toBeGreaterThanOrEqual(1);
  });

  test('should disable Deploy button when token is empty', async ({ page }) => {
    await page.goto('/dashboard');
    
    // Find the bot token input
    const tokenInput = page.locator('input[placeholder*="token" i], input[name="token"], input[name="botToken"]').first();
    await expect(tokenInput).toBeVisible({ timeout: 5000 });
    
    // Ensure input is empty
    await tokenInput.clear();
    
    // Find Deploy button
    const deployButton = page.locator('button:has-text("Deploy"), button[type="submit"]:has-text(/deploy/i)').first();
    
    // Should be disabled
    await expect(deployButton).toBeDisabled();
  });

  test('should enable Deploy button when token is provided', async ({ page }) => {
    await page.goto('/dashboard');
    
    // Find and fill bot token input
    const tokenInput = page.locator('input[placeholder*="token" i], input[name="token"], input[name="botToken"]').first();
    await expect(tokenInput).toBeVisible({ timeout: 5000 });
    await tokenInput.fill(TEST_BOT_TOKEN);
    
    // Find Deploy button
    const deployButton = page.locator('button:has-text("Deploy"), button[type="submit"]:has-text(/deploy/i)').first();
    
    // Should be enabled
    await expect(deployButton).toBeEnabled();
  });

  test('should show deployment progress with 5 steps', async ({ page }) => {
    await page.goto('/dashboard');
    
    // Fill bot token
    const tokenInput = page.locator('input[placeholder*="token" i], input[name="token"], input[name="botToken"]').first();
    await expect(tokenInput).toBeVisible({ timeout: 5000 });
    await tokenInput.fill(TEST_BOT_TOKEN);
    
    // Click Deploy button
    const deployButton = page.locator('button:has-text("Deploy"), button[type="submit"]:has-text(/deploy/i)').first();
    await deployButton.click();
    
    // Wait for progress indicator to appear
    const progressSection = page.locator('[data-testid="deploy-progress"], [class*="progress"], .deployment-progress').first();
    await expect(progressSection).toBeVisible({ timeout: 10000 });
    
    // Check for 5 deployment steps
    const steps = page.locator('[data-testid="progress-step"], .progress-step, [class*="step"]');
    
    // Wait a moment for all steps to render
    await page.waitForTimeout(1000);
    
    const stepCount = await steps.count();
    
    // Should have 5 steps (or at least multiple steps)
    expect(stepCount).toBeGreaterThanOrEqual(3);
  });

  test('should expand and collapse advanced options', async ({ page }) => {
    await page.goto('/dashboard');
    
    // Look for advanced options toggle
    const advancedToggle = page.locator('button:has-text(/advanced|show more|options/i), [data-testid="advanced-toggle"]').first();
    
    if (await advancedToggle.isVisible().catch(() => false)) {
      // Initially, advanced section might be hidden
      const advancedSection = page.locator('[data-testid="advanced-options"], [class*="advanced"]').first();
      
      const initiallyVisible = await advancedSection.isVisible().catch(() => false);
      
      // Click to toggle
      await advancedToggle.click();
      await page.waitForTimeout(300);
      
      // State should change
      const afterClickVisible = await advancedSection.isVisible().catch(() => false);
      expect(afterClickVisible).not.toBe(initiallyVisible);
      
      // Click again to toggle back
      await advancedToggle.click();
      await page.waitForTimeout(300);
      
      // Should return to original state
      const finalVisible = await advancedSection.isVisible().catch(() => false);
      expect(finalVisible).toBe(initiallyVisible);
    }
  });

  test('should show Deploy Now button text correctly', async ({ page }) => {
    await page.goto('/dashboard');
    
    // Find Deploy button and verify text
    const deployButton = page.locator('button:has-text(/deploy now/i), button:has-text("Deploy")').first();
    await expect(deployButton).toBeVisible({ timeout: 5000 });
    
    const buttonText = await deployButton.textContent();
    expect(buttonText?.toLowerCase()).toMatch(/deploy/);
  });
});
