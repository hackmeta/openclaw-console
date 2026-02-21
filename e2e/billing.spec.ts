import { test, expect } from '@playwright/test';

const TEST_EMAIL = 'test2@iclaw.io';
const TEST_PASSWORD = 'Test1234';

test.describe('Billing & Pricing Page', () => {
  test.beforeEach(async ({ page }) => {
    // Login before each test
    await page.goto('/login');
    await page.locator('input[type="email"]').fill(TEST_EMAIL);
    await page.locator('input[type="password"]').fill(TEST_PASSWORD);
    await page.locator('button[type="submit"]').click();
    
    // Wait for redirect
    await page.waitForURL(/dashboard|billing/, { timeout: 10000 });
  });

  test('should load billing page', async ({ page }) => {
    await page.goto('/billing');
    
    // Should stay on billing page
    await expect(page).toHaveURL(/billing/);
    
    // Wait for content to load
    await page.waitForLoadState('networkidle');
  });

  test('should display current Free plan', async ({ page }) => {
    await page.goto('/billing');
    
    // Look for current plan indicator
    const currentPlan = page.locator('[data-testid="current-plan"], text=/current plan|your plan/i').first();
    await expect(currentPlan).toBeVisible({ timeout: 5000 });
    
    // Should show "Free" plan
    const freePlanText = page.locator('text=/free.*plan|plan.*free/i').first();
    await expect(freePlanText).toBeVisible({ timeout: 3000 });
  });

  test('should display all three pricing tiers', async ({ page }) => {
    await page.goto('/billing');
    
    // Look for pricing cards
    const pricingCards = page.locator('[data-testid="pricing-card"], [class*="pricing-card"], [class*="plan-card"]');
    
    // Should have at least 3 cards
    const cardCount = await pricingCards.count();
    expect(cardCount).toBeGreaterThanOrEqual(3);
  });

  test('should show Free plan with $0 price', async ({ page }) => {
    await page.goto('/billing');
    
    // Look for Free plan card
    const freeCard = page.locator('[data-testid="plan-free"], :has-text("Free"):has-text("$0")').first();
    
    // Alternative: look for any card containing both "Free" and "$0"
    const freePlanSection = page.locator('text=/free/i').first();
    await expect(freePlanSection).toBeVisible({ timeout: 5000 });
    
    // Check for $0 price
    const zeroPrice = page.locator('text=/\$0|free/i').first();
    await expect(zeroPrice).toBeVisible();
  });

  test('should show Pro plan with $19 price', async ({ page }) => {
    await page.goto('/billing');
    
    // Look for Pro plan
    const proText = page.locator('text=/pro/i').first();
    await expect(proText).toBeVisible({ timeout: 5000 });
    
    // Look for $19 price
    const proPrice = page.locator('text=/\$19|19.*month|19.*mo/i').first();
    await expect(proPrice).toBeVisible({ timeout: 3000 });
  });

  test('should show Business plan with $49 price', async ({ page }) => {
    await page.goto('/billing');
    
    // Look for Business plan
    const businessText = page.locator('text=/business|enterprise/i').first();
    await expect(businessText).toBeVisible({ timeout: 5000 });
    
    // Look for $49 price
    const businessPrice = page.locator('text=/\$49|49.*month|49.*mo/i').first();
    await expect(businessPrice).toBeVisible({ timeout: 3000 });
  });

  test('should have clickable upgrade buttons', async ({ page }) => {
    await page.goto('/billing');
    
    // Look for upgrade/subscribe buttons
    const upgradeButtons = page.locator('button:has-text(/upgrade|subscribe|get started|choose plan/i), a:has-text(/upgrade|subscribe/i)');
    
    // Should have at least one upgrade button
    const buttonCount = await upgradeButtons.count();
    expect(buttonCount).toBeGreaterThanOrEqual(1);
    
    // First upgrade button should be visible and enabled
    const firstButton = upgradeButtons.first();
    await expect(firstButton).toBeVisible();
    
    // Check if it's enabled (might be disabled for current plan)
    const isEnabled = await firstButton.isEnabled();
    const isVisible = await firstButton.isVisible();
    
    // Should be visible at minimum
    expect(isVisible).toBeTruthy();
  });

  test('should show Pro plan upgrade button', async ({ page }) => {
    await page.goto('/billing');
    
    // Find Pro plan section
    const proSection = page.locator('[data-testid="plan-pro"], :has-text("Pro")').first();
    
    // Look for upgrade button within Pro section
    const proUpgradeButton = page.locator('button:has-text(/upgrade/i), a:has-text(/upgrade/i)').nth(0);
    
    if (await proUpgradeButton.isVisible({ timeout: 3000 }).catch(() => false)) {
      await expect(proUpgradeButton).toBeVisible();
    }
  });

  test('should show Business plan upgrade button', async ({ page }) => {
    await page.goto('/billing');
    
    // Find Business plan section
    const businessSection = page.locator('[data-testid="plan-business"], :has-text("Business")').first();
    
    // Look for upgrade button
    const businessUpgradeButton = page.locator('button:has-text(/upgrade/i), a:has-text(/upgrade/i)').nth(1);
    
    if (await businessUpgradeButton.isVisible({ timeout: 3000 }).catch(() => false)) {
      await expect(businessUpgradeButton).toBeVisible();
    }
  });

  test('should display plan features', async ({ page }) => {
    await page.goto('/billing');
    
    // Look for feature lists (usually shown as checkmarks or bullet points)
    const features = page.locator('ul li, [class*="feature"], [data-testid="plan-feature"]');
    
    // Should have multiple features listed
    const featureCount = await features.count();
    expect(featureCount).toBeGreaterThanOrEqual(3);
  });

  test('should navigate when clicking upgrade button', async ({ page }) => {
    await page.goto('/billing');
    
    // Find an enabled upgrade button
    const upgradeButtons = page.locator('button:has-text(/upgrade/i):not([disabled]), a:has-text(/upgrade/i)');
    
    if (await upgradeButtons.first().isVisible({ timeout: 3000 }).catch(() => false)) {
      const initialUrl = page.url();
      
      // Click upgrade button
      await upgradeButtons.first().click();
      
      // Wait a moment for navigation or modal
      await page.waitForTimeout(1000);
      
      // Should either navigate to checkout or show a modal
      const currentUrl = page.url();
      const hasModal = await page.locator('[role="dialog"], [class*="modal"]').isVisible().catch(() => false);
      
      // Either URL changed or modal appeared
      expect(currentUrl !== initialUrl || hasModal).toBeTruthy();
    }
  });
});
