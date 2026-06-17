import { test, expect, type Page } from '@playwright/test';

// All 21 migrated tool slugs. Smoke goal: each page loads, renders its preserved island,
// and throws no uncaught page errors (catches set:html/scope/JS-wiring regressions).
const TOOL_SLUGS = [
  'advance-epoch-converter', 'ai-beauty-test', 'ai-love-calculator', 'all-in-one-text-analyzer',
  'basic-authentication-header-generator', 'free-online-image-utility-tool', 'grade-calculator',
  'guess-the-logo', 'happy-new-year', 'iphone-photo-fixer', 'json-comparison-tool',
  'json-visualizer-pro', 'jwt-debugger', 'markdown-to-word', 'mh-meter-price-calculator',
  'next-gen-gst-reforms', 'online-text-compare', 'px-to-rem-converter', 'rem-to-px-converter',
  'screen-recorder-pro', 'subtitle-resync-tool', 'vtf-converter',
];

function trackErrors(page: Page): string[] {
  const errors: string[] = [];
  page.on('pageerror', (e) => errors.push(e.message));
  return errors;
}

for (const slug of TOOL_SLUGS) {
  test(`tool loads without errors: ${slug}`, async ({ page }) => {
    const errors = trackErrors(page);
    await page.goto(`/tools/${slug}/`);
    // shell header present (MD3 chrome rendered)
    await expect(page.locator('.site-header')).toBeVisible();
    // preserved tool island present with content
    const island = page.locator(`#tool-${slug}`);
    await expect(island).toHaveCount(1);
    await page.waitForTimeout(400); // let inline JS run
    expect(errors, `page errors on ${slug}: ${errors.join(' | ')}`).toEqual([]);
  });
}

// ---- targeted interaction checks for representative tools ----
test('px-to-rem converts 16px -> 1rem and updates on input', async ({ page }) => {
  await page.goto('/tools/px-to-rem-converter/');
  await expect(page.locator('#result-value')).toHaveText('1rem');
  await page.fill('#px-input', '32');
  await expect(page.locator('#result-value')).toHaveText('2rem');
});

test('all-in-one-text-analyzer counts words/chars', async ({ page }) => {
  await page.goto('/tools/all-in-one-text-analyzer/');
  await page.fill('#textInput', 'Hello world this is a test');
  await expect(page.locator('#wordCount')).toHaveText('6');
});

test('mh-meter computes a fare', async ({ page }) => {
  await page.goto('/tools/mh-meter-price-calculator/');
  await page.selectOption('#vehicleType', { index: 1 });
  await page.fill('#distance', '10');
  await page.locator('#fareForm button[type="submit"]').click();
  await expect(page.locator('body')).toContainText('Total Pay');
});

test('homepage search filters tool cards', async ({ page }) => {
  await page.goto('/');
  const total = await page.locator('.tool-card').count();
  expect(total).toBeGreaterThan(10);
  await page.fill('#tool-search-input', 'json');
  await expect(page.locator('.tool-card:visible').first()).toBeVisible();
  expect(await page.locator('.tool-card:visible').count()).toBeLessThan(total);
});

test('jwt-debugger decodes sample token on button click', async ({ page }) => {
  await page.goto('/tools/jwt-debugger/');
  await page.click('#btnPasteSample');
  await expect(page.locator('#headerOutput')).toContainText('HS256');
  await expect(page.locator('#payloadOutput')).toContainText('John Doe');
});

