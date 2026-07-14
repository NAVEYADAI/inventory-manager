const { exec } = require('child_process');
const fs = require('fs');
const path = require('path');

const colors = {
  green: '\x1b[32m',
  red: '\x1b[31m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  cyan: '\x1b[36m',
  magenta: '\x1b[35m',
  bold: '\x1b[1m',
  reset: '\x1b[0m'
};

const os = require('os');

const paths = {
  jest: path.join(__dirname, '.test-results', 'jest-results.json'),
  vitest: path.join(__dirname, '.test-results', 'vitest-results.json'),
  playwright: path.join(__dirname, '.test-results', 'playwright-results.json')
};

function ensureDir() {
  const dir = path.join(__dirname, '.test-results');
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
}

// Cleanup old results
function cleanup() {
  const dir = path.join(__dirname, '.test-results');
  if (fs.existsSync(dir)) {
    try {
      fs.rmSync(dir, { recursive: true, force: true });
    } catch (e) {}
  }
  ensureDir();
}

// Helper to run shell command with inline spinner
function runTask(name, command, cwd) {
  return new Promise((resolve) => {
    const spinner = ['⠋', '⠙', '⠹', '⠸', '⠼', '⠴', '⠦', '⠧', '⠇', '⠏'];
    let spinnerIndex = 0;
    
    process.stdout.write(`  ${colors.cyan}${spinner[0]}${colors.reset} ${name}...`);
    
    const interval = setInterval(() => {
      spinnerIndex = (spinnerIndex + 1) % spinner.length;
      process.stdout.write(`\r  ${colors.cyan}${spinner[spinnerIndex]}${colors.reset} ${name}...`);
    }, 80);

    exec(command, { cwd }, (error, stdout, stderr) => {
      clearInterval(interval);
      if (error) {
        process.stdout.write(`\r  ${colors.red}✗${colors.reset} ${name} ${colors.red}[Failed]${colors.reset}\n`);
        resolve({ success: false, stdout, stderr, error });
      } else {
        process.stdout.write(`\r  ${colors.green}✓${colors.reset} ${name} ${colors.green}[Done]${colors.reset}\n`);
        resolve({ success: true, stdout, stderr });
      }
    });
  });
}

async function main() {
  cleanup();
  
  console.log(`\n${colors.bold}${colors.magenta}🧪 Unified Test Runner - Inventory Manager${colors.reset}\n`);
  
  // ==========================================
  // PHASE 1: Backend Tests (Jest)
  // ==========================================
  console.log(`${colors.bold}[1/3] Backend Unit & Integration Tests (NestJS / Jest)${colors.reset}`);
  
  const backTypecheck = await runTask('Typechecking backend code', 'npx tsc --noEmit', path.join(__dirname, 'back'));
  if (!backTypecheck.success) {
    console.error(`\n${colors.red}Typecheck failed on backend:${colors.reset}\n${backTypecheck.stderr || backTypecheck.stdout}`);
    process.exit(1);
  }
  
  const backTest = await runTask('Running Jest test suite', `npx jest --json --outputFile=${paths.jest}`, path.join(__dirname, 'back'));
  if (!backTest.success && !fs.existsSync(paths.jest)) {
    console.error(`\n${colors.red}Jest failed to execute:${colors.reset}\n${backTest.stderr || backTest.stdout}\n`);
  } else if (!backTest.success) {
    console.log(`\n${colors.yellow}Some backend tests failed. Details will be shown in the summary.${colors.reset}\n`);
  }
  
  // ==========================================
  // PHASE 2: Frontend Unit Tests (Vitest)
  // ==========================================
  console.log(`\n${colors.bold}[2/3] Frontend Unit & Component Tests (React / Vitest)${colors.reset}`);
  
  const frontTypecheck = await runTask('Typechecking frontend code', 'npx tsc --noEmit', path.join(__dirname, 'front'));
  if (!frontTypecheck.success) {
    console.error(`\n${colors.red}Typecheck failed on frontend:${colors.reset}\n${frontTypecheck.stderr || frontTypecheck.stdout}`);
    process.exit(1);
  }
  
  const frontTest = await runTask('Running Vitest test suite', `npx vitest run --reporter=json --outputFile=${paths.vitest}`, path.join(__dirname, 'front'));
  if (!frontTest.success && !fs.existsSync(paths.vitest)) {
    console.error(`\n${colors.red}Vitest failed to execute:${colors.reset}\n${frontTest.stderr || frontTest.stdout}\n`);
  } else if (!frontTest.success) {
    console.log(`\n${colors.yellow}Some frontend tests failed. Details will be shown in the summary.${colors.reset}\n`);
  }
  
  // ==========================================
  // PHASE 3: Frontend E2E Tests (Playwright)
  // ==========================================
  console.log(`\n${colors.bold}[3/3] Frontend End-to-End Tests (Playwright)${colors.reset}`);
  console.log(`      ${colors.yellow}Note: This automatically starts frontend & backend dev servers if needed.${colors.reset}`);
  
  const e2eTest = await runTask('Running Playwright E2E suite', 'npx playwright test --reporter=json', path.join(__dirname, 'front'));


  if (e2eTest.stdout) {
    try {
      fs.writeFileSync(paths.playwright, e2eTest.stdout, 'utf8');
    } catch (e) {
      console.error('Failed to write Playwright report to disk:', e);
    }
  }
  if (!e2eTest.success) {
    console.error(`\n${colors.red}Playwright failed to execute:${colors.reset}\n${e2eTest.stderr || e2eTest.stdout || 'No stdout/stderr recorded.'}\n`);
  }


  // ==========================================
  // Parse Results & Print Summary Dashboard
  // ==========================================
  console.log(`\n==================================================`);
  console.log(`${colors.bold}📊 Unified Test Summary${colors.reset}`);
  console.log(`==================================================`);
  
  let totalPassed = 0;
  let totalFailed = 0;
  let totalTests = 0;
  let allSuccessful = true;

  // 1. Jest Results
  let jestSummary = `${colors.red}✗ Jest: Failed to run or produce report${colors.reset}`;
  if (fs.existsSync(paths.jest)) {
    try {
      const data = JSON.parse(fs.readFileSync(paths.jest, 'utf8'));
      const passed = data.numPassedTests || 0;
      const failed = data.numFailedTests || 0;
      const total = data.numTotalTests || 0;
      
      totalPassed += passed;
      totalFailed += failed;
      totalTests += total;
      
      if (failed > 0 || !data.success || !backTest.success) {
        allSuccessful = false;
        jestSummary = `${colors.red}✗ Backend (Jest):      ${passed}/${total} passed (${failed} failed)${colors.reset}`;
      } else {
        jestSummary = `${colors.green}✓ Backend (Jest):      ${passed}/${total} passed (100% success)${colors.reset}`;
      }
    } catch (e) {
      allSuccessful = false;
    }
  } else {
    allSuccessful = false;
  }
  console.log(jestSummary);

  // 2. Vitest Results
  let vitestSummary = `${colors.red}✗ Vitest: Failed to run or produce report${colors.reset}`;
  if (fs.existsSync(paths.vitest)) {
    try {
      const data = JSON.parse(fs.readFileSync(paths.vitest, 'utf8'));
      const passed = data.numPassedTests || 0;
      const failed = data.numFailedTests || 0;
      const total = data.numTotalTests || 0;
      
      totalPassed += passed;
      totalFailed += failed;
      totalTests += total;
      
      if (failed > 0 || !data.success || !frontTest.success) {
        allSuccessful = false;
        vitestSummary = `${colors.red}✗ Frontend (Vitest):   ${passed}/${total} passed (${failed} failed)${colors.reset}`;
      } else {
        vitestSummary = `${colors.green}✓ Frontend (Vitest):   ${passed}/${total} passed (100% success)${colors.reset}`;
      }
    } catch (e) {
      allSuccessful = false;
    }
  } else {
    allSuccessful = false;
  }
  console.log(vitestSummary);

  // 3. Playwright E2E Results
  let playwrightSummary = `${colors.red}✗ Playwright: Failed to run or produce report${colors.reset}`;
  if (fs.existsSync(paths.playwright)) {
    try {
      const rawData = fs.readFileSync(paths.playwright, 'utf8');
      // Sometimes there is warning output before the JSON, let's extract the actual JSON block
      const jsonStart = rawData.indexOf('{');
      const data = JSON.parse(rawData.substring(jsonStart));
      
      const stats = data.stats || {};
      const passed = stats.expected || 0;
      const failed = stats.unexpected || 0;
      const total = (stats.expected || 0) + (stats.unexpected || 0) + (stats.skipped || 0) + (stats.flaky || 0);
      
      totalPassed += passed;
      totalFailed += failed;
      totalTests += total;
      
      if (failed > 0 || !e2eTest.success) {
        allSuccessful = false;
        playwrightSummary = `${colors.red}✗ E2E (Playwright):    ${passed}/${total} passed (${failed} failed / run failed)${colors.reset}`;
      } else {
        playwrightSummary = `${colors.green}✓ E2E (Playwright):    ${passed}/${total} passed (100% success)${colors.reset}`;
      }
    } catch (e) {
      allSuccessful = false;
    }
  } else {
    allSuccessful = false;
  }
  console.log(playwrightSummary);

  console.log(`--------------------------------------------------`);
  
  if (allSuccessful && totalTests > 0) {
    console.log(`${colors.green}${colors.bold}🎉 Success! All ${totalTests} tests passed successfully! (100% success)${colors.reset}`);
  } else {
    console.log(`${colors.red}${colors.bold}✗ Failed! ${totalFailed} out of ${totalTests} tests failed.${colors.reset}`);
  }
  console.log(`==================================================\n`);

  // Detailed failures output
  if (!allSuccessful) {
    console.log(`==================================================`);
    console.log(`${colors.red}${colors.bold}❌ Detailed Test Failures:${colors.reset}`);
    console.log(`==================================================`);
    
    if (!backTest.success) {
      console.log(`\n${colors.red}${colors.bold}--- Backend (Jest) Failures ---${colors.reset}`);
      // Jest outputs the failing test details to stderr when running in json mode
      console.log(backTest.stderr || backTest.stdout || 'No failure output recorded.');
    }
    
    if (!frontTest.success) {
      console.log(`\n${colors.red}${colors.bold}--- Frontend (Vitest) Failures ---${colors.reset}`);
      // Vitest writes failures to stdout
      console.log(frontTest.stdout || frontTest.stderr || 'No failure output recorded.');
    }
    
    if (!e2eTest.success) {
      console.log(`\n${colors.red}${colors.bold}--- E2E (Playwright) Failures ---${colors.reset}`);
      // Playwright writes standard failures to stdout/stderr.
      // If output was redirected, let's read the playwright results file or stdout.
      console.log(e2eTest.stdout || e2eTest.stderr || 'No failure output recorded.');
    }
    console.log(`==================================================\n`);
  }


  cleanup();

  if (allSuccessful && totalTests > 0) {
    process.exit(0);
  } else {
    process.exit(1);
  }
}

main().catch((err) => {
  console.error(err);
  cleanup();
  process.exit(1);
});
