import { test, expect } from '@playwright/test';
import { UI_STRINGS } from '../src/constants/uiStrings';

test.describe('Authentication and Company Onboarding E2E Flow', () => {
  test('should register a new user, set up a company, and log out successfully', async ({ page }) => {
    // Generate unique values for registration
    const timestamp = Date.now();
    const userName = `user_${timestamp}`;
    const email = `email_${timestamp}@example.com`;
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
});
