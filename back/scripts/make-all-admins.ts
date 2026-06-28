import { Client } from 'pg';
import * as fs from 'fs';
import * as path from 'path';

// Parse .env manually to avoid extra dependencies
const envPath = path.join(__dirname, '../.env');
if (fs.existsSync(envPath)) {
  const envFile = fs.readFileSync(envPath, 'utf8');
  for (const line of envFile.split('\n')) {
    const parts = line.split('=');
    if (parts.length >= 2) {
      const key = parts[0].trim();
      let val = parts.slice(1).join('=').trim();
      if (val.startsWith("'") && val.endsWith("'")) {
        val = val.substring(1, val.length - 1);
      }
      if (val.startsWith('"') && val.endsWith('"')) {
        val = val.substring(1, val.length - 1);
      }
      process.env[key] = val;
    }
  }
}

const connectionString = process.env.DATABASE_URL;

async function run() {
  if (!connectionString) {
    console.error('DATABASE_URL is not set in .env');
    process.exit(1);
  }

  const client = new Client({
    connectionString,
    ssl: {
      rejectUnauthorized: false
    }
  });

  try {
    await client.connect();
    console.log('Connected to Neon PostgreSQL database.');

    // 1. Get all user-subscription links
    const res = await client.query(`
      SELECT us."userId", s."company_id" as "companyId"
      FROM "user_subscriptions" us
      JOIN "subscription" s ON us."subscriptionId" = s.id
    `);

    console.log(`Found ${res.rows.length} user-subscription connections.`);

    for (const row of res.rows) {
      const { userId, companyId } = row;
      if (!userId || !companyId) continue;
      
      // Check if permission already exists
      const permRes = await client.query(
        'SELECT id FROM "user_permission" WHERE "userId" = $1 AND "companyId" = $2',
        [userId, companyId]
      );

      if (permRes.rows.length > 0) {
        // Update to admin
        await client.query(
          'UPDATE "user_permission" SET role = \'admin\' WHERE "userId" = $1 AND "companyId" = $2',
          [userId, companyId]
        );
        console.log(`Updated user ID ${userId} in company ID ${companyId} to role 'admin'.`);
      } else {
        // Insert as admin
        await client.query(
          'INSERT INTO "user_permission" ("userId", "companyId", role) VALUES ($1, $2, \'admin\')',
          [userId, companyId]
        );
        console.log(`Inserted user ID ${userId} in company ID ${companyId} with role 'admin'.`);
      }
    }

    console.log('Database script completed successfully.');
  } catch (error) {
    console.error('Error running database script:', error);
  } finally {
    await client.end();
  }
}

run();
