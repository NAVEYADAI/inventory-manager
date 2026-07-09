import { test, expect } from '@playwright/test';
import { UI_STRINGS } from '../src/constants/uiStrings';

test.describe('Raw Materials, Employee and Recipe E2E Flow', () => {
  test('should handle raw material creation, employee registration, and recipe creation with inline quick-add', async ({ page }) => {
    const timestamp = Date.now();
    const userA = `usera_${timestamp}`;
    const emailA = `usera_${timestamp}@test.com`;
    const companyAName = `חברה א_${timestamp}`;
    const companyAId = `hpa_${timestamp}`;
    const tzA = `33333333${timestamp % 10}`;
    const empUser = `employee_${timestamp}`;
    const empEmail = `employee_${timestamp}@test.com`;
    const rawMaterialName = `קמח לבן_${timestamp}`;
    const inlineMaterialName = `חמאה הולנדית_${timestamp}`;
    const recipeName = `לחם מחמצת_${timestamp}`;

    // --- 1. Register User A and create Company A ---
    await page.goto('/login');
    await expect(page).toHaveURL(/\/login/);

    const registerBtn = page.getByRole('button', { name: UI_STRINGS.auth.signupSubmit });
    await expect(registerBtn).toBeVisible();
    await registerBtn.click();

    await page.getByLabel(UI_STRINGS.auth.firstName).fill('משתמש');
    await page.getByLabel(UI_STRINGS.auth.lastName).fill('ראשי');
    await page.getByLabel(UI_STRINGS.auth.userName).fill(userA);
    await page.getByLabel(UI_STRINGS.auth.phone).fill('0501111111');
    await page.getByLabel(UI_STRINGS.auth.email).fill(emailA);
    await page.getByLabel(UI_STRINGS.auth.tz).fill(tzA);
    await page.getByLabel(UI_STRINGS.auth.address, { exact: true }).fill('רחוב א');
    await page.getByLabel(UI_STRINGS.auth.password).fill('password123');

    const submitSignUpBtn = page.getByRole('button', { name: UI_STRINGS.auth.signupSubmit });
    await submitSignUpBtn.click();

    await page.waitForURL(/\/company-setup/, { timeout: 15000 });
    await expect(page).toHaveURL(/\/company-setup/);

    await page.getByLabel(UI_STRINGS.companySetup.companyName).fill(companyAName);
    await page.getByLabel(UI_STRINGS.companySetup.companyIdentifier).fill(companyAId);
    await page.getByLabel(UI_STRINGS.companySetup.companyAddress).fill('אזור א');
    await page.getByLabel(UI_STRINGS.companySetup.companyPhone).fill('031111111');

    const setupCompanyBtn = page.getByRole('button', { name: UI_STRINGS.companySetup.submit });
    await setupCompanyBtn.click();

    await page.waitForURL(/\/home/, { timeout: 15000 });
    await expect(page).toHaveURL(/\/home/);

    // --- 2. Add Raw Material from HomePage ---
    const addRawMaterialBtn = page.getByRole('button', { name: 'הוספת חומרי גלם' });
    await expect(addRawMaterialBtn).toBeVisible();
    await addRawMaterialBtn.click();

    // Fill the raw material row
    await page.getByLabel('שם חומר גלם').first().fill(rawMaterialName);
    await page.getByLabel('קטגוריה').first().fill('יבשים');

    // Save raw material
    const saveMaterialBtn = page.getByRole('button', { name: 'שמור', exact: true });
    await saveMaterialBtn.click();

    // --- 3. Register a new Employee ---
    await page.getByRole('link', { name: UI_STRINGS.navbar.employeeManagement }).click();
    await page.waitForURL(/\/employees/);

    const addEmployeeBtn = page.getByRole('button', { name: UI_STRINGS.employees.registerNewEmployee });
    await expect(addEmployeeBtn).toBeVisible();
    await addEmployeeBtn.click();

    // Switch to Register New Employee Tab
    await page.getByRole('tab', { name: 'רישום משתמש חדש' }).click();

    // Fill new employee details
    await page.getByLabel('שם משתמש').fill(empUser);
    await page.getByLabel('סיסמה').fill('pass123456');
    await page.getByLabel('שם פרטי').fill('עובד');
    await page.getByLabel('שם משפחה').fill('ראשון');
    await page.getByLabel('תעודת זהות').fill('312345678');
    await page.getByLabel('כתובת אימייל').fill(empEmail);
    await page.getByLabel('טלפון').fill('0502222222');
    await page.getByLabel('כתובת מגורים').fill('רחוב ב');

    // Submit employee registration
    const submitEmployeeBtn = page.getByRole('button', { name: 'רשום עובד' });
    await submitEmployeeBtn.click();

    // Verify employee is in list
    await expect(page.locator('text=עובד ראשון')).toBeVisible();
    await expect(page.locator(`text=${empEmail}`)).toBeVisible();

    // --- 4. Create Recipe with Inline Quick-Add ---
    await page.getByRole('link', { name: 'מתכונים' }).click();
    await page.waitForURL(/\/recipes/);

    const addRecipeBtn = page.getByRole('button', { name: 'מתכון חדש' });
    await expect(addRecipeBtn).toBeVisible();
    await addRecipeBtn.click();

    await page.getByLabel('שם המתכון').fill(recipeName);

    // Type a non-existent raw material
    const materialInput = page.locator('#raw-material-autocomplete-0');
    await materialInput.fill(inlineMaterialName);

    // Click "Create new raw material" button in dropdown
    const inlineCreateBtn = page.getByRole('button', { name: 'צור חומר גלם חדש' });
    await expect(inlineCreateBtn).toBeVisible();
    await inlineCreateBtn.click();

    // Fill category in inline panel and save it
    await page.getByLabel('קטגוריה (אופציונלי)').fill('שומנים');
    await page.getByRole('button', { name: 'שמור', exact: true }).click();

    // Fill volume for the ingredient
    await page.locator('#volume-input-0').fill('250');

    // Save recipe
    const saveRecipeBtn = page.getByRole('button', { name: 'שמור מתכון' });
    await saveRecipeBtn.click();

    // Verify the recipe is listed on the Recipes page
    await expect(page.locator(`text=${recipeName}`)).toBeVisible();
  });
});
