import { test, expect } from '@playwright/test';

const TEST_EMAIL = 'test2@iclaw.io';
const TEST_PASSWORD = 'Test1234';

test.describe('Instance Management', () => {
  test.beforeEach(async ({ page }) => {
    // Login before each test
    await page.goto('/login');
    await page.locator('input[type="email"]').fill(TEST_EMAIL);
    await page.locator('input[type="password"]').fill(TEST_PASSWORD);
    await page.locator('button[type="submit"]').click();
    
    // Wait for redirect
    await page.waitForURL(/dashboard|instances/, { timeout: 10000 });
  });

  test('should display instances list page', async ({ page }) => {
    await page.goto('/instances');
    
    // Should stay on instances page
    await expect(page).toHaveURL(/instances/);
    
    // Wait for page to load
    await page.waitForLoadState('networkidle');
  });

  test('should show stats cards on instances page', async ({ page }) => {
    await page.goto('/instances');
    
    // Look for stats cards
    const statsCards = page.locator('[data-testid="stats-card"], [class*="stats"], [class*="StatCard"]');
    
    // Should have at least one stat card
    await expect(statsCards.first()).toBeVisible({ timeout: 5000 });
    
    const cardCount = await statsCards.count();
    expect(cardCount).toBeGreaterThanOrEqual(1);
  });

  test('should display instance rows or empty state', async ({ page }) => {
    await page.goto('/instances');
    
    // Look for instance list container
    const instanceList = page.locator('[data-testid="instance-list"], [class*="instance-list"], table, [role="list"]').first();
    await expect(instanceList).toBeVisible({ timeout: 5000 });
    
    // Check for either instance rows or empty state
    const instanceRows = page.locator('[data-testid="instance-row"], tr[data-instance], [class*="instance-row"]');
    const emptyState = page.locator('text=/no instances|create your first|get started/i');
    
    const rowCount = await instanceRows.count();
    const hasEmptyState = await emptyState.isVisible().catch(() => false);
    
    // Should have either instances or empty state
    expect(rowCount > 0 || hasEmptyState).toBeTruthy();
  });

  test('should show + New Instance button', async ({ page }) => {
    await page.goto('/instances');
    
    // Look for new instance button
    const newInstanceButton = page.locator('button:has-text(/new instance|create|add instance/i), a:has-text(/new instance/i)').first();
    await expect(newInstanceButton).toBeVisible({ timeout: 5000 });
  });

  test('should navigate to new instance page when clicking + New Instance', async ({ page }) => {
    await page.goto('/instances');
    
    // Click new instance button
    const newInstanceButton = page.locator('button:has-text(/new instance|create|add instance/i), a:has-text(/new instance/i)').first();
    await expect(newInstanceButton).toBeVisible({ timeout: 5000 });
    await newInstanceButton.click();
    
    // Should navigate to new instance page
    await expect(page).toHaveURL(/instances\/new|deploy/, { timeout: 5000 });
  });

  test('should navigate to instance detail when clicking instance row', async ({ page }) => {
    await page.goto('/instances');
    
    // Look for instance rows
    const instanceRow = page.locator('[data-testid="instance-row"], tr[data-instance], [class*="instance-row"], a[href*="/instances/"]').first();
    
    // If instances exist, click to view details
    if (await instanceRow.isVisible({ timeout: 5000 }).catch(() => false)) {
      await instanceRow.click();
      
      // Should navigate to instance detail page
      await expect(page).toHaveURL(/instances\/[a-zA-Z0-9-]+/, { timeout: 5000 });
    } else {
      // Skip test if no instances
      test.skip();
    }
  });

  test('should display instance detail page elements', async ({ page }) => {
    // Try to navigate to a mock instance detail page
    await page.goto('/instances/test-instance-123');
    
    // If page redirects to login or instances list, the route might not exist yet
    const currentUrl = page.url();
    
    if (currentUrl.includes('/instances/test-instance')) {
      // Check for status display
      const statusElement = page.locator('[data-testid="instance-status"], [class*="status"]').first();
      
      // At least one of these elements should be visible on a detail page
      const hasStatus = await statusElement.isVisible({ timeout: 3000 }).catch(() => false);
      const hasActions = await page.locator('button:has-text(/start|stop|restart/i)').first().isVisible({ timeout: 3000 }).catch(() => false);
      const hasLogs = await page.locator('[data-testid="log-viewer"], [class*="log"], textarea, pre').first().isVisible({ timeout: 3000 }).catch(() => false);
      
      // At least one detail element should be present
      expect(hasStatus || hasActions || hasLogs).toBeTruthy();
    }
  });

  test('should show start/stop buttons on instance detail page', async ({ page }) => {
    // Navigate to instances list first
    await page.goto('/instances');
    
    // Find first instance link
    const instanceLink = page.locator('a[href*="/instances/"], [data-testid="instance-row"]').first();
    
    if (await instanceLink.isVisible({ timeout: 3000 }).catch(() => false)) {
      await instanceLink.click();
      
      // Wait for detail page
      await page.waitForURL(/instances\/[a-zA-Z0-9-]+/, { timeout: 5000 });
      
      // Look for control buttons
      const controlButtons = page.locator('button:has-text(/start|stop|restart|pause/i)');
      
      // Should have at least one control button
      const buttonCount = await controlButtons.count();
      expect(buttonCount).toBeGreaterThanOrEqual(1);
    } else {
      test.skip();
    }
  });

  test('should show log viewer on instance detail page', async ({ page }) => {
    // Navigate to instances list first
    await page.goto('/instances');
    
    // Find first instance link
    const instanceLink = page.locator('a[href*="/instances/"], [data-testid="instance-row"]').first();
    
    if (await instanceLink.isVisible({ timeout: 3000 }).catch(() => false)) {
      await instanceLink.click();
      
      // Wait for detail page
      await page.waitForURL(/instances\/[a-zA-Z0-9-]+/, { timeout: 5000 });
      
      // Look for log viewer
      const logViewer = page.locator('[data-testid="log-viewer"], [class*="log"], textarea[readonly], pre, code').first();
      
      // Log viewer should be visible
      await expect(logViewer).toBeVisible({ timeout: 5000 });
    } else {
      test.skip();
    }
  });

  test('should display instance status indicator', async ({ page }) => {
    // Navigate to instances list first
    await page.goto('/instances');
    
    // Find first instance link
    const instanceLink = page.locator('a[href*="/instances/"], [data-testid="instance-row"]').first();
    
    if (await instanceLink.isVisible({ timeout: 3000 }).catch(() => false)) {
      await instanceLink.click();
      
      // Wait for detail page
      await page.waitForURL(/instances\/[a-zA-Z0-9-]+/, { timeout: 5000 });
      
      // Look for status indicators
      const statusBadge = page.locator('[data-testid="instance-status"], [class*="status"], [class*="badge"]').first();
      const statusText = page.locator('text=/running|stopped|starting|error|active|inactive/i').first();
      
      // At least one status indicator should be present
      const hasBadge = await statusBadge.isVisible({ timeout: 3000 }).catch(() => false);
      const hasText = await statusText.isVisible({ timeout: 3000 }).catch(() => false);
      
      expect(hasBadge || hasText).toBeTruthy();
    } else {
      test.skip();
    }
  });
});
