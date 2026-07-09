import { test, expect } from '@playwright/test';
import { UI_STRINGS } from '../src/constants/uiStrings';

test.describe('Authentication and Company Onboarding E2E Flow', () => {
  test('should register a new user, set up a company, and log out successfully', async ({ page }) => {
    // Generate unique values for registration
    const timestamp = Date.now();
    const userName = `user_${timestamp}`;
    const email = `email_${timestamp}@example.com`;
    const tz = `12345678${timestamp % 10}`;
    const companyName = `חברת נווה_${timestamp}`;
    const companyId = `hp_${timestamp}`;

    // 1. Go to the login page
    await page.goto('/login');
    await expect(page).toHaveURL(/\/login/);

    // 2. Click register toggle link/button
    const registerBtn = page.getByRole('button', { name: UI_STRINGS.auth.signupSubmit });
    await expect(registerBtn).toBeVisible();
    await registerBtn.click();

    // 3. Fill in the SignUp form
    await page.getByLabel(UI_STRINGS.auth.firstName).fill('נווה');
    await page.getByLabel(UI_STRINGS.auth.lastName).fill('ידעי');
    await page.getByLabel(UI_STRINGS.auth.userName).fill(userName);
    await page.getByLabel(UI_STRINGS.auth.phone).fill('0541234567');
    await page.getByLabel(UI_STRINGS.auth.email).fill(email);
    await page.getByLabel(UI_STRINGS.auth.tz).fill(tz);
    await page.getByLabel(UI_STRINGS.auth.address, { exact: true }).fill('רחוב ירושלים 1');
    await page.getByLabel(UI_STRINGS.auth.password).fill('securePassword123');

    // 4. Submit registration
    const submitSignUpBtn = page.getByRole('button', { name: UI_STRINGS.auth.signupSubmit });
    await submitSignUpBtn.click();

    // 5. Verify navigation to /company-setup (the dispatcher redirects automatically)
    await page.waitForURL(/\/company-setup/, { timeout: 15000 });
    await expect(page).toHaveURL(/\/company-setup/);

    // 6. Fill in Company Setup form
    await page.getByLabel(UI_STRINGS.companySetup.companyName).fill(companyName);
    await page.getByLabel(UI_STRINGS.companySetup.companyIdentifier).fill(companyId);
    await page.getByLabel(UI_STRINGS.companySetup.companyAddress).fill('אזור התעשייה');
    await page.getByLabel(UI_STRINGS.companySetup.companyPhone).fill('031234567');

    // 7. Submit company setup
    const setupCompanyBtn = page.getByRole('button', { name: UI_STRINGS.companySetup.submit });
    await setupCompanyBtn.click();

    // 8. Verify navigation to /home
    await page.waitForURL(/\/home/, { timeout: 15000 });
    await expect(page).toHaveURL(/\/home/);

    // 9. Verify homepage greeting and active company badge
    await expect(page.locator(`text=${UI_STRINGS.home.welcomePrefix}`)).toBeVisible();
    await expect(page.locator(`text=${UI_STRINGS.home.activeCompanyPrefix} ${companyName}`)).toBeVisible();

    // 10. Log out
    const logoutBtn = page.getByRole('button', { name: UI_STRINGS.navbar.logout });
    await logoutBtn.click();

    // 11. Verify redirection back to login
    await page.waitForURL(/\/login/, { timeout: 10000 });
    await expect(page).toHaveURL(/\/login/);
  });

  test('should redirect unauthorized user from protected pages to login', async ({ page }) => {
    // Attempt to access a protected page
    await page.goto('/home');
    
    // Verify redirection to login page
    await page.waitForURL(/\/login/);
    await expect(page).toHaveURL(/\/login/);
  });

  test('should clear localStorage and redirect to login if token is expired on startup', async ({ page }) => {
    const expiredExp = Math.floor(Date.now() / 1000) - 3600; // Expired 1 hour ago
    
    const toBase64Url = (obj: object) => {
      const base64 = btoa(JSON.stringify(obj));
      return base64.replace(/\+/g, '-').replace(/\//g, '_').replace(/=/g, '');
    };

    const header = toBase64Url({ alg: 'HS256', typ: 'JWT' });
    const payload = toBase64Url({ exp: expiredExp, username: 'expired_user' });
    const signature = 'dummy_sig';
    const expiredToken = `${header}.${payload}.${signature}`;

    // Navigate to login page first to initialize local storage domain context
    await page.goto('/login');

    // Inject expired token and user info into local storage
    await page.evaluate(({ token }) => {
      localStorage.setItem('token', token);
      localStorage.setItem('user', JSON.stringify({ id: 99, username: 'expired_user' }));
    }, { token: expiredToken });

    // Navigate to protected page
    await page.goto('/home');

    // Verify it kicks the user back to login because the token is expired
    await page.waitForURL(/\/login/);
    await expect(page).toHaveURL(/\/login/);

    // Verify local storage was cleared
    const tokenInStorage = await page.evaluate(() => localStorage.getItem('token'));
    expect(tokenInStorage).toBeNull();
  });
});
