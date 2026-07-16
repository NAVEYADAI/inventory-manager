import { AppDataSource } from '../src/data-source';
import * as readline from 'readline';

function askConfirmation(question: string): Promise<boolean> {
  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
  });

  return new Promise((resolve) => {
    rl.question(question, (answer) => {
      rl.close();
      resolve(answer.toLowerCase() === 'y' || answer.toLowerCase() === 'yes');
    });
  });
}

async function main() {
  console.log('\x1b[33m%s\x1b[0m', '⚠️  WARNING: This script will delete ONLY E2E and unit test data from the database.');
  console.log('Your manual development users, companies, and configurations will remain untouched.');
  console.log(`Database URL: ${process.env.DATABASE_URL?.split('@')[1] || 'Unknown'}\n`);
  
  const confirmed = process.env.FORCE_CLEAN === 'true' || await askConfirmation('Do you want to clean test data now? (y/N): ');
  if (!confirmed) {
    console.log('Operation cancelled.');
    process.exit(0);
  }

  console.log('Connecting to database...');
  await AppDataSource.initialize();
  console.log('Connected.');

  const queryRunner = AppDataSource.createQueryRunner();
  await queryRunner.connect();
  await queryRunner.startTransaction();

  try {
    const runDelete = async (query: string, name: string) => {
      const res = await queryRunner.query(query);
      const count = Array.isArray(res) ? (res[1] ?? 0) : (res.rowCount ?? 0);
      if (count > 0) {
        console.log(`- Deleted ${count} test ${name} record(s).`);
      }
    };

    console.log('Cleaning up test data...');

    // 1. recipe_product
    await runDelete(`
      DELETE FROM "recipe_product" 
      WHERE "recipeId" IN (
        SELECT r.id FROM "recipe" r 
        JOIN "subscription" s ON r."subscriptionId" = s.id 
        JOIN "company" c ON s."company_id" = c.id
        WHERE c.name LIKE 'חברת נווה\\_%' OR c.name LIKE 'חברה א\\_%' OR c.name LIKE 'חברה ב\\_%' OR c.identifier LIKE 'hp\\_%' OR c.identifier LIKE 'hpa\\_%' OR c.identifier LIKE 'hpb\\_%'
      ) OR "rawMaterialId" IN (
        SELECT rm.id FROM "raw_material" rm 
        JOIN "subscription" s ON rm."subscriptionId" = s.id 
        JOIN "company" c ON s."company_id" = c.id
        WHERE c.name LIKE 'חברת נווה\\_%' OR c.name LIKE 'חברה א\\_%' OR c.name LIKE 'חברה ב\\_%' OR c.identifier LIKE 'hp\\_%' OR c.identifier LIKE 'hpa\\_%' OR c.identifier LIKE 'hpb\\_%'
      )
    `, 'recipe_product');

    // 2. raw_material_conversion
    await runDelete(`
      DELETE FROM "raw_material_conversion" 
      WHERE "rawMaterialId" IN (
        SELECT rm.id FROM "raw_material" rm 
        JOIN "subscription" s ON rm."subscriptionId" = s.id 
        JOIN "company" c ON s."company_id" = c.id
        WHERE c.name LIKE 'חברת נווה\\_%' OR c.name LIKE 'חברה א\\_%' OR c.name LIKE 'חברה ב\\_%' OR c.identifier LIKE 'hp\\_%' OR c.identifier LIKE 'hpa\\_%' OR c.identifier LIKE 'hpb\\_%'
      )
    `, 'raw_material_conversion');

    // 3. invetory
    await runDelete(`
      DELETE FROM "invetory" 
      WHERE "subscriptionId" IN (
        SELECT s.id FROM "subscription" s
        JOIN "company" c ON s."company_id" = c.id
        WHERE c.name LIKE 'חברת נווה\\_%' OR c.name LIKE 'חברה א\\_%' OR c.name LIKE 'חברה ב\\_%' OR c.identifier LIKE 'hp\\_%' OR c.identifier LIKE 'hpa\\_%' OR c.identifier LIKE 'hpb\\_%'
      )
    `, 'inventory');

    // 4. create_product
    await runDelete(`
      DELETE FROM "create_product" 
      WHERE "recipeId" IN (
        SELECT r.id FROM "recipe" r 
        JOIN "subscription" s ON r."subscriptionId" = s.id 
        JOIN "company" c ON s."company_id" = c.id
        WHERE c.name LIKE 'חברת נווה\\_%' OR c.name LIKE 'חברה א\\_%' OR c.name LIKE 'חברה ב\\_%' OR c.identifier LIKE 'hp\\_%' OR c.identifier LIKE 'hpa\\_%' OR c.identifier LIKE 'hpb\\_%'
      )
    `, 'create_product');

    // 5. recipe
    await runDelete(`
      DELETE FROM "recipe" 
      WHERE "subscriptionId" IN (
        SELECT s.id FROM "subscription" s
        JOIN "company" c ON s."company_id" = c.id
        WHERE c.name LIKE 'חברת נווה\\_%' OR c.name LIKE 'חברה א\\_%' OR c.name LIKE 'חברה ב\\_%' OR c.identifier LIKE 'hp\\_%' OR c.identifier LIKE 'hpa\\_%' OR c.identifier LIKE 'hpb\\_%'
      )
    `, 'recipe');

    // 6. raw_material
    await runDelete(`
      DELETE FROM "raw_material" 
      WHERE "subscriptionId" IN (
        SELECT s.id FROM "subscription" s
        JOIN "company" c ON s."company_id" = c.id
        WHERE c.name LIKE 'חברת נווה\\_%' OR c.name LIKE 'חברה א\\_%' OR c.name LIKE 'חברה ב\\_%' OR c.identifier LIKE 'hp\\_%' OR c.identifier LIKE 'hpa\\_%' OR c.identifier LIKE 'hpb\\_%'
      )
    `, 'raw_material');

    // 7. product
    await runDelete(`
      DELETE FROM "product" 
      WHERE "platoonId" IN (
        SELECT p.id FROM "platoon" p 
        JOIN "subscription" s ON p."subscriptionId" = s.id 
        JOIN "company" c ON s."company_id" = c.id
        WHERE c.name LIKE 'חברת נווה\\_%' OR c.name LIKE 'חברה א\\_%' OR c.name LIKE 'חברה ב\\_%' OR c.identifier LIKE 'hp\\_%' OR c.identifier LIKE 'hpa\\_%' OR c.identifier LIKE 'hpb\\_%'
      )
    `, 'product');

    // 8. platoon
    await runDelete(`
      DELETE FROM "platoon" 
      WHERE "subscriptionId" IN (
        SELECT s.id FROM "subscription" s
        JOIN "company" c ON s."company_id" = c.id
        WHERE c.name LIKE 'חברת נווה\\_%' OR c.name LIKE 'חברה א\\_%' OR c.name LIKE 'חברה ב\\_%' OR c.identifier LIKE 'hp\\_%' OR c.identifier LIKE 'hpa\\_%' OR c.identifier LIKE 'hpb\\_%'
      )
    `, 'platoon');

    // 9. tag
    await runDelete(`
      DELETE FROM "tag" 
      WHERE "subscriptionId" IN (
        SELECT s.id FROM "subscription" s
        JOIN "company" c ON s."company_id" = c.id
        WHERE c.name LIKE 'חברת נווה\\_%' OR c.name LIKE 'חברה א\\_%' OR c.name LIKE 'חברה ב\\_%' OR c.identifier LIKE 'hp\\_%' OR c.identifier LIKE 'hpa\\_%' OR c.identifier LIKE 'hpb\\_%'
      )
    `, 'tag');

    // 10. user_permission
    await runDelete(`
      DELETE FROM "user_permission" 
      WHERE "companyId" IN (
        SELECT id FROM "company" 
        WHERE name LIKE 'חברת נווה\\_%' OR name LIKE 'חברה א\\_%' OR name LIKE 'חברה ב\\_%' OR identifier LIKE 'hp\\_%' OR identifier LIKE 'hpa\\_%' OR identifier LIKE 'hpb\\_%'
      ) OR "userId" IN (
        SELECT id FROM "user" 
        WHERE name LIKE 'user\\_%' OR name LIKE 'usera\\_%' OR name LIKE 'userb\\_%' OR name LIKE 'employee\\_%'
      )
    `, 'user_permission');

    // 11. user_subscriptions
    await runDelete(`
      DELETE FROM "user_subscriptions" 
      WHERE "subscriptionId" IN (
        SELECT s.id FROM "subscription" s
        JOIN "company" c ON s."company_id" = c.id
        WHERE c.name LIKE 'חברת נווה\\_%' OR c.name LIKE 'חברה א\\_%' OR c.name LIKE 'חברה ב\\_%' OR c.identifier LIKE 'hp\\_%' OR c.identifier LIKE 'hpa\\_%' OR c.identifier LIKE 'hpb\\_%'
      ) OR "userId" IN (
        SELECT id FROM "user" 
        WHERE name LIKE 'user\\_%' OR name LIKE 'usera\\_%' OR name LIKE 'userb\\_%' OR name LIKE 'employee\\_%'
      )
    `, 'user_subscriptions');

    // 12. activity_log
    await runDelete(`
      DELETE FROM "activity_log" 
      WHERE "subscriptionId" IN (
        SELECT s.id FROM "subscription" s
        JOIN "company" c ON s."company_id" = c.id
        WHERE c.name LIKE 'חברת נווה\\_%' OR c.name LIKE 'חברה א\\_%' OR c.name LIKE 'חברה ב\\_%' OR c.identifier LIKE 'hp\\_%' OR c.identifier LIKE 'hpa\\_%' OR c.identifier LIKE 'hpb\\_%'
      ) OR "userId" IN (
        SELECT id FROM "user" 
        WHERE name LIKE 'user\\_%' OR name LIKE 'usera\\_%' OR name LIKE 'userb\\_%' OR name LIKE 'employee\\_%'
      )
    `, 'activity_log');

    // 14. subscription
    await runDelete(`
      DELETE FROM "subscription" 
      WHERE "company_id" IN (
        SELECT id FROM "company" 
        WHERE name LIKE 'חברת נווה\\_%' OR name LIKE 'חברה א\\_%' OR name LIKE 'חברה ב\\_%' OR identifier LIKE 'hp\\_%' OR identifier LIKE 'hpa\\_%' OR identifier LIKE 'hpb\\_%'
      )
    `, 'subscription');

    // 15. company
    await runDelete(`
      DELETE FROM "company" 
      WHERE name LIKE 'חברת נווה\\_%' OR name LIKE 'חברה א\\_%' OR name LIKE 'חברה ב\\_%' OR identifier LIKE 'hp\\_%' OR identifier LIKE 'hpa\\_%' OR identifier LIKE 'hpb\\_%'
    `, 'company');

    // 16. password
    await runDelete(`
      DELETE FROM "password" 
      WHERE "userId" IN (
        SELECT id FROM "user" 
        WHERE name LIKE 'user\\_%' OR name LIKE 'usera\\_%' OR name LIKE 'userb\\_%' OR name LIKE 'employee\\_%'
      )
    `, 'password');

    // 17. user
    await runDelete(`
      DELETE FROM "user" 
      WHERE name LIKE 'user\\_%' OR name LIKE 'usera\\_%' OR name LIKE 'userb\\_%' OR name LIKE 'employee\\_%'
    `, 'user');

    await queryRunner.commitTransaction();
    console.log('\x1b[32m%s\x1b[0m', '✅ Test data cleaned successfully!');
  } catch (error) {
    console.error('Failed to clean test data, rolling back changes:', error);
    await queryRunner.rollbackTransaction();
  } finally {
    await queryRunner.release();
    await AppDataSource.destroy();
  }
}

main();
