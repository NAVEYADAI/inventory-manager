import { test, expect } from '@playwright/test';
import { UI_STRINGS } from '../src/constants/uiStrings';

test.describe('Add Existing Employee E2E Flow', () => {
  test('should register two users and link the second user to the first company', async ({ page }) => {
    const timestamp = Date.now();
    const userA = `usera_${timestamp}`;
    const emailA = `usera_${timestamp}@test.com`;
    const tzA = `11111111${timestamp % 10}`;
    const companyAName = `חברה א_${timestamp}`;
    const companyAId = `hpa_${timestamp}`;

    const userB = `userb_${timestamp}`;
    const emailB = `userb_${timestamp}@test.com`;
    const tzB = `22222222${timestamp % 10}`;
    const companyBName = `חברה ב_${timestamp}`;
    const companyBId = `hpb_${timestamp}`;

    // --- 1. Register User A and create Company A ---
    await page.goto('/login');
    await page.getByRole('button', { name: UI_STRINGS.auth.signupSubmit }).click();
    await page.getByLabel(UI_STRINGS.auth.firstName).fill('משתמש');
    await page.getByLabel(UI_STRINGS.auth.lastName).fill('אלפא');
    await page.getByLabel(UI_STRINGS.auth.userName).fill(userA);
    await page.getByLabel(UI_STRINGS.auth.phone).fill('0501111111');
    await page.getByLabel(UI_STRINGS.auth.email).fill(emailA);
    await page.getByLabel(UI_STRINGS.auth.tz).fill(tzA);
    await page.getByLabel(UI_STRINGS.auth.address, { exact: true }).fill('רחוב א');
    await page.getByLabel(UI_STRINGS.auth.password).fill('password123');
    await page.getByRole('button', { name: UI_STRINGS.auth.signupSubmit }).click();

    await page.waitForURL(/\/company-setup/);
    await page.getByLabel(UI_STRINGS.companySetup.companyName).fill(companyAName);
    await page.getByLabel(UI_STRINGS.companySetup.companyIdentifier).fill(companyAId);
    await page.getByLabel(UI_STRINGS.companySetup.companyAddress).fill('אזור א');
    await page.getByLabel(UI_STRINGS.companySetup.companyPhone).fill('031111111');
    await page.getByRole('button', { name: UI_STRINGS.companySetup.submit }).click();
    await page.waitForURL(/\/home/);

    // Log out User A
    await page.getByRole('button', { name: UI_STRINGS.navbar.logout }).click();
    await page.waitForURL(/\/login/);

    // --- 2. Register User B and create Company B ---
    await page.getByRole('button', { name: UI_STRINGS.auth.signupSubmit }).click();
    await page.getByLabel(UI_STRINGS.auth.firstName).fill('משתמש');
    await page.getByLabel(UI_STRINGS.auth.lastName).fill('בטא');
    await page.getByLabel(UI_STRINGS.auth.userName).fill(userB);
    await page.getByLabel(UI_STRINGS.auth.phone).fill('0502222222');
    await page.getByLabel(UI_STRINGS.auth.email).fill(emailB);
    await page.getByLabel(UI_STRINGS.auth.tz).fill(tzB);
    await page.getByLabel(UI_STRINGS.auth.address, { exact: true }).fill('רחוב ב');
    await page.getByLabel(UI_STRINGS.auth.password).fill('password123');
    await page.getByRole('button', { name: UI_STRINGS.auth.signupSubmit }).click();

    await page.waitForURL(/\/company-setup/);
    await page.getByLabel(UI_STRINGS.companySetup.companyName).fill(companyBName);
    await page.getByLabel(UI_STRINGS.companySetup.companyIdentifier).fill(companyBId);
    await page.getByLabel(UI_STRINGS.companySetup.companyAddress).fill('אזור ב');
    await page.getByLabel(UI_STRINGS.companySetup.companyPhone).fill('032222222');
    await page.getByRole('button', { name: UI_STRINGS.companySetup.submit }).click();
    await page.waitForURL(/\/home/);

    // Log out User B
    await page.getByRole('button', { name: UI_STRINGS.navbar.logout }).click();
    await page.waitForURL(/\/login/);

    // --- 3. Log back in as User A, go to Employees Page and add User B ---
    await page.getByLabel(UI_STRINGS.auth.userName).fill(userA);
    await page.getByLabel(UI_STRINGS.auth.password).fill('password123');
    await page.getByRole('button', { name: UI_STRINGS.auth.loginSubmit }).click();
    await page.waitForURL(/\/home/);

    // Go to Employees page
    await page.getByRole('link', { name: UI_STRINGS.navbar.employeeManagement }).click();
    await page.waitForURL(/\/employees/);

    // Open employee registration dialog
    await page.getByRole('button', { name: UI_STRINGS.employees.registerNewEmployee }).click();

    // Verify search input is visible and enter username
    const searchInput = page.getByLabel(/שם משתמש או תעודת זהות/);
    await expect(searchInput).toBeVisible();
    await searchInput.fill(userB);

    // Select the Role field and make it Editor
    await page.getByLabel(UI_STRINGS.employees.roleLabel).click();
    await page.getByRole('option', { name: UI_STRINGS.employees.roleEditor }).click();

    // Click submit
    await page.getByRole('button', { name: UI_STRINGS.employees.addEmployee }).click();

    // Verify User B is now listed on the Employees page
    await expect(page.locator('text=משתמש בטא')).toBeVisible();
    await expect(page.locator(`text=${emailB}`)).toBeVisible();

    // Log out User A
    await page.getByRole('button', { name: UI_STRINGS.navbar.logout }).click();
    await page.waitForURL(/\/login/);

    // --- 4. Log in as User B and verify they can switch to Company A ---
    await page.getByLabel(UI_STRINGS.auth.userName).fill(userB);
    await page.getByLabel(UI_STRINGS.auth.password).fill('password123');
    await page.getByRole('button', { name: UI_STRINGS.auth.loginSubmit }).click();
    await page.waitForURL(/\/company-picker/);

    // B should see both companies. Choose Company A.
    await page.locator(`text=${companyAName}`).locator('xpath=..').getByRole('button', { name: UI_STRINGS.companyPicker.enterCompany }).click();
    await page.waitForURL(/\/home/);

    // Verify Company A is now active
    await expect(page.locator(`text=${UI_STRINGS.home.activeCompanyPrefix} ${companyAName}`)).toBeVisible();
  });
});
