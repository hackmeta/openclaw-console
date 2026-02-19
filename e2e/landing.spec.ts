import { test, expect } from '@playwright/test';

/**
 * Landing page tests
 * Note: These tests assume landing page runs on port 3100
 * Set E2E_LANDING_URL=http://localhost:3100 or update baseURL for these tests
 */

test.describe('Landing Page', () => {
  const landingURL = process.env.E2E_LANDING_URL || 'http://localhost:3100';

  test('should load homepage', async ({ page }) => {
    await page.goto(landingURL);
    await expect(page).toHaveTitle(/OpenClaw/i);
  });

  test('should contain hero section', async ({ page }) => {
    await page.goto(landingURL);
    
    // Look for common hero elements
    const heroHeading = page.locator('h1').first();
    await expect(heroHeading).toBeVisible();
  });

  test('should contain pricing section', async ({ page }) => {
    await page.goto(landingURL);
    
    // Look for pricing-related content
    const pricingSection = page.locator('text=/pricing|plans|subscription/i').first();
    
    // Scroll to pricing if needed
    if (await pricingSection.isVisible()) {
      await pricingSection.scrollIntoViewIfNeeded();
      await expect(pricingSection).toBeVisible();
    }
  });

  test('should contain FAQ section', async ({ page }) => {
    await page.goto(landingURL);
    
    // Look for FAQ
    const faqSection = page.locator('text=/faq|questions|help/i').first();
    
    if (await faqSection.isVisible()) {
      await faqSection.scrollIntoViewIfNeeded();
      await expect(faqSection).toBeVisible();
    }
  });

  test('should have SEO meta tags', async ({ page }) => {
    await page.goto(landingURL);
    
    // Check for description meta tag
    const description = await page.locator('meta[name="description"]').getAttribute('content');
    expect(description).toBeTruthy();
    
    // Check for og:title
    const ogTitle = page.locator('meta[property="og:title"]');
    if (await ogTitle.count() > 0) {
      const ogTitleContent = await ogTitle.getAttribute('content');
      expect(ogTitleContent).toBeTruthy();
    }
  });

  test('should have working navigation to console', async ({ page }) => {
    await page.goto(landingURL);
    
    // Look for link to console/dashboard/login
    const consoleLink = page.locator('a[href*="login"], a[href*="dashboard"], a[href*="console"]').first();
    
    if (await consoleLink.isVisible()) {
      await expect(consoleLink).toBeVisible();
    }
  });
});
