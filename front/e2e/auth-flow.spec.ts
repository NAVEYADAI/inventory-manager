import { test, expect } from '@playwright/test';

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
    const registerBtn = page.getByRole('button', { name: 'הרשמה למערכת' });
    await expect(registerBtn).toBeVisible();
    await registerBtn.click();

    // 3. Fill in the SignUp form
    await page.getByLabel('שם פרטי').fill('נווה');
    await page.getByLabel('שם משפחה').fill('ידעי');
    await page.getByLabel('שם משתמש').fill(userName);
    await page.getByLabel('טלפון').fill('0541234567');
    await page.getByLabel('כתובת מייל').fill(email);
    await page.getByLabel('כתובת', { exact: true }).fill('רחוב ירושלים 1');
    await page.getByLabel('סיסמא').fill('securePassword123');

    // 4. Submit registration
    const submitSignUpBtn = page.getByRole('button', { name: 'הרשמה למערכת' });
    await submitSignUpBtn.click();

    // 5. Verify navigation to /company-setup (the dispatcher redirects automatically)
    await page.waitForURL(/\/company-setup/, { timeout: 15000 });
    await expect(page).toHaveURL(/\/company-setup/);

    // 6. Fill in Company Setup form
    await page.getByLabel('שם החברה').fill(companyName);
    await page.getByLabel('ח.פ. / מזהה חברה').fill(companyId);
    await page.getByLabel('כתובת החברה').fill('אזור התעשייה');
    await page.getByLabel('טלפון ליצירת קשר').fill('031234567');

    // 7. Submit company setup
    const setupCompanyBtn = page.getByRole('button', { name: 'צור חברה והמשך' });
    await setupCompanyBtn.click();

    // 8. Verify navigation to /home
    await page.waitForURL(/\/home/, { timeout: 15000 });
    await expect(page).toHaveURL(/\/home/);

    // 9. Verify homepage greeting and active company badge
    await expect(page.locator('text=שלום,')).toBeVisible();
    await expect(page.locator(`text=חברה פעילה כעת: ${companyName}`)).toBeVisible();

    // 10. Log out
    const logoutBtn = page.getByRole('button', { name: 'התנתק מהמערכת' });
    await logoutBtn.click();

    // 11. Verify redirection back to login
    await page.waitForURL(/\/login/, { timeout: 10000 });
    await expect(page).toHaveURL(/\/login/);
  });
});
