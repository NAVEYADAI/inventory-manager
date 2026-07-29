import { AppDataSource } from '../src/data-source';
import { Client } from 'pg';
import { execSync } from 'child_process';
import * as readline from 'readline';

const SOURCE_URL = 'postgresql://neondb_owner:npg_y40AYDdXVFJb@ep-shiny-haze-a9qrmi5z-pooler.gwc.azure.neon.tech/neondb?sslmode=require&channel_binding=require';
const TARGET_URL = process.env.DATABASE_URL || 'postgresql://neondb_owner:npg_zX0ERa5sDkgF@ep-cool-frog-zacb2285-pooler.c-2.eu-west-2.aws.neon.tech/neondb?sslmode=require&channel_binding=require';

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
  console.log('\x1b[33m%s\x1b[0m', '🚀 DATABASE MIGRATION & FLY.IO DEPLOYMENT SCRIPT 🚀');
  console.log(`Source DB: ${SOURCE_URL.split('@')[1]}`);
  console.log(`Target DB: ${TARGET_URL.split('@')[1]}`);
  console.log(`Fly.io App: inventory-manager-back\n`);
  console.log('\x1b[31m%s\x1b[0m', '⚠️  WARNING: THIS WILL WIPE ALL DATA ON THE TARGET DATABASE BEFORE COPYING FROM SOURCE! ⚠️');

  const confirmed = await askConfirmation('Are you sure you want to run the database migration and update Fly.io? (y/N): ');
  if (!confirmed) {
    console.log('Migration cancelled.');
    process.exit(0);
  }

  // Step 1: Recreate schema and synchronize using TypeORM
  console.log('\n--- Step 1: Recreating schema and synchronizing target database ---');
  try {
    // Drop and recreate public schema on target to start completely fresh
    const cleanClient = new Client({ connectionString: TARGET_URL });
    await cleanClient.connect();
    console.log('Cleaning target database public schema (dropping and recreating)...');
    await cleanClient.query('DROP SCHEMA public CASCADE');
    await cleanClient.query('CREATE SCHEMA public');
    await cleanClient.end();
    console.log('Target database public schema is now clean.');

    // Initialize TypeORM with synchronize: true to build the tables based on entities
    console.log('Initializing TypeORM on target DB and synchronizing schema...');
    (AppDataSource.options as any).synchronize = true;
    await AppDataSource.initialize();
    console.log('Schema synchronized successfully.');
  } catch (error) {
    console.error('Failed to clean and synchronize target database:', error);
    process.exit(1);
  } finally {
    if (AppDataSource.isInitialized) {
      await AppDataSource.destroy();
    }
  }

  // Step 2: Copy Data Table by Table
  console.log('\n--- Step 2: Migrating all data from Source to Target ---');
  const sourceClient = new Client({ connectionString: SOURCE_URL });
  const targetClient = new Client({ connectionString: TARGET_URL });

  try {
    await sourceClient.connect();
    console.log('Connected to Source DB.');
    await targetClient.connect();
    console.log('Connected to Target DB.');

    // If migrations table exists on source, create it on target because synchronize doesn't create it
    const migrationsExistsResult = await sourceClient.query(`
      SELECT EXISTS (
        SELECT FROM pg_tables 
        WHERE schemaname = 'public' 
          AND tablename = 'migrations'
      )
    `);
    const hasMigrationsTable = migrationsExistsResult.rows[0].exists;
    if (hasMigrationsTable) {
      console.log('Creating "migrations" table on target DB...');
      await targetClient.query(`
        CREATE TABLE IF NOT EXISTS "migrations" (
          "id" SERIAL NOT NULL,
          "timestamp" bigint NOT NULL,
          "name" varchar NOT NULL,
          CONSTRAINT "PK_migrations" PRIMARY KEY ("id")
        )
      `);
    }

    // Fetch all foreign key constraints on target
    console.log('Querying foreign keys on target database...');
    const fkResult = await targetClient.query(`
      SELECT
        tc.table_name, 
        tc.constraint_name, 
        kcu.column_name, 
        ccu.table_name AS foreign_table_name,
        ccu.column_name AS foreign_column_name,
        rc.update_rule,
        rc.delete_rule
      FROM 
        information_schema.table_constraints AS tc 
        JOIN information_schema.key_column_usage AS kcu
          ON tc.constraint_name = kcu.constraint_name
          AND tc.table_schema = kcu.table_schema
        JOIN information_schema.constraint_column_usage AS ccu
          ON ccu.constraint_name = tc.constraint_name
          AND ccu.table_schema = tc.table_schema
        JOIN information_schema.referential_constraints AS rc
          ON rc.constraint_name = tc.constraint_name
      WHERE tc.constraint_type = 'FOREIGN KEY' AND tc.table_schema='public';
    `);

    const foreignKeys = fkResult.rows;
    console.log(`Found ${foreignKeys.length} foreign key constraints to drop temporarily.`);

    // Drop all foreign key constraints
    for (const fk of foreignKeys) {
      console.log(`Dropping constraint "${fk.constraint_name}" on table "${fk.table_name}"...`);
      await targetClient.query(`ALTER TABLE "${fk.table_name}" DROP CONSTRAINT "${fk.constraint_name}"`);
    }

    // Fetch all public tables from source
    const tablesResult = await sourceClient.query(`
      SELECT tablename 
      FROM pg_tables 
      WHERE schemaname = 'public' 
        AND tablename NOT LIKE 'spatial_ref_sys'
    `);
    const tables = tablesResult.rows.map((r: any) => r.tablename);
    console.log(`Found ${tables.length} tables to migrate.`);

    for (const table of tables) {
      console.log(`Migrating table: ${table}...`);
      
      // Get all rows from source
      const sourceRows = await sourceClient.query(`SELECT * FROM "${table}"`);
      const rows = sourceRows.rows;
      console.log(`- Read ${rows.length} rows from source.`);

      // Truncate target table
      await targetClient.query(`TRUNCATE TABLE "${table}" CASCADE`);
      console.log(`- Truncated table on target.`);

      if (rows.length === 0) {
        console.log(`- Table "${table}" has no data. Skipping insert.`);
        continue;
      }

      // Perform batch insert to prevent parameter limit violations
      const columns = Object.keys(rows[0]);
      const columnNames = columns.map(c => `"${c}"`).join(', ');
      
      // PostgreSQL max parameter limit is 65535, we set a safe limit of 5000 parameters per batch query
      const maxBatchParams = 5000;
      const batchSize = Math.max(1, Math.floor(maxBatchParams / columns.length));
      
      console.log(`- Inserting rows in batches of ${batchSize} (columns count: ${columns.length})...`);
      
      for (let i = 0; i < rows.length; i += batchSize) {
        const batch = rows.slice(i, i + batchSize);
        const valuePlaceholders: string[] = [];
        const values: any[] = [];
        let placeholderIndex = 1;

        for (const row of batch) {
          const rowPlaceholders = columns.map((col) => {
            values.push(row[col]);
            return `$${placeholderIndex++}`;
          });
          valuePlaceholders.push(`(${rowPlaceholders.join(', ')})`);
        }

        const insertQuery = `
          INSERT INTO "${table}" (${columnNames}) 
          VALUES ${valuePlaceholders.join(', ')}
        `;
        await targetClient.query(insertQuery, values);
      }
      console.log(`- Inserted ${rows.length} rows into "${table}" successfully.`);
    }

    // Recreate all foreign key constraints
    console.log('\nRecreating foreign key constraints on target database...');
    for (const fk of foreignKeys) {
      console.log(`Recreating constraint "${fk.constraint_name}" on table "${fk.table_name}"...`);
      await targetClient.query(`
        ALTER TABLE "${fk.table_name}" 
        ADD CONSTRAINT "${fk.constraint_name}" 
        FOREIGN KEY ("${fk.column_name}") 
        REFERENCES "${fk.foreign_table_name}"("${fk.foreign_column_name}") 
        ON UPDATE ${fk.update_rule} 
        ON DELETE ${fk.delete_rule}
      `);
    }

    // Step 3: Reset serial/sequences values to prevent duplicate key violations later
    console.log('\n--- Step 3: Resetting serial sequences on Target DB ---');
    const sequencesResult = await targetClient.query(`
      SELECT column_name, table_name 
      FROM information_schema.columns 
      WHERE table_schema = 'public' 
        AND column_default LIKE 'nextval%'
    `);
    
    console.log(`Found ${sequencesResult.rows.length} sequences to reset.`);
    for (const seq of sequencesResult.rows) {
      const { column_name, table_name } = seq;
      console.log(`Resetting sequence for "${table_name}"."${column_name}"...`);
      try {
        await targetClient.query(`
          SELECT setval(
            pg_get_serial_sequence('"${table_name}"', '${column_name}'), 
            COALESCE(MAX("${column_name}"), 0) + 1, 
            false
          ) FROM "${table_name}"
        `);
      } catch (seqError: any) {
        console.warn(`Warning: Could not reset sequence for "${table_name}"."${column_name}": ${seqError.message}`);
      }
    }

    console.log('\x1b[32m%s\x1b[0m', '✅ Data migration completed successfully!');
  } catch (error) {
    console.error('Fatal error during data migration:', error);
    process.exit(1);
  } finally {
    await sourceClient.end();
    await targetClient.end();
  }

  // Step 4: Update Fly.io Secrets
  console.log('\n--- Step 4: Updating Fly.io Secret DATABASE_URL ---');
  try {
    console.log('Running: fly secrets set DATABASE_URL="..." --app inventory-manager-back');
    execSync(`fly secrets set DATABASE_URL='${TARGET_URL}' --app inventory-manager-back`, { stdio: 'inherit' });
    console.log('\x1b[32m%s\x1b[0m', '✅ Fly.io secret updated successfully!');
  } catch (flyError: any) {
    console.error('Error updating Fly.io secrets:', flyError.message);
    console.log('\x1b[33m%s\x1b[0m', '⚠️ Please make sure flyctl is logged in and the app name is correct.');
    process.exit(1);
  }

  console.log('\n\x1b[32m%s\x1b[0m', '🎉 All steps completed successfully!');
}

main();
