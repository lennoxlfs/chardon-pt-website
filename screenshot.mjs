import { execSync } from 'child_process';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const screenshotDir = path.join(__dirname, 'temporary screenshots');

if (!fs.existsSync(screenshotDir)) {
  fs.mkdirSync(screenshotDir, { recursive: true });
}

const url = process.argv[2] || 'http://localhost:3000';
const label = process.argv[3] || '';

const existing = fs.readdirSync(screenshotDir).filter(f => f.startsWith('screenshot-'));
const nextNum = existing.length > 0
  ? Math.max(...existing.map(f => parseInt(f.match(/screenshot-(\d+)/)?.[1] || '0'))) + 1
  : 1;

const filename = label
  ? `screenshot-${nextNum}-${label}.png`
  : `screenshot-${nextNum}.png`;

const outputPath = path.join(screenshotDir, filename);

try {
  execSync(
    `/Applications/Google\\ Chrome.app/Contents/MacOS/Google\\ Chrome ` +
    `--headless --disable-gpu --screenshot="${outputPath}" ` +
    `--window-size=1440,900 --hide-scrollbars "${url}"`,
    { stdio: 'pipe' }
  );
  console.log(`Screenshot saved: ${outputPath}`);
} catch (e) {
  console.error('Chrome headless failed, trying with different path...');
  try {
    execSync(
      `"/Applications/Google Chrome.app/Contents/MacOS/Google Chrome" ` +
      `--headless --disable-gpu --screenshot="${outputPath}" ` +
      `--window-size=1440,900 --hide-scrollbars "${url}"`,
      { stdio: 'pipe' }
    );
    console.log(`Screenshot saved: ${outputPath}`);
  } catch (e2) {
    console.error('Screenshot failed. Ensure Chrome is installed.');
    process.exit(1);
  }
}
