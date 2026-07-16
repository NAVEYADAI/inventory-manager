import { execSync } from 'child_process';
import * as path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function globalTeardown() {
  console.log('\n🧹 Running E2E global teardown: cleaning test data from database...');
  try {
    const backendPath = path.resolve(__dirname, '../../back');
    execSync('npm run db:clear', {
      cwd: backendPath,
      env: { ...process.env, FORCE_CLEAN: 'true' },
      stdio: 'inherit'
    });
    console.log('✅ E2E global teardown complete: database cleaned.');
  } catch (error) {
    console.error('❌ E2E global teardown failed:', error);
  }
}

export default globalTeardown;
