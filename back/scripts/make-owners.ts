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

    // 1. Alter the ENUM type in PostgreSQL to include 'owner' if it doesn't exist
    const enumCheck = await client.query(`
      SELECT enumlabel 
      FROM pg_enum 
      WHERE enumtypid = 'user_permission_role_enum'::regtype AND enumlabel = 'owner'
    `);

    if (enumCheck.rows.length === 0) {
      console.log("Adding 'owner' value to user_permission_role_enum...");
      await client.query("ALTER TYPE user_permission_role_enum ADD VALUE 'owner'");
      console.log("Added 'owner' value to user_permission_role_enum successfully.");
    } else {
      console.log("'owner' value already exists in user_permission_role_enum.");
    }

    // 2. For each company, find the user with the lowest user_permission ID and set their role to 'owner'
    const companiesRes = await client.query('SELECT id FROM "company"');
    console.log(`Found ${companiesRes.rows.length} companies.`);

    for (const company of companiesRes.rows) {
      const companyId = company.id;
      // Find the lowest user_permission ID for this company
      const minPermRes = await client.query(
        'SELECT id, "userId" FROM "user_permission" WHERE "companyId" = $1 ORDER BY id ASC LIMIT 1',
        [companyId]
      );

      if (minPermRes.rows.length > 0) {
        const { id: permId, userId } = minPermRes.rows[0];
        await client.query(
          'UPDATE "user_permission" SET role = \'owner\' WHERE id = $1',
          [permId]
        );
        console.log(`Promoted user ID ${userId} in company ID ${companyId} (permission ID ${permId}) to 'owner'.`);
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
