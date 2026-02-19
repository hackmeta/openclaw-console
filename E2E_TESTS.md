# E2E Testing with Playwright

## Setup

### Install Dependencies

```bash
npm install
```

### Install Playwright Browsers

```bash
npx playwright install chromium
```

## Running Tests

### Run all tests

```bash
npm run test:e2e
```

### Run tests with UI mode

```bash
npm run test:e2e:ui
```

### Run specific test file

```bash
npx playwright test e2e/auth.spec.ts
```

### Run tests in headed mode (see browser)

```bash
npx playwright test --headed
```

## Environment Variables

### Console Tests (default)

- `E2E_BASE_URL`: Base URL for console (default: `http://localhost:3200`)

Example:
```bash
E2E_BASE_URL=http://192.168.31.104:3200 npm run test:e2e
```

### Landing Page Tests

- `E2E_LANDING_URL`: Base URL for landing page (default: `http://localhost:3100`)

Example:
```bash
E2E_LANDING_URL=http://localhost:3100 npx playwright test e2e/landing.spec.ts
```

## Test Files

### 1. `e2e/auth.spec.ts` - Authentication Tests
- Register page load
- Form validation (empty fields, weak password)
- Successful registration
- Login page load
- Login failure
- Forgot password page

### 2. `e2e/navigation.spec.ts` - Navigation Tests
- Protected routes redirect to login
- Public pages load correctly
- Navigation between auth pages

### 3. `e2e/landing.spec.ts` - Landing Page Tests
- Homepage load
- Hero section
- Pricing section
- FAQ section
- SEO meta tags
- Navigation to console

## Configuration

See `playwright.config.ts` for:
- Timeout settings (30s action timeout)
- Screenshot on failure
- Trace on first retry
- Browser selection (Chromium only)

## CI/CD Integration

In CI environments:
- Tests run with 2 retries
- Single worker for stability
- Screenshots and traces captured on failure

## Notes

- Tests use dynamic email generation (`e2e-{timestamp}@test.com`) to avoid conflicts
- Password requirement: 8+ characters with letters and numbers
- Landing page tests require separate base URL configuration
- Tests don't require running dev server (configure via environment variables)
